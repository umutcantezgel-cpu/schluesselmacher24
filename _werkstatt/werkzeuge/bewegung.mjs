#!/usr/bin/env node
// bewegung.mjs – Bewegungsprüfungen in drei Modi.
// Aufrufe:
//   node bewegung.mjs reduziert [--routen <pfad,pfad>] [--json <datei>]
//   node bewegung.mjs einzelbilder <pfad> --selektor <css> --dauer <ms> [--geraet mobil|desktop] [--ziel <ordner>] [--json <datei>]
//   node bewegung.mjs bildrate <pfad> --selektor <css> --dauer <ms> [--json <datei>]
// reduziert: Kontext mit „Bewegung reduzieren“ (Desktop), laden, durchscrollen. Befunde: laufende Animationen,
//   deren Keyframes transform, translate, scale, rotate, top, left, width oder height ändern; sichtbare
//   Textelemente mit Deckkraft < 0,1 (Vorfahren eingerechnet) oder visibility:hidden („Inhalt verborgen“).
// einzelbilder: lädt ohne Durchscrollen (damit der Auftritt beim Scrollen ausgelöst wird), scrollt das Element
//   in den Blick und nimmt 5 Bilder bei 0, ¼, ½, ¾ und 1 der --dauer auf, zugeschnitten auf das Element.
//   Standard --geraet desktop; Ziel Standard BILDER_EXTERN. Dateiname <pfad>__<geraet>__<selektor>__<k>.jpg, k = 0…4.
// bildrate: mobil 390×844, Prozessor 4-fach gedrosselt. Sammelt rAF-Zeitstempel über --dauer + 200 ms, während das
//   Element in den Blick scrollt. Verworfene Bilder = Summe max(0; round(Abstand / 16,67) − 1); Anteil = verworfen ÷
//   (gezeichnet + verworfen); Schwelle 5 %.
// Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  HAUPTANSICHTEN, GERAETE, BILDER_EXTERN, PROTOKOLLE, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

class Bedienfehler extends Error {}
const bedienfehler = (text) => { throw new Bedienfehler(text); };
const slug = (p) => (p === '/' ? 'start' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase());
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const fmt = (n, stellen) => n.toFixed(stellen).replace('.', ',');
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
function geraetWahl(text) {
  if (text === 'mobil') return GERAETE[0];
  if (text === 'desktop') return GERAETE[2];
  return bedienfehler(`--geraet „${text}“ ist nicht erlaubt (mobil|desktop)`);
}

/** Läuft im Browser. Prüft Animationen und verborgene Textelemente. */
function pruefeReduziert() {
  const bewegt = ['transform', 'translate', 'scale', 'rotate', 'top', 'left', 'width', 'height'];
  const ohne = ['offset', 'easing', 'composite', 'computedOffset'];
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
  const animationen = [];
  let laufend = 0;
  for (const a of document.getAnimations()) {
    if (a.playState !== 'running') continue;
    laufend += 1;
    const eff = a.effect;
    const ziel = eff && eff.target;
    const eigen = new Set();
    for (const kf of eff ? eff.getKeyframes() : []) {
      for (const k of Object.keys(kf)) if (!ohne.includes(k)) eigen.add(k);
    }
    const treffer = [...eigen].filter((k) => bewegt.includes(k));
    if (treffer.length) {
      animationen.push({
        name: a.animationName || a.transitionProperty || a.constructor.name,
        eigenschaften: treffer,
        element: ziel ? sel(ziel) : '–',
      });
    }
  }
  const verborgen = [];
  let textElemente = 0;
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('.sr-only, [aria-hidden="true"]')) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (el.getClientRects().length === 0) continue;
    textElemente += 1;
    const cs = getComputedStyle(el);
    let deckkraft = 1;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      deckkraft *= parseFloat(getComputedStyle(e).opacity);
    }
    if (cs.visibility === 'hidden' || deckkraft < 0.1) {
      verborgen.push({
        element: sel(el),
        text: el.textContent.trim().slice(0, 60),
        grund: cs.visibility === 'hidden' ? 'visibility: hidden' : `Deckkraft ${deckkraft.toFixed(2)}`,
      });
    }
  }
  return { laufend, animationen, verborgen, textElemente };
}

