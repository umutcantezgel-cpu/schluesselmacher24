#!/usr/bin/env node
// reste.mjs – Prüfwerkzeug „nichts Falsches bleibt übrig“ (FA-QA-03A, Vorgabe des Inhabers Abschnitte 10 und 27).
// Aufruf: node _werkstatt/ausbau/werkzeuge/reste.mjs [--nur demo,platzhalter,alt,kontakt,erreichbarkeit]
//                 [--json <datei>] [--md <datei>] [--ausnahmen <datei>]
// Quellen:
//   ausgeliefert  .next/server/app/**/*.html: sichtbarer Text, Attribute alt/title/aria-label, meta content,
//                 Strukturdaten (application/ld+json). Skripte und Stile zählen nicht.
//   inhalt        content/**/*.json ohne content/startwerte/**
//   code          Zeichenketten in src/lib/data/defaults, src/lib/mail/vorlagen, src/lib/pdf (ohne *.test.*, ohne Kommentare)
// Ohne Browser, ohne Netz, ohne neue Abhängigkeit. Ändert nichts am Produkt.
// Exit: 0 kein Fund · 1 Funde oder veraltete Ausnahmen · 2 Bedienfehler (auch fehlender oder unvollständiger Build;
//       die übrigen Quellen werden dann trotzdem geprüft).
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HIER, '..', '..', '..');
const PROTOKOLLE = path.join(REPO, '_werkstatt', 'ausbau', 'protokolle');
const STANDARD_AUSNAHMEN = path.join(HIER, 'reste-ausnahmen.json');

export const KENNUNGEN = ['demo', 'platzhalter', 'alt', 'kontakt', 'erreichbarkeit'];
export const QUELLEN = ['ausgeliefert', 'inhalt', 'code'];
export const PRUEFUNG_TITEL = {
  demo: 'Demo- und Beispieldaten',
  platzhalter: 'Platzhalter und Entwurfsreste',
  alt: 'Ersetzte Angaben',
  kontakt: 'Kontaktdaten',
  erreichbarkeit: 'Erreichbarkeit',
};
const VORSCHLAG = {
  demo: 'Beispieleintrag aus der Ausgabe nehmen oder die Anzeige abschalten; Herkunft in content prüfen.',
  platzhalter: 'Den Wortlaut des Inhabers einsetzen oder die Stelle streichen; Herkunft im Quelltext suchen.',
  alt: 'Durch den Wortlaut des Inhabers aus content/settings.json ersetzen; Herkunft prüfen.',
  kontakt: 'Mit content/settings.json abgleichen; falsche Angabe korrigieren oder als Ausnahme mit Grund vorschlagen.',
  erreichbarkeit: 'Den Wortlaut des Inhabers verwenden (FA-23, R9).',
};

const CODE_ORDNER = ['src/lib/data/defaults', 'src/lib/mail/vorlagen', 'src/lib/pdf'];
const CODE_ENDUNGEN = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.txt', '.html']);
// Dateiendungen, die nach einem @ stehen und keine Mailadressen sind (z. B. icon@2x.png)
const KEINE_MAIL_ENDUNG = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'ico', 'css', 'js', 'mjs',
  'ts', 'tsx', 'json', 'woff', 'woff2', 'html', 'pdf']);

// ---------------------------------------------------------------------------
// Muster. Jede Gruppe gehört zu genau einer Prüfung.
// ---------------------------------------------------------------------------
// „Demo“ als Wortanfang, aber nicht Demografie, Demokratie, Demonstration, Demontage (Zylinder demontieren);
// „(Beispiel)“ ist die Kennzeichnung der Beispielartikel aus src/lib/data/defaults/standard-articles.ts
const DEMO_WOERTER = /(?<!\p{L})(?:Demo(?!gra|kra|nst|nt)|Testwerk|Musterwerk|Musterbau|Testbau|Testhersteller|\(Beispiel\))/giu;

const PLATZHALTER = [
  // Klammern mit Wörtern, Leerzeichen, Komma, Doppelpunkt, z. B. [Ort], [PLZ], [Name, Ort], [Hersteller eintragen];
  // nicht Muster wie [A-Z], [0-9] oder [a-z], nicht Zugriffe im Code wie ART_LABEL[art] oder zuUns[carrier]
  /(?<![\p{L}\d_$)\]])\[(?![A-Za-z0-9]-[A-Za-z0-9]\])\p{L}[\p{L} ,:.\-]{1,40}\]/gu,
  /(?<!\p{L})(?:TODO|XXX)(?!\p{L})/gu,
  /lorem ipsum/gi,
  /Max Mustermann|Erika Mustermann|Musterstra(?:ß|ss)e|Musterweg/gi,
  /example\.(?:org|com)/gi,
  // Wortform erlaubt: Platzhalter, Platzhaltern, Platzhaltertext
  /(?<!\p{L})Platzhalter\p{L}*/giu,
  /Firmendaten sind noch Platzhalter/gi,
];

