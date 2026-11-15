# FA-SOFORT-04 · Demo-Daten raus aus dem Live-Auftritt (Schlüssel nach Code und Beispielartikel)

Kopf: Etappe FA Priorität 1 · Rolle Baumeister · Modell Opus · Stufe 3 (Entfernen oder Ersetzen von Bestand) · Kostenklasse L · Anforderungen FA-10-02, FA-11-02, FA-11-17, FA-28 Zeile „Sofort“ · Entscheidung A-046 · Befunde: `_werkstatt/ausbau/berichte/FA-ABGLEICH.md` Block 05 und `berichte/FA-KUNDSCHAFTER-05.md`, `berichte/FA-BLINDPRUEFUNG-05.md`.

## Aufgabe in einem Satz
Sorge dafür, dass kein Beispiel- oder Demo-Produkt mehr auf der öffentlichen Seite erscheint, bestellbar ist oder in eine neue Datenbank gelangt, und dass „Schlüssel nach Code“ ohne echte Produkte ehrlich in eine Anfrage führt.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026)
- Abschnitt 10: „Der Shop muss ein echter Fach Onlineshop werden. Demo Produkte und künstliche Beispiele dürfen nicht live bleiben.“
- Abschnitt 11: „Die derzeitigen Beispielprodukte wie Büroschrank, Rollcontainer oder erfundene Codes entsprechen nicht dem realen Angebot und müssen entfernt werden.“ · „Wenn ein Code nicht eindeutig passt, zusätzlich Anfrageoption anbieten.“ · „Die bereits übermittelten Ebay Angebote als reale Datenquelle verwenden“ (liegen dem Lauf noch nicht vor; die echten Produkte folgen in einem späteren Paket).
- Abschnitt 01: „Nicht stillschweigend durch Platzhalter, Demo Daten oder halbfertige Funktionen ersetzen.“

## Lage (geprüft)
- `content/code-lines.json` enthält 52 Codelinien. Alle sind Demo-Daten (Namen nach Schema „Büroschrank und Rollcontainer — Serie MS-01“, Hersteller „[Hersteller eintragen]“, erfundene Beispielcodes, erfundene Preise). Sie sind aktiv, gelistet, haben Produktseiten und sind bestellbar. `src/lib/data/defaults/code-lines.ts` erzeugt denselben Satz als Rückfall.
- Für Standardartikel gibt es acht Beispielartikel mit `example: true` („sichtbar, aber nicht bestellbar, noindex“) unter /artikel.
- Das Feld `example` gibt es an beiden Arten (Admin-Feld `beispiel`). `src/lib/actions/orders.ts` lehnt Beispiel-Linien schon ab, `src/lib/codelinie.ts` nimmt sie aus dem Index.
- Die Produktion läuft derzeit ohne Datenbank aus `content/*.json`.

