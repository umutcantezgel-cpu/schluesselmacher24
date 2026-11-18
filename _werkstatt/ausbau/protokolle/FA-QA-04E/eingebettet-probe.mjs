// FA-QA-04E: Eingebetteter Ablauf (Kontakt, `eingebettet`; mit PFAD/KEY auch andere, etwa /beratung beratung-rueckruf) – geht der Fokus nach dem Wechsel ins Leere?
// Nur localhost, Attrappen, nichts wird abgesendet. Zwischenstand mit leeren Daten auf dem letzten Schritt (Absenden),
// zweimal „Zurück“ per Tastatur; der Absendeknopf wird nicht gedrückt.
const BASIS = process.env.BASIS ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const PFAD = process.env.PFAD ?? '/service-und-termin/kontakt';
const KEY = process.env.KEY ?? 'kontakt-nachricht';
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const aus = [];
for (const breite of [412, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: breite, height: breite < 600 ? 823 : 800 }, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript((KEY) => { try { localStorage.setItem('sm24-bewegung', 'ruhig'); localStorage.setItem('sm24:flow:' + (window.__k = KEY), JSON.stringify({ version: 1, data: {}, stepId: 'absenden' })); } catch {} }, KEY);
  const page = await ctx.newPage();
  await page.goto(BASIS + PFAD, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const eingebettet = await page.evaluate(() => document.querySelector('[data-ablauf]')?.getAttribute('data-eingebettet'));
  const wechsel = [];
  for (let n = 0; n < 2; n++) {
    let gefunden = false;
    for (let i = 0; i < 150 && !gefunden; i++) {
      await page.keyboard.press('Tab');
      gefunden = await page.evaluate(() => { const a = document.activeElement; return a?.tagName === 'BUTTON' && a.closest('[data-ablauf]') && a.textContent.trim() === 'Zurück'; });
    }
    if (!gefunden) { wechsel.push({ fehler: 'Zurück nicht gefunden' }); break; }
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);
    wechsel.push(await page.evaluate(() => { const a = document.activeElement; return { titel: document.querySelector('[data-schritt-titel]')?.textContent, fokus: a === document.body ? 'body' : a.tagName.toLowerCase() + (a.hasAttribute('data-schritt-titel') ? '[data-schritt-titel]' : ''), imBild: (() => { const r = a.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })() }; }));
  }
  aus.push({ breite, eingebettet, wechsel });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(aus, null, 1));
