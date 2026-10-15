#!/usr/bin/env node
// bildsatz.mjs – Bildsatz der Hauptansichten je Gerät, mit Überlaufprüfung.
// Aufruf: node bildsatz.mjs [--routen <pfad,pfad>] [--ziel <ordner>] [--max <n>] [--json <datei>]
// Standard: alle 12 Hauptansichten × 3 Gerätegrößen. Je Ansicht und Gerät: laden, durchscrollen,
// Überlaufprüfung (Seite breiter als Fenster; Elemente über den rechten Rand; abgeschnittener Text),
// dann je Bildschirmhöhe ein Ausschnitt (scrollTo y = k·Höhe, 400 ms warten), höchstens --max
// Ausschnitte (Standard 15). Dateiname <id>__<geraet>__<k zweistellig>.jpg, k ab 00.
// Ausgabe: Tabelle „Ansicht · Gerät · Ausschnitte · Überlauf · Befunde“ und JSON-Protokoll.
// Exit: 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  HAUPTANSICHTEN, GERAETE, BILDER_EXTERN, PROTOKOLLE, argumente, browserStarten, kontextFuer,
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
function routenWaehlen(text) {
  if (text === undefined) return HAUPTANSICHTEN.map((v) => ({ id: v.id, pfad: v.pfad }));
  if (text === true) bedienfehler('--routen braucht eine Liste, z. B. --routen /,/autoschluessel');
  return text.split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
    const v = HAUPTANSICHTEN.find((h) => h.id === t || h.pfad === t);
    if (v) return { id: v.id, pfad: v.pfad };
    if (t.startsWith('/')) return { id: slug(t), pfad: t };
    return bedienfehler(`unbekannte Route „${t}“`);
  });
}

/** Läuft im Browser. Gibt Überlauf der Seite und bis zu 10 auffällige Elemente zurück. */
function ueberlaufPruefung() {
  const iw = window.innerWidth;
  const sel = (el) => {
    const teile = [];
    for (let e = el; e && e !== document.body && teile.length < 4; e = e.parentElement) {
      let s = e.tagName.toLowerCase();
      if (e.id) { teile.unshift(`${s}#${e.id}`); break; }
      const klasse = String(e.getAttribute('class') ?? '').split(/\s+/).find(Boolean);
      if (klasse) s += `.${klasse.replace(/[^\w-]/g, '')}`;
      teile.unshift(s);
    }
    return teile.join(' > ');
  };
  const breite = document.documentElement.scrollWidth > iw;
  const befunde = [];
  let befundeGesamt = 0;
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('.sr-only, [aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    let grund = null;
    if (r.right > iw + 1) {
      grund = 'über den rechten Rand';
    } else if (
      el.scrollWidth > el.clientWidth + 1
      && ['hidden', 'clip'].includes(cs.overflowX)
      && cs.textOverflow !== 'ellipsis'
      && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    ) {
      grund = 'Text abgeschnitten';
    }
    if (grund) {
      befundeGesamt += 1;
      if (befunde.length < 10) befunde.push({ grund, selektor: sel(el) });
    }
  }
  return { breite, befundeGesamt, befunde };
}

async function main() {
  const args = argumente();
  for (const k of ['ziel', 'max', 'json', 'routen']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const routen = routenWaehlen(args.routen);
  const max = Number(args.max ?? 15);
  if (!Number.isInteger(max) || max < 1) bedienfehler('--max braucht eine ganze Zahl ab 1');
  const ziel = ordner(args.ziel ?? BILDER_EXTERN);

  const zeilen = [];
  const browser = await browserStarten();
  try {
    for (const r of routen) {
      for (const g of GERAETE) {
        const context = await kontextFuer(browser, g);
        try {
          await attrappenSetzen(context);
          const page = await context.newPage();
          const antwort = await laden(page, r.pfad);
          await durchscrollen(page);
          const seitenHoehe = await page.evaluate(() => document.documentElement.scrollHeight);
          const gesamt = Math.max(1, Math.ceil(seitenHoehe / g.hoehe));
          const anzahl = Math.min(gesamt, max);
          const pruef = await page.evaluate(ueberlaufPruefung);
          const dateien = [];
          for (let k = 0; k < anzahl; k += 1) {
            await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), k * g.hoehe);
            await page.waitForTimeout(400);
            const datei = path.join(ziel, `${r.id}__${g.id}__${String(k).padStart(2, '0')}.jpg`);
            await page.screenshot({ path: datei, type: 'jpeg', quality: 60, scale: 'css' });
            dateien.push(datei);
          }
          const status = antwort?.status() ?? null;
          const befundText = [
            status !== null && status >= 400 ? `HTTP ${status}` : null,
            pruef.befundeGesamt ? `${pruef.befundeGesamt}: ${pruef.befunde.slice(0, 3).map((b) => `${b.grund} ${b.selektor}`).join('; ')}` : null,
          ].filter(Boolean).join(' · ');
          zeilen.push({
            ansicht: r.id, geraet: g.id, pfad: r.pfad, status,
            ausschnitte: anzahl, seitenausschnitte: gesamt, gekappt: gesamt > max,
            ueberlauf: pruef.breite, befundeGesamt: pruef.befundeGesamt, befunde: pruef.befunde,
            befundText: befundText || '–', dateien,
          });
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  const protokoll = jsonSchreiben('bildsatz', args, { max, zeilen });
  console.log(tabelle(
    ['Ansicht', 'Gerät', 'Ausschnitte', 'Überlauf', 'Befunde'],
    zeilen.map((z) => [
      z.ansicht, z.geraet,
      `${z.ausschnitte} von ${z.seitenausschnitte}${z.gekappt ? ' (gekappt)' : ''}`,
      z.ueberlauf ? 'ja' : 'nein',
      z.befundText,
    ]),
  ));
  console.log(`\nBilder: ${zeilen.reduce((s, z) => s + z.dateien.length, 0)} in ${ziel}`);
  console.log(`JSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
