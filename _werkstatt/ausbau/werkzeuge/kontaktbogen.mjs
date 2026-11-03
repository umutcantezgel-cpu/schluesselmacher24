#!/usr/bin/env node
// kontaktbogen.mjs – Kontaktbogen: viele Bilder als Raster auf einer Seite, als ein JPEG (Probe für Bildsätze).
// Aufruf: node kontaktbogen.mjs --bilder <ordner oder dateien,kommagetrennt> --ziel <datei.jpg>
//         [--spalten 4] [--titel text] [--json <datei>]
// Baut eine HTML-Seite (Raster, Bildunterschrift = Dateiname, Titel oben), öffnet sie per file:// in Chromium und
// speichert einen ganzseitigen Screenshot als JPEG (Qualität 70), höchstens 1.440 px breit. Die Seite liegt in einem
// eigenen Arbeitsordner im Systemtemp, der nach dem Lauf gelöscht wird.
// Exit: 0 fertig (nicht ladbare Bilder stehen im Ergebnis), 2 Bedienfehler, 1 technischer Fehler.
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer, attrappenSetzen, zeitstempel, ordner,
} from './lib.mjs';

const BILD_ENDUNGEN = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);
const MAX_BREITE = 1440;
const MAX_HOEHE = 16000;
const DESKTOP = GERAETE.find((g) => g.id === 'desktop');

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

/** Bilder aus Ordnern (ohne Unterordner, nach Namen sortiert) und aus einzelnen Dateien. */
function bilderSammeln(eingabe) {
  const dateien = [];
  for (const teil of eingabe.split(',').map((t) => t.trim()).filter(Boolean)) {
    const p = path.resolve(teil);
    if (!existsSync(p)) bedienfehler(`nicht gefunden: ${teil}`);
    if (statSync(p).isDirectory()) {
      const namen = readdirSync(p)
        .filter((n) => BILD_ENDUNGEN.has(path.extname(n).toLowerCase()) && statSync(path.join(p, n)).isFile())
        .sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
      if (!namen.length) bedienfehler(`keine Bilder im Ordner ${teil}`);
      dateien.push(...namen.map((n) => path.join(p, n)));
    } else {
      if (!BILD_ENDUNGEN.has(path.extname(p).toLowerCase())) bedienfehler(`kein Bildformat: ${teil}`);
      dateien.push(p);
    }
  }
  if (!dateien.length) bedienfehler('keine Bilder angegeben');
  return [...new Set(dateien)];
}

