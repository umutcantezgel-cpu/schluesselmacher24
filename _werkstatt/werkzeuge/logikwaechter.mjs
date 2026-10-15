// Logikwächter des Gestaltungslaufs.
// Stellt fest, ob sich Geschäftslogik in Darstellungsdateien verändert hat. Jede geschützte
// Datei bekommt einen Fingerabdruck aus zwei Teilen:
//   Teil A – Code außerhalb von JSX (JSX-Knoten werden durch __JSX__ ersetzt, Darstellungs-Importe entfallen)
//   Teil B – Ausdrücke innerhalb von JSX (Kinder- und Attributausdrücke, sortiert)
// Rein darstellende Änderungen (Klassen, Stile, Mikrotexte, Formatierung, Anführungszeichen)
// bleiben ohne Wirkung.
//
// Aufruf:
//   node logikwaechter.mjs sichern [dateien…]
//   node logikwaechter.mjs pruefen [dateien…] [--basis <commit>]
// Ohne Dateien gilt die Liste der geschützten Dateien.
// Exit-Codes: 0 = alles gleich, 3 = Abweichung gefunden, 2 = Bedienfehler, 1 = technischer Fehler.
//
// Bewusst ohne Import von lib.mjs: Dieses Werkzeug braucht keinen Browser, und lib.mjs
// zieht playwright-core mit. Pfade und argumente() sind hier gespiegelt.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(hier, '..', '..');
const PROTOKOLLE = path.join(REPO, '_werkstatt', 'protokolle');
const FINGERABDRUECKE = path.join(PROTOKOLLE, 'logik-fingerabdruecke.json');
const AUSNAHMEN = path.join(hier, 'logik-ausnahmen.json');

// TypeScript-Compiler aus dem Projekt, nicht aus dem Werkzeugordner.
const ts = createRequire(path.join(REPO, 'package.json'))('typescript');
const drucker = ts.createPrinter({ removeComments: true });

/** Geschützte Dateien (Logikwächter-Liste, in dieser Reihenfolge). */
export const GESCHUETZTE = [
  'src/app/(site)/kasse/kasse-formular.tsx',
  'src/app/(site)/warenkorb/warenkorb-ansicht.tsx',
  'src/app/(site)/bestellung/[id]/page.tsx',
  'src/app/(site)/autoschluessel/anfrage/assistent.tsx',
  'src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx',
  'src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx',
  'src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx',
  'src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx',
  'src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx',
  'src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx',
  'src/app/(site)/service-und-termin/terminstatus/status-formular.tsx',
  'src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx',
  'src/app/(site)/artikel/[slug]/artikel-kauf.tsx',
  'src/app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx',
  'src/components/forms/photo-upload.tsx',
];

/** Attribute, deren Werte reine Darstellung sind (Teil B lässt sie aus). */
const DARSTELLUNGS_ATTRIBUTE = new Set([
  'className', 'style', 'size', 'strokeWidth', 'width', 'height', 'viewBox', 'key',
]);

class BedienFehler extends Error {}

/* ---------- Normalisierung und Zerlegung -------------------------------- */

const istJsx = (k) => ts.isJsxElement(k) || ts.isJsxSelfClosingElement(k) || ts.isJsxFragment(k);

/** Reine Darstellungs-Importe: Icons und Grafikkomponenten. */
function istDarstellungsImport(knoten) {
  if (!ts.isStringLiteral(knoten.moduleSpecifier)) return false;
  const modul = knoten.moduleSpecifier.text;
  return modul === 'lucide-react' || modul.startsWith('@/components/visual/');
}

const normalisieren = (text) => text.replace(/\s+/g, ' ').trim();

/**
 * Baut eine Kopie des Syntaxbaums: JSX wird zu __JSX__, Zeichenketten werden
 * einheitlich in doppelte Anführungszeichen überführt. Optional entfallen
 * Darstellungs-Importe.
 */
