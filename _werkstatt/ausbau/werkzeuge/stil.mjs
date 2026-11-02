#!/usr/bin/env node
// stil.mjs – Stilprüfung nach Auftrag 14 (Schreiben ohne KI-Spuren) und Regel S9 aus Auftrag 12.
// Aufruf: node stil.mjs [--routen <pfad,pfad> | --alle] [--quellen] [--json <datei>]
// Standard: die 14 Hauptansichten, Gerät desktop. Geprüft wird der sichtbare Text von main und footer.
// --alle: alle indexierbaren Seiten aus dem jüngsten protokolle/inventar-*.json, sonst Hauptansichten.
// --quellen: zusätzlich content/*.json (oberste Ebene) und Zeichenketten aus src/**/*.tsx (ohne Tests).
//   Die Quelltext-Suche ist eine Heuristik und zählt nur. Technische Zeichenketten fallen heraus.
// Befunde: Gedankenstrich (U+2013, U+2014 und „ - “ zwischen Wörtern), Ausrufezeichen, Emoji,
//   Frage außerhalb von Überschriften (die Hub-Frage ist erlaubt), Floskel aus der Liste in Abschnitt 14,
//   Bindestrich-Kandidat, Platzhalter. Hinweis ohne Zählung in Befunden: Dreierreihe von Adjektiven.
// Ausgabe: Markdown-Tabelle auf stdout, JSON-Protokoll. Exit 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HAUPTANSICHTEN, GERAETE, PROTOKOLLE, REPO, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const DESKTOP = GERAETE.find((g) => g.id === 'desktop');
const HUB_FRAGE = 'Wobei können wir Ihnen helfen?';
const REGELN = ['Gedankenstrich', 'Ausrufezeichen', 'Emoji', 'Frage', 'Floskel', 'Bindestrich', 'Platzhalter'];

/** Floskelliste aus Auftrag 14 (AUFTRAG.md, Abschnitt 14), wörtlich. Der Zusatz in Klammern ist eine Bedingung, kein Teil der Floskel. */
export const FLOSKEL_LISTE = [
  'Willkommen', 'Entdecken Sie', 'Erleben Sie', 'Lassen Sie sich', 'maßgeschneidert', 'ganzheitlich',
  'innovativ', 'nahtlos', 'Mehrwert', 'Herzstück', 'Ihr Partner für', 'Ihr Experte für',
  'Ihr zuverlässiger Schlüsseldienst', 'schnell, sicher und zuverlässig', 'professionell und kompetent',
  'mit Leidenschaft', 'Qualität, die überzeugt', 'auf höchstem Niveau', 'rund um die Uhr (nur, wenn es stimmt)',
  'im Herzen von', 'wo … auf … trifft',
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Muster je Floskel. „…“ steht für eine Lücke von höchstens 80 Zeichen innerhalb eines Satzes. */
function floskelMuster(eintrag) {
  const kern = eintrag.replace(/\s*\(.*\)\s*$/, '').trim();
  if (kern.includes('…')) {
    const teile = kern.split('…').map((t) => t.trim()).filter(Boolean);
    const luecke = '[^.!?;:\\n]{1,80}?';
    return new RegExp(teile.map((t) => `(?<!\\p{L})${escapeRe(t)}(?!\\p{L})`).join(luecke), 'giu');
  }
  const koerper = escapeRe(kern).replace(/\s+/g, '\\s+');
  return new RegExp(`(?<!\\p{L})${koerper}(?!\\p{L})`, 'giu');
}
const FLOSKEL_MUSTER = FLOSKEL_LISTE.map((e) => [e, floskelMuster(e)]);

/** Platzhalter aus Auftrag 12 (S9) und den Gemeinsamen Regeln („usw.“, „analog“, „folgt“). */
const PLATZHALTER = [
  ['TODO oder FIXME', /(?<!\p{L})(?:TODO|FIXME)(?!\p{L})/gu],
  ['Lorem', /\bLorem\b/g],
  ['XXX', /(?<!\p{L})XXX(?!\p{L})/gu],
  ['eckige Klammer mit Wörtern', /\[\s*\p{L}[\p{L}\s]*\]/gu],
  ['folgt', /(?<!\p{L})folgt(?!\p{L})/giu],
  ['usw.', /(?<!\p{L})usw\./giu],
  ['Platzhalter', /(?<!\p{L})Platzhalter(?!\p{L})/giu],
  ['Max Mustermann', /Max Mustermann/g],
  ['example.com', /example\.(?:com|org|net)/gi],
  ['analog', /(?<!\p{L})analog(?!\p{L})/giu],
];

/** Gedankenstriche: Halbgeviertstrich, Geviertstrich und Bindestrich mit Leerzeichen zwischen Wörtern. */
const GEDANKEN = /[–—]/g;
const BINDESTRICH_LEER = /(?<=[\p{L}\p{N}.,;:!?)"»“”])\s+-\s+(?=[\p{L}\p{N}(„"«»])/gu;
/** Emojis: Extended_Pictographic ohne die Textsymbole Copyright, eingetragene Marke und Marke. */
const EMOJI = /\p{Extended_Pictographic}/gu;
const TEXTSYMBOLE = new Set(['©', '®', '™']);
/** Bindestrich-Kandidaten: Wörter mit mindestens einem Bindestrich zwischen Buchstaben oder Ziffern. */
const BINDE = /(?<![\p{L}\p{N}-])\p{L}[\p{L}\p{N}]*(?:-[\p{L}\p{N}]+)+(?![\p{L}\p{N}-])/gu;
/** Eigennamen mit Bindestrich, die zulässig sind. „Coday Web“ hat keinen Bindestrich und kann nie Kandidat sein. */
const EIGENNAMEN = [
  'Burg-Wächter', 'Lahn-Dill-Kreis', 'Marburg-Biedenkopf', 'Baden-Württemberg', 'Nordrhein-Westfalen',
  'Rheinland-Pfalz', 'Sachsen-Anhalt', 'Mecklenburg-Vorpommern', 'Schleswig-Holstein',
];
/** Dreierreihe von Adjektiven, nur als Hinweis. */
const ADJEKTIVENDUNG = '(?:ig|lich|isch|bar|sam|voll|los|ell|iv)';
const DREIERREIHE = new RegExp(
  `(?<!\\p{L})\\p{L}+${ADJEKTIVENDUNG}(?!\\p{L}),\\s+\\p{L}+${ADJEKTIVENDUNG}(?!\\p{L})\\s+und\\s+\\p{L}+${ADJEKTIVENDUNG}(?!\\p{L})`,
  'giu',
);

