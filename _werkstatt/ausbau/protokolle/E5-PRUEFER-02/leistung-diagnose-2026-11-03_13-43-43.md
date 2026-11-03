# Leistungsdiagnose mobil (E5-PRUEFER-02)

Stand 2026-11-03T12:43:43.133Z · Lighthouse 12.6.1 · Chrome 153.0.0.0 · 3 Läufe je Ansicht · Medianlauf: Lauf mit mittlerer Leistung, bei Gleichstand mit niedrigerem LCP

Budget: Leistung mindestens 90, LCP höchstens 2.500 ms, SEO 100. Barrierefreiheit und Best Practices je 100, CLS höchstens 0,1.

Messung wie lighthouse.mjs: frischer Chrome je Lauf, Attrappen nach G5, Profil mobil. Drosselung der Lighthouse-Simulation: Netz-Rundlaufzeit 150 ms, Durchsatz 1.638 kbit/s, CPU 4-fach.

Zeiten des LCP, seiner Phasen, der Blockierzeit (TBT) und des Hauptthreads stammen aus dieser Simulation. Die Phasen des LCP summieren sich auf den berichteten LCP. Übertragungsgrößen sind gemessen.

Der simulierte LCP ist der späteste Endzeitpunkt aller Netzanfragen (außer Bildern mit niedriger Priorität) und CPU-Aufgaben, die im beobachteten Lauf vor dem LCP enden. Dazu zählen Webschriften und Skripte, die vor der ersten Darstellung des Textes fertig werden. Median und LCP des Medianlaufs können abweichen; beide stehen in der Übersicht.

## Übersicht

| Ansicht | Läufe | Leistung Median (Spanne) | LCP Median (Spanne) | LCP des Medianlaufs | LCP-Element (Medianlauf) | LCP-Typ | SEO | CLS | TBT ms | Budget verfehlt |
|---|---|---|---|---|---|---|---|---|---|---|
| H01-start | 3 von 3 | 91 (87 bis 92) | 3.117 ms (2.670 bis 3.317) | 2.670 ms | section.border-b > div.shell > div.lg:col-span-7 > h1#hub-frage | Text | 100 | 0,000 | 255 | LCP 3.117 ms |
| H02-autoschluessel | 3 von 3 | 92 (86 bis 93) | 3.026 ms (3.010 bis 3.721) | 3.010 ms | div.shell > div.grid > div.lg:col-span-7 > p.mt-4 | Text | 92 | 0,000 | 140 | LCP 3.026 ms, SEO 92 |
| H03-modell-golf | 3 von 3 | 93 (90 bis 95) | 2.960 ms (2.726 bis 3.435) | 2.960 ms | div.shell > div.grid > div.lg:col-span-7 > p.mt-4 | Text | 92 | 0,000 | 137 | LCP 2.960 ms, SEO 92 |
| H04-autoschluessel-anfrage | 3 von 3 | 87 (86 bis 91) | 3.151 ms (2.808 bis 3.746) | 3.151 ms | div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2 | Text | 92 | 0,000 | 237 | Leistung 87, LCP 3.151 ms, SEO 92 |
| H05-code | 3 von 3 | 90 (90 bis 94) | 3.412 ms (2.806 bis 3.430) | 3.430 ms | div.mt-8 > div.flex > div.min-w-0 > p.mt-2 | Text | 92 | 0,000 | 138 | LCP 3.412 ms, SEO 92 |
| H06-code-produkt | 3 von 3 | 89 (86 bis 90) | 3.633 ms (3.269 bis 3.725) | 3.633 ms | div.shell > div.grid > div.lg:col-span-7 > p.mt-4 | Text | 92 | 0,000 | 116 | Leistung 89, LCP 3.633 ms, SEO 92 |
| H07-foto | 3 von 3 | 94 (94 bis 95) | 2.642 ms (2.639 bis 2.953) | 2.953 ms | div.grid > div.lg:col-span-7 > div.mt-8 > p.max-w-measure | Text | 92 | 0,000 | 130 | LCP 2.642 ms, SEO 92 |
| H08-einschicken | 3 von 3 | 93 (93 bis 96) | 3.160 ms (2.754 bis 3.207) | 3.207 ms | header.border-b > div.shell > div.mt-8 > p.max-w-measure | Text | 92 | 0,000 | 64 | LCP 3.160 ms, SEO 92 |
| H09-sperrschliessung-konfigurator | 3 von 3 | 93 (90 bis 93) | 2.676 ms (2.663 bis 3.589) | 2.663 ms | div > div.-mx-5 > div.mt-6 > p.mt-2 | Text | 92 | 0,000 | 197 | LCP 2.676 ms, SEO 92 |
| H10-schliessanlagen | 3 von 3 | 86 (83 bis 95) | 3.548 ms (2.710 bis 3.597) | 3.597 ms | div.shell > div.grid > div.lg:col-span-7 > h1#seiten-titel | Text | 92 | 0,000 | 221 | Leistung 86, LCP 3.548 ms, SEO 92 |
| H11-schliessanlagen-konfigurator | 3 von 3 | 86 (86 bis 88) | 3.692 ms (3.474 bis 3.880) | 3.880 ms | div.shell > div.grid > div > p.mt-4 | Text | 92 | 0,000 | 155 | Leistung 86, LCP 3.692 ms, SEO 92 |
| H12-partner-werden | 3 von 3 | 90 (89 bis 93) | 3.609 ms (2.911 bis 3.625) | 3.609 ms | header.border-b > div.shell > div.mt-8 > p.max-w-measure | Text | 92 | 0,000 | 97 | LCP 3.609 ms, SEO 92 |
| H13-kasse | 3 von 3 | 95 (93 bis 95) | 2.669 ms (2.646 bis 3.161) | 2.646 ms | div.shell > div.grid > div > p.mt-4 | Text | 54 | 0,009 | 154 | LCP 2.669 ms, SEO 54 |
| H14-ratgeber-messen | 3 von 3 | 93 (92 bis 96) | 2.970 ms (2.570 bis 3.111) | 2.970 ms | div.shell > div.grid > div.lg:col-span-7 > h1.text-balance | Text | 92 | 0,000 | 145 | LCP 2.970 ms, SEO 92 |

