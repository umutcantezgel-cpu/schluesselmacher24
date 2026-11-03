#!/usr/bin/env node
// kontingent.mjs – Schätzung des Kontingents aus den Sitzungsprotokollen (Auftrag 17, Tempomat).
// Aufruf: node kontingent.mjs [--seit <ISO-Zeit>] [--kalibrieren <fenster-%> --zeit <ISO-Zeit>] [--json <datei>]
// Liest nur. Quellen: alle *.jsonl unter /root/.claude/projects, *.output und *.jsonl unter /tmp/claude-0 (rekursiv).
// Gewichtung: Eingabe 1, Cache-Erstellung 1,25, Cache-Lesen 0,1, Ausgabe 5; Modell opus 5, haiku 1, andere 3.
// Gleiche message.id zählt einmal. Fenster: --seit, sonst Beginn aus der jüngsten Kalibrierung (solange es
//   noch läuft), sonst 5 Stunden vor dem Bezugszeitpunkt. Bezug: --zeit bei Kalibrierung, sonst jetzt.
// Kalibrierung: speichert je Punkt Zeit, Fensterbeginn, gewichtete Summe bis zur Zeit und gemessene Prozent in
//   protokolle/kontingent-kalibrierung.json. Faktor = Mittel der letzten drei Punkte (Prozent je gewichtetem Token).
// Ausgabe: Markdown auf stdout, JSON-Protokoll. Exit 0 Lauf fertig, 2 Bedienfehler, 1 technischer Fehler.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { PROTOKOLLE, argumente, zeitstempel, ordner } from './lib.mjs';

const GEWICHT_ART = { input: 1, cache_creation: 1.25, cache_read: 0.1, output: 5 };
const GEWICHT_MODELL = { opus: 5, haiku: 1, andere: 3 };
const FENSTER_MS = 5 * 60 * 60 * 1000;
const WURZELN = ['/root/.claude/projects', '/tmp/claude-0'];
const KALIBRIERUNG = path.join(PROTOKOLLE, 'kontingent-kalibrierung.json');
const ARTEN = Object.keys(GEWICHT_ART);
const MODELLE = Object.keys(GEWICHT_MODELL);

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const zahl = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const fmt = (n, stellen = 0) => Number(n).toLocaleString('de-DE', { maximumFractionDigits: stellen, minimumFractionDigits: stellen });
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

/** Alle Protokolldateien unter einer Wurzel, rekursiv. Unter /tmp nur *.output und *.jsonl. */
function dateienSammeln(ordnerPfad, ergebnis = []) {
  let eintraege;
  try {
    eintraege = readdirSync(ordnerPfad, { withFileTypes: true });
  } catch {
    return ergebnis;
  }
  for (const e of eintraege) {
    const p = path.join(ordnerPfad, e.name);
    if (e.isDirectory()) {
      dateienSammeln(p, ergebnis);
    } else if (e.isFile()) {
      const passt = ordnerPfad.startsWith('/tmp') ? /\.(output|jsonl)$/.test(e.name) : e.name.endsWith('.jsonl');
      if (passt) ergebnis.push(p);
    }
  }
  return ergebnis;
}

const familieVon = (modell) => (/opus/i.test(modell) ? 'opus' : /haiku/i.test(modell) ? 'haiku' : 'andere');

/** Liest die Nutzungseinträge einer Datei. Doppelte message.id werden übergangen. */
function eintraegeLesen(datei, stat, gesehen) {
  const liste = [];
  readFileSync(datei, 'utf8').split('\n').forEach((z, idx) => {
    if (!z.includes('"usage"')) return;
    let o;
    try {
      o = JSON.parse(z);
    } catch {
      stat.fehlerhaft += 1;
      return;
    }
    const m = o.message ?? o;
    const u = m?.usage;
    if (!u || typeof u !== 'object') return;
    const zeitMs = Date.parse(o.timestamp ?? m.timestamp ?? '');
    if (!Number.isFinite(zeitMs)) {
      stat.ohneZeit += 1;
      return;
    }
    const id = m.id ?? `${datei}#${idx + 1}`;
    if (gesehen.has(id)) {
      stat.doppelt += 1;
      return;
    }
    gesehen.add(id);
    liste.push({
      zeit: zeitMs,
      familie: familieVon(String(m.model ?? o.model ?? '')),
      input: zahl(u.input_tokens),
      cache_creation: zahl(u.cache_creation_input_tokens),
      cache_read: zahl(u.cache_read_input_tokens),
      output: zahl(u.output_tokens),
    });
  });
  return liste;
}

const leerArt = () => ({ roh: Object.fromEntries(ARTEN.map((a) => [a, 0])), gewichtet: 0 });

