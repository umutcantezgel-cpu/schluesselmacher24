# Leistung mobil · nachher-devtools

Stand 2026-11-16T16:32:19.152Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 3 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), angewandte Drosselung (devtools): Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s, CPU 4-fach. Zeiten und Gewichte gemessen.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 3/3 | 94 (93 bis 98) | 1.282 ms (1.240 bis 1.353) | 1.282 ms (1.240 bis 1.353) | 1.514 ms (1.473 bis 1.588) | 280 ms (162 bis 324) | 0,000 (0,000 bis 0,000) | 519 KB (519 bis 520) | 43 (43 bis 43) | 266 KB (266 bis 266) | 80 KB (80 bis 80) |
| Autoschlüssel (/autoschluessel) | 3/3 | 95 (91 bis 95) | 1.152 ms (1.118 bis 1.243) | 1.152 ms (1.118 bis 1.243) | 1.226 ms (1.189 bis 1.312) | 250 ms (242 bis 389) | 0,000 (0,000 bis 0,000) | 545 KB (545 bis 545) | 41 (41 bis 41) | 266 KB (266 bis 266) | 75 KB (75 bis 75) |
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 3/3 | 96 (96 bis 97) | 1.002 ms (970 bis 1.018) | 1.002 ms (970 bis 1.018) | 1.066 ms (1.033 bis 1.077) | 233 ms (205 bis 238) | 0,000 (0,000 bis 0,000) | 594 KB (594 bis 594) | 46 (46 bis 46) | 318 KB (318 bis 318) | 55 KB (55 bis 55) |
| Schlüssel nach Code (Liste) (/schluessel-nach-code) | 3/3 | 98 (97 bis 99) | 1.028 ms (1.023 bis 1.028) | 1.028 ms (1.023 bis 1.028) | 1.784 ms (1.779 bis 1.796) | 149 ms (125 bis 182) | 0,000 (0,000 bis 0,000) | 530 KB (530 bis 531) | 46 (46 bis 46) | 274 KB (274 bis 274) | 56 KB (56 bis 56) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 3/3 | 98 (98 bis 98) | 971 ms (970 bis 976) | 971 ms (970 bis 976) | 1.054 ms (1.053 bis 1.060) | 161 ms (152 bis 174) | 0,000 (0,000 bis 0,000) | 568 KB (567 bis 568) | 47 (47 bis 47) | 302 KB (302 bis 302) | 53 KB (53 bis 53) |
| Shop (/shop) | 3/3 | 99 (98 bis 99) | 999 ms (960 bis 1.008) | 999 ms (960 bis 1.008) | 1.100 ms (1.057 bis 1.112) | 143 ms (124 bis 157) | 0,000 (0,000 bis 0,000) | 493 KB (493 bis 493) | 41 (41 bis 41) | 266 KB (266 bis 266) | 52 KB (52 bis 52) |
| Ortsseite Wetzlar (/standorte/wetzlar) | 3/3 | 99 (99 bis 99) | 996 ms (990 bis 999) | 996 ms (990 bis 999) | 1.630 ms (1.629 bis 1.637) | 113 ms (113 bis 137) | 0,000 (0,000 bis 0,000) | 522 KB (520 bis 522) | 45 (45 bis 45) | 268 KB (268 bis 268) | 54 KB (54 bis 54) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 3/3 | 99 (98 bis 100) | 1.025 ms (1.023 bis 1.040) | 1.025 ms (1.023 bis 1.040) | 1.679 ms (1.678 bis 1.702) | 127 ms (86 bis 156) | 0,000 (0,000 bis 0,000) | 528 KB (527 bis 528) | 45 (45 bis 45) | 273 KB (273 bis 273) | 55 KB (55 bis 55) |
| Kontakt (/service-und-termin/kontakt) | 3/3 | 98 (98 bis 99) | 1.015 ms (1.004 bis 1.016) | 1.015 ms (1.004 bis 1.016) | 1.089 ms (1.078 bis 1.097) | 165 ms (142 bis 178) | 0,000 (0,000 bis 0,000) | 546 KB (545 bis 547) | 49 (49 bis 49) | 297 KB (297 bis 297) | 54 KB (54 bis 54) |

