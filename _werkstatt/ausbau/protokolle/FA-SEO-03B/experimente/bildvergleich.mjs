// Versuchsskript FA-SEO-03B (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11).
// Bildvergleich der neun Ansichten bei 412 und 1280 px zwischen zwei Ständen (A = Messstand, B = Versuch):
// ganze Seite, Bewegung „ruhig“ (reduced motion), nach dem Laden der Schriften. Zählt abweichende Pixel im Browser
// (Canvas), dazu den sichtbaren Text und die Zahl der Elemente ohne Skripte.
// Aufruf: A=http://localhost:3200 B=http://localhost:3300 node bildvergleich.mjs <ausgabeordner>
import { mkdirSync, writeFileSync } from 'node:fs';
const A = process.env.A ?? 'http://localhost:3200';
const B = process.env.B ?? 'http://localhost:3300';
for (const u of [A, B]) if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(u).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = B;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const { ANSICHTEN } = await import(new URL('../../../werkzeuge/leistung.mjs', import.meta.url).href);
const ziel = process.argv[2] ?? '.';
mkdirSync(ziel, { recursive: true });
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox', '--font-render-hinting=none'] });
async function aufnahme(basis, pfad, breite) {
  const ctx = await browser.newContext({ viewport: { width: breite, height: breite === 412 ? 823 : 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript(() => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(basis + pfad, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => ({ text: document.body.innerText, elemente: document.body.querySelectorAll('*:not(script)').length, mono: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`).sort() }));
  const png = await page.screenshot({ fullPage: true });
  await ctx.close();
  return { png, ...info };
}
const vergleich = await browser.newPage();
const zeilen = [];
for (const breite of [412, 1280]) {
  for (const a of ANSICHTEN) {
    const x = await aufnahme(A, a.pfad, breite);
    const y = await aufnahme(B, a.pfad, breite);
    const diff = await vergleich.evaluate(async ([p, q]) => {
      const lade = (b64) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + b64; });
      const [i1, i2] = await Promise.all([lade(p), lade(q)]);
      if (i1.width !== i2.width || i1.height !== i2.height) return { groesse: `${i1.width}×${i1.height} gegen ${i2.width}×${i2.height}`, pixel: -1 };
      const c = new OffscreenCanvas(i1.width, i1.height); const g = c.getContext('2d');
      g.drawImage(i1, 0, 0); const d1 = g.getImageData(0, 0, i1.width, i1.height).data;
      g.clearRect(0, 0, i1.width, i1.height); g.drawImage(i2, 0, 0); const d2 = g.getImageData(0, 0, i1.width, i1.height).data;
      let n = 0; for (let k = 0; k < d1.length; k += 4) if (Math.abs(d1[k] - d2[k]) + Math.abs(d1[k + 1] - d2[k + 1]) + Math.abs(d1[k + 2] - d2[k + 2]) > 24) n++;
      return { groesse: `${i1.width}×${i1.height}`, pixel: n };
    }, [x.png.toString('base64'), y.png.toString('base64')]);
    const zeile = { breite, ansicht: a.id, ...diff, textGleich: x.text === y.text, elemente: `${x.elemente}/${y.elemente}`, schriftenGleich: JSON.stringify(x.mono) === JSON.stringify(y.mono) };
    if (diff.pixel !== 0) { writeFileSync(`${ziel}/${a.id}-${breite}-A.png`, x.png); writeFileSync(`${ziel}/${a.id}-${breite}-B.png`, y.png); }
    zeilen.push(zeile);
    console.log(JSON.stringify(zeile));
  }
}
await browser.close();
writeFileSync(`${ziel}/bildvergleich.json`, JSON.stringify(zeilen, null, 1));
