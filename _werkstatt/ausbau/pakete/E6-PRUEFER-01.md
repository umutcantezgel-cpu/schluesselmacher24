# E6-PRUEFER-01 · Prüfstufe B Etappe E6 mit Prüfliste der E6-Anforderungen

## 1. Kopfzeile
Kennung E6-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse L · Kriterien Z-02, Z-08, Z-14 · Schreibrechte: _werkstatt/ausbau/protokolle/E6-PRUEFER-01/ (Protokolle, Arbeitsbilder), _werkstatt/ausbau/berichte/E6-PRUEFER-01.md · Umfang: alles, was E6 geändert hat (`git log --oneline 0957390..HEAD -- src content`), mit Schwerpunkt auf den neuen Rubriken und Anfragewegen

## 2. Rollenbriefing
Prüfer: misst und belegt, ändert nichts am Produkt. Fehler: Zahlen ohne Protokoll; Prüfungen lockern; Bilder vor dem Ende des Einstiegs aufnehmen; echte Dienste ansprechen; absenden oder bezahlen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Prüfe die Etappe E6 nach Prüfstufe B und hake die Prüfliste der E6-Anforderungen im Browser ab, jeweils mit Beleg.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar (Next.js 16, React 19, Payload 3 auf Postgres; ohne Datenbank liest die Seite content/*.json). In E6 kamen der Hub mit zwölf Rubriken im ersten Bildschirm, ein gemeinsamer Ablauf je Rubrik mit gemeinsamer Bestätigung, Schlüssel einschicken mit Begleitschein, Motorradschlüssel und Autoschlüssel-Gehäuse als Anfrage, Kontakt mit Fotos, Beratung mit Rückruf, Vor Ort mit Einsatz-Anfrage und Berechtigungsnachweis, die Foto-Anfrage mit gezeichneten Beispielen und „Nach Code bestellen“ an den Treffern der Codesuche. Dazu das Vorgangsblatt für die neuen Vorgangsarten und der Kundenstatus in einfacher Sprache im Terminstatus (/service-und-termin/terminstatus). E6-OPUS-03 (G-18) ist zurückgestellt (A-036, A-037): vermerken, nicht als Fehler werten. Alle Projektbefehle laufen über die Datenweiche.

## 5. Kern-Auszug (unveränderlich)
- Prüfstufe B laut Auftrag Abschnitt 17: Build im JSON-Modus und mit lokalem Postgres, Typprüfung, Linter, ganze Testsuite einschließlich Datenbanktests, Konsolenfehler, Funktionsliste (F-01 bis F-19), Bildsatz mit Überlaufprüfung in allen Gerätegrößen (360 × 780, 390 × 844, 768 × 1024, 1440 × 900, 1920 × 1080), axe nach WCAG 2.2 AA auch mit offenem Menü und in mindestens fünf neuen Anfrageformularen, Lighthouse als Median aus drei Läufen mobil, reduzierte Bewegung, Werte außerhalb des Designsystems, Slop-Scan (Gedankenstriche im Bestand laut berichte/E6-BAUMEISTER-05-07.md und berichte/E6-OPUS-04.md als Bestand vermerken, neue getrennt zählen), Inventar der indexierbaren Seiten, Strukturdaten.
- Prüfliste (Wortlaut in _werkstatt/ausbau/ANFORDERUNGEN.json): G-10, G-11, G-19, G-20, G-23, G-24, G-25, G-26, G-33, G-34, G-36, G-37, G-38, G-40, G-41, G-45. Je Punkt: erfüllt, teilweise oder nicht, mit Bild und Fundstelle. G-18 als „zurückgestellt“ aufführen.
- Hub-Prüfung: bei 390 × 844 alle zwölf Kacheln im ersten Bildschirm (zählen, Bild).
- Vergleich: Werte aus E5 (_werkstatt/ausbau/berichte/E5-PRUEFER-01.md). Grün heißt: Builds und Typprüfung erfolgreich, keine neue Lint-Warnung, Tests mindestens so viele bestanden wie zuletzt (Unit 2226, DB 97) und keiner rot, keine neuen axe-Verstöße, Lighthouse nicht schlechter als in E5 um mehr als die Messstreuung (nenne sie), keine neuen Überläufe. Das LCP-Budget misst du nach A-032 (Median aus drei Läufen, Standard-Simulation).
- Werkzeuge: _werkstatt/ausbau/werkzeuge/LIESMICH.md; Datenweiche `sicher.sh --json` beziehungsweise `--pg`; Prüfserver `werkzeuge/server.sh start|stop|status` (JSON-Modus, Port 3000, setzt einen frischen Build voraus).

## 6. Maßstab
Bericht mit Tabelle Prüfung · E5 · E6 · Urteil (grün, gelb, rot) · Beleg (Protokollpfad), danach die Prüfliste mit Urteil und Beleg. Jede Abweichung mit Ansicht, Gerät und Bildpfad; bei Rot der vermutliche Commit, ohne zu reparieren.

## 7. Grenzen
G3, G4, G5, G8. Nichts reparieren, nichts lockern, keine Projektdatei ändern. Nie absenden, nie bezahlen (Anfrage und Kasse nur bis vor den letzten Knopf). Prüfserver nach jedem Build wieder starten.

## 8. Schritte
1. `server.sh stop`, `sicher.sh --pg -- npm run build`, `sicher.sh --json -- npm run build`, `server.sh start`.
2. `npm run typecheck`, `npm run lint`, `npm run test:unit`, `sicher.sh --pg -- npm run test:db`.
3. Werkzeuge gegen den Prüfserver: konsole.mjs, funktionsliste.mjs, bildsatz.mjs (Hub, die zwölf Rubrikseiten, alle fünf Geräte), a11y.mjs (wie Abschnitt 5), lighthouse.mjs (Start, /autoschluessel, /schluessel-einschicken, /service-und-termin/vor-ort, /schluessel-nach-code; drei Läufe mobil), bewegung.mjs reduziert, werte-suche.mjs, slopscan.mjs, inventar.mjs.
4. Prüfliste im Browser (Playwright, `werkzeuge/lib.mjs` mit Attrappen, alle Anfragen außer localhost abbrechen).
5. Bericht.

## 9. Selbstprüfung
Jede Prüfung aus Abschnitt 5 hat eine Zeile mit E5-Wert, E6-Wert, Urteil und Beleg; Lighthouse als Median aus drei Läufen; jede Zeile der Prüfliste mit Bild; keine Projektdatei geändert (`git status --short` zeigt nur _werkstatt/ausbau).

## 10. Ausgabe
Protokolle wie in den Schreibrechten; Bericht nach _werkstatt/ausbau/berichte/E6-PRUEFER-01.md (höchstens 900 Wörter).

## 11. Letzte Zeile
=== ENDE E6-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
