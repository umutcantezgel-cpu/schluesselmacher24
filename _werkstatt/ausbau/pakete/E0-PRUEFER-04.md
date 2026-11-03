# E0-PRUEFER-04 · Neue Werkzeuge: Slop-Scan, Stilprüfer, SVGO-Prüfung, Kontingent

## 1. Kopfzeile
Kennung E0-PRUEFER-04 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse L · Anforderungen: Auftrag 12 (Anti-Slop S1 bis S9), 14 (Schreiben ohne KI-Spuren), 17 (Kontingent), Z-13, Z-21 · Schreibrechte: _werkstatt/ausbau/werkzeuge/slopscan.mjs, stil.mjs, svgo-pruefung.mjs, kontingent.mjs, dazu protokolle/E0-PRUEFER-04-*.log und berichte/E0-PRUEFER-04.md · Umfang: siehe Schritte

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
Baue vier neue Prüfwerkzeuge (Slop-Scan nach S1 bis S8, Stilprüfer nach Abschnitt 14 und S9, SVGO-Prüfung, Kontingent-Schätzung) auf lib.mjs und belege jedes mit einem Probelauf.

## 6. Maßstab
AUFTRAG.md Abschnitt 12 (Anti-Slop S1 bis S9, wörtlich lesen) und Abschnitt 14 (Floskelliste und Schreibregeln, wörtlich lesen) in /home/user/schluesselmacher24/_werkstatt/ausbau/AUFTRAG.md. Stil der Werkzeuge wie a11y.mjs.

## 7. Grenzen
G1, G5, G10 (keine Claude-Code-Einstellungen ändern; Sitzungsprotokolle nur lesen).

## 8. Schritte
1. slopscan.mjs: `node slopscan.mjs [--routen p,p] [--geraet mobil|desktop|beide]` (Standard Hauptansichten, beide). Je Ansicht im Browser messen:
   S1 benutzte Schriftfamilien (berechnete font-family aller Textelemente, erste tatsächlich geladene Familie über document.fonts) gegen die Liste Inter, Geist, Roboto, Open Sans, Lato, Poppins, Montserrat, DM Sans, Manrope, Outfit, Plus Jakarta Sans, Space Grotesk, Satoshi, Playfair Display, Cormorant, Fraunces, Instrument Serif;
   S2 Farben: alle berechneten color, background-color, border-color, fill, stroke sichtbarer Elemente, verglichen mit den aufgelösten Werten aller CSS-Variablen auf :root (Token-Menge); Farben außerhalb der Menge sind Befunde; dazu Klassennamen mit Tailwind-Standardpalette (z. B. bg-indigo-500, text-purple-600: Muster (bg|text|border|from|to|via|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}) und Lila- oder Indigotöne (Farbton 260 bis 330 Grad bei Sättigung über 25 % in HSL);
   S3 Verläufe (background-image mit gradient), Verlaufstext (background-clip text), Glas (backdrop-filter), Leuchtkugeln (filter blur über 20 px auf Flächen), Partikel (canvas-Elemente);
   S4 Icons aus Standard-Sets (Klassen oder Attribute mit lucide, heroicon, fa-, material, bi-, ri-) und Emojis im sichtbaren Text (Unicode Extended_Pictographic);
   S5 Anteil des häufigsten border-radius unter Elementen mit sichtbarem Hintergrund oder Rahmen (Befund über 40 %), Standardschatten (box-shadow-Werte der Tailwind-Voreinstellungen shadow-sm bis shadow-2xl), Hover-Vergrößerung (CSS-Regeln mit :hover und transform scale aus document.styleSheets);
   S6 Raster aus 3 oder mehr gleich gebauten Geschwistern mit Bild oder SVG, Überschrift und Text (Zahl je Ansicht; Befund ab dem zweiten Raster);
   S7 Wellenlinien und Trenner: SVG mit Breite über 90 % des Viewports, Höhe unter 120 px und Pfaden mit Kurvenbefehlen;
   S8 dieselbe Einblendung (gleicher animation-name oder gleicher data-motion-Wert beim Auftritt) auf mehr als einem Drittel der section-Elemente von main.
   Ausgabe: Tabelle Ansicht × S1 bis S8 mit Zahl und Beispielen, Slop-Index je Ansicht = Summe der Befunde, JSON nach protokolle.
