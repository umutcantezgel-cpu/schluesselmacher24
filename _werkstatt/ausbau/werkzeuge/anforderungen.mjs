#!/usr/bin/env node
// anforderungen.mjs · Anforderungs-Spur des Ausbaulaufs (Auftrag 3)
//
// Reines Node-ESM ohne Abhängigkeiten. Importiert nichts aus lib.mjs,
// damit es ohne Playwright läuft.
//
// Befehle:
//   pruefen                   ANFORDERUNGEN.json prüfen, Zahl der belegten Einträge ausgeben
//   zeichne                   ANFORDERUNGEN.md schreiben
//   zusammenfuehren <datei…>  Teildateien {"quelle", "eintraege"} an ANFORDERUNGEN.json anfügen
//
// Optionen (für Tests): --anf <datei>; zeichne zusätzlich --ausgabe <datei>

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const AUSBAU = resolve(HIER, '..');

const STANDARD = {
  anf: join(AUSBAU, 'ANFORDERUNGEN.json'),
  md: join(AUSBAU, 'ANFORDERUNGEN.md'),
};

const QUELLEN = ['G', 'L', 'EL', 'M', 'E', 'K'];
const QUELLEN_NAME = {
  G: 'Gespräch (Abschnitt 4)',
  L: 'Projektleitfaden v2.1',
  EL: 'Ergänzender Leitfaden',
  M: 'Offene Punkte MENSCHEN',
  E: 'Offene Befunde EVALUIERUNG',
  K: 'Kanten aus Abschnitt 13',
};
const STATUS = ['offen', 'in Arbeit', 'umgesetzt', 'später', 'menschensache', 'entfällt'];
const ENDSTATUS = ['umgesetzt', 'später', 'menschensache', 'entfällt'];
const BESTAND = ['vorhanden', 'teilweise', 'fehlt', 'nicht pruefbar'];
const SPAET_ERLAUBT = ['G-21', 'G-50'];
const KUERZUNG = 120;

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

function optionenAus(a) {
  return {
    anf: a.anf ? resolve(a.anf) : STANDARD.anf,
    ausgabe: a.ausgabe ? resolve(a.ausgabe) : null,
  };
}

function fehler(text, code) {
  console.error(text);
  return code;
}

// --- Prüfen ------------------------------------------------------------------------
const istText = (x) => typeof x === 'string' && x.trim() !== '';
const istTextListe = (x) => Array.isArray(x) && x.every(istText);

