// Versuchsskript FA-SEO-03C (nur zum Nachvollziehen). Läuft in der Werkzeugumgebung (protokolle/einrichtung.md, Abschnitt 11).
// Bedienprobe zu Hebel 1 (Foto-Upload im Autoschlüssel-Assistenten nachgeladen). Attrappen nach G5: Der Upload wird
// abgefangen und mit einer Attrappe beantwortet, nichts wird abgesendet. Nur localhost (G1). Bewegung „ruhig“.
//   Teil A (Weg durch das Formular): Zwischenstand auf Schritt 7 „Leistung“, CPU 4-fach und gedrosselte Leitung;
//     warten, „Weiter“, Datei wählen, „Zurück“, „Weiter“: Datei noch da? Fokus nach dem Schrittwechsel; Platzhalter
//     sichtbar geworden? Wann wurde das Teilbündel mit dem Upload geladen?
//   Teil B (Wiederaufnahme direkt auf Schritt 8): Das Teilbündel mit dem Upload wird zusätzlich 1,5 s zurückgehalten,
//     damit die Fläche sicher steht. Höhe jedes Feldes als Fläche und als Feld; Verschiebungen (CLS).
// Aufruf: BASIS=http://localhost:3300 node upload-pruefung.mjs
const BASIS = process.env.BASIS ?? 'http://localhost:3300';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../../werkzeuge/lib.mjs', import.meta.url).href);
const PFAD = '/autoschluessel/anfrage';
const DATEN = {
  makeSlug: 'volkswagen', modelSlug: '__nicht-aufgefuehrt', modelOther: 'Testmodell', year: '2015',
  keyKind: 'funk', workingKeys: 1, serviceId: 'zweitschluessel',
};
// 1 × 1 px PNG, erfunden.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const MARKE_UPLOAD = 'ist hochgeladen.'; // Ansage für Vorlesegeräte, steht nur in der Oberfläche des Uploads (photo-upload.tsx)

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });

