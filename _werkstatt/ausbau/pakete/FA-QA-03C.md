# FA-QA-03C · Livegang-Prüfung: Test- und Altkontakte in den Inhalten der Datenbank

Kopf: Etappe FA Priorität 7 · Rolle Baumeister · Modell Opus · Stufe 2 · Kostenklasse S · ohne Datenschema · Anforderung FA-27-17 · Befunde: `berichte/FA-BESTAND.md` (Zeile „FA-27-17 (nachgetragen)“), `berichte/FA-QA-03A.md` und `-03B.md` (Prüfwerkzeug `werkzeuge/reste.mjs`).

## Aufgabe in einem Satz
Die Livegang-Prüfung (`npm run pruefen:livegang`) findet auch Testkontakte, alte und fremde Kontaktdaten in den Inhalten, die in der Datenbank stehen, mit denselben Mustern wie das Prüfwerkzeug `reste.mjs`.

## Vorgabe des Inhabers (wörtlich, Abschnitt 27)
„Keine Demo Daten, keine Platzhalter, keine falschen Kontaktdaten.“

## Warum
`reste.mjs` prüft, was im Repository und im Build steht. Was das Team im Admin pflegt (Seitentexte, Rubriken, Leistungsseiten, Ratgeber, Einstellungen), liegt in der Datenbank der Produktion und wird davon nicht erfasst. Die Livegang-Prüfung läuft gegen genau diese Datenbank.

## So bauen
1. Lies `src/lib/livegang-pruefung.ts` (Typ `Fund`, vorhandene Prüfungen wie `mailadresseFunde`, `platzhalterImText`, `beispielFunde`) und `src/scripts/livegang-pruefen.ts` (Aufruf und Ausgabe). Lies in `_werkstatt/ausbau/werkzeuge/reste.mjs` die Muster der Prüfungen `kontakt`, `alt`, `platzhalter` und `demo` (`pruefeText` und was es nutzt) und die Ausnahmen mit Grund.
2. Neue reine Funktion `kontaktFunde(texte, einstellungen)` in `src/lib/livegang-pruefung.ts`: nimmt eine Liste `{ quelle, feld, text }` und die gültigen Kontaktdaten aus den Einstellungen und meldet je Treffer einen `Fund` mit Quelle, Feld und kurzem Auszug. Muster wie im Werkzeug: Beispieldomains (example.org und ähnliche), Musternamen (Mustermann, Max Muster), die früheren Anschriften und Nummern, die das Werkzeug als „alt“ führt, Mailadressen außerhalb der eigenen Domain (`liegtAufEigenerDomain` gibt es schon), Telefonnummern, die nicht in den Einstellungen stehen (Vergleich über die Ziffern, wie `telefonZiffern` im Werkzeug), Platzhalter in eckigen Klammern. Die Muster stehen an einer Stelle im Produktcode; ein Test hält sie mit `reste.mjs` gleich (das Werkzeug liegt unter `_werkstatt` und darf vom Produktcode nicht importiert werden: Der Test liest die Musterlisten des Werkzeugs und vergleicht).
3. Sammeln der Texte: eine Funktion, die über Payload die gepflegten Texte der Sammlungen und Globals liest, die Kundentext tragen (mindestens Seiten, Rubriken, Leistungsseiten, Ratgeber, Einsatzgebiete, Hersteller, Kategorien, Produkte und Artikel mit ihren Beschreibungen, Einstellungen). Geh die Felder nicht von Hand durch, sondern laufe über die Dokumente und nimm alle Zeichenketten und Rich-Text-Inhalte; schließe technische Felder aus (Kennungen, Adressen von Dateien, Zeitstempel, Rollen, Mailadressen von Benutzerkonten). Vorgänge, Kunden, Partnerbewerbungen und Uploads liest du nicht (personenbezogene Daten gehören nicht in diese Prüfung).
4. Erlaubte Fremdangaben: Was die Rechtstexte und Quellen bewusst nennen (etwa Streitschlichtung, Hersteller, Versanddienst), darf kein Fund sein. Übernimm dafür die Ausnahmen des Werkzeugs mit Grund und führe sie als kleine Liste mit Begründung; jede Ausnahme hat einen Test.
5. Aufruf in `src/scripts/livegang-pruefen.ts`: eigener Abschnitt „Kontaktdaten in den Inhalten“; ein Fund ist ein Fehler (Exit wie bei den anderen harten Funden), die Ausgabe nennt Sammlung, Eintrag, Feld und Auszug, damit das Team die Stelle im Admin findet.
6. Tests: jedes Muster mit erfundenem Text (Treffer und knapp kein Treffer); eigene Nummer und eigene Domain sind kein Fund; Ausnahmen; technische Felder werden übergangen; Gleichstand der Muster mit `reste.mjs`; ein Datenbanktest, der einen Testkontakt in einen Seitentext schreibt und den Fund erwartet (erfundene Daten, G4).
7. Betreiberanleitung: kurzer Absatz in `docs/betrieb/admin-alltag.md`, was die Prüfung meldet und wie man die Stelle findet.

## Schreibrechte
`src/lib/livegang-pruefung.ts`, `src/scripts/livegang-pruefen.ts`, zugehörige Tests (auch ein neuer Datenbanktest), `docs/betrieb/admin-alltag.md` (ein Absatz), `_werkstatt/ausbau/berichte/FA-QA-03C.md`.
Nicht anfassen: `_werkstatt/ausbau/werkzeuge/reste.mjs` (nur lesen), Sammlungen und Schema, Seiten, Einstellungen.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --pg -- npx vitest run --config vitest.db.config.ts`, `… --json -- npm run build`. Die Livegang-Prüfung selbst nur gegen die lokale Testdatenbank der Datenweiche (`--pg`), nie gegen eine entfernte (G3, G4). Kein git.

## Grenzen
G3, G4, G8 (keine vorhandene Prüfung lockern), R4. Nutzt die Datenbanktests: nicht gleichzeitig mit einem Paket mit Schemaänderung.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-03C · BEREIT ZUR RÜCKGABE ===
