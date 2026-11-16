// Versuchsskript FA-SEO-03B (nur zum Nachvollziehen): wertet 'next analyze export --snapshot <name> --route <route>' (JSON Lines) aus.
import fs from 'node:fs';
const [,, datei, n='40'] = process.argv;
const zeilen = fs.readFileSync(datei,'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const asyncOut = new Set(); for (const z of zeilen) if (z.type==='group' && z.kind==='async') for (const o of z.outputs) asyncOut.add(o);
const proQuelle = new Map(); const proDatei = new Map();
for (const z of zeilen) { if (z.type!=='part' || !z.filename.includes('/static/chunks/')) continue;
  if (asyncOut.has(z.filename)) continue;
  const k = z.source_path.replace('[project]/','');
  const e = proQuelle.get(k) ?? {s:0,c:0}; e.s+=z.size; e.c+=z.compressed_size; proQuelle.set(k,e);
  const d = proDatei.get(z.filename) ?? {s:0,c:0}; d.s+=z.size; d.c+=z.compressed_size; proDatei.set(z.filename,d);
}
let ss=0,cc=0; for (const e of proQuelle.values()) {ss+=e.s;cc+=e.c;}
console.log('gesamt roh', (ss/1024).toFixed(1),'KB, komprimiert', (cc/1024).toFixed(1));
const grp = new Map(); for (const [k,e] of proQuelle) { const g = k.startsWith('node_modules/') ? k.split('/').slice(0, k.split('/')[1].startsWith('@')?3:2).join('/') + (k.includes('next/dist/compiled/react-dom')?'(react-dom)':'') : k; const x=grp.get(g)??{s:0,c:0}; x.s+=e.s;x.c+=e.c; grp.set(g,x);}
for (const [k,e] of [...grp].sort((a,b)=>b[1].c-a[1].c).slice(0,+n)) console.log((e.c/1024).toFixed(1).padStart(7), (e.s/1024).toFixed(1).padStart(7), k);
