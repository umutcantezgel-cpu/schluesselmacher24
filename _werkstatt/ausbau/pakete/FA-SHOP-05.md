# FA-SHOP-05 · Shop: Artikelliste je Kategorie, Pflichtangaben bei Codeprodukten, Importspalten Schlüsseltyp und Einsatzbereich

Kopf: Etappe FA Priorität 3 · Rolle Baumeister · Modell Opus · Stufe 3 (Prüfung beim Veröffentlichen von Produkten) · Kostenklasse M · ohne neues Datenschema und ohne Migration (braucht ein Punkt doch ein Feld in der Datenbank: nicht bauen, als OFFENE FRAGE melden); die Datenbanktests laufen mit `sicher.sh --pg` · Anforderungen FA-10-01, FA-10-10, FA-10-11, FA-11-07, FA-11-09, FA-11-18 · Befunde: `berichte/FA-BESTAND.md` (Zeilen zu diesen Kennungen), `berichte/FA-SHOP-01.md`, `berichte/FA-SHOP-02B.md`.

## Aufgabe in einem Satz
Die Artikelliste zeigt nur, was in ihre Kategorie gehört, ein echtes Codeprodukt lässt sich nicht ohne Hersteller und Codebereich veröffentlichen, und die Importtabelle übernimmt Schlüsseltyp und Einsatzbereich.

## Vorgabe des Inhabers (wörtlich, Abschnitte 10 und 11)
Hauptkategorien des Shops: „Schlüssel nach Code · Schlüssel nach Vorlage · Autoschlüssel als Produkte · Autoschlüsselgehäuse · Gehäuseumbau und Reparaturservice · Customizing und Modifikation · Gleichschließende Zylinder und Sperrschließungen · Schließtechnik und Zubehör · später weitere geeignete Sicherheitstechnik Produkte“. Zu Schlüssel nach Code: „Jedes Produkt mit Hersteller, System, Codebereich, Beispielcode, Bild, Preis, Stückzahl, Codefeld, Hinweisen und Warenkorb.“

## So bauen
1. Artikelliste je Kategorie (FA-10-10, FA-10-11, FA-10-01). Heute liest `src/app/(site)/artikel/page.tsx` alle Standardartikel ohne Filter; `categoryId` am Artikel wird nicht genutzt, und Gehäuse-Teile erscheinen unter „Schließtechnik und Zubehör“.
   - `/artikel` zeigt die Artikel der ersten Hauptkategorie mit der Art „artikel“ („Schließtechnik und Zubehör“) samt ihren Unterkategorien, dazu Artikel ohne Kategorie, so wie `anzahlJeKategorie` in `src/app/(site)/shop/kategorie-weg.ts` zählt. Fahrzeugteile (Artikel mit `fahrzeugteil`) erscheinen dort nicht mehr; sie haben ihre eigene Liste `/autoschluessel/gehaeuse/teile`. Die Zahl im Shop und die Liste müssen übereinstimmen (ein Test hält das fest).
   - Jede weitere sichtbare Kategorie mit der Art „artikel“ (heute keine; später etwa „Weitere Sicherheitstechnik“) und jede Unterkategorie mit Artikeln bekommt eine eigene Liste unter `/artikel/kategorie/[slug]`: Name und Beschreibung der Kategorie aus den Daten, dieselben Karten wie `/artikel`, Brotkrumen über `/shop`. Ohne indexierbaren Artikel steht die Seite auf noindex und nicht in der Sitemap (R2, R3); eine Kategorie ohne Artikel führt in die Anfrage, wie der Kategorie-Weg es heute regelt. Lies vorher `node_modules/next/dist/docs` zu dynamischen Routen und `generateStaticParams`.
   - `kategorieWeg`: Eine Artikel-Kategorie, deren Ziel leer ist oder auf `/artikel` zeigt, obwohl sie nicht die erste ist, führt auf ihre eigene Liste. Unterkategorien verlinkt die Liste ihrer Hauptkategorie.
   - Die Artikelseite `/artikel/[slug]` zeigt in den Brotkrumen die Kategorie des Artikels (Fahrzeugteile bleiben, wie sie sind).
2. Pflichtangaben beim Veröffentlichen eines echten Codeprodukts (FA-11-07, FA-11-09). Ein Codeprodukt lässt sich im Admin heute ohne Hersteller und ohne Codebereich veröffentlichen; nur der Import verlangt beides. Baue eine Prüfung nach dem Muster von `systemPruefen` in `src/payload/collections/Produkte.ts`: Beim Veröffentlichen eines Codeprodukts, das kein Beispiel ist, sind Hersteller (Auswahl aus dem Stamm oder der ältere Freitext) und Codebereich Pflicht; Entwürfe und Beispiele bleiben frei. Meldung in klarem Deutsch am Feld. Bereits veröffentlichte Produkte ohne diese Angaben bleiben lesbar; sie lassen sich erst wieder speichern, wenn die Angaben da sind (sag das in der Betreiberanleitung). Tests: reine Prüffunktion als Unit-Test, dazu ein Datenbanktest in `src/payload/shop-grundlage.db.test.ts`.
3. Importspalten (FA-11-18). `scripts/sortiment-import.mjs` kennt keine Spalten für Schlüsseltyp und Einsatzbereich und setzt den Schlüsseltyp leer. Nimm die freiwilligen Spalten `schluesseltyp` und `einsatz` auf, bilde sie auf die vorhandenen Felder des Produkts ab, ergänze Vorlage, Anleitung und `scripts/sortiment-import.test.ts`. Der Import legt weiter nur Entwürfe an (A-057).
4. Betreiberanleitung: `docs/betrieb/` (die Anleitung zum Sortiment aus FA-SHOP-01) um die drei Punkte ergänzen.

## Schreibrechte
`src/app/(site)/artikel/**`, `src/app/(site)/shop/**`, `src/lib/artikel.ts` und `src/lib/data/shop.ts` (nur Hilfen für Kategorie und Liste), `src/app/sitemap.ts`, `src/payload/collections/Produkte.ts` (nur die Prüfung aus Punkt 2), `scripts/sortiment-import.mjs` mit Test und Vorlage, `docs/betrieb/**` (nur die Anleitung zum Sortiment), zugehörige Tests, `src/lib/data/seo-laengen.test.ts` (neue Route), `_werkstatt/ausbau/berichte/FA-SHOP-05.md`.
Nicht anfassen: Preise, Datenschema und Migrationen, `content/kategorien.json` (nur lesen; braucht ein Punkt eine Änderung der Daten, als gewünschten Eintrag melden), die Liste `/autoschluessel/gehaeuse/teile`, Warenkorb, Kasse, Navigation, Startseite.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`, `… --json -- npm run build`. Kein Server, kein git.

## Grenzen
G4, G6, G8, G9, R2, R3, R4, R8 (Strukturdaten nur für Sichtbares). Texte kurz, für ältere Kunden verständlich, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-05 · BEREIT ZUR RÜCKGABE ===
