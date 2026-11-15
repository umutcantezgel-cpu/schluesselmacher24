#!/usr/bin/env node
// Fahrzeugkatalog um die KBA-Statistik FZ 2, Stand 1.1.2026, erweitern (FA-KERN-01, A-047).
//
//   node scripts/fahrzeuge-import-fz2.mjs [pfad-zur-xlsx] [--trocken] [--liste]
//
// Liest die Rohdatei _werkstatt/ausbau/daten/kba/fz2_2026.xlsx (nicht im Repository, G13) mit Bordmitteln
// von Node: Die xlsx-Datei ist ein Zip-Archiv mit XML, entpackt wird mit node:zlib, gelesen mit einfachen
// Mustern. Keine neue Bibliothek (G7).
//
//   1. Krafträder (Blatt FZ 2.6): jede benannte Kombination aus Hersteller und Handelsname wird eine Zeile
//      der Klasse „kraftrad“. Bestände je Handelsname über Typschlüssel und Länder summiert (Spalte
//      Deutschland). Sammelzeilen („SONSTIGE/NICHT GETYPT“, „ZUSAMMEN“, „SONSTIGE HERSTELLER“) und Zeilen
//      ohne Handelsnamen sind keine Modelle.
//   2. Seltene Automarken und fehlende Handelsnamen (Blatt FZ 2.2): Marken, die der Katalog aus FZ 12 nicht
//      führt, kommen mit ihren Handelsnamen dazu; bei Marken aus FZ 12 nur Handelsnamen, die keiner Reihe
//      entsprechen (Regel in `entsprichtReihe`). Wohnmobil-Aufbauten zählen nicht als Modell.
//
// Der Anzeigename einer Marke entsteht nach einer festen Regel aus dem KBA-Namen (`herstellerAnzeige`).
// Ein Name, den die Regel nicht sicher bilden kann, bricht den Lauf ab, statt zu raten (R4).
// Zeilen aus FZ 2 sind auffindbar, aber nicht buchbar: leistungen [], klonbar und gehaeuse „unbekannt“.
// Der Lauf ist wiederholbar: Zeilen einer früheren FZ-2-Übernahme werden neu gebildet, die FZ-12-Zeilen bleiben,
// wie sie sind. Gepflegte Felder einer FZ-2-Zeile (GEPFLEGTE_FELDER: Generationen, Verweise, Transponder,
// Sichtbarkeit) gehen je Kennung auf die neue Zeile über. Fiele eine Zeile mit gepflegten Feldern weg, weil
// ihre Kennung nicht mehr entsteht, bricht der Lauf ab und nennt sie, statt sie still zu verlieren.
//
// Reihenfolge der Importe: scripts/fahrzeuge-import.mjs (FZ 12) behält Zeilen aus FZ 2 und Generationen; nach
// einem FZ-12-Lauf diesen Lauf wiederholen, damit der Abgleich mit dem neuen FZ-12-Stand stimmt.

import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateRawSync } from 'node:zlib';

import { kennung, schluessel } from './fahrzeuge-import.mjs';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const STANDARD_XLSX = path.join(WURZEL, '_werkstatt/ausbau/daten/kba/fz2_2026.xlsx');
const ZIEL_DATEI = path.join(WURZEL, 'content/fahrzeugkatalog.json');

/** Quellenvermerk je Zeile aus FZ 2, im Wortlaut des Blatts „Impressum“ (Nutzungsbedingungen). */
export const FZ2_QUELLE =
  'Quelle: Kraftfahrt-Bundesamt (KBA), FZ 2, Stand 1.1.2026, © Kraftfahrt-Bundesamt, Flensburg, Datenlizenz Deutschland - Namensnennung - Version 2.0';
/** Erkennt Zeilen einer früheren FZ-2-Übernahme. */
export const FZ2_PRAEFIX = 'Quelle: Kraftfahrt-Bundesamt (KBA), FZ 2,';

/* ---------- xlsx mit Bordmitteln ------------------------------------------ */

/** Dateien eines Zip-Archivs (nur „stored“ und „deflate“, kein Zip64). */
export function entpackeZip(puffer) {
  let ende = -1;
  for (let i = puffer.length - 22; i >= Math.max(0, puffer.length - 22 - 65535); i -= 1) {
    if (puffer.readUInt32LE(i) === 0x06054b50) {
      ende = i;
      break;
    }
  }
  if (ende < 0) throw new Error('Keine Zip-Datei: Verzeichnisende fehlt');
  const anzahl = puffer.readUInt16LE(ende + 10);
  let pos = puffer.readUInt32LE(ende + 16);
  const dateien = new Map();
  for (let n = 0; n < anzahl; n += 1) {
    if (puffer.readUInt32LE(pos) !== 0x02014b50) throw new Error('Zip-Verzeichnis beschädigt');
    const methode = puffer.readUInt16LE(pos + 10);
    // Komprimierte Größe aus dem Verzeichnis: Die lokalen Köpfe können sie mit Bit 3 offen lassen.
    const groesse = puffer.readUInt32LE(pos + 20);
    const nameLaenge = puffer.readUInt16LE(pos + 28);
    const extraLaenge = puffer.readUInt16LE(pos + 30);
    const kommentarLaenge = puffer.readUInt16LE(pos + 32);
    const lokal = puffer.readUInt32LE(pos + 42);
    const name = puffer.toString('utf8', pos + 46, pos + 46 + nameLaenge);
    pos += 46 + nameLaenge + extraLaenge + kommentarLaenge;
    if (puffer.readUInt32LE(lokal) !== 0x04034b50) throw new Error(`Zip-Eintrag „${name}“ beschädigt`);
    const start = lokal + 30 + puffer.readUInt16LE(lokal + 26) + puffer.readUInt16LE(lokal + 28);
    dateien.set(name, { methode, start, ende: start + groesse });
  }
  return {
    namen: () => [...dateien.keys()],
    text(name) {
      const eintrag = dateien.get(name);
      if (!eintrag) throw new Error(`Zip ohne „${name}“`);
      const daten = puffer.subarray(eintrag.start, eintrag.ende);
      if (eintrag.methode === 0) return daten.toString('utf8');
      if (eintrag.methode === 8) return inflateRawSync(daten).toString('utf8');
      throw new Error(`Zip-Eintrag „${name}“: Methode ${eintrag.methode} nicht unterstützt`);
    },
  };
}

/** XML-Text ohne Entitäten und ohne Excel-Maskierung „_x000D_“. */
export function xmlText(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/_x([0-9A-F]{4})_/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** Text eines `<si>` oder `<is>`: alle `<t>` außer der Lautschrift `<rPh>`. */
function zellText(xml) {
  const ohneLautschrift = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '');
  return [...ohneLautschrift.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>|<t\b[^>]*\/>/g)].map((m) => xmlText(m[1] ?? '')).join('');
}

/**
 * Liest die Blätter einer xlsx-Datei: je Blatt eine Liste von Zeilen, jede Zeile ein Objekt Spalte → Text
 * („B“ → „APRILIA (I)“). Leere Zellen fehlen; eine Zelle mit leerem Text steht als ''.
 */
export function leseXlsx(puffer, nurBlaetter) {
  const zip = entpackeZip(puffer);
  const geteilt = zip.namen().includes('xl/sharedStrings.xml')
    ? [...zip.text('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => zellText(m[1]))
    : [];
  const mappe = zip.text('xl/workbook.xml');
  const bezuege = zip.text('xl/_rels/workbook.xml.rels');
  const ziel = new Map();
  for (const m of bezuege.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const id = /\bId="([^"]+)"/.exec(m[1])?.[1];
    const pfad = /\bTarget="([^"]+)"/.exec(m[1])?.[1];
    if (id && pfad) ziel.set(id, pfad.startsWith('/') ? pfad.slice(1) : `xl/${pfad}`);
  }
  /** @type {Record<string, Array<Record<string, string>>>} */
  const blaetter = {};
  for (const m of mappe.matchAll(/<sheet\b([^>]*)\/>/g)) {
    const name = xmlText(/\bname="([^"]+)"/.exec(m[1])?.[1] ?? '');
    const rid = /\br:id="([^"]+)"/.exec(m[1])?.[1];
    if (nurBlaetter && !nurBlaetter.includes(name)) continue;
    const datei = ziel.get(rid);
    if (!datei) throw new Error(`Blatt „${name}“ ohne Datei`);
    const xml = zip.text(datei);
    const zeilen = [];
    for (const z of xml.matchAll(/<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
      const zeile = {};
      for (const c of (z[1] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const spalte = /\br="([A-Z]+)\d+"/.exec(c[1])?.[1];
        if (!spalte) continue;
        const typ = /\bt="([^"]+)"/.exec(c[1])?.[1];
        const innen = c[2] ?? '';
        const wert = /<v>([\s\S]*?)<\/v>/.exec(innen)?.[1];
        if (typ === 's' && wert !== undefined) zeile[spalte] = geteilt[Number(wert)] ?? '';
        else if (typ === 'inlineStr') zeile[spalte] = zellText(/<is>([\s\S]*?)<\/is>/.exec(innen)?.[1] ?? '');
        else if (wert !== undefined) zeile[spalte] = xmlText(wert);
      }
      zeilen.push(zeile);
    }
    blaetter[name] = zeilen;
  }
  return blaetter;
}

