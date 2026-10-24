/* ==========================================================================
   Zustandsautomat der Online-Zahlung
   Reine Funktion: (Vorgang, Ereignis) → Änderung oder `null` (nichts zu tun).
   Unabhängig von den Stripe-Typen — `verbuchen.ts` übersetzt die Ereignisse.

   Grundsätze
   - Jeder Übergang ist wiederholbar: Ein bereits erreichter Zustand ändert
     nichts (Webhook, Rückkehr und Abgleich können dasselbe melden).
   - Der Verlauf ist für Kunden sichtbar (Statusabfrage). Hinweise fürs Team —
     Betragsabweichung, Doppelzahlung, Streitfall — gehen in die Notizen.
   - Ein Termin wird nur im Status „neu“ automatisch storniert. Hat das Team
     ihn schon bestätigt, bleibt er stehen; das Team sieht eine Notiz.
   ========================================================================== */

import { formatCents } from '@/lib/format';
import type { VorgangsAenderung } from '@/lib/data/payload-mapping';
import type { BusinessRecord, PaymentInfo, TimelineEntry } from '@/lib/types';

/** Checkout-Sitzung, wie sie im Ereignis steht. */
export interface Sitzung {
  id: string;
  zahlstatus: 'paid' | 'unpaid' | 'no_payment_required';
  /** Kennung der Zahlung (Stripe: PaymentIntent). */
  paymentIntent?: string;
  betragCent: number | null;
  waehrung: string | null;
  metadata: Record<string, string>;
}

export type SitzungsEreignisTyp =
  | 'checkout.session.completed'
  | 'checkout.session.async_payment_succeeded'
  | 'checkout.session.async_payment_failed'
  | 'checkout.session.expired';

export type ZahlungsEreignis =
  | { typ: SitzungsEreignisTyp; sitzung: Sitzung }
  | {
      typ: 'charge.refunded';
      /** `erstattetCent` ist die Summe aller Erstattungen dieser Zahlung. */
      erstattung: { betragCent: number; erstattetCent: number; vollstaendig: boolean; waehrung: string };
    }
  | { typ: 'charge.dispute.created'; streitfall: { betragCent: number; grund: string; waehrung: string } };

export type ZahlungsErgebnis =
  | 'bezahlt'
  | 'zahlung-ausstehend'
  | 'fehlgeschlagen'
  | 'termin-freigegeben'
  | 'abgelaufen'
  | 'erstattet'
  | 'teilerstattet'
  | 'streitfall'
  | 'doppelzahlung'
  | 'fremde-sitzung';

/** Welche Mail nach dem Verbuchen an den Kunden geht. */
export type ZahlungsMail =
  | { art: 'bezahlt' }
  | { art: 'nicht-abgeschlossen'; terminFreigegeben: boolean }
  | { art: 'erstattet'; betragCent: number };

export interface Uebergang {
  aenderung: VorgangsAenderung | null;
  ergebnis: ZahlungsErgebnis;
  mail?: ZahlungsMail;
}

export interface UebergangsKontext {
  /** ISO-Zeitpunkt der Verbuchung. */
  jetzt: string;
  /** Umgebung dieser Installation (`zahlungsUmgebung()`). */
  umgebung: string;
}

/* Kundentexte im Verlauf — neutral, ohne interne Gründe. */
export const VERLAUF = {
  bezahlt: 'Zahlung eingegangen.',
  anzahlung: 'Anzahlung eingegangen.',
  ausstehend: 'Zahlung eingeleitet – die Bestätigung der Bank steht noch aus.',
  fehlgeschlagen: 'Zahlung nicht abgeschlossen.',
  terminFrei: 'Die Anzahlung ist nicht eingegangen. Der Termin wurde freigegeben.',
  abgelaufen: 'Zahlungslink abgelaufen.',
  gestartet: 'Online-Zahlung gestartet.',
  /** Merkmal für den Abgleich: Stripe war eingerichtet, die Sitzung kam nicht zustande. */
  nichtGestartet: 'Zahlung konnte nicht gestartet werden.',
} as const;

function eintrag(at: string, message: string): TimelineEntry {
  return { at, actor: 'system', message };
}

/** Gehört die Sitzung zu diesem Vorgang — und ist sie die zuletzt gestartete? */
function zuordnung(vorgang: BusinessRecord, sitzung: Sitzung, kontext: UebergangsKontext): 'aktuell' | 'frueher' | null {
  const gespeichert = vorgang.payment?.checkoutSessionId;
  if (gespeichert && gespeichert === sitzung.id) return 'aktuell';
  // Rückfall über die Metadaten — nur mit passender Umgebung und Nummer: Die
  // Kennungen beginnen lokal, in Vorschauen und in Produktion gleich.
  const m = sitzung.metadata;
  const passt = m.vorgangId === vorgang.id && m.nummer === vorgang.reference && m.umgebung === kontext.umgebung;
  if (!passt) return null;
  return gespeichert ? 'frueher' : 'aktuell';
}

