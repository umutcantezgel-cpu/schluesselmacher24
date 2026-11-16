# FA-INHALT-06 · Erklärtexte zu Schließsystemen und Zutrittsbausteinen im Admin pflegbar

Kopf: Etappe FA Priorität 5 · Rolle Baumeister · Modell Opus · Stufe 3 (neues Datenschema) · Kostenklasse L · mit Datenschema (ein Global, additive Migration `systemerklaerungen`) · Anforderung FA-16-21 · Befunde: `berichte/FA-BESTAND.md` (Zeile FA-16-21), `berichte/FA-ABGLEICH.md` (Zeile „FA-16-21 (nachgetragen)“).

## Aufgabe in einem Satz
Die Erklärtexte zu den Schließsystemen auf `/schliessanlagen` und zu den Bausteinen auf `/elektronische-zutrittsloesungen` kommen aus der Datenschicht und sind im Admin ohne Entwickler pflegbar; der heutige Wortlaut im Code bleibt Startwert und Rückfall.

## Vorgabe des Inhabers (Abschnitte 16, 17 und 22, sinngemäß; Wortlaut im Volltext)
Schließanlagen und elektronischer Zutritt werden für Laien erklärt (Zentralschloss-, Hauptschlüssel-, Generalhauptschlüssel-Anlage mit Vergleich; Bausteine des elektronischen Zutritts). Inhalte der Seite pflegt der Betrieb im Adminbereich selbst.

## Bestand (gelesen vom Orchestrator, 16.11.2026)
- `src/components/schliessanlagen/system-erklaerung.tsx`: `LOCK_SYSTEMS` (je System `id`, `label`, `short`, `explanation`, `suitableFor`, `opensWhat`, `typicalFor`, `expandable`, `info.title`, `info.body`, `bullets`, dazu `figure` mit Zeichnung), `systemName`, `systemReiter`, `ErweiterbareAnlage`, `SystemVergleich`. Einzige Nutzer: diese Datei und `src/app/(site)/schliessanlagen/page.tsx` (Serverseite).
- `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`: `const BLOCKS` (je Baustein `id`, `title`, `body`, `points`, dazu `icon` und `iconSize`), genutzt in derselben Datei (Liste und Strukturdaten ab Zeile 235).
- Globals gibt es für Einstellungen, Richtwerte und Zylinderkatalog (`src/payload/globals/`). Die Datenschicht steht in `src/lib/data/` (`adapter.ts`, `json-adapter.ts`, `payload-adapter.ts`, `payload-mapping.ts`, `defaults/`), JSON-Fallback in `content/*.json`, Startwerte des Seeds in `content/startwerte/`.

## So bauen
1. Lies als Muster ein vorhandenes Global mit JSON-Fallback von der Sammlung bis zur Seite (`Richtwerte`: `src/payload/globals/Richtwerte.ts`, `src/lib/data/richtwerte.ts` mit Tests, Seed mit Startwert-Abgleich). Lies vor Next-Code die passende Anleitung in `node_modules/next/dist/docs`.
2. Neues Global `Systemerklaerungen` (Gruppe Inhalte, Titel für Laien, etwa „Erklärtexte Schließanlagen und Zutritt“) mit zwei Listen:
   - Schließsysteme: je Eintrag die feste Kennung als Auswahl (genau die Kennungen aus `LOCK_SYSTEMS`), dazu die Textfelder aus dem Bestand (Name, Erklärung, „Geeignet für“, „Was öffnet was“, „Typisch für“, „Erweiterbar“, Titel und Text des Infokastens, Stichpunkte). Kürzel (`short`), Zeichnung und Reihenfolge bleiben im Code: Sie hängen an den Zeichnungen und am Konfigurator.
   - Zutrittsbausteine: je Eintrag die feste Kennung als Auswahl (genau die Kennungen aus `BLOCKS`), Titel, Text, Stichpunkte. Icon und Reihenfolge bleiben im Code.
   Feldbeschreibungen im Admin in einfachen Worten, mit dem Hinweis „leer lassen heißt: der Standardtext gilt“. Keine neuen Systeme oder Bausteine über den Admin: Eine unbekannte Kennung gibt es durch die Auswahl nicht, eine doppelte weist die Prüfung beim Speichern ab.