/* ---------- Tabellen FZ 2.2 und FZ 2.6 ---------------------------------- */

const kopf = (text) => (text ?? '').replace(/\s+/g, ' ').replace(/- /g, '-').trim();

/** Bestandszahl einer Zelle: „-“ heißt nichts vorhanden. Alles andere als ganze Zahlen bricht ab. */
function zahl(text, ort) {
  const t = (text ?? '').trim();
  if (t === '-' || t === '') return 0;
  if (!/^\d+$/.test(t)) throw new Error(`${ort}: „${t}“ ist keine Bestandszahl`);
  return Number(t);
}

/** Sammelzeilen der KBA-Tabellen, die kein Modell sind. */
export function istSammelzeile(handelsname) {
  const t = handelsname.trim().toUpperCase();
  return t === 'ZUSAMMEN' || /^(SONSTIGE|NICHT GETYPT)\b/.test(t);
}

/**
 * Liest ein Blatt „nach Herstellern und Handelsnamen“. `spalten` nennt die Kopftexte der Wertspalten.
 * Gibt je Typschlüsselzeile Hersteller, Handelsname und Werte zurück, dazu die Prüfsummen des KBA.
 */
export function leseHandelsnamen(zeilen, blatt, spalten) {
  const kopfIndex = zeilen.findIndex((z) => kopf(z.B) === 'Hersteller' && kopf(z.C) === 'Handelsname' && kopf(z.D) === 'Typ-Schl.-Nr.');
  if (kopfIndex < 0) throw new Error(`${blatt}: Kopfzeile „Hersteller, Handelsname, Typ-Schl.-Nr.“ fehlt`);
  const spalteVon = {};
  for (const [schluesselName, text] of Object.entries(spalten)) {
    const fund = [zeilen[kopfIndex], zeilen[kopfIndex + 1] ?? {}].flatMap((z) => Object.entries(z)).find(([, wert]) => kopf(wert) === text);
    if (!fund) throw new Error(`${blatt}: Spalte „${text}“ fehlt im Kopf`);
    spalteVon[schluesselName] = fund[0];
  }
  /** @type {Array<{ zeile: number, hersteller: string, handelsname: string, typ: string, [wert: string]: any }>} */
  const typen = [];
  const summen = new Map();
  let hersteller = null;
  let handelsname = null;
  let sonstigeHersteller = null;
  let insgesamt = null;
  for (let i = kopfIndex + 1; i < zeilen.length; i += 1) {
    const z = zeilen[i];
    const ort = `${blatt}, Zeile ${i + 1}`;
    const werte = () => Object.fromEntries(Object.entries(spalteVon).map(([n, s]) => [n, zahl(z[s], ort)]));
    if (z.B !== undefined && z.B.trim() !== '') {
      const b = z.B.trim();
      if (b === 'INSGESAMT') {
        insgesamt = werte();
        break;
      }
      if (b === 'SONSTIGE HERSTELLER') {
        sonstigeHersteller = werte();
        continue;
      }
      hersteller = b;
      handelsname = null;
    }
    if (z.C !== undefined) handelsname = z.C.trim();
    if (hersteller === null) continue; // zweite Kopfzeile
    if (handelsname === 'ZUSAMMEN') {
      summen.set(hersteller, werte());
      continue;
    }
    if (handelsname === null) throw new Error(`${ort}: Zeile ohne Handelsname`);
    if (z.D === undefined && !Object.values(spalteVon).some((s) => z[s] !== undefined)) continue;
    typen.push({ zeile: i + 1, hersteller, handelsname, typ: (z.D ?? '').trim(), ...werte() });
  }
  if (!insgesamt) throw new Error(`${blatt}: Zeile „INSGESAMT“ fehlt`);

  // Prüfsummen: jede Herstellersumme und die Gesamtsumme müssen aufgehen, sonst ist das Blatt falsch gelesen.
  const haupt = Object.keys(spalten)[0];
  const jeHersteller = new Map();
  for (const t of typen) jeHersteller.set(t.hersteller, (jeHersteller.get(t.hersteller) ?? 0) + t[haupt]);
  for (const [h, summe] of jeHersteller) {
    const soll = summen.get(h)?.[haupt];
    if (soll === undefined) throw new Error(`${blatt}: Hersteller „${h}“ ohne Zeile ZUSAMMEN`);
    if (soll !== summe) throw new Error(`${blatt}: Summe für „${h}“ ist ${summe}, KBA nennt ${soll}`);
  }
  const alle = [...summen.values()].reduce((s, w) => s + w[haupt], 0) + (sonstigeHersteller?.[haupt] ?? 0);
  if (alle !== insgesamt[haupt]) throw new Error(`${blatt}: Summe aller Hersteller ${alle}, KBA nennt ${insgesamt[haupt]}`);
  return { typen, summen, sonstigeHersteller, insgesamt };
}

/* ---------- Anzeigenamen -------------------------------------------------- */

/**
 * Sonderfälle der Herstellernamen: Abkürzungen, Kurzwörter und zusammengezogene Schreibweisen, die die
 * Regel nicht sicher bilden kann. Schlüssel ist der KBA-Name ohne Länderkürzel.
 */
export const HERSTELLER_ALIAS = {
  BMW: 'BMW',
  KTM: 'KTM',
  KSR: 'KSR',
  NIU: 'NIU',
  SFM: 'SFM',
  SWM: 'SWM',
  'MV AGUSTA': 'MV Agusta',
  'MZ MOTORENWERKE': 'MZ Motorenwerke',
  'MOTO-GUZZI': 'Moto Guzzi',
  'SKY TEAM': 'Sky Team',
  'HER CHEE': 'Her Chee',
  'VESPA-RSM': 'Vespa-RSM',
  'AUTOMOB-EISENACH-AWE': 'AWE Eisenach',
  'HEINKEL,STUTTGART': 'Heinkel',
  'NUERNB.HERCULESWERKE': 'Hercules',
  'TAIW.GOLDEN BEE': 'Taiwan Golden Bee',
  'ZUENDAPP-WERKE': 'Zündapp',
  'JINAN QINGQI KR': 'Jinan Qingqi KR',
  'ZHEJIANG CFMOTO': 'Zhejiang CFMOTO',
  // Gleicher Hersteller mit Werks- oder Ländervermerk im Namen: eine Marke in der Suche.
  'HONDA MOTOR': 'Honda',
  'SUZUKI INDOMOBIL': 'Suzuki',
  'MONTESA HONDA': 'Montesa Honda',
  'FCA': 'FCA',
  'AUDI': 'Audi',
};

/** KBA-Name ohne Länderkürzel in Klammern am Ende, etwa „APRILIA (I)“ → „APRILIA“. */
export function ohneLaenderkuerzel(name) {
  return name.replace(/\s*\([A-Z/, ]+\)\s*$/, '').trim();
}

/**
 * Anzeigename eines Herstellers aus dem KBA-Namen. Regel: Länderkürzel entfernen; Sonderfälle aus
 * HERSTELLER_ALIAS; sonst nur Buchstaben, Leerzeichen und Bindestriche, jedes Wort mit mindestens vier
 * Buchstaben, Großschreibung normalisiert („HARLEY-DAVIDSON“ → „Harley-Davidson“). Kürzere Wörter können
 * Abkürzungen sein und brechen ohne Eintrag in der Aliasliste ab, ebenso Punkte, Kommas und Ziffern (R4).
 */