function bezahlt(
  vorgang: BusinessRecord,
  zahlung: PaymentInfo,
  sitzung: Sitzung,
  frueher: boolean,
  kontext: UebergangsKontext,
): Uebergang | null {
  const notizen: TimelineEntry[] = [];

  if (zahlung.status === 'bezahlt' || zahlung.status === 'erstattet') {
    // Dieselbe Sitzung noch einmal (Rückkehr und Webhook): nichts zu tun.
    if (zahlung.checkoutSessionId === sitzung.id || (sitzung.paymentIntent && zahlung.providerRef === sitzung.paymentIntent)) {
      return null;
    }
    notizen.push(
      eintrag(
        kontext.jetzt,
        `Weitere Zahlung über die Checkout-Sitzung ${sitzung.id} eingegangen, obwohl der Vorgang schon bezahlt ist `
          + '(Doppelzahlung). Bitte im Stripe-Dashboard prüfen und erstatten.',
      ),
    );
    return { aenderung: { internalNotes: [...vorgang.internalNotes, ...notizen] }, ergebnis: 'doppelzahlung' };
  }

  if (sitzung.betragCent !== null && (sitzung.betragCent !== zahlung.amountCents || (sitzung.waehrung ?? 'eur') !== 'eur')) {
    notizen.push(
      eintrag(
        kontext.jetzt,
        `Betrag weicht ab: Stripe meldet ${sitzung.betragCent} ${(sitzung.waehrung ?? '').toUpperCase()} (kleinste Einheit), `
          + `erwartet ${formatCents(zahlung.amountCents)}. Bitte prüfen.`,
      ),
    );
  }
  if (frueher) {
    notizen.push(eintrag(kontext.jetzt, `Zahlung über eine frühere Checkout-Sitzung (${sitzung.id}) eingegangen.`));
  }
  if (vorgang.status === 'storniert') {
    notizen.push(eintrag(kontext.jetzt, 'Zahlung nach der Stornierung eingegangen – bitte Erstattung prüfen.'));
  }

  const aenderung: VorgangsAenderung = {
    payment: {
      ...zahlung,
      status: 'bezahlt',
      paidAt: kontext.jetzt,
      checkoutSessionId: sitzung.id,
      ...(sitzung.paymentIntent ? { providerRef: sitzung.paymentIntent } : {}),
    },
    timeline: [...vorgang.timeline, eintrag(kontext.jetzt, vorgang.kind === 'termin' ? VERLAUF.anzahlung : VERLAUF.bezahlt)],
  };
  if (notizen.length) aenderung.internalNotes = [...vorgang.internalNotes, ...notizen];
  return { aenderung, ergebnis: 'bezahlt', mail: { art: 'bezahlt' } };
}

/** Zahlung gescheitert oder Sitzung abgelaufen — beim Termin ggf. das Zeitfenster freigeben. */
function nichtAbgeschlossen(
  vorgang: BusinessRecord,
  zahlung: PaymentInfo,
  grund: 'abgelaufen' | 'fehlgeschlagen',
  kontext: UebergangsKontext,
): Uebergang | null {
  const { jetzt } = kontext;

  if (vorgang.kind !== 'termin') {
    if (grund === 'abgelaufen') {
      // Bestellung: Die Zahlung bleibt offen — der Kunde kann neu starten.
      if (vorgang.timeline.at(-1)?.message === VERLAUF.abgelaufen) return null;
      return {
        aenderung: { timeline: [...vorgang.timeline, eintrag(jetzt, VERLAUF.abgelaufen)] },
        ergebnis: 'abgelaufen',
        ...(vorgang.status === 'storniert' ? {} : { mail: { art: 'nicht-abgeschlossen', terminFreigegeben: false } as const }),
      };
    }
    return {
      aenderung: {
        payment: { ...zahlung, status: 'fehlgeschlagen' },
        timeline: [...vorgang.timeline, eintrag(jetzt, VERLAUF.fehlgeschlagen)],
      },
      ergebnis: 'fehlgeschlagen',
      ...(vorgang.status === 'storniert' ? {} : { mail: { art: 'nicht-abgeschlossen', terminFreigegeben: false } as const }),
    };
  }

  const payment: PaymentInfo = { ...zahlung, status: 'fehlgeschlagen' };

  if (vorgang.status === 'neu') {
    return {
      aenderung: { status: 'storniert', payment, timeline: [...vorgang.timeline, eintrag(jetzt, VERLAUF.terminFrei)] },
      ergebnis: 'termin-freigegeben',
      mail: { art: 'nicht-abgeschlossen', terminFreigegeben: true },
    };
  }

  const verlauf = grund === 'abgelaufen' ? VERLAUF.abgelaufen : VERLAUF.fehlgeschlagen;
  const aenderung: VorgangsAenderung = { payment, timeline: [...vorgang.timeline, eintrag(jetzt, verlauf)] };
  if (vorgang.status !== 'storniert') {
    aenderung.internalNotes = [
      ...vorgang.internalNotes,
      eintrag(
        jetzt,
        `Anzahlung nicht eingegangen (${grund === 'abgelaufen' ? 'Zahlungslink abgelaufen' : 'Zahlung fehlgeschlagen'}). `
          + `Der Termin wurde nicht automatisch storniert, weil er schon bearbeitet wird (Status „${vorgang.status}“).`,
      ),
    ];
  }
  return { aenderung, ergebnis: grund === 'abgelaufen' ? 'abgelaufen' : 'fehlgeschlagen' };
}

