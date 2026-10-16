# E4-GRAFIKER-09 · Bericht und Abnahme

Workflow `wf_be39e9e0-a87`, 1 Prüfrunde(n), bestanden. Abnahme durch den Orchestrator: Bilder angesehen (generalhaupt 2/6 breit und schmal, mit und ohne Reserve). Gemeinsame Dateien umgesetzt: `schliessplan` in `SCHMALES_FORMAT`; die schmale Fassung hat in `ImagePlaceholder` Vorrang vor einem Ausschnitt (Test); README ergänzt. Offene Frage 1 (breit mit 8 Türen und Reserve verkleinert) entfällt auf Telefonen, weil dort die schmale Fassung gilt. Offene Frage 2 („frei“ unter der Tür): bestätigt.

## Prüfurteil

- **soll:** Breit mit 8 Türen und reserve 2 (10 Blätter) wird auf 358 px auf rund 0,74 verkleinert; die Beschriftungen liegen dann bei etwa 8 px (Bild /root/sm24-bilder/E4-GRAFIKER-09-pruefung-r1/varianten/breit_gh48_r2-358px.png). Das ist die offene Frage 1 des Baumeisters. Auf Telefonen wirkt das nur, solange das breite Format dort gezeigt wird; die Registry-Umschaltung ist noch nicht eingetragen (siehe nächster Befund).
- **hinweis:** Gemeinsame Dateien des Orchestrators sind im Arbeitsbaum noch nicht umgesetzt: src/components/visual/registry.tsx Zeile 49 enthält SCHMALES_FORMAT nur mit 'zylinder-mass' (ohne 'schliessplan'); src/components/visual/README.md Zeile 162 trägt noch „viewBox 0 0 480 300“ ohne reserve und format. Bis dahin zeigt ImagePlaceholder unter 640 px die breite Fassung.
- **hinweis:** Schmal mit 10 Blättern (generalhaupt, gruppen 4, tueren 8, reserve 2): die beiden „frei“-Beschriftungen unter den Reservetüren stehen mit kaum mehr als 5 Einheiten Abstand nebeneinander, überlappen aber nicht (Bild /root/sm24-bilder/E4-GRAFIKER-09-pruefung-r1/varianten/schmal_gh48_r2-358px.png). Platzierung unter der Tür wird als lesbar bewertet; Bestätigung ist offene Frage 2 des Baumeisters.
- **hinweis:** Logikwächter (node _werkstatt/werkzeuge/logikwaechter.mjs pruefen) meldet Exit 3 „nicht im Protokoll“ für beide Dateien. Beide Dateien stehen nicht auf der GESCHUETZTE-Liste, daher ist das kein Logikbefund. Ich habe nichts gesichert, um keine Protokolldatei zu schreiben. Die Diff-Lesung zeigt nur Darstellungs- und Parameteränderungen.
- **hinweis:** Die Seite /schliessanlagen zeigt weder reserve noch format schmal (system-erklaerung nutzt haupt und generalhaupt ohne reserve, SchliessplanInteraktiv bleibt breit). Die Varianten habe ich deshalb über eingesetztes SVG-Markup auf dem Dev-Server bei 358 px geprüft; sie liegen unter /root/sm24-bilder/E4-GRAFIKER-09-pruefung-r1/varianten/.
- **hinweis:** Tablet- und Desktop-Ganzseiten wurden nur im oberen Bereich im Detail gesichtet (Kopf, Einleitung, Schlüsselkarten); dort kein Überlauf und nichts abgeschnitten. Die Schließplan-Figuren im unteren Teil der Seite liegen im breiten Format und sind unverändert. Die Mobil-Ganzseite zeigt im Abschnitt Systeme und Gleichschließung saubere Figuren ohne Animationsmitte.
- **hinweis:** Schmal Haupt mit reserve 2 und Markierung e2 (/root/sm24-bilder/E4-GRAFIKER-09-pruefung-r1/varianten/schmal_haupt4_r2_e2-358px.png): Markierung, Türhervorhebung und Dimmung der Reserve sind korrekt; die gestrichelten Leitungen bleiben erkennbar.

## Bericht des Grafikers

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/visual/generators/schliessplan.tsx
- /home/user/schluesselmacher24/src/components/visual/generators/schliessplan.test.tsx

