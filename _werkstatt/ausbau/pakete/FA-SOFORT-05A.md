# FA-SOFORT-05A · Vier Fach-Icons für die neuen Hauptzugänge: Roller, E-Scooter, Seniorenmobil, Fahrradschlüssel

Kopf: Etappe FA Priorität 1 · Rolle Grafiker · Modell Haiku · Stufe 2 (SVG nach Formsystem) · Kostenklasse S · Anforderungen FA-03 (Hauptzugänge) · Maßstab: `src/components/visual/README.md` (Formsystem, lies es ganz), `src/components/visual/icons/icon-base.tsx`, Muster `src/components/visual/icons/motorradschluessel.tsx`, `autoschluessel.tsx`, `schluesselgehaeuse.tsx`, Prüfung `src/components/visual/icons/icons.test.tsx`, Register `src/components/visual/fach-icon.tsx`.

## Rollenbriefing
Grafiker: setzt Icons nach Formsystem und Register um. Fehler, die du vermeidest: mehr zeichnen als nötig; uneinheitliche Strichstärken; Formen außerhalb des 48er-Rasters; Farben außerhalb der Tokens.

## Aufgabe in einem Satz
Zeichne vier neue Fach-Icons in der bestehenden Icon-Familie und trage sie im Register ein.

## Vorgabe des Inhabers
Gewünschte Hauptzugänge unter anderem: „Roller und Kleinstfahrzeuge · E Scooter und ähnliche Elektrofahrzeuge · Seniorenmobile und vergleichbare Fahrzeuge · Fahrradschlüssel“. Die Kacheln im Hub brauchen je ein Icon, das ein Laie sofort erkennt.

## So bauen
1. Vier Dateien nach dem Muster der Familie (48er-Raster, `IconBase`, Kontur in `currentColor`, höchstens eine zarte Füllfläche mit `className="fill-area-muted" stroke="none"`, runde Enden, keine eigenen Farben, keine Verläufe, keine Animation, je höchstens etwa sechs Formen):
   - `roller.tsx` → `IconRoller`: Motorroller von der Seite (zwei kleine Räder, Trittbrett, Sitzbank, Lenker mit Schild), deutlich anders als das Motorrad-Icon.
   - `e-scooter.tsx` → `IconEScooter`: Tretroller mit Elektroantrieb von der Seite (zwei kleine Räder, flaches Trittbrett, hohe Lenkstange), mit einem kleinen Blitz oder Akku als Zeichen für elektrisch.
   - `seniorenmobil.tsx` → `IconSeniorenmobil`: Elektromobil von der Seite (Sitz mit Lehne, Lenksäule, drei oder vier Räder, tiefer Einstieg).
   - `fahrradschluessel.tsx` → `IconFahrradschluessel`: Fahrradrad oder Rahmenausschnitt mit einem Schloss und Schlüssel, der Schlüssel muss erkennbar sein (in der Familie steht bei Schlüssel-Icons der Bart rechts).
   Jedes Icon trägt einen einzeiligen Kommentar, was es zeigt (wie im Muster).
2. Register: in `src/components/visual/fach-icon.tsx` die vier Schlüssel `roller`, `e-scooter`, `seniorenmobil`, `fahrradschluessel` eintragen (genau so, wie `motorradschluessel` eingetragen ist). In `src/lib/rubriken.ts` (Liste `RUBRIK_ICONS`) trägst du nichts ein; das macht der Orchestrator zusammen mit der Migration.
3. Tests: `icons.test.tsx` deckt die Familie ab; ergänze die vier Icons dort nach dem vorhandenen Muster (Raster, keine festen Farben, Titel als Bildansage). Falls der Test `registry.test.tsx` oder `bereich-icon.test.tsx` Listen führt, ziehe sie nach.
4. Sichtprüfung: Schreibe ein kleines Skript in dein Arbeitsverzeichnis `_werkstatt/ausbau/bilder/arbeit/` (nicht committet), das die vier Icons zusammen mit `motorradschluessel` und `autoschluessel` als SVG nebeneinander in 48 px und 24 px rendert (statisches Markup über `react-dom/server` in einem Vitest-Lauf oder von Hand als SVG-Datei), und sieh dir das Ergebnis als Bild an (Playwright ist vorhanden: `require('playwright')`, Chromium ohne Optionen; nur lokale Datei, kein Netz). Verbessere, bis jedes Icon in 24 px noch erkennbar ist und keine Linie das Raster verlässt.

## Schreibrechte
Nur: die vier neuen Dateien unter src/components/visual/icons/, src/components/visual/fach-icon.tsx (nur die vier Einträge), src/components/visual/icons/icons.test.tsx und gegebenenfalls registry.test.tsx (nur die vier Einträge), _werkstatt/ausbau/bilder/arbeit/** , _werkstatt/ausbau/berichte/FA-SOFORT-05A.md.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/components/visual`, `… -- npm run typecheck`, `… -- npm run lint`. Kein Build, kein Server, keine Befehle mit `--pg`, kein git. Schlagen Tests in fremden Dateien fehl, melde es und behebe es nicht.

## Grenzen
R11 (nichts kopieren: keine fremden Icon-Sets, keine nachgezeichneten Markenzeichen), R12. Keine neue Bibliothek.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · BELEGE (Pfad des Kontrollbilds) · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SOFORT-05A · BEREIT ZUR RÜCKGABE ===
