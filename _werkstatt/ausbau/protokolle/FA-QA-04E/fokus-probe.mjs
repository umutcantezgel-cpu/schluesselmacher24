// FA-QA-04E Teil 1: Fokus nach dem Schrittwechsel, nur mit der Tastatur, bei 412 und 1280 px.
// Nur localhost (G1), Attrappen (G5), nichts wird abgesendet. Bewegung „ruhig“. Erfundene Testdaten.
// Aufruf: BASIS=http://localhost:3000 node fokus-probe.mjs
const BASIS = process.env.BASIS ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);

const ASSISTENT = {
  makeSlug: 'volkswagen', modelSlug: '__nicht-aufgefuehrt', modelOther: 'Testmodell', year: '2015',
  keyKind: 'funk', workingKeys: 1, serviceId: 'zweitschluessel',
};
const ABLAEUFE = [
  { name: 'Autoschlüssel-Assistent', pfad: '/autoschluessel/anfrage', key: 'autoschluessel-anfrage', version: 3, stepId: 'marke', data: ASSISTENT,
    weg: [...Array(7).fill('Weiter'), ...Array(7).fill('Zurück')], ziel: 'Fotos Ihres Schlüssels' },
  { name: 'Konfigurator gleichschließende Zylinder', pfad: '/gleichschliessende-zylinder/konfigurator', key: 'zylinder-konfigurator', version: 1, stepId: 'schluessel', data: {}, weg: ['Zurück', 'Zurück'] },
  { name: 'Partner-Bewerbung', pfad: '/partner-werden', key: 'partner-bewerbung', version: 2, stepId: 'leistungen', data: {}, weg: ['Zurück', 'Zurück'] },
  { name: 'Fahrzeug-Anfrage E-Scooter', pfad: '/e-scooter/anfrage', key: 'fahrzeug-anfrage-e-scooter', version: 1, stepId: 'unterlagen', data: {}, weg: ['Zurück', 'Zurück'] },
];

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });

async function kontext(breite, stand) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: breite < 600 ? 823 : 800 },
    deviceScaleFactor: 1, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce',
  });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript((stand) => {
    try {
      localStorage.setItem('sm24-bewegung', 'ruhig');
      if (stand) localStorage.setItem(`sm24:flow:${stand.key}`, JSON.stringify({ version: stand.version, data: stand.data, stepId: stand.stepId }));
    } catch {}
  }, stand ?? null);
  const page = await ctx.newPage();
  const konsole = [];
  page.on('pageerror', (e) => konsole.push('pageerror: ' + String(e).slice(0, 200)));
  return { ctx, page, konsole };
}

/** Das fokussierte Element, knapp beschrieben, mit Lage (Kopfzeile, Schritt, Leiste). */
async function fokus(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return { el: 'body', ort: 'seite' };
    const ort = a.closest('header') ? 'kopfzeile' : a.closest('.sm24-ablauf-leiste') ? 'leiste' : a.closest('[data-ablauf]') ? 'ablauf' : 'seite';
    return {
      el: `${a.tagName.toLowerCase()}${a.hasAttribute('data-schritt-titel') ? '[data-schritt-titel]' : ''}`,
      text: (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
      ort,
      ring: a.matches(':focus-visible'),
    };
  });
}

/** Mit Tab bis zu einem freien Knopf mit diesem Namen, dann Enter. */
async function tasteDruecken(page, name) {
  for (let i = 0; i < 120; i++) {
    await page.keyboard.press('Tab');
    const treffer = await page.evaluate((name) => {
      const a = document.activeElement;
      return a?.tagName === 'BUTTON' && !a.disabled && a.closest('[data-ablauf]') && (a.textContent || '').trim() === name;
    }, name);
    if (treffer) {
      await page.keyboard.press('Enter');
      return i + 1;
    }
  }
  return null;
}

async function titel(page) {
  return (await page.locator('[data-schritt-titel]').textContent())?.trim();
}

const ergebnis = { basis: BASIS, ablaeufe: [], maus: [], laden: [] };

for (const breite of [412, 1280]) {
  for (const ab of ABLAEUFE) {
    const { ctx, page, konsole } = await kontext(breite, ab);
    await page.goto(BASIS + ab.pfad, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const wechsel = [];
    let vorher = await titel(page);
    for (const knopf of ab.weg) {
      const tabs = await tasteDruecken(page, knopf);
      await page.waitForTimeout(700);
      const nachher = await titel(page);
      const f = await fokus(page);
      const aria = f.el.includes('data-schritt-titel') ? await page.locator(':focus').ariaSnapshot().catch(() => null) : null;
      const beschreibung = await page.evaluate(() => {
        const a = document.activeElement;
        const id = a?.getAttribute('aria-describedby');
        return id ? document.getElementById(id)?.textContent?.trim() : null;
      });
      // Der nächste Tab: landet er im Schritt oder in der Kopfzeile?
      await page.keyboard.press('Tab');
      const naechster = await fokus(page);
      await page.keyboard.press('Shift+Tab');
      wechsel.push({ knopf, tabsBisKnopf: tabs, von: vorher, nach: nachher, fokus: f, aria, beschreibung, naechsterTab: naechster });
      vorher = nachher;
    }
    ergebnis.ablaeufe.push({ breite, ablauf: ab.name, wechsel, konsole });
    await ctx.close();
  }

  // Maus und Finger: kein Ring an der Überschrift; am Telefon steht sie nach „Weiter“ sichtbar unter dem festen Kopf.
  {
    const ab = ABLAEUFE[0];
    const { ctx, page } = await kontext(breite, ab);
    await page.goto(BASIS + ab.pfad, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const weiter = page.getByRole('button', { name: 'Weiter', exact: true });
    if (breite < 600) await weiter.tap(); else await weiter.click();
    await page.waitForTimeout(1200);
    const f = await fokus(page);
    const lage = await page.evaluate(() => {
      const h = document.querySelector('[data-schritt-titel]').getBoundingClientRect();
      const kopf = document.querySelector('header')?.getBoundingClientRect();
      const band = document.querySelector('[data-ablauf] .sticky')?.getBoundingClientRect();
      const s = getComputedStyle(document.querySelector('[data-schritt-titel]'));
      return { titelOben: Math.round(h.top), titelUnten: Math.round(h.bottom), kopfUnten: Math.round(kopf?.bottom ?? 0), bandUnten: Math.round(band?.bottom ?? 0), hoehe: innerHeight, outline: s.outlineStyle, schatten: s.boxShadow };
    });
    ergebnis.maus.push({ breite, eingabe: breite < 600 ? 'Finger' : 'Maus', titel: await titel(page), fokus: f, lage, sichtbarUnterKopf: lage.titelOben >= lage.bandUnten && lage.titelUnten <= lage.hoehe });
    await ctx.close();
  }

  // Laden ohne Zwischenstand: kein Fokus im Formular.
  {
    const { ctx, page } = await kontext(breite, null);
    await page.goto(BASIS + ABLAEUFE[0].pfad, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    ergebnis.laden.push({ breite, titel: await titel(page), fokus: await fokus(page) });
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(ergebnis, null, 1));
