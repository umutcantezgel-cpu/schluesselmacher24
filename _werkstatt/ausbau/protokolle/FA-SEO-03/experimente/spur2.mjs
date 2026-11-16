import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const BASIS = 'http://localhost:3200';
const modus = process.argv[2];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === BASIS ? r.continue() : r.abort()));
if (modus === 'ohne-eingang') await ctx.addInitScript(() => { const d = document.documentElement; new MutationObserver(() => { if (d.classList.contains('sm24-start')) d.classList.remove('sm24-start'); }).observe(d, { attributes: true, attributeFilter: ['class'] }); });
const CSS = { 'viewbox': '.sm24-eingang-teil{transform-box:view-box!important;transform-origin:0 0!important}', 'contain': 'svg[data-eingang]{contain:layout paint style}', 'contain-buehne': '[data-motion="B-32"]{contain:layout paint style}', 'ohne-eingang-css': '.sm24-eingang-teil{animation:none!important}', 'ohne-alles': '*,*::before,*::after{animation:none!important;transition:none!important}', 'ohne-scroll': '*{animation-timeline:auto!important;view-timeline-name:none!important;animation-name:none!important}' };
if (CSS[modus]) await ctx.addInitScript((css) => { const sh = new CSSStyleSheet(); sh.replaceSync(css); document.adoptedStyleSheets = [...document.adoptedStyleSheets, sh]; }, CSS[modus]);
if (modus === 'ruhig') await ctx.addInitScript(() => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); } catch {} });
const page = await ctx.newPage();
await browser.startTracing(page, { categories: ['disabled-by-default-devtools.timeline.invalidationTracking', 'disabled-by-default-devtools.timeline.stack', 'devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink.user_timing'] });
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.goto(BASIS + '/', { waitUntil: 'load' });
await page.waitForTimeout(5000);
const buf = await browser.stopTracing();
await browser.close();
const ev = JSON.parse(buf.toString()).traceEvents;
const main = ev.filter((e) => e.name === 'RunTask' && e.dur);
// pid/tid of renderer main: thread with most 'ParseHTML'
const ph = ev.find((e) => e.name === 'ParseHTML');
const inv = ev.filter((e) => /Invalidat|ScheduleStyle|LayoutInvalidationTracking|StyleRecalcInvalidationTracking|StyleInvalidatorInvalidationTracking/.test(e.name)); const g = new Map(); for (const e of inv) { const d = e.args?.data ?? {}; const k = e.name + " | " + (d.reason ?? d.invalidationSet ?? "") + " | " + (d.nodeName ?? "").slice(0, 60) + " | " + (d.stackTrace?.[0] ? d.stackTrace[0].functionName + "@" + (d.stackTrace[0].url ?? "").split("/").pop() : (d.stackTrace ? "stack" : "")); g.set(k, (g.get(k) ?? 0) + 1); } for (const [k, n] of [...g.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log("INV", n, k);
const auf = new Map();
for (const e of ev) {
  if (e.pid !== ph.pid || e.tid !== ph.tid || !e.dur || e.ph !== 'X') continue;
  const k = e.name + (e.args?.data?.url ? ' ' + e.args.data.url.replace(BASIS, '').slice(0, 50) : '') + (e.args?.data?.functionName ? ' fn:' + e.args.data.functionName : '') + (e.args?.data?.type ? ' t:' + e.args.data.type : '');
  const x = auf.get(k) ?? { n: 0, ms: 0 }; x.n++; x.ms += e.dur / 1000; auf.set(k, x);
}
const liste = [...auf.entries()].sort((a, b) => b[1].ms - a[1].ms).slice(0, 30);
for (const [k, v] of liste) console.log(modus, Math.round(v.ms), v.n, k);