WAS UND WARUM
- reserve (ganze Zahl 0–2, Standard 0; nur bei haupt und generalhaupt, sonst ohne Wirkung): Reserveplätze sind je ein gestrichelter ES-Kasten mit gestrichelter Tür und gestrichelter Leitung (strokeDasharray "4 3", Klassen stroke-border-strong und fill-surface). Bei haupt hängen sie an der Wurzel, bei generalhaupt an der letzten Gruppe. Die Beschriftung ist „frei“ in fill-foreground-muted und Mono. Reserveplätze sind nicht wählbar: markiert und tuer ignorieren sie, und die Liste aus schliessplanSchluessel enthält sie nicht. Für die Leitungen dient die vorhandene Klasse sm24-fade, die Knoten nutzen sm24-pop, beide mit der Ebenenverzögerung; es gibt keine neue Bewegung.
- format 'schmal' (Standard breit): 360 Einheiten breit, Rand 12, Schrift 12, Kürzel mittig im Kasten ohne Symbol, Kastenbreite nach Text (8 + Zeichen × 7,2), Türen 22 breit. Die Höhe ist 2 × Rand + 46 × Ebenen (162 bei 3 Ebenen, 116 bei 2, 254 bei 5). Das schmale Format wird nie verkleinert, weil sonst die Schrift unter die Vorgabe fiele. Unbekannte Formatnamen fallen auf breit zurück (Groß- und Kleinschreibung egal). Markierung, Ausschnitt und Schlüsselliste gelten für beide Formate.
- Breit: Die Maße laufen jetzt über eine Flächenbeschreibung (Flaeche), die breiten Werte sind unverändert (480, 300, 20, 13, 26, 22, 32, 56, 84, 88). Die Ausgabe ist Zeichen für Zeichen gleich (siehe Prüfung).
- Tests: Die 23 bestehenden Prüfungen bleiben unverändert. pruefeVertrag nimmt optional Breite und Höhe an, die Standardwerte 480 × 300 gelten wie bisher. Neu sind 11 Prüfungen (34 insgesamt): Reserve gestrichelt und an der richtigen Stelle, Reserve nicht wählbar, ohne Reserve und bei zentral oder gleichschliessung unverändert, Begrenzung auf 0–2, schmales Format mit eigener viewBox und Höhe, Schrift mindestens 11,5 px bei 358 px Breite in sieben Fällen (darunter 2 Gruppen, 6 Türen, reserve 2), keine Verkleinerung, Knoten innerhalb der Fläche und ohne Überlappung, „frei“ unter der Tür mit Markierung, Ausschnitt im schmalen Format, Formatrückfall und Determinismus.

