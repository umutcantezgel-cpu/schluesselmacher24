# E6-BAUMEISTER-07 · Schlüssel nach Code: „Nach Code bestellen“ am Code-Treffer, Code im Bestellformular übernommen

## 1. Kopfzeile
Kennung E6-BAUMEISTER-07 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderungen E-89 (Kern), L-120, E-13 (Bestand belegen) · Kriterium Z-05 · Schreibrechte: `src/app/(site)/schluessel-nach-code/` (nur dieser Ordner)

## 2. Rollenbriefing
Baumeister: ergänzt nach vorhandenem Muster, erfindet nichts dazu. Fehler: Preise oder Prüfregeln ändern (G9), die Codeprüfung umgehen, eigene Suchlogik statt der vorhandenen, Texte mit Gedankenstrichen.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Wenn die Suche in der Shop-Liste einen eingegebenen Code einer Codelinie zuordnet, zeigt der Treffer einen Knopf „Nach Code bestellen“, der zur Produktseite führt und den Code dort ins Bestellformular übernimmt.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Unter `/schluessel-nach-code` steht die Shop-Liste `shop-liste.tsx` mit Freitextsuche, Filtern nach Hersteller, Schlüsseltyp und Anwendungsfamilie und einer Codeerkennung (`linienZumCode(lines, query)`, Zeilen um 153 bis 155). Jede Codelinie hat eine Produktseite `[slug]/page.tsx` mit dem Bestellformular `[slug]/bestell-formular.tsx`, das den Code nach dem Format der Linie prüft. Heute führt ein Code-Treffer nur über die Zeile zur Produktseite, und dort muss man den Code noch einmal eingeben. Suche und Filter gibt es schon (L-120, E-13); hier kommt nur die Abkürzung für Codes dazu (E-89).

## 5. Kern-Auszug (unveränderlich)
- E-89: „Code-Suche erkennt Codes, Knopf ‚Nach Code bestellen‘.“
- G9: Preise, Prüfregeln und Pflichtfotos der Codelinien bleiben, wie sie sind. Der übernommene Code ist nur ein Vorschlag im Feld; die bestehende Prüfung im Formular und auf dem Server gilt unverändert.
- Ton (K-010): keine Gedankenstriche (– und —), keine Ausrufezeichen.

## 6. Maßstab
- `shop-liste.tsx`: Ist die Suche als Code erkannt (dieselbe Bedingung, unter der heute `linienZumCode` Treffer liefert), trägt jede so gefundene Zeile einen Knopf `ButtonLink` „Nach Code bestellen“ (Größe `sm`) auf `/schluessel-nach-code/<slug>?code=<eingabe>` (Eingabe mit `encodeURIComponent`, getrimmt, höchstens 40 Zeichen). Ohne Codeerkennung ändert sich nichts.
- `[slug]/bestell-formular.tsx` (Client): Beim ersten Rendern den Parameter `code` lesen und, wenn er dem Format der Linie entspricht (vorhandene Prüffunktion der Datei nutzen), ins Codefeld der ersten Position übernehmen; sonst ignorieren. Lies vorher in `node_modules/next/dist/docs` zu `useSearchParams` nach, ob dafür eine `Suspense`-Grenze nötig ist; wenn ja, setze sie in `[slug]/page.tsx` um das Formular, ohne den Aufbau der Seite sonst zu ändern. Alternativ darf die Seite `searchParams` als Prop lesen und den Code als Prop an das Formular geben, wenn die Seite ohnehin dynamisch gerendert wird; entscheide nach der Doku und begründe es in der Schlussantwort.
- Tests: neue Datei `code-uebernahme.test.ts` im Ordner, die die reine Hilfsfunktion prüft, mit der du den Parameter liest und prüfst (lege sie als reine Funktion in einer eigenen Datei `code-uebernahme.ts` an): gültiger Code übernommen, ungültiger verworfen, zu langer verworfen, Leerzeichen getrimmt.

## 7. Grenzen
G4, G5, G8, G9, R4. Nur die Schreibrechte aus Abschnitt 1. Kein Build, kein Commit.

## 8. Schritte
1. Lies `shop-liste.tsx`, `[slug]/page.tsx`, `[slug]/bestell-formular.tsx` und die Next-Doku zu `useSearchParams` und `searchParams`.
2. Ändere nach Abschnitt 6.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/schluessel-nach-code"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/schluessel-nach-code"`.
4. Schlussantwort mit der Entscheidung zu `useSearchParams` oder `searchParams`.

## 9. Selbstprüfung
Ohne Code-Suche sieht die Liste aus wie vorher; der Knopf erscheint nur bei erkannten Codes; der Code im Formular ist nur vorbelegt und läuft durch die bestehende Prüfung; Tests, Typprüfung und Lint grün.

## 10. Ausgabe
Geänderte und neue Dateien und die Schlussantwort (höchstens 12 Zeilen).

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-07 · BEREIT ZUR RÜCKGABE ===
