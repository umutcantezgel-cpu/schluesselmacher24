// FA-QA-04E Nachbesserung (Befund 3): die übrigen Bedienwege im echten Browser, bei 412 und 1280 px.
// „Weiter“ per Tastatur, Browser-Zurück (page.goBack) und -Vorwärts (page.goForward), Schrittknopf in der Leiste
// (Tastatur; die Leiste steht nur ab 768 px) in Konfigurator, Partner-Bewerbung und E-Scooter-Anfrage, dazu ein
// übernommener Vorschlag der Fahrzeugsuche im Autoschlüssel-Assistenten.
// Nur localhost (G1), Attrappen (G5), nichts wird abgesendet; erfundene Testdaten; Bewegung „ruhig“.
// Aufruf: BASIS=http://localhost:3000 node wege-probe.mjs
const BASIS = process.env.BASIS ?? 'http://localhost:3000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(BASIS).hostname)) throw new Error('nur localhost (G1)');
process.env.SM24_BASIS_URL = BASIS;
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });

async function kontext(breite) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: breite < 600 ? 823 : 800 },
    deviceScaleFactor: 1, isMobile: breite < 600, hasTouch: breite < 600, reducedMotion: 'reduce',
  });
  await lib.attrappenSetzen(ctx);
  await ctx.addInitScript(() => {
    try { localStorage.setItem('sm24-bewegung', 'ruhig'); } catch {}
  });
  const page = await ctx.newPage();
  const konsole = [];
  page.on('pageerror', (e) => konsole.push('pageerror: ' + String(e).slice(0, 200)));
  return { ctx, page, konsole };
}

async function fokus(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return { el: 'body', ort: 'seite' };
    const ort = a.closest('header') ? 'kopfzeile' : a.closest('.sm24-ablauf-leiste') ? 'leiste' : a.closest('[data-ablauf]') ? 'ablauf' : 'seite';
    const r = a.getBoundingClientRect();
    return {
      el: `${a.tagName.toLowerCase()}${a.hasAttribute('data-schritt-titel') ? '[data-schritt-titel]' : ''}`,
      text: (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
      ort,
      ring: a.matches(':focus-visible'),
      imBild: r.bottom > 0 && r.top < innerHeight,
    };
  });
}

const titel = async (page) => (await page.locator('[data-schritt-titel]').textContent())?.trim();
const ansage = async (page) => page.evaluate(() => document.querySelector('[data-schritt-ansage]')?.textContent ?? null);

/** Mit Tab bis zu einem freien Knopf im Ablauf, dessen Text die Bedingung erfüllt, dann Enter. */
async function perTastatur(page, passt, rueckwaerts = false) {
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press(rueckwaerts ? 'Shift+Tab' : 'Tab');
    const treffer = await page.evaluate((quelle) => {
      const a = document.activeElement;
      const text = (a?.textContent || '').trim().replace(/\s+/g, ' ');
      // eslint-disable-next-line no-new-func
      return a?.tagName === 'BUTTON' && !a.disabled && a.closest('[data-ablauf]') && new Function('t', `return ${quelle}`)(text);
    }, passt);
    if (treffer) {
      await page.keyboard.press('Enter');
      return i + 1;
    }
  }
  return null;
}

/** Schritt 1 mit erfundenen Angaben füllen, nur Tastatur (Feld fokussieren, tippen; Optionen mit Leertaste). */
async function schrittEinsFuellen(page, art) {
  if (art === 'radio') {
    await page.locator('[data-ablauf] input[type=radio]').first().focus();
    await page.keyboard.press('Space');
    return;
  }
  const felder = page.locator('[data-ablauf] [data-schritt-titel] ~ * input:visible, [data-ablauf] input:visible:not([type=hidden]):not([name=website])');
  const n = await felder.count();
  for (let i = 0; i < n; i++) {
    const f = felder.nth(i);
    const typ = (await f.getAttribute('type')) ?? 'text';
    if (!['text', 'email', 'tel', 'number', 'search', ''].includes(typ)) continue;
    const name = await f.evaluate((e) => `${e.name} ${e.autocomplete} ${e.inputMode} ${e.id ? document.querySelector(`label[for="${e.id}"]`)?.textContent ?? '' : ''}`.toLowerCase());
    const wert = typ === 'email' ? 'pruefung@example.com'
      : typ === 'tel' ? '030 1234567'
      : /year|baujahr/.test(name) ? '2020'
      : /postal|plz|numeric/.test(name) ? '10115'
      : 'Testangabe';
    await f.focus();
    await page.keyboard.type(wert);
  }
}

