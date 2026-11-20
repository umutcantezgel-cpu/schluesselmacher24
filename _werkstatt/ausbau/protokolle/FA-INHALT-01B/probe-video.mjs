// FA-INHALT-01B: Browserprobe der Video-Einbettung MIT Schalter (SM24_VIDEOS=an) am Produktions-Build.
// YouTube wird nie abgerufen: Anfragen an youtube-nocookie.com beantwortet eine lokale Attrappe, jede andere
// fremde Adresse wird abgebrochen; jede angefragte fremde Adresse wird protokolliert. Nur localhost (G1).
// Aufruf: node probe-video.mjs http://localhost:3000 <bilderordner> [ausgabe.json]
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const basis = process.argv[2] ?? 'http://localhost:3000';
const bilder = process.argv[3];
if (bilder) mkdirSync(bilder, { recursive: true });
if (!['localhost', '127.0.0.1'].includes(new URL(basis).hostname)) throw new Error('nur localhost (G1)');

const PFAD = '/tutorials/schluessel-richtig-fotografieren';
const ADRESSEN = /youtube\.com|youtube-nocookie|youtu\.be|ytimg|googlevideo|google\.[a-z]|googleapis|gstatic|doubleclick|googletagmanager/i;
const ATTRAPPE = '<!doctype html><html><head><title>Attrappe</title></head><body style="margin:0;background:#ddd"><p>Attrappe des Players</p></body></html>';

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ergebnis = [];
let alleGut = true;
const pruefe = (bedingung, text, zeile) => { zeile.pruefungen.push(`${bedingung ? 'OK  ' : 'FEHL'} ${text}`); if (!bedingung) alleGut = false; };

for (const breite of [412, 1280]) {
  const zeile = { breite, pruefungen: [], fremdVorKlick: [], fremdNachKlick: [], konsole: [] };
  const ctx = await browser.newContext({ viewport: { width: breite, height: 900 }, reducedMotion: 'reduce' });
  let geklickt = false;
  await ctx.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(basis).origin) return route.continue();
    (geklickt ? zeile.fremdNachKlick : zeile.fremdVorKlick).push(url.href);
    if (url.origin === 'https://www.youtube-nocookie.com') return route.fulfill({ status: 200, contentType: 'text/html', body: ATTRAPPE });
    return route.abort();
  });
  const page = await ctx.newPage();
  page.on('console', (m) => zeile.konsole.push(`${m.type()}: ${m.text()}`));
  await page.addInitScript(() => {
    window.__verschiebungen = [];
    new PerformanceObserver((liste) => { for (const e of liste.getEntries()) window.__verschiebungen.push({ wert: e.value, eingabe: e.hadRecentInput, zeit: e.startTime, quellen: (e.sources || []).map((q) => q.node?.nodeName + '.' + (q.node?.className?.toString?.() ?? '').slice(0, 40)) }); }).observe({ type: 'layout-shift', buffered: true });
  });
  const antwort = await page.goto(basis + PFAD, { waitUntil: 'networkidle' });
  const html = await antwort.text();
  const csp = antwort.headers()['content-security-policy'];
  pruefe(/frame-src 'self' https:\/\/www\.youtube-nocookie\.com/.test(csp), 'Richtlinie mit frame-src für youtube-nocookie.com', zeile);
  pruefe(!ADRESSEN.test(html), 'HTML ohne Adresse von YouTube oder Google', zeile);
  pruefe((await page.locator('iframe').count()) === 0, 'vor dem Klick kein Rahmen', zeile);
  pruefe(zeile.fremdVorKlick.length === 0, `vor dem Klick keine fremde Anfrage (${zeile.fremdVorKlick.length})`, zeile);
  const domVorher = await page.content();
  pruefe(!ADRESSEN.test(domVorher), 'DOM nach dem Hydrieren ohne Adresse von YouTube oder Google', zeile);

  // Nur mit der Tastatur: Tab bis „Video laden“, dann Enter.
  const rahmen = page.locator('[data-video-rahmen]');
  await rahmen.scrollIntoViewIfNeeded();
  const seitenLage = (sel) => page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height }; }, sel);
  const vorher = await seitenLage('[data-video-rahmen]');
  const schrittVorher = await seitenLage('#schritte-titel');
  let klickZeit = 0;
  if (bilder) await page.screenshot({ path: path.join(bilder, `video-vor-klick-${breite}.png`) });
  let gefunden = false;
  await page.evaluate(() => document.body.focus());
  for (let i = 0; i < 80; i += 1) {
    await page.keyboard.press('Tab');
    const text = await page.evaluate(() => document.activeElement?.textContent ?? '');
    if (text.includes('Video laden')) { gefunden = true; break; }
  }
  pruefe(gefunden, 'Knopf „Video laden“ mit Tab erreichbar', zeile);
  const knopfHoehe = await page.evaluate(() => document.activeElement.getBoundingClientRect().height);
  pruefe(knopfHoehe >= 44, `Knopf mindestens 44 px hoch (${knopfHoehe})`, zeile);
  const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).boxShadow.slice(0, 40));
  zeile.fokusRing = ring;
  geklickt = true;
  // Ab hier zählt jede Verschiebung (die Sprungmarke „Zum Inhalt“ beim ersten Tab liegt davor).
  klickZeit = await page.evaluate(() => performance.now());
  await page.keyboard.press('Enter');
  await page.waitForSelector('iframe');
  await page.waitForTimeout(800);
  const rahmenListe = await page.$$eval('iframe', (els) => els.map((e) => ({ src: e.src, title: e.title })));
  pruefe(rahmenListe.length === 1, `genau ein Rahmen (${rahmenListe.length})`, zeile);
  pruefe(rahmenListe[0] && new URL(rahmenListe[0].src).origin === 'https://www.youtube-nocookie.com', `Rahmen von www.youtube-nocookie.com (${rahmenListe[0]?.src})`, zeile);
  pruefe(rahmenListe[0]?.title === 'Probe: Schlüssel richtig fotografieren', `title des Rahmens (${rahmenListe[0]?.title})`, zeile);
  const fremdeOrigins = [...new Set(zeile.fremdNachKlick.map((u) => new URL(u).origin))];
  pruefe(fremdeOrigins.length === 1 && fremdeOrigins[0] === 'https://www.youtube-nocookie.com', `nach dem Klick nur youtube-nocookie.com angefragt (${fremdeOrigins.join(', ')})`, zeile);
  const nachher = await seitenLage('[data-video-rahmen]');
  const schrittNachher = await seitenLage('#schritte-titel');
  pruefe(JSON.stringify(vorher) === JSON.stringify(nachher), `Rahmen gleich groß und an gleicher Stelle (${JSON.stringify(vorher)} → ${JSON.stringify(nachher)})`, zeile);
  pruefe(schrittVorher.y === schrittNachher.y, `Inhalt darunter verschiebt sich nicht (${schrittVorher.y} → ${schrittNachher.y})`, zeile);
  const verschiebungen = await page.evaluate(() => window.__verschiebungen);
  zeile.verschiebungen = verschiebungen;
  const nachKlick = verschiebungen.filter((v) => v.zeit >= klickZeit).reduce((a, v) => a + v.wert, 0);
  const beimLaden = verschiebungen.filter((v) => v.zeit < klickZeit && !v.eingabe).reduce((a, v) => a + v.wert, 0);
  pruefe(nachKlick === 0, `Layoutverschiebung durch den Klick ${nachKlick} (alle Einträge, auch nach Eingabe)`, zeile);
  zeile.verschiebungBeimLaden = beimLaden;
  console.log(`Verschiebung beim Laden (vor dem Klick, nicht durch das Video): ${beimLaden}`, JSON.stringify(verschiebungen));
  const aktiv = await page.evaluate(() => document.activeElement?.tagName);
  pruefe(aktiv === 'IFRAME', `Fokus auf dem Player (${aktiv})`, zeile);
  const cspMeldungen = zeile.konsole.filter((z) => /Content Security Policy|Refused to/i.test(z));
  pruefe(cspMeldungen.length === 0, `keine Meldung der Sicherheitsrichtlinie (${cspMeldungen.length})`, zeile);
  const speicher = await page.evaluate(() => ({ cookies: document.cookie, lokal: Object.keys(localStorage) }));
  zeile.speicher = speicher;
  pruefe(speicher.cookies === '', `kein Cookie der Seite (${speicher.cookies})`, zeile);
  if (bilder) await page.screenshot({ path: path.join(bilder, `video-nach-klick-${breite}.png`) });
  // Schrift und Überlauf mit Video (vor dem Klick in neuem Kontext unten in der Schriftprobe).
  ergebnis.push(zeile);
  console.log(`\n== ${breite} px\n${zeile.pruefungen.join('\n')}`);
  console.log('fremd vor Klick:', zeile.fremdVorKlick, '| nach Klick:', zeile.fremdNachKlick);
  await ctx.close();
}

