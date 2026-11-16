# FA-INHALT-01B · Tutorials, Teil B: YouTube-Einbettung erst nach Zustimmung, Sicherheitsrichtlinie, Tutorials auf Leistungsseiten und in Formularen

Kopf: Etappe FA Priorität 5 · Rolle Baumeister · Modell Opus · Stufe 3 (Einwilligung, Sicherheitsrichtlinie) · Kostenklasse L · ohne neues Datenschema, wenn Teil A die Felder angelegt hat (fehlt eines: als OFFENE FRAGE melden, nicht bauen) · Anforderungen FA-21-08 bis FA-21-14, FA-12-04, FA-26-06 · Befunde: `berichte/FA-ABGLEICH.md` Block 09, `berichte/FA-BLINDPRUEFUNG-09.md` · Voraussetzung: FA-INHALT-01 (Teil A) ist abgenommen; lies zuerst `berichte/FA-INHALT-01.md`, Abschnitt „Stand für Teil B“, und die Paketdatei `pakete/FA-INHALT-01.md` (Vorgabe des Inhabers im Wortlaut, Punkte 4 bis 9).

## Aufgabe in einem Satz
Bette hinterlegte YouTube-Videos datenschutzgerecht ein (nichts lädt vor der Zustimmung) und zeige die passenden Tutorials dort, wo Kunden sie brauchen: auf Leistungsseiten und an den kritischen Schritten der Formulare.

## Vorgabe des Inhabers (wörtlich, Abschnitt 21 und 12)
„Zusätzlich werden passende Videos direkt in die jeweiligen Leistungsseiten eingebettet. […] Die technische Struktur muss jetzt so vorbereitet sein, dass YouTube Videos ohne Entwickleraufwand ergänzt oder ausgetauscht werden können.“ Abschnitt 12: „Video und Bildtutorial integrieren, wie ein Schlüssel richtig fotografiert wird.“

## So bauen
1. Baustein `VideoEinbettung` (Punkt 4 der Paketdatei): lädt nichts von YouTube, bevor der Kunde zustimmt. Zuerst eine Fassade aus eigenen Mitteln (kein Vorschaubild von YouTube-Servern; ein Bild aus der Medienablage, falls gepflegt, sonst eine gezeichnete Fläche mit Titel und Dauer), darunter der Satz, dass mit dem Start Daten an YouTube übertragen werden, mit Verweis auf die Datenschutzerklärung, und der Knopf „Video laden“. Nach dem Klick Einbettung über `youtube-nocookie.com`. Die Zustimmung gilt je Sitzung oder über die vorhandene Einwilligungsverwaltung (lies `src/components/recht` und die Cookie-Einstellungen; erweitere sie um die Kategorie „Videos“, ohne das Verhalten der vorhandenen Kategorien zu ändern, G9: ein Test hält fest, dass Speicherform, Voreinstellungen und Banner der bisherigen Kategorien gleich bleiben). Tastatur und Screenreader bedienbar, Titel am Rahmen, kein automatischer Start. Der Platzhalter aus Teil A entfällt.
2. Sicherheitsrichtlinie (Punkt 5): Erweitere die Content-Security-Policy gezielt um `frame-src` für `https://www.youtube-nocookie.com` (lies, wo die Richtlinie gesetzt wird, `next.config.ts`, und die Anleitung in `node_modules/next/dist/docs`). Nichts anderes öffnen.
3. Baustein `TutorialHinweis` (Punkt 6): zeigt die dem Ort zugeordneten Tutorials (Video oder Schrittfolge) kompakt an. Einbinden auf: Schlüssel nach Vorlage (Seite und Fotoschritt der Anfrage), Autoschlüssel-Anfrage (Fotoschritt und Fahrzeugschein-Schritt), Schlüssel nach Code, Schlüssel einschicken, Gleichschließende Zylinder (Messschritt, Not- und Gefahrenfunktion), Schließanlagen (HS und GHS), Gehäuse. Ohne zugeordneten, veröffentlichten Eintrag erscheint nichts. In den Formularen steht der Hinweis beim Hilfeblock aus FA-QA-02 und verlässt das Formular nicht (aufklappbar oder in neuem Fenster als gewöhnlicher Verweis, damit die Rückfrage vor dem Verlassen greift); lies `berichte/FA-QA-02.md`.
4. Strukturdaten (Punkt 7): `VideoObject` nur, wenn ein Video wirklich hinterlegt ist und Titel, Beschreibung, Datum und ein eigenes Vorschaubild vorliegen; im einen Graphen der Seite (`src/components/seo`); `HowTo` nicht (R8).
5. Datenschutz (Punkt 8): Den Wortlaut der Datenschutzerklärung änderst du nicht. Schreibe den nötigen Absatz zu YouTube als Entwurf in den Bericht (für den Anwalt) und ergänze die Verarbeitungsübersicht (`src/lib/rechtliches/verarbeitungen.ts`), falls sie Dienste automatisch listet; prüfe, wie der Bestand mit GA4 verfährt, und halte dasselbe Muster ein.
6. Rubrik, Hub und Navigation bindet der Orchestrator ein; nenne die gewünschten Einträge im Bericht.

