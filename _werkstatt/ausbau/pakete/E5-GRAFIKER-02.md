# E5-GRAFIKER-02 · Beispielzeichnung je Fotoansicht im Autoschlüssel-Fotoschritt

## 1. Kopfzeile
Kennung E5-GRAFIKER-02 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderung G-16 · Kriterium Z-11 · Schreibrechte: src/components/visual/generators/schluessel.tsx, src/components/visual/generators/schluessel.test.tsx, src/components/autoschluessel/optionen.ts (nur die Felder `example` in KEY_PHOTO_SLOTS), _werkstatt/ausbau/berichte/E5-GRAFIKER-02.md · Umfang: ein Generator, vier Ansichten

## 2. Rollenbriefing
Grafiker: zeichnet genau, was gemeint ist (G-47), mit den Linien, Schriften und Farben der Grafikbasis. Fehler: feste Farbwerte; Standardbild verändern; vier gleiche Bilder.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und _werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md und halte dich daran.

## 3. Aufgabe in einem Satz
Gib dem Generator `schluessel` einen optionalen Parameter `ansicht` mit den Werten `vorn` (Tastenseite), `hinten` (Rückseite mit Aufdruck oder Kennzeichnung), `bart` (Bart seitlich mit Fräsung) und `detail` (Nummer oder Prägung in Nahaufnahme), und setze in KEY_PHOTO_SLOTS je Feld die passende Ansicht als `example.visual`.

## 4. Hintergrund
Die Jury (E4-JURY-02, Befund 1) fand im Fotoschritt viermal denselben Baustein; Vorder- und Rückseite zeigten dieselbe Zeichnung. Die Beispielfläche zeichnet `ImagePlaceholder` aus `slot.visual` (Registry-Generator mit Parametern), sonst aus dem Motivtext. Die Felder und ihre Texte stehen in src/components/autoschluessel/optionen.ts (KEY_PHOTO_SLOTS).

## 5. Regeln (unveränderlich)
- Ohne `ansicht` bleibt jedes bisherige Bild des Generators unverändert (bestehende Tests grün).
- Die Ansicht passt zur Beschreibung des Feldes (Text in optionen.ts nicht ändern) und zum Funkschlüssel (`typ: 'funk'`) als Standard.
- Nur Bausteine aus grafik-basis.tsx, Farben über `currentColor` und Bereichstokens; unsinnige Werte führen zur Standardgrafik.

## 6. Maßstab
Vier klar verschiedene Zeichnungen, je eine pro Feld, auf einen Blick unterscheidbar; Bilder mobil und Desktop im Bericht.

## 7. Grenzen
Keine anderen Dateien, kein Build, kein Commit. Prüfungen nie lockern.

## 8. Schritte
1. schluessel.tsx, schluessel.test.tsx, grafik-basis.tsx, registry.test.tsx, src/components/ui/image-placeholder.tsx und KEY_PHOTO_SLOTS in optionen.ts lesen.
2. Ansichten zeichnen, Tests ergänzen (vier Ansichten verschieden, Standardbild unverändert), `example.visual` je Feld setzen.
3. Prüfstufe A über die Datenweiche: `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/components/visual src/components/autoschluessel src/components/forms`, `… -- npx eslint <Dateien>`, `… -- npx tsc --noEmit -p .`; Bilder der vier Ansichten per renderToStaticMarkup und Playwright im Scratchpad.

## 9. Selbstprüfung
Vier verschiedene Zeichnungen (Test vergleicht das Markup), alle Tests der drei Ordner grün, keine festen Farbwerte.

## 10. Ausgabe
Die drei Dateien, Bilder unter _werkstatt/ausbau/protokolle/E5-GRAFIKER-02/, Bericht nach _werkstatt/ausbau/berichte/E5-GRAFIKER-02.md (höchstens 400 Wörter).

## 11. Letzte Zeile
=== ENDE E5-GRAFIKER-02 · BEREIT ZUR RÜCKGABE ===