## Entscheidung (A-046), so bauen
1. Kennzeichnen statt löschen: Alle 52 Codelinien in `content/code-lines.json` und im Generator `defaults/code-lines.ts` tragen `example: true`. Die Daten bleiben als Musterdaten für Tests und lokale Entwicklung im Repository.
2. Eine Regel, eine Stelle: Beispiel-Einträge (Codelinien und Standardartikel) sind auf der öffentlichen Seite unsichtbar. Baue dafür `src/lib/beispiele.ts` mit `beispieleSichtbar()` (wahr nur, wenn die Umgebungsvariable `SM24_BEISPIELE` genau `1` ist) und filtere in der Datenschicht (`src/lib/data`, die Lesefunktionen für Codelinien und Standardartikel, die Seiten, Sitemap, Navigation, Strukturdaten und Aktionen nutzen), sodass Listen, Kategorien, Hersteller- und Detailseiten, Suche, Sitemap, llms.txt, Strukturdaten, Warenkorb und Bestellung Beispiel-Einträge nicht mehr kennen. Detailseiten von Beispiel-Einträgen antworten mit 404. Prüfe jede Stelle, die Codelinien oder Artikel liest, auch `generateStaticParams`.
3. Tests und lokale Entwicklung: `vitest.config.ts` und `vitest.db.config.ts` setzen `SM24_BEISPIELE=1`, damit die vorhandenen Tests mit den Musterdaten weiterlaufen. Die Datenweiche (`_werkstatt/ausbau/werkzeuge/sicher.sh`) und der Build setzen die Variable nicht. Ergänze Tests, die ohne die Variable belegen: keine Beispiel-Linie in Listen, 404 auf der Detailseite, nicht in der Sitemap, nicht bestellbar, nicht im Seed.
4. Seed: `src/payload/seed.ts` legt Beispiel-Einträge nicht mehr in einer Datenbank an (weder Codelinien noch Standardartikel), unabhängig von der Variable. Vorhandene Einträge einer bestehenden Datenbank bleiben unberührt (nichts löschen). Passe `seed.db.test.ts` an, ohne eine Prüfung zu lockern.
5. Leerer Zustand, ehrlich: `/schluessel-nach-code` erklärt die Leistung weiter (wo der Code steht, wie die Bestellung läuft) und zeigt, solange es keine echten Produkte gibt, statt der Produktliste einen klaren Block: Die Codeprodukte werden gerade eingepflegt; bis dahin prüfen wir den Code auf Anfrage. Kein Datum, keine Zusage. Knopf „Code anfragen“.
6. Anfrageoption (FA-11-17), dauerhaft: Baue den Weg „Code anfragen“ so, dass er auch später neben echten Produkten steht (für Codes, die zu keinem Produkt passen): Hersteller oder Schloss, Code wie aufgedruckt, Stückzahl, freiwillig ein Foto von Schlüssel oder Schloss, Kontakt. Nutze dafür die vorhandene allgemeine Anfrage (`src/app/(site)/service-und-termin/anfrage`, Parameter `thema`) und die vorhandene Serverprüfung; erweitere sie nur so weit nötig. Auf der Produktseite einer echten Codelinie verweist die Fehlermeldung bei unpassendem Code künftig auf diese Anfrage.
7. `/artikel`: Ohne echte Artikel zeigt die Übersicht einen ehrlichen leeren Zustand mit Verweis auf Beratung; aus Navigation, Fuß und Startseite verschwindet der Verweis auf /artikel, solange es keine echten Artikel gibt. Prüfe die Startseite (Abschnitt „Bestellen ohne Termin“) und die Navigation „Nach Code“: kein Verweis darf auf eine leere oder nicht vorhandene Seite führen.
8. Admin: Beschreibung des Feldes `beispiel` in `src/payload/collections/Produkte.ts` an die neue Regel anpassen („Beispiel: erscheint nicht auf der Seite“). Kein neues Feld, keine Migration.
9. `scripts/` und `src/scripts/livegang-pruefen.ts`: Prüfe, ob die Livegang-Prüfung Seitenzahlen oder Codelinien erwartet, und passe sie an die neue Regel an; ergänze dort eine Prüfung, die meldet, wenn ein Beispiel-Eintrag veröffentlicht wäre.

## Schreibrechte
- content/code-lines.json (nur `example` setzen), src/lib/data/defaults/code-lines.ts, src/lib/data/** (Lesefunktionen), neu: src/lib/beispiele.ts mit Test
- src/lib/codelinie.ts, src/lib/artikel.ts, src/lib/actions/orders.ts und weitere Lesestellen von Codelinien und Artikeln in src/lib
- src/app/(site)/schluessel-nach-code/**, src/app/(site)/artikel/**, src/app/(site)/service-und-termin/anfrage/** (nur für das Thema Code), src/app/sitemap.ts, src/app/llms.txt/route.ts
- src/app/(site)/page.tsx (nur der Abschnitt „Bestellen ohne Termin“ und Verweise auf /artikel), src/components/layout/site-footer.tsx und site-header.tsx (nur Verweise auf /artikel und Codekategorien)
- src/payload/seed.ts, src/payload/collections/Produkte.ts (nur die Beschreibung), vitest.config.ts, vitest.db.config.ts, src/scripts/livegang-pruefen.ts
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-SOFORT-04.md (dein Bericht)
Nicht anfassen: content/rubriken.json, src/lib/navigation.ts im Bereich „schluessel-nach-vorlage“, content/seo.json, Dateien unter src/app/(site)/schluessel-nach-vorlage und schluessel-einschicken (dort arbeitet gleichzeitig das Paket FA-SOFORT-03). Schlagen Tests in diesen fremden Dateien vorübergehend fehl, melde es im Bericht und behebe es nicht.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- Datenbanktests: `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts` (nur du nutzt in dieser Zeit `--pg`)
- Build ohne Datenbank: `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`; nenne die Seitenzahl vorher (232) und nachher und erkläre die Differenz. Kein Server, kein git.
- Lies vor Änderungen an Next-Schnittstellen (Routen, `generateStaticParams`, `notFound`, Sitemap) die passende Anleitung in `node_modules/next/dist/docs` (G12).

## Grenzen
G4, G5, G6 (keine Migration nötig; der JSON-Fallback trägt alles), G8 (keine Prüfung lockern), G9 (keine Preise ändern, keine Rechtstexte), R4 (nichts erfinden: keine Produkte, Hersteller, Preise, Fristen), R8 (keine Strukturdaten für Unsichtbares). Texte: kurze, natürliche Sätze, keine Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen: Unit, DB, Seiten im Build) · BELEGE · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SOFORT-04 · BEREIT ZUR RÜCKGABE ===
