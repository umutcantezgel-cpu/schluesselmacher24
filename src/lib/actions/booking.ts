'use server';

import { getCollection, getRecords, getSettings } from '@/lib/data';
import { availableSlots, bookableDays, toIsoDate } from '@/lib/scheduling';
import { quoteCarKeyService } from '@/lib/pricing';
import type { KeyKind, PriceQuote, TimeSlot } from '@/lib/types';

export interface QuoteRequest {
  makeSlug: string;
  modelSlug?: string;
  serviceId: string;
  keyKind: KeyKind;
  workingKeys: number;
}

export interface QuoteResponse {
  ok: boolean;
  quote?: PriceQuote;
  error?: string;
}

/** Ermittelt Preis, Anzahlung, Terminlänge und Vorlauf für einen Fall. */
export async function fetchQuote(request: QuoteRequest): Promise<QuoteResponse> {
  const [makes, services, rules, settings] = await Promise.all([
    getCollection('vehicleMakes'),
    getCollection('carKeyServices'),
    getCollection('pricingRules'),
    getSettings(),
  ]);

  const make = makes.find((m) => m.slug === request.makeSlug);
  if (!make) return { ok: false, error: 'Fahrzeugmarke nicht gefunden.' };

  const model = request.modelSlug
    ? make.models.find((m) => m.slug === request.modelSlug) ?? null
    : null;

  const service = services.find((s) => s.id === request.serviceId && s.active);
  if (!service) return { ok: false, error: 'Leistung nicht gefunden.' };

  const quote = quoteCarKeyService(
    { make, model, service, keyKind: request.keyKind, workingKeys: request.workingKeys },
    rules,
    settings.booking,
  );

  return { ok: true, quote };
}

export interface SlotsResponse {
  days: Array<{ date: string; slots: TimeSlot[] }>;
  /** Frühester angebotener Tag. */
  earliest?: string;
  leadTimeDays: number;
}

/** Liefert die buchbaren Zeitfenster für eine Terminlänge. */
export async function fetchSlots(
  durationMinutes: number,
  leadTimeDays?: number,
  daysToScan = 28,
): Promise<SlotsResponse> {
  const [settings, blocked, records] = await Promise.all([
    getSettings(),
    getCollection('blockedDays'),
    getRecords(),
  ]);

  const slots = availableSlots({
    today: toIsoDate(new Date()),
    durationMinutes,
    leadTimeDays,
    booking: settings.booking,
    openingHours: settings.openingHours,
    blockedDays: blocked,
    existing: records,
    daysToScan,
  });

  const days = bookableDays(slots);

  return {
    days,
    earliest: days[0]?.date,
    leadTimeDays: leadTimeDays ?? settings.booking.leadTimeDays,
  };
}

/** Stand eines Vorgangs für die Terminstatus-Seite. */
export async function fetchRecordStatus(reference: string, email: string) {
  const records = await getRecords();
  const record = records.find(
    (r) =>
      r.reference.toLowerCase() === reference.trim().toLowerCase() &&
      r.contact.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!record) {
    return {
      ok: false as const,
      error:
        'Zu dieser Kombination aus Vorgangsnummer und E-Mail-Adresse wurde nichts gefunden. '
        + 'Bitte prüfen Sie Ihre Eingabe.',
    };
  }

  return {
    ok: true as const,
    record: {
      reference: record.reference,
      kind: record.kind,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      appointment: record.appointment,
      payment: record.payment,
      summary: record.summary,
      timeline: record.timeline,
    },
  };
}