/** Grund, warum ein Bindestrich-Wort kein Befund ist; sonst null. */
export function bindeAusnahme(wort) {
  if (/\d/.test(wort)) return 'Ziffern';
  const teile = wort.split('-');
  if (teile[0] === teile[0].toUpperCase()) return 'Abkürzung in Großbuchstaben';
  if (EIGENNAMEN.some((n) => n.toLowerCase() === wort.toLowerCase())) return 'Eigenname';
  if (/TODO|FIXME|XXX|Lorem/.test(wort)) return 'Platzhalter, wird unter Platzhalter gemeldet';
  return null;
}

function auszugVon(text, index, laenge) {
  const von = Math.max(0, index - 20);
  const bis = Math.min(text.length, index + laenge + 20);
  return `${von > 0 ? '…' : ''}${text.slice(von, bis).replace(/\s+/g, ' ')}${bis < text.length ? '…' : ''}`;
}

/** Prüft eine Textzeile. Gibt Befunde (typ Befund) und Hinweise (typ Hinweis) zurück. */
export function pruefeZeile(text, { ueberschrift = false } = {}) {
  const funde = [];
  const melde = (regel, typ, index, laenge) => funde.push({ regel, typ, auszug: auszugVon(text, index, laenge) });
  for (const m of text.matchAll(GEDANKEN)) melde('Gedankenstrich', 'Befund', m.index, m[0].length);
  for (const m of text.matchAll(BINDESTRICH_LEER)) melde('Gedankenstrich', 'Befund', m.index, m[0].length);
  for (const m of text.matchAll(/!/g)) melde('Ausrufezeichen', 'Befund', m.index, 1);
  for (const m of text.matchAll(EMOJI)) if (!TEXTSYMBOLE.has(m[0])) melde('Emoji', 'Befund', m.index, m[0].length);
  if (!ueberschrift) {
    for (const m of text.matchAll(/[^.!?\n]*\?/g)) if (m[0].trim() !== HUB_FRAGE) melde('Frage', 'Befund', m.index, m[0].length);
  }
  for (const [, muster] of FLOSKEL_MUSTER) for (const m of text.matchAll(muster)) melde('Floskel', 'Befund', m.index, m[0].length);
  for (const m of text.matchAll(BINDE)) if (!bindeAusnahme(m[0])) melde('Bindestrich', 'Befund', m.index, m[0].length);
  for (const [, muster] of PLATZHALTER) for (const m of text.matchAll(muster)) melde('Platzhalter', 'Befund', m.index, m[0].length);
  for (const m of text.matchAll(DREIERREIHE)) melde('Dreierreihe', 'Hinweis', m.index, m[0].length);
  return funde;
}

