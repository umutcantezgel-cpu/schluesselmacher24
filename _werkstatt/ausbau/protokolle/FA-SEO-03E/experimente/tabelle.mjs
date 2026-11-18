// Tabelle vorher/nachher aus netz-*.json und gewicht-*.json (FA-SEO-03E). Aufruf: node tabelle.mjs <ordner>
import { readFileSync } from 'node:fs';
const o = process.argv[2];
const n = (s) => JSON.parse(readFileSync(`${o}/netz-${s}.json`, 'utf8'));
const g = (s) => JSON.parse(readFileSync(`${o}/gewicht-${s}.json`, 'utf8'));
const [nv, nn] = [n('vorher'), n('nachher')];
const d = (a, b) => (b - a >= 0 ? '+' : '−') + Math.abs(b - a).toFixed(1);
console.log('| Seite | vorher (Dateien, KB übertragen, KB roh) | nachher | Differenz übertragen / roh | Zeichnungsdateien vorher → nachher |\n|---|---|---|---|---|');
for (const v of nv) {
  const w = nn.find((x) => x.pfad === v.pfad);
  console.log(`| ${v.pfad} | ${v.zahl}, ${v.uebertragenKB}, ${v.rohKB} | ${w.zahl}, ${w.uebertragenKB}, ${w.rohKB} | ${d(v.uebertragenKB, w.uebertragenKB)} / ${d(v.rohKB, w.rohKB)} | ${v.mitZeichnung.map((z) => z[0] + ' (' + z[1] + ')').join(', ')} → ${w.mitZeichnung.map((z) => z[0] + ' (' + z[1] + ')').join(', ')} |`);
}
const [gv, gn] = [g('vorher'), g('nachher')];
console.log('\n| Ansicht | vorher (Skripte, KB gz) | nachher | Differenz |\n|---|---|---|---|');
for (const k of Object.keys(gv)) console.log(`| ${k} | ${gv[k].skripte}, ${(gv[k].jsGz / 1024).toFixed(1)} | ${gn[k].skripte}, ${(gn[k].jsGz / 1024).toFixed(1)} | ${d(gv[k].jsGz / 1024, gn[k].jsGz / 1024)} |`);
