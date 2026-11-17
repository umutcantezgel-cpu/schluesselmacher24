# Leistung mobil · hebel1-nachbesserung

Stand 2026-11-17T23:34:25.298Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 88 (86 bis 92) | 1.662 ms (1.508 bis 1.671) | 3.698 ms (3.186 bis 3.945) | 1.662 ms (1.508 bis 1.779) | 124 ms (96 bis 158) | 0,000 (0,000 bis 0,000) | 431 KB (431 bis 431) | 27 (27 bis 27) | 248 KB (248 bis 248) | 57 KB (57 bis 57) |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 4: Leistung 88, LCP 3.765 ms, TBT 96 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.310 ms
- Hauptthread 1.399 ms; Inline-Skripte im Dokument 14 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 291 | 25,8 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | n. g. | n. g. | Low |
| /_next/static/chunks/2lw-728jyaaxj.js | 19,3 | n. g. | n. g. | Low |
| /_next/static/chunks/3r80fbyrjjeca.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pvdpgm2qg55p.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20cjhw3dxf4jz.js | 11,8 | n. g. | n. g. | Low |
| /_next/static/chunks/0mm217a2dyy_h.js | 10,7 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/265gf7_cjgizi.js | 9,7 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/1__s-1hg7j3xv.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/2ap808zi3x4kb.js | 6,2 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel/anfrage | 1080 | 145 |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 3775 | 136 |
| Unattributable | 906 | 81 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3911 | 80 |
| /autoschluessel/anfrage | 1016 | 64 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 26 KiB | 290 | 25,8 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.8 s | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.0 s | n. g. | n. g. |
| max-potential-fid | 140 ms | n. g. | n. g. |

