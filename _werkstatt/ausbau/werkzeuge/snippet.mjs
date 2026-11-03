#!/usr/bin/env node
// snippet.mjs – Snippet-Messung je indexierbarer Seite aus dem Inventar.
// Aufruf: node snippet.mjs [--inventar <json>] [--json <datei>]
// Standard: jüngstes protokolle/inventar-*.json. Titel: Breite in „20px Arial“ (Chromium, canvas.measureText),
// höchstens 580 px. Beschreibung: Länge in Zeichen (Unicode-Zeichen), 120 bis 160.
// Arial ist auf diesem Rechner durch die metrisch gleiche Liberation Sans ersetzt. Das Protokoll hält das Ergebnis
// von fc-match Arial und eine Schriftprüfung fest. Die Prüfung zeigt, ob Arial und Liberation Sans gleich messen und
// ob eine unbekannte Schrift auf die Ersatzschrift fällt.
// Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer, attrappenSetzen, zeitstempel, ordner,
} from './lib.mjs';

const TITEL_MAX_PX = 580;
const BESCHR_MIN = 120;
const BESCHR_MAX = 160;
const PROBE = 'Schlüsseldienst Wetzlar, Autoschlüssel nachmachen und programmieren';
const DESKTOP = GERAETE.find((g) => g.id === 'desktop');

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const prozent = (k, n) => (n ? `${((k / n) * 100).toFixed(1).replace('.', ',')} %` : '–');
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

/** Jüngstes Inventar nach Änderungszeit. */
function neuesteInventar() {
  const kandidaten = readdirSync(PROTOKOLLE)
    .filter((n) => /^inventar-.*\.json$/.test(n))
    .map((n) => path.join(PROTOKOLLE, n));
  if (!kandidaten.length) bedienfehler('kein Inventar in protokolle/ gefunden; zuerst node inventar.mjs ausführen oder --inventar angeben');
  return kandidaten.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
}

function fcMatchArial() {
  try {
    return execFileSync('fc-match', ['Arial'], { encoding: 'utf8' }).trim();
  } catch (err) {
    return `nicht verfügbar (${String(err.message).split('\n')[0].slice(0, 120)})`;
  }
}

/** Läuft im Browser. Keine äußeren Bezüge, weil die Funktion als Text in die Seite gereicht wird. */
function messenImBrowser({ texte, probe }) {
  const ctx = document.createElement('canvas').getContext('2d');
  const breite = (font, t) => {
    ctx.font = font;
    return ctx.measureText(t).width;
  };
  return {
    titel: texte.map((t) => breite('20px Arial', t)),
    schrift: {
      arial: breite('20px Arial', probe),
      liberation: breite('20px "Liberation Sans"', probe),
      ersatz: breite('20px "Sm24 Nicht Vorhanden", monospace', probe),
      monospace: breite('20px monospace', probe),
    },
  };
}

