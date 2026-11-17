// Welche Skripte lädt der Browser für eine Seite (bis Netzruhe + 3 s)? Nur localhost.
// Nachbesserung FA-SEO-03C (Befund 2): Bytes aus dem Protokoll von Chromium (encodedDataLength über CDP,
// zum Vergleich Content-Length und Body), keine stille 0; jede Datei mit Größe im Log.
const lib = await import('/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/lib.mjs');
const [basis, pfad] = process.argv.slice(2);
if (!new URL(basis).hostname.match(/^(localhost|127\.0\.0\.1)$/)) throw new Error('nur localhost');
const b = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
await lib.attrappenSetzen(ctx);
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Network.enable');
const anfragen = new Map(); // requestId -> { name, kodiert, laenge, fertig, fehler }
cdp.on('Network.responseReceived', (e) => {
  if (!e.response.url.endsWith('.js')) return;
  const kopf = Object.fromEntries(Object.entries(e.response.headers).map(([k, v]) => [k.toLowerCase(), v]));
  anfragen.set(e.requestId, { name: e.response.url.split('/').pop(), laenge: Number(kopf['content-length'] ?? NaN), kodierung: kopf['content-encoding'] ?? '', kodiert: null, roh: null, fehler: null });
});
cdp.on('Network.loadingFinished', (e) => { const a = anfragen.get(e.requestId); if (a) a.kodiert = e.encodedDataLength; });
cdp.on('Network.loadingFailed', (e) => { const a = anfragen.get(e.requestId); if (a) a.fehler = e.errorText; });
const fehler = [];
p.on('pageerror', (e) => fehler.push(String(e)));
await p.goto(basis + pfad, { waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
for (const [id, a] of anfragen) {
  try { a.roh = Buffer.from((await cdp.send('Network.getResponseBody', { requestId: id })).body, 'utf8').length; } catch (e) { a.roh = null; a.fehler ??= 'body: ' + String(e.message ?? e); }
}
const liste = [...anfragen.values()].sort((x, y) => x.name.localeCompare(y.name));
const summe = (f) => liste.reduce((s, a) => s + (Number.isFinite(a[f]) ? a[f] : 0), 0);
console.log(JSON.stringify({ pfad, zahl: liste.length, ohneGroesse: liste.filter((a) => a.roh == null || a.kodiert == null).map((a) => a.name), rohSumme: summe('roh'), uebertragenSumme: summe('kodiert'), dateien: liste.map((a) => [a.name, a.roh, a.kodiert, a.kodierung]), fehler }));
await b.close();
