// Versuchsskript FA-SEO-03B (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11).
// Spur einer Ansicht bei 412 × 823, CPU 4-fach, 6 s; listet die langen Aufgaben (≥ 50 ms) des Hauptthreads mit ihrer
// Zusammensetzung (Ereignisse direkt unter der Aufgabe, nach Dauer). Attrappen nach G5. Nur localhost (G1).
// Aufruf: BASIS=http://localhost:3300 node spur-aufgaben.mjs /pfad [modus]
//   modus „ohne-vorladen“: router.prefetch wird per Init-Skript nicht abgeschaltet, sondern die Ziele werden im
//   Netz abgefangen (RSC-Vorladen mit Header „next-router-prefetch“ beantwortet 204), um die Ursache zu prüfen.
const BASIS = process.env.BASIS ?? 'http://localhost:3300';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const pfad = process.argv[2] ?? '/';
const modus = process.argv[3] ?? '';
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
await lib.attrappenSetzen(ctx);
if (modus === 'ohne-vorladen') {
  await ctx.route('**/*', (route) => {
    const h = route.request().headers();
    if (h['next-router-prefetch'] || h['next-router-segment-prefetch']) return route.fulfill({ status: 204, body: '' });
    return route.fallback();
  });
}
const page = await ctx.newPage();
let vorladen = 0;
page.on('request', (r) => { const h = r.headers(); if (h['next-router-prefetch'] || h['next-router-segment-prefetch']) vorladen++; });
await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'blink.user_timing'] });
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.goto(BASIS + pfad, { waitUntil: 'load' });
await page.waitForTimeout(6000);
const buf = await browser.stopTracing();
await browser.close();
const ev = JSON.parse(buf.toString()).traceEvents;
const ph = ev.find((e) => e.name === 'ParseHTML');
const nav = ev.find((e) => e.name === 'navigationStart' && e.pid === ph.pid) ?? ev.find((e) => e.name === 'ParseHTML');
const t0 = nav.ts;
const main = ev.filter((e) => e.pid === ph.pid && e.tid === ph.tid && e.ph === 'X' && e.dur);
const aufgaben = main.filter((e) => e.name === 'RunTask' && e.dur >= 50000).sort((a, b) => a.ts - b.ts);
console.log(`${pfad} ${modus || 'wie ausgeliefert'} · Vorlade-Anfragen: ${vorladen} · lange Aufgaben: ${aufgaben.length} · Summe über 50 ms: ${Math.round(aufgaben.reduce((s, a) => s + a.dur / 1000 - 50, 0))} ms`);
for (const a of aufgaben) {
  const kinder = main.filter((e) => e !== a && e.ts >= a.ts && e.ts + e.dur <= a.ts + a.dur);
  // nur oberste Ebene unter der Aufgabe
  const oben = kinder.filter((k) => !kinder.some((p) => p !== k && p.ts <= k.ts && p.ts + p.dur >= k.ts + k.dur && p.dur > k.dur));
  const g = new Map();
  for (const k of oben) {
    const d = k.args?.data ?? {};
    const key = k.name + (d.url ? ' ' + String(d.url).replace(BASIS, '').split('/').pop().slice(0, 40) : '') + (d.functionName ? ' ' + d.functionName : '') + (d.type ? ' ' + d.type : '');
    g.set(key, (g.get(key) ?? 0) + k.dur / 1000);
  }
  const teile = [...g.entries()].sort((x, y) => y[1] - x[1]).slice(0, 5).map(([k, v]) => `${k} ${Math.round(v)}`).join('; ');
  console.log(`  bei ${Math.round((a.ts - t0) / 1000)} ms: ${Math.round(a.dur / 1000)} ms · ${teile}`);
}
