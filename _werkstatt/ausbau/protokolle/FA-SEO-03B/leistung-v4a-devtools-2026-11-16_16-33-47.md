# Leistung mobil · v4a-devtools

Stand 2026-11-16T15:42:44.117Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), angewandte Drosselung (devtools): Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s, CPU 4-fach. Zeiten und Gewichte gemessen.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 5/5 | 97 (93 bis 97) | 1.214 ms (1.159 bis 1.440) | 1.214 ms (1.159 bis 1.440) | 1.445 ms (1.384 bis 1.667) | 203 ms (188 bis 294) | 0,000 (0,000 bis 0,000) | 516 KB (516 bis 518) | 42 (42 bis 42) | 264 KB (264 bis 264) | 80 KB (80 bis 80) |
| Autoschlüssel (/autoschluessel) | 5/5 | 93 (86 bis 97) | 1.156 ms (1.121 bis 1.201) | 1.156 ms (1.121 bis 1.201) | 1.233 ms (1.192 bis 1.286) | 313 ms (210 bis 535) | 0,000 (0,000 bis 0,000) | 543 KB (543 bis 544) | 40 (40 bis 40) | 264 KB (264 bis 264) | 75 KB (75 bis 75) |
| Shop (/shop) | 5/5 | 99 (97 bis 99) | 1.020 ms (982 bis 1.069) | 1.020 ms (982 bis 1.069) | 1.114 ms (1.076 bis 1.172) | 138 ms (136 bis 192) | 0,000 (0,000 bis 0,000) | 493 KB (491 bis 493) | 40 (40 bis 40) | 264 KB (264 bis 264) | 52 KB (52 bis 52) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 5/5 | 96 (92 bis 99) | 1.113 ms (1.069 bis 1.176) | 1.113 ms (1.069 bis 1.176) | 1.770 ms (1.745 bis 1.837) | 225 ms (115 bis 339) | 0,000 (0,000 bis 0,000) | 526 KB (525 bis 526) | 44 (44 bis 44) | 271 KB (271 bis 271) | 55 KB (55 bis 55) |

## Startseite · /

Medianlauf 4: Leistung 97, LCP 1.159 ms, TBT 189 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (gemessen): Serverantwort 23 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.136 ms
- Hauptthread 3.354 ms; Inline-Skripte im Dokument 20 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 724 | 26,0 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 143 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 42 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| / | 824 | 314 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2560 | 188 |
| / | 2363 | 74 |
| / | 2259 | 70 |
| / | 604 | 68 |
| / | 2065 | 58 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 26,0 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |
| dom-size | 1,159 elements | n. g. | n. g. |

## Autoschlüssel · /autoschluessel

Medianlauf 2: Leistung 93, LCP 1.121 ms, TBT 313 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 21 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.101 ms
- Hauptthread 3.335 ms; Inline-Skripte im Dokument 23 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 952 | 25,8 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 126 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 55 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel | 821 | 287 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2537 | 231 |
| /autoschluessel | 2011 | 95 |
| /autoschluessel | 2777 | 81 |
| /autoschluessel | 2375 | 74 |
| /autoschluessel | 2230 | 68 |
| /autoschluessel | 2465 | 65 |
| /autoschluessel | 596 | 64 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 310 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 230 ms | n. g. | n. g. |
| unused-javascript | Est savings of 26 KiB | 0 | 25,8 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Shop · /shop

Medianlauf 5: Leistung 99, LCP 1.002 ms, TBT 137 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 16 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 986 ms
- Hauptthread 2.283 ms; Inline-Skripte im Dokument 23 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 823 | 26,0 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 154 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 2479 | 187 |
| /shop | 840 | 141 |
| /shop | 630 | 74 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 26,0 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 4: Leistung 96, LCP 1.176 ms, TBT 225 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 29 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.147 ms
- Hauptthread 3.967 ms; Inline-Skripte im Dokument 31 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 845 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 272 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /ratgeber/zylinder-richtig-ausmessen | 834 | 311 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 2537 | 270 |
| /ratgeber/zylinder-richtig-ausmessen | 1981 | 55 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| total-blocking-time | 230 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 270 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| unused-javascript | Est savings of 26 KiB | 0 | 25,9 |

