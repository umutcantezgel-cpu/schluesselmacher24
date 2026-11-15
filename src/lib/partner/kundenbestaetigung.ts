/*
 * Bestätigung der Ausführung durch den Kunden (FA-KERN-04, A-049 Nr. 4). Mit dem Stand „ausgeführt“ erhält
 * der Kunde eine Mail mit einem persönlichen Einmal-Link. Gespeichert wird nur der Hash des Schlüssels; mit
 * dem Klick auf „Bestätigen“ wird er gelöscht, ein zweiter Klick und ein gefälschter Link scheitern.
 * Reine Funktionen; der Link-Schlüssel wird vom Aufrufer geprüft (src/lib/server/access-token.ts).
 */

import type { BusinessRecord, TimelineEntry } from '../types';

/** Pfad der Bestätigungsseite; der Schlüssel steht in `k`. */
export function bestaetigungsPfad(vorgangId: string, schluessel: string): string {
  return `/auftrag-bestaetigen/${encodeURIComponent(vorgangId)}?k=${encodeURIComponent(schluessel)}`;
}

/** Ein Satz: was die Bestätigung bedeutet. */
export const BESTAETIGUNG_BEDEUTUNG =
  'Mit Ihrer Bestätigung sagen Sie uns, dass der Partnerbetrieb Ihren Auftrag ausgeführt hat; danach bezahlen wir den Partnerbetrieb.';

/** Für den Fall, dass etwas nicht stimmt. */
export function telefonSatz(telefon: string | undefined): string {
  return telefon
    ? `Stimmt etwas nicht? Dann bestätigen Sie bitte nicht und rufen Sie uns an: ${telefon}.`
    : 'Stimmt etwas nicht? Dann bestätigen Sie bitte nicht und antworten Sie uns auf die E-Mail.';
}

/** Wenn nichts (mehr) zu bestätigen ist: der Weg zu uns, ohne „bestätigen Sie nicht“. */
export function fragenSatz(telefon: string | undefined): string {
  return telefon ? `Fragen? Rufen Sie uns an: ${telefon}.` : 'Fragen? Antworten Sie uns einfach auf unsere E-Mail.';
}

export const KUNDE_VERLAUF = {
  ausgefuehrt: 'Ihr Auftrag wurde ausgeführt.',
  /** Erst nachdem die Mail mit dem Link hinausging. */
  bitteGesendet: 'Wir haben Sie per E-Mail gebeten, das kurz zu bestätigen.',
  bestaetigt: 'Sie haben bestätigt, dass Ihr Auftrag ausgeführt wurde. Vielen Dank.',
  vermittelt: 'Wir haben Ihren Auftrag an einen Partnerbetrieb in Ihrer Region weitergegeben. Er stimmt den Termin mit Ihnen ab.',
} as const;

export const BESTAETIGUNG_MELDUNG = {
  ungueltig: 'Dieser Link ist ungültig oder wurde schon benutzt.',
  nichtOffen: 'Zu diesem Auftrag ist gerade keine Bestätigung offen.',
} as const;

export type BestaetigungsLage = 'offen' | 'nicht-offen' | 'ungueltig';

/**
 * Was die Seite zeigt: nur mit gültigem Schlüssel und Stand „ausgeführt“ ist die Bestätigung offen. Ein
 * benutzter Schlüssel ist gelöscht und gilt wie ein gefälschter als ungültig; so verrät die Seite nichts.
 */
export function bestaetigungsLage(vorgang: Pick<BusinessRecord, 'referral'> | null, schluesselGueltig: boolean): BestaetigungsLage {
  if (!vorgang?.referral || !schluesselGueltig) return 'ungueltig';
  if (vorgang.referral.customerConfirmedAt) return 'nicht-offen';
  return vorgang.referral.status === 'erledigt' ? 'offen' : 'nicht-offen';
}

/**
 * Änderung für die Bestätigung: Stand „Kunde bestätigt“ mit Zeitstempel, Schlüssel gelöscht (Einmal-Link),
 * Eintrag im Verlauf und in den Notizen. `null`, wenn nichts zu tun ist.
 */
export function kundenbestaetigungAnwenden(
  vorgang: BusinessRecord,
  schluesselGueltig: boolean,
  jetzt: string,
): Pick<BusinessRecord, 'referral' | 'timeline' | 'internalNotes'> | null {
  if (bestaetigungsLage(vorgang, schluesselGueltig) !== 'offen') return null;
  const eintrag = (message: string, actor: TimelineEntry['actor']): TimelineEntry => ({ at: jetzt, actor, message });
  return {
    referral: { ...vorgang.referral, status: 'kunde-bestaetigt', customerConfirmedAt: jetzt, confirmTokenHash: undefined },
    timeline: [...vorgang.timeline, eintrag(KUNDE_VERLAUF.bestaetigt, 'kunde')],
    internalNotes: [
      ...vorgang.internalNotes,
      eintrag('Vermittlung von „ausgeführt“ auf „Kunde bestätigt“ gesetzt: Der Kunde hat über seinen Link bestätigt.', 'kunde'),
    ],
  };
}