export function herstellerAnzeige(kbaName) {
  const kern = ohneLaenderkuerzel(kbaName);
  if (Object.hasOwn(HERSTELLER_ALIAS, kern)) return HERSTELLER_ALIAS[kern];
  if (!/^[A-Z]+(?:[ -][A-Z]+)*$/.test(kern)) {
    throw new Error(`Hersteller „${kbaName}“: Zeichen, die die Regel nicht sicher deutet; bitte in HERSTELLER_ALIAS eintragen`);
  }
  const woerter = kern.split(/[ -]/);
  const kurz = woerter.find((w) => w.length < 4);
  if (kurz) throw new Error(`Hersteller „${kbaName}“: Kurzwort „${kurz}“ kann eine Abkürzung sein; bitte in HERSTELLER_ALIAS eintragen`);
  return kern.toLowerCase().replace(/(^|[ -])(\p{L})/gu, (_, vor, b) => vor + b.toUpperCase());
}

/**
 * Wörter, die das KBA ohne Umlaut schreibt (Großschreibung, „AE“ für „Ä“), in der Schreibweise des Handels.
 * Nur ganze Wörter dieser Liste, keine allgemeine Regel: „BLUETEC“, „PHAETON“ oder „ZOE“ bleiben, wie sie sind.
 * Der Wortlaut des KBA steht weiter im Feld kbaName.
 */
export const UMLAUT_WOERTER = {
  KAEFER: 'Käfer',
  KAPITAEN: 'Kapitän',
  MILITAER: 'Militär',
  BEHOERDE: 'Behörde',
  GELAENDE: 'Gelände',
  GELAENDEWAGEN: 'Geländewagen',
};

/**
 * Schreibweise eines Handelsnamens: Teile durch „, “ getrennt; Wörter mit Ziffern und Kurzwörter bis drei
 * Buchstaben bleiben, wie das KBA sie schreibt; Wörter in Großbuchstaben ab vier Buchstaben in Titelschreibung,
 * Wörter aus UMLAUT_WOERTER mit Umlaut. Gemischte Schreibweise des KBA („Mojito 125“) bleibt unverändert.
 */
export function handelsnameAnzeige(text) {
  return text
    .split(/\s*[,;]\s*/)
    .filter(Boolean)
    .map((teil) =>
      teil
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\p{L}[\p{L}\p{N}'´]*/gu, (wort) => {
          if (Object.hasOwn(UMLAUT_WOERTER, wort.toUpperCase())) return UMLAUT_WOERTER[wort.toUpperCase()];
          if (/\p{N}/u.test(wort) || wort.length <= 3) return wort;
          if (wort !== wort.toUpperCase()) return wort;
          return wort.charAt(0) + wort.slice(1).toLowerCase();
        }),
    )
    .join(', ');
}

/* ---------- Krafträder ---------------------------------------------------- */

/** Das KBA kürzt Handelsnamen auf 25 Zeichen. */
export const KBA_NAMENSLAENGE = 25;

/**
 * Reihenname eines Kraftrads aus dem Handelsnamen: der erste Teil (Komma oder Semikolon) ohne den
 * vorangestellten Herstellernamen („KTM 125 DUKE“ → „125 Duke“, „BMW R1100 GS“ → „R1100 GS“); die
 * weiteren Teile werden Suchbegriffe. Ein auf 25 Zeichen gekürzter letzter Teil („…, R 120“) fällt weg.
 */
export function kraftradName(handelsname, kbaHersteller, marke) {
  let alle = teile(handelsname);
  if (handelsname.length === KBA_NAMENSLAENGE && alle.length > 1) alle = alle.slice(0, -1);
  const vorsilben = [ohneLaenderkuerzel(kbaHersteller), marke, ohneLaenderkuerzel(kbaHersteller).split(/[ -]/)[0]]
    .map((v) => v.toUpperCase())
    .sort((a, b) => b.length - a.length);
  const ohneMarke = (teil) => {
    const gross = teil.toUpperCase();
    const v = vorsilben.find((x) => gross.startsWith(`${x} `));
    return v ? teil.slice(v.length + 1).trim() : teil;
  };
  const namen = alle.map(ohneMarke).filter((n) => /\p{L}|\p{N}/u.test(n)).map(handelsnameAnzeige);
  return { reihe: namen[0] ?? '', weitere: namen.slice(1) };
}

/**
 * Katalogzeilen der Klasse „kraftrad“ aus Blatt FZ 2.6. Gleiche Reihennamen (`kraftradName`) eines Herstellers
 * werden über Groß- und Kleinschreibung und Zeichen hinweg zusammengeführt (`schluessel`), ebenso Hersteller,
 * die nach der Regel denselben Anzeigenamen tragen (HONDA (J), HONDA (I) …).
 */
export function kraftraeder(blatt, quelle = FZ2_QUELLE) {
  const { typen, insgesamt } = leseHandelsnamen(blatt, 'FZ 2.6', { anzahl: 'Deutschland' });
  const gruppen = new Map();
  /** @type {Record<string, any>} */
  const zaehler = { typzeilen: typen.length, sammel: 0, sammelBestand: 0, ohneName: 0, ohneNameBestand: 0, abgelehnt: [] };
  const herstellerNamen = new Map();
  for (const t of typen) {
    if (istSammelzeile(t.handelsname)) {
      zaehler.sammel += 1;
      zaehler.sammelBestand += t.anzahl;
      continue;
    }
    if (t.handelsname === '' || !/\p{L}|\p{N}/u.test(t.handelsname)) {
      zaehler.ohneName += 1;
      zaehler.ohneNameBestand += t.anzahl;
      continue;
    }
    const marke = herstellerAnzeige(t.hersteller);
    herstellerNamen.set(t.hersteller, marke);
    const { reihe, weitere } = kraftradName(t.handelsname, t.hersteller, marke);
    if (!reihe) {
      zaehler.ohneName += 1;
      zaehler.ohneNameBestand += t.anzahl;
      continue;
    }
    const k = `${marke}|${schluessel(reihe)}`;
    if (!gruppen.has(k)) gruppen.set(k, { marke, reihen: new Map(), weitere: new Set(), namen: new Set(), hersteller: new Set(), bestand: 0 });
    const g = gruppen.get(k);
    g.reihen.set(reihe, (g.reihen.get(reihe) ?? 0) + t.anzahl);
    for (const w of weitere) g.weitere.add(w);
    g.namen.add(t.handelsname);
    g.hersteller.add(t.hersteller);
    g.bestand += t.anzahl;
  }
  const reihen = [];
  for (const g of gruppen.values()) {
    // Schreibweise mit dem größten Bestand, bei Gleichstand die zuerst gelesene.
    const [[reihe]] = [...g.reihen.entries()].sort((a, b) => b[1] - a[1]);
    // Weitere Namen nur mit Buchstaben und ab drei Zeichen: „N“ oder „2“ aus „S 50 B 1,N,B 2“ sind Ausstattungen.
    const alias = [...g.weitere]
      .filter((w) => schluessel(w) !== schluessel(reihe) && schluessel(w).length >= 3 && /\p{L}/u.test(w))
      .slice(0, 6);
    reihen.push({
      id: `kraftrad-${kennung(g.marke, reihe)}`,
      klasse: 'kraftrad',
      marke: g.marke,
      reihe,
      kbaName: [...g.hersteller].join(' / ') + ': ' + [...g.namen].join(' / '),
      bestand: g.bestand,
      quelle,
      klonbar: 'unbekannt',
      gehaeuse: 'unbekannt',
      leistungen: [],
      ...(alias.length ? { alias } : {}),
      sichtbar: true,
    });
  }
  zaehler.hersteller = new Set(herstellerNamen.keys()).size;
  zaehler.marken = new Set(herstellerNamen.values()).size;
  zaehler.handelsnamen = reihen.length;
  zaehler.insgesamt = insgesamt.anzahl;
  zaehler.bestandBenannt = reihen.reduce((s, r) => s + r.bestand, 0);
  return { reihen, zaehler };
}

/* ---------- Pkw ----------------------------------------------------------- */

/**
 * Hersteller in FZ 2.2 → Marke. `null` heißt: Der Hersteller baut mehrere Marken; seine Handelsnamen
 * bekommen eine Marke nur über ein Markenwort im Namen (MARKENWORTE), sonst werden sie gelistet.
 * Ein Hersteller, der hier fehlt, bricht den Lauf ab (R4).
 */
