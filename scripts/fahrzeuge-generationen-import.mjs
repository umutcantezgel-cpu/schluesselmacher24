#!/usr/bin/env node
// Generationen mit Bauzeitraum in den Fahrzeugkatalog einarbeiten (FA-KERN-01, A-047, FA-06-04).
//
//   node scripts/fahrzeuge-generationen-import.mjs [pfad-zur-csv] [--trocken]
//
// Liest eine CSV mit den Spalten marke, reihe, generation, baujahr_von, baujahr_bis, quelle. Ohne Pfad sucht
// das Skript _werkstatt/ausbau/eingang/fahrzeug-generationen.csv, dann _werkstatt/ausbau/daten/fahrzeug-generationen.csv.
// Übernommen werden nur Zeilen, deren Marke und Reihe im Katalog stehen (Vergleich ohne Groß- und
// Kleinschreibung, Akzente und Zeichen). Alles andere wird gelistet, nicht geraten (R4). Jede Zeile braucht
// eine Quelle. Eine Generation mit gleicher Bezeichnung wird ersetzt, andere bleiben. Generationen werden
// hier nie erfunden: Ohne Datei ändert das Skript nichts.
//
// Wirkung: Das Skript füllt nur content/fahrzeugkatalog.json, also den JSON-Stand ohne Datenbank und den Startwert
// des Seeds. Im Betrieb mit Datenbank kommen die Generationen so nicht an: Der Seed-Plan „fahrzeugreihen“
// legt nur fehlende Zeilen an und gleicht vorhandene nicht ab. Dort werden Generationen im Admin gepflegt
// (Sammlung Fahrzeugreihen, Feldgruppe „Generationen“), oder es braucht einen eigenen Abgleich nur für dieses Feld.
// Die Importe scripts/fahrzeuge-import.mjs und scripts/fahrzeuge-import-fz2.mjs behalten eingetragene Generationen.

import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { parseCsv, schluessel } from './fahrzeuge-import.mjs';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const STANDARD_ORTE = [
  path.join(WURZEL, '_werkstatt/ausbau/eingang/fahrzeug-generationen.csv'),
  path.join(WURZEL, '_werkstatt/ausbau/daten/fahrzeug-generationen.csv'),
];
const ZIEL_DATEI = path.join(WURZEL, 'content/fahrzeugkatalog.json');

export const SPALTEN = ['marke', 'reihe', 'generation', 'baujahr_von', 'baujahr_bis', 'quelle'];
export const JAHR_MIN = 1900;
export const JAHR_MAX = 2100;

function jahr(text, feld, nummer) {
  const t = (text ?? '').trim();
  if (t === '') return undefined;
  if (!/^\d{4}$/.test(t)) throw new Error(`Generationen, Zeile ${nummer}: „${feld}“ ist kein Jahr („${t}“)`);
  const wert = Number(t);
  if (wert < JAHR_MIN || wert > JAHR_MAX) throw new Error(`Generationen, Zeile ${nummer}: „${feld}“ liegt außerhalb ${JAHR_MIN} bis ${JAHR_MAX}`);
  return wert;
}

/** Zeilen der CSV als Objekte; prüft Kopf, Felderzahl, Jahre und Quelle. */
export function leseGenerationen(text) {
  const tabelle = parseCsv(text.replace(/^﻿/, '')).filter((werte) => !(werte.length === 1 && werte[0].trim() === ''));
  const [kopf, ...daten] = tabelle;
  if (!kopf) throw new Error('Generationen: Datei ist leer');
  const namen = kopf.map((k) => k.trim().toLowerCase());
  for (const spalte of SPALTEN) if (!namen.includes(spalte)) throw new Error(`Generationen: Spalte „${spalte}“ fehlt`);
  return daten.map((werte, n) => {
    const nummer = n + 2;
    if (werte.length !== namen.length) throw new Error(`Generationen, Zeile ${nummer}: ${werte.length} statt ${namen.length} Felder`);
    const f = Object.fromEntries(namen.map((name, i) => [name, (werte[i] ?? '').trim()]));
    if (!f.marke || !f.reihe || !f.generation) throw new Error(`Generationen, Zeile ${nummer}: Marke, Reihe und Generation sind Pflicht`);
    if (!f.quelle) throw new Error(`Generationen, Zeile ${nummer}: ohne Quelle (R4)`);
    const von = jahr(f.baujahr_von, 'baujahr_von', nummer);
    const bis = jahr(f.baujahr_bis, 'baujahr_bis', nummer);
    if (von !== undefined && bis !== undefined && von > bis) throw new Error(`Generationen, Zeile ${nummer}: Baujahr von liegt nach Baujahr bis`);
    return { nummer, marke: f.marke, reihe: f.reihe, generation: { bezeichnung: f.generation, ...(von !== undefined ? { baujahrVon: von } : {}), ...(bis !== undefined ? { baujahrBis: bis } : {}), quelle: f.quelle } };
  });
}