## Vergleich mit der Vorher-Messung (Median)

| Ansicht | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|
| / | 95 → 94 | 1.181 → 1.282 | 1.181 → 1.282 | 1.413 → 1.514 | 245 → 280 | 0,000 → 0,000 | 518 → 519 | 42 → 43 | 264 → 266 | 80 → 80 |
| /autoschluessel | 96 → 95 | 1.146 → 1.152 | 1.146 → 1.152 | 1.215 → 1.226 | 233 → 250 | 0,000 → 0,000 | 543 → 545 | 40 → 41 | 264 → 266 | 75 → 75 |
| /autoschluessel/anfrage | 96 → 96 | 1.010 → 1.002 | 1.010 → 1.002 | 1.070 → 1.066 | 212 → 233 | 0,000 → 0,000 | 603 → 594 | 46 → 46 | 327 → 318 | 55 → 55 |
| /schluessel-nach-code | 99 → 98 | 1.028 → 1.028 | 1.028 → 1.028 | 1.764 → 1.784 | 141 → 149 | 0,000 → 0,000 | 528 → 530 | 45 → 46 | 271 → 274 | 56 → 56 |
| /gleichschliessende-zylinder/konfigurator | 98 → 98 | 1.002 → 971 | 1.002 → 971 | 1.087 → 1.054 | 154 → 161 | 0,000 → 0,000 | 589 → 568 | 48 → 47 | 322 → 302 | 53 → 53 |
| /shop | 99 → 99 | 986 → 999 | 986 → 999 | 1.080 → 1.100 | 143 → 143 | 0,000 → 0,000 | 532 → 493 | 43 → 41 | 305 → 266 | 52 → 52 |
| /standorte/wetzlar | 99 → 99 | 1.056 → 996 | 1.056 → 996 | 1.680 → 1.630 | 116 → 113 | 0,000 → 0,000 | 559 → 522 | 47 → 45 | 306 → 268 | 54 → 54 |
| /ratgeber/zylinder-richtig-ausmessen | 99 → 99 | 1.054 → 1.025 | 1.054 → 1.025 | 1.737 → 1.679 | 132 → 127 | 0,000 → 0,000 | 567 → 528 | 47 → 45 | 312 → 273 | 55 → 55 |
| /service-und-termin/kontakt | 96 → 98 | 1.086 → 1.015 | 1.086 → 1.015 | 1.164 → 1.089 | 221 → 165 | 0,000 → 0,000 | 560 → 546 | 49 → 49 | 309 → 297 | 54 → 54 |

## Startseite · /

Medianlauf 3: Leistung 94, LCP 1.353 ms, TBT 280 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (gemessen): Serverantwort 26 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.327 ms
- Hauptthread 4.175 ms; Inline-Skripte im Dokument 33 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 802 | 25,7 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 163 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| / | 872 | 448 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2646 | 181 |
| / | 621 | 108 |
| / | 2450 | 101 |
| / | 2216 | 82 |
| / | 2562 | 70 |
| /_next/static/chunks/135mh5o112fx1.js | 2906 | 65 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3679 | 63 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 280 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 25,7 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Autoschlüssel · /autoschluessel