function zaehleFunde(funde) {
  const zaehl = Object.fromEntries(REGELN.map((r) => [r, 0]));
  zaehl.Dreierreihe = 0;
  for (const f of funde) zaehl[f.regel] += 1;
  zaehl.befunde = funde.filter((f) => f.typ === 'Befund').length;
  zaehl.hinweise = funde.filter((f) => f.typ === 'Hinweis').length;
  return zaehl;
}

/** Läuft im Browser: sichtbarer Text von main und footer, Zeile je Blockzeile, plus Überschriften. */
function textHolen() {
  const wurzeln = [...document.querySelectorAll('main, footer')]
    .filter((w) => !w.parentElement || !w.parentElement.closest('main, footer'));
  const quellen = wurzeln.length ? wurzeln : [document.body];
  const zeilen = [];
  for (const w of quellen) {
    for (const z of w.innerText.split('\n')) {
      const t = z.trim();
      if (t) zeilen.push(t);
    }
  }
  const ueberschriften = new Set();
  const kopf = 'main h1,main h2,main h3,main h4,main h5,main h6,main [role="heading"],footer h1,footer h2,footer h3,footer h4,footer h5,footer h6,footer [role="heading"]';
  for (const h of document.querySelectorAll(kopf)) {
    for (const z of h.innerText.split('\n')) {
      const t = z.trim();
      if (t) ueberschriften.add(t);
    }
  }
  return { zeilen, ueberschriften: [...ueberschriften] };
}

async function seitenTextHolen(browser, pfad) {
  const context = await kontextFuer(browser, DESKTOP);
  try {
    await attrappenSetzen(context);
    const page = await context.newPage();
    await laden(page, pfad);
    await durchscrollen(page);
    await new Promise((r) => setTimeout(r, 300));
    return await page.evaluate(textHolen);
  } finally {
    await context.close();
  }
}

/** Quellen: content/*.json. Schlüssel mit Technik fallen heraus, Überschriftenschlüssel zählen als Überschrift. */
const TECHNIK_SCHLUESSEL = new Set([
  'id', 'slug', 'href', 'src', 'url', 'route', 'motif', 'ratio', 'updatedAt', 'date', 'from', 'to',
  'pricingGroupId', 'serviceId', 'keyKind', 'mode', 'type', 'kind', 'icon', 'path', 'pfad', 'ctaHref',
  'codePattern', 'codeExample', 'scope', 'shippingClass',
]);
const UEBERSCHRIFT_SCHLUESSEL = /^(title|headline|heading|ueberschrift|überschrift|frage|question|name|label)$/i;

export function jsonZeilen(daten) {
  const zeilen = [];
  const ueberschriften = new Set();
  const gehe = (wert, schluessel) => {
    if (Array.isArray(wert)) {
      for (const w of wert) gehe(w, schluessel);
      return;
    }
    if (wert && typeof wert === 'object') {
      for (const [k, v] of Object.entries(wert)) if (!TECHNIK_SCHLUESSEL.has(k)) gehe(v, k);
      return;
    }
    if (typeof wert === 'string') {
      const t = wert.trim();
      if (!t) return;
      zeilen.push(t);
      if (UEBERSCHRIFT_SCHLUESSEL.test(schluessel)) ueberschriften.add(t);
    }
  };
  gehe(daten, '');
  return { zeilen, ueberschriften: [...ueberschriften] };
}

