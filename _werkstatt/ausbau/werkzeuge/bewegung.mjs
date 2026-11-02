#!/usr/bin/env node
// bewegung.mjs – Bewegungsprüfungen in drei Modi.
// Aufrufe:
//   node bewegung.mjs reduziert [--routen <pfad,pfad>] [--json <datei>]
//   node bewegung.mjs einzelbilder <pfad> --selektor <css> [--dauer <ms>] [--echtzeit] [--rand <px>] [--geraet mobil|desktop] [--ziel <ordner>] [--json <datei>]
//   node bewegung.mjs bildrate <pfad> --selektor <css> --dauer <ms> [--laeufe <n>] [--json <datei>]
// reduziert: Kontext mit „Bewegung reduzieren“ (Desktop), laden, durchscrollen. Befunde: laufende Animationen,
//   deren Keyframes transform, translate, scale, rotate, top, left, width oder height ändern; sichtbare
//   Textelemente mit Deckkraft < 0,1 (Vorfahren eingerechnet) oder visibility:hidden („Inhalt verborgen“).
// einzelbilder: lädt ohne Durchscrollen, scrollt das Element in den Blick, wartet auf das nächste [data-motion] mit
//   „play“ (höchstens 5 s) und nimmt 5 Bilder bei 0, ¼, ½, ¾, 1 der ANIMATIONSZEIT auf: alle endlichen Animationen des
//   Elements (und seiner Hülle) werden pausiert und auf dieselbe absolute Zeit gesetzt (currentTime, inkl. Verzögerung).
//   Zeitfenster: kleinste Verzögerung bis größte endliche Endzeit; --dauer überschreibt die Länge. --echtzeit: alter
//   Wanduhr-Ablauf (Soll/Ist in ms ab dem Scrollen, --dauer nötig). --rand <px> (Standard 24) erweitert den Ausschnitt;
//   ein Element kleiner als 200 × 120 px wird auf den nächsten Vorfahren mit role="img" oder <svg> erweitert.
//   Standard --geraet desktop; Ziel Standard BILDER_EXTERN. Dateiname <pfad>__<geraet>__<selektor>__<k>.jpg, k = 0…4.
// bildrate: mobil 390×844, Prozessor 4-fach gedrosselt. Sammelt rAF-Zeitstempel über --dauer + 200 ms, während das
//   Element in den Blick scrollt. Verworfene Bilder = Summe max(0; round(Abstand / 16,67) − 1); Anteil = verworfen ÷
//   (gezeichnet + verworfen); Schwelle 5 %. --laeufe <n> (Standard 1): n frische Läufe, Ergebnis ist der Median der
//   Anteile; alle Einzelwerte stehen in Tabelle und JSON (wie messung.mjs, robust gegen Zeitpunkt der Hydrierung).
// Treffer (einzelbilder, bildrate): der erste GERENDERTE Treffer des Selektors (Breite > 0, getClientRects). Protokoll und
//   Text nennen Index unter allen Treffern, Größe in px und viewBox (bei SVG). Ohne gerenderten Treffer: Bedienfehler mit
//   Zahl der versteckten Treffer. Beispiel: node bewegung.mjs bildrate /schliessanlagen --selektor "main header [role=img]" --dauer 1600
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

/** Node-Seite: Fehlertext, wenn kein gerenderter Treffer vorliegt (mit Zahl der versteckten Treffer). */
const trefferFehler = (pfad, selektor, t) => (t.gesamt === 0
  ? `Selektor „${selektor}“ auf ${pfad} nicht gefunden`
  : `Selektor „${selektor}“ auf ${pfad}: ${t.gesamt} Treffer, alle versteckt (${t.versteckt} versteckt, kein gerenderter Treffer)`);
/** Node-Seite: Zeile für Text-Ausgabe. */
const trefferText = (t) => `Treffer: Index ${t.index} von ${t.gesamt} Treffern (${t.versteckt} versteckt) · ${t.groesse[0]} × ${t.groesse[1]} px · viewBox ${t.viewBox ?? '–'} · ${t.element}`;

