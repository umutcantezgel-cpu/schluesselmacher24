import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const BASIS = 'http://localhost:3200';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', headless: true, args: ['--no-sandbox'] });
for (const rate of [1, 4, 6]) for (let i = 0; i < 3; i++) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === BASIS ? r.continue() : r.abort()));
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
