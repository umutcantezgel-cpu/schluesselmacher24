#!/usr/bin/env node
// animationen.mjs – sammelt jede Animation, die in einer Ansicht abläuft (Prüfstufe C, Abgleich mit dem Register K-007).
// Aufruf: node _werkstatt/werkzeuge/animationen.mjs [--routen p,p] [--geraet mobil|desktop] [--json <datei>] [--bedienen]
// Erfasst ab dem Laden über Ereignisse (animationstart, transitionstart) und über Element.animate (WAAPI):
//   CSS-Animationen nach Keyframe-Name, Übergänge nach Eigenschaft, WAAPI-Animationen nach Element.
// Bekannte Keyframes: @keyframes in src/app/(site)/globals.css, die keyframes in tailwind.config.ts und die
// vier Standard-Keyframes von Tailwind (spin, ping, pulse, bounce).
// Ein Keyframe-Name, der dort nicht steht, ist ein Befund. Die Zuordnung zu B-01 … B-26 macht der Prüfer.
// --bedienen: nach Laden und Durchscrollen bedient das Werkzeug, was es findet; nach jeder Bedienung 600 ms Wartezeit.
//   Schmal (unter 1.024 px, mobil): Knopf aria-controls="hauptmenue-mobil" (Schublade), darin der erste Knopf
//   aria-expanded="false" (Untermenü), dann Escape. Breit (Desktop): erster Knopf aria-controls="megamenue" in der
//   Hauptnavigation überfahren, dann klicken, dann Escape. Beide: erster Knopf mit aria-expanded in main (Akkordeon)
//   öffnen und wieder schließen; gibt es einen aktivierten Knopf „Weiter“ in main, der nicht absendet, ihn klicken und
//   danach „Zurück“. Knöpfe, die absenden (type="submit", oder ohne type im Formular), werden für Akkordeon, Weiter und
//   Zurück übergangen (Knopf-Eigenschaft button.type und Formularzugehörigkeit im Browser geprüft).
//   Jede Bedienung wird protokolliert (gefunden, ausgeführt, Fehler); die Zählung umfasst sie.
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

/** Erster sichtbarer Treffer des Selektors (Playwright prüft die Sichtbarkeit). */
const sichtbar = (page, selektor) => page.locator(selektor).filter({ visible: true }).first();

/**
 * Eine Bedienung: finden, ausführen, danach 600 ms warten. art: klick | fahren | taste.
 * Fehler werden im Protokoll vermerkt, nicht geworfen; die Seite läuft weiter.
 */
async function schritt(page, name, ziel, art) {
  const eintrag = { schritt: name, gefunden: false, ausgefuehrt: false, fehler: null };
  try {
    if (art === 'taste') {
      await page.keyboard.press('Escape');
      eintrag.gefunden = true;
      eintrag.ausgefuehrt = true;
    } else {
      eintrag.gefunden = (await ziel.count()) > 0;
      if (eintrag.gefunden) {
        if (art === 'fahren') await ziel.hover({ timeout: 3000 });
        else await ziel.click({ timeout: 3000 });
        eintrag.ausgefuehrt = true;
      }
    }
  } catch (e) {
    eintrag.fehler = String(e.message ?? e).split('\n')[0];
  }
  if (eintrag.ausgefuehrt) await page.waitForTimeout(600);
  return eintrag;
}

/**
 * Markiert den ersten sichtbaren, aktivierten Knopf, der beim Klick nichts absendet, und liefert einen Locator darauf
 * (er findet nichts, wenn es keinen solchen Knopf gibt). Ein Knopf absendet, wenn er type="submit" trägt oder
 * (ohne type) im Formular steht, denn der Standardtyp ist submit. Solche Knöpfe bleiben unberührt.
 * text: optionaler regulärer Ausdruck für den Knopftext (ganzer Text, ohne äußere Leerzeichen).
 */
