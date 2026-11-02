# E0-PRUEFER-03 · Neue Prüfwerkzeuge

Prüfer, Haiku 5.5, 2. November 2026. Probeläufe gegen den Produktionsserver (localhost:3000). Pfade relativ zu _werkstatt/ausbau/.

## GEÄNDERTE DATEIEN
- Neu: werkzeuge/lighthouse.mjs, kontaktbogen.mjs, inventar.mjs, snippet.mjs
- Ausgaben: protokolle/E0-PRUEFER-03-*.log und -*.json, protokolle/inventar-2026-11-02_23-23-33.json und .tsv, protokolle/snippet-2026-11-02_23-23-34.json, bilder/arbeit/E0-PRUEFER-03-kontaktbogen.jpg und zwei Probebilder
- Unverändert: lib.mjs, LIESMICH.md, Projektdateien

## WAS UND WARUM
- lighthouse.mjs: je Lauf ein frischer Chrome (chrome-launcher, Flags laut Paket). Playwright setzt über CDP attrappenSetzen (G5), im Test erfasst für ein fremdes Bild und POST-Aufrufe. Budget auf dem Median.
- kontaktbogen.mjs: HTML-Raster mit Dateinamen, file:// in Chromium, JPEG mit Qualität 70. Die Breite liest das Werkzeug aus dem JPEG-Kopf und prüft sie gegen 1.440 px.
- inventar.mjs: Adressen aus Sitemap (auch verschachtelt), Prerender-Manifest und Links desselben Ursprungs. fetch mit redirect manual, HTML per DOMParser im Chromium, höchstens 4 Abrufe gleichzeitig, nur localhost.
- snippet.mjs: Titelbreite per canvas in 20px Arial, Beschreibung in Zeichen, fc-match im Protokoll.
- Im Test behoben: Befund „Weiterleitung ohne Ziel“ ging im Inventar verloren. file:// war in kontaktbogen.mjs gesperrt, jetzt gibt es eine enge Ausnahme (Frage 7).

## GEMEINSAME DATEIEN
Keine Änderung an lib.mjs nötig. Zeilen für LIESMICH.md:
- `node lighthouse.mjs [--routen <pfad,pfad>] [--laeufe 3] [--profil mobil|desktop]` – Lighthouse je Hauptansicht als Median aus frischen Läufen
- `node kontaktbogen.mjs --bilder <ordner oder dateien> --ziel <datei.jpg> [--spalten 4] [--titel text]` – Kontaktbogen aus Bildern als ein JPEG
- `node inventar.mjs [--basis http://localhost:3000] [--max 2000]` – Inventar der Seiten mit Status, Weiterleitungen, Meta-Angaben und Dubletten
- `node snippet.mjs [--inventar <json>]` – Titelbreite in Pixeln und Beschreibungslänge je indexierbarer Seite

## PRÜFUNG UND ERGEBNIS
- Alle vier Werkzeuge enden mit Exit 0. Prüfbestand auf localhost:3917: 99 Prüfungen bestanden (Inventar 48, Snippet 19, Kontaktbogen und Lighthouse 32).
- Lighthouse Startseite mobil, Median aus drei Läufen: Leistung 83, Barrierefreiheit 96, Best Practices 100, SEO 100, LCP 3502 ms, CLS 0,000, TBT 334 ms, INP nicht messbar. Budget verfehlt bei Leistung, LCP und Barrierefreiheit.
- Inventar: 217 Adressen, 181 indexierbar, 18 mit noindex, 18 ohne HTML (Bilder, Icons, Textdateien). Keine Weiterleitungen, Fehlerstatus oder Dubletten. Bei allen HTML-Seiten sind Titel und Beschreibung gesetzt, es gibt genau eine h1, JSON-LD ist fehlerfrei. 14 von 14 Hauptansichten enthalten.
- Snippet: fc-match Arial liefert Liberation Sans, Arial misst wie Liberation Sans. Titel bis 580 px: 28 von 181 (15,5 %). Beschreibung 120 bis 160 Zeichen: 146 von 181 (80,7 %). Beides zusammen: 2 von 181.
- Kontaktbogen: Probe mit zwei Bildern, 1.440 × 900 px, 29 KB, beide Bilder geladen. Ein kaputtes Bild wird im Ordnerlauf als nicht geladen gemeldet.
- Streuung: LCP-Mediane zweier Dreier-Serien 3502 und 3487 ms, Einzelläufe 2858 bis 3508 ms.

## BELEGE
Unter _werkstatt/ausbau/protokolle/: E0-PRUEFER-03-lighthouse.log, -lighthouse-median3.log, -lighthouse-start-3laeufe.json, -lighthouse-serie2.log/.json, -inventar.log, inventar-2026-11-02_23-23-33.json/.tsv, -snippet.log, snippet-2026-11-02_23-23-34.json, -kontaktbogen.log, -tests.log. Bild: bilder/arbeit/E0-PRUEFER-03-kontaktbogen.jpg. Testcode im Scratchpad /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/.

## OFFENE FRAGEN
1. Gedankenstriche: 133 von 181 indexierbaren Seiten haben „–“ oder „—“ im Titel (76) oder in der Beschreibung (111). Zuständig: Stilprüfer.
2. Titel: 153 von 181 liegen über 580 px. Grenze so lassen?
3. Basisadresse: canonical, og:image und Sitemap zeigen im Build auf localhost:3000. Der Livebetrieb ist nicht geprüft.
4. noindex: Impressum und Datenschutz setzen im Code index false, dazu AGB, Widerruf, Kasse, Warenkorb, Terminstatus und Artikel-Beispiele. Absicht bestätigen.
5. Lighthouse nur für die Startseite; 13 weitere Hauptansichten mit je drei Läufen fehlen (etwa neun Minuten). Ursache der Barrierefreiheit 96 klären, a11y.mjs.
6. Erlaubte Google-Schriften zählt die Attrappe nicht (Z-20). Ein Vergleich ohne Attrappe ist nicht gemessen.
7. G5-Ausnahme: kontaktbogen.mjs lässt file:// nur für die eigene Seite und die Bilder durch. Bitte bestätigen.
8. Inventar: indexierbar verlangt HTML. canonical mit anderem Ursprung und gleichem Pfad gilt als gleich, mit Befund. /api/ bleibt außen vor. Bitte bestätigen.
9. Testcode liegt im Scratchpad. Soll er nach werkzeuge/tests/?
