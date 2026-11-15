// onpage.test.mjs – Selbsttest der Onpage-Prüfung (FA-SEO-02). Kein Server nötig.
// Ausführen: node --test _werkstatt/ausbau/werkzeuge/onpage.test.mjs
import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { browserStarten } from './lib.mjs';
import {
  extrahiere, pruefeSeite, vorbereiten, bewerte, anzeige, exitCode, zielPruefen, PRUEFUNGEN,
} from './onpage.mjs';

const URL_TEST = 'http://localhost:3000/testseite';
const BESCHREIBUNG = 'Schlüsseldienst in Wetzlar für Autoschlüssel, Zylinder und Schließanlagen. Termin oder Anfrage online, mit klaren Preisen und Hinweisen zu jedem Schritt.';

/** Vollständig korrekte Seite: jede Prüfung ok (Textmenge und Größe nur angezeigt). */
const GUT = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Schlüssel nachmachen in Wetzlar</title>
<meta name="description" content="${BESCHREIBUNG}">
<link rel="canonical" href="${URL_TEST}"><link rel="icon" href="/icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness"}</script>
</head><body><header><nav><a href="/autoschluessel">Autoschlüssel nach Fahrzeug</a></nav></header>
<main><h1>Schlüssel nachmachen</h1><h2>Ablauf</h2><p>Ein Text über den Ablauf der Bestellung.</p>
<a href="/autoschluessel">Autoschlüssel nach Fahrzeug</a><img src="/a.png" alt="Schlüssel auf dem Tisch"></main>
<footer></footer></body></html>`;

const ctx = (ueber = {}) => ({
  url: URL_TEST,
  status: 200,
  htmlOk: true,
  xRobots: null,
  linkBefunde: [{ ziel: 'http://localhost:3000/autoschluessel', status: 200, klasse: 'ok', via: 'sitemap' }],
  eingehend: true,
  istStartseite: false,
  inSitemap: true,
  doppeltTitel: false,
  doppeltBeschr: false,
  bytes: 1000,
  ...ueber,
});

let browser;
let seite;
let kontext;

before(async () => {
  browser = await browserStarten();
  ({ kontext, seite } = await vorbereiten(browser));
});
after(async () => {
  await kontext?.close();
  await browser?.close();
});

/** Status einer Prüfung nach HTML-Text und Kontext. */
async function status(id, html, cx = {}) {
  const f = await extrahiere(seite, html, URL_TEST);
  const erg = pruefeSeite(f, ctx(cx), new Set()).ergebnisse.find((e) => e.id === id);
  return erg.status;
}
/** Ersetzt einen Ausschnitt der GUT-Seite. */
const aendern = (von, nach) => {
  assert.ok(GUT.includes(von), `Ausgangstext fehlt: ${von}`);
  return GUT.replace(von, nach);
};

test('Prüfungsliste ist vollständig und eindeutig', () => {
  const ids = PRUEFUNGEN.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const p of PRUEFUNGEN) assert.ok(p.quelle && p.quelle.length > 10, `Quelle fehlt bei ${p.id}`);
});

test('Gutes Beispiel ergibt keinen roten oder gelben Befund und Wert 100', async () => {
  const f = await extrahiere(seite, GUT, URL_TEST);
  const { ergebnisse, wert } = pruefeSeite(f, ctx(), new Set());
  const schlecht = ergebnisse.filter((e) => e.status === 'rot' || e.status === 'gelb');
  assert.deepEqual(schlecht, []);
  assert.equal(wert, 100);
  assert.equal(ergebnisse.find((e) => e.id === 'beschreibung_laenge').detail, `${[...BESCHREIBUNG].length} Zeichen`);
});

describe('Status', () => {
  test('404 ist rot', async () => {
    assert.equal(await status('status', GUT, { status: 404 }), 'rot');
  });
  test('kein HTML ist rot', async () => {
    assert.equal(await status('status', GUT, { htmlOk: false }), 'rot');
  });
  test('200 mit HTML ist ok', async () => {
    assert.equal(await status('status', GUT), 'ok');
  });
});

describe('Titel', () => {
  test('fehlender Titel ist rot', async () => {
    assert.equal(await status('titel_einzeln', aendern('<title>Schlüssel nachmachen in Wetzlar</title>', '')), 'rot');
  });
  test('zwei Titel sind rot', async () => {
    assert.equal(await status('titel_einzeln', aendern('</head>', '<title>Zweiter</title></head>')), 'rot');
  });
  test('Titel über 580 px ist gelb', async () => {
    const lang = 'Schlüssel nachmachen in Wetzlar mit Termin, Preis, Anfrage und Lieferung nach Hause';
    assert.equal(await status('titel_laenge', aendern('Schlüssel nachmachen in Wetzlar', lang)), 'gelb');
  });
  test('Titel mit höchstens 60 Zeichen, aber über 580 px ist gelb (Breite zählt)', async () => {
    const breit = 'W'.repeat(52);
    assert.ok([...breit].length <= 60);
    assert.equal(await status('titel_laenge', aendern('Schlüssel nachmachen in Wetzlar', breit)), 'gelb');
  });
  test('Titel über 60 schmale Zeichen, aber unter 580 px ist ok (Breite zählt)', async () => {
    const schmal = 'i'.repeat(80);
    assert.ok([...schmal].length > 60);
    assert.equal(await status('titel_laenge', aendern('Schlüssel nachmachen in Wetzlar', schmal)), 'ok');
  });
  test('ohne Breitenmessung gilt der Rückfall von 60 Zeichen', () => {
    const titelLaenge = PRUEFUNGEN.find((p) => p.id === 'titel_laenge').pruefe;
    const ctxTest = ctx();
    assert.equal(titelLaenge({ titel: ['x'.repeat(61)], titelPx: [] }, ctxTest).status, 'gelb');
    assert.equal(titelLaenge({ titel: ['x'.repeat(60)], titelPx: [] }, ctxTest).status, 'ok');
  });
  test('leerer Titel ist rot', async () => {
    assert.equal(await status('titel_laenge', aendern('Schlüssel nachmachen in Wetzlar', '   ')), 'rot');
  });
  test('doppelter Titel auf anderer Seite ist gelb', async () => {
    assert.equal(await status('titel_eindeutig', GUT, { doppeltTitel: true }), 'gelb');
  });
});

describe('Beschreibung', () => {
  test('fehlende Beschreibung ist rot', async () => {
    const html = GUT.replace(/<meta name="description"[^>]*>/, '');
    assert.equal(await status('beschreibung_vorhanden', html), 'rot');
  });
  test('zu kurze Beschreibung ist gelb', async () => {
    const html = GUT.replace(BESCHREIBUNG, 'Kurz.');
    assert.equal(await status('beschreibung_laenge', html), 'gelb');
  });
  test('zu lange Beschreibung ist gelb', async () => {
    const html = GUT.replace(BESCHREIBUNG, BESCHREIBUNG + ' '.repeat(10) + 'x'.repeat(40));
    assert.equal(await status('beschreibung_laenge', html), 'gelb');
  });
  test('doppelte Beschreibung auf anderer Seite ist gelb', async () => {
    assert.equal(await status('beschreibung_eindeutig', GUT, { doppeltBeschr: true }), 'gelb');
  });
});

describe('Überschriften', () => {
  test('zwei h1 sind rot', async () => {
    assert.equal(await status('h1', aendern('<h2>Ablauf</h2>', '<h1>Zweite</h1>')), 'rot');
  });
  test('keine h1 ist rot', async () => {
    assert.equal(await status('h1', aendern('<h1>Schlüssel nachmachen</h1>', '')), 'rot');
  });
  test('Sprung von h1 auf h3 ist gelb', async () => {
    assert.equal(await status('ueberschriften', aendern('<h2>Ablauf</h2>', '<h3>Ablauf</h3>')), 'gelb');
  });
  test('h2 nach h1 ist ok', async () => {
    assert.equal(await status('ueberschriften', GUT), 'ok');
  });
});

describe('Sprache und Adresse', () => {
  test('lang="en" ist gelb', async () => {
    assert.equal(await status('lang', aendern('lang="de"', 'lang="en"')), 'gelb');
  });
  test('lang fehlt ist rot', async () => {
    assert.equal(await status('lang', aendern(' lang="de"', '')), 'rot');
  });
  test('lang="de-DE" ist ok', async () => {
    assert.equal(await status('lang', aendern('lang="de"', 'lang="de-DE"')), 'ok');
  });
  test('canonical fehlt ist gelb', async () => {
    assert.equal(await status('canonical', aendern(`<link rel="canonical" href="${URL_TEST}">`, '')), 'gelb');
  });
  test('canonical auf fremde Adresse ist rot', async () => {
    assert.equal(await status('canonical', aendern(URL_TEST, 'https://www.example.invalid/testseite')), 'rot');
  });
  test('canonical mit Anker auf die eigene Adresse ist ok', async () => {
    assert.equal(await status('canonical', aendern(URL_TEST, `${URL_TEST}#oben`)), 'ok');
  });
});

