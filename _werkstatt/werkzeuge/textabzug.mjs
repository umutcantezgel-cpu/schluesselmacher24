// Textabzug der Rechtsseiten des Gestaltungslaufs.
// Liest den sichtbaren Text von `main#inhalt` (Desktop) der sechs Rechtsseiten aus dem
// laufenden Server und hält ihn als Textdatei fest. Änderungen an Rechtstexten sollen so
// auffallen, bevor sie unbemerkt in die Gestaltung wandern. Rechtstexte werden nur gelesen.
//
// Aufruf (Server muss laufen: server.sh start):
//   node textabzug.mjs sichern        schreibt _werkstatt/protokolle/textabzug/<segment>.txt
//   node textabzug.mjs vergleichen    vergleicht den aktuellen Stand mit dem gesicherten
// Exit-Codes: 0 = alles gleich, 3 = Abweichung gefunden, 2 = Bedienfehler, 1 = technischer Fehler.

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import {
  argumente,
  attrappenSetzen,
  browserStarten,
  GERAETE,
  kontextFuer,
  laden,
  ordner,
  PROTOKOLLE,
} from './lib.mjs';

/** Die sechs Rechtsseiten. */
const SEITEN = [
  '/rechtliches/agb',
  '/rechtliches/widerruf',
  '/rechtliches/impressum',
  '/rechtliches/datenschutz',
  '/rechtliches/versand-und-zahlung',
  '/rechtliches/cookie-einstellungen',
];

const ORDNER = ordner(path.join(PROTOKOLLE, 'textabzug'));
const DATEI = (pfad) => path.join(ORDNER, `${pfad.split('/').pop()}.txt`);

class BedienFehler extends Error {}

/** Sichtbarer Text der Seite, Leerraum je Zeile normalisiert, leere Zeilen entfernt. */
async function textVon(browser, pfad) {
  const geraet = GERAETE.find((g) => g.id === 'desktop');
  const kontext = await kontextFuer(browser, geraet);
  const abgefangen = await attrappenSetzen(kontext);
  try {
    const seite = await kontext.newPage();
    const antwort = await laden(seite, pfad);
    if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`);
    const roh = await seite.locator('main#inhalt').innerText({ timeout: 15000 });
    const zeilen = roh
      .split('\n')
      .map((z) => z.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    return { zeilen, abgefangen: abgefangen.length };
  } finally {
    await kontext.close();
  }
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

async function sichern(browser) {
  const zeilen = ['# Textabzug · Sicherung', '', '| Seite | Zeilen | Ergebnis |', '|---|---|---|'];
  let fehler = 0;
  for (const pfad of SEITEN) {
    try {
      const { zeilen: text, abgefangen } = await textVon(browser, pfad);
      writeFileSync(DATEI(pfad), `${text.join('\n')}\n`);
      const hinweis = abgefangen ? `gesichert (${abgefangen} Anfragen abgefangen)` : 'gesichert';
      zeilen.push(`| \`${pfad}\` | ${text.length} | ${hinweis} |`);
    } catch (e) {
      fehler += 1;
      zeilen.push(`| \`${pfad}\` | – | FEHLER: ${e.message} |`);
    }
  }
  zeilen.push('', 'Ablage: `_werkstatt/protokolle/textabzug/`');
  console.log(zeilen.join('\n'));
  return fehler ? 1 : 0;
}

async function vergleichen(browser) {
  for (const pfad of SEITEN) {
    if (!existsSync(DATEI(pfad))) {
      throw new BedienFehler(`Kein gesicherter Abzug für ${pfad}: zuerst \`sichern\` ausführen.`);
    }
  }
  const zeilen = ['# Textabzug · Vergleich', '', '| Seite | Ergebnis |', '|---|---|'];
  const details = [];
  let fehler = 0;
  let abweichend = 0;
  for (const pfad of SEITEN) {
    try {
      const { zeilen: neu } = await textVon(browser, pfad);
      const alt = readFileSync(DATEI(pfad), 'utf8').split('\n').filter(Boolean);
      if (alt.length === neu.length && alt.every((z, i) => z === neu[i])) {
        zeilen.push(`| \`${pfad}\` | gleich |`);
        continue;
      }
      abweichend += 1;
      zeilen.push(`| \`${pfad}\` | ABWEICHEND |`);
      const diff = zeilenDiff(alt, neu);
      const unterschiede = diff.filter((z) => z.startsWith('- ') || z.startsWith('+ '));
      details.push(`## Abweichung: \`${pfad}\``, '```diff', ...unterschiede.slice(0, 20));
      if (unterschiede.length > 20) details.push(`… ${unterschiede.length - 20} weitere Zeilen`);
      details.push('```', '');
    } catch (e) {
      fehler += 1;
      zeilen.push(`| \`${pfad}\` | FEHLER: ${e.message} |`);
    }
  }
  console.log([...zeilen, '', ...details].join('\n'));
  if (fehler) return 1;
  return abweichend ? 3 : 0;
}

async function hauptlauf() {
  const befehl = argumente()._[0];
  if (befehl !== 'sichern' && befehl !== 'vergleichen') {
    throw new BedienFehler('Aufruf: textabzug.mjs sichern|vergleichen');
  }
  const browser = await browserStarten();
  try {
    return befehl === 'sichern' ? await sichern(browser) : await vergleichen(browser);
  } finally {
    await browser.close();
  }
}

try {
  process.exitCode = await hauptlauf();
} catch (fehler) {
  if (fehler instanceof BedienFehler) {
    console.error(`Bedienfehler: ${fehler.message}`);
    process.exitCode = 2;
  } else {
    console.error(`Technischer Fehler: ${fehler.stack ?? fehler}`);
    process.exitCode = 1;
  }
}