async function kontext({ breite, schritt, zurueckhalten }) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: breite < 600 ? 823 : 800 },
    deviceScaleFactor: 1, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce',
  });
  const abgefangen = await lib.attrappenSetzen(ctx);
  const teilbuendel = [];
  // Später registriert, also zuerst gefragt: Skripte lesen, das Upload-Teilbündel markieren und ggf. zurückhalten.
  await ctx.route(/\/_next\/static\/chunks\/.*\.js$/, async (route) => {
    const antwort = await route.fetch();
    const text = await antwort.text();
    if (text.includes(MARKE_UPLOAD)) {
      teilbuendel.push({ url: new URL(route.request().url()).pathname, zeit: Date.now() });
      if (zurueckhalten) await new Promise((r) => setTimeout(r, zurueckhalten));
    }
    await route.fulfill({ response: antwort, body: text });
  });
  await ctx.addInitScript(({ daten, schritt }) => {
    try {
      localStorage.setItem('sm24-bewegung', 'ruhig');
      localStorage.setItem('sm24:flow:autoschluessel-anfrage', JSON.stringify({ version: 3, data: daten, stepId: schritt }));
    } catch {}
    window.__probe = { cls: 0, clsAlle: 0, verschiebungen: [], platzhalter: [], fehler: [] };
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) {
        window.__probe.clsAlle += e.value;
        if (!e.hadRecentInput) window.__probe.cls += e.value;
        window.__probe.verschiebungen.push({ wert: e.value, eingabe: e.hadRecentInput, zeit: Math.round(e.startTime) });
      }
    }).observe({ type: 'layout-shift', buffered: true });
    const beobachten = () => new MutationObserver(() => {
      for (const el of document.querySelectorAll('[data-upload-platzhalter]')) {
        if (el.__gemessen) continue;
        el.__gemessen = true;
        const block = el.parentElement;
        const liste = block.parentElement;
        window.__probe.platzhalter.push({ index: [...liste.children].indexOf(block), hoehe: block.getBoundingClientRect().height, zeit: Math.round(performance.now()) });
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
    if (document.documentElement) beobachten(); else document.addEventListener('DOMContentLoaded', beobachten);
  }, { daten: DATEN, schritt });
  const page = await ctx.newPage();
  const konsole = [];
  page.on('console', (m) => { if (m.type() === 'error') konsole.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => konsole.push('pageerror: ' + String(e).slice(0, 200)));
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  return { ctx, page, konsole, teilbuendel, abgefangen };
}

/** Höhen der Kinder des Schritt-Inhalts mit Upload-Feldern (dieselbe Liste wie der Platzhalter-Beobachter). */
async function feldHoehen(page) {
  return page.evaluate(() => {
    const feld = document.querySelector('input[type=file]');
    if (!feld) return null;
    let block = feld.closest('.flex.flex-col.gap-3');
    const liste = block.parentElement;
    return [...liste.children].map((k, i) => ({ index: i, hoehe: k.getBoundingClientRect().height, upload: Boolean(k.querySelector('input[type=file]')) }));
  });
}

async function fokus(page) {
  return page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()}${a.hasAttribute('data-schritt-titel') ? '[data-schritt-titel]' : ''}: ${(a.textContent || '').trim().slice(0, 60)}` : null; });
}

const ergebnis = { basis: BASIS };

// ---------- Teil A ----------
{
  const { ctx, page, konsole, teilbuendel, abgefangen } = await kontext({ breite: 412, schritt: 'leistung' });
  const t0 = Date.now();
  await page.goto(BASIS + PFAD, { waitUntil: 'load' });
  const geladen = Date.now();
  await page.waitForTimeout(5000);
  const vorWeiter = teilbuendel.map((t) => ({ ...t, nachLoadMs: t.zeit - geladen }));
  const titelVorher = await page.locator('[data-schritt-titel]').textContent();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForSelector('#schluessel-vorderseite-gallery', { state: 'attached', timeout: 20000 });
  await page.waitForTimeout(800);
  const titel8 = await page.locator('[data-schritt-titel]').textContent();
  const fokus8 = await fokus(page);
  const platzhalterA = await page.evaluate(() => window.__probe.platzhalter.length);
  const spaeterWeiter = await page.getByText('später weitermachen', { exact: false }).count();
  await page.setInputFiles('#schluessel-vorderseite-gallery', { name: 'test-vorderseite.png', mimeType: 'image/png', buffer: PNG });
  await page.getByText('Gespeichert').first().waitFor({ timeout: 20000 });
  await page.getByRole('button', { name: 'Zurück' }).click();
  await page.waitForTimeout(800);
  const titel7 = await page.locator('[data-schritt-titel]').textContent();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForSelector('#schluessel-vorderseite-gallery', { state: 'attached', timeout: 20000 });
  await page.waitForTimeout(800);
  const dateiNochDa = await page.getByText('test-vorderseite.png').count();
  const fokus8b = await fokus(page);
  // Tastatur: Tab vom Schritttitel erreicht die Knöpfe des Feldes
  const tabs = [];
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); tabs.push(await fokus(page)); }
  const probe = await page.evaluate(() => window.__probe);
  ergebnis.A = {
    ladezeitMs: geladen - t0, uploadTeilbuendelVorWeiter: vorWeiter, titelVorher, titel8, fokus8, titel7, dateiNochDa, fokus8b,
    platzhalterGesehen: platzhalterA, spaeterWeitermachenTreffer: spaeterWeiter,
    tabFolge: tabs, cls: probe.cls, clsMitEingabe: probe.clsAlle, konsole, abgefangen: abgefangen.map((a) => `${a.art} ${a.url}`),
  };
  await ctx.close();
}

// ---------- Teil B ----------
ergebnis.B = [];
for (const breite of [412, 1280]) {
  const { ctx, page, konsole, teilbuendel } = await kontext({ breite, schritt: 'schluesselfotos', zurueckhalten: 1500 });
  await page.goto(BASIS + PFAD, { waitUntil: 'load' });
  await page.waitForSelector('#schluessel-vorderseite-gallery', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(1500);
  const nachher = await feldHoehen(page);
  const probe = await page.evaluate(() => window.__probe);
  ergebnis.B.push({
    breite, teilbuendel: teilbuendel.map((t) => t.url), platzhalter: probe.platzhalter,
    felder: nachher, vergleich: probe.platzhalter.map((p) => ({ index: p.index, flaeche: p.hoehe, feld: nachher?.[p.index]?.hoehe, gleich: Math.abs(p.hoehe - (nachher?.[p.index]?.hoehe ?? -1)) < 0.5 })),
    cls: probe.cls, verschiebungen: probe.verschiebungen, konsole,
  });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(ergebnis, null, 1));