3. Migration `systemerklaerungen`: erzeugen, das `up` lesen und alles herausnehmen, was nicht zu diesem Global gehört (nur additiv, G6); `down` mit `IF EXISTS` in richtiger Reihenfolge (zuerst abhängige Tabellen). `src/payload-types.ts` neu erzeugen.
4. Startwert und Rückfall: Die heutigen Texte wandern wortgleich nach `src/lib/data/defaults/systemerklaerungen.ts` und `content/systemerklaerungen.json` (ein Test hält beide gleich). `LOCK_SYSTEMS` und `BLOCKS` setzen sich aus Standardtext und den festen Teilen im Code zusammen; an keiner Stelle steht derselbe Text zweimal. Der Seed legt die Werte wiederholbar an und überschreibt nichts, was das Team geändert hat (Startwert-Abgleich wie bei den anderen Inhalten).
5. Datenschicht: eine Funktion `getSystemerklaerungen()` in beiden Adaptern. Regel je Feld: Ein gepflegter, nicht leerer Wert ersetzt den Standardtext; leer oder nur Leerzeichen heißt Standardtext; leere Stichpunkte fallen weg, eine ganz leere Liste heißt Standardliste. Ohne Datenbank und bei Fehlern gilt der Rückfall, die Seite bricht nie.
6. Seiten: `/schliessanlagen` und `/elektronische-zutrittsloesungen` lesen über die Datenschicht und reichen die Texte an die Bausteine weiter (`systemReiter`, `SystemVergleich`, `ErweiterbareAnlage`, Liste der Bausteine). Die Strukturdaten der Zutrittsseite nennen genau die sichtbaren Texte (R8). Beide Seiten bleiben statisch mit der üblichen Aktualisierung nach einer Änderung im Admin (prüfe, wie die anderen Globals das auslösen, und nutze dasselbe Mittel). Prüfe mit einer Suche, ob weitere Stellen dieselben Sätze fest führen (Konfigurator, Ratgeber, Tutorials-Vorbereitung); nenne sie im Bericht, ändere sie nur, wenn sie in deinen Schreibrechten liegen.
7. Wortlaut: Du änderst keinen Satz. Der Begriff „Zentralschlossanlage, auch Zentralschließung genannt“ bleibt, wie er ist; ob der Inhaber einen der beiden Begriffe bevorzugt, kommt als Frage in FÜR MENSCHEN.
8. Nicht Teil des Pakets: die Auswahllisten und Regeln der Konfiguratoren (sie hängen an Preis- und Empfehlungslogik). Nenne im Bericht kurz, welche Texte dort fest im Code stehen, als Entscheidungsgrundlage.
9. Tests: Zuordnung Kennung zu Text in beide Richtungen; Rückfall bei leerem Feld, leerer Liste, fehlendem Eintrag, fehlender Datenbank; doppelte Kennung wird abgewiesen; Standarddatei und JSON gleich; die Seiten zeigen einen gepflegten Text (reine Funktionen und `renderToStaticMarkup`); Datenbanktest für Lesen, Seed und Wiederholung des Seeds. Erfundene Testtexte (G4).
10. Betreiberanleitung: neuer Abschnitt in `docs/betrieb/admin-alltag.md` oder eigene Datei `docs/betrieb/erklaertexte-pflegen.md`: wo die Texte stehen, was „leer“ bedeutet, was nicht pflegbar ist und warum, keine Preise, keine Normzusagen und keine Herstellerversprechen in diese Texte (R4, R9).

## Schrift und Gestaltung (A-068)
Kleinste Textstufe 14 px; an Zeichnungen, Ausschnitten und Schriftgrößen änderst du nichts (`src/components/visual/**` nicht anfassen). Längere gepflegte Texte dürfen das Layout nicht sprengen: Prüfe an einem erfundenen langen Text, dass Reiter, Vergleichstabelle und Karten umbrechen.

