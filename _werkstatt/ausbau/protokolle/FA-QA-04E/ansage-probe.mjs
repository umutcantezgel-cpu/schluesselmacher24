// FA-QA-04E Nachbesserung (Befunde 2 und 5): Was steht nach dem Laden in der Ansage für Wechsel ohne Fokus?
// Mit Zwischenstand (Autoschlüssel-Assistent, Schritt „Fotos“) und ohne. Baum der Zugänglichkeit statt Hörtest.
// Nur localhost (G1), Attrappen (G5), nichts wird abgesendet, erfundene Testdaten.
const BASIS = process.env.BASIS ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const STAND = { version: 3, stepId: 'schluesselfotos', data: { makeSlug: 'volkswagen', modelSlug: '__nicht-aufgefuehrt', modelOther: 'Testmodell', year: '2015', keyKind: 'funk', workingKeys: 1, serviceId: 'zweitschluessel' } };
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const aus = [];
for (const breite of [412, 1280]) {
  for (const mitStand of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: breite < 600 ? 823 : 800 }, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce' });
    await lib.attrappenSetzen(ctx);
    await ctx.addInitScript((stand) => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); if (stand) localStorage.setItem('sm24:flow:autoschluessel-anfrage', JSON.stringify(stand)); } catch {} }, mitStand ? STAND : null);
    const page = await ctx.newPage();
    const html = await (await page.goto(BASIS + '/autoschluessel/anfrage', { waitUntil: 'load' })).text();
    await page.waitForTimeout(1500);
    aus.push({
      breite, mitStand,
      serverAnsageLeer: /<p class="sr-only" aria-live="polite" data-schritt-ansage="true"><\/p>/.test(html),
      titel: (await page.locator('[data-schritt-titel]').textContent())?.trim(),
      ansage: await page.evaluate(() => document.querySelector('[data-schritt-ansage]')?.textContent ?? null),
      live: await page.evaluate(() => document.querySelector('[data-schritt-ansage]')?.getAttribute('aria-live') ?? null),
      fokus: await page.evaluate(() => (document.activeElement === document.body ? 'body' : document.activeElement?.tagName.toLowerCase())),
    });
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(aus, null, 1));
