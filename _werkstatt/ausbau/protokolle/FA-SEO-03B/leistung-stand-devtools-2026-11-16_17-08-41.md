# Leistung mobil · stand-devtools

Stand 2026-11-16T16:20:27.667Z · Basis http://localhost:3200 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 3 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), angewandte Drosselung (devtools): Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s, CPU 4-fach. Zeiten und Gewichte gemessen.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 3/3 | 95 (86 bis 98) | 1.181 ms (1.141 bis 1.490) | 1.181 ms (1.141 bis 1.490) | 1.413 ms (1.366 bis 1.715) | 245 ms (169 bis 550) | 0,000 (0,000 bis 0,000) | 518 KB (517 bis 518) | 42 (42 bis 42) | 264 KB (264 bis 264) | 80 KB (80 bis 80) |
| Autoschlüssel (/autoschluessel) | 3/3 | 96 (94 bis 96) | 1.146 ms (1.117 bis 1.178) | 1.146 ms (1.117 bis 1.178) | 1.215 ms (1.187 bis 1.252) | 233 ms (213 bis 283) | 0,000 (0,000 bis 0,000) | 543 KB (543 bis 543) | 40 (40 bis 40) | 264 KB (264 bis 264) | 75 KB (75 bis 75) |
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 3/3 | 96 (96 bis 97) | 1.010 ms (974 bis 1.039) | 1.010 ms (974 bis 1.039) | 1.070 ms (1.032 bis 1.100) | 212 ms (208 bis 226) | 0,000 (0,000 bis 0,000) | 603 KB (603 bis 603) | 46 (46 bis 46) | 327 KB (327 bis 327) | 55 KB (55 bis 55) |
| Schlüssel nach Code (Liste) (/schluessel-nach-code) | 3/3 | 99 (99 bis 99) | 1.028 ms (1.019 bis 1.032) | 1.028 ms (1.019 bis 1.032) | 1.764 ms (1.760 bis 1.769) | 141 ms (133 bis 144) | 0,000 (0,000 bis 0,000) | 528 KB (528 bis 529) | 45 (45 bis 45) | 271 KB (271 bis 271) | 56 KB (56 bis 56) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 3/3 | 98 (98 bis 99) | 1.002 ms (982 bis 1.026) | 1.002 ms (982 bis 1.026) | 1.087 ms (1.063 bis 1.113) | 154 ms (138 bis 157) | 0,000 (0,000 bis 0,000) | 589 KB (587 bis 589) | 48 (48 bis 48) | 322 KB (322 bis 322) | 53 KB (53 bis 53) |
| Shop (/shop) | 3/3 | 99 (98 bis 99) | 986 ms (968 bis 1.022) | 986 ms (968 bis 1.022) | 1.080 ms (1.057 bis 1.115) | 143 ms (122 bis 153) | 0,000 (0,000 bis 0,000) | 532 KB (532 bis 532) | 43 (43 bis 43) | 305 KB (305 bis 305) | 52 KB (52 bis 52) |
| Ortsseite Wetzlar (/standorte/wetzlar) | 3/3 | 99 (98 bis 100) | 1.056 ms (1.018 bis 1.140) | 1.056 ms (1.018 bis 1.140) | 1.680 ms (1.647 bis 1.750) | 116 ms (71 bis 172) | 0,000 (0,000 bis 0,000) | 559 KB (559 bis 559) | 47 (47 bis 47) | 306 KB (306 bis 306) | 54 KB (54 bis 54) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 3/3 | 99 (98 bis 99) | 1.054 ms (1.048 bis 1.142) | 1.054 ms (1.048 bis 1.142) | 1.737 ms (1.709 bis 1.802) | 132 ms (126 bis 179) | 0,000 (0,000 bis 0,000) | 567 KB (566 bis 567) | 47 (47 bis 47) | 312 KB (312 bis 312) | 55 KB (55 bis 55) |
| Kontakt (/service-und-termin/kontakt) | 3/3 | 96 (95 bis 98) | 1.086 ms (1.051 bis 1.112) | 1.086 ms (1.051 bis 1.112) | 1.164 ms (1.121 bis 1.176) | 221 ms (180 bis 263) | 0,000 (0,000 bis 0,000) | 560 KB (557 bis 560) | 49 (49 bis 49) | 309 KB (309 bis 309) | 54 KB (54 bis 54) |

## Startseite · /