const ALT = [
  /Gloelstra(?:ß|ss)e/giu,
  /Langgasse\s+70(?!\d)/giu,
  // Zeiten mit oder ohne Minuten: „09:00 bis 13:00“, „9 bis 13 Uhr“, „Mo–Fr 9–13 Uhr“, „9:00 Uhr – 13:00 Uhr“
  /(?<![\d:.])0?9(?:[:.]00)?\s*(?:Uhr\s*)?(?:bis|[-‐‑‒–—])\s*13(?:[:.]00\s*(?:Uhr)?|\s*Uhr)/giu,
  /(?<![\d:.])14(?:[:.]00)?\s*(?:Uhr\s*)?(?:bis|[-‐‑‒–—])\s*17(?:[:.]00\s*(?:Uhr)?|\s*Uhr)/giu,
  /(?<!\p{L})Öffnungszeiten/giu,
  /(?<!\p{L})nach Foto(?!\p{L})/giu,
];

const ERREICHBARKEIT = [
  /(?<!\d)24\s?(?:Stunden|h)\s+geöffnet/giu,
  /rund\s+um\s+die\s+Uhr\s+geöffnet/giu,
  /durchgehend\s+geöffnet/giu,
];

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,24}/g;
// Telefon: Inland +49 / 0049 / 0, Ausland +43 / 0043 (Vorwahl mit zwei oder drei Ziffern); danach Ziffern mit
// Leerzeichen, Schrägstrich, Bindestrich oder Klammern. Inland: nach der Vorwahl mindestens zwei Ziffern am Stück
// (keine Folgen wie „0 0 1000“ aus Bildmaßen). Die „(0)“ nach +49 gehört zur Vorwahl („+49 (0) 30 1234567“).
const TELEFON = /(?<![\d+\-.\/:,])(?:(?:\+49(?:[ \/\-]*\(0\))?|0049|0)[ \/\-]?\d{2,}|(?:\+\d{2,3}|00\d{2,3})[ \/\-]?\d)[\d \/\-() ]{4,}\d/g;

/**
 * Kürzt einen Telefontreffer auf höchstens 13 Ziffern der Nationalform (führende 0) in ganzen Ziffernbündeln.
 * Ein Präfix +49 oder 0049 (auch mit „(0)“) zählt als eine Ziffer, die 0; die Ländervorwahl zählt nicht mit.
 * „06441 8056279 24“ wird „06441 8056279“; „0049 30 12345678“ bleibt vollständig.
 */
export function telefonKuerzen(s) {
  const kopf = /^(?:\+49(?:[ \/\-]*\(0\))?|0049|\+\d{2,3}|00\d{2,3})/.exec(s);
  // Inland: +49 oder 0049 zählt als die 0 der Nationalnummer; Ausland: die Ländervorwahl zählt nicht mit
  const inland = kopf !== null && /^(?:\+49|0049)/.test(kopf[0]);
  let out = kopf ? kopf[0] : '';
  let ziffern = inland ? 1 : 0;
  for (const teil of s.slice(out.length).match(/\d+|\D+/g) ?? []) {
    if (/^\d/.test(teil)) {
      if (ziffern + teil.length > 13) break;
      ziffern += teil.length;
    }
    out += teil;
  }
  return out.trimEnd();
}
const STRASSE = '[\\p{L}\\-]*(?:straße|strasse|str\\.|weg|gasse|platz|allee|ring|damm|ufer|hof|chaussee)';
// Anschrift: Straße mit Hausnummer und fünfstellige Postleitzahl; zwischen Nummer und Postleitzahl Komma, „in“ oder nichts
const ANSCHRIFT = new RegExp(`(?<![\\p{L}\\-])(${STRASSE})\\s+(\\d+[a-zA-Z]?)\\s*(?:,|\\bin\\b)?\\s*(\\d{5})\\s+\\p{L}[\\p{L}\\-]+`, 'giu');

