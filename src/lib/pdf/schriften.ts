import { readFile } from 'node:fs/promises';
import path from 'node:path';

/*
 * Schriften der PDF-Blätter (A-004, A-015): IBM Plex Sans 400 und 600 als WOFF aus
 * @fontsource/ibm-plex-sans (latin und latin-ext) und IBM Plex Mono 400 als WOFF aus src/fonts/pdf.
 * fontkit bricht ab, wenn eine Teilschrift ein Zeichen zeichnen soll, das sie nicht enthält;
 * deshalb läuft jeder Text in Läufe je Schriftdatei (`laeufe`), und Zeichen ohne Glyphe in
 * beiden Teilen werden zu „?“.
 */

export type Schnitt = 'normal' | 'fett' | 'mono';

export interface SchriftDatei {
  /** Name für `doc.registerFont`. */
  name: string;
  datei: string;
}

const FONTSOURCE = 'node_modules/@fontsource/ibm-plex-sans/files';

/** Je Schnitt die Teile in Reihenfolge der Bevorzugung. */
export const SCHRIFTEN: Record<Schnitt, SchriftDatei[]> = {
  normal: [
    { name: 'plex-400', datei: `${FONTSOURCE}/ibm-plex-sans-latin-400-normal.woff` },
    { name: 'plex-400-ext', datei: `${FONTSOURCE}/ibm-plex-sans-latin-ext-400-normal.woff` },
  ],
  fett: [
    { name: 'plex-600', datei: `${FONTSOURCE}/ibm-plex-sans-latin-600-normal.woff` },
    { name: 'plex-600-ext', datei: `${FONTSOURCE}/ibm-plex-sans-latin-ext-600-normal.woff` },
  ],
  mono: [
    /* WOFF statt WOFF2: fontkit setzt aus der WOFF2-Datei keine sichtbaren Glyphen (gemessen E3-OPUS-04). */
    { name: 'plex-mono-400', datei: 'src/fonts/pdf/ibm-plex-mono-latin-400.woff' },
    { name: 'plex-400-ext', datei: `${FONTSOURCE}/ibm-plex-sans-latin-ext-400-normal.woff` },
    /* Leerzeichen liest fontkit aus Plex Mono nicht; sie laufen in Plex Sans. */
    { name: 'plex-400', datei: `${FONTSOURCE}/ibm-plex-sans-latin-400-normal.woff` },
  ],
};

/** Alle Dateien (für outputFileTracingIncludes in next.config.ts und den Test). */
export const SCHRIFT_DATEIEN = [...new Set(Object.values(SCHRIFTEN).flat().map((s) => s.datei))];

const cache = new Map<string, Promise<Buffer>>();

/** Liest eine Schriftdatei relativ zum Projekt (einmal je Prozess). */
export function schriftDaten(datei: string): Promise<Buffer> {
  let daten = cache.get(datei);
  if (!daten) {
    // Die Dateien nimmt next.config.ts ausdrücklich mit (outputFileTracingIncludes); ohne den
    // Hinweis verfolgte Turbopack sonst das ganze Projekt in jede Funktion.
    daten = readFile(path.join(/* turbopackIgnore: true */ process.cwd(), datei));
    cache.set(datei, daten);
  }
  return daten;
}

export interface Lauf {
  schrift: string;
  text: string;
}

/**
 * Teilt Text in Läufe je Schriftteil. `hat(name, zeichen)` sagt, ob ein Teil die Glyphe hat.
 * Zeilenumbrüche und Leerzeichen bleiben im laufenden Teil. Unbekanntes wird „?“.
 */
export function laeufe(text: string, teile: string[], hat: (schrift: string, codepoint: number) => boolean): Lauf[] {
  const ergebnis: Lauf[] = [];
  const normal = text.normalize('NFC');
  for (const zeichen of normal) {
    let ausgabe = zeichen === '\t' ? ' ' : zeichen;
    const cp = ausgabe.codePointAt(0) ?? 63;
    // Ein Zeilenumbruch ist für pdfkit keine Glyphe: Er bleibt im laufenden Teil.
    const umbruch = ausgabe === '\n';
    let schrift = umbruch ? (ergebnis[ergebnis.length - 1]?.schrift ?? teile[0]) : teile.find((t) => hat(t, cp));
    if (!schrift) {
      schrift = teile[0];
      ausgabe = '?';
    }
    const letzter = ergebnis[ergebnis.length - 1];
    if (letzter && letzter.schrift === schrift) letzter.text += ausgabe;
    else ergebnis.push({ schrift, text: ausgabe });
  }
  return ergebnis;
}
