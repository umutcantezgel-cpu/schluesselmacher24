#!/usr/bin/env node
// svg-pruefung.mjs – Prüfung aller SVG-Dateien und der SVG in den Ansichten (Prüfstufe C, Z-06).
// Aufruf: node _werkstatt/werkzeuge/svg-pruefung.mjs [--routen p,p] [--json <datei>]
// Ohne --routen: die 12 Hauptansichten. Dateien: alle *.svg unter src/ und public/.
// Je Datei: viewBox, keine Editor-Reste (metadata, inkscape, sodipodi, figma, sketch), keine Kommentare,
//   Zahlen mit höchstens drei Nachkommastellen.
// Je Ansicht (Desktop): SVG gesamt, verborgen (aria-hidden), benannt (role=img mit title, aria-label oder
//   aria-labelledby), unbenannt und sichtbar (Befund), doppelte id im Dokument (Befund), lucide-Reste (Befund),
//   Familie: Glyphen/Fach-Icons (data-sm24-icon), Grafiken (role=img), andere (Liste zur Durchsicht).
// Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import {
  REPO, BASIS_URL, GERAETE, PROTOKOLLE, HAUPTANSICHTEN, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');

function svgDateien(start) {
  if (!existsSync(start)) return [];
  const out = [];
  for (const name of readdirSync(start)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = path.join(start, name);
    if (statSync(p).isDirectory()) out.push(...svgDateien(p));
    else if (name.endsWith('.svg')) out.push(p);
  }
  return out;
}

function dateiPruefen(datei) {
  const text = readFileSync(datei, 'utf8');
  const befunde = [];
  if (!/viewBox=/.test(text)) befunde.push('kein viewBox');
  if (/<metadata|inkscape:|sodipodi:|figma|sketch:/i.test(text)) befunde.push('Editor-Reste');
  if (/<!--/.test(text)) befunde.push('Kommentar');
  const lang = (text.match(/\d+\.\d{4,}/g) ?? []).length;
  if (lang) befunde.push(`${lang} Zahlen mit mehr als drei Nachkommastellen`);
  return { datei: path.relative(REPO, datei), bytes: Buffer.byteLength(text), befunde };
}

function svgImDokument() {
  const svgs = [...document.querySelectorAll('svg')].filter((s) => !s.parentElement?.closest('svg'));
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  const verborgen = (el) => !!el.closest('[aria-hidden="true"]');
  const name = (el) => {
    const t = el.querySelector(':scope > title')?.textContent?.trim();
    const l = el.getAttribute('aria-label')?.trim();
    const lb = el.getAttribute('aria-labelledby');
    return t || l || (lb ? lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim() : '');
  };
  const ids = new Map();
  for (const el of document.querySelectorAll('[id]')) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
  const doppelt = [...ids.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id} ×${n}`);
  const ergebnis = { gesamt: svgs.length, verborgen: 0, benannt: 0, icons: 0, grafiken: 0, unbenannt: [], andere: [], lucide: 0, doppelt };
  for (const s of svgs) {
    if (s.classList.contains('lucide') || s.getAttribute('class')?.includes('lucide')) ergebnis.lucide += 1;
    if (s.hasAttribute('data-sm24-icon')) ergebnis.icons += 1;
    else if (s.getAttribute('role') === 'img') ergebnis.grafiken += 1;
    else ergebnis.andere.push(`${s.getAttribute('viewBox') ?? 'ohne viewBox'} ${(s.getAttribute('class') ?? '').slice(0, 40)}`);
    if (verborgen(s)) { ergebnis.verborgen += 1; continue; }
    if (s.getAttribute('role') === 'img' && name(s)) { ergebnis.benannt += 1; continue; }
    if (sichtbar(s)) ergebnis.unbenannt.push(`${s.getAttribute('viewBox') ?? ''} ${(s.getAttribute('class') ?? '').slice(0, 50)} in ${s.parentElement?.tagName.toLowerCase()}`);
  }
  return ergebnis;
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'json']) if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  const routen = typeof args.routen === 'string'
    ? args.routen.split(',').map((r) => r.trim()).filter(Boolean).map((p) => ({ id: p, pfad: p }))
    : HAUPTANSICHTEN;

  const dateien = [...svgDateien(path.join(REPO, 'src')), ...svgDateien(path.join(REPO, 'public'))].map(dateiPruefen);

  const browser = await browserStarten();
  const ansichten = [];
  try {
    for (const r of routen) {
      const ctx = await kontextFuer(browser, GERAETE[2]);
      await attrappenSetzen(ctx);
      const page = await ctx.newPage();
      try {
        await laden(page, r.pfad);
        await durchscrollen(page);
        await page.waitForTimeout(800);
        ansichten.push({ id: r.id, pfad: r.pfad, ...(await page.evaluate(svgImDokument)) });
      } catch (e) {
        ansichten.push({ id: r.id, pfad: r.pfad, fehler: String(e.message).split('\n')[0] });
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const dateiBefunde = dateien.filter((d) => d.befunde.length);
  const md = [
    `# SVG-Prüfung · ${new Date().toISOString()} · Server ${BASIS_URL}`,
    '',
    `## Dateien (${dateien.length})`,
    '| Datei | Bytes | Befunde |',
    '|---|---|---|',
    ...dateien.map((d) => `| ${zelle(d.datei)} | ${d.bytes} | ${zelle(d.befunde.join('; ') || 'keine')} |`),
    '',
    '## Ansichten (Desktop)',
    '| Ansicht | SVG | Icons (eine Familie) | Grafiken | andere | verborgen | benannt | unbenannt sichtbar | doppelte id | lucide |',
    '|---|---|---|---|---|---|---|---|---|---|',
    ...ansichten.map((a) => (a.fehler
      ? `| ${zelle(a.id)} | Fehler: ${zelle(a.fehler)} |||||||||`
      : `| ${zelle(a.id)} | ${a.gesamt} | ${a.icons} | ${a.grafiken} | ${a.andere.length} | ${a.verborgen} | ${a.benannt} | ${a.unbenannt.length} | ${a.doppelt.length} | ${a.lucide} |`)),
    '',
    '## Einzelheiten (nur mit Befund oder „andere“)',
    ...ansichten.flatMap((a) => {
      const z = [];
      if (a.unbenannt?.length) z.push(`- ${a.id}: unbenannt sichtbar: ${a.unbenannt.join(' · ')}`);
      if (a.doppelt?.length) z.push(`- ${a.id}: doppelte id: ${a.doppelt.join(', ')}`);
      if (a.andere?.length) z.push(`- ${a.id}: andere SVG: ${a.andere.join(' · ')}`);
      return z;
    }),
    '',
    `Befunde: Dateien ${dateiBefunde.length}, unbenannt sichtbar ${ansichten.reduce((s, a) => s + (a.unbenannt?.length ?? 0), 0)}, doppelte id ${ansichten.reduce((s, a) => s + (a.doppelt?.length ?? 0), 0)}, lucide ${ansichten.reduce((s, a) => s + (a.lucide ?? 0), 0)}`,
  ].join('\n');

  const stempel = zeitstempel();
  const datei = typeof args.json === 'string' ? path.resolve(args.json) : path.join(PROTOKOLLE, `svg-pruefung-${stempel}.json`);
  ordner(path.dirname(datei));
  writeFileSync(datei, `${JSON.stringify({ skript: 'svg-pruefung', server: BASIS_URL, dateien, ansichten }, null, 2)}\n`);
  console.log(md);
  console.log(`JSON-Protokoll: ${datei}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
