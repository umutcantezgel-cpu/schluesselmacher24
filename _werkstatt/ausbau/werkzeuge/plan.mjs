#!/usr/bin/env node
// plan.mjs · Planwerkzeug des Ausbaulaufs (Auftrag 9)
//
// Reines Node-ESM ohne Abhängigkeiten. Importiert nichts aus lib.mjs,
// damit es ohne Playwright läuft.
//
// Befehle:
//   pruefen      Schema und Regeln von PLAN.json prüfen
//   naechste     bereite Pakete für den nächsten Start ausgeben (--plaetze n, --modell m, --auffuellen)
//   setze        Status, Commit, Grund oder Versuch eines Pakets setzen
//   stand        Zahlen für die Statuszeile
//   zeichne      PLAN.md als gerenderte Ansicht schreiben
//   abschluss    Abschlussprüfung nach Z-01 bis Z-22
//
// Optionen (für Tests): --plan <datei> --anf <datei> --abnahme <datei>
// Ausgabe für zeichne: --ausgabe <datei>

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const AUSBAU = resolve(HIER, '..');
const REPO_WURZEL = resolve(AUSBAU, '..', '..');

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

// --- Gemeinsame Hilfen ------------------------------------------------------------
const offen = (p) => p.status !== 'committet';
const erledigt = (p) => p.status === 'committet';
const pflichtPakete = (plan) => (plan.pakete ?? []).filter((p) => p.art === 'pflicht');
const kuerPakete = (plan) => (plan.pakete ?? []).filter((p) => p.art === 'kuer');

function fehler(text, code) {
  console.error(text);
  return code;
}

function lade(datei) {
  try {
    return { plan: leseJson(datei) };
  } catch (e) {
    const grund = e.code === 'ENOENT' ? 'Datei fehlt' : 'kein gültiges JSON';
    return { fehler: `${datei} konnte nicht gelesen werden (${grund}).` };
  }
}

function ladeAnf(o) {
  try {
    return leseJson(o.anf);
  } catch {
    return null;
  }
}

function leseTextOderNull(datei) {
  try {
    return readFileSync(datei, 'utf8');
  } catch {
    return null;
  }
}

// Früheste Etappe (in der Reihenfolge von etappen) mit einem offenen Pflichtpaket, sonst null.
export function aktuelleEtappe(plan) {
  for (const e of plan.etappen ?? []) {
    if (pflichtPakete(plan).some((p) => p.etappe === e.kennung && offen(p))) return e.kennung;
  }
  return null;
}

// Kleinste Welle mit offenen Paketen in dieser Etappe, sonst null.
export function kleinsteOffeneWelle(plan, etappe) {
  // Zurückgestellte Pakete (mit Grund, etwa „wartet auf Material“) halten die nächste Welle nicht auf.
  const wellen = (plan.pakete ?? []).filter((p) => p.etappe === etappe && offen(p) && p.status !== 'zurückgestellt').map((p) => p.welle);
  return wellen.length ? Math.min(...wellen) : null;
}

// Bereit: Status offen oder bereit und alle Abhängigkeiten abgenommen oder committet.
export function istBereit(plan, p) {
  const erfuellt = (dep) => {
    const d = (plan.pakete ?? []).find((q) => q.kennung === dep);
    // Zurückgestellt zählt wie erledigt: Das Paket ist mit Grund aus dem Lauf genommen (A-037).
    return Boolean(d) && ['abgenommen', 'committet', 'zurückgestellt'].includes(d.status);
  };
  return ['offen', 'bereit'].includes(p.status) && p.abhaengigkeiten.every(erfuellt);
}

