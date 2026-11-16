# Leistung mobil · vorher-devtools

Stand 2026-11-16T14:17:23.325Z · Basis http://localhost:3200 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 3 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), angewandte Drosselung (devtools): Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s, CPU 4-fach. Zeiten und Gewichte gemessen.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 3/3 | 96 (88 bis 98) | 1.207 ms (1.134 bis 1.356) | 1.207 ms (1.134 bis 1.356) | 1.430 ms (1.367 bis 1.584) | 226 ms (147 bis 475) | 0,000 (0,000 bis 0,000) | 518 KB (516 bis 518) | 42 (42 bis 42) | 264 KB (264 bis 264) | 80 KB (80 bis 80) |
| Autoschlüssel (/autoschluessel) | 3/3 | 89 (86 bis 99) | 1.227 ms (1.092 bis 1.294) | 1.227 ms (1.092 bis 1.294) | 1.305 ms (1.162 bis 1.363) | 432 ms (126 bis 548) | 0,000 (0,000 bis 0,000) | 543 KB (543 bis 543) | 40 (40 bis 40) | 264 KB (264 bis 264) | 75 KB (75 bis 75) |
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 3/3 | 93 (93 bis 96) | 1.062 ms (1.037 bis 1.094) | 1.062 ms (1.037 bis 1.094) | 1.121 ms (1.099 bis 1.154) | 305 ms (216 bis 305) | 0,000 (0,000 bis 0,000) | 603 KB (603 bis 603) | 46 (46 bis 46) | 327 KB (327 bis 327) | 55 KB (55 bis 55) |
| Schlüssel nach Code (Liste) (/schluessel-nach-code) | 3/3 | 99 (98 bis 99) | 1.037 ms (1.029 bis 1.057) | 1.037 ms (1.029 bis 1.057) | 1.780 ms (1.776 bis 1.781) | 147 ms (142 bis 163) | 0,000 (0,000 bis 0,000) | 529 KB (529 bis 529) | 45 (45 bis 45) | 271 KB (271 bis 271) | 56 KB (56 bis 56) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 3/3 | 98 (98 bis 98) | 1.004 ms (969 bis 1.012) | 1.004 ms (969 bis 1.012) | 1.093 ms (1.055 bis 1.101) | 161 ms (160 bis 166) | 0,000 (0,000 bis 0,000) | 589 KB (589 bis 589) | 48 (48 bis 48) | 322 KB (322 bis 322) | 53 KB (53 bis 53) |
| Shop (/shop) | 3/3 | 99 (97 bis 99) | 1.024 ms (988 bis 1.129) | 1.024 ms (988 bis 1.129) | 1.123 ms (1.082 bis 1.227) | 139 ms (119 bis 209) | 0,000 (0,000 bis 0,000) | 534 KB (532 bis 534) | 43 (43 bis 43) | 305 KB (305 bis 305) | 52 KB (52 bis 52) |
| Ortsseite Wetzlar (/standorte/wetzlar) | 3/3 | 98 (98 bis 99) | 1.081 ms (1.024 bis 1.169) | 1.081 ms (1.024 bis 1.169) | 1.744 ms (1.683 bis 1.808) | 145 ms (116 bis 179) | 0,000 (0,000 bis 0,000) | 557 KB (557 bis 559) | 47 (47 bis 47) | 306 KB (306 bis 306) | 53 KB (53 bis 53) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 3/3 | 98 (97 bis 99) | 1.093 ms (1.075 bis 1.131) | 1.093 ms (1.075 bis 1.131) | 1.771 ms (1.729 bis 1.799) | 165 ms (95 bis 205) | 0,000 (0,000 bis 0,000) | 567 KB (567 bis 567) | 47 (47 bis 47) | 312 KB (312 bis 312) | 55 KB (55 bis 55) |
| Kontakt (/service-und-termin/kontakt) | 3/3 | 97 (96 bis 99) | 1.071 ms (1.037 bis 1.146) | 1.071 ms (1.037 bis 1.146) | 1.140 ms (1.111 bis 1.220) | 208 ms (124 bis 246) | 0,000 (0,000 bis 0,000) | 559 KB (559 bis 559) | 49 (49 bis 49) | 309 KB (309 bis 309) | 54 KB (54 bis 54) |

## Startseite · /

Medianlauf 1: Leistung 96, LCP 1.207 ms, TBT 226 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (simuliert): Serverantwort 23 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.185 ms
- Hauptthread 3.222 ms; Inline-Skripte im Dokument 20 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 759 | 26,0 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 157 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 56 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| / | 825 | 352 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2566 | 178 |
| / | 2237 | 94 |
| / | 2029 | 86 |
| / | 595 | 69 |
| / | 2350 | 69 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 230 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 26,0 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Autoschlüssel · /autoschluessel

