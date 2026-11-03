#!/usr/bin/env node
// Fahrzeugkatalog aus der KBA-Statistik FZ 12, Stand 1.1.2026 (A-009, A-018, G-14, Z-07).
//
//   node scripts/fahrzeuge-import.mjs [pfad-zur-csv]
//
// Liest die abgeleitete Tabelle unter _werkstatt/ausbau/daten/kba/ (ohne Argument) und schreibt
// content/fahrzeugkatalog.json. Aufgenommen werden alle benannten Modellreihen (benannt = 1).
// Gleiche Reihen aus mehreren Segmenten werden zu einer Zeile zusammengeführt; die Bestände
// werden addiert, sodass die Abdeckung unverändert bleibt. Die 49 gepflegten Modelle aus
// content/vehicles.json bekommen ihren Verweis bestandsModell an der passenden KBA-Reihe; ohne
// Gegenstück bleibt die Bestandszeile erhalten. Nicht benannte Zeilen (SONSTIGE und die
// Gesamtzeile) sind keine Reihen und fehlen. Danach gibt das Skript die Abdeckung aus.
// Die Rohdaten bleiben außerhalb des Repositorys (G13). Ohne neue Bibliothek: das CSV-Lesen steht hier.

import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** Abgeleitete KBA-Tabelle; die Rohdatei fz12_2026.xlsx liegt daneben (SHA-256 in QUELLEN.md). */
export const STANDARD_CSV = path.join(WURZEL, '_werkstatt/ausbau/daten/kba/fz12_2026_modellreihen_abgeleitet.csv');
const BESTAND_DATEI = path.join(WURZEL, 'content/vehicles.json');
const ZIEL_DATEI = path.join(WURZEL, 'content/fahrzeugkatalog.json');

/** Gesamtbestand an Pkw am 1.1.2026 laut KBA FZ 12 (QUELLEN.md). */
export const GESAMTBESTAND = 49486487;
/** Quellenvermerk je KBA-Zeile (QUELLEN.md, Lizenz). */
export const KBA_QUELLE = 'Quelle: Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0';
/** Herkunft der Bestandszeilen und der Baujahre aus content/vehicles.json. */
export const BESTAND_QUELLE = 'Bestand: content/vehicles.json';
/** Mindestanteil des Bestands, den der Katalog abdecken muss (Z-07). */
export const ZIEL_ABDECKUNG = 0.95;

const PFLICHTSPALTEN = ['rang_2026_benannt', 'segment', 'marke_abgeleitet', 'modellreihe_kba', 'anzahl_1_1_2026', 'benannt'];

/**
 * Aliasliste: Anzeigename je Marke der KBA-Datei. Eine Marke, die hier fehlt, bricht den Lauf ab,
 * statt einen Namen zu raten (R4).
 */
export const MARKEN = {
  'ALFA ROMEO': 'Alfa Romeo',
  ALPINE: 'Alpine',
  'ASTON MARTIN': 'Aston Martin',
  AUDI: 'Audi',
  AUSTIN: 'Austin',
  BENTLEY: 'Bentley',
  BMW: 'BMW',
  BYD: 'BYD',
  CADILLAC: 'Cadillac',
  CHEVROLET: 'Chevrolet',
  CHRYSLER: 'Chrysler',
  CITROEN: 'Citroën',
  DACIA: 'Dacia',
  DAIHATSU: 'Daihatsu',
  DODGE: 'Dodge',
  DS: 'DS',
  FERRARI: 'Ferrari',
  FIAT: 'Fiat',
  FORD: 'Ford',
  GWM: 'GWM',
  HONDA: 'Honda',
  HUMMER: 'Hummer',
  HYUNDAI: 'Hyundai',
  INEOS: 'INEOS',
  INFINITI: 'Infiniti',
  IVECO: 'Iveco',
  JAGUAR: 'Jaguar',
  JEEP: 'Jeep',
  KGM: 'KGM',
  KIA: 'Kia',
  LADA: 'Lada',
  LAMBORGHINI: 'Lamborghini',
  LANCIA: 'Lancia',
  'LAND ROVER': 'Land Rover',
  LEAPMOTOR: 'Leapmotor',
  LEXUS: 'Lexus',
  LOTUS: 'Lotus',
  LYNK: 'Lynk & Co',
  MAN: 'MAN',
  MASERATI: 'Maserati',
  MAZDA: 'Mazda',
  MERCEDES: 'Mercedes-Benz',
  MG: 'MG',
  MINI: 'MINI',
  MITSUBISHI: 'Mitsubishi',
  MORGAN: 'Morgan',
  NISSAN: 'Nissan',
  OPEL: 'Opel',
  PEUGEOT: 'Peugeot',
  POLESTAR: 'Polestar',
  PORSCHE: 'Porsche',
  RENAULT: 'Renault',
  SAAB: 'Saab',
  SEAT: 'SEAT',
  SKODA: 'Škoda',
  SMART: 'Smart',
  SSANGYONG: 'KGM',
  SUBARU: 'Subaru',
  SUZUKI: 'Suzuki',
  TESLA: 'Tesla',
  TOYOTA: 'Toyota',
  VOLVO: 'Volvo',
  VW: 'Volkswagen',
  XPENG: 'XPeng',
};

