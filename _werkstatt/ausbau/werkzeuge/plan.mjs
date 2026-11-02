#!/usr/bin/env node
// plan.mjs · Planwerkzeug des Ausbaulaufs (Auftrag 9)
//
// Reines Node-ESM ohne Abhängigkeiten. Importiert nichts aus lib.mjs,
// damit es ohne Playwright läuft.
//
// Befehle:
//   pruefen      Schema und Regeln von PLAN.json prüfen
//   naechste     bereite Pakete für den nächsten Start ausgeben
//   setze        Status, Commit, Grund oder Versuch eines Pakets setzen
//   stand        Zahlen für die Statuszeile
//   zeichne      PLAN.md als gerenderte Ansicht schreiben
//   abschluss    Abschlussprüfung nach Z-01 bis Z-22
//
// Optionen (für Tests): --plan <datei> --anf <datei> --abnahme <datei>
// Ausgabe für zeichne: --ausgabe <datei>

import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const AUSBAU = resolve(HIER, '..');

const STANDARD = {
  plan: join(AUSBAU, 'PLAN.json'),
  anf: join(AUSBAU, 'ANFORDERUNGEN.json'),
  abnahme: join(AUSBAU, 'ABNAHME.md'),
  md: join(AUSBAU, 'PLAN.md'),
};

const STATUS_PAKET = ['offen', 'bereit', 'läuft', 'abgenommen', 'committet', 'blockiert', 'zurückgestellt'];
const MODELLE = ['opus-5.5', 'haiku-5.5'];
const STUFEN = [1, 2, 3];
const KLASSEN = ['S', 'M', 'L'];
const ARTEN = ['pflicht', 'kuer'];
const ZAHL_KRITERIEN = 22;
const ENDSTATUS_ANF = ['umgesetzt', 'später', 'menschensache', 'entfällt'];
const STATUS_ANF = ['offen', 'in Arbeit', ...ENDSTATUS_ANF];
const QUELLEN_ANF = ['G', 'L', 'EL', 'M', 'E', 'K'];
const BESTAND_ANF = ['vorhanden', 'teilweise', 'fehlt', 'nicht pruefbar'];
const STATUS_ABNAHME = ['offen', 'erfüllt', 'AUSNAHME', 'UMGEBUNGSAUSNAHME'];
const AUSNAHME_VERBOTEN = ['Z-02', 'Z-03', 'Z-14', 'Z-20'];
const MAX_AUSNAHMEN = 2;

// --- Argumente wie in lib.mjs (kopiert, damit kein Import nötig ist) -------
export function argumente(argv = process.argv.slice(2)) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const name = t.slice(2);
      const naechstes = argv[i + 1];
      if (naechstes === undefined || naechstes.startsWith('--')) a[name] = true;
      else { a[name] = naechstes; i += 1; }
    } else a._.push(t);
  }
  return a;
}

// --- Lesen und atomares Schreiben -------------------------------------------
export function leseJson(datei) {
  return JSON.parse(readFileSync(datei, 'utf8'));
}

// Schreibt zuerst in eine temporäre Datei im selben Ordner, dann per rename.
export function schreibeAtomar(datei, inhalt) {
  mkdirSync(dirname(datei), { recursive: true });
  const temp = `${datei}.${process.pid}.tmp`;
  writeFileSync(temp, inhalt, 'utf8');
  renameSync(temp, datei);
}

export function schreibeJson(datei, objekt) {
  schreibeAtomar(datei, JSON.stringify(objekt, null, 1));
}

export function optionenAus(a) {
  return {
    plan: a.plan ? resolve(a.plan) : STANDARD.plan,
    anf: a.anf ? resolve(a.anf) : STANDARD.anf,
    abnahme: a.abnahme ? resolve(a.abnahme) : STANDARD.abnahme,
    ausgabe: a.ausgabe ? resolve(a.ausgabe) : null,
  };
}

// --- PRÜFEN: Schema und Regeln (reine Funktion, damit der Selbsttest sie direkt nutzt)
const KENNUNG_ZIEL = /^Z-(0[1-9]|1[0-9]|2[0-2])$/;

