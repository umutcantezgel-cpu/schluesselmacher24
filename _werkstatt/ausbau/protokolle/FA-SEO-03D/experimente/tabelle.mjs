// Versuchsskript FA-SEO-03D: Tabellen aus gewicht-*.json und netz-*.json. Aufruf: node tabelle.mjs <ordner> vorher k1 k2 k3 nachher
import { readFileSync, existsSync } from 'node:fs';
const [ordner, ...staende] = process.argv.slice(2);
const kb = (n) => (n / 1024).toFixed(1);
const g = Object.fromEntries(staende.filter((s) => existsSync(`${ordner}/gewicht-${s}.json`)).map((s) => [s, JSON.parse(readFileSync(`${ordner}/gewicht-${s}.json`, 'utf8'))]));
const n = Object.fromEntries(staende.filter((s) => existsSync(`${ordner}/netz-${s}.json`)).map((s) => [s, JSON.parse(readFileSync(`${ordner}/netz-${s}.json`, 'utf8'))]));
console.log(`| Ansicht | ${Object.keys(g).map((s) => `${s}: Skripte, KB gz`).join(' | ')} |`);
console.log(`|---|${Object.keys(g).map(() => '---').join('|')}|`);
for (const a of Object.keys(g[staende[0]])) console.log(`| ${a} | ${Object.keys(g).map((s) => `${g[s][a].skripte}, ${kb(g[s][a].jsGz)}`).join(' | ')} |`);
console.log();
console.log(`| Seite | ${Object.keys(n).map((s) => `${s}: Dateien, KB übertragen (roh)`).join(' | ')} |`);
console.log(`|---|${Object.keys(n).map(() => '---').join('|')}|`);
for (const [i, z] of n[staende[0]].entries()) console.log(`| ${z.pfad} | ${Object.keys(n).map((s) => `${n[s][i].zahl}, ${n[s][i].uebertragenKB} (${n[s][i].rohKB})`).join(' | ')} |`);
