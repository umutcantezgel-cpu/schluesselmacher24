# E0-DATENPFLEGER-02 · Anforderungs-Spur, Leitfaden Zeilen 421 bis 849

## GEÄNDERTE DATEIEN
- `_werkstatt/ausbau/erhebung/anforderungen-L2.json` (neu, 146 Einträge, L-301 bis L-446)
- `_werkstatt/ausbau/berichte/E0-DATENPFLEGER-02.md` (dieser Bericht)

Keine Projektdatei wurde geändert.

## WAS UND WARUM
- Jede Soll-Aussage (muss, soll, Ziel, Pflicht, Festlegung im Indikativ) und jedes Element einer Soll-Liste ist ein Eintrag. Tabellenzeilen und Listenpunkte (Frageblöcke, Abfragen, Leistungsbereiche, Backend-Funktionen, Phasen) zählen einzeln. Bei Tabellenzeilen steht die Bezeichnung mit Doppelpunkt vor dem Wortlaut.
- Nicht übernommen: Überschriften ohne eigene Aussage, die Einstufung „sind sensible Kundendaten“ (Zeile 748) und der Rahmensatz „verbindliche Grundrichtung“ (Zeilen 814 bis 815).
- Der Bestand ist im Code und in `content` geprüft. Die EVALUIERUNG (Abschnitt 4) diente nur als Hinweis, weil sie in mehreren Punkten überholt ist (siehe BELEGE).

## PRÜFUNG UND ERGEBNIS
- JSON gültig (`python3 -m json.tool`). Kennungen eindeutig, alle Felder gesetzt, status „offen“, pakete leer, beleg null.
- Wortlaut: Alle 146 Texte stehen zeichengenau im Leitfaden (Zeilenumbrüche als Leerzeichen gerechnet). Die ersten drei Worte jedes Eintrags stehen in der angegebenen Zeile oder in der Zeile davor oder danach.
- Bestand-Fundstellen: 143 geprüft, alle Dateien und Zeilen existieren und sind nicht leer. Zehn Stichproben mit `sed -n` bestätigt.
- Ergebnis: 130 vorhanden, 13 teilweise, 3 nicht pruefbar, 0 fehlt.
- Die zehn wichtigsten offenen Punkte (kein Eintrag steht auf „fehlt“):
  1. L-410 Datenschutzerklärung und Impressum: Firmendaten noch als Platzhalter (`impressum/page.tsx:24`).
  2. L-412 AGB: eingebauter Entwurf, juristische Abstimmung nicht belegt (`agb/page.tsx:19`).
  3. L-420 Rechtsprüfung vor Livegang: die Prüfung im Code erkennt nur Platzhalter (`livegang-pruefung.ts:11`).
  4. L-380 Projektkonfigurator für größere Sicherheitsprojekte: der Prozess hängt nur an Schließanlagen und Zutritt, der Sicherheitscheck läuft getrennt.
  5. L-392 Stadtseiten: nur Wetzlar mit eigenem Text (`content/cities.json:3`).
  6. L-391 Fahrzeugmodelle: je Modell nur Schlüsselarten, Baujahr und Vor-Ort-Pflicht (`content/vehicles.json:19`).
  7. L-394 Massenkopien: 52 Codeseiten mit „[Hersteller eintragen]“ (`content/code-lines.json:6`), im Stichprobenvergleich Textähnlichkeit median 0,84.
  8. L-395 Suchabsicht: Ratgeber haben 104 bis 169 Wörter (`content/guides.json:4`, eigene Zählung).
  9. L-407 Mobile Bedienung „besonders einfach“: im Code nicht messbar, EVALUIERUNG I-08 (Kopfzeile) offen.
  10. L-446 Abnahmeziel: Ausbau ohne Neubau nur teilweise belegt. Weitere Teilpunkte: L-421, L-426, L-427.

## BELEGE
- Schließanlagen und Zutritt: `system-erklaerung.tsx:34` bis `:186`, `projekt-konfigurator.tsx:264` bis `:1857`, `zutritt-konfigurator.tsx:43` bis `:326`, `elektronische-zutrittsloesungen/page.tsx:66` bis `:208`.
- Backend: `Vorgaenge.ts:136` bis `:232`, `druckansichten.ts:80` (Projektbericht drucken oder als PDF speichern), `termin-erinnerungen.ts:70` mit Cron in `vercel.json:6`.
- Abweichungen der EVALUIERUNG (Stand 25.10.2026) gegenüber dem Code: Erinnerungen als „fehlt“ (I-07, Code vorhanden: L-402); Projektübersicht als PDF „teilweise“ (L-323, Druckansicht vorhanden); Stadtseiten mit Platzhaltern (nur Wetzlar übrig: L-392); SEO-Felder der Modellseiten fehlen (`Fahrzeugmarken.ts:69` hat eine SEO-Gruppe je Modell); Status „Provision abgerechnet“ fehlt (`Vorgaenge.ts:58` hat ihn); „Sperrschließung 0 Treffer“ (`gleichschliessende-zylinder/page.tsx:36`).

## OFFENE FRAGEN
1. Sollen Zeile 748 (Einstufung der Kundendaten) und die Rahmensätze 814 bis 815 als Einträge aufgenommen werden? Ich habe sie nicht übernommen.
2. Granularität: Listenpunkte und Tabellenzeilen zähle ich einzeln. Bitte bestätigen, bevor die Pakete darauf aufsetzen.
3. L-380: Gilt ein Sicherheitscheck als Projektkonfigurator im Sinne von Zeile 647?
4. L-422, L-430 und L-431 sind nicht pruefbar (Vorgehen und Anteil der Angebote). Bitte entscheiden, ob sie als Hinweis bleiben.
5. Wer führt die wöchentliche Dateisicherung (`scripts/sicherung.mjs`, `docs/LIVEGANG.md:166`) aus? Im Code ist dafür kein Cron eingeplant (`vercel.json` hat nur zwei Einträge).
