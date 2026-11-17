// Sichtprüfung FA-FARBE-01 (Dunkelblau und Bühne). Nur localhost (G1), Attrappen aus lib.mjs (G5), nichts absenden.
// Aufruf: _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-FARBE-01/sichtpruefung.mjs
// Schreibt Bilder nach bilder/ und Messwerte nach messung.json in diesem Ordner.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const BASIS = lib.BASIS_URL;
if (!['localhost', '127.0.0.1'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
const BILDER = path.join(hier, 'bilder');
mkdirSync(BILDER, { recursive: true });

const SEITEN = [
  ['start', '/'],
  ['bereich', '/autoschluessel'],
  ['leistung', '/autoschluessel/nachmachen'],
  ['code', '/schluessel-nach-code'],
  ['shop', '/shop'],
  ['konfigurator', '/gleichschliessende-zylinder/konfigurator'],
  ['formular', '/autoschluessel/anfrage'],
  ['ratgeber', '/ratgeber'],
  ['tutorial', '/tutorials/schluessel-richtig-fotografieren'],
  ['impressum', '/rechtliches/impressum'],
  ['ort', '/standorte/wetzlar'],
  ['404', '/gibt-es-nicht-farbprobe'],
];
const BREITEN = [390, 1280];

/* Kontrast wie in area-theme.ts: OKLCH → lineares sRGB → relative Luminanz (WCAG 2.2). */
const MESSEN = () => {
  function oklch(text) {
    const m = /oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+%?))?\)/.exec(text);
    if (m) return { l: Number(m[1]) > 1 ? Number(m[1]) / 100 : Number(m[1]), c: Number(m[2]), h: Number(m[3]), a: m[4] ? parseFloat(m[4]) / (m[4].endsWith('%') ? 100 : 1) : 1 };
    const r = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(text);
    if (r) return { rgb: [r[1], r[2], r[3]].map((v) => Number(v) / 255), a: r[4] ? Number(r[4]) : 1 };
    return null;
  }
  const klemmen = (v) => Math.min(1, Math.max(0, v));
  const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  function luminanz(f) {
    let lin;
    if (f.rgb) lin = f.rgb.map(linear);
    else {
      const a = f.c * Math.cos((f.h * Math.PI) / 180);
      const b = f.c * Math.sin((f.h * Math.PI) / 180);
      const l1 = (f.l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
      const m1 = (f.l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
      const s1 = (f.l - 0.0894841775 * a - 1.291485548 * b) ** 3;
      lin = [
        4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
        -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
        -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
      ].map(klemmen);
    }
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  }
  const kontrast = (x, y) => {
    const a = luminanz(x);
    const b = luminanz(y);
    return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  };
  const tripel = (el, name) => {
    const w = getComputedStyle(el).getPropertyValue(name).trim();
    const [l, c, h] = w.split(/\s+/).map(Number);
    return { l, c, h, a: 1 };
  };
  /* Fläche hinter einem Element: erster Vorfahr mit deckender Hintergrundfarbe. */
  function flaeche(el) {
    for (let e = el; e; e = e.parentElement) {
      const f = oklch(getComputedStyle(e).backgroundColor);
      if (f && f.a > 0.95) return { f, e };
    }
    return null;
  }
  const ergebnis = { buehnen: [], text: [], fehlt: [] };
  for (const b of document.querySelectorAll('.buehne')) {
    const cs = getComputedStyle(b);
    ergebnis.buehnen.push({
      element: `${b.tagName.toLowerCase()}.${[...b.classList].filter((k) => k.startsWith('buehne')).join('.')}`,
      hintergrund: cs.backgroundColor,
      licht: cs.backgroundImage.startsWith('radial-gradient'),
      area: cs.getPropertyValue('--area').trim(),
    });
    /* Text auf der Bühne: Farbe gegen die Fläche dahinter und gegen die hellste Stelle des Lichts. */
    const licht = tripel(b, '--licht');
    const hatLicht = cs.backgroundImage.startsWith('radial-gradient');
    for (const el of b.querySelectorAll('h1, h2, p, a, span, li, dt, dd, button')) {
      if (!el.offsetParent || !el.childNodes.length) continue;
      const eigenText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!eigenText) continue;
      const farbe = oklch(getComputedStyle(el).color);
      const hinten = flaeche(el);
      if (!farbe || !hinten) continue;
      const aufFlaeche = kontrast(farbe, hinten.f);
      const aufLicht = hatLicht && hinten.e === b ? kontrast(farbe, licht) : null;
      ergebnis.text.push({ text: el.textContent.trim().slice(0, 40), aufFlaeche, aufLicht });
    }
    /* Bereichsfarbe: jedes [data-area] in der Bühne trägt die Bühnenwerte. */
    for (const a of b.querySelectorAll('[data-area]')) {
      if (getComputedStyle(a).getPropertyValue('--area').trim() !== cs.getPropertyValue('--area').trim()) {
        ergebnis.fehlt.push(`data-area=${a.dataset.area} trägt --area ${getComputedStyle(a).getPropertyValue('--area')}`);
      }
    }
  }
  const unter = ergebnis.text.filter((t) => t.aufFlaeche < 4.5 || (t.aufLicht !== null && t.aufLicht < 4.5));
  return { ...ergebnis, kleinsterKontrast: Math.min(...ergebnis.text.map((t) => t.aufFlaeche)), kleinsterAufLicht: Math.min(...ergebnis.text.filter((t) => t.aufLicht !== null).map((t) => t.aufLicht)), unter, anzahlText: ergebnis.text.length, text: undefined };
};