## Stand der Regeln (vom Orchestrator, 16.11.2026, A-068 bis A-071)
- Schrift: Die kleinste Textstufe ist 14 px (`text-caption`); jede Beschriftung in einer Zeichnung ist auf dem Bildschirm mindestens 14 px groß. `src/app/(site)/schriftstufen.test.ts` und die Tests der Zeichnungen prüfen das; `src/components/visual/generators/**` fasst du nicht an.
- Überlauf: Freier Text in schmalen Zellen muss umbrechen können (kein `whitespace-nowrap` auf Text, dessen Länge der Betrieb bestimmt; lange Wörter mit `[overflow-wrap:anywhere]` oder genug Platz). Die Abnahme sucht auf allen Seiten bei sieben Fensterbreiten nach überlaufendem Text.
- Statische Seiten und Daten: Liest eine statisch erzeugte Seite Daten einer Sammlung oder eines Globals, braucht diese Sammlung die Erneuerungs-Hooks (`src/payload/hooks/revalidate.ts`), und ein Test hält das fest. Fehlt der Hook an einer Sammlung außerhalb deiner Schreibrechte, melde das als OFFENE FRAGE.
- Erzeugte Folgedateien: `src/payload-types.ts` und, bei neuen Admin-Bausteinen, `src/app/(payload)/admin/importMap.js` darfst du neu erzeugen; nenne die Änderung im Bericht.
- Migration: nur additiv; im `down` zuerst Fremdschlüssel, Indizes und Spalten mit `IF EXISTS`, dann Tabellen. Die Abnahme spielt `down` und `up` an einer Wegwerf-Datenbank zurück und vor.
- Was im Browser landet (A-071): Eine Datei, die ein Baustein mit „use client“ importiert, bekommt keine Importe von Serverlogik (Partner, Prüfliste, Ortsstamm, Datenbank). Eine Datei, aus der Serverbausteine vieler Seiten lesen, bindet keinen Client-Baustein ein: Werte und Hilfsfunktionen gehören in eine eigene Datei ohne Client-Baustein. Die Abnahme misst das Skript-Gewicht der Seiten gegen den Stand davor; jede Zunahme braucht einen Grund im Bericht.
- Texte im Admin (Feldbeschreibungen, Meldungen): ohne die Wörter, die das Prüfwerkzeug `werkzeuge/reste.mjs` als Entwurfsrest meldet (zum Beispiel „Platzhalter“, „Demo“, „Muster“), außer sie sind selbst das Thema; dann nenne die Stelle im Bericht.

## Schreibrechte
`src/payload/globals/Systemerklaerungen.ts` (neu), Eintrag im Payload-Config, `src/migrations/**` (nur die neue Migration und ihr Index), `src/payload-types.ts` (erzeugt), `src/lib/data/**` (neue Funktion, Standardwerte, Tests), `content/systemerklaerungen.json` (neu), Startwerte des Seeds, `src/components/schliessanlagen/system-erklaerung.tsx`, `src/app/(site)/schliessanlagen/page.tsx`, `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`, zugehörige Tests, `docs/betrieb/**` (ein Abschnitt oder eine Datei), `_werkstatt/ausbau/berichte/FA-INHALT-06.md`.
Nicht anfassen: Konfiguratoren, Preise, `src/components/visual/**`, Navigation, andere Sammlungen und Globals, `content/seo.json` (Kopftexte und häufige Fragen sind schon pflegbar).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --pg -- npx vitest run --config vitest.db.config.ts`, `… --json -- npm run build`. Kein Server, kein git, keine Formularsendung (G5).

## Grenzen
G4, G6 (nur additive Migration, Seed wiederholbar, JSON-Fallback), G8, G9, R1, R4, R8, R9. Texte im Admin kurz und für Laien, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-06 · BEREIT ZUR RÜCKGABE ===
