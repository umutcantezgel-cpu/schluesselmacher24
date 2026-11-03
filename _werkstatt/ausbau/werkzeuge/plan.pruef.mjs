// plan.pruef.mjs · Selbsttest für plan.mjs und anforderungen.mjs (Auftrag 9, Schritt 3)
//
// Aufruf: node --test _werkstatt/ausbau/werkzeuge/plan.pruef.mjs
// Legt erfundene Testdateien unter werkzeuge/testdaten/ an. Projektdateien bleiben unberührt.
// Jede Regel hat einen Test mit Positivfall und Negativfall. Die Kennung vorne im Testnamen
// (P-01, N-03, S-02, …) ist die Zählung der Regeln für den Bericht.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findeZyklus } from './plan.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const PLAN_JS = join(HIER, 'plan.mjs');
const ANF_JS = join(HIER, 'anforderungen.mjs');
const DATEN = join(HIER, 'testdaten');
const AUSGABE = join(DATEN, 'ausgabe');

const PLAN_OK = join(DATEN, 'plan.json');
const PLAN_FEHLER = join(DATEN, 'plan-fehler.json');
const ANF = join(DATEN, 'anf.json');
const ABNAHME = join(DATEN, 'abnahme.md');
const ANF_FEHLT = join(DATEN, 'gibt-es-nicht.json');

