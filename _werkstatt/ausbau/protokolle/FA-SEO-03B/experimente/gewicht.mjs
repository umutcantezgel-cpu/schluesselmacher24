// Versuchsskript FA-SEO-03B (nur zum Nachvollziehen). Lastunabhängige Werte je Ansicht: HTML roh/gz, Skripte im HTML (Zahl, roh, gz), CSS-Dateien, Schriften im Kopf.
import zlib from 'node:zlib';
const basis = process.argv[2] ?? 'http://localhost:3300';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(basis).hostname)) throw new Error('nur localhost (G1)');
// Aufruf: node gewicht.mjs http://localhost:3300 [ausgabe.json]  (gzip Stufe 9; Skripte = <script src> im HTML)
const ANS = { start:'/', autoschluessel:'/autoschluessel', assistent:'/autoschluessel/anfrage', code:'/schluessel-nach-code', konfigurator:'/gleichschliessende-zylinder/konfigurator', shop:'/shop', ort:'/standorte/wetzlar', ratgeber:'/ratgeber/zylinder-richtig-ausmessen', kontakt:'/service-und-termin/kontakt' };
const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
const kb = (n) => (n/1024).toFixed(1);
const cache = new Map();
async function hole(u) { if (cache.has(u)) return cache.get(u); const r = await fetch(u); const b = Buffer.from(await r.arrayBuffer()); cache.set(u,b); return b; }
const out = {};
console.log('| Ansicht | HTML roh KB | HTML gz KB | davon style roh KB | Nutzlast roh KB | Skripte | JS roh KB | JS gz KB | CSS-Dateien | CSS gz KB | Vorladen (Kopf) |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (const [id, pfad] of Object.entries(ANS)) {
  const html = await hole(basis + pfad); const t = html.toString('utf8');
  const skripte = [...new Set([...t.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]))];
  let jsr=0,jsg=0; for (const s of skripte) { const b = await hole(new URL(s, basis).href); jsr+=b.length; jsg+=gz(b); }
  const css = [...new Set([...t.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>m[1]))];
  let cssg=0; for (const s of css) cssg += gz(await hole(new URL(s, basis).href));
  const style = [...t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((a,m)=>a+Buffer.byteLength(m[1]),0);
  const nutz = [...t.matchAll(/<script>self\.__next_f\.push\(([\s\S]*?)\)<\/script>/g)].reduce((a,m)=>a+Buffer.byteLength(m[1]),0);
  const vor = [...t.matchAll(/<link[^>]+rel="preload"[^>]*>/g)].map(m=>(m[0].match(/href="([^"]+)"/)||[])[1]?.split('/').pop()).join(' ');
  out[id] = { htmlRoh: html.length, htmlGz: gz(html), style, nutz, skripte: skripte.length, jsRoh: jsr, jsGz: jsg, css: css.length, cssGz: cssg };
  console.log(`| ${id} | ${kb(html.length)} | ${kb(gz(html))} | ${kb(style)} | ${kb(nutz)} | ${skripte.length} | ${kb(jsr)} | ${kb(jsg)} | ${css.length} | ${kb(cssg)} | ${vor} |`);
}
if (process.argv[3]) (await import('node:fs')).writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
