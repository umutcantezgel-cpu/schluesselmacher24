// node skripte.mjs basis pfad... : listet <script src> je Abruf in Reihenfolge
const basis = process.argv[2]; if (!basis.startsWith('http://localhost')) throw new Error('nur localhost');
let vorher = null;
for (const p of process.argv.slice(3)) {
  const t = await (await fetch(basis + p)).text();
  const s = [...new Set([...t.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1].split('/').pop()))];
  console.log(p, s.length, s.join(' '));
}