export const PKW_HERSTELLER = {
  ALPINA: 'Alpina',
  'AMPERE (F)': null,
  'ASTON MARTIN (UK)': 'Aston Martin',
  'AUDI (D)': 'Audi',
  'AUDI (H)': 'Audi',
  'AUTOMOB-EISENACH-AWE': null,
  'BENTLEY (UK)': 'Bentley',
  BMW: 'BMW',
  'BYD AUTO (RC)': 'BYD',
  'CHEVROLET (USA)': null,
  'CHRYSLER (CDN)': 'Chrysler',
  'CITROEN (F)': 'Citroën',
  'DACIA (RO)': 'Dacia',
  'DAIHATSU (J)': 'Daihatsu',
  'DAIMLER (D)': 'Mercedes-Benz',
  'FCA (I)': null,
  'FCA (USA)': null,
  'FERRARI (I)': 'Ferrari',
  'FORD (D)': 'Ford',
  'FORD (IND)': 'Ford',
  'FORD (USA)': 'Ford',
  'GENERAL MOTORS (E)': null,
  'GENERAL MOTORS (USA)': null,
  'GREAT WALL MOTOR (RC)': null,
  'HONDA (RC)': 'Honda',
  'HONDA (UK)': 'Honda',
  'HONDA MOTOR (J)': 'Honda',
  'HYUNDAI (TR)': 'Hyundai',
  'HYUNDAI MOTOR (CZ)': 'Hyundai',
  'HYUNDAI MOTOR (IND)': 'Hyundai',
  'HYUNDAI MOTOR (ROK)': 'Hyundai',
  'IVECO (F/I)': null,
  'JAGUAR LAND ROVER (UK)': null,
  'KGM (ROK)': 'KGM',
  'KIA MOTORS (ROK)': 'Kia',
  'KIA MOTORS (SK)': 'Kia',
  LADA: 'Lada',
  'LAMBORGHINI (I)': 'Lamborghini',
  'LEAPMOTOR (RC)': 'Leapmotor',
  'LOTUS (UK)': 'Lotus',
  'MAGYAR SUZUKI (H)': null,
  'MAN TRUCK & BUS': null,
  'MARUTI (IND)': null,
  'MASERATI (I)': 'Maserati',
  'MAZDA (B/J/USA/RC)': 'Mazda',
  'MERCEDES-BENZ (E)': 'Mercedes-Benz',
  'MG ROVER (UK)': null,
  'MITSUBISHI (J)': 'Mitsubishi',
  'MITSUBISHI (NL)': 'Mitsubishi',
  'MITSUBISHI (THA)': 'Mitsubishi',
  'NETHERLANDS CAR (NL)': null,
  'NISSAN (CH)': 'Nissan',
  'NISSAN (F/NL)': 'Nissan',
  'NISSAN (J)': 'Nissan',
  'NISSAN AUTOMOTIVE (F)': 'Nissan',
  OPEL: 'Opel',
  'PEUGEOT (F)': 'Peugeot',
  'POLESTAR (S)': 'Polestar',
  PORSCHE: 'Porsche',
  'RENAULT (F)': 'Renault',
  'SAAB, -SCANIA (S)': 'Saab',
  SACHSENRING: null,
  'SAIC (RC)': null,
  'SANTANA (E)': null,
  'SEAT (E)': 'SEAT',
  'SKODA (CZ)': 'Škoda',
  'SMART (D)': 'Smart',
  'SMART (RC)': 'Smart',
  'STELLANTIS (F)': null,
  'STELLANTIS (I)': null,
  'SUBARU (J)': 'Subaru',
  'SUZUKI (J)': 'Suzuki',
  'SUZUKI (THA)': 'Suzuki',
  'TESLA (USA)': 'Tesla',
  'TOYOTA (J)': 'Toyota',
  'TOYOTA EUROPE (B)': 'Toyota',
  'VAZ-LADA (RUS)': 'Lada',
  'VOLKSWAGEN (D)': 'Volkswagen',
  'VOLVO (S)': 'Volvo',
};

/**
 * Markenworte am Anfang eines Handelsnamens (in Großbuchstaben verglichen, längere zuerst). Sie gehen dem
 * Hersteller vor: „CUPRA LEON“ unter SEAT (E) gehört zur Marke Cupra, „LEXUS NX300H“ unter TOYOTA zu Lexus.
 * Belegt sind sie durch die Handelsnamen der Datei selbst; ein Wort ohne Beleg steht hier nicht.
 */
export const MARKENWORTE = [
  ['BMW ALPINA', 'Alpina'],
  ['ALFA ROMEO', 'Alfa Romeo'],
  ['ALFA ROMEOGT', 'Alfa Romeo'],
  ['ALFA', 'Alfa Romeo'],
  ['ABARTH', 'Abarth'],
  ['CUPRA', 'Cupra'],
  ['FIAT', 'Fiat'],
  ['LANCIA', 'Lancia'],
  ['JEEP', 'Jeep'],
  ['DODGE', 'Dodge'],
  ['CHRYSLER', 'Chrysler'],
  ['CHEVROLET', 'Chevrolet'],
  ['DAEWOO', 'Daewoo'],
  ['CADILLAC', 'Cadillac'],
  ['HUMMER', 'Hummer'],
  ['LEXUS', 'Lexus'],
  ['INFINITI', 'Infiniti'],
  ['GENESIS', 'Genesis'],
  ['JAGUAR', 'Jaguar'],
  ['DAIMLER', 'Daimler'],
  ['LAND ROVER', 'Land Rover'],
  ['RANGE ROVER', 'Land Rover'],
  ['ROVER', 'Rover'],
  ['MG', 'MG'],
  ['MINI', 'MINI'],
  ['TRABANT', 'Trabant'],
  ['WARTBURG', 'Wartburg'],
  ['WEY', 'GWM'],
  ['ORA', 'GWM'],
  ['RENAULT', 'Renault'],
  ['SUZUKI', 'Suzuki'],
  ['SUBARU', 'Subaru'],
  ['MITSUBISHI', 'Mitsubishi'],
  ['VOLVO', 'Volvo'],
  ['LADA', 'Lada'],
  ['DS', 'DS'],
  ['PEUGEOT', 'Peugeot'],
  ['CITROEN', 'Citroën'],
  ['OPEL', 'Opel'],
  ['NISSAN', 'Nissan'],
  ['TOYOTA', 'Toyota'],
  ['DAIHATSU', 'Daihatsu'],
  ['HONDA', 'Honda'],
  ['HYUNDAI', 'Hyundai'],
  ['KIA', 'Kia'],
  ['MAZDA', 'Mazda'],
  ['SAAB', 'Saab'],
  ['SEAT', 'SEAT'],
  ['SKODA', 'Škoda'],
  ['VW', 'Volkswagen'],
  ['VOLKSWAGEN', 'Volkswagen'],
  ['AUDI', 'Audi'],
  ['MERCEDES-BENZ', 'Mercedes-Benz'],
  ['MERCEDES', 'Mercedes-Benz'],
  ['PORSCHE', 'Porsche'],
  ['FORD', 'Ford'],
  ['BENTLEY', 'Bentley'],
  ['FERRARI', 'Ferrari'],
  ['MASERATI', 'Maserati'],
  ['BYD', 'BYD'],
  ['SSANGYONG', 'KGM'],
  ['KG MOBILITY', 'KGM'],
  ['POLESTAR', 'Polestar'],
  ['SMART', 'Smart'],
  ['TESLA', 'Tesla'],
  ['BMW', 'BMW'],
].sort((a, b) => b[0].length - a[0].length);

/**
 * Handelsnamen ohne Markenwort, die ein Hersteller mehrerer Marken für eine bestimmte Marke führt, mit dem
 * Reihennamen in der Schreibweise des Handels. BMW führt in FZ 2.2 die MINI-Modelle ohne Markenwort
 * („Countryman Cooper“, „Clubman One“, „Aceman SE“, „JCW“). Belegt durch Handelsnamen derselben Datei mit
 * Markenwort: „One,One Countryman,MINI“, „Cooper Clubman,MINI“, „John Cooper Works,MINI“, „JohnCooperWorks
 * Coupé,MIN…“, „JCW Aceman E“ und „JCW Countryman ALL4“ (JCW ist die Abkürzung von John Cooper Works).
 * Verglichen wird das erste Wort oder die ersten Wörter des ersten Teils, längere zuerst.
 */
export const HANDELSNAMEN_MARKE = {
  BMW: {
    marke: 'MINI',
    reihen: [
      ['JOHN COOPER WORKS', 'John Cooper Works'],
      ['JOHNCOOPERWORKS', 'John Cooper Works'],
      ['JCW', 'John Cooper Works'],
      ['COUNTRYMAN', 'Countryman'],
      ['CLUBMAN', 'Clubman'],
      ['ACEMAN', 'Aceman'],
      ['COOPER', 'Cooper'],
      ['ONE', 'One'],
    ],
  },
};

