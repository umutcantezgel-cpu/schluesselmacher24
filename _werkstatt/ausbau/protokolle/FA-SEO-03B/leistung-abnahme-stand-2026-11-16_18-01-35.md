# Leistung mobil · abnahme-stand

Stand 2026-11-16T17:04:51.782Z · Basis http://localhost:3200 · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 3 Läufe je Ansicht, Median

Maßstab: Lighthouse-Standardprofil mobil (412 × 823, DPR 1.75, mobile), simulierte Drosselung: Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.

## Übersicht (Median, Spanne)

| Ansicht | Läufe | Leistung | FCP | LCP | Speed Index | TBT | CLS | Gewicht | Dateien | JS | HTML |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 3/3 | 95 (90 bis 95) | 1.510 ms (1.506 bis 1.514) | 2.766 ms (2.757 bis 3.499) | 1.510 ms (1.506 bis 1.514) | 117 ms (113 bis 117) | 0,000 (0,000 bis 0,000) | 368 KB (368 bis 368) | 20 (20 bis 20) | 192 KB (192 bis 192) | 80 KB (80 bis 80) |
| Autoschlüssel (/autoschluessel) | 3/3 | 91 (91 bis 91) | 1.810 ms (1.808 bis 1.820) | 3.180 ms (3.163 bis 3.314) | 1.810 ms (1.808 bis 1.820) | 111 ms (85 bis 133) | 0,000 (0,000 bis 0,000) | 398 KB (398 bis 398) | 22 (22 bis 22) | 196 KB (196 bis 196) | 75 KB (75 bis 75) |
| Assistent Autoschlüssel (/autoschluessel/anfrage) | 3/3 | 88 (86 bis 90) | 1.063 ms (1.005 bis 1.656) | 3.353 ms (2.724 bis 3.466) | 1.063 ms (1.005 bis 1.656) | 241 ms (100 bis 430) | 0,000 (0,000 bis 0,000) | 464 KB (464 bis 464) | 29 (29 bis 29) | 282 KB (282 bis 282) | 55 KB (55 bis 55) |
| Schlüssel nach Code (Liste) (/schluessel-nach-code) | 3/3 | 92 (92 bis 96) | 1.357 ms (1.355 bis 1.360) | 3.358 ms (2.749 bis 3.367) | 1.357 ms (1.355 bis 1.360) | 63 ms (45 bis 63) | 0,000 (0,000 bis 0,000) | 364 KB (364 bis 365) | 25 (25 bis 25) | 209 KB (209 bis 209) | 56 KB (56 bis 56) |
| Konfigurator Sperrschließung (/gleichschliessende-zylinder/konfigurator) | 3/3 | 87 (87 bis 90) | 1.361 ms (1.355 bis 1.363) | 3.849 ms (3.512 bis 3.877) | 1.361 ms (1.355 bis 1.363) | 126 ms (62 bis 153) | 0,000 (0,000 bis 0,000) | 426 KB (426 bis 426) | 27 (27 bis 27) | 277 KB (277 bis 277) | 53 KB (53 bis 53) |
| Shop (/shop) | 3/3 | 90 (89 bis 95) | 1.355 ms (1.355 bis 1.357) | 3.592 ms (2.898 bis 3.604) | 1.355 ms (1.355 bis 1.357) | 86 ms (43 bis 94) | 0,000 (0,000 bis 0,000) | 393 KB (393 bis 393) | 25 (25 bis 25) | 261 KB (261 bis 261) | 52 KB (52 bis 52) |
| Ortsseite Wetzlar (/standorte/wetzlar) | 3/3 | 96 (93 bis 96) | 1.362 ms (1.358 bis 1.363) | 2.759 ms (2.749 bis 3.195) | 1.362 ms (1.358 bis 1.363) | 60 ms (44 bis 63) | 0,000 (0,000 bis 0,000) | 338 KB (338 bis 339) | 22 (22 bis 22) | 185 KB (185 bis 185) | 54 KB (54 bis 54) |
| Ratgeber Zylinder messen (/ratgeber/zylinder-richtig-ausmessen) | 3/3 | 90 (90 bis 91) | 1.361 ms (1.360 bis 1.363) | 3.366 ms (3.344 bis 3.391) | 1.361 ms (1.360 bis 1.363) | 134 ms (118 bis 140) | 0,000 (0,000 bis 0,000) | 341 KB (341 bis 341) | 20 (20 bis 20) | 191 KB (191 bis 191) | 55 KB (55 bis 55) |
| Kontakt (/service-und-termin/kontakt) | 3/3 | 88 (87 bis 88) | 1.361 ms (1.359 bis 1.363) | 3.856 ms (3.833 bis 3.862) | 1.361 ms (1.359 bis 1.363) | 88 ms (77 bis 108) | 0,000 (0,000 bis 0,000) | 417 KB (416 bis 417) | 30 (30 bis 30) | 264 KB (264 bis 264) | 54 KB (54 bis 54) |

## Startseite · /

Medianlauf 2: Leistung 95, LCP 2.757 ms, TBT 117 ms.

