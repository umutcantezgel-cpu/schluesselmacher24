#!/usr/bin/env node
// Echte Angebote „Schlüssel nach Code“ aus einer Tabelle übernehmen (FA-SHOP-01B, FA-11-01 bis FA-11-19).
//
//   node scripts/sortiment-import.mjs [pfad-zur-csv] [--trocken] [--ziel=content/code-lines.json]
//
// Liest eine CSV (UTF-8, Trennzeichen Semikolon oder Komma) mit den Spalten
//   hersteller, system, codebereich, beispielcode, codeformat, preis, staffel, max_stueck, hinweise,
//   bild_datei, kategorie, quelle
// Ohne Pfad sucht das Skript _werkstatt/ausbau/eingang/sortiment.csv. Vorlage mit zwei als Beispiel
// gekennzeichneten Zeilen: _werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv.
//
// Jede Zeile wird geprüft: Pflichtfelder, Preisformat, Staffel, Höchstmenge, Prüfmuster (dieselben Regeln
// wie im Backend) und ob der Beispielcode zum Prüfmuster passt, Hersteller in der Stammliste
// (content/hersteller.json), Kategorie unter „Schlüssel nach Code“ (content/kategorien.json). Bei der
// kleinsten Unklarheit bricht das Skript mit einer Liste ab und schreibt nichts; es rät nichts (R4).
// Ein Hersteller, der nicht in der Stammliste steht, wird als neuer Stammeintrag vorgeschlagen; anlegen
// muss ihn ein Mensch (Admin, Shop › Hersteller, oder content/hersteller.json), danach erneut importieren.
//
// Wirkung: Das Skript schreibt nur content/code-lines.json (ohne `example`), also den Stand ohne Datenbank
// und den Startwert des Seeds. Vorhandene Einträge bleiben; ein Eintrag mit derselben Kennung wird ersetzt.
// Jede übernommene Linie steht auf `active: false`: Sie ist noch nicht öffentlich. In die Datenbank kommen
// die Linien mit dem Seed (`npm run seed`, Payload Local API): Er legt jede echte Linie, die dort noch
// fehlt, als Entwurf an und lässt vorhandene unberührt. Veröffentlicht wird erst nach der Prüfung im Backend. Bilder (Spalte bild_datei) werden im
// Backend hochgeladen; das Skript vermerkt den Dateinamen nur am Produktbild.

import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const STANDARD_ORT = path.join(WURZEL, '_werkstatt/ausbau/eingang/sortiment.csv');
const ZIEL_DATEI = path.join(WURZEL, 'content/code-lines.json');
const HERSTELLER_DATEI = path.join(WURZEL, 'content/hersteller.json');
const KATEGORIEN_DATEI = path.join(WURZEL, 'content/kategorien.json');

export const SPALTEN = [
  'hersteller',
  'system',
  'codebereich',
  'beispielcode',
  'codeformat',
  'preis',
  'staffel',
  'max_stueck',
  'hinweise',
  'bild_datei',
  'kategorie',
  'quelle',
];
export const PFLICHT = ['hersteller', 'system', 'codebereich', 'beispielcode', 'codeformat', 'preis', 'max_stueck', 'quelle'];
/** Höchstmenge je Bestellung, wie im Backend. */
export const HOECHSTMENGE = 99;
/** Startkategorie, wenn die Spalte leer ist. */
export const STANDARD_KATEGORIE = 'schluessel-nach-code';

/* ---------- Hilfen ---------------------------------------------------------------------------- */