/** Summe der Einträge im Fenster [von, bis], getrennt nach Modellfamilie. */
function summiere(eintraege, von, bis) {
  const modelle = Object.fromEntries(MODELLE.map((m) => [m, leerArt()]));
  let anzahl = 0;
  for (const e of eintraege) {
    if (e.zeit < von || e.zeit > bis) continue;
    anzahl += 1;
    for (const a of ARTEN) modelle[e.familie].roh[a] += e[a];
  }
  let gesamt = 0;
  for (const m of MODELLE) {
    const eintrag = modelle[m];
    eintrag.gewichtet = GEWICHT_MODELL[m] * ARTEN.reduce((s, a) => s + GEWICHT_ART[a] * eintrag.roh[a], 0);
    gesamt += eintrag.gewichtet;
  }
  return { modelle, gesamt, anzahl };
}

function kalibrierungLesen() {
  if (!existsSync(KALIBRIERUNG)) return [];
  try {
    const daten = JSON.parse(readFileSync(KALIBRIERUNG, 'utf8'));
    return Array.isArray(daten.punkte) ? daten.punkte : [];
  } catch {
    return [];
  }
}

/**
 * Faktor aus den letzten bis zu drei Punkten als Verhältnis der Summen (Prozent gesamt / gewichtet gesamt).
 * So zählt jeder Punkt nach seiner Genauigkeit: Die Anzeige rundet auf ganze Prozent, ein Punkt mit 2 %
 * ist darum bis zu 25 % ungenau, einer mit 29 % unter 2 % (A-024). Vorher: ungewichtetes Mittel der Faktoren.
 */
function faktorAus(punkte) {
  const gueltig = punkte
    .filter((p) => p.gewichtet > 0 && p.prozent > 0)
    .sort((a, b) => Date.parse(a.zeit) - Date.parse(b.zeit));
  const letzte = gueltig.slice(-3);
  if (!letzte.length) return null;
  const prozent = letzte.reduce((s, p) => s + p.prozent, 0);
  const gewichtet = letzte.reduce((s, p) => s + p.gewichtet, 0);
  return { faktor: prozent / gewichtet, anzahl: letzte.length, punkte: letzte };
}