async function sicherenKnopf(page, schritt, auswahl, text = null) {
  await page.evaluate(({ schritt, auswahl, text }) => {
    document.querySelectorAll('[data-sm24-schritt]').forEach((e) => e.removeAttribute('data-sm24-schritt'));
    const re = text ? new RegExp(text) : null;
    const knopf = [...document.querySelectorAll(auswahl)].find((b) => {
      if (!(b instanceof HTMLButtonElement) || b.disabled) return false;
      const r = b.getBoundingClientRect();
      const cs = getComputedStyle(b);
      if (!(r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none')) return false;
      if (b.type === 'submit' && (b.form !== null || b.getAttribute('type') === 'submit')) return false;
      return re ? re.test(b.textContent.trim()) : true;
    });
    if (knopf) knopf.setAttribute('data-sm24-schritt', schritt);
  }, { schritt, auswahl, text });
  return page.locator(`[data-sm24-schritt="${schritt}"]`);
}

/** Bedient, was die Seite je Gerät bietet (siehe Kopfkommentar). */
async function bedienen(page, geraet) {
  const liste = [];
  if (geraet.breite < 1024) {
    liste.push(await schritt(page, 'Schublade', sichtbar(page, 'button[aria-controls="hauptmenue-mobil"]'), 'klick'));
    liste.push(await schritt(page, 'Untermenü', sichtbar(page, '#hauptmenue-mobil button[aria-expanded="false"]'), 'klick'));
    liste.push(await schritt(page, 'Escape', null, 'taste'));
  } else {
    const megamenue = sichtbar(page, 'nav[aria-label="Hauptnavigation"] button[aria-controls="megamenue"]');
    liste.push(await schritt(page, 'Megamenü überfahren', megamenue, 'fahren'));
    liste.push(await schritt(page, 'Megamenü klicken', megamenue, 'klick'));
    liste.push(await schritt(page, 'Escape', null, 'taste'));
  }
  const akkordeon = await sicherenKnopf(page, 'Akkordeon', 'main button[aria-expanded]');
  liste.push(await schritt(page, 'Akkordeon öffnen', akkordeon, 'klick'));
  liste.push(await schritt(page, 'Akkordeon schließen', akkordeon, 'klick'));
  const weiter = await sicherenKnopf(page, 'Weiter', 'main button', '^\\s*Weiter\\s*$');
  const weiterEintrag = await schritt(page, 'Weiter', weiter, 'klick');
  liste.push(weiterEintrag);
  if (weiterEintrag.ausgefuehrt) {
    const zurueck = await sicherenKnopf(page, 'Zurück', 'main button', '^\\s*Zurück\\s*$');
    liste.push(await schritt(page, 'Zurück', zurueck, 'klick'));
  }
  return liste;
}

const bedienungText = (liste) => liste
  .map((e) => `${e.schritt} ${e.gefunden ? 'ja' : 'nein'}/${e.ausgefuehrt ? 'ja' : 'nein'}${e.fehler ? ' (Fehler)' : ''}`)
  .join(' · ') || 'keine';

async function main() {
  // --bedienen ist ein Schalter ohne Wert: aus der Liste nehmen, damit er keinen Wert verschluckt.
  const roh = process.argv.slice(2);
  const bedienenAn = roh.includes('--bedienen');
  const args = argumente(roh.filter((t) => t !== '--bedienen'));
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
        const bedienung = bedienenAn ? await bedienen(page, geraet) : null;
        const log = await page.evaluate(() => window.__sm24Animationen);
        const unbekannt = Object.keys(log.css).filter((n) => !bekannt.has(n));
        ansichten.push({
          id: r.id,
          pfad: r.pfad,
          ...log,
          waapi: [...new Set(log.waapi)],
          unbekannt,
          ...(bedienenAn ? { bedienung } : {}),
        });
      } catch (e) {
        ansichten.push({ id: r.id, pfad: r.pfad, fehler: String(e.message).split('\n')[0] });
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const kopf = ['Ansicht', 'CSS-Animationen (Keyframe × Anzahl)', 'WAAPI (Element)', 'Übergänge (Eigenschaft × Anzahl)', 'unbekannt'];
  if (bedienenAn) kopf.push('Bedienung');
  const bedienFehler = ansichten.flatMap((a) => (a.bedienung ?? [])
    .filter((e) => e.fehler)
    .map((e) => `- ${a.id} · ${e.schritt}: ${e.fehler}`));
  const md = [
    `# Animationen · ${new Date().toISOString()} · Server ${BASIS_URL} · Gerät ${geraet.id}`,
    '',
    `Bekannte Keyframes (${bekannt.size}): ${[...bekannt].sort().join(', ')}`,
    '',
    `| ${kopf.join(' | ')} |`,
    `|${kopf.map(() => '---').join('|')}|`,
    ...ansichten.map((a) => {
      if (a.fehler) return `| ${zelle(a.id)} | Fehler: ${zelle(a.fehler)} ${bedienenAn ? '|||||' : '||||'}`;
      const zellen = [
        zelle(a.id),
        zelle(Object.entries(a.css).map(([n, z]) => `${n} ×${z}`).join(', ') || 'keine'),
        zelle(a.waapi.join(', ') || 'keine'),
        zelle(Object.entries(a.uebergang).map(([n, z]) => `${n} ×${z}`).join(', ') || 'keine'),
        zelle(a.unbekannt.join(', ') || 'keine'),
      ];
      if (bedienenAn) zellen.push(zelle(bedienungText(a.bedienung ?? [])));
      return `| ${zellen.join(' | ')} |`;
    }),
    '',
    `Befunde (unbekannte Keyframes): ${ansichten.reduce((s, a) => s + (a.unbekannt?.length ?? 0), 0)}`,
    ...(bedienenAn ? [
      '',
      'Bedienung: je Schritt gefunden/ausgeführt (ja/nein); „(Fehler)“ = Bedienung fehlgeschlagen.',
      ...(bedienFehler.length ? ['', 'Bedienfehler:', ...bedienFehler] : []),
    ] : []),
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
