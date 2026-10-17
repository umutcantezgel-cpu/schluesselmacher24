#!/usr/bin/env node
// animationen.mjs – sammelt jede Animation, die in einer Ansicht abläuft (Prüfstufe C, Abgleich mit dem Register K-007).
// Aufruf: node _werkstatt/werkzeuge/animationen.mjs [--routen p,p] [--geraet mobil|desktop] [--json <datei>]
// Erfasst ab dem Laden über Ereignisse (animationstart, transitionstart) und über Element.animate (WAAPI):
//   CSS-Animationen nach Keyframe-Name, Übergänge nach Eigenschaft, WAAPI-Animationen nach Element.
// Bekannte Keyframes: @keyframes in src/app/(site)/globals.css, die keyframes in tailwind.config.ts und die
// vier Standard-Keyframes von Tailwind (spin, ping, pulse, bounce).
// Ein Keyframe-Name, der dort nicht steht, ist ein Befund. Die Zuordnung zu B-01 … B-26 macht der Prüfer.
// Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  REPO, BASIS_URL, GERAETE, PROTOKOLLE, HAUPTANSICHTEN, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');

function bekannteKeyframes() {
  const css = readFileSync(path.join(REPO, 'src', 'app', '(site)', 'globals.css'), 'utf8');
  const tw = readFileSync(path.join(REPO, 'tailwind.config.ts'), 'utf8');
  // Tailwind bringt spin, ping, pulse und bounce mit (animate-spin = Kreisel, Register B-19).
  const namen = new Set(['spin', 'ping', 'pulse', 'bounce', ...[...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1])]);
  const block = tw.match(/keyframes:\s*\{([\s\S]*?)\n\s{6}\},/);
  if (block) for (const m of block[1].matchAll(/^\s{8}'?([\w-]+)'?:\s*\{/gm)) namen.add(m[1]);
  return namen;
}

/* Läuft vor jedem Skript der Seite. */
function beobachten() {
  const log = { css: {}, uebergang: {}, waapi: [] };
  const merke = (ziel, schluessel) => { ziel[schluessel] = (ziel[schluessel] ?? 0) + 1; };
  document.addEventListener('animationstart', (e) => merke(log.css, e.animationName), true);
  document.addEventListener('transitionstart', (e) => merke(log.uebergang, e.propertyName), true);
  const original = Element.prototype.animate;
  Element.prototype.animate = function (...a) {
    log.waapi.push(`${this.tagName.toLowerCase()}${this.getAttribute('class') ? `.${String(this.getAttribute('class')).split(/\s+/).slice(0, 2).join('.')}` : ''}`);
    return original.apply(this, a);
  };
  window.__sm24Animationen = log;
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'json', 'geraet']) if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  const geraet = GERAETE.find((g) => g.id === (args.geraet ?? 'desktop'));
  if (!geraet) bedienfehler(`unbekanntes Gerät: ${args.geraet}`);
  const routen = typeof args.routen === 'string'
    ? args.routen.split(',').map((r) => r.trim()).filter(Boolean).map((p) => ({ id: p, pfad: p }))
    : HAUPTANSICHTEN;
  const bekannt = bekannteKeyframes();

  const browser = await browserStarten();
  const ansichten = [];
  try {
    for (const r of routen) {
      const ctx = await kontextFuer(browser, geraet);
      await attrappenSetzen(ctx);
      await ctx.addInitScript(beobachten);
      const page = await ctx.newPage();
      try {
        await laden(page, r.pfad);
        await page.waitForTimeout(1500);
        await durchscrollen(page, { pause: 250 });
        await page.waitForTimeout(1500);
        const log = await page.evaluate(() => window.__sm24Animationen);
        const unbekannt = Object.keys(log.css).filter((n) => !bekannt.has(n));
        ansichten.push({ id: r.id, pfad: r.pfad, ...log, waapi: [...new Set(log.waapi)], unbekannt });
      } catch (e) {
        ansichten.push({ id: r.id, pfad: r.pfad, fehler: String(e.message).split('\n')[0] });
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const md = [
    `# Animationen · ${new Date().toISOString()} · Server ${BASIS_URL} · Gerät ${geraet.id}`,
    '',
    `Bekannte Keyframes (${bekannt.size}): ${[...bekannt].sort().join(', ')}`,
    '',
    '| Ansicht | CSS-Animationen (Keyframe × Anzahl) | WAAPI (Element) | Übergänge (Eigenschaft × Anzahl) | unbekannt |',
    '|---|---|---|---|---|',
    ...ansichten.map((a) => (a.fehler
      ? `| ${zelle(a.id)} | Fehler: ${zelle(a.fehler)} ||||`
      : `| ${zelle(a.id)} | ${zelle(Object.entries(a.css).map(([n, z]) => `${n} ×${z}`).join(', ') || 'keine')} | ${zelle(a.waapi.join(', ') || 'keine')} | ${zelle(Object.entries(a.uebergang).map(([n, z]) => `${n} ×${z}`).join(', ') || 'keine')} | ${zelle(a.unbekannt.join(', ') || 'keine')} |`)),
    '',
    `Befunde (unbekannte Keyframes): ${ansichten.reduce((s, a) => s + (a.unbekannt?.length ?? 0), 0)}`,
  ].join('\n');

  const stempel = zeitstempel();
  const datei = typeof args.json === 'string' ? path.resolve(args.json) : path.join(PROTOKOLLE, `animationen-${stempel}.json`);
  ordner(path.dirname(datei));
  writeFileSync(datei, `${JSON.stringify({ skript: 'animationen', server: BASIS_URL, geraet: geraet.id, bekannt: [...bekannt], ansichten }, null, 2)}\n`);
  console.log(md);
  console.log(`JSON-Protokoll: ${datei}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
