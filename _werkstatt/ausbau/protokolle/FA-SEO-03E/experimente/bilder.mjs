// Versuchsskript FA-SEO-03E: Bildvergleich Pixel für Pixel (ohne Schwelle) für Warenkorb leer und gefüllt, Artikelliste,
// Shop und weitere Seiten, je 412 und 1280 px, ganze Seite. Nur localhost (G1), Attrappen (G5), nichts wird bestellt.
// Aufnehmen:  BASIS=<basis> node bilder.mjs aufnehmen <ordner>
// Vergleichen: node bilder.mjs vergleichen <ordner-a> <ordner-b> <ausgabe.json>
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const lib = await import('/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/lib.mjs');
const [modus, a, b2, ausgabe] = process.argv.slice(2);
const POSITIONEN = {
  code: { kind: 'code-schluessel', uid: 'test-1', codeLineId: 'ms-01', code: 'A1234', qty: 1, unitPriceCents: 1000, photoRefs: [] },
  standard: { kind: 'standard', uid: 'test-2', productId: 'beispiel-schluesselkasten', label: 'Testartikel', shippingClass: 'zubehoer', qty: 1, unitPriceCents: 1000 },
  zylinder: { kind: 'zylinder-schliessung', uid: 'test-3', draft: { items: [{ uid: 'z-1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 }], keyCount: 3, extraIds: [], expandable: false }, unitPriceCents: 4900, qty: 1 },
};
const GEFUELLT = (n) => JSON.stringify({ state: { items: [POSITIONEN[n]] }, version: 1 });
const SEITEN = [
  ['warenkorb-leer', '/warenkorb'],
  ['warenkorb-code', '/warenkorb', 'code'],
  ['warenkorb-artikel', '/warenkorb', 'standard'],
  ['warenkorb-zylinder', '/warenkorb', 'zylinder'],
  ['artikel', '/artikel'],
  ['shop', '/shop'],
  ['start', '/'],
  ['kontakt', '/service-und-termin/kontakt'],
  ['code', '/schluessel-nach-code'],
];
if (modus === 'aufnehmen') {
  const basis = process.env.BASIS;
  if (!new URL(basis).hostname.match(/^(localhost|127\.0\.0\.1)$/)) throw new Error('nur localhost');
  mkdirSync(a, { recursive: true });
  const br = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
  const info = {};
  for (const [name, pfad, fuellung] of SEITEN) {
    for (const breite of [412, 1280]) {
      const ctx = await br.newContext({ viewport: { width: breite, height: 900 }, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce' });
      await lib.attrappenSetzen(ctx);
      if (fuellung) await ctx.addInitScript((w) => { try { localStorage.setItem('sm24-warenkorb', w); } catch {} }, GEFUELLT(fuellung));
      const p = await ctx.newPage();
      await p.goto(basis + pfad, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1500);
      await p.evaluate(() => document.fonts.ready);
      const datei = `${name}-${breite}.png`;
      await p.screenshot({ path: join(a, datei), fullPage: true, animations: 'disabled', caret: 'hide' });
      info[datei] = { url: p.url(), text: (await p.locator('main').innerText()).length, svg: await p.locator('main svg').count(), elemente: await p.locator('main *').count() };
      await ctx.close();
    }
  }
  writeFileSync(join(a, 'info.json'), JSON.stringify(info, null, 1));
  await br.close();
  console.log(JSON.stringify(info));
} else {
  const sharp = (await import('/home/user/schluesselmacher24/node_modules/sharp/dist/index.cjs')).default;
  const roh = async (pfad) => { const { data, info } = await sharp(readFileSync(pfad)).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { data, width: info.width, height: info.height }; };
  const ia = JSON.parse(readFileSync(join(a, 'info.json'))); const ib = JSON.parse(readFileSync(join(b2, 'info.json')));
  const erg = [];
  for (const d of readdirSync(a).filter((x) => x.endsWith('.png')).sort()) {
    const x = await roh(join(a, d)); const y = await roh(join(b2, d));
    let anders = 0;
    if (x.width === y.width && x.height === y.height) { for (let i = 0; i < x.data.length; i += 4) if (x.data[i] !== y.data[i] || x.data[i + 1] !== y.data[i + 1] || x.data[i + 2] !== y.data[i + 2] || x.data[i + 3] !== y.data[i + 3]) anders++; }
    else anders = -1;
    erg.push({ bild: d, groesse: [x.width, x.height, y.width, y.height], pixelAnders: anders, gleich: anders === 0, textGleich: ia[d].text === ib[d].text, url: [ia[d].url, ib[d].url], svg: [ia[d].svg, ib[d].svg], elemente: [ia[d].elemente, ib[d].elemente] });
  }
  writeFileSync(ausgabe, JSON.stringify(erg, null, 1));
  console.log(`${erg.filter((e) => e.gleich).length} von ${erg.length} pixelgleich`);
}
