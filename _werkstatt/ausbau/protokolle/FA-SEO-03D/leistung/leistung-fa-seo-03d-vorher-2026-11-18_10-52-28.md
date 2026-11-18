# Leistung mobil · fa-seo-03d-vorher

Stand 2026-11-18T09:54:17.415Z · Basis http://localhost:3200 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 84 (83 bis 91) | 1.658 ms (988 bis 1.662) | 4.085 ms (2.006 bis 4.114) | 1.658 ms (988 bis 1.662) | 196 ms (161 bis 340) | 0,000 (0,000 bis 0,000) | 450 KB (450 bis 450) | 28 (28 bis 28) | 268 KB (268 bis 268) | 56 KB (56 bis 56) |
| Kontakt (/service-und-termin/kontakt) | 5/5 | 89 (86 bis 94) | 1.360 ms (989 bis 1.362) | 3.645 ms (3.029 bis 3.750) | 1.360 ms (989 bis 1.362) | 98 ms (60 bis 210) | 0,000 (0,000 bis 0,000) | 399 KB (398 bis 400) | 29 (29 bis 29) | 247 KB (247 bis 247) | 55 KB (55 bis 55) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 5/5 | 93 (90 bis 95) | 1.362 ms (1.357 bis 1.363) | 3.058 ms (2.906 bis 3.508) | 1.362 ms (1.357 bis 1.363) | 65 ms (54 bis 76) | 0,000 (0,000 bis 0,000) | 379 KB (379 bis 379) | 23 (23 bis 23) | 230 KB (230 bis 230) | 54 KB (54 bis 54) |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 4: Leistung 84, LCP 4.103 ms, TBT 161 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.647 ms
- Hauptthread 1.513 ms; Inline-Skripte im Dokument 15 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 304 | 25,4 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | 167 | n. g. | Low |
| /_next/static/chunks/3p0dtvvb9953y.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/2ouglswqoyzwd.js | 12,9 | n. g. | n. g. | Low |
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
| /autoschluessel/anfrage | 1089 | 187 |
| /_next/static/chunks/198evho4xwjs2.js | 3931 | 185 |
| Unattributable | 908 | 103 |
| /_next/static/chunks/2dmg2rln22ufa.js | 4116 | 82 |
| /_next/static/chunks/2dmg2rln22ufa.js | 4198 | 50 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 25 KiB | 460 | 25,4 |
| legacy-javascript | Est savings of 13 KiB | 300 | 13,4 |
| largest-contentful-paint | 4.1 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.2 s | n. g. | n. g. |

## Kontakt · /service-und-termin/kontakt

Medianlauf 4: Leistung 89, LCP 3.645 ms, TBT 98 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.190 ms
- Hauptthread 1.711 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 422 | 25,0 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | 29 | n. g. | Low |
| /_next/static/chunks/2ouglswqoyzwd.js | 12,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/21mxerzcfu103.js | 10,3 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/1nm6eh7xc4jz8.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/1wznxebzwm6sp.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /service-und-termin/kontakt | 1103 | 178 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3620 | 145 |
| Unattributable | 907 | 115 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3765 | 63 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 25 KiB | 310 | 25,0 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.6 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 3.8 s | n. g. | n. g. |
| max-potential-fid | 150 ms | n. g. | n. g. |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 2: Leistung 93, LCP 3.058 ms, TBT 68 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.602 ms
- Hauptthread 1.376 ms; Inline-Skripte im Dokument 28 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 265 | 27,1 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | 146 | 23,2 | Low |
| /_next/static/chunks/0fr28klgdr23v.js | 16,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0vrd4f7pg1ssn.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/1nm6eh7xc4jz8.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0bgdds2vv_815.js | 7,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/198evho4xwjs2.js | 3475 | 163 |
| /gleichschliessende-zylinder/konfigurator | 1146 | 101 |
| /gleichschliessende-zylinder/konfigurator | 1046 | 100 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3638 | 72 |
| Unattributable | 907 | 56 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 50 KiB | 150 | 50,3 |
| largest-contentful-paint | 3.1 s | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 160 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 13 KiB | 0 | 12,7 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |
| largest-contentful-paint-element | 3,060 ms | n. g. | n. g. |

