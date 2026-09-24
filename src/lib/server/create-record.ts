import 'server-only';

import {
  TerminVergebenFehler,
  getAppointments,
  getCollection,
  getSettings,
  updateRecord,
  vorgangAnlegen,
  vorgangDateienSetzen,
  type TerminSperre,
} from '@/lib/data';
import { createPayment, sendMail, storageStatus } from '@/lib/integrations';
import { quoteCarKeyService } from '@/lib/pricing';
import { buildRecordId } from '@/lib/reference';
import { availableSlots, toIsoDate } from '@/lib/scheduling';
import type {
  AppointmentInfo,
  AreaKey,
  BlockedDay,
  BusinessRecord,
  ContactDetails,
  KeyKind,
  OrderLine,
  OrderTotals,
  PriceQuote,
  ProcessKind,
  RecordKind,
  Settings,
  SummarySection,
  TimeSlot,
  UploadRef,
} from '@/lib/types';

import { createAccessToken } from './access-token';

/**
 * Eingabe für einen Vorgang, die bereits geprüft ist.
 *
 * Nur serverseitiger Code darf diese Funktion aufrufen. Aus dem Browser
 * kommende Daten laufen vorher durch die öffentlichen Aktionen in
 * `src/lib/actions/*`, die Beträge und Termine selbst herleiten.
 */
export interface TrustedRecordInput {
  kind: RecordKind;
  area: AreaKey;
  process: ProcessKind;
  contact: ContactDetails;
  payload: Record<string, unknown>;
  summary: SummarySection[];
  uploads: Array<Omit<UploadRef, 'id' | 'uploadedAt'>>;
  quote?: PriceQuote;
  appointment?: AppointmentInfo;
  payment?: { scope: 'anzahlung' | 'gesamt'; amountCents: number; description: string };
  /** Nur bei Bestellungen: vom Server berechnete Positionen und Summen zum Festschreiben. */
  lines?: OrderLine[];
  totals?: OrderTotals;
}

export interface CreateRecordResult {
  ok: boolean;
  reference?: string;
  recordId?: string;
  /** Geheimer Link-Schlüssel — nur an die Bestellbestätigung weitergeben. */
  accessToken?: string;
  redirectUrl?: string;
  notices: string[];
  error?: string;
}

const GENERIC_ERROR =
  'Der Vorgang konnte gerade nicht gespeichert werden. Bitte versuchen Sie es in einigen Minuten erneut.';

const SLOT_TAKEN =
  'Der gewählte Termin ist inzwischen nicht mehr frei. Bitte wählen Sie ein anderes '
  + 'Zeitfenster aus.';

const PAYMENT_NOT_STARTED =
  'Die Online-Zahlung konnte gerade nicht gestartet werden. Ihr Vorgang ist gespeichert; '
  + 'wir melden uns mit den Zahlungsinformationen.';

type PaymentRequest = NonNullable<TrustedRecordInput['payment']>;

