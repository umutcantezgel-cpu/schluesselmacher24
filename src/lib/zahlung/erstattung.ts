/*
 * Erstattung und Storno am Vorgang (FA-KERN-05, baut auf FA-KERN-04 auf).
 *
 * - Zahlungsstand in einem Satz: bezahlt, teilweise erstattet (mit Betrag) oder erstattet.
 * - Wege einer Erstattung: über den Zahlungsdienst (belegt der Webhook) oder außerhalb (Überweisung, bar,
 *   sonstiger Weg) mit Beleg. Der Code bewegt dabei kein Geld (G5).
 * - Storno einer bezahlten Zahlung: Das Team entscheidet ausdrücklich über die Erstattung.
 * - „Erstattung beim Zahlungsdienst auslösen“: vorbereitet und abgeschaltet. Ohne den Schalter
 *   `ZAHLUNG_ERSTATTUNG=stripe` wird nichts aufgerufen; die eigentliche Erstattung wird von außen
 *   hineingegeben, in Tests nur als Attrappe. Kein Endpunkt ruft diese Funktion auf.
 *
 * Ohne 'server-only' und nur mit relativen Importen: Die Sammlung Vorgänge und ihre Hooks laden diese Datei.
 */

import { formatCents } from '../format';
import type { PaymentInfo, RefundInfo } from '../types';

export type ErstattungsWeg = NonNullable<RefundInfo['method']>;

export const ERSTATTUNGS_WEGE: ReadonlyArray<{ label: string; value: ErstattungsWeg }> = [
  { label: 'Zahlungsdienst (Stripe)', value: 'zahlungsdienst' },
  { label: 'Überweisung', value: 'ueberweisung' },
  { label: 'Bar', value: 'bar' },
  { label: 'Sonstiger Weg', value: 'sonstige' },
];

/** Außerhalb des Zahlungsdienstes ist ein Beleg Pflicht (Buchungstext, Quittungsnummer). */
export function belegPflicht(weg: string | null | undefined): boolean {
  return weg === 'ueberweisung' || weg === 'bar' || weg === 'sonstige';
}

export const ERSTATTUNG_MELDUNG_WEG = {
  weg: 'Bitte den Weg der Erstattung wählen (Zahlungsdienst, Überweisung, bar oder sonstiger Weg).',
  beleg: 'Bitte einen Beleg eintragen, etwa Buchungstext, Quittungsnummer oder Referenz.',
  berichtigungZahlungsdienst:
    'Eine Erstattung über den Zahlungsdienst berichtigt nur der Inhaber. Er prüft vorher im Stripe-Dashboard, was dort wirklich erstattet wurde.',
  berichtigungVermittlung:
    'Bei einem vermittelten Auftrag sperrt die Erstattung die Partnerauszahlung. Berichtigen kann sie nur der Inhaber, mit Grund.',
  berichtigungHoeher: 'Eine Berichtigung macht den erstatteten Betrag nur kleiner. Für mehr bitte die Erstattung erfassen.',
  berichtigungOhne: 'Zu diesem Vorgang ist keine Erstattung erfasst, die sich berichtigen ließe.',
} as const;

export interface Zahlungsstand {
  status?: PaymentInfo['status'] | null;
  betragCent?: number | null;
  erstattetCent?: number | null;
}

/**
 * Zahlungsstand in einem eindeutigen Satz für das Backend: bezahlt, teilweise erstattet mit Betrag und
 * Rest, erstattet. `null`, wenn es keine Zahlung gibt.
 */
export function zahlungsstandText({ status, betragCent, erstattetCent }: Zahlungsstand): string | null {
  if (!status) return null;
  const betrag = typeof betragCent === 'number' && Number.isFinite(betragCent) ? betragCent : null;
  const erstattet = typeof erstattetCent === 'number' && Number.isFinite(erstattetCent) ? erstattetCent : 0;
  switch (status) {
    case 'offen':
      return betrag === null ? 'Offen.' : `Offen: ${formatCents(betrag)} noch nicht bezahlt.`;
    case 'fehlgeschlagen':
      return 'Fehlgeschlagen: keine Zahlung eingegangen.';
    case 'bezahlt':
      return betrag === null ? 'Bezahlt.' : `Bezahlt: ${formatCents(betrag)}.`;
    case 'teilweise-erstattet': {
      if (betrag === null) return `Teilweise erstattet: ${formatCents(erstattet)}.`;
      return `Teilweise erstattet: ${formatCents(erstattet)} von ${formatCents(betrag)}. Es bleiben ${formatCents(Math.max(betrag - erstattet, 0))}.`;
    }
    case 'erstattet':
      return `Erstattet: ${formatCents(erstattet || betrag || 0)}.`;
    default:
      return null;
  }
}

/* ---------- Storno einer bezahlten Zahlung ------------------------------- */

export type StornoEntscheidung = 'ganz' | 'teilweise' | 'keine';

export const STORNO_ENTSCHEIDUNGEN: ReadonlyArray<{ label: string; value: StornoEntscheidung }> = [
  { label: 'Ganz erstatten', value: 'ganz' },
  { label: 'Teilweise erstatten', value: 'teilweise' },
  { label: 'Keine Erstattung', value: 'keine' },
];