describe('Indexierung', () => {
  test('noindex im Meta-Tag ist rot', async () => {
    const html = aendern('</head>', '<meta name="robots" content="noindex, follow"></head>');
    assert.equal(await status('noindex', html), 'rot');
  });
  test('X-Robots-Tag none ist rot', async () => {
    assert.equal(await status('noindex', GUT, { xRobots: 'none' }), 'rot');
  });
  test('noindex auf einer Seite außerhalb der Sitemap ist nicht zutreffend', async () => {
    const html = aendern('</head>', '<meta name="robots" content="noindex"></head>');
    assert.equal(await status('noindex', html, { inSitemap: false }), 'nicht_zutreffend');
  });
  test('index, follow ist ok', async () => {
    const html = aendern('</head>', '<meta name="robots" content="index, follow"></head>');
    assert.equal(await status('noindex', html), 'ok');
  });
  test('Startseite ohne eingehenden Verweis ist nicht zutreffend', async () => {
    assert.equal(await status('eingehend', GUT, { istStartseite: true, eingehend: false }), 'nicht_zutreffend');
  });
  test('Seite ohne eingehenden Verweis ist gelb', async () => {
    assert.equal(await status('eingehend', GUT, { eingehend: false }), 'gelb');
  });
});

describe('Bilder und Links', () => {
  test('Bild ohne alt-Attribut ist gelb', async () => {
    assert.equal(await status('alt', aendern(' alt="Schlüssel auf dem Tisch"', '')), 'gelb');
  });
  test('leerer alt-Wert ist ok', async () => {
    assert.equal(await status('alt', aendern('alt="Schlüssel auf dem Tisch"', 'alt=""')), 'ok');
  });
  test('Zierbild mit role=presentation wird nicht bewertet', async () => {
    assert.equal(await status('alt', aendern('<img src="/a.png"', '<img role="presentation" src="/a.png"').replace(' alt="Schlüssel auf dem Tisch"', '')), 'nicht_zutreffend');
  });
  test('Verweis auf 404-Ziel ist rot', async () => {
    const cx = { linkBefunde: [{ ziel: 'http://localhost:3000/fehlt', status: 404, klasse: 'rot', via: 'abruf' }] };
    assert.equal(await status('interne_links', GUT, cx), 'rot');
  });
  test('Verweis auf Weiterleitung ist gelb', async () => {
    const cx = { linkBefunde: [{ ziel: 'http://localhost:3000/alt', status: 308, klasse: 'gelb', via: 'abruf' }] };
    assert.equal(await status('interne_links', GUT, cx), 'gelb');
  });
  test('ohne interne Verweise ist nicht zutreffend', async () => {
    assert.equal(await status('interne_links', GUT, { linkBefunde: [] }), 'nicht_zutreffend');
  });
  test('Ankertext „hier“ ist gelb', async () => {
    assert.equal(await status('ankertext', aendern('>Autoschlüssel nach Fahrzeug</a><img', '>hier</a><img')), 'gelb');
  });
  test('Verweis ohne Text ist gelb', async () => {
    assert.equal(await status('ankertext', aendern('>Autoschlüssel nach Fahrzeug</a><img', '></a><img')), 'gelb');
  });
  test('Verweis mit aria-label und Bild mit alt ist ok', async () => {
    const html = aendern('<a href="/autoschluessel">Autoschlüssel nach Fahrzeug</a>', '<a href="/autoschluessel" aria-label="Autoschlüssel"><img src="/b.png" alt="Schlüssel"></a>');
    assert.equal(await status('ankertext', html), 'ok');
  });
  test('Text „mehr“ mit sprechendem aria-label ist ok', async () => {
    const html = aendern('<a href="/autoschluessel">Autoschlüssel nach Fahrzeug</a>', '<a href="/autoschluessel" aria-label="Autoschlüssel nach Fahrzeug">mehr</a>');
    assert.equal(await status('ankertext', html), 'ok');
  });
  test('Verweis, dessen einziges Bild versteckt ist, hat keinen Namen (gelb)', async () => {
    const html = aendern('<a href="/autoschluessel">Autoschlüssel nach Fahrzeug</a>', '<a href="/autoschluessel"><span aria-hidden="true"><img src="/b.png" alt="Schlüssel"></span></a>');
    assert.equal(await status('ankertext', html), 'gelb');
  });
  test('Bild hinter aria-hidden-Container ohne alt zählt nicht als fehlend', async () => {
    const html = aendern('</main>', '<div aria-hidden="true"><img src="/c.png"></div></main>');
    assert.equal(await status('alt', html), 'ok');
  });
});

