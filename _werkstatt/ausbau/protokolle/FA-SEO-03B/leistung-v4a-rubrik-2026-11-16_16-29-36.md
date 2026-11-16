# Leistung mobil · v4a-rubrik

Stand 2026-11-16T15:32:10.415Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 85 (79 bis 93) | 1.059 ms (1.018 bis 1.075) | 3.086 ms (1.402 bis 3.760) | 1.059 ms (1.018 bis 1.075) | 412 ms (306 bis 459) | 0,000 (0,000 bis 0,000) | 449 KB (449 bis 449) | 28 (28 bis 28) | 268 KB (268 bis 268) | 55 KB (55 bis 55) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 5/5 | 90 (88 bis 93) | 1.364 ms (1.358 bis 1.384) | 2.807 ms (2.537 bis 3.094) | 1.364 ms (1.358 bis 1.384) | 233 ms (164 bis 280) | 0,000 (0,000 bis 0,000) | 399 KB (399 bis 399) | 25 (25 bis 25) | 251 KB (251 bis 251) | 53 KB (53 bis 53) |
| Shop (/shop) | 5/5 | 93 (90 bis 97) | 1.361 ms (1.107 bis 1.364) | 2.721 ms (2.344 bis 3.172) | 1.361 ms (1.107 bis 1.364) | 73 ms (45 bis 328) | 0,000 (0,000 bis 0,000) | 327 KB (327 bis 327) | 20 (20 bis 20) | 196 KB (196 bis 196) | 52 KB (52 bis 52) |
| Kontakt (/service-und-termin/kontakt) | 5/5 | 88 (80 bis 91) | 1.352 ms (1.020 bis 1.361) | 3.420 ms (1.925 bis 3.744) | 1.352 ms (1.020 bis 1.361) | 156 ms (149 bis 460) | 0,000 (0,000 bis 0,000) | 397 KB (397 bis 397) | 28 (28 bis 28) | 244 KB (244 bis 244) | 54 KB (54 bis 54) |

## Vergleich mit der Vorher-Messung (Median)

| Ansicht | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|
| /autoschluessel/anfrage | 80 → 85 | 1.082 → 1.059 | 3.027 → 3.086 | 1.082 → 1.059 | 495 → 412 | 0,000 → 0,000 | 464 → 449 | 29 → 28 | 282 → 268 | 55 → 55 |
| /gleichschliessende-zylinder/konfigurator | 89 → 90 | 1.362 → 1.364 | 3.396 → 2.807 | 1.362 → 1.364 | 173 → 233 | 0,000 → 0,000 | 426 → 399 | 27 → 25 | 277 → 251 | 53 → 53 |
| /shop | 90 → 93 | 1.363 → 1.361 | 3.626 → 2.721 | 1.363 → 1.361 | 58 → 73 | 0,000 → 0,000 | 393 → 327 | 25 → 20 | 261 → 196 | 52 → 52 |
| /service-und-termin/kontakt | 89 → 88 | 1.361 → 1.352 | 3.501 → 3.420 | 1.361 → 1.352 | 176 → 156 | 0,000 → 0,000 | 417 → 397 | 30 → 28 | 264 → 244 | 54 → 54 |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 5: Leistung 85, LCP 3.086 ms, TBT 382 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 461 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.625 ms
- Hauptthread 1.840 ms; Inline-Skripte im Dokument 34 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 349 | 25,8 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 175 | n. g. | Low |
| /_next/static/chunks/2vp65sl4uu2-v.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/1uht7ze-h6ee4.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3p2u6w5r2lpxo.js | 12,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel/anfrage | 1228 | 203 |
| /_next/static/chunks/262uxxszab7p8.js | 3955 | 196 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4200 | 118 |
| Unattributable | 1079 | 86 |
| /autoschluessel/anfrage | 1165 | 63 |
| Unattributable | 917 | 61 |
| /autoschluessel/anfrage | 978 | 58 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4358 | 50 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 26 KiB | 170 | 25,8 |
| largest-contentful-paint | 3.1 s | n. g. | n. g. |
| total-blocking-time | 380 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.3 s | n. g. | n. g. |
| max-potential-fid | 200 ms | n. g. | n. g. |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 1: Leistung 90, LCP 2.782 ms, TBT 265 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.327 ms
- Hauptthread 1.984 ms; Inline-Skripte im Dokument 19 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 388 | 27,2 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 294 | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/2exsscnb93a7n.js | 12,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3te1wmrqx50i3.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/18eu7sjs38rex.js | 7,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/262uxxszab7p8.js | 3666 | 318 |
| /gleichschliessende-zylinder/konfigurator | 1212 | 145 |
| /gleichschliessende-zylinder/konfigurator | 1087 | 125 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4038 | 93 |
| Unattributable | 909 | 77 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4131 | 60 |
| /gleichschliessende-zylinder/konfigurator | 1028 | 59 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3984 | 54 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 2.8 s | n. g. | n. g. |
| total-blocking-time | 260 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.1 s | n. g. | n. g. |
| max-potential-fid | 320 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,4 |

## Shop · /shop

Medianlauf 2: Leistung 93, LCP 3.156 ms, TBT 45 ms.

- LCP-Element: li#schluessel-nach-code > div.grid > div.min-w-0 > p.mt-1 · <p class="mt-1 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.701 ms
- Hauptthread 1.570 ms; Inline-Skripte im Dokument 16 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 340 | 27,6 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /shop | 1097 | 202 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3166 | 140 |
| /shop | 1021 | 76 |
| /shop | 908 | 63 |
| /shop | 971 | 50 |
| /shop | 1299 | 50 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 28 KiB | 300 | 27,6 |
| largest-contentful-paint | 3.2 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 140 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Kontakt · /service-und-termin/kontakt

Medianlauf 2: Leistung 88, LCP 3.712 ms, TBT 149 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 454 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.258 ms
- Hauptthread 2.138 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 408 | 25,4 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 35 | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/2iveba2g_n1gs.js | 13,2 | n. g. | n. g. | Low |
| /_next/static/chunks/3p2u6w5r2lpxo.js | 12,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /service-und-termin/kontakt | 1111 | 201 |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 3616 | 191 |
| Unattributable | 917 | 106 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3852 | 63 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3915 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 25 KiB | 390 | 25,4 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.7 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 3.9 s | n. g. | n. g. |

