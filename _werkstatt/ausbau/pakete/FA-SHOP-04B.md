# FA-SHOP-04B · Sperrschließungen, Teil B: Konfigurator gegen Abschnitt 15 schließen (Hersteller sichtbar und wählbar, Erweiterbarkeit, Sicherungskarte, mehrere Maße)

Kopf: Etappe FA Priorität 3 · Rolle Prüfer und Baumeister · Modell Opus · Stufe 3 (Preisberechnung) · Kostenklasse M · ohne neues Datenschema (braucht ein Punkt doch ein Feld: nicht bauen, als OFFENE FRAGE melden) · Anforderungen FA-15-00 bis FA-15-12, FA-10-09, FA-19-02 · Befunde: `berichte/FA-ABGLEICH.md` Block 07, `berichte/FA-KUNDSCHAFTER-07.md`, `berichte/FA-BLINDPRUEFUNG-07.md` · Voraussetzung: FA-SHOP-04 (Teil A) ist abgenommen; lies zuerst `berichte/FA-SHOP-04.md`, Abschnitt „Stand für Teil B“.

## Aufgabe in einem Satz
Prüfe den vorhandenen Konfigurator für gleichschließende Zylinder gegen jeden Punkt des Abschnitts 15 und schließe die Lücken in der Oberfläche, ohne Preise zu ändern oder zu erfinden.

## Vorgabe des Inhabers (wörtlich, Abschnitt 15)
„Dieser Bereich soll als echter Konfigurator und Shop funktionieren. BKS und ABUS als Hauptpartner beziehungsweise angebotene Systeme sichtbar darstellen. Herstellerlogos sauber nach den jeweiligen Markenvorgaben einbinden. Zylindertypen: Doppelzylinder, Knaufzylinder, Halbzylinder und weitere passende Varianten. Maße A und B, Anzahl, Not und Gefahrenfunktion, Schlüsselanzahl, Sicherungskarte und Erweiterbarkeit abfragen. Mehrere unterschiedliche Zylindermaße in einer gleichschließenden Bestellung ermöglichen. Preis wird aus den tatsächlich hinterlegten Produkten und Optionen berechnet, keine Demo Preise.“

## So bauen
1. Gehe die Anforderungen FA-15-00 bis FA-15-12 einzeln durch (Bericht des Kundschafters und der Blindprüfung) und belege je Punkt am Code, was erfüllt ist. Der Bestand ist weit: Bauformen, Maße, Sätze bis 30, Preisberechnung aus dem Zylinderkatalog, Warenkorb und Kasse. Das Ergebnis ist eine Tabelle im Bericht: Anforderung, Stand, Beleg (Datei und Zeile), Test.
2. Hersteller (FA-15-01, FA-15-02): BKS und ABUS aus dem Stamm sind im Konfigurator sichtbar und wählbar, sobald sie im Zylinderkatalog als angeboten geführt sind. Ohne Preisdaten je Hersteller bleibt die Wahl eine Angabe, die in Zusammenfassung, Warenkorb, Bestellung und Mail mitgeht; sag das ehrlich im Text („Der Preis gilt für beide Systeme“ nur, wenn die Daten das hergeben, sonst „Ihre Wahl geben wir an die Werkstatt weiter“). Ein Logo erscheint nur mit Freigabe im Stamm (R12), sonst der Name als Schriftzug wie in `src/components/hersteller/hersteller-bereich.tsx`. Kein zweiter Preispfad: Die Wahl darf den festen Preis nicht still in „Angebot“ verwandeln; beschreibe im Bericht, wie sich die Wahl zu `src/lib/konfigurator/preis.ts` verhält.
3. Erweiterbarkeit (FA-15-09), Schlüsselanzahl (FA-15-07) und Sicherungskarte (FA-15-08): prüfe, dass jede Angabe abgefragt wird, in der Zusammenfassung steht und bis in Bestellung und Mail mitgeht. Die Sicherungskarte bleibt, wie sie ist (R13); ob sie Pflicht oder Option ist, entscheidet der Inhaber: als FÜR MENSCHEN melden, nichts umstellen.
4. Weitere Bauformen (FA-15-03): nur zeigen, was im Katalog steht. Fehlt eine Bauform, die der Inhaber nennen könnte, steht im Konfigurator ein Ausweg „Andere Bauform anfragen“ in einen vollständigen Weg (Anfrage mit vorbelegtem Thema). Keine neue Bauform erfinden.
5. Mehrere Maße (FA-15-10): ein Test mit drei verschiedenen Maßen in einem gleichschließenden Satz, vom Konfigurator-Zustand über den Warenkorb bis zur Serverprüfung des Preises.
6. Unbestätigte Preise (aus Teil A): Der Konfigurator zeigt für einen gesperrten Katalogeintrag keinen Preis und keinen Bestellknopf, sondern den Weg in die Anfrage, mit einem ruhigen Satz. Test dazu.
7. Bedienbarkeit bleibt: Hilfeblock, „Maß unbekannt“, Fehlermeldungen und Fortschritt aus FA-QA-02 nicht verändern; lies `berichte/FA-QA-02.md`. Sichtbare Texte der Rubrikseite stammen aus FA-INHALT-03C und der Herstellerbereich aus FA-INHALT-02: nur ändern, was Abschnitt 15 verlangt.
8. Betreiberanleitung `docs/betrieb/zylinder-pflegen.md` um die Bedienung ergänzen (Hersteller anbieten, Bauform, Maße, Optionen, Preis sperren); Tests für jede geschlossene Lücke.