const NAMEN = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', auml: 'ä', ouml: 'ö', uuml: 'ü',
  Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', ndash: '–', mdash: '—', bdquo: '„', ldquo: '“',
  rdquo: '”', lsquo: '‘', rsquo: '’', euro: '€', hellip: '…', shy: '',
};

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------
export function entities(s) {
  return s.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[A-Za-z]+);/g, (m, k) => {
    if (k[0] === '#') {
      const cp = k[1] === 'x' || k[1] === 'X' ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
      try { return String.fromCodePoint(cp); } catch { return m; }
    }
    return NAMEN[k] ?? m;
  });
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Ziffern einer Telefonangabe; +49 und 0049 werden zur 0 der Nationalnummer, „(0)“ nach +49 entfällt. */
export function telefonZiffern(s) {
  const ohneZusatz = s.replace(/^(\+49|0049)[ \/\-]*\(0\)/, '$1');
  const kompakt = ohneZusatz.replace(/[\s/\-()]/g, '');
  if (kompakt.startsWith('+49')) return '0' + kompakt.slice(3).replace(/\D/g, '');
  if (kompakt.startsWith('0049')) return '0' + kompakt.slice(4).replace(/\D/g, '');
  return kompakt.replace(/\D/g, '');
}

/** Straße und Hausnummer als Vergleichsschlüssel. */
function kern(strasse, nummer) {
  return (strasse + nummer).toLowerCase().replace(/ß/g, 'ss').replace(/[^\p{L}\d]/gu, '');
}

function emailFremd(adresse) {
  const domain = adresse.split('@')[1].toLowerCase();
  const endung = domain.split('.').pop();
  if (KEINE_MAIL_ENDUNG.has(endung)) return false;
  return !(domain === 'schluesselmacher24.de' || domain.endsWith('.schluesselmacher24.de'));
}

/** Fundstück mit 30 Zeichen Umgebung links und rechts (Paket FA-QA-03A, Punkt 4: 60 Zeichen Umgebung je Fund). */
function umgebung(text, index, laenge) {
  const a = Math.max(0, index - 30);
  const b = Math.min(text.length, index + laenge + 30);
  return text.slice(a, b).replace(/\s+/g, ' ').trim();
}

/** Entschlüsselt die gängigen Escapes einer Zeichenkette aus Quelltext. */
function entschluesseln(roh) {
  return roh.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (m, k) => {
    if (k.startsWith('u{')) return String.fromCodePoint(parseInt(k.slice(2, -1), 16));
    if (k[0] === 'u' && k.length === 5) return String.fromCharCode(parseInt(k.slice(1), 16));
    if (k[0] === 'x' && k.length === 3) return String.fromCharCode(parseInt(k.slice(1), 16));
    return ({ n: '\n', t: '\t', r: '\r' })[k] ?? k;
  });
}

/**
 * Zeichenketten aus JavaScript, TypeScript oder JSON-Quelltext mit Zeilennummer.
 * Kommentare werden übergangen; einfache und doppelte Anführungszeichen enden am Zeilenende.
 */
export function zeichenketten(quelle) {
  const out = [];
  const n = quelle.length;
  let i = 0;
  let zeile = 1;
  while (i < n) {
    const c = quelle[i];
    if (c === '\n') { zeile += 1; i += 1; continue; }
    if (c === '/' && quelle[i + 1] === '/') {
      while (i < n && quelle[i] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && quelle[i + 1] === '*') {
      const e = quelle.indexOf('*/', i + 2);
      const ende = e < 0 ? n : e + 2;
      zeile += (quelle.slice(i, ende).match(/\n/g) ?? []).length;
      i = ende;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const startZeile = zeile;
      let j = i + 1;
      let roh = '';
      while (j < n) {
        const d = quelle[j];
        if (d === '\\') { roh += quelle.slice(j, j + 2); j += 2; continue; }
        if (d === c) break;
        if (d === '\n') {
          if (c !== '`') break;
          zeile += 1;
        }
        roh += d;
        j += 1;
      }
      const geschlossen = j < n && quelle[j] === c;
      out.push({ wert: entschluesseln(roh), zeile: startZeile });
      i = geschlossen ? j + 1 : j;
      continue;
    }
    i += 1;
  }
  return out;
}

/** Sichtbare Texte und Attribute einer ausgelieferten Seite, jeweils mit Art. */
export function seitenSegmente(html) {
  const segmente = [];
  const TAG = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>=`]+))?)*)\s*\/?>/g;
  const ATTR = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>=`]+)))?/g;
  let s = html.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi, (_, attrs, inhalt) => {
    if (/type\s*=\s*["']?application\/ld\+json/i.test(attrs)) segmente.push({ art: 'Strukturdaten', wert: inhalt });
    return ' ';
  });
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ');
  for (const m of s.matchAll(TAG)) {
    if (m[0].startsWith('</')) continue;
    const tag = m[1].toLowerCase();
    for (const a of (m[2] ?? '').matchAll(ATTR)) {
      const name = a[1].toLowerCase();
      const wert = a[2] ?? a[3] ?? a[4];
      if (wert === undefined) continue;
      if (['alt', 'title', 'aria-label'].includes(name) || (tag === 'meta' && name === 'content')) {
        segmente.push({ art: `Attribut ${name}`, wert: entities(wert) });
      }
    }
  }
  segmente.push({ art: 'sichtbarer Text', wert: entities(s.replace(TAG, ' ')).replace(/\s+/g, ' ') });
  return segmente;
}