describe('Strukturdaten, Darstellung, Textmenge', () => {
  test('ungültiges JSON-LD ist rot', async () => {
    const html = aendern('{"@context":"https://schema.org","@type":"LocalBusiness"}', '{"@context":');
    assert.equal(await status('strukturdaten', html), 'rot');
  });
  test('ohne JSON-LD ist nicht zutreffend', async () => {
    const html = GUT.replace(/<script[\s\S]*?<\/script>/, '');
    assert.equal(await status('strukturdaten', html), 'nicht_zutreffend');
  });
  test('fehlende Viewport-Angabe ist rot', async () => {
    assert.equal(await status('viewport', GUT.replace(/<meta name="viewport"[^>]*>/, '')), 'rot');
  });
  test('Viewport ohne device-width ist gelb', async () => {
    assert.equal(await status('viewport', aendern('width=device-width, initial-scale=1', 'width=1024')), 'gelb');
  });
  test('fehlendes Favicon ist gelb', async () => {
    assert.equal(await status('favicon', aendern('<link rel="icon" href="/icon.png">', '')), 'gelb');
  });
  test('Textmenge wird nur angezeigt', async () => {
    assert.equal(await status('textmenge', GUT), 'nicht_bewertet');
  });
  test('Größe wird nur angezeigt', async () => {
    assert.equal(await status('html_groesse', GUT), 'nicht_bewertet');
  });
});

