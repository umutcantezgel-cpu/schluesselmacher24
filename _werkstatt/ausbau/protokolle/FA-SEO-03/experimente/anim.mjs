import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const BASIS = 'http://localhost:3200';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === BASIS ? r.continue() : r.abort()));
await ctx.addInitScript(() => {
  window.__snap = [];
  const t0 = performance.now();
  const f = () => { const a = document.getAnimations(); if (a.length) window.__snap.push([Math.round(performance.now()), a.map((x) => `${x.constructor.name}:${x.animationName ?? x.transitionProperty ?? x.id}:${x.playState}:${x.effect?.target?.getAttribute?.('class')?.slice(0, 40) ?? x.effect?.target?.tagName}`)]); if (performance.now() - t0 < 4000) requestAnimationFrame(f); };
  requestAnimationFrame(f);
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.goto(BASIS + '/', { waitUntil: 'load' });
await page.waitForTimeout(4500);
const s = await page.evaluate(() => window.__snap);
const zaehl = new Map();
for (const [t, l] of s) for (const x of l) { const z = zaehl.get(x) ?? [t, t, 0]; z[1] = t; z[2]++; zaehl.set(x, z); }
for (const [k, v] of [...zaehl.entries()].filter(([k]) => k.includes('running')).sort((a, b) => b[1][2] - a[1][2]).slice(0, 40)) console.log(v, k);
console.log('snaps', s.length, 'total distinct', zaehl.size);
await browser.close();