/** Schreibweisen einzelner Reihen, die die Wortregel nicht trifft. Schlüssel „Marke|Reihe“ wie in der KBA-Datei. */
const SONDERSCHREIBWEISE = {
  'BMW|1ER': '1er',
  'BMW|2ER': '2er',
  'BMW|3ER': '3er',
  'BMW|4ER': '4er',
  'BMW|5ER': '5er',
  'BMW|6ER': '6er',
  'BMW|7ER': '7er',
  'BMW|8ER': '8er',
  'BMW|I3': 'i3',
  'BMW|I8': 'i8',
  'BMW|IX': 'iX',
  'HYUNDAI|I 10': 'i10',
  'HYUNDAI|I 20': 'i20',
  'HYUNDAI|I 30': 'i30',
  'HYUNDAI|I 40': 'i40',
  'HYUNDAI|IX 20': 'ix20',
  'HYUNDAI|IX 35': 'ix35',
  'HYUNDAI|IX 55': 'ix55',
  'HYUNDAI|IONIQ5': 'Ioniq 5',
  'HYUNDAI|IONIQ6': 'Ioniq 6',
  'HYUNDAI|SANTA FE': 'Santa Fe',
  'HONDA|E': 'e',
  'TOYOTA|IQ': 'iQ',
  'TOYOTA|RAV 4': 'RAV4',
};

/** Weitere Namen, unter denen KBA dieselbe Marke im Reihennamen führt (Umbenennung SSANGYONG in KGM). */
const ZUSATZPRAEFIXE = { KGM: ['SSANGYONG'] };
/** Markenteile, die KBA am Anfang des Reihennamens wiederholt („ALFA ROMEO ALFA MITO“, „LYNK & CO 01“). */
const WIEDERHOLT = { 'ALFA ROMEO': ['ALFA'], LYNK: ['& CO'] };
/** Dreibuchstabige Wörter, die im Handel groß stehen. Alle anderen Dreibuchstaben folgen der Titelschreibung. */
const KUERZEL3 = new Set(['AMG', 'ASX', 'BRZ', 'CLA', 'CLE', 'CLK', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'LBX', 'MGF', 'ORA', 'RCZ', 'SLC', 'SLK', 'SLS', 'TGE', 'WEY']);
/** Zweibuchstabige Wörter, die im Handel als Wort stehen. Alle anderen Zweibuchstaben bleiben groß (GT, LT, TT, CX). */
const WORT2 = new Set(['KA', 'UP']);

/** Titelschreibung eines Wortes: erster Buchstabe groß, Rest klein. */
function titel(wort) {
  return wort.charAt(0).toLocaleUpperCase('de') + wort.slice(1).toLocaleLowerCase('de');
}

/** Ein Wort aus Buchstaben und Ziffern in der Schreibweise des Handels. */
function formatiereWort(wort) {
  if (/\p{N}/u.test(wort)) return wort.toLocaleUpperCase('de');
  if (WORT2.has(wort.toUpperCase())) return titel(wort);
  if (wort.length <= 2) return wort.toLocaleUpperCase('de');
  if (wort.length === 3 && KUERZEL3.has(wort.toUpperCase())) return wort.toLocaleUpperCase('de');
  return titel(wort);
}

/** Anzeigename einer Marke aus der KBA-Datei. Unbekannte Marken brechen ab. */
export function markeAnzeige(kbaMarke) {
  if (!Object.hasOwn(MARKEN, kbaMarke)) throw new Error(`Marke „${kbaMarke}“ fehlt in der Aliasliste (MARKEN)`);
  return MARKEN[kbaMarke];
}

