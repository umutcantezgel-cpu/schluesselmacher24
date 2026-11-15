# FA-SHOP-02B · Gehäuse, Reparatur und Customizing, Teil B: Listen und Seiten mit Filter nach Fahrzeug, buchbare Dienstleistungen mit Einsendung, Rubrik Customizing

Kopf: Etappe FA Priorität 3 · Rolle Baumeister und Autor · Modell Opus · Stufe 3 (Kaufweg) · Kostenklasse L · ohne neues Datenschema (braucht ein Punkt doch ein Feld: nicht bauen, als OFFENE FRAGE melden) · Anforderungen FA-14-01 bis FA-14-10, FA-10-05 bis FA-10-08, FA-20-05, FA-22-29, FA-22-30 · Befunde: `berichte/FA-ABGLEICH.md` Blöcke 07, 05, 10, `berichte/FA-KUNDSCHAFTER-07.md`, `berichte/FA-BLINDPRUEFUNG-07.md` · Voraussetzung: FA-SHOP-02 (Teil A) und FA-SHOP-03 (Einsende-Varianten) sind abgenommen; lies zuerst `berichte/FA-SHOP-02.md`, Abschnitt „Stand für Teil B“, die Paketdatei `pakete/FA-SHOP-02.md` (Vorgabe des Inhabers im Wortlaut, Punkte 1 bis 6) und `berichte/FA-SHOP-03.md`.

## Aufgabe in einem Satz
Mache aus dem Datenmodell von Teil A den sichtbaren Bereich: Gehäuse und Ersatzteile als Liste mit Filter nach Fahrzeug, Umbau und Reparatur als Auftrag mit Einsendung, und die Rubrik Customizing mit klaren Kompatibilitätshinweisen, ohne falsche Versprechen.

## So bauen
1. Listen- und Detailseiten für Gehäuse und Ersatzteile (Punkt 1 der Paketdatei): Filter nach Marke, Modell oder Reihe, Bauform, Tastenzahl; Auswahl „Mein Fahrzeug“ über die vorhandene Fahrzeugsuche; jede Detailseite zeigt den Kompatibilitätshinweis (Pflichttext) und ob Elektronik und Transponder übernommen werden (ja, nein, nur nach Prüfung). Ohne Produkte zeigt die Liste den ehrlichen Zustand und den Weg in die Gehäuse-Anfrage (Muster aus `/shop` und den Kategorieseiten). Filter funktionieren ohne JavaScript als Verweise oder Formular mit Adresse; die gefilterte Ansicht ist keine eigene indexierbare Seite (R2, R3).
2. Dienstleistungen mit Einsendung (Punkt 2): „Gehäusetausch im Einsendeservice“, „Reparatur (Tasten, Mechanik)“, „Umbau auf anderes Gehäuse (Customizing)“. Ohne Preis des Inhabers läuft der Weg als Anfrage mit Angebot und Zahlungslink (Bestand, A-036); mit Preis als Produkt mit Kasse und anschließender Einsendung. Die Einsendung nutzt die Varianten aus FA-SHOP-03 (Empfehlung DHL Paket für Schlüssel mit Elektronik) und den Begleitschein. Pflichtunterlagen: Fahrzeugschein und drei Schlüsselfotos über die Steckplätze (R13); die Regel in `src/lib/server/unterlagen-pflicht.ts` bleibt die eine Stelle.
3. Rubrik „Customizing“ unter `/autoschluessel/customizing` (Punkt 3): was möglich ist, unter welchen Bedingungen (Elektronik, Transponder, Tasten und Bart müssen übernommen werden können), wie die Prüfung läuft (Fotos, Fahrzeug, Schlüsseltyp, dann Rückmeldung, ob es geht), Auswahl nach Fahrzeug oder Schlüsseltyp, der Satz gegen falsche Erwartungen im Wortlaut des Inhabers. Keine Beispiele mit konkreten Fahrzeugen oder Gehäusen, die nicht belegt sind (R4). Der Baustein `VorherNachher` erscheint nur mit echten Umbau-Beispielen aus den Daten.
4. Kategorien (Punkt 5): „Autoschlüsselgehäuse“, „Gehäuseumbau und Reparaturservice“ und „Customizing und Modifikation“ zeigen auf diese Seiten und Listen (`content/kategorien.json`, nur die drei Ziele; der Rückfall in `src/lib/data/defaults/kategorien.ts` wortgleich). Die Sonderregel für Autoschlüssel-Kategorien in `src/app/(site)/shop/kategorie-weg.ts` entfällt, wenn die Ziele in den Daten stehen; Tests anpassen, nicht löschen (G8).
5. Titel und Beschreibungen der neuen Seiten in den Längen (`src/lib/data/seo-laengen.test.ts` ausdehnen), Brotkrumen, Strukturdaten nur für Sichtbares (R8, Muster `src/components/seo`), jede neue Seite mit eingehendem Verweis (Prüfung `waisen.test.ts`).
6. Betreiberanleitung `docs/betrieb/gehaeuse-pflegen.md` um die Bedienung ergänzen.

## Schreibrechte
src/app/(site)/autoschluessel/gehaeuse/**, neu src/app/(site)/autoschluessel/customizing/**, src/app/(site)/artikel/** (Filter), src/lib/artikel.ts, src/app/(site)/shop/kategorie-weg.ts mit Test, content/kategorien.json und der Rückfall (nur die drei Ziele), src/app/sitemap.ts (neue Seiten), src/lib/data/seo-laengen.test.ts, docs/betrieb/gehaeuse-pflegen.md, zugehörige Tests, _werkstatt/ausbau/berichte/FA-SHOP-02B.md. Gemeinsame Dateien (Warenkorb, Kasse, Einsende-Formular) nur an einzelnen Stellen mit dem Edit-Werkzeug; jede Stelle im Bericht nennen.
Nicht anfassen: Preise, Datenschema und Migrationen, content/vehicles.json, Navigation, Startseite, Rubriken (gewünschte Einträge als Liste in den Bericht).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (G12). Kein Server, kein git.

## Grenzen
G4, G5, G6, G8, G9 (keine Preise erfinden), R2, R3, R4, R8, R9, R11, R13. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-02B · BEREIT ZUR RÜCKGABE ===
