# E0-PRUEFER-06 · Funktionsliste als Bestandsschutz erweitern

## 1. Kopfzeile
Kennung E0-PRUEFER-06 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 2 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Z-02 (Funktionsliste vollständig, keine Funktion schlechter), Auftrag 18 E0 (Funktionsliste als Bestandsschutz) · Schreibrechte: _werkstatt/ausbau/werkzeuge/funktionsliste.mjs, protokolle/E0-PRUEFER-06-*.log, berichte/E0-PRUEFER-06.md · Umfang: fünf neue Funktionen F-15 bis F-19 und ein Gesamtlauf

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst keine Projektdatei.

## 3. Aufgabe in einem Satz
Ergänze funktionsliste.mjs um die Funktionen des Bestands, die F-01 bis F-14 noch nicht prüfen, und belege mit einem Gesamtlauf F-01 bis F-19 den Ausgangsstand.

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
- Bestehende Prüfungen F-01 bis F-14 bleiben unverändert in ihrer Strenge (G8). Neue Prüfungen folgen ihrem Muster (Rollen und sichtbare Namen statt CSS-Selektoren, attrappenSetzen, PRUEF_EMAIL aus lib.mjs für jede Eingabe einer E-Mail, erfundene Testdaten).

## 6. Maßstab
Muster: die Funktionen f04 (Assistent), f07 (weitere Abläufe) und f08 (Terminstatus) in funktionsliste.mjs. Wege und Felder: _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-02-wege.md Abschnitt 3.

## 7. Grenzen
G5: Jede Absendung wird von attrappenSetzen abgefangen; prüfe im Protokoll, dass die Absendung als Attrappe vermerkt ist. Keine echten Daten.

## 8. Schritte
1. F-15 Partner werden: /partner-werden, alle fünf Schritte mit erfundenen Daten (Firma „Testschlüsseldienst Muster“, PLZ 35578, Ort Wetzlar, Radius), Datenschutz bestätigen, Absenden; Erwartung: Bestätigung oder abgefangene schreibende Anfrage mit Prüf-E-Mail.
2. F-16 Widerruf erklären: /rechtliches/widerruf/erklaeren, Name, PRUEF_EMAIL, Absenden; Erwartung wie oben.
3. F-17 Codesuche und Kategorien: /schluessel-nach-code, Suche nach einem Code oder einer Serie aus content/code-lines.json (lies eine Kennung aus der Datei), Ergebnis zeigt die Linie; eine Kategorie-Seite (/schluessel-nach-code/kategorie/briefkasten-und-postanlagen) listet mindestens eine Linie.
4. F-18 Fahrzeugwahl: /autoschluessel/marken → Volkswagen → Golf; die Modellseite enthält einen Link in den Termin mit marke und modell; nach dem Klick ist im Assistenten die Marke vorausgewählt (sichtbarer Text oder ausgewählte Option).
5. F-19 Kontakt und Vor-Ort: /service-und-termin/kontakt zeigt Telefon und E-Mail als Links (tel:, mailto:); /service-und-termin/vor-ort zeigt mindestens einen Verweis in eine Anfrage; /schluessel-einschicken zeigt den Weg zur Foto-Anfrage.
6. Trage F-15 bis F-19 in die Liste am Ende von funktionsliste.mjs ein (gleiches Format wie F-01 bis F-14).
7. Gesamtlauf: `node funktionsliste.mjs --json /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E0-funktionsliste-vorher.json` (alle 19) und zusätzlich `node funktionsliste.mjs --tastatur --nur F-04,F-05,F-11 --json /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E0-funktionsliste-tastatur-vorher.json`. Logs nach protokolle/E0-PRUEFER-06-*.log.

## 9. Selbstprüfung
19 Funktionen mit Ergebnis; jede neue Funktion prüft mindestens drei Dinge; keine bestehende Prüfung geändert (`git diff` der Datei zeigt nur Ergänzungen außerhalb von f01 bis f14).

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-06.md mit Tabelle Funktion · Ergebnis · Prüfpunkte · Dauer.

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-06 · BEREIT ZUR RÜCKGABE ===