describe('Interne Ziele: HEAD zuerst', () => {
  test('HEAD wird verwendet; GET nur nach 405, sonst nicht', async () => {
    const aufrufe = [];
    const srv = http.createServer((req, res) => {
      aufrufe.push(`${req.method} ${req.url}`);
      if (req.url === '/ohneHEAD') { res.statusCode = req.method === 'HEAD' ? 405 : 200; return res.end('ok'); }
      if (req.url === '/fehlt') { res.statusCode = 404; return res.end(); }
      res.statusCode = 200;
      return res.end();
    });
    await new Promise((ok) => { srv.listen(0, '127.0.0.1', ok); });
    try {
      const basis = `http://127.0.0.1:${srv.address().port}`;
      const cache = new Map();
      const a = await zielPruefen(`${basis}/ohneHEAD`, new Set(), cache);
      assert.equal(a.status, 200);
      assert.equal(a.via, 'get-nach-405');
      const b = await zielPruefen(`${basis}/fehlt`, new Set(), cache);
      assert.equal(b.status, 404);
      assert.equal(b.klasse, 'rot');
      assert.deepEqual(aufrufe, ['HEAD /ohneHEAD', 'GET /ohneHEAD', 'HEAD /fehlt']);
    } finally {
      await new Promise((ok) => { srv.close(ok); });
    }
  });
});

