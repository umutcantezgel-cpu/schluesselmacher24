# E0-PRUEFER-08 · Vorher-Stand Prüfstufe B, Teil 2: Leistung, Inventar, Snippets, Slop, Stil

## 1. Kopfzeile
Kennung E0-PRUEFER-08 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse L · Anforderungen: Auftrag 16 (Prüfstufe B), 18 E0, Z-13, Z-15, Z-16 · Schreibrechte: protokolle/E0-vorher-*.json, *.tsv und *.log, _werkstatt/ausbau/SLOP-AUDIT.md (neu), berichte/E0-PRUEFER-08.md · Umfang: 14 Hauptansichten, alle indexierbaren Seiten für Inventar und Snippets

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst keine Projektdatei.

## 3. Aufgabe in einem Satz
Erhebe den Vorher-Stand für Leistung (Lighthouse und eigene Messung, Median aus drei Läufen), Inventar aller Seiten, Snippet-Längen, Slop-Index und Stilbefunde, und lege SLOP-AUDIT.md mit dem Vorher-Index an.

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
- Messungen nur am Produktionsserver, Median aus drei Läufen, nacheinander und ohne andere Last (prüfe mit `uptime`, dass die Last unter 2 liegt, sonst warte kurz).

## 6. Maßstab
_werkstatt/ausbau/werkzeuge/LIESMICH.md; Budgets in AUFTRAG.md Abschnitt 0 (BUDGETS).

## 7. Grenzen
G5, G8.

## 8. Schritte
1. `node lighthouse.mjs --laeufe 3 --profil mobil --json …/protokolle/E0-vorher-lighthouse-mobil.json` und dasselbe mit `--profil desktop`.
2. `node messung.mjs --laeufe 3 --profil beide --json …/protokolle/E0-vorher-messung.json` (LCP, CLS, INP-Näherung, TBT, JS-Menge). Notiere zusätzlich die Spanne (Min bis Max) je Wert, sie ist der Maßstab für Z-15.
3. `node inventar.mjs --json …/protokolle/E0-vorher-inventar.json` (alle Adressen) und `node snippet.mjs --inventar …/protokolle/E0-vorher-inventar.json --json …/protokolle/E0-vorher-snippet.json`.
4. `node slopscan.mjs --geraet beide --json …/protokolle/E0-vorher-slop.json` über alle Hauptansichten.
5. `node stil.mjs --alle --json …/protokolle/E0-vorher-stil.json` und `node stil.mjs --quellen --json …/protokolle/E0-vorher-stil-quellen.json`.
6. Lege _werkstatt/ausbau/SLOP-AUDIT.md an: Kopf mit Methode (Werkzeuge, Datum), Tabelle je Hauptansicht mit S1 bis S9 (S9 aus stil.mjs: Gedankenstriche, Floskeln, unnötige Bindestriche, Ausrufezeichen, Platzhalter) und Slop-Index vorher; leere Spalte „nachher“.

## 9. Selbstprüfung
Lighthouse und Messung je Ansicht mit drei Läufen; Inventar mit Gesamtzahl und indexierbarer Zahl; SLOP-AUDIT.md mit 14 Zeilen.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-08.md: Tabelle je Ansicht (Lighthouse-Kategorien mobil und desktop, LCP, CLS, INP, TBT mit Spanne, Budget erfüllt), Inventarzahlen, Snippet-Anteile, Slop-Index, Stilzahlen.

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-08 · BEREIT ZUR RÜCKGABE ===
