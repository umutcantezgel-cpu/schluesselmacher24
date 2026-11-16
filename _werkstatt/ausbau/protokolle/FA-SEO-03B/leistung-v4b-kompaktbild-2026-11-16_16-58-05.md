# Leistung mobil · v4b-kompaktbild

Stand 2026-11-16T16:00:03.399Z · Basis http://localhost:3300 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 5 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 5/5 | 90 (81 bis 97) | 1.394 ms (1.367 bis 1.418) | 2.918 ms (2.144 bis 3.684) | 1.394 ms (1.367 bis 1.418) | 212 ms (138 bis 373) | 0,000 (0,000 bis 0,000) | 378 KB (378 bis 378) | 23 (23 bis 23) | 230 KB (230 bis 230) | 53 KB (53 bis 53) |
| Kontakt (/service-und-termin/kontakt) | 5/5 | 92 (90 bis 93) | 1.054 ms (1.007 bis 1.367) | 2.678 ms (1.623 bis 3.050) | 1.054 ms (1.007 bis 1.367) | 257 ms (128 bis 412) | 0,000 (0,000 bis 0,000) | 400 KB (398 bis 400) | 29 (29 bis 29) | 246 KB (246 bis 246) | 54 KB (54 bis 54) |
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 5/5 | 85 (82 bis 92) | 1.661 ms (1.055 bis 1.661) | 4.074 ms (1.386 bis 4.150) | 1.661 ms (1.055 bis 1.661) | 199 ms (98 bis 362) | 0,000 (0,000 bis 0,000) | 450 KB (450 bis 450) | 28 (28 bis 28) | 268 KB (268 bis 268) | 55 KB (55 bis 55) |

## Vergleich mit der Vorher-Messung (Median)

| Ansicht | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|
| /gleichschliessende-zylinder/konfigurator | 90 → 90 | 1.364 → 1.394 | 2.807 → 2.918 | 1.364 → 1.394 | 233 → 212 | 0,000 → 0,000 | 399 → 378 | 25 → 23 | 251 → 230 | 53 → 53 |
| /service-und-termin/kontakt | 88 → 92 | 1.352 → 1.054 | 3.420 → 2.678 | 1.352 → 1.054 | 156 → 257 | 0,000 → 0,000 | 397 → 400 | 28 → 29 | 244 → 246 | 54 → 54 |
| /autoschluessel/anfrage | 85 → 85 | 1.059 → 1.661 | 3.086 → 4.074 | 1.059 → 1.661 | 412 → 199 | 0,000 → 0,000 | 449 → 450 | 28 → 28 | 268 → 268 | 55 → 55 |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 5: Leistung 90, LCP 3.397 ms, TBT 156 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (simuliert): Serverantwort 459 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.938 ms
- Hauptthread 1.997 ms; Inline-Skripte im Dokument 25 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 386 | 27,2 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/1rh4hj1oioj_w.js | 16,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0vrd4f7pg1ssn.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/18eu7sjs38rex.js | 7,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /gleichschliessende-zylinder/konfigurator | 1174 | 236 |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 3484 | 235 |
| /gleichschliessende-zylinder/konfigurator | 1085 | 89 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3830 | 80 |
| /gleichschliessende-zylinder/konfigurator | 1022 | 63 |
| /gleichschliessende-zylinder/konfigurator | 920 | 60 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3719 | 58 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3777 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 27 KiB | 200 | 27,2 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.4 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 240 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,4 |

## Kontakt · /service-und-termin/kontakt

Medianlauf 4: Leistung 92, LCP 3.050 ms, TBT 173 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 458 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.592 ms
- Hauptthread 2.102 ms; Inline-Skripte im Dokument 20 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 572 | 25,0 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 29 | n. g. | Low |
| /_next/static/chunks/3p2u6w5r2lpxo.js | 12,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3h-rhkge30xey.js | 10,3 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/08kzi41pf4db3.js | 8,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 3633 | 192 |
| /service-und-termin/kontakt | 1120 | 153 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3870 | 89 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4012 | 69 |
| /service-und-termin/kontakt | 1054 | 66 |
| /service-und-termin/kontakt | 911 | 60 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3959 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 3.0 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.0 s | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 65 KiB | 0 | 64,8 |
| unused-javascript | Est savings of 25 KiB | 0 | 25,0 |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 4: Leistung 85, LCP 4.074 ms, TBT 153 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.618 ms
- Hauptthread 1.477 ms; Inline-Skripte im Dokument 15 ms
- Attrappen (G5) in 5 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 5, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 464 | 25,8 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2vp65sl4uu2-v.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0cs01p471-gad.js | 17,8 | n. g. | n. g. | Low |
| /_next/static/chunks/3p2u6w5r2lpxo.js | 12,5 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wx8fi31viacl.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/2civquoqf2nf9.js | 10,5 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /autoschluessel/anfrage | 1029 | 178 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3928 | 157 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4127 | 93 |
| /autoschluessel/anfrage | 942 | 87 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4261 | 55 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 26 KiB | 430 | 25,8 |
| legacy-javascript | Est savings of 13 KiB | 300 | 13,4 |
| largest-contentful-paint | 4.1 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.3 s | n. g. | n. g. |

