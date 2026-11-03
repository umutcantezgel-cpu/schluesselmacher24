#!/usr/bin/env node
// svgo-pruefung.mjs – Prüft, ob die SVGO-Voreinstellung Zugänglichkeit und Animierbarkeit erhält (Auftrag 12, G-47).
// Aufruf: node svgo-pruefung.mjs [dateien oder ordner…] [--json <datei>]
// Standard: alle *.svg unter public und src. Jede Datei wird im Speicher mit svgo optimiert; geschrieben wird nichts.
// Voreinstellung preset-default, aber removeViewBox, removeTitle, removeDesc und cleanupIds sind aus.
// Erhalten bleiben sollen viewBox, title, role und aria-hidden. Befund: ein Merkmal, das vorher da war und danach fehlt,
// oder eine Datei, die svgo nicht verarbeiten kann.
// Ausgabe: Markdown-Tabelle auf stdout, JSON-Protokoll. Exit 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { optimize } from 'svgo';
import { REPO, PROTOKOLLE, argumente, zeitstempel, ordner } from './lib.mjs';

const VOREINSTELLUNG = {
  plugins: [{
    name: 'preset-default',
    params: { overrides: { removeViewBox: false, removeTitle: false, removeDesc: false, cleanupIds: false } },
  }],
};
const MERKMALE = {
  viewBox: /\sviewBox\s*=/,
  title: /<title[\s>]/,
  role: /\srole\s*=/,
  'aria-hidden': /\saria-hidden\s*=/,
};

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

function svgSammeln(ziel, liste = []) {
  const st = statSync(ziel);
  if (st.isDirectory()) {
    for (const e of readdirSync(ziel).sort()) {
      if (e !== 'node_modules') svgSammeln(path.join(ziel, e), liste);
    }
  } else if (ziel.toLowerCase().endsWith('.svg')) {
    liste.push(ziel);
  }
  return liste;
}

/** Merkmal vorher und nachher: 'ja' (erhalten), 'verloren' (vorher da, nachher weg) oder 'nein' (nicht vorhanden). */
function merkmale(text) {
  return Object.fromEntries(Object.entries(MERKMALE).map(([name, re]) => [name, re.test(text)]));
}
function vergleich(vorher, nachher) {
  return Object.fromEntries(Object.keys(MERKMALE).map((name) => {
    if (!vorher[name]) return [name, 'nein'];
    return [name, nachher[name] ? 'ja' : 'verloren'];
  }));
}

function pruefeDatei(datei) {
  const text = readFileSync(datei, 'utf8');
  const bytesVorher = Buffer.byteLength(text, 'utf8');
  const vorher = merkmale(text);
  let nachherText = null;
  let fehler = null;
  try {
    nachherText = optimize(text, { ...VOREINSTELLUNG, path: datei }).data;
  } catch (e) {
    fehler = String(e.message ?? e).split('\n')[0];
  }
  if (nachherText === null) {
    return { datei: path.relative(REPO, datei), bytesVorher, bytesNachher: null, ersparnis: null, merkmale: null, verloren: [], fehler };
  }
  const nachher = merkmale(nachherText);
  const merkmalsStand = vergleich(vorher, nachher);
  const verloren = Object.entries(merkmalsStand).filter(([, v]) => v === 'verloren').map(([k]) => k);
  const bytesNachher = Buffer.byteLength(nachherText, 'utf8');
  return {
    datei: path.relative(REPO, datei),
    bytesVorher,
    bytesNachher,
    ersparnis: bytesVorher > 0 ? Math.round((1 - bytesNachher / bytesVorher) * 1000) / 10 : 0,
    merkmale: merkmalsStand,
    verloren,
    fehler: null,
  };
}

function main() {
  const args = argumente();
  for (const k of ['json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  let dateien;
  if (args._.length) {
    dateien = [];
    for (const a of args._) {
      const p = path.resolve(a);
      if (!existsSync(p)) bedienfehler(`Pfad nicht gefunden: ${a}`);
      svgSammeln(p, dateien);
    }
  } else {
    dateien = [];
    for (const ordnerName of ['public', 'src']) {
      const p = path.join(REPO, ordnerName);
      if (existsSync(p)) svgSammeln(p, dateien);
    }
  }
  if (!dateien.length) bedienfehler('keine SVG-Dateien gefunden');

  const ergebnisse = dateien.map(pruefeDatei);
  const befunde = ergebnisse.filter((e) => e.fehler || e.verloren.length);
  const protokoll = jsonSchreiben('svgo-pruefung', args, { dateien: ergebnisse.length, befunde: befunde.length, ergebnisse });

  const kurzErgebnis = (e) => {
    if (e.fehler) return `Befund: svgo meldet „${e.fehler}“`;
    if (e.verloren.length) return `Befund: verloren ${e.verloren.join(', ')}`;
    return 'ok';
  };
  console.log(tabelle(
    ['Datei', 'Bytes vorher', 'Bytes nachher', 'Ersparnis %', 'viewBox', 'title', 'role', 'aria-hidden', 'Ergebnis'],
    ergebnisse.map((e) => [
      e.datei, e.bytesVorher, e.bytesNachher ?? '–', e.ersparnis ?? '–',
      e.merkmale?.viewBox ?? '–', e.merkmale?.title ?? '–', e.merkmale?.role ?? '–', e.merkmale?.['aria-hidden'] ?? '–',
      kurzErgebnis(e),
    ]),
  ));
  const summeVorher = ergebnisse.reduce((s, e) => s + e.bytesVorher, 0);
  const summeNachher = ergebnisse.reduce((s, e) => s + (e.bytesNachher ?? e.bytesVorher), 0);
  console.log(`\nDateien: ${ergebnisse.length} · Befunde: ${befunde.length} · Bytes gesamt vorher ${summeVorher}, nachher ${summeNachher}`);
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

try {
  main();
} catch (e) {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
}