/** Reihe nach HANDELSNAMEN_MARKE: `{ marke, reihe }` oder null. Mit `marke` nur Einträge dieser Marke. */
export function reiheAusHandelsnamen(teil, hersteller, marke) {
  const eintraege = Object.entries(HANDELSNAMEN_MARKE).filter(([h, e]) => (hersteller ? h === hersteller : true) && (marke ? e.marke === marke : true));
  const gross = teil.replace(/\s+/g, ' ').trim().toUpperCase();
  for (const [, e] of eintraege) {
    const fund = e.reihen.find(([wort]) => gross === wort || gross.startsWith(`${wort} `));
    if (fund) return { marke: e.marke, reihe: fund[1] };
  }
  return null;
}

/**
 * Schreibfehler des KBA in Handelsnamen, je Marke auf den Reihennamen abgebildet, den die Datei sonst führt.
 * „SKODA SUBERB“ (SKODA (CZ), 293 Fahrzeuge) steht neben „SUPERB“ in derselben Datei und in FZ 12.
 * Nur Wörter dieser Liste; Prüfhinweise auf weitere Fälle gibt der Lauf aus (Tippfehlerabstand 1).
 */
export const KBA_SCHREIBVARIANTEN = {
  Škoda: { SUBERB: 'SUPERB' },
};

/** Teil mit berichtigten Schreibfehlern nach KBA_SCHREIBVARIANTEN. */
export function ohneSchreibfehler(teil, marke) {
  const liste = KBA_SCHREIBVARIANTEN[marke];
  if (!liste) return teil;
  return teil.replace(/[\p{L}\p{N}]+/gu, (wort) => liste[wort.toUpperCase()] ?? wort);
}