// --- naechste ---------------------------------------------------------------------
// Etappe: aktuelle Etappe. Kür aus anderen Etappen nur, wenn die aktuelle keine bereiten Pakete hat.
// Welle: nur die kleinste offene Welle der jeweiligen Etappe.
// Mit --auffuellen (E2-PRUEFER-02, Szenario 5): reicht die aktuelle Etappe nicht für alle Plätze, kommen
// bereite Pflichtpakete späterer Etappen dazu (Abhängigkeiten erfüllt, kleinste offene Welle ihrer Etappe),
// früheste Etappe zuerst. Kür bleibt im Vorrat, solange irgendein Pflichtpaket bereit ist (Auftrag L2).
export function naechsteListe(plan, { plaetze = 4, modell = 'alle', auffuellen = false } = {}) {
  const aktuell = aktuelleEtappe(plan);
  const bereit = (plan.pakete ?? []).filter(
    (p) => istBereit(plan, p) && p.welle === kleinsteOffeneWelle(plan, p.etappe),
  );
  const etappenRang = new Map((plan.etappen ?? []).map((e, i) => [e.kennung, i]));
  const rang = (p) => (p.etappe === aktuell ? -1 : (etappenRang.get(p.etappe) ?? 999));
  let kandidaten = aktuell === null
    ? bereit.filter((p) => p.art === 'kuer')
    : bereit.filter((p) => p.etappe === aktuell || (auffuellen && p.art === 'pflicht'));
  if (aktuell !== null && kandidaten.length === 0) {
    kandidaten = bereit.filter((p) => p.art === 'kuer' && p.etappe !== aktuell);
  }
  const laufend = new Set((plan.pakete ?? []).filter((p) => p.status === 'läuft').flatMap((p) => p.schreibrechte));
  kandidaten = kandidaten.filter((p) => !p.schreibrechte.some((d) => laufend.has(d)));
  if (modell !== 'alle') kandidaten = kandidaten.filter((p) => p.modell === modell);
  kandidaten.sort((a, b) => (a.art === b.art ? 0 : a.art === 'pflicht' ? -1 : 1)
    || (auffuellen ? rang(a) - rang(b) : 0)
    || (b.wirkung - a.wirkung)
    || a.kennung.localeCompare(b.kennung));

  // Haiku-Pakete zählen gegen --plaetze, Opus-Pakete nicht. Keine gemeinsame Datei in der Auswahl.
  const gewaehlt = [];
  const belegt = new Set();
  let haiku = 0;
  for (const p of kandidaten) {
    if (p.schreibrechte.some((d) => belegt.has(d))) continue;
    if (p.modell === 'haiku-5.5') {
      if (haiku >= plaetze) continue;
      haiku += 1;
    }
    gewaehlt.push(p);
    for (const d of p.schreibrechte) belegt.add(d);
  }
  return { etappe: aktuell, welle: aktuell === null ? null : kleinsteOffeneWelle(plan, aktuell), pakete: gewaehlt };
}

function druckeNaechste(ergebnis) {
  if (ergebnis.pakete.length === 0) return 'Keine bereiten Pakete.';
  const kopf = ergebnis.etappe === null
    ? 'Keine offenen Pflichtpakete mehr. Auswahl aus der Kür.'
    : `Etappe ${ergebnis.etappe} · Welle ${ergebnis.welle}`;
  const zeilen = [
    ['Kennung', 'Titel', 'Modell', 'Klasse', 'Schreibrechte (Zahl)'],
    ...ergebnis.pakete.map((p) => [
      p.kennung,
      p.titel,
      p.modell,
      p.kostenklasse,
      String(p.schreibrechte.length)
        + (p.modell === 'haiku-5.5' && p.massstab && !existsSync(resolve(REPO_WURZEL, p.massstab)) ? ' · PAKETDATEI FEHLT' : ''),
    ]),
  ];
  const breiten = zeilen[0].map((_, i) => Math.max(...zeilen.map((z) => z[i].length)));
  const tabelle = zeilen.map((z) => z.map((t, i) => t.padEnd(breiten[i])).join(' · ').trimEnd());
  return [kopf, ...tabelle].join('\n');
}

