# Abnahme Bauwelle 2 der Runde 2 (E6-BEFUND2-H04, -H05, -H06, -H07, -H08, -H09, -H10, -H11, -U-SERVICE, -U-ARTIKEL, -U-STANDORTE)

## Bau
- Workflow `wf_84cad023-2b9`, Basis `d4a1d47`, höchstens 4 Pakete gleichzeitig; H11 nach H10.
- Je Paket Bau, Prüfstufe A und zwei Reparaturen. Berichte und Urteile: `_werkstatt/berichte/E6-BEFUND2-<id>.md`.

## Absturz des Entwicklungsservers
- Während des Baus ist der Entwicklungsserver auf Port 3001 mit einer Turbopack-Panik abgestürzt (`aggregation_update.rs`, Protokoll `/root/sm24-bilder/E6-abnahme-w1/dev-absturz.log`).
- Die Prüfer durften ihn nicht starten. Deshalb lehnten alle elf Pakete in Runde 3 vor allem wegen fehlender Bildbelege ab, nicht wegen Codefehlern.
- Der Orchestrator hat den Server neu gestartet. Code und Bild hat er getrennt geprüft:
  - Code: Typprüfung, Linter, 71 Testdateien mit 1204 Tests, Logikwächter, Wertesuche.
  - Bild: nachgeholt durch elf Haiku-Prüfer, nur prüfend (Workflow `wf_083a04c9-4ad`).
  - Belege der Bildprüfung: `/root/sm24-bilder/E6-BEFUND2-<id>-abnahme/`.

## Ergebnis der Bildprüfung

| Paket | Punkte am Bild erfüllt | muss | soll |
|---|---|---|---|
| H04 | 13 | 0 | 1 |
| H05 | 10 | 2 | 1 |
| H06 | 12 | 0 | 1 |
| H07 | 9 | 2 | 0 |
| H08 | 17 | 1 (Fuß, nur Entwicklungsmodus) | 2 |
| H09 | 11 | 0 | 2 |
| H10 | 9 | 0 | 0 |
| H11 | 11 | 0 | 1 |
| U-SERVICE | 11 | 0 | 1 |
| U-ARTIKEL | 11 | 0 | 1 |
| U-STANDORTE | 9 | 0 | 0 |

## Nacharbeit des Orchestrators
- **H05, seitliches Scrollen bei 390 px (Breite 516 px):** Zwei Ursachen, beide behoben in `shop-liste.tsx`.
  - Die Rasterzelle der Trefferliste wuchs auf die Breite der Sprungleiste. Behoben mit `min-w-0` an der Zelle.
  - Die unsichtbaren Namen der Sprungziele (`sr-only`, absolut) richteten sich nach der klebenden Navigation statt nach der scrollenden Liste und verbreiterten die Seite. Behoben mit `relative` an der Liste.
  - Dazu bricht die Zeile aus Zähler und Filter-Knopf unter 360 px um.
  - Gemessen: Seitenbreite gleich Fensterbreite bei 360 und 390 px. Die Sprungleiste scrollt in sich, mit Anschnitt. Der Pfeil von „Alle n anzeigen“ ist damit wieder im Bild.
- **H07, Leiste bei 390 px:**
  - Die Summenbeschriftung heißt „Summe“ statt „Laufende Summe“ (Mikrotext, Rückfall des Pakets). Die Ausnahme des Logikwächters erlaubt beide Wortlaute.
  - Gemessen: „In den Warenkorb“ einzeilig (176 × 52 px), „Summe“ einzeilig, Seitenbreite 390.
- **H09, Ziffern der Tür-Schutzpunkte mobil 9,5 px (K-008 verlangt mindestens 11,5 px):** Die Ziffer in der Marke ist jetzt 15 Einheiten groß, der Radius bleibt 9. Im Telefon-Ausschnitt sind das rund 11,8 px; Tests unverändert grün.
- **U-SERVICE, doppelte Haarlinie unter der letzten Phase:** Die letzte Zeile der Phasenliste hat keine eigene Linie mehr (`last:border-b-0`).
- **H08, „Platzhalter sichtbar“:** Gemeint ist der Redaktionshinweis im Fuß. Er erscheint nur außerhalb der Produktion (D-018); der Prüfer sah ihn auf dem Entwicklungsserver. Kein Befund.
- **Benannte Ausnahmen des Logikwächters (Darstellung, mit Grund in `logik-ausnahmen.json`):**
  - Kasse und Warenkorb: Rohling-Zeichnung mit festen Parametern.
  - Warenkorb: Versandart als eigene Zeile mit derselben Bedingung.
  - Warenkorb: Metazeile ohne die Anwendung, die den Titel wiederholt.
  - Zylinder-Konfigurator: der Kasten „So messen Sie richtig“ entfällt.
  - Zylinder-Konfigurator: laufende Summe im Band.
  - Ergebnis: 0 abweichend.
- **Entfernte Anzeige mit gleichwertigem Ersatz (G4):**
  - Warenkorb: Die Anwendung der Codeposition wiederholte den Titel. Titel und Schlüsseltyp bleiben.
  - Zylinder-Konfigurator: Titel und Text zum Messen stehen weiter im InfoTip jeder Position. Die Musterzeichnung steht auf der Zylinderseite. Die Zeile „Zylinder richtig ausmessen“ führt zum Abschnitt „Weiterführend“.
  - Codelinien-Seite: Lead und „Was Sie erhalten“ ersetzt die Zeile „Anwendung“ (H06).
  - Daten bleiben unverändert.

## Offen als „soll“, bewusst nicht weiter verfolgt (letzte Runde)
- H04: Bei 390 px bricht die Fehlermeldung unter der PLZ fünfzeilig um. Das betrifft nur den Fehlerzustand; das Feld bleibt lesbar.
- H05: Die Formatspalte bricht bei 768 px zwei- bis dreizeilig um.
- H06: Die Lupe der Fundstelle ist am Desktop kräftiger als der Live-Schlüssel.
- H08: Leerraum links in Abschnitt 01 am Desktop (Bestand). Die Tabelle bei 768 px ist lang.
- H09: Rund 170 px Leerraum unter der Liste am Desktop (Variante A der Paketmessung).
- H11: Die Einleitung im Leerzustand fordert Kontaktdaten. Der Textvorschlag für einen zustandsneutralen Wortlaut liegt vor (D-046).
- U-ARTIKEL: Pflegespray und Fenstergriff zeigen dasselbe Fach-Icon (Paket), weil es kein eigenes Motiv gibt.

## Bestand nach der Nacharbeit
Typprüfung 0, ESLint 0, Vitest 71 Dateien mit 1204 Tests, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme.