/** Läuft im Browser. Erster gerenderter Treffer des Selektors (Index unter allen Treffern); sonst Zählung der versteckten. */
function trefferInPage(selektor) {
  const alle = [...document.querySelectorAll(selektor)];
  const gerendert = (e) => e.getClientRects().length > 0 && e.getBoundingClientRect().width > 0;
  const index = alle.findIndex(gerendert);
  const versteckt = alle.length - alle.filter(gerendert).length;
  if (index < 0) return { gesamt: alle.length, index: -1, versteckt, groesse: [0, 0], viewBox: null, element: null };
  const el = alle[index];
  const r = el.getBoundingClientRect();
  const tag = el.tagName.toLowerCase();
  const klasse = String(el.getAttribute('class') ?? '').split(/\s+/).find(Boolean);
  return {
    gesamt: alle.length,
    index,
    versteckt,
    groesse: [Math.round(r.width), Math.round(r.height)],
    viewBox: tag === 'svg' ? el.getAttribute('viewBox') : null,
    element: `${tag}${el.id ? `#${el.id}` : ''}${klasse ? `.${klasse.replace(/[^\w-]/g, '')}` : ''}`,
  };
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

/** Läuft im Browser. Erster gerenderter Treffer; sammelt rAF-Zeitstempel, während er in den Blick scrollt. */
function rafZeiten({ selektor, dauer }) {
  const alle = [...document.querySelectorAll(selektor)];
  const gerendert = (e) => e.getClientRects().length > 0 && e.getBoundingClientRect().width > 0;
  const index = alle.findIndex(gerendert);
  const versteckt = alle.length - alle.filter(gerendert).length;
  if (index < 0) {
    return Promise.resolve({ gesamt: alle.length, index: -1, versteckt, groesse: [0, 0], viewBox: null, element: null, zeiten: null });
  }
  const el = alle[index];
  const r = el.getBoundingClientRect();
  const tag = el.tagName.toLowerCase();
  const klasse = String(el.getAttribute('class') ?? '').split(/\s+/).find(Boolean);
  const info = {
    gesamt: alle.length,
    index,
    versteckt,
    groesse: [Math.round(r.width), Math.round(r.height)],
    viewBox: tag === 'svg' ? el.getAttribute('viewBox') : null,
    element: `${tag}${el.id ? `#${el.id}` : ''}${klasse ? `.${klasse.replace(/[^\w-]/g, '')}` : ''}`,
  };
  return new Promise((fertig) => {
    const zeiten = [];
    const ende = performance.now() + dauer + 200;
    const tick = (t) => {
      zeiten.push(t);
      if (t < ende) requestAnimationFrame(tick);
      else fertig({ ...info, zeiten });
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

/** Rand um den Ausschnitt in CSS-Pixeln (Option --rand). */
const RAND_STANDARD = 24;

/**
 * Läuft im Browser (auf dem Element). Bereitet eine Aufnahme vor:
 * 1. wartet (höchstens maxWarten) auf das nächste [data-motion], bis es „play“ zeigt;
 * 2. wählt den Ausschnitt (zu kleines Element → nächster vorfahr mit role=img oder svg);
 * 3. nur im Modus animationszeit: Animationen bereit abwarten, zwei Frames, alle pausieren,
 *    Zeitfenster bestimmen. Ergebnis: window.__sm24Bewegung = { erfassung, rand, anims }.
 */
async function bereitstellen(el, { modus, rand, dauerVorgabe, maxWarten }) {
  const beschreibe = (e) => {
    const klasse = String(e.getAttribute('class') ?? '').split(/\s+/).find(Boolean);
    return `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}${klasse ? `.${klasse.replace(/[^\w-]/g, '')}` : ''}`;
  };
  const warte = (ms) => new Promise((r) => { setTimeout(r, ms); });
  const zweiFrames = () => new Promise((r) => { requestAnimationFrame(() => requestAnimationFrame(() => r())); });
  const info = { motion: null, erweitert: null, animationen: 0, unendlich: 0, fenster: null };
  let anims = [];

  let motion = null;
  if (modus === 'animationszeit') {
    // Zugehörige Hülle: Vorfahre oder Nachfahre mit [data-motion]. Ein Element in der Dokumentreihenfolge
    // danach gehört nicht dazu; dessen Wartezeit würde das Ergebnis verfälschen.
    motion = el.closest('[data-motion]') ?? el.querySelector('[data-motion]');
    if (motion) {
      const t0 = performance.now();
      while (motion.getAttribute('data-motion') !== 'play' && performance.now() - t0 < maxWarten) await warte(50);
      info.motion = {
        element: beschreibe(motion),
        zustand: motion.getAttribute('data-motion'),
        wartezeit_ms: Math.round(performance.now() - t0),
      };
    } else {
      info.motion = { element: null, zustand: null, wartezeit_ms: 0 };
    }
  }

  let erfassung = el;
  const r0 = el.getBoundingClientRect();
  if (r0.width < 200 || r0.height < 120) {
    let v = el.parentElement;
    while (v && !v.matches('[role="img"], svg')) v = v.parentElement;
    info.erweitert = {
      von: beschreibe(el),
      groesse: [Math.round(r0.width), Math.round(r0.height)],
      auf: v ? beschreibe(v) : null,
    };
    if (v) erfassung = v;
  }

  if (modus === 'animationszeit') {
    const wurzeln = [erfassung];
    if (motion && (motion.contains(el) || el.contains(motion))) wurzeln.push(motion);
    const sammeln = () => {
      const menge = new Set();
      for (const w of wurzeln) {
        for (const a of w.getAnimations({ subtree: true })) {
          if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) continue;
          menge.add(a);
        }
      }
      return [...menge];
    };
    // Die Hülle legt ihre WAAPI-Animationen nach dem Umschalten an: zwei Frames abwarten, dann sammeln.
    await zweiFrames();
    anims = sammeln();
    await Promise.all(anims
      .filter((a) => a.playState !== 'idle')
      .map((a) => Promise.race([a.ready.catch(() => {}), warte(3000)])));
    // Zwei Frames nach „ready“: die Hülle setzt startTime erst dann; danach erst einfrieren.
    await zweiFrames();
    anims = sammeln();
    for (const a of anims) a.pause();

    let start = Infinity;
    let ende = -Infinity;
    for (const a of anims) {
      if (!a.effect) continue;
      const ct = a.effect.getComputedTiming();
      if (!Number.isFinite(ct.endTime)) { info.unendlich += 1; continue; }
      start = Math.min(start, ct.delay);
      ende = Math.max(ende, ct.endTime);
    }
    if (dauerVorgabe !== undefined) {
      start = Number.isFinite(start) ? start : 0;
      ende = start + dauerVorgabe;
    }
    info.animationen = anims.length;
    info.fenster = Number.isFinite(start) && Number.isFinite(ende) && ende > start ? { start, ende } : null;
  }

  window.__sm24Bewegung = { erfassung, rand, anims };
  return info;
}

/** Läuft im Browser. Ausschnitt des vorbereiteten Elements mit Rand, auf den Sichtbereich begrenzt. */
function ausschnittAktuell(rand) {
  const s = window.__sm24Bewegung;
  const r = s.erfassung.getBoundingClientRect();
  const x0 = Math.max(0, r.left - rand);
  const y0 = Math.max(0, r.top - rand);
  const x1 = Math.min(window.innerWidth, r.right + rand);
  const y1 = Math.min(window.innerHeight, r.bottom + rand);
  if (x1 <= x0 || y1 <= y0) return null;
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/** Läuft im Browser. Setzt die absolute Zeit aller erfassten Animationen (currentTime enthält die Verzögerung). */
function zeitSetzen(t) {
  for (const a of window.__sm24Bewegung.anims) a.currentTime = t;
}

/** Läuft im Browser. Zwei Bildschirmframes abwarten. */
function zweiFramesBrowser() {
  return new Promise((r) => { requestAnimationFrame(() => requestAnimationFrame(() => r())); });
}

async function einzelbilder(args, pfad, dauer) {
  const g = geraetWahl(args.geraet ?? 'desktop');
  const ziel = ordner(args.ziel ?? BILDER_EXTERN);
  const name = `${slug(pfad)}__${g.id}__${slug(args.selektor)}`;
  const echtzeit = args.echtzeit === true;
  const rand = args.rand === undefined ? RAND_STANDARD : Number(args.rand);
  if (!(rand >= 0)) bedienfehler('--rand <px> ist keine Zahl ≥ 0');
  const bilder = [];
  let info = null;
  let treffer = null;
  const browser = await browserStarten();
  try {
    const context = await kontextFuer(browser, g);
    try {
      await attrappenSetzen(context);
      const page = await context.newPage();
      await laden(page, pfad);
      treffer = await page.evaluate(trefferInPage, args.selektor);
      if (treffer.index < 0) bedienfehler(trefferFehler(pfad, args.selektor, treffer));
      const el = page.locator(args.selektor).nth(treffer.index);
      await el.evaluate((e) => e.scrollIntoView({ behavior: 'instant', block: 'center' }));
      info = await el.evaluate(bereitstellen, {
        modus: echtzeit ? 'echtzeit' : 'animationszeit',
        rand,
        dauerVorgabe: dauer,
        maxWarten: 5000,
      });
      if (echtzeit) {
        const t0 = Date.now();
        for (let k = 0; k < 5; k += 1) {
          const soll = Math.round((dauer * k) / 4);
          const warten = soll - (Date.now() - t0);
          if (warten > 0) await page.waitForTimeout(warten);
          const ist = Date.now() - t0;
          const clip = await page.evaluate(ausschnittAktuell, rand);
          if (!clip) bedienfehler(`Element ohne Fläche bei Bild ${k}`);
          const datei = path.join(ziel, `${name}__${k}.jpg`);
          await page.screenshot({ path: datei, type: 'jpeg', quality: 60, scale: 'css', caret: 'initial', clip });
          bilder.push({ k, soll, ist, datei, clip });
        }
      } else {
        const fenster = info.fenster;
        if (!fenster) bedienfehler('keine endliche Animation mit Dauer am Element gefunden; mit --dauer <ms> angeben oder --echtzeit nutzen');
        for (let k = 0; k < 5; k += 1) {
          const t = fenster.start + ((fenster.ende - fenster.start) * k) / 4;
          await page.evaluate(zeitSetzen, t);
          await page.evaluate(zweiFramesBrowser);
          const clip = await page.evaluate(ausschnittAktuell, rand);
          if (!clip) bedienfehler(`Element ohne Fläche bei Bild ${k}`);
          const datei = path.join(ziel, `${name}__${k}.jpg`);
          await page.screenshot({ path: datei, type: 'jpeg', quality: 60, scale: 'css', caret: 'initial', clip });
          bilder.push({ k, t: Math.round(t * 10) / 10, datei, clip });
        }
      }
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const modus = echtzeit ? 'echtzeit' : 'animationszeit';
  const protokoll = jsonSchreiben('bewegung-einzelbilder', args, {
    pfad, selektor: args.selektor, dauer: dauer ?? null, geraet: g.id, modus, rand, ...info, bilder, treffer,
  });
  if (echtzeit) {
    console.log(tabelle(
      ['Bild', 'Soll ms', 'Ist ms', 'Datei'],
      bilder.map((b) => [b.k, b.soll, b.ist, b.datei]),
    ));
  } else {
    console.log(tabelle(
      ['Bild', 't ms (Animationszeit)', 'Datei'],
      bilder.map((b) => [b.k, b.t, b.datei]),
    ));
    const f = info.fenster;
    const r1 = (z) => Math.round(z * 10) / 10;
    console.log(`\nAnimationszeit-Fenster: ${r1(f.start)} ms bis ${r1(f.ende)} ms · Animationen: ${info.animationen} · unendliche übersprungen: ${info.unendlich}`);
    if (info.motion.element) {
      const hinweis = info.motion.zustand === 'play' ? '' : ' · HINWEIS: nach Wartezeit nicht auf „play“';
      console.log(`[data-motion]: ${info.motion.element}, Zustand ${info.motion.zustand}, Wartezeit ${info.motion.wartezeit_ms} ms${hinweis}`);
    } else {
      console.log('[data-motion]: keines gefunden, sofort weiter');
    }
  }
  console.log(trefferText(treffer));
  if (info.erweitert) {
    const [w, h] = info.erweitert.groesse;
    console.log(`Ausschnitt erweitert: ${info.erweitert.von} (${w} × ${h} px) → ${info.erweitert.auf ?? 'kein Vorfahre mit role=img oder svg, Element bleibt'}`);
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

async function bildrateLauf(args, pfad, dauer) {
  const g = GERAETE[0];
  let ergebnis = null;
  const browser = await browserStarten();
  try {
    const context = await kontextFuer(browser, g);
    try {
      await attrappenSetzen(context);
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await laden(page, pfad);
      ergebnis = await page.evaluate(rafZeiten, { selektor: args.selektor, dauer });
      if (ergebnis.index < 0) bedienfehler(trefferFehler(pfad, args.selektor, ergebnis));
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const { zeiten, ...treffer } = ergebnis;
  let verworfen = 0;
  for (let i = 1; i < zeiten.length; i += 1) {
    verworfen += Math.max(0, Math.round((zeiten[i] - zeiten[i - 1]) / 16.67) - 1);
  }
  const gezeichnet = zeiten.length;
  return { gezeichnet, verworfen, anteil: (verworfen / Math.max(1, gezeichnet + verworfen)) * 100, treffer };
}

async function bildrate(args, pfad, dauer, laeufe = 1) {
  const g = GERAETE[0];
  const einzel = [];
  let treffer = null;
  for (let i = 0; i < laeufe; i += 1) {
    const lauf = await bildrateLauf(args, pfad, dauer);
    treffer ??= lauf.treffer;
    einzel.push({ gezeichnet: lauf.gezeichnet, verworfen: lauf.verworfen, anteil: lauf.anteil });
  }
  const sortiert = [...einzel].sort((a, b) => a.anteil - b.anteil);
  const median = sortiert[Math.floor((sortiert.length - 1) / 2)];
  const { gezeichnet, verworfen, anteil } = median;
  const ueber = anteil > 5;
  const protokoll = jsonSchreiben('bewegung-bildrate', args, {
    pfad, selektor: args.selektor, dauer, geraet: g.id, laeufe, gezeichnet, verworfen, anteil, schwelle: 5, ueber,
    einzel, treffer,
  });
  if (laeufe > 1) {
    console.log(tabelle(
      ['Lauf', 'Bilder (gezeichnet)', 'Verworfen', 'Anteil'],
      einzel.map((e, i) => [i + 1, e.gezeichnet, e.verworfen, `${fmt(e.anteil, 1)} %`]),
    ));
    console.log(`\nMedian aus ${laeufe} Läufen:\n`);
  }
  console.log(tabelle(
    ['Bilder (gezeichnet)', 'Verworfen', 'Anteil', 'Schwelle', 'Ergebnis'],
    [[gezeichnet, verworfen, `${fmt(anteil, 1)} %`, '5 %', ueber ? 'über Schwelle' : 'innerhalb Schwelle']],
  ));
  console.log(trefferText(treffer));
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

async function main() {
  // --echtzeit ist ein Schalter ohne Wert: aus der Liste nehmen, damit er keinen Pfad verschluckt.
  const roh = process.argv.slice(2);
  const args = argumente(roh.filter((t) => t !== '--echtzeit'));
  args.echtzeit = roh.includes('--echtzeit');
  const modus = args._[0];
  if (!['reduziert', 'einzelbilder', 'bildrate'].includes(modus)) {
    bedienfehler('Aufruf: node bewegung.mjs reduziert|einzelbilder|bildrate … (siehe Kopfkommentar)');
  }
  for (const k of ['routen', 'selektor', 'dauer', 'geraet', 'ziel', 'json', 'rand', 'laeufe']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  if (modus === 'reduziert') return reduziert(args);
  const pfad = args._[1];
  if (!pfad || !pfad.startsWith('/')) bedienfehler('Pfad fehlt oder beginnt nicht mit „/“');
  if (typeof args.selektor !== 'string') bedienfehler('--selektor <css> fehlt');
  const dauer = args.dauer === undefined ? undefined : Number(args.dauer);
  if (dauer !== undefined && !(dauer > 0)) bedienfehler('--dauer <ms> ist keine positive Zahl');
  if (modus === 'bildrate') {
    if (dauer === undefined) bedienfehler('--dauer <ms> fehlt oder ist keine positive Zahl');
    const laeufe = args.laeufe === undefined ? 1 : Number(args.laeufe);
    if (!Number.isInteger(laeufe) || laeufe < 1 || laeufe > 15) bedienfehler('--laeufe <n> muss eine ganze Zahl von 1 bis 15 sein');
    return bildrate(args, pfad, dauer, laeufe);
  }
  if (args.echtzeit && dauer === undefined) bedienfehler('--echtzeit braucht --dauer <ms>');
  return einzelbilder(args, pfad, dauer);
}

main().catch((e) => {
  if (e instanceof Bedienfehler) {
    console.error(`Bedienfehler: ${e.message}`);
    process.exit(2);
  }
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