// Prüft einen Eintrag nach Schema und den Regeln für später und entfällt.
export function pruefeEintrag(e, bez) {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return [`${bez} ist kein Objekt.`];
  const b = [];
  if (!istText(e.kennung)) b.push(`${bez}: kennung fehlt.`);
  if (!QUELLEN.includes(e.quelle)) b.push(`${bez}: quelle "${e.quelle}" ist nicht erlaubt (G, L, EL, M, E, K).`);
  for (const feld of ['fundstelle', 'inhalt']) {
    if (!istText(e[feld])) b.push(`${bez}: ${feld} fehlt.`);
  }
  if (!(e.bestand === null || BESTAND.includes(e.bestand))) {
    b.push(`${bez}: bestand "${e.bestand}" ist nicht erlaubt.`);
  }
  if (!(e.bestand_fundstelle === null || istText(e.bestand_fundstelle))) {
    b.push(`${bez}: bestand_fundstelle muss null oder Text sein.`);
  }
  if (!STATUS.includes(e.status)) b.push(`${bez}: status "${e.status}" ist nicht erlaubt.`);
  if (!istTextListe(e.pakete)) b.push(`${bez}: pakete muss eine Textliste sein.`);
  if (!(e.beleg === null || istText(e.beleg))) b.push(`${bez}: beleg muss null oder Text sein.`);
  if (!(e.gruppe === null || istText(e.gruppe))) b.push(`${bez}: gruppe muss null oder Text sein.`);
  if (ENDSTATUS.includes(e.status) && !istText(e.beleg)) {
    b.push(`${bez}: Endstatus ${e.status} braucht einen beleg.`);
  }
  if (e.status === 'später' && !SPAET_ERLAUBT.includes(e.kennung)) {
    b.push(`${bez}: später ist nur für G-21 und G-50 erlaubt.`);
  }
  if (e.status === 'entfällt' && !(istText(e.beleg) && /ENTSCHEIDUNGEN\.md#\S+/.test(e.beleg))) {
    b.push(`${bez}: entfällt braucht im beleg einen Verweis ENTSCHEIDUNGEN.md#….`);
  }
  return b;
}

// Prüft die ganze Datei. belegt = Einträge mit Endstatus und beleg.
export function pruefeAnf(anf) {
  if (!anf || typeof anf !== 'object' || Array.isArray(anf)) {
    return { befunde: ['ANFORDERUNGEN.json ist kein Objekt.'], gesamt: 0, belegt: 0 };
  }
  const befunde = [];
  if (anf.version !== 1) befunde.push('version muss 1 sein.');
  if (!istText(anf.stand) || Number.isNaN(Date.parse(anf.stand))) {
    befunde.push('stand fehlt oder ist keine ISO-Zeit.');
  }
  if (!Array.isArray(anf.eintraege)) {
    befunde.push('eintraege fehlt oder ist keine Liste.');
    return { befunde, gesamt: 0, belegt: 0 };
  }
  const kennungen = new Set();
  for (const [i, e] of anf.eintraege.entries()) {
    const bez = istText(e?.kennung) ? e.kennung : `eintraege[${i}]`;
    befunde.push(...pruefeEintrag(e, bez));
    if (istText(e?.kennung)) {
      if (kennungen.has(e.kennung)) befunde.push(`Kennung ${e.kennung} ist doppelt.`);
      kennungen.add(e.kennung);
    }
  }
  const belegt = anf.eintraege.filter((e) => ENDSTATUS.includes(e?.status) && istText(e?.beleg)).length;
  return { befunde, gesamt: anf.eintraege.length, belegt };
}

// Zahlen je Quelle: Gesamt, belegt und je Status.
export function zahlen(anf) {
  const eintraege = Array.isArray(anf?.eintraege) ? anf.eintraege : [];
  const zeilen = QUELLEN.map((q) => ({
    quelle: q,
    gesamt: 0,
    belegt: 0,
    status: Object.fromEntries(STATUS.map((s) => [s, 0])),
  }));
  for (const e of eintraege) {
    const zeile = zeilen.find((z) => z.quelle === e?.quelle);
    if (!zeile) continue;
    zeile.gesamt += 1;
    if (STATUS.includes(e.status)) zeile.status[e.status] += 1;
    if (ENDSTATUS.includes(e.status) && istText(e.beleg)) zeile.belegt += 1;
  }
  return zeilen;
}

function befehlPruefen(o) {
  const geladen = lade(o.anf);
  if (geladen.fehler) {
    console.log('ANFORDERUNGEN-PRÜFUNG: 1 Befund');
    console.log(`- ${geladen.fehler}`);
    return 1;
  }
  const { befunde, gesamt, belegt } = pruefeAnf(geladen.plan);
  if (befunde.length > 0) {
    console.log(`ANFORDERUNGEN-PRÜFUNG: ${befunde.length} Befunde`);
    for (const b of befunde) console.log(`- ${b}`);
    return 1;
  }
  const je = zahlen(geladen.plan).map((z) => `${z.quelle} ${z.belegt}/${z.gesamt}`).join(' · ');
  console.log(`ANFORDERUNGEN-PRÜFUNG: OK · belegt ${belegt}/${gesamt}`);
  console.log(`Je Quelle belegt/gesamt: ${je}`);
  return 0;
}

function lade(datei) {
  try {
    return { plan: leseJson(datei) };
  } catch (e) {
    const grund = e.code === 'ENOENT' ? 'Datei fehlt' : 'kein gültiges JSON';
    return { fehler: `${datei} konnte nicht gelesen werden (${grund}).` };
  }
}

// --- Zeichnen ----------------------------------------------------------------------
// Zeilenumbrüche werden zu Leerzeichen, Trennstriche in Zellen werden maskiert.
const normal = (x) => String(x ?? '').replace(/\s*\n\s*/g, ' ');
const zelle = (x) => normal(x).replace(/\|/g, '\\|');

// Kürzt auf höchstens KUERZUNG Zeichen (Unicode-Zeichen); das letzte ist dann "…".
export function kuerzen(text) {
  const zeichen = Array.from(normal(text));
  return zeichen.length > KUERZUNG ? `${zeichen.slice(0, KUERZUNG - 1).join('')}…` : zeichen.join('');
}

export function rendereAnf(anf) {
  const eintraege = anf.eintraege;
  const { gesamt, belegt } = pruefeAnf(anf);
  const zeilen = [
    '# Anforderungen des Ausbaulaufs', '',
    `Stand: ${anf.stand}`, '',
    `Einträge: ${gesamt} · belegt: ${belegt}`, '',
    '| Quelle | Einträge | belegt | ' + STATUS.join(' | ') + ' |',
    '| --- | --- | --- | ' + STATUS.map(() => '---').join(' | ') + ' |',
  ];
  for (const z of zahlen(anf)) {
    const spalten = [z.quelle, z.gesamt, z.belegt, ...STATUS.map((s) => z.status[s])];
    zeilen.push(`| ${spalten.map(zelle).join(' | ')} |`);
  }
  zeilen.push('');
  for (const q of QUELLEN) {
    const liste = eintraege.filter((e) => e?.quelle === q);
    if (liste.length === 0) continue;
    zeilen.push(
      `## ${q} · ${QUELLEN_NAME[q]}`, '',
      '| Kennung | Inhalt | Bestand | Status | Pakete | Beleg |',
      '| --- | --- | --- | --- | --- | --- |',
    );
    for (const e of liste) {
      const spalten = [e.kennung, kuerzen(e.inhalt), e.bestand ?? 'nicht angegeben', e.status, (e.pakete ?? []).join(', '), e.beleg ?? ''];
      zeilen.push(`| ${spalten.map(zelle).join(' | ')} |`);
    }
    zeilen.push('');
  }
  return zeilen.join('\n');
}

function befehlZeichne(o) {
  const geladen = lade(o.anf);
  if (geladen.fehler) return fehler(geladen.fehler, 1);
  const { befunde } = pruefeAnf(geladen.plan);
  if (befunde.length > 0) {
    return fehler(`ANFORDERUNGEN.json ist nicht gültig (${befunde.length} Befunde). ANFORDERUNGEN.md wird nicht geschrieben.`, 1);
  }
  const ziel = o.ausgabe ?? STANDARD.md;
  schreibeAtomar(ziel, rendereAnf(geladen.plan));
  console.log(`Geschrieben: ${ziel}`);
  return 0;
}

// --- zusammenfuehren ----------------------------------------------------------------
// Fehlt ANFORDERUNGEN.json, startet die Datei leer. Gibt es Befunde, wird nichts geschrieben.
function befehlZusammenfuehren(o, a) {
  const dateien = a._.slice(1);
  if (dateien.length === 0) {
    return fehler('Aufruf: anforderungen.mjs zusammenfuehren <datei…> [--anf <datei>]', 2);
  }
  let anf = { version: 1, stand: new Date().toISOString(), eintraege: [] };
  if (existsSync(o.anf)) {
    const geladen = lade(o.anf);
    if (geladen.fehler) return fehler(geladen.fehler, 1);
    const vorpruefung = pruefeAnf(geladen.plan);
    if (vorpruefung.befunde.length > 0) {
      console.log(`ANFORDERUNGEN-PRÜFUNG: ${vorpruefung.befunde.length} Befunde`);
      for (const b of vorpruefung.befunde) console.log(`- ${b}`);
      return fehler('ANFORDERUNGEN.json ist nicht gültig. Nichts wurde geschrieben.', 1);
    }
    anf = geladen.plan;
  }

  const befunde = [];
  const neu = [];
  for (const datei of dateien) {
    const teil = lade(resolve(datei));
    if (teil.fehler) {
      befunde.push(teil.fehler);
      continue;
    }
    const kopf = teil.plan;
    if (!kopf || typeof kopf !== 'object' || !QUELLEN.includes(kopf.quelle) || !Array.isArray(kopf.eintraege)) {
      befunde.push(`${datei}: Format ist {"quelle", "eintraege"}, quelle muss G, L, EL, M, E oder K sein.`);
      continue;
    }
    for (const [i, roh] of kopf.eintraege.entries()) {
      const eintrag = roh && typeof roh === 'object' && !Array.isArray(roh) ? { quelle: kopf.quelle, ...roh } : roh;
      const bez = istText(eintrag?.kennung) ? eintrag.kennung : `${datei} eintraege[${i}]`;
      const pruef = pruefeEintrag(eintrag, bez);
      if (eintrag && typeof eintrag === 'object' && eintrag.quelle !== kopf.quelle) {
        pruef.push(`${bez}: quelle ${eintrag.quelle} passt nicht zur Datei (${kopf.quelle}).`);
      }
      befunde.push(...pruef);
      neu.push({ eintrag, datei });
    }
  }
  if (befunde.length > 0) {
    console.log(`ANFORDERUNGEN-PRÜFUNG: ${befunde.length} Befunde`);
    for (const b of befunde) console.log(`- ${b}`);
    return fehler('Nichts wurde geschrieben.', 1);
  }

  // Bestehende Kennungen bleiben unverändert. Dubletten werden gemeldet und nicht übernommen.
  const vorhanden = new Set(anf.eintraege.map((e) => e.kennung));
  const hinzu = [];
  for (const { eintrag, datei } of neu) {
    if (vorhanden.has(eintrag.kennung)) {
      console.log(`Dublette, bleibt unverändert: ${eintrag.kennung} aus ${datei}`);
      continue;
    }
    vorhanden.add(eintrag.kennung);
    hinzu.push(eintrag);
  }
  if (hinzu.length > 0) {
    anf.eintraege.push(...hinzu);
    anf.stand = new Date().toISOString();
    schreibeJson(o.anf, anf);
  }
  console.log(`Neue Einträge: ${hinzu.length}`);
  return 0;
}

// --- Einstieg ----------------------------------------------------------------------
const BEFEHLE = {
  pruefen: befehlPruefen,
  zeichne: befehlZeichne,
  zusammenfuehren: befehlZusammenfuehren,
};

export function main(argv) {
  const a = argumente(argv);
  const befehl = a._[0];
  if (!befehl || !Object.hasOwn(BEFEHLE, befehl)) {
    return fehler('Aufruf: anforderungen.mjs pruefen | zeichne | zusammenfuehren <datei…> [Optionen]', 2);
  }
  return BEFEHLE[befehl](optionenAus(a), a);
}

const istHauptdatei = Boolean(process.argv[1])
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (istHauptdatei) process.exitCode = main(process.argv.slice(2));
