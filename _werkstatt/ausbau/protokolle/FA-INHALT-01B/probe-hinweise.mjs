// FA-INHALT-01B: Browserprobe der Tutorial-Hinweise am Produktions-Build (ohne Schalter, ohne Probeneintrag).
// Je Ort: Hinweis da (oder nichts, wenn kein veröffentlichter Eintrag), Verweis führt auf die richtige Seite;
// in zwei Formularen öffnet der Verweis ein neues Fenster und der Zwischenstand bleibt; Schrift ≥ 14 px und
// kein Überlauf bei 412 px. Nur localhost (G1), fremde Adressen werden abgebrochen und protokolliert.
// Aufruf: node probe-hinweise.mjs http://localhost:3000 <bilderordner> [ausgabe.json]
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const basis = process.argv[2] ?? 'http://localhost:3000';
const bilder = process.argv[3];
if (bilder) mkdirSync(bilder, { recursive: true });
if (!['localhost', '127.0.0.1'].includes(new URL(basis).hostname)) throw new Error('nur localhost (G1)');

/** Seite → erwartete Hinweise je Ort (Slugs); leere Liste: an diesem Ort darf nichts erscheinen. */
const SEITEN = [
  { pfad: '/schluessel-nach-vorlage', orte: { 'schluessel-nach-vorlage': ['schluessel-richtig-fotografieren'] } },
  { pfad: '/schluessel-nach-code', orte: { 'schluessel-nach-code': ['so-funktioniert-schluessel-nach-code'] } },
  { pfad: '/schluessel-einschicken', orte: { 'schluessel-einschicken': ['schluessel-richtig-einschicken'] } },
  { pfad: '/gleichschliessende-zylinder', orte: { 'gleichschliessende-zylinder': ['profilzylinder-messen', 'not-und-gefahrenfunktion', 'was-bedeutet-gleichschliessend'] } },
  { pfad: '/schliessanlagen', orte: { schliessanlagen: ['hs-und-ghs'] } },
  { pfad: '/autoschluessel/gehaeuse', orte: { 'autoschluessel-gehaeuse': [] } },
  { pfad: '/schluessel-nach-vorlage/anfrage', orte: { 'schluessel-nach-vorlage-fotos': ['schluessel-richtig-fotografieren'] }, formular: true },
  {
    pfad: '/gleichschliessende-zylinder/konfigurator',
    orte: { 'gleichschliessende-zylinder-messen': ['profilzylinder-messen'], 'gleichschliessende-zylinder-funktion': ['not-und-gefahrenfunktion'] },
    formular: true,
    zumSchritt: 'gleichschliessende-zylinder-messen',
  },
];

