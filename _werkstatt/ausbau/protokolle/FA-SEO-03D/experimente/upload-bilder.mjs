// Versuchsskript FA-SEO-03D (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11).
// Bildvergleich Pixel für Pixel für jede Seite mit Upload-Feld, auf jedem Schritt, der ein Feld zeigt, bei 412 und 1280 px.
// Attrappen nach G5 (nichts wird abgesendet, Uploads abgefangen), nur localhost (G1), Bewegung „ruhig“.
// Den Schritt setzt ein erfundener Zwischenstand: `localStorage.getItem('sm24:flow:…')` liefert { version, data: {}, stepId }.
// Welche Schritte ein Feld zeigen, sucht `finden` in einer Seite: Zwischenstand je Kandidat setzen, `storage`-Ereignis
// senden (useStoredValue liest dann neu), Felder zählen.
//   BASIS=http://localhost:3200 node upload-bilder.mjs finden <ordner>/schritte.json
//   BASIS=http://localhost:3200 node upload-bilder.mjs aufnehmen <ordner>/A <ordner>/schritte.json
//   BASIS=http://localhost:3000 node upload-bilder.mjs aufnehmen <ordner>/B <ordner>/schritte.json
//   [B=<name>] node upload-bilder.mjs vergleichen <ordner>   (vergleicht <ordner>/A mit <ordner>/<name>, Standard B)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const [modus, ziel, schritteDatei] = process.argv.slice(2);
const BASIS = process.env.BASIS ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const REPO = '/home/user/schluesselmacher24/';

/** Seiten mit Upload-Feld und die Quelltexte, aus denen die Kandidaten für Schritte gelesen werden. */
const SEITEN = [
  { id: 'kontakt', pfad: '/service-und-termin/kontakt', quellen: ['src/app/(site)/service-und-termin/kontakt/kontakt-formular.tsx'] },
  { id: 'beratung', pfad: '/beratung', quellen: ['src/app/(site)/beratung/beratung-formular.tsx'] },
  { id: 'vor-ort', pfad: '/service-und-termin/vor-ort', quellen: ['src/app/(site)/service-und-termin/vor-ort/einsatz-formular.tsx'] },
  { id: 'anfrage', pfad: '/service-und-termin/anfrage', quellen: ['src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx'] },
  { id: 'partner', pfad: '/partner-werden', quellen: ['src/app/(site)/partner-werden/partner-formular.tsx'] },
  { id: 'sicherheitscheck', pfad: '/sicherheitstechnik/sicherheitscheck', quellen: ['src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx'] },
  { id: 'einschicken', pfad: '/schluessel-einschicken/anmelden', quellen: ['src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx'], daten: [{}, { schluesselart: 'auto-mechanisch' }, { schluesselart: 'haus', sicherungskarte: 'ja' }] },
  { id: 'schliessanlage', pfad: '/schliessanlagen/konfigurator', quellen: ['src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx'] },
  { id: 'vorlage', pfad: '/schluessel-nach-vorlage/anfrage', quellen: ['src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx'] },
  { id: 'zutritt', pfad: '/elektronische-zutrittsloesungen/konfigurator', quellen: ['src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx'] },
  { id: 'assistent', pfad: '/autoschluessel/anfrage', quellen: ['src/app/(site)/autoschluessel/anfrage/assistent.tsx'] },
  { id: 'gehaeuse', pfad: '/autoschluessel/gehaeuse/anfrage', quellen: ['src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx'] },
  { id: 'motorrad', pfad: '/motorradschluessel/anfrage', quellen: ['src/components/fahrzeug-anfrage/kern.ts', 'src/components/fahrzeug-anfrage/formular.tsx'] },
  { id: 'e-scooter', pfad: '/e-scooter/anfrage', quellen: ['src/components/fahrzeug-anfrage/kern.ts', 'src/components/fahrzeug-anfrage/formular.tsx'] },
  { id: 'nicht-gefunden', pfad: '/autoschluessel/fahrzeug-nicht-gefunden', quellen: ['src/components/fahrzeug-anfrage/kern.ts', 'src/components/fahrzeug-anfrage/formular.tsx'] },
  { id: 'code', pfad: '/schluessel-nach-code/ms-01', quellen: [] },
];

