# Leistung mobil · nachher

Stand 2026-11-16T17:48:58.468Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 89 (77 bis 91) | 1.078 ms (1.029 bis 1.669) | 3.179 ms (2.048 bis 3.703) | 1.078 ms (1.029 bis 1.669) | 337 ms (131 bis 511) | 0,000 (0,000 bis 0,000) | 453 KB (453 bis 453) | 30 (30 bis 30) | 271 KB (271 bis 271) | 55 KB (55 bis 55) |
| Kontakt (/service-und-termin/kontakt) | 5/5 | 82 (74 bis 87) | 1.076 ms (997 bis 1.360) | 3.079 ms (2.797 bis 3.595) | 1.113 ms (1.025 bis 1.360) | 467 ms (316 bis 652) | 0,000 (0,000 bis 0,000) | 398 KB (398 bis 399) | 29 (29 bis 29) | 246 KB (246 bis 246) | 54 KB (54 bis 54) |
| Autoschlüssel (/autoschluessel) | 5/5 | 90 (87 bis 92) | 1.808 ms (1.157 bis 1.823) | 3.034 ms (2.604 bis 3.173) | 1.808 ms (1.157 bis 1.823) | 186 ms (98 bis 386) | 0,000 (0,000 bis 0,000) | 398 KB (398 bis 398) | 22 (22 bis 22) | 196 KB (196 bis 196) | 75 KB (75 bis 75) |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 5: Leistung 89, LCP 2.685 ms, TBT 337 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 458 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.227 ms
- Hauptthread 2.073 ms; Inline-Skripte im Dokument 23 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 557 | 25,5 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | n. g. | n. g. | Low |
| /_next/static/chunks/2u38_h0eujdq9.js | 19,0 | n. g. | n. g. | Low |
| /_next/static/chunks/30wv8bcorv0oy.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/2yqrsgnswhvfg.js | 11,8 | n. g. | n. g. | Low |
| /_next/static/chunks/2k2wywpxlr4wk.js | 11,8 | n. g. | n. g. | Low |
| /_next/static/chunks/0mm217a2dyy_h.js | 10,7 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/03dvva7miuj_h.js | 9,6 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel/anfrage | 1174 | 169 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3791 | 166 |
| /autoschluessel/anfrage | 1343 | 100 |
| Unattributable | 910 | 96 |
| /autoschluessel/anfrage | 1006 | 92 |
| /autoschluessel/anfrage | 1098 | 76 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4019 | 75 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3957 | 62 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 2.7 s | n. g. | n. g. |
| total-blocking-time | 340 ms | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.1 s | n. g. | n. g. |
| max-potential-fid | 170 ms | n. g. | n. g. |

## Kontakt · /service-und-termin/kontakt

Medianlauf 1: Leistung 82, LCP 2.797 ms, TBT 519 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.343 ms
- Hauptthread 2.569 ms; Inline-Skripte im Dokument 166 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 686 | 25,0 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | 32 | n. g. | Low |
| /_next/static/chunks/16wxkwqb7uyly.js | 14,8 | n. g. | n. g. | Low |
| /_next/static/chunks/2yqrsgnswhvfg.js | 11,8 | n. g. | n. g. | Low |
| /_next/static/chunks/2k2wywpxlr4wk.js | 11,8 | n. g. | n. g. | Low |
| /_next/static/chunks/0mm217a2dyy_h.js | 10,7 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 3618 | 274 |
| /service-und-termin/kontakt | 1395 | 165 |
| /service-und-termin/kontakt | 1113 | 120 |
| /service-und-termin/kontakt | 1284 | 111 |
| /service-und-termin/kontakt | 1560 | 88 |
| /service-und-termin/kontakt | 1040 | 73 |
| Unattributable | 968 | 72 |
| /service-und-termin/kontakt | 1684 | 66 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 2.8 s | n. g. | n. g. |
| total-blocking-time | 520 ms | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 3.9 s | n. g. | n. g. |
| max-potential-fid | 270 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 65 KiB | 0 | 64,8 |

## Autoschlüssel · /autoschluessel

Medianlauf 1: Leistung 90, LCP 3.173 ms, TBT 166 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 458 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.715 ms
- Hauptthread 2.781 ms; Inline-Skripte im Dokument 44 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 626 | 27,5 | Low |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 | n. g. | n. g. | Low |
| /_next/static/chunks/2yqrsgnswhvfg.js | 11,8 | n. g. | n. g. | Low |
| /_next/static/chunks/0mm217a2dyy_h.js | 10,7 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel | 1295 | 192 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3638 | 176 |
| /autoschluessel | 1188 | 107 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3879 | 86 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3814 | 65 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3965 | 63 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| first-contentful-paint | 1.8 s | n. g. | n. g. |
| largest-contentful-paint | 3.2 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.0 s | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-javascript | Est savings of 28 KiB | 0 | 27,5 |

