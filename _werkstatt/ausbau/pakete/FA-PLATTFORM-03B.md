# FA-PLATTFORM-03B · Ortsdatenbasis, Teil B: Ortsseiten am Stamm, Prioritätsorte im Admin, Veröffentlichung nur mit Substanz

Kopf: Etappe FA Priorität 4 · Rolle Baumeister · Modell Opus · Stufe 3 (Datenmodell, Indexierung eines Seitentyps) · Kostenklasse L · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-09-01 bis FA-09-08, FA-AA-01 bis FA-AA-09, FA-AB-05, FA-22-35, FA-22-40, FA-25-17 · Befunde: `berichte/FA-ABGLEICH.md` Block 04, `berichte/FA-KUNDSCHAFTER-04.md`, `berichte/FA-BLINDPRUEFUNG-04.md` · Entscheidung A-051 · Voraussetzung: FA-PLATTFORM-03 (Teil A, Ortsstamm) ist abgenommen; lies zuerst `berichte/FA-PLATTFORM-03.md`, Abschnitt „Stand für Teil B“, und die Paketdatei `pakete/FA-PLATTFORM-03.md` (Vorgabe des Inhabers im Wortlaut, Lage, Punkte 1 und 4 bis 9). Die Abdeckung durch Partner liest du über die Funktion aus FA-PLATTFORM-01B, falls sie steht (`berichte/FA-PLATTFORM-01B.md`); sonst über die bestehende Regel in `src/lib/auftragsweg.ts`.

## Aufgabe in einem Satz
Hänge die Ortsseiten an den amtlichen Stamm, zeige dem Betreiber die Prioritätsorte des Inhabers und veröffentliche eine Ortsseite nur, wenn sie eigenen Inhalt und einen plausiblen Leistungsweg hat.

## Vorgabe des Inhabers (wörtlich, Abschnitt 09)
„Keine 1:1 kopierten SEO Seiten mit nur geändertem Ortsnamen. Jede veröffentlichte Seite braucht echten Mehrwert, Leistung, Partnerbezug oder konkrete Verfügbarkeit. Ortsseite soll automatisch mit Partnerregion, Kontaktweg und verfügbaren Leistungen verknüpft werden können.“ Technischer Auftrag: „Ortsseiten erst veröffentlichen, wenn sie echten Inhalt und einen plausiblen Leistungsweg haben. Stadt, Landkreis, Postleitzahl und Partnerregion sauber miteinander verknüpfen.“

## So bauen
1. Ortsseiten (Bestand `Einsatzgebiete`) bekommen einen Verweis auf den Ort im Stamm (Gemeindeschlüssel), daraus Landkreis, Postleitzahlen, Koordinaten; dazu Priorität (Zahl), Stufe (aus Anhang A: ja oder nein), Suchvolumen (leer, vom Betreiber pflegbar), Fahrzeit zur Werkstatt (leer, pflegbar), Partnerregion (Verweis auf Partnerbetriebe, darf leer sein), konkrete Verfügbarkeit (eigener Text). Die Seite Wetzlar verweist auf ihren Gemeindeschlüssel (`content/cities.json`, nur dieser Verweis).
2. Admin-Ansicht „Prioritätsorte“ aus `content/orte/prioritaet.json`: Ort, Land, Seite vorhanden, veröffentlicht, Partner vorhanden. Daraus entsteht keine einzige Seite automatisch.
3. Veröffentlichung nur mit Substanz (FA-09, R2, R3): Eine Ortsseite ist nur indexierbar und in der Sitemap, wenn (a) ihr Einleitungstext eigener Text ist (kein Platzhalter, Mindestlänge, nicht wortgleich mit einer anderen Ortsseite: Prüfung auf Textgleichheit über alle Ortsseiten) und (b) ein plausibler Leistungsweg besteht: Die Werkstatt liegt im Ort oder im Landkreis, oder ein freigeschalteter, nicht pausierter und nicht gesperrter Partner deckt den Ort ab, oder der Betreiber hat eine konkrete Verfügbarkeit eingetragen. Sonst bleibt die Seite `noindex` und außerhalb der Sitemap, auch wenn sie im Admin veröffentlicht ist; der Admin zeigt den Grund. Erweitere `stadtIndexierbar` mit Tests. Es werden in diesem Paket keine neuen Ortsseiten geschrieben; Wetzlar muss indexierbar bleiben (Test).
4. Verknüpfung auf der Ortsseite: Landkreis und Postleitzahlen aus dem Stamm; verfügbare Leistungen wie im Bestand; Partnerbezug als Aussage ohne Namen („In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner“), nur wenn ein Partner abdeckt; Kontaktweg je Lage (Termin in der Werkstatt, Anfrage, Partnerweg; der Partnerweg nur, wenn `PARTNERMODELL_B` aktiv ist). Strukturdaten nur für Sichtbares (R8). Die Erreichbarkeit steht nur im Wortlaut des Inhabers (R9).
5. Quellenvermerk sichtbar auf `/standorte` und im Fuß der Ortsseiten: Statistisches Bundesamt (Destatis), Gemeindeverzeichnis, Gebietsstand 31.12.2025; Postleitzahlen: GeoNames, CC BY 4.0.
6. Der Build erzeugt Seiten nur für veröffentlichte Ortsseiten, nie für alle Gemeinden: Miss Seitenzahl und Build-Zeit vorher und nachher.
7. Betreiberanleitung `docs/betrieb/orte-pflegen.md`: neue Ortsseite aus dem Stamm anlegen, wann sie veröffentlicht wird, Partnerregion zuordnen, Stamm aktualisieren.

