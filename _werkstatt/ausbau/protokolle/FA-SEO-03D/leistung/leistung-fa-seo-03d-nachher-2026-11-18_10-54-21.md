# Leistung mobil · fa-seo-03d-nachher

Stand 2026-11-18T09:56:09.569Z · Basis http://localhost:3000 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 91 (82 bis 91) | 1.660 ms (1.508 bis 1.667) | 3.351 ms (3.179 bis 3.966) | 1.660 ms (1.508 bis 1.667) | 155 ms (116 bis 249) | 0,000 (0,000 bis 0,000) | 435 KB (435 bis 435) | 27 (27 bis 27) | 254 KB (254 bis 254) | 56 KB (56 bis 56) |
| Kontakt (/service-und-termin/kontakt) | 5/5 | 91 (88 bis 95) | 1.357 ms (994 bis 1.361) | 3.483 ms (2.596 bis 3.580) | 1.357 ms (994 bis 1.361) | 152 ms (55 bis 198) | 0,000 (0,000 bis 0,000) | 384 KB (382 bis 384) | 27 (27 bis 27) | 231 KB (231 bis 231) | 55 KB (55 bis 55) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 5/5 | 92 (90 bis 94) | 1.361 ms (1.358 bis 1.364) | 3.345 ms (2.909 bis 3.480) | 1.361 ms (1.358 bis 1.364) | 55 ms (52 bis 134) | 0,000 (0,000 bis 0,000) | 379 KB (379 bis 379) | 23 (23 bis 23) | 230 KB (230 bis 230) | 54 KB (54 bis 54) |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 1: Leistung 91, LCP 3.179 ms, TBT 155 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.724 ms
- Hauptthread 1.598 ms; Inline-Skripte im Dokument 26 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 445 | 25,8 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | n. g. | n. g. | Low |
| /_next/static/chunks/3p0dtvvb9953y.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/2motmwmdkco2o.js | 14,3 | n. g. | n. g. | Low |
| /_next/static/chunks/3_vptdjiccj6a.js | 12,7 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/25dee87xdmrqo.js | 10,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/1nm6eh7xc4jz8.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel/anfrage | 991 | 199 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3774 | 164 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3938 | 89 |
| /_next/static/chunks/2dmg2rln22ufa.js | 4027 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 3.2 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.1 s | n. g. | n. g. |
| max-potential-fid | 160 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 68 KiB | 0 | 68,4 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,8 |

## Kontakt · /service-und-termin/kontakt

Medianlauf 5: Leistung 91, LCP 3.483 ms, TBT 55 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 453 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.030 ms
- Hauptthread 1.429 ms; Inline-Skripte im Dokument 16 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 378 | 25,4 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | 27 | n. g. | Low |
| /_next/static/chunks/2motmwmdkco2o.js | 14,3 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1dg0sjy4kmm2e.js | 11,1 | n. g. | n. g. | Low |
| /_next/static/chunks/25dee87xdmrqo.js | 10,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/1nm6eh7xc4jz8.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /service-und-termin/kontakt | 1050 | 151 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3614 | 137 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3801 | 73 |
| Unattributable | 908 | 69 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3751 | 50 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 25 KiB | 310 | 25,4 |
| largest-contentful-paint | 3.5 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 140 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 66 KiB | 0 | 66,3 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 3: Leistung 92, LCP 3.352 ms, TBT 55 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (simuliert): Serverantwort 454 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.897 ms
- Hauptthread 1.317 ms; Inline-Skripte im Dokument 25 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/2dmg2rln22ufa.js | 72,4 | 241 | 27,0 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | n. g. | n. g. | Low |
| /_next/static/chunks/2motmwmdkco2o.js | 14,3 | n. g. | n. g. | Low |
| /_next/static/chunks/39uvevwmn6g-o.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/2qflrushwuwrz.js | 9,5 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/1nm6eh7xc4jz8.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 3467 | 153 |
| /gleichschliessende-zylinder/konfigurator | 1071 | 146 |
| Unattributable | 905 | 79 |
| /gleichschliessende-zylinder/konfigurator | 1217 | 75 |
| /_next/static/chunks/2dmg2rln22ufa.js | 3664 | 57 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 27 KiB | 180 | 27,0 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.4 s | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 150 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 13 KiB | 0 | 12,7 |

