// Nachbesserung FA-SEO-03C, Befund 3: Teilbündel des Uploads scheitert dauerhaft (404 wie nach neuer Fassung).
// Zwischenstand direkt auf Schritt 9 (Fahrzeugschein). Nur localhost, Attrappen (G5), Bewegung „ruhig“.
const BASIS = process.env.BASIS ?? 'http://localhost:3300';
if (!['localhost', '127.0.0.1'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import('/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/lib.mjs');
const DATEN = { makeSlug: 'volkswagen', modelSlug: '__nicht-aufgefuehrt', modelOther: 'Testmodell', year: '2015', keyKind: 'funk', workingKeys: 1, serviceId: 'zweitschluessel' };
const b = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ergebnis = {};
for (const breite of [412, 1280]) {
  const ctx = await b.newContext({ viewport: { width: breite, height: breite < 600 ? 823 : 800 }, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  const gesperrt = [];
  await ctx.route(/\/_next\/static\/chunks\/.*\.js$/, async (route) => {
    const antwort = await route.fetch();
    const text = await antwort.text();
    if (text.includes('ist hochgeladen.')) { gesperrt.push(Date.now()); return route.fulfill({ status: 404, body: 'nicht gefunden' }); }
    return route.fulfill({ response: antwort, body: text });
  });
  await ctx.addInitScript((daten) => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); localStorage.setItem('sm24:flow:autoschluessel-anfrage', JSON.stringify({ version: 3, data: daten, stepId: 'fahrzeugschein' })); } catch {} }, DATEN);
  const page = await ctx.newPage();
  const konsole = [];
  page.on('pageerror', (e) => konsole.push('pageerror: ' + String(e).slice(0, 200)));
  const t0 = Date.now();
  await page.goto(BASIS + '/autoschluessel/anfrage', { waitUntil: 'load' });
  const hoeheVorher = await page.locator('[data-upload-platzhalter]').first().evaluate((el) => el.parentElement.getBoundingClientRect().height);
  const hinweis = page.getByText('konnte nicht geladen werden.');
  const sichtbarNach2s = await (async () => { await page.waitForTimeout(2000); return hinweis.isVisible(); })();
  await hinweis.waitFor({ state: 'visible', timeout: 20000 });
  const ms = Date.now() - t0;
  const knopf = page.getByRole('button', { name: 'Seite neu laden' });
  const alert = await page.locator('[role=alert]', { hasText: 'konnte nicht geladen werden.' }).count();
  const hoeheNachher = await page.locator('[data-upload-platzhalter]').first().evaluate((el) => el.parentElement.getBoundingClientRect().height);
  const knopfZahl = await knopf.count();
  await knopf.scrollIntoViewIfNeeded();
  const knopfVorn = await knopf.evaluate((el) => { const r = el.getBoundingClientRect(); const o = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return el === o || el.contains(o); });
  const versucheBisHinweis = gesperrt.length;
  await page.waitForTimeout(12000);
  const versucheNach12s = gesperrt.length;
  // Erreichbar mit der Tastatur
  await knopf.focus();
  const fokus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  const [nav] = await Promise.all([page.waitForNavigation({ timeout: 15000 }).then(() => true).catch(() => false), page.keyboard.press('Enter')]);
  ergebnis[breite] = { sichtbarNach2s, hinweisNachMs: ms, alert, knopfZahl, knopfVorn, hoeheVorher, hoeheNachher, versucheBisHinweis, versucheNach12s, fokus, neuGeladen: nav, konsole };
  await ctx.close();
}
console.log(JSON.stringify(ergebnis, null, 1));
await b.close();