function umformen(wurzel, { ohneDarstellung }) {
  const ergebnis = ts.transform(wurzel, [
    (kontext) => {
      const besuche = (knoten) => {
        if (istJsx(knoten)) return ts.factory.createIdentifier('__JSX__');
        if (ohneDarstellung && ts.isImportDeclaration(knoten) && istDarstellungsImport(knoten)) return undefined;
        if (ts.isStringLiteral(knoten) || ts.isNoSubstitutionTemplateLiteral(knoten)) {
          return ts.factory.createStringLiteral(knoten.text);
        }
        return ts.visitEachChild(knoten, besuche, kontext);
      };
      return (k) => ts.visitNode(k, besuche);
    },
  ]);
  const [erstes] = ergebnis.transformed;
  ergebnis.dispose();
  return erstes;
}

/** Teil A: Code außerhalb von JSX. */
function teilA(sf) {
  return normalisieren(drucker.printFile(umformen(sf, { ohneDarstellung: true })));
}

/** Ein Ausdruck innerhalb von JSX, normalisiert. */
function ausdruck(knoten, sf) {
  return normalisieren(drucker.printNode(ts.EmitHint.Unspecified, umformen(knoten, { ohneDarstellung: false }), sf));
}

/** Teil B: Ausdrücke aller JSX-Knoten (Kinder und Attribute), sortiert. */
function teilB(sf) {
  const liste = [];

  const kinder = (knoten) => {
    for (const kind of knoten.children) {
      if (ts.isJsxExpression(kind) && kind.expression) liste.push(`{${ausdruck(kind.expression, sf)}}`);
    }
  };

  const attribute = (oeffnung) => {
    for (const attr of oeffnung.attributes.properties) {
      if (ts.isJsxSpreadAttribute(attr)) {
        liste.push(`...{${ausdruck(attr.expression, sf)}}`);
      } else if (attr.initializer && ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
        const name = attr.name.getText(sf);
        if (!DARSTELLUNGS_ATTRIBUTE.has(name)) liste.push(`${name}={${ausdruck(attr.initializer.expression, sf)}}`);
      }
    }
  };

  const besuche = (knoten) => {
    if (ts.isJsxElement(knoten)) {
      attribute(knoten.openingElement);
      kinder(knoten);
    } else if (ts.isJsxSelfClosingElement(knoten)) {
      attribute(knoten);
    } else if (ts.isJsxFragment(knoten)) {
      kinder(knoten);
    }
    ts.forEachChild(knoten, besuche);
  };
  besuche(sf);

  return liste.sort();
}

/** Liest die Ausnahmen (Ersetzungen vor dem Fingerabdruck). */
function ausnahmenLaden() {
  if (!existsSync(AUSNAHMEN)) return {};
  return JSON.parse(readFileSync(AUSNAHMEN, 'utf8'));
}

/** Wendet die Ausnahmen der Datei auf den Quelltext an (gilt für alt und neu gleichermaßen). */
function ausnahmenAnwenden(dateiname, quelltext) {
  const regeln = ausnahmenLaden()[dateiname] ?? [];
  let text = quelltext;
  const ausnahmen = [];
  for (const regel of regeln) {
    const suche = new RegExp(regel.suchen, 'g');
    let anzahl = 0;
    text = text.replace(suche, () => {
      anzahl += 1;
      return regel.ersetzen;
    });
    ausnahmen.push({ grund: regel.grund, anzahl });
  }
  return { text, ausnahmen };
}

/** Zerlegt einen Quelltext in die normalisierten Teile A und B. */
export function zerlegen(quelltext, dateiname) {
  const { text, ausnahmen } = ausnahmenAnwenden(dateiname, quelltext);
  const sf = ts.createSourceFile(dateiname, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  return { teilA: teilA(sf), teilB: teilB(sf), ausnahmen };
}

function hashAus({ teilA: a, teilB: b }) {
  return createHash('sha256')
    .update(a)
    .update('\n§§ TEIL B §§\n')
    .update(b.join('\n'))
    .digest('hex');
}

/** SHA-256 über Teil A, Trenner und Teil B. */
export function fingerabdruck(quelltext, dateiname) {
  return hashAus(zerlegen(quelltext, dateiname));
}

/* ---------- Vergleich ---------------------------------------------------- */

/** Teil A in Zeilen für den Vergleich: nach Anweisungs- und Blockgrenzen. */
function zeilenVon(teil) {
  return teil.replace(/([;{}])\s/g, '$1\n').split('\n').map((s) => s.trim()).filter(Boolean);
}

/** Zeilenweiser Unterschied (LCS), Ausgabe mit „-“ und „+“. */
function zeilenDiff(alt, neu) {
  const n = alt.length;
  const m = neu.length;
  const tab = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      tab[i][j] = alt[i] === neu[j] ? tab[i + 1][j + 1] + 1 : Math.max(tab[i + 1][j], tab[i][j + 1]);
    }
  }
  const ausgabe = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (alt[i] === neu[j]) {
      i += 1;
      j += 1;
    } else if (tab[i + 1][j] >= tab[i][j + 1]) {
      ausgabe.push(`- ${alt[i]}`);
      i += 1;
    } else {
      ausgabe.push(`+ ${neu[j]}`);
      j += 1;
    }
  }
  while (i < n) ausgabe.push(`- ${alt[i++]}`);
  while (j < m) ausgabe.push(`+ ${neu[j++]}`);
  return ausgabe;
}

