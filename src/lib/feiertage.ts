import type { FederalState } from '@/lib/types';

/* ==========================================================================
   Gesetzliche Feiertage
   Ostern nach der Gaußschen Osterformel (mit der Ergänzung von Lichtenberg),
   dazu die festen Tage. Je Bundesland nur landesweite Feiertage — Tage, die
   nur in einzelnen Gemeinden gelten (Mariä Himmelfahrt in Bayern,
   Fronleichnam in Teilen Sachsens und Thüringens, Augsburger Friedensfest),
   pflegt das Team bei Bedarf als Sperrtag.
   ========================================================================== */

export interface Feiertag {
  /** ISO-Datum. */
  date: string;
  name: string;
}

/** Ohne Angabe gilt Hessen (Sitz der Werkstatt). */
export const STANDARD_BUNDESLAND: FederalState = 'HE';

const ALLE: readonly FederalState[] = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'];

function iso(jahr: number, monat: number, tag: number): string {
  // UTC, damit die Zeitzone des Servers keine Rolle spielt.
  return new Date(Date.UTC(jahr, monat - 1, tag)).toISOString().slice(0, 10);
}

/**
 * Ostersonntag nach Gauß: Tag im März (32 = 1. April) als Datum.
 * Gültig für den gregorianischen Kalender.
 */
export function ostersonntag(jahr: number): string {
  const k = Math.floor(jahr / 100);
  const m = 15 + Math.floor((3 * k + 3) / 4) - Math.floor((8 * k + 13) / 25);
  const s = 2 - Math.floor((3 * k + 3) / 4);
  const a = jahr % 19;
  const d = (19 * a + m) % 30;
  const r = Math.floor(d / 29) + (Math.floor(d / 28) - Math.floor(d / 29)) * Math.floor(a / 11);
  const og = 21 + d - r;
  const sz = 7 - ((jahr + Math.floor(jahr / 4) + s) % 7);
  const oe = 7 - ((og - sz) % 7);
  return iso(jahr, 3, og + oe);
}

function plusTage(isoDatum: string, tage: number): string {
  const [j, m, t] = isoDatum.split('-').map(Number);
  return iso(j, m, t + tage);
}

/** Buß- und Bettag: der Mittwoch vor dem 23. November. */
function bussUndBettag(jahr: number): string {
  const wochentag = new Date(Date.UTC(jahr, 10, 22)).getUTCDay(); // 0 = Sonntag
  const zurueck = (wochentag - 3 + 7) % 7;
  return iso(jahr, 11, 22 - zurueck);
}

interface Regel {
  name: string;
  datum: (jahr: number, ostern: string) => string;
  laender: readonly FederalState[];
  /** Erstes Jahr, in dem der Feiertag gilt. */
  ab?: number;
}

const fest = (monat: number, tag: number) => (jahr: number) => iso(jahr, monat, tag);
const ostern = (tage: number) => (_jahr: number, sonntag: string) => plusTage(sonntag, tage);

const REGELN: readonly Regel[] = [
  { name: 'Neujahr', datum: fest(1, 1), laender: ALLE },
  { name: 'Heilige Drei Könige', datum: fest(1, 6), laender: ['BW', 'BY', 'ST'] },
  { name: 'Internationaler Frauentag', datum: fest(3, 8), laender: ['BE'], ab: 2019 },
  { name: 'Internationaler Frauentag', datum: fest(3, 8), laender: ['MV'], ab: 2023 },
  { name: 'Karfreitag', datum: ostern(-2), laender: ALLE },
  { name: 'Ostersonntag', datum: ostern(0), laender: ['BB', 'HE'] },
  { name: 'Ostermontag', datum: ostern(1), laender: ALLE },
  { name: 'Tag der Arbeit', datum: fest(5, 1), laender: ALLE },
  { name: 'Christi Himmelfahrt', datum: ostern(39), laender: ALLE },
  { name: 'Pfingstsonntag', datum: ostern(49), laender: ['BB', 'HE'] },
  { name: 'Pfingstmontag', datum: ostern(50), laender: ALLE },
  { name: 'Fronleichnam', datum: ostern(60), laender: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'] },
  { name: 'Mariä Himmelfahrt', datum: fest(8, 15), laender: ['SL'] },
  { name: 'Weltkindertag', datum: fest(9, 20), laender: ['TH'], ab: 2019 },
  { name: 'Tag der Deutschen Einheit', datum: fest(10, 3), laender: ALLE },
  { name: 'Reformationstag', datum: fest(10, 31), laender: ['BB', 'MV', 'SN', 'ST', 'TH'] },
  { name: 'Reformationstag', datum: fest(10, 31), laender: ['HB', 'HH', 'NI', 'SH'], ab: 2018 },
  { name: 'Allerheiligen', datum: fest(11, 1), laender: ['BW', 'BY', 'NW', 'RP', 'SL'] },
  { name: 'Buß- und Bettag', datum: (jahr) => bussUndBettag(jahr), laender: ['SN'] },
  { name: '1. Weihnachtstag', datum: fest(12, 25), laender: ALLE },
  { name: '2. Weihnachtstag', datum: fest(12, 26), laender: ALLE },
];

const zwischenspeicher = new Map<string, Feiertag[]>();

/** Gesetzliche Feiertage eines Bundeslands in einem Jahr, nach Datum sortiert. */
export function gesetzlicheFeiertage(jahr: number, land: FederalState = STANDARD_BUNDESLAND): Feiertag[] {
  const schluessel = `${land}:${jahr}`;
  const vorhanden = zwischenspeicher.get(schluessel);
  if (vorhanden) return vorhanden;
  const sonntag = ostersonntag(jahr);
  const liste = REGELN.filter((regel) => regel.laender.includes(land) && (regel.ab === undefined || jahr >= regel.ab))
    .map((regel) => ({ date: regel.datum(jahr, sonntag), name: regel.name }))
    .sort((a, b) => a.date.localeCompare(b.date));
  zwischenspeicher.set(schluessel, liste);
  return liste;
}

/** Der Feiertag an diesem Tag, sonst `undefined`. */
export function feiertagAm(isoDatum: string, land: FederalState = STANDARD_BUNDESLAND): Feiertag | undefined {
  const jahr = Number(isoDatum.slice(0, 4));
  if (!Number.isInteger(jahr)) return undefined;
  return gesetzlicheFeiertage(jahr, land).find((tag) => tag.date === isoDatum);
}
