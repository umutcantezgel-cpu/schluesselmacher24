# E6-BEFUND2-H12 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Abnahme durch den Orchestrator: siehe `_werkstatt/berichte/E6-BEFUND2-welle1-abnahme.md` (D-047).

## Befunde der letzten Prüfrunde
- **muss:** Grenze verletzt: Die Runde-1-Belege in /root/sm24-bilder/E6-BEFUND2-H12/ (ratgeber-autoschluessel-verloren-was-tun__desktop__main-header-svg-sm-block__0 bis __4.jpg) sind laut Baumeister-Bericht um 09:55 durch einen eigenen bewegung.mjs-Lauf überschrieben worden. Das Paket verbietet Überschreiben ausdrücklich ("Falsche eigene Ausgaben bleiben liegen; neue in einen neuen Ordner"). Die Belege sind nicht wiederherstellbar. Nicht selbst am Dateistand nachgeprüft.
- **soll:** KERN-Konflikt Abschnittsnummern: Artikel (page.tsx Z. 157-160) und Verzeichnis (Z. 97-100) stehen in text-foreground-muted, wie Paket Punkt 1 verlangt. KERN 1.14 (Primärblau nur für Aktionen und Links) verlangt für nicht klickbare laufende Nummern text-foreground. Der Code folgt dem Paket, die Abweichung ist im Bericht benannt. Entscheidung beim Orchestrator.
- **soll:** Knopf bei 360 px zweizeilig (Breite 320, Höhe 48, Bild v-m360-knopf.jpg). Bei 390 px einzeilig (Breite 350, Höhe 44, Bild v-m390-knopf.jpg), wie Paket Punkt 3 verlangt. Das Paket gibt für 360 px keine Zusage; TEXTVORSCHLAEGE.md Z. 57 bleibt dringlich, Entscheidung beim Orchestrator.
- **hinweis:** ablauf.tsx Z. 34: Kommentar "Polster am Rand und Halbmaß der Hilfslinien" ist sachlich falsch. RASTERFELD ist das Polster, die Hilfslinien überstehen die Bemaßungslinie um 6 Einheiten. Im Bericht als offene Frage geführt, nicht geändert.
- **hinweis:** src/lib/visual/motiv.ts weicht im Diff gegen 69d821308 ab (fachIconFuerMotiv, Commit a1d281d [E6-L-33]). Die Änderung stammt nicht aus diesem Paket. Sie ist vom Paket als nur lesen festgelegt und nicht dem Baumeister zuzurechnen.
- **hinweis:** Die Auftragsangabe nennt KERN 1.14. KERN.md trägt im Kopf und in der Änderungsliste Version 1.15 (Eintrag 1.15 E6 K-007). Geprüft wurde gegen die Datei (1.15); die Registereinträge B-23 und B-24 stimmen mit dem Umsetzungsstand überein.
- **hinweis:** README ablauf: Paket schreibt "Die Gesamtdauer 1,36 s bleibt". Der Baumeister ergänzt "1,36 s bei vier, 1,48 s bei fünf Stationen". Die Rechnung stimmt (0,6 + 4 x 0,12 + 0,4 = 1,48 s, Test "unter 1,6 s" grün). Abweichung vom Wortlaut, sachlich richtig.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H12 · Baumeister · Bericht Runde 2b

GEÄNDERTE DATEIEN
Keine in diesem Lauf. Die Umsetzung aus Runde 2 steht im Stand der Commits (git status sauber). Schreibrechtsdateien: src/app/(site)/ratgeber/[slug]/page.tsx, src/components/visual/generators/ablauf.tsx, src/components/visual/generators/ablauf.test.tsx, src/components/visual/README.md (Abschnitt ablauf).

MUSS-BEFUND: Überschriebene Runde-1-Belege
Mein Lauf mit bewegung.mjs (einzelbilder, Kopf desktop) um 09:55 hat die fünf Runde-1-Ausgaben überschrieben: /root/sm24-bilder/E6-BEFUND2-H12/ratgeber-autoschluessel-verloren-was-tun__desktop__main-header-svg-sm-block__0.jpg bis __4.jpg. Sie sind nicht wiederherstellbar. Die Runde-1-Belege sind nicht mehr nachprüfbar. Ab jetzt gehen Ausgaben nur in neue Ordner. Die neuen Einzelbilder derselben Stelle liegen in /root/sm24-bilder/E6-BEFUND2-H12/runde2b/ (…__desktop__main-header-svg-sm-block__0 bis __4.jpg und …__mobil__main-header-svg-sm-hidden__0 bis __4.jpg). Sie belegen den heutigen Zustand, sie ersetzen nicht die Runde-1-Frames. In diesem Lauf wurde im Paketordner keine Datei überschrieben. Nichts gelöscht.

SOLL-BEFUND: Konflikt Abschnittsnummern und KERN 1.14
Das Paket verlangt text-foreground-muted für die Nummern (page.tsx Z. 157–160 und Verzeichnis Z. 97–100). KERN 1.14 verlangt text-foreground für nicht klickbare laufende Nummern. Der Code folgt dem Paket, nichts geändert. Entscheidung beim Orchestrator.