function htmlBauen(bilder, { titel, spalten }) {
  const karten = bilder.map((b) => [
    '    <figure>',
    `      <img src="${esc(pathToFileURL(b).href)}" alt="">`,
    `      <figcaption>${esc(path.basename(b))}</figcaption>`,
    '    </figure>',
  ].join('\n')).join('\n');
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>${esc(titel)}</title>
<style>
  html, body { margin: 0; background: #ffffff; color: #111111; font-family: Arial, "Liberation Sans", sans-serif; }
  body { box-sizing: border-box; width: 100%; padding: 24px; }
  h1 { font-size: 22px; margin: 0 0 16px; }
  .raster { display: grid; grid-template-columns: repeat(${spalten}, minmax(0, 1fr)); gap: 16px; }
  figure { margin: 0; padding: 8px; border: 1px solid #cccccc; background: #f5f5f5; min-width: 0; }
  img { display: block; width: 100%; height: 220px; object-fit: contain; background: #ffffff; }
  figcaption { margin-top: 6px; font-size: 13px; overflow-wrap: anywhere; }
</style>
</head>
<body>
<h1>${esc(titel)}</h1>
<div class="raster">
${karten}
</div>
</body>
</html>
`;
}

/** Breite und Höhe aus dem Kopf eines JPEG (Start-Marker SOF0 bis SOF15 ohne DHT, JPG und DAC). */
function jpegMasse(puffer) {
  if (puffer[0] !== 0xff || puffer[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < puffer.length) {
    if (puffer[i] !== 0xff) return null;
    const marker = puffer[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { hoehe: puffer.readUInt16BE(i + 5), breite: puffer.readUInt16BE(i + 7) };
    }
    i += 2 + puffer.readUInt16BE(i + 2);
  }
  return null;
}

async function main() {
  const args = argumente();
  for (const k of ['bilder', 'ziel', 'spalten', 'titel', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  if (!args.bilder) bedienfehler('--bilder fehlt (Ordner oder Dateien, kommagetrennt)');
  if (!args.ziel) bedienfehler('--ziel fehlt (Ausgabedatei, z. B. …/kontaktbogen.jpg)');
  const ziel = path.resolve(args.ziel);
  if (!/\.jpe?g$/i.test(ziel)) bedienfehler('--ziel muss auf .jpg oder .jpeg enden');
  const spalten = args.spalten === undefined ? 4 : Number(args.spalten);
  if (!Number.isInteger(spalten) || spalten < 1 || spalten > 8) bedienfehler('--spalten braucht eine ganze Zahl von 1 bis 8');
  const titel = args.titel ?? 'Kontaktbogen';
  const bilder = bilderSammeln(args.bilder);

  const arbeit = mkdtempSync(path.join(tmpdir(), 'sm24-kontaktbogen-'));
  let bedienfehlerText = null;
  let ergebnis = null;
  try {
    const seiteDatei = path.join(arbeit, 'kontaktbogen.html');
    writeFileSync(seiteDatei, htmlBauen(bilder, { titel, spalten }));
    const browser = await browserStarten();
    try {
      const context = await kontextFuer(browser, DESKTOP);
      try {
        await attrappenSetzen(context);
        // Ausnahme nur für lokale Dateien: die Seite im Arbeitsordner und die übergebenen Bilder. Sie berühren kein Netz.
        // Die Regel kommt nach attrappenSetzen, Playwright prüft Regeln in umgekehrter Reihenfolge; alles andere
        // (auch andere file://-Adressen) fällt an die Attrappe und wird abgebrochen.
        const erlaubt = new Set([seiteDatei, ...bilder]);
        await context.route((url) => {
          try { return url.protocol === 'file:' && erlaubt.has(fileURLToPath(url)); } catch { return false; }
        }, (route) => route.continue());
        const page = await context.newPage();
        await page.goto(pathToFileURL(seiteDatei).href, { waitUntil: 'load' });
        const geladen = await page.evaluate(async () => {
          await Promise.all([...document.images].map((i) => i.decode().catch(() => null)));
          return [...document.images].map((i) => i.naturalWidth > 0);
        });
        const hoehe = await page.evaluate(() => document.documentElement.scrollHeight);
        if (hoehe > MAX_HOEHE) {
          bedienfehlerText = `der Bogen ist ${hoehe} px hoch (Grenze ${MAX_HOEHE} px): weniger Bilder je Lauf oder mehr Spalten`;
        } else {
          ordner(path.dirname(ziel));
          await page.screenshot({ path: ziel, type: 'jpeg', quality: 70, fullPage: true, scale: 'css' });
          const masse = jpegMasse(readFileSync(ziel));
          if (!masse || masse.breite > MAX_BREITE) throw new Error(`Breite des Kontaktbogens nicht im Rahmen: ${JSON.stringify(masse)}`);
          ergebnis = { geladen, breite: masse.breite, hoehe: masse.hoehe, bytes: statSync(ziel).size };
        }
      } finally {
        await context.close();
      }
    } finally {
      await browser.close();
    }
  } finally {
    rmSync(arbeit, { recursive: true, force: true });
  }
  if (bedienfehlerText) bedienfehler(bedienfehlerText);

  const nichtGeladen = bilder.filter((_, i) => !ergebnis.geladen[i]).map((b) => path.basename(b));
  const protokoll = jsonSchreiben('kontaktbogen', args, {
    ziel,
    spalten,
    titel,
    bilder: bilder.map((b, i) => ({ datei: b, geladen: ergebnis.geladen[i] })),
    breite: ergebnis.breite,
    hoehe: ergebnis.hoehe,
    bytes: ergebnis.bytes,
    nichtGeladen,
  });
  console.log(tabelle(['Bild', 'geladen'], bilder.map((b, i) => [path.basename(b), ergebnis.geladen[i] ? 'ja' : 'nein'])));
  const kb = Math.round(ergebnis.bytes / 1024).toLocaleString('de-DE');
  console.log(`\nKontaktbogen: ${ziel} · ${ergebnis.breite.toLocaleString('de-DE')} × ${ergebnis.hoehe.toLocaleString('de-DE')} px · ${kb} KB · ${bilder.length} Bilder, ${nichtGeladen.length} nicht geladen`);
  console.log(`JSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
