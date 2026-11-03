#!/usr/bin/env node
// slopscan.mjs – Slop-Scan nach Auftrag 12 (Anti-Slop S1 bis S8) über die Hauptansichten je Gerät.
// Aufruf: node slopscan.mjs [--routen <pfad,pfad>] [--geraet mobil|desktop|beide] [--json <datei>]
// Standard: alle 14 Hauptansichten, beide Geräte (mobil 390 × 844, desktop 1440 × 900).
// Je Ansicht: laden, einmal durchscrollen, kurz warten, dann im Browser messen.
// Zählweise: S1 Zahl der benutzten Schriften aus der Liste (je Familie einmal). S2 Zahl der verschiedenen
//   Farben außerhalb der Token-Menge (Token: aufgelöste Werte der CSS-Variablen auf :root) plus Lila- und
//   Indigotöne (Farbton 260 bis 330 Grad, Sättigung über 25 %) plus verschiedene Tailwind-Klassen.
//   S3 Zahl der Elemente mit Verlauf, Verlaufstext, Glas, Blur über 20 px oder Canvas. S4 Zahl der Elemente mit
//   Icon-Klassen plus Emojis im sichtbaren Text. S5 Befund bei mehr als 40 % gleichem border-radius, plus
//   Elemente mit Tailwind-Standardschatten, plus Hover-Regeln mit Vergrößerung. S6 Befund ab dem zweiten Raster.
//   S7 SVG über 90 % der Breite, unter 120 px hoch, mit Kurvenbefehlen. S8 Befund je Einblendung auf mehr als
//   einem Drittel der section-Elemente von main. Slop-Index je Zeile = Summe der Befunde.
// Ausgabe: Markdown-Tabelle auf stdout, JSON-Protokoll. Exit 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  HAUPTANSICHTEN, GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const MOBIL = GERAETE.find((g) => g.id === 'mobil');
const DESKTOP = GERAETE.find((g) => g.id === 'desktop');
const GERAET_WAHL = { mobil: [MOBIL], desktop: [DESKTOP], beide: [MOBIL, DESKTOP] };
/** Schriften aus der KI-Standardliste (Auftrag 12, S1). */
const SCHRIFTEN = [
  'Inter', 'Geist', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'DM Sans', 'Manrope', 'Outfit',
  'Plus Jakarta Sans', 'Space Grotesk', 'Satoshi', 'Playfair Display', 'Cormorant', 'Fraunces', 'Instrument Serif',
];
const GENERISCH = [
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif',
  'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong',
];

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

/**
 * Läuft im Browser. Gibt nur einfache Werte zurück; alle Hilfsfunktionen liegen in dieser Funktion,
 * weil Playwright nur ihren Quelltext überträgt.
 */
