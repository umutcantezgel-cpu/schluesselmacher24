'use server';

import { revalidatePath } from 'next/cache';

import { appendRecord, getCollection, getRecords, getSettings } from '@/lib/data';
import { createPayment, sendMail, storageStatus } from '@/lib/integrations';
import { quoteCarKeyService } from '@/lib/pricing';
import { buildRecordId, buildReference } from '@/lib/reference';
import { availableSlots, toIsoDate } from '@/lib/scheduling';
import type {
  AppointmentInfo,
  AreaKey,
  KeyKind,
  BusinessRecord,
  ContactDetails,
  PriceQuote,
  ProcessKind,
  RecordKind,
  SummarySection,
  UploadRef,
} from '@/lib/types';

export interface SubmitInput {
  kind: RecordKind;
  area: AreaKey;
  process: ProcessKind;
  contact: ContactDetails;
  payload: Record<string, unknown>;
  summary: SummarySection[];
  /** Nur die Angaben zu den Dateien — die Dateien selbst brauchen eine Ablage. */
  uploads: Array<Omit<UploadRef, 'id' | 'uploadedAt' | 'storageKey'>>;
  quote?: PriceQuote;
  appointment?: AppointmentInfo;
  /** Was bezahlt werden soll. */
  payment?: { scope: 'anzahlung' | 'gesamt'; amountCents: number; description: string };
  /**
   * Angaben, aus denen der Server Preis, Anzahlung und Terminlänge selbst
   * herleitet. Ist dieser Block gesetzt, werden `quote`, `appointment` und
   * `payment` aus dem Browser NICHT übernommen, sondern serverseitig neu
   * ermittelt und geprüft.
   */
  verify?: {
    kind: 'autoschluessel';
    makeSlug: string;
    modelSlug?: string | null;
    serviceId: string;
    keyKind: KeyKind;
    workingKeys: number;
  };
}

export interface SubmitResult {
  ok: boolean;
  reference?: string;
  recordId?: string;
  /** Wohin der Kunde zum Bezahlen geleitet wird, sobald angebunden. */
  redirectUrl?: string;
  /** Hinweise zu nicht angebundenen Diensten. */
  notices: string[];
  error?: string;
}

/**
 * Legt einen Vorgang an.
 *
 * Alle vier Kundenprozesse laufen über diese eine Funktion, damit
 * Bestellungen, Anfragen, Termine und Projekte im Backend dieselbe
 * Struktur haben.
 */
export async function submitRecord(input: SubmitInput): Promise<SubmitResult> {
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

    // Ohne angebundene Dateiablage wird nur vermerkt, was hochgeladen wurde.
    const storage = storageStatus();
    if (input.uploads.length > 0 && !storage.configured) {
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

    // Preis, Anzahlung und Termin serverseitig herleiten, statt den Angaben
    // aus dem Browser zu vertrauen.
    let quote = input.quote;
    let appointment = input.appointment;
    let payment = input.payment;

    if (input.verify?.kind === 'autoschluessel') {
      const verified = await verifyCarKeyBooking(input.verify, input.appointment, settings);
      if (!verified.ok) {
        return { ok: false, notices, error: verified.error };
      }
      quote = verified.quote;
      appointment = verified.appointment;
      if (input.payment) {
        payment = {
          ...input.payment,
          scope: 'anzahlung',
          amountCents: verified.quote.depositCents,
        };
      }
    }

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
      quote,
      appointment,
      internalNotes: [],
      timeline: [
        {
          at: timestamp,
          actor: 'kunde',
          message: 'Vorgang über die Website angelegt.',
        },
      ],
    };

    // Zahlung anstoßen, wenn der Prozess eine vorsieht.
    let redirectUrl: string | undefined;
    if (payment) {
      const result = await createPayment({
        recordId: id,
        amountCents: payment.amountCents,
        scope: payment.scope,
        description: payment.description,
        returnUrl: `/bestellung/${id}`,
      });

      record.payment = {
        scope: payment.scope,
        amountCents: payment.amountCents,
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

    // Bestätigung versenden, sofern angebunden.
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

    revalidatePath('/admin/vorgaenge');

    return { ok: true, reference, recordId: id, redirectUrl, notices };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Der Vorgang konnte nicht gespeichert werden.';
    return { ok: false, notices, error: message };
  }
}

/* ---------- Serverseitige Prüfung für Autoschlüssel-Termine -------------- */

type VerifyResult =
  | { ok: true; quote: PriceQuote; appointment?: AppointmentInfo }
  | { ok: false; error: string };

/**
 * Leitet Preis, Anzahlung und Terminlänge aus den Stammdaten her und prüft,
 * ob das gewählte Zeitfenster überhaupt noch frei ist. So kann ein
 * manipulierter Browser weder den Preis noch einen belegten Termin setzen.
 */
async function verifyCarKeyBooking(
  input: NonNullable<SubmitInput['verify']>,
  requested: AppointmentInfo | undefined,
  settings: Awaited<ReturnType<typeof getSettings>>,
): Promise<VerifyResult> {
  const [makes, services, rules, blocked, records] = await Promise.all([
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
