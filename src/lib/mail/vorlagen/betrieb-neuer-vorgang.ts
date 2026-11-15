/**
 * Benachrichtigung an den Betrieb über einen neuen Vorgang.
 *
 * Nur Eckdaten und der Link ins Backend: keine Zusammenfassung, keine
 * Fahrgestellnummer, keine Angaben aus dem Sicherheitscheck, keine
 * Lieferhinweise. Alles Weitere steht im Backend — die Mail liegt sonst in
 * fremden Postfächern und den Protokollen des Mailanbieters.
 */

import { KATEGORIE_LABEL } from '../../druckansichten';
import type { BusinessRecord } from '../../types';
import { dateiBezeichnung } from '../../wege/nachweis';
import { baueMail, type MailInhalt } from '../html';
import { ART_LABEL, BEREICH_LABEL, terminZeilen, zahlungsZeilen, type VorlagenKontext } from './gemeinsam';

export interface BetriebNeuerVorgangDaten {
  vorgang: BusinessRecord;
  /** Link auf den Vorgang im Backend. */
  adminUrl: string;
  kontext: VorlagenKontext;
  /** Ob das Vorgangsblatt als PDF angehängt ist (sonst: Erzeugung fehlgeschlagen). */
  anhang?: 'angehaengt' | 'fehlgeschlagen';
}

const LETZTER_ABSATZ = 'Kontaktdaten, Angaben und Unterlagen stehen im Backend.';

const ANHANG_ABSATZ: Record<'angehaengt' | 'fehlgeschlagen', string> = {
  angehaengt: 'Das Vorgangsblatt mit allen Angaben hängt als PDF an. Kontaktdaten, Angaben und Unterlagen stehen auch im Backend.',
  fehlgeschlagen: 'Das Vorgangsblatt konnte nicht als PDF erzeugt werden. Im Backend können Sie es abrufen. Kontaktdaten, Angaben und Unterlagen stehen dort.',
};

export function betriebNeuerVorgang({ vorgang, adminUrl, kontext, anhang }: BetriebNeuerVorgangDaten): MailInhalt {
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
          ...terminZeilen(vorgang, kontext.firma),
          ...zahlungsZeilen(vorgang),
          ...unterlagenZeilen(vorgang),
        ],
      },
      { art: 'knopf', href: adminUrl, label: 'Im Backend öffnen' },
      { art: 'absatz', text: anhang ? ANHANG_ABSATZ[anhang] : LETZTER_ABSATZ },
    ],
    site: kontext.site,
  });
}

/**
 * Unterlagen nach Steckplatz (FA-KERN-02): nur die Bezeichnungen, keine Dateinamen und keine Inhalte.
 * Mehrere Dateien desselben Steckplatzes stehen einmal mit Anzahl.
 */
export function unterlagenZeilen(vorgang: Pick<BusinessRecord, 'uploads'>): Array<[string, string]> {
  if (!vorgang.uploads?.length) return [];
  const anzahl = new Map<string, number>();
  for (const datei of vorgang.uploads) {
    const name = dateiBezeichnung(datei, KATEGORIE_LABEL);
    anzahl.set(name, (anzahl.get(name) ?? 0) + 1);
  }
  return [['Unterlagen', [...anzahl].map(([name, n]) => (n > 1 ? `${name} (${n})` : name)).join(', ')]];
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