/** Levenshtein-Abstand, abgebrochen über 1 (genügt für den Prüfhinweis). */
export function abstandHoechstensEins(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

/** Markenworte, die Teil des Modellnamens bleiben: „RANGE ROVER EVOQUE“ ist bei Land Rover die Reihe „Range Rover Evoque“. */
const MARKENWORT_BLEIBT = new Set(['RANGE ROVER']);

/**
 * Untermarken und ihre Stammmarke, belegt durch die Handelsnamen in FZ 2.2 („CUPRA LEON“ unter SEAT (E),
 * „ABARTH 500“ unter FCA (I), „BMW ALPINA B3“ unter ALPINA, „Genesis GV80“ unter HYUNDAI MOTOR (ROK)).
 * Gleiche Reihennamen bei Unter- und Stammmarke sind keine Dublette. Dieselbe Liste nutzt die Suche
 * (src/lib/fahrzeuge/suche.ts, UNTERMARKEN; der Test hält beide gleich).
 */
export const UNTERMARKEN = { Abarth: 'Fiat', Alpina: 'BMW', Cupra: 'SEAT', Genesis: 'Hyundai' };

/** Marke eines Handelsnamens nach Markenwort; `rest` ist der Name ohne Markenwort. */
export function markeAusName(teil) {
  const gross = teil.toUpperCase();
  for (const [wort, marke] of MARKENWORTE) {
    const rest = (laenge) => (MARKENWORT_BLEIBT.has(wort) ? teil.trim() : teil.slice(laenge).trim());
    if (gross === wort) return { marke, rest: rest(wort.length) };
    if (gross.startsWith(`${wort} `) || gross.startsWith(`${wort}-`)) return { marke, rest: rest(wort.length + 1) };
    // Ohne Leerzeichen vor einer Ziffer: „MAZDA2“, „NISSAN300 ZX“, „WARTBURG353 W“.
    if (gross.startsWith(wort) && /\d/.test(gross.charAt(wort.length))) return { marke, rest: rest(wort.length) };
  }
  // Abarth steht bei FCA auch hinten: „500 ABARTH“, „PUNTO ABARTH“.
  if (/\sABARTH$/.test(gross)) return { marke: 'Abarth', rest: teil.slice(0, -' ABARTH'.length).trim() };
  return null;
}

/**
 * Markenwort in einem weiteren Teil: allein („One Cabrio,MINI“) ab drei Buchstaben, denn „MG“ ist bei Kia ein
 * Modellkürzel („Magentis,Optima,MG“); mit Namen nur, wenn er dem ersten Teil gleicht („G80, Genesis G80“).
 * „MASTER,NISSAN INTERSTAR“ belegt keine Marke für Master. Vom KBA auf 25 Zeichen gekürzte Reste („…,In“)
 * zählen nie.
 */
function markeAusRest(teil, erster) {
  const m = markeAusName(teil);
  if (!m) return null;
  if (m.rest === '') return teil.length >= 3 ? m : null;
  return kompakt(m.rest) === kompakt(erster) ? m : null;
}

/**
 * Teile eines Handelsnamens (Komma, Semikolon oder „oder“), ohne Leeres. „oder“ und „or“ trennen nur als
 * eigenes Wort („Carens or Rondo“), nicht als Wortanfang („Chevrolet Orlando“, „BRUTALE ORO“); die
 * Abkürzungen „od.“ und „o.“ trennen auch ohne folgendes Leerzeichen („JB od.RIO“, „PARTNER OD.RANCH“).
 */
export function teile(handelsname) {
  return handelsname
    .split(/\s*[,;]\s*|\s+(?:od\.|o\.|(?:oder|or)(?=\s|$))\s*/i)
    .map((t) => t.replace(/^[^\p{L}\p{N}]+|[()]+$/gu, '')).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

const kompakt = (text) => schluessel(text);

/**
 * Vorsilben, unter denen FZ 12 Reihen führt, die FZ 2 ohne sie nennt: FZ 12 „MG ROEWE ZS“, „MG ROEWE MARVEL“,
 * „MG ROEWE RX6“; FZ 2.2 unter SAIC (RC) „MG ZS“, „MG Marvel R Electric“, „MG RX6“. Der Rest ohne Vorsilbe ist
 * ein weiterer Schlüssel derselben Reihe.
 */
export const REIHEN_VORSILBEN = new Set(['roewe']);

/** Schlüssel der vorhandenen Reihen einer Marke: Reihenname, Teile und Aliase. */
export function reihenSchluessel(reihen) {
  const schluesselListe = [];
  for (const r of reihen) {
    const namen = [r.reihe, ...(r.alias ?? [])];
    for (const n of [...namen]) {
      const [vorsilbe, ...rest] = n.split(' ');
      if (rest.length && REIHEN_VORSILBEN.has(kompakt(vorsilbe))) namen.push(rest.join(' '));
    }
    for (const q of namen) {
      for (const t of q.split(/\s*(?:,|\/)\s*/)) {
        const k = kompakt(t);
        if (k) schluesselListe.push({ k, reihe: r, klasse: /^([a-z]{1,3})klasse$/.exec(k)?.[1], er: /^(\d)er$/.exec(k)?.[1] });
        // Erstes Wort eines mehrteiligen Namens, wenn es für sich ein Modellname ist: „SX4 S-Cross“ → SX4.
        const erstes = kompakt(t.split(' ')[0] ?? '');
        if (erstes !== k && (/\d/.test(erstes) ? erstes.length >= 3 : erstes.length >= 4) && !/^[a-z]{1,3}$/.test(erstes)) {
          schluesselListe.push({ k: erstes, reihe: r, genau: true });
        }
      }
    }
  }
  return schluesselListe;
}

/**
 * Entspricht ein Teil eines Handelsnamens einer vorhandenen Reihe? Vergleich auf kompakten Namen
 * (klein, ohne Akzente, ohne Zeichen und Leerzeichen):
 *   a) gleich, oder der Teil beginnt mit dem Reihennamen, wenn dieser mindestens zwei Zeichen hat
 *      („GOLF VARIANT“ → Golf, „XC90 T8“ → XC90, aber „400“ nicht → 40); ein Reihenname aus einem Zeichen nur mit Wechsel
 *      zwischen Ziffer und Buchstabe („3 CABRIO“ → DS 3, aber „E:NY1“ nicht → Honda e);
 *   b) Klassen: „A 180“, „E 220 D“ → A-Klasse, E-Klasse (Buchstaben vor der ersten Ziffer);
 *   c) BMW-Reihen: „320D“ → 3er (erste Ziffer, dann zwei Ziffern);
 *   d) reine Zahlenreihen ab zwei Ziffern mit Buchstaben davor: „V40“, „S 60“ → Volvo 40, 60 (aber „M3“
 *      nicht → DS 3).
 */
export function entsprichtReihe(teil, schluesselListe) {
  const p = kompakt(teil);
  if (!p) return null;
  for (const s of schluesselListe) {
    if (p === s.k) return s.reihe;
    if (s.genau) continue;
    // Endet der Reihenname auf eine Ziffer, ist eine weitere Ziffer ein anderes Modell („400“ ist nicht Volvo 40).
    if (s.k.length >= 2 && p.startsWith(s.k) && !(/\d$/.test(s.k) && /\d/.test(p.charAt(s.k.length)))) return s.reihe;
    if (s.k.length === 1 && p.startsWith(s.k) && /\d/.test(s.k) !== /\d/.test(p[1] ?? '')) return s.reihe;
    if (s.klasse && new RegExp(`^${s.klasse}\\d`).test(p)) return s.reihe;
    if (s.er && new RegExp(`^${s.er}\\d\\d`).test(p)) return s.reihe;
    if (/^\d{2,}$/.test(s.k) && new RegExp(`^[a-z]{1,2}${s.k}(?!\\d)`).test(p)) return s.reihe;
  }
  return null;
}

/**
 * Ausstattungs-, Aufbau- und Sammelwörter: Ein Name, der nur aus ihnen besteht („GL“, „SPORT,GSI“,
 * „COUPE“, „KOMBI“), bezeichnet kein Modell und wird gelistet, nicht übernommen.
 */
export const AUSSTATTUNG = new Set([
  'l', 'ls', 'gl', 'gls', 'glx', 'gt', 'gts', 'gti', 'gsi', 'gte', 'gtl', 's', 'se', 'sel', 'sr', 'cd', 'cdx', 'cs', 'csi', 'csl', 'tl', 'cl',
  'coupe', 'coupé', 'cabrio', 'cabriolet', 'kabriolet', 'roadster', 'targa', 'turbo', 'sport', 'business', 'kombi', 'bus', 'city',
  'eco', 'swing', 'joy', 'club', 'royal', 'berlina', 'limousine', 'electric', 'drive', 'edition', 'reihe', 'executive', 'k', 'x', 'z', 'm', 'e', 'f',
]);

/** Name besteht nur aus Ausstattungswörtern? */
export function nurAusstattung(teil) {
  const woerter = teil.toLowerCase().split(/[^a-z0-9äöüéß]+/).filter(Boolean);
  return woerter.length > 0 && woerter.every((w) => AUSSTATTUNG.has(w));
}

/** Wörter, die allein kein Modellname sind und das folgende Wort mitnehmen („NEW BEETLE“, „STREET KA“). */
const NAMENSANFANG = new Set(['new', 'grand', 'street', 'flying', 'marco', 'john', 'range', 'space', 'karmann', 'cont', 'sport', 'super', 'amg']);

/**
 * Reihenname einer neuen Zeile aus dem ersten Teil: das erste Wort; ein kurzes Buchstabenwort mit der
 * Zahl danach („P 601“, „F 355“); eine Zahl bis vier Stellen mit kurzem Buchstabenwort danach („2 CV“,
 * „17 M“, „200 SX“, ab drei Stellen ohne Ausstattungswort); ein Namensanfang mit dem folgenden Wort, auch mit Ziffern („Street Ka“, „Super V8“).
 */
export function neueReihe(teil) {
  const woerter = teil.replace(/\s+/g, ' ').trim().split(' ');
  const [a, b] = woerter;
  if (b !== undefined) {
    if (/^[A-Za-z]{1,2}$/.test(a) && /^\d/.test(b)) return `${a} ${b}`;
    if (/^\d{1,2}$/.test(a) && /^[A-Za-z]{1,3}$/.test(b)) return `${a} ${b}`;
    // Drei- und vierstellige Zahlen: nur mit einem Kurzwort, das keine Ausstattung ist („200 SX“, „300 ZX“,
    // aber „240 GL“ bleibt „240“). Mehrere solcher Namen zur selben Zahl führt pkwErgaenzung zusammen.
    if (/^\d{3,4}$/.test(a) && /^[A-Za-z]{1,3}$/.test(b) && !AUSSTATTUNG.has(b.toLowerCase())) return `${a} ${b}`;
    if (NAMENSANFANG.has(a.toLowerCase().replace(/\.$/, '')) && /^[\p{L}\p{N}]+$/u.test(b)) return `${a} ${b}`;
  }
  return a;
}

/**
 * Vorsätze, die vor einem vorhandenen Reihennamen stehen können: „AMG A 35“ ist eine A-Klasse, „AMG GLC 43“
 * ein GLC. Für den Abgleich wird der Teil auch ohne Vorsatz geprüft.
 */
export const VORSAETZE = ['AMG'];

/** Varianten eines Teils für den Abgleich: der Teil selbst und, wo ein Vorsatz vorn steht, der Rest. */
function abgleichVarianten(teil) {
  const gross = teil.toUpperCase();
  const v = VORSAETZE.find((w) => gross.startsWith(`${w} `));
  return v ? [teil, teil.slice(v.length + 1).trim()] : [teil];
}

/**
 * Pkw-Zeilen aus Blatt FZ 2.2, die der Katalog noch nicht führt. `katalog` sind die vorhandenen Zeilen.
 *
 * Marke: Markenwort im ersten Teil des Handelsnamens, sonst in einem weiteren Teil, sonst ein Markenwort,
 * das bei demselben Hersteller an einem Namen mit demselben ersten Wort belegt ist („Cooper Clubman,MINI“
 * belegt Cooper als MINI), sonst die Marke des Herstellers. Bei Herstellern mehrerer Marken ohne Beleg wird
 * der Name gelistet. Übernommen wird nur, was keiner Reihe derselben Marke entspricht (`entsprichtReihe`),
 * nicht genau wie eine Reihe einer anderen Marke heißt (Kooperationsmodelle wie „DUSTER“ bei Renault) und
 * nicht nur aus Ausstattungswörtern besteht.
 */
export function pkwErgaenzung(blatt, katalog, quelle = FZ2_QUELLE) {
  const { typen } = leseHandelsnamen(blatt, 'FZ 2.2', { anzahl: 'Insgesamt', wohnmobile: 'Wohnmobile' });
  const vorhandeneMarken = new Map();
  for (const r of katalog) {
    if ((r.klasse ?? 'pkw') !== 'pkw') continue;
    if (!vorhandeneMarken.has(r.marke)) vorhandeneMarken.set(r.marke, []);
    vorhandeneMarken.get(r.marke).push(r);
  }
  const vorhandeneIds = new Set(katalog.map((r) => r.id));
  const schluesselJeMarke = new Map([...vorhandeneMarken].map(([m, rs]) => [m, reihenSchluessel(rs)]));
  const alleSchluessel = new Map();
  for (const [m, liste] of schluesselJeMarke) for (const s of liste) alleSchluessel.set(s.k, [...(alleSchluessel.get(s.k) ?? []), m]);
  /** @type {Record<string, any>} */
  const zaehler = {
    typzeilen: typen.length, sammel: 0, ohneName: 0, wohnmobil: 0, wohnmobilBestand: 0, entspricht: 0, andereMarke: [],
    nurMarke: 0, ausstattung: [], ohneMarke: [], neu: 0,
  };

  // 1. Je Zeile: Markenwort im ersten oder einem weiteren Teil, erstes Wort des Namens.
  const zeilen = [];
  for (const t of typen) {
    if (!(t.hersteller in PKW_HERSTELLER)) throw new Error(`FZ 2.2: Hersteller „${t.hersteller}“ fehlt in PKW_HERSTELLER`);
    if (istSammelzeile(t.handelsname)) {
      zaehler.sammel += 1;
      continue;
    }
    if (!/\p{L}|\p{N}/u.test(t.handelsname)) {
      zaehler.ohneName += 1;
      continue;
    }
    // Aufbau als Wohnmobil: Name des Aufbauherstellers, kein Fahrzeugmodell.
    if (t.wohnmobile * 2 >= t.anzahl) {
      zaehler.wohnmobil += 1;
      zaehler.wohnmobilBestand += t.anzahl;
      continue;
    }
    // Schrägstrich vor einem weiteren Namen mit Markenwort trennt wie ein Komma („Kia LD/Kia Cerato“);
    // sonst bleibt er Teil des Namens („318I/CABRIO“, „200 D/8“).
    const alle = teile(t.handelsname).flatMap((teil) => {
      const stuecke = teil.split(/\s*\/\s*/);
      return stuecke.length > 1 && stuecke.slice(1).every((x) => markeAusName(x)) ? stuecke.filter(Boolean) : [teil];
    });
    const ersterTreffer = markeAusName(alle[0]);
    const weitererTreffer = alle.slice(1).map((teil) => markeAusRest(teil, alle[0])).find(Boolean);
    const erstesWort = kompakt((ersterTreffer ? ersterTreffer.rest : alle[0]).split(' ')[0] ?? '');
    zeilen.push({ t, alle, ersterTreffer, weitererTreffer, erstesWort });
  }
  const belege = new Map();
  for (const z of zeilen) {
    // Belegt wird nur über einen weiteren Teil („Cooper Clubman,MINI“); ein Markenwort vorn („CUPRA LEON“)
    // gilt für diese Zeile allein, sonst würde jeder „LEON“ von SEAT zu Cupra.
    const beleg = z.ersterTreffer ? undefined : z.weitererTreffer?.marke;
    if (!beleg || beleg === PKW_HERSTELLER[z.t.hersteller] || !z.erstesWort) continue;
    const k = `${z.t.hersteller}|${z.erstesWort}`;
    belege.set(k, new Set([...(belege.get(k) ?? []), beleg]));
  }

  // 2. Marke festlegen, mit dem Bestand abgleichen, neue Reihen bilden.
  const gruppen = new Map();
  for (const { t, alle, ersterTreffer, weitererTreffer, erstesWort } of zeilen) {
    const beleg = belege.get(`${t.hersteller}|${erstesWort}`);
    const ausListe = ersterTreffer ? null : reiheAusHandelsnamen(alle[0], t.hersteller);
    const marke =
      ersterTreffer?.marke
      ?? ausListe?.marke
      ?? weitererTreffer?.marke
      ?? (beleg?.size === 1 ? [...beleg][0] : undefined)
      ?? PKW_HERSTELLER[t.hersteller];
    if (!marke) {
      zaehler.ohneMarke.push(`${t.hersteller}: ${t.handelsname}`);
      continue;
    }
    // Teile ohne Markenwort derselben Marke; Teile einer anderen Marke fallen weg. `mitWort` behält das
    // Markenwort für den Abgleich mit Reihen, deren Name es trägt (FZ 12 „WEY 05“, „Rover MGF, MG TF“); dort
    // zählt nur der genaue Schlüssel, sonst passte „MINI COOPER“ über die Präfixregel auf die Reihe „Mini“.
    const namensTeile = [];
    const mitWort = [];
    for (const teil of alle) {
      const m = markeAusName(teil);
      if (!m) namensTeile.push(ohneSchreibfehler(teil, marke));
      else if (m.marke === marke) {
        if (m.rest) {
          namensTeile.push(ohneSchreibfehler(m.rest, marke));
          mitWort.push(kompakt(teil));
        }
      }
    }
    if (!namensTeile.length) {
      zaehler.nurMarke += 1;
      continue;
    }
    // Nach dem Markenwort folgt eine zweite Marke („VW PORSCHE 914“): nicht sicher zuzuordnen.
    if (markeAusName(namensTeile[0])) {
      zaehler.ohneMarke.push(`${t.hersteller}: ${t.handelsname}`);
      continue;
    }
    const liste = schluesselJeMarke.get(marke);
    if (
      liste
      && (namensTeile.flatMap(abgleichVarianten).some((teil) => entsprichtReihe(teil, liste))
        || mitWort.some((k) => liste.some((s) => !s.genau && s.k === k)))
    ) {
      zaehler.entspricht += 1;
      continue;
    }
    const reihe = reiheAusHandelsnamen(namensTeile[0], undefined, marke)?.reihe ?? handelsnameAnzeige(neueReihe(namensTeile[0]));
    // Gleicher Name wie eine vorhandene Reihe derselben Marke: keine Dublette.
    if (vorhandeneIds.has(kennung(marke, reihe))) {
      zaehler.entspricht += 1;
      continue;
    }
    // Genau der Name einer Reihe einer anderen Marke: Kooperations- oder Lizenzmodell, keine zweite Zeile.
    // Nur Namen mit Buchstaben und mindestens drei Zeichen: „80“ heißt bei Audi und Volvo verschieden.
    const fremd = (teil) => {
      const k = kompakt(teil);
      return k.length >= 3 && /[a-z]/.test(k) && !AUSSTATTUNG.has(k) && (alleSchluessel.get(k) ?? []).some((m) => m !== marke && UNTERMARKEN[marke] !== m);
    };
    if (fremd(reihe) || fremd(namensTeile[0])) {
      zaehler.andereMarke.push(`${t.hersteller}: ${t.handelsname} → ${marke}`);
      continue;
    }
    if (nurAusstattung(namensTeile[0]) || kompakt(reihe).length < 2) {
      zaehler.ausstattung.push(`${t.hersteller}: ${t.handelsname}`);
      continue;
    }
    const k = `${marke}|${kompakt(reihe)}`;
    if (!gruppen.has(k)) gruppen.set(k, { marke, reihe, namen: new Set(), hersteller: new Set(), bestand: 0, typzeilen: 0 });
    const g = gruppen.get(k);
    g.typzeilen += 1;
    g.namen.add(t.handelsname);
    g.hersteller.add(t.hersteller);
    g.bestand += t.anzahl;
  }
  // Zahl mit Kurzwort („230 CE“, „230 SL“, „296 GTB“) nur, wenn es zu dieser Zahl bei der Marke nichts anderes
  // gibt; sonst ist die Zahl die Reihe („230“), wie vor der Regel. Führt der Katalog die Zahl schon, entspricht
  // die Zeile ihr.
  const jeZahl = new Map();
  for (const [k, g] of gruppen) {
    const zahl = /^(\d{3,4})(?: |$)/.exec(g.reihe)?.[1];
    if (!zahl) continue;
    const z = `${g.marke}|${zahl}`;
    jeZahl.set(z, [...(jeZahl.get(z) ?? []), k]);
  }
  for (const [z, schluesselListe] of jeZahl) {
    const [marke, zahl] = z.split('|');
    const vorhanden = vorhandeneIds.has(kennung(marke, zahl));
    if (schluesselListe.length < 2 && !vorhanden) continue;
    const ziel = `${marke}|${kompakt(zahl)}`;
    for (const k of schluesselListe) {
      const g = gruppen.get(k);
      gruppen.delete(k);
      if (vorhanden) {
        zaehler.entspricht += g.typzeilen;
        continue;
      }
      if (!gruppen.has(ziel)) gruppen.set(ziel, { marke, reihe: zahl, namen: new Set(), hersteller: new Set(), bestand: 0, typzeilen: 0 });
      const t = gruppen.get(ziel);
      t.typzeilen += g.typzeilen;
      for (const n of g.namen) t.namen.add(n);
      for (const h of g.hersteller) t.hersteller.add(h);
      t.bestand += g.bestand;
    }
  }
  const reihen = [...gruppen.values()].map((g) => ({
    id: kennung(g.marke, g.reihe),
    klasse: 'pkw',
    marke: g.marke,
    reihe: g.reihe,
    kbaName: [...g.hersteller].join(' / ') + ': ' + [...g.namen].join(' / '),
    bestand: g.bestand,
    quelle,
    klonbar: 'unbekannt',
    gehaeuse: 'unbekannt',
    leistungen: [],
    sichtbar: true,
  }));
  zaehler.neu = reihen.length;
  zaehler.neueMarken = [...new Set(reihen.map((r) => r.marke))].filter((m) => !vorhandeneMarken.has(m)).sort();
  return { reihen, zaehler };
}

/* ---------- Zusammenführen ------------------------------------------------ */

const sortierer = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });
/** Reihenfolge der Klassen im Katalog wie in FAHRZEUGKLASSEN (src/lib/fahrzeuge/katalog.ts): erst Pkw. */
export const KLASSEN_FOLGE = ['pkw', 'kraftrad'];
const klassenRang = (klasse) => {
  const rang = KLASSEN_FOLGE.indexOf(klasse ?? 'pkw');
  return rang < 0 ? KLASSEN_FOLGE.length : rang;
};