/** Besucht alle Zeichenketten und alle Objekte mit example: true einer JSON-Struktur. */
function besuche(obj, pfad, { zeichenkette, objekt }) {
  if (typeof obj === 'string') { zeichenkette?.({ pfad, wert: obj }); return; }
  if (Array.isArray(obj)) { obj.forEach((v, i) => besuche(v, `${pfad}[${i}]`, { zeichenkette, objekt })); return; }
  if (obj && typeof obj === 'object') {
    if (obj.example === true) objekt?.({ pfad, obj });
    for (const [k, v] of Object.entries(obj)) besuche(v, `${pfad}.${k}`, { zeichenkette, objekt });
  }
}

function dateienRekursiv(ordner, filter) {
  if (!existsSync(ordner)) return [];
  const out = [];
  for (const e of readdirSync(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) out.push(...dateienRekursiv(p, filter));
    else if (e.isFile() && filter(p)) out.push(p);
  }
  return out.sort();
}

const posix = (p) => p.split(path.sep).join('/');

// ---------------------------------------------------------------------------
// Prüfung eines Textes
// ---------------------------------------------------------------------------
/**
 * Sucht in einem Text alle Fundstellen der gewählten Prüfungen.
 * k: { nur:Set, telefon:Set, kerne:Set, beispiele:RegExp[], demo:boolean, kontakt:boolean }
 */
export function pruefeText(text, k) {
  const funde = [];
  const suchen = (re, pruefung, passt = () => true) => {
    for (const m of text.matchAll(re)) {
      if (passt(m)) funde.push({ pruefung, fundstueck: m[0], index: m.index });
    }
  };
  if (k.nur.has('platzhalter')) for (const re of PLATZHALTER) suchen(re, 'platzhalter');
  if (k.nur.has('alt')) for (const re of ALT) suchen(re, 'alt');
  if (k.nur.has('erreichbarkeit')) for (const re of ERREICHBARKEIT) suchen(re, 'erreichbarkeit');
  if (k.nur.has('kontakt') && k.kontakt) {
    suchen(EMAIL, 'kontakt', (m) => emailFremd(m[0]));
    for (const m of text.matchAll(TELEFON)) {
      const fund = telefonKuerzen(m[0]);
      const z = telefonZiffern(fund);
      // Ausland (+43, 0043 …) ab acht Ziffern. Inland mindestens zehn Ziffern: kürzere Folgen mit 0 sind
      // Gemeindeschlüssel (AGS) oder Fahrzeugcodes, keine Rufnummern
      const ausland = /^(?:\+|00)(?!49)/.test(fund);
      if (z.length >= (ausland ? 8 : 10) && !k.telefon.has(z)) funde.push({ pruefung: 'kontakt', fundstueck: fund, index: m.index });
    }
    // Anschrift stimmt nur, wenn Straße, Hausnummer und Postleitzahl zu einer Anschrift aus den Einstellungen passen
    suchen(ANSCHRIFT, 'kontakt', (m) => !k.kerne.has(kern(m[1], m[2]) + m[3]));
  }
  if (k.nur.has('demo') && k.demo) {
    suchen(DEMO_WOERTER, 'demo');
    for (const re of k.beispiele) suchen(re, 'demo');
  }
  return funde;
}

