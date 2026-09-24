'use server';

import { createRecord, verifyCarKeyBooking } from '@/lib/server/create-record';
import { publicRecordSchema } from '@/lib/server/record-schema';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import type {
  AppointmentInfo,
  AreaKey,
  ContactDetails,
  KeyKind,
  PriceQuote,
  ProcessKind,
  RecordKind,
  SummarySection,
  UploadRef,
} from '@/lib/types';

/**
 * Eingabe der Formulare und Konfiguratoren.
 *
 * `quote`, `appointment` und `payment` sind hier nur Wünsche des Browsers.
 * Der Server übernimmt davon nichts Preisbestimmendes: Für Autoschlüssel-
 * Termine leitet er Preis, Anzahlung und Termin über `verify` selbst her,
 * bei allen anderen Anfragen entfallen sie.
 */
export interface SubmitInput {
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

const INVALID_INPUT =
  'Einige Angaben sind unvollständig oder ungültig. Bitte prüfen Sie das Formular.';

/**
 * Öffentliche Aktion für Anfragen, Projekte und Autoschlüssel-Termine.
 * Bestellungen laufen ausschließlich über `submitOrder` in der Kasse.
 */
export async function submitRecord(input: SubmitInput): Promise<SubmitResult> {
  if (!(await allowRequest(LIMITS.vorgang))) {
    return { ok: false, notices: [], error: RATE_LIMIT_MESSAGE };
  }

  const parsed = publicRecordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }
  const data = parsed.data;

  if (data.kind === 'bestellung') {
    return { ok: false, notices: [], error: 'Bestellungen werden über die Kasse abgeschlossen.' };
  }

  let quote: PriceQuote | undefined;
  let appointment: AppointmentInfo | undefined;
  let payment: { scope: 'anzahlung'; amountCents: number; description: string } | undefined;

  if (data.kind === 'termin') {
    // Ein Termin mit Anzahlung braucht die Angaben, aus denen der Server den
    // Preis selbst ermittelt. Beträge aus dem Browser werden nie übernommen.
    if (!data.verify) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    const verified = await verifyCarKeyBooking(
      data.verify,
      data.appointment ? { date: data.appointment.date, time: data.appointment.time } : undefined,
    );
    if (!verified.ok) {
      return { ok: false, notices: [], error: verified.error };
    }
    quote = verified.quote;
    appointment = verified.appointment;
    payment = {
      scope: 'anzahlung',
      amountCents: verified.quote.depositCents,
      description: data.payment?.description?.trim() || 'Anzahlung Autoschlüssel-Termin',
    };
  }

  const result = await createRecord({
    kind: data.kind,
    area: data.area,
    process: data.process,
    contact: data.contact,
    payload: data.payload,
    summary: data.summary,
    uploads: data.uploads,
    quote,
    appointment,
    payment,
  });

  // Der Link-Schlüssel gehört nur zur Bestellbestätigung und bleibt hier intern.
  return {
    ok: result.ok,
    reference: result.reference,
    recordId: result.recordId,
    redirectUrl: result.redirectUrl,
    notices: result.notices,
    error: result.error,
  };
}
