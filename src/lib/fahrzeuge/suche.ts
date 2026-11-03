/*
 * Fahrzeugsuche mit Tippfehlertoleranz (G-14): Marke und Reihe in einem Feld, Umlaute und
 * Akzente egal, gängige Kurzformen (VW, Benz), ein bis zwei Tippfehler je Wort. Gewichtet nach
 * Bestand laut KBA, damit häufige Fahrzeuge zuerst stehen. Reine Funktionen.
 */

import type { FahrzeugReihe } from '../types';

/** Kleinschreibung, ohne Akzente, ß als ss, nur Buchstaben und Ziffern. */
export function normalisiere(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Kurzformen von Marken (Suchwort → Teil des Markennamens). */
export const MARKEN_ALIAS: Readonly<Record<string, string>> = {
  vw: 'volkswagen',
  benz: 'mercedes',
  mb: 'mercedes',
  merc: 'mercedes',
  chevy: 'chevrolet',
  alfa: 'alfa romeo',
  landrover: 'land rover',
  ssangyong: 'kgm',
  bmw: 'bmw',
};

/** Abstand nach Damerau-Levenshtein (Vertauschung zählt einmal), mit Abbruch über `grenze`. */
export function abstand(a: string, b: string, grenze = 3): number {
  if (Math.abs(a.length - b.length) > grenze) return grenze + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) d[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    let zeileMin = Infinity;
    for (let j = 1; j <= b.length; j += 1) {
      const kosten = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + kosten);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      zeileMin = Math.min(zeileMin, d[i][j]);
    }
    if (zeileMin > grenze) return grenze + 1;
  }
  return d[a.length][b.length];
}

/** Erlaubte Tippfehler je Wortlänge: bis 3 Zeichen keiner, bis 6 einer, darüber zwei. */
function erlaubt(laenge: number): number {
  return laenge <= 3 ? 0 : laenge <= 6 ? 1 : 2;
}

/** Punkte für ein Suchwort gegen die Wörter einer Reihe: genau 3, Anfang 2, Tippfehler 1, sonst 0. */
function wortPunkte(wort: string, woerter: string[]): number {
  let beste = 0;
  for (const w of woerter) {
    if (w === wort) return 3;
    if (w.startsWith(wort) && wort.length >= 1) beste = Math.max(beste, 2);
    else if (erlaubt(wort.length) > 0 && abstand(wort, w, erlaubt(wort.length)) <= erlaubt(wort.length)) beste = Math.max(beste, 1);
  }
  return beste;
}

/** Felder, die die Suche liest; ein schlanker Index für den Browser genügt (E4-OPUS-05). */
export type SuchReihe = Pick<FahrzeugReihe, 'marke' | 'reihe' | 'alias' | 'bestand' | 'sichtbar'>;

export interface Treffer<T extends SuchReihe = FahrzeugReihe> {
  reihe: T;
  punkte: number;
}

/**
 * Generationsangaben wie „7“, „8V“ oder „VII“ (etwa „Golf 7“): Der Katalog führt Modellreihen ohne
 * Generation. Passt ein solches Wort nicht, schließt es eine Reihe nicht aus (E4-PROBENUTZER-01).
 */
const GENERATION = /^(\d+[a-z]?|[ivx]{1,4})$/;

/** Sucht Reihen zu einer Eingabe wie „vw golf“, „Mercedes A Klasse“ oder „Volkswagn Glf“. */
export function sucheFahrzeuge<T extends SuchReihe = FahrzeugReihe>(anfrage: string, katalog: readonly T[], { hoechstens = 8 } = {}): Treffer<T>[] {
  const roh = normalisiere(anfrage).split(' ').filter(Boolean);
  if (!roh.length) return [];
  const woerter = roh.flatMap((w) => normalisiere(MARKEN_ALIAS[w] ?? w).split(' '));
  const treffer: Treffer<T>[] = [];
  for (const reihe of katalog) {
    if (!reihe.sichtbar) continue;
    const text = normalisiere([reihe.marke, reihe.reihe, ...(reihe.alias ?? [])].join(' '));
    const eigene = text.split(' ').concat(text.replace(/ /g, ''));
    let summe = 0;
    let alle = true;
    for (const wort of woerter) {
      const p = wortPunkte(wort, eigene);
      if (p === 0) {
        if (GENERATION.test(wort)) continue;
        alle = false;
        break;
      }
      summe += p;
    }
    if (!alle || summe === 0) continue;
    const gewicht = reihe.bestand ? Math.log10(reihe.bestand + 1) / 10 : 0;
    treffer.push({ reihe, punkte: summe + gewicht });
  }
  return treffer.sort((a, b) => b.punkte - a.punkte || a.reihe.marke.localeCompare(b.reihe.marke, 'de') || a.reihe.reihe.localeCompare(b.reihe.reihe, 'de')).slice(0, hoechstens);
}