const istText = (x) => typeof x === 'string' && x.trim() !== '';
const istListe = (x) => Array.isArray(x);
const istTextListe = (x) => istListe(x) && x.every(istText);
const istZielListe = (x) => istListe(x) && x.every((z) => typeof z === 'string' && KENNUNG_ZIEL.test(z));
const istZahl = (x) => typeof x === 'number' && Number.isFinite(x);
const istGanzzahl = (x, min) => Number.isInteger(x) && x >= min;

// Liefert einen Zyklus als Kette "A -> B -> A" oder null.
export function findeZyklus(graph) {
  const farbe = new Map();
  const stapel = [];
  let fund = null;
  const besuche = (knoten) => {
    farbe.set(knoten, 1);
    stapel.push(knoten);
    for (const nachbar of graph.get(knoten) ?? []) {
      if (fund) return;
      if (farbe.get(nachbar) === 1) {
        fund = [...stapel.slice(stapel.indexOf(nachbar)), nachbar];
        return;
      }
      if (!farbe.has(nachbar)) besuche(nachbar);
    }
    stapel.pop();
    farbe.set(knoten, 2);
  };
  for (const knoten of graph.keys()) {
    if (!farbe.has(knoten)) besuche(knoten);
    if (fund) break;
  }
  return fund ? fund.join(' -> ') : null;
}

