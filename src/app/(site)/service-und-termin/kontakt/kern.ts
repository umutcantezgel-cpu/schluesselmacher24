/*
 * Nachricht an die Werkstatt (G-36, E6-BAUMEISTER-03): die Angaben des Kontaktformulars, ihre Prüfung
 * und die Zusammenfassung für den Vorgang.
 *
 * Der Kunde wählt nur, auf welchem Weg er die Antwort bekommt. Eine Zusage zu Antwort- oder Rückruf-
 * zeiten gibt es hier nicht (R4, R9). Reine Funktionen ohne React.
 */

import type { SummarySection } from '@/lib/types';

export const ANLIEGEN = [
  'Frage zu einem laufenden Auftrag',
  'Frage zu einer Leistung',
  'Rückmeldung zu unserer Arbeit',
  'Etwas anderes',
] as const;

export type Anliegen = (typeof ANLIEGEN)[number];
export type Antwortweg = 'email' | 'telefon';
export type Zeitfenster = 'vormittags' | 'nachmittags' | 'egal';
export type KontaktSchritt = 'nachricht' | 'kontakt' | 'absenden';

export const NACHRICHT_MINDESTENS = 10;
export const NACHRICHT_HOECHSTENS = 2000;
export const VORGANGSNUMMER_HOECHSTENS = 40;
export const TELEFON_MINDESTENS_ZIFFERN = 6;

export const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface KontaktDaten {
  anliegen: Anliegen | '';
  nachricht: string;
  vorgangsnummer: string;
  antwortweg: Antwortweg | '';
  zeitfenster: Zeitfenster | '';
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
}

export const INITIAL: KontaktDaten = {
  anliegen: '',
  nachricht: '',
  vorgangsnummer: '',
  antwortweg: '',
  zeitfenster: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
};

export const ZEITFENSTER_LABEL: Record<Zeitfenster, string> = {
  vormittags: 'Vormittags',
  nachmittags: 'Nachmittags',
  egal: 'Egal',
};

export const SCHRITTE: KontaktSchritt[] = ['nachricht', 'kontakt', 'absenden'];

export function istSchritt(wert: string): wert is KontaktSchritt {
  return (SCHRITTE as string[]).includes(wert);
}

const laenge = (wert: string) => wert.trim().length;

function nachrichtGueltig(daten: KontaktDaten): boolean {
  return (
    (ANLIEGEN as readonly string[]).includes(daten.anliegen)
    && laenge(daten.nachricht) >= NACHRICHT_MINDESTENS
    && laenge(daten.nachricht) <= NACHRICHT_HOECHSTENS
    && laenge(daten.vorgangsnummer) <= VORGANGSNUMMER_HOECHSTENS
  );
}

/**
 * Telefon ist immer Pflicht: Jeder Vorgang trägt eine Telefonnummer (Pflichtfeld im Backend), auch wenn
 * die Antwort per E-Mail kommen soll. Das Zeitfenster gilt nur beim Antwortweg Telefon.
 */
function kontaktGueltig(daten: KontaktDaten): boolean {
  if (laenge(daten.vorname) < 2 || laenge(daten.nachname) < 2) return false;
  if (!EMAIL_MUSTER.test(daten.email.trim())) return false;
  if (daten.telefon.replace(/\D/g, '').length < TELEFON_MINDESTENS_ZIFFERN) return false;
  if (daten.antwortweg === 'email') return true;
  if (daten.antwortweg === 'telefon') {
    return daten.zeitfenster === 'vormittags' || daten.zeitfenster === 'nachmittags' || daten.zeitfenster === 'egal';
  }
  return false;
}

/** Prüft einen Schritt. „absenden“ ist gültig, wenn die Schritte davor gültig sind. */
export function schrittGueltig(daten: KontaktDaten, schritt: KontaktSchritt): boolean {
  if (schritt === 'nachricht') return nachrichtGueltig(daten);
  if (schritt === 'kontakt') return kontaktGueltig(daten);
  return nachrichtGueltig(daten) && kontaktGueltig(daten);
}

/** Zusammenfassung für den Vorgang: Abschnitte „Nachricht“ und „Kontakt“. */
export function kontaktZusammenfassung(daten: KontaktDaten, anzahlFotos = 0): SummarySection[] {
  const telefonWeg = daten.antwortweg === 'telefon';
  const name = [daten.anrede, daten.vorname, daten.nachname].map((teil) => teil.trim()).filter(Boolean).join(' ');

  return [
    {
      title: 'Nachricht',
      rows: [
        { label: 'Anliegen', value: daten.anliegen || 'keine Angabe' },
        { label: 'Nachricht', value: daten.nachricht.trim() || 'keine Angabe' },
        { label: 'Vorgangsnummer', value: daten.vorgangsnummer.trim() || 'keine Angabe' },
        { label: 'Fotos', value: anzahlFotos > 0 ? `${anzahlFotos} Datei(en)` : 'keine' },
      ],
    },
    {
      title: 'Kontakt',
      rows: [
        { label: 'Name', value: name || 'keine Angabe' },
        { label: 'E-Mail', value: daten.email.trim() || 'keine Angabe' },
        {
          label: 'Antwort per',
          value: daten.antwortweg === 'telefon' ? 'Telefon' : daten.antwortweg === 'email' ? 'E-Mail' : 'keine Angabe',
        },
        { label: 'Telefon', value: daten.telefon.trim() || 'keine Angabe' },
        ...(telefonWeg ? [{ label: 'Zeitfenster', value: ZEITFENSTER_LABEL[daten.zeitfenster as Zeitfenster] ?? 'keine Angabe' }] : []),
      ],
    },
  ];
}
