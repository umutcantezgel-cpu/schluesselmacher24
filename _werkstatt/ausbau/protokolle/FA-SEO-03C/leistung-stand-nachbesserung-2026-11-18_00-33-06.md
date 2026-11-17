# Leistung mobil · stand-nachbesserung

Stand 2026-11-17T23:33:43.962Z · Basis http://localhost:3200 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 88 (87 bis 90) | 1.359 ms (993 bis 1.672) | 3.475 ms (2.780 bis 3.684) | 1.637 ms (993 bis 1.672) | 180 ms (140 bis 303) | 0,000 (0,000 bis 0,000) | 450 KB (450 bis 450) | 28 (28 bis 28) | 267 KB (267 bis 267) | 57 KB (57 bis 57) |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 3: Leistung 88, LCP 3.475 ms, TBT 180 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.019 ms
- Hauptthread 1.284 ms; Inline-Skripte im Dokument 14 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 455 | 25,8 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | n. g. | n. g. | Low |
| /_next/static/chunks/3p0dtvvb9953y.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/1f8fz9szmjtc7.js | 12,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/23aylg5ag7_au.js | 11,1 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/1gcgfj5ejg9xo.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 3931 | 179 |
| /autoschluessel/anfrage | 1005 | 124 |
| /_next/static/chunks/2dmg2rln22ufa.js | 4110 | 107 |
| /autoschluessel/anfrage | 942 | 63 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 3.5 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.2 s | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 67 KiB | 0 | 67,0 |