// Prüft PLAN.json (plan). anf: geladene ANFORDERUNGEN.json, null wenn sie fehlt,
// undefined wenn die Anforderungs-Abdeckung nicht geprüft werden soll. Liefert Befunde als Text.
export function pruefePlan(plan, anf) {
  const befunde = [];
  if (!plan || typeof plan !== 'object' || istListe(plan)) return ['PLAN.json ist kein Objekt.'];
  if (plan.version !== 1) befunde.push('version muss 1 sein.');
  if (!istText(plan.stand) || Number.isNaN(Date.parse(plan.stand))) befunde.push('stand fehlt oder ist keine ISO-Zeit.');
  if (!plan.mengengeruest || typeof plan.mengengeruest !== 'object') befunde.push('mengengeruest fehlt.');
  const k = plan.kapazitaet;
  if (!k || typeof k !== 'object') befunde.push('kapazitaet fehlt.');
  else {
    for (const klasse of KLASSEN) {
      if (!istZahl(k.pakete_pro_tag?.[klasse])) befunde.push(`kapazitaet.pakete_pro_tag.${klasse} fehlt.`);
    }
    if (!istZahl(k.puffer)) befunde.push('kapazitaet.puffer fehlt.');
    if (!istZahl(k.tage)) befunde.push('kapazitaet.tage fehlt.');
  }

  // Etappen
  const etappen = istListe(plan.etappen) ? plan.etappen : [];
  if (!istListe(plan.etappen)) befunde.push('etappen fehlt oder ist keine Liste.');
  const etappenKennungen = new Set();
  for (const [i, e] of etappen.entries()) {
    if (!e || typeof e !== 'object') { befunde.push(`etappen[${i}] ist kein Objekt.`); continue; }
    const bez = istText(e.kennung) ? e.kennung : `etappen[${i}]`;
    if (!istText(e.kennung)) befunde.push(`${bez}: kennung fehlt.`);
    else if (etappenKennungen.has(e.kennung)) befunde.push(`Etappe ${e.kennung} ist doppelt.`);
    else etappenKennungen.add(e.kennung);
    for (const feld of ['ziel', 'eingang', 'ausgang', 'tor']) {
      if (!istText(e[feld])) befunde.push(`Etappe ${bez}: ${feld} fehlt.`);
    }
    if (!istZielListe(e.kriterien)) befunde.push(`Etappe ${bez}: kriterien müssen Z-01 bis Z-22 sein.`);
    if (!istZahl(e.tage) || e.tage < 0) befunde.push(`Etappe ${bez}: tage muss eine Zahl ab 0 sein.`);
  }

  // Pakete: Pflichtfelder und erlaubte Werte
  const pakete = istListe(plan.pakete) ? plan.pakete : [];
  if (!istListe(plan.pakete)) befunde.push('pakete fehlt oder ist keine Liste.');
  const kennungen = new Set();
  const gueltige = [];
  for (const [i, p] of pakete.entries()) {
    if (!p || typeof p !== 'object') { befunde.push(`pakete[${i}] ist kein Objekt.`); continue; }
    const bez = istText(p.kennung) ? p.kennung : `pakete[${i}]`;
    if (!istText(p.kennung)) befunde.push(`${bez}: kennung fehlt.`);
    else if (kennungen.has(p.kennung)) befunde.push(`Paket ${p.kennung} ist doppelt.`);
    else kennungen.add(p.kennung);
    gueltige.push(p);
    for (const feld of ['titel', 'rolle']) {
      if (!istText(p[feld])) befunde.push(`Paket ${bez}: ${feld} fehlt.`);
    }
    if (!etappenKennungen.has(p.etappe)) befunde.push(`Paket ${bez}: Etappe "${p.etappe}" gibt es nicht.`);
    if (!istGanzzahl(p.welle, 1)) befunde.push(`Paket ${bez}: welle muss eine ganze Zahl ab 1 sein.`);
    if (!MODELLE.includes(p.modell)) befunde.push(`Paket ${bez}: modell "${p.modell}" ist nicht erlaubt (opus-5.5 oder haiku-5.5).`);
    if (!STUFEN.includes(p.stufe)) befunde.push(`Paket ${bez}: stufe muss 1, 2 oder 3 sein.`);
    if (!KLASSEN.includes(p.kostenklasse)) befunde.push(`Paket ${bez}: kostenklasse muss S, M oder L sein.`);
    if (!ARTEN.includes(p.art)) befunde.push(`Paket ${bez}: art muss pflicht oder kuer sein.`);
    if (!(Number.isInteger(p.wirkung) && p.wirkung >= 1 && p.wirkung <= 5)) befunde.push(`Paket ${bez}: wirkung muss eine ganze Zahl von 1 bis 5 sein.`);
    if (!STATUS_PAKET.includes(p.status)) befunde.push(`Paket ${bez}: status "${p.status}" ist nicht erlaubt.`);
    if (!istTextListe(p.schreibrechte)) befunde.push(`Paket ${bez}: schreibrechte müssen eine Textliste sein.`);
    if (!istTextListe(p.abhaengigkeiten)) befunde.push(`Paket ${bez}: abhaengigkeiten müssen eine Textliste sein.`);
    if (!istTextListe(p.anforderungen)) befunde.push(`Paket ${bez}: anforderungen müssen eine Textliste sein.`);
    if (!istZielListe(p.kriterien)) befunde.push(`Paket ${bez}: kriterien müssen Z-01 bis Z-22 sein.`);
    if (!istGanzzahl(p.versuche, 0)) befunde.push(`Paket ${bez}: versuche muss eine ganze Zahl ab 0 sein.`);
    if (!(p.grund === null || istText(p.grund))) befunde.push(`Paket ${bez}: grund muss null oder Text sein.`);
    if (!(p.commit === null || istText(p.commit))) befunde.push(`Paket ${bez}: commit muss null oder Text sein.`);
    if (!(p.massstab === null || istText(p.massstab))) befunde.push(`Paket ${bez}: massstab muss null oder Pfad sein.`);
    if (!(p.muster === null || istText(p.muster))) befunde.push(`Paket ${bez}: muster muss null oder Pfad sein.`);
    if (['blockiert', 'zurückgestellt'].includes(p.status) && !istText(p.grund)) befunde.push(`Paket ${bez}: Status ${p.status} braucht einen grund.`);
    if (p.status === 'committet' && !istText(p.commit)) befunde.push(`Paket ${bez}: Status committet braucht einen commit.`);
    if (istTextListe(p.anforderungen) && istZielListe(p.kriterien) && p.anforderungen.length + p.kriterien.length === 0) {
      befunde.push(`Paket ${bez}: nennt weder Anforderung noch Kriterium.`);
    }
    if (p.modell === 'haiku-5.5' && (!istText(p.massstab) || !istText(p.muster))) {
      befunde.push(`Paket ${bez}: Haiku-Paket braucht massstab und muster.`);
    }
  }

  // Abhängigkeiten, Zyklen, Vorrat und kritischer Pfad
  const graph = new Map();
  for (const p of gueltige) {
    const deps = istTextListe(p.abhaengigkeiten) ? p.abhaengigkeiten : [];
    for (const d of deps) {
      if (!kennungen.has(d)) befunde.push(`Paket ${p.kennung}: Abhängigkeit ${d} gibt es nicht.`);
    }
    graph.set(p.kennung, deps.filter((d) => kennungen.has(d)));
  }
  const zyklus = findeZyklus(graph);
  if (zyklus) befunde.push(`Zyklus bei den Abhängigkeiten: ${zyklus}.`);
  for (const name of ['kritischer_pfad', 'vorrat']) {
    const liste = plan[name];
    if (!istTextListe(liste)) { befunde.push(`${name} muss eine Textliste sein.`); continue; }
    for (const kennung of liste) {
      if (!kennungen.has(kennung)) befunde.push(`${name} nennt ${kennung}, dieses Paket gibt es nicht.`);
    }
  }

  // Jedes Kriterium Z-01 bis Z-22 hat mindestens ein Paket
  for (let n = 1; n <= ZAHL_KRITERIEN; n += 1) {
    const ziel = `Z-${String(n).padStart(2, '0')}`;
    if (!gueltige.some((p) => istZielListe(p.kriterien) && p.kriterien.includes(ziel))) {
      befunde.push(`Kriterium ${ziel} hat kein Paket.`);
    }
  }

  // Keine Datei in zwei Paketen derselben Etappe und Welle
  const belegung = new Map();
  for (const p of gueltige) {
    if (!istTextListe(p.schreibrechte)) continue;
    for (const datei of p.schreibrechte) {
      const schluessel = `${p.etappe}|${p.welle}|${datei}`;
      if (!belegung.has(schluessel)) belegung.set(schluessel, []);
      belegung.get(schluessel).push(p.kennung);
    }
  }
  for (const [schluessel, liste] of belegung) {
    if (liste.length < 2) continue;
    const [etappe, welle, datei] = schluessel.split('|');
    befunde.push(`Datei ${datei} steht in ${liste.join(' und ')} (Etappe ${etappe}, Welle ${welle}).`);
  }

  // Anforderungen aus ANF: jede ist gedeckt oder hat einen Endstatus
  if (anf === null) {
    befunde.push('ANFORDERUNGEN.json fehlt oder ist nicht lesbar, die Abdeckung der Anforderungen ist nicht geprüft.');
  } else if (anf !== undefined && !istListe(anf?.eintraege)) {
    befunde.push('ANFORDERUNGEN.json hat keine Eintragsliste.');
  } else if (anf !== undefined) {
    const eintraege = anf.eintraege;
    const anfKennungen = new Set(eintraege.map((e) => e?.kennung));
    const genannt = new Set();
    for (const p of gueltige) {
      for (const a of istTextListe(p.anforderungen) ? p.anforderungen : []) {
        genannt.add(a);
        if (!anfKennungen.has(a)) befunde.push(`Paket ${p.kennung} nennt die Anforderung ${a}, die es in ANFORDERUNGEN.json nicht gibt.`);
      }
    }
    for (const e of eintraege) {
      if (!e || !istText(e.kennung)) continue;
      if (!genannt.has(e.kennung) && !ENDSTATUS_ANF.includes(e.status)) {
        befunde.push(`Anforderung ${e.kennung} ist in keinem Paket genannt und hat keinen Endstatus.`);
      }
    }
  }

  // Haiku-Pakete nur mit erlaubtem Modell (oben geprüft), keine weiteren Regeln hier
  return befunde;
}

// === Befehle folgen als Nächstes: pruefen (Ausgabe), naechste, setze, stand, zeichne, abschluss ===