/** Reihenname in Titelschreibung, etwa „GOLF, JETTA“ wird „Golf, Jetta“. */
export function reiheAnzeige(kbaMarke, rest) {
  const sonderKey = `${kbaMarke}|${rest}`;
  if (Object.hasOwn(SONDERSCHREIBWEISE, sonderKey)) return SONDERSCHREIBWEISE[sonderKey];
  return rest.replace(/[\p{L}\p{N}]+/gu, formatiereWort);
}

/** Reihenname ohne Markenteil, wie er in der KBA-Datei steht; leer, wenn die Zeile nur die Marke trägt. */
export function reihenNameRoh(kbaMarke, modellreihe) {
  if (modellreihe === kbaMarke) return '';
  const praefixe = [kbaMarke, ...(Object.hasOwn(ZUSATZPRAEFIXE, kbaMarke) ? ZUSATZPRAEFIXE[kbaMarke] : [])];
  const praefix = praefixe.find((p) => modellreihe.startsWith(`${p} `));
  if (praefix === undefined) throw new Error(`Modellreihe „${modellreihe}“ beginnt nicht mit der Marke „${kbaMarke}“`);
  let rest = modellreihe.slice(praefix.length + 1);
  for (const wort of Object.hasOwn(WIEDERHOLT, kbaMarke) ? WIEDERHOLT[kbaMarke] : []) {
    if (rest.startsWith(`${wort} `)) rest = rest.slice(wort.length + 1);
  }
  return rest;
}

