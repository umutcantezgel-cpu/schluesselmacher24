// Versuchsskript FA-SEO-03B (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11).
// Welche Schnitte von Plex Mono nutzt sichtbarer Text der neun Ansichten, im ersten Bildschirm und auf der ganzen Seite,
// bei 412 und 1280 px? Dazu: welche Schriftdateien lädt die Seite, und wann (ms nach Navigationsstart, Priorität).
// Aufruf: BASIS=http://localhost:3300 node mono-schnitte.mjs
const BASIS = process.env.BASIS ?? 'http://localhost:3300';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const { ANSICHTEN } = await import(new URL('../../../werkzeuge/leistung.mjs', import.meta.url).href);
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ergebnis = [];
for (const breite of [412, 1280]) {
  for (const a of ANSICHTEN) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: breite === 412 ? 823 : 800 }, deviceScaleFactor: 1 });
    await lib.attrappenSetzen(ctx);
    const page = await ctx.newPage();
    await page.goto(BASIS + a.pfad, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const daten = await page.evaluate(() => {
      const hoehe = innerHeight;
      const zaehl = { erster: {}, ganz: {} };
      const beispiele = {};
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const t = n.textContent.trim(); if (!t) continue;
        const el = n.parentElement; if (!el) continue;
        const cs = getComputedStyle(el);
        if (!/plexMono/i.test(cs.fontFamily)) continue;
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
        if (el.closest('.sr-only')) continue;
        const gew = cs.fontWeight;
        zaehl.ganz[gew] = (zaehl.ganz[gew] ?? 0) + 1;
        if (r.top + scrollY < hoehe) { zaehl.erster[gew] = (zaehl.erster[gew] ?? 0) + 1; (beispiele[gew] ??= []).length < 3 && beispiele[gew].push(t.slice(0, 30)); }
      }
      const schriften = performance.getEntriesByType('resource').filter((r) => /\.woff2/.test(r.name)).map((r) => ({ datei: r.name.split('/').pop(), start: Math.round(r.startTime), ende: Math.round(r.responseEnd), kb: Math.round(r.encodedBodySize / 102.4) / 10 }));
      return { zaehl, beispiele, schriften };
    });
    ergebnis.push({ breite, ansicht: a.id, ...daten });
    console.log(`${breite} ${a.id}: erster Bildschirm ${JSON.stringify(daten.zaehl.erster)} · ganze Seite ${JSON.stringify(daten.zaehl.ganz)} · Beispiele ${JSON.stringify(daten.beispiele)}`);
    console.log(`   Schriften: ${daten.schriften.map((s) => `${s.datei.replace(/\..*$/, '')}@${s.start}ms`).join(', ')}`);
    await ctx.close();
  }
}
await browser.close();