Medianlauf 1: Leistung 89, LCP 1.294 ms, TBT 432 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 59 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.234 ms
- Hauptthread 3.966 ms; Inline-Skripte im Dokument 20 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 857 | 26,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 199 | n. g. | Low |
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
| /autoschluessel | 892 | 383 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2662 | 201 |
| /autoschluessel | 2150 | 171 |
| /autoschluessel | 639 | 116 |
| /autoschluessel | 2541 | 106 |
| /autoschluessel | 2946 | 100 |
| /autoschluessel | 2332 | 82 |
| /autoschluessel | 2459 | 72 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 430 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 200 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 26,1 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 1: Leistung 93, LCP 1.094 ms, TBT 305 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 86 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.008 ms
- Hauptthread 3.313 ms; Inline-Skripte im Dokument 16 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1341 | 25,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 142 | n. g. | Low |
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
| /_next/static/chunks/17_pbdm6y2ffj.js | 2678 | 261 |
| /autoschluessel/anfrage | 882 | 192 |
| /autoschluessel/anfrage | 609 | 107 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4321 | 100 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4513 | 80 |
| /autoschluessel/anfrage | 724 | 66 |
| /autoschluessel/anfrage | 2076 | 61 |
| /_next/static/chunks/135mh5o112fx1.js | 3067 | 54 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 310 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.6 s | n. g. | n. g. |
| max-potential-fid | 260 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 67 KiB | 0 | 66,9 |

## Schlüssel nach Code (Liste) · /schluessel-nach-code

Medianlauf 3: Leistung 99, LCP 1.037 ms, TBT 147 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 19 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.017 ms
- Hauptthread 3.012 ms; Inline-Skripte im Dokument 29 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 950 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 186 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 49 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /schluessel-nach-code | 804 | 210 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2521 | 185 |
| /schluessel-nach-code | 2024 | 62 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 11,8 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 2: Leistung 98, LCP 1.004 ms, TBT 166 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (simuliert): Serverantwort 22 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 982 ms
- Hauptthread 3.117 ms; Inline-Skripte im Dokument 17 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1567 | 25,8 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 153 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/28sat5nz6pa60.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 44 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2556 | 196 |
| /gleichschliessende-zylinder/konfigurator | 844 | 150 |
| /gleichschliessende-zylinder/konfigurator | 622 | 85 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4418 | 69 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.5 s | n. g. | n. g. |
| max-potential-fid | 200 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,3 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,8 |

## Shop · /shop

Medianlauf 1: Leistung 99, LCP 988 ms, TBT 139 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 20 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 968 ms
- Hauptthread 2.596 ms; Inline-Skripte im Dokument 20 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1039 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 144 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 44 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2442 | 189 |
| /shop | 830 | 143 |
| /shop | 593 | 61 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ortsseite Wetzlar · /standorte/wetzlar

Medianlauf 2: Leistung 98, LCP 1.169 ms, TBT 179 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-4 text-display">
- LCP-Phasen (simuliert): Serverantwort 32 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.137 ms
- Hauptthread 3.073 ms; Inline-Skripte im Dokument 24 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 740 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 213 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 51 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2592 | 219 |
| /standorte/wetzlar | 1019 | 126 |
| /standorte/wetzlar | 652 | 97 |
| /standorte/wetzlar | 942 | 75 |
| /_next/static/chunks/262uxxszab7p8.js | 7445 | 60 |
| /standorte/wetzlar | 834 | 56 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 7.5 s | n. g. | n. g. |
| max-potential-fid | 220 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,0 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 1: Leistung 98, LCP 1.093 ms, TBT 165 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 16 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.077 ms
- Hauptthread 3.881 ms; Inline-Skripte im Dokument 23 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 748 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 203 | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 53 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /ratgeber/zylinder-richtig-ausmessen | 859 | 229 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2598 | 185 |
| /ratgeber/zylinder-richtig-ausmessen | 637 | 95 |
| /ratgeber/zylinder-richtig-ausmessen | 2219 | 80 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,0 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Kontakt · /service-und-termin/kontakt

Medianlauf 1: Leistung 97, LCP 1.146 ms, TBT 208 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 47 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.098 ms
- Hauptthread 3.369 ms; Inline-Skripte im Dokument 23 ms
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 1382 | 25,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 165 | n. g. | Low |
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
| /service-und-termin/kontakt | 921 | 216 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2622 | 193 |
| /service-und-termin/kontakt | 638 | 123 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4317 | 87 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4521 | 66 |
| /_next/static/chunks/135mh5o112fx1.js | 2939 | 59 |
| /service-und-termin/kontakt | 2228 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 210 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.6 s | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 65 KiB | 0 | 64,7 |