export async function createRecord(input: TrustedRecordInput): Promise<CreateRecordResult> {
  const notices: string[] = [];
  const now = new Date();
  const timestamp = now.toISOString();
  const { token, hash } = createAccessToken();

  let settings: Settings;
  let saved: BusinessRecord;

  try {
    settings = await getSettings();
    const termin = input.appointment
      ? await slotLock(input.appointment, input.quote, settings)
      : undefined;

    // Nummer, Terminprüfung und Vorgang in einem Zug: Scheitert etwas, bleibt
    // keine Nummer verbraucht und kein Termin doppelt vergeben.
    saved = await vorgangAnlegen({
      art: input.kind,
      jahr: now.getFullYear(),
      termin,
      aufbauen: (reference) => ({
        area: input.area,
        process: input.process,
        status: 'neu',
        createdAt: timestamp,
        updatedAt: timestamp,
        contact: input.contact,
        payload: input.payload,
        summary: input.summary,
        // Kennung und Einmal-Schlüssel erst nach der Zuordnung übernehmen —
        // der Schlüssel wird nie gespeichert.
        uploads: input.uploads.map((upload, index) => ({
          fileName: upload.fileName,
          sizeBytes: upload.sizeBytes,
          mimeType: upload.mimeType,
          category: upload.category,
          id: `${buildRecordId(reference)}-datei-${index + 1}`,
          uploadedAt: timestamp,
        })),
        quote: input.quote,
        appointment: input.appointment,
        // Offen, bis der Zahlungsdienstleister etwas anderes meldet.
        payment: input.payment
          ? { scope: input.payment.scope, amountCents: input.payment.amountCents, status: 'offen' }
          : undefined,
        internalNotes: [],
        timeline: [{ at: timestamp, actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
        accessTokenHash: hash,
        lines: input.lines,
        totals: input.totals,
      }),
    });
  } catch (error) {
    if (error instanceof TerminVergebenFehler) {
      return { ok: false, notices, error: SLOT_TAKEN };
    }
    console.error('[vorgang] Speichern fehlgeschlagen', error);
    return { ok: false, notices, error: GENERIC_ERROR };
  }

  // Ab hier ist der Vorgang gespeichert. Was jetzt scheitert, wird als Hinweis
  // gemeldet, nicht als Fehler — sonst bestellt der Kunde ein zweites Mal.

  if (input.uploads.length > 0) {
    saved = await dateienZuordnen(saved, input.uploads, notices);
  }

  const redirectUrl = input.payment
    ? await startPayment(saved, input.payment, token, notices)
    : undefined;

  await sendConfirmation(saved, input.contact, settings, notices);

  return {
    ok: true,
    reference: saved.reference,
    recordId: saved.id,
    accessToken: token,
    redirectUrl,
    notices,
  };
}

/**
 * Startet die Zahlung erst nach dem Speichern: Rücksprungadresse und Verweis
 * brauchen die endgültige Kennung aus der Datenbank, und kein Zahlungsdienst
 * hält eine Datenbanksperre offen.
 */
async function startPayment(
  saved: BusinessRecord,
  payment: PaymentRequest,
  token: string,
  notices: string[],
): Promise<string | undefined> {
  const at = new Date().toISOString();
  let redirectUrl: string | undefined;
  let patch: Pick<BusinessRecord, 'payment' | 'timeline'>;

  try {
    const result = await createPayment({
      recordId: saved.id,
      amountCents: payment.amountCents,
      scope: payment.scope,
      description: payment.description,
      returnUrl: `/bestellung/${saved.id}?t=${token}`,
    });
    redirectUrl = result.redirectUrl;
    patch = {
      payment: {
        scope: payment.scope,
        amountCents: payment.amountCents,
        status: result.status,
        providerRef: result.providerRef,
      },
      timeline: saved.timeline,
    };
    if (result.status === 'offen') {
      notices.push(result.message);
      patch.timeline = [
        ...saved.timeline,
        { at, actor: 'system', message: 'Zahlung offen: kein Zahlungsdienstleister angebunden.' },
      ];
    }
  } catch (error) {
    console.error('[vorgang] Zahlung nicht gestartet', error);
    notices.push(PAYMENT_NOT_STARTED);
    patch = {
      payment: saved.payment,
      timeline: [...saved.timeline, { at, actor: 'system', message: 'Zahlung konnte nicht gestartet werden.' }],
    };
  }

  try {
    await updateRecord(saved.id, patch);
  } catch (error) {
    console.error('[vorgang] Zahlungsstand nicht gespeichert', error);
  }
  return redirectUrl;
}

async function sendConfirmation(
  saved: BusinessRecord,
  contact: ContactDetails,
  settings: Settings,
  notices: string[],
) {
  try {
    const mail = await sendMail({
      to: contact.email,
      subject: `Ihr Vorgang ${saved.reference} bei SCHLÜSSELMACHER24`,
      body:
        `Guten Tag ${contact.firstName} ${contact.lastName},\n\n`
        + `wir haben Ihren Vorgang unter der Nummer ${saved.reference} aufgenommen.\n`
        + `Sie können den Stand jederzeit unter /service-und-termin/terminstatus abrufen.\n\n`
        + `${settings.company.brandName}`,
      recordId: saved.id,
    });
    if (!mail.sent) {
      notices.push(
        'Eine automatische Bestätigung per E-Mail ist noch nicht eingerichtet. '
          + 'Notieren Sie sich bitte Ihre Vorgangsnummer.',
      );
    }
  } catch (error) {
    console.error('[vorgang] Bestätigung nicht versendet', error);
    notices.push(
      'Die Bestätigung per E-Mail konnte gerade nicht versendet werden. '
        + 'Notieren Sie sich bitte Ihre Vorgangsnummer.',
    );
  }
}

/* ---------- Termine ------------------------------------------------------ */

/**
 * Das gewünschte Zeitfenster, falls es nach Öffnungszeiten, Sperrtagen,
 * Vorlauf und bestehenden Terminen buchbar ist.
 */
function freeSlot(args: {
  settings: Settings;
  blocked: BlockedDay[];
  existing: BusinessRecord[];
  durationMinutes: number;
  leadTimeDays?: number;
  date: string;
  time: string;
}): TimeSlot | undefined {
  return availableSlots({
    today: toIsoDate(new Date()),
    durationMinutes: args.durationMinutes,
    leadTimeDays: args.leadTimeDays,
    booking: args.settings.booking,
    openingHours: args.settings.openingHours,
    blockedDays: args.blocked,
    existing: args.existing,
  }).find((slot) => slot.date === args.date && slot.time === args.time && slot.available);
}

/** Prüfung, die beim Anlegen unter der Tagessperre mit frisch gelesenen Terminen läuft. */
async function slotLock(
  appointment: AppointmentInfo,
  quote: PriceQuote | undefined,
  settings: Settings,
): Promise<TerminSperre> {
  const blocked = await getCollection('blockedDays');
  return {
    datum: appointment.date,
    istFrei: (existing) =>
      freeSlot({
        settings,
        blocked,
        existing,
        durationMinutes: appointment.durationMinutes,
        leadTimeDays: quote?.leadTimeDays,
        date: appointment.date,
        time: appointment.time,
      }) !== undefined,
  };
}

/* ---------- Serverseitige Prüfung für Autoschlüssel-Termine -------------- */

export interface CarKeyVerifyInput {
  makeSlug: string;
  modelSlug?: string | null;
  serviceId: string;
  keyKind: KeyKind;
  workingKeys: number;
}

export type VerifyResult =
  | { ok: true; quote: PriceQuote; appointment?: AppointmentInfo }
  | { ok: false; error: string };

/**
 * Leitet Preis, Anzahlung und Terminlänge aus den Stammdaten her und prüft,
 * ob das gewählte Zeitfenster noch frei ist. So kann ein manipulierter
 * Browser weder den Preis noch einen belegten Termin setzen.
 *
 * Diese Prüfung ist eine Vorabprüfung für eine schnelle Rückmeldung.
 * Verbindlich prüft `createRecord` beim Anlegen noch einmal unter Sperre.
 */
export async function verifyCarKeyBooking(
  input: CarKeyVerifyInput,
  requested: { date: string; time: string } | undefined,
): Promise<VerifyResult> {
  const [settings, makes, services, rules, blocked, existing] = await Promise.all([
    getSettings(),
    getCollection('vehicleMakes'),
    getCollection('carKeyServices'),
    getCollection('pricingRules'),
    getCollection('blockedDays'),
    requested ? getAppointments(requested.date, requested.date) : Promise.resolve([]),
  ]);

  const make = makes.find((m) => m.slug === input.makeSlug);
  if (!make) {
    return { ok: false, error: 'Die gewählte Fahrzeugmarke ist nicht mehr hinterlegt.' };
  }

  const model = input.modelSlug
    ? make.models.find((m) => m.slug === input.modelSlug) ?? null
    : null;

  const service = services.find((s) => s.id === input.serviceId && s.active);
  if (!service) {
    return { ok: false, error: 'Die gewählte Leistung wird derzeit nicht angeboten.' };
  }

  const quote = quoteCarKeyService(
    {
      make,
      model,
      service,
      keyKind: input.keyKind,
      workingKeys: Math.max(0, Math.trunc(input.workingKeys)),
    },
    rules,
    settings.booking,
  );

  if (!requested) {
    return { ok: true, quote };
  }

  const match = freeSlot({
    settings,
    blocked,
    existing,
    durationMinutes: quote.slotMinutes,
    leadTimeDays: quote.leadTimeDays,
    date: requested.date,
    time: requested.time,
  });

  if (!match) {
    return { ok: false, error: SLOT_TAKEN };
  }

  return {
    ok: true,
    quote,
    appointment: {
      date: match.date,
      time: match.time,
      durationMinutes: quote.slotMinutes,
      location: quote.requiresVehicleOnSite ? 'vor-ort' : 'werkstatt',
    },
  };
}

/* ---------- Hochgeladene Dateien ----------------------------------------- */

const DATEIEN_NICHT_ZUGEORDNET =
  'Einige Ihrer Dateien konnten nicht übernommen werden. Wir melden uns, falls wir sie benötigen.';

/**
 * Ordnet die hochgeladenen Kundendateien dem neuen Vorgang zu. Nur Dateien
 * mit passendem Einmal-Schlüssel werden übernommen; der Vorgang vermerkt
 * danach je Datei ihre Kennung.
 */
async function dateienZuordnen(
  saved: BusinessRecord,
  uploads: TrustedRecordInput['uploads'],
  notices: string[],
): Promise<BusinessRecord> {
  const verweise = uploads.flatMap((upload, index) =>
    upload.storageKey && upload.uploadToken
      ? [{ index, id: upload.storageKey, uploadToken: upload.uploadToken }]
      : [],
  );
  if (verweise.length === 0 || !storageStatus().configured) {
    notices.push(DATEIEN_NICHT_ZUGEORDNET);
    return saved;
  }
  try {
    // Erst hier laden: nur mit Datenbank vorhanden.
    const { verknuepfeKundendateien } = await import('@/lib/server/kundendateien');
    const zugeordnet = await verknuepfeKundendateien({
      vorgangId: saved.id,
      uploads: verweise.map(({ id, uploadToken }) => ({ id, uploadToken })),
    });
    const ids = new Set(zugeordnet.map(String));
    const vermerkt = saved.uploads.map((upload, index) => {
      const verweis = verweise.find((v) => v.index === index);
      return verweis && ids.has(verweis.id) ? { ...upload, storageKey: verweis.id } : upload;
    });
    if (zugeordnet.length < uploads.length) notices.push(DATEIEN_NICHT_ZUGEORDNET);
    return (await vorgangDateienSetzen(saved.id, zugeordnet, vermerkt)) ?? saved;
  } catch (error) {
    console.error('[vorgang] Dateien nicht zugeordnet', error);
    notices.push(DATEIEN_NICHT_ZUGEORDNET);
    return saved;
  }
}