## Stand der Regeln (vom Orchestrator, 16.11.2026, A-068 und A-069)
- Schrift: Die kleinste Textstufe ist 14 px (`text-caption`); jede Beschriftung in einer Zeichnung ist auf dem Bildschirm mindestens 14 px groß. `src/app/(site)/schriftstufen.test.ts` und die Tests der Zeichnungen prüfen das; `src/components/visual/generators/**` fasst du nicht an.
- Überlauf: Freier Text in schmalen Zellen muss umbrechen können (kein `whitespace-nowrap` auf Text, dessen Länge der Betrieb bestimmt; lange Wörter mit `[overflow-wrap:anywhere]` oder genug Platz). Die Abnahme sucht auf allen Seiten bei sieben Fensterbreiten nach überlaufendem Text.
- Statische Seiten und Daten: Liest eine statisch erzeugte Seite Daten einer Sammlung oder eines Globals, braucht diese Sammlung die Erneuerungs-Hooks (`src/payload/hooks/revalidate.ts`), und ein Test hält das fest. Fehlt der Hook an einer Sammlung außerhalb deiner Schreibrechte, melde das als OFFENE FRAGE.
- Erzeugte Folgedateien: `src/payload-types.ts` und, bei neuen Admin-Bausteinen, `src/app/(payload)/admin/importMap.js` darfst du neu erzeugen; nenne die Änderung im Bericht.
- Migration: nur additiv; im `down` zuerst Fremdschlüssel, Indizes und Spalten mit `IF EXISTS`, dann Tabellen. Die Abnahme spielt `down` und `up` an einer Wegwerf-Datenbank zurück und vor.
- Texte im Admin (Feldbeschreibungen, Meldungen): ohne die Wörter, die das Prüfwerkzeug `werkzeuge/reste.mjs` als Entwurfsrest meldet (zum Beispiel „Platzhalter“, „Demo“, „Muster“), außer sie sind selbst das Thema; dann nenne die Stelle im Bericht.

## Schreibrechte
src/components/tutorial/**, src/lib/tutorials/**, src/app/(site)/tutorials/** (nur Einbindung der Einbettung), die Stelle der Content-Security-Policy (`next.config.ts`, nur `frame-src`), die Einwilligungsverwaltung (nur neue Kategorie), src/lib/rechtliches/verarbeitungen.ts (nur der neue Dienst), src/components/seo (nur `VideoObject`), je eine Einbindung des Bausteins auf den genannten Seiten und Formularen (nur die Zeile der Einbindung, mit dem Edit-Werkzeug), zugehörige Tests, _werkstatt/ausbau/berichte/FA-INHALT-01B.md.
Nicht anfassen: Datenschema und Migrationen, content/rubriken.json, Navigation, Startseite, Rechtstexte, die Medienablage in ihren erlaubten Dateitypen.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`
- Tests, die nicht fehlen dürfen: vor der Zustimmung enthält das HTML keine Adresse von YouTube oder Google; nach der Zustimmung nur `youtube-nocookie.com`; nicht veröffentlichte Tutorials erzeugen keinen Hinweis; die Richtlinie erlaubt nur den einen Rahmen; die bisherigen Einwilligungskategorien verhalten sich unverändert.
- Kein Server, kein git, keine Netzabrufe.

## Grenzen
G4, G5, G7 (keine neue Laufzeitbibliothek), G8, G9 (bestehende Einwilligungen unverändert), R4, R8, R10, R11. Texte kurz, für ältere Kunden verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Einträge) · PRÜFUNG UND ERGEBNIS · ENTWURF ZUR ANWALTLICHEN PRÜFUNG (Absatz zu YouTube, wörtlich) · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-01B · BEREIT ZUR RÜCKGABE ===
