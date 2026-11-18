// Versuchsskript FA-SEO-03D (nur zum Nachvollziehen), nach FA-SEO-03C/experimente/netz.mjs. Nur localhost (G1), Attrappen (G5).
// Was lädt der Browser für eine Seite bis Netzruhe plus 5 s? Zahl der Skriptdateien, Bytes roh und übertragen
// (encodedDataLength aus dem Protokoll von Chromium), jede Datei mit Größe. 412 × 823, mobil.
// Aufruf: SM24_BASIS_URL=<basis> node netz.mjs <basis> <ausgabe.json> <pfad> [<pfad> …]
import { writeFileSync } from 'node:fs';
const lib = await import('/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/lib.mjs');
const [basis, ausgabe, ...pfade] = process.argv.slice(2);
if (!new URL(basis).hostname.match(/^(localhost|127\.0\.0\.1)$/)) throw new Error('nur localhost');
const b = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const alle = [];
for (const pfad of pfade) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  const anfragen = new Map();
  cdp.on('Network.responseReceived', (e) => {
    if (!e.response.url.endsWith('.js')) return;
    anfragen.set(e.requestId, { name: e.response.url.split('/').pop(), kodiert: null, roh: null, fehler: null });
  });
  cdp.on('Network.loadingFinished', (e) => { const a = anfragen.get(e.requestId); if (a) a.kodiert = e.encodedDataLength; });
  cdp.on('Network.loadingFailed', (e) => { const a = anfragen.get(e.requestId); if (a) a.fehler = e.errorText; });
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(basis + pfad, { waitUntil: 'networkidle' }); await p.waitForTimeout(5000);
  for (const [id, a] of anfragen) {
    try { a.roh = Buffer.from((await cdp.send('Network.getResponseBody', { requestId: id })).body, 'utf8').length; } catch (e) { a.fehler ??= 'body: ' + String(e.message ?? e); }
  }
  const liste = [...anfragen.values()].sort((x, y) => x.name.localeCompare(y.name));
  const summe = (f) => liste.reduce((s, a) => s + (Number.isFinite(a[f]) ? a[f] : 0), 0);
  const zeile = { pfad, zahl: liste.length, ohneGroesse: liste.filter((a) => a.roh == null || a.kodiert == null).map((a) => a.name), rohKB: +(summe('roh') / 1024).toFixed(1), uebertragenKB: +(summe('kodiert') / 1024).toFixed(1), dateien: liste.map((a) => [a.name, a.roh, a.kodiert]), fehler };
  console.log(JSON.stringify({ pfad, zahl: zeile.zahl, rohKB: zeile.rohKB, uebertragenKB: zeile.uebertragenKB, ohneGroesse: zeile.ohneGroesse, fehler }));
  alle.push(zeile);
  await ctx.close();
}
writeFileSync(ausgabe, JSON.stringify(alle, null, 1));
await b.close();
