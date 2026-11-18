# FA-SEO-03E · Mobile Leistung, Teil E: Warenkorb und Artikelliste ohne das Register aller Zeichnungen

Kopf: Etappe FA Priorität 6 · Rolle Baumeister und Prüfer · Modell Opus · Stufe 2 bis 3 (Warenkorb und Artikelliste; wirkt über den Vorabruf auf jede Seite) · Kostenklasse S bis M · ohne Datenschema · Anforderungen FA-25-13, FA-25-15 · Befunde: `berichte/FA-SEO-03D.md` (OFFENE FRAGE 1 und „Abnahme durch den Orchestrator“), Entscheidungen A-071, A-076, A-080. Muster: `src/components/forms/upload-beispiel.tsx` mit Test aus FA-SEO-03D.

## Aufgabe in einem Satz
Warenkorb und Artikelliste zeichnen ihre Bilder ohne das Register aller Generatoren, sodass der Vorabruf des Warenkorbs aus der Kopfzeile nicht mehr auf jeder Seite Zeichnungscode lädt, den dort niemand sieht; Aussehen, Inhalt und Bedienung bleiben gleich.

## Vorgabe des Inhabers (wörtlich, Abschnitt 25)
„Sehr gute mobile Performance, optimierte Bilder und kurze Ladezeiten.“ Und: „Der Score ist ein Qualitätsindikator, aber kein Selbstzweck: echte Inhalte, Nutzbarkeit und saubere Technik gehen vor künstlichem Score Tuning.“

## Regel dieses Pakets (A-076)
Ein Eingriff zählt nur, wenn er die Menge senkt, die der Browser **insgesamt** lädt oder abarbeitet (bis Netzruhe plus 5 Sekunden). Kein Nachladen, kein `import()`, kein `next/dynamic`, kein Vorladen; der Vorabruf des Warenkorbs aus der Kopfzeile bleibt, wie er ist. Was nicht messbar hilft, bleibt, mit Zahlen im Bericht.

## Stand (Commit dfbb941)
Der Seitenkopf verlinkt den Warenkorb auf jeder Seite; sein Vorabruf lädt das Register aller Generatoren (`src/components/visual/registry.tsx` über `ImagePlaceholder`), auf der Kontaktseite zum Beispiel eine Datei mit 38,6 KB roh und 12,5 KB übertragen. Laut FA-SEO-03D nutzen `warenkorb-ansicht.tsx` (Zeilen um 241, 391, 660) und `artikel-liste.tsx` (Zeile um 219) `ImagePlaceholder`, zeigen aber nur die Zeichnung `schluessel` und Kompaktbilder. Vom Browser geladen bis Netzruhe plus 5 Sekunden (412 px, eigene Messung des Orchestrators am 18.11.): Startseite 21 Dateien und 263,5 KB, Shop 21 und 263,5 KB, Kontakt 23 und 288,9 KB, Assistent 25 und 312,0 KB.

## Umsetzung
1. Lies zuerst `berichte/FA-SEO-03D.md`, `upload-beispiel.tsx` und seinen Test, `src/components/ui/image-placeholder.tsx`, `bild-flaeche.tsx` (dort `KompaktBild`) und die zwei Bausteine. Kläre mit der Bündelanalyse (Skripte unter `protokolle/FA-SEO-03B/experimente/` und `FA-SEO-03C/experimente/`), welche Dateien der Vorabruf des Warenkorbs heute lädt und warum.
2. Stelle fest, welche Bilder Warenkorb und Artikelliste wirklich zeichnen können (Positionen aus Codelinien, Artikel, Leerzustand; Bilder aus gepflegten Inhalten mit Foto, Zeichnung oder Fach-Icon). Wo eine Stelle jede Zeichnung brauchen kann, bleibt `ImagePlaceholder`; wo nur wenige vorkommen, bindet ein eigener kleiner Baustein genau diese ein (Muster `upload-beispiel.tsx`), mit demselben Markup und denselben Klassen.
3. Ein Test hält fest, welche Zeichnungen vorkommen, und scheitert, wenn eine Stelle eine andere bräuchte (statt still ein Icon zu zeigen); ein Markup-Vergleich mit `ImagePlaceholder` belegt die Gleichheit.
4. Suche danach weitere Stellen derselben Art, die auf **jeder** Seite mitgeladen werden (Kopfzeile, Fuß, Layout, vorabgerufene Ziele der Kopfzeile). Nimm nur auf, was die Gesamtmenge senkt.