## Stand nach Teil A (vom Orchestrator, 16.11.2026)
- Teil A (Ortsstamm) ist umgesetzt, gegengeprüft, zweimal nachgebessert und vom Orchestrator abgenommen (A-068). Lies zuerst `berichte/FA-PLATTFORM-03.md`, Abschnitte „Stand für Teil B“, „Nachbesserung“, „Nachbesserung 2“ und „Abnahme durch den Orchestrator“. Nutzbar sind unter anderem `ortsstamm()`, `postleitzahlAbfragen` und `entfernungKm` (`src/lib/orte/stamm.ts`, nur auf dem Server), die reinen Funktionen in `index-stamm.ts`, `entfernung.ts` und `abfrage.ts`, die Sammlung `orte` und die Dateien unter `content/orte/`. Wetzlar hat den Gemeindeschlüssel 06532023.
- `ORTSSTAMM_QUELLEN` (`src/lib/orte/typen.ts`) liefert je Quelle `{ text, url, lizenzUrl? }`. Der Quellenvermerk aus Punkt 5 nutzt genau diese Angaben, mit Verweis auf die Quelle und bei GeoNames auf die Lizenz.
- `content/orte/prioritaet.json` enthält einen Eintrag mit `zuordnung: "offen"` ohne Schlüssel (Amberg in Bayern, zwei Gemeinden dieses Namens; der Inhaber bestätigt). Die Ansicht „Prioritätsorte“ zeigt ihn als „offen, bitte bestätigen“ mit den Kandidaten; geraten wird nichts.
- Die Datenbanktests laufen mit einer Stichprobe des Stamms (`SM24_ORTSSTAMM=stichprobe`, gesetzt in `src/test/db-global-setup.ts`); sie enthält alle Prioritätsorte und den Lahn-Dill-Kreis.
- Der Umkreis der Partner (`einsatzgebiet.radiusKm`) wird in diesem Paket nicht ausgewertet; „Partner deckt den Ort ab“ heißt hier: `deckendePartner` aus `src/lib/partner/region.ts` über die Postleitzahlen der Gemeinde. `src/lib/partner/**` und `src/lib/auftragsweg.ts` änderst du nicht.
- Deine Migration heißt `ortsseiten_stamm`; lies das erzeugte `up` und nimm heraus, was nicht zu diesem Paket gehört (nur additiv, G6). Für `down` gilt die Reihenfolge aus Teil A: zuerst Fremdschlüssel und Spalten mit `IF EXISTS`, dann Tabellen.
- `content/orte/postleitzahlen.json` führt seit der Nachbesserung 2 nur noch 8.282 Zustell-Postleitzahlen; Großempfänger- und Postfach-Postleitzahlen von Firmen und Behörden fehlen bewusst. `postleitzahlAbfragen` meldet sie mit `bekannt: false`. Jede Stelle dieses Pakets, die eine Postleitzahl annimmt oder zeigt, geht damit ruhig um (kein Fehler, kein leerer Abschnitt; eine Gemeinde ohne Postleitzahl wie Wesertal oder Oberzent zeigt den Abschnitt „Postleitzahlen“ nicht). Die Stammdateien änderst du nicht.
- Schrift (A-068): Die kleinste Textstufe ist 14 px (`text-caption`), und jede Beschriftung in einer Zeichnung ist auf dem Bildschirm mindestens 14 px groß. Neue Bausteine halten das ein; `src/app/(site)/schriftstufen.test.ts` und die Tests der Zeichnungen prüfen es. `src/components/visual/**`, `src/lib/navigation.ts`, `src/app/(site)/globals.css` und `src/components/layout/**` fasst du nicht an.
- Gleichzeitig kann FA-SEO-03 laufen (Messwerkzeug unter `_werkstatt/ausbau/werkzeuge/` und erste Ansicht der Startseite: `src/app/(site)/page.tsx`, Bausteine der Startseite). Diese Dateien fasst du nicht an.

