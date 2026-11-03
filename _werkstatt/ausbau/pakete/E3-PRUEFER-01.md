# E3-PRUEFER-01 · Prüfstufe B Etappe E3

## 1. Kopfzeile
Kennung E3-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 2 · Kern 2.1 · Kostenklasse L · Kriterien Z-02, Z-20 · Schreibrechte: _werkstatt/ausbau/protokolle/E3-PRUEFER-01-*.log, _werkstatt/ausbau/protokolle/E3-PRUEFER-01/ (Bilder, Json), _werkstatt/ausbau/berichte/E3-PRUEFER-01.md · Umfang: alle Prüfungen der Prüfstufe B für den Stand nach Etappe E3

## 2. Rollenbriefing
Prüfer: prüft nach seiner Stufe und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten; eine Prüfung weglassen oder lockern.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei und kein Werkzeug.

## 3. Aufgabe in einem Satz
Führe die Prüfstufe B für den Stand nach Etappe E3 aus und vergleiche jede Messung mit dem Vorher-Stand aus E0, damit klar ist, ob der Bestand mindestens so gut ist wie vorher.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar. Technisch Next.js 16.4.4 mit React 19.3.1, TypeScript strikt, Tailwind 3.4 und Payload 3.92.1 auf Postgres (angehoben in E3-UPGRADE-01, Commit 978a830); ohne Datenbank liest die Seite content/*.json. In E3 kamen hinzu: Farben in OKLCH mit neuen Bereichstönen, Schriften IBM Plex lokal statt Inter (Fließtext 17 px), ein Bewegungsschalter im Fuß (`html[data-bewegung]`), das Vorgangsblatt als PDF, ein Versand-Adapter mit Begleitschein, der Fahrzeugkatalog (624 Reihen), Konfigurator-Kern, Partner-Modelle und neue Sammlungen (Rubriken, Fahrzeugreihen, Partnerbetriebe) mit Migrationen. Alle Projektbefehle laufen über die Datenweiche. Kein echter Versand, keine echte Zahlung (G5).

## 5. Kern-Auszug (unveränderlich)
- Prüfstufe B laut Auftrag Abschnitt 17: Build im JSON-Modus und mit lokalem Postgres, Typprüfung, Linter, ganze Testsuite einschließlich Datenbanktests, Konsolenfehler, Funktionsliste, Bildsatz mit Überlaufprüfung in allen Gerätegrößen (360 × 780, 390 × 844, 768 × 1024, 1440 × 900, 1920 × 1080), axe nach WCAG 2.2 AA auch mit offenen Menüs, Dialogen und Konfiguratoren, Lighthouse als Median aus drei Läufen am Produktions-Build, reduzierte Bewegung, Werte außerhalb des Designsystems, Slop-Scan, Inventar der indexierbaren Seiten, Strukturdaten.
- Werkzeuge und Aufrufe: _werkstatt/ausbau/werkzeuge/LIESMICH.md; Datenweiche `sicher.sh --json` beziehungsweise `--pg`; Prüfserver `werkzeuge/server.sh start|stop|status` (JSON-Modus, Port 3000, setzt einen frischen Build voraus).
- Vergleich: Vorher-Werte aus den Berichten und Protokollen von E0 (_werkstatt/ausbau/berichte/E0-PRUEFER-0*.md, _werkstatt/ausbau/protokolle/E0-PRUEFER-0*). Grün heißt: Build und Typprüfung erfolgreich, keine neue Lint-Warnung, Tests mindestens so viele bestanden wie in E0 und keiner rot, keine neuen axe-Verstöße, Lighthouse nicht schlechter als in E0 um mehr als die Messstreuung (nenne sie), keine neuen Überläufe.
- Neu zu prüfen: Bewegungsschalter (Standard „an“, Klick „ruhig“ bleibt nach Neuladen, ohne JavaScript ausgeblendet; reduzierte Bewegung ergibt „ruhig“), Slop-Scan S1 (keine Schrift aus der Liste, insbesondere kein Inter) und S2 (keine Farbe außerhalb der Tokens, kein Lila), Strukturdaten der Detailseiten Sicherheitstechnik und Tür- und Schließtechnik (WebPage und BreadcrumbList).

## 6. Maßstab
Bericht mit Tabelle Prüfung · E0 · E3 · Urteil (grün, gelb, rot) · Beleg (Protokollpfad). Jede Abweichung mit Ansicht, Gerät und Bildpfad. Bei Rot: welche Änderung es vermutlich verursacht (Commit aus `git log --oneline` seit dem Stand von E0), ohne zu reparieren.

## 7. Grenzen
G3, G4, G5, G8. Nichts reparieren, nichts lockern, keine Projektdatei ändern. Prüfserver nach jedem Build wieder starten.

## 8. Schritte
1. Builds in dieser Reihenfolge: `server.sh stop`, dann `sicher.sh --pg -- npm run build`, dann der Admin-Rauchtest (Schritt 1a), dann `sicher.sh --json -- npm run build` und `server.sh start`. So läuft der Prüfserver am Ende auf dem JSON-Build.
1a. Admin-Rauchtest im pg-Modus (neu nach dem Payload-Update; in E0 lieferte /admin 200): `SICHER_PORT=3001 sicher.sh --pg -- npx next start -p 3001` im Hintergrund mit Protokoll nach `protokolle/E3-PRUEFER-01-admin.log`; warten, bis Port 3001 antwortet (höchstens 60 s). Dann Statuscode und Ziel von /admin und /admin/login (curl ohne Folgen der Weiterleitung, dann mit), und mit Playwright /admin/login öffnen: Konsolenfehler zählen, Bild nach `protokolle/E3-PRUEFER-01/admin-login.png`. Keine Anmeldung, kein Konto anlegen. Danach `pkill -f "next start -p 3001"` und prüfen, dass Port 3001 frei ist.
2. `npm run typecheck`, `npm run lint`, `npm run test:unit`, `sicher.sh --pg -- npm run test:db`.
3. Werkzeuge gegen den laufenden Prüfserver: konsole.mjs, funktionsliste.mjs (F-01 bis F-14), bildsatz.mjs (alle Hauptansichten, alle fünf Geräte), a11y.mjs (Hauptansichten mobil und Desktop, dazu offene Schublade, offenes Megamenü, beide Konfiguratoren), lighthouse.mjs (Startseite, /autoschluessel, /schluessel-nach-code, /gleichschliessende-zylinder/konfigurator, Median aus drei Läufen mobil), bewegung.mjs reduziert, werte-suche.mjs, slopscan.mjs, inventar.mjs, Strukturdaten der zwei Detailseiten.
4. Bewegungsschalter von Hand im Browser (Playwright) wie in Abschnitt 5.
5. Bericht.

## 9. Selbstprüfung
Jede Prüfung aus Abschnitt 5 und der Admin-Rauchtest haben eine Zeile mit E0-Wert, E3-Wert, Urteil und Beleg; Lighthouse als Median aus drei Läufen; keine Projektdatei geändert (`git status --short` zeigt nur _werkstatt/ausbau).

## 10. Ausgabe
Protokolle wie in den Schreibrechten; Bericht nach _werkstatt/ausbau/berichte/E3-PRUEFER-01.md (höchstens 900 Wörter).

## 11. Letzte Zeile
=== ENDE E3-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
