# E0-PRUEFER-07 · Vorher-Stand Prüfstufe B, Teil 1: Bilder, Zugänglichkeit, Konsole, Bewegung

## 1. Kopfzeile
Kennung E0-PRUEFER-07 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse L · Anforderungen: Auftrag 16 (Prüfstufe B), 18 E0 (Vorher-Stand), Z-04, Z-12, Z-14 · Schreibrechte: _werkstatt/ausbau/bilder/vorher/** (nur Kontaktbögen und höchstens 24 Einzelbilder, JPEG, höchstens 1.440 px breit), _werkstatt/ausbau/bilder/arbeit/** (alles Übrige), protokolle/E0-vorher-*.json und *.log, berichte/E0-PRUEFER-07.md · Umfang: 14 Hauptansichten × 5 Geräte

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst keine Projektdatei.

## 3. Aufgabe in einem Satz
Erhebe für die 14 Hauptansichten den Vorher-Stand mit Bildsatz und Überlaufprüfung in allen fünf Gerätegrößen, axe nach WCAG 2.2 AA (auch mit offenem Menü), Konsolenfehlern, reduzierter Bewegung und Kontaktbögen.

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
Bringe die aus Commit b8e7ea7 übernommenen Prüfwerkzeuge in _werkstatt/ausbau/werkzeuge mit der angepassten lib.mjs zum Laufen und belege jedes mit einem kurzen Probelauf gegen den Produktionsserver.
- Die 14 Hauptansichten stehen in lib.mjs (HAUPTANSICHTEN). Werkzeuge nacheinander starten, nie parallel (Rechenlast).

## 6. Maßstab
_werkstatt/ausbau/werkzeuge/LIESMICH.md (Aufrufe), Probeläufe in protokolle/E0-PRUEFER-02-*.log.

## 7. Grenzen
G5, G8. Keine Projektbefehle; der Server läuft.

## 8. Schritte
1. `node bildsatz.mjs --ziel /home/user/schluesselmacher24/_werkstatt/ausbau/bilder/arbeit/vorher` (alle Hauptansichten, alle Geräte; nutzt der Bildsatz nicht alle fünf Geräte aus lib.mjs, rufe ihn je Gerät auf). Protokoll nach protokolle/E0-vorher-bildsatz.json. Notiere je Ansicht und Gerät: Seitenhöhe, horizontaler Überlauf ja/nein.
2. Kontaktbögen: Gibt es werkzeuge/kontaktbogen.mjs, nutze es; sonst baue die Bögen mit einer kleinen HTML-Seite in deinem Arbeitsordner und Chromium aus lib.mjs (browserStarten). Je Gerät ein Bogen mit dem ersten Bildschirm jeder Hauptansicht (14 Felder), JPEG Qualität 70, höchstens 1.440 px breit, nach bilder/vorher/kontaktbogen-<geraet>.jpg (5 Dateien). Dazu höchstens 19 Einzelbilder des ersten Bildschirms für mobil und desktop der wichtigsten Ansichten (H01 bis H05, H09, H11, H12, H13, H14) nach bilder/vorher/ (Namen <id>-<geraet>.jpg).
3. Hub-Messung für Z-04 (Vorher): auf / bei 360 × 780, 390 × 844 und 1440 × 900: Wie viele Kacheln des Schnelleinstiegs sind ohne Scrollen vollständig sichtbar (Bounding-Box innerhalb des Viewports)? Wo steht die Überschrift „Wobei können wir helfen?“ (y in px)? Welches Element ist das größte (LCP-Kandidat über PerformanceObserver largest-contentful-paint) mit Größe und Zeit?
4. `node a11y.mjs --geraet beide --json …/protokolle/E0-vorher-a11y.json` über alle Hauptansichten; dazu je einmal mit offenem mobilem Menü auf / (Knopf „Menü öffnen“) und mit offenem Megamenü am Desktop (Bereich „Autoschlüssel“ in der Hauptnavigation), falls a11y.mjs das nicht kann, mit einem kurzen eigenen Skript in deinem Arbeitsordner unter /tmp nach demselben Muster (axe-core aus werkzeuge/node_modules). Zähle Befunde nach Schwere (critical, serious, moderate, minor) je Ansicht.
5. `node konsole.mjs --json …/protokolle/E0-vorher-konsole.json` über alle Hauptansichten.
6. `node bewegung.mjs reduziert --json …/protokolle/E0-vorher-reduziert.json` über alle Hauptansichten.
7. `node animationen.mjs --geraet mobil --json …/protokolle/E0-vorher-animationen.json` über alle Hauptansichten.
8. `node svg-pruefung.mjs --json …/protokolle/E0-vorher-svg.json`.

## 9. Selbstprüfung
Jede der 14 Ansichten in jedem Schritt; Zahlen aus den Protokollen; höchstens 24 Bilder in bilder/vorher (zähle), alle höchstens 1.440 px breit (prüfe mit `file` oder Python).

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-07.md: Tabelle je Ansicht (Überlauf je Gerät, axe nach Schwere, Konsolenfehler, Befunde reduziert, Animationen), Hub-Messung, Pfade der Kontaktbögen.

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-07 · BEREIT ZUR RÜCKGABE ===