// Datenschutzerklärung mit Schalter: Absatz zu YouTube vorhanden, Videos nicht mehr unter „nicht eingebunden“.
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(basis + '/rechtliches/datenschutz');
  const text = await page.locator('main').innerText();
  const zeile = { seite: 'datenschutz', pruefungen: [] };
  pruefe(text.includes('erweiterten Datenschutzmodus (youtube-nocookie.com)'), 'Datenschutzerklärung: Absatz zu YouTube', zeile);
  pruefe(!text.includes('Karten, Videos oder Schriftarten-Dienste'), 'Datenschutzerklärung: Videos nicht mehr unter „nicht eingebunden“', zeile);
  pruefe((await page.locator('#verarbeitung-videos').count()) === 1, 'Datenschutzerklärung: Abschnitt verarbeitung-videos', zeile);
  console.log(`\n== Datenschutz\n${zeile.pruefungen.join('\n')}`);
  ergebnis.push(zeile);
  // Hinweis mit Kennzeichen „mit Video“ auf der Vorlage-Seite.
  await page.goto(basis + '/schluessel-nach-vorlage');
  const hinweis = await page.locator('[data-tutorial-hinweis]').innerText();
  const z2 = { seite: 'vorlage', pruefungen: [] };
  pruefe(hinweis.includes('mit Video'), `Hinweis mit Kennzeichen „mit Video“ (${hinweis.replace(/\s+/g, ' ')})`, z2);
  console.log(`\n== Vorlage\n${z2.pruefungen.join('\n')}`);
  ergebnis.push(z2);
  await ctx.close();
}
await browser.close();
console.log(`\nGESAMT: ${alleGut ? 'alle Prüfungen bestanden' : 'FEHLER'}`);
if (process.argv[4]) writeFileSync(process.argv[4], JSON.stringify({ basis, alleGut, ergebnis }, null, 1));
process.exit(alleGut ? 0 : 1);
