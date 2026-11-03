# E4-PRUEFER-02 · Prüfung des zweiten Anlaufs am Tor E4

## 1. Kopfzeile
Kennung E4-PRUEFER-02 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse L · Kriterien Z-04, Z-12, Z-14 · Schreibrechte: _werkstatt/ausbau/protokolle/E4-PRUEFER-02/ (Protokolle, Arbeitsbilder), _werkstatt/ausbau/bilder/referenz/ (Referenz-Bildsatz, überschreiben), _werkstatt/ausbau/berichte/E4-PRUEFER-02.md · Umfang: Startseite, /autoschluessel, /autoschluessel/anfrage

## 2. Rollenbriefing
Prüfer: misst und belegt, ändert nichts am Produkt. Fehler: Zahlen ohne Protokoll; Prüfungen lockern; Bilder vor dem Ende des Einstiegs aufnehmen; echte Dienste ansprechen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Prüfe den zweiten Anlauf (Commits 85cdeb6, ea3ee33, c79e3fa, aac4204) im Browser und liefere den neuen Referenz-Bildsatz und die Bilder für die zweite Jury.

## 4. Hintergrund
Geändert: Hub mit Leitkachel ab 768 px und Icons in der Tinte der Seite, Bühne als Zeichenblatt über die rechte Spalte, Texte der Startseite; /autoschluessel mit Ablauf oben und neuer Aufbauzeichnung; Assistent mit Etappen, Vorschlag aus der Suche, beschriftetem Zurück und „Keine Fotos zur Hand?“; Brotkrumen „Startseite“. Der Orchestrator hat bereits geprüft: Build JSON und pg je 224 von 224, Typprüfung und Lint 0, Unit 1997 von 1997, DB 97 von 97. Der Server läuft im JSON-Modus auf http://localhost:3000; nicht bauen, nicht stoppen.

## 5. Regeln (unveränderlich)
- Werkzeuge aus _werkstatt/ausbau/werkzeuge/ (lib.mjs, bildsatz.mjs, a11y.mjs, konsole.mjs, funktionsliste.mjs, bewegung.mjs, werte-suche.mjs, slopscan.mjs); eigene Playwright-Skripte nur im Scratchpad. Jede Anfrage außer localhost abbrechen (G5).
- Referenz-Bildsatz wie in E4-PRUEFER-01 (protokolle/E4-PRUEFER-01/referenz.json): H01, H02, H04 in den fünf Gerätegrößen, erster Bildschirm nach dem Einstieg (mindestens 2,2 s warten), JPEG Qualität 80, das Breitbild 1.920 px auf 1.440 px verkleinert, Dateinamen wie bisher.
- Bilder für die Jury nach protokolle/E4-PRUEFER-02/: bildsatz/ (bildsatz.mjs für /, /autoschluessel, /autoschluessel/anfrage), weg/ (Assistent mobil 390 und Desktop 1440: Schritt 1, 1b Suche „vw golf“ mit Vorschlag, 2 Modell, 3 Baujahr, 8 Schlüsselfotos mit „Keine Fotos zur Hand?“), bildfolgen/ (B-31 bei 0, 200, 400, 800 und 1.200 ms, Band mobil und Bühne Desktop) und ein Kontaktbogen der Bildfolge.

## 6. Maßstab
Jede Zeile mit Wert, Vergleich zu E4-PRUEFER-01 und Urteil grün, gelb oder rot; jedes Bild am vorgesehenen Ort.

## 7. Grenzen
G1, G3 bis G5, G8, G13. Keine Datei unter src/ oder content/ ändern, kein Build, kein Commit.

## 8. Schritte
1. Funktionsliste F-01 bis F-19, Konsole der 14 Hauptansichten, axe nach WCAG 2.2 AA auf den 28 Hauptansichten wie zuvor, dazu die Megamenüs, die Schublade und die Assistent-Schritte 1, 1b, 3 und 8 (mobil und Desktop).
2. Hub-Messung bei 360, 390, 768, 1.440 und 1.920 px: Kacheln über der Aktionsleiste, Zeilen je Kacheltext (höchstens zwei), Anrufen im ersten Bildschirm, Leitkachel ab 768 px über zwei Spalten und zwei Reihen.
3. Bewegung: reduzierte Bewegung als Systemeinstellung (keine Lage- oder Größenänderung), Dauerschleife B-32 mit Pause, Übergang B-35 (Fokus auf der h1 nach Tipp auf „Autoschlüssel“).
4. Bildsatz mit Überlaufprüfung für die drei Ansichten in allen fünf Geräten, Referenz-Bildsatz, Bilder für die Jury, Bildfolge B-31.
5. Werte außerhalb des Designsystems und Slop-Scan auf dem Stand jetzt, Vergleich mit E4-PRUEFER-01.

## 9. Selbstprüfung
15 Referenzbilder neu (Zeitstempel), 10 Bilder unter weg/, 10 Bilder unter bildfolgen/; jede Tabellenzeile mit Protokollpfad; git status zeigt keine Änderung unter src/ oder content/.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E4-PRUEFER-02.md (höchstens 600 Wörter, Tabelle Prüfung · E4-PRUEFER-01 · jetzt · Urteil · Beleg).

## 11. Letzte Zeile
=== ENDE E4-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
