# Leistung mobil · v1-ohne-inlinecss

Stand 2026-11-16T15:47:40.976Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 5/5 | 94 (87 bis 96) | 1.236 ms (1.076 bis 1.536) | 2.747 ms (2.088 bis 2.809) | 1.281 ms (1.236 bis 1.536) | 169 ms (47 bis 479) | 0,000 (0,000 bis 0,000) | 352 KB (352 bis 352) | 21 (21 bis 21) | 192 KB (192 bis 192) | 48 KB (48 bis 48) |
| Autoschlüssel (/autoschluessel) | 5/5 | 87 (80 bis 91) | 1.064 ms (1.060 bis 1.211) | 2.621 ms (2.458 bis 2.933) | 1.103 ms (1.064 bis 1.211) | 386 ms (295 bis 607) | 0,000 (0,000 bis 0,000) | 383 KB (383 bis 383) | 23 (23 bis 23) | 196 KB (196 bis 196) | 44 KB (44 bis 44) |
| Shop (/shop) | 5/5 | 96 (92 bis 97) | 924 ms (914 bis 1.371) | 2.748 ms (1.869 bis 3.026) | 924 ms (914 bis 1.371) | 118 ms (79 bis 186) | 0,000 (0,000 bis 0,000) | 312 KB (312 bis 312) | 21 (21 bis 21) | 196 KB (196 bis 196) | 20 KB (20 bis 20) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 5/5 | 95 (93 bis 97) | 1.362 ms (906 bis 1.364) | 2.896 ms (2.590 bis 3.213) | 1.362 ms (935 bis 1.364) | 57 ms (51 bis 116) | 0,000 (0,000 bis 0,000) | 326 KB (326 bis 326) | 21 (21 bis 21) | 191 KB (191 bis 191) | 23 KB (23 bis 23) |

## Vergleich mit der Vorher-Messung (Median)

| Ansicht | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|
| / | 93 → 94 | 1.515 → 1.236 | 3.062 → 2.747 | 1.515 → 1.281 | 119 → 169 | 0,000 → 0,000 | 368 → 352 | 20 → 21 | 192 → 192 | 80 → 48 |
| /autoschluessel | 88 → 87 | 1.809 → 1.064 | 3.746 → 2.621 | 1.809 → 1.103 | 143 → 386 | 0,000 → 0,000 | 398 → 383 | 22 → 23 | 196 → 196 | 75 → 44 |
| /shop | 90 → 96 | 1.363 → 924 | 3.626 → 2.748 | 1.363 → 924 | 58 → 118 | 0,000 → 0,000 | 393 → 312 | 25 → 21 | 261 → 196 | 52 → 20 |
| /ratgeber/zylinder-richtig-ausmessen | 92 → 95 | 1.357 → 1.362 | 3.339 → 2.896 | 1.357 → 1.362 | 108 → 57 | 0,000 → 0,000 | 341 → 326 | 20 → 21 | 191 → 191 | 55 → 23 |

## Startseite · /

Medianlauf 1: Leistung 94, LCP 2.783 ms, TBT 169 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (simuliert): Serverantwort 462 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.321 ms
- Hauptthread 3.144 ms; Inline-Skripte im Dokument 24 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 162 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 344 | 27,4 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 138 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/36_03ed5otp0s.js | 8,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| / | 1060 | 305 |
| /_next/static/chunks/262uxxszab7p8.js | 3336 | 154 |
| / | 1425 | 70 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3605 | 61 |
| / | 1365 | 60 |
| / | 955 | 57 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3666 | 53 |
| / | 1516 | 51 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 260 ms | 258 | n. g. |
| unused-javascript | Est savings of 27 KiB | 150 | 27,4 |
| largest-contentful-paint | 2.8 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| render-blocking-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 310 ms | n. g. | n. g. |

## Autoschlüssel · /autoschluessel

Medianlauf 2: Leistung 87, LCP 2.933 ms, TBT 353 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 454 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.480 ms
- Hauptthread 2.883 ms; Inline-Skripte im Dokument 27 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 154 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 340 | 27,5 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | 242 | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel | 1168 | 283 |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 3611 | 254 |
| /autoschluessel | 1032 | 71 |
| Unattributable | 967 | 65 |
| Unattributable | 904 | 58 |
| /autoschluessel | 1113 | 55 |
| /autoschluessel | 1451 | 51 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 220 ms | 221 | n. g. |
| unused-javascript | Est savings of 27 KiB | 150 | 27,5 |
| largest-contentful-paint | 2.9 s | n. g. | n. g. |
| total-blocking-time | 350 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |

## Shop · /shop

Medianlauf 2: Leistung 96, LCP 2.470 ms, TBT 118 ms.

- LCP-Element: li#schluessel-nach-code > div.grid > div.min-w-0 > p.mt-1 · <p class="mt-1 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.013 ms
- Hauptthread 1.726 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 156 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 373 | 27,6 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | 1 | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | 1 | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /shop | 817 | 204 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3169 | 170 |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 2426 | 100 |
| /shop | 1021 | 54 |
| /shop | 761 | 52 |
| /_next/static/chunks/421c_el12128q.js | 1733 | 50 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| render-blocking-resources | Est savings of 550 ms | 552 | n. g. |
| unused-css-rules | Est savings of 13 KiB | 150 | 13,0 |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| render-blocking-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 170 ms | n. g. | n. g. |
| unused-javascript | Est savings of 28 KiB | 0 | 27,6 |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 2: Leistung 95, LCP 2.900 ms, TBT 57 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 453 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.447 ms
- Hauptthread 1.893 ms; Inline-Skripte im Dokument 20 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: /_next/static/chunks/3iq67cvybq20_.css (16,5 KB, 153 ms)

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 362 | 27,6 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/11b5gult0wfrr.js | 7,2 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 3159 | 164 |
| /ratgeber/zylinder-richtig-ausmessen | 787 | 159 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 28 KiB | 300 | 27,6 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| render-blocking-resources | Est savings of 120 ms | 119 | n. g. |
| largest-contentful-paint | 2.9 s | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| render-blocking-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 160 ms | n. g. | n. g. |

