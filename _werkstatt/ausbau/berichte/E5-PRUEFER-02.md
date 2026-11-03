# E5-PRUEFER-02 · Leistungsdiagnose mobil

Messung: Lighthouse 12.6.1, Chrome 153, Produktions-Build (Stand 10:54 Uhr) auf Port 3000, 14 Hauptansichten, je drei Läufe, Medianlauf nach Leistung.

## GEÄNDERTE DATEIEN
- Neu: `_werkstatt/ausbau/werkzeuge/leistung-diagnose.mjs`; `protokolle/E5-PRUEFER-02/` (Zusammenfassung, Belege); `protokolle/roh/E5-PRUEFER-02/` (nicht committet).
- Keine Projektdatei von mir geändert. Fremde Änderungen im Arbeitsbaum (ab 12.28 Uhr in `src/` und `content/`, `PLAN.json`, `kontaktbogen-*`, `kontingent-*` u. a.) betreffen den gemessenen Build nicht.

## WAS UND WARUM
Das Werkzeug misst wie `lighthouse.mjs` und liefert die geforderten Angaben je Ansicht. Behoben: Dokumentgröße bei vier Ansichten falsch gelesen; danach Vollmessung neu, veraltete Dateien entfernt.

## PRÜFUNG UND ERGEBNIS
Budget: Leistung unter 90 auf H04, H06, H10, H11. LCP über 2.500 ms auf allen 14 Ansichten (kleinster Median 2.642 ms). SEO unter 100 auf 13.

| Ansicht | Leistung | LCP Median (Medianlauf) | LCP-Element | Hauptursache | SEO |
|---|---|---|---|---|---|
| H01 Start | 91 | 3.117 (2.670) | h1#hub-frage | 311 KiB vor LCP | 100 |
| H02 Autoschlüssel | 92 | 3.026 (3.010) | p.mt-4 | 334 KiB vor LCP | 92 |
| H03 Modell Golf | 93 | 2.960 (2.960) | p.mt-4 | 344 KiB vor LCP | 92 |
| H04 Anfrage | 87 | 3.151 (3.151) | p.mt-2 | 363 KiB, CSS 65 KiB ungenutzt | 92 |
| H05 Code | 90 | 3.412 (3.430) | p.mt-2 | 357 KiB vor LCP | 92 |
| H06 Code-Produkt | 89 | 3.633 (3.633) | p.mt-4 | 377 KiB, beobachteter LCP bei 1,27 s | 92 |
| H07 Foto | 94 | 2.642 (2.953) | p.max-w-measure | 346 KiB vor LCP | 92 |
| H08 Einschicken | 93 | 3.160 (3.207) | p.max-w-measure | 313 KiB vor LCP | 92 |
| H09 Sperrschließung | 93 | 2.676 (2.663) | p.mt-2 | 311 KiB vor LCP | 92 |
| H10 Schließanlagen | 86 | 3.548 (3.597) | h1#seiten-titel | 369 KiB, TBT 221 ms | 92 |
| H11 Konfigurator | 86 | 3.692 (3.880) | p.mt-4 | 363 KiB, CSS 65 KiB ungenutzt | 92 |
| H12 Partner | 90 | 3.609 (3.609) | p.max-w-measure | 357 KiB vor LCP | 92 |
| H13 Kasse | 95 | 2.669 (2.646) | p.mt-4 | 291 KiB vor LCP | 54 |
| H14 Ratgeber | 93 | 2.970 (2.970) | h1.text-balance | 334 KiB vor LCP | 92 |

Alle LCP-Elemente sind Text. Im Modell entfallen 83 bis 88 % des LCP auf die Darstellung. Vor dem LCP enden 291 bis 377 KiB an Schriften, Skripten und HTML, bei 1.638 kbit/s rund 1,5 bis 1,9 s.

