# FA-SEO-01D · Canonical im Admin: freiwilliges Feld in den SEO-Angaben, nur eigene Adressen, eine Stelle für die Berechnung

Kopf: Etappe FA Priorität 6 · Rolle Baumeister · Modell Opus · Stufe 3 (Indexierung) · Kostenklasse S bis M · ändert das Datenschema (ein Feld in der Feldgruppe `seo`, die sieben Sammlungen benutzen) und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket mit Schema) · Anforderungen FA-22-42 bis FA-22-45, FA-25-04 · letzter offener Punkt aus `pakete/FA-SEO-01.md` (Punkt 5) · Berichte: `berichte/FA-SEO-01A.md`, `-01B.md`, `-01C.md`.

## Aufgabe in einem Satz
Der Betreiber kann bei Bedarf für eine Seite eine abweichende Canonical-Adresse eintragen; ohne Eintrag gilt wie bisher die berechnete Adresse, und fremde Adressen sind ausgeschlossen.

## Vorgabe des Inhabers (wörtlich, Abschnitt 22)
„SEO Felder wie Title, Description, Canonical und Indexstatus bei Bedarf bearbeiten.“

## Lage (geprüft am 16.11.2026)
- Feldgruppe `seo` in `src/payload/fields/gemeinsam.ts` (`seoFeld()`): Seitentitel, Beschreibung, verwandte Seiten, „Nicht in Suchmaschinen aufnehmen“, Vorschaubild. Benutzt von den Sammlungen Seiten, Leistungsseiten, Ratgeber, Produkte, Kategorien, Einsatzgebiete, Fahrzeugmarken.
- Lesemodell `SeoFields` (`src/lib/types.ts`), Abbildung `seoZuSeite`, `eigeneSeoZuSeite`, `seoZuPayload` (`src/lib/data/payload-mapping.ts`), JSON-Rückfall in `content/*.json` und `src/lib/data/defaults`.
- Die Canonical-Adresse setzt heute jede Seite selbst in `generateMetadata` (`alternates: { canonical: … }`), rund 60 Stellen unter `src/app/(site)`. Indexierbarkeit: `src/lib/umgebung.ts`, `src/lib/rechtliches/indexierung.ts`, Sitemap `src/app/sitemap.ts` (FA-SEO-01C).

## So bauen
1. Feld „Canonical (nur bei Bedarf)“ in `seoFeld()`: Text, freiwillig. Angenommen wird nur eine Adresse der eigenen Seite: ein Pfad, der mit `/` beginnt, oder eine volle Adresse auf der eigenen Domain, die beim Speichern auf den Pfad gekürzt wird. Abgelehnt mit verständlicher Meldung: fremde Domains, Protokolle außer https, `/admin`, `/api`, Kasse, Warenkorb, Bestell- und Vorgangsseiten, Adressen mit Suchteil oder Sprungmarke. Hilfetext in Alltagssprache: wann man das Feld braucht (zwei Seiten mit fast gleichem Inhalt) und dass es sonst leer bleibt.
2. Lesemodell und Abbildung: `SeoFields.canonical?: string`, hin und zurück in den drei Abbildungsfunktionen, im JSON-Rückfall erlaubt (kein Bestandseintrag bekommt einen Wert). Additive Migration über `sicher.sh --pg -- npx payload migrate:create seo_canonical`; Typen neu erzeugen.
3. Eine Stelle für die Entscheidung: eine reine Funktion (etwa `kanonischeAdresse(seo, berechnet)` in `src/lib/seo` oder neben `indexierung.ts`), die den Eintrag nimmt, wenn er gültig ist, sonst die berechnete Adresse. Jede `generateMetadata`, die ihre SEO-Angaben aus einer der sieben Sammlungen liest, benutzt sie; die übrigen Seiten bleiben, wie sie sind. Zähle die umgestellten Stellen im Bericht.
4. Folgen, die stimmen müssen: Eine Seite, deren Canonical auf eine andere Adresse zeigt, steht nicht in der Sitemap (sie meldet sich selbst als Zweitfassung). Strukturdaten und Brotkrumen behalten die eigene Adresse der Seite. `noindex` und Canonical zugleich: `noindex` gewinnt, der Admin weist im Hilfetext darauf hin. Zeigt der Eintrag auf die eigene Adresse der Seite, gilt er als leer.
5. Prüfe bei der Gelegenheit, dass der Schalter „Nicht in Suchmaschinen aufnehmen“ in jeder der sieben Sammlungen wirkt (Meta-Angabe und Sitemap); je Sammlung ein Test. Wirkt er irgendwo nicht, behebe es an der Quelle und nenne es im Bericht.
6. Tests: Feldprüfung (gültig, fremd, verbotene Wege, volle eigene Adresse wird gekürzt), Abbildung hin und zurück, Funktion der Entscheidung, Sitemap ohne Zweitfassungen, je Seitentyp ein Fall mit gesetztem Canonical.

