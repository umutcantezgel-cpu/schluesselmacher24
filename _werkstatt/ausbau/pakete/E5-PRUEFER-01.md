# E5-PRUEFER-01 · Prüfstufe B Etappe E5 mit Prüfliste G-27 bis G-30

## 1. Kopfzeile
Kennung E5-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse L · Kriterien Z-06, Z-14 · Schreibrechte: _werkstatt/ausbau/protokolle/E5-PRUEFER-01/ (Protokolle, Arbeitsbilder), _werkstatt/ausbau/berichte/E5-PRUEFER-01.md · Umfang: alles, was E5 geändert hat (`git log --oneline 3ba4b61~40..HEAD -- src content`), mit Schwerpunkt Konfiguratoren

## 2. Rollenbriefing
Prüfer: misst und belegt, ändert nichts am Produkt. Fehler: Zahlen ohne Protokoll; Prüfungen lockern; Bilder vor dem Ende des Einstiegs aufnehmen; echte Dienste ansprechen; absenden oder bezahlen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Prüfe die Etappe E5 nach Prüfstufe B und hake die Prüfliste G-27 bis G-30 im Browser ab, jeweils mit Beleg.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar (Next.js 16, React 19, Payload 3 auf Postgres; ohne Datenbank liest die Seite content/*.json). In E5 kamen der Schließplan-Planer (/schliessanlagen/konfigurator/schliessplan: Türen, Schlüssel, Matrix, Maßprüfung, Warenkorb oder Anfrage, Link, PDF unter …/schliessplan/pdf), der Schnappschuss des Plans im Vorgang mit Vorgangsblatt-PDF, der Sperrschließungs-Konfigurator auf dem Kern (Link, Hinweis ab elf Zylindern, Maßrückfragen, Laienerklärung) und neue Texte dazu. Dazu der Feinschliff von Startseite (Hub ohne Trennung ab 768 px, zwei Spalten ab 1280 px, Bühne hochkant, „Warum bei uns“ im Autoschlüssel-Abschnitt) und Assistent (ein Zähler, einzeiliger Kopf mobil, ruhigerer Fotoschritt). Leistung: zod aus dem Browser, kein Vorladen des Versandkosten-Links. Alle Projektbefehle laufen über die Datenweiche.

## 5. Kern-Auszug (unveränderlich)
- Prüfstufe B laut Auftrag Abschnitt 17: Build im JSON-Modus und mit lokalem Postgres, Typprüfung, Linter, ganze Testsuite einschließlich Datenbanktests, Konsolenfehler, Funktionsliste (F-01 bis F-19), Bildsatz mit Überlaufprüfung in allen Gerätegrößen (360 × 780, 390 × 844, 768 × 1024, 1440 × 900, 1920 × 1080), axe nach WCAG 2.2 AA auch mit offenen Menüs und in beiden Konfiguratoren (Planer in den Schritten Türen, Schlüssel, Prüfen, Abschluss), Lighthouse als Median aus drei Läufen mobil, reduzierte Bewegung, Werte außerhalb des Designsystems, Slop-Scan, Inventar der indexierbaren Seiten, Strukturdaten.
- Prüfliste (Wortlaut in _werkstatt/ausbau/ANFORDERUNGEN.json): G-27 Schließanlagen-Konfigurator nach dem Schließplan-Prinzip (Tür mit Bauform, Schutz, Maßen, Funktion; Schlüssel mit Anzahl und Vormerkung; Matrix; laufender Gesamtpreis; bearbeitbare Liste; Schließplan als PDF; Systemdaten ABUS und BKS fehlen nach MA-22, das ist zu vermerken, nicht als Fehler). G-28 Sperrschließung: Sets 2 bis 10, mehr auf Anfrage, jeder Zylinder einzeln, Schlüsselzahl wählbar. G-29 Messhilfe mit Grafik, Plausibilitätsprüfung, Pflichtbestätigung „Maße geprüft“, Rückfrage bei Auffälligkeiten. G-30 Empfehlung Privat oder Unternehmen mit Beratung als Ausweg. Je Punkt: erfüllt, teilweise oder nicht, mit Bild und Fundstelle.
- Vergleich: Werte aus E4 (_werkstatt/ausbau/berichte/E4-PRUEFER-02.md) und E0. Grün heißt: Builds und Typprüfung erfolgreich, keine neue Lint-Warnung, Tests mindestens so viele bestanden wie vorher und keiner rot, keine neuen axe-Verstöße, Lighthouse nicht schlechter als in E4 um mehr als die Messstreuung (nenne sie), keine neuen Überläufe. Das LCP-Budget misst du nach A-032 (Median aus drei Läufen, Standard-Simulation).
- Werkzeuge: _werkstatt/ausbau/werkzeuge/LIESMICH.md; Datenweiche `sicher.sh --json` beziehungsweise `--pg`; Prüfserver `werkzeuge/server.sh start|stop|status` (JSON-Modus, Port 3000, setzt einen frischen Build voraus).

## 6. Maßstab
Bericht mit Tabelle Prüfung · E4 · E5 · Urteil (grün, gelb, rot) · Beleg (Protokollpfad), danach die Prüfliste G-27 bis G-30 mit Urteil und Beleg. Jede Abweichung mit Ansicht, Gerät und Bildpfad; bei Rot der vermutliche Commit, ohne zu reparieren.

## 7. Grenzen
G3, G4, G5, G8. Nichts reparieren, nichts lockern, keine Projektdatei ändern. Nie absenden, nie bezahlen (Anfrage und Kasse nur bis vor den letzten Knopf). Prüfserver nach jedem Build wieder starten.

## 8. Schritte
1. `server.sh stop`, `sicher.sh --pg -- npm run build`, `sicher.sh --json -- npm run build`, `server.sh start`.
2. `npm run typecheck`, `npm run lint`, `npm run test:unit`, `sicher.sh --pg -- npm run test:db`.
3. Werkzeuge gegen den Prüfserver: konsole.mjs, funktionsliste.mjs, bildsatz.mjs (Hauptansichten und beide Konfiguratoren, alle fünf Geräte), a11y.mjs (wie Abschnitt 5), lighthouse.mjs (Start, /autoschluessel, /autoschluessel/anfrage, /gleichschliessende-zylinder/konfigurator, /schliessanlagen/konfigurator/schliessplan; drei Läufe mobil), bewegung.mjs reduziert, werte-suche.mjs, slopscan.mjs, inventar.mjs.
4. Prüfliste G-27 bis G-30 im Browser (Playwright), dazu einmal das Schließplan-PDF abrufen (Statuscode, Inhaltstyp, Seitenzahl) mit einem Plan aus dem Link des Planers.
5. Bericht.

## 9. Selbstprüfung
Jede Prüfung aus Abschnitt 5 hat eine Zeile mit E4-Wert, E5-Wert, Urteil und Beleg; Lighthouse als Median aus drei Läufen; jede Zeile der Prüfliste mit Bild; keine Projektdatei geändert (`git status --short` zeigt nur _werkstatt/ausbau).

## 10. Ausgabe
Protokolle wie in den Schreibrechten; Bericht nach _werkstatt/ausbau/berichte/E5-PRUEFER-01.md (höchstens 900 Wörter).

## 11. Letzte Zeile
=== ENDE E5-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
