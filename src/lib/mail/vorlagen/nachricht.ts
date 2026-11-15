/**
 * Nachricht des Teams an den Kunden, direkt aus dem Vorgang (FA-KERN-05). Die Vorlagen stehen als Daten in
 * `../nachricht-vorlagen.ts`. Anrede, Vorgangsnummer und Firmenfuß kommen aus dem Mailgerüst.
 * Reine Funktion, relative Importe.
 */

import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, nummerBaustein, type VorlagenKontext } from './gemeinsam';

export { NACHRICHT_GRENZEN, NACHRICHT_MELDUNG, NACHRICHT_VORLAGEN, nachrichtPruefen, vorlageFuer } from '../nachricht-vorlagen';

export interface KundenNachrichtDaten {
  vorgang: BusinessRecord;
  kontext: VorlagenKontext;
  betreff: string;
  text: string;
}

/** Freie Nachricht an den Kunden: Anrede, Text in Absätzen, Vorgangsnummer, Hinweis zur Antwort. */
export function kundenNachricht({ vorgang, kontext, betreff, text }: KundenNachrichtDaten): MailInhalt {
  const absaetze = text
    .trim()
    .split(/\n{2,}/)
    .map((absatz) => absatz.trim())
    .filter(Boolean);
  return baueMail({
    betreff: betreff.trim(),
    vorschau: absaetze[0]?.slice(0, 120),
    anrede: anrede(vorgang.contact),
    bausteine: [...absaetze.map((absatz) => ({ art: 'absatz' as const, text: absatz })), nummerBaustein(vorgang), ANTWORT_HINWEIS],
    firma: kontext.firma,
    site: kontext.site,
  });
}