## Zusatz aus der Bestandsaufnahme (vom Orchestrator, 16.11.2026)
- FA-25-00: Die SEO-Felder im Admin (Titel und Beschreibung) zeigen Länge und Breite mit Warnung: Titel gelb über 580 px (Messung aus `src/lib/titelbreite.ts`), Beschreibung gelb außerhalb von 120 bis 160 Zeichen. Nur Warnung, kein Speicherverbot. Der Hinweistext zum Titel nennt heute 40 statt 60 Zeichen beziehungsweise 580 px; an die Projektregel angleichen. Eigene Admin-Feldkomponente unter `src/payload/components/**`, Test der Rechenfunktion.

## Stand der Regeln (vom Orchestrator, 16.11.2026, A-068 und A-069)
- Schrift: Die kleinste Textstufe ist 14 px (`text-caption`); jede Beschriftung in einer Zeichnung ist auf dem Bildschirm mindestens 14 px groß. `src/app/(site)/schriftstufen.test.ts` und die Tests der Zeichnungen prüfen das; `src/components/visual/generators/**` fasst du nicht an.
- Überlauf: Freier Text in schmalen Zellen muss umbrechen können (kein `whitespace-nowrap` auf Text, dessen Länge der Betrieb bestimmt; lange Wörter mit `[overflow-wrap:anywhere]` oder genug Platz). Die Abnahme sucht auf allen Seiten bei sieben Fensterbreiten nach überlaufendem Text.
- Statische Seiten und Daten: Liest eine statisch erzeugte Seite Daten einer Sammlung oder eines Globals, braucht diese Sammlung die Erneuerungs-Hooks (`src/payload/hooks/revalidate.ts`), und ein Test hält das fest. Fehlt der Hook an einer Sammlung außerhalb deiner Schreibrechte, melde das als OFFENE FRAGE.
- Erzeugte Folgedateien: `src/payload-types.ts` und, bei neuen Admin-Bausteinen, `src/app/(payload)/admin/importMap.js` darfst du neu erzeugen; nenne die Änderung im Bericht.
- Migration: nur additiv; im `down` zuerst Fremdschlüssel, Indizes und Spalten mit `IF EXISTS`, dann Tabellen. Die Abnahme spielt `down` und `up` an einer Wegwerf-Datenbank zurück und vor.
- Texte im Admin (Feldbeschreibungen, Meldungen): ohne die Wörter, die das Prüfwerkzeug `werkzeuge/reste.mjs` als Entwurfsrest meldet (zum Beispiel „Platzhalter“, „Demo“, „Muster“), außer sie sind selbst das Thema; dann nenne die Stelle im Bericht.

## Schreibrechte
src/payload/fields/gemeinsam.ts (nur `seoFeld`), neue Migration, src/migrations/index.ts, src/payload-types.ts, src/lib/types.ts (nur `SeoFields`), src/lib/data/payload-mapping.ts (nur SEO-Abbildung), die neue Funktion mit Test, `generateMetadata` der betroffenen Seitenvorlagen unter src/app/(site) (nur die Zeile der Canonical-Adresse, mit dem Edit-Werkzeug), src/app/sitemap.ts, zugehörige Tests, ein kurzer Absatz in der passenden Betreiberanleitung unter docs/betrieb (wo SEO-Felder erklärt sind; sonst `docs/betrieb/admin-alltag.md`), _werkstatt/ausbau/berichte/FA-SEO-01D.md.
Nicht anfassen: Titel, Beschreibungen und sichtbare Texte, Strukturdaten außer dem Genannten, `robots`, Kopfzeilen der Umgebung, Navigation.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`
- Lies vor Änderungen die Anleitung zu Metadaten in `node_modules/next/dist/docs` (`alternates`, G12). Kein Server, kein git.

## Grenzen
G6 (additiv), G8, R1 (eine Fassung für Mensch und Bot), R2, R6, R8. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen) · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-01D · BEREIT ZUR RÜCKGABE ===