/* Fokusring: Farbe des Rings (box-shadow) gegen die Fläche, auf der das Element steht. */
const FOKUS = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  return { element: `${el.tagName.toLowerCase()} ${el.textContent.trim().slice(0, 30)}`, boxShadow: cs.boxShadow.slice(0, 120), aufBuehne: Boolean(el.closest('.buehne')) };
};

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const messung = {};
for (const breite of BREITEN) {
  for (const [id, pfad] of SEITEN) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: breite === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await lib.attrappenSetzen(ctx);
    await ctx.addInitScript(() => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); } catch {} });
    const page = await ctx.newPage();
    await page.goto(BASIS + pfad, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(BILDER, `${id}-${breite}-erster.png`) });
    await page.screenshot({ path: path.join(BILDER, `${id}-${breite}-ganz.png`), fullPage: true });
    const m = await page.evaluate(MESSEN);
    const cls = await page.evaluate(() => new Promise((fertig) => {
      let summe = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) summe += e.value; }).observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => fertig(Math.round(summe * 1000) / 1000), 300);
    }));
    const fokus = [];
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('Tab');
      fokus.push(await page.evaluate(FOKUS));
    }
    await page.screenshot({ path: path.join(BILDER, `${id}-${breite}-fokus.png`) });
    /* Druck: die Bühne druckt hell */
    await page.emulateMedia({ media: 'print' });
    const druck = await page.evaluate(() => [...document.querySelectorAll('.buehne')].map((b) => getComputedStyle(b).backgroundColor + ' / ' + getComputedStyle(b).color).slice(0, 3));
    await page.emulateMedia({ media: 'screen' });
    messung[`${id}-${breite}`] = { pfad, cls, ...m, fokus, druck };
    console.log(id, breite, 'Bühnen', m.buehnen.length, 'Text', m.anzahlText, 'min', m.kleinsterKontrast, 'Licht', m.kleinsterAufLicht, 'unter 4,5', m.unter.length, 'fehlt', m.fehlt.length, 'CLS', cls);
    await ctx.close();
  }
}

/* Menü aufgeklappt (1280), Schublade offen (390), Fokus auf einer Hub-Kachel */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  const page = await ctx.newPage();
  await page.goto(BASIS + '/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Autoschlüssel' }).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(BILDER, 'menue-1280.png') });
  await page.keyboard.press('Escape');
  await page.locator('[data-rubrik]').first().focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  messung['kachel-fokus-1280'] = await page.evaluate(FOKUS);
  await page.screenshot({ path: path.join(BILDER, 'kachel-fokus-1280.png') });
  await page.locator('[data-kopfknopf]').focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  messung['kopfknopf-fokus-1280'] = await page.evaluate(FOKUS);
  await page.screenshot({ path: path.join(BILDER, 'kopfknopf-fokus-1280.png'), clip: { x: 0, y: 0, width: 1280, height: 120 } });
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true, isMobile: true });
  await lib.attrappenSetzen(ctx);
  const page = await ctx.newPage();
  await page.goto(BASIS + '/autoschluessel', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(BILDER, 'schublade-390.png') });
  await ctx.close();
}
await browser.close();
writeFileSync(path.join(hier, 'messung.json'), JSON.stringify(messung, null, 1));
console.log('fertig');