/** Vergleichswert ohne Groß- und Kleinschreibung, Akzente und Zeichen. */
export function schluessel(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

/** Adresse aus einem Namen, wie `src/lib/slug.ts`. */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** CSV mit Anführungszeichen; Trennzeichen aus der Kopfzeile (Semikolon, sonst Komma). */
export function parseCsv(text) {
  const ohneBom = text.replace(/^﻿/, '');
  const ersteZeile = ohneBom.split(/\r?\n/, 1)[0] ?? '';
  const trenner = ersteZeile.includes(';') ? ';' : ',';
  const zeilen = [];
  let zeile = [];
  let feld = '';
  let inAnfuehrung = false;
  for (let i = 0; i < ohneBom.length; i += 1) {
    const c = ohneBom[i];
    if (inAnfuehrung) {
      if (c !== '"') feld += c;
      else if (ohneBom[i + 1] === '"') {
        feld += '"';
        i += 1;
      } else inAnfuehrung = false;
    } else if (c === '"') inAnfuehrung = true;
    else if (c === trenner) {
      zeile.push(feld);
      feld = '';
    } else if (c === '\n') {
      zeile.push(feld);
      zeilen.push(zeile);
      zeile = [];
      feld = '';
    } else if (c !== '\r') feld += c;
  }
  if (feld !== '' || zeile.length > 0) {
    zeile.push(feld);
    zeilen.push(zeile);
  }
  return zeilen.filter((werte) => !(werte.length === 1 && werte[0].trim() === ''));
}

/* ---------- Prüfmuster (dieselben Regeln wie src/lib/code-pattern.ts) ------------------------- */

export const MAX_MUSTER_LAENGE = 120;
const VERSCHACHTELTE_WIEDERHOLUNG = /\((?:[^()\\]|\\.)*(?:[+*]|\{\d+,\d*\})(?:[^()\\]|\\.)*\)(?:[+*]|\{\d+,\d*\})/;
const RUECKVERWEIS = /\\(?:[1-9]|k<)/;

/** `true` oder eine Meldung in Klartext. */
export function pruefeCodeMuster(muster) {
  if (typeof muster !== 'string' || !muster.trim()) return 'Bitte ein Prüfmuster eintragen.';
  if (muster.length > MAX_MUSTER_LAENGE) return `Das Prüfmuster ist zu lang (höchstens ${MAX_MUSTER_LAENGE} Zeichen).`;
  if (!muster.startsWith('^') || !muster.endsWith('$')) {
    return 'Das Prüfmuster muss mit ^ beginnen und mit $ enden, damit der ganze Code geprüft wird.';
  }
  if (VERSCHACHTELTE_WIEDERHOLUNG.test(muster)) {
    return 'Verschachtelte Wiederholungen wie (a+)+ sind nicht erlaubt.';
  }
  if (RUECKVERWEIS.test(muster)) return 'Rückverweise wie \\1 sind nicht erlaubt.';
  try {
    new RegExp(muster);
  } catch {
    return 'Das Prüfmuster ist fehlerhaft. Bitte die Schreibweise prüfen.';
  }
  return true;
}

/**
 * Genau wie die Feldprüfung `codeBeispiel` im Backend (`src/lib/code-pattern.ts`): ohne Leerraum am Rand,
 * sonst unverändert. Kleinbuchstaben gelten nur, wenn das Prüfmuster sie erlaubt; sonst lehnte die
 * Datenbank den Beispielcode beim Seed ab.
 */
export function codePasst(muster, code) {
  if (pruefeCodeMuster(muster) !== true) return false;
  try {
    return new RegExp(muster).test(String(code ?? '').trim());
  } catch {
    return false;
  }
}

const ZEICHENKLASSEN = new Map([
  ['[0-9]', ['Ziffer', 'Ziffern']],
  ['\\d', ['Ziffer', 'Ziffern']],
  ['[A-Z]', ['Großbuchstabe', 'Großbuchstaben']],
  ['[A-Za-z]', ['Buchstabe', 'Buchstaben']],
  ['[a-zA-Z]', ['Buchstabe', 'Buchstaben']],
  ['[A-Z0-9]', ['Buchstabe oder Ziffer', 'Buchstaben oder Ziffern']],
  ['[0-9A-Z]', ['Buchstabe oder Ziffer', 'Buchstaben oder Ziffern']],
]);

/**
 * Aufbau des Codes für Kunden aus einfachen Prüfmustern, etwa `^[A-Z][0-9]{3}$` → „1 Großbuchstabe, dann
 * 3 Ziffern“. Für alles andere `undefined` (dann gilt „Aufbau wie im Beispiel …“); erfunden wird nichts.
 */
export function formatBeschreibung(muster) {
  if (pruefeCodeMuster(muster) !== true) return undefined;
  let rest = muster.slice(1, -1);
  const teile = [];
  while (rest) {
    let klasse;
    let wort;
    const bekannt = [...ZEICHENKLASSEN.keys()].find((k) => rest.startsWith(k));
    if (bekannt) {
      klasse = ZEICHENKLASSEN.get(bekannt);
      rest = rest.slice(bekannt.length);
    } else if (/^\\[-./ ]/.test(rest)) {
      wort = rest[1];
      rest = rest.slice(2);
    } else if (/^[A-Za-z0-9 ]/.test(rest)) {
      wort = rest[0];
      rest = rest.slice(1);
    } else if (/^-/.test(rest)) {
      wort = '-';
      rest = rest.slice(1);
    } else return undefined;
    const menge = /^\{(\d+)(?:,(\d+))?\}/.exec(rest);
    let von = 1;
    let bis = 1;
    if (menge) {
      von = Number(menge[1]);
      bis = menge[2] === undefined ? von : Number(menge[2]);
      rest = rest.slice(menge[0].length);
    } else if (rest.startsWith('?')) {
      von = 0;
      rest = rest.slice(1);
    } else if (/^[+*{]/.test(rest)) return undefined;
    if (wort !== undefined) {
      if (von !== 1 || bis !== 1) return undefined;
      teile.push(`„${wort}“`);
      continue;
    }
    const zahl = von === bis ? `${von}` : von === 0 && bis === 1 ? 'optional 1' : `${von} bis ${bis}`;
    teile.push(`${zahl} ${von === 1 && bis === 1 ? klasse[0] : klasse[1]}`);
  }
  return teile.length ? teile.join(', dann ') : undefined;
}

/* ---------- Werte -------------------------------------------------------------------------- */

/** „12,50“, „12.50“ oder „12“ → Cent; sonst `undefined`. */
export function preisInCent(text) {
  const t = String(text ?? '').trim();
  const treffer = /^(\d{1,4})(?:[,.](\d{2}))?$/.exec(t);
  if (!treffer) return undefined;
  const cent = Number(treffer[1]) * 100 + Number(treffer[2] ?? 0);
  return cent > 0 ? cent : undefined;
}

/** Staffel „3:7,20|5:6,56“ (ab Stück:Preis je Stück) → Stufen; leer → `[]`; Fehler als Text. */
export function leseStaffel(text, preisCent, maxQty) {
  const t = String(text ?? '').trim();
  if (!t) return [];
  const stufen = [];
  for (const teil of t.split('|')) {
    const treffer = /^\s*(\d+)\s*:\s*([^\s]+)\s*$/.exec(teil);
    if (!treffer) return `Staffel „${teil.trim()}“ ist nicht im Format „ab Stück:Preis“, etwa „3:7,20“.`;
    const minQty = Number(treffer[1]);
    const cent = preisInCent(treffer[2]);
    if (cent === undefined) return `Staffelpreis „${treffer[2]}“ hat kein gültiges Preisformat.`;
    if (minQty < 2 || minQty > maxQty) return `Staffel ab ${minQty} Stück liegt nicht zwischen 2 und der Höchstmenge ${maxQty}.`;
    if (cent >= preisCent) return `Staffelpreis ab ${minQty} Stück ist nicht günstiger als der Einzelpreis.`;
    const vorige = stufen[stufen.length - 1];
    if (vorige && (minQty <= vorige.minQty || cent > vorige.priceCents)) {
      return 'Staffeln müssen nach Stückzahl aufsteigen, und der Preis darf dabei nicht steigen.';
    }
    stufen.push({ minQty, priceCents: cent });
  }
  return stufen;
}

/* ---------- Einlesen und prüfen ------------------------------------------------------------ */

/** Zeilen der Tabelle als Objekte mit Zeilennummer; prüft Kopf und Felderzahl. */
export function leseSortiment(text) {
  const tabelle = parseCsv(text);
  const [kopf, ...daten] = tabelle;
  if (!kopf) throw new Error('Sortiment: Datei ist leer');
  const namen = kopf.map((k) => k.trim().toLowerCase());
  const fehlend = SPALTEN.filter((spalte) => !namen.includes(spalte));
  if (fehlend.length) throw new Error(`Sortiment: Spalte(n) fehlen: ${fehlend.join(', ')}`);
  return daten.map((werte, n) => {
    const nummer = n + 2;
    const f = Object.fromEntries(namen.map((name, i) => [name, (werte[i] ?? '').trim()]));
    return { nummer, felderzahl: werte.length, erwartet: namen.length, ...f };
  });
}

/** Ist die Zeile eine als Beispiel gekennzeichnete Vorlagenzeile? Sie wird nie übernommen. */
export function istBeispielzeile(zeile) {
  return /^beispiel\b/i.test(zeile.quelle ?? '') || /^beispiel\b/i.test(zeile.hersteller ?? '');
}

function kategorieKette(kategorien, id) {
  const nachId = new Map(kategorien.map((k) => [k.id, k]));
  const kette = [];
  const gesehen = new Set();
  let aktuell = nachId.get(id);
  while (aktuell && !gesehen.has(aktuell.id)) {
    gesehen.add(aktuell.id);
    kette.unshift(aktuell);
    aktuell = aktuell.eltern ? nachId.get(aktuell.eltern) : undefined;
  }
  return kette;
}

/**
 * Prüft alle Zeilen und baut die Codelinien. Reine Funktion. Ergebnis: `linien` (nur wenn `fehler` und
 * `vorschlaege` leer sind, sind sie verwendbar), `fehler` als Liste in Klartext je Zeile,
 * `vorschlaege` für neue Hersteller-Stammeinträge.
 *
 * @param {Array<Record<string, any>>} zeilen
 * @param {{ hersteller?: Array<Record<string, any>>, kategorien?: Array<Record<string, any>> }} [optionen]
 */
export function pruefeSortiment(zeilen, { hersteller = [], kategorien = [] } = {}) {
  const fehler = [];
  const vorschlaege = new Map();
  const linien = [];
  const ids = new Map();
  const echte = zeilen.filter((z) => !istBeispielzeile(z));
  const uebersprungen = zeilen.length - echte.length;

  for (const z of echte) {
    const vor = `Zeile ${z.nummer}`;
    const zeilenFehler = [];
    if (z.felderzahl !== z.erwartet) zeilenFehler.push(`${z.felderzahl} statt ${z.erwartet} Felder`);
    const leer = PFLICHT.filter((feld) => !z[feld]);
    if (leer.length) zeilenFehler.push(`Pflichtfeld leer: ${leer.join(', ')}`);

    const preis = z.preis ? preisInCent(z.preis) : undefined;
    if (z.preis && preis === undefined) zeilenFehler.push(`Preis „${z.preis}“ hat kein gültiges Format (etwa 12,50)`);

    const max = /^\d+$/.test(z.max_stueck ?? '') ? Number(z.max_stueck) : undefined;
    if (z.max_stueck && (max === undefined || max < 1 || max > HOECHSTMENGE)) {
      zeilenFehler.push(`max_stueck „${z.max_stueck}“ ist keine ganze Zahl von 1 bis ${HOECHSTMENGE}`);
    }

    let staffel = [];
    if (preis !== undefined && max !== undefined) {
      const ergebnis = leseStaffel(z.staffel, preis, max);
      if (typeof ergebnis === 'string') zeilenFehler.push(ergebnis);
      else staffel = ergebnis;
    }

    if (z.codeformat) {
      const muster = pruefeCodeMuster(z.codeformat);
      if (muster !== true) zeilenFehler.push(`Prüfmuster: ${muster}`);
      else if (z.beispielcode && !codePasst(z.codeformat, z.beispielcode)) {
        zeilenFehler.push(`Beispielcode „${z.beispielcode}“ passt nicht zum Prüfmuster ${z.codeformat}`);
      }
    }

    let stamm;
    if (z.hersteller) {
      const treffer = hersteller.filter((h) => schluessel(h.name) === schluessel(z.hersteller));
      if (treffer.length === 1) stamm = treffer[0];
      else if (treffer.length > 1) zeilenFehler.push(`Hersteller „${z.hersteller}“ passt zu mehreren Stammeinträgen`);
      else {
        const id = slugify(z.hersteller);
        if (!vorschlaege.has(id)) {
          vorschlaege.set(id, { id, slug: id, name: z.hersteller, einsatz: '', angeboten: true, reihenfolge: (hersteller.length + vorschlaege.size + 1) * 10, zeilen: [] });
        }
        vorschlaege.get(id).zeilen.push(z.nummer);
      }
    }

    let kategorie;
    const kategorieWert = z.kategorie || STANDARD_KATEGORIE;
    const kTreffer = kategorien.filter((k) => [k.id, k.slug, k.name].some((wert) => schluessel(wert) === schluessel(kategorieWert)));
    if (kTreffer.length !== 1) zeilenFehler.push(`Kategorie „${kategorieWert}“ ${kTreffer.length ? 'ist nicht eindeutig' : 'steht nicht in den Shop-Kategorien'}`);
    else {
      const kette = kategorieKette(kategorien, kTreffer[0].id);
      if (kette[0]?.art !== 'codeprodukte') zeilenFehler.push(`Kategorie „${kategorieWert}“ gehört nicht zu „Schlüssel nach Code“`);
      else kategorie = kTreffer[0];
    }

    if (zeilenFehler.length) {
      fehler.push(...zeilenFehler.map((text) => `${vor}: ${text}`));
      continue;
    }
    if (!stamm) continue;

    const name = `${stamm.name} ${z.system}, Codebereich ${z.codebereich}`;
    const id = slugify(`${stamm.name} ${z.system} ${z.codebereich}`).slice(0, 80).replace(/-+$/, '');
    if (ids.has(id)) {
      fehler.push(`${vor}: gleiche Kennung „${id}“ wie Zeile ${ids.get(id)} (Hersteller, System und Codebereich doppelt)`);
      continue;
    }
    ids.set(id, z.nummer);
    linien.push({
      id,
      slug: id,
      name,
      manufacturer: stamm.name,
      manufacturerId: stamm.id,
      system: z.system,
      codeRange: z.codebereich,
      application: `${stamm.name} ${z.system}`,
      keyType: '',
      description: '',
      codeFormatLabel: formatBeschreibung(z.codeformat) ?? `Aufbau wie im Beispiel ${z.beispielcode}`,
      codePattern: z.codeformat,
      codeExample: z.beispielcode,
      codeHint: z.hinweise ?? '',
      codeLocationImage: { motif: `Fundstelle des Codes ${name}`, ratio: '4/3' },
      productImage: {
        motif: `Produktfoto ${name}`,
        ratio: '1/1',
        ...(z.bild_datei ? { note: `Bilddatei laut Tabelle: ${z.bild_datei}. Im Backend hochladen.` } : {}),
      },
      priceCents: preis,
      ...(staffel.length ? { bulkPrices: staffel } : {}),
      scope: '1 Schlüssel je Stück, gefertigt nach angegebenem Code.',
      maxQty: max,
      photoUpload: 'optional',
      shippingClass: 'code-schluessel',
      // Erst ein Mensch gibt frei: Ohne Datenbank bleibt die Linie unsichtbar, der Seed legt sie als Entwurf
      // an. Veröffentlicht wird nach der Prüfung (Foto, Texte), siehe docs/betrieb/shop-pflegen.md, Abschnitt 8.
      active: false,
      availability: 'lieferbar',
      categoryId: kategorie.id,
      // Keine Schlagwort-Familie aus dem System bilden: Hersteller und System stehen schon in eigenen Feldern.
      tags: [],
      seo: { title: '', description: '', internalLinks: [] },
    });
  }

  for (const v of vorschlaege.values()) {
    fehler.push(`Hersteller „${v.name}“ (Zeile ${v.zeilen.join(', ')}) steht nicht in der Stammliste. Vorschlag für einen neuen Stammeintrag: ${v.name} (Adresse ${v.slug}).`);
  }
  return {
    linien,
    fehler,
    vorschlaege: [...vorschlaege.values()].map((v) => {
      const eintrag = { ...v };
      delete eintrag.zeilen;
      return eintrag;
    }),
    uebersprungen,
  };
}

/**
 * Arbeitet geprüfte Linien in den Bestand ein: Einträge mit derselben Kennung werden ersetzt, neue angehängt,
 * alle anderen bleiben. Eine Kennung, die im Bestand ein Beispiel trägt, wird nicht überschrieben (Fehler).
 */
export function arbeiteEin(bestand, linien) {
  const fehler = [];
  const nachId = new Map(bestand.map((line, index) => [line.id, index]));
  const neu = [...bestand];
  for (const line of linien) {
    const index = nachId.get(line.id) ?? bestand.findIndex((b) => b.slug === line.slug);
    if (index === undefined || index < 0) {
      neu.push(line);
      continue;
    }
    if (bestand[index].example) {
      fehler.push(`Kennung „${line.id}“ gehört zu einem Beispiel im Bestand; bitte im Backend klären.`);
      continue;
    }
    neu[index] = line;
  }
  return { liste: neu, fehler };
}

/** Der ganze Lauf ohne Dateizugriff: Text der Tabelle, Bestand, Stammliste und Kategorien → Ergebnis. */
export function importiere({ text, bestand, hersteller, kategorien }) {
  const zeilen = leseSortiment(text);
  const geprueft = pruefeSortiment(zeilen, { hersteller, kategorien });
  if (geprueft.fehler.length) return { ok: false, ...geprueft, liste: bestand };
  const { liste, fehler } = arbeiteEin(bestand, geprueft.linien);
  if (fehler.length) return { ok: false, ...geprueft, fehler, liste: bestand };
  return { ok: true, ...geprueft, liste };
}

function main(argumente) {
  const trocken = argumente.includes('--trocken');
  const zielArg = argumente.find((a) => a.startsWith('--ziel='));
  const ziel = zielArg ? path.resolve(zielArg.slice('--ziel='.length)) : ZIEL_DATEI;
  const angegeben = argumente.find((a) => !a.startsWith('--'));
  const datei = angegeben ? path.resolve(angegeben) : STANDARD_ORT;
  if (!existsSync(datei)) {
    console.log(`Keine Tabelle gefunden (${datei}). Nichts geändert.`);
    return 0;
  }
  const ergebnis = importiere({
    text: readFileSync(datei, 'utf8'),
    bestand: JSON.parse(readFileSync(ziel, 'utf8')),
    hersteller: JSON.parse(readFileSync(HERSTELLER_DATEI, 'utf8')),
    kategorien: JSON.parse(readFileSync(KATEGORIEN_DATEI, 'utf8')),
  });
  if (!ergebnis.ok) {
    console.error(`Abgebrochen, nichts geschrieben. ${ergebnis.fehler.length} Punkt(e) zu klären:`);
    for (const text of ergebnis.fehler) console.error(`  ${text}`);
    if (ergebnis.vorschlaege.length) {
      console.error('Vorschlag für content/hersteller.json (Einsatztext ergänzen, nur was belegt ist):');
      console.error(JSON.stringify(ergebnis.vorschlaege, null, 2));
    }
    return 1;
  }
  console.log(`Geprüft: ${ergebnis.linien.length} Angebote aus ${datei}; Beispielzeilen übersprungen: ${ergebnis.uebersprungen}.`);
  if (trocken || ergebnis.linien.length === 0) return 0;
  const tmp = `${ziel}.tmp-${process.pid}`;
  writeFileSync(tmp, `${JSON.stringify(ergebnis.liste, null, 2)}\n`, 'utf8');
  renameSync(tmp, ziel);
  console.log(`Geschrieben: ${ziel}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2));
}