/** Zeile einer FZ-2-Übernahme? */
export const istFz2Zeile = (r) => typeof r.quelle === 'string' && r.quelle.startsWith(FZ2_PRAEFIX);

/**
 * Felder, die nach dem Import gepflegt werden (scripts/fahrzeuge-generationen-import.mjs, Bestand, Prüfung)
 * und die das Importskript selbst nicht bildet. Sie gehen beim erneuten Lauf je Kennung auf die neue Zeile
 * über. Aliase bildet das Skript selbst; sie werden neu gebildet.
 */
export const GEPFLEGTE_FELDER = ['generationen', 'bestandsModell', 'transponder', 'sichtbar'];

/** Hat eine Zeile gepflegte Angaben, die ein Neuaufbau verlieren würde? */
const hatGepflegtes = (r) =>
  (Array.isArray(r.generationen) && r.generationen.length > 0) || r.bestandsModell !== undefined || r.transponder !== undefined || r.sichtbar === false;

/**
 * Neuer Katalog: vorhandene Zeilen (ohne frühere FZ-2-Zeilen, mit Klasse „pkw“, wo sie fehlt) und die
 * Zeilen aus FZ 2. Gepflegte Felder früherer FZ-2-Zeilen gehen je Kennung über (GEPFLEGTE_FELDER).
 * Kennungen müssen eindeutig sein, sonst bricht der Lauf ab. `verloren` nennt frühere FZ-2-Zeilen mit
 * gepflegten Angaben, deren Kennung nicht mehr entsteht.
 */