/** Kennung wie reiheKennung in src/lib/fahrzeuge/katalog.ts (dort im Test geprüft). */
export function kennung(marke, reihe) {
  return `${marke} ${reihe}`
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Vergleichsschlüssel für Namen: ohne Akzente, Groß- und Kleinschreibung, Zeichen und Leerzeichen. */
export function schluessel(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

/** CSV nach RFC 4180: Anführungszeichen, Kommas in Feldern, CRLF oder LF. */
export function parseCsv(text) {
  const zeilen = [];
  let zeile = [];
  let feld = '';
  let inAnfuehrung = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inAnfuehrung) {
      if (c !== '"') feld += c;
      else if (text[i + 1] === '"') {
        feld += '"';
        i += 1;
      } else inAnfuehrung = false;
    } else if (c === '"') inAnfuehrung = true;
    else if (c === ',') {
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
  return zeilen;
}

function ganzzahl(text, feld, nummer) {
  if (!/^\d+$/.test(text ?? '')) throw new Error(`KBA-Datei, Zeile ${nummer}: „${feld}“ ist keine ganze Zahl („${text ?? ''}“)`);
  return Number(text);
}

/** Zeilen der KBA-Tabelle als Objekte; prüft Kopf, Felderzahl und Werte. */
function leseZeilen(text) {
  const tabelle = parseCsv(text.replace(/^﻿/, '')).filter((werte) => !(werte.length === 1 && werte[0] === ''));
  const [kopf, ...daten] = tabelle;
  if (!kopf) throw new Error('KBA-Datei ist leer');
  for (const spalte of PFLICHTSPALTEN) {
    if (!kopf.includes(spalte)) throw new Error(`KBA-Datei ohne Spalte „${spalte}“`);
  }
  return daten.map((werte, n) => {
    const nummer = n + 2;
    if (werte.length !== kopf.length) throw new Error(`KBA-Datei, Zeile ${nummer}: ${werte.length} statt ${kopf.length} Felder`);
    const feld = Object.fromEntries(kopf.map((name, i) => [name, werte[i]]));
    if (feld.benannt !== '0' && feld.benannt !== '1') throw new Error(`KBA-Datei, Zeile ${nummer}: „benannt“ ist weder 0 noch 1`);
    const benannt = feld.benannt === '1';
    return {
      nummer,
      segment: feld.segment,
      marke: feld.marke_abgeleitet,
      modellreihe: feld.modellreihe_kba,
      anzahl: ganzzahl(feld.anzahl_1_1_2026, 'anzahl_1_1_2026', nummer),
      rang: benannt ? ganzzahl(feld.rang_2026_benannt, 'rang_2026_benannt', nummer) : undefined,
      benannt,
    };
  });
}

/** Abdeckung nach Z-07: Summe der Bestände der Katalogzeilen an dem Gesamtbestand. */
export function abdeckung(reihen, gesamt = GESAMTBESTAND) {
  const summe = reihen.reduce((s, r) => s + (r.bestand ?? 0), 0);
  return { summe, gesamt, anteil: summe / gesamt };
}

/** Eine Katalogzeile in fester Feldreihenfolge; fehlende Angaben entfallen ganz. */
function zeile({ id, marke, reihe, kba, segment, bestand, rang, quelle, bestandsModell, baujahr, alias = [] }) {
  return {
    id,
    marke,
    reihe,
    ...(kba !== undefined ? { kbaName: kba } : {}),
    ...(segment !== undefined ? { segment } : {}),
    ...(bestand !== undefined ? { bestand } : {}),
    ...(rang !== undefined ? { rang } : {}),
    quelle,
    ...(bestandsModell !== undefined ? { bestandsModell } : {}),
    ...(baujahr !== undefined ? { baujahrVon: baujahr, baujahrQuelle: BESTAND_QUELLE } : {}),
    klonbar: 'unbekannt',
    gehaeuse: 'unbekannt',
    leistungen: [],
    ...(alias.length > 0 ? { alias } : {}),
    sichtbar: true,
  };
}

/**
 * Baut die Katalogzeilen aus dem CSV-Text und dem Bestand (Form von content/vehicles.json).
 * Reine Funktion: schreibt nichts.
 */
export function baueKatalog({ csv, bestand, quelle = KBA_QUELLE }) {
  const zeilen = leseZeilen(csv);
  const benannte = zeilen.filter((z) => z.benannt);

  // 1. Benannte Reihen je Kennung zusammenführen (gleiche Reihe in mehreren Segmenten).
  const gruppen = new Map();
  for (const z of benannte) {
    const marke = markeAnzeige(z.marke);
    const rest = reihenNameRoh(z.marke, z.modellreihe);
    const reihe = rest === '' ? marke : reiheAnzeige(z.marke, rest);
    const id = kennung(marke, reihe);
    if (!gruppen.has(id)) gruppen.set(id, { id, marke, reihe, kbaNamen: [], segmente: [], bestand: 0, rang: Infinity });
    const g = gruppen.get(id);
    if (!g.kbaNamen.includes(z.modellreihe)) g.kbaNamen.push(z.modellreihe);
    if (!g.segmente.includes(z.segment)) g.segmente.push(z.segment);
    g.bestand += z.anzahl;
    g.rang = Math.min(g.rang, z.rang);
  }

  // 2. Die gepflegten Modelle des Bestands an ihrer KBA-Reihe verknüpfen.
  const modelle = bestand.flatMap((marke) =>
    marke.models.map((modell) => ({
      marke: marke.name,
      name: modell.name,
      bestandsModell: `${marke.slug}/${modell.slug}`,
      baujahrVon: typeof modell.yearFrom === 'number' ? modell.yearFrom : undefined,
    })),
  );
  const verknuepft = new Map();
  const ohneKba = [];
  for (const m of modelle) {
    const passend = [...gruppen.values()].filter(
      (g) => g.marke === m.marke && schluessel(g.reihe.split(', ')[0]) === schluessel(m.name),
    );
    if (passend.length > 1) {
      throw new Error(`Bestandsmodell „${m.marke} ${m.name}“ passt auf mehrere KBA-Reihen: ${passend.map((g) => g.id).join(', ')}`);
    }
    if (passend.length === 0) {
      ohneKba.push(m);
      continue;
    }
    const [g] = passend;
    if (verknuepft.has(g.id)) throw new Error(`KBA-Reihe „${g.id}“ passt auf zwei Bestandsmodelle`);
    verknuepft.set(g.id, m);
  }

  // 3. Katalogzeilen bilden.
  const reihen = [];
  for (const g of gruppen.values()) {
    const kba = g.kbaNamen.join(' / ');
    const segment = g.segmente.join(' / ');
    const m = verknuepft.get(g.id);
    if (m) {
      const alias = g.reihe.split(', ').filter((teil) => schluessel(teil) !== schluessel(m.name));
      reihen.push(
        zeile({
          id: kennung(m.marke, m.name),
          marke: g.marke,
          reihe: m.name,
          kba,
          segment,
          bestand: g.bestand,
          rang: g.rang,
          quelle,
          bestandsModell: m.bestandsModell,
          baujahr: m.baujahrVon,
          alias,
        }),
      );
    } else {
      reihen.push(zeile({ id: g.id, marke: g.marke, reihe: g.reihe, kba, segment, bestand: g.bestand, rang: g.rang, quelle }));
    }
  }
  for (const m of ohneKba) {
    reihen.push(
      zeile({
        id: kennung(m.marke, m.name),
        marke: m.marke,
        reihe: m.name,
        quelle: BESTAND_QUELLE,
        bestandsModell: m.bestandsModell,
        baujahr: m.baujahrVon,
      }),
    );
  }

  const ids = new Set();
  for (const r of reihen) {
    if (ids.has(r.id)) throw new Error(`Kennung doppelt vergeben: ${r.id}`);
    ids.add(r.id);
  }

  const sortierer = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });
  reihen.sort(
    (a, b) =>
      sortierer.compare(a.marke, b.marke) || sortierer.compare(a.reihe, b.reihe) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );

  const summeAlle = zeilen.reduce((s, z) => s + z.anzahl, 0);
  const summeBenannt = benannte.reduce((s, z) => s + z.anzahl, 0);
  const kennzahlen = {
    zeilen: zeilen.length,
    benannt: benannte.length,
    nichtBenannt: zeilen.length - benannte.length,
    summeAlle,
    summeBenannt,
    reihenAusKba: gruppen.size,
    zusammengefuehrt: benannte.length - gruppen.size,
    bestandsmodelle: modelle.length,
    verknuepft: verknuepft.size,
    ohneKba: ohneKba.length,
    reihen: reihen.length,
  };
  return { reihen, kennzahlen };
}

