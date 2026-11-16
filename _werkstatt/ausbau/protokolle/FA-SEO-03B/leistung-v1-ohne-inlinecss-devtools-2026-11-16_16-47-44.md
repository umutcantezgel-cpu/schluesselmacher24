# Leistung mobil · v1-ohne-inlinecss-devtools

Stand 2026-11-16T15:56:37.138Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), angewandte Drosselung (devtools): Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s, CPU 4-fach. Zeiten und Gewichte gemessen.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 5/5 | 95 (86 bis 96) | 1.861 ms (1.812 bis 1.919) | 1.861 ms (1.812 bis 1.919) | 2.061 ms (2.007 bis 2.113) | 193 ms (152 bis 469) | 0,000 (0,000 bis 0,000) | 486 KB (486 bis 487) | 43 (43 bis 43) | 264 KB (264 bis 264) | 48 KB (48 bis 48) |
| Autoschlüssel (/autoschluessel) | 5/5 | 94 (93 bis 96) | 1.831 ms (1.765 bis 1.838) | 1.831 ms (1.765 bis 1.838) | 1.880 ms (1.808 bis 1.888) | 254 ms (197 bis 258) | 0,000 (0,000 bis 0,000) | 512 KB (512 bis 514) | 41 (41 bis 41) | 264 KB (264 bis 264) | 44 KB (44 bis 44) |
| Shop (/shop) | 5/5 | 97 (97 bis 98) | 1.696 ms (1.664 bis 1.840) | 1.696 ms (1.664 bis 1.840) | 1.741 ms (1.709 bis 1.885) | 147 ms (122 bis 153) | 0,000 (0,000 bis 0,000) | 461 KB (461 bis 462) | 41 (41 bis 41) | 264 KB (264 bis 264) | 20 KB (20 bis 20) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 5/5 | 96 (94 bis 97) | 1.774 ms (1.693 bis 1.862) | 1.774 ms (1.693 bis 1.862) | 2.341 ms (2.265 bis 2.437) | 171 ms (148 bis 249) | 0,000 (0,000 bis 0,000) | 496 KB (496 bis 496) | 45 (45 bis 45) | 271 KB (271 bis 271) | 23 KB (23 bis 23) |

## Vergleich mit der Vorher-Messung (Median)

| Ansicht | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|
| / | 97 → 95 | 1.214 → 1.861 | 1.214 → 1.861 | 1.445 → 2.061 | 203 → 193 | 0,000 → 0,000 | 516 → 486 | 42 → 43 | 264 → 264 | 80 → 48 |
| /autoschluessel | 93 → 94 | 1.156 → 1.831 | 1.156 → 1.831 | 1.233 → 1.880 | 313 → 254 | 0,000 → 0,000 | 543 → 512 | 40 → 41 | 264 → 264 | 75 → 44 |
| /shop | 99 → 97 | 1.020 → 1.696 | 1.020 → 1.696 | 1.114 → 1.741 | 138 → 147 | 0,000 → 0,000 | 493 → 461 | 40 → 41 | 264 → 264 | 52 → 20 |
| /ratgeber/zylinder-richtig-ausmessen | 96 → 96 | 1.113 → 1.774 | 1.113 → 1.774 | 1.770 → 2.341 | 225 → 171 | 0,000 → 0,000 | 526 → 496 | 44 → 45 | 271 → 271 | 55 → 23 |

## Startseite · /

Medianlauf 3: Leistung 95, LCP 1.854 ms, TBT 193 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (gemessen): Serverantwort 25 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.829 ms
- Hauptthread 2.750 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 725 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 613 | 25,7 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 141 | n. g. | Low |
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
| / | 1530 | 299 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3160 | 194 |
| / | 617 | 80 |
| / | 1855 | 77 |
| / | 2921 | 62 |
| / | 3045 | 60 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 630 ms | 632 | n. g. |
| unused-css-rules | Est savings of 12 KiB | 150 | 11,9 |
| first-contentful-paint | 1.9 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| render-blocking-insight | n. g. | n. g. | n. g. |

## Autoschlüssel · /autoschluessel

Medianlauf 4: Leistung 94, LCP 1.831 ms, TBT 254 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 25 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.806 ms
- Hauptthread 2.968 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 725 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 833 | 26,1 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 118 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 43 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel | 1537 | 285 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3185 | 210 |
| /autoschluessel | 1864 | 88 |
| /autoschluessel | 599 | 83 |
| /autoschluessel | 3402 | 76 |
| /autoschluessel | 3104 | 69 |
| /autoschluessel | 2855 | 60 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 630 ms | 628 | n. g. |
| unused-css-rules | Est savings of 12 KiB | 150 | 11,9 |
| first-contentful-paint | 1.8 s | n. g. | n. g. |
| total-blocking-time | 250 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |

## Shop · /shop

Medianlauf 4: Leistung 97, LCP 1.830 ms, TBT 153 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 25 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.806 ms
- Hauptthread 2.089 ms; Inline-Skripte im Dokument 22 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 724 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 540 | 26,0 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 130 | n. g. | Low |
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
| /shop | 1573 | 217 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3197 | 203 |
| /shop | 626 | 104 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 610 ms | 612 | n. g. |
| unused-css-rules | Est savings of 13 KiB | 150 | 13,0 |
| first-contentful-paint | 1.8 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| render-blocking-insight | n. g. | n. g. | n. g. |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 2: Leistung 96, LCP 1.834 ms, TBT 167 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (gemessen): Serverantwort 27 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 1.807 ms
- Hauptthread 3.234 ms; Inline-Skripte im Dokument 23 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 726 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 604 | 25,9 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 181 | n. g. | Low |
| /_next/static/chunks/0h4zbq4bysnqe.js | 14,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2n-1tod57fvxj.js | 13,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | 47 | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /ratgeber/zylinder-richtig-ausmessen | 1566 | 248 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3204 | 217 |
| /ratgeber/zylinder-richtig-ausmessen | 645 | 112 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 610 ms | 608 | n. g. |
| unused-css-rules | Est savings of 12 KiB | 150 | 12,5 |
| first-contentful-paint | 1.8 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| render-blocking-insight | n. g. | n. g. | n. g. |

