// Versuchsskript FA-SEO-03E (nur zum Nachvollziehen), nach FA-SEO-03D/experimente/netz.mjs. Nur localhost (G1), Attrappen (G5).
// Was lädt der Browser bis Netzruhe plus 5 s? Zahl der Skriptdateien, Bytes roh und übertragen (encodedDataLength aus dem
// Protokoll von Chromium), jede Datei mit Größe, dazu ob eine Datei Zeichnungen des Registers enthält (Merkmal: Texte aus
// zylinder-mass, schliessplan, schluessel). 412 × 823, mobil. „/warenkorb#gefuellt“ legt vorher eine erfundene Position (Zylindersatz; Codelinien und Artikel sind im JSON-Modus nur Beispiele und nicht bestellbar)
// in den Warenkorb des Browsers (localStorage, nichts wird bestellt).
// Aufruf: SM24_BASIS_URL=<basis> node netz.mjs <basis> <ausgabe.json> <pfad> [<pfad> …]
import { writeFileSync } from 'node:fs';
const lib = await import('/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/lib.mjs');
const [basis, ausgabe, ...pfade] = process.argv.slice(2);
if (!new URL(basis).hostname.match(/^(localhost|127\.0\.0\.1)$/)) throw new Error('nur localhost');
const GEFUELLT = JSON.stringify({ state: { items: [{ kind: 'zylinder-schliessung', uid: 'test-3', draft: { items: [{ uid: 'z-1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 }], keyCount: 3, extraIds: [], expandable: false }, unitPriceCents: 4900, qty: 1 }] }, version: 1 });
const MERKMALE = { 'zylinder-mass': 'Maßzeichnung eines Schließzylinders', schliessplan: 'Mitte Stulpschraube', schluessel: 'Klappschlüssel mit Funktasten' };
const b = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const alle = [];
for (const eintrag of pfade) {
  const [pfad, art] = eintrag.split('#');
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  if (art === 'gefuellt') await ctx.addInitScript((w) => { try { localStorage.setItem('sm24-warenkorb', w); } catch {} }, GEFUELLT);
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  const anfragen = new Map();
  cdp.on('Network.responseReceived', (e) => {
    if (!e.response.url.endsWith('.js')) return;
    anfragen.set(e.requestId, { name: e.response.url.split('/').pop(), kodiert: null, roh: null, fehler: null, zeichnungen: [] });
  });
  cdp.on('Network.loadingFinished', (e) => { const a = anfragen.get(e.requestId); if (a) a.kodiert = e.encodedDataLength; });
  cdp.on('Network.loadingFailed', (e) => { const a = anfragen.get(e.requestId); if (a) a.fehler = e.errorText; });
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  const antwort = await p.goto(basis + pfad, { waitUntil: 'networkidle' }); await p.waitForTimeout(5000);
  for (const [id, a] of anfragen) {
    try {
      const text = (await cdp.send('Network.getResponseBody', { requestId: id })).body;
      a.roh = Buffer.from(text, 'utf8').length;
      a.zeichnungen = Object.entries(MERKMALE).filter(([, m]) => text.includes(m)).map(([n]) => n);
    } catch (e) { a.fehler ??= 'body: ' + String(e.message ?? e); }
  }
  const svgs = await p.locator('main svg').count();
  const liste = [...anfragen.values()].sort((x, y) => x.name.localeCompare(y.name));
  const summe = (f) => liste.reduce((s, a) => s + (Number.isFinite(a[f]) ? a[f] : 0), 0);
  const mitZeichnung = liste.filter((a) => a.zeichnungen.length);
  const zeile = { pfad: eintrag, status: antwort?.status(), zahl: liste.length, ohneGroesse: liste.filter((a) => a.roh == null || a.kodiert == null).map((a) => a.name), rohKB: +(summe('roh') / 1024).toFixed(1), uebertragenKB: +(summe('kodiert') / 1024).toFixed(1), mitZeichnung: mitZeichnung.map((a) => [a.name, a.zeichnungen.join('+'), a.roh, a.kodiert]), svgImHauptteil: svgs, dateien: liste.map((a) => [a.name, a.roh, a.kodiert]), fehler };
  console.log(JSON.stringify({ pfad: eintrag, status: zeile.status, zahl: zeile.zahl, rohKB: zeile.rohKB, uebertragenKB: zeile.uebertragenKB, mitZeichnung: zeile.mitZeichnung, ohneGroesse: zeile.ohneGroesse, fehler }));
  alle.push(zeile);
  await ctx.close();
}
writeFileSync(ausgabe, JSON.stringify(alle, null, 1));
await b.close();
