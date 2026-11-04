/*
 * Rückruf-Anfrage „Beratung“ (G-34, E6-BAUMEISTER-04): die Angaben des Formulars, ihre Prüfung
 * und die Zusammenfassung für den Vorgang.
 *
 * Der Rückruf kommt immer per Telefon. Eine Zusage zu Rückrufzeiten, Fristen oder Preisen gibt es hier
 * nicht (R4, R9). Das Zeitfenster ist ein Wunsch des Kunden. Reine Funktionen ohne React.
 */

import type { SummarySection } from '@/lib/types';

export const THEMEN = [
  'Elektronische Schließsysteme',
  'Türen und Schließtechnik',
  'Sicherheitstechnik',
  'Schlüsselaufbewahrung',
  'Etwas anderes',
] as const;

export type Thema = (typeof THEMEN)[number];
export type Zeitfenster = 'vormittags' | 'nachmittags' | 'egal';
export type BeratungSchritt = 'anliegen' | 'kontakt' | 'absenden';

export const BESCHREIBUNG_MINDESTENS = 10;
export const BESCHREIBUNG_HOECHSTENS = 2000;
export const TELEFON_MINDESTENS_ZIFFERN = 6;

export const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface BeratungDaten {
  thema: Thema | '';
  beschreibung: string;
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  postleitzahl: string;
  ort: string;
  zeitfenster: Zeitfenster | '';
}

export const INITIAL: BeratungDaten = {
  thema: '',
  beschreibung: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  postleitzahl: '',
  ort: '',
  zeitfenster: '',
};

export const ZEITFENSTER_LABEL: Record<Zeitfenster, string> = {
  vormittags: 'Vormittags',
  nachmittags: 'Nachmittags',
  egal: 'Egal',
};

export const SCHRITTE: BeratungSchritt[] = ['anliegen', 'kontakt', 'absenden'];

export function istSchritt(wert: string): wert is BeratungSchritt {
  return (SCHRITTE as string[]).includes(wert);
}

const laenge = (wert: string) => wert.trim().length;

function anliegenGueltig(daten: BeratungDaten): boolean {
  return (
    (THEMEN as readonly string[]).includes(daten.thema)
    && laenge(daten.beschreibung) >= BESCHREIBUNG_MINDESTENS
    && laenge(daten.beschreibung) <= BESCHREIBUNG_HOECHSTENS
  );
}

/**
 * Telefon und E-Mail sind Pflicht, das Zeitfenster ebenfalls. Postleitzahl und Ort sind frei.
 */
function kontaktGueltig(daten: BeratungDaten): boolean {
  if (laenge(daten.vorname) < 2 || laenge(daten.nachname) < 2) return false;
  if (!EMAIL_MUSTER.test(daten.email.trim())) return false;
  if (daten.telefon.replace(/\D/g, '').length < TELEFON_MINDESTENS_ZIFFERN) return false;
  return daten.zeitfenster === 'vormittags' || daten.zeitfenster === 'nachmittags' || daten.zeitfenster === 'egal';
}

/** Prüft einen Schritt. „absenden“ ist gültig, wenn die Schritte davor gültig sind. */
export function schrittGueltig(daten: BeratungDaten, schritt: BeratungSchritt): boolean {
  if (schritt === 'anliegen') return anliegenGueltig(daten);
  if (schritt === 'kontakt') return kontaktGueltig(daten);
  return anliegenGueltig(daten) && kontaktGueltig(daten);
}

/** Zusammenfassung für den Vorgang: Abschnitte „Anliegen“ und „Kontakt und Rückruf“. */
export function beratungZusammenfassung(daten: BeratungDaten, anzahlFotos = 0): SummarySection[] {
  const name = [daten.anrede, daten.vorname, daten.nachname].map((teil) => teil.trim()).filter(Boolean).join(' ');
  const ort = [daten.postleitzahl, daten.ort].map((teil) => teil.trim()).filter(Boolean).join(' ');

  return [
    {
      title: 'Anliegen',
      rows: [
        { label: 'Thema', value: daten.thema || 'keine Angabe' },
        { label: 'Beschreibung', value: daten.beschreibung.trim() || 'keine Angabe' },
        { label: 'Fotos', value: anzahlFotos > 0 ? `${anzahlFotos} Datei(en)` : 'keine' },
      ],
    },
    {
      title: 'Kontakt und Rückruf',
      rows: [
        { label: 'Name', value: name || 'keine Angabe' },
        { label: 'E-Mail', value: daten.email.trim() || 'keine Angabe' },
        { label: 'Telefon', value: daten.telefon.trim() || 'keine Angabe' },
        { label: 'Ort', value: ort || 'keine Angabe' },
        { label: 'Zeitfenster', value: ZEITFENSTER_LABEL[daten.zeitfenster as Zeitfenster] ?? 'keine Angabe' },
      ],
    },
  ];
}
