// Versuchsskript FA-SEO-03 (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11):
// Pfade relativ zu diesem Ordner, Browser und Playwright aus werkzeuge/lib.mjs, Attrappen nach G5 (attrappenSetzen).
// Basis: Umgebungsvariable BASIS, sonst http://localhost:3200; nur localhost.
const BASIS = process.env.BASIS ?? 'http://localhost:3200';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const { chromium } = lib;
const browser = await chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
for (const rate of [1, 4, 6]) for (let i = 0; i < 3; i++) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => { window.__dcl = performance.now(); });
    addEventListener('load', () => { window.__load = performance.now(); requestAnimationFrame(() => { window.__raf = performance.now(); requestIdleCallback(() => { window.__idle = performance.now(); }, { timeout: 300 }); }); });
    // Hydration erkennbar am Pause-Knopf (erscheint erst nach dem Hydrieren, Bewegung an)
    const t = setInterval(() => { if (document.querySelector('[data-motion="B-32"] button')) { window.__hyd = performance.now(); clearInterval(t); } }, 10);
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await page.goto(BASIS + '/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => ({ fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime), dcl: Math.round(window.__dcl), load: Math.round(window.__load), hyd: Math.round(window.__hyd), raf: Math.round(window.__raf), idle: Math.round(window.__idle) }));
  console.log('cpu', rate, JSON.stringify(r));
  await ctx.close();
}
await browser.close();