function messeAnsicht(konfig) {
  // --- Farben als sRGB-Werte über ein Leinwand-Pixel ---------------------------------------
  const leinwand = document.createElement('canvas');
  leinwand.width = 1;
  leinwand.height = 1;
  const ctx = leinwand.getContext('2d', { willReadFrequently: true });
  const FUEHLER = '#fe01fd';
  const farbe = (css) => {
    if (typeof css !== 'string' || !css || css === 'none') return null;
    const roh = css.trim();
    // rgb()/rgba() direkt lesen: die Leinwand würde Alphawerte unter 1 runden und Grundfarben verfälschen.
    const direkt = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i.exec(roh);
    if (direkt) {
      const a = direkt[4] === undefined ? 1 : (direkt[4].endsWith('%') ? parseFloat(direkt[4]) / 100 : parseFloat(direkt[4]));
      return { r: Math.round(Number(direkt[1])), g: Math.round(Number(direkt[2])), b: Math.round(Number(direkt[3])), a: Math.round(a * 100) / 100 };
    }
    ctx.fillStyle = FUEHLER;
    ctx.fillStyle = roh;
    if (ctx.fillStyle === FUEHLER && roh.toLowerCase() !== FUEHLER) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: Math.round((a / 255) * 100) / 100 };
  };
  const schl = (c) => (c ? `${c.r},${c.g},${c.b},${c.a}` : null);
  // Token-Vergleich nur nach RGB: Alphavarianten einer Token-Farbe gehören zur Token-Familie.
  const rgbSchl = (c) => (c ? `${c.r},${c.g},${c.b}` : null);
  const violett = (c) => {
    const R = c.r / 255;
    const G = c.g / 255;
    const B = c.b / 255;
    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    if (max === min) return false;
    const d = max - min;
    const l = (max + min) / 2;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === R) h = (G - B) / d + (G < B ? 6 : 0);
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    // A-005: Lila und Indigo umfassen HSL 230 bis 330 Grad (vorher 260 bis 330, nun strenger).
    return h >= 230 && h <= 330 && s > 0.25;
  };
  const kanon = (name) => {
    let n = String(name).trim().replace(/^['"]|['"]$/g, '').trim();
    const m = /^__(.+?)(?:_Fallback)?_[0-9a-f]{4,}$/i.exec(n);
    if (m) n = m[1].replace(/_/g, ' ');
    return n.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // --- Token-Menge: aufgelöste Farbwerte aller Design-Variablen (--tw-* ausgenommen) -----------
  // Erfasst werden :root und Bereichsschemata wie [data-area] sowie Variablen in Inline-Styles.
  // Der Wert kommt je Treffer aus der berechneten Stilangabe, so dass Variablen mit var() aufgelöst sind.
  const tokenFarben = new Set();
  const nimmToken = (roh) => {
    let wert = String(roh ?? '').trim();
    if (!wert) return;
    if (/^[\d.]+\s+[\d.]+%\s+[\d.]+%(\s*\/\s*[\d.]+%?)?$/.test(wert)) wert = `hsl(${wert})`;
    // Seit KERN 2.0 stehen die Tokens als OKLCH-Tripel „L C H“ (ohne Prozent) in den Variablen.
    else if (/^[\d.]+\s+[\d.]+\s+-?[\d.]+(\s*\/\s*[\d.]+%?)?$/.test(wert)) wert = `oklch(${wert})`;
    const c = farbe(wert);
    if (c) tokenFarben.add(rgbSchl(c));
  };
  const sammleTokens = (regeln) => {
    for (const regel of regeln) {
      if (regel.media && !window.matchMedia(regel.media.mediaText).matches) continue;
      if (regel.cssRules) sammleTokens(regel.cssRules);
      if (!regel.selectorText || !regel.style) continue;
      const namen = [];
      for (let i = 0; i < regel.style.length; i += 1) {
        const n = regel.style[i];
        if (n.startsWith('--') && !n.startsWith('--tw-')) namen.push(n);
      }
      if (!namen.length) continue;
      let knoten;
      try {
        knoten = [...document.querySelectorAll(regel.selectorText)].slice(0, 20);
      } catch {
        continue;
      }
      for (const k of knoten) {
        const st = getComputedStyle(k);
        for (const n of namen) nimmToken(st.getPropertyValue(n));
      }
    }
  };
  for (const blatt of document.styleSheets) {
    try { sammleTokens(blatt.cssRules); } catch { /* fremdes Blatt ohne Zugriff */ }
  }
  for (const k of document.querySelectorAll('[style]')) {
    const st = getComputedStyle(k);
    for (let i = 0; i < k.style.length; i += 1) {
      const n = k.style[i];
      if (n.startsWith('--') && !n.startsWith('--tw-')) nimmToken(st.getPropertyValue(n));
    }
  }

  // --- sichtbare Elemente ----------------------------------------------------------------------
  const ausschluss = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'META', 'LINK', 'TITLE']);
  const wurzel = document.querySelector('main') ?? document.body;
  const elemente = [...document.body.querySelectorAll('*')].filter((e) => !ausschluss.has(e.tagName.toUpperCase()));
  const sichtbar = (e, st) => {
    if (st.display === 'none' || st.visibility === 'hidden' || st.visibility === 'collapse' || Number(st.opacity) === 0) return false;
    const rs = e.getClientRects();
    return rs.length > 0 && rs[0].width + rs[0].height > 0;
  };
  const beispiel = (e) => {
    const k = (e.getAttribute('class') || '').trim().split(/\s+/).slice(0, 2).filter(Boolean).join('.');
    return e.tagName.toLowerCase() + (k ? `.${k}` : '');
  };
  const FORM_TAGS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'use']);
  const farbeN = new Map();
  const nimmFarbe = (c, bsp) => {
    if (!c || c.a === 0) return;
    const k = rgbSchl(c);
    if (!farbeN.has(k)) farbeN.set(k, { c, bsp });
  };

  // Schriften: wirksame Familie je Textelement ist die erste tatsächlich geladene oder generische
  const geladen = new Set();
  document.fonts.forEach((f) => { if (f.status === 'loaded') geladen.add(kanon(f.family)); });
  const generischK = new Set(konfig.generisch.map(kanon));
  const liste = new Map(konfig.schriften.map((s) => [kanon(s), s]));
  const schriftenZaehl = new Map();

  const radien = new Map();
  let radienGesamt = 0;
  const s3 = { verlauf: 0, verlaufBsp: [], verlaufText: 0, verlaufTextBsp: [], glas: 0, glasBsp: [], leucht: 0, leuchtBsp: [], partikel: 0, partikelBsp: [] };
  const s4 = { ikon: 0, ikonBsp: [], emoji: 0, emojiBsp: [] };
  const s5 = { schatten: 0, schattenBsp: [], hover: 0, hoverBsp: [] };
  const ikonKlasse = /^(lucide|heroicon|fa-|fa$|fas$|far$|fab$|fal$|fad$|material-icons|material-symbols|bi-|ri-)/i;
  const ikonAttribut = /lucide|heroicon/i;
  const vorgaben = new Map([
    ['0,0,0,0.05|0|1|2|0', 'shadow-sm'],
    ['0,0,0,0.1|0|1|3|0;0,0,0,0.1|0|1|2|-1', 'shadow'],
    ['0,0,0,0.1|0|4|6|-1;0,0,0,0.1|0|2|4|-2', 'shadow-md'],
    ['0,0,0,0.1|0|10|15|-3;0,0,0,0.1|0|4|6|-4', 'shadow-lg'],
    ['0,0,0,0.1|0|20|25|-5;0,0,0,0.1|0|8|10|-6', 'shadow-xl'],
    ['0,0,0,0.25|0|25|50|-12', 'shadow-2xl'],
  ]);
  const schattenSignatur = (text) => [...text.matchAll(/(rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)|#[0-9a-fA-F]{3,8}|\b[a-z]+\b)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/g)]
    .map((m) => {
      const c = farbe(m[1]);
      return c ? `${schl(c)}|${Number(m[2])}|${Number(m[3])}|${Number(m[4])}|${Number(m[5])}` : 'x';
    })
    .join(';');

  for (const e of elemente) {
    const st = getComputedStyle(e);
    if (!sichtbar(e, st)) continue;
    const hatText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (hatText) {
      const familien = st.fontFamily.split(',').map((s) => s.trim()).filter(Boolean);
      let wirksam = null;
      for (const f of familien) {
        const k = kanon(f);
        if (generischK.has(k) || geladen.has(k)) { wirksam = f; break; }
      }
      if (!wirksam) wirksam = familien[0] ?? '';
      const k = kanon(wirksam);
      if (k) {
        const eintrag = schriftenZaehl.get(k) ?? { name: wirksam.replace(/^['"]|['"]$/g, ''), anzahl: 0 };
        eintrag.anzahl += 1;
        schriftenZaehl.set(k, eintrag);
      }
      nimmFarbe(farbe(st.color), beispiel(e));
    }
    const hintergrund = farbe(st.backgroundColor);
    const hatBgFarbe = !!hintergrund && hintergrund.a > 0;
    if (hatBgFarbe) nimmFarbe(hintergrund, beispiel(e));
    const bild = !!st.backgroundImage && st.backgroundImage !== 'none';
    if (bild && st.backgroundImage.includes('gradient')) {
      s3.verlauf += 1;
      if (s3.verlaufBsp.length < 3) s3.verlaufBsp.push(beispiel(e));
    }
    for (const p of ['::before', '::after']) {
      const ps = getComputedStyle(e, p);
      if (ps.content && ps.content !== 'none' && ps.content !== 'normal' && ps.backgroundImage.includes('gradient')) {
        s3.verlauf += 1;
        if (s3.verlaufBsp.length < 3) s3.verlaufBsp.push(`${beispiel(e)}${p}`);
      }
    }
    let rahmen = false;
    for (const seite of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(st[`border${seite}Width`]);
      const s = st[`border${seite}Style`];
      if (w > 0 && s !== 'none' && s !== 'hidden') {
        rahmen = true;
        nimmFarbe(farbe(st[`border${seite}Color`]), beispiel(e));
      }
    }
    if (e.namespaceURI === 'http://www.w3.org/2000/svg' && FORM_TAGS.has(e.tagName.toLowerCase())) {
      if (st.fill && st.fill !== 'none') nimmFarbe(farbe(st.fill), beispiel(e));
      if (st.stroke && st.stroke !== 'none') nimmFarbe(farbe(st.stroke), beispiel(e));
    }
    if (st.backgroundClip === 'text' || st.webkitBackgroundClip === 'text') {
      s3.verlaufText += 1;
      if (s3.verlaufTextBsp.length < 3) s3.verlaufTextBsp.push(beispiel(e));
    }
    const glasWert = st.backdropFilter || st.webkitBackdropFilter;
    if (glasWert && glasWert !== 'none') {
      s3.glas += 1;
      if (s3.glasBsp.length < 3) s3.glasBsp.push(beispiel(e));
    }
    const blur = /blur\(\s*([\d.]+)px\s*\)/.exec(st.filter || '');
    if (blur && parseFloat(blur[1]) > 20) {
      s3.leucht += 1;
      if (s3.leuchtBsp.length < 3) s3.leuchtBsp.push(beispiel(e));
    }
    if (e.tagName === 'CANVAS') {
      s3.partikel += 1;
      if (s3.partikelBsp.length < 3) s3.partikelBsp.push(beispiel(e));
    }
    const klassen = (e.getAttribute('class') || '').split(/\s+/).filter(Boolean);
    const istIkon = klassen.some((t) => ikonKlasse.test(t.split(':').pop())) || [...e.attributes].some((a) => ikonAttribut.test(a.name));
    if (istIkon) {
      s4.ikon += 1;
      if (s4.ikonBsp.length < 3) s4.ikonBsp.push(beispiel(e));
    }
    if (st.boxShadow && st.boxShadow !== 'none' && !st.boxShadow.includes('inset')) {
      const vorgabe = vorgaben.get(schattenSignatur(st.boxShadow));
      if (vorgabe) {
        s5.schatten += 1;
        if (s5.schattenBsp.length < 3) s5.schattenBsp.push(`${vorgabe} an ${beispiel(e)}`);
      }
    }
    if (bild || hatBgFarbe || rahmen) {
      const r = [st.borderTopLeftRadius, st.borderTopRightRadius, st.borderBottomRightRadius, st.borderBottomLeftRadius].join(' ');
      radien.set(r, (radien.get(r) ?? 0) + 1);
      radienGesamt += 1;
    }
  }

  // Emojis im sichtbaren Text (Textknoten, ohne Skripte und ausgeblendete Teile)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const knoten = walker.currentNode;
    const p = knoten.parentElement;
    if (!p || ausschluss.has(p.tagName.toUpperCase())) continue;
    const pst = getComputedStyle(p);
    if (pst.display === 'none' || pst.visibility === 'hidden') continue;
    for (const m of knoten.textContent.matchAll(/\p{Extended_Pictographic}/gu)) {
      if (['©', '®', '™'].includes(m[0])) continue;
      s4.emoji += 1;
      if (s4.emojiBsp.length < 3) s4.emojiBsp.push(m[0]);
    }
  }

  // S5 Radius: häufigster Wert unter Flächen mit Hintergrund, Bild oder Rahmen
  let radiusTop = null;
  for (const [r, n] of radien) if (radiusTop === null || n > radien.get(radiusTop)) radiusTop = r;
  const radiusAnteil = radiusTop !== null && radienGesamt > 0 ? radien.get(radiusTop) / radienGesamt : 0;

  // S5 Hover: Regeln mit :hover und Vergrößerung über transform oder Skalierungsvariablen
  const grosser = (w) => { const n = parseFloat(w); return Number.isFinite(n) && n > 1.001; };
  const hover = (regeln) => {
    for (const regel of regeln) {
      if (regel.cssRules) hover(regel.cssRules);
      if (!regel.selectorText || !/:hover/.test(regel.selectorText) || !regel.style) continue;
      const tf = regel.style.transform || '';
      const tfTreffer = [...tf.matchAll(/scale(?:X|Y|3d)?\(\s*([^,)]+)/g)].some((m) => grosser(m[1]));
      const varTreffer = ['--tw-scale-x', '--tw-scale-y', '--tw-scale'].some((n) => grosser(regel.style.getPropertyValue(n)));
      if (tfTreffer || varTreffer) {
        s5.hover += 1;
        if (s5.hoverBsp.length < 3) s5.hoverBsp.push(regel.selectorText.slice(0, 60));
      }
    }
  };
  for (const blatt of document.styleSheets) {
    try { hover(blatt.cssRules); } catch { /* fremdes Blatt ohne Zugriff */ }
  }

  // S6 Raster: drei oder mehr gleich gebaute Geschwister mit Bild oder SVG, Überschrift und Text
  const s6 = { raster: 0, bsp: [] };
  for (const el of [wurzel, ...wurzel.querySelectorAll('*')]) {
    const kinder = [...el.children].filter((k) => !ausschluss.has(k.tagName.toUpperCase()));
    if (kinder.length < 3) continue;
    const gruppen = new Map();
    for (const k of kinder) {
      const sig = `${k.tagName}:${[...k.querySelectorAll('*')].slice(0, 40).map((x) => x.tagName).join('>')}`;
      if (!gruppen.has(sig)) gruppen.set(sig, []);
      gruppen.get(sig).push(k);
    }
    for (const mit of gruppen.values()) {
      if (mit.length < 3) continue;
      const ok = mit.every((k) => k.querySelector('img, svg, picture')
        && k.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]')
        && (k.querySelector('p') || k.textContent.trim().length > 30));
      if (ok) {
        s6.raster += 1;
        if (s6.bsp.length < 3) s6.bsp.push(`${beispiel(el)} (${mit.length})`);
      }
    }
  }

  // S7 Wellen: SVG über 90 % der Breite, unter 120 px hoch, mit Kurvenbefehlen
  const vw = window.innerWidth;
  const s7 = { wellen: 0, bsp: [] };
  for (const s of document.querySelectorAll('svg')) {
    if (!sichtbar(s, getComputedStyle(s))) continue;
    const r = s.getBoundingClientRect();
    const kurve = [...s.querySelectorAll('path')].some((p) => /[CcSsQqTtAa]/.test(p.getAttribute('d') || ''));
    if (r.width > 0.9 * vw && r.height < 120 && kurve) {
      s7.wellen += 1;
      if (s7.bsp.length < 3) s7.bsp.push(`${Math.round(r.width)} × ${Math.round(r.height)} px`);
    }
  }

  // S8 Einblendung: gleiche Kennung auf mehr als einem Drittel der sections von main
  const abschnitte = [...wurzel.querySelectorAll('section')];
  const einblendung = new Map();
  for (const s of abschnitte) {
    let kennung = null;
    const motion = s.getAttribute('data-motion') ?? (s.querySelector('[data-motion]')?.getAttribute('data-motion') ?? null);
    if (motion !== null) {
      kennung = `data-motion=${motion}`;
    } else {
      const an = getComputedStyle(s).animationName;
      if (an && an !== 'none') kennung = `animation=${an}`;
    }
    if (kennung) einblendung.set(kennung, (einblendung.get(kennung) ?? 0) + 1);
  }
  const s8 = { einblendung: 0, bsp: [], abschnitte: abschnitte.length };
  for (const [k, n] of einblendung) {
    if (abschnitte.length > 0 && n > abschnitte.length / 3) {
      s8.einblendung += 1;
      s8.bsp.push(`${k} auf ${n} von ${abschnitte.length}`);
    }
  }

  // S1 und S2 zusammenstellen
  const schriftBefund = [...schriftenZaehl.entries()].filter(([k]) => liste.has(k)).map(([k, v]) => ({ name: liste.get(k), anzahl: v.anzahl }));
  const TW_RE = /^(?:bg|text|border|from|to|via|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?:\/\d{1,3})?$/;
  const twKlassen = new Set();
  for (const e of document.querySelectorAll('[class]')) {
    for (const t of (e.getAttribute('class') || '').split(/\s+/)) {
      const basis = t.split(':').pop();
      if (TW_RE.test(basis)) twKlassen.add(basis);
    }
  }
  const offen = [...farbeN.entries()]
    .filter(([k, v]) => !tokenFarben.has(k) || violett(v.c))
    .map(([k, v]) => ({ farbe: `rgb(${k})`, bsp: v.bsp, token: tokenFarben.has(k), violett: violett(v.c) }));

  return {
    s1: { befund: schriftBefund, gesamt: [...schriftenZaehl.values()].map((v) => ({ name: v.name, anzahl: v.anzahl })) },
    s2: { tokens: tokenFarben.size, verwendet: farbeN.size, offen, tailwind: [...twKlassen] },
    s3,
    s4,
    s5: { radiusTop, radiusAnteil, radienGesamt, schatten: s5.schatten, schattenBsp: s5.schattenBsp, hover: s5.hover, hoverBsp: s5.hoverBsp },
    s6,
    s7,
    s8,
    textElemente: schriftenZaehl.size,
  };
}

/** Zählt die Befunde je Regel und bildet den Slop-Index. */
function auswerten(seite, geraet, m) {
  const s1 = m.s1.befund.length;
  const s2 = m.s2.offen.length + m.s2.tailwind.length;
  const s3 = m.s3.verlauf + m.s3.verlaufText + m.s3.glas + m.s3.leucht + m.s3.partikel;
  const s4 = m.s4.ikon + m.s4.emoji;
  const s5Radius = m.s5.radiusAnteil > 0.4 ? 1 : 0;
  const s5 = s5Radius + m.s5.schatten + m.s5.hover;
  const s6 = Math.max(0, m.s6.raster - 1);
  const s7 = m.s7.wellen;
  const s8 = m.s8.einblendung;
  const index = s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8;
  const bsp = {
    s1: m.s1.befund.map((b) => `${b.name} ${b.anzahl}x`),
    s2: [...m.s2.offen.map((o) => `${o.farbe}${o.violett ? ' lila' : ''}`), ...m.s2.tailwind],
    s3: [...m.s3.verlaufBsp, ...m.s3.verlaufTextBsp, ...m.s3.glasBsp, ...m.s3.leuchtBsp, ...m.s3.partikelBsp],
    s4: [...m.s4.ikonBsp, ...m.s4.emojiBsp],
    s5: [...(s5Radius ? [`Radius ${m.s5.radiusTop} bei ${Math.round(m.s5.radiusAnteil * 100)} %`] : []), ...m.s5.schattenBsp, ...m.s5.hoverBsp],
    s6: m.s6.bsp,
    s7: m.s7.bsp,
    s8: m.s8.bsp,
  };
  return {
    seite: seite.id, pfad: seite.pfad, geraet: geraet.id,
    s: [s1, s2, s3, s4, s5, s6, s7, s8], index, bsp, roh: m,
  };
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
          await new Promise((res) => setTimeout(res, 400));
          const m = await page.evaluate(messeAnsicht, { schriften: SCHRIFTEN, generisch: GENERISCH });
          zeilen.push(auswerten(r, g, m));
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  const protokoll = jsonSchreiben('slopscan', args, {
    kopf: ['Ansicht', 'Gerät', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'Slop-Index'],
    zeilen: zeilen.map((z) => ({ ansicht: z.seite, pfad: z.pfad, geraet: z.geraet, s: z.s, slopIndex: z.index, beispiele: z.bsp, messung: z.roh })),
  });
  const beispielText = (liste) => (liste.length ? ` (${liste.slice(0, 2).map((x) => String(x).slice(0, 36)).join('; ')})` : '');
  console.log(tabelle(
    ['Ansicht', 'Gerät', 'S1 Schrift', 'S2 Farbe', 'S3 Verlauf/Glas', 'S4 Icon/Emoji', 'S5 Gleichförmigkeit', 'S6 Raster', 'S7 Welle', 'S8 Einblendung', 'Slop-Index'],
    zeilen.map((z) => [
      z.seite, z.geraet,
      `${z.s[0]}${beispielText(z.bsp.s1)}`,
      `${z.s[1]}${beispielText(z.bsp.s2)}`,
      `${z.s[2]}${beispielText(z.bsp.s3)}`,
      `${z.s[3]}${beispielText(z.bsp.s4)}`,
      `${z.s[4]}${beispielText(z.bsp.s5)}`,
      `${z.s[5]}${beispielText(z.bsp.s6)}`,
      `${z.s[6]}${beispielText(z.bsp.s7)}`,
      `${z.s[7]}${beispielText(z.bsp.s8)}`,
      z.index,
    ]),
  ));
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