SOLL-BEFUND: Pflichtbilder (alle in runde2b/)
- Leselinie Trenner 03/04, Nummer 04 primär: d__leselinie-trenner-03-04.jpg. Gemessen: Artikel und Verzeichnis 04 primär, 01–03 muted.
- Leselinie mitten in Abschnitt 02: d__leselinie-abschnitt-02.jpg. Gemessen: 02 primär, übrige muted.
- Fokus Weiterlesen: d__fokus-weiterlesen.jpg. Gemessen: Fokus sichtbar, Pfeil rgb(20,91,184), ohne Fokus rgb(79,90,109).
- Mobil 360 px: m360__kopf.jpg, m360__knopf.jpg. Kopf 320 × 240 (4:3, mittig), Beschriftung 12,8 px. Knopf zweizeilig (Höhe 48), nicht einzeilig. Ergebnis gemeldet.
- Mobil 390 px (Vergleich): m390__kopf.jpg. Kopf 350 × 262,5, Beschriftung 14 px, Knopf einzeilig (Höhe 44).
- Gegenprobe Zylinder mobil: ratgeber-zylinder-richtig-ausmessen__mobil__ganz.jpg. Kein Kasten, Kopf 16:9, unverändert. In Ordnung.
- Gegenprobe Schließanlage desktop: ratgeber-welche-schliessanlage-passt__desktop__ganz.jpg. Fünf Abschnitte, B-24 lückenlos. In Ordnung.
- Ganzseiten und Ansichtsfenster Artikel mobil, tablet, desktop: ratgeber-autoschluessel-verloren-was-tun__…__ganz.jpg und …__mobil/tablet/desktop.jpg.
- Einzelbilder Kopf (Linie, Stationen, Pfeile an den Enden): …__desktop__main-header-svg-sm-block__0…4.jpg und …__mobil__main-header-svg-sm-hidden__0…4.jpg.
Messprotokoll: runde2b/messung-runde2b.json.

TEST-ÄNDERUNGEN, ALT-NEU-LISTE (ablauf.test.tsx)
1. Anzahl it()-Blöcke: Basis 69d821308 = 19, jetzt = 27, also 8 neue. Die frühere Angabe „26 → 27“ war falsch und ist korrigiert.
2. pruefeInnerhalb: Regex für Pfade und Kreise alt /<path([^>]*)\/>/ und /<circle([^>]*)\/>/, neu /<path([^>]*)>/ und /<circle([^>]*)>/. Verschärfung, auch nicht selbstschließende Elemente werden geprüft.
3. Test „fällt bei zu langen oder zu vielen Einträgen auf den Standard zurück“: alt `a|b|c|d|e`, neu `a|b|c|d|e|f` an zwei Stellen. Grund: fünf Stationen sind nach Orchestrator-Vorgabe gültig.
4. Test „hält alle gezeichneten Elemente innerhalb der Fläche“: zwei Fälle ergänzt (FUENF_MIT_VIERZEHN mit und ohne aktiv 5). Bestehende Fälle unverändert.
5. Neu (8): breit mindestens 30 Einheiten vom Rand; breit senkrecht mittig; Pfeilspitzen an den Enden in beiden Formaten; Bemaßungslinie von erster bis letzter Station; schmal Beschriftung waagerecht zentriert; schmal ohne Beschriftung zentriert; fünf Stationen in beiden Formaten; Bemaßungskette bei fünf Stationen.
Keine Prüfung gelockert oder gelöscht.

PRÜFUNG UND ERGEBNIS
- Lock /tmp/sm24-messfenster.lock: vor jeder Prüfung und jedem Bild geprüft, nicht vorhanden.
- npx vitest run src/components src/lib: 67 Dateien, 1159 Tests grün, ablauf.test.tsx 27 grün. Log: /root/sm24-bilder/E6-BEFUND2-H12/vitest-runde2b.txt.
- npx tsc --noEmit: Exitcode 0. Log: /root/sm24-bilder/E6-BEFUND2-H12/tsc-runde2b.txt.
- eslint drei Dateien: Exitcode 0. Log: /root/sm24-bilder/E6-BEFUND2-H12/eslint-runde2b.txt.
- werte-suche.mjs drei Dateien: 0 Funde, 2 Ausnahmen in ablauf.test.tsx Z. 20–21 (Assertions gegen rgb( und oklch(). Log: /root/sm24-bilder/E6-BEFUND2-H12/werte-runde2b.txt und .json.
- Platzhalter (grep auf Port 3001): 0 bei Artikel, Zylinder und Schließanlage.
- Ergebnis: Schnellprüfung grün. Punkte 1 bis 12 sind im Code umgesetzt. Die Bildbelege bestätigen Lesefarbe, Fokus, Trenner und Ablauf. Offen: Knopf bei 360 px zweizeilig.

GEMEINSAME DATEIEN
Keine geändert. Konflikt KERN 1.14 bei den Nummernfarben, siehe oben.

OFFENE FRAGEN
1. Abschnittsnummern: text-foreground-muted (Paket) oder text-foreground (KERN 1.14)? Entscheidung Orchestrator.
2. Knopf bei 360 px zweizeilig (Breite 320, Höhe 48). Bleibt TEXTVORSCHLAEGE.md Z. 57 dringlich?
3. Kommentar ablauf.tsx Z. 34 („Halbmaß der Hilfslinien“) ist sachlich falsch, gemeint ist das Polster. Nicht geändert.
4. Sichtabnahme e5-b/H12 nicht vollständig erneut abgeglichen. Maßgeblich waren Paketwerte und Messungen.

=== ENDE E6-BEFUND2-H12 · BEREIT ZUR RÜCKGABE ===
