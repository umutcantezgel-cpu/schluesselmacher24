// Versuchsskript FA-SEO-03C (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11).
// Vorprobe zu Hebel 3: Wie viel Stil- und Layoutarbeit spart `content-visibility: auto` auf der langen Autoschlüssel-Seite?
// Die Regel wird nicht gebaut, sondern in das ausgelieferte HTML eingesetzt (Abfangen der Seitenanfrage), damit beide
// Varianten auf demselben Stand laufen. Spur bei 412 × 823, CPU 4-fach, bis 6 s nach „load“, Varianten im Wechsel.
// Gezählt: lange Aufgaben (≥ 50 ms) und ihre Summe über 50 ms; Summe aller Stil-, Layout- und Zeichenereignisse des Hauptthreads;
// Hauptthread gesamt = Summe aller Aufgaben (RunTask) bis 6 s nach „load“.
// Aufruf: BASIS=http://localhost:3200 node cv-spur.mjs /autoschluessel <läufe je Variante> [varianten, Komma]
// Varianten: keine | ab-ablauf (#ablauf und folgende Abschnitte) | ab-aufbau (#aufbau und folgende) | ohne-leistungen.
const BASIS = process.env.BASIS ?? 'http://localhost:3200';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const pfad = process.argv[2] ?? '/autoschluessel';
const laeufe = Number(process.argv[3] ?? 4);
const varianten = (process.argv[4] ?? 'keine,ab-ablauf,ab-aufbau').split(',');
const REGEL = {
  keine: '',
  'ab-ablauf': '#ablauf,#ablauf~section{content-visibility:auto;contain-intrinsic-size:auto 900px}',
  'ab-aufbau': '#aufbau,#aufbau~section{content-visibility:auto;contain-intrinsic-size:auto 900px}',
  // ohne #leistungen: dort öffnen sich Hinweise (InfoTip, absolut, z-header), die Malbegrenzung würde sie abschneiden.
  'ohne-leistungen': '#aufbau,#schluesselarten,#schluesselarten~section{content-visibility:auto;contain-intrinsic-size:auto 900px}',
};
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
async function lauf(variante) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  await lib.attrappenSetzen(ctx);
  const regel = REGEL[variante];
  if (regel) {
    await ctx.route(BASIS + pfad, async (route) => {
      const antwort = await route.fetch();
      const html = (await antwort.text()).replace('</head>', `<style data-versuch>${regel}</style></head>`);
      await route.fulfill({ response: antwort, body: html });
    });
  }
  const page = await ctx.newPage();
  await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'] });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(BASIS + pfad, { waitUntil: 'load' });
  await page.waitForTimeout(6000);
  const buf = await browser.stopTracing();
  await ctx.close();
  const ev = JSON.parse(buf.toString()).traceEvents;
  const ph = ev.find((e) => e.name === 'ParseHTML');
  const main = ev.filter((e) => e.pid === ph.pid && e.tid === ph.tid && e.ph === 'X' && e.dur);
  const lange = main.filter((e) => e.name === 'RunTask' && e.dur >= 50000);
  const summe = (namen) => Math.round(main.filter((e) => namen.includes(e.name)).reduce((s, e) => s + e.dur, 0) / 1000);
  return {
    variante,
    lange: lange.length,
    ueber50: Math.round(lange.reduce((s, a) => s + a.dur / 1000 - 50, 0)),
    stil: summe(['UpdateLayoutTree']),
    layout: summe(['Layout']),
    zeichnen: summe(['Paint', 'PrePaint', 'Layerize']),
    gesamt: Math.round(main.filter((e) => e.name === 'RunTask').reduce((s, e) => s + e.dur, 0) / 1000),
  };
}
const erg = [];
for (let i = 0; i < laeufe; i++) for (const v of varianten) { const r = await lauf(v); erg.push(r); console.log(JSON.stringify(r)); }
await browser.close();
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
console.log(`\n${pfad} · ${laeufe} Läufe je Variante · Median (Spanne)`);
console.log('| Variante | lange Aufgaben | Summe über 50 ms | Stil ms | Layout ms | Stil + Layout ms | Zeichnen ms | Hauptthread gesamt ms |');
console.log('|---|---|---|---|---|---|---|---|');
for (const v of varianten) {
  const r = erg.filter((x) => x.variante === v);
  const f = (k) => { const a = r.map((x) => (typeof k === 'function' ? k(x) : x[k])); return `${median(a)} (${Math.min(...a)}–${Math.max(...a)})`; };
  console.log(`| ${v} | ${f('lange')} | ${f('ueber50')} | ${f('stil')} | ${f('layout')} | ${f((x) => x.stil + x.layout)} | ${f('zeichnen')} | ${f('gesamt')} |`);
}