/** Mehrfachmengen-Unterschied für Teil B: entfallene und hinzugekommene Ausdrücke. */
function mengenDiff(alt, neu) {
  const rest = [...alt];
  const hinzu = [];
  for (const e of neu) {
    const k = rest.indexOf(e);
    if (k >= 0) rest.splice(k, 1);
    else hinzu.push(e);
  }
  return { entfallen: rest, hinzu };
}

/* ---------- Git und Protokoll ------------------------------------------- */

function gitHead() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim();
}

/** Inhalt einer Datei im Basis-Commit, oder null, wenn sie dort fehlt. */
function alteFassung(basis, datei) {
  try {
    return execFileSync('git', ['show', `${basis}:${datei}`], {
      cwd: REPO,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    return null;
  }
}

function protokollLesen() {
  if (!existsSync(FINGERABDRUECKE)) {
    throw new BedienFehler('Kein Protokoll vorhanden: zuerst `sichern` ausführen.');
  }
  return JSON.parse(readFileSync(FINGERABDRUECKE, 'utf8'));
}

/* ---------- Befehle ------------------------------------------------------ */

function sichern(dateien, vollstaendig) {
  const basis = gitHead();
  const bisher = !vollstaendig && existsSync(FINGERABDRUECKE) ? protokollLesen().dateien : {};
  const neu = { ...bisher };
  const zeilen = [
    '# Logikwächter · Sicherung',
    '',
    `Basis: \`${basis}\` · Dateien: ${dateien.length}`,
    '',
    '| Datei | Fingerabdruck | Ausnahmen |',
    '|---|---|---|',
  ];
  for (const datei of dateien) {
    const z = zerlegen(readFileSync(path.join(REPO, datei), 'utf8'), datei);
    const hash = hashAus(z);
    neu[datei] = hash;
    const anz = z.ausnahmen.map((a) => `${a.anzahl}×`).join(', ') || '–';
    zeilen.push(`| \`${datei}\` | \`${hash.slice(0, 12)}\` | ${anz} |`);
  }
  mkdirSync(PROTOKOLLE, { recursive: true });
  writeFileSync(FINGERABDRUECKE, `${JSON.stringify({ basis, dateien: neu }, null, 2)}\n`);
  zeilen.push('', `Protokoll geschrieben: \`${path.relative(REPO, FINGERABDRUECKE)}\``);
  console.log(zeilen.join('\n'));
  return 0;
}

function pruefen(dateien, basisArg) {
  const protokoll = protokollLesen();
  const basis = basisArg ?? protokoll.basis;
  const tabelle = [];
  const details = [];
  let abweichend = 0;

  for (const datei of dateien) {
    const abs = path.join(REPO, datei);
    if (!existsSync(abs)) {
      tabelle.push(`| \`${datei}\` | FEHLT | – |`);
      details.push(`## Abweichung: \`${datei}\``, 'Datei ist im Arbeitsbaum nicht vorhanden.', '');
      abweichend += 1;
      continue;
    }
    const quelle = readFileSync(abs, 'utf8');
    const jetzt = zerlegen(quelle, datei);
    const hash = hashAus(jetzt);
    const soll = protokoll.dateien[datei];
    const anz = jetzt.ausnahmen.map((a) => `${a.anzahl}×`).join(', ') || '–';

    if (soll === undefined) {
      tabelle.push(`| \`${datei}\` | KEIN EINTRAG | ${anz} |`);
      details.push(`## Abweichung: \`${datei}\``, 'Datei ist nicht im Protokoll. Erst `sichern` ausführen.', '');
      abweichend += 1;
      continue;
    }
    if (hash === soll) {
      tabelle.push(`| \`${datei}\` | gleich | ${anz} |`);
      continue;
    }

    abweichend += 1;
    tabelle.push(`| \`${datei}\` | ABWEICHEND | ${anz} |`);
    const alt = alteFassung(basis, datei);
    details.push(`## Abweichung: \`${datei}\``);
    if (alt === null) {
      details.push(`Datei im Basis-Commit \`${basis}\` nicht vorhanden; kein Vergleichstext.`, '');
      continue;
    }
    const altZ = zerlegen(alt, datei);
    const diffA = zeilenDiff(zeilenVon(altZ.teilA), zeilenVon(jetzt.teilA));
    const mengen = mengenDiff(altZ.teilB, jetzt.teilB);
    const zeilenB = [
      ...mengen.entfallen.map((e) => `- ${e}`),
      ...mengen.hinzu.map((e) => `+ ${e}`),
    ];
    if (diffA.length === 0 && zeilenB.length === 0) {
      details.push(
        'Teile A und B gegenüber dem Basis-Commit unverändert: Protokoll veraltet oder Ausnahmen geändert.',
        '',
      );
      continue;
    }
    const obergrenze = 40;
    const alleZeilen = [
      ...(diffA.length ? ['Teil A (Code außerhalb von JSX):', ...diffA] : []),
      ...(zeilenB.length ? ['Teil B (Ausdrücke in JSX):', ...zeilenB] : []),
    ];
    details.push('```diff', ...alleZeilen.slice(0, obergrenze));
    if (alleZeilen.length > obergrenze) details.push(`… ${alleZeilen.length - obergrenze} weitere Zeilen`);
    details.push('```', '');
  }

  const zeilen = [
    '# Logikwächter · Prüfung',
    '',
    `Basis: \`${basis}\` · Dateien: ${dateien.length} · abweichend: ${abweichend}`,
    '',
    '| Datei | Ergebnis | Ausnahmen |',
    '|---|---|---|',
    ...tabelle,
    '',
    ...details,
  ];
  console.log(zeilen.join('\n'));
  return abweichend ? 3 : 0;
}

/* ---------- Aufruf ------------------------------------------------------- */

function argumente(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const name = t.slice(2);
      const naechstes = argv[i + 1];
      if (naechstes === undefined || naechstes.startsWith('--')) a[name] = true;
      else {
        a[name] = naechstes;
        i += 1;
      }
    } else a._.push(t);
  }
  return a;
}