// --- Helfer -----------------------------------------------------------------------
function lauf(skript, args) {
  const r = spawnSync(process.execPath, [skript, ...args], { encoding: 'utf8' });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

// plan.mjs mit den Testdateien. Die Optionen überschreiben die Standardpfade.
const planCli = (args, { plan = PLAN_OK, anf = ANF, abnahme = ABNAHME } = {}) =>
  lauf(PLAN_JS, ['--plan', plan, '--anf', anf, '--abnahme', abnahme, ...args]);

const anfCli = (args, { anf = ANF } = {}) => lauf(ANF_JS, ['--anf', anf, ...args]);

const json = (x) => JSON.stringify(x, null, 1);
const finde = (objekt, kennung) => objekt.pakete.find((p) => p.kennung === kennung);

function schreibe(name, inhalt) {
  const p = join(DATEN, name);
  writeFileSync(p, typeof inhalt === 'string' ? inhalt : json(inhalt));
  return p;
}

// Erzeugt eine Variante eines Basisobjekts unter einem eigenen Namen.
function variante(name, aendern, basis = basisPlan) {
  const objekt = basis();
  aendern(objekt);
  return schreibe(name, objekt);
}

// Entfernt eine eigene Ausgabedatei, damit ein Negativtest prüfen kann, dass nichts entsteht.
function ausgabeLoeschen(datei) {
  if (existsSync(datei)) unlinkSync(datei);
}

// --- Erfundene Testdaten ------------------------------------------------------------
// Paket mit Vorgaben. Haiku-Pakete bekommen massstab und muster, sofern nichts anderes gesetzt ist.
function paket(extra) {
  return {
    titel: 'Testpaket',
    rolle: 'Baumeister',
    modell: 'haiku-5.5',
    stufe: 1,
    kostenklasse: 'S',
    schreibrechte: [],
    abhaengigkeiten: [],
    anforderungen: [],
    kriterien: [],
    art: 'pflicht',
    wirkung: 3,
    status: 'offen',
    grund: null,
    versuche: 0,
    commit: null,
    massstab: 'muster/massstab.md',
    muster: 'muster/beispiel.md',
    ...extra,
  };
}

// Korrigierter Testplan: 2 Etappen, 6 Pakete, Abhängigkeiten, alle Z-01 bis Z-22 abgedeckt.
// Stand: E1 hat zwei Pakete committet, E1-C-03 und E1-D-04 sind offen (Welle 2).
function basisPlan() {
  return {
    version: 1,
    stand: '2026-11-02T20:00:00.000Z',
    etappen: [
      {
        kennung: 'E1', ziel: 'Testfundament', eingang: 'Leerer Bestand', ausgang: 'Erste Bausteine',
        tor: 'Alle Prüfungen grün', kriterien: ['Z-01', 'Z-02', 'Z-03'], tage: 2,
      },
      {
        kennung: 'E2', ziel: 'Testausbau', eingang: 'Erste Bausteine', ausgang: 'Zweite Bausteine',
        tor: 'Probelauf bestanden', kriterien: ['Z-17', 'Z-18', 'Z-19'], tage: 1.5,
      },
    ],
    pakete: [
      paket({
        kennung: 'E1-A-01', titel: 'Erster Baustein', etappe: 'E1', welle: 1, modell: 'opus-5.5', stufe: 2,
        kostenklasse: 'M', schreibrechte: ['src/alpha.ts'], anforderungen: ['G-01'],
        kriterien: ['Z-01', 'Z-02', 'Z-03', 'Z-04'], wirkung: 5, status: 'committet', versuche: 1, commit: 'a1b2c3d',
      }),
      paket({
        kennung: 'E1-B-02', titel: 'Zweiter Baustein', etappe: 'E1', welle: 1, schreibrechte: ['src/beta.ts'],
        abhaengigkeiten: ['E1-A-01'], anforderungen: ['L-05'], kriterien: ['Z-05', 'Z-06', 'Z-07', 'Z-08'],
        wirkung: 4, status: 'committet', versuche: 1, commit: 'b2c3d4e',
      }),
      paket({
        kennung: 'E1-C-03', titel: 'Dritter Baustein', etappe: 'E1', welle: 2, rolle: 'Prüfer',
        schreibrechte: ['src/gamma.ts'], abhaengigkeiten: ['E1-B-02'], anforderungen: ['M-07'],
        kriterien: ['Z-09', 'Z-10', 'Z-11', 'Z-12'], wirkung: 3,
      }),
      paket({
        kennung: 'E1-D-04', titel: 'Vierter Baustein', etappe: 'E1', welle: 2, schreibrechte: ['src/delta.ts'],
        abhaengigkeiten: ['E1-B-02'], kriterien: ['Z-13', 'Z-14', 'Z-15', 'Z-16'], wirkung: 4,
      }),
      paket({
        kennung: 'E2-E-05', titel: 'Fünfter Baustein', etappe: 'E2', welle: 1, modell: 'opus-5.5', stufe: 3,
        kostenklasse: 'L', schreibrechte: ['src/epsilon.ts'], abhaengigkeiten: ['E1-C-03'],
        kriterien: ['Z-17', 'Z-18', 'Z-19'], wirkung: 5, status: 'bereit',
      }),
      paket({
        kennung: 'E2-F-06', titel: 'Sechster Baustein', etappe: 'E2', welle: 1, schreibrechte: ['src/zeta.ts'],
        kriterien: ['Z-20', 'Z-21', 'Z-22'], art: 'kuer', wirkung: 2,
      }),
    ],
    mengengeruest: { frei: 'Erfundene Testdaten' },
    kapazitaet: { pakete_pro_tag: { S: 12, M: 8, L: 3 }, puffer: 0.2, tage: 3.5 },
    kritischer_pfad: ['E1-A-01', 'E1-B-02', 'E1-C-03', 'E2-E-05'],
    vorrat: ['E2-F-06'],
  };
}

// Testplan mit zwei eingebauten Fehlern: E1-C-03 und E1-D-04 teilen sich eine Datei in Welle 2,
// und E1-D-04 ist ein Haiku-Paket ohne muster.
function planFehler() {
  const objekt = basisPlan();
  finde(objekt, 'E1-D-04').schreibrechte = ['src/gamma.ts'];
  finde(objekt, 'E1-D-04').muster = null;
  return objekt;
}

// Anforderungen: 5 Einträge, davon 4 mit Endstatus und Beleg. G-01 ist offen und in E1-A-01 genannt.
function basisAnf() {
  return {
    version: 1,
    stand: '2026-11-02T20:00:00.000Z',
    eintraege: [
      {
        kennung: 'G-01', quelle: 'G', fundstelle: 'Abschnitt 4', inhalt: 'Autoschlüssel werden mit Anzahlung bestellt.',
        bestand: 'teilweise', bestand_fundstelle: 'src/bestellung.ts', status: 'offen', pakete: ['E1-A-01'],
        beleg: null, gruppe: null,
      },
      {
        kennung: 'G-21', quelle: 'G', fundstelle: 'Abschnitt 4', inhalt: 'Ein Konfigurator für Schließanlagen.',
        bestand: 'fehlt', bestand_fundstelle: null, status: 'später', pakete: [],
        beleg: 'KONZEPT.md mit Schalter', gruppe: null,
      },
      {
        kennung: 'L-05', quelle: 'L', fundstelle: 'Leitfaden 2.1, Kapitel 5', inhalt: 'Gerätemaß wird vor dem Versand geprüft.',
        bestand: 'vorhanden', bestand_fundstelle: 'src/versand.ts', status: 'umgesetzt', pakete: ['E1-B-02'],
        beleg: 'Commit b2c3d4e', gruppe: null,
      },
      {
        kennung: 'M-07', quelle: 'M', fundstelle: 'MENSCHEN.md, Punkt 7', inhalt: 'Freigabe der Bildrechte durch den Inhaber.',
        bestand: 'fehlt', bestand_fundstelle: null, status: 'menschensache', pakete: ['E1-C-03'],
        beleg: 'MENSCHEN.md#m-07', gruppe: null,
      },
      {
        kennung: 'E-03', quelle: 'E', fundstelle: 'EVALUIERUNG.md, Befund 3', inhalt: 'Ein Filter wird entfernt.',
        bestand: null, bestand_fundstelle: null, status: 'entfällt', pakete: [],
        beleg: 'ENTSCHEIDUNGEN.md#a-003 Konflikt mit Rang 2', gruppe: null,
      },
    ],
  };
}

// ABNAHME mit 22 Zeilen. Standard ist erfüllt. Z-05 hat eine AUSNAHME, Z-15 eine UMGEBUNGSAUSNAHME.
// Ein Wert null im Objekt lässt die Zeile weg.
function abnahmeText(status = { 'Z-05': 'AUSNAHME', 'Z-15': 'UMGEBUNGSAUSNAHME' }) {
  const zeilen = ['# Abnahme (Testdaten)', '', '| Kennung | Kriterium | Status | Beleg |', '| --- | --- | --- | --- |'];
  for (let n = 1; n <= 22; n += 1) {
    const z = `Z-${String(n).padStart(2, '0')}`;
    if (status[z] === null) continue;
    zeilen.push(`| ${z} | Kriterium ${n} | ${status[z] ?? 'erfüllt'} | Beleg ${n} |`);
  }
  return `${zeilen.join('\n')}\n`;
}

before(() => {
  mkdirSync(AUSGABE, { recursive: true });
  schreibe('plan.json', basisPlan());
  schreibe('plan-fehler.json', planFehler());
  schreibe('anf.json', basisAnf());
  schreibe('abnahme.md', abnahmeText());
});

// --- plan.mjs pruefen (P-00 bis P-15) ---------------------------------------------
test('P-00 pruefen: korrigierter Plan ist OK, Exit 0', () => {
  const r = planCli(['pruefen']);
  assert.equal(r.code, 0, r.out + r.err);
  assert.equal(r.out.trim(), 'PLAN-PRÜFUNG: OK');
});

test('P-01 Schema: fehlende Pflichtfelder bei Paket und Etappe werden gemeldet', () => {
  const titel = variante('p01-titel.json', (o) => { delete finde(o, 'E1-A-01').titel; });
  const r1 = planCli(['pruefen'], { plan: titel });
  assert.equal(r1.code, 1);
  assert.match(r1.out, /Paket E1-A-01: titel fehlt\./);
  const tor = variante('p01-tor.json', (o) => { o.etappen[0].tor = ''; });
  const r2 = planCli(['pruefen'], { plan: tor });
  assert.equal(r2.code, 1);
  assert.match(r2.out, /Etappe E1: tor fehlt\./);
});

test('P-02 Schema: erlaubte Werte für status, wirkung und stufe', () => {
  const datei = variante('p02-werte.json', (o) => {
    finde(o, 'E1-A-01').status = 'kaputt';
    finde(o, 'E1-B-02').wirkung = 6;
    finde(o, 'E2-E-05').stufe = 4;
  });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /status "kaputt" ist nicht erlaubt/);
  assert.match(r.out, /wirkung muss eine ganze Zahl von 1 bis 5 sein/);
  assert.match(r.out, /stufe muss 1, 2 oder 3 sein/);
});

