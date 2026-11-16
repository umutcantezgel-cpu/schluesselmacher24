# FA-SHOP-02C · Gehäuse, Reparatur und Customizing, Teil C: gewünschte Leistung in der Gehäuse-Anfrage

Kopf: Etappe FA Priorität 3 · Rolle Baumeister · Modell Opus · Stufe 3 (Schlüsselweg mit Berechtigungsnachweis, R13) · Kostenklasse S · ohne neues Datenschema (braucht ein Punkt doch ein Feld in der Datenbank: nicht bauen, als OFFENE FRAGE melden) · Anforderungen FA-14-04, FA-14-05, FA-22-29, FA-22-30 · Voraussetzung: FA-SHOP-02 (Teil A) und FA-SHOP-02B (Teil B) sind abgenommen; lies zuerst `berichte/FA-SHOP-02B.md`, Abschnitte „OFFENE FRAGEN“ (Frage 8) und „Abnahme“.

## Aufgabe in einem Satz
Die Gehäuse-Anfrage fragt, welche Leistung der Kunde wünscht (Gehäusetausch, Reparatur oder Umbau), übernimmt die Wahl aus dem Verweis, über den er kommt, und gibt sie bis in den Vorgang, die Zusammenfassung und das Vorgangsblatt mit.

## Warum
Abschnitt 14 des Inhabers nennt Shopprodukte und Dienstleistungen: Ersatzgehäuse, Reparatur, Einsendeservice und eine eigene Rubrik für Customizing. Teil B hat die drei Leistungen auf `/autoschluessel/gehaeuse` und die Rubrikseite `/autoschluessel/customizing` gebaut. Alle Wege führen in dieselbe Gehäuse-Anfrage (`/autoschluessel/gehaeuse/anfrage`), aber die Leistung geht nicht mit: Der Betrieb sieht nur die freie Beschreibung, und die Seiten behelfen sich mit dem Satz „Schreiben Sie in der Anfrage, dass Sie einen Umbau wünschen.“ Das soll eine Angabe werden.

## So bauen
1. Eine Werteliste an einer Stelle: `gehaeusetausch`, `reparatur`, `umbau`, dazu `unklar` („Weiß ich noch nicht, bitte beraten“). Die drei Benennungen kommen aus `GEHAEUSE_LEISTUNGEN` in `src/app/(site)/autoschluessel/gehaeuse/leistungen.ts` (Benennung der Vorgabe, nicht neu erfinden); prüfe, ob die Kennungen dort schon passen, und nutze sie.
2. Formular (`anfrage/anfrage-formular.tsx`, `anfrage/kern.ts`): Die Frage „Was sollen wir für Sie tun?“ steht im ersten Schritt oder im Schritt „Tasten“, wo sie ohne neuen Schritt Platz hat (die Zahl der Schritte bleibt fünf, die Texte „Fünf Schritte“ bleiben wahr). Sie ist Pflicht mit der Antwort „Weiß ich noch nicht“ als ehrlichem Ausweg, bedienbar mit Tastatur, Fehlermeldung wie die anderen Felder (lies `berichte/FA-QA-02.md`: Hilfeblock, Fehlermeldungen, Fortschritt und Warnung beim Verlassen nicht verändern). Je Antwort ein kurzer Satz für Laien. Kein Preis, keine Frist, kein Zahlungslink (A-036, G9).
3. Vorbelegung aus der Adresse: `?leistung=gehaeusetausch|reparatur|umbau`. Ein unbekannter Wert wird übergangen. Lies vor der Umsetzung die Anleitung in `node_modules/next/dist/docs` zu `searchParams` und `useSearchParams`; die Seite soll statisch bleiben, wenn das mit vertretbarem Aufwand geht (Lesen im Formular mit Suspense-Grenze), sonst begründe im Bericht. `canonical` bleibt die Adresse ohne Parameter.
4. Mitnahme: `payloadAus` gibt `leistung` mit, `gehaeuseZusammenfassung` zeigt die Zeile „Gewünschte Leistung“ vor „Ihr Anliegen“. Prüfe am Code, wie Nutzlast und Zusammenfassung in den Vorgang, die Bestätigungsseite, die Mail und das Vorgangsblatt (PDF) gelangen, und belege im Bericht mit Datei und Zeile, dass die Angabe dort ankommt. Prüfe auch, ob der Server die Nutzlast der Quelle `gehaeuse` prüft oder beschneidet (`src/lib/actions/records.ts` und was es aufruft): Der Server nimmt nur die vier Werte an, ein anderer Wert wird zu `unklar`, nie ungeprüft gespeichert. Die Pflichtregel für Unterlagen (`src/lib/server/unterlagen-pflicht.ts`, R13) bleibt unverändert und gilt für jede Leistung gleich.
5. Verweise mit Vorbelegung: auf `/autoschluessel/customizing` führen „Umbau anfragen“ und der Ablauf-Knopf nach `?leistung=umbau`; auf `/autoschluessel/gehaeuse` bekommt jede der drei Leistungen einen eigenen Verweis in die Anfrage mit ihrer Kennung. Der allgemeine Knopf „Anfrage stellen“ bleibt ohne Parameter. Danach entfällt der Behelfssatz `ANFRAGE_LEISTUNG_NENNEN` (`customizing/texte.ts`) und sein Gegenstück auf der Gehäuse-Seite; Tests dazu anpassen, nicht löschen (G8).
6. Stand vom Orchestrator: Die Customizing-Seite zeigt ihren Ablauf seit der Abnahme von Teil B aus den Rubrikdaten (Rubrik `customizing` in `content/rubriken.json` und `src/lib/data/defaults/rubriken.ts`, `RubrikAblaufAbschnitt`); die Liste `PRUEFUNG` in `texte.ts` gibt es nicht mehr. Rubrikdaten nicht ändern.
7. Tests: Werteliste und Vorbelegung (gültig, ungültig, fehlt), Pflicht im Schritt, Nutzlast und Zusammenfassung, Serverprüfung des Werts (ein erfundener Wert wird nicht gespeichert), Verweise der beiden Seiten mit der richtigen Kennung. Erfundene Testdaten (G4).
8. Betreiberanleitung `docs/betrieb/gehaeuse-pflegen.md`: ein Absatz, wo der Betrieb die gewünschte Leistung im Vorgang sieht.

## Schreibrechte
`src/app/(site)/autoschluessel/gehaeuse/**`, `src/app/(site)/autoschluessel/customizing/**`, zugehörige Tests, `docs/betrieb/gehaeuse-pflegen.md`, `_werkstatt/ausbau/berichte/FA-SHOP-02C.md`. Gemeinsame Dateien (`src/lib/actions/records.ts`, Vorgangsblatt, Mailtexte) nur an einzelnen Stellen mit dem Edit-Werkzeug und nur, damit die Angabe geprüft mitgeht; jede solche Stelle im Bericht nennen.
Nicht anfassen: Preise, Datenschema und Migrationen, `content/rubriken.json`, Navigation, Startseite, Einsendeformular, Warenkorb, Kasse, `src/lib/server/unterlagen-pflicht.ts`.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git, keine Formularsendung (G5).

## Grenzen
G5, G6, G8, G9, R4, R9, R13. Texte kurz, für ältere Kunden verständlich, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-02C · BEREIT ZUR RÜCKGABE ===
