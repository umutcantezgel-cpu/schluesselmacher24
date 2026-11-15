# FA-SHOP-01B · Shop-Grundlage, Teil 2 (Seiten und Import): Produktliste nach Hersteller und System, Hersteller- und Kategorieseiten aus den Daten, Produktbild, Strukturdaten, Import der echten Angebote

Kopf: Etappe FA Priorität 3 · Rolle Baumeister · Modell Opus · Stufe 3 · Kostenklasse L · darf `sicher.sh --pg` nutzen (in dieser Zeit kein anderes Paket mit Schema); keine Migration erwartet · Anforderungen FA-10-01, FA-10-03, FA-10-10, FA-11-01 bis FA-11-19 (Seite und Import), FA-22-01 bis FA-22-10 (soweit Seite) · Voraussetzung: FA-SHOP-01 ist abgenommen (Sammlungen Kategorien und Hersteller, Felder System, Codebereich, Lieferzeit, Verfügbarkeit, JSON-Fallback). Lies zuerst `berichte/FA-SHOP-01.md`, Abschnitt „FÜR FA-SHOP-01B“.

## Aufgabe in einem Satz
Zeige den Shop so, wie der Inhaber ihn beschreibt: Produkte nach Hersteller und System gruppiert, Kategorie- und Herstellerseiten aus den Daten, mit Bild, Lieferzeit und Verfügbarkeit, und baue den Weg, auf dem die echten Angebote des Inhabers geprüft in den Shop kommen.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026)
- Abschnitt 10, Hauptkategorien: Schlüssel nach Code · Schlüssel nach Vorlage · Autoschlüssel als Produkte · Autoschlüsselgehäuse · Gehäuseumbau und Reparaturservice · Customizing und Modifikation · Gleichschließende Zylinder und Sperrschließungen · Schließtechnik und Zubehör · später weitere geeignete Sicherheitstechnik Produkte. „Der Terminbereich für Autoschlüssel bleibt davon getrennt. Ein Kunde soll also entweder einen Termin anfragen oder ein passendes Produkt beziehungsweise einen Einsendeservice direkt im Shop buchen können.“
- Abschnitt 11: „Etwa 50 bis 52 reale Schlüssel nach Code Angebote übernehmen, anschließend laufend erweiterbar. Produkte nach Hersteller und System gruppieren. Beispiel: Unter BKS erscheinen nur die tatsächlich angebotenen BKS Codeprodukte. Jedes Produkt mit Hersteller, System, Codebereich, Beispielcode, Bild, Preis, Stückzahl, Codefeld, Hinweisen und Warenkorb. Wenn ein Code nicht eindeutig passt, zusätzlich Anfrageoption anbieten. Die bereits übermittelten Ebay Angebote als reale Datenquelle verwenden und Produktinformationen sauber übernehmen. Neue Codeprodukte müssen später im Adminbereich ohne Entwickler angelegt werden können.“

## Lage
- Echte Produktdaten liegen noch nicht vor (MA-34). Die 52 Demo-Linien sind als Beispiele gekennzeichnet und unsichtbar (A-046); alles muss ohne Produkte ehrlich aussehen und mit Produkten richtig arbeiten. Tests nutzen erfundene Testdaten (`SM24_BEISPIELE=1` in den Tests).