Medianlauf 2: Leistung 95, LCP 1.181 ms, TBT 245 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (gemessen): Serverantwort 24 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.157 ms
- Hauptthread 3.475 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 731 | 25,7 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 129 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 45 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| / | 821 | 342 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2573 | 177 |
| / | 2186 | 89 |
| / | 1894 | 77 |
| / | 2467 | 76 |
| / | 2329 | 76 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 250 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 25,7 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Autoschlüssel · /autoschluessel

Medianlauf 1: Leistung 96, LCP 1.117 ms, TBT 233 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 15 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.102 ms
- Hauptthread 3.200 ms; Inline-Skripte im Dokument 22 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 861 | 26,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 138 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 47 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel | 819 | 282 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2536 | 180 |
| /autoschluessel | 1993 | 96 |
| /autoschluessel | 2218 | 66 |
| /autoschluessel | 2733 | 64 |
| /autoschluessel | 2463 | 64 |
| /autoschluessel | 597 | 64 |
| /autoschluessel | 2346 | 62 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 230 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 26,1 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 2: Leistung 96, LCP 1.010 ms, TBT 226 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (gemessen): Serverantwort 37 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 973 ms
- Hauptthread 2.911 ms; Inline-Skripte im Dokument 20 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 3, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1357 | 25,5 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 124 | n. g. | Low |
| /_next/static/chunks/0g8b7kk9gj5l3.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2575 | 233 |
| /autoschluessel/anfrage | 818 | 168 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4238 | 84 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4385 | 59 |
| /autoschluessel/anfrage | 601 | 59 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 230 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.4 s | n. g. | n. g. |
| max-potential-fid | 230 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 67 KiB | 0 | 67,0 |

## Schlüssel nach Code (Liste) · /schluessel-nach-code

Medianlauf 1: Leistung 99, LCP 1.028 ms, TBT 144 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 25 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.002 ms
- Hauptthread 3.013 ms; Inline-Skripte im Dokument 21 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 941 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 191 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /schluessel-nach-code | 814 | 198 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2496 | 194 |
| /schluessel-nach-code | 598 | 58 |

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

Medianlauf 2: Leistung 98, LCP 1.026 ms, TBT 154 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (gemessen): Serverantwort 22 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.005 ms
- Hauptthread 3.069 ms; Inline-Skripte im Dokument 22 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1527 | 25,5 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 153 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3te1wmrqx50i3.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 39 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2553 | 180 |
| /gleichschliessende-zylinder/konfigurator | 841 | 162 |
| /gleichschliessende-zylinder/konfigurator | 617 | 80 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4407 | 74 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.5 s | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,4 |
| unused-javascript | Est savings of 25 KiB | 0 | 25,5 |

## Shop · /shop

Medianlauf 3: Leistung 99, LCP 968 ms, TBT 122 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 19 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 949 ms
- Hauptthread 2.389 ms; Inline-Skripte im Dokument 15 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 987 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 135 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 48 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2411 | 172 |
| /shop | 812 | 144 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 170 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ortsseite Wetzlar · /standorte/wetzlar

Medianlauf 1: Leistung 99, LCP 1.018 ms, TBT 116 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 18 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.000 ms
- Hauptthread 2.548 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 672 | 26,2 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 160 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /standorte/wetzlar | 817 | 194 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2529 | 162 |
| /standorte/wetzlar | 1180 | 55 |
| /standorte/wetzlar | 620 | 55 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 160 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,0 |
| unused-javascript | Est savings of 26 KiB | 0 | 26,2 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 1: Leistung 99, LCP 1.048 ms, TBT 132 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 16 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.032 ms
- Hauptthread 2.932 ms; Inline-Skripte im Dokument 21 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 692 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 150 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 47 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /ratgeber/zylinder-richtig-ausmessen | 819 | 205 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2508 | 162 |
| /_next/static/chunks/135mh5o112fx1.js | 2817 | 70 |
| /ratgeber/zylinder-richtig-ausmessen | 593 | 64 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 160 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Kontakt · /service-und-termin/kontakt

Medianlauf 2: Leistung 96, LCP 1.051 ms, TBT 221 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 37 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.014 ms
- Hauptthread 3.584 ms; Inline-Skripte im Dokument 41 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 3, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1321 | 25,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 232 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /service-und-termin/kontakt | 852 | 203 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2546 | 162 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4251 | 109 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4012 | 78 |
| Unattributable | 5063 | 64 |
| /service-und-termin/kontakt | 1959 | 58 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 220 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 5.1 s | n. g. | n. g. |
| max-potential-fid | 200 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 65 KiB | 0 | 64,8 |

