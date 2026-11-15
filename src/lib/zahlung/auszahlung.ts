/*
 * Partnerbetrag auszahlen (FA-KERN-04, A-049 Nr. 5): eine Schnittstelle, zwei Umsetzungen.
 *
 * - `manuell` (aktiv): Das Team überweist selbst und vermerkt Datum und Beleg am Vorgang. Der Code bewegt
 *   kein Geld.
 * - `stripe-connect` (vorbereitet, abgeschaltet): Überweisung an das verbundene Konto des Partners nach dem
 *   Muster „separate charges and transfers“ (Recherche FA-RECHERCHE-04): Die Zahlung des Kunden liegt auf
 *   dem Plattformkonto, die Überweisung an den Partner folgt erst nach der Freigabe. Nur aktiv mit dem
 *   Schalter `PARTNER_AUSZAHLUNG=stripe-connect` (src/lib/umgebung.ts) und einer Konto-Kennung am
 *   Partnerbetrieb. Die eigentliche Überweisung wird von außen hineingegeben; in Tests nur eine Attrappe.
 *
 * Ohne 'server-only' und nur mit relativen Importen: Der Hook der Sammlung Vorgänge lädt diese Datei.
 */

import { auszahlungsWeg } from '../umgebung';

export interface AuszahlungsAuftrag {
  /** Vorgangsnummer, dient auch als Gruppe der Überweisung und als Idempotenz-Schlüssel. */
  nummer: string;
  partnerbetragCents: number;
  /** Kennung des verbundenen Kontos beim Zahlungsdienst (acct_…), freiwillig am Partnerbetrieb. */
  kontoKennung?: string | null;
}

export type AuszahlungsErgebnis =
  | { ok: true; weg: 'ueberweisung' | 'zahlungsdienst'; referenz?: string }
  | { ok: false; meldung: string };

export interface Auszahlungsweg {
  art: 'manuell' | 'stripe-connect';
  auszahlen(auftrag: AuszahlungsAuftrag): Promise<AuszahlungsErgebnis>;
}

/** Eine Überweisung beim Zahlungsdienst; liefert deren Kennung. */
export type Ueberweisen = (eingabe: {
  betragCents: number;
  ziel: string;
  gruppe: string;
  idempotenz: string;
}) => Promise<{ id: string }>;

const KONTO_MUSTER = /^acct_[A-Za-z0-9]{6,64}$/;

export const AUSZAHLUNG_MELDUNG = {
  betrag: 'Der Partnerbetrag fehlt oder ist nicht größer als null.',
  konto: 'Am Partnerbetrieb ist keine gültige Konto-Kennung für den Zahlungsdienst hinterlegt (acct_…).',
  ausgeschaltet: 'Die Auszahlung über den Zahlungsdienst ist ausgeschaltet. Bitte überweisen Sie von Hand und vermerken Sie den Beleg.',
  fehler: 'Die Überweisung beim Zahlungsdienst ist fehlgeschlagen. Es wurde nichts ausgezahlt.',
} as const;

function betragGueltig(cents: number): boolean {
  return Number.isSafeInteger(cents) && cents > 0;
}

/** Aktiver Weg: Das Team überweist und vermerkt Datum und Beleg. Nichts wird aufgerufen. */
export const manuelleAuszahlung: Auszahlungsweg = {
  art: 'manuell',
  async auszahlen(auftrag) {
    if (!betragGueltig(auftrag.partnerbetragCents)) return { ok: false, meldung: AUSZAHLUNG_MELDUNG.betrag };
    return { ok: true, weg: 'ueberweisung' };
  },
};

/** Vorbereiteter Weg über Stripe Connect; `ueberweisen` ist im Betrieb `stripe.transfers.create`, in Tests eine Attrappe. */
export function stripeConnectAuszahlung(ueberweisen: Ueberweisen): Auszahlungsweg {
  return {
    art: 'stripe-connect',
    async auszahlen(auftrag) {
      if (!betragGueltig(auftrag.partnerbetragCents)) return { ok: false, meldung: AUSZAHLUNG_MELDUNG.betrag };
      const konto = auftrag.kontoKennung?.trim() ?? '';
      if (!KONTO_MUSTER.test(konto)) return { ok: false, meldung: AUSZAHLUNG_MELDUNG.konto };
      try {
        const { id } = await ueberweisen({
          betragCents: auftrag.partnerbetragCents,
          ziel: konto,
          gruppe: auftrag.nummer,
          idempotenz: `sm24-auszahlung-${auftrag.nummer}`,
        });
        return { ok: true, weg: 'zahlungsdienst', referenz: id };
      } catch {
        return { ok: false, meldung: AUSZAHLUNG_MELDUNG.fehler };
      }
    },
  };
}

/** Anzeige im Admin: welcher Weg gerade gilt. */
export function aktiverAuszahlungswegText(weg: 'manuell' | 'stripe-connect' = auszahlungsWeg()): string {
  return weg === 'stripe-connect'
    ? 'Aktiver Weg: Zahlungsdienst (Stripe Connect). Mit „ausgezahlt“ und Weg „Zahlungsdienst“ überweist das System den Partnerbetrag.'
    : 'Aktiver Weg: Überweisung von Hand. Das Team überweist den Partnerbetrag und trägt Datum und Beleg ein. Der Zahlungsdienst ist ausgeschaltet.';
}

/**
 * Weg für eine Auszahlung, die das Team mit „ausgezahlt“ auslöst. Mit Weg „Überweisung“ immer manuell. Mit
 * Weg „Zahlungsdienst“ nur bei eingeschaltetem Schalter; sonst eine Meldung und kein Aufruf.
 * `stripeLaden` wird nur bei eingeschaltetem Schalter aufgerufen.
 */
export async function auszahlungswegFuer(
  gewaehlt: 'ueberweisung' | 'zahlungsdienst',
  stripeLaden: () => Promise<Ueberweisen>,
  aktiv: 'manuell' | 'stripe-connect' = auszahlungsWeg(),
): Promise<Auszahlungsweg | { meldung: string }> {
  if (gewaehlt === 'ueberweisung') return manuelleAuszahlung;
  if (aktiv !== 'stripe-connect') return { meldung: AUSZAHLUNG_MELDUNG.ausgeschaltet };
  return stripeConnectAuszahlung(await stripeLaden());
}
