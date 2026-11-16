// Versuchsskript FA-SEO-03B (nur zum Nachvollziehen): wertet 'next analyze export --snapshot <name> --route <route>' (JSON Lines) aus.
import fs from 'node:fs';
const [,, datei, ziel] = process.argv;
const zeilen = fs.readFileSync(datei,'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const route = zeilen.find(z=>z.type==='route');
const mods = new Map(zeilen.filter(z=>z.type==='module').map(m=>[m.ident,m]));
// Vorwärts-BFS ab allen Modulen der Route-Einträge, nur sync, Elternzeiger
const start = route.entries.map(e=>e.module_ident);
const vor = new Map(start.map(s=>[s,null])); let q=[...start];
while(q.length){ const x=q.shift(); const m=mods.get(x); if(!m) continue; for (const d of m.dependencies?.sync??[]) if(!vor.has(d)){vor.set(d,x); q.push(d);} }
const kurz = s=>s.replace(/\[project\]\//g,'').slice(0,140);
for (const k of vor.keys()) if (k.includes(ziel) && k.includes('app-client')) { let w=[]; let x=k; while(x){w.push(kurz(x)); x=vor.get(x);} console.log(w.reverse().join('\n  -> ')); console.log(); break; }
