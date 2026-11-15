/**
 * Bitte an den Kunden, die Ausführung eines vermittelten Auftrags zu bestätigen (FA-KERN-04, A-049 Nr. 4).
 * Mit persönlichem Einmal-Link. Reine Funktion, relative Importe.
 */

import { BESTAETIGUNG_BEDEUTUNG, telefonSatz } from '../../partner/kundenbestaetigung';
import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, nummerBaustein, type VorlagenKontext } from './gemeinsam';

export interface AusfuehrungDaten {
  vorgang: BusinessRecord;
  kontext: VorlagenKontext;
  /** Persönlicher Einmal-Link zur Bestätigung. */
  link: string;
  /** Telefon des Betriebs, falls veröffentlicht. */
  telefon?: string;
}

export function ausfuehrungBestaetigenMail({ vorgang, kontext, link, telefon }: AusfuehrungDaten): MailInhalt {
  return baueMail({
    betreff: `Bitte bestätigen Sie die Ausführung (${vorgang.reference})`,
    vorschau: 'Bitte bestätigen Sie kurz, dass Ihr Auftrag ausgeführt wurde.',
    anrede: anrede(vorgang.contact),
    bausteine: [
      { art: 'absatz', text: 'nach unseren Unterlagen hat der Partnerbetrieb Ihren Auftrag ausgeführt.' },
      nummerBaustein(vorgang),
      { art: 'absatz', text: BESTAETIGUNG_BEDEUTUNG },
      { art: 'knopf', href: link, label: 'Auftrag wurde ausgeführt: bestätigen' },
      { art: 'absatz', text: 'Der Link gilt nur für Sie und nur einmal. Bitte geben Sie ihn nicht weiter.' },
      { art: 'absatz', text: telefonSatz(telefon) },
      ANTWORT_HINWEIS,
    ],
    firma: kontext.firma,
    site: kontext.site,
  });
}
