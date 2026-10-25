#!/usr/bin/env node
/**
 * Misst, wie ähnlich sich gleichartige Seiten im Text sind: Jaccard-Ähnlichkeit
 * der Wort-Trigramme des sichtbaren Hauptinhalts (`<main>`, ohne Skripte) je
 * Seitenpaar. Gelesen wird die Ausgabe eines Produktions-Builds.
 *
 *   SM24_DATA=json npx next build
 *   node scripts/textgleichheit.mjs            # liest .next/server/app
 *   node scripts/textgleichheit.mjs <ordner>   # anderer Build-Ordner (…/server/app)
 *
 * Ausgabe je Gruppe: Zahl der Seiten, Mittelwert, Median und Höchstwert der
 * paarweisen Ähnlichkeit (0 % = kein gemeinsames Trigramm, 100 % = textgleich).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const wurzel = path.resolve(process.argv[2] ?? path.join(process.cwd(), '.next/server/app'));

/** HTML-Dateien direkt in einem Ordner (ohne Unterordner). */
function htmlIn(ordner) {
  if (!existsSync(ordner)) return [];
  return readdirSync(ordner)
    .filter((name) => name.endsWith('.html'))
    .map((name) => path.join(ordner, name));
}

/** Unterordner eines Ordners. */
function ordnerIn(ordner) {
  if (!existsSync(ordner)) return [];
  return readdirSync(ordner)
    .map((name) => path.join(ordner, name))
    .filter((pfad) => statSync(pfad).isDirectory());
}

const ENTITAETEN = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Sichtbarer Text des Hauptinhalts. */
export function hauptText(html) {
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;
  return main
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (_, e) => {
      if (e.startsWith('#x') || e.startsWith('#X')) return String.fromCodePoint(parseInt(e.slice(2), 16));
      if (e.startsWith('#')) return String.fromCodePoint(Number(e.slice(1)));
      return ENTITAETEN[e.toLowerCase()] ?? ' ';
    });
}

/** Menge der Wort-Trigramme (klein geschrieben, nur Buchstaben und Ziffern). */
export function trigramme(text) {
  const woerter = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const menge = new Set();
  for (let i = 0; i + 2 < woerter.length; i += 1) menge.add(`${woerter[i]} ${woerter[i + 1]} ${woerter[i + 2]}`);
  return menge;
}

export function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  let gemeinsam = 0;
  for (const t of a) if (b.has(t)) gemeinsam += 1;
  return gemeinsam / (a.size + b.size - gemeinsam);
}

function auswerten(name, dateien) {
  const mengen = dateien.map((datei) => trigramme(hauptText(readFileSync(datei, 'utf8'))));
  const werte = [];
  for (let i = 0; i < mengen.length; i += 1) {
    for (let j = i + 1; j < mengen.length; j += 1) werte.push(jaccard(mengen[i], mengen[j]));
  }
  if (werte.length === 0) {
    console.log(`${name}: zu wenige Seiten (${dateien.length})`);
    return;
  }
  werte.sort((a, b) => a - b);
  const prozent = (wert) => `${(wert * 100).toFixed(1)} %`;
  const mittel = werte.reduce((s, w) => s + w, 0) / werte.length;
  console.log(
    `${name}: ${dateien.length} Seiten, Mittel ${prozent(mittel)}, Median ${prozent(werte[Math.floor(werte.length / 2)])}, `
      + `höchstens ${prozent(werte[werte.length - 1])}, mindestens ${prozent(werte[0])}`,
  );
}

const marken = path.join(wurzel, 'autoschluessel/marken');
auswerten('Codelinien', htmlIn(path.join(wurzel, 'schluessel-nach-code')));
auswerten('Kategorien', htmlIn(path.join(wurzel, 'schluessel-nach-code/kategorie')));
auswerten('Marken', htmlIn(marken));
auswerten('Modelle', ordnerIn(marken).flatMap(htmlIn));