const zeilen = [];
let alleGut = true;
const pruefe = (b, text) => { zeilen.push(`${b ? 'OK  ' : 'FEHL'} ${text}`); if (!b) alleGut = false; };
const fremd = [];
const titelCache = new Map();
async function tutorialTitel(href) {
  if (!titelCache.has(href)) {
    const antwort = await fetch(basis + href);
    const html = await antwort.text();
    titelCache.set(href, { status: antwort.status, h1: (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() });
  }
  return titelCache.get(href);
}

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
for (const breite of [412, 1280]) {
  for (const seite of SEITEN) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: 900 }, reducedMotion: 'reduce' });
    await ctx.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== new URL(basis).origin) { fremd.push(url.href); return route.abort(); }
      return route.continue();
    });
    const page = await ctx.newPage();
    await page.goto(basis + seite.pfad, { waitUntil: 'networkidle' });
    if (seite.zumSchritt) {
      for (let i = 0; i < 3 && (await page.locator(`[data-ort="${seite.zumSchritt}"]`).count()) === 0; i += 1) {
        // Herstellerschritt: erste Auswahl treffen (erfundene Angabe, nichts wird gesendet), dann weiter.
        const wahl = page.locator('input[type=radio]:visible, [role=radio]:visible').first();
        if (await wahl.count()) await wahl.check({ force: true }).catch(() => wahl.click({ force: true }));
        await page.getByRole('button', { name: /^Weiter/ }).first().click({ timeout: 5000 });
        await page.waitForTimeout(400);
      }
    }
    const kopf = `${breite} px ${seite.pfad}`;
    for (const [ort, slugs] of Object.entries(seite.orte)) {
      const hinweis = page.locator(`[data-tutorial-hinweis][data-ort="${ort}"]`);
      const anzahl = await hinweis.count();
      if (slugs.length === 0) {
        pruefe(anzahl === 0 && (await page.locator('[data-tutorial-hinweis]').count()) === 0, `${kopf}: Ort ${ort} ohne veröffentlichten Eintrag zeigt nichts`);
        continue;
      }
      pruefe(anzahl === 1, `${kopf}: Hinweis an ${ort} vorhanden (${anzahl})`);
      if (anzahl !== 1) continue;
      await hinweis.scrollIntoViewIfNeeded();
      const verweise = await hinweis.locator('a').evaluateAll((as) => as.map((a) => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), text: a.textContent.trim(), hoehe: a.getBoundingClientRect().height })));
      pruefe(JSON.stringify(verweise.map((v) => v.href)) === JSON.stringify(slugs.map((s) => `/tutorials/${s}`)), `${kopf}: Verweise ${verweise.map((v) => v.href).join(', ')}`);
      for (const v of verweise) {
        const ziel = await tutorialTitel(v.href);
        pruefe(ziel.status === 200 && v.text.startsWith(ziel.h1), `${kopf}: ${v.href} → ${ziel.status} „${ziel.h1}“`);
        pruefe(v.hoehe >= 44, `${kopf}: Bedienfläche ${v.href} ${v.hoehe} px`);
        if (seite.formular) pruefe(v.target === '_blank' && v.text.includes('(öffnet in neuem Fenster)'), `${kopf}: Formular-Verweis neues Fenster mit sichtbarem Zusatz`);
        else pruefe(v.target === null, `${kopf}: Seiten-Verweis im selben Fenster`);
      }
      // Schrift und Überlauf im Hinweis.
      const mass = await hinweis.evaluate((el) => {
        let kleinste = Infinity;
        const gehe = (k) => {
          for (const kind of k.childNodes) {
            if (kind.nodeType === 3 && kind.textContent.trim()) {
              const st = getComputedStyle(kind.parentElement);
              const r = kind.parentElement.getBoundingClientRect();
              if (st.visibility !== 'hidden' && r.width > 1 && r.height > 1) kleinste = Math.min(kleinste, parseFloat(st.fontSize));
            } else if (kind.nodeType === 1) gehe(kind);
          }
        };
        gehe(el);
        const ueber = [...el.querySelectorAll('*')].filter((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX === 'visible' && e.clientWidth > 0).length;
        const r = el.getBoundingClientRect();
        return { kleinste, ueber, rechts: r.right, breite: document.documentElement.clientWidth };
      });
      pruefe(mass.kleinste >= 14, `${kopf}: kleinste Schrift im Hinweis ${mass.kleinste} px`);
      pruefe(mass.ueber === 0 && mass.rechts <= mass.breite, `${kopf}: nichts läuft über (rechts ${Math.round(mass.rechts)} von ${mass.breite})`);
      if (bilder) await hinweis.screenshot({ path: path.join(bilder, `hinweis-${ort}-${breite}.png`) });
    }
    const seitenUeberlauf = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    pruefe(seitenUeberlauf <= 0, `${kopf}: kein waagerechtes Rollen (${seitenUeberlauf})`);

    // Formular: Der Verweis öffnet ein neues Fenster, das Formular bleibt mit seinem Zwischenstand stehen.
    if (seite.formular && breite === 412) {
      const ort = seite.zumSchritt ?? Object.keys(seite.orte)[0];
      const vorherUrl = page.url();
      const speicherVorher = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k]) => k.startsWith('sm24:flow')))));
      const titelVorher = await page.locator('[data-schritt-titel]').first().textContent();
      const [fenster] = await Promise.all([ctx.waitForEvent('page'), page.locator(`[data-ort="${ort}"] a`).first().click()]);
      await fenster.waitForLoadState('domcontentloaded');
      pruefe(new URL(fenster.url()).pathname.startsWith('/tutorials/'), `${seite.pfad}: neues Fenster zeigt ${new URL(fenster.url()).pathname}`);
      pruefe(page.url() === vorherUrl, `${seite.pfad}: Formular bleibt auf ${new URL(page.url()).pathname}`);
      const titelNachher = await page.locator('[data-schritt-titel]').first().textContent();
      pruefe(titelVorher === titelNachher, `${seite.pfad}: Schritt bleibt („${titelNachher}“)`);
      const speicherNachher = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k]) => k.startsWith('sm24:flow')))));
      pruefe(speicherVorher === speicherNachher, `${seite.pfad}: Zwischenstand unverändert (${speicherNachher.length} Zeichen)`);
      await fenster.close();
    }
    await ctx.close();
  }
}

// Autoschlüssel-Anfrage: Die Schritte Schlüsselfotos und Fahrzeugschein liegen tief im Ablauf. Die Seite gibt
// die fertig gerenderten Hinweise im Server-HTML mit (Nutzlast der Seite); Fahrzeugschein hat keinen
// veröffentlichten Eintrag und darf nichts mitgeben.
{
  const html = await (await fetch(basis + '/autoschluessel/anfrage')).text();
  pruefe(html.includes('autoschluessel-richtig-fotografieren') && html.includes('autoschluessel-fotos'), 'Assistent: Hinweis für Schlüsselfotos in der Nutzlast der Seite');
  pruefe(!html.includes('autoschluessel-fahrzeugschein') || !/data-ort[^,]{0,10}autoschluessel-fahrzeugschein/.test(html), 'Assistent: kein Hinweis für den Fahrzeugschein (kein veröffentlichter Eintrag)');
  pruefe(html.includes('öffnet in neuem Fenster'), 'Assistent: Verweis mit Zusatz „öffnet in neuem Fenster“');
}
await browser.close();
pruefe(fremd.length === 0, `keine fremde Anfrage (${fremd.join(', ') || 'keine'})`);
console.log(zeilen.join('\n'));
console.log(`\nGESAMT: ${alleGut ? 'alle Prüfungen bestanden' : 'FEHLER'}`);
if (process.argv[4]) writeFileSync(process.argv[4], JSON.stringify({ basis, alleGut, zeilen, fremd }, null, 1));
process.exit(alleGut ? 0 : 1);
