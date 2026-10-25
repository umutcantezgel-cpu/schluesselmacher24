/**
 * Hinweise an das Team (Mail-Art `team-hinweis`).
 *
 * „Rückruf empfohlen“ (K-02): Die Anzahlung eines Termins ist nicht
 * eingegangen und das Zeitfenster wurde freigegeben. Der Kunde wollte buchen
 * — ein Anruf rettet oft den Auftrag. Deshalb steht die Telefonnummer hier,
 * anders als in der Mail zum neuen Vorgang. Keine Fahrgestellnummer, keine
 * Unterlagen. Reine Funktion, relative Importe.
 */

import type { BusinessRecord } from '../../types';
import { baueMail, type MailInhalt } from '../html';
import { BEREICH_LABEL, terminZeilen, type VorlagenKontext } from './gemeinsam';

/** Erster Wert zu einer Angabe in der Zusammenfassung. */
function angabe(vorgang: BusinessRecord, ...labels: string[]): string | undefined {
  for (const label of labels) {
    for (const abschnitt of vorgang.summary) {
      const wert = abschnitt.rows.find((zeile) => zeile.label === label)?.value?.trim();
      if (wert && wert !== '—') return wert;
    }
  }
  return undefined;
}

function text(wert: unknown): string | undefined {
  return typeof wert === 'string' && wert.trim() ? wert.trim() : undefined;
}

/** Marke, Modell und Baujahr — aus der Zusammenfassung, sonst aus den Formulardaten. */
export function fahrzeugText(vorgang: BusinessRecord): string | undefined {
  const daten = vorgang.payload ?? {};
  const marke = angabe(vorgang, 'Marke') ?? text(daten.makeName);
  const modell = angabe(vorgang, 'Modell', 'Modell (Angabe des Kunden)') ?? text(daten.modelName);
  const baujahr = angabe(vorgang, 'Baujahr / Erstzulassung') ?? (daten.year ? String(daten.year) : undefined);
  const fahrzeug = [marke, modell].filter(Boolean).join(' ');
  if (!fahrzeug) return undefined;
  return baujahr ? `${fahrzeug} (${baujahr})` : fahrzeug;
}

/** Gewünschte Leistung — geprüft aus den Stammdaten, sonst die Angabe im Formular. */
export function leistungText(vorgang: BusinessRecord): string {
  return angabe(vorgang, 'Gewünschte Leistung') ?? text(vorgang.payload?.serviceLabel) ?? BEREICH_LABEL[vorgang.area];
}

export interface RueckrufDaten {
  vorgang: BusinessRecord;
  /** Link auf den Vorgang im Backend. */
  adminUrl: string;
  kontext: VorlagenKontext;
}

export function betriebRueckrufEmpfohlen({ vorgang, adminUrl, kontext }: RueckrufDaten): MailInhalt {
  const name = [vorgang.contact.firstName, vorgang.contact.lastName].filter(Boolean).join(' ');
  const fahrzeug = fahrzeugText(vorgang);
  return baueMail({
    betreff: `Rückruf empfohlen: Anzahlung nicht eingegangen – ${vorgang.reference}`,
    vorschau: `${name} hat die Anzahlung nicht abgeschlossen.`,
    anrede: 'Hallo Team,',
    bausteine: [
      {
        art: 'absatz',
        text:
          'die Anzahlung zu diesem Termin ist nicht eingegangen (abgebrochen, abgelehnt oder abgelaufen). Das '
          + 'Zeitfenster ist wieder frei, der Kunde hat eine Mail mit dem Link zur neuen Buchung erhalten. '
          + 'Ein kurzer Rückruf wird empfohlen.',
      },
      {
        art: 'felder',
        zeilen: [
          ['Vorgangsnummer', vorgang.reference],
          ['Name', name],
          ['Telefon', vorgang.contact.phone],
          ...(fahrzeug ? [['Fahrzeug', fahrzeug] as [string, string]] : []),
          ['Leistung', leistungText(vorgang)],
          ...terminZeilen(vorgang, kontext.firma).map(([label, wert]): [string, string] =>
            label === 'Termin' ? ['Freigegebener Termin', wert] : [label, wert],
          ),
        ],
      },
      { art: 'knopf', href: adminUrl, label: 'Im Backend öffnen' },
    ],
    site: kontext.site,
  });
}