// ---------------------------------------------------------------------------
// Lauf über alle Quellen
// ---------------------------------------------------------------------------
/** Prüft, ob der Build vollständig ist. Gibt einen Grund zurück oder null. */
export function buildFehler(wurzel) {
  const id = path.join(wurzel, '.next', 'BUILD_ID');
  if (!existsSync(id)) return 'BUILD_ID fehlt (kein Build)';
  if (readFileSync(id, 'utf8').trim() === '') return 'BUILD_ID ist leer';
  const seiten = dateienRekursiv(path.join(wurzel, '.next', 'server', 'app'), (p) => p.endsWith('.html'));
  if (seiten.length === 0) return 'keine ausgelieferten HTML-Seiten unter .next/server/app';
  return null;
}

/**
 * Führt alle Prüfungen aus.
 * Rückgabe: { quellen, funde, ausgenommen, veraltet, bedienfehler, nur }.
 */
export function pruefeAlles({ wurzel = REPO, nur = KENNUNGEN, ausnahmen = [] } = {}) {
  const bedienfehler = [];
  const quellen = Object.fromEntries(QUELLEN.map((q) => [q, { status: 'fehlt', dateien: 0, texte: 0 }]));
  const funde = [];
  const nurSet = new Set(nur);
  const inhaltOrdner = path.join(wurzel, 'content');

  // 1. Vergleichsgrundlage aus content/settings.json (Telefon, Anschrift)
  const einstDatei = path.join(inhaltOrdner, 'settings.json');
  const telefon = new Set();
  const kerne = new Set();
  let kontaktMoeglich = false;
  try {
    const einst = JSON.parse(readFileSync(einstDatei, 'utf8'));
    const texte = [];
    besuche(einst, '', { zeichenkette: (z) => texte.push(z.wert) });
    // Firmenanschrift als Ganzes (Straße, Hausnummer, Postleitzahl, Ort), damit die Postleitzahl mitverglichen wird
    const firma = einst.company ?? {};
    if (firma.street && firma.postalCode && firma.city) texte.push(`${firma.street}, ${firma.postalCode} ${firma.city}`);
    for (const t of texte) for (const m of t.matchAll(TELEFON)) telefon.add(telefonZiffern(m[0]));
    // Vergleichsschlüssel je Anschrift: Straße + Hausnummer + Postleitzahl
    for (const m of texte.join('\n').matchAll(ANSCHRIFT)) kerne.add(kern(m[1], m[2]) + m[3]);
    kontaktMoeglich = true;
  } catch (e) {
    bedienfehler.push(`content/settings.json nicht lesbar (${e.code ?? e.message}): Kontaktabgleich ausgesetzt`);
  }

  // 2. Inhalte: content/**/*.json ohne startwerte; dabei die Beispieleinträge sammeln
  const beispielMuster = new Set();
  const inhaltDateien = dateienRekursiv(inhaltOrdner, (p) => p.endsWith('.json'))
    .filter((p) => !posix(path.relative(inhaltOrdner, p)).startsWith('startwerte/'));
  const kontext = (demo) => ({ nur: nurSet, telefon, kerne, beispiele: [], demo, kontakt: kontaktMoeglich });
  const beispielStrings = [];
  quellen.inhalt.status = 'ok';
  for (const datei of inhaltDateien) {
    const rel = posix(path.relative(wurzel, datei));
    let obj;
    try { obj = JSON.parse(readFileSync(datei, 'utf8')); } catch (e) {
      bedienfehler.push(`${rel} ist kein gültiges JSON (${e.message})`);
      continue;
    }
    quellen.inhalt.dateien += 1;
    besuche(obj, '', {
      zeichenkette: ({ pfad, wert }) => {
        quellen.inhalt.texte += 1;
        for (const f of pruefeText(wert, kontext(false))) {
          funde.push({ pruefung: f.pruefung, quelle: 'inhalt', datei: rel, seite: null, ort: pfad,
            fundstueck: f.fundstueck, umgebung: umgebung(wert, f.index, f.fundstueck.length) });
        }
      },
      objekt: ({ obj: eintrag }) => {
        for (const feld of ['name', 'id', 'slug', 'titel', 'title']) {
          const w = eintrag[feld];
          if (typeof w === 'string' && w.trim().length >= 3) beispielStrings.push(w.trim());
        }
      },
    });
  }
  for (const w of new Set(beispielStrings)) {
    beispielMuster.add(new RegExp(`(?<![\\p{L}\\d])${escapeRe(w)}(?![\\p{L}\\d])`, 'giu'));
  }
  const beispielAnzahl = beispielStrings.length;

  // 3. Code: Zeichenketten in den Kundenpfaden
  quellen.code.status = 'ok';
  const codeDateien = CODE_ORDNER.flatMap((o) => dateienRekursiv(path.join(wurzel, o), (p) => {
    const endung = path.extname(p);
    if (!CODE_ENDUNGEN.has(endung)) return false;
    if (/\.(test|spec)\.[^/]+$/.test(p) || /\.d\.ts$/.test(p)) return false;
    return true;
  }));
  for (const datei of codeDateien) {
    const rel = posix(path.relative(wurzel, datei));
    quellen.code.dateien += 1;
    for (const { wert, zeile } of zeichenketten(readFileSync(datei, 'utf8'))) {
      quellen.code.texte += 1;
      for (const f of pruefeText(wert, kontext(false))) {
        funde.push({ pruefung: f.pruefung, quelle: 'code', datei: rel, seite: null, ort: `Zeile ${zeile}`,
          fundstueck: f.fundstueck, umgebung: umgebung(wert, f.index, f.fundstueck.length) });
      }
    }
  }

  // 4. Ausgeliefert: .next/server/app/**/*.html
  const fehler = buildFehler(wurzel);
  if (fehler) {
    bedienfehler.push(`Build unvollständig (${fehler}): Quelle ausgeliefert nicht geprüft`);
    quellen.ausgeliefert.status = 'fehlt';
    quellen.ausgeliefert.grund = fehler;
  } else {
    quellen.ausgeliefert.status = 'ok';
    const appOrdner = path.join(wurzel, '.next', 'server', 'app');
    const seiten = dateienRekursiv(appOrdner, (p) => p.endsWith('.html'));
    const demoKontext = { ...kontext(true), beispiele: [...beispielMuster] };
    for (const datei of seiten) {
      const rel = posix(path.relative(wurzel, datei));
      const route = '/' + posix(path.relative(appOrdner, datei)).replace(/\.html$/, '').replace(/(^|\/)index$/, '').replace(/^\/+/, '');
      quellen.ausgeliefert.dateien += 1;
      for (const seg of seitenSegmente(readFileSync(datei, 'utf8'))) {
        quellen.ausgeliefert.texte += 1;
        for (const f of pruefeText(seg.wert, demoKontext)) {
          funde.push({ pruefung: f.pruefung, quelle: 'ausgeliefert', datei: rel, seite: route, ort: seg.art,
            fundstueck: f.fundstueck, umgebung: umgebung(seg.wert, f.index, f.fundstueck.length) });
        }
      }
    }
  }
  quellen.inhalt.beispiele = beispielAnzahl;

  // 5. Ausnahmen: nur genau passende Fundstücke; veraltete Ausnahmen melden
  const angewandt = [];
  const verwendet = new Set();
  const trefferJe = new Map();
  const bleiben = [];
  for (const f of funde) {
    const idx = ausnahmen.findIndex((a) => a.pruefung === f.pruefung && a.quelle === f.quelle
      && a.datei === f.datei && a.fundstueck === f.fundstueck && (a.ort === undefined || a.ort === f.ort));
    if (idx >= 0) {
      verwendet.add(idx);
      trefferJe.set(idx, (trefferJe.get(idx) ?? 0) + 1);
      angewandt.push({ ...f, grund: ausnahmen[idx].grund });
    } else bleiben.push(f);
  }
  // Eine Ausnahme ohne Feld ort gilt für jede gleiche Stelle derselben Datei: mehrere Treffer werden gemeldet
  const warnungen = [...trefferJe]
    .filter(([idx, n]) => n > 1 && ausnahmen[idx].ort === undefined)
    .map(([idx, n]) => `Ausnahme ${idx + 1} (${ausnahmen[idx].pruefung}, ${ausnahmen[idx].datei}, „${ausnahmen[idx].fundstueck}“) traf ${n} Stellen; ein Feld ort begrenzt sie auf eine Stelle`);
  const veraltet = ausnahmen
    .map((a, idx) => ({ a, idx }))
    .filter(({ a, idx }) => !verwendet.has(idx) && nurSet.has(a.pruefung) && quellen[a.quelle]?.status === 'ok')
    .map(({ a }) => a);

  // Vorschlag je Fund
  for (const f of bleiben) f.vorschlag = VORSCHLAG[f.pruefung];
  return { quellen, funde: bleiben, ausgenommen: angewandt, veraltet, bedienfehler, warnungen, nur: [...nurSet] };
}