function relativ(p) {
  return path.relative(REPO, path.resolve(REPO, p)).split(path.sep).join('/');
}

function hauptlauf(argv) {
  const a = argumente(argv);
  const [befehl, ...rest] = a._;
  if (befehl !== 'sichern' && befehl !== 'pruefen') {
    throw new BedienFehler('Aufruf: logikwaechter.mjs sichern|pruefen [dateien…] [--basis <commit>]');
  }
  if (a.basis === true) throw new BedienFehler('--basis braucht einen Commit.');
  const vollstaendig = rest.length === 0;
  const dateien = (vollstaendig ? GESCHUETZTE : rest).map(relativ);
  if (befehl === 'sichern') {
    for (const d of dateien) {
      if (!existsSync(path.join(REPO, d))) throw new BedienFehler(`Datei fehlt: ${d}`);
    }
    return sichern(dateien, vollstaendig);
  }
  return pruefen(dateien, a.basis);
}

function aufrufen() {
  try {
    process.exitCode = hauptlauf(process.argv.slice(2));
  } catch (fehler) {
    if (fehler instanceof BedienFehler) {
      console.error(`Bedienfehler: ${fehler.message}`);
      process.exitCode = 2;
    } else {
      console.error(`Technischer Fehler: ${fehler.stack ?? fehler}`);
      process.exitCode = 1;
    }
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) aufrufen();
