import fs from 'node:fs';
const lies = (d) => { const z = fs.readFileSync(d,'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
  const as = new Set(); for (const x of z) if (x.type==='group' && x.kind==='async') for (const o of x.outputs) as.add(o);
  const m = new Map(); for (const x of z) { if (x.type!=='part' || !x.filename.includes('/static/chunks/') || as.has(x.filename)) continue;
    const k = x.source_path.replace('[project]/',''); const e = m.get(k) ?? {s:0,c:0}; e.s+=x.size; e.c+=x.compressed_size; m.set(k,e); } return m; };
const a = lies(process.argv[2]), b = lies(process.argv[3]);
const nur = [...a].filter(([k]) => !b.has(k)).sort((x,y)=>y[1].c-x[1].c);
let c=0; for (const [,e] of nur) c+=e.c; console.log('nur in A:', nur.length, 'Module,', (c/1024).toFixed(1), 'KB komprimiert');
const grp = new Map(); for (const [k,e] of nur) { const g = k.replace(/^(src\/components\/visual\/generators)\/.*/, '$1/*').replace(/^(src\/components\/visual\/glyphen)\/.*/, '$1/*').replace(/^(src\/components\/visual\/icons)\/.*/, '$1/*'); const x = grp.get(g) ?? {s:0,c:0,n:0}; x.s+=e.s; x.c+=e.c; x.n++; grp.set(g,x); }
for (const [k,e] of [...grp].sort((x,y)=>y[1].c-x[1].c).slice(0, +process.argv[4] || 50)) console.log((e.c/1024).toFixed(1).padStart(6), String(e.n).padStart(3), k);