export function exitCodeFuer(e) {
  if (e.bedienfehler.length) return 2;
  if (e.funde.length || e.veraltet.length) return 1;
  return 0;
}

/** Lädt die Ausnahmendatei. Jede Ausnahme braucht Prüfung, Quelle, Datei, genaues Fundstück, Grund und Datum. */
export function ladeAusnahmen(datei) {
  const liste = JSON.parse(readFileSync(datei, 'utf8'));
  if (!Array.isArray(liste)) throw new Error(`${datei}: erwartet eine Liste`);
  liste.forEach((a, i) => {
    const wo = `${datei} Eintrag ${i + 1}`;
    if (!KENNUNGEN.includes(a.pruefung)) throw new Error(`${wo}: unbekannte Prüfung „${a.pruefung}“`);
    if (!QUELLEN.includes(a.quelle)) throw new Error(`${wo}: unbekannte Quelle „${a.quelle}“`);
    for (const feld of ['datei', 'fundstueck', 'grund', 'datum']) {
      if (typeof a[feld] !== 'string' || a[feld].trim() === '') throw new Error(`${wo}: Feld „${feld}“ fehlt`);
    }
    if (a.ort !== undefined && (typeof a.ort !== 'string' || a.ort.trim() === '')) {
      throw new Error(`${wo}: Feld „ort“ ist leer oder kein Text (Zeigerpfad, Zeile oder Segmentart)`);
    }
  });
  return liste;
}