function kandidaten(quellen) {
  const s = new Set();
  for (const q of quellen) {
    const t = readFileSync(REPO + q, 'utf8');
    for (const m of t.matchAll(/(?:id:|case|===|goTo\()\s*'([a-z][a-z0-9-]{1,40})'/g)) s.add(m[1]);
  }
  return [...s];
}

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox', '--font-render-hinting=none'] });

async function kontext(breite, zustand) {
  const ctx = await browser.newContext({ viewport: { width: breite, height: breite === 412 ? 823 : 800 }, deviceScaleFactor: 1, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript((z) => {
    try { localStorage.setItem('sm24-bewegung', 'ruhig'); } catch {}
    window.__zustand = z;
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (typeof key === 'string' && key.startsWith('sm24:flow:') && window.__zustand) return JSON.stringify({ data: {}, ...window.__zustand });
      return original.call(this, key);
    };
  }, zustand ?? null);
  return ctx;
}

const zaehlen = (page) => page.evaluate(() => ({
  felder: document.querySelectorAll('input[type=file]').length,
  titel: document.querySelector('[data-schritt-titel]')?.textContent?.trim().slice(0, 80) ?? '',
  beispiele: [...document.querySelectorAll('input[type=file]')].length ? document.body.innerText.split('So sollte das Foto aussehen').length - 1 : 0,
}));

if (modus === 'finden') {
  const ergebnis = [];
  for (const seite of SEITEN.filter((x) => !process.env.NUR || process.env.NUR.split(',').includes(x.id))) {
    const ctx = await kontext(412, null);
    const page = await ctx.newPage();
    const antwort = await page.goto(BASIS + seite.pfad, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const start = await zaehlen(page);
    const funde = [];
    if (start.felder > 0) funde.push({ zustand: null, ...start });
    const gesehen = new Set(start.felder > 0 ? [`${start.titel}|${start.felder}`] : []);
    for (const data of seite.daten ?? [{}]) for (const version of [1, 2, 3]) for (const stepId of kandidaten(seite.quellen)) {
      await page.evaluate((z) => { window.__zustand = z; window.dispatchEvent(new StorageEvent('storage', { key: null })); }, { version, stepId, data });
      await page.waitForTimeout(150);
      const x = await zaehlen(page);
      const sig = `${x.titel}|${x.felder}`;
      if (x.felder > 0 && !gesehen.has(sig)) { gesehen.add(sig); funde.push({ zustand: { version, stepId, data }, ...x }); }
    }
    console.log(JSON.stringify({ seite: seite.id, status: antwort?.status(), funde }));
    ergebnis.push({ ...seite, status: antwort?.status(), funde });
    await ctx.close();
  }
  writeFileSync(ziel, JSON.stringify(ergebnis, null, 1));
} else if (modus === 'aufnehmen') {
  mkdirSync(ziel, { recursive: true });
  const seiten = JSON.parse(readFileSync(schritteDatei, 'utf8'));
  for (const seite of seiten) for (const [i, fund] of seite.funde.entries()) for (const breite of [412, 1280]) {
    const ctx = await kontext(breite, fund.zustand);
    const page = await ctx.newPage();
    await page.goto(BASIS + seite.pfad, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => ({ text: document.body.innerText, elemente: document.body.querySelectorAll('*:not(script)').length, felder: document.querySelectorAll('input[type=file]').length }));
    const name = `${seite.id}-${i}-${breite}`;
    writeFileSync(`${ziel}/${name}.png`, await page.screenshot({ fullPage: true }));
    writeFileSync(`${ziel}/${name}.json`, JSON.stringify(info));
    console.log(`aufgenommen ${name} (Felder ${info.felder})`);
    await ctx.close();
  }
} else if (modus === 'vergleichen') {
  const seiten = JSON.parse(readFileSync(`${ziel}/schritte.json`, 'utf8'));
  const vergleich = await browser.newPage();
  const zeilen = [];
  for (const seite of seiten) for (const [i, fund] of seite.funde.entries()) for (const breite of [412, 1280]) {
    const name = `${seite.id}-${i}-${breite}`;
    const lies = (s) => ({ png: readFileSync(`${ziel}/${s}/${name}.png`), ...JSON.parse(readFileSync(`${ziel}/${s}/${name}.json`, 'utf8')) });
    const x = lies('A'); const y = lies(process.env.B ?? 'B');
    const diff = await vergleich.evaluate(async ([p, q]) => {
      const lade = (b64) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + b64; });
      const [i1, i2] = await Promise.all([lade(p), lade(q)]);
      if (i1.width !== i2.width || i1.height !== i2.height) return { groesse: `${i1.width}×${i1.height} gegen ${i2.width}×${i2.height}`, pixel: -1 };
      const c = new OffscreenCanvas(i1.width, i1.height); const g = c.getContext('2d');
      g.drawImage(i1, 0, 0); const d1 = g.getImageData(0, 0, i1.width, i1.height).data;
      g.clearRect(0, 0, i1.width, i1.height); g.drawImage(i2, 0, 0); const d2 = g.getImageData(0, 0, i1.width, i1.height).data;
      let n = 0; for (let k = 0; k < d1.length; k += 4) if (d1[k] !== d2[k] || d1[k + 1] !== d2[k + 1] || d1[k + 2] !== d2[k + 2] || d1[k + 3] !== d2[k + 3]) n++;
      return { groesse: `${i1.width}×${i1.height}`, pixel: n };
    }, [x.png.toString('base64'), y.png.toString('base64')]);
    const zeile = { seite: seite.id, schritt: fund.zustand?.stepId ?? '(erster)', titel: fund.titel, breite, felder: `${x.felder}/${y.felder}`, ...diff, textGleich: x.text === y.text, elemente: `${x.elemente}/${y.elemente}` };
    zeilen.push(zeile);
    console.log(JSON.stringify(zeile));
  }
  writeFileSync(`${ziel}/bildvergleich-${process.env.B ?? 'B'}.json`, JSON.stringify(zeilen, null, 1));
}
await browser.close();
