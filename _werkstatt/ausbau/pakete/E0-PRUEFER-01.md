# E0-PRUEFER-01 · Einrichtung und Bestandsaufnahme der Prüfwege

## 1. Kopfzeile
Kennung E0-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Auftrag 8.4, 16, Z-02, Z-20 · Schreibrechte: _werkstatt/ausbau/protokolle/einrichtung.md, _werkstatt/ausbau/protokolle/E0-PRUEFER-01-*.log, _werkstatt/ausbau/berichte/E0-PRUEFER-01.md, dazu die von den Befehlen selbst erzeugten Ordner (node_modules, .next, .data, media, private-uploads) · Umfang: Installation, fünf Prüfwege, ein Server, ein Protokoll

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler, die du vermeidest: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Installiere das Projekt nach Lockfile und stelle über die Datenweiche fest, ob Typprüfung, Linter, Unit-Tests, Datenbanktests, Build ohne Datenbank, Build mit lokalem Postgres, Livegang-Prüfung und der Produktionsserver laufen, mit Zahlen, Dauer und Exit-Code je Schritt.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
- Datenweiche (Auftrag 8.4): Jeder Projektbefehl läuft nur über _werkstatt/ausbau/werkzeuge/sicher.sh. Als root führt sie den Befehl als Nutzer ubuntu aus und stellt mit --pg ein Postgres auf 127.0.0.1:5433 bereit (initdb lehnt root ab). Die Datenbanktests starten ihre eigene Instanz auf Port 5434.
- Grün heißt: Build, Typprüfung und Tests nicht schlechter als in diesem Ausgangsstand. Dein Ergebnis IST der Ausgangsstand; berichte genau.

## 6. Maßstab
- Projektskripte: /home/user/schluesselmacher24/package.json (scripts), scripts/build.mjs, scripts/db.mjs, src/test/db-global-setup.ts.
- Frühere Einrichtung als Vorbild: `git -C /home/user/schluesselmacher24 show b8e7ea7:_werkstatt/werkzeuge/LIESMICH.md` und `git … show b8e7ea7:_werkstatt/werkzeuge/server.sh`.

## 7. Grenzen
G2 (kein Git-Schreiben), G4 (keine .env, nur Datenweiche), G5 (keine Außenwirkung), G8 (nichts abschalten oder lockern). Wenn ein Schritt scheitert, reparierst du nichts im Projekt, sondern protokollierst Fehler und erste Fehlerzeilen.

## 8. Schritte (in dieser Reihenfolge, jeder Befehl mit `time`, Ausgabe nach protokolle/E0-PRUEFER-01-<schritt>.log)
Kurzform: S=/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh ; P=/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle
1. `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.test.sh` ausführen. Erwartung „alle Fälle bestanden“. Log: $P/E0-PRUEFER-01-datenweiche.log.
2. Installation: `cd /home/user/schluesselmacher24 && $S --json -- npm ci --no-audit --no-fund`. Lange Befehle startest du mit run_in_background und wartest mit kurzen Statusabfragen (tail des Logs), statt über 10 Minuten im Vordergrund zu blockieren. Log: install.
3. Typprüfung: `$S --json -- npm run typecheck`. Log: typecheck. Zähle Fehler.
4. Linter: `$S --json -- npm run lint`. Log: lint. Zähle Fehler und Warnungen.
5. Unit-Tests: `$S --json -- npm run test:unit`. Log: unit. Notiere Testdateien und Tests (bestanden, fehlgeschlagen, übersprungen).
6. Datenbanktests: `$S --pg -- npm run test:db`. Log: db. Notiere Testdateien und Tests. Scheitern sie an Rechten oder initdb, notiere die erste Fehlerzeile und versuche genau einmal `$S --pg -- npx vitest run -c vitest.db.config.ts`.
7. Build mit lokalem Postgres: `$S --pg -- npm run build`. Log: build-pg. Notiere je Teilschritt aus scripts/build.mjs (Migrationen, Seed, Erster Backend-Zugang, Livegang-Prüfung, Next.js-Build) Erfolg oder Fehler und die Zahl der erzeugten Seiten (Zeile mit „Generating static pages“ oder die Routentabelle am Ende).
8. Livegang-Prüfung allein: `$S --pg -- npm run pruefen:livegang`. Log: livegang. Liste jede gemeldete Lücke mit ihrem Wortlaut (das sind erwartete Menschensachen).
9. Build ohne Datenbank (zuletzt, damit .next danach der JSON-Build ist): `$S --json -- npm run build`. Log: build-json. Zahl der Seiten, Dauer, Warnungen.
10. Server: `$S --json -- npx next start -p 3000` im Hintergrund (run_in_background). Prüfe mit `curl -s -o /dev/null -w '%{http_code} %{time_total}\n' http://localhost:3000/` und genauso für /autoschluessel, /schluessel-nach-code, /kasse, /admin und /gibt-es-nicht. Notiere Statuscodes. Lass den Server laufen.
11. Prüfe das Protokoll der Datenweiche: `tail -n 20 $P/datenweiche.log`; jede Zeile muss „hosts=localhost“ tragen. Notiere die Zahl der Zeilen deines Laufs und ob eine ABBRUCH-Zeile darunter ist.
12. Schreibe protokolle/einrichtung.md: die exakten Befehle der Schritte 1, 2, 9 und 10 als Anleitung für eine neu aufgesetzte Umgebung, dazu, was bei einem Fehlschlag zu tun ist. Höchstens 40 Zeilen.
13. Schreibe berichte/E0-PRUEFER-01.md mit einer Tabelle: Schritt · Befehl · Exit-Code · Dauer · Ergebnis in Zahlen · Log-Pfad.

## 9. Schnellprüfung und Selbstprüfung
Jeder Schritt hat Log und Exit-Code; Zahlen sind aus den Logs abgelesen, nicht geschätzt; nichts außerhalb der Schreibrechte geändert (prüfe mit `git -C /home/user/schluesselmacher24 status --short`, erwartet: keine geänderten Projektdateien; neue, ignorierte Ordner sind in Ordnung; liste jede Abweichung).

## 10. Ausgabeformular
Nach _GEMEINSAM.md, Bericht in berichte/E0-PRUEFER-01.md.

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
