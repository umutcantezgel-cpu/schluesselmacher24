/*
 * Anfrage „Einsatz vor Ort“ (G-40, E6-BAUMEISTER-05): die Angaben des Formulars, ihre Prüfung
 * und die Zusammenfassung für den Vorgang. Die Vermittlung an Partner (E7) folgt später.
 *
 * Eine Zusage zu Terminen, Reaktionszeiten, Notdiensten oder Preisen gibt es hier nicht (R4, R9).
 * Der Wunschzeitraum ist ein Wunsch des Kunden. Vor Arbeiten an Türen und Schlössern wird die
 * Berechtigung bestätigt (R13). Reine Funktionen ohne React.
 */

import type { SummarySection } from '@/lib/types';

export const ANLIEGEN = [
  'Zylinder oder Schloss tauschen',
  'Tür nachrüsten oder sichern',
  'Schließanlage oder Zutritt vor Ort',
  'Etwas anderes',
] as const;

export type Anliegen = (typeof ANLIEGEN)[number];
export type Zeitraum = 'bald' | 'spaeter' | 'flexibel';
export type EinsatzSchritt = 'anliegen' | 'kontakt' | 'absenden';

export const BESCHREIBUNG_MINDESTENS = 10;
export const BESCHREIBUNG_HOECHSTENS = 2000;
export const TELEFON_MINDESTENS_ZIFFERN = 6;
export const POSTLEITZAHL_ZIFFERN = 5;
export const ORT_MINDESTENS = 2;

export const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const POSTLEITZAHL_MUSTER = /^\d{5}$/;

export interface EinsatzDaten {
  anliegen: Anliegen | '';
  beschreibung: string;
  postleitzahl: string;
  ort: string;
  strasse: string;
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  zeitraum: Zeitraum | '';
  berechtigt: boolean;
}

export const INITIAL: EinsatzDaten = {
  anliegen: '',
  beschreibung: '',
  postleitzahl: '',
  ort: '',
  strasse: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  zeitraum: '',
  berechtigt: false,
};

export const ZEITRAUM_LABEL: Record<Zeitraum, string> = {
  bald: 'In den nächsten Tagen',
  spaeter: 'In den nächsten Wochen',
  flexibel: 'Ich bin flexibel',
};

export const SCHRITTE: EinsatzSchritt[] = ['anliegen', 'kontakt', 'absenden'];

export function istSchritt(wert: string): wert is EinsatzSchritt {
  return (SCHRITTE as string[]).includes(wert);
}

const laenge = (wert: string) => wert.trim().length;

/** Fünf Ziffern, sonst nichts. */
export function postleitzahlGueltig(wert: string): boolean {
  return POSTLEITZAHL_MUSTER.test(wert.trim());
}

function anliegenGueltig(daten: EinsatzDaten): boolean {
  return (
    (ANLIEGEN as readonly string[]).includes(daten.anliegen)
    && laenge(daten.beschreibung) >= BESCHREIBUNG_MINDESTENS
    && laenge(daten.beschreibung) <= BESCHREIBUNG_HOECHSTENS
    && postleitzahlGueltig(daten.postleitzahl)
    && laenge(daten.ort) >= ORT_MINDESTENS
  );
}

/**
 * Name, Telefon, E-Mail, Wunschzeitraum und Berechtigung sind Pflicht. Straße ist frei.
 */
function kontaktGueltig(daten: EinsatzDaten): boolean {
  if (laenge(daten.vorname) < 2 || laenge(daten.nachname) < 2) return false;
  if (!EMAIL_MUSTER.test(daten.email.trim())) return false;
  if (daten.telefon.replace(/\D/g, '').length < TELEFON_MINDESTENS_ZIFFERN) return false;
  if (!(daten.zeitraum === 'bald' || daten.zeitraum === 'spaeter' || daten.zeitraum === 'flexibel')) return false;
  return daten.berechtigt === true;
}

/** Prüft einen Schritt. „absenden“ ist gültig, wenn die Schritte davor gültig sind. */
export function schrittGueltig(daten: EinsatzDaten, schritt: EinsatzSchritt): boolean {
  if (schritt === 'anliegen') return anliegenGueltig(daten);
  if (schritt === 'kontakt') return kontaktGueltig(daten);
  return anliegenGueltig(daten) && kontaktGueltig(daten);
}

/** Zusammenfassung für den Vorgang: Abschnitte „Anliegen und Ort“ und „Kontakt“. */
export function einsatzZusammenfassung(daten: EinsatzDaten, anzahlFotos = 0): SummarySection[] {
  const name = [daten.anrede, daten.vorname, daten.nachname].map((teil) => teil.trim()).filter(Boolean).join(' ');
  const ort = [daten.postleitzahl, daten.ort].map((teil) => teil.trim()).filter(Boolean).join(' ');

  return [
    {
      title: 'Anliegen und Ort',
      rows: [
        { label: 'Anliegen', value: daten.anliegen || 'keine Angabe' },
        { label: 'Beschreibung', value: daten.beschreibung.trim() || 'keine Angabe' },
        { label: 'Fotos', value: anzahlFotos > 0 ? `${anzahlFotos} Datei(en)` : 'keine' },
        { label: 'Ort', value: ort || 'keine Angabe' },
        { label: 'Straße', value: daten.strasse.trim() || 'keine Angabe' },
      ],
    },
    {
      title: 'Kontakt',
      rows: [
        { label: 'Name', value: name || 'keine Angabe' },
        { label: 'E-Mail', value: daten.email.trim() || 'keine Angabe' },
        { label: 'Telefon', value: daten.telefon.trim() || 'keine Angabe' },
        { label: 'Wunschzeitraum', value: ZEITRAUM_LABEL[daten.zeitraum as Zeitraum] ?? 'keine Angabe' },
        { label: 'Berechtigung', value: daten.berechtigt ? 'bestätigt' : 'keine Angabe' },
      ],
    },
  ];
}