describe('Wert und Abschalten', () => {
  test('Abgeschaltete Prüfung zählt nicht', async () => {
    const f = await extrahiere(seite, aendern('<h1>Schlüssel nachmachen</h1>', ''), URL_TEST);
    const ohne = pruefeSeite(f, ctx(), new Set(['h1'])).wert;
    const mit = pruefeSeite(f, ctx(), new Set()).wert;
    assert.equal(ohne > mit, true);
    assert.equal(pruefeSeite(f, ctx(), new Set(['h1'])).ergebnisse.find((e) => e.id === 'h1').status, 'aus');
  });
  test('Gelb zählt halb, rot gar nicht', () => {
    const e = [
      { gewicht: 2, status: 'ok' },
      { gewicht: 2, status: 'gelb' },
      { gewicht: 2, status: 'rot' },
      { gewicht: 0, status: 'nicht_bewertet' },
      { gewicht: 1, status: 'nicht_zutreffend' },
    ];
    assert.equal(bewerte(e), 50);
  });
  test('Nur nicht zutreffende Prüfungen ergeben 100', () => {
    assert.equal(bewerte([{ gewicht: 1, status: 'nicht_zutreffend' }]), 100);
  });
  test('Drei gelbe Befunde mit Gewicht 1 liegen unter der Grenze 95 (ungerundet)', () => {
    const gelb = new Set(['titel_laenge', 'beschreibung_laenge', 'alt']);
    const e = PRUEFUNGEN.map((p) => ({ gewicht: p.gewicht, status: gelb.has(p.id) ? 'gelb' : 'ok' }));
    const gesamt = PRUEFUNGEN.reduce((a, p) => a + p.gewicht, 0);
    const wert = bewerte(e);
    assert.ok(Math.abs(wert - (100 * (gesamt - 1.5)) / gesamt) < 1e-9);
    assert.ok(wert < 95, `Wert ${wert} muss unter 95 liegen`);
    assert.equal(anzeige(wert), 94.8);
  });
  test('Anzeige rundet ab, damit ein Wert unter der Grenze nie als Grenze erscheint', () => {
    assert.equal(anzeige(94.99), 94.9);
    assert.equal(anzeige(95), 95);
    assert.equal(anzeige(100), 100);
  });
  test('Rückgabewert: Seite unter Grenze oder roter seitenübergreifender Befund ergibt 1', () => {
    assert.equal(exitCode(1, []), 1);
    assert.equal(exitCode(0, [{ id: 'robots_erreichbar', stufe: 'rot' }]), 1);
    assert.equal(exitCode(0, [{ id: 'titel_doppelt', stufe: 'gelb' }]), 0);
    assert.equal(exitCode(0, []), 0);
  });
  test('404 ergibt Wert 0 für die Seite', async () => {
    const { wert } = pruefeSeite(null, ctx({ status: 404, htmlOk: false }), new Set());
    assert.equal(wert, 0);
  });
});
