# E2-PRUEFER-02 · Berichte aus Workflow wf_a39c6e70-8a1

## E2-PRUEFER-02 Einzelbilder
GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/_werkstatt/werkzeuge/bewegung.mjs (Kopfkommentar, bereitstellen(), ausschnittAktuell(), zeitSetzen(), zweiFramesBrowser(), einzelbilder(), main())
- /home/user/schluesselmacher24/_werkstatt/werkzeuge/LIESMICH.md (nur die Zeilen zu bewegung.mjs einzelbilder, Zeilen 25 und 36)
- Nicht geändert: lib.mjs, reduziert und bildrate, alle src/-Dateien, Server auf Port 3000 (nicht neu gestartet), Port 3100.

WAS UND WARUM
- Standardablauf ist Animationszeit: Nach dem Scrollen wartet das Werkzeug höchstens 5 s auf die Hülle (Vorfahre oder Nachfahre mit data-motion) mit „play“. Danach werden alle endlichen Animationen des Elements und seiner Hülle (ohne CSS-Übergänge) nach ready gesetzt, zwei Frames gewartet, pausiert und je Bild auf dieselbe absolute Zeit gesetzt (currentTime, inkl. Verzögerung). Zeitfenster: kleinste Verzögerung bis größte endliche Endzeit. Unendliche Animationen werden aus dem Fenster genommen, aber mit pausiert. --dauer überschreibt die Länge ab der kleinsten Verzögerung.
- --echtzeit: alter Wanduhr-Ablauf, braucht --dauer. Das Werkzeug zieht --echtzeit vor der Argumentauswertung ab, sonst würde argumente() den folgenden Pfad als Wert verschlucken.
- --rand <px> (Standard 24): Ausschnitt um den Rand erweitert, auf den Sichtbereich begrenzt. Elemente unter 200 × 120 px (eine Seite genügt) werden auf den nächsten Vorfahren mit role="img" oder <svg> erweitert, im Protokoll (erweitert) und in der Ausgabe vermerkt.
- Ausgabe im Animationszeit-Modus: Tabelle mit t ms (Animationszeit) statt Soll/Ist. Echtzeit behält die alte Tabelle.
- Interpretationen: „kleiner als 200 × 120“ als Breite unter 200 oder Höhe unter 120. „Seitengröße“ als Sichtbereich. „Nächstes [data-motion]“ nur als Vorfahre oder Nachfahre, weil die Fallback-Suche in der ersten Probe einen unbeteiligten Abschnitt traf.

GEMEINSAME DATEIEN
- lib.mjs: nicht geändert. Verwendet werden SM24_BASIS_URL und die vorhandene attrappenSetzen-Logik.
- LIESMICH.md: Abschnitt nur für bewegung.mjs geändert.
- Git-Status: von mir sind nur bewegung.mjs, LIESMICH.md und Protokolle bewegung-einzelbilder-2026-10-16_05-4*.json (und -05-41-36, überholt) angelegt. Nicht von mir: _werkstatt/protokolle/E2-PRUEFER-01-ergebnis.md, werte-suche-*.json und die älteren bewegung-einzelbilder-01-25-*.json. Nichts gelöscht, nichts committet.

PRÜFUNG UND ERGEBNIS
- node --check bewegung.mjs: OK.
- Bedienfehler: einzelbilder ohne Pfad exit 2. --echtzeit ohne --dauer exit 2.
- Probe 1 (/, "main section:first-of-type [role=img]", desktop, ziel b01): exit 0. Fenster 300 bis 1600 ms, Animationen 4, unendliche 0, Bilder bei 300, 625, 950, 1275, 1600 ms. Bild 0 ≠ Bild 4 (MD5 363828… ≠ baaa22…).
- Probe 2 (/, "[data-fraesbahn]", ziel b01-klein): exit 0. Erweitert von g (62 × 62 px) auf svg.block. Bilder byte-identisch mit Probe 1. Hülle nicht im Build vorhanden (siehe OFFENE FRAGEN).
- --echtzeit-Vergleich (dauer 1600, ziel b01-echtzeit): exit 0. Soll 0/400/800/1200/1600, Ist 0/401/800/1201/1601. Bilder 2, 3 und 4 sind identisch (MD5 baaa22…). Bei Wanduhr ist der Auftritt schon abgeschlossen, bevor die Bilder entstehen.
- Synthetische Hülle-Prüfung (SM24_BASIS_URL=http://127.0.0.1:3311, Seite und Server nur temporär, Server beendet): Hülle ist nach 0 ms auf play, Fenster 400 bis 1700 ms, unendliche Rotation übersprungen, Bild 0 bis 4 fortlaufend verschieden.
- Port 3000 nach allen Läufen weiter 200. Port 3100 nicht berührt.

BILDBELEGE (Animationszeit, Probe 1; Bilder unter /root/sm24-bilder/E2-PRUEFER-02/b01/)
- Bild 0 (300 ms): Profilrohling mit Gitter, kein Einschnitt, Fräser links außen. Startzustand.
- Bild 1 (625 ms): erster Einschnitt bei 1 bis 2 sichtbar, Fräser bei Einschnitt 2.
- Bild 2 (950 ms): Einschnitte 1 bis 4 teilweise gefräst, Fräser bei 4.
- Bild 3 (1275 ms): Einschnitte bis 5 gefräst, Fräser bei 5 bis 6.
- Bild 4 (1600 ms): alle sechs Einschnitte gefräst, Fräser an der Spitze, Endzustand.
- Echtzeit-Vergleich (b01-echtzeit): Bild 0 zeigt bei 0 ms bereits zwei Einschnitte. Bilder 2 bis 4 sind gleich.
- Synthetische Seite: Kreis wandert von links unten nach unten, Rechteck rotiert, Bilder fortlaufend.
Ordner: /root/sm24-bilder/E2-PRUEFER-02/b01, b01-klein, b01-echtzeit. Kontaktbögen liegen in /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/sheets/.

OFFENE FRAGEN
1. Der laufende Port-3000-Build ist älter als der Quelltext: BUILD_ID vom 2026-10-15 23:18, fraesbahn-bewegung.tsx vom 2026-10-16 03:19. Die Hülle (data-motion) fehlt im ausgelieferten HTML. Der echte Hülle-Pfad ist deshalb nicht verifiziert. Empfehlung: Orchestrator baut neu (SM24_DATA=json npx next build) und wiederholt Probe 2. Ich habe weder neu gebaut noch den Server neu gestartet.
2. Bitte bestätigen: nächste [data-motion] nur als Vorfahre oder Nachfahre (so umgesetzt), oder Dokumentreihenfolge wie im Paket.
3. Bitte bestätigen: „kleiner als 200 × 120“ als „eine Seite unter Grenze“ (umgesetzt) statt beide Seiten.
4. Probe 1 und Probe 2 sind identisch, weil beide dieselbe Grafik-svg erfassen. Wenn Probe 2 eine eigene Grafik zeigen soll, braucht es ein anderes Ziel.

=== ENDE E2-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