## So bauen
1. Shop-Einstieg nach Kategorien: Die Hauptkategorien des Inhabers aus den Daten, in seiner Reihenfolge, jede mit ihrem Ziel (Produktliste, Anfrage, Konfigurator) und einem ehrlichen Zustand ohne Produkte („Produkte folgen; bis dahin Anfrage“ mit dem passenden Anfrageweg). Kategorien, die nicht gezeigt werden sollen, erscheinen nicht. Prüfe, wo der Einstieg heute liegt (`/schluessel-nach-code`, `/artikel`), und baue eine Übersicht `/shop` nur, wenn sie eigenen Nutzen hat; sonst reichen die Kategorieseiten. Alte Adressen umbenannter Kategorien leiten weiter.
2. Produktliste „Schlüssel nach Code“: gruppiert nach Hersteller, darunter nach System; unter einem Hersteller erscheinen nur seine wirklich angebotenen Produkte. Herstellerseiten und Kategorieseiten kommen aus den Daten. Produktbild in Liste und im Kopf der Detailseite, Galerie auf der Detailseite; ohne Bild das Fach-Icon (kein Platzhalterbild). Lieferzeit und Verfügbarkeit sichtbar; „nicht lieferbar“ ohne Warenkorb, „auf Anfrage“ mit „Code anfragen“. „Code anfragen“ steht auf jeder Liste und Detailseite.
3. Herstellerlogo nur, wenn am Hersteller „Freigabe liegt vor“ gesetzt ist (R12); sonst der Name als Text.
4. Strukturdaten `Product` und `Offer` nur mit echtem Preis und echter Verfügbarkeit (R8); bei „auf Anfrage“ kein Preisangebot. Brotkrumen für Kategorie, Hersteller, Produkt.
5. Import der echten Angebote: Skript `scripts/sortiment-import.mjs` liest eine Tabelle aus `_werkstatt/ausbau/eingang` (CSV; Spalten: hersteller, system, codebereich, beispielcode, codeformat, preis, staffel, max_stueck, hinweise, bild_datei, kategorie, quelle) und schreibt `content/code-lines.json` (ohne `example`) oder über die Local API in die Datenbank; es prüft jede Zeile (Pflichtfelder, Preisformat, Prüfmuster passt zum Beispielcode, Hersteller steht im Stamm oder wird als neuer Stammeintrag vorgeschlagen), bricht bei Unklarheit mit einer Liste ab und rät nichts (R4). Vorlage `_werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv` mit Kopfzeile und zwei deutlich als Beispiel gekennzeichneten Zeilen. Tests mit erfundenen Testdaten. Ergänze `docs/betrieb/shop-pflegen.md` um den Abschnitt „Angebote aus einer Tabelle übernehmen“.
6. Sitemap: Kategorie-, Hersteller- und Produktseiten nach der Index-Regel (nur veröffentlichte, keine Beispiele, keine leeren Herstellerseiten).
7. Navigation und Startseite: gemeinsame Dateien. Nenne im Bericht die gewünschten Einträge als exakte Liste.

## Schreibrechte
- neu: scripts/sortiment-import.mjs mit Test, Vorlage unter _werkstatt/ausbau/erhebung/boegen/, bei Bedarf src/app/(site)/shop/**
- ändern: src/app/(site)/schluessel-nach-code/**, src/app/(site)/artikel/**, src/lib/codelinie.ts, src/lib/artikel.ts, src/lib/data/** (nur Lesewege für Kategorien und Hersteller), src/components/seo/json-ld.tsx (nur Product, Offer, Brotkrumen dieser Seiten), src/app/sitemap.ts, next.config (nur Weiterleitungen alter Kategorieadressen, falls nötig), docs/betrieb/shop-pflegen.md
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-SHOP-01B.md
Nicht anfassen: content/code-lines.json (bleibt Musterdatensatz, außer durch den Import in Tests auf Kopien), Preise im Bestand, content/rubriken.json, Navigation und Startseite, Zylinderkatalog (FA-SHOP-04), Rechtstexte, die Sammlungen selbst (fertig aus FA-SHOP-01).

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build` (Seitenzahl nennen)
- Tests, die nicht fehlen dürfen: Liste gruppiert nach Hersteller und System; Hersteller ohne Produkte hat keine Seite; „nicht lieferbar“ ohne Warenkorb; kein `Offer` ohne Preis; Import lehnt eine Zeile ohne Pflichtfeld, mit falschem Preisformat und mit unpassendem Prüfmuster ab und schreibt dann nichts; Logo nur mit Freigabe.
- Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (G12). Kein Server, kein git.

## Grenzen
G4, G5, G6, G7 (keine neue Laufzeitbibliothek), G8, G9 (keine Preise erfinden oder ändern), R4, R8, R11 (keine fremden Bilder oder Texte, auch nicht aus Angeboten Dritter), R12. Texte kurz, verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Einträge in Navigation und Startseite als exakte Liste) · PRÜFUNG UND ERGEBNIS (Zahlen) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-01B · BEREIT ZUR RÜCKGABE ===
