import 'server-only';

import { appendRecord, getCollection, getRecords, getSettings } from '@/lib/data';
import { createPayment, sendMail, storageStatus } from '@/lib/integrations';
import { quoteCarKeyService } from '@/lib/pricing';
import { buildRecordId, buildReference } from '@/lib/reference';
import { availableSlots, toIsoDate } from '@/lib/scheduling';
import type {
  AppointmentInfo,
  AreaKey,
  BusinessRecord,
  ContactDetails,
  KeyKind,
  PriceQuote,
  ProcessKind,
  RecordKind,
  SummarySection,
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
  uploads: Array<Omit<UploadRef, 'id' | 'uploadedAt' | 'storageKey'>>;
  quote?: PriceQuote;
  appointment?: AppointmentInfo;
  payment?: { scope: 'anzahlung' | 'gesamt'; amountCents: number; description: string };
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

export async function createRecord(input: TrustedRecordInput): Promise<CreateRecordResult> {
  const notices: string[] = [];

  try {
    const [settings, existing] = await Promise.all([getSettings(), getRecords()]);

    const now = new Date();
    const year = now.getFullYear();
    const sequence =
      existing.filter((r) => r.kind === input.kind && r.reference.includes(`-${year}-`)).length + 1;
    const reference = buildReference(input.kind, year, sequence);
    const id = buildRecordId(reference);
    const timestamp = now.toISOString();
    const { token, hash } = createAccessToken();

    if (input.uploads.length > 0 && !storageStatus().configured) {
      notices.push(
        'Ihre Dateien konnten noch nicht dauerhaft gespeichert werden. Wir melden uns, '
          + 'falls wir sie erneut benötigen.',
      );
    }

    const uploads: UploadRef[] = input.uploads.map((upload, index) => ({
      ...upload,
      id: `${id}-datei-${index + 1}`,
      uploadedAt: timestamp,
    }));

    const record: BusinessRecord = {
      id,
      reference,
      kind: input.kind,
      area: input.area,
      process: input.process,
      status: 'neu',
      createdAt: timestamp,
      updatedAt: timestamp,
      contact: input.contact,
      payload: input.payload,
      summary: input.summary,
      uploads,
      quote: input.quote,
      appointment: input.appointment,
      internalNotes: [],
      timeline: [{ at: timestamp, actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
      accessTokenHash: hash,
    };

    let redirectUrl: string | undefined;
    if (input.payment) {
      const result = await createPayment({
        recordId: id,
        amountCents: input.payment.amountCents,
        scope: input.payment.scope,
        description: input.payment.description,
        returnUrl: `/bestellung/${id}?t=${token}`,
      });

      record.payment = {
        scope: input.payment.scope,
        amountCents: input.payment.amountCents,
        status: result.status,
        providerRef: result.providerRef,
      };
      redirectUrl = result.redirectUrl;

      if (result.status === 'offen') {
        notices.push(result.message);
        record.timeline.push({
          at: timestamp,
          actor: 'system',
          message: 'Zahlung offen: kein Zahlungsdienstleister angebunden.',
        });
      }
    }

    await appendRecord(record);

    const mail = await sendMail({
      to: input.contact.email,
      subject: `Ihr Vorgang ${reference} bei SCHLÜSSELMACHER24`,
      body:
        `Guten Tag ${input.contact.firstName} ${input.contact.lastName},\n\n`
        + `wir haben Ihren Vorgang unter der Nummer ${reference} aufgenommen.\n`
        + `Sie können den Stand jederzeit unter /service-und-termin/terminstatus abrufen.\n\n`
        + `${settings.company.brandName}`,
      recordId: id,
    });

    if (!mail.sent) {
      notices.push(
        'Eine automatische Bestätigung per E-Mail ist noch nicht eingerichtet. '
          + 'Notieren Sie sich bitte Ihre Vorgangsnummer.',
      );
    }

    return { ok: true, reference, recordId: id, accessToken: token, redirectUrl, notices };
  } catch (error) {
    console.error('[vorgang] Speichern fehlgeschlagen', error);
    return { ok: false, notices, error: GENERIC_ERROR };
  }
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
 */
export async function verifyCarKeyBooking(
  input: CarKeyVerifyInput,
  requested: { date: string; time: string } | undefined,
): Promise<VerifyResult> {
  const [settings, makes, services, rules, blocked, records] = await Promise.all([
    getSettings(),
    getCollection('vehicleMakes'),
    getCollection('carKeyServices'),
    getCollection('pricingRules'),
    getCollection('blockedDays'),
    getRecords(),
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

  const slots = availableSlots({
    today: toIsoDate(new Date()),
    durationMinutes: quote.slotMinutes,
    leadTimeDays: quote.leadTimeDays,
    booking: settings.booking,
    openingHours: settings.openingHours,
    blockedDays: blocked,
    existing: records,
  });

  const match = slots.find(
    (slot) => slot.date === requested.date && slot.time === requested.time && slot.available,
  );

  if (!match) {
    return {
      ok: false,
      error:
        'Der gewählte Termin ist inzwischen nicht mehr frei. Bitte wählen Sie ein anderes '
        + 'Zeitfenster aus.',
    };
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