export function zahlungsUebergang(
  vorgang: BusinessRecord,
  ereignis: ZahlungsEreignis,
  kontext: UebergangsKontext,
): Uebergang | null {
  const zahlung = vorgang.payment;
  if (!zahlung) return null;

  switch (ereignis.typ) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired': {
      const { sitzung } = ereignis;
      const zu = zuordnung(vorgang, sitzung, kontext);
      if (!zu) return { aenderung: null, ergebnis: 'fremde-sitzung' };

      if (ereignis.typ === 'checkout.session.async_payment_succeeded') {
        return bezahlt(vorgang, zahlung, sitzung, zu === 'frueher', kontext);
      }
      if (ereignis.typ === 'checkout.session.completed') {
        if (sitzung.zahlstatus !== 'unpaid') return bezahlt(vorgang, zahlung, sitzung, zu === 'frueher', kontext);
        // Lastschrift & Co.: abgeschlossen, aber noch nicht bezahlt.
        if (zahlung.status !== 'offen' && zahlung.status !== 'fehlgeschlagen') return null;
        if (zu === 'frueher' || (sitzung.paymentIntent && zahlung.providerRef === sitzung.paymentIntent)) return null;
        return {
          aenderung: {
            payment: {
              ...zahlung,
              status: 'offen',
              checkoutSessionId: sitzung.id,
              ...(sitzung.paymentIntent ? { providerRef: sitzung.paymentIntent } : {}),
            },
            timeline: [...vorgang.timeline, eintrag(kontext.jetzt, VERLAUF.ausstehend)],
          },
          ergebnis: 'zahlung-ausstehend',
        };
      }

      // Eine frühere Sitzung läuft ab oder scheitert — die aktuelle zählt.
      if (zu === 'frueher') return null;
      if (ereignis.typ === 'checkout.session.async_payment_failed') {
        if (zahlung.status !== 'offen') return null;
        return nichtAbgeschlossen(vorgang, zahlung, 'fehlgeschlagen', kontext);
      }
      // expired: nur solange die Zahlung offen ist.
      if (zahlung.status !== 'offen') return null;
      return nichtAbgeschlossen(vorgang, zahlung, 'abgelaufen', kontext);
    }

    case 'charge.refunded': {
      const { erstattetCent, vollstaendig } = ereignis.erstattung;
      const bisher = zahlung.refundedCents ?? 0;
      if (erstattetCent <= bisher && (!vollstaendig || zahlung.status === 'erstattet')) return null;
      const neu = Math.max(erstattetCent - bisher, 0);
      return {
        aenderung: {
          payment: { ...zahlung, refundedCents: erstattetCent, status: vollstaendig ? 'erstattet' : zahlung.status },
          timeline: [
            ...vorgang.timeline,
            eintrag(kontext.jetzt, vollstaendig ? `Betrag erstattet (${formatCents(erstattetCent)}).` : `Teilbetrag erstattet (${formatCents(neu)}).`),
          ],
        },
        ergebnis: vollstaendig ? 'erstattet' : 'teilerstattet',
        mail: { art: 'erstattet', betragCent: neu },
      };
    }

    case 'charge.dispute.created': {
      const { betragCent, grund } = ereignis.streitfall;
      return {
        aenderung: {
          internalNotes: [
            ...vorgang.internalNotes,
            eintrag(
              kontext.jetzt,
              `Rückbuchung (Streitfall) über ${formatCents(betragCent)} eröffnet, Grund: ${grund || 'unbekannt'}. `
                + 'Bitte im Stripe-Dashboard reagieren.',
            ),
          ],
        },
        ergebnis: 'streitfall',
      };
    }
  }
}
