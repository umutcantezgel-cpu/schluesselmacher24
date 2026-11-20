// FA-INHALT-01B: Skript-Gewicht, gemessen an dem, was der Browser lädt (A-076). Nur localhost (G1), fremde
// Adressen werden abgebrochen. Aufruf: node gewicht.mjs http://localhost:3200 [ausgabe.json]
import zlib from 'node:zlib';
import { writeFileSync } from 'node:fs';

const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const basis = process.argv[2] ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(basis).hostname)) throw new Error('nur localhost (G1)');

export const SEITEN = [
  '/schluessel-nach-vorlage',
  '/schluessel-nach-vorlage/anfrage',
  '/autoschluessel/anfrage',
  '/schluessel-nach-code',
  '/schluessel-einschicken',
  '/gleichschliessende-zylinder',
  '/gleichschliessende-zylinder/konfigurator',
  '/schliessanlagen',
  '/autoschluessel/gehaeuse',
  '/tutorials/schluessel-richtig-fotografieren',
  '/tutorials/profilzylinder-messen',
  '/tutorials',
  '/',
  '/ratgeber/zylinder-richtig-ausmessen',
  '/service-und-termin/kontakt',
];

const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ergebnis = {};
const fremd = [];
for (const pfad of SEITEN) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(basis).origin) { fremd.push(url.href); return route.abort(); }
    return route.continue();
  });
  const page = await ctx.newPage();
  const skripte = new Map();
  page.on('response', async (antwort) => {
    if (antwort.request().resourceType() !== 'script') return;
    try { skripte.set(antwort.url(), await antwort.body()); } catch { /* abgebrochen */ }
  });
  await page.goto(basis + pfad, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const dateien = [...skripte.entries()].map(([url, body]) => ({ datei: new URL(url).pathname.split('/').pop(), roh: body.length, gz: gz(body) }));
  ergebnis[pfad] = {
    anzahl: dateien.length,
    roh: dateien.reduce((a, d) => a + d.roh, 0),
    gz: dateien.reduce((a, d) => a + d.gz, 0),
    dateien: dateien.map((d) => d.datei).sort(),
  };
  console.log(`${pfad}\t${ergebnis[pfad].anzahl} Skripte\t${(ergebnis[pfad].roh / 1024).toFixed(1)} KB roh\t${(ergebnis[pfad].gz / 1024).toFixed(1)} KB gz`);
  await ctx.close();
}
await browser.close();
console.log('fremde Anfragen:', fremd.length ? fremd : 'keine');
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify({ basis, ergebnis, fremd }, null, 1));
