#!/usr/bin/env node
// werte-suche.mjs – Sucht im Quelltext nach festen Werten, die als Designtoken gelten sollen.
// Aufruf: node werte-suche.mjs [--seit <commit>] [--json <datei>] [dateien…]
// Ohne Dateien: alle .ts/.tsx/.css-Dateien unter src/, die seit --seit (Standard fcbcfb2) geändert sind
// (git diff --name-only). Gesucht wird je Zeile (Kommentare vorher ausgeblendet):
//   - Tailwind-Klassen mit eckigen Klammern (auch mit Präfixen wie md: oder hover:)
//   - Hex-Farben #rgb bis #rrggbbaa
//   - rgb(, rgba(, hsl(, oklch( außerhalb von src/app/(site)/globals.css und tailwind.config.ts
//   - style={{ … }} mit Zahl plus px oder rem
// Ausnahmen (mitgezählt, getrennt ausgewiesen): src/components/visual/generators/ und src/components/visual/icons/.
// Ausgabe: Tabelle „Datei · Zeile · Fund“, Summe je Datei, Summe ohne und mit Ausnahmen; JSON-Protokoll.
// Exit: 0 fertig (auch mit Funden), 2 Bedienfehler (z. B. unbekannter Commit, fehlende Datei), 1 technischer Fehler.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { REPO, PROTOKOLLE, argumente, zeitstempel, ordner } from './lib.mjs';

const BASIS_COMMIT = 'fcbcfb2';
const AUSNAHMEN = ['src/components/visual/generators/', 'src/components/visual/icons/'];
const FARB_FUNKTIONEN_ERLAUBT = ['src/app/(site)/globals.css', 'tailwind.config.ts'];

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
function tabelle(kopf, zeilen) {
  return [
    `| ${kopf.join(' | ')} |`,
    `|${kopf.map(() => '---').join('|')}|`,
    ...zeilen.map((z) => `| ${z.map(zelle).join(' | ')} |`),
  ].join('\n');
}
function jsonSchreiben(skript, args, daten) {
  const datei = typeof args.json === 'string' ? path.resolve(args.json) : path.join(PROTOKOLLE, `${skript}-${zeitstempel()}.json`);
  ordner(path.dirname(datei));
  writeFileSync(datei, `${JSON.stringify({ skript, zeit: new Date().toISOString(), argumente: args, ...daten }, null, 2)}\n`);
  return datei;
}

/** Ersetzt Kommentare durch Leerzeichen; Zeilen und Positionen bleiben erhalten. */
function ohneKommentare(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:\\])\/\/[^\n]*/g, (m, vor) => vor + ' '.repeat(m.length - vor.length));
}

const REGELN = [
  { kategorie: 'Tailwind-Klasse mit []', muster: /(?:[a-z0-9-]+:)*[a-z-]+-\[[^\]]+\]/g, rel: false },
  { kategorie: 'Hex-Farbe', muster: /#[0-9a-fA-F]{3,8}\b/g, rel: false },
  { kategorie: 'Farbfunktion', muster: /\b(?:rgba?|hsl|oklch)\(/g, rel: true },
];

function zeileVon(text, index) {
  let n = 1;
  for (let i = 0; i < index; i += 1) if (text.charCodeAt(i) === 10) n += 1;
  return n;
}

function suchen(rel, roh) {
  const text = ohneKommentare(roh);
  const ausnahme = AUSNAHMEN.some((a) => rel.startsWith(a));
  const funde = [];
  for (const regel of REGELN) {
    if (regel.rel && FARB_FUNKTIONEN_ERLAUBT.includes(rel)) continue;
    for (const m of text.matchAll(regel.muster)) {
      funde.push({ datei: rel, zeile: zeileVon(text, m.index), kategorie: regel.kategorie, fund: m[0], ausnahme });
    }
  }
  for (const m of text.matchAll(/style=\{\{[\s\S]*?\}\}/g)) {
    if (/\d(?:\.\d+)?\s*(?:px|rem)\b/.test(m[0])) {
      funde.push({ datei: rel, zeile: zeileVon(text, m.index), kategorie: 'style mit Zahl + px/rem', fund: m[0].slice(0, 80), ausnahme });
    }
  }
  return funde.sort((a, b) => a.zeile - b.zeile);
}

function main() {
  const args = argumente();
  for (const k of ['seit', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const seit = args.seit ?? BASIS_COMMIT;
  let dateien;
  if (args._.length) {
    dateien = args._.map((d) => path.resolve(d));
    for (const d of dateien) if (!existsSync(d)) bedienfehler(`Datei nicht gefunden: ${d}`);
  } else {
    try {
      execFileSync('git', ['cat-file', '-e', `${seit}^{commit}`], { cwd: REPO, stdio: 'ignore' });
    } catch {
      bedienfehler(`Commit „${seit}“ nicht gefunden`);
    }
    const liste = execFileSync('git', ['diff', '--name-only', seit], { cwd: REPO, encoding: 'utf8' })
      .split('\n').filter(Boolean);
    dateien = liste
      .filter((f) => f.startsWith('src/') && /\.(ts|tsx|css)$/.test(f))
      .map((f) => path.join(REPO, f))
      .filter(existsSync);
  }

  const alle = [];
  const summe = [];
  for (const d of dateien) {
    const rel = path.relative(REPO, d).split(path.sep).join('/');
    const funde = suchen(rel, readFileSync(d, 'utf8'));
    alle.push(...funde);
    summe.push({ datei: rel, treffer: funde.length, ausnahme: AUSNAHMEN.some((a) => rel.startsWith(a)) });
  }
  const ohneAusnahme = alle.filter((f) => !f.ausnahme);
  const mitAusnahme = alle.filter((f) => f.ausnahme);
  const protokoll = jsonSchreiben('werte-suche', args, {
    seit: args._.length ? null : seit, dateien: dateien.length, summeOhneAusnahmen: ohneAusnahme.length,
    summeAusnahmen: mitAusnahme.length, funde: alle,
  });

  const zeilen = (liste) => liste.map((f) => [f.datei, f.zeile, f.kategorie, f.fund]);
  console.log(`Geprüfte Dateien: ${dateien.length}${args._.length ? '' : ` (seit ${seit})`}\n`);
  console.log('### Funde\n');
  console.log(ohneAusnahme.length
    ? tabelle(['Datei', 'Zeile', 'Kategorie', 'Fund'], zeilen(ohneAusnahme))
    : 'Keine Funde.');
  console.log('\n### Ausnahmen (Bildinhalte, mitgezählt)\n');
  console.log(mitAusnahme.length
    ? tabelle(['Datei', 'Zeile', 'Kategorie', 'Fund'], zeilen(mitAusnahme))
    : 'Keine Funde.');
  console.log('\n### Summe je Datei\n');
  console.log(tabelle(
    ['Datei', 'Treffer', 'Ausnahme'],
    summe.filter((s) => s.treffer > 0).map((s) => [s.datei, s.treffer, s.ausnahme ? 'ja' : 'nein']),
  ));
  console.log(`\nSumme ohne Ausnahmen: ${ohneAusnahme.length} · Ausnahmen: ${mitAusnahme.length}`);
  console.log(`JSON-Protokoll: ${protokoll}`);
}

try {
  main();
} catch (e) {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
}
