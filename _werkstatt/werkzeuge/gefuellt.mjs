#!/usr/bin/env node
// gefuellt.mjs – Bilder von Warenkorb und Kasse mit Inhalt (der Bildsatz zeigt beide leer).
// Aufruf: node gefuellt.mjs [--geraet mobil|tablet|desktop|alle] [--ziel <ordner>] [--json <datei>]
// Je Gerät ein frischer Kontext mit Attrappen (G5): Code-Schlüssel ms-01 (Code 0812, 2 Stück) über die
// Oberfläche in den Warenkorb legen wie F-01, erste Versandart wählen, dann /warenkorb und /kasse je
// Bildschirmhöhe fotografieren (höchstens 8 Ausschnitte). Es wird nichts abgesendet.
// Dateiname <ansicht>-gefuellt__<geraet>__<k zweistellig>.jpg. Exit: 0 fertig, 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  GERAETE, BILDER_EXTERN, PROTOKOLLE, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function fuellen(page) {
  await laden(page, '/schluessel-nach-code/ms-01');
  await page.getByLabel(/^Schlüsselcode/).fill('0812');
  await page.getByRole('spinbutton', { name: /^Stückzahl/ }).fill('2');
  const knopf = page.getByRole('button', { name: 'In den Warenkorb', exact: true });
  for (let i = 0; i < 25 && !(await knopf.isEnabled().catch(() => false)); i += 1) await pause(200);
  await knopf.click();
  await pause(800);
}

async function ausschnitte(page, pfad, name, ziel, geraet) {
  await laden(page, pfad);
  await durchscrollen(page);
  const hoehe = page.viewportSize().height;
  const gesamt = await page.evaluate(() => document.documentElement.scrollHeight);
  const dateien = [];
  for (let k = 0; k < Math.min(8, Math.ceil(gesamt / hoehe)); k += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), k * hoehe);
    await pause(400);
    const datei = path.join(ziel, `${name}-gefuellt__${geraet}__${String(k).padStart(2, '0')}.jpg`);
    await page.screenshot({ path: datei, type: 'jpeg', quality: 60 });
    dateien.push(datei);
  }
  return dateien;
}

async function main() {
  const args = argumente(process.argv.slice(2));
  const wahl = args.geraet ?? 'alle';
  const geraete = wahl === 'alle' ? GERAETE : GERAETE.filter((g) => g.id === wahl);
  if (geraete.length === 0) { console.error('Bedienfehler: --geraet mobil|tablet|desktop|alle'); process.exit(2); }
  const ziel = ordner(args.ziel ?? path.join(BILDER_EXTERN, `gefuellt-${zeitstempel()}`));
  const browser = await browserStarten();
  const protokoll = [];
  try {
    for (const g of geraete) {
      const context = await kontextFuer(browser, g);
      await attrappenSetzen(context);
      const page = await context.newPage();
      await fuellen(page);
      await laden(page, '/warenkorb');
      await page.getByRole('radio').first().check({ force: true }).catch(() => {});
      await pause(600);
      const warenkorb = await ausschnitte(page, '/warenkorb', 'warenkorb', ziel, g.id);
      const kasse = await ausschnitte(page, '/kasse', 'kasse', ziel, g.id);
      protokoll.push({ geraet: g.id, warenkorb, kasse });
      console.log(`| ${g.id} | Warenkorb ${warenkorb.length} | Kasse ${kasse.length} |`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const json = args.json ?? path.join(PROTOKOLLE, `gefuellt-${zeitstempel()}.json`);
  writeFileSync(json, JSON.stringify({ ziel, protokoll }, null, 2));
  console.log(`Bilder: ${ziel}\nJSON-Protokoll: ${json}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
