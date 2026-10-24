/**
 * Benachrichtigung an den Betrieb über einen neuen Vorgang.
 *
 * Nur Eckdaten und der Link ins Backend: keine Zusammenfassung, keine
 * Fahrgestellnummer, keine Angaben aus dem Sicherheitscheck, keine
 * Lieferhinweise. Alles Weitere steht im Backend — die Mail liegt sonst in
 * fremden Postfächern und den Protokollen des Mailanbieters.
 */

import type { BusinessRecord } from '../../types';
import { baueMail, type MailInhalt } from '../html';
import { ART_LABEL, BEREICH_LABEL, terminZeilen, zahlungsZeilen, type VorlagenKontext } from './gemeinsam';

export interface BetriebNeuerVorgangDaten {
  vorgang: BusinessRecord;
  /** Link auf den Vorgang im Backend. */
  adminUrl: string;
  kontext: VorlagenKontext;
}

export function betriebNeuerVorgang({ vorgang, adminUrl, kontext }: BetriebNeuerVorgangDaten): MailInhalt {
  const name = [vorgang.contact.firstName, vorgang.contact.lastName].filter(Boolean).join(' ');
  return baueMail({
    betreff: `Neu: ${ART_LABEL[vorgang.kind]} ${vorgang.reference} – ${BEREICH_LABEL[vorgang.area] ?? vorgang.area}`,
    vorschau: `${ART_LABEL[vorgang.kind]} von ${name}`,
    anrede: 'Hallo Team,',
    bausteine: [
      { art: 'absatz', text: 'über die Website ist ein neuer Vorgang eingegangen.' },
      {
        art: 'felder',
        zeilen: [
          ['Vorgangsnummer', vorgang.reference],
          ['Art', ART_LABEL[vorgang.kind]],
          ['Bereich', BEREICH_LABEL[vorgang.area] ?? vorgang.area],
          ['Name', name],
          ...terminZeilen(vorgang),
          ...zahlungsZeilen(vorgang),
        ],
      },
      { art: 'knopf', href: adminUrl, label: 'Im Backend öffnen' },
      { art: 'absatz', text: 'Kontaktdaten, Angaben und Unterlagen stehen im Backend.' },
    ],
    site: kontext.site,
  });
}