GEMEINSAME DATEIEN (Orchestrator)
1. src/components/visual/registry.tsx: 'schliessplan' in SCHMALES_FORMAT eintragen, damit ImagePlaceholder unter 640 px die schmale Fassung zeigt. schmaleFassung setzt format: 'schmal', der Generator nimmt das an.
2. src/components/visual/README.md (Abschnitt schliessplan, Zeile 161 ff.): Überschrift „viewBox 0 0 480 300“ durch breit 480 × 300 und schmal 360 × 162 bis 254 (Höhe nach Ebenen) ersetzen. Parameter-Zeilen für reserve (0–2, nur haupt und generalhaupt, Standard 0) und format (breit · schmal, Standard breit) ergänzen.
3. Nicht geändert: SchliessplanInteraktiv, Registry, README, KERN, Seiten. Die Exporte schliessplanAusschnitt und schliessplanSchluessel behalten ihre Form.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: ohne Fehler (gesamtes Projekt).
- npx eslint der zwei Dateien: ohne Befund, Exit 0.
- npx vitest run src/components/visual: 24 Dateien, 742 Tests grün. schliessplan.test.tsx: 34 statt 23, die Zahl sinkt nicht.
- werte-suche der zwei Dateien: keine Funde. Zwei Ausnahmen in der Testdatei (Zeilen 23 und 24: rgb( und oklch( als Prüfstrings im bestehenden Vertrag).
- Regressionsprüfung breit: Ein esbuild-Bundle mit react-dom/server rendert 2 359 Fälle (4 Systeme × tueren 2–8 × gruppen 1–4 × 7 Markierungs- und Sonderfälle, dazu Unsinnswerte). Hash der Grafik, des Ausschnitts und der Schlüsselliste sind vor und nach der Änderung identisch, diff leer. Die Musterausgabe ist ebenfalls identisch.
- Schrift schmal: 12 × 358/360 = 11,93 px (Vorgabe 11,5); auf 390 px rund 13 px. Keine Verkleinerung im schmalen Format.
- Formsystem: keine id, keine Hexwerte, keine rgb- oder oklch-Werte, keine Marker. Striche nur aus der Skala (KONTUR, LINIE, LINIE_STARK, HILFSLINIE). Gestrichelt über die Konstante '4 3'.
- Bewegung: keine neue Dauer, Gesamtdauer wie bisher.
- Lock /tmp/sm24-messfenster.lock: nicht vorhanden, geprüft vor vitest und abschließend.
- Prettier: Das Projekt hat kein Prettier-Gate. Auch die HEAD-Version scheitert am Standardcheck, der Stil folgt dem Bestand.
- Keine Datei gelöscht, nichts committet oder gepusht. Hilfsdateien nur unter /root/sm24-bilder/E4-GRAFIKER-09/.

BILDBELEGE
Darstellung im Dev-Server-Kontext (localhost:3001/schliessanlagen, Mobilansicht, SVG-Markup eingesetzt, 358 px Breite). Dateien unter /root/sm24-bilder/E4-GRAFIKER-09/bilder/:
- gh26-breit-ohne-358px.png
- gh26-breit-reserve2-358px.png
- gh26-schmal-ohne-358px.png
- gh26-schmal-reserve2-358px.png
- gh48-schmal-reserve2-358px.png (4 Gruppen, 8 Türen, reserve 2, engster Fall)
- haupt4-schmal-reserve2-markiert-r-358px.png (Markierung e2 mit Reserve, Reserve gedimmt)
- breit-ausschnitt-vergroessert.png (Ausschnitt 400 % mit „frei“ im breiten Format)
Befund: Reserve und Leitungen sind gestrichelt, die Beschriftung ist lesbar, keine Überlappung. Die Varianten wurden über die Dev-Seite gezeigt statt als SVG-Dateien, das ist nach Schritt 4 zulässig.

OFFENE FRAGEN
1. Breit mit reserve: Bei 8 Türen und reserve 2 entstehen 10 Blätter. Das Sicherheitsnetz verkleinert die breite Zeichnung dann auf rund 0,8 (Schrift rund 10 px bei 480 Einheiten). Breit ist nicht an die Telefonregel gebunden; ob das so bleibt, entscheidet der Orchestrator.
2. Schmal: „frei“ steht unter der Reservetür statt im Kasten, weil das Wort bei 10 Blättern nicht neben die Nachbarn passt. Bitte bestätigen oder eine andere Platzierung wünschen.
3. Schmal: Die Höhe folgt der Zahl der Ebenen. Die Bildstelle muss das wechselnde Seitenverhältnis tragen.
4. SchliessplanInteraktiv nutzt weiter das breite Format. Ob es unter 640 px auf schmal umschaltet, liegt außerhalb dieses Pakets und ist nicht umgesetzt.
5. Zentral im schmalen Format ist nur über Tests belegt (Grenzen, Schrift, Überlappung), nicht über ein Bild.
6. Im Arbeitsbaum liegen fremde Änderungen (src/components/layout/page-header.tsx geändert, page-header.test.tsx neu, ein werte-suche-Protokoll unter _werkstatt/protokolle). Ich habe sie nicht angefasst.

=== ENDE E4-GRAFIKER-09 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Breit mit reserve: Bei 8 Türen und reserve 2 entstehen 10 Blätter. Das Sicherheitsnetz verkleinert die breite Zeichnung dann auf rund 0,8 (Schrift rund 10 px bei 480 Einheiten). Breit ist nicht an die Telefonregel gebunden; ob das so bleibt, entscheidet der Orchestrator.
- Schmal: 'frei' steht unter der Reservetür statt im Kasten, weil das Wort bei 10 Blättern nicht zwischen die Nachbarn passt. Die Schrift (12) und die Farbe folgen dem Auftrag. Bitte bestätigen oder die Platzierung anders wünschen.
- Schmal: Die Höhe ist nach der Zahl der Ebenen gewählt (162 bei 3, 116 bei 2, 254 bei 5). Die Bildstelle muss das wechselnde Seitenverhältnis tragen; der Ausschnitt für SchliessplanInteraktiv ist davon nicht betroffen.
- SchliessplanInteraktiv nutzt weiter das breite Format und ist unverändert (Exporte, Verträge und tsc unverändert). Ob es unter 640 px auf schmal umschaltet, liegt außerhalb dieses Pakets und ist nicht umgesetzt.
- Zentral im schmalen Format ist nur über Tests (Grenzen, Schriftgröße, Überlappung) belegt, nicht über ein Bild.
- Im Arbeitsbaum liegen fremde Änderungen (src/components/layout/page-header.tsx geändert, src/components/layout/page-header.test.tsx neu, ein werte-suche-Protokoll unter _werkstatt/protokolle). Ich habe sie nicht angefasst und nichts davon gemeldet, weil dort kein Fehler auftrat.
