#!/usr/bin/env node
// Ortsstamm aus dem Gemeindeverzeichnis (GV-ISys) und den Postleitzahlen von GeoNames (FA-PLATTFORM-03, A-051).
//
//   node scripts/orte-import.mjs [--gv pfad.xlsx] [--geonames DE.txt] [--anweisung text.txt] [--trocken] [--liste]
//
// Liest die Jahresausgabe des Statistischen Bundesamtes (Blatt „Onlineprodukt_Gemeinden…“) und die Datei DE.txt
// von GeoNames, beide unter _werkstatt/ausbau/daten/orte/ (nicht im Repository). Die xlsx-Datei liest das
// Werkzeug aus scripts/fahrzeuge-import-fz2.mjs mit Bordmitteln von Node; keine neue Bibliothek (G7).
//
// Schreibt nach content/orte/:
//   gemeinden.json       alle politisch selbständigen Gemeinden (Satzart 60 ohne gemeindefreie Gebiete)
//   kreise.json          Kreise, kreisfreie Städte, Stadtkreise, Regionalverband (Satzart 40)
//   postleitzahlen.json  Postleitzahl → Ortsnamen, Kreise, Gemeindeschlüssel, Mittelpunkt (GeoNames)
//   prioritaet.json      Anhang A der Arbeitsanweisung als Prioritätsliste mit Gemeindeschlüsseln
//
// Der Schlüssel ist der achtstellige Amtliche Gemeindeschlüssel. Ein neuer Stand meldet Zugänge, Abgänge und
// Umbenennungen gegenüber der vorhandenen gemeinden.json. Die Adresse (Slug) einer Gemeinde bleibt über Stände
// gleich; neue Gemeinden bekommen sie nach `slugsVergeben`. Gepflegte Ortsseiten (content/cities.json, Sammlung
// Einsatzgebiete) fasst der Lauf nicht an. Die Datenbank übernimmt den Stamm beim Seed (src/lib/orte/uebernahme.ts).
//
// Die Prioritätsliste wird nur geschrieben, wenn der Volltext der Arbeitsanweisung vorliegt; sonst bleibt die
// vorhandene Datei und ihre Schlüssel werden gegen den neuen Stand geprüft.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { leseXlsx } from './fahrzeuge-import-fz2.mjs';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROH = path.join(WURZEL, '_werkstatt/ausbau/daten');
export const STANDARD_GV = path.join(ROH, 'orte/31122025_Auszug_GV.xlsx');
export const STANDARD_GEONAMES = path.join(ROH, 'orte/geonames/DE.txt');
export const STANDARD_ANWEISUNG = path.join(ROH, 'arbeitsanweisung-2026-11-11.txt');
export const ZIEL_ORDNER = path.join(WURZEL, 'content/orte');

/** Quellenvermerk im Wortlaut des Blatts „Inhalt“ der Jahresausgabe. */
export const GV_QUELLE =
  '© Daten (im Auftrag der Herausgebergemeinschaft Statistische Ämter des Bundes und der Länder) Statistisches Bundesamt (Destatis), 2026. '
  + 'Gemeindeverzeichnis-Informationssystem GV-ISys, Gebietsstand 31.12.2025. Vervielfältigung und Verbreitung, auch auszugsweise, mit Quellenangabe gestattet.';
export const GEONAMES_QUELLE = 'GeoNames, www.geonames.org, Postleitzahlen Deutschland (DE.txt), Creative Commons Attribution 4.0 (CC BY 4.0)';
export const ANHANG_QUELLE = 'Vorgabe des Inhabers, Arbeitsanweisung vom 11.11.2026, Anhang A (Reihenfolge je Bundesland wie dort)';

const BLATT_PRAEFIX = 'Onlineprodukt_Gemeinden';

/** Bundesländer nach dem Landesschlüssel. */
export const LAENDER = {
  '01': 'Schleswig-Holstein',
  '02': 'Hamburg',
  '03': 'Niedersachsen',
  '04': 'Bremen',
  '05': 'Nordrhein-Westfalen',
  '06': 'Hessen',
  '07': 'Rheinland-Pfalz',
  '08': 'Baden-Württemberg',
  '09': 'Bayern',
  10: 'Saarland',
  11: 'Berlin',
  12: 'Brandenburg',
  13: 'Mecklenburg-Vorpommern',
  14: 'Sachsen',
  15: 'Sachsen-Anhalt',
  16: 'Thüringen',
};

/** Textkennzeichen der Gemeinden (Kommentar im Kopf der Jahresausgabe). 65 und 66 sind gemeindefreie Gebiete. */
export const GEMEINDE_ARTEN = {
  60: 'markt',
  61: 'kreisfreie-stadt',
  62: 'stadtkreis',
  63: 'stadt',
  64: 'gemeinde',
  67: 'grosse-kreisstadt',
};
export const GEMEINDEFREI = new Set(['65', '66']);
/** Textkennzeichen der Kreise. */
export const KREIS_ARTEN = {
  41: 'kreisfreie-stadt',
  42: 'stadtkreis',
  43: 'kreis',
  44: 'landkreis',
  45: 'regionalverband',
};