## Grenzen
Kein Inhalt entfällt (R1); CLS bleibt 0; Preise, Mengen, Summen, Versand, Texte und der Bestellweg unverändert (G9); `src/components/visual/generators/**` und die Farbwelt (A-078) unverändert; keine neue Abhängigkeit (G7); Fokus und Bedienung wie bisher (A-077).

## Arbeitsweise
Du arbeitest im Arbeitsbaum; kein anderes Paket läuft. Bauen: `SM24_INDEXIERUNG=an _werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`; Prüfserver über `bash _werkstatt/ausbau/werkzeuge/server.sh stop|start` (Port 3000). Der Messstand auf Port 3200 zeigt den Stand vor diesem Paket; für Messungen neu starten: `pkill -f "next start -p 3200"; fuser -k 3200/tcp; SM24_INDEXIERUNG=an SICHER_WURZEL=/home/user/sm24-messstand SICHER_PORT=3200 nohup /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx next start -p 3200 > /tmp/sm24-messstand.log 2>&1 &` (Dateien dort nicht ändern).
Messen, alter und neuer Stand gleich behandelt: Skripte im HTML der neun Ansichten am frisch gestarteten Server (`protokolle/FA-SEO-03B/experimente/gewicht.mjs`); was der Browser wirklich lädt (Zahl der Skriptdateien und übertragene Bytes bis Netzruhe plus 5 Sekunden, Bytes aus dem Protokoll von Chromium) für Startseite, Shop, Kontakt, Assistent, Warenkorb leer und Warenkorb mit einer Position (Attrappen nach G5, nichts bestellen), Artikelliste; Bildvergleich Pixel für Pixel für Warenkorb (leer und gefüllt), Artikelliste, eine Artikelkategorie und drei weitere Seiten bei 412 und 1280 px. Lighthouse nur als Hinweis.
**Bilder der Proben gehören nicht ins Repository:** Lege Bildschirmfotos nur unter `/tmp/sm24-proben/FA-SEO-03E/` ab; unter `_werkstatt/ausbau/protokolle/FA-SEO-03E/` stehen nur Skripte, Messwerte (JSON, Markdown) und Protokolle (schreiben über `sicher.sh --json --als-root`). Nur localhost. Kein git, das etwas ändert.

## Schreibrechte
Die Bausteine von Warenkorb und Artikelliste (`warenkorb-ansicht.tsx`, `artikel-liste.tsx` und was sie für Bilder einbinden), ein neuer kleiner Baustein daneben, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-SEO-03E.md`, `_werkstatt/ausbau/protokolle/FA-SEO-03E/**`. `src/components/ui/image-placeholder.tsx` und `bild-flaeche.tsx` nur, wenn eine Weitergabe nötig ist und alle anderen Nutzer Pixel für Pixel gleich bleiben (belegen).
Nicht anfassen: `src/components/visual/generators/**`, `src/components/visual/registry.tsx`, `src/components/layout/**`, `src/components/flow/**`, `src/components/forms/**`, `src/payload/**`, `src/migrations/**`, `src/lib/data/**`, `content/**`, `src/app/(site)/globals.css`, `package.json`, `next.config.ts`, Texte, Preise.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, Build wie oben; alles grün, Zahlen nennen.

## Bericht (`_werkstatt/ausbau/berichte/FA-SEO-03E.md`)
Was der Vorabruf vorher und nachher lädt (Dateien, Bytes); je Stelle Datei und Zeile, Bytes vorher und nachher im HTML und im Browser insgesamt; Bildvergleich; Entscheidung je Stelle (übernommen, verworfen, OFFENE FRAGE) mit Grund; Tabelle der gemessenen Seiten.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-03E · BEREIT ZUR RÜCKGABE ===
