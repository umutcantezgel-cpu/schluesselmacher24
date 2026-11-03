# E0-PRUEFER-03 · Neue Werkzeuge: Lighthouse, Kontaktbogen, Inventar, Snippet-Messung

## 1. Kopfzeile
Kennung E0-PRUEFER-03 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse L · Anforderungen: Auftrag 13 (Längen, Inventar), 16 (Prüfstufe B), Z-15, Z-16 · Schreibrechte: _werkstatt/ausbau/werkzeuge/lighthouse.mjs, kontaktbogen.mjs, inventar.mjs, snippet.mjs, dazu protokolle/E0-PRUEFER-03-*.log und berichte/E0-PRUEFER-03.md · Umfang: siehe Schritte

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei (nichts unter src, content, scripts, docs, keine Paketdatei des Projekts).

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
- Prüfwerkzeuge liegen in _werkstatt/ausbau/werkzeuge und importieren Gemeinsames nur aus lib.mjs (Pfade, Geräte, Browserstart, Attrappen, laden, durchscrollen, argumente, zeitstempel). lib.mjs ändert nur der Orchestrator; brauchst du dort etwas, nenne es unter GEMEINSAME DATEIEN.
- Playwright kommt vorinstalliert aus /opt/node-tools/node_modules/playwright (Version 1.63) mit Chromium unter /opt/pw-browsers/chromium-1243/chrome-linux64/chrome. Nie `playwright install` ausführen, nie Playwright neu installieren.
- Die Abhängigkeiten der Werkzeuge (axe-core, lighthouse, svgo) sind außerhalb des Repositorys installiert (/root/sm24-werkzeuge, verlinkt als werkzeuge/node_modules). Fehlt der Link, meldest du es; du installierst nichts nach.
- Jeder Browserlauf setzt attrappenSetzen(context) aus lib.mjs: schreibende Anfragen werden abgefangen, fremde Ursprünge abgebrochen (G5).
- Gemeinsame Regeln der Werkzeuge: Ausgabe Markdown-Tabelle auf stdout und JSON-Protokoll nach _werkstatt/ausbau/protokolle/<skript>-<zeitstempel>.json (mit --json <datei> anders). Exit 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler. Bilder nach BILDER_EXTERN (_werkstatt/ausbau/bilder/arbeit), nur mit --ziel anders, JPEG, höchstens 1.440 px breit.
- Der Produktionsserver läuft auf http://localhost:3000 und wird nur über `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/server.sh start|status|stop` bedient (er startet über die Datenweiche). Prüfe vor Gebrauch mit `server.sh status`.

## 3. Aufgabe in einem Satz
Baue vier neue Prüfwerkzeuge (Lighthouse-Median, Kontaktbogen, Inventar der Seiten, Snippet-Messung in Pixeln) auf lib.mjs und belege jedes mit einem Probelauf.

## 6. Maßstab
Aufbau, Argumente und Ausgabe wie messung.mjs und a11y.mjs (gleicher Stil: argumente(), zeitstempel(), Markdown auf stdout, JSON nach protokolle). Lighthouse aus /root/sm24-werkzeuge/node_modules/lighthouse (Version laut package.json), gestartet über chrome-launcher aus derselben Installation mit chromePath = CHROMIUM aus lib.mjs und den Flags --headless=new --no-sandbox --disable-gpu.

## 7. Grenzen
G1 (nur localhost), G5. Kein Projektbefehl.

## 8. Schritte
1. lighthouse.mjs: `node lighthouse.mjs [--routen p,p] [--laeufe 3] [--profil mobil|desktop]` (Standard alle Hauptansichten aus lib.mjs, 3 Läufe, mobil). Je Lauf ein frischer Chrome. Kategorien performance, accessibility, best-practices, seo; dazu LCP, CLS, TBT, INP falls vorhanden (sonst „–“). Ausgabe: je Route Median, Minimum und Maximum je Wert; Budget nach Auftrag Abschnitt 0 (Leistung mobil mindestens 90, Barrierefreiheit, Best Practices und SEO je 100, LCP höchstens 2,5 s, CLS höchstens 0,1) als Spalte „erfüllt“. Probelauf: `--routen / --laeufe 1`.
2. kontaktbogen.mjs: `node kontaktbogen.mjs --bilder <ordner oder dateien,kommagetrennt> --ziel <datei.jpg> [--spalten 4] [--titel text]`: baut eine HTML-Seite (Raster, Bildunterschrift = Dateiname, Titel oben), öffnet sie per file:// in Chromium und speichert einen ganzseitigen Screenshot als JPEG (Qualität 70) mit höchstens 1.440 px Breite. Probelauf mit den Bildern aus dem Probelauf von bildsatz.mjs (oder zwei Bildern aus bild.mjs).
3. inventar.mjs: `node inventar.mjs [--basis http://localhost:3000] [--max 2000]`: sammelt Adressen aus /sitemap.xml (und verschachtelten Sitemaps), aus .next/prerender-manifest.json (routes) und aus allen gleichartigen Links der besuchten Seiten (nur derselbe Ursprung, ohne Parameter und Anker). Je Adresse per fetch (redirect: 'manual'): Status, Weiterleitungsziel und Zahl der Sprünge, X-Robots-Tag, und aus dem HTML: title, meta description, meta robots, canonical, h1 (Zahl und Text), og:image, html lang, JSON-LD-Typen (alle @type aus allen script[type="application/ld+json"], Parsefehler als Befund), Wortzahl im main. „indexierbar“ = Status 200, kein noindex in Meta oder Kopf, canonical leer oder gleich der Adresse. Ausgabe: protokolle/inventar-<zeitstempel>.json und .tsv, Zusammenfassung mit Zahlen (gesamt, indexierbar, noindex, Weiterleitungen, Fehlerstatus) und Dubletten (gleicher title, gleiche description, gleiche h1 unter indexierbaren Seiten, je mit Adressen). Höchstens 4 Abrufe gleichzeitig.
4. snippet.mjs: `node snippet.mjs [--inventar <json>]` (Standard: jüngste protokolle/inventar-*.json): misst für jede indexierbare Seite die Titelbreite in Pixeln mit canvas measureText und der Schrift "20px Arial" in Chromium (Arial ist hier durch die metrisch gleiche Liberation Sans ersetzt; prüfe mit `fc-match Arial` und nenne das Ergebnis im Protokoll) und die Länge der Beschreibung in Zeichen. Grenzen: Titel höchstens 580 px; Beschreibung 120 bis 160 Zeichen. Ausgabe je Seite und Zusammenfassung (Anteil erfüllt, längste und kürzeste).
5. Probeläufe: lighthouse.mjs wie oben; kontaktbogen.mjs wie oben; inventar.mjs vollständig (alle Adressen); snippet.mjs auf dem Ergebnis. Logs nach protokolle/E0-PRUEFER-03-<werkzeug>.log.
6. LIESMICH.md änderst du nicht (gehört E0-PRUEFER-02). Nenne unter GEMEINSAME DATEIEN je Werkzeug genau eine Zeile „- `node <werkzeug> …` – Zweck“ für LIESMICH.md.

## 9. Selbstprüfung
Vier Werkzeuge laufen mit Exit 0; Inventar nennt Gesamtzahl und indexierbare Zahl; Snippet-Messung nennt fc-match-Ergebnis.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-03.md mit den Zahlen der Probeläufe (Lighthouse-Werte der Startseite, Inventarzahlen, Snippet-Anteile).

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-03 · BEREIT ZUR RÜCKGABE ===