Medianlauf 3: Leistung 95, LCP 1.118 ms, TBT 242 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 14 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.105 ms
- Hauptthread 3.213 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 929 | 26,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 154 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 49 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel | 804 | 288 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2536 | 210 |
| /autoschluessel | 2033 | 80 |
| /autoschluessel | 2232 | 75 |
| /autoschluessel | 2459 | 64 |
| /autoschluessel | 2363 | 63 |
| /autoschluessel | 599 | 58 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 240 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 210 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 26,1 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 3: Leistung 96, LCP 1.018 ms, TBT 238 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (gemessen): Serverantwort 42 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 976 ms
- Hauptthread 2.850 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 3, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1279 | 25,5 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 126 | n. g. | Low |
| /_next/static/chunks/2vp65sl4uu2-v.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0cs01p471-gad.js | 17,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3p2u6w5r2lpxo.js | 12,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 44 | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2574 | 214 |
| /autoschluessel/anfrage | 821 | 181 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4154 | 108 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4351 | 66 |
| /autoschluessel/anfrage | 600 | 64 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 240 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.4 s | n. g. | n. g. |
| max-potential-fid | 210 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 67 KiB | 0 | 67,0 |

## Schlüssel nach Code (Liste) · /schluessel-nach-code

Medianlauf 1: Leistung 98, LCP 1.028 ms, TBT 149 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 22 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.006 ms
- Hauptthread 2.984 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 970 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 180 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2552 | 188 |
| /schluessel-nach-code | 838 | 173 |
| /schluessel-nach-code | 618 | 83 |
| /schluessel-nach-code | 2273 | 57 |
| /schluessel-nach-code | 2154 | 54 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 11,8 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 1: Leistung 98, LCP 971 ms, TBT 152 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (gemessen): Serverantwort 27 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 943 ms
- Hauptthread 2.449 ms; Inline-Skripte im Dokument 19 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1046 | 25,5 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 152 | n. g. | Low |
| /_next/static/chunks/1rh4hj1oioj_w.js | 16,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0vrd4f7pg1ssn.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 46 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2500 | 181 |
| /gleichschliessende-zylinder/konfigurator | 812 | 141 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3814 | 71 |
| /gleichschliessende-zylinder/konfigurator | 594 | 61 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 3.9 s | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,4 |
| unused-javascript | Est savings of 25 KiB | 0 | 25,5 |

## Shop · /shop

Medianlauf 2: Leistung 99, LCP 960 ms, TBT 124 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 17 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 943 ms
- Hauptthread 2.182 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 826 | 26,3 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 143 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2420 | 174 |
| /shop | 811 | 126 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 170 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 26,3 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ortsseite Wetzlar · /standorte/wetzlar

Medianlauf 2: Leistung 99, LCP 996 ms, TBT 113 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 16 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 980 ms
- Hauptthread 2.445 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 703 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 161 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /standorte/wetzlar | 819 | 164 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2506 | 163 |
| /standorte/wetzlar | 603 | 57 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 160 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,0 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 1: Leistung 99, LCP 1.040 ms, TBT 127 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 18 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.022 ms
- Hauptthread 2.869 ms; Inline-Skripte im Dokument 14 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 722 | 26,2 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 153 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 54 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /ratgeber/zylinder-richtig-ausmessen | 828 | 187 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2512 | 177 |
| /ratgeber/zylinder-richtig-ausmessen | 610 | 60 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 26,2 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Kontakt · /service-und-termin/kontakt

Medianlauf 3: Leistung 98, LCP 1.015 ms, TBT 178 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 21 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 993 ms
- Hauptthread 2.786 ms; Inline-Skripte im Dokument 20 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 3, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1171 | 25,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 170 | n. g. | Low |
| /_next/static/chunks/3p2u6w5r2lpxo.js | 12,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3h-rhkge30xey.js | 10,3 | n. g. | n. g. | Low |
| /_next/static/chunks/449ojr2kt6f79.js | 10,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1ue2dmr7wb2rt.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2512 | 190 |
| /service-und-termin/kontakt | 830 | 165 |
| /service-und-termin/kontakt | 1955 | 79 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3893 | 58 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4032 | 52 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.1 s | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 65 KiB | 0 | 64,8 |
| unused-javascript | Est savings of 25 KiB | 0 | 25,1 |