- LCP-Element: section.border-b > div.shell > div.xl:col-span-12 > h1#hub-frage · <h1 id="hub-frage" class="text-display font-bold text-foreground">
- LCP-Phasen (simuliert): Serverantwort 455 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.302 ms
- Hauptthread 1.957 ms; Inline-Skripte im Dokument 18 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 374 | 27,4 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
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
| /_next/static/chunks/17_pbdm6y2ffj.js | 3320 | 167 |
| / | 1335 | 141 |
| / | 1183 | 92 |
| / | 1275 | 60 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| largest-contentful-paint | 2.8 s | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 170 ms | n. g. | n. g. |
| unused-javascript | Est savings of 27 KiB | 0 | 27,4 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |
| dom-size | 1,159 elements | n. g. | n. g. |
| largest-contentful-paint-element | 2,760 ms | n. g. | n. g. |

## Autoschlüssel · /autoschluessel

Medianlauf 1: Leistung 91, LCP 3.180 ms, TBT 133 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 460 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.720 ms
- Hauptthread 2.197 ms; Inline-Skripte im Dokument 17 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 466 | 27,5 | Low |
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
| /_next/static/chunks/17_pbdm6y2ffj.js | 3650 | 187 |
| /autoschluessel | 1384 | 164 |
| /autoschluessel | 1277 | 107 |
| /autoschluessel | 1211 | 66 |
| Unattributable | 1063 | 65 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3885 | 63 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| first-contentful-paint | 1.8 s | n. g. | n. g. |
| largest-contentful-paint | 3.2 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 3.9 s | n. g. | n. g. |
| max-potential-fid | 190 ms | n. g. | n. g. |
| unused-javascript | Est savings of 28 KiB | 0 | 27,5 |

## Assistent Autoschlüssel · /autoschluessel/anfrage

Medianlauf 1: Leistung 88, LCP 3.353 ms, TBT 241 ms.

- LCP-Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 · <p class="mt-2 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.896 ms
- Hauptthread 1.445 ms; Inline-Skripte im Dokument 16 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 3, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 274 | 25,8 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 191 | n. g. | Low |
| /_next/static/chunks/0g8b7kk9gj5l3.js | 18,2 | n. g. | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
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
| /_next/static/chunks/262uxxszab7p8.js | 3932 | 204 |
| /autoschluessel/anfrage | 1092 | 129 |
| /autoschluessel/anfrage | 992 | 100 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4136 | 78 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 26 KiB | 180 | 25,8 |
| legacy-javascript | Est savings of 13 KiB | 180 | 13,4 |
| largest-contentful-paint | 3.4 s | n. g. | n. g. |
| total-blocking-time | 240 ms | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.2 s | n. g. | n. g. |
| max-potential-fid | 200 ms | n. g. | n. g. |

## Schlüssel nach Code (Liste) · /schluessel-nach-code

Medianlauf 1: Leistung 92, LCP 3.367 ms, TBT 63 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 452 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.915 ms
- Hauptthread 1.881 ms; Inline-Skripte im Dokument 14 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 364 | 27,6 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 45 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/14_1ov1da-zha.js | 8,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3qo-zq_mhhz18.js | 6,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /schluessel-nach-code | 1066 | 217 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3459 | 175 |
| /schluessel-nach-code | 997 | 69 |
| /schluessel-nach-code | 1283 | 69 |
| Unattributable | 905 | 60 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 28 KiB | 300 | 27,6 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.4 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |

## Konfigurator Sperrschließung · /gleichschliessende-zylinder/konfigurator

Medianlauf 2: Leistung 87, LCP 3.877 ms, TBT 126 ms.

- LCP-Element: div.shell > div.grid > div > h1.text-balance · <h1 class="text-balance font-bold text-foreground focus:outline-none mt-3 text-headli…">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.421 ms
- Hauptthread 1.289 ms; Inline-Skripte im Dokument 15 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 479 | 27,0 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3te1wmrqx50i3.js | 12,4 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 3772 | 227 |
| /gleichschliessende-zylinder/konfigurator | 1042 | 125 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 4040 | 71 |
| /gleichschliessende-zylinder/konfigurator | 982 | 60 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 27 KiB | 250 | 27,0 |
| legacy-javascript | Est savings of 13 KiB | 240 | 13,4 |
| largest-contentful-paint | 3.9 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.0 s | n. g. | n. g. |
| max-potential-fid | 230 ms | n. g. | n. g. |

## Shop · /shop

Medianlauf 2: Leistung 90, LCP 3.592 ms, TBT 43 ms.

- LCP-Element: li#schluessel-nach-code > div.grid > div.min-w-0 > p.mt-1 · <p class="mt-1 max-w-measure text-body text-foreground-muted">
- LCP-Phasen (simuliert): Serverantwort 452 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.140 ms
- Hauptthread 1.267 ms; Inline-Skripte im Dokument 15 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 262 | 27,5 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /shop | 1092 | 197 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3607 | 135 |
| Unattributable | 903 | 92 |
| /shop | 995 | 52 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 28 KiB | 430 | 27,5 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.6 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 140 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |

