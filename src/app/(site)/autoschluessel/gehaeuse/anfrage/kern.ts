/*
 * Autoschlüssel-Gehäuse-Anfrage (G-20, E6-BAUMEISTER-02): reine Funktionen ohne React. Marke und Modell sind
 * freie Eingaben. Es gibt keine Fahrzeugdatenbank und keine Modellliste. Fahrzeugschein und Schlüsselfoto
 * prüft das Formular selbst (R13).
 */

import { LIEFERLAND } from '@/lib/kasse';
import type { ContactDetails, SummarySection } from '@/lib/types';

export type TastenAntwort = '1-2' | '3-4' | 'unklar';
export type GehaeuseSchritt = 'fahrzeug' | 'tasten' | 'unterlagen' | 'kontakt' | 'absenden';

export interface GehaeuseDaten {
  marke: string;
  modell: string;
  baujahr: string;
  tasten: TastenAntwort | '';
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
}

export const INITIAL: GehaeuseDaten = {
  marke: '',
  modell: '',
  baujahr: '',
  tasten: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  plz: '',
  ort: '',
};

export const MAX_MARKE = 60;
export const MAX_MODELL = 80;
export const BAUJAHR_ERSTES = 1990;

/** Die drei Antworten der Pflichtfrage; die Erklärung dazu steht im Formular über den Karten. */
export const TASTEN_OPTIONEN: ReadonlyArray<{ wert: TastenAntwort; titel: string; satz: string }> = [
  { wert: '1-2', titel: '1 oder 2 Tasten', satz: 'Der Schlüssel hat eine oder zwei Tasten.' },
  { wert: '3-4', titel: '3 oder 4 Tasten', satz: 'Der Schlüssel hat drei oder vier Tasten.' },
  { wert: 'unklar', titel: 'Weiß ich nicht', satz: 'Wir klären es anhand Ihrer Fotos.' },
];

/** Wortlaut im Begleittext der Zusammenfassung. */
export const TASTEN_TEXT: Record<TastenAntwort, string> = {
  '1-2': '1 oder 2 Tasten',
  '3-4': '3 oder 4 Tasten',
  unklar: 'unklar, bitte prüfen',
};

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Genau vier Ziffern, zwischen 1990 und dem Jahr nach dem laufenden Jahr. */
export function baujahrGueltig(text: string, jahr: number = new Date().getFullYear()): boolean {
  const zahl = text.trim();
  if (!/^\d{4}$/.test(zahl)) return false;
  const wert = Number(zahl);
  return wert >= BAUJAHR_ERSTES && wert <= jahr + 1;
}

/** Prüft je Schritt die Angaben. Fotos stehen nicht hier: das Formular verlangt sie selbst. */
export function schrittGueltig(daten: GehaeuseDaten, schritt: GehaeuseSchritt, jahr: number = new Date().getFullYear()): boolean {
  switch (schritt) {
    case 'fahrzeug':
      return (
        daten.marke.trim().length >= 1
        && daten.marke.trim().length <= MAX_MARKE
        && daten.modell.trim().length >= 1
        && daten.modell.trim().length <= MAX_MODELL
        && baujahrGueltig(daten.baujahr, jahr)
      );
    case 'tasten':
      return daten.tasten === '1-2' || daten.tasten === '3-4' || daten.tasten === 'unklar';
    case 'kontakt':
      return (
        daten.vorname.trim().length > 1
        && daten.nachname.trim().length > 1
        && EMAIL_MUSTER.test(daten.email.trim())
        && daten.telefon.replace(/\D/g, '').length >= 6
        && (!daten.plz.trim() || /^\d{5}$/.test(daten.plz.trim()))
      );
    default:
      return true;
  }
}

/** Zusammenfassung für Vorschau, Bestätigung und Vorgangsblatt. */
export function gehaeuseZusammenfassung(daten: GehaeuseDaten): SummarySection[] {
  const anschrift = [daten.plz.trim(), daten.ort.trim()].filter(Boolean).join(' ');
  return [
    {
      title: 'Fahrzeug und Schlüssel',
      rows: [
        { label: 'Marke', value: daten.marke.trim() || 'fehlt noch' },
        { label: 'Modell', value: daten.modell.trim() || 'fehlt noch' },
        { label: 'Baujahr', value: daten.baujahr.trim() || 'fehlt noch' },
        { label: 'Tasten am Schlüssel', value: daten.tasten ? TASTEN_TEXT[daten.tasten] : 'noch offen' },
      ],
    },
    {
      title: 'Kontakt',
      rows: [
        {
          label: 'Name',
          value: [daten.anrede.trim(), daten.vorname.trim(), daten.nachname.trim()].filter(Boolean).join(' '),
        },
        { label: 'E-Mail', value: daten.email.trim() },
        { label: 'Telefon', value: daten.telefon.trim() },
        { label: 'Anschrift', value: anschrift || 'keine Angabe' },
        { label: 'Versandland', value: LIEFERLAND || 'keine Angabe' },
      ],
    },
  ];
}

/** Kontakt für den Vorgang; das Land ist immer das Lieferland. */
export function kontaktAus(daten: GehaeuseDaten): ContactDetails {
  return {
    salutation: daten.anrede.trim() || undefined,
    firstName: daten.vorname.trim(),
    lastName: daten.nachname.trim(),
    email: daten.email.trim(),
    phone: daten.telefon.trim(),
    postalCode: daten.plz.trim() || undefined,
    city: daten.ort.trim() || undefined,
    country: LIEFERLAND,
  };
}

/** Nutzlast des Vorgangs. Die Pflichtfrage ist beim Absenden beantwortet; „unklar“ ist nur der Rückfall. */
export function payloadAus(daten: GehaeuseDaten) {
  return {
    quelle: 'gehaeuse',
    marke: daten.marke.trim(),
    modell: daten.modell.trim(),
    baujahr: Number(daten.baujahr.trim()),
    tasten: daten.tasten || 'unklar',
    anmerkung: null,
  };
}