test('P-03 Modell: nur opus-5.5 oder haiku-5.5 sind erlaubt', () => {
  const datei = variante('p03-modell.json', (o) => { finde(o, 'E1-B-02').modell = 'sonnet-4'; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /modell "sonnet-4" ist nicht erlaubt/);
});

test('P-04 Schema: Kennungen sind eindeutig', () => {
  const datei = variante('p04-doppelt.json', (o) => { finde(o, 'E2-F-06').kennung = 'E1-A-01'; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Paket E1-A-01 ist doppelt\./);
});

test('P-05 Kriterien: jedes Kriterium Z-01 bis Z-22 hat ein Paket', () => {
  const datei = variante('p05-kriterium.json', (o) => { finde(o, 'E2-F-06').kriterien = ['Z-20', 'Z-21']; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Kriterium Z-22 hat kein Paket\./);
  assert.doesNotMatch(r.out, /Kriterium Z-21 hat kein Paket/);
});

test('P-06 Paket: nennt mindestens eine Anforderung oder ein Kriterium', () => {
  const datei = variante('p06-leer.json', (o) => {
    Object.assign(finde(o, 'E2-E-05'), { kriterien: [], anforderungen: [] });
  });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Paket E2-E-05: nennt weder Anforderung noch Kriterium\./);
});

test('P-07 Anforderungen: jede Anforderung ist genannt oder hat einen Endstatus', () => {
  const datei = variante('p07-ungedeckt.json', (o) => { finde(o, 'E1-A-01').anforderungen = []; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Anforderung G-01 ist in keinem Paket genannt und hat keinen Endstatus\./);
  assert.doesNotMatch(r.out, /Anforderung G-21/);
});

test('P-08 Dateien: keine Datei in zwei Paketen derselben Etappe und Welle', () => {
  const r = planCli(['pruefen'], { plan: PLAN_FEHLER });
  assert.equal(r.code, 1);
  assert.match(r.out, /Datei src\/gamma\.ts steht in E1-C-03 und E1-D-04 \(Etappe E1, Welle 2\)\./);
  const andereWelle = variante('p08-welle.json', (o) => { finde(o, 'E1-D-04').welle = 1; finde(o, 'E1-D-04').schreibrechte = ['src/gamma.ts']; });
  const r2 = planCli(['pruefen'], { plan: andereWelle });
  assert.equal(r2.code, 0, r2.out);
});

test('P-09 Haiku: jedes Haiku-Paket hat massstab und muster', () => {
  const r = planCli(['pruefen'], { plan: PLAN_FEHLER });
  assert.match(r.out, /Paket E1-D-04: Haiku-Paket braucht massstab und muster\./);
  const ohneMassstab = variante('p09-massstab.json', (o) => { finde(o, 'E1-B-02').massstab = null; });
  const r2 = planCli(['pruefen'], { plan: ohneMassstab });
  assert.equal(r2.code, 1);
  assert.match(r2.out, /Paket E1-B-02: Haiku-Paket braucht massstab und muster\./);
});

test('P-10 Abhängigkeiten: jede Abhängigkeit gibt es', () => {
  const datei = variante('p10-dep.json', (o) => { finde(o, 'E1-D-04').abhaengigkeiten = ['E9-XX-99']; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Paket E1-D-04: Abhängigkeit E9-XX-99 gibt es nicht\./);
});

test('P-11 Zyklen: Abhängigkeiten bilden keinen Kreis', () => {
  const datei = variante('p11-zyklus.json', (o) => { finde(o, 'E1-B-02').abhaengigkeiten = ['E1-A-01', 'E1-C-03']; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Zyklus bei den Abhängigkeiten: E1-B-02 -> E1-C-03 -> E1-B-02\./);
});

test('P-11 Zyklen: Hilfsfunktion findet Kreise und lässt Ketten ohne Kreis durch', () => {
  assert.equal(findeZyklus(new Map([['A', ['B']], ['B', ['C']], ['C', []]])), null);
  assert.equal(findeZyklus(new Map([['A', ['A']]])), 'A -> A');
  assert.equal(findeZyklus(new Map([['A', ['B']], ['B', ['A']]])), 'A -> B -> A');
});

test('P-12 Vorrat und kritischer Pfad nennen nur vorhandene Pakete', () => {
  const datei = variante('p12-liste.json', (o) => { o.vorrat = ['E10-ZZ']; o.kritischer_pfad = ['E1-Q-99']; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /vorrat nennt E10-ZZ, dieses Paket gibt es nicht\./);
  assert.match(r.out, /kritischer_pfad nennt E1-Q-99, dieses Paket gibt es nicht\./);
});

test('P-13 Etappen: jedes Paket gehört zu einer vorhandenen Etappe', () => {
  const datei = variante('p13-etappe.json', (o) => { finde(o, 'E2-E-05').etappe = 'E9'; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Paket E2-E-05: Etappe "E9" gibt es nicht\./);
});

test('P-14 Anforderungen: genannte Anforderungen gibt es in ANFORDERUNGEN.json', () => {
  const datei = variante('p14-anf-name.json', (o) => { finde(o, 'E1-A-01').anforderungen = ['G-99']; });
  const r = planCli(['pruefen'], { plan: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Paket E1-A-01 nennt die Anforderung G-99, die es in ANFORDERUNGEN\.json nicht gibt\./);
});

test('P-15 Anforderungen: fehlt ANFORDERUNGEN.json, meldet pruefen einen Befund', () => {
  const r = planCli(['pruefen'], { anf: ANF_FEHLT });
  assert.equal(r.code, 1);
  assert.match(r.out, /ANFORDERUNGEN\.json fehlt oder ist nicht lesbar/);
});

// --- plan.mjs naechste (N-01 bis N-12) --------------------------------------------
// Liest die Kennungen aus der Tabelle. Zeile 0 ist der Kopf der Etappe, Zeile 1 die Tabellenüberschrift.
const naechsteIds = (out) => out.trim().split('\n').slice(2).map((z) => z.split(' · ')[0].trim());

test('N-01 naechste: nur Status offen oder bereit, Abhängigkeit offen blockiert', () => {
  const r = planCli(['naechste']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Kennung\s+· Titel\s+· Modell\s+· Klasse\s+· Schreibrechte \(Zahl\)/);
  assert.deepEqual(naechsteIds(r.out), ['E1-D-04', 'E1-C-03']);
  const abgenommen = variante('n01-abgenommen.json', (o) => { finde(o, 'E1-C-03').status = 'abgenommen'; });
  const r2 = planCli(['naechste'], { plan: abgenommen });
  assert.deepEqual(naechsteIds(r2.out), ['E1-D-04'], 'abgenommen ist nicht offen und wird nicht vorgeschlagen');
});

test('N-02 naechste: Abhängigkeit mit Status abgenommen zählt als erfüllt', () => {
  const datei = variante('n02-abhaengig.json', (o) => {
    finde(o, 'E1-B-02').status = 'abgenommen';
    finde(o, 'E1-D-04').welle = 1;
  });
  const r = planCli(['naechste'], { plan: datei });
  assert.equal(r.code, 0, r.out + r.err);
  assert.deepEqual(naechsteIds(r.out), ['E1-D-04']);
});

test('N-02 naechste: eine Abhängigkeit, die nicht erfüllt ist, schließt das Paket aus', () => {
  const datei = variante('n02-unerfuellt.json', (o) => {
    Object.assign(finde(o, 'E1-B-02'), { status: 'offen', commit: null });
    Object.assign(finde(o, 'E1-D-04'), { welle: 1, abhaengigkeiten: ['E1-C-03'] });
  });
  const r = planCli(['naechste'], { plan: datei });
  assert.equal(r.code, 0, r.out + r.err);
  assert.deepEqual(naechsteIds(r.out), ['E1-B-02'], 'E1-D-04 wartet auf E1-C-03, das noch offen ist');
});

test('N-03 naechste: aktuelle Etappe ist die früheste mit offenen Pflichtpaketen', () => {
  const datei = variante('n03-etappe.json', (o) => {
    for (const p of o.pakete.filter((q) => q.etappe === 'E1')) { p.status = 'committet'; p.commit = `e1${p.kennung}`; }
  });
  const r = planCli(['naechste'], { plan: datei });
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^Etappe E2 · Welle 1/);
  assert.deepEqual(naechsteIds(r.out), ['E2-E-05', 'E2-F-06']);
});

test('N-04 naechste: nur die kleinste offene Welle der Etappe', () => {
  const datei = variante('n04-welle.json', (o) => { finde(o, 'E1-B-02').status = 'blockiert'; finde(o, 'E1-B-02').grund = 'Warten auf Prüfung'; });
  const r = planCli(['naechste'], { plan: datei });
  assert.equal(r.code, 0, r.out + r.err);
  assert.ok(!naechsteIds(r.out).includes('E1-C-03'), 'Welle 2 wartet auf Welle 1');
  assert.ok(!naechsteIds(r.out).includes('E1-D-04'), 'Welle 2 wartet auf Welle 1');
});

test('N-05 naechste: keine Überschneidung mit Schreibrechten laufender Pakete', () => {
  const datei = variante('n05-laeuft.json', (o) => {
    Object.assign(finde(o, 'E2-E-05'), { status: 'läuft', schreibrechte: ['src/gamma.ts'] });
  });
  const r = planCli(['naechste'], { plan: datei });
  assert.equal(r.code, 0, r.out + r.err);
  assert.deepEqual(naechsteIds(r.out), ['E1-D-04'], 'E1-C-03 nutzt src/gamma.ts und wird ausgelassen');
});

test('N-06 naechste: Pflicht vor Kür, sonst Wirkung absteigend', () => {
  const base = planCli(['naechste']);
  assert.deepEqual(naechsteIds(base.out), ['E1-D-04', 'E1-C-03'], 'Wirkung 4 vor Wirkung 3');
  const datei = variante('n06-kuer.json', (o) => { finde(o, 'E1-D-04').art = 'kuer'; });
  const r = planCli(['naechste'], { plan: datei });
  assert.deepEqual(naechsteIds(r.out), ['E1-C-03', 'E1-D-04'], 'Pflicht kommt vor der Kür, auch bei kleinerer Wirkung');
});

test('N-07 naechste: --plaetze begrenzt die Haiku-Pakete', () => {
  const r = planCli(['naechste', '--plaetze', '1']);
  assert.equal(r.code, 0, r.err);
  assert.deepEqual(naechsteIds(r.out), ['E1-D-04']);
  const bad = planCli(['naechste', '--plaetze', 'viele']);
  assert.equal(bad.code, 2);
});

test('N-08 naechste: Kür aus anderen Etappen nur, wenn die aktuelle Etappe nichts bereit hat', () => {
  const base = planCli(['naechste']);
  assert.ok(!naechsteIds(base.out).includes('E2-F-06'), 'solange E1 bereite Pakete hat, bleibt die Kür im Vorrat');
  const datei = variante('n08-vorrat.json', (o) => {
    Object.assign(finde(o, 'E1-B-02'), { status: 'blockiert', grund: 'Warten auf Prüfung' });
  });
  const r = planCli(['naechste'], { plan: datei });
  assert.equal(r.code, 0, r.out + r.err);
  assert.deepEqual(naechsteIds(r.out), ['E2-F-06']);
});

test('N-09 naechste: --modell filtert auf ein Modell', () => {
  const haiku = planCli(['naechste', '--modell', 'haiku-5.5']);
  assert.deepEqual(naechsteIds(haiku.out), ['E1-D-04', 'E1-C-03']);
  const opus = planCli(['naechste', '--modell', 'opus-5.5']);
  assert.equal(opus.code, 0, opus.err);
  assert.match(opus.out, /Keine bereiten Pakete\./);
  const falsch = planCli(['naechste', '--modell', 'gpt']);
  assert.equal(falsch.code, 2);
});

test('N-10 naechste: Opus-Pakete zählen nicht gegen --plaetze', () => {
  const datei = variante('n10-opus.json', (o) => { finde(o, 'E1-C-03').modell = 'opus-5.5'; });
  const null1 = planCli(['naechste', '--plaetze', '0'], { plan: datei });
  assert.deepEqual(naechsteIds(null1.out), ['E1-C-03'], 'ohne Haiku-Platz bleibt nur das Opus-Paket');
  const eins = planCli(['naechste', '--plaetze', '1'], { plan: datei });
  assert.deepEqual(naechsteIds(eins.out), ['E1-D-04', 'E1-C-03'], 'Opus kommt dazu, Haiku belegt den einen Platz');
});

test('N-11 naechste: lehnt einen ungültigen Plan ab', () => {
  const r = planCli(['naechste'], { plan: PLAN_FEHLER });
  assert.equal(r.code, 1);
  assert.match(r.out, /PLAN-PRÜFUNG: \d+ Befunde/);
  assert.match(r.err, /Der Plan ist nicht gültig/);
});

test('N-12 naechste --auffuellen: freie Plätze mit bereiten Pflichtpaketen späterer Etappen, Kür bleibt im Vorrat', () => {
  const datei = variante('n12-auffuellen.json', (o) => {
    Object.assign(finde(o, 'E2-E-05'), { modell: 'haiku-5.5', stufe: 2, status: 'offen', abhaengigkeiten: [], muster: 'pakete/_MUSTER-TEST.md', massstab: 'pakete/E2-E-05-TEST.md' });
  });
  const ohne = planCli(['naechste'], { plan: datei });
  assert.equal(ohne.code, 0, ohne.out + ohne.err);
  assert.deepEqual(naechsteIds(ohne.out), ['E1-D-04', 'E1-C-03'], 'ohne Schalter bleibt die Auswahl in der aktuellen Etappe');
  const mit = planCli(['naechste', '--auffuellen'], { plan: datei });
  assert.equal(mit.code, 0, mit.out + mit.err);
  assert.deepEqual(naechsteIds(mit.out), ['E1-D-04', 'E1-C-03', 'E2-E-05'], 'aktuelle Etappe zuerst, dann die spätere');
  assert.ok(!naechsteIds(mit.out).includes('E2-F-06'), 'Kür bleibt im Vorrat, solange ein Pflichtpaket bereit ist');
  const eng = planCli(['naechste', '--auffuellen', '--plaetze', '2'], { plan: datei });
  assert.deepEqual(naechsteIds(eng.out), ['E1-D-04', 'E1-C-03'], 'die aktuelle Etappe hat Vorrang vor späteren');
});

// --- plan.mjs setze (S-01 bis S-06) -----------------------------------------------
const lesePlan = (datei) => JSON.parse(readFileSync(datei, 'utf8'));

test('S-01 setze: setzt Status und zählt Versuche', () => {
  const datei = variante('s01-setze.json', () => {});
  const r = planCli(['setze', 'E1-C-03', 'läuft', '--versuch'], { plan: datei });
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Paket E1-C-03: Status läuft gesetzt\./);
  const neu = lesePlan(datei);
  assert.equal(finde(neu, 'E1-C-03').status, 'läuft');
  assert.equal(finde(neu, 'E1-C-03').versuche, 1);
  assert.equal(finde(neu, 'E1-D-04').status, 'offen', 'andere Pakete bleiben unverändert');
});

test('S-02 setze: committet braucht einen Commit, mit --commit wird er gesetzt', () => {
  const datei = variante('s02-commit.json', () => {});
  const ohne = planCli(['setze', 'E1-C-03', 'committet'], { plan: datei });
  assert.equal(ohne.code, 1);
  assert.match(ohne.err, /committet braucht --commit/);
  assert.equal(finde(lesePlan(datei), 'E1-C-03').status, 'offen', 'bei Fehler wird nichts geschrieben');
  const mit = planCli(['setze', 'E1-C-03', 'committet', '--commit', 'f00ba42'], { plan: datei });
  assert.equal(mit.code, 0, mit.err);
  const neu = finde(lesePlan(datei), 'E1-C-03');
  assert.equal(neu.status, 'committet');
  assert.equal(neu.commit, 'f00ba42');
});

test('S-03 setze: blockiert und zurückgestellt brauchen einen Grund', () => {
  const datei = variante('s03-grund.json', () => {});
  const ohne = planCli(['setze', 'E1-D-04', 'blockiert'], { plan: datei });
  assert.equal(ohne.code, 1);
  assert.match(ohne.err, /blockiert braucht --grund/);
  const mit = planCli(['setze', 'E1-D-04', 'blockiert', '--grund', 'Warten auf Prüfung'], { plan: datei });
  assert.equal(mit.code, 0, mit.err);
  const neu = finde(lesePlan(datei), 'E1-D-04');
  assert.equal(neu.status, 'blockiert');
  assert.equal(neu.grund, 'Warten auf Prüfung');
});

test('S-04 setze: unbekannte Kennung, unbekannter Status und fehlende Angaben werden abgelehnt', () => {
  const datei = variante('s04-fehler.json', () => {});
  const vorher = readFileSync(datei, 'utf8');
  const a = planCli(['setze', 'E9-XX-99', 'offen'], { plan: datei });
  assert.equal(a.code, 1);
  assert.match(a.err, /Paket E9-XX-99 gibt es nicht\./);
  const b = planCli(['setze', 'E1-C-03', 'kaputt'], { plan: datei });
  assert.equal(b.code, 2);
  assert.match(b.err, /Status "kaputt" gibt es nicht/);
  const c = planCli(['setze', 'E1-C-03'], { plan: datei });
  assert.equal(c.code, 2);
  assert.equal(readFileSync(datei, 'utf8'), vorher, 'bei Fehlern wird nichts geschrieben');
});

test('S-05 setze: setzt stand auf die aktuelle Zeit', () => {
  const datei = variante('s05-stand.json', () => {});
  const vorher = lesePlan(datei).stand;
  const r = planCli(['setze', 'E1-C-03', 'offen'], { plan: datei });
  assert.equal(r.code, 0, r.err);
  const nachher = lesePlan(datei).stand;
  assert.notEqual(nachher, vorher);
  assert.ok(Math.abs(Date.now() - Date.parse(nachher)) < 60_000, 'stand ist die jetzige Zeit');
});

test('S-06 setze: Datei bleibt im Format JSON.stringify(x, null, 1)', () => {
  const datei = variante('s06-format.json', () => {});
  const r = planCli(['setze', 'E1-C-03', 'offen', '--versuch'], { plan: datei });
  assert.equal(r.code, 0, r.err);
  const text = readFileSync(datei, 'utf8');
  assert.equal(text, JSON.stringify(JSON.parse(text), null, 1));
});

// --- plan.mjs stand (T-01 bis T-03) ------------------------------------------------
test('T-01 stand: Zeile im festen Format', () => {
  const r = planCli(['stand', '--zeile']);
  assert.equal(r.code, 0, r.err);
  assert.equal(r.out.trim(), 'Etappe 1/2 · Welle 2 · Pflicht 2/5 · Kür 0/1 · läuft 0 · blockiert 0');
});

test('T-02 stand: zählt laufende und blockierte Pakete mit Grund', () => {
  const datei = variante('t02-laeuft.json', (o) => {
    finde(o, 'E1-C-03').status = 'läuft';
    Object.assign(finde(o, 'E1-D-04'), { status: 'blockiert', grund: 'Warten auf Prüfung' });
  });
  const r = planCli(['stand', '--zeile'], { plan: datei });
  assert.equal(r.out.trim(), 'Etappe 1/2 · Welle 2 · Pflicht 2/5 · Kür 0/1 · läuft 1 · blockiert 1');
  const lang = planCli(['stand'], { plan: datei });
  assert.match(lang.out, /Laufend \(1\): E1-C-03/);
  assert.match(lang.out, /Blockiert \(1\): E1-D-04 \(Warten auf Prüfung\)/);
});

test('T-03 stand: alles committet ergibt m/m und Welle 0, eine fehlende Datei ergibt Fehler', () => {
  const datei = variante('t03-fertig.json', (o) => {
    for (const p of o.pakete.filter((q) => q.art === 'pflicht')) { p.status = 'committet'; p.commit = `c0ffee${p.welle}`; }
  });
  const r = planCli(['stand', '--zeile'], { plan: datei });
  assert.equal(r.out.trim(), 'Etappe 2/2 · Welle 0 · Pflicht 5/5 · Kür 0/1 · läuft 0 · blockiert 0');
  const fehlt = planCli(['stand', '--zeile'], { plan: join(DATEN, 'gibt-es-nicht.json') });
  assert.equal(fehlt.code, 1);
});

// --- plan.mjs zeichne (Z-01 bis Z-03) ---------------------------------------------
test('Z-01 zeichne: schreibt die Ansicht mit Kopf, Etappen, Wellen und Vorrat', () => {
  const ziel = join(AUSGABE, 'z01-PLAN.md');
  ausgabeLoeschen(ziel);
  const r = planCli(['zeichne', '--ausgabe', ziel]);
  assert.equal(r.code, 0, r.err);
  assert.ok(existsSync(ziel), 'die Ausgabedatei entsteht');
  const md = readFileSync(ziel, 'utf8');
  assert.match(md, /^# Plan des Ausbaulaufs$/m);
  assert.match(md, /^Etappe 1\/2 · Welle 2 · Pflicht 2\/5 · Kür 0\/1 · läuft 0 · blockiert 0$/m);
  assert.match(md, /^## E1 · Testfundament$/m);
  assert.match(md, /^Tor: Alle Prüfungen grün$/m);
  assert.match(md, /^### Welle 2$/m);
  assert.match(md, /^\| E1-C-03 \| Dritter Baustein \| haiku-5\.5 \| S \| pflicht \| 3 \| offen \|/m);
  assert.match(md, /^## Kritischer Pfad$/m);
  assert.match(md, /E1-A-01 → E1-B-02 → E1-C-03 → E2-E-05/);
  assert.match(md, /^## Vorrat$/m);
  assert.match(md, /E2-F-06/);
});

test('Z-02 zeichne: zeigt Commit-Kennungen und je Welle eine Tabelle', () => {
  const datei = variante('z02-commit.json', (o) => {
    Object.assign(finde(o, 'E1-C-03'), { status: 'committet', commit: 'f00ba42' });
  });
  const ziel = join(AUSGABE, 'z02-PLAN.md');
  ausgabeLoeschen(ziel);
  const r = planCli(['zeichne', '--ausgabe', ziel], { plan: datei });
  assert.equal(r.code, 0, r.err);
  const md = readFileSync(ziel, 'utf8');
  assert.match(md, /^\| E1-C-03 \| Dritter Baustein \| haiku-5\.5 \| S \| pflicht \| 3 \| committet \| f00ba42 \|$/m);
  assert.equal((md.match(/^### Welle /gm) ?? []).length, 3, 'E1 hat zwei Wellen, E2 eine');
  assert.equal((md.match(/^\| Kennung \| Titel/gm) ?? []).length, 3, 'je Welle eine Tabellenkopfzeile');
});

test('Z-03 zeichne: schreibt nichts bei ungültigem Plan oder fehlender Datei', () => {
  const ziel = join(AUSGABE, 'z03-PLAN.md');
  ausgabeLoeschen(ziel);
  const r = planCli(['zeichne', '--ausgabe', ziel], { plan: PLAN_FEHLER });
  assert.equal(r.code, 1);
  assert.match(r.err, /PLAN\.md wird nicht geschrieben/);
  assert.equal(existsSync(ziel), false);
  const fehlt = planCli(['zeichne', '--ausgabe', ziel], { plan: join(DATEN, 'gibt-es-nicht.json') });
  assert.equal(fehlt.code, 1);
  assert.equal(existsSync(ziel), false);
});

// --- plan.mjs abschluss (A-01 bis A-06) ------------------------------------------
// Fertige Lage: alle Pflichtpakete committet, alle Anforderungen mit Endstatus und Beleg.
function planFertig() {
  const o = basisPlan();
  for (const p of o.pakete.filter((q) => q.art === 'pflicht')) {
    Object.assign(p, { status: 'committet', commit: `c0ffee${p.kennung.slice(-2)}` });
  }
  return o;
}

function anfFertig() {
  const a = basisAnf();
  a.eintraege[0] = { ...a.eintraege[0], status: 'umgesetzt', beleg: 'Commit a1b2c3d' };
  return a;
}

const PLAN_FERTIG = join(DATEN, 'plan-fertig.json');
const ANF_FERTIG = join(DATEN, 'anf-fertig.json');
const ANF_OHNE_BELEG = join(DATEN, 'anf-ohne-beleg.json');
const ABNAHME_OK = join(DATEN, 'abnahme-ok.md');

before(() => {
  schreibe('plan-fertig.json', planFertig());
  schreibe('anf-fertig.json', anfFertig());
  schreibe('anf-ohne-beleg.json', { ...anfFertig(), eintraege: anfFertig().eintraege.map((e, i) => (i === 0 ? { ...e, beleg: null } : e)) });
  schreibe('abnahme-ok.md', abnahmeText());
});

const abschluss = (plan, { anf = ANF_FERTIG, abnahme = ABNAHME_OK } = {}) =>
  planCli(['abschluss'], { plan, anf, abnahme });

test('A-01 abschluss: jedes Pflichtpaket muss committet sein', () => {
  const r = abschluss(PLAN_OK);
  assert.equal(r.code, 1);
  assert.match(r.out, /^ABSCHLUSS-PRÜFUNG: LÜCKEN$/m);
  assert.match(r.out, /Pflichtpaket E1-C-03 ist nicht committet \(Status offen\)\./);
});

test('A-02 abschluss: jede Anforderung hat Endstatus und Beleg', () => {
  const offen = abschluss(PLAN_FERTIG, { anf: ANF });
  assert.equal(offen.code, 1);
  assert.match(offen.out, /Anforderung G-01 hat keinen Endstatus \(Status offen\)\./);
  const ohneBeleg = abschluss(PLAN_FERTIG, { anf: ANF_OHNE_BELEG });
  assert.equal(ohneBeleg.code, 1);
  assert.match(ohneBeleg.out, /Anforderung G-01 hat keinen Beleg\./);
});

test('A-03 abschluss: alle Z-01 bis Z-22 stehen in ABNAHME.md mit erlaubtem Status', () => {
  const offen = schreibe('abnahme-offen.md', abnahmeText({ 'Z-07': 'offen' }));
  const r1 = abschluss(PLAN_FERTIG, { abnahme: offen });
  assert.equal(r1.code, 1);
  assert.match(r1.out, /Z-07 hat den Status "offen"/);
  const fehlt = schreibe('abnahme-fehlt.md', abnahmeText({ 'Z-12': null }));
  const r2 = abschluss(PLAN_FERTIG, { abnahme: fehlt });
  assert.equal(r2.code, 1);
  assert.match(r2.out, /Z-12 fehlt in ABNAHME\.md\./);
});

test('A-04 abschluss: höchstens zwei AUSNAHME', () => {
  const drei = schreibe('abnahme-drei.md', abnahmeText({ 'Z-05': 'AUSNAHME', 'Z-06': 'AUSNAHME', 'Z-07': 'AUSNAHME' }));
  const r = abschluss(PLAN_FERTIG, { abnahme: drei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Es gibt 3 AUSNAHME, erlaubt sind höchstens 2 \(Z-05, Z-06, Z-07\)\./);
  const zwei = schreibe('abnahme-zwei.md', abnahmeText({ 'Z-05': 'AUSNAHME', 'Z-06': 'AUSNAHME', 'Z-15': 'UMGEBUNGSAUSNAHME' }));
  const r2 = abschluss(PLAN_FERTIG, { abnahme: zwei });
  assert.equal(r2.code, 0, r2.out);
  assert.equal(r2.out.trim(), 'ABSCHLUSS-PRÜFUNG: BEREIT');
});

test('A-05 abschluss: für Z-02, Z-03, Z-14 und Z-20 gibt es keine AUSNAHME', () => {
  for (const z of ['Z-02', 'Z-03', 'Z-14', 'Z-20']) {
    const datei = schreibe(`abnahme-${z}.md`, abnahmeText({ 'Z-05': 'erfüllt', 'Z-15': 'erfüllt', [z]: 'AUSNAHME' }));
    const r = abschluss(PLAN_FERTIG, { abnahme: datei });
    assert.equal(r.code, 1, z);
    assert.match(r.out, new RegExp(`${z} darf keine AUSNAHME haben\\.`));
  }
  // Die Regel gilt nur für den Status AUSNAHME. UMGEBUNGSAUSNAHME bleibt zulässig.
  const umgebung = schreibe('abnahme-Z-02-umgebung.md', abnahmeText({ 'Z-05': 'erfüllt', 'Z-15': 'erfüllt', 'Z-02': 'UMGEBUNGSAUSNAHME' }));
  const r2 = abschluss(PLAN_FERTIG, { abnahme: umgebung });
  assert.equal(r2.code, 0, r2.out);
});

test('A-06 abschluss: genau „ABSCHLUSS-PRÜFUNG: BEREIT“ bei vollständiger Lage, Exit 0', () => {
  const r = abschluss(PLAN_FERTIG);
  assert.equal(r.code, 0, r.out + r.err);
  assert.equal(r.out.trim(), 'ABSCHLUSS-PRÜFUNG: BEREIT');
});

// --- anforderungen.mjs (AN-01 bis AN-11) ------------------------------------------
// Eine Variante der Anforderungen mit einer Änderung an einem Eintrag (nach Index).
function anfVariante(name, aendern) {
  const a = basisAnf();
  aendern(a);
  return schreibe(name, a);
}

test('AN-01 pruefen: Schema mit Pflichtfeldern und erlaubter Quelle', () => {
  const r = anfCli(['pruefen']);
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^ANFORDERUNGEN-PRÜFUNG: OK · belegt 4\/5$/m);
  const datei = anfVariante('an01-schema.json', (a) => {
    a.eintraege[1].quelle = 'X';
    delete a.eintraege[2].fundstelle;
  });
  const r2 = anfCli(['pruefen'], { anf: datei });
  assert.equal(r2.code, 1);
  assert.match(r2.out, /G-21: quelle "X" ist nicht erlaubt/);
  assert.match(r2.out, /L-05: fundstelle fehlt\./);
});

test('AN-02 pruefen: Kennungen sind eindeutig', () => {
  const datei = anfVariante('an02-doppelt.json', (a) => { a.eintraege[4].kennung = 'G-01'; });
  const r = anfCli(['pruefen'], { anf: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /Kennung G-01 ist doppelt\./);
});

test('AN-03 pruefen: nur erlaubte Status', () => {
  const datei = anfVariante('an03-status.json', (a) => { a.eintraege[0].status = 'kaputt'; });
  const r = anfCli(['pruefen'], { anf: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /G-01: status "kaputt" ist nicht erlaubt\./);
});

test('AN-04 pruefen: jeder Endstatus braucht einen Beleg', () => {
  const datei = anfVariante('an04-beleg.json', (a) => { a.eintraege[2].beleg = null; });
  const r = anfCli(['pruefen'], { anf: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /L-05: Endstatus umgesetzt braucht einen beleg\./);
});

test('AN-05 pruefen: später nur für G-21 und G-50', () => {
  const erlaubt = anfVariante('an05-g50.json', (a) => { a.eintraege[1].kennung = 'G-50'; });
  const r1 = anfCli(['pruefen'], { anf: erlaubt });
  assert.equal(r1.code, 0, r1.out);
  const verboten = anfVariante('an05-verboten.json', (a) => { a.eintraege[2].status = 'später'; });
  const r2 = anfCli(['pruefen'], { anf: verboten });
  assert.equal(r2.code, 1);
  assert.match(r2.out, /L-05: später ist nur für G-21 und G-50 erlaubt\./);
});

test('AN-06 pruefen: entfällt braucht einen Verweis auf ENTSCHEIDUNGEN.md', () => {
  const datei = anfVariante('an06-entfaellt.json', (a) => { a.eintraege[4].beleg = 'Entfallen wegen Rang 2'; });
  const r = anfCli(['pruefen'], { anf: datei });
  assert.equal(r.code, 1);
  assert.match(r.out, /E-03: entfällt braucht im beleg einen Verweis ENTSCHEIDUNGEN\.md#/);
});

test('AN-07 pruefen: Zahlen je Quelle, belegt ist Endstatus mit Beleg', () => {
  const r = anfCli(['pruefen']);
  assert.match(r.out, /^Je Quelle belegt\/gesamt: G 1\/2 · L 1\/1 · EL 0\/0 · M 1\/1 · E 1\/1 · K 0\/0$/m);
});

test('AN-08 zeichne: Kopf mit Zahlen, Tabelle je Quelle, Inhalt auf 120 Zeichen gekürzt', () => {
  const datei = anfVariante('an08-lang.json', (a) => { a.eintraege[0].inhalt = 'x'.repeat(150); });
  const ziel = join(AUSGABE, 'an08-ANFORDERUNGEN.md');
  ausgabeLoeschen(ziel);
  const r = anfCli(['zeichne', '--ausgabe', ziel], { anf: datei });
  assert.equal(r.code, 0, r.err);
  const md = readFileSync(ziel, 'utf8');
  assert.match(md, /^Einträge: 5 · belegt: 4$/m);
  assert.match(md, /^\| G \| 2 \| 1 \|/m);
  assert.match(md, /^## G · Gespräch \(Abschnitt 4\)$/m);
  assert.match(md, /^\| Kennung \| Inhalt \| Bestand \| Status \| Pakete \| Beleg \|$/m);
  const zeile = md.split('\n').find((z) => z.startsWith('| G-01 |'));
  const inhalt = zeile.split('|')[2].trim();
  assert.equal(Array.from(inhalt).length, 120);
  assert.ok(inhalt.endsWith('…'));
});

test('AN-09 zeichne: schreibt nichts bei ungültiger oder fehlender Datei', () => {
  const ziel = join(AUSGABE, 'an09-ANFORDERUNGEN.md');
  ausgabeLoeschen(ziel);
  const kaputt = anfVariante('an09-kaputt.json', (a) => { a.eintraege[0].status = 'kaputt'; });
  const r = anfCli(['zeichne', '--ausgabe', ziel], { anf: kaputt });
  assert.equal(r.code, 1);
  assert.equal(existsSync(ziel), false);
  const fehlt = anfCli(['zeichne', '--ausgabe', ziel], { anf: ANF_FEHLT });
  assert.equal(fehlt.code, 1);
  assert.equal(existsSync(ziel), false);
});

test('AN-10 zusammenfuehren: hängt neue Einträge an, lässt bestehende unverändert, meldet Dubletten', () => {
  const basis = schreibe('an10-zusammen.json', basisAnf());
  const vorher = JSON.parse(readFileSync(basis, 'utf8'));
  const teilL = schreibe('an10-teil-L.json', {
    quelle: 'L',
    eintraege: [
      { kennung: 'L-06', fundstelle: 'Leitfaden 2.1, Kapitel 6', inhalt: 'Schlüssel werden nach Code gefertigt.', bestand: 'fehlt', bestand_fundstelle: null, status: 'offen', pakete: [], beleg: null, gruppe: null },
      { kennung: 'L-07', fundstelle: 'Leitfaden 2.1, Kapitel 7', inhalt: 'Zylinder werden geprüft.', bestand: null, bestand_fundstelle: null, status: 'offen', pakete: [], beleg: null, gruppe: null },
      { kennung: 'L-05', fundstelle: 'Leitfaden 2.1, Kapitel 5', inhalt: 'Doppelt, wird nicht übernommen.', bestand: 'fehlt', bestand_fundstelle: null, status: 'offen', pakete: [], beleg: null, gruppe: null },
    ],
  });
  const teilK = schreibe('an10-teil-K.json', {
    quelle: 'K',
    eintraege: [
      { kennung: 'K-01', fundstelle: 'Abschnitt 13', inhalt: 'Kante zur Agenturnennung.', bestand: 'fehlt', bestand_fundstelle: null, status: 'offen', pakete: [], beleg: null, gruppe: null },
    ],
  });
  const r = anfCli(['zusammenfuehren', teilL, teilK], { anf: basis });
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /Dublette, bleibt unverändert: L-05 aus /);
  assert.match(r.out, /^Neue Einträge: 3$/m);
  const neu = JSON.parse(readFileSync(basis, 'utf8'));
  assert.equal(neu.eintraege.length, 8);
  assert.deepEqual(neu.eintraege.slice(0, 5), vorher.eintraege, 'bestehende Einträge bleiben unverändert');
  assert.deepEqual(neu.eintraege.slice(5).map((e) => e.kennung), ['L-06', 'L-07', 'K-01']);
  assert.equal(neu.eintraege[7].quelle, 'K', 'die Quelle wird aus der Datei übernommen');
  assert.equal(anfCli(['pruefen'], { anf: basis }).code, 0);
});

test('AN-11 zusammenfuehren: schreibt nichts bei ungültigem Teil', () => {
  const basis = schreibe('an11-zusammen.json', basisAnf());
  const vorher = readFileSync(basis, 'utf8');
  const kaputt = schreibe('an11-teil-kaputt.json', {
    quelle: 'L',
    eintraege: [{ kennung: 'L-09', fundstelle: 'x', inhalt: 'y', bestand: null, bestand_fundstelle: null, status: 'kaputt', pakete: [], beleg: null, gruppe: null }],
  });
  const r1 = anfCli(['zusammenfuehren', kaputt], { anf: basis });
  assert.equal(r1.code, 1);
  assert.match(r1.out, /L-09: status "kaputt" ist nicht erlaubt\./);
  assert.equal(readFileSync(basis, 'utf8'), vorher);
  const falscheQuelle = schreibe('an11-teil-quelle.json', { quelle: 'Z', eintraege: [] });
  const r2 = anfCli(['zusammenfuehren', falscheQuelle], { anf: basis });
  assert.equal(r2.code, 1);
  assert.match(r2.out + r2.err, /Format ist \{"quelle", "eintraege"\}/);
  const fremd = schreibe('an11-teil-fremd.json', {
    quelle: 'L',
    eintraege: [{ kennung: 'L-10', quelle: 'G', fundstelle: 'x', inhalt: 'y', bestand: null, bestand_fundstelle: null, status: 'offen', pakete: [], beleg: null, gruppe: null }],
  });
  const r3 = anfCli(['zusammenfuehren', fremd], { anf: basis });
  assert.equal(r3.code, 1);
  assert.match(r3.out, /L-10: quelle G passt nicht zur Datei \(L\)\./);
  assert.equal(readFileSync(basis, 'utf8'), vorher);
});
