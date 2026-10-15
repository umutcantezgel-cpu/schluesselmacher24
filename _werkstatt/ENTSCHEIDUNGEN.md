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

## D-010 · Strichskala der Generatoren
- Die Skala hat sieben Stufen von `DETAIL` bis `MARKE` (KERN 1.2, K-008). Es gibt keine Ausdrücke wie `LINIE + 0.5` mehr; `profilschnitt` nutzt jetzt `AKZENT` und `LINIE_STARK`.
- Drei Wertänderungen durch Rundung sind kaum sichtbar: 1,75 → 2 (Schließplan-Kanten, Code-Fundstelle) und 2,5 → 2,25 (Schlüssel, Zutritt).
- Elf Werte bleiben als Zahl stehen:
  - Doppelstrich-Halos wie Griff, Lupe und Drücker sind gezeichnete Flächen, keine Linien. Eine Rundung ließe die Kontur verschwinden.
  - Das Spurband im Schlüssel ist ebenfalls eine Fläche.
  - Die `striche()`-Platzhalter steuern mit ihrem Wert zugleich die Geometrie.
- **Umkehrprobe:** Mit einer eigenen Halo-Stufe kämen drei weitere Namen hinzu, die nur je einmal vorkommen. Das bringt keinen Gewinn an Einheitlichkeit.

## D-011 · Attrappen: alles abfangen, was nicht nachweislich liest
- Bisher lief eine Server Action ohne Prüf-E-Mail bis zum echten Server (Befund E0-PRUEFER-04). Ein schreibender Aufruf ohne diese Adresse wäre echt ausgeführt worden. Das widerspricht G5.
- Jetzt erreichen nur die lesenden Actions den Server: `fetchQuote`, `fetchSlots` und `fetchRecordStatus`, deren Kennungen aus dem Build-Manifest gelesen werden. Alle anderen werden als Attrappe beantwortet und protokolliert.
- Die Prüf-E-Mail wird als ganzer Wert erkannt, nicht mehr als Teil einer Adresse wie `status-pruefung@…`.

## D-012 · Generator `stiftzuhaltung` abgenommen
- Der Generator zeigt drei Zustände: passt, passt nicht und abgebrochen. Die Bildprüfung ist bestanden.
- Die Beschriftung „Trennlinie“ steht links, weil rechts der Platz fehlt. Die Trennlinie besteht aus 15 einzelnen Strichen, die sich nacheinander zeichnen. Die Maße weichen leicht von der Vorlage ab, damit die Stiftspitzen Platz haben.
- Einsatz: auf den Seiten 404 und Fehler (E3-L-09), später als Kür-Szene auf `/gleichschliessende-zylinder`.


## D-013 · Funktionsliste F-05 prüft den gespeicherten Warenkorb
- F-05 suchte den Text „Gleichschließende Zylinder“ und nahm den ersten Treffer. Dieser Text steht auch in Kopf, Fuß und leerem Warenkorb. Am E0-Stand war daher schon der Kopf-Link ein Beleg, auch ohne Eintrag im Warenkorb. Am neuen Stand ist der erste Treffer ein bis 1536 px verborgener Kopf-Link (D-009), deshalb schlug die Prüfung fehl.
- Jetzt gilt als Beleg der gespeicherte Warenkorb (`sm24-warenkorb` mit mindestens einem Eintrag) und eine nicht leere Warenkorbseite. Das ist eine Schärfung, keine Lockerung.
- Mit der geschärften Prüfung bestehen E0 (Port 3100) und der neue Stand (Port 3000). Protokolle: `funktionsliste-2026-10-16_00-03-09` (neu) und `funktionsliste-2026-10-16_00-03-15` (E0). Der Ausgangswert bleibt 14 von 14.

## D-014 · Hover nur bei feinem Zeiger, projektweit
- K-007 verlangt Zeiger-Effekte nur bei `(hover: hover) and (pointer: fine)`. Im Bestand und in der Hülle standen jedoch Dutzende `hover:`-Klassen ohne diese Bedingung. Auf Touch-Geräten bleibt ein solcher Zustand nach dem Antippen stehen.
- Lösung: Tailwind-Option `future.hoverOnlyWhenSupported`. Sie setzt jede `hover:`- und `group-hover:`-Klasse in genau diese Medienabfrage, ohne dass eine Datei geändert werden muss.
- **Umkehrprobe:** Alternativ müsste jedes Paket `zeiger:hover:` schreiben. Das ist fehleranfällig und ergäbe dasselbe Ergebnis in mehr Code. Fokus- und Druckzustände bleiben unabhängig davon für alle Geräte sichtbar.