## Zusatz aus der Bestandsaufnahme (vom Orchestrator, 16.11.2026)
- FA-09-04: Die öffentliche Übersicht `/standorte` und die Vor-Ort-Seite ordnen Ortsseiten nach der Priorität des Inhabers (aufsteigend, dann Name). Test dazu.
- FA-AA-05: Die Admin-Ansicht der Prioritätsorte zeigt je Ort die Zahl der Vorgänge der letzten zwölf Monate (Zählung über die Postleitzahl des Vorgangs und die Postleitzahl-Abfrage aus dem Ortsstamm). Nur Anzeige, keine automatische Priorität. Schreibrechte dafür: die Admin-Ansicht und eine reine Zählfunktion mit Test.

## Schreibrechte
- src/payload/collections/Einsatzgebiete.ts, neue Migration (`sicher.sh --pg -- npx payload migrate:create ortsseiten_stamm`), src/migrations/index.ts, src/payload-types.ts, src/payload/seed.ts (nur Einsatzgebiete), src/lib/data/** (Adapter und Mapping für Einsatzgebiete), src/lib/types.ts (CityPage), src/lib/orte/** (nur ergänzen), src/lib/rechtliches/indexierung.ts, src/app/(site)/standorte/**, src/app/sitemap.ts (nur Ortsseiten), src/components/seo/json-ld.tsx (nur serviceAreaSchema), content/cities.json (nur der Verweis auf den Gemeindeschlüssel für Wetzlar), Admin-Ansicht unter src/payload/components (neu), docs/betrieb/orte-pflegen.md
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-PLATTFORM-03B.md
Nicht anfassen: der Stamm und sein Import (Teil A) außer Lesefunktionen, content/karte, Navigation, Startseite, Partnerlogik außer dem Lesen der Abdeckung, Rechtstexte.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build` (Seitenzahl und Dauer nennen)
- Tests, die nicht fehlen dürfen: Ortsseite mit Platzhaltertext bleibt noindex; zwei wortgleiche Ortsseiten bleiben beide noindex; Ortsseite ohne Leistungsweg bleibt noindex und nennt den Grund; Wetzlar bleibt indexierbar und in der Sitemap; Partnerbezug erscheint nur mit abdeckendem Partner.
- Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (G12). Keine Netzabrufe, kein Server, kein git.

## Grenzen
G1, G4, G6 (additiv, Seed wiederholbar, JSON-Fallback), G7, G8, G13, R2 (keine Brückenseiten), R3, R4 (keine erfundenen Ortsangaben, Fahrzeiten oder Suchvolumina), R8, R9. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen: Seiten im Build, Build-Dauer vorher und nachher) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-PLATTFORM-03B · BEREIT ZUR RÜCKGABE ===
