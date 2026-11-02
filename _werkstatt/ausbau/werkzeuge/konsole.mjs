#!/usr/bin/env node
// konsole.mjs – Browser-Konsole und Netzfehler der Hauptansichten (Desktop, 1440×900).
// Aufruf: node konsole.mjs [--routen <pfad,pfad>] [--json <datei>]
// Je Ansicht: Konsolenfehler, Konsolenwarnungen, pageerror und fehlgeschlagene Anfragen
// (requestfailed oder HTTP-Status ≥ 400), nach laden und durchscrollen. Anfragen, die die
// Attrappen (G5) selbst abbrechen, werden getrennt als „Attrappen-Abbrüche“ gezählt und sind
// keine Befunde. Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  HAUPTANSICHTEN, GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer,
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

async function main() {
  const args = argumente();
  for (const k of ['routen', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const routen = routenWaehlen(args.routen);
  const g = GERAETE[2];
  const ergebnisse = [];
  let technischFehler = 0;

  const browser = await browserStarten();
  try {
    for (const r of routen) {
      const context = await kontextFuer(browser, g);
      try {
        const abgefangen = await attrappenSetzen(context);
        const page = await context.newPage();
        const meldungen = [];
        const seitenfehler = [];
        const anfragen = [];
        const antworten = [];
        page.on('console', (m) => {
          if (m.type() === 'error' || m.type() === 'warning') {
            meldungen.push({ typ: m.type(), text: m.text().slice(0, 400), quelle: m.location()?.url ?? '' });
          }
        });
        page.on('pageerror', (e) => seitenfehler.push(String(e.message ?? e).slice(0, 400)));
        page.on('requestfailed', (q) => anfragen.push({ url: q.url(), grund: q.failure()?.errorText ?? 'unbekannt' }));
        page.on('response', (a) => {
          if (a.status() >= 400) antworten.push({ url: a.url(), status: a.status() });
        });

        let fehler = null;
        try {
          await laden(page, r.pfad);
          await durchscrollen(page);
          await page.waitForTimeout(500);
        } catch (e) {
          fehler = String(e.message ?? e).split('\n')[0];
          technischFehler += 1;
        }

        const fremd = new Set(abgefangen.filter((a) => a.art === 'fremd').map((a) => a.url));
        const konsoleFehler = meldungen.filter((m) => m.typ === 'error' && !fremd.has(m.quelle));
        const konsoleWarnungen = meldungen.filter((m) => m.typ === 'warning' && !fremd.has(m.quelle));
        const attrappeKonsole = meldungen.length - konsoleFehler.length - konsoleWarnungen.length;
        const echteAnfragen = anfragen.filter((a) => !fremd.has(a.url));
        const status = [...new Map(antworten.map((a) => [`${a.status} ${a.url}`, a])).values()];
        ergebnisse.push({
          ansicht: r.id,
          pfad: r.pfad,
          fehler,
          konsoleFehler,
          konsoleWarnungen,
          seitenfehler,
          fehlgeschlagen: [...echteAnfragen, ...status.map((s) => ({ url: s.url, grund: `HTTP ${s.status}` }))],
          attrappeAbbrueche: fremd.size,
          attrappeKonsole,
        });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  const protokoll = jsonSchreiben('konsole', args, { geraet: g.id, ergebnisse });
  console.log(tabelle(
    ['Ansicht', 'Konsolenfehler', 'Warnungen', 'Seitenfehler', 'Fehlgeschlagene Anfragen', 'Attrappen-Abbrüche (kein Befund)', 'Ladefehler'],
    ergebnisse.map((e) => [
      e.ansicht, e.konsoleFehler.length, e.konsoleWarnungen.length, e.seitenfehler.length,
      e.fehlgeschlagen.length, e.attrappeAbbrueche, e.fehler ?? '–',
    ]),
  ));
  const mitBefund = ergebnisse.filter((e) => e.konsoleFehler.length || e.konsoleWarnungen.length
    || e.seitenfehler.length || e.fehlgeschlagen.length || e.fehler);
  if (mitBefund.length) {
    console.log('\n### Einzelmeldungen (erste 10 je Art)\n');
    for (const e of mitBefund) {
      console.log(`**${e.ansicht}**`);
      for (const m of e.konsoleFehler.slice(0, 10)) console.log(`- Konsolenfehler: ${m.text}${m.quelle ? ` (${m.quelle})` : ''}`);
      for (const m of e.konsoleWarnungen.slice(0, 10)) console.log(`- Warnung: ${m.text}`);
      for (const m of e.seitenfehler.slice(0, 10)) console.log(`- Seitenfehler: ${m}`);
      for (const m of e.fehlgeschlagen.slice(0, 10)) console.log(`- Fehlgeschlagen: ${m.grund} ${m.url}`);
      if (e.fehler) console.log(`- Ladefehler: ${e.fehler}`);
      console.log('');
    }
  }
  console.log(`JSON-Protokoll: ${protokoll}`);
  if (technischFehler) process.exitCode = 1;
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