## Ortsseite Wetzlar · /standorte/wetzlar

Medianlauf 3: Leistung 96, LCP 2.749 ms, TBT 63 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 454 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.295 ms
- Hauptthread 1.563 ms; Inline-Skripte im Dokument 45 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 222 | 27,6 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | 194 | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3nsh1jo227gxn.js | 6,2 | n. g. | n. g. | Low |
| /_next/static/chunks/0i8woupcm8y6x.js | 6,0 | n. g. | n. g. | Low |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 | n. g. | n. g. | Low |
| /_next/static/chunks/421c_el12128q.js | 4,4 | n. g. | n. g. | Low |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 | n. g. | n. g. | Low |
| /_next/static/chunks/135mh5o112fx1.js | 1,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /_next/static/chunks/262uxxszab7p8.js | 3316 | 176 |
| /standorte/wetzlar | 1107 | 136 |
| /standorte/wetzlar | 1040 | 67 |
| /standorte/wetzlar | 1243 | 64 |
| Unattributable | 906 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 28 KiB | 150 | 27,6 |
| largest-contentful-paint | 2.7 s | n. g. | n. g. |
| forced-reflow-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,0 |
| legacy-javascript | Est savings of 13 KiB | 0 | 13,4 |

## Ratgeber Zylinder messen · /ratgeber/zylinder-richtig-ausmessen

Medianlauf 1: Leistung 90, LCP 3.391 ms, TBT 134 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 457 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 2.934 ms
- Hauptthread 2.120 ms; Inline-Skripte im Dokument 29 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 405 | 27,6 | Low |
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
| /_next/static/chunks/17_pbdm6y2ffj.js | 3176 | 181 |
| /ratgeber/zylinder-richtig-ausmessen | 1081 | 158 |
| Unattributable | 909 | 93 |
| /ratgeber/zylinder-richtig-ausmessen | 1239 | 89 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3357 | 53 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 28 KiB | 300 | 27,6 |
| legacy-javascript | Est savings of 13 KiB | 150 | 13,4 |
| largest-contentful-paint | 3.4 s | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |
| unused-css-rules | Est savings of 12 KiB | 0 | 12,1 |
| mainthread-work-breakdown | 2.1 s | n. g. | n. g. |

## Kontakt · /service-und-termin/kontakt

Medianlauf 2: Leistung 88, LCP 3.833 ms, TBT 77 ms.

- LCP-Element: div.shell > div.grid > div.lg:col-span-8 > p.mt-4 · <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- LCP-Phasen (simuliert): Serverantwort 456 ms, Ladeverzögerung 0 ms, Ladedauer 0 ms, Darstellungsverzögerung 3.377 ms
- Hauptthread 1.650 ms; Inline-Skripte im Dokument 14 ms
- Attrappen (G5) in 3 Läufen: fremd 0, upload 0, action-schreibend 0, action-unbekannt 3, post-sonstig 0
- Blockierend: nichts

| Skript | KB | Ausführung ms | ungenutzt KB | Priorität |
|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 | 457 | 25,4 | Low |
| /_next/static/chunks/262uxxszab7p8.js | 44,4 | n. g. | n. g. | Low |
| /_next/static/chunks/3-wvc95gd2ymg.js | 14,5 | n. g. | n. g. | Low |
| /_next/static/chunks/2dhzg02docpca.js | 13,3 | n. g. | n. g. | Low |
| /_next/static/chunks/370fzf_7sfj_f.js | 13,0 | n. g. | n. g. | Low |
| /_next/static/chunks/0pf4fcubu9cey.js | 12,3 | n. g. | n. g. | Low |
| /_next/static/chunks/1ns3q1eicx6su.js | 12,0 | n. g. | n. g. | Low |
| /_next/static/chunks/3ip5m-7lhauc2.js | 11,9 | n. g. | n. g. | Low |
| /_next/static/chunks/1kyldpc501htm.js | 10,6 | n. g. | n. g. | Low |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 | n. g. | n. g. | Low |
| /_next/static/chunks/3wkrw1bmicoli.js | 9,0 | n. g. | n. g. | Low |
| /_next/static/chunks/17fms_jsrb1ne.js | 8,9 | n. g. | n. g. | Low |

| Lange Aufgabe | Start ms | Dauer ms |
|---|---|---|
| /service-und-termin/kontakt | 988 | 188 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3773 | 176 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 3991 | 67 |

| Befund (Score unter 0,9) | Anzeige | Einsparung ms | Einsparung KB |
|---|---|---|---|
| unused-javascript | Est savings of 25 KiB | 360 | 25,4 |
| legacy-javascript | Est savings of 13 KiB | 300 | 13,4 |
| largest-contentful-paint | 3.8 s | n. g. | n. g. |
| dom-size-insight | n. g. | n. g. | n. g. |
| legacy-javascript-insight | Est savings of 14 KiB | n. g. | n. g. |
| network-dependency-tree-insight | n. g. | n. g. | n. g. |
| interactive | 4.0 s | n. g. | n. g. |
| max-potential-fid | 180 ms | n. g. | n. g. |

