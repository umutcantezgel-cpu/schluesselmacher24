# Bericht FA-SOFORT-05A · Vier Fach-Icons für die Hauptzugänge

## GEÄNDERTE DATEIEN
- neu: `src/components/visual/icons/roller.tsx` (`IconRoller`)
- neu: `src/components/visual/icons/e-scooter.tsx` (`IconEScooter`)
- neu: `src/components/visual/icons/seniorenmobil.tsx` (`IconSeniorenmobil`)
- neu: `src/components/visual/icons/fahrradschluessel.tsx` (`IconFahrradschluessel`)
- geändert: `src/components/visual/fach-icon.tsx` (nur die vier Importe und vier Registry-Einträge, alphabetisch eingeordnet)
- geändert: `src/components/visual/icons/icons.test.tsx` (vier Importe, vier Einträge in `ICONS`; die Familien-Tests greifen dann auf alle vier)
- Hilfsdateien (nicht committet): `_werkstatt/ausbau/bilder/arbeit/` mit `sichtpruefung.tsx`, `sicht.cjs`, `sichtpruefung.html`, `sichtpruefung.png`, `foto.cjs`

## WAS UND WARUM
- Vier Icons nach dem Formsystem: 48er-Raster, `IconBase`, Kontur in `currentColor`, je eine Zweitonfläche mit `fill-area-muted` und `stroke="none"`, runde Enden, keine Farben, keine Verläufe, keine Animation, je sechs Formen oder weniger, je ein einzeiliger Kommentar.
- Roller: Lenker mit Beinschild, Sitzbank, Trittbrett, Radkasten, zwei Räder. Unterscheidbar vom Motorradschlüssel.
- E-Scooter: Tretroller mit hoher Lenkstange, flachem Trittbrett, zwei kleinen Rädern und einem Blitz als Zeichen für Elektroantrieb.
- Seniorenmobil: Elektromobil mit hoher Lehne, Sitz, Lenksäule, großem Hinterrad und kleinem Vorderrad. Zunächst zu sehr wie ein Stuhl, deshalb Lehne verlängert und Chassis ergänzt.
- Fahrradschlüssel: Hinterrad mit Rahmenstrebe, Bügelschloss am Rahmen, Schlüssel unten rechts mit Bart rechts.
- Keine fremden Icon-Sets, keine nachgezeichneten Marken, keine neue Bibliothek, kein Eintrag in `rubriken.ts` (laut Paket Sache des Orchestrators zusammen mit der Migration).
- Register `FACH_ICON_REGISTRY` und `hub.test.tsx` (Ordner und Registry müssen gleich sein) stimmen überein.

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run src/components/visual src/components/hub/hub.test.tsx`: 33 Dateien, 962 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- Sichtprüfung: Vergleichsseite mit den vier Icons und `motorradschluessel` und `autoschluessel` in 48 px und 24 px, über Playwright (Chromium, lokale Datei, kein Netz). Ergebnis im Bild: Roller, E-Scooter und Fahrradschlüssel sind in 24 px erkennbar; Seniorenmobil nach der Nachbesserung erkennbar; keine Linie verlässt das Raster (alle Formen liegen innerhalb 3 bis 45).
- Schreibrecht: `_werkstatt/ausbau/bilder/arbeit/` war root-eigen und für den Nutzer ubuntu nicht schreibbar. Ich habe nur diesen Ordner mit `chmod -R a+rwX` beschreibbar gemacht (innerhalb der Schreibrechte des Pakets).

## BELEGE
- Kontrollbild: `/home/user/schluesselmacher24/_werkstatt/ausbau/bilder/arbeit/sichtpruefung.png`

## OFFENE FRAGEN
- Der Fahrradschlüssel ist in 24 px nur an der Form des Schlüssels zu erkennen; das Schloss und das Rad tragen die Aussage. Der Inhaber oder der Orchestrator sollte entscheiden, ob das reicht oder der Schlüssel größer werden soll.
- Der Roller ist in 24 px etwas kantig (Sitzkasten). Erkennbar, aber nicht so fein wie die Bestandsicons; eine zweite Runde ist möglich, wenn der Orchestrator das verlangt.
- Die Zuordnung der vier Icons zu den Kacheln (`RUBRIK_ICONS` in `src/lib/rubriken.ts`) ist nicht erledigt; das liegt laut Paket beim Orchestrator zusammen mit der Migration.

## NACHBESSERUNG

Acht gelbe und keine roten Befunde aus der Gegenprüfung. Sieben trafen zu und sind behoben, einer (Befund 7) trifft zu und ist nicht behoben, weil die Datei außerhalb der Schreibrechte des Pakets liegt.

- Befund 1, Seniorenmobil wirkt wie Rollstuhl oder Bürostuhl: **behoben.** Silhouette neu nach Vorschlag: flaches Chassis mit zwei gleich kleinen Rädern (je r=4, Mitte 12/38 und 38/38), Sitz mit Lehne direkt auf dem Chassis, Lenksäule mit Griff vorn. Im Kontrollbild in 24 px nicht mehr als Rollstuhl zu lesen. Restzweifel: in 24 px bleibt es eher ein kleines Fahrzeug auf Rädern als ein eindeutiges Seniorenmobil; siehe offene Frage.
- Befund 2, Zweitonfläche um 2 Einheiten versetzt: **behoben.** Fläche `M15 23h13v7H15z` liegt jetzt deckungsgleich im Sitz (x 15 bis 28, y 23 bis 30).
- Befund 3, Fahrradschlüssel: Strebe endet bei x=27 und erreicht das Schloss nicht; Kommentar stimmt nicht: **behoben.** Rad jetzt Mitte 12/31 r=9, Rahmenstrebe `M12 31L21 22H30` führt bis an die Ecke des Schlosses (x=30, y=22). Sattel ergänzt (`M21 22L18 16M14 16h8`). Kommentar angepasst.
- Befund 4, Roller: Sitzbank zu groß und Kotflügel schneidet die Sitzbank: **behoben.** Sitzbank jetzt x 20 bis 35, y 21 bis 24 mit gerundeter Hinterkante. Kotflügel konzentrisch zum Hinterrad (Mitte 38/36, r=7, `M31 36a7 7 0 0 1 14 0`). Keine Kreuzung mehr.
- Befund 5, E-Scooter: Lenkstange endet am Trittbrett, Räder ohne Verbindung: **behoben.** Lenkstange bis zur Vorderradnabe (`M34 10L38 38`), Trittbrett auf die Radoberkante gesetzt (y=34), Räder berühren das Brett.
- Befund 6, Importgruppe in icons.test.tsx zerrissen: **behoben.** Die vier Importe „Kleinstfahrzeuge & Fahrrad“ stehen jetzt als eigene Gruppe nach `IconMotorradschluessel`, nicht mehr zwischen Klappschlüssel und Funkschlüssel.
- Befund 7, README nennt „54 Dateien in icons/“: **zutreffend, nicht behoben.** Es sind 65 Dateien ohne `icon-base` und Tests. `src/components/visual/README.md` liegt außerhalb der Schreibrechte des Pakets. Korrektur beim Orchestrator-Commit (auf 65 oder ohne Zahl).
- Befund 8, Zweitonfläche nicht geprüft, weil die CSS-Klasse im Kontrollbild fehlte: **behoben.** Die Sichtprüfung (`sichtpruefung.tsx`) hat jetzt die Regel `.fill-area-muted{fill:#cfe0f5}`. Das Bild wurde mit Playwright neu erzeugt; die Zweitonflächen sind sichtbar und liegen innerhalb der Konturen. Der Befund ist mit Befund 2 erledigt.
- Befund 9, Schlüsselring schneidet das Rad: **behoben.** Ring jetzt Mitte 28/40 r=3 (`M25 40a3 3 0 1 0 6 0a3 3 0 1 0-6 0`), Schaft `M31 40h12`, Zähne bei x=37 und x=42. Abstand Ringmitte zu Radmitte rund 18,4, Summe der Radien 12, also kein Überlappen.

Prüfung nach der Nachbesserung, jeweils über `_werkstatt/ausbau/werkzeuge/sicher.sh --json --`:
- `npx vitest run src/components/visual`: 32 Dateien, 945 Tests, alle grün.
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler.
- Kontrollbild neu erzeugt: `/home/user/schluesselmacher24/_werkstatt/ausbau/bilder/arbeit/sichtpruefung.png` (48 px und 24 px, mit Zweitonfarbe).

Hinweis zum Abschnitt „WAS UND WARUM“ oben: Die Beschreibung der Seniorenmobil-Silhouette („hohe Lehne, Chassis ergänzt“) und des Radkastens beim Roller entspricht nicht mehr dem Stand. Maßgeblich ist die Nachbesserung oben.

Offene Fragen (unverändert, für Mensch oder Orchestrator):
- Seniorenmobil in 24 px: Ob die Silhouette als Seniorenmobil reicht oder ein Korb oder Dach die Aussage stärken soll, entscheidet der Inhaber.
- Fahrradschlüssel in 24 px: Der Schlüssel bleibt klein; wenn das nicht reicht, muss er größer gezeichnet werden.
- README-Zahl (Befund 7) beim Orchestrator-Commit korrigieren.