/** Zeichenketten in TSX: JSX-Text und Zeichenketten mit Leerzeichen. Tailwind-Klassen und Code fallen heraus. */
const TECHNIK_ATTRIBUTE = /\b(className|class|style|d|viewBox|href|src|id|key|type|name|htmlFor|rel|target|fill|stroke|strokeWidth|strokeLinecap|strokeLinejoin|transform|fillRule|clipRule|xmlns|role|tabIndex|autoComplete|inputMode|pattern|method|action|srcSet|sizes|as|dir|lang|testId|data-[a-z-]+)=(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|"[^"]*"|'[^']*')/g;
const klingtNachCode = (s) => s.split(/\s+/).every((w) => /^[a-z0-9:/[\]\-.!_#%(),&=]*$/.test(w));

export function tsxZeilen(quelltext) {
  let t = quelltext
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/^import\s.*$/gm, '')
    .replace(/^export\s.*$/gm, '')
    .replace(TECHNIK_ATTRIBUTE, ' ');
  const ueberschriftBereiche = [];
  const schliessend = [...t.matchAll(/<\/h[1-6]>/g)].map((m) => m.index);
  for (const m of t.matchAll(/<h[1-6]\b[^>]*>/g)) {
    const ende = schliessend.find((i) => i > m.index);
    if (ende !== undefined) ueberschriftBereiche.push([m.index, ende]);
  }
  const imBereich = (i) => ueberschriftBereiche.some(([a, b]) => i >= a && i <= b);
  const zeilen = [];
  const ueberschriften = new Set();
  const nimm = (text, index) => {
    zeilen.push(text);
    if (imBereich(index)) ueberschriften.add(text);
  };
  for (const m of t.matchAll(/>([^<>{}]+)</g)) {
    const roh = m[1].trim();
    if (!roh || !/\p{L}/u.test(roh) || /&&|\|\||[=;'"`]/.test(roh)) continue;
    nimm(roh, m.index);
  }
  for (const m of t.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`([^`\n]*)`/g)) {
    const inhalt = m[1] ?? m[2] ?? m[3] ?? '';
    if (inhalt.includes('${') || !/\s/.test(inhalt) || !/\p{L}{2,}/u.test(inhalt)) continue;
    if (/[={}<>;\\]/.test(inhalt) || klingtNachCode(inhalt)) continue;
    nimm(inhalt, m.index);
  }
  return { zeilen, ueberschriften: [...ueberschriften] };
}

function tsxDateien(verzeichnis, ergebnis = []) {
  for (const e of readdirSync(verzeichnis, { withFileTypes: true })) {
    const p = path.join(verzeichnis, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'test' && e.name !== '__tests__') tsxDateien(p, ergebnis);
    } else if (e.isFile() && e.name.endsWith('.tsx') && !/\.test\.tsx$/.test(e.name)) {
      ergebnis.push(p);
    }
  }
  return ergebnis;
}

function inventarSeiten() {
  const dateien = readdirSync(PROTOKOLLE).filter((f) => /^inventar-.*\.json$/.test(f)).sort();
  if (!dateien.length) {
    return { quelle: 'Hauptansichten (kein Inventar gefunden)', seiten: HAUPTANSICHTEN.map((v) => ({ name: v.id, pfad: v.pfad })) };
  }
  const datei = path.join(PROTOKOLLE, dateien[dateien.length - 1]);
  const daten = JSON.parse(readFileSync(datei, 'utf8'));
  const liste = Array.isArray(daten) ? daten : (daten.seiten ?? daten.adressen ?? daten.eintraege);
  if (!Array.isArray(liste)) {
    return { quelle: `Hauptansichten (Inventar ${dateien[dateien.length - 1]} hat keine erkannte Seitenliste)`, seiten: HAUPTANSICHTEN.map((v) => ({ name: v.id, pfad: v.pfad })) };
  }
  const pfade = new Set();
  for (const e of liste) {
    const indexierbar = e.indexierbar ?? e.indexable;
    const adresse = e.adresse ?? e.url ?? e.pfad ?? e.path;
    if (indexierbar !== true || typeof adresse !== 'string') continue;
    try {
      pfade.add(new URL(adresse, 'http://localhost:3000').pathname);
    } catch {
      // Unlesbare Adresse wird übergangen.
    }
  }
  return {
    quelle: `Inventar ${dateien[dateien.length - 1]}`,
    seiten: [...pfade].sort().map((p) => ({ name: p === '/' ? 'start' : p, pfad: p })),
  };
}

function routenWaehlen(text) {
  if (text === undefined) return HAUPTANSICHTEN.map((v) => ({ name: v.id, pfad: v.pfad }));
  if (text === true) bedienfehler('--routen braucht eine Liste, z. B. --routen /,/autoschluessel');
  return text.split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
    const v = HAUPTANSICHTEN.find((h) => h.id === t || h.pfad === t);
    if (v) return { name: v.id, pfad: v.pfad };
    if (t.startsWith('/')) return { name: t, pfad: t };
    return bedienfehler(`unbekannte Route „${t}“`);
  });
}

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
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

function auswerten(name, zeilen, funde) {
  return { name, zeilen, funde, zaehl: zaehleFunde(funde) };
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  if (args.alle && args.routen !== undefined) bedienfehler('--alle und --routen schließen sich aus');

  let seiten;
  let seitenQuelle;
  if (args.alle) {
    ({ seiten, quelle: seitenQuelle } = inventarSeiten());
  } else {
    seiten = routenWaehlen(args.routen);
    seitenQuelle = args.routen === undefined ? 'Hauptansichten' : '--routen';
  }

  const ergebnisse = [];
  const browser = await browserStarten();
  try {
    for (const s of seiten) {
      const { zeilen, ueberschriften } = await seitenTextHolen(browser, s.pfad);
      const ueber = new Set(ueberschriften);
      const funde = [];
      for (const z of zeilen) {
        for (const f of pruefeZeile(z, { ueberschrift: ueber.has(z) })) funde.push({ ...f, quelle: s.name });
      }
      ergebnisse.push(auswerten(s.name, zeilen.length, funde));
    }
  } finally {
    await browser.close();
  }

  if (args.quellen) {
    const contentDir = path.join(REPO, 'content');
    for (const datei of readdirSync(contentDir).filter((f) => f.endsWith('.json')).sort()) {
      const { zeilen, ueberschriften } = jsonZeilen(JSON.parse(readFileSync(path.join(contentDir, datei), 'utf8')));
      const ueber = new Set(ueberschriften);
      const funde = [];
      for (const z of zeilen) {
        for (const f of pruefeZeile(z, { ueberschrift: ueber.has(z) })) funde.push({ ...f, quelle: `content/${datei}` });
      }
      ergebnisse.push(auswerten(`content/${datei}`, zeilen.length, funde));
    }
    const srcDateien = tsxDateien(path.join(REPO, 'src'));
    const funde = [];
    let zeilenSumme = 0;
    for (const datei of srcDateien) {
      const relativ = path.relative(REPO, datei);
      const { zeilen, ueberschriften } = tsxZeilen(readFileSync(datei, 'utf8'));
      zeilenSumme += zeilen.length;
      const ueber = new Set(ueberschriften);
      for (const z of zeilen) {
        for (const f of pruefeZeile(z, { ueberschrift: ueber.has(z) })) funde.push({ ...f, quelle: relativ });
      }
    }
    ergebnisse.push(auswerten(`src/**/*.tsx (${srcDateien.length} Dateien)`, zeilenSumme, funde));
  }

  const protokoll = jsonSchreiben('stil', args, { seitenQuelle, ansichten: ergebnisse.map((e) => ({ name: e.name, zeilen: e.zeilen, zaehl: e.zaehl, funde: e.funde })) });
  console.log(tabelle(
    ['Seite', 'Zeilen', 'Gedanken', 'Ausrufe', 'Emoji', 'Frage', 'Floskel', 'Bindestrich', 'Platzhalter', 'Befunde', 'Hinweise (Dreierreihe)'],
    ergebnisse.map((e) => [
      e.name, e.zeilen, e.zaehl.Gedankenstrich, e.zaehl.Ausrufezeichen, e.zaehl.Emoji, e.zaehl.Frage,
      e.zaehl.Floskel, e.zaehl.Bindestrich, e.zaehl.Platzhalter, e.zaehl.befunde, e.zaehl.hinweise,
    ]),
  ));
  console.log(`\nSeitenquelle: ${seitenQuelle}`);
  const mitBefund = ergebnisse.filter((e) => e.zaehl.befunde > 0 || e.zaehl.hinweise > 0);
  if (mitBefund.length) {
    console.log('\n### Fundstellen (je Regel bis zu fünf)\n');
    for (const e of mitBefund) {
      for (const regel of [...REGELN, 'Dreierreihe']) {
        const liste = e.funde.filter((f) => f.regel === regel);
        if (!liste.length) continue;
        const typ = regel === 'Dreierreihe' ? 'Hinweis' : 'Befund';
        console.log(`- ${e.name} · ${regel} (${typ}, ${liste.length})`);
        for (const f of liste.slice(0, 5)) console.log(`  - „${f.auszug}“${f.quelle && f.quelle !== e.name ? ` (${f.quelle})` : ''}`);
      }
    }
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

// Nur beim direkten Aufruf laufen; beim Import (Selbstprüfung) bleibt main aus.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`Technischer Fehler: ${e.stack ?? e}`);
    process.exit(1);
  });
}