/**
 * Arbeitet die Generationen in den Katalog ein. Reine Funktion: gibt den neuen Katalog und die Liste der
 * nicht zugeordneten Zeilen zurück. Eine Reihe ist eindeutig über Marke und Reihe; passen mehrere Reihen
 * (etwa gleiche Namen in zwei Klassen), wird die Zeile gelistet.
 */
export function arbeiteEin(katalog, zeilen) {
  const index = new Map();
  for (const r of katalog) {
    const k = `${schluessel(r.marke)}|${schluessel(r.reihe)}`;
    index.set(k, [...(index.get(k) ?? []), r.id]);
  }
  const neu = new Map(katalog.map((r) => [r.id, { ...r, ...(r.generationen ? { generationen: r.generationen.map((g) => ({ ...g })) } : {}) }]));
  const nichtZugeordnet = [];
  let uebernommen = 0;
  for (const z of zeilen) {
    const ids = index.get(`${schluessel(z.marke)}|${schluessel(z.reihe)}`) ?? [];
    if (ids.length !== 1) {
      nichtZugeordnet.push({ ...z, grund: ids.length === 0 ? 'Reihe nicht im Katalog' : 'mehrere Reihen passen' });
      continue;
    }
    const reihe = neu.get(ids[0]);
    const liste = (reihe.generationen ?? []).filter((g) => schluessel(g.bezeichnung) !== schluessel(z.generation.bezeichnung));
    liste.push(z.generation);
    liste.sort((a, b) => (a.baujahrVon ?? 0) - (b.baujahrVon ?? 0) || a.bezeichnung.localeCompare(b.bezeichnung, 'de'));
    reihe.generationen = liste;
    uebernommen += 1;
  }
  return { katalog: katalog.map((r) => neu.get(r.id)), uebernommen, nichtZugeordnet };
}

function main(argumente) {
  const trocken = argumente.includes('--trocken');
  const angegeben = argumente.find((a) => !a.startsWith('--'));
  const datei = angegeben ? path.resolve(angegeben) : STANDARD_ORTE.find((ort) => existsSync(ort));
  if (!datei) {
    console.log(`Keine Datei mit Generationen gefunden (gesucht: ${STANDARD_ORTE.join(', ')}). Nichts geändert.`);
    return;
  }
  const zeilen = leseGenerationen(readFileSync(datei, 'utf8'));
  const katalog = JSON.parse(readFileSync(ZIEL_DATEI, 'utf8'));
  const { katalog: neu, uebernommen, nichtZugeordnet } = arbeiteEin(katalog, zeilen);
  console.log(`Gelesen: ${zeilen.length} Zeilen aus ${datei}; übernommen: ${uebernommen}; nicht zugeordnet: ${nichtZugeordnet.length}`);
  for (const z of nichtZugeordnet) console.log(`  Zeile ${z.nummer}: ${z.marke} ${z.reihe} „${z.generation.bezeichnung}“: ${z.grund}`);
  if (trocken || uebernommen === 0) return;
  const tmp = `${ZIEL_DATEI}.tmp-${process.pid}`;
  writeFileSync(tmp, `${JSON.stringify(neu, null, 2)}\n`, 'utf8');
  renameSync(tmp, ZIEL_DATEI);
  console.log(`Geschrieben: ${ZIEL_DATEI}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2));
}