Gegenprobe mit echter Drosselung (devtools, zwei Läufe auf H01, H04, H05): LCP 1.039 bis 1.189 ms, Leistung 94 bis 97. Lighthouse rechnet im Modell alle Netzressourcen ein, die im beobachteten Lauf vor dem LCP enden (`/root/sm24-werkzeuge/node_modules/@paulirish/trace_engine/models/trace/lantern/metrics/`).

## GEMEINSAME DATEIEN
Keine.

## VORSCHLÄGE (nach erwarteter Wirkung)
1. Ungenutzter Code im Bündel `17_pbdm6y2ffj.js` (72 KiB, 35 bis 39 % ungenutzt) und `198evho4xwjs2.js` (44 KiB, bis 54 %). Wirkung: 0 bis 600 ms, Median 290 ms (Audit `unused-javascript`). Dateien: `site-header.tsx`, `mobile-action-bar.tsx`, `eingang-buehne.tsx`, `dauerschleife.tsx` (Zuordnung zum Bündel ungeprüft). Risiko: Kopfnavigation. Bewegung: B-32 und B-35 nur verschieben.
2. Schriften vor dem ersten Bild: Plex Mono (46,7 KiB) und Plex Sans latin-ext (31 KiB, H02 und H04). Wirkung: rund 230 ms und 155 ms (Modell, 5 ms je KiB). Datei: `src/fonts/schriften.ts`. Risiko: Zahlendarstellung, Schriftwechsel. Bewegung: keine.
3. Dokumentgewicht: RSC-Nutzlast mit gerendertem Baum und SVG-Pfaden (rund die Hälfte der Übertragung, rund 40 KB) und Inline-CSS (rund 15 KB). Wirkung: rund 150 ms (Modell) bei halber Nutzlast und entferntem ungenutzten CSS. Dateien: `src/app/(site)/layout.tsx` (Icons an den Kopf), `globals.css`. Risiko: Kopf, Icons. Bewegung: Regeln von B-31, B-32 und B-35 erhalten.
4. Polyfills (13,4 KiB auf allen 14 Ansichten). Wirkung: 0 bis 150 ms (Audit `legacy-javascript`). Ursache: keine Browserliste im Projekt. Dateien: `package.json`, `next.config.ts`. Risiko: Zielbrowser, Entscheidung des Inhabers.
5. Layout und Stil vor der ersten Darstellung (Gegenprobe H01: 146 ms Layout, 124 ms Stil; 1.015 bis 1.206 Elemente). Wirkung nicht quantifiziert, Obergrenze rund 270 ms. Kandidaten, ungemessen: `intent-hub.tsx`, `eingang-szene.tsx`. Bewegung: B-31 nicht umbauen.

Zusatz ohne ms: Brotkrumen-Link „Start“ (`src/components/layout/breadcrumbs.tsx`, Zeile 24) auf „Startseite“ setzen, ebenso `json-ld.tsx` (Zeilen 314, 378). Wirkung: SEO 92 auf 100 auf 12 Ansichten. Texterfreigabe nötig.

Die Vorschläge 1 bis 4 ergeben im Modell rund 0,7 bis 1,1 s, die Lücke zum LCP-Budget 142 bis 1.192 ms (Doppelzählung möglich).

## BELEGE
`protokolle/E5-PRUEFER-02/leistung-diagnose-2026-11-03_13-43-43.json` und `.md`; `protokolle/E5-PRUEFER-02/belege-ergaenzung.md`; Rohberichte in `protokolle/roh/E5-PRUEFER-02/`.

## OFFENE FRAGEN
1. Messmodell: Das simulierte LCP liegt um rund 1,5 bis 2,3 s über der Gegenprobe. Welcher Wert gilt für die Budgetprüfung?
2. Bei neun Ansichten weicht der LCP-Median vom Medianlauf ab (H01: 3.117 gegen 2.670 ms). Welche Regel?
3. `/kasse` (SEO 54) ist bewusst `noindex` und per robots.txt gesperrt. Gilt das SEO-Budget dort?
4. Zielbrowser für die Polyfills: Inhaber.
5. CSS-Zuordnung für H04, H11, H12 und H13 offen.
