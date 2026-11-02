# E0-PRUEFER-02 · Übernommene Werkzeuge in Gang setzen

## 1. Kopfzeile
Kennung E0-PRUEFER-02 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Auftrag 16 (Werkzeuge zuerst aus der Historie), 18 E0 · Schreibrechte: alle Dateien in _werkstatt/ausbau/werkzeuge AUSSER lib.mjs, sicher.sh, sicher.test.sh, server.sh, package.json; dazu _werkstatt/ausbau/protokolle/E0-PRUEFER-02-*.log und berichte/E0-PRUEFER-02.md · Umfang: siehe Schritte

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
Bringe die aus Commit b8e7ea7 übernommenen Prüfwerkzeuge in _werkstatt/ausbau/werkzeuge mit der angepassten lib.mjs zum Laufen und belege jedes mit einem kurzen Probelauf gegen den Produktionsserver.

## 6. Maßstab
_werkstatt/ausbau/werkzeuge/LIESMICH.md (alte Beschreibung, du aktualisierst sie), lib.mjs (angepasst: REPO, WERKSTATT=_werkstatt/ausbau, CHROMIUM, Geräte mit fünf Größen mobil-klein 360, mobil 390, tablet 768, desktop 1440, breit 1920).

## 7. Grenzen
G4, G5, G8. Kein Projektbefehl außer über die Datenweiche; der Server läuft schon oder wird mit server.sh gestartet.

## 8. Schritte
1. Prüfe, dass werkzeuge/node_modules auf /root/sm24-werkzeuge/node_modules zeigt und axe-core, lighthouse und svgo darin liegen (ls). Log: protokolle/E0-PRUEFER-02-install.log.
2. Server prüfen: `server.sh status`; läuft er nicht, `server.sh start` (setzt einen Build voraus; gibt es keinen, brich ab und melde es).
3. Für jedes Werkzeug einen Probelauf mit genau einer Route und einem Gerät, Ausgabe nach protokolle/E0-PRUEFER-02-<werkzeug>.log, in dieser Reihenfolge:
   a. `node bild.mjs / --geraet mobil`
   b. `node bildsatz.mjs --routen /,/kasse --max 2`
   c. `node konsole.mjs --routen /`
   d. `node a11y.mjs --routen / --geraet mobil` (stellt a11y.mjs von @axe-core/playwright auf axe-core um: das Skript liest node_modules/axe-core/axe.min.js, fügt es per page.addScriptTag({ content }) ein und ruft `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } })` in page.evaluate auf; Ausgabe unverändert)
   e. `node svg-pruefung.mjs --routen /`
   f. `node werte-suche.mjs` (ohne Browser)
   g. `node messung.mjs --routen / --laeufe 1 --profil mobil`
   h. `node ladeweg.mjs --routen / --laeufe 1`
   i. `node bewegung.mjs reduziert --routen /`
   j. `node animationen.mjs --routen / --geraet mobil`
   k. `node textabzug.mjs` (Hilfe lesen: Kopfkommentar; einen lesenden Modus ausführen)
   l. `node gefuellt.mjs` (Kopfkommentar lesen, Probelauf nach Beschreibung)
   m. `node logikwaechter.mjs` (Kopfkommentar lesen, Probelauf nach Beschreibung)
   n. `node funktionsliste.mjs --nur F-01` (die Funktionsliste beschreibt den Stand vom Oktober; scheitern einzelne Funktionen an geänderten Seiten, notiere je Funktion F-01 bis F-14 Ergebnis und Grund, ohne die Prüfungen aufzuweichen)
4. Scheitert ein Werkzeug an Pfaden, Importen, Selektoren oder Versionen, behebe genau das in der Werkzeugdatei (nicht in lib.mjs) und wiederhole den Probelauf höchstens zweimal. Werkzeuge, die danach noch scheitern, markierst du mit Grund.
5. Aktualisiere LIESMICH.md: Einrichtung (Befehle aus dem Kern-Auszug), je Werkzeug Aufruf und Zweck in einer Zeile, Stand je Werkzeug (läuft, läuft mit Einschränkung, scheitert mit Grund).

## 9. Selbstprüfung
14 Werkzeuge mit Ergebnis; jede Änderung an einer Werkzeugdatei begründet; `git -C /home/user/schluesselmacher24 status --short` zeigt nur Dateien unter _werkstatt/ausbau.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-02.md mit Tabelle Werkzeug · Probelauf · Ergebnis · Änderung · Log.

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