function befehlNaechste(o, a) {
  const geladen = lade(o.plan);
  if (geladen.fehler) return fehler(geladen.fehler, 1);
  const befunde = pruefePlan(geladen.plan);
  if (befunde.length > 0) {
    console.log(`PLAN-PRÜFUNG: ${befunde.length} Befunde`);
    for (const b of befunde) console.log(`- ${b}`);
    return fehler('Der Plan ist nicht gültig. Erst korrigieren, dann naechste aufrufen.', 1);
  }
  const plaetze = a.plaetze === undefined ? 4 : (typeof a.plaetze === 'string' ? Number(a.plaetze) : NaN);
  if (!Number.isInteger(plaetze) || plaetze < 0) return fehler('--plaetze braucht eine ganze Zahl ab 0.', 2);
  const modell = a.modell === undefined ? 'alle' : a.modell;
  if (!['haiku-5.5', 'opus-5.5', 'alle'].includes(modell)) {
    return fehler('--modell ist haiku-5.5, opus-5.5 oder alle.', 2);
  }
  console.log(druckeNaechste(naechsteListe(geladen.plan, { plaetze, modell, auffuellen: a.auffuellen === true })));
  return 0;
}

// --- setze ------------------------------------------------------------------------
function befehlSetze(o, a) {
  const [kennung, status] = a._.slice(1);
  if (!kennung || !status) {
    return fehler('Aufruf: plan.mjs setze <kennung> <status> [--commit sha] [--grund text] [--versuch]', 2);
  }
  if (!STATUS_PAKET.includes(status)) {
    return fehler(`Status "${status}" gibt es nicht. Erlaubt: ${STATUS_PAKET.join(', ')}.`, 2);
  }
  for (const option of ['commit', 'grund']) {
    if (a[option] === true) return fehler(`--${option} braucht einen Wert.`, 2);
  }
  const geladen = lade(o.plan);
  if (geladen.fehler) return fehler(geladen.fehler, 1);
  const plan = geladen.plan;
  const p = (plan.pakete ?? []).find((q) => q.kennung === kennung);
  if (!p) return fehler(`Paket ${kennung} gibt es nicht.`, 1);
  if (a.commit) p.commit = a.commit;
  if (a.grund) p.grund = a.grund;
  if (a.versuch) p.versuche = (p.versuche ?? 0) + 1;
  p.status = status;
  if (status === 'committet' && !istText(p.commit)) {
    return fehler('Status committet braucht --commit mit der Commit-Kennung.', 1);
  }
  if (['blockiert', 'zurückgestellt'].includes(status) && !istText(p.grund)) {
    return fehler(`Status ${status} braucht --grund mit einer Begründung.`, 1);
  }
  plan.stand = new Date().toISOString();
  schreibeJson(o.plan, plan);
  console.log(`Paket ${kennung}: Status ${status} gesetzt.`);
  return 0;
}

// --- stand ------------------------------------------------------------------------
// Etappe n/m zählt ab 1. Wenn alle Pflichtpakete committet sind, steht dort m/m und die Welle ist 0.
export function kennzahlen(plan) {
  const pakete = plan.pakete ?? [];
  const etappen = plan.etappen ?? [];
  const aktuell = aktuelleEtappe(plan);
  const pflicht = pflichtPakete(plan);
  const kuer = kuerPakete(plan);
  return {
    etappe: aktuell,
    position: aktuell === null ? etappen.length : etappen.findIndex((e) => e.kennung === aktuell) + 1,
    etappeGesamt: etappen.length,
    welle: aktuell === null ? 0 : (kleinsteOffeneWelle(plan, aktuell) ?? 0),
    pflichtErledigt: pflicht.filter(erledigt).length,
    pflichtGesamt: pflicht.length,
    kuerErledigt: kuer.filter(erledigt).length,
    kuerGesamt: kuer.length,
    laufend: pakete.filter((p) => p.status === 'läuft'),
    blockiert: pakete.filter((p) => p.status === 'blockiert'),
  };
}

export function statusZeile(k) {
  return `Etappe ${k.position}/${k.etappeGesamt} · Welle ${k.welle} · Pflicht ${k.pflichtErledigt}/${k.pflichtGesamt} · Kür ${k.kuerErledigt}/${k.kuerGesamt} · läuft ${k.laufend.length} · blockiert ${k.blockiert.length}`;
}