## Stand nach Teil A (vom Orchestrator, 16.11.2026)
- Teil A ist abgenommen: Hersteller-Bereiche als Daten, Zylinderkatalog mit Hersteller aus dem Stamm (`stammId`), Haken „Preis nicht bestätigt“ mit Sperre in der gemeinsamen Prüfung `validateCylinderDraft` (Konfigurator, Kasse), Anzeige „auf Anfrage“ im Konfigurator und „Preis auf Anfrage“ auf der Rubrikseite. Lies `berichte/FA-SHOP-04.md`, Abschnitte „Stand für Teil B“ und „Nachbesserung“, und `docs/betrieb/zylinder-pflegen.md`.
- Der Herstellerschritt des Konfigurators erscheint heute erst, wenn im Zylinderkatalog ein Hersteller als angeboten geführt ist; der Startbestand hat dort keinen Eintrag (`manufacturers: []`), und Preise je Hersteller fehlen (MA-49). Punkt 2 heißt deshalb: BKS und ABUS sind als angebotene Systeme im Konfigurator sichtbar und wählbar, sobald sie im Stamm den Bereich „Sperrschließungen“ tragen, auch ohne Eintrag im Zylinderkatalog; die Wahl ist dann eine Angabe ohne Preiswirkung, und der Text sagt das. Mit Eintrag im Zylinderkatalog gilt dessen Preisregel wie im Bestand. Du legst keine Preise und keine Katalogeinträge an (G9).
- Zusätzlicher Punkt 9: Der Schließplan-Planer übernimmt aus dem Link des Konfigurators heute nur Zylinder, Maße, Schlüssel, Ziehschutz und „erweiterbar“. Übernimm auch die übrigen gewählten Optionen (etwa Sicherungskarte) und den gewählten Hersteller (`src/components/konfigurator/schliessplan-planer.tsx`, `src/lib/konfigurator/preis.ts`), damit eine Zusammenstellung mit unbestätigtem Preis vollständig in der Anfrage ankommt; danach stimmt der Satz im Konfigurator wieder ohne Einschränkung. Test dazu.
- Der Satz „Weitere Hersteller oder Sonderlösungen auf Anfrage“ im Herstellerschritt enthält einen Gedankenstrich aus dem Bestand: beheben.
- Die Meldung der Preissperre (`PREIS_SPERRE_WEG` in `src/lib/konfigurator/preisbestaetigung.ts`) lautet seit der Abnahme: „Bitte schicken Sie Ihre Zusammenstellung im Konfigurator für gleichschließende Zylinder als Anfrage. Sie bekommen dann ein Angebot.“

## Schreibrechte
src/app/(site)/gleichschliessende-zylinder/**, src/components/schliessung/**, src/components/konfigurator/**, src/lib/konfigurator/**, docs/betrieb/zylinder-pflegen.md, zugehörige Tests, _werkstatt/ausbau/berichte/FA-SHOP-04B.md. Gemeinsame Dateien (Warenkorb, Kasse, Mailtexte, Bestellprüfung) nur an einzelnen Stellen mit dem Edit-Werkzeug und nur, damit die Herstellerwahl mitgeht; jede solche Stelle im Bericht nennen.
Nicht anfassen: Preise und Maßbereiche in content und Rückfällen, Datenschema und Migrationen, Navigation, Startseite.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git. Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs`.

## Grenzen
G6, G8, G9, R4, R9, R12 (Logos nur nach Freigabe), R13 (Sicherungskarte bleibt). Texte kurz, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · TABELLE DER ANFORDERUNGEN · PRÜFUNG UND ERGEBNIS · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-04B · BEREIT ZUR RÜCKGABE ===
