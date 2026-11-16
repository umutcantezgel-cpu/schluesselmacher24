// Schreibt berichte/FA-BESTAND.md und FA-BESTAND.json aus dem Ergebnis des Workflows fa-bestand.
// Aufruf: node bestand-bericht.cjs <journal.jsonl oder ergebnis.json> <repo> <stand-commit> <datum>
const fs = require('fs');
const [quelle, repo, commit, datum] = process.argv.slice(2);
let abschnitte = [];
const roh = fs.readFileSync(quelle, 'utf8');
if (quelle.endsWith('.jsonl')) {
  // Journal: je Gegenprüfung ein Ergebnis mit zeilen und ungedeckt; Zuordnung über die Kennungen.
  for (const l of roh.trim().split('\n')) {
    const e = JSON.parse(l);
    if (e.type === 'result' && e.result && Array.isArray(e.result.zeilen) && e.result.ungedeckt) abschnitte.push(e.result);
  }
} else abschnitte = JSON.parse(roh).abschnitte;
const zeilen = abschnitte.flatMap((a) => (a.zeilen || []).map((z) => ({ ...z, block: a.block ? `${a.block}${a.teil || ''}` : '' })));
const ungedeckt = abschnitte.flatMap((a) => a.ungedeckt || []);
const nach = (u) => zeilen.filter((z) => z.urteil === u);
const sauber = (s) => String(s || '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const aus = [];
aus.push(`# FA-BESTAND · Stand der 352 Anforderungen der Arbeitsanweisung (${datum})`, '');
aus.push(`Geprüfter Stand: Commit ${commit}. Verfahren: je Abschnitt ein Leser (Haiku), jedes Urteil unabhängig gegengeprüft (Opus), nur lesend auf einer festen Kopie des Stands. Grundlage: \`berichte/FA-ABGLEICH.md\` vom 15.11.2026.`, '');
aus.push(`Ergebnis: ${zeilen.length} Anforderungen beurteilt · erfüllt ${nach('erfuellt').length} · teilweise ${nach('teilweise').length} · fehlt ${nach('fehlt').length} · von der Gegenprüfung korrigiert ${zeilen.filter((z) => z.korrigiert).length} · Lücken ohne Paket ${ungedeckt.length}.`, '');
aus.push('## Lücken am Code, die kein offenes Paket deckt', '');
if (!ungedeckt.length) aus.push('Keine.', '');
else {
  aus.push('| Kennung | Was fehlt | Vorschlag | Aufwand |', '|---|---|---|---|');
  for (const u of ungedeckt) aus.push(`| ${sauber(u.kennung)} | ${sauber(u.was_fehlt)} | ${sauber(u.vorschlag)} | ${u.aufwand} |`);
  aus.push('');
}
aus.push('## Offen am Code, gedeckt durch ein offenes Paket', '');
const gedeckt = zeilen.filter((z) => z.urteil !== 'erfuellt' && z.paket && z.paket !== 'keines' && z.paket !== '-');
const jePaket = {};
for (const z of gedeckt) (jePaket[z.paket] ||= []).push(z);
for (const [paket, liste] of Object.entries(jePaket).sort()) {
  aus.push(`### ${paket} (${liste.length})`, '', '| Kennung | Urteil | Lücke |', '|---|---|---|');
  for (const z of liste) aus.push(`| ${sauber(z.kennung)} | ${z.urteil} | ${sauber(z.luecke)} |`);
  aus.push('');
}
aus.push('## Erfüllt am Code, es fehlt nur eine Zulieferung oder Entscheidung', '', '| Kennung | Was Menschen liefern | Beleg |', '|---|---|---|');
for (const z of nach('erfuellt').filter((z) => sauber(z.menschen))) aus.push(`| ${sauber(z.kennung)} | ${sauber(z.menschen)} | ${sauber(z.beleg)} |`);
aus.push('', '## Alle Anforderungen', '', '| Kennung | Urteil | Beleg | Lücke | Paket | Menschen | Korrektur der Gegenprüfung |', '|---|---|---|---|---|---|---|');
for (const z of zeilen) aus.push(`| ${sauber(z.kennung)} | ${z.urteil} | ${sauber(z.beleg)} | ${sauber(z.luecke)} | ${sauber(z.paket)} | ${sauber(z.menschen)} | ${z.korrigiert ? sauber(z.grund) : ''} |`);
aus.push('');
fs.writeFileSync(`${repo}/_werkstatt/ausbau/berichte/FA-BESTAND.md`, aus.join('\n'));
fs.writeFileSync(`${repo}/_werkstatt/ausbau/berichte/FA-BESTAND.json`, JSON.stringify({ stand: commit, datum, zeilen, ungedeckt }, null, 1) + '\n');
console.log(`Anforderungen ${zeilen.length} · erfüllt ${nach('erfuellt').length} · teilweise ${nach('teilweise').length} · fehlt ${nach('fehlt').length} · korrigiert ${zeilen.filter((z) => z.korrigiert).length} · ungedeckt ${ungedeckt.length}`);
const kennungen = new Set(zeilen.map((z) => z.kennung));
console.log('eindeutige Kennungen:', kennungen.size);