export const STORNO_MELDUNG = {
  entscheidung:
    'Diese Zahlung ist eingegangen. Bitte vor dem Stornieren unter „Storno: Erstattung“ wählen: ganz, teilweise oder keine Erstattung.',
  grund: 'Bitte einen Grund eintragen, warum nicht erstattet wird.',
  ganz: 'Sie haben „Ganz erstatten“ gewählt. Bitte die Erstattung in der Gruppe „Erstattung“ mit Art „Ganz“, Weg und Beleg eintragen.',
  teilweise:
    'Sie haben „Teilweise erstatten“ gewählt. Bitte die Erstattung in der Gruppe „Erstattung“ mit Art „Teilweise“, Betrag, Weg und Beleg eintragen.',
} as const;

/**
 * Prüft das Storno einer Zahlung, die eingegangen ist. `zahlungNachher` ist der Zahlungsstand nach dem
 * Speichern (eine Erstattung im selben Speichern ist schon eingerechnet). Liefert eine Meldung oder `null`.
 */
export function stornoPruefen(k: {
  zahlungVorher: PaymentInfo['status'] | null | undefined;
  zahlungNachher: PaymentInfo['status'] | null | undefined;
  entscheidung: string | null | undefined;
  grund: string | null | undefined;
}): string | null {
  // Nur wenn Geld eingegangen und noch nicht ganz erstattet ist.
  if (k.zahlungVorher !== 'bezahlt' && k.zahlungVorher !== 'teilweise-erstattet') return null;
  if (k.zahlungNachher === 'erstattet' && !k.entscheidung) return null;
  switch (k.entscheidung) {
    case 'keine':
      return (k.grund ?? '').trim() ? null : STORNO_MELDUNG.grund;
    case 'ganz':
      return k.zahlungNachher === 'erstattet' ? null : STORNO_MELDUNG.ganz;
    case 'teilweise':
      return k.zahlungNachher === 'teilweise-erstattet' || k.zahlungNachher === 'erstattet' ? null : STORNO_MELDUNG.teilweise;
    default:
      return STORNO_MELDUNG.entscheidung;
  }
}

/* ---------- Erstattung beim Zahlungsdienst (vorbereitet, abgeschaltet) ---- */

/** Die eigentliche Erstattung beim Zahlungsdienst; wird von außen hineingegeben (in Tests eine Attrappe). */
export type Erstatten = (auftrag: { zahlungsKennung: string; betragCents: number; idempotenz: string }) => Promise<{ id: string }>;

export type ErstattungsAusloesung = { ok: true; referenz: string } | { ok: false; meldung: string };

export const ERSTATTUNG_AUSLOESEN_AUS =
  'Abgeschaltet: Erstattungen lösen Sie im Stripe-Dashboard aus. Der Zahlungsstand folgt automatisch. '
  + 'Tragen Sie die Erstattung danach unten mit Weg „Zahlungsdienst“ ein.';

/** Schalter für die vorbereitete Erstattung; nur `stripe` schaltet sie ein (nirgends gesetzt). */
export function erstattungAusloesenAktiv(schalter: string | undefined = process.env.ZAHLUNG_ERSTATTUNG): boolean {
  return schalter?.trim() === 'stripe';
}

/** Link zur Zahlung im Stripe-Dashboard, nur für eine gültige Kennung (pi_…). */
export function stripeZahlungsLink(kennung: string | null | undefined, test = false): string | null {
  if (typeof kennung !== 'string' || !/^pi_[A-Za-z0-9]+$/.test(kennung)) return null;
  return `https://dashboard.stripe.com/${test ? 'test/' : ''}payments/${kennung}`;
}

/**
 * Erstattung beim Zahlungsdienst auslösen: vorbereitet, abgeschaltet. Ohne Schalter wird `erstatten` nie
 * aufgerufen. Mit Schalter nur für eine gültige Zahlungskennung und einen Betrag bis zur Zahlung, mit
 * Idempotenz-Schlüssel je Vorgang und Betrag.
 */
export async function erstattungBeimZahlungsdienst(
  auftrag: { nummer: string; zahlungsKennung: string | null | undefined; betragCents: number; gezahltCents: number },
  optionen: { schalter?: string; erstatten?: Erstatten } = {},
): Promise<ErstattungsAusloesung> {
  if (!erstattungAusloesenAktiv(optionen.schalter ?? process.env.ZAHLUNG_ERSTATTUNG)) return { ok: false, meldung: ERSTATTUNG_AUSLOESEN_AUS };
  if (!optionen.erstatten) return { ok: false, meldung: ERSTATTUNG_AUSLOESEN_AUS };
  if (!stripeZahlungsLink(auftrag.zahlungsKennung)) return { ok: false, meldung: 'Zu diesem Vorgang gibt es keine Zahlung beim Zahlungsdienst.' };
  if (!Number.isSafeInteger(auftrag.betragCents) || auftrag.betragCents <= 0 || auftrag.betragCents > auftrag.gezahltCents) {
    return { ok: false, meldung: 'Der Betrag muss größer als 0 und höchstens die Zahlung sein.' };
  }
  try {
    const ergebnis = await optionen.erstatten({
      zahlungsKennung: auftrag.zahlungsKennung!,
      betragCents: auftrag.betragCents,
      idempotenz: `erstattung-${auftrag.nummer}-${auftrag.betragCents}`,
    });
    return { ok: true, referenz: ergebnis.id };
  } catch {
    return { ok: false, meldung: 'Der Zahlungsdienst hat die Erstattung abgelehnt. Bitte im Stripe-Dashboard prüfen.' };
  }
}
