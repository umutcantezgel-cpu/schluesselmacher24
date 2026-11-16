# FA-QA-04D · Bedienbarkeit, Teil 2D: Schrift in den Zeichnungen mindestens 14 px

Kopf: Etappe FA Priorität 7 · Rolle Grafiker und Baumeister · Modell Opus · Stufe 2 · Kostenklasse M · ohne Datenschema · Anforderung FA-26-01 · Befunde: `berichte/FA-QA-04A.md` (Nachbesserung, Befunde 1 und 2; offene Frage zur Grafikschrift), Liste `BEKANNTE_GRAFIKSCHRIFT` in `src/app/(site)/schriftstufen.test.ts`.

## Aufgabe in einem Satz
Die Beschriftung in den gezeichneten Grafiken der Seite ist auf dem Bildschirm nie kleiner als 14 px, auch auf dem Telefon, ohne dass Beschriftungen überlappen oder aus der Zeichnung laufen.

## Vorgabe des Inhabers (wörtlich, Abschnitt 26)
„Bedienbarkeit: auch für ältere Kunden · Große klare Buttons und gut lesbare Schrift.“

## Lage
FA-QA-04A hat die kleinste Textstufe der Seite auf 14 px gehoben. Die Zeichnungen (SVG) beschriften aber weiter mit 12 und 13 Einheiten ihres Zeichenrasters; an 14 Stellen, die der Test als bekannte Liste führt. Eine Zeichnung mit 480 Einheiten Breite, die auf dem Telefon 358 px breit dargestellt wird, zeigt 12 Einheiten als rund 9 px, 13 Einheiten als rund 9,7 px. Der schmale Schließplan nennt im eigenen Kommentar rund 11,9 px.

## So bauen
1. Rechne für jede Zeichnung nach, wie groß ihre Schrift auf dem Bildschirm wirklich ist: Schrift in Einheiten mal Darstellungsbreite geteilt durch Breite des Zeichenrasters, bei 360 px und bei 1280 px Fensterbreite (lies dafür, wo und wie breit die Zeichnung auf den Seiten steht). Tabelle im Bericht: Zeichnung, Seite, Raster, Darstellungsbreite, Schrift vorher, Schrift nachher.
2. Hebe die Schrift so, dass sie bei 360 px Fensterbreite mindestens 14 px ergibt. Wege, in dieser Reihenfolge: Schrift in Einheiten anheben und die Anordnung anpassen (Abstände, Flächenhöhen, Lage der Beschriftung); eine schmale Fassung der Zeichnung für kleine Breiten (wie beim Schließplan schon vorhanden); Beschriftung aus der Zeichnung nehmen und als Text darunter setzen (Legende), wenn sie in der Zeichnung nicht lesbar unterzubringen ist. Keine Beschriftung entfällt ersatzlos; kein Text wird gekürzt, wenn der Sinn leidet.
3. `SCHRIFT` und `SCHRIFT_KLEIN` in `src/components/visual/generators/grafik-basis.tsx` sind gemeinsame Werte: Ändere sie nur, wenn jede Zeichnung, die sie nutzt, danach passt; sonst je Zeichnung einen eigenen Wert.
4. Der Test in `schriftstufen.test.ts` führt die 14 bekannten Stellen als feste Liste. Mit jeder behobenen Stelle wird die Liste kürzer; am Ende ist sie leer oder enthält nur Stellen, deren Bildschirmgröße nachweislich mindestens 14 px beträgt (dann prüft der Test die gerechnete Bildschirmgröße statt der Einheiten). Keine Prüfung lockern (G8): Die Untergrenze gilt für die Größe auf dem Bildschirm.
5. Für jede geänderte Zeichnung: keine Überlappung von Beschriftungen, nichts läuft aus dem Rahmen, Alternativtext unverändert richtig. Die vorhandenen Tests der Zeichnungen laufen weiter; ergänze je Zeichnung einen Test, der die Schriftgröße und die Lage der Beschriftungen im Raster prüft.

## Schreibrechte
`src/components/visual/**` (Zeichnungen und ihre Tests), `src/app/(site)/schriftstufen.test.ts`, Seiten nur dort, wo eine Legende unter die Zeichnung muss (jede Stelle im Bericht nennen), `_werkstatt/ausbau/berichte/FA-QA-04D.md`.
Nicht anfassen: Texte der Seiten, Gestaltungswerte in `globals.css` und `tailwind.config.ts`, Formulare, Datenschema.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git. Rendere jede geänderte Zeichnung einmal und sieh sie an, wenn du es ohne Server kannst (statisches Markup); die Sichtprobe auf den Seiten bei 360, 390, 768 und 1280 px macht der Orchestrator. Nenne im Bericht die Seiten je Zeichnung.

## Grenzen
G8, R4 (Beschriftungen nennen nur, was sie heute nennen), R11, R12.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · TABELLE DER ZEICHNUNGEN · PRÜFUNG UND ERGEBNIS · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-04D · BEREIT ZUR RÜCKGABE ===