async function main() {
  const args = argumente();
  for (const k of ['inventar', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const inventarDatei = args.inventar ? path.resolve(args.inventar) : neuesteInventar();
  if (!existsSync(inventarDatei)) bedienfehler(`Inventar nicht gefunden: ${inventarDatei}`);
  const inventar = JSON.parse(readFileSync(inventarDatei, 'utf8'));
  const seiten = (inventar.seiten ?? []).filter((s) => s.indexierbar);
  const fc = fcMatchArial();

  let messung;
  const browser = await browserStarten();
  try {
    const context = await kontextFuer(browser, DESKTOP);
    await attrappenSetzen(context);
    const seite = await context.newPage();
    await seite.setContent('<!doctype html><title>Snippet</title>');
    messung = await seite.evaluate(messenImBrowser, { texte: seiten.map((s) => s.titel ?? ''), probe: PROBE });
    await context.close();
  } finally {
    await browser.close();
  }

  const schrift = messung.schrift;
  const schriftpruefung = {
    ...schrift,
    arialGleichLiberation: Math.abs(schrift.arial - schrift.liberation) < 0.05,
    ersatzGreift: Math.abs(schrift.ersatz - schrift.monospace) < 0.05,
  };

  const zeilen = seiten.map((s, i) => {
    const titel = s.titel ?? '';
    const titelPx = messung.titel[i];
    const beschreibung = s.description ?? '';
    const zeichen = [...beschreibung].length;
    const titelErfuellt = titel !== '' && titelPx <= TITEL_MAX_PX;
    const beschreibungErfuellt = zeichen >= BESCHR_MIN && zeichen <= BESCHR_MAX;
    return {
      adresse: s.adresse,
      titel,
      titelPx: Math.round(titelPx * 10) / 10,
      titelErfuellt,
      titelGrund: titel === '' ? 'fehlt' : titelErfuellt ? '' : 'zu breit',
      beschreibungZeichen: zeichen,
      beschreibungErfuellt,
      beschreibungGrund: zeichen === 0 ? 'fehlt' : beschreibungErfuellt ? '' : zeichen < BESCHR_MIN ? 'zu kurz' : 'zu lang',
    };
  });

  const n = zeilen.length;
  const extrem = (liste, feld, richtung) => (liste.length
    ? liste.reduce((best, z) => (richtung * (z[feld] - best[feld]) > 0 ? z : best))
    : null);
  const laengster = extrem(zeilen, 'titelPx', 1);
  const kuerzester = extrem(zeilen, 'titelPx', -1);
  const laengsteBeschr = extrem(zeilen, 'beschreibungZeichen', 1);
  const kuerzesteBeschr = extrem(zeilen, 'beschreibungZeichen', -1);
  const titelOk = zeilen.filter((z) => z.titelErfuellt).length;
  const beschrOk = zeilen.filter((z) => z.beschreibungErfuellt).length;
  const beideOk = zeilen.filter((z) => z.titelErfuellt && z.beschreibungErfuellt).length;
  const zusammenfassung = {
    seiten: n,
    titelErfuellt: titelOk,
    titelAnteil: prozent(titelOk, n),
    beschreibungErfuellt: beschrOk,
    beschreibungAnteil: prozent(beschrOk, n),
    beideErfuellt: beideOk,
    laengsterTitel: laengster && { adresse: laengster.adresse, px: laengster.titelPx },
    kuerzesterTitel: kuerzester && { adresse: kuerzester.adresse, px: kuerzester.titelPx },
    laengsteBeschreibung: laengsteBeschr && { adresse: laengsteBeschr.adresse, zeichen: laengsteBeschr.beschreibungZeichen },
    kuerzesteBeschreibung: kuerzesteBeschr && { adresse: kuerzesteBeschr.adresse, zeichen: kuerzesteBeschr.beschreibungZeichen },
  };

  const protokoll = jsonSchreiben('snippet', args, {
    inventar: inventarDatei,
    inventarZeit: inventar.zeit,
    fcMatchArial: fc,
    schriftpruefung,
    grenzen: { titelPx: TITEL_MAX_PX, beschreibungZeichen: [BESCHR_MIN, BESCHR_MAX], schrift: '20px Arial' },
    zusammenfassung,
    seiten: zeilen,
  });

  const fmt = (x) => String(x).replace('.', ',');
  console.log(`Snippet-Messung · ${n} indexierbare Seiten aus ${path.basename(inventarDatei)}\n`);
  console.log(`fc-match Arial: ${fc}`);
  console.log(`Schriftprüfung (20px): Arial ${fmt(schrift.arial.toFixed(1))} px · Liberation Sans ${fmt(schrift.liberation.toFixed(1))} px · Ersatzschrift ${fmt(schrift.monospace.toFixed(1))} px (monospace)`);
  console.log(`Arial gleich Liberation Sans: ${schriftpruefung.arialGleichLiberation ? 'ja' : 'nein'} · Ersatzschrift greift: ${schriftpruefung.ersatzGreift ? 'ja' : 'nein'}\n`);
  console.log(tabelle(
    ['Adresse', 'Titel (px)', 'Titel', 'Beschreibung (Zeichen)', 'Beschreibung'],
    zeilen.map((z) => [
      z.adresse,
      fmt(z.titelPx.toFixed(1)),
      z.titelErfuellt ? 'ja' : `nein (${z.titelGrund})`,
      z.beschreibungZeichen,
      z.beschreibungErfuellt ? 'ja' : `nein (${z.beschreibungGrund})`,
    ]),
  ));
  console.log('\n### Zusammenfassung\n');
  console.log(`- Titel bis 580 px: ${titelOk} von ${n} (${zusammenfassung.titelAnteil})`);
  console.log(`- Beschreibung 120 bis 160 Zeichen: ${beschrOk} von ${n} (${zusammenfassung.beschreibungAnteil})`);
  console.log(`- Titel und Beschreibung zusammen: ${beideOk} von ${n}`);
  if (laengster) console.log(`- Längster Titel: ${fmt(laengster.titelPx.toFixed(1))} px (${laengster.adresse}); kürzester: ${fmt(kuerzester.titelPx.toFixed(1))} px (${kuerzester.adresse})`);
  if (laengsteBeschr) console.log(`- Längste Beschreibung: ${laengsteBeschr.beschreibungZeichen} Zeichen (${laengsteBeschr.adresse}); kürzeste: ${kuerzesteBeschr.beschreibungZeichen} Zeichen (${kuerzesteBeschr.adresse})`);
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