2. stil.mjs: `node stil.mjs [--routen p,p | --alle] [--quellen]`: prüft den sichtbaren Text der Ansichten (main und footer, ohne script und style; mit --alle alle indexierbaren Seiten aus dem jüngsten Inventar, falls vorhanden, sonst Hauptansichten) und mit --quellen zusätzlich content/*.json und Zeichenketten in src/**/*.tsx. Regeln aus Abschnitt 14: Gedankenstriche (U+2013, U+2014 und „ - “ zwischen Wörtern), Ausrufezeichen, Emojis, rhetorische Fragen (Satz mit Fragezeichen außerhalb von Überschriften; die Hub-Frage „Wobei können wir Ihnen helfen?“ ist erlaubt), jede Floskel der Liste in Abschnitt 14 (Groß- und Kleinschreibung egal), Dreierreihen von Adjektiven (Muster „Wort, Wort und Wort“ mit Adjektivendungen -ig, -lich, -isch, -bar, -sam, -voll, -los, -ell, -iv; als Hinweis), Bindestriche: jedes Wort mit Bindestrich als Kandidat, ausgenommen Abkürzungen in Großbuchstaben (ABUS-, BKS-, E-Mail, PDF-), Ziffern (2-fach, 24-Stunden), Eigennamen aus einer Liste im Skript (Burg-Wächter, Lahn-Dill-Kreis, Marburg-Biedenkopf, Baden-Württemberg, Nordrhein-Westfalen, Rheinland-Pfalz, Sachsen-Anhalt, Mecklenburg-Vorpommern, Schleswig-Holstein, Coday Web nicht betroffen) und Platzhalter (TODO, FIXME, Lorem, XXX, „[“ gefolgt von Wörtern und „]“, „folgt“, „usw.“, Platzhalter, Max Mustermann, example.com im sichtbaren Text). Ausgabe je Seite Zahl je Regel mit bis zu fünf Fundstellen (Ausschnitt mit 40 Zeichen Umfeld).
3. svgo-pruefung.mjs: `node svgo-pruefung.mjs [dateien…]` (Standard: alle *.svg unter public und src): optimiert jede SVG mit svgo im Speicher (Voreinstellung preset-default, aber mit removeViewBox aus, removeTitle aus, removeDesc aus, cleanupIds aus) und berichtet Bytes vorher und nachher und ob viewBox, title, role und aria-hidden erhalten bleiben; schreibt nichts zurück.
4. kontingent.mjs: `node kontingent.mjs [--seit <ISO-Zeit>] [--kalibrieren <fenster-%> --zeit <ISO-Zeit>]`: liest alle JSONL-Dateien unter /root/.claude/projects (rekursiv) und unter /tmp/claude-0 (rekursiv, Dateien *.output und *.jsonl), summiert aus jedem Eintrag mit message.usage die Token nach Modell (message.model) und Art (input_tokens, cache_creation_input_tokens, cache_read_input_tokens, output_tokens) ab --seit (Standard: Beginn des aktuellen Fensters aus der jüngsten Kalibrierung, sonst vor 5 Stunden). Gewichtung (Standard, im Skript als Konstanten): input 1, cache_creation 1,25, cache_read 0,1, output 5; Modell opus 5, haiku 1, andere 3. Kalibrierung: --kalibrieren speichert (Zeit, gewichtete Summe seit Fensterbeginn, gemessene Prozent) in _werkstatt/ausbau/protokolle/kontingent-kalibrierung.json und berechnet den Faktor Prozent je gewichtetem Token als Mittel der letzten drei Punkte. Ausgabe: gewichtete Summe, geschätzte Prozent (mit Faktor) oder „ohne Kalibrierung“, Aufteilung nach Modell. Doppelt gezählte Einträge (gleiche message.id) nur einmal.
5. Probeläufe: slopscan.mjs --routen / --geraet mobil; stil.mjs --routen /,/autoschluessel; stil.mjs --quellen (nur Zählung); svgo-pruefung.mjs; kontingent.mjs; dann kontingent.mjs --kalibrieren 2 --zeit 2026-11-02T21:23:09Z. Logs nach protokolle/E0-PRUEFER-04-<werkzeug>.log.
6. LIESMICH.md änderst du nicht (gehört E0-PRUEFER-02). Nenne unter GEMEINSAME DATEIEN je Werkzeug genau eine Zeile „- `node <werkzeug> …` – Zweck“ für LIESMICH.md.

## 9. Selbstprüfung
Vier Werkzeuge laufen mit Exit 0; die Floskelliste im Skript ist vollständig gleich der Liste in Abschnitt 14 (zähle beide); kein Werkzeug schreibt in Projektdateien.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-04.md mit den Zahlen der Probeläufe.

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-04 · BEREIT ZUR RÜCKGABE ===