## H01-start · /

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 91, LCP 2.670 ms, SEO 100). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 3.117 ms.

### LCP

- Element: section.border-b > div.shell > div.lg:col-span-7 > h1#hub-frage, Typ Text, Ausschnitt: <h1 id="hub-frage" class="text-display font-bold text-foreground">
- Phasen (simuliert, Summe 2.670 ms): Serverantwort 456 ms (17 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.214 ms (83 %).

- Berichteter LCP 2.670 ms.

### HTML-Dokument

Übertragung 73,5 KB; Inline-Skripte 25 ms Ausführung, 53 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 385 | 22 | 27,4 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | n. g. | n. g. | 23,3 KB | 54 |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/383l4lo16mb4u.js | 8,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Other | 709 |
| Script Evaluation | 437 |
| Style & Layout | 393 |
| Rendering | 298 |
| Parse HTML & CSS | 103 |
| Script Parsing & Compilation | 103 |
| Garbage Collection | 36 |
| Gesamt | 2080 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 3, davon bis zum LCP 2 mit zusammen 286 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3325 | 179 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 1295 | 178 | / |
| 1056 | 108 | nicht zuordenbar |

### Blockierzeit (TBT 257 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 179 | 129 |
| / | 178 | 128 |
| nicht zuordenbar | 108 | 58 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 51 KiB | 110 | 50,6 | 2 |
| first-contentful-paint (First Contentful Paint) | 1.3 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 2.7 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 260 ms | n. g. | n. g. | n. g. |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.5 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 180 ms | n. g. | n. g. | n. g. |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 0 | 13,4 | 1 |
| dom-size (Avoid an excessive DOM size) | 1,015 elements | n. g. | n. g. | 3 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.1 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 2,670 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

Keine.

## H02-autoschluessel · /autoschluessel

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 92, LCP 3.010 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 3.026 ms, SEO 92.

### LCP

- Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4, Typ Text, Ausschnitt: <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- Phasen (simuliert, Summe 3.010 ms): Serverantwort 453 ms (15 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.557 ms (85 %).

- Berichteter LCP 3.010 ms.

### HTML-Dokument

Übertragung 70,5 KB; Inline-Skripte 28 ms Ausführung, 54 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 482 | 25 | 27,5 KB | 39 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2s431s8isom-a.js | 1,7 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |
| /_next/static/media/ibm_plex_sans_latin_ext_wght.3t_7mbg42824f.woff2 | 31,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Other | 899 |
| Script Evaluation | 547 |
| Style & Layout | 546 |
| Rendering | 367 |
| Script Parsing & Compilation | 139 |
| Parse HTML & CSS | 57 |
| Garbage Collection | 19 |
| Gesamt | 2574 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 4, davon bis zum LCP 3 mit zusammen 507 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1097 | 274 | /autoschluessel |
| 3467 | 193 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 1371 | 129 | /autoschluessel |
| 903 | 104 | nicht zuordenbar |

### Blockierzeit (TBT 140 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /autoschluessel | 274 | 224 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 193 | 143 |
| /autoschluessel | 129 | 79 |
| nicht zuordenbar | 104 | 54 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| first-contentful-paint (First Contentful Paint) | 1.7 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.0 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 140 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.7 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 190 ms | n. g. | n. g. | n. g. |
| unused-javascript (Reduce unused JavaScript) | Est savings of 28 KiB | 0 | 27,5 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 0 | 13,4 | 1 |
| dom-size (Avoid an excessive DOM size) | 1,024 elements | n. g. | n. g. | 3 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.6 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,010 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H03-modell-golf · /autoschluessel/marken/volkswagen/golf

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 93, LCP 2.960 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 2.960 ms, SEO 92.

### LCP

- Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4, Typ Text, Ausschnitt: <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- Phasen (simuliert, Summe 2.959 ms): Serverantwort 456 ms (15 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.503 ms (85 %).

- Berichteter LCP 2.960 ms.

### HTML-Dokument

Übertragung 62,7 KB; Inline-Skripte 24 ms Ausführung, 26 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 328 | 20 | 27,5 KB | 39 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 274 | 11 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2s431s8isom-a.js | 1,7 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 662 |
| Other | 617 |
| Style & Layout | 535 |
| Rendering | 267 |
| Script Parsing & Compilation | 79 |
| Parse HTML & CSS | 49 |
| Garbage Collection | 29 |
| Gesamt | 2239 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 3 mit zusammen 472 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1089 | 287 | /autoschluessel/marken/volkswagen/golf |
| 3475 | 233 | /_next/static/chunks/198evho4xwjs2.js |
| 1376 | 94 | /autoschluessel/marken/volkswagen/golf |
| 906 | 91 | nicht zuordenbar |
| 3708 | 53 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 137 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /autoschluessel/marken/volkswagen/golf | 287 | 237 |
| /_next/static/chunks/198evho4xwjs2.js | 233 | 183 |
| /autoschluessel/marken/volkswagen/golf | 94 | 44 |
| nicht zuordenbar | 91 | 41 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 53 | 3 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 28 KiB | 230 | 27,5 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.0 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 140 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.6 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 290 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 10 KiB | 0 | 10,4 | 1 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.2 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 2,960 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H04-autoschluessel-anfrage · /autoschluessel/anfrage

Gültige Läufe 3 von 3. Medianlauf: Lauf 3 (Leistung 87, LCP 3.151 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 3.

Budget verfehlt: Leistung 87, LCP 3.151 ms, SEO 92.

### LCP

- Element: div.lg:col-span-8 > div.-mx-5 > div.mt-6 > p.mt-2, Typ Text, Ausschnitt: <p class="mt-2 max-w-measure text-body text-foreground-muted">
- Phasen (simuliert, Summe 3.151 ms): Serverantwort 457 ms (15 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.694 ms (85 %).

- Berichteter LCP 3.151 ms.

### HTML-Dokument

Übertragung 61,1 KB; Inline-Skripte 22 ms Ausführung, 55 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 356 | 22 | 25,8 KB | 36 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 185 | 16 | 20,2 KB | 47 |
| /_next/static/chunks/1cm7vn59g42va.js | 18,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2y_-_bkvc8msf.js | 11,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2q22w7qpslb1c.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2b4cs7mskiuhc.js | 3,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_sans_latin_ext_wght.3t_7mbg42824f.woff2 | 31,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 608 |
| Other | 526 |
| Style & Layout | 352 |
| Script Parsing & Compilation | 131 |
| Parse HTML & CSS | 48 |
| Rendering | 42 |
| Garbage Collection | 19 |
| Gesamt | 1725 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 7, davon bis zum LCP 3 mit zusammen 367 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3628 | 208 | /_next/static/chunks/198evho4xwjs2.js |
| 1195 | 160 | /autoschluessel/anfrage |
| 907 | 137 | nicht zuordenbar |
| 3886 | 88 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 1125 | 70 | /autoschluessel/anfrage |
| 4015 | 52 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 3836 | 50 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 318 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/198evho4xwjs2.js | 208 | 158 |
| /autoschluessel/anfrage | 160 | 110 |
| nicht zuordenbar | 137 | 87 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 88 | 38 |
| /autoschluessel/anfrage | 70 | 20 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 46 KiB | 280 | 46,0 | 2 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.1 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.2 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 320 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 4.0 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 210 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 65 KiB | 0 | 64,7 | 1 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,150 ms | n. g. | n. g. | 2 |
| bf-cache (Page prevented back/forward cache restoration) | 2 failure reasons | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H05-code · /schluessel-nach-code

Gültige Läufe 3 von 3. Medianlauf: Lauf 3 (Leistung 90, LCP 3.430 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 3.412 ms, SEO 92.

### LCP

- Element: div.mt-8 > div.flex > div.min-w-0 > p.mt-2, Typ Text, Ausschnitt: <p class="mt-2">
- Phasen (simuliert, Summe 3.430 ms): Serverantwort 454 ms (13 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.976 ms (87 %).

- Berichteter LCP 3.430 ms.

### HTML-Dokument

Übertragung 63,7 KB; Inline-Skripte 27 ms Ausführung, 33 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 314 | 24 | 27,0 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 204 | 13 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/29cm9miwwlmmd.js | 7,6 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Other | 660 |
| Script Evaluation | 588 |
| Style & Layout | 535 |
| Rendering | 349 |
| Script Parsing & Compilation | 95 |
| Parse HTML & CSS | 52 |
| Garbage Collection | 20 |
| Gesamt | 2299 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 5 mit zusammen 592 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1081 | 209 | /schluessel-nach-code |
| 3168 | 188 | /_next/static/chunks/198evho4xwjs2.js |
| 904 | 79 | nicht zuordenbar |
| 1290 | 59 | /schluessel-nach-code |
| 1024 | 57 | /schluessel-nach-code |

### Blockierzeit (TBT 138 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /schluessel-nach-code | 209 | 159 |
| /_next/static/chunks/198evho4xwjs2.js | 188 | 138 |
| nicht zuordenbar | 79 | 29 |
| /schluessel-nach-code | 59 | 9 |
| /schluessel-nach-code | 57 | 7 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 27 KiB | 230 | 27,0 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.4 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 140 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.4 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 190 ms | n. g. | n. g. | n. g. |
| dom-size (Avoid an excessive DOM size) | 1,206 elements | n. g. | n. g. | 3 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.3 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,430 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H06-code-produkt · /schluessel-nach-code/ms-01

Gültige Läufe 3 von 3. Medianlauf: Lauf 1 (Leistung 89, LCP 3.633 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: Leistung 89, LCP 3.633 ms, SEO 92.

### LCP

- Element: div.shell > div.grid > div.lg:col-span-7 > p.mt-4, Typ Text, Ausschnitt: <p class="mt-4 max-w-measure text-foreground-muted text-lead">
- Phasen (simuliert, Summe 3.633 ms): Serverantwort 454 ms (12 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 3.179 ms (88 %).

- Berichteter LCP 3.633 ms.

### HTML-Dokument

Übertragung 59,1 KB; Inline-Skripte 27 ms Ausführung, 22 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 409 | 23 | 27,1 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | n. g. | n. g. | 23,2 KB | 53 |
| /_next/static/chunks/08o-vgb9i1u7e.js | 12,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/41sma1iakbyc-.js | 10,5 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Style & Layout | 637 |
| Other | 590 |
| Script Evaluation | 523 |
| Rendering | 281 |
| Script Parsing & Compilation | 104 |
| Parse HTML & CSS | 36 |
| Garbage Collection | 16 |
| Gesamt | 2187 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 5 mit zusammen 621 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1027 | 277 | /schluessel-nach-code/ms-01 |
| 3467 | 166 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 904 | 73 | nicht zuordenbar |
| 1304 | 55 | /schluessel-nach-code/ms-01 |
| 977 | 50 | /schluessel-nach-code/ms-01 |

### Blockierzeit (TBT 116 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /schluessel-nach-code/ms-01 | 277 | 227 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 166 | 116 |
| nicht zuordenbar | 73 | 23 |
| /schluessel-nach-code/ms-01 | 55 | 5 |
| /schluessel-nach-code/ms-01 | 50 | 0 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 50 KiB | 450 | 50,2 | 2 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.6 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 120 ms | n. g. | n. g. | n. g. |
| speed-index (Speed Index) | 2.4 s | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.6 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 170 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 10 KiB | 0 | 10,2 | 1 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.2 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,630 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H07-foto · /schluessel-nach-vorlage

Gültige Läufe 3 von 3. Medianlauf: Lauf 1 (Leistung 94, LCP 2.953 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 2.642 ms, SEO 92.

### LCP

- Element: div.grid > div.lg:col-span-7 > div.mt-8 > p.max-w-measure, Typ Text, Ausschnitt: <p class="max-w-measure text-body text-foreground-muted">
- Phasen (simuliert, Summe 2.953 ms): Serverantwort 453 ms (15 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.500 ms (85 %).

- Berichteter LCP 2.953 ms.

### HTML-Dokument

Übertragung 62,8 KB; Inline-Skripte 21 ms Ausführung, 25 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 254 | 28 | 27,4 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 192 | 11 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2y_-_bkvc8msf.js | 11,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2q22w7qpslb1c.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0guski2_b0cfr.js | 8,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0ex03-w8u57n_.js | 7,7 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Other | 676 |
| Script Evaluation | 537 |
| Style & Layout | 435 |
| Rendering | 199 |
| Script Parsing & Compilation | 116 |
| Parse HTML & CSS | 47 |
| Garbage Collection | 19 |
| Gesamt | 2029 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 3 mit zusammen 396 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1037 | 183 | /schluessel-nach-vorlage |
| 3164 | 157 | /_next/static/chunks/198evho4xwjs2.js |
| 1220 | 120 | /schluessel-nach-vorlage |
| 903 | 93 | nicht zuordenbar |
| 3321 | 51 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 108 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /schluessel-nach-vorlage | 183 | 133 |
| /_next/static/chunks/198evho4xwjs2.js | 157 | 107 |
| /schluessel-nach-vorlage | 120 | 70 |
| nicht zuordenbar | 93 | 43 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 51 | 1 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 27 KiB | 300 | 27,4 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.0 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 110 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.4 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 160 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 11 KiB | 0 | 10,7 | 1 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.0 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 2,950 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H08-einschicken · /schluessel-einschicken

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 93, LCP 3.207 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 3.160 ms, SEO 92.

### LCP

- Element: header.border-b > div.shell > div.mt-8 > p.max-w-measure, Typ Text, Ausschnitt: <p class="max-w-measure text-body text-foreground-muted">
- Phasen (simuliert, Summe 3.207 ms): Serverantwort 454 ms (14 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.753 ms (86 %).

- Berichteter LCP 3.207 ms.

### HTML-Dokument

Übertragung 51,5 KB; Inline-Skripte 26 ms Ausführung, 21 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 370 | 18 | 27,4 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 67 | 12 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2y_-_bkvc8msf.js | 11,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2q22w7qpslb1c.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0guski2_b0cfr.js | 8,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0mk1r8irpgu4x.js | 6,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1grb4r8y8igd7.js | 2,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 507 |
| Other | 504 |
| Style & Layout | 324 |
| Rendering | 91 |
| Script Parsing & Compilation | 88 |
| Parse HTML & CSS | 35 |
| Garbage Collection | 32 |
| Gesamt | 1581 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 4, davon bis zum LCP 3 mit zusammen 350 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1016 | 221 | /schluessel-einschicken |
| 3613 | 194 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 904 | 70 | nicht zuordenbar |
| 1237 | 59 | /schluessel-einschicken |

### Blockierzeit (TBT 72 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /schluessel-einschicken | 221 | 171 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 194 | 144 |
| nicht zuordenbar | 70 | 20 |
| /schluessel-einschicken | 59 | 9 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 27 KiB | 300 | 27,4 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.2 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 70 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.7 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 190 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 12 KiB | 0 | 11,7 | 1 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,210 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H09-sperrschliessung-konfigurator · /gleichschliessende-zylinder/konfigurator

Gültige Läufe 3 von 3. Medianlauf: Lauf 1 (Leistung 93, LCP 2.663 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 2.676 ms, SEO 92.

### LCP

- Element: div > div.-mx-5 > div.mt-6 > p.mt-2, Typ Text, Ausschnitt: <p class="mt-2 max-w-measure text-body text-foreground-muted">
- Phasen (simuliert, Summe 2.663 ms): Serverantwort 453 ms (17 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.210 ms (83 %).

- Berichteter LCP 2.663 ms.

### HTML-Dokument

Übertragung 51,7 KB; Inline-Skripte 27 ms Ausführung, 53 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 484 | 19 | 27,1 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 50 | 16 | n. g. | n. g. |
| /_next/static/chunks/3yoc1x165hl9e.js | 16,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2q22w7qpslb1c.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 600 |
| Other | 544 |
| Style & Layout | 341 |
| Script Parsing & Compilation | 120 |
| Rendering | 45 |
| Parse HTML & CSS | 40 |
| Garbage Collection | 23 |
| Gesamt | 1711 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 6, davon bis zum LCP 3 mit zusammen 315 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3613 | 213 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 1145 | 158 | /gleichschliessende-zylinder/konfigurator |
| 903 | 93 | nicht zuordenbar |
| 1081 | 64 | nicht zuordenbar |
| 3904 | 64 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 3853 | 51 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 197 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 213 | 163 |
| /gleichschliessende-zylinder/konfigurator | 158 | 108 |
| nicht zuordenbar | 93 | 43 |
| nicht zuordenbar | 64 | 14 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 64 | 14 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| first-contentful-paint (First Contentful Paint) | 1.1 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 2.7 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 200 ms | n. g. | n. g. | n. g. |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.8 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 210 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 11 KiB | 0 | 11,3 | 1 |
| unused-javascript (Reduce unused JavaScript) | Est savings of 27 KiB | 0 | 27,1 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 0 | 13,4 | 1 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 2,660 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H10-schliessanlagen · /schliessanlagen

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 86, LCP 3.597 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: Leistung 86, LCP 3.548 ms, SEO 92.

### LCP

- Element: div.shell > div.grid > div.lg:col-span-7 > h1#seiten-titel, Typ Text, Ausschnitt: <h1 id="seiten-titel" tabindex="-1" class="text-balance font-bold text-foreground focus:outline-none mt-4 text-display">
- Phasen (simuliert, Summe 3.597 ms): Serverantwort 456 ms (13 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 3.141 ms (87 %).

- Berichteter LCP 3.597 ms.

### HTML-Dokument

Übertragung 75,5 KB; Inline-Skripte 18 ms Ausführung, 29 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 503 | 31 | 27,5 KB | 38 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 55 | 14 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0szsr-l5if0h7.js | 8,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Other | 785 |
| Style & Layout | 755 |
| Script Evaluation | 636 |
| Rendering | 357 |
| Script Parsing & Compilation | 95 |
| Parse HTML & CSS | 58 |
| Garbage Collection | 20 |
| Gesamt | 2706 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 5 mit zusammen 749 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 1242 | 284 | /schliessanlagen |
| 3325 | 185 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 1526 | 136 | /schliessanlagen |
| 1056 | 93 | nicht zuordenbar |
| 1191 | 51 | /schliessanlagen |

### Blockierzeit (TBT 221 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /schliessanlagen | 284 | 234 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 185 | 135 |
| /schliessanlagen | 136 | 86 |
| nicht zuordenbar | 93 | 43 |
| /schliessanlagen | 51 | 1 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 28 KiB | 300 | 27,5 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.5 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.6 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 220 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.6 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 280 ms | n. g. | n. g. | n. g. |
| dom-size (Avoid an excessive DOM size) | 1,192 elements | n. g. | n. g. | 3 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.7 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,600 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H11-schliessanlagen-konfigurator · /schliessanlagen/konfigurator

Gültige Läufe 3 von 3. Medianlauf: Lauf 3 (Leistung 86, LCP 3.880 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 3.

Budget verfehlt: Leistung 86, LCP 3.692 ms, SEO 92.

### LCP

- Element: div.shell > div.grid > div > p.mt-4, Typ Text, Ausschnitt: <p class="mt-4 max-w-measure text-foreground-muted text-body">
- Phasen (simuliert, Summe 3.881 ms): Serverantwort 459 ms (12 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 3.422 ms (88 %).

- Berichteter LCP 3.880 ms.

### HTML-Dokument

Übertragung 48,0 KB; Inline-Skripte 27 ms Ausführung, 20 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 313 | 22 | 25,8 KB | 36 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 176 | 15 | 20,2 KB | 47 |
| /_next/static/chunks/3m4ueq_hk38qn.js | 13,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2y_-_bkvc8msf.js | 11,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2q22w7qpslb1c.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0kw0dz8bn_pke.js | 1,6 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 555 |
| Other | 483 |
| Style & Layout | 344 |
| Script Parsing & Compilation | 90 |
| Parse HTML & CSS | 62 |
| Garbage Collection | 32 |
| Rendering | 24 |
| Gesamt | 1590 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 5 mit zusammen 574 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3476 | 197 | /_next/static/chunks/198evho4xwjs2.js |
| 1049 | 179 | /schliessanlagen/konfigurator |
| 909 | 82 | nicht zuordenbar |
| 991 | 58 | /schliessanlagen/konfigurator |
| 3718 | 58 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 155 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/198evho4xwjs2.js | 197 | 147 |
| /schliessanlagen/konfigurator | 179 | 129 |
| nicht zuordenbar | 82 | 32 |
| /schliessanlagen/konfigurator | 58 | 8 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 58 | 8 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 46 KiB | 600 | 46,0 | 2 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.9 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 160 ms | n. g. | n. g. | n. g. |
| speed-index (Speed Index) | 2.3 s | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.9 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 200 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 65 KiB | 0 | 65,1 | 1 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,880 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H12-partner-werden · /partner-werden

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 90, LCP 3.609 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 3.

Budget verfehlt: LCP 3.609 ms, SEO 92.

### LCP

- Element: header.border-b > div.shell > div.mt-8 > p.max-w-measure, Typ Text, Ausschnitt: <p class="max-w-measure text-body text-foreground-muted">
- Phasen (simuliert, Summe 3.609 ms): Serverantwort 456 ms (13 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 3.153 ms (87 %).

- Berichteter LCP 3.609 ms.

### HTML-Dokument

Übertragung 51,2 KB; Inline-Skripte 20 ms Ausführung, 22 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 348 | 20 | 25,1 KB | 35 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 243 | 11 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2y_-_bkvc8msf.js | 11,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2q22w7qpslb1c.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0w2y6rkoojh6t.js | 9,3 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-qrikt0wv_p9.js | 5,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 654 |
| Other | 514 |
| Style & Layout | 431 |
| Rendering | 89 |
| Script Parsing & Compilation | 84 |
| Parse HTML & CSS | 54 |
| Garbage Collection | 21 |
| Gesamt | 1845 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 2 mit zusammen 289 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3619 | 215 | /_next/static/chunks/198evho4xwjs2.js |
| 1041 | 203 | /partner-werden |
| 906 | 86 | nicht zuordenbar |
| 3929 | 56 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 3878 | 51 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 86 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/198evho4xwjs2.js | 215 | 165 |
| /partner-werden | 203 | 153 |
| nicht zuordenbar | 86 | 36 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 56 | 6 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 51 | 1 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 25 KiB | 300 | 25,1 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.6 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 90 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.8 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 220 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 64 KiB | 0 | 63,9 | 1 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 3,610 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H13-kasse · /kasse

Gültige Läufe 3 von 3. Medianlauf: Lauf 1 (Leistung 95, LCP 2.646 ms, SEO 54). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 3.

Budget verfehlt: LCP 2.669 ms, SEO 54.

### LCP

- Element: div.shell > div.grid > div > p.mt-4, Typ Text, Ausschnitt: <p class="mt-4 max-w-measure text-foreground-muted text-body">
- Phasen (simuliert, Summe 2.645 ms): Serverantwort 453 ms (17 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.192 ms (83 %).

- Berichteter LCP 2.646 ms.

### HTML-Dokument

Übertragung 54,8 KB; Inline-Skripte 20 ms Ausführung, 43 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 298 | 24 | 24,8 KB | 35 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 334 | 12 | n. g. | n. g. |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1rmfbbgij59xl.js | 10,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ffhld-dgl0vt.js | 9,5 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0r91tyxu9d9jz.js | 8,6 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/29cm9miwwlmmd.js | 7,6 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2s431s8isom-a.js | 1,7 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Script Evaluation | 723 |
| Other | 489 |
| Style & Layout | 251 |
| Script Parsing & Compilation | 108 |
| Parse HTML & CSS | 42 |
| Garbage Collection | 28 |
| Rendering | 19 |
| Gesamt | 1661 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 5, davon bis zum LCP 2 mit zusammen 204 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3760 | 196 | /_next/static/chunks/198evho4xwjs2.js |
| 1124 | 115 | /kasse |
| 903 | 89 | nicht zuordenbar |
| 4063 | 72 | /_next/static/chunks/17_pbdm6y2ffj.js |
| 4004 | 59 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 154 ms) und Verschiebungen (CLS 0,009)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/198evho4xwjs2.js | 196 | 146 |
| /kasse | 115 | 65 |
| nicht zuordenbar | 89 | 39 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 72 | 22 |
| /_next/static/chunks/17_pbdm6y2ffj.js | 59 | 9 |

| CLS-Element | Wert | Ursache |
|---|---|---|
| div.group/warenkorb > div.shell > div.rounded-lg > div.px-5 | 0.0087 | n. g. |

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 25 KiB | 150 | 24,8 | 1 |
| largest-contentful-paint (Largest Contentful Paint) | 2.6 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 150 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.9 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 200 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 66 KiB | 0 | 66,3 | 1 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 0 | 13,4 | 1 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 2,650 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- is-crawlable (Page is blocked from indexing), Gewicht 4,0, Anzahl 2
  - head > meta <meta name="robots" content="noindex, nofollow" />
  - http://localhost:3000/robots.txt, Zeile 5
- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## H14-ratgeber-messen · /ratgeber/zylinder-richtig-ausmessen

Gültige Läufe 3 von 3. Medianlauf: Lauf 2 (Leistung 93, LCP 2.970 ms, SEO 92). Attrappen über alle Läufe: fremd 0, schreibend 0, unbekannte Aktionen 0.

Budget verfehlt: LCP 2.970 ms, SEO 92.

### LCP

- Element: div.shell > div.grid > div.lg:col-span-7 > h1.text-balance, Typ Text, Ausschnitt: <h1 class="text-balance font-bold text-foreground focus:outline-none mt-4 text-display">
- Phasen (simuliert, Summe 2.970 ms): Serverantwort 460 ms (15 %); Ladeverzögerung 0 ms (0 %); Ladedauer 0 ms (0 %); Darstellungsverzögerung 2.510 ms (85 %).

- Berichteter LCP 2.970 ms.

### HTML-Dokument

Übertragung 51,1 KB; Inline-Skripte 37 ms Ausführung, 44 ms Parsen.

### Blockierende Ressourcen

Keine blockierenden Ressourcen.

### JavaScript je Skript

| Skript | Übertragung | Ausführung ms | Parsen ms | Ungenutzt | Ungenutzt % |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | 72,4 KB | 231 | 21 | 27,6 KB | 39 |
| /_next/static/chunks/198evho4xwjs2.js | 44,2 KB | 172 | 14 | 23,2 KB | 53 |
| /_next/static/chunks/1poia4cbn1l_z.js | 11,8 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-y3n0uwz2pmn.js | 9,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/20n_drg1zb0_1.js | 9,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1-ft5p33plyq9.js | 8,9 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/11b5gult0wfrr.js | 7,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0-3n6-tis2z36.js | 6,1 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/1b16focnpt99t.js | 6,0 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | 5,2 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/421c_el12128q.js | 4,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/2ksv7p9obax5c.js | 3,4 KB | n. g. | n. g. | n. g. | n. g. |
| /_next/static/chunks/0irj-lecoyhj3.js | 1,9 KB | n. g. | n. g. | n. g. | n. g. |

### Stylesheets und Schriften

Keine externen Stylesheets.

| Schrift | Übertragung |
|---|---|
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | 45,5 KB |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | 15,4 KB |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | 16,1 KB |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | 15,2 KB |

### Hauptthread nach Kategorien

| Kategorie | Zeit ms |
|---|---|
| Other | 744 |
| Script Evaluation | 473 |
| Style & Layout | 418 |
| Rendering | 266 |
| Script Parsing & Compilation | 101 |
| Parse HTML & CSS | 40 |
| Garbage Collection | 14 |
| Gesamt | 2057 |

### Lange Aufgaben bis zum LCP

Lange Aufgaben insgesamt 6, davon bis zum LCP 4 mit zusammen 379 ms.

| Start ms | Dauer ms | Zuordnung |
|---|---|---|
| 3190 | 193 | /_next/static/chunks/198evho4xwjs2.js |
| 1202 | 128 | /ratgeber/zylinder-richtig-ausmessen |
| 1098 | 104 | /ratgeber/zylinder-richtig-ausmessen |
| 910 | 90 | nicht zuordenbar |
| 1041 | 57 | /ratgeber/zylinder-richtig-ausmessen |
| 3383 | 52 | /_next/static/chunks/17_pbdm6y2ffj.js |

### Blockierzeit (TBT 145 ms) und Verschiebungen (CLS 0,000)

| TBT-Verursacher | Dauer ms | Blockierend ms |
|---|---|---|
| /_next/static/chunks/198evho4xwjs2.js | 193 | 143 |
| /ratgeber/zylinder-richtig-ausmessen | 128 | 78 |
| /ratgeber/zylinder-richtig-ausmessen | 104 | 54 |
| nicht zuordenbar | 90 | 40 |
| /ratgeber/zylinder-richtig-ausmessen | 57 | 7 |

Keine Verschiebungen mit Verursacher.

### Leistungsbefunde, nicht bestanden

| Audit | Wert | Einsparung ms | Einsparung KB | Anzahl |
|---|---|---|---|---|
| unused-javascript (Reduce unused JavaScript) | Est savings of 51 KiB | 300 | 50,8 | 2 |
| legacy-javascript (Avoid serving legacy JavaScript to modern browsers) | Est savings of 13 KiB | 150 | 13,4 | 1 |
| first-contentful-paint (First Contentful Paint) | 1.4 s | n. g. | n. g. | n. g. |
| largest-contentful-paint (Largest Contentful Paint) | 3.0 s | n. g. | n. g. | n. g. |
| total-blocking-time (Total Blocking Time) | 150 ms | n. g. | n. g. | n. g. |
| dom-size-insight (Optimize DOM size) | n. g. | n. g. | n. g. | 3 |
| forced-reflow-insight (Forced reflow) | n. g. | n. g. | n. g. | 1 |
| legacy-javascript-insight (Legacy JavaScript) | Est savings of 14 KiB | n. g. | n. g. | 1 |
| network-dependency-tree-insight (Network dependency tree) | n. g. | n. g. | n. g. | n. g. |
| interactive (Time to Interactive) | 3.4 s | n. g. | n. g. | n. g. |
| max-potential-fid (Max Potential First Input Delay) | 190 ms | n. g. | n. g. | n. g. |
| unused-css-rules (Reduce unused CSS) | Est savings of 12 KiB | 0 | 11,7 | 1 |
| mainthread-work-breakdown (Minimize main-thread work) | 2.1 s | n. g. | n. g. | 7 |
| largest-contentful-paint-element (Largest Contentful Paint element) | 2,970 ms | n. g. | n. g. | 2 |

### SEO, nicht bestanden

- link-text (Links do not have descriptive text), Gewicht 1,0, Anzahl 1
  - Link http://localhost:3000/ mit Text „Start“

## Gemeinsame Ressourcen (Medianläufe)

| Ressource | Typ | Ansichten | Größe | Verzögerung ms | Ausführung ms |
|---|---|---|---|---|---|
| /_next/static/chunks/17_pbdm6y2ffj.js | Skript | 14 von 14 | 72,4 KB | 0 | 503 |
| /_next/static/media/ibm_plex_sans_latin_wght.p.15jby9eboz7vb.woff2 | Schrift | 14 von 14 | 45,5 KB | 0 | 0 |
| /_next/static/chunks/198evho4xwjs2.js | Skript | 14 von 14 | 44,2 KB | 0 | 334 |
| /_next/static/media/ibm_plex_mono_latin_500.11q3guvgd1r20.woff2 | Schrift | 14 von 14 | 15,4 KB | 0 | 0 |
| /_next/static/media/ibm_plex_mono_latin_400.3xdfs0-p_zi4c.woff2 | Schrift | 14 von 14 | 15,2 KB | 0 | 0 |
| /_next/static/chunks/1poia4cbn1l_z.js | Skript | 14 von 14 | 11,8 KB | 0 | 0 |
| /_next/static/chunks/0-y3n0uwz2pmn.js | Skript | 14 von 14 | 9,9 KB | 0 | 0 |
| /_next/static/chunks/20n_drg1zb0_1.js | Skript | 14 von 14 | 9,1 KB | 0 | 0 |
| /_next/static/chunks/1-ft5p33plyq9.js | Skript | 14 von 14 | 8,9 KB | 0 | 0 |
| /_next/static/chunks/0-3n6-tis2z36.js | Skript | 14 von 14 | 6,1 KB | 0 | 0 |
| /_next/static/chunks/1b16focnpt99t.js | Skript | 14 von 14 | 6,0 KB | 0 | 0 |
| /_next/static/chunks/turbopack-077hmtqrhcoji.js | Skript | 14 von 14 | 5,2 KB | 0 | 0 |
| /_next/static/chunks/421c_el12128q.js | Skript | 14 von 14 | 4,4 KB | 0 | 0 |
| /_next/static/chunks/2ksv7p9obax5c.js | Skript | 14 von 14 | 3,4 KB | 0 | 0 |
| /_next/static/chunks/0irj-lecoyhj3.js | Skript | 14 von 14 | 1,9 KB | 0 | 0 |
| /_next/static/chunks/1rmfbbgij59xl.js | Skript | 12 von 14 | 10,4 KB | 0 | 0 |
| /_next/static/media/ibm_plex_mono_latin_600.30e0eqd5fxn92.woff2 | Schrift | 9 von 14 | 16,1 KB | 0 | 0 |
| /_next/static/chunks/0w2y6rkoojh6t.js | Skript | 7 von 14 | 9,3 KB | 0 | 0 |
| /_next/static/chunks/2q22w7qpslb1c.js | Skript | 6 von 14 | 10,4 KB | 0 | 0 |
| /_next/static/chunks/2y_-_bkvc8msf.js | Skript | 5 von 14 | 11,2 KB | 0 | 0 |
| /_next/static/chunks/2s431s8isom-a.js | Skript | 3 von 14 | 1,7 KB | 0 | 0 |
| /_next/static/media/ibm_plex_sans_latin_ext_wght.3t_7mbg42824f.woff2 | Schrift | 2 von 14 | 31,1 KB | 0 | 0 |
| /_next/static/chunks/0guski2_b0cfr.js | Skript | 2 von 14 | 8,4 KB | 0 | 0 |
| /_next/static/chunks/29cm9miwwlmmd.js | Skript | 2 von 14 | 7,6 KB | 0 | 0 |
| /_next/static/chunks/1cm7vn59g42va.js | Skript | 1 von 14 | 18,9 KB | 0 | 0 |
| /_next/static/chunks/3yoc1x165hl9e.js | Skript | 1 von 14 | 16,4 KB | 0 | 0 |
| /_next/static/chunks/3m4ueq_hk38qn.js | Skript | 1 von 14 | 13,1 KB | 0 | 0 |
| /_next/static/chunks/08o-vgb9i1u7e.js | Skript | 1 von 14 | 12,2 KB | 0 | 0 |
| /_next/static/chunks/41sma1iakbyc-.js | Skript | 1 von 14 | 10,5 KB | 0 | 0 |
| /_next/static/chunks/2ffhld-dgl0vt.js | Skript | 1 von 14 | 9,5 KB | 0 | 0 |
| /_next/static/chunks/383l4lo16mb4u.js | Skript | 1 von 14 | 8,8 KB | 0 | 0 |
| /_next/static/chunks/0r91tyxu9d9jz.js | Skript | 1 von 14 | 8,6 KB | 0 | 0 |
| /_next/static/chunks/0szsr-l5if0h7.js | Skript | 1 von 14 | 8,0 KB | 0 | 0 |
| /_next/static/chunks/0ex03-w8u57n_.js | Skript | 1 von 14 | 7,7 KB | 0 | 0 |
| /_next/static/chunks/11b5gult0wfrr.js | Skript | 1 von 14 | 7,2 KB | 0 | 0 |
| /_next/static/chunks/0mk1r8irpgu4x.js | Skript | 1 von 14 | 6,3 KB | 0 | 0 |
| /_next/static/chunks/0-qrikt0wv_p9.js | Skript | 1 von 14 | 5,4 KB | 0 | 0 |
| /_next/static/chunks/2b4cs7mskiuhc.js | Skript | 1 von 14 | 3,2 KB | 0 | 0 |
| /_next/static/chunks/1grb4r8y8igd7.js | Skript | 1 von 14 | 2,4 KB | 0 | 0 |
| /_next/static/chunks/0kw0dz8bn_pke.js | Skript | 1 von 14 | 1,6 KB | 0 | 0 |

