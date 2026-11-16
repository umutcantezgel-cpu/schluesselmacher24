// Experiment: Lighthouse mobil (gleicher Maßstab wie leistung.mjs) mit eingespielten Varianten der Startseite.
// Versuchsskript FA-SEO-03 (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11):
// Pfade relativ zu diesem Ordner, Browser und Playwright aus werkzeuge/lib.mjs, Attrappen nach G5 (attrappenSetzen).
// Basis: Umgebungsvariable BASIS, sonst http://localhost:3200; nur localhost.
const BASIS = process.env.BASIS ?? 'http://localhost:3200';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const WERKZEUGE = new URL('../../../werkzeuge/', import.meta.url);
const lib = await import(new URL('lib.mjs', WERKZEUGE).href);
const { createRequire } = await import('node:module');
const require = createRequire(new URL('lib.mjs', WERKZEUGE));
const { default: lighthouse } = await import(require.resolve('lighthouse'));
const { launch } = require('chrome-launcher');
const { werteAus } = await import(new URL('leistung.mjs', WERKZEUGE).href);
const N = Number(process.argv[2] ?? 5);
const MODI = (process.argv[3] ?? 'an,spaeter,ruhig').split(',');
const PFAD = process.argv[4] ?? '/';
const SKRIPTE = {
  an: null,
  ruhig: () => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); } catch {} },
  'ohne-eingang': () => { const sh = new CSSStyleSheet(); sh.replaceSync('.sm24-eingang-teil{animation:none!important}'); document.adoptedStyleSheets = [...document.adoptedStyleSheets, sh]; },
  spaeter: () => {
    const sh = new CSSStyleSheet(); sh.replaceSync('.sm24-eingang-teil{animation-play-state:paused!important}'); document.adoptedStyleSheets = [...document.adoptedStyleSheets, sh];
    addEventListener('load', () => { requestAnimationFrame(() => requestIdleCallback(() => { if (performance.now() > 2000 - 1470) document.documentElement.classList.remove('sm24-start'); document.adoptedStyleSheets = document.adoptedStyleSheets.filter((x) => x !== sh); }, { timeout: 300 })); });
  },
};
const erg = Object.fromEntries(MODI.map((m) => [m, []]));
for (let i = 0; i < N; i += 1) for (const m of MODI) {
  const chrome = await launch({ chromePath: lib.CHROMIUM, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'], logLevel: 'silent' });
  const v = await lib.chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
  const ctx = v.contexts()[0];
  await lib.attrappenSetzen(ctx);
  if (SKRIPTE[m]) await ctx.addInitScript(SKRIPTE[m]);
  const e = await lighthouse(BASIS + PFAD, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] });
  await v.close().catch(() => {}); await chrome.kill();
  const w = werteAus(e.lhr);
  const mt = Math.round(e.lhr.audits['mainthread-work-breakdown'].numericValue);
  erg[m].push({ ...w, mt });
  console.error(m, i, w.leistung, Math.round(w.lcp), Math.round(w.tbt), mt);
}
const med = (a) => { const s = a.filter((x) => typeof x === 'number').sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
for (const m of MODI) console.log(PFAD, m, ['leistung', 'fcp', 'lcp', 'tbt', 'si', 'mt'].map((k) => `${k} ${Math.round(med(erg[m].map((x) => x[k])))}`).join(' · '));
