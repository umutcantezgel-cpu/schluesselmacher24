#!/usr/bin/env node
// a11y.mjs – Zugänglichkeitsprüfung mit axe-core (WCAG 2.0, 2.1, 2.2; Stufen A und AA).
// Aufruf: node a11y.mjs [--routen <pfad,pfad>] [--geraet mobil|desktop|beide] [--json <datei>]
// Standard: alle 12 Hauptansichten, beide Geräte (mobil 390×844, desktop 1440×900).
// Je Ansicht: laden, einmal durchscrollen, dann axe. Ausgabe: Zahl der Regelverstöße je impact
// (critical, serious, moderate, minor), Stellen gesamt; je critical oder serious: Regel-ID,
// Hilfetext und bis zu 3 Ziel-Selektoren. Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import {
  HAUPTANSICHTEN, GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];
const GERAET_WAHL = { mobil: [GERAETE[0]], desktop: [GERAETE[2]], beide: [GERAETE[0], GERAETE[2]] };

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
  for (const k of ['routen', 'geraet', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const routen = routenWaehlen(args.routen);
  const geraetWahl = args.geraet ?? 'beide';
  if (!GERAET_WAHL[geraetWahl]) bedienfehler(`--geraet „${geraetWahl}“ ist nicht erlaubt`);
  const geraete = GERAET_WAHL[geraetWahl];

  const zeilen = [];
  const browser = await browserStarten();
  try {
    for (const r of routen) {
      for (const g of geraete) {
        const context = await kontextFuer(browser, g);
        try {
          await attrappenSetzen(context);
          const page = await context.newPage();
          await laden(page, r.pfad);
          await durchscrollen(page);
          const erg = await new AxeBuilder({ page }).withTags(TAGS).analyze();
          const zaehl = Object.fromEntries(IMPACTS.map((i) => [i, 0]));
          let stellen = 0;
          const details = [];
          for (const v of erg.violations) {
            const impact = v.impact ?? 'unbekannt';
            zaehl[impact] = (zaehl[impact] ?? 0) + 1;
            stellen += v.nodes.length;
            if (impact === 'critical' || impact === 'serious') {
              details.push({
                regel: v.id,
                impact,
                hilfe: v.help,
                ziele: v.nodes.slice(0, 3).map((n) => n.target.map(String).join(' ')),
              });
            }
          }
          zeilen.push({
            ansicht: r.id, pfad: r.pfad, geraet: g.id, zaehl, regeln: erg.violations.length, stellen, details,
            verstoesse: erg.violations.map((v) => ({
              id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
              nodes: v.nodes.map((n) => ({ target: n.target.map(String), html: String(n.html ?? '').slice(0, 300) })),
            })),
          });
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  const protokoll = jsonSchreiben('a11y', args, { tags: TAGS, zeilen });
  console.log(tabelle(
    ['Ansicht', 'Gerät', ...IMPACTS, 'Regeln gesamt', 'Stellen gesamt'],
    zeilen.map((z) => [z.ansicht, z.geraet, ...IMPACTS.map((i) => z.zaehl[i]), z.regeln, z.stellen]),
  ));
  const mitBefund = zeilen.filter((z) => z.details.length);
  if (mitBefund.length) {
    console.log('\n### Befunde critical und serious\n');
    for (const z of mitBefund) {
      for (const d of z.details) {
        console.log(`- ${z.ansicht} · ${z.geraet} · **${d.regel}** (${d.impact}): ${d.hilfe}. Ziele: ${d.ziele.map((t) => `\`${t}\``).join('; ')}`);
      }
    }
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