function befehlStand(o, a) {
  const geladen = lade(o.plan);
  if (geladen.fehler) return fehler(geladen.fehler, 1);
  const k = kennzahlen(geladen.plan);
  if (a.zeile) {
    console.log(statusZeile(k));
    return 0;
  }
  const zeilen = [
    k.etappe === null ? 'Etappe: keine offene Pflichtetappe, alle Pflichtpakete sind committet.'
      : `Etappe: ${k.etappe} (${k.position} von ${k.etappeGesamt})`,
    `Welle: ${k.welle}`,
    `Pflicht: ${k.pflichtErledigt} von ${k.pflichtGesamt} committet`,
    `Kür: ${k.kuerErledigt} von ${k.kuerGesamt} committet`,
    `Laufend (${k.laufend.length}): ${k.laufend.map((p) => p.kennung).join(', ') || 'keine'}`,
    `Blockiert (${k.blockiert.length}): ${k.blockiert.map((p) => `${p.kennung} (${p.grund ?? 'ohne Grund'})`).join(', ') || 'keine'}`,
  ];
  console.log(zeilen.join('\n'));
  return 0;
}

// --- pruefen ----------------------------------------------------------------------
function befehlPruefen(o) {
  const geladen = lade(o.plan);
  if (geladen.fehler) {
    console.log('PLAN-PRÜFUNG: 1 Befund');
    console.log(`- ${geladen.fehler}`);
    return 1;
  }
  const befunde = pruefePlan(geladen.plan, ladeAnf(o));
  if (befunde.length === 0) {
    console.log('PLAN-PRÜFUNG: OK');
    return 0;
  }
  console.log(`PLAN-PRÜFUNG: ${befunde.length} Befunde`);
  for (const b of befunde) console.log(`- ${b}`);
  return 1;
}

// --- zeichne ----------------------------------------------------------------------
const zelle = (x) => String(x ?? '').replace(/\|/g, '\\|');

export function renderePlan(plan) {
  const k = kennzahlen(plan);
  const zeilen = ['# Plan des Ausbaulaufs', '', `Stand: ${plan.stand}`, '', statusZeile(k), ''];
  for (const e of plan.etappen ?? []) {
    zeilen.push(
      `## ${e.kennung} · ${e.ziel}`, '',
      `Tor: ${e.tor}`,
      `Kriterien: ${e.kriterien.join(', ') || 'keine'}`,
      `Geplante Tage: ${e.tage}`, '',
    );
    const pakete = (plan.pakete ?? []).filter((p) => p.etappe === e.kennung);
    if (pakete.length === 0) {
      zeilen.push('Keine Pakete.', '');
      continue;
    }
    const wellen = [...new Set(pakete.map((p) => p.welle))].sort((x, y) => x - y);
    for (const w of wellen) {
      zeilen.push(
        `### Welle ${w}`, '',
        '| Kennung | Titel | Modell | Klasse | Art | Wirkung | Status | Commit |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
      );
      for (const p of pakete.filter((q) => q.welle === w)) {
        const spalten = [p.kennung, p.titel, p.modell, p.kostenklasse, p.art, p.wirkung, p.status, p.commit];
        zeilen.push(`| ${spalten.map(zelle).join(' | ')} |`);
      }
      zeilen.push('');
    }
  }
  zeilen.push('## Kritischer Pfad', '', (plan.kritischer_pfad ?? []).join(' → ') || 'keiner', '');
  zeilen.push('## Vorrat', '', (plan.vorrat ?? []).join(', ') || 'keiner', '');
  return zeilen.join('\n');
}

function befehlZeichne(o) {
  const geladen = lade(o.plan);
  if (geladen.fehler) return fehler(geladen.fehler, 1);
  const befunde = pruefePlan(geladen.plan);
  if (befunde.length > 0) {
    return fehler(`Der Plan ist nicht gültig (${befunde.length} Befunde). PLAN.md wird nicht geschrieben.`, 1);
  }
  const ziel = o.ausgabe ?? STANDARD.md;
  schreibeAtomar(ziel, renderePlan(geladen.plan));
  console.log(`Geschrieben: ${ziel}`);
  return 0;
}

