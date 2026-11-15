# FA-SHOP-04 · Sperrschließungen, Teil A: Datengrundlage (Hersteller-Bereiche, Zylinderkatalog am Hersteller-Stamm, Sperre für unbestätigte Preise)

Kopf: Etappe FA Priorität 3 · Rolle Prüfer und Baumeister · Modell Opus · Stufe 3 (Preisberechnung) · Kostenklasse L · ändert das Datenschema (Hersteller-Bereiche, Zylinderkatalog) und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket mit Schema) · Anforderungen FA-15-01 bis FA-15-12, FA-10-09, FA-19-02 · Befunde: `berichte/FA-ABGLEICH.md` Block 07, `berichte/FA-KUNDSCHAFTER-07.md`, `berichte/FA-BLINDPRUEFUNG-07.md` · Voraussetzung: FA-SHOP-01 (Hersteller-Stamm) ist abgenommen.

## Aufgabe in einem Satz
Lege die Datengrundlage für Abschnitt 15: Hersteller-Bereiche im Admin pflegbar, der Zylinderkatalog wählt den Hersteller aus dem Stamm, und ein Katalogeintrag mit unbestätigtem Preis ist nicht bestellbar. Du änderst keinen Preis und erfindest keinen.

## Zuschnitt (vom Orchestrator, 16.11.2026)
Das Paket ist geteilt. Du baust Teil A (dieser Auftrag): nur die Punkte unter „Stand des Bestands“ (1) und (2), dazu aus „So bauen“ den Punkt 3 (Preisliste zur Bestätigung und Sperre „Preis nicht bestätigt“) und die Betreiberanleitung, soweit sie Daten betrifft. Die sichtbare Wahl des Herstellers im Konfigurator, Erweiterbarkeit, Sicherungskarte, weitere Bauformen und der Test mit drei Maßen (Punkte 1, 2 und der Rest von 4) gehören zu Teil B (`pakete/FA-SHOP-04B.md`) und bleiben unberührt. Schreibe am Ende des Berichts einen Abschnitt „Stand für Teil B“: welche Funktionen und Felder Teil B benutzen kann (Namen, Dateien), und was dort noch fehlt.

## Vorgabe des Inhabers (wörtlich, Abschnitt 15)
„Dieser Bereich soll als echter Konfigurator und Shop funktionieren. BKS und ABUS als Hauptpartner beziehungsweise angebotene Systeme sichtbar darstellen. Herstellerlogos sauber nach den jeweiligen Markenvorgaben einbinden. Zylindertypen: Doppelzylinder, Knaufzylinder, Halbzylinder und weitere passende Varianten. Maße A und B, Anzahl, Not und Gefahrenfunktion, Schlüsselanzahl, Sicherungskarte und Erweiterbarkeit abfragen. Mehrere unterschiedliche Zylindermaße in einer gleichschließenden Bestellung ermöglichen. Preis wird aus den tatsächlich hinterlegten Produkten und Optionen berechnet, keine Demo Preise.“

## So bauen
1. Gehe die zwölf Anforderungen des Blocks einzeln durch (Bericht des Kundschafters und der Blindprüfung) und belege je Punkt am Code, was erfüllt ist. Der Bestand ist weit: Bauformen, Maße, Sätze bis 30, Preisberechnung aus dem Zylinderkatalog, Warenkorb und Kasse.
2. Lücken schließen: Hersteller BKS und ABUS aus dem Stamm im Konfigurator wählbar und sichtbar (ohne Preisdaten je Hersteller bleibt die Wahl eine Angabe für das Angebot; sag das ehrlich im Text); Erweiterbarkeit als Frage mit Wirkung auf die Zusammenfassung; Schlüsselanzahl und Sicherungskarte wie verlangt; mehrere Maße in einer Bestellung geprüft (Test mit drei verschiedenen Maßen in einem gleichschließenden Satz bis in Warenkorb und Serverprüfung).
3. Demo-Preise: Prüfe `content/cylinder-catalog.json`, `content/pricing-groups.json`, die Globals `Zylinderkatalog` und `Richtwerte` und die Rückfälle auf Werte, die Beispiel- oder Platzhalterpreise sind (der Kundschafter listet Verdachtsstellen). Du änderst keinen Preis (G9). Ergebnis ist eine Liste für den Inhaber: Position, heutiger Wert, Herkunft, „bitte bestätigen oder ersetzen“. Baue eine Sperre: Ein Katalogeintrag mit dem Haken „Preis nicht bestätigt“ (neues Feld, Standard nicht gesetzt für Bestand, damit sich nichts ändert) ist nicht bestellbar und führt in die Anfrage; so kann der Betreiber unbestätigte Preise selbst aus dem Verkauf nehmen.
4. Tests für jede geschlossene Lücke; Betreiberanleitung `docs/betrieb/zylinder-pflegen.md` (Hersteller, Bauform, Maße, Preise, Optionen).