export function fuehreZusammenMitBericht(katalog, neue) {
  const alteFz2 = new Map(katalog.filter(istFz2Zeile).map((r) => [r.id, r]));
  const bleibende = katalog.filter((r) => !istFz2Zeile(r)).map((r) => (r.klasse ? r : { id: r.id, klasse: 'pkw', ...r }));
  const ids = new Set(bleibende.map((r) => r.id));
  const uebernommen = neue.map((r) => {
    if (ids.has(r.id)) throw new Error(`Kennung doppelt vergeben: ${r.id}`);
    ids.add(r.id);
    const alt = alteFz2.get(r.id);
    if (!alt) return r;
    const gepflegt = Object.fromEntries(GEPFLEGTE_FELDER.filter((f) => alt[f] !== undefined).map((f) => [f, alt[f]]));
    return { ...r, ...gepflegt };
  });
  const verloren = [...alteFz2.values()].filter((r) => !ids.has(r.id) && hatGepflegtes(r));
  const zeilen = [...bleibende, ...uebernommen].sort(
    (a, b) =>
      klassenRang(a.klasse) - klassenRang(b.klasse)
      || sortierer.compare(a.marke, b.marke)
      || sortierer.compare(a.reihe, b.reihe)
      || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  return { zeilen, verloren };
}

/** Wie fuehreZusammenMitBericht, nur die Zeilen; bricht ab, wenn gepflegte Angaben verloren gingen. */
export function fuehreZusammen(katalog, neue) {
  const { zeilen, verloren } = fuehreZusammenMitBericht(katalog, neue);
  if (verloren.length) {
    throw new Error(
      `Zeilen mit gepflegten Angaben fielen weg: ${verloren.map((r) => r.id).join(', ')}. `
        + 'Gepflegtes zuerst auf die neue Kennung übertragen oder entfernen, dann erneut laufen lassen.',
    );
  }
  return zeilen;
}

function schreibeAtomar(datei, inhalt) {
  const tmp = `${datei}.tmp-${process.pid}`;
  writeFileSync(tmp, inhalt, 'utf8');
  renameSync(tmp, datei);
}

const zahlText = new Intl.NumberFormat('de-DE');

function main(argumente) {
  const trocken = argumente.includes('--trocken');
  const liste = argumente.includes('--liste');
  const datei = argumente.find((a) => !a.startsWith('--'));
  const xlsx = datei ? path.resolve(datei) : STANDARD_XLSX;
  const blaetter = leseXlsx(readFileSync(xlsx), ['Impressum', 'FZ 2.2', 'FZ 2.6']);
  const impressum = blaetter.Impressum.map((z) => Object.values(z).join(' ')).join('\n');
  if (!impressum.includes('Datenlizenz Deutschland - Namensnennung - Version 2.0') || !impressum.includes('© Kraftfahrt-Bundesamt, Flensburg')) {
    throw new Error('Impressum ohne den erwarteten Lizenzwortlaut; Quellenvermerk prüfen');
  }
  if (!impressum.includes('1. Januar 2026')) throw new Error('Impressum nennt nicht den Stand 1. Januar 2026');

  const katalog = JSON.parse(readFileSync(ZIEL_DATEI, 'utf8'));
  const basis = katalog.filter((r) => !istFz2Zeile(r));
  const krad = kraftraeder(blaetter['FZ 2.6']);
  const pkw = pkwErgaenzung(blaetter['FZ 2.2'], basis);
  const neu = fuehreZusammen(katalog, [...pkw.reihen, ...krad.reihen]);

  const zaehle = (rs, klasse) => {
    const z = rs.filter((r) => (r.klasse ?? 'pkw') === klasse);
    return `${new Set(z.map((r) => r.marke)).size} Marken, ${z.length} Reihen`;
  };
  console.log(`Vorher: pkw ${zaehle(basis, 'pkw')}; kraftrad ${zaehle(basis, 'kraftrad')}`);
  console.log(`Nachher: pkw ${zaehle(neu, 'pkw')}; kraftrad ${zaehle(neu, 'kraftrad')}`);
  const k = krad.zaehler;
  console.log(
    `FZ 2.6: ${k.typzeilen} Typzeilen, ${k.hersteller} Hersteller als ${k.marken} Marken, ${k.handelsnamen} Handelsnamen, `
      + `${k.sammel} Sammelzeilen (${zahlText.format(k.sammelBestand)} Fahrzeuge), ${k.ohneName} Zeilen ohne Handelsnamen `
      + `(${zahlText.format(k.ohneNameBestand)}), benannt ${zahlText.format(k.bestandBenannt)} von ${zahlText.format(k.insgesamt)} Krafträdern`,
  );
  const p = pkw.zaehler;
  console.log(
    `FZ 2.2: ${p.typzeilen} Typzeilen, ${p.sammel} Sammelzeilen, ${p.ohneName} ohne Handelsnamen, ${p.wohnmobil} Wohnmobil-Aufbauten `
      + `(${zahlText.format(p.wohnmobilBestand)}), ${p.entspricht} entsprechen einer Reihe, ${p.andereMarke.length} heißen wie eine Reihe einer `
      + `anderen Marke, ${p.nurMarke} nur Markenname, ${p.ausstattung.length} nur Ausstattungswörter, ${p.ohneMarke.length} ohne sichere `
      + `Marke, ${p.neu} neue Reihen; neue Marken: ${p.neueMarken.join(', ')}`,
  );
  if (liste) {
    console.log('\nOhne sichere Marke (gelistet, nicht übernommen):');
    for (const n of p.ohneMarke) console.log(`  ${n}`);
    console.log('\nName einer Reihe einer anderen Marke (gelistet, nicht übernommen):');
    for (const n of p.andereMarke) console.log(`  ${n}`);
    console.log('\nNur Ausstattungswörter (gelistet, nicht übernommen):');
    for (const n of p.ausstattung) console.log(`  ${n}`);
    console.log('\nNeue Pkw-Reihen:');
    for (const r of pkw.reihen) console.log(`  ${r.marke} | ${r.reihe} | ${r.bestand} | ${r.kbaName}`);
  }
  // Prüfhinweis: neue Pkw-Reihen, die sich von einer vorhandenen Reihe derselben Marke nur in einem Zeichen
  // unterscheiden, können Schreibfehler des KBA sein (KBA_SCHREIBVARIANTEN).
  const hinweise = [];
  for (const r of pkw.reihen) {
    const k = kompakt(r.reihe);
    if (k.length < 5) continue;
    const nah = basis.filter((b) => b.marke === r.marke && abstandHoechstensEins(k, kompakt(b.reihe)));
    for (const b of nah) hinweise.push(`${r.marke}: „${r.reihe}“ (neu) und „${b.reihe}“ (vorhanden)`);
  }
  if (hinweise.length) {
    console.log(`Prüfhinweis, mögliche Schreibfehler (${hinweise.length}):`);
    for (const h of hinweise) console.log(`  ${h}`);
  }
  const inhalt = `${JSON.stringify(neu, null, 2)}\n`;
  console.log(`Katalogzeilen: ${neu.length}, Größe: ${(Buffer.byteLength(inhalt) / 1024).toFixed(1).replace('.', ',')} KB`);
  if (trocken) return;
  schreibeAtomar(ZIEL_DATEI, inhalt);
  console.log(`Geschrieben: ${ZIEL_DATEI}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2));
}
