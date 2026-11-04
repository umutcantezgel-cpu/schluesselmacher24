/*
 * Motorradschlüssel-Anfrage (G-19, E6-BAUMEISTER-01): reine Funktionen ohne React. Hersteller und Typ sind
 * freie Eingaben. Es gibt keine Fahrzeugdatenbank und keine Modellliste (G-19). Fahrzeugschein und
 * Schlüsselfoto prüft das Formular selbst (R13).
 */

import { LIEFERLAND } from '@/lib/kasse';
import type { ContactDetails, SummarySection } from '@/lib/types';

export type TransponderAntwort = 'ja' | 'nein' | 'unklar';
export type MotorradSchritt = 'motorrad' | 'transponder' | 'unterlagen' | 'kontakt' | 'absenden';

export interface MotorradDaten {
  hersteller: string;
  modell: string;
  baujahr: string;
  transponder: TransponderAntwort | '';
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
}

export const INITIAL: MotorradDaten = {
  hersteller: '',
  modell: '',
  baujahr: '',
  transponder: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  plz: '',
  ort: '',
};

export const MAX_HERSTELLER = 60;
export const MAX_MODELL = 80;
export const BAUJAHR_ERSTES = 1950;

/** Die drei Antworten der Pflichtfrage; die Erklärung dazu steht im Formular über den Karten. */
export const TRANSPONDER_OPTIONEN: ReadonlyArray<{ wert: TransponderAntwort; titel: string; satz: string }> = [
  { wert: 'ja', titel: 'Ja, mit Chip', satz: 'Der Schlüssel hat einen Chip, der in der Wegfahrsperre erkannt wird.' },
  { wert: 'nein', titel: 'Nein, ohne Chip', satz: 'Der Schlüssel hat keinen Chip.' },
  { wert: 'unklar', titel: 'Weiß ich nicht', satz: 'Wir klären es anhand Ihrer Fotos.' },
];

/** Wortlaut im Begleittext der Zusammenfassung. */
export const TRANSPONDER_TEXT: Record<TransponderAntwort, string> = {
  ja: 'mit Chip',
  nein: 'ohne Chip',
  unklar: 'unklar, bitte prüfen',
};

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Genau vier Ziffern, zwischen 1950 und dem Jahr nach dem laufenden Jahr. */
export function baujahrGueltig(text: string, jahr: number = new Date().getFullYear()): boolean {
  const zahl = text.trim();
  if (!/^\d{4}$/.test(zahl)) return false;
  const wert = Number(zahl);
  return wert >= BAUJAHR_ERSTES && wert <= jahr + 1;
}

/** Prüft je Schritt die Angaben. Fotos stehen nicht hier: das Formular verlangt sie selbst. */
export function schrittGueltig(daten: MotorradDaten, schritt: MotorradSchritt, jahr: number = new Date().getFullYear()): boolean {
  switch (schritt) {
    case 'motorrad':
      return (
        daten.hersteller.trim().length >= 1
        && daten.hersteller.trim().length <= MAX_HERSTELLER
        && daten.modell.trim().length >= 1
        && daten.modell.trim().length <= MAX_MODELL
        && baujahrGueltig(daten.baujahr, jahr)
      );
    case 'transponder':
      return daten.transponder === 'ja' || daten.transponder === 'nein' || daten.transponder === 'unklar';
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
export function motorradZusammenfassung(daten: MotorradDaten): SummarySection[] {
  const anschrift = [daten.plz.trim(), daten.ort.trim()].filter(Boolean).join(' ');
  return [
    {
      title: 'Motorrad',
      rows: [
        { label: 'Hersteller', value: daten.hersteller.trim() || 'fehlt noch' },
        { label: 'Modell oder Typ', value: daten.modell.trim() || 'fehlt noch' },
        { label: 'Baujahr', value: daten.baujahr.trim() || 'fehlt noch' },
        { label: 'Chip im Schlüssel', value: daten.transponder ? TRANSPONDER_TEXT[daten.transponder] : 'noch offen' },
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
export function kontaktAus(daten: MotorradDaten): ContactDetails {
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
export function payloadAus(daten: MotorradDaten) {
  return {
    quelle: 'motorrad',
    hersteller: daten.hersteller.trim(),
    modell: daten.modell.trim(),
    baujahr: Number(daten.baujahr.trim()),
    transponder: daten.transponder || 'unklar',
    anmerkung: null,
  };
}
