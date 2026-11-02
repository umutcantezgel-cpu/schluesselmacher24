#!/usr/bin/env node
// bild.mjs – Bildschirmfotos einer Seite je Gerätegröße.
// Aufruf: node bild.mjs <pfad> [--geraet mobil|tablet|desktop|alle] [--ganz] [--reduziert]
//         [--warte <ms>] [--ziel <ordner>] [--name <praefix>] [--json <datei>]
// Lädt die Seite, löst alle Auftritte durch Durchscrollen aus, wartet --warte (Standard 800 ms)
// und speichert den ersten Bildschirm (mit --ganz die ganze Seite) als JPEG, Qualität 60,
// Gerätepixelverhältnis 1. Standard: alle drei Gerätegrößen (3 Bilder).
// Ausgabe: Tabelle mit den Dateipfaden auf stdout und JSON-Protokoll.
// Exit: 0 Lauf fertig, 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import {
  GERAETE, BILDER_EXTERN, PROTOKOLLE, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const slug = (p) => (p === '/' ? 'start' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase());
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

async function main() {
  const args = argumente();
  for (const k of ['ziel', 'name', 'json', 'geraet', 'warte']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const pfad = args._[0];
  if (!pfad || !pfad.startsWith('/')) bedienfehler('Pfad fehlt oder beginnt nicht mit „/“. Aufruf: node bild.mjs <pfad> [Optionen]');
  const wahl = args.geraet ?? 'alle';
  if (!['mobil', 'tablet', 'desktop', 'alle'].includes(wahl)) bedienfehler(`--geraet „${wahl}“ ist nicht erlaubt`);
  const warte = Number(args.warte ?? 800);
  if (!Number.isFinite(warte) || warte < 0) bedienfehler('--warte braucht eine Zahl in ms');

  const geraete = wahl === 'alle' ? GERAETE : GERAETE.filter((g) => g.id === wahl);
  const ziel = ordner(args.ziel ?? BILDER_EXTERN);
  const praefix = args.name ?? slug(pfad);
  const ganz = Boolean(args.ganz);
  const eintraege = [];

  const browser = await browserStarten();
  try {
    for (const g of geraete) {
      const context = await kontextFuer(browser, g, { reduziert: Boolean(args.reduziert) });
      try {
        await attrappenSetzen(context);
        const page = await context.newPage();
        const antwort = await laden(page, pfad);
        await durchscrollen(page);
        await page.waitForTimeout(warte);
        const datei = path.join(ziel, `${praefix}__${g.id}${ganz ? '__ganz' : ''}.jpg`);
        await page.screenshot({ path: datei, type: 'jpeg', quality: 60, fullPage: ganz, scale: 'css' });
        eintraege.push({
          geraet: g.id, datei, status: antwort?.status() ?? null, bytes: statSync(datei).size,
          breite: g.breite, hoehe: g.hoehe, ganz,
        });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  const protokoll = jsonSchreiben('bild', args, { pfad, reduziert: Boolean(args.reduziert), eintraege });
  console.log(tabelle(['Gerät', 'Datei', 'HTTP-Status', 'Bytes'], eintraege.map((e) => [e.geraet, e.datei, e.status, e.bytes])));
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