/* ---------- Gemeindeverzeichnis ------------------------------------------ */

const kopf = (text) => (text ?? '').replace(/\s+/g, ' ').trim();

/** Dezimalzahl aus der Zelle („9,43751“ oder „56.73“). */
function dezimal(text) {
  const t = (text ?? '').trim().replace(',', '.');
  if (!t) return null;
  const zahl = Number(t);
  return Number.isFinite(zahl) ? zahl : null;
}

const gerundet = (zahl, stellen) => (zahl === null ? null : Number(zahl.toFixed(stellen)));

/** Name vor dem ersten Komma („Wetzlar, Stadt“ → Name „Wetzlar“, Bezeichnung „Stadt“). */
export function teileName(text) {
  const t = kopf(text);
  const komma = t.indexOf(', ');
  return komma < 0 ? { name: t, bezeichnung: null } : { name: t.slice(0, komma).trim(), bezeichnung: t.slice(komma + 2).trim() || null };
}

/**
 * Liest das Blatt der Jahresausgabe. Prüft die Kopfzeilen, damit eine geänderte Spaltenfolge nicht still falsche
 * Werte liefert, und gibt Länder, Kreise, Gemeinden und die Zahl der gemeindefreien Gebiete zurück.
 */
export function leseGemeindeverzeichnis(zeilen) {
  const kopfIndex = zeilen.findIndex((z) => kopf(z.A) === 'Satzart');
  if (kopfIndex < 0) throw new Error('Gemeindeverzeichnis: Kopfzeile „Satzart“ fehlt');
  const k1 = zeilen[kopfIndex];
  const k2 = zeilen[kopfIndex + 1] ?? {};
  const erwartet = [
    [k1.B, 'Textkennzeichen'],
    [k1.C, 'Amtlicher Regionalschlüssel (ARS)'],
    [k1.H, 'Gemeindename'],
    [k2.C, 'Land'],
    [k2.D, 'RB'],
    [k2.E, 'Kreis'],
    [k2.F, 'VB'],
    [k2.G, 'Gem'],
    [k2.J, 'insgesamt'],
    [k2.O, 'Längengrad'],
    [k2.P, 'Breitengrad'],
  ];
  for (const [ist, soll] of erwartet) {
    if (kopf(ist) !== soll) throw new Error(`Gemeindeverzeichnis: Kopf „${soll}“ erwartet, „${kopf(ist)}“ gefunden`);
  }
  if (!kopf(k1.N).startsWith('Postleitzahl')) throw new Error('Gemeindeverzeichnis: Spalte N ist nicht die Postleitzahl');
  if (!kopf(k1.I).startsWith('Fläche')) throw new Error('Gemeindeverzeichnis: Spalte I ist nicht die Fläche');

  const laender = {};
  const kreise = [];
  const gemeinden = [];
  let gemeindefrei = 0;
  for (let i = kopfIndex + 2; i < zeilen.length; i += 1) {
    const z = zeilen[i];
    const satzart = kopf(z.A);
    if (!/^\d0$/.test(satzart)) continue;
    const ort = `Gemeindeverzeichnis, Zeile ${i + 1}`;
    if (satzart === '10') {
      laender[kopf(z.C)] = kopf(z.H);
    } else if (satzart === '40') {
      const schluessel = `${kopf(z.C)}${kopf(z.D)}${kopf(z.E)}`;
      const art = KREIS_ARTEN[kopf(z.B)];
      if (!/^\d{5}$/.test(schluessel) || !art) throw new Error(`${ort}: Kreis ohne gültigen Schlüssel oder Textkennzeichen`);
      kreise.push({ schluessel, name: kopf(z.H), art, land: schluessel.slice(0, 2) });
    } else if (satzart === '60') {
      if (GEMEINDEFREI.has(kopf(z.B))) {
        gemeindefrei += 1;
        continue;
      }
      const art = GEMEINDE_ARTEN[kopf(z.B)];
      if (!art) throw new Error(`${ort}: unbekanntes Textkennzeichen „${kopf(z.B)}“`);
      const land = kopf(z.C);
      const kreis = `${land}${kopf(z.D)}${kopf(z.E)}`;
      const schluessel = `${kreis}${kopf(z.G)}`;
      const regionalschluessel = `${kreis}${kopf(z.F)}${kopf(z.G)}`;
      if (!/^\d{8}$/.test(schluessel) || !/^\d{12}$/.test(regionalschluessel)) throw new Error(`${ort}: Schlüssel „${schluessel}“ ungültig`);
      const plz = kopf(z.N);
      if (!/^\d{5}$/.test(plz)) throw new Error(`${ort}: Postleitzahl „${plz}“ ungültig`);
      const { name, bezeichnung } = teileName(z.H);
      const einwohner = kopf(z.J);
      gemeinden.push({
        schluessel,
        regionalschluessel,
        name,
        bezeichnung,
        art,
        kreis,
        land,
        plz,
        breite: gerundet(dezimal(z.P), 5),
        laenge: gerundet(dezimal(z.O), 5),
        einwohner: /^\d+$/.test(einwohner) ? Number(einwohner) : null,
      });
    }
  }
  const doppelt = doppelte(gemeinden.map((g) => g.schluessel));
  if (doppelt.length) throw new Error(`Gemeindeverzeichnis: Schlüssel doppelt: ${doppelt.join(', ')}`);
  const kreisSchluessel = new Set(kreise.map((k) => k.schluessel));
  const ohneKreis = gemeinden.filter((g) => !kreisSchluessel.has(g.kreis));
  if (ohneKreis.length) throw new Error(`Gemeindeverzeichnis: ${ohneKreis.length} Gemeinden ohne Kreis, etwa ${ohneKreis[0].name}`);
  for (const [schluessel, name] of Object.entries(LAENDER)) {
    if (laender[schluessel] !== name) throw new Error(`Gemeindeverzeichnis: Land ${schluessel} heißt „${laender[schluessel]}“, erwartet „${name}“`);
  }
  return { laender, kreise, gemeinden, gemeindefrei };
}

