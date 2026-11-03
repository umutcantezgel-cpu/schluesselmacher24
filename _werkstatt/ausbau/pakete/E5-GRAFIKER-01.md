# E5-GRAFIKER-01 · Messhilfe Maß A und B mit Beschlag und Überstand

## 1. Kopfzeile
Kennung E5-GRAFIKER-01 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderungen G-29, G-47 · Kriterium Z-06 · Schreibrechte: src/components/visual/generators/zylinder-mass.tsx, src/components/visual/generators/zylinder-mass.test.tsx, _werkstatt/ausbau/berichte/E5-GRAFIKER-01.md · Umfang: ein Generator, zwei neue Parameter

## 2. Rollenbriefing
Grafiker: zeichnet genau, was gemeint ist (G-47), mit den Linien, Schriften und Farben der Grafikbasis. Fehler: feste Farbwerte; Zahlen ohne Quelle; Standardbild verändern; Beschriftung, die bei 250 px Breite unter 12 px fällt.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und _werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md und halte dich daran.

## 3. Aufgabe in einem Satz
Erweitere den Generator `zylinder-mass` um die optionalen Parameter `beschlag` (Schutzbeschlag außen sichtbar, an oder aus) und `ueberstand` (der Teil des Zylinders vor dem Beschlag, als bemaßte Strecke ohne Zahlenregel), damit die Messhilfe zeigt, wo Maß A und B anfangen und enden.

## 4. Hintergrund
Der Generator zeichnet heute den Profilzylinder mit Maß A (außen) und Maß B (innen) ab „Mitte Stulpschraube“. Für die Konfiguratoren (E5-OPUS-01, E5-OPUS-02) braucht die Messhilfe zusätzlich Türblatt, Beschlag und Überstand, weil dort die teuren Fehler entstehen (G-29). FACHWISSEN.md nennt keine Zahl für den zulässigen Überstand; die Zeichnung zeigt ihn deshalb nur als Strecke mit der Beschriftung „Überstand“.

## 5. Regeln (unveränderlich)
- Ohne die neuen Parameter bleibt das Bild Pixel für Pixel wie bisher (bestehende Tests unverändert grün).
- Nur Bausteine aus grafik-basis.tsx (Linienstärken, Schrift, Raster, Rahmen), Farben über `currentColor` und Bereichstokens, Beschriftung in deutscher Laiensprache.
- Unsinnige Werte führen zur ruhigen Standardgrafik (Registry-Tests mit fehlerhaften Parametern bleiben grün); `format: 'schmal'` muss auch mit Beschlag lesbar sein.

## 6. Maßstab
Bei `beschlag: 'an'` sieht man Türblatt, Beschlag außen und die Strecke Überstand; Maß A beginnt weiter an der Mitte der Stulpschraube und endet am Zylinderende. Bilder mobil (schmal) und Desktop im Bericht.

## 7. Grenzen
Keine anderen Dateien, kein Build, kein Commit. Prüfungen nie lockern.

## 8. Schritte
1. zylinder-mass.tsx, zylinder-mass.test.tsx, grafik-basis.tsx und registry.test.tsx lesen.
2. Parameter ergänzen, zeichnen, Tests ergänzen (neue Parameter, Standardbild unverändert, schmal).
3. Prüfstufe A über die Datenweiche: `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/components/visual`, `… -- npx eslint <Dateien>`, `… -- npx tsc --noEmit -p .`; zwei Bilder (schmal und breit) mit einem eigenen Playwright-Skript aus einer statischen HTML-Datei im Scratchpad oder per renderToStaticMarkup.

## 9. Selbstprüfung
Standardbild unverändert (Test), alle Tests unter src/components/visual grün, keine festen Farbwerte (Suche im Bericht belegt).

## 10. Ausgabe
Die beiden Dateien, Bilder unter _werkstatt/ausbau/protokolle/E5-GRAFIKER-01/, Bericht nach _werkstatt/ausbau/berichte/E5-GRAFIKER-01.md (höchstens 400 Wörter).

## 11. Letzte Zeile
=== ENDE E5-GRAFIKER-01 · BEREIT ZUR RÜCKGABE ===