const ABLAEUFE = [
  { name: 'Konfigurator gleichschließende Zylinder', pfad: '/gleichschliessende-zylinder/konfigurator', art: 'radio', erster: 'Hersteller' },
  { name: 'Partner-Bewerbung', pfad: '/partner-werden', art: 'felder', erster: 'Betrieb' },
  { name: 'Fahrzeug-Anfrage E-Scooter', pfad: '/e-scooter/anfrage', art: 'felder', erster: 'Fahrzeug' },
];

async function messen(page, weg, von) {
  await page.waitForTimeout(700);
  const nach = await titel(page);
  const f = await fokus(page);
  const a = await ansage(page);
  const lage = await page.evaluate(() => {
    const r = document.querySelector('[data-schritt-titel]').getBoundingClientRect();
    return { scrollY: Math.round(scrollY), titelOben: Math.round(r.top), titelUnten: Math.round(r.bottom), hoehe: innerHeight };
  });
  await page.keyboard.press('Tab');
  const naechster = await fokus(page);
  await page.keyboard.press('Shift+Tab');
  return { weg, von, nach, fokus: f, ansage: a, lage, naechsterTab: naechster };
}

const ergebnis = { basis: BASIS, ablaeufe: [], vorschlag: [] };

for (const breite of [412, 1280]) {
  for (const ab of ABLAEUFE) {
    const { ctx, page, konsole } = await kontext(breite);
    await page.goto(BASIS + ab.pfad, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const wechsel = [];
    await schrittEinsFuellen(page, ab.art);
    const weiterFrei = await page.evaluate(() => [...document.querySelectorAll('[data-ablauf] button')].some((b) => b.textContent.trim() === 'Weiter' && !b.disabled));
    let von = await titel(page);
    if (!weiterFrei) {
      ergebnis.ablaeufe.push({ breite, ablauf: ab.name, fehler: 'Schritt 1 nicht frei', konsole });
      await ctx.close();
      continue;
    }
    // 1. „Weiter“ per Tastatur
    await perTastatur(page, "t === 'Weiter'");
    wechsel.push(await messen(page, 'Weiter (Tastatur)', von));
    von = wechsel.at(-1).nach;
    // 2. Browser-Zurück
    await page.goBack();
    wechsel.push(await messen(page, 'Browser-Zurück', von));
    von = wechsel.at(-1).nach;
    // 3. Browser-Vorwärts
    await page.goForward();
    wechsel.push(await messen(page, 'Browser-Vorwärts', von));
    von = wechsel.at(-1).nach;
    // 4. Schrittknopf des ersten Schritts in der Leiste (nur ab 768 px sichtbar; erledigt trägt er einen Haken statt „1.“)
    if (breite >= 768) {
      // Die Leiste steht über der Überschrift: rückwärts mit Umschalt+Tab.
      await perTastatur(page, `t === ${JSON.stringify(ab.erster)}`, true);
      wechsel.push(await messen(page, `Schrittknopf „${ab.erster}“ (Tastatur)`, von));
    } else {
      const sichtbar = await page.evaluate(() => [...document.querySelectorAll('[data-ablauf] ol button')].some((b) => b.offsetParent !== null));
      wechsel.push({ weg: 'Schrittknopf', hinweis: sichtbar ? 'sichtbar, nicht geprüft' : 'Leiste unter 768 px ausgeblendet (md:flex)' });
    }
    ergebnis.ablaeufe.push({ breite, ablauf: ab.name, wechsel, konsole });
    await ctx.close();
  }

  // Übernommener Vorschlag: Autoschlüssel-Assistent, Fahrzeugsuche tippen, „Weiter“ per Tastatur.
  {
    const { ctx, page, konsole } = await kontext(breite);
    await page.goto(BASIS + '/autoschluessel/anfrage', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const von = await titel(page);
    const suche = page.locator('[data-ablauf] input[type=search]').first();
    await suche.focus();
    await page.keyboard.type('Golf');
    await page.waitForTimeout(1500);
    const hinweis = await page.evaluate(() => document.querySelector('[data-gesperrt-hinweis]')?.textContent?.trim() ?? null);
    const tabs = await perTastatur(page, "t === 'Weiter'");
    const m = await messen(page, 'Vorschlag übernommen (Weiter, Tastatur)', von);
    ergebnis.vorschlag.push({ breite, hinweisVorher: hinweis, tabsBisWeiter: tabs, ...m, konsole });
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(ergebnis, null, 1));