function doppelte(werte) {
  const gesehen = new Set();
  const doppelt = new Set();
  for (const w of werte) {
    if (gesehen.has(w)) doppelt.add(w);
    gesehen.add(w);
  }
  return [...doppelt];
}

/* ---------- Namen und Adressen ------------------------------------------- */

/** Vergleichsform eines Ortsnamens: klein, Bindestriche, Schrägstriche, Klammern und Punkte als Leerzeichen. */
export function vergleichsname(text) {
  return (text ?? '')
    .toLowerCase()
    .replace(/[-/().,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Vergleichsform ohne Klammerzusatz („Kempten (Allgäu)“ → „kempten“). */
export function vergleichsnameOhneKlammer(text) {
  return vergleichsname((text ?? '').replace(/\([^)]*\)/g, ' '));
}

/** Adresse aus einem Namen, gleiche Regel wie src/lib/slug.ts (Umlaute umschreiben, Akzente entfernen). */
export function slugify(text) {
  return (text ?? '')
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

/**
 * Adressen der Gemeinden. Regel (A-051 Nr. 3):
 *   1. Adresse aus dem Namen („Wetzlar“ → wetzlar, „Neustadt (Wied)“ → neustadt-wied).
 *   2. Tragen mehrere Gemeinden dieselbe Adresse, bekommt jede den Kreis als Zusatz (Name des Kreises ohne
 *      Bezeichnung). Heißt der Kreis wie die Gemeinde (kreisfreie Stadt Hof), ist der Zusatz das Land.
 *   3. Bleibt sie danach doppelt, kommt das Land dazu, zuletzt der Gemeindeschlüssel.
 * `vorher` (Schlüssel → Adresse eines früheren Stands) hat Vorrang, damit Adressen über Stände gleich bleiben;
 * eine frühere Adresse, die inzwischen eine andere Gemeinde trägt, wird nicht übernommen.
 */
export function slugsVergeben(gemeinden, kreisNamen, vorher = new Map()) {
  const ergebnis = new Map();
  const vergeben = new Set();
  const neu = [];
  for (const g of gemeinden) {
    const alt = vorher.get(g.schluessel);
    if (alt && !vergeben.has(alt)) {
      ergebnis.set(g.schluessel, alt);
      vergeben.add(alt);
    } else {
      neu.push(g);
    }
  }
  const stufen = [
    (g) => slugify(g.name),
    (g) => {
      const name = slugify(g.name);
      const kreis = slugify(teileName(kreisNamen.get(g.kreis) ?? '').name);
      return kreis && kreis !== name ? `${name}-${kreis}` : `${name}-${slugify(LAENDER[g.land] ?? g.land)}`;
    },
    (g) => {
      const name = slugify(g.name);
      const kreis = slugify(teileName(kreisNamen.get(g.kreis) ?? '').name);
      return `${name}${kreis && kreis !== name ? `-${kreis}` : ''}-${slugify(LAENDER[g.land] ?? g.land)}`;
    },
    (g) => `${slugify(g.name)}-${g.schluessel}`,
  ];
  // Gruppen gleicher Grundadresse über alle Gemeinden, damit eine neue Gemeinde den Zusatz auch dann bekommt,
  // wenn die gleichnamige ältere ihre Adresse ohne Zusatz behält.
  const grundZahl = new Map();
  for (const g of gemeinden) grundZahl.set(stufen[0](g), (grundZahl.get(stufen[0](g)) ?? 0) + 1);
  let offen = neu;
  for (let stufe = 0; stufe < stufen.length && offen.length; stufe += 1) {
    const kandidaten = new Map();
    for (const g of offen) {
      if (stufe === 0 && (grundZahl.get(stufen[0](g)) ?? 0) > 1) continue;
      const s = stufen[stufe](g);
      kandidaten.set(s, [...(kandidaten.get(s) ?? []), g]);
    }
    const rest = [];
    for (const g of offen) {
      const s = stufe === 0 && (grundZahl.get(stufen[0](g)) ?? 0) > 1 ? null : stufen[stufe](g);
      if (s && kandidaten.get(s)?.length === 1 && !vergeben.has(s)) {
        ergebnis.set(g.schluessel, s);
        vergeben.add(s);
      } else {
        rest.push(g);
      }
    }
    offen = rest;
  }
  if (offen.length) throw new Error(`Adressen nicht eindeutig: ${offen.map((g) => g.schluessel).join(', ')}`);
  return ergebnis;
}

/* ---------- GeoNames ----------------------------------------------------- */

/** Zeilen von DE.txt (Tabulator, UTF-8): Postleitzahl, Ort, Land, Kreisschlüssel, Koordinaten. */
export function leseGeonames(text) {
  const zeilen = [];
  for (const [i, zeile] of text.split('\n').entries()) {
    if (!zeile.trim()) continue;
    const f = zeile.split('\t');
    if (f[0] !== 'DE') throw new Error(`GeoNames, Zeile ${i + 1}: Land „${f[0]}“ statt DE`);
    if (!/^\d{5}$/.test(f[1])) throw new Error(`GeoNames, Zeile ${i + 1}: Postleitzahl „${f[1]}“ ungültig`);
    zeilen.push({
      plz: f[1],
      ort: kopf(f[2]),
      kreis: /^\d{5}$/.test(f[8] ?? '') ? f[8] : null,
      breite: dezimal(f[9]),
      laenge: dezimal(f[10]),
    });
  }
  return zeilen;
}

/**
 * Postleitzahlen mit Ortsnamen, Kreisen, Gemeinden und Mittelpunkt. Die Gemeinde einer Zeile steht fest, wenn
 *   - ihr Kreis nur eine Gemeinde hat (kreisfreie Städte, Berlin, Hamburg) oder
 *   - der Ortsname in ihrem Kreis genau einer Gemeinde gleicht (Vergleichsform, auch ohne Klammerzusatz).
 * Dazu kommt die Postleitzahl des Verwaltungssitzes aus dem Gemeindeverzeichnis. Ortsnamen ohne Treffer sind
 * Ortsteile oder abweichende Schreibweisen; sie bleiben als Name stehen, ohne Gemeindeschlüssel (nicht geraten).
 * Der Mittelpunkt ist das Mittel der Koordinaten aller Zeilen der Postleitzahl.
 */
export function postleitzahlenBilden(geo, gemeinden) {
  const jeKreis = new Map();
  for (const g of gemeinden) jeKreis.set(g.kreis, [...(jeKreis.get(g.kreis) ?? []), g]);
  const namensIndex = new Map();
  for (const [kreis, liste] of jeKreis) {
    const index = new Map();
    for (const g of liste) {
      for (const n of new Set([vergleichsname(g.name), vergleichsnameOhneKlammer(g.name)])) index.set(n, [...(index.get(n) ?? []), g.schluessel]);
    }
    namensIndex.set(kreis, index);
  }
  const eintraege = new Map();
  let zugeordnet = 0;
  for (const z of geo) {
    const e = eintraege.get(z.plz) ?? { plz: z.plz, orte: [], kreise: [], gemeinden: [], summe: [0, 0, 0] };
    if (!e.orte.includes(z.ort)) e.orte.push(z.ort);
    if (z.kreis && !e.kreise.includes(z.kreis)) e.kreise.push(z.kreis);
    if (z.breite !== null && z.laenge !== null) {
      e.summe[0] += z.breite;
      e.summe[1] += z.laenge;
      e.summe[2] += 1;
    }
    let ags = null;
    const imKreis = z.kreis ? jeKreis.get(z.kreis) : undefined;
    if (imKreis?.length === 1) ags = imKreis[0].schluessel;
    else if (z.kreis) {
      const index = namensIndex.get(z.kreis);
      const treffer = new Set([...(index?.get(vergleichsname(z.ort)) ?? []), ...(index?.get(vergleichsnameOhneKlammer(z.ort)) ?? [])]);
      if (treffer.size === 1) ags = [...treffer][0];
    }
    if (ags) {
      zugeordnet += 1;
      if (!e.gemeinden.includes(ags)) e.gemeinden.push(ags);
    }
    eintraege.set(z.plz, e);
  }
  let ausVerwaltungssitz = 0;
  let ohneGeonames = 0;
  for (const g of gemeinden) {
    const e = eintraege.get(g.plz);
    if (!e) {
      ohneGeonames += 1;
      continue;
    }
    if (!e.gemeinden.includes(g.schluessel)) {
      e.gemeinden.push(g.schluessel);
      ausVerwaltungssitz += 1;
    }
    // Der Kreis der Gemeinde gehört dann auch zur Postleitzahl (etwa 57629: Malberg aus 07132 neben 07143).
    if (!e.kreise.includes(g.kreis)) e.kreise.push(g.kreis);
  }
  const liste = [...eintraege.values()]
    .map(({ summe, ...e }) => ({
      ...e,
      kreise: [...e.kreise].sort(),
      gemeinden: [...e.gemeinden].sort(),
      breite: summe[2] ? Number((summe[0] / summe[2]).toFixed(4)) : null,
      laenge: summe[2] ? Number((summe[1] / summe[2]).toFixed(4)) : null,
    }))
    .sort((a, b) => a.plz.localeCompare(b.plz));
  return { liste, zaehler: { zeilen: geo.length, zugeordnet, ausVerwaltungssitz, ohneGeonames } };
}

/* ---------- Anhang A ----------------------------------------------------- */

/** Überschriften des Anhangs (ohne Bindestrich wie im Volltext) → Landesschlüssel. */
export const ANHANG_LAENDER = {
  'Baden Württemberg': '08',
  Bayern: '09',
  Berlin: '11',
  Brandenburg: '12',
  Bremen: '04',
  Hamburg: '02',
  Hessen: '06',
  'Mecklenburg Vorpommern': '13',
  Niedersachsen: '03',
  'Nordrhein Westfalen': '05',
  'Rheinland Pfalz': '07',
  Saarland: '10',
  Sachsen: '14',
  'Sachsen Anhalt': '15',
  'Schleswig Holstein': '01',
  Thüringen: '16',
};

/**
 * Liest Anhang A aus dem Volltext: zwischen „Anhang A:“ und „Technischer Auftrag für die Ortsdatenbank“ je
 * Bundesland eine Überschrift, darunter Namen, getrennt durch „•“. Zeilenumbrüche innerhalb eines Namens werden
 * zu Leerzeichen. Seitenköpfe und -füße des Dokuments fallen weg. Ein Land mit einem einzigen Eintrag gleichen
 * Namens (Berlin, Hamburg) steht als Überschrift und als Eintrag da.
 */
export function anhangALesen(text) {
  const zeilen = text.split('\n');
  const start = zeilen.findIndex((z) => z.trim().startsWith('Anhang A:'));
  const ende = zeilen.findIndex((z, i) => i > start && z.trim().startsWith('Technischer Auftrag für die Ortsdatenbank'));
  if (start < 0 || ende < 0) throw new Error('Anhang A nicht gefunden');
  const bloecke = new Map();
  let land = null;
  for (const roh of zeilen.slice(start + 1, ende)) {
    const z = roh.trim().replace(/\s+/g, ' ');
    if (!z || /^Schlüsselmacher24 •|^SCHLÜSSELMACHER24 \|/.test(z)) continue;
    if (ANHANG_LAENDER[z] && !(land === z && bloecke.get(land).length === 0)) {
      if (bloecke.has(z)) throw new Error(`Anhang A: Land „${z}“ doppelt`);
      land = z;
      bloecke.set(land, []);
      continue;
    }
    if (land) bloecke.get(land).push(z);
  }
  const eintraege = [];
  for (const [ueberschrift, teile] of bloecke) {
    const namen = teile
      .join(' ')
      .split('•')
      .map((n) => n.trim().replace(/\s+/g, ' '))
      .filter(Boolean);
    namen.forEach((name, i) => eintraege.push({ land: ANHANG_LAENDER[ueberschrift], rang: i + 1, name }));
  }
  return eintraege;
}

/**
 * Geprüfte Zuordnung für Namen des Anhangs, die keine Regel trifft (Schreibweise im Gemeindeverzeichnis abgekürzt,
 * zweisprachig oder mit anderem Zusatz). Jeder Eintrag ist gegen das Gemeindeverzeichnis 31.12.2025 geprüft; der
 * Lauf bricht ab, wenn der Schlüssel fehlt oder der amtliche Name nicht mehr den Prüftext enthält.
 * `hinweis` steht in prioritaet.json, damit ein Mensch die Wahl nachvollziehen kann.
 * `bestaetigt: false` heißt: nicht eindeutig, nur ein Vorschlag (A-051 Nr. 3, nicht raten). Der Eintrag bleibt
 * „offen“ ohne Schlüssel, mit `vorschlag` und `kandidaten`, bis der Inhaber bestätigt; dann `bestaetigt` und
 * `kandidaten` entfernen.
 *
 * @type {Record<string, { schluessel: string, pruefung: string, hinweis?: string, bestaetigt?: boolean, kandidaten?: string[] }>}
 */
export const ZUORDNUNG_ANHANG_A = {
  '09|Amberg': {
    schluessel: '09361000',
    pruefung: 'Amberg',
    bestaetigt: false,
    kandidaten: ['09361000', '09778111'],
    hinweis: 'Zwei Gemeinden heißen Amberg: die kreisfreie Stadt (09361000) und eine Gemeinde im Landkreis Unterallgäu (09778111). Vorschlag: die kreisfreie Stadt. Offen bis zur Bestätigung durch den Inhaber.',
  },
  '09|Weiden in der Oberpfalz': { schluessel: '09363000', pruefung: 'Weiden i.d.OPf.' },
  '09|Neumarkt in der Oberpfalz': { schluessel: '09373147', pruefung: 'Neumarkt i.d.OPf.' },
  '12|Cottbus': { schluessel: '12052000', pruefung: 'Cottbus/Chóśebuz' },
  '12|Senftenberg': { schluessel: '12066304', pruefung: 'Senftenberg/Zły Komorow' },
  '06|Bad Homburg vor der Höhe': { schluessel: '06434001', pruefung: 'Bad Homburg v. d. Höhe' },
  '06|Limburg an der Lahn': { schluessel: '06533009', pruefung: 'Limburg a. d. Lahn' },
  '10|Neunkirchen Saar': {
    schluessel: '10043114',
    pruefung: 'Neunkirchen',
    hinweis: 'Im Saarland gibt es nur eine Gemeinde Neunkirchen (Kreisstadt); der Zusatz „Saar“ des Anhangs steht nicht im amtlichen Namen.',
  },
  '14|Bautzen': { schluessel: '14625020', pruefung: 'Bautzen / Budyšin' },
  '14|Hoyerswerda': { schluessel: '14625240', pruefung: 'Hoyerswerda / Wojerecy' },
  '15|Lutherstadt Wittenberg': { schluessel: '15091375', pruefung: 'Wittenberg' },
};

/**
 * Ordnet jedem Eintrag des Anhangs einen Gemeindeschlüssel zu. Reihenfolge der Regeln:
 *   „name“: Vergleichsform gleich und im Land genau eine Gemeinde;
 *   „ohne-klammer“: gleich ohne Klammerzusatz des amtlichen Namens und im Land genau eine Gemeinde;
 *   „tabelle“: geprüfte Zuordnung (ZUORDNUNG_ANHANG_A);
 *   sonst „offen“ mit Kandidaten für Menschen (nicht geraten).
 */
export function anhangAZuordnen(eintraege, gemeinden, tabelle = ZUORDNUNG_ANHANG_A) {
  const jeLand = new Map();
  for (const g of gemeinden) jeLand.set(g.land, [...(jeLand.get(g.land) ?? []), g]);
  const nachSchluessel = new Map(gemeinden.map((g) => [g.schluessel, g]));
  for (const [k, z] of Object.entries(tabelle)) {
    const g = nachSchluessel.get(z.schluessel);
    if (!g) throw new Error(`Zuordnung Anhang A „${k}“: Schlüssel ${z.schluessel} fehlt im Gemeindeverzeichnis`);
    if (!g.name.includes(z.pruefung)) throw new Error(`Zuordnung Anhang A „${k}“: ${z.schluessel} heißt „${g.name}“, erwartet „${z.pruefung}“`);
    for (const s of z.kandidaten ?? []) {
      if (!nachSchluessel.has(s)) throw new Error(`Zuordnung Anhang A „${k}“: Kandidat ${s} fehlt im Gemeindeverzeichnis`);
    }
  }
  return eintraege.map((e) => {
    const imLand = jeLand.get(e.land) ?? [];
    const v = vergleichsname(e.name);
    const tabellenEintrag = tabelle[`${e.land}|${e.name}`];
    let treffer = imLand.filter((g) => vergleichsname(g.name) === v);
    let zuordnung = 'name';
    if (treffer.length !== 1) {
      treffer = imLand.filter((g) => vergleichsnameOhneKlammer(g.name) === v);
      zuordnung = 'ohne-klammer';
    }
    if (tabellenEintrag && treffer.length !== 1 && tabellenEintrag.bestaetigt === false) {
      const kandidaten = (tabellenEintrag.kandidaten ?? [tabellenEintrag.schluessel]).map((s) => `${nachSchluessel.get(s).name} (${s})`);
      return {
        ...e,
        schluessel: null,
        amtlicherName: null,
        zuordnung: 'offen',
        vorschlag: tabellenEintrag.schluessel,
        kandidaten,
        ...(tabellenEintrag.hinweis ? { hinweis: tabellenEintrag.hinweis } : {}),
      };
    }
    if (tabellenEintrag && treffer.length !== 1) {
      treffer = [nachSchluessel.get(tabellenEintrag.schluessel)];
      zuordnung = 'tabelle';
    }
    if (treffer.length === 1) {
      const g = treffer[0];
      return {
        ...e,
        schluessel: g.schluessel,
        amtlicherName: g.name,
        zuordnung,
        ...(zuordnung === 'tabelle' && tabellenEintrag.hinweis ? { hinweis: tabellenEintrag.hinweis } : {}),
      };
    }
    const erstesWort = v.split(' ')[0];
    const kandidaten = imLand
      .filter((g) => vergleichsname(g.name).includes(erstesWort))
      .slice(0, 8)
      .map((g) => `${g.name} (${g.schluessel})`);
    return { ...e, schluessel: null, amtlicherName: null, zuordnung: 'offen', kandidaten };
  });
}

/* ---------- Abgleich mit dem vorigen Stand ------------------------------- */

/** Zugänge, Abgänge und Umbenennungen über den Gemeindeschlüssel. */
export function staendeVergleichen(alt, neu) {
  const altMap = new Map(alt.map((g) => [g.schluessel, g]));
  const neuMap = new Map(neu.map((g) => [g.schluessel, g]));
  return {
    zugaenge: neu.filter((g) => !altMap.has(g.schluessel)).map((g) => ({ schluessel: g.schluessel, name: g.name })),
    abgaenge: alt.filter((g) => !neuMap.has(g.schluessel)).map((g) => ({ schluessel: g.schluessel, name: g.name })),
    umbenennungen: neu
      .filter((g) => altMap.has(g.schluessel) && altMap.get(g.schluessel).name !== g.name)
      .map((g) => ({ schluessel: g.schluessel, alt: altMap.get(g.schluessel).name, neu: g.name })),
  };
}

/* ---------- Dateien ------------------------------------------------------ */

/** JSON mit einem Datensatz je Zeile: lesbar im Diff, ohne die Größe eines eingerückten Formats. */
export function zeilenJson(kopfdaten, schluessel, liste) {
  const kopfText = JSON.stringify(kopfdaten, null, 2).replace(/\n}$/, '');
  const zeilen = liste.map((e) => `    ${JSON.stringify(e)}`).join(',\n');
  return `${kopfText},\n  "${schluessel}": [\n${zeilen}\n  ]\n}\n`;
}

function schreibeAtomar(datei, inhalt) {
  const tmp = `${datei}.tmp-${process.pid}`;
  writeFileSync(tmp, inhalt, 'utf8');
  renameSync(tmp, datei);
}

const sha256 = (puffer) => createHash('sha256').update(puffer).digest('hex');
const zahlText = new Intl.NumberFormat('de-DE');
const groesse = (inhalt) => `${zahlText.format(Math.round(Buffer.byteLength(inhalt) / 1024))} KB`;

function leseJson(datei) {
  return existsSync(datei) ? JSON.parse(readFileSync(datei, 'utf8')) : null;
}

function argument(argumente, name, standard) {
  const i = argumente.indexOf(name);
  return i >= 0 && argumente[i + 1] ? path.resolve(argumente[i + 1]) : standard;
}

export function main(argumente) {
  const trocken = argumente.includes('--trocken');
  const liste = argumente.includes('--liste');
  const gvDatei = argument(argumente, '--gv', STANDARD_GV);
  const geoDatei = argument(argumente, '--geonames', STANDARD_GEONAMES);
  const anweisungDatei = argument(argumente, '--anweisung', STANDARD_ANWEISUNG);
  const ziel = argument(argumente, '--ziel', ZIEL_ORDNER);

  const gvPuffer = readFileSync(gvDatei);
  const blaetter = leseXlsx(gvPuffer);
  const blatt = Object.keys(blaetter).find((n) => n.startsWith(BLATT_PRAEFIX));
  if (!blatt) throw new Error(`Gemeindeverzeichnis: Blatt „${BLATT_PRAEFIX}…“ fehlt`);
  const stand = /Gebietsstand am (\d{2}\.\d{2}\.\d{4})/.exec(JSON.stringify(blaetter[blatt].slice(0, 6)))?.[1];
  if (!stand) throw new Error('Gemeindeverzeichnis: Gebietsstand nicht gefunden');
  const gv = leseGemeindeverzeichnis(blaetter[blatt]);

  const geoPuffer = readFileSync(geoDatei);
  const geo = leseGeonames(geoPuffer.toString('utf8'));
  const plz = postleitzahlenBilden(geo, gv.gemeinden);

  const kreisNamen = new Map(gv.kreise.map((k) => [k.schluessel, k.name]));
  const altDatei = path.join(ziel, 'gemeinden.json');
  const alt = leseJson(altDatei);
  const vorher = new Map((alt?.gemeinden ?? []).map((g) => [g.schluessel, g.slug]));
  const slugs = slugsVergeben(gv.gemeinden, kreisNamen, vorher);
  const gemeinden = gv.gemeinden.map((g) => {
    const { schluessel, regionalschluessel, name, bezeichnung, art, ...rest } = g;
    return { schluessel, regionalschluessel, name, bezeichnung, art, slug: slugs.get(schluessel), ...rest };
  });
  const vergleich = staendeVergleichen(alt?.gemeinden ?? [], gemeinden);

  const herkunftGv = { datei: path.basename(gvDatei), sha256: sha256(gvPuffer), gebietsstand: stand };
  const herkunftGeo = { datei: path.basename(geoDatei), sha256: sha256(geoPuffer), zeilen: geo.length };
  const dateien = {
    'gemeinden.json': zeilenJson(
      {
        quelle: GV_QUELLE,
        herkunft: herkunftGv,
        hinweis: 'Gemeinden mit Satzart 60 ohne gemeindefreie Gebiete. plz ist die Postleitzahl des Verwaltungssitzes, Koordinaten sind der geografische Mittelpunkt (BKG, Zuordnungsstand 31.12.2024), einwohner auf Grundlage des Zensus 2022. Erzeugt mit scripts/orte-import.mjs.',
        anzahl: gemeinden.length,
      },
      'gemeinden',
      gemeinden,
    ),
    'kreise.json': zeilenJson({ quelle: GV_QUELLE, herkunft: herkunftGv, anzahl: gv.kreise.length }, 'kreise', gv.kreise),
    'postleitzahlen.json': zeilenJson(
      {
        quelle: GEONAMES_QUELLE,
        herkunft: herkunftGeo,
        hinweis: 'orte und kreise aus GeoNames; gemeinden (Gemeindeschlüssel) nur, wo eindeutig: Kreis mit einer Gemeinde, gleicher Name im Kreis oder Postleitzahl des Verwaltungssitzes laut Gemeindeverzeichnis. Mittelpunkt = Mittel der GeoNames-Koordinaten. Erzeugt mit scripts/orte-import.mjs.',
        anzahl: plz.liste.length,
      },
      'postleitzahlen',
      plz.liste,
    ),
  };

  let prioritaet = null;
  if (existsSync(anweisungDatei)) {
    const anhang = anhangAZuordnen(anhangALesen(readFileSync(anweisungDatei, 'utf8')), gemeinden);
    prioritaet = anhang;
    dateien['prioritaet.json'] = zeilenJson(
      {
        quelle: ANHANG_QUELLE,
        hinweis: 'Start- und Prioritätsliste für Ortsseiten und Partnergewinnung, keine Obergrenze. Aus ihr entsteht keine Seite automatisch. zuordnung: name, ohne-klammer, tabelle (geprüfte Tabelle in scripts/orte-import.mjs) oder offen (für Menschen).',
        gebietsstand: stand,
        anzahl: anhang.length,
        offen: anhang.filter((e) => e.zuordnung === 'offen').length,
      },
      'eintraege',
      anhang,
    );
  } else {
    const vorhanden = leseJson(path.join(ziel, 'prioritaet.json'));
    const schluessel = new Set(gemeinden.map((g) => g.schluessel));
    const verloren = (vorhanden?.eintraege ?? []).filter((e) => e.schluessel && !schluessel.has(e.schluessel));
    if (verloren.length) throw new Error(`Prioritätsliste: ${verloren.length} Schlüssel fehlen im neuen Stand, etwa ${verloren[0].name}`);
    console.log('Arbeitsanweisung nicht gefunden: prioritaet.json bleibt, Schlüssel geprüft.');
  }

  console.log(`Gebietsstand ${stand}: ${zahlText.format(gemeinden.length)} Gemeinden (${gv.gemeindefrei} gemeindefreie Gebiete nicht übernommen), ${gv.kreise.length} Kreise, ${Object.keys(gv.laender).length} Länder`);
  console.log(
    `GeoNames: ${zahlText.format(geo.length)} Zeilen, ${zahlText.format(plz.liste.length)} Postleitzahlen; Gemeinde eindeutig in ${zahlText.format(plz.zaehler.zugeordnet)} Zeilen, `
      + `${plz.zaehler.ausVerwaltungssitz} weitere über den Verwaltungssitz, ${plz.zaehler.ohneGeonames} Verwaltungssitz-Postleitzahlen fehlen in GeoNames`,
  );
  const ohneGemeinde = plz.liste.filter((p) => p.gemeinden.length === 0).length;
  const gemeindenMitPlz = new Set(plz.liste.flatMap((p) => p.gemeinden)).size;
  console.log(`Postleitzahlen ohne Gemeindeschlüssel: ${ohneGemeinde}; Gemeinden mit mindestens einer Postleitzahl: ${zahlText.format(gemeindenMitPlz)}`);
  console.log(`Abgleich mit dem vorigen Stand: ${vergleich.zugaenge.length} Zugänge, ${vergleich.abgaenge.length} Abgänge, ${vergleich.umbenennungen.length} Umbenennungen`);
  if (alt) {
    for (const z of vergleich.zugaenge.slice(0, liste ? Infinity : 20)) console.log(`  Zugang ${z.schluessel} ${z.name}`);
    for (const z of vergleich.abgaenge.slice(0, liste ? Infinity : 20)) console.log(`  Abgang ${z.schluessel} ${z.name}`);
    for (const z of vergleich.umbenennungen.slice(0, liste ? Infinity : 20)) console.log(`  Umbenennung ${z.schluessel} ${z.alt} → ${z.neu}`);
  }
  if (prioritaet) {
    const zaehlung = {};
    for (const e of prioritaet) zaehlung[e.zuordnung] = (zaehlung[e.zuordnung] ?? 0) + 1;
    console.log(`Anhang A: ${prioritaet.length} Einträge; ${Object.entries(zaehlung).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    for (const e of prioritaet.filter((x) => x.zuordnung !== 'name' || liste)) {
      console.log(`  ${LAENDER[e.land]} ${e.rang}. ${e.name}: ${e.zuordnung} ${e.schluessel ?? (e.kandidaten ?? []).join('; ')}${e.amtlicherName && e.amtlicherName !== e.name ? ` (${e.amtlicherName})` : ''}`);
    }
  }
  for (const [name, inhalt] of Object.entries(dateien)) console.log(`${name}: ${groesse(inhalt)}`);
  if (trocken) return;
  for (const [name, inhalt] of Object.entries(dateien)) schreibeAtomar(path.join(ziel, name), inhalt);
  console.log(`Geschrieben nach ${ziel}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2));
}
