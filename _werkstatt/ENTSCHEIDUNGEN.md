# Entscheidungen

Folgenreiche Entscheidungen mit Denkprotokoll (Ziel → drei Wege → Bewertung → Umkehrprobe → Folgen zweiter Ordnung).

## D-001 · Build-Gate im JSON-Modus (E0)
- **Ziel:** Ein Build, der in der Cloud verlässlich läuft und mit E0 vergleichbar bleibt.
- **Drei Wege:**
  1. `npm run build`: scheitert als root an `initdb`.
  2. Build mit lokaler Datenbank als Nutzer `ubuntu`: läuft, braucht aber `PAYLOAD_SECRET` und eine laufende Datenbank. Die Inhalte kämen aus dem Seed statt aus `content/`.
  3. `SM24_DATA=json npx next build`: entspricht dem Vercel-Weg ohne Datenbank, 198 Seiten.
- **Bewertung:** Weg 3 ist reproduzierbar, schnell und ohne Geheimnisse. Er prüft denselben Code wie Weg 1; nur die Datenquelle ist eine andere.
- **Umkehrprobe:** Weg 3 prüft keine Datenbankpfade. Die decken die DB-Tests ab, die über den Nutzer `ubuntu` laufen.
- **Folgen:**
  - Alle Bilder und Messungen laufen im JSON-Modus.
  - Richtwerte und Nachweise zeigen dort ihre Ersatzdarstellung. Das ist in E0 und am Ende gleich und deshalb vergleichbar.

## D-002 · Leitidee „Werkstattzeichnung“ (E1, Denkprotokoll)
- **Ziel:** eine einzige Richtung, die jede Gestaltungsentscheidung erklärt und die Austauschprobe besteht.
- **Drei Wege:**
  1. „Werkstattzeichnung“: bemaßt, Profillinie, Mono, Stahlblau auf Papier.
  2. „Vertrauen durch Menschen“ mit Fotos und Team: Es gibt keine Fotos, und nach der Leitplanke Wahrheit werden keine erzeugt.
  3. „Ruhiger Premium-Shop“ mit großen Produktbildern und viel Weißraum: Es gibt keine Produktfotos, und die Austauschprobe fällt durch.
- **Bewertung:** Weg 1 nutzt vorhandene Stärken (Generatoren, Plex Mono, Bereichsfarben), erklärt Mechanik und braucht keine Fotos.
- **Umkehrprobe:** Kämen später echte Fotos, rahmt die Zeichnungssprache sie (Bildstellen haben Vorrang für `bild`).
- **Folgen:**
  - Viele Grafiken: Die Leistung wird über das SVG-Budget beobachtet.
  - Bei Mono-Beschriftungen wird auf Lesbarkeit geachtet (Mindestgröße 12 px).

## D-003 · Kein Dunkelmodus
- Das Projekt hat keinen. Einen anzulegen wäre eine neue Funktion, die die Prüfflächen verdoppelt, ohne eine Hauptaufgabe zu verbessern.
- `darkMode: ['class']` bleibt unverändert und wirkungslos. Später ergänzbar, weil alle Farben Tokens sind.

## D-004 · Kein 3D, kein WebGL; framer-motion bleibt ungenutzt
- **Drei Wege:**
  1. three.js-Szene: etwa 150 KB komprimiert, sprengt das 60-KB-Budget und zeigt keine Information.
  2. Eigener WebGL-Shader: klein, aber ohne Aussage über die Marke.
  3. SVG-Szenen mit CSS (Fräsbahn, Stiftzuhaltung als Kür): zeigen die Marke und erklären Mechanik.
- **Gewählt:** Weg 3. Die Bewegung läuft über CSS und eine Client-Hülle unter 3 KB (Fräsbahn).
- framer-motion ist installiert, aber nirgends importiert. Es landet nicht im Bundle; die Entscheidung über das Entfernen trifft der Mensch (MENSCHEN.md).

## D-005 · Bildstellen ohne Platzhalter
- **Ziel:** Der harte Generisch-Katalog verlangt null sichtbare Platzhalter. Die Leitplanken Wahrheit und Bilder verbieten erfundene Fotos.
- **Lösung:**
  - `ImagePlaceholder` zeigt ohne Foto eine Fachgrafik, gewählt über `slot.visual` oder über `visualFuerMotiv()`, eine reine Funktion mit Test.
  - Passt keine Grafik, zeigt es ein dekoratives Fach-Icon.
  - „Bild folgt“ entfällt. Der Generator-Titel ist sachlich und nennt nie das Fotomotiv.
- **Umkehrprobe:** Sobald die Redaktion ein Foto hinterlegt (`bild`), hat es Vorrang. Die Liste der fehlenden Fotos steht in MENSCHEN.md.

## D-006 · Gestaltungsarbeit am Bild
- Der Orchestrator sieht sich beim Bauen der Referenz eigene Bildschirmfotos an (Entwicklungsserver auf Port 3001). Das ist Teil des Gestaltens, keine Prüfung.
- Die formale Prüfstufe A für L-Pakete macht weiterhin ein Haiku-Prüfer.

## D-007 · AGENTS.md wird nicht mitcommittet
- `next dev` ergänzt in `AGENTS.md` automatisch einen Block. Die Datei liegt außerhalb des Arbeitsbereichs (G1).
- Die Änderung wird vor jedem Commit zurückgenommen. Commits nennen ihre Dateien ausdrücklich.

## D-008 · Firmendaten-Platzhalter im Fuß
- Solange `company.isPlaceholder` gilt, zeigt der Fuß statt „[Platzhalter: …]“-Zeilen nur den vorhandenen Redaktionshinweis. Die Daten selbst bleiben unverändert.
- Die strukturierten Daten ließen die Firmenangaben schon vorher weg (Bestand).

## D-009 · Kopfnavigation nach Breite
- Bei 1024 px bricht die Leiste um, und bei 1440 px wird der Termin-Knopf abgeschnitten (Befund aus dem Bild).
- Deshalb gilt:
  - ab 1024 px die Bereiche 1–3
  - ab 1280 px zusätzlich Bereich 5
  - ab 1536 px auch Bereich 4 („Gleichschließende Zylinder“)
  - der Rest unter „Mehr“
- Kein Zeilenumbruch in den Einträgen.