## Stand des Bestands (vom Orchestrator, 15.11.2026)
- Hersteller-Stamm: Sammlung `Hersteller` (FA-SHOP-01), Startbestand BKS, ABUS, BURG-WÄCHTER (FA-INHALT-02). Zwei Dinge hat FA-INHALT-02 offen gelassen, weil sie ein Datenschema brauchen; sie gehören jetzt zu deinem Auftrag: (1) An der Sammlung `Hersteller` fehlen ein Feld „Bereiche“ (Sperrschließungen, elektronischer Zutritt) und ein Einsatztext je Bereich; heute liegen beide fest in `src/components/hersteller/bereiche.ts`. Lege sie als Felder an (additive Migration, Seed mit den heutigen Texten als Startwert, JSON-Rückfall) und lasse `bereiche.ts` aus den Daten lesen, damit der Betreiber sie im Admin pflegt; die Hilfetexte in `Hersteller.ts` stimmen danach wieder. (2) Der Zylinderkatalog (Global, Reiter Hersteller) wählt den Hersteller aus dem Stamm statt eines eigenen Namensfelds; bestehende Einträge bleiben lesbar. Preise und Maßbereiche änderst du nicht (G9).
- Der Konfigurator ist in FA-QA-02 auf Bedienbarkeit geprüft (Hilfeblock, „Maß unbekannt“ führt in einen vollständigen Weg, Fehlermeldungen): Diese Bausteine bleiben; lies `berichte/FA-QA-02.md`. Sichtbare Texte der Rubrikseite stammen aus FA-INHALT-03C und der Herstellerbereich aus FA-INHALT-02: nur ändern, was Abschnitt 15 verlangt.
- Für das zusätzliche Schreibrecht: `src/payload/collections/Hersteller.ts`, `content/hersteller.json`, `src/lib/data/defaults/hersteller.ts`, `src/components/hersteller/**`, Mapping und Seed nur für die zwei Punkte oben.

## Schreibrechte
src/app/(site)/gleichschliessende-zylinder/**, src/components/schliessung/**, src/components/konfigurator/**, src/lib/konfigurator/**, src/payload/globals/Zylinderkatalog.ts mit Mapping (falls ein Feld nötig ist: Migration über `sicher.sh --pg -- npx payload migrate:create zylinder_bestaetigt`), docs/betrieb/zylinder-pflegen.md, zugehörige Tests, _werkstatt/ausbau/berichte/FA-SHOP-04.md.
Nicht anfassen: Preise und Maßbereiche in content und Rückfällen, Navigation, Startseite.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`; bei Migration zusätzlich `… --pg -- npx vitest run -c vitest.db.config.ts` und `… --json -- npm run build`. Kein Server, kein git.

## Grenzen
G6, G8, G9, R4, R9, R12 (Logos nur nach Freigabe), R13 (Sicherungskarte bleibt). Texte kurz, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · PREISLISTE ZUR BESTÄTIGUNG · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-04 · BEREIT ZUR RÜCKGABE ===