function schreibeAtomar(datei, inhalt) {
  const tmp = `${datei}.tmp-${process.pid}`;
  writeFileSync(tmp, inhalt, 'utf8');
  renameSync(tmp, datei);
}

const zahl = new Intl.NumberFormat('de-DE');
const prozent = (anteil) => `${(anteil * 100).toFixed(2).replace('.', ',')} %`;

function main(argumente) {
  const csvDatei = argumente[0] ? path.resolve(argumente[0]) : STANDARD_CSV;
  const csv = readFileSync(csvDatei, 'utf8');
  const bestand = JSON.parse(readFileSync(BESTAND_DATEI, 'utf8'));
  const { reihen, kennzahlen: k } = baueKatalog({ csv, bestand });
  if (k.summeAlle !== GESAMTBESTAND) {
    throw new Error(`Summe aller KBA-Zeilen (${zahl.format(k.summeAlle)}) weicht vom Gesamtbestand (${zahl.format(GESAMTBESTAND)}) ab`);
  }
  const ab = abdeckung(reihen);
  if (ab.anteil < ZIEL_ABDECKUNG) throw new Error(`Abdeckung ${prozent(ab.anteil)} liegt unter dem Ziel ${prozent(ZIEL_ABDECKUNG)}`);

  const inhalt = `${JSON.stringify(reihen, null, 2)}\n`;
  schreibeAtomar(ZIEL_DATEI, inhalt);

  console.log(`KBA-Zeilen: ${k.zeilen}, benannt: ${k.benannt}, nicht benannt (SONSTIGE und Gesamtzeile): ${k.nichtBenannt}`);
  console.log(`Summe aller Zeilen: ${zahl.format(k.summeAlle)}, davon benannt: ${zahl.format(k.summeBenannt)}`);
  console.log(`Reihen aus KBA: ${k.reihenAusKba}, davon ${k.zusammengefuehrt} KBA-Zeilen zusammengeführt`);
  console.log(`Bestandsmodelle verknüpft: ${k.verknuepft} von ${k.bestandsmodelle}, ohne KBA-Gegenstück: ${k.ohneKba}`);
  console.log(`Katalogzeilen: ${reihen.length}, Größe: ${(Buffer.byteLength(inhalt) / 1024).toFixed(1).replace('.', ',')} KB`);
  console.log(`Abdeckung: ${prozent(ab.anteil)} (${zahl.format(ab.summe)} von ${zahl.format(GESAMTBESTAND)} Pkw), Ziel ${prozent(ZIEL_ABDECKUNG)}`);
  console.log('20 größte Reihen nach Bestand:');
  [...reihen]
    .sort((a, b) => (b.bestand ?? 0) - (a.bestand ?? 0))
    .slice(0, 20)
    .forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.marke} ${r.reihe}: ${zahl.format(r.bestand ?? 0)} (Rang ${r.rang ?? '-'})`));
  console.log(`Geschrieben: ${ZIEL_DATEI}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2));
}