/** Läuft im Browser. Sammelt rAF-Zeitstempel, während das Element in den Blick scrollt. */
function rafZeiten({ selektor, dauer }) {
  const el = document.querySelector(selektor);
  if (!el) return null;
  return new Promise((fertig) => {
    const zeiten = [];
    const ende = performance.now() + dauer + 200;
    const tick = (t) => {
      zeiten.push(t);
      if (t < ende) requestAnimationFrame(tick);
      else fertig(zeiten);
    };
    requestAnimationFrame(tick);
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
}

async function reduziert(args) {
  const routen = routenWaehlen(args.routen);
  const zeilen = [];
  const browser = await browserStarten();
  try {
    for (const r of routen) {
      const context = await kontextFuer(browser, GERAETE[2], { reduziert: true });
      try {
        await attrappenSetzen(context);
        const page = await context.newPage();
        await laden(page, r.pfad);
        await durchscrollen(page);
        await page.waitForTimeout(600);
        zeilen.push({ ansicht: r.id, pfad: r.pfad, ...(await page.evaluate(pruefeReduziert)) });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  const protokoll = jsonSchreiben('bewegung-reduziert', args, { zeilen });
  console.log(tabelle(
    ['Ansicht', 'Laufende Animationen', 'Bewegungs-Befunde', 'Inhalt verborgen', 'Textelemente geprüft'],
    zeilen.map((z) => [z.ansicht, z.laufend, z.animationen.length, z.verborgen.length, z.textElemente]),
  ));
  const mitBefund = zeilen.filter((z) => z.animationen.length || z.verborgen.length);
  if (mitBefund.length) {
    console.log('\n### Einzelbefunde\n');
    for (const z of mitBefund) {
      for (const a of z.animationen) console.log(`- ${z.ansicht} · Bewegung: \`${a.name}\` ändert ${a.eigenschaften.join(', ')} an \`${a.element}\``);
      for (const v of z.verborgen) console.log(`- ${z.ansicht} · Inhalt verborgen (${v.grund}): \`${v.element}\` „${v.text}“`);
    }
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

async function einzelbilder(args, pfad, dauer) {
  const g = geraetWahl(args.geraet ?? 'desktop');
  const ziel = ordner(args.ziel ?? BILDER_EXTERN);
  const name = `${slug(pfad)}__${g.id}__${slug(args.selektor)}`;
  const bilder = [];
  const browser = await browserStarten();
  try {
    const context = await kontextFuer(browser, g);
    try {
      await attrappenSetzen(context);
      const page = await context.newPage();
      await laden(page, pfad);
      const el = page.locator(args.selektor).first();
      if ((await el.count()) === 0) bedienfehler(`Selektor „${args.selektor}“ auf ${pfad} nicht gefunden`);
      await el.evaluate((e) => e.scrollIntoView({ behavior: 'instant', block: 'center' }));
      const t0 = Date.now();
      for (let k = 0; k < 5; k += 1) {
        const soll = Math.round((dauer * k) / 4);
        const warten = soll - (Date.now() - t0);
        if (warten > 0) await page.waitForTimeout(warten);
        const ist = Date.now() - t0;
        const box = await el.boundingBox();
        if (!box) bedienfehler(`Element ohne Fläche bei Bild ${k}`);
        const datei = path.join(ziel, `${name}__${k}.jpg`);
        await page.screenshot({ path: datei, type: 'jpeg', quality: 60, scale: 'css', caret: 'initial', clip: box });
        bilder.push({ k, soll, ist, datei });
      }
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const protokoll = jsonSchreiben('bewegung-einzelbilder', args, { pfad, selektor: args.selektor, dauer, geraet: g.id, bilder });
  console.log(tabelle(
    ['Bild', 'Soll ms', 'Ist ms', 'Datei'],
    bilder.map((b) => [b.k, b.soll, b.ist, b.datei]),
  ));
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

async function bildrate(args, pfad, dauer) {
  const g = GERAETE[0];
  let zeiten = null;
  const browser = await browserStarten();
  try {
    const context = await kontextFuer(browser, g);
    try {
      await attrappenSetzen(context);
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await laden(page, pfad);
      zeiten = await page.evaluate(rafZeiten, { selektor: args.selektor, dauer });
      if (zeiten === null) bedienfehler(`Selektor „${args.selektor}“ auf ${pfad} nicht gefunden`);
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
  let verworfen = 0;
  for (let i = 1; i < zeiten.length; i += 1) {
    verworfen += Math.max(0, Math.round((zeiten[i] - zeiten[i - 1]) / 16.67) - 1);
  }
  const gezeichnet = zeiten.length;
  const anteil = (verworfen / Math.max(1, gezeichnet + verworfen)) * 100;
  const ueber = anteil > 5;
  const protokoll = jsonSchreiben('bewegung-bildrate', args, {
    pfad, selektor: args.selektor, dauer, geraet: g.id, gezeichnet, verworfen, anteil, schwelle: 5, ueber,
  });
  console.log(tabelle(
    ['Bilder (gezeichnet)', 'Verworfen', 'Anteil', 'Schwelle', 'Ergebnis'],
    [[gezeichnet, verworfen, `${fmt(anteil, 1)} %`, '5 %', ueber ? 'über Schwelle' : 'innerhalb Schwelle']],
  ));
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

async function main() {
  const args = argumente();
  const modus = args._[0];
  if (!['reduziert', 'einzelbilder', 'bildrate'].includes(modus)) {
    bedienfehler('Aufruf: node bewegung.mjs reduziert|einzelbilder|bildrate … (siehe Kopfkommentar)');
  }
  for (const k of ['routen', 'selektor', 'dauer', 'geraet', 'ziel', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  if (modus === 'reduziert') return reduziert(args);
  const pfad = args._[1];
  if (!pfad || !pfad.startsWith('/')) bedienfehler('Pfad fehlt oder beginnt nicht mit „/“');
  if (typeof args.selektor !== 'string') bedienfehler('--selektor <css> fehlt');
  const dauer = Number(args.dauer);
  if (!(dauer > 0)) bedienfehler('--dauer <ms> fehlt oder ist keine positive Zahl');
  return modus === 'einzelbilder' ? einzelbilder(args, pfad, dauer) : bildrate(args, pfad, dauer);
}

main().catch((e) => {
  if (e instanceof Bedienfehler) {
    console.error(`Bedienfehler: ${e.message}`);
    process.exit(2);
  }
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
