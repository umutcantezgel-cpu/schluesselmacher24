'use server';

import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';

import { getAppointments, getCollection, getRecordByReference, getSettings } from '@/lib/data';
import { heuteInBerlin } from '@/lib/berliner-zeit';
import { einsendeKundenStatus, kundenEinsendeSendung } from '@/lib/einsenden/sendung';
import { istEinsendung } from '@/lib/einsenden/vorgang';
import { kundenSendung } from '@/lib/kundenstatus';
import { addDays, availableSlots, bookableDays, earliestBookableDate, minutenInBerlin } from '@/lib/scheduling';
import { quoteCarKeyService } from '@/lib/pricing';
import { vorgangOrtText } from '@/lib/terminort';
import type { Auftragsweg, Terminstandort } from '@/lib/auftragsweg';
import { standorteErmitteln } from '@/lib/partner/partnerweg-daten';
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
  if (!(await allowRequest(LIMITS.preis))) return { ok: false, error: RATE_LIMIT_MESSAGE };

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

export interface StandorteResponse {
  /** Standorte, die der Kunde wählen kann; die Werkstatt steht immer zuerst. */
  standorte: Array<{ standort: Terminstandort; weg: Auftragsweg }>;
  /** Partnerweg eingeschaltet, aber in dieser Region noch kein Partnerbetrieb. */
  ohnePartner: boolean;
  error?: string;
}

/**
 * Terminstandorte für eine Postleitzahl (FA-KERN-03): die Werkstatt immer, ein vermittelter
 * Partnerbetrieb nur mit Schalter und passendem, freigeschaltetem Partner. Ohne Partnernamen.
 */
export async function fetchTerminstandorte(eingabe: { postleitzahl: string; land?: string; leistung?: string }): Promise<StandorteResponse> {
  const werkstatt: StandorteResponse = { standorte: [{ standort: 'werkstatt', weg: 'hauptzentrale' }], ohnePartner: false };
  if (!(await allowRequest(LIMITS.preis))) return { ...werkstatt, error: RATE_LIMIT_MESSAGE };
  const plz = typeof eingabe?.postleitzahl === 'string' ? eingabe.postleitzahl.trim().slice(0, 10) : '';
  const land = typeof eingabe?.land === 'string' ? eingabe.land.slice(0, 60) : undefined;
  const leistung = typeof eingabe?.leistung === 'string' ? eingabe.leistung.slice(0, 80) : undefined;
  const ermittlung = await standorteErmitteln({ postleitzahl: plz, land, leistung });
  return { standorte: ermittlung.standorte, ohnePartner: ermittlung.ohnePartner };
}

export interface SlotsResponse {
  days: Array<{ date: string; slots: TimeSlot[] }>;
  /** Frühester angebotener Tag. */
  earliest?: string;
  leadTimeDays: number;
  /** Gesetzt, wenn keine Zeitfenster geliefert werden (z. B. zu viele Abfragen). */
  error?: string;
}

/** Liefert die buchbaren Zeitfenster für eine Terminlänge. */
export async function fetchSlots(
  durationMinutes: number,
  leadTimeDays?: number,
  daysToScan = 28,
): Promise<SlotsResponse> {
  if (!(await allowRequest(LIMITS.termine))) {
    return { days: [], leadTimeDays: leadTimeDays ?? 0, error: RATE_LIMIT_MESSAGE };
  }

  const [settings, blocked] = await Promise.all([getSettings(), getCollection('blockedDays')]);

  // Nur die Termine des angezeigten Zeitraums lesen — derselbe Zeitraum, den
  // `availableSlots` durchläuft.
  // „Heute“ und die Uhrzeit in deutscher Zeit — der Server läuft in UTC.
  const jetzt = new Date();
  const today = heuteInBerlin(jetzt);
  const from = earliestBookableDate(today, leadTimeDays ?? settings.booking.leadTimeDays);
  const scanned = Math.min(daysToScan, settings.booking.bookingHorizonDays);
  const existing = await getAppointments(from, addDays(from, Math.max(scanned - 1, 0)));

  const slots = availableSlots({
    today,
    jetztMinuten: minutenInBerlin(jetzt),
    durationMinutes,
    leadTimeDays,
    booking: settings.booking,
    openingHours: settings.openingHours,
    blockedDays: blocked,
    existing,
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
  // Nummer + E-Mail sind die einzige Hürde vor persönlichen Daten — daher
  // gegen massenhaftes Durchprobieren begrenzt.
  if (!(await allowRequest(LIMITS.status))) {
    return { ok: false as const, error: RATE_LIMIT_MESSAGE };
  }
  if (typeof reference !== 'string' || typeof email !== 'string' || reference.length > 40 || email.length > 254) {
    return { ok: false as const, error: 'Bitte prüfen Sie Ihre Eingabe.' };
  }

  const found = await getRecordByReference(reference);
  const record =
    found && found.contact.email.toLowerCase() === email.trim().toLowerCase() ? found : null;

  if (!record) {
    return {
      ok: false as const,
      error:
        'Zu dieser Kombination aus Vorgangsnummer und E-Mail-Adresse wurde nichts gefunden. '
        + 'Bitte prüfen Sie Ihre Eingabe.',
    };
  }

  // Kundenstatus aus einer Quelle (E6-OPUS-04): dieselben Wörter wie auf der Vorgangsseite, mit den
  // eigenen Namen der Foto-Anfrage und der Einsendung (E6-OPUS-02), mit „Unterwegs zu uns“ (FA-SHOP-03B).
  const anzeige = einsendeKundenStatus(record);
  const sendungZuUns = record.einsendeSendung?.trackingNumber
    ? kundenEinsendeSendung(record, (await getSettings().catch(() => null))?.sendIn)
    : undefined;
  return {
    ok: true as const,
    record: {
      reference: record.reference,
      kind: record.kind,
      status: record.status,
      statusLabel: anzeige.label,
      statusText: anzeige.text,
      // Der Begleitschein liegt auf der Vorgangsseite; hierher führt nur der Link aus der Eingangsbestätigung.
      statusHinweis:
        istEinsendung(record) && record.status === 'neu'
          ? 'Den Begleitschein finden Sie über den Knopf „Stand und Begleitschein ansehen“ in unserer Eingangsbestätigung.'
          : undefined,
      // Nach dem Versand: Dienstleister, Sendungsnummer und öffentlicher Verfolgungslink (G-25).
      sendung: kundenSendung(record),
      // Sendung des Kunden zur Werkstatt (FA-SHOP-03B): wie auf der Vorgangsseite.
      sendungZuUns,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      appointment: record.appointment,
      // Ort mit Werkstatt-Anschrift (Erg. Leitfaden §1), nur bei Terminen.
      ort: record.appointment ? vorgangOrtText(record, (await getSettings()).company) : undefined,
      // Ohne Kennungen des Zahlungsdienstleisters (Sitzung, Zahlung).
      payment: record.payment
        ? {
            scope: record.payment.scope,
            amountCents: record.payment.amountCents,
            status: record.payment.status,
            paidAt: record.payment.paidAt,
          }
        : undefined,
      summary: record.summary,
      timeline: record.timeline,
    },
  };
}