function main() {
  const args = argumente();
  for (const k of ['seit', 'zeit', 'kalibrieren', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const jetzt = Date.now();
  let seitMs = null;
  if (args.seit !== undefined) {
    seitMs = Date.parse(args.seit);
    if (!Number.isFinite(seitMs)) bedienfehler(`--seit „${args.seit}“ ist keine gültige ISO-Zeit`);
  }
  let zeitMs = null;
  if (args.zeit !== undefined) {
    zeitMs = Date.parse(args.zeit);
    if (!Number.isFinite(zeitMs)) bedienfehler(`--zeit „${args.zeit}“ ist keine gültige ISO-Zeit`);
  }
  let prozentKal = null;
  if (args.kalibrieren !== undefined) {
    prozentKal = Number(String(args.kalibrieren).replace(',', '.'));
    if (!Number.isFinite(prozentKal) || prozentKal <= 0 || prozentKal > 100) bedienfehler('--kalibrieren braucht einen Prozentwert über 0 und höchstens 100');
    if (zeitMs === null) bedienfehler('--kalibrieren braucht --zeit mit dem Zeitpunkt der Ablesung');
  }

  // Protokolle lesen
  const stat = { dateien: 0, fehlerhaft: 0, ohneZeit: 0, doppelt: 0 };
  const gesehen = new Set();
  const eintraege = [];
  for (const wurzel of WURZELN) {
    for (const datei of dateienSammeln(wurzel)) {
      stat.dateien += 1;
      eintraege.push(...eintraegeLesen(datei, stat, gesehen));
    }
  }

  // Fenster und Bezug
  const bezugMs = prozentKal !== null ? zeitMs : jetzt;
  const punkte = kalibrierungLesen().sort((a, b) => Date.parse(a.zeit) - Date.parse(b.zeit));
  const letzter = punkte[punkte.length - 1];
  let fensterQuelle;
  if (seitMs !== null) {
    fensterQuelle = '--seit';
  } else if (letzter && Date.parse(letzter.fensterbeginn) + FENSTER_MS > bezugMs) {
    seitMs = Date.parse(letzter.fensterbeginn);
    fensterQuelle = 'aus der jüngsten Kalibrierung';
  } else {
    seitMs = bezugMs - FENSTER_MS;
    fensterQuelle = 'vor 5 Stunden';
  }
  const bisMs = prozentKal !== null ? zeitMs : jetzt;
  const summe = summiere(eintraege, seitMs, bisMs);
  const iso = (ms) => new Date(ms).toISOString();

  const kopf = ['Modell', 'Gewicht', 'Eingabe', 'Cache-Erstellung', 'Cache-Lesen', 'Ausgabe', 'Gewichtete Summe'];
  const modellZeilen = MODELLE.map((m) => [
    m, GEWICHT_MODELL[m], fmt(summe.modelle[m].roh.input), fmt(summe.modelle[m].roh.cache_creation),
    fmt(summe.modelle[m].roh.cache_read), fmt(summe.modelle[m].roh.output), fmt(summe.modelle[m].gewichtet),
  ]);
  const zusammen = [`Gesamt`, '', ...ARTEN.map((a) => fmt(MODELLE.reduce((s, m) => s + summe.modelle[m].roh[a], 0))), fmt(summe.gesamt)];

  if (prozentKal !== null) {
    if (summe.gesamt <= 0) {
      console.log(`Kein Verbrauch im Fenster ${iso(seitMs)} bis ${iso(bisMs)}. Der Punkt wird nicht gespeichert.`);
      const protokoll = jsonSchreiben('kontingent', args, { modus: 'kalibrieren', gespeichert: false, summe: summe.gesamt, anzahl: summe.anzahl, stat });
      console.log(`\nJSON-Protokoll: ${protokoll}`);
      return;
    }
    const punkt = {
      zeit: iso(zeitMs), fensterbeginn: iso(seitMs), gewichtet: Math.round(summe.gesamt * 100) / 100,
      prozent: prozentKal, faktor: prozentKal / summe.gesamt,
    };
    const alle = [...punkte, punkt];
    writeFileSync(KALIBRIERUNG, `${JSON.stringify({
      hinweis: 'Punkte aus kontingent.mjs --kalibrieren. Faktor je Punkt = Prozent / gewichtete Summe von Fensterbeginn bis Zeit.',
      punkte: alle,
    }, null, 2)}\n`);
    const faktor = faktorAus(alle);
    console.log(`## Kalibrierung gespeichert\n`);
    console.log(`- Zeit ${punkt.zeit}, Fensterbeginn ${punkt.fensterbeginn} (${fensterQuelle})`);
    console.log(`- Gewichtete Summe ${fmt(punkt.gewichtet, 0)}, gemessene Prozent ${fmt(prozentKal, 1)} %`);
    console.log(`- Faktor dieses Punkts: ${fmt(punkt.faktor * 1e6, 3)} % je 1 Mio. gewichtete Token`);
    console.log(`- Mittel aus ${faktor.anzahl} Punkt(en): ${fmt(faktor.faktor * 1e6, 3)} % je 1 Mio. gewichtete Token`);
    console.log(`- Datei: ${KALIBRIERUNG}\n`);
  }

  // Schätzung (auch nach der Kalibrierung, damit der Punkt sichtbar gegengeprüft ist)
  const faktor = faktorAus(prozentKal !== null ? [...punkte, { zeit: iso(zeitMs), gewichtet: summe.gesamt, prozent: prozentKal }] : punkte);
  console.log(`## Kontingent-Schätzung\n`);
  console.log(`- Fenster: ${iso(seitMs)} bis ${iso(bisMs)} (Beginn ${fensterQuelle})`);
  console.log(`- Gewichtete Summe: ${fmt(summe.gesamt)} aus ${fmt(summe.anzahl)} Einträgen`);
  if (faktor) {
    const prozent = summe.gesamt * faktor.faktor;
    console.log(`- Geschätzt: ${fmt(prozent, 1)} % (Faktor ${fmt(faktor.faktor * 1e6, 3)} % je 1 Mio. gewichtete Token, ${faktor.anzahl} Punkt(e))`);
  } else {
    console.log('- Geschätzt: ohne Kalibrierung (keine Prozentangabe)');
  }
  console.log(`- Protokolle: ${stat.dateien} Dateien, doppelte message.id übersprungen ${fmt(stat.doppelt)}, ohne Zeitstempel ${fmt(stat.ohneZeit)}, fehlerhafte Zeilen ${fmt(stat.fehlerhaft)}\n`);
  console.log(tabelle(kopf, [...modellZeilen, zusammen]));
  const protokoll = jsonSchreiben('kontingent', args, {
    modus: prozentKal !== null ? 'kalibrieren' : 'schaetzen',
    fenster: { seit: iso(seitMs), bis: iso(bisMs), quelle: fensterQuelle },
    summe: { gewichtet: summe.gesamt, anzahl: summe.anzahl, modelle: summe.modelle },
    faktor: faktor ? { faktor: faktor.faktor, anzahl: faktor.anzahl } : null,
    stat,
  });
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

try {
  main();
} catch (e) {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
}