// ---------------------------------------------------------------------------
// Ausgabe
// ---------------------------------------------------------------------------
const zelle = (t) => String(t ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

export function berichtMarkdown(e, { zeitpunkt, exit }) {
  const zeilen = [];
  zeilen.push('# Prüfung „nichts Falsches bleibt übrig“ (reste.mjs)', '');
  zeilen.push(`Stand: ${zeitpunkt} · Prüfungen: ${e.nur.join(', ')} · Exit ${exit}`, '');
  zeilen.push('## Quellen', '', '| Quelle | Status | Dateien | Textstellen |', '|---|---|---|---|');
  for (const q of QUELLEN) {
    const s = e.quellen[q];
    const status = s.status === 'ok' ? 'ok' : `fehlt${s.grund ? ` (${s.grund})` : ''}`;
    zeilen.push(`| ${q} | ${zelle(status)} | ${s.dateien} | ${s.texte} |`);
  }
  zeilen.push('');
  zeilen.push(`Beispieleinträge mit example: true (Namen, Kennungen, Slugs): ${e.quellen.inhalt.beispiele ?? 0}`, '');

  zeilen.push('## Funde', '');
  if (e.funde.length === 0) zeilen.push('Keine Funde.', '');
  else {
    zeilen.push('| Prüfung | Quelle | Datei oder Seite | Ort | Fundstück | Umgebung | Vorschlag |', '|---|---|---|---|---|---|---|');
    for (const f of e.funde) {
      const ziel = f.seite ? `${f.seite} (${f.datei})` : f.datei;
      zeilen.push(`| ${f.pruefung} | ${f.quelle} | ${zelle(ziel)} | ${zelle(f.ort)} | ${zelle(f.fundstueck)} | ${zelle(f.umgebung)} | ${zelle(f.vorschlag)} |`);
    }
    zeilen.push('');
  }

  zeilen.push('## Zahl je Prüfung und Quelle', '', '| Prüfung | ausgeliefert | inhalt | code | Summe |', '|---|---|---|---|---|');
  for (const p of e.nur) {
    const zahl = (q) => e.funde.filter((f) => f.pruefung === p && f.quelle === q).length;
    const summe = QUELLEN.reduce((a, q) => a + zahl(q), 0);
    zeilen.push(`| ${PRUEFUNG_TITEL[p]} (${p}) | ${zahl('ausgeliefert')} | ${zahl('inhalt')} | ${zahl('code')} | ${summe} |`);
  }
  zeilen.push('');

  zeilen.push('## Ausgenommen (Ausnahmen mit Grund)', '');
  if (e.ausgenommen.length === 0) zeilen.push('Keine.', '');
  else {
    zeilen.push('| Prüfung | Datei | Fundstück | Grund |', '|---|---|---|---|');
    for (const f of e.ausgenommen) zeilen.push(`| ${f.pruefung} | ${zelle(f.datei)} | ${zelle(f.fundstueck)} | ${zelle(f.grund)} |`);
    zeilen.push('');
  }

  if (e.warnungen?.length) {
    zeilen.push('## Warnungen zu Ausnahmen', '');
    for (const w of e.warnungen) zeilen.push(`- ${w}`);
    zeilen.push('');
  }

  zeilen.push('## Veraltete Ausnahmen', '');
  if (e.veraltet.length === 0) zeilen.push('Keine.', '');
  else {
    zeilen.push('| Prüfung | Quelle | Datei | Fundstück |', '|---|---|---|---|');
    for (const a of e.veraltet) zeilen.push(`| ${a.pruefung} | ${a.quelle} | ${zelle(a.datei)} | ${zelle(a.fundstueck)} |`);
    zeilen.push('');
  }

  zeilen.push('## Bedienfehler', '');
  if (e.bedienfehler.length === 0) zeilen.push('Keine.', '');
  else for (const b of e.bedienfehler) zeilen.push(`- ${b}`);
  zeilen.push('');
  return zeilen.join('\n');
}

export function protokollObjekt(e, { zeitpunkt, exit }) {
  return {
    werkzeug: 'reste.mjs',
    fassung: 1,
    zeitpunkt,
    exit,
    pruefungen: e.nur,
    quellen: e.quellen,
    bedienfehler: e.bedienfehler,
    funde: e.funde,
    ausgenommen: e.ausgenommen,
    veraltet: e.veraltet,
    warnungen: e.warnungen ?? [],
  };
}

// ---------------------------------------------------------------------------
// Kommandozeile
// ---------------------------------------------------------------------------
const HILFE = `Aufruf: node reste.mjs [--nur demo,platzhalter,alt,kontakt,erreichbarkeit]
                 [--json <datei>] [--md <datei>] [--ausnahmen <datei>]
Exit: 0 kein Fund · 1 Funde oder veraltete Ausnahmen · 2 Bedienfehler`;

function bedienfehlerMeldung(text) {
  console.error(`Bedienfehler: ${text}`);
  return 2;
}

function argumenteLesen(argv) {
  const a = { nur: null, json: null, md: null, ausnahmen: null, hilfe: false };
  for (let i = 0; i < argv.length; i += 1) {
    const t = argv[i];
    const wert = () => {
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--')) throw new Error(`${t} braucht einen Wert`);
      i += 1;
      return v;
    };
    switch (t) {
      case '--nur': a.nur = wert().split(',').map((s) => s.trim()).filter(Boolean); break;
      case '--json': a.json = wert(); break;
      case '--md': a.md = wert(); break;
      case '--ausnahmen': a.ausnahmen = wert(); break;
      case '-h': case '--help': a.hilfe = true; break;
      default: throw new Error(`unbekannte Option „${t}“`);
    }
  }
  return a;
}

export function hauptlauf(argv) {
  let a;
  try { a = argumenteLesen(argv); } catch (e) { return bedienfehlerMeldung(e.message); }
  if (a.hilfe) { console.log(HILFE); return 0; }
  const nur = a.nur ?? KENNUNGEN;
  for (const n of nur) if (!KENNUNGEN.includes(n)) return bedienfehlerMeldung(`unbekannte Kennung „${n}“`);

  const ausDatei = a.ausnahmen ? path.resolve(a.ausnahmen) : STANDARD_AUSNAHMEN;
  let ausnahmen = [];
  if (existsSync(ausDatei)) {
    try { ausnahmen = ladeAusnahmen(ausDatei); } catch (e) { return bedienfehlerMeldung(e.message); }
  } else if (a.ausnahmen) return bedienfehlerMeldung(`Ausnahmendatei fehlt: ${ausDatei}`);

  const e = pruefeAlles({ wurzel: REPO, nur, ausnahmen });
  const exit = exitCodeFuer(e);
  const zeitpunkt = new Date().toISOString();
  const stamp = zeitpunkt.replace(/[:.]/g, '-');
  const md = berichtMarkdown(e, { zeitpunkt, exit });
  process.stdout.write(md);

  const protoDatei = a.json ? path.resolve(a.json) : path.join(PROTOKOLLE, `reste-${stamp}.json`);
  mkdirSync(path.dirname(protoDatei), { recursive: true });
  writeFileSync(protoDatei, JSON.stringify(protokollObjekt(e, { zeitpunkt, exit }), null, 2) + '\n');
  if (a.md) {
    const mdDatei = path.resolve(a.md);
    mkdirSync(path.dirname(mdDatei), { recursive: true });
    writeFileSync(mdDatei, md);
  }
  process.stderr.write(`Protokoll: ${protoDatei}\n`);
  return exit;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = hauptlauf(process.argv.slice(2));
}