// --- abschluss --------------------------------------------------------------------
// Liest die Zeilen | Z-01 | … | Status | Beleg | und gibt Kennung und Status (vorletzte Spalte) zurück.
export function leseAbnahme(text) {
  const zeilen = [];
  for (const roh of text.split(/\r?\n/)) {
    const t = roh.trim();
    if (!t.startsWith('|')) continue;
    const zellen = t.replace(/^\|/, '').replace(/\|$/, '').split('|').map((z) => z.trim());
    if (!/^Z-\d{2}$/.test(zellen[0])) continue;
    zeilen.push({ kennung: zellen[0], status: zellen.length >= 3 ? zellen[zellen.length - 2] : null });
  }
  return zeilen;
}

export function abschlussLuecken(plan, anf, abnahmeText) {
  const luecken = [];
  for (const p of pflichtPakete(plan)) {
    if (!erledigt(p)) luecken.push(`Pflichtpaket ${p.kennung} ist nicht committet (Status ${p.status}).`);
  }
  if (anf === null) {
    luecken.push('ANFORDERUNGEN.json fehlt oder ist nicht lesbar.');
  } else {
    const eintraege = istListe(anf.eintraege) ? anf.eintraege : [];
    for (const e of eintraege) {
      if (!ENDSTATUS_ANF.includes(e?.status)) {
        luecken.push(`Anforderung ${e?.kennung} hat keinen Endstatus (Status ${e?.status}).`);
      } else if (!istText(e.beleg)) {
        luecken.push(`Anforderung ${e.kennung} hat keinen Beleg.`);
      }
    }
  }
  if (abnahmeText === null) {
    luecken.push('ABNAHME.md fehlt oder ist nicht lesbar.');
  } else {
    const zeilen = leseAbnahme(abnahmeText);
    const ausnahmen = [];
    for (let n = 1; n <= ZAHL_KRITERIEN; n += 1) {
      const z = `Z-${String(n).padStart(2, '0')}`;
      const treffer = zeilen.filter((r) => r.kennung === z);
      if (treffer.length === 0) {
        luecken.push(`${z} fehlt in ABNAHME.md.`);
        continue;
      }
      if (treffer.length > 1) luecken.push(`${z} steht mehrfach in ABNAHME.md.`);
      const status = treffer[0].status;
      if (!['erfüllt', 'AUSNAHME', 'UMGEBUNGSAUSNAHME'].includes(status)) {
        luecken.push(`${z} hat den Status "${status}" (erlaubt: erfüllt, AUSNAHME, UMGEBUNGSAUSNAHME).`);
      }
      if (status === 'AUSNAHME') {
        ausnahmen.push(z);
        if (AUSNAHME_VERBOTEN.includes(z)) luecken.push(`${z} darf keine AUSNAHME haben.`);
      }
    }
    if (ausnahmen.length > MAX_AUSNAHMEN) {
      luecken.push(`Es gibt ${ausnahmen.length} AUSNAHME, erlaubt sind höchstens ${MAX_AUSNAHMEN} (${ausnahmen.join(', ')}).`);
    }
  }
  return luecken;
}

function befehlAbschluss(o) {
  const geladen = lade(o.plan);
  const luecken = geladen.fehler ? [geladen.fehler] : abschlussLuecken(
    geladen.plan, ladeAnf(o), leseTextOderNull(o.abnahme),
  );
  if (luecken.length === 0) {
    console.log('ABSCHLUSS-PRÜFUNG: BEREIT');
    return 0;
  }
  console.log('ABSCHLUSS-PRÜFUNG: LÜCKEN');
  for (const l of luecken) console.log(`- ${l}`);
  return 1;
}

// --- Einstieg ---------------------------------------------------------------------
const BEFEHLE = {
  pruefen: befehlPruefen,
  naechste: befehlNaechste,
  setze: befehlSetze,
  stand: befehlStand,
  zeichne: befehlZeichne,
  abschluss: befehlAbschluss,
};

export function main(argv) {
  const a = argumente(argv);
  const befehl = a._[0];
  if (!befehl || !Object.hasOwn(BEFEHLE, befehl)) {
    return fehler('Aufruf: plan.mjs pruefen | naechste | setze | stand | zeichne | abschluss [Optionen]', 2);
  }
  return BEFEHLE[befehl](optionenAus(a), a);
}

const istHauptdatei = Boolean(process.argv[1])
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (istHauptdatei) process.exitCode = main(process.argv.slice(2));
