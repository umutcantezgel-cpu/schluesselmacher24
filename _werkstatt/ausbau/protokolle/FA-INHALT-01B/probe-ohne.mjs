// FA-INHALT-01B: Browserprobe OHNE Schalter am Produktions-Build (mit Probeneintrag im Video eines Tutorials).
// Vergleicht mit dem Messstand (Stand vor dem Paket): Sicherheitsrichtlinie und Datenschutzerklärung gleich;
// die Tutorial-Seite zeigt den Satz aus Teil A. Nur localhost (G1), fremde Adressen werden abgebrochen.
// Aufruf: node probe-ohne.mjs http://localhost:3000 http://localhost:3200 [ausgabe.json]
import { writeFileSync } from 'node:fs';

const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const neu = process.argv[2] ?? 'http://localhost:3000';
const alt = process.argv[3] ?? 'http://localhost:3200';
for (const b of [neu, alt]) if (!['localhost', '127.0.0.1'].includes(new URL(b).hostname)) throw new Error('nur localhost (G1)');

const ADRESSEN = /youtube\.com|youtube-nocookie|youtu\.be|ytimg|googlevideo|google\.[a-z]|googleapis|gstatic|doubleclick|googletagmanager/i;
const zeilen = [];
let alleGut = true;
const pruefe = (b, text) => { zeilen.push(`${b ? 'OK  ' : 'FEHL'} ${text}`); if (!b) alleGut = false; };

// 1. Sicherheitsrichtlinie: Antwortkopf gleich dem Messstand, auf mehreren Seiten.
for (const pfad of ['/', '/tutorials/schluessel-richtig-fotografieren', '/rechtliches/datenschutz', '/schluessel-nach-vorlage/anfrage']) {
  const [a, b] = await Promise.all([fetch(neu + pfad), fetch(alt + pfad)]);
  const cspNeu = a.headers.get('content-security-policy');
  const cspAlt = b.headers.get('content-security-policy');
  pruefe(cspNeu === cspAlt && !/frame-src/.test(cspNeu), `Richtlinie ${pfad} gleich dem Messstand${cspNeu === cspAlt ? '' : `\n  neu: ${cspNeu}\n  alt: ${cspAlt}`}`);
}

const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const fremd = [];
async function seite(basis, pfad, breite = 1280) {
  const ctx = await browser.newContext({ viewport: { width: breite, height: 900 } });
  await ctx.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(basis).origin) { fremd.push(url.href); return route.abort(); }
    return route.continue();
  });
  const page = await ctx.newPage();
  const antwort = await page.goto(basis + pfad, { waitUntil: 'networkidle' });
  return { ctx, page, html: await antwort.text() };
}

// 2. Datenschutzerklärung: Inhalt von <main> gleich dem Messstand (Fuß und Kopf zählen nicht; sie tragen den
//    Verweis „Tutorials“ aus Teil A ohnehin gleich).
{
  const a = await seite(neu, '/rechtliches/datenschutz');
  const b = await seite(alt, '/rechtliches/datenschutz');
  const mainNeu = await a.page.locator('main').innerHTML();
  const mainAlt = await b.page.locator('main').innerHTML();
  pruefe(mainNeu === mainAlt, `Datenschutzerklärung: <main> Zeichen für Zeichen gleich dem Messstand (${mainNeu.length} / ${mainAlt.length} Zeichen)`);
  pruefe((await a.page.locator('main').innerText()).includes('Karten, Videos oder Schriftarten-Dienste'), 'Datenschutzerklärung nennt Videos weiter unter „nicht eingebunden“');
  pruefe(!(await a.page.locator('main').innerText()).includes('youtube-nocookie'), 'kein Absatz zu YouTube');
  await a.ctx.close(); await b.ctx.close();
}

// 3. Tutorial-Seite mit Probeneintrag: der Satz aus Teil A, kein Knopf, kein Rahmen, kein VideoObject.
for (const breite of [412, 1280]) {
  const a = await seite(neu, '/tutorials/schluessel-richtig-fotografieren', breite);
  const text = await a.page.locator('main').innerText();
  pruefe(text.includes('Zu diesem Thema gibt es ein Video. Es erscheint hier, sobald die Einbettung freigeschaltet ist.'), `${breite} px: Satz aus Teil A`);
  pruefe(!text.includes('Video laden'), `${breite} px: kein Knopf „Video laden“`);
  pruefe((await a.page.locator('iframe').count()) === 0, `${breite} px: kein Rahmen`);
  pruefe(!ADRESSEN.test(a.html) && !a.html.includes('Pr0be_V1d3o'), `${breite} px: HTML ohne Adresse und ohne Kennung`);
  pruefe(!a.html.includes('VideoObject'), `${breite} px: kein VideoObject`);
  pruefe(text.includes('Was im Video gezeigt wird'), `${breite} px: Transkript zum Aufklappen (wie Teil A)`);
  await a.ctx.close();
}
await browser.close();
pruefe(fremd.length === 0, `keine fremde Anfrage (${fremd.join(', ') || 'keine'})`);
console.log(zeilen.join('\n'));
console.log(`\nGESAMT: ${alleGut ? 'alle Prüfungen bestanden' : 'FEHLER'}`);
if (process.argv[4]) writeFileSync(process.argv[4], JSON.stringify({ neu, alt, alleGut, zeilen, fremd }, null, 1));
process.exit(alleGut ? 0 : 1);
