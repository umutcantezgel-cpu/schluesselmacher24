// FA-QA-04E Teil 2: Was verschiebt sich beim Fortsetzen eines Zwischenstands im Autoschlüssel-Assistenten?
// Nur localhost (G1), Attrappen (G5), nichts wird abgesendet. Bewegung „ruhig“.
// Aufruf: BASIS=http://localhost:3200 SCHRITT=schluesselfotos node verschiebung-quellen.mjs
const BASIS = process.env.BASIS ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const PFAD = '/autoschluessel/anfrage';
const SCHRITT = process.env.SCHRITT ?? 'schluesselfotos';
const DATEN = {
  makeSlug: 'volkswagen', modelSlug: '__nicht-aufgefuehrt', modelOther: 'Testmodell', year: '2015',
  keyKind: 'funk', workingKeys: 1, serviceId: 'zweitschluessel',
};
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ergebnis = { basis: BASIS, schritt: SCHRITT, laeufe: [] };
for (const mitStand of [false, true]) for (const breite of [412, 1280]) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: breite < 600 ? 823 : 800 },
    deviceScaleFactor: 1, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce',
  });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript(({ daten, schritt, mitStand }) => {
    try {
      localStorage.setItem('sm24-bewegung', 'ruhig');
      if (mitStand) localStorage.setItem('sm24:flow:autoschluessel-anfrage', JSON.stringify({ version: 3, data: daten, stepId: schritt }));
    } catch {}
    window.__probe = { cls: 0, eintraege: [], lcp: null };
    const beschreiben = (n) => {
      if (!n) return null;
      if (n.nodeType !== 1) return `#text(${(n.textContent || '').trim().slice(0, 30)}) in ${beschreiben(n.parentElement)}`;
      const k = (n.getAttribute('class') || '').split(/\s+/).slice(0, 4).join('.');
      const attr = [...n.attributes].filter((a) => a.name.startsWith('data-')).map((a) => a.name).join(',');
      return `${n.tagName.toLowerCase()}${attr ? `[${attr}]` : ''}${k ? '.' + k : ''} «${(n.textContent || '').trim().slice(0, 40)}»`;
    };
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) {
        if (!e.hadRecentInput) window.__probe.cls += e.value;
        window.__probe.eintraege.push({
          wert: +e.value.toFixed(4), eingabe: e.hadRecentInput, zeit: Math.round(e.startTime),
          quellen: (e.sources || []).map((s) => ({ knoten: beschreiben(s.node), vorher: [s.previousRect.y, s.previousRect.height].map(Math.round), nachher: [s.currentRect.y, s.currentRect.height].map(Math.round) })),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) window.__probe.lcp = { zeit: Math.round(e.startTime), knoten: beschreiben(e.element) };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }, { daten: DATEN, schritt: SCHRITT, mitStand });
  const page = await ctx.newPage();
  const konsole = [];
  page.on('console', (m) => { if (m.type() === 'error') konsole.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => konsole.push('pageerror: ' + String(e).slice(0, 200)));
  await page.goto(BASIS + PFAD, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const titel = await page.locator('[data-schritt-titel]').textContent();
  const fokus = await page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()}${a.hasAttribute('data-schritt-titel') ? '[data-schritt-titel]' : ''}` : null; });
  const fokusImFormular = await page.evaluate(() => Boolean(document.activeElement?.closest('[data-ablauf]')));
  const probe = await page.evaluate(() => window.__probe);
  ergebnis.laeufe.push({ mitStand, breite, titel, fokus, fokusImFormular, cls: +probe.cls.toFixed(4), lcp: probe.lcp, verschiebungen: probe.eintraege, konsole });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(ergebnis, null, 1));
