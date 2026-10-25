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
  if (vorgang.kind === 'partner') return partnerBewerbung(vorgang, name, adminUrl, kontext);
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

/** Bewerbung über „Partner werden“ (Erg. Leitfaden §7): Firma statt Bereich, Hinweis auf die Prüfung. */
function partnerBewerbung(vorgang: BusinessRecord, name: string, adminUrl: string, kontext: VorlagenKontext): MailInhalt {
  const firma = vorgang.contact.company?.trim();
  return baueMail({
    betreff: `Neu: Partner-Bewerbung ${vorgang.reference}${firma ? ` – ${firma.slice(0, 80)}` : ''}`,
    vorschau: `Partner-Bewerbung von ${firma || name}`,
    anrede: 'Hallo Team,',
    bausteine: [
      { art: 'absatz', text: 'über „Partner werden“ ist eine neue Bewerbung als Partnerbetrieb eingegangen.' },
      {
        art: 'felder',
        zeilen: [
          ['Vorgangsnummer', vorgang.reference],
          ['Art', ART_LABEL.partner],
          ...(firma ? ([['Firma', firma]] as Array<[string, string]>) : []),
          ['Ansprechpartner', name],
        ],
      },
      { art: 'knopf', href: adminUrl, label: 'Im Backend öffnen' },
      {
        art: 'absatz',
        text:
          'Angaben, Leistungen und Nachweise stehen im Backend. Vor einer Freischaltung Gewerbe, fachliche Eignung '
          + 'und Zuverlässigkeit prüfen und den Partnervertrag abschließen.',
      },
    ],
    site: kontext.site,
  });
}
