# FA-SHOP-04 · Bericht · Sperrschließungen, Teil A: Datengrundlage

Anforderungen (Teil A): FA-15-01 (Daten), FA-15-11 (Sperre für unbestätigte Preise), FA-10-09, FA-19-02 · Stand 16.11.2026

Hinweis: Der Orchestrator hat einen Zwischenstand schon mitcommittet (1dac389, „Zwischenstand laufender Pakete, noch ungeprüft“). Die Prüfungen unten liefen auf dem gemeinsamen Arbeitsbaum, in dem gleichzeitig FA-INHALT-03H arbeitet.

## GEÄNDERTE DATEIEN

Neu:
- `src/migrations/20261116_021014_zylinder_bestaetigt.ts` und `.json` (in der Nachbesserung neu erzeugt, rein additiv) (über `sicher.sh --pg -- npx payload migrate:create zylinder_bestaetigt`), `src/migrations/index.ts` (erzeugt)
- `src/lib/konfigurator/preisbestaetigung.ts` (Sperre für unbestätigte Preise, nur Typen als Abhängigkeit)
- `docs/betrieb/zylinder-pflegen.md` (Betreiberanleitung)
- Tests: `src/lib/konfigurator/preisbestaetigung.test.ts`, `src/payload/zylinder-bestaetigt.db.test.ts`, `src/app/(site)/gleichschliessende-zylinder/page.test.tsx`, `src/payload/collections/hersteller-bereiche.test.ts`, `src/payload/globals/zylinderkatalog-hersteller.test.ts`

Geändert:
- `src/payload/collections/Hersteller.ts` (Feld „Bereiche“, Hilfetexte)
- `src/payload/globals/Zylinderkatalog.ts` (Haken „Preis nicht bestätigt“, Hersteller aus dem Stamm, Hook)
- `src/lib/data/payload-mapping.ts` (nur Hersteller und Zylinderkatalog)
- `src/lib/types.ts` (nur additive, optionale Felder; siehe OFFENE FRAGE 1)
- `content/hersteller.json`, `src/lib/data/defaults/hersteller.ts` (Bereiche als Startwerte, Texte unverändert aus `bereiche.ts`)
- `src/components/hersteller/bereiche.ts` (liest aus den Daten)
- `src/payload/seed.ts` (Abgleich der Bereiche, Option `leerErgaenzen`)
- `src/lib/cylinder-rules.ts` (eine Zeile: Sperre am Ende von `validateCylinderDraft`; siehe OFFENE FRAGE 1)
- `src/lib/konfigurator/index.ts` (Export)
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx` (Sperre in der Oberfläche)
- `src/app/(site)/gleichschliessende-zylinder/page.tsx` (Rubrikseite: „Preis auf Anfrage“ bei gesetztem Haken)
- `docs/betrieb/zylinder-pflegen.md`
- `src/payload-types.ts` (erzeugt)
- Tests: `src/components/hersteller/hersteller-bereich.test.tsx`, `src/lib/data/payload-mapping.test.ts`, `src/lib/actions/security.test.ts`

Nicht angefasst: Preise und Maßbereiche in `content/` und in den Rückfällen, `content/cylinder-catalog.json`, `src/lib/data/defaults/cylinders.ts`, `src/lib/pricing.ts`, `src/lib/actions/orders.ts`, Navigation, Startseite, sichtbare Texte der Rubrikseite (außer der Anzeige bei gesetztem Haken), Hilfeblock und „Maß unbekannt“ aus FA-QA-02.

## WAS UND WARUM

1. **Hersteller: Bereiche als Daten** (Stand des Bestands, Punkt 1). Neues Array `bereiche` an der Sammlung `hersteller` mit `art` (Auswahl „Sperrschließungen“ `sperrschliessung`, „Elektronischer Zutritt“ `zutritt`) und `einsatz` (Pflicht, höchstens 300 Zeichen). Doppelte Bereiche lehnt die Prüfung ab. `bereiche.ts` liest Bereiche und Texte über `bereicheDesHerstellers(h)` aus den Daten; die feste Tabelle `HERSTELLER_BEREICHE` ist entfallen. Startwerte in `content/hersteller.json` und `defaults/hersteller.ts` sind wörtlich die bisherigen Texte. Die Anzeige auf Startseite und Rubrikseiten bleibt damit gleich (Tests unverändert grün). Hilfetexte in `Hersteller.ts` stimmen wieder: „angeboten“ zeigt den Hersteller auf der Startseite und auf den Seiten der zugeordneten Bereiche; das Feld „Wofür die Systeme eingesetzt werden“ erscheint auf der Herstellerseite bei Schlüssel nach Code immer und auf der Startseite bei Herstellern ohne Bereich (in der Nachbesserung berichtigt, Befund 7).
2. **Seed** (G6, wiederholbar). Der Abgleich der Hersteller umfasst jetzt `bereiche` (Spalten `art`, `einsatz`) mit der neuen Option `leerErgaenzen`: Ein schon angelegter Hersteller ohne Bereiche und ohne eigenen Stand für dieses Feld bekommt einmal die Startwerte. Danach gilt der normale Abgleich: Eine Änderung des Betriebs bleibt, ein bewusst geleertes Feld bleibt leer (DB-Test). JSON-Rückfall liest `content/hersteller.json` wie bisher.
3. **Zylinderkatalog: Hersteller aus dem Stamm** (Punkt 2). Im Reiter „Hersteller“ neues Feld `stamm` (Verweis auf `hersteller`). Ein Hook (`herstellerAusStamm`, beforeValidate) übernimmt beim Speichern Name und Kennung aus dem Stammeintrag. Die bisherigen Felder `name` und `kennung` bleiben Pflicht und in der Datenbank NOT NULL; im Admin sind sie sichtbar und nur lesbar (Nachbesserung, Befund 9). Mit Auswahl aus dem Stamm füllt der Hook sie, ohne Auswahl behalten ältere Einträge ihre Werte und bleiben lesbar. Das Mapping nimmt Name und Kennung aus dem geladenen Stamm (Umbenennung im Stamm wirkt sofort) und setzt `stammId`; ohne Stamm wie bisher. Aufpreise, Bauformen, Zusatzkomponenten unverändert.
4. **Sperre „Preis nicht bestätigt“** (So bauen, Punkt 3). Neuer Haken an jeder Bauform, Funktion, jedem Extra, jedem Hersteller (gilt für Aufpreis und Zusatzkomponenten) und am Schlüsselpreis (`schluesselPreisNichtBestaetigt`). Standard nicht gesetzt; die Migration legt die Spalten mit `DEFAULT false` an, am Bestand ändert sich nichts (DB-Test). Wirkung:
   - `validateCylinderDraft` (gemeinsam für Konfigurator und Kasse) lehnt eine Zusammenstellung ab, die einen solchen Eintrag nutzt: „Der Preis für „Halbzylinder“ ist noch nicht bestätigt.“ Damit lehnt `submitOrder` sie ab, auch aus einem älteren Warenkorb (Test über `submitOrder`). Der Schlüsselpreis sperrt nur, wenn mehr Schlüssel als inklusive gewählt sind; „Erweiterbar reservieren“ zählt über die Antwort zur Erweiterung wie in der Kasse.
   - Konfigurator: Laufende Summe, Zwischensumme der betroffenen Position und Gesamt zeigen „auf Anfrage“, die Zusammenfassung nennt Mengen ohne Beträge, der Knopf „In den Warenkorb“ bleibt gesperrt mit dem Hinweis „Ein Preis dieser Zusammenstellung ist noch nicht bestätigt. Bitte schicken Sie sie uns als Anfrage.“ Ein Hinweisfeld führt mit „Zusammenstellung als Anfrage schicken“ in den Schließplan-Planer, mit Zylindern, Maßen und Schlüsseln im Link. Dort macht `preisFuerPlan` aus derselben Prüfung ein Angebot; der Planer endet in der vollständigen Anfrage mit PDF. Passt die Zusammenstellung nicht in einen Link, führt der Weg in die allgemeine Anfrage mit Thema Tür- und Schließtechnik.
   - Der Preis selbst bleibt unverändert stehen (Test: `priceCylinderOrder` mit und ohne Haken gleich).
5. **Betreiberanleitung** `docs/betrieb/zylinder-pflegen.md`: Hersteller und Bereiche, Hersteller im Zylinderkatalog, Bauformen, Maße, Preise, Haken „Preis nicht bestätigt“, Funktionen und Optionen, Prüfen nach dem Speichern.

Migration (G6): neue Tabellen `hersteller_bereiche` und `_hersteller_v_version_bereiche`, neue Spalten `preis_nicht_bestaetigt` (Bauformen, Funktionen, Extras, Hersteller), `schluessel_preis_nicht_bestaetigt`, `stamm_id` mit Fremdschlüssel (`ON DELETE set null`). Kein DROP, kein `ALTER COLUMN … DROP NOT NULL` (Nachbesserung, Befund 9).

Laufzeitbibliothek: keine neue (G7).

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche, auf dem gemeinsamen Arbeitsbaum.
- `sicher.sh --json -- npx vitest run`: 218 Dateien, 3458 Tests, alle grün (Stand vor der Nachbesserung; danach siehe Abschnitt „Nachbesserung“).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 23 Dateien, 135 Tests, alle grün (neu `zylinder-bestaetigt.db.test.ts` mit 7 Tests; der globale Aufbau führt die neue Migration und den Seed aus).
- `sicher.sh --json -- npm run build`: grün.

Belege:
- Bereiche aus den Daten, Änderung wirkt, Reihenfolge, leere Texte, JSON = Defaults, Mapping verlustfrei: `hersteller-bereich.test.tsx`.
- Seed legt Bereiche an, ergänzt leere einmal, belässt bewusst geleerte, doppelter Bereich abgelehnt, Admin-Änderung wirkt: `zylinder-bestaetigt.db.test.ts` › „Hersteller: Bereiche als Daten“.
- Stamm: Name und Kennung aus der Liste, älterer Eintrag lesbar: ebenda › „übernimmt Name und Kennung …“; Mapping in `payload-mapping.test.ts` › „FA-SHOP-04“.
- Haken: Bestand ohne Haken, Haken kommt an, Preis bleibt: `zylinder-bestaetigt.db.test.ts`, `payload-mapping.test.ts`.
- Sperre: `preisbestaetigung.test.ts` (Bauform, Funktion, Option, Schlüssel, Hersteller, Erweiterbar, Planer wird Angebot, Preis unverändert); Kasse: `security.test.ts` › „lehnt eine Zusammenstellung mit unbestätigtem Preis ab …“ mit drei verschiedenen Maßen in einem Satz.
- Die Anzeige im Konfigurator („auf Anfrage“, gesperrter Knopf, Hinweisfeld) ist nicht als Oberflächentest abgedeckt; die Entscheidung kommt aus den getesteten Funktionen. Kein Server, kein Browser (Paketvorgabe).

## PREISLISTE ZUR BESTÄTIGUNG

Alle Werte in Euro inklusive Umsatzsteuer. Gleich in `content/cylinder-catalog.json` (JSON-Rückfall und Seed) und `src/lib/data/defaults/cylinders.ts`; im Repository seit 19.09.2026, im Startwert-Stand `content/startwerte/2026-10-25/cylinder-catalog.json` unverändert. Keiner ist als Beispiel oder Platzhalter gekennzeichnet, eine Bestätigung durch den Inhaber ist nicht belegt. Ob die Datenbank im Betrieb andere Werte führt, ist hier nicht prüfbar. Für jede Zeile: **bitte bestätigen oder ersetzen.** Bis dahin kann der Betrieb jede Zeile mit dem Haken „Preis nicht bestätigt“ aus dem Verkauf nehmen.

| Position | Heutiger Wert | Herkunft | Bitte |
|---|---|---|---|
| Doppelzylinder, Grundpreis bis 70 mm Gesamtlänge | 39,00 | `content/cylinder-catalog.json:45`, `cylinders.ts:58` | bestätigen oder ersetzen |
| Knaufzylinder, Grundpreis bis 70 mm | 49,00 | `content/cylinder-catalog.json:74`, `cylinders.ts:88` | bestätigen oder ersetzen |
| Halbzylinder, Grundpreis bis 45 mm | 29,00 | `content/cylinder-catalog.json:102`, `cylinders.ts:118` | bestätigen oder ersetzen |
| Aufpreis je angefangene 5 mm über der Grundlänge (alle drei Bauformen) | 3,50 | `content/cylinder-catalog.json:46`, `:75`, `:103` | bestätigen oder ersetzen |
| Standardfunktion | 0,00 | `content/cylinder-catalog.json:113`, `cylinders.ts:129` | bestätigen |
| Not- und Gefahrenfunktion je Zylinder (nur Doppelzylinder) | 12,00 | `content/cylinder-catalog.json:129`, `cylinders.ts:144` | bestätigen oder ersetzen |
| Sicherungskarte und geschütztes System, einmal | 29,00 | `content/cylinder-catalog.json:149`, `cylinders.ts:166` | bestätigen oder ersetzen |
| Aufbohr- und Ziehschutz je Zylinder | 19,00 | `content/cylinder-catalog.json:161`, `cylinders.ts:181` | bestätigen oder ersetzen |
| Erweiterbar reservieren, einmal | 15,00 | `content/cylinder-catalog.json:173`, `cylinders.ts:196` | bestätigen oder ersetzen |
| Beschriftete Schlüsselanhänger je Zylinder | 1,90 | `content/cylinder-catalog.json:185`, `cylinders.ts:211` | bestätigen oder ersetzen |
| Zusätzlicher gemeinsamer Schlüssel | 14,90 | `content/cylinder-catalog.json:3`, `cylinders.ts:10` | bestätigen oder ersetzen |
| Schlüssel im Grundpreis enthalten | 3 Stück | `content/cylinder-catalog.json:4` | bestätigen oder ersetzen |
| Hersteller-Aufpreise und Zusatzkomponenten | keine hinterlegt | `content/cylinder-catalog.json:19` (`manufacturers: []`) | Preise je Hersteller liefern, wenn BKS und ABUS mit Preiswirkung wählbar sein sollen |

Ohne Beträge, nichts zu bestätigen:
- `content/pricing-groups.json`: nur Namen und Beschreibungen der Preisgruppen A bis D, keine Beträge.
- Global `Richtwerte`: Rückfall `PLATZHALTER_RICHTWERTE` (`src/lib/richtwerte/uebersetzung.ts:74`) ohne Spannen, Haken „Noch Platzhalter“ standardmäßig gesetzt; die Rechner zeigen keine Beträge.
- Außerhalb dieses Blocks, nur zur Kenntnis (Kundschafter 07, Abschnitt C): Preise der Gehäuse-Dienstleistung in `content/service-pricing.json`, ebenfalls ohne belegte Herkunft.

## OFFENE FRAGEN

1. (erledigt: vom Orchestrator freigegeben) Schreibrechte für den Aufruf von `preisSperre` in `src/lib/cylinder-rules.ts` und die optionalen Felder in `src/lib/types.ts`.
2. (erledigt: Migration jetzt rein additiv, siehe Nachbesserung Befund 9.)
3. (an Teil B übergeben, siehe „Stand für Teil B“) Weg in die Anfrage: Der Link in den Schließplan-Planer trägt Zylinder, Maße, Schlüssel, Ziehschutz an allen Türen und „erweiterbar“, aber keine anderen Optionen (etwa Sicherungskarte). Ist nur eine solche Option unbestätigt, rechnet der Planer ohne sie einen Preis; der Kunde wählt sie dort neu und bekommt dann ein Angebot. Soll der Planer Wünsche aus dem Link übernehmen (Änderung in `src/components/konfigurator/schliessplan-planer.tsx`, Teil B)?
4. (Entscheidung des Orchestrators: kein automatischer Haken; entscheidet der Inhaber, siehe FÜR MENSCHEN) Ein Hersteller mit Auswahl aus dem Stamm wird im Konfigurator angeboten, sobald der Haken „Angeboten“ sitzt, auch ohne Aufpreis (dann 0). Soll ein Hersteller ohne bestätigte Herstellerpreise standardmäßig mit „Preis nicht bestätigt“ angelegt werden? Heute bleibt das dem Betrieb überlassen (Anleitung Abschnitt 2).

## FÜR MENSCHEN

- Inhaber: Preisliste oben Zeile für Zeile bestätigen oder ersetzen (G9). Bis dahin entscheiden, ob einzelne Zeilen im Admin den Haken „Preis nicht bestätigt“ bekommen sollen.
- Inhaber: Einsatztexte je Bereich für BKS, ABUS und BURG-WÄCHTER freigeben (aus FA-INHALT-02, jetzt im Admin pflegbar).
- Inhaber: Preise je Hersteller (Aufpreis, Zusatzkomponenten) liefern, wenn die Herstellerwahl Preiswirkung haben soll.
- Inhaber: entscheiden, ob ein Hersteller ohne hinterlegten Aufpreis im Zylinderkatalog den Haken „Preis nicht bestätigt“ bekommt. Automatisch setzt ihn der Code nicht.
- Probe im Backend mit erfundenen Testdaten (G4) nach `docs/betrieb/zylinder-pflegen.md`: Bereich bei einem Hersteller ändern, Hersteller im Zylinderkatalog aus der Liste wählen, Haken „Preis nicht bestätigt“ an einer Bauform setzen und im Konfigurator den Weg in die Anfrage prüfen.

## STAND FÜR TEIL B

Daten und Typen (`src/lib/types.ts`):
- `HerstellerBereichArt` (`'sperrschliessung' | 'zutritt'`), `HerstellerBereichZuordnung` (`art`, `einsatz`), `ShopHersteller.bereiche?` (fehlt, wenn keine gepflegt sind).
- `CylinderManufacturer.stammId?` (Kennung des Stammeintrags; dann sind `id` und `name` die des Stamms), `priceUnconfirmed?` an `CylinderFormOption`, `CylinderFunctionOption`, `CylinderExtraOption`, `CylinderManufacturer`; `CylinderCatalog.keyPriceUnconfirmed?`.

Funktionen:
- `src/components/hersteller/bereiche.ts`: `bereicheDesHerstellers(h)`, `herstellerFuerAnzeige(hersteller, bereich?)`, `BEREICHE`, `BEREICH_REIHENFOLGE`, `freigegebenesLogo`. Für die sichtbare Herstellerwahl im Konfigurator: `getHersteller()` (Stamm mit Logo nur bei Freigabe) und `aktiveHersteller(catalog)` aus `src/lib/cylinder-rules.ts` über `stammId` verbinden.
- `src/lib/konfigurator/preisbestaetigung.ts` (auch über `@/lib/konfigurator`): `unbestaetigtePreise(entwurf, katalog, zusatzIds?)`, `unbestaetigteInPosition(item, katalog)`, `preisSperre(...)`, `preisSperreText(treffer)`. Die Kasse prüft über `validateCylinderDraft` mit.
- `src/lib/data/payload-mapping.ts`: `zylinderkatalogZuPayload(c, { hersteller })` verknüpft über eine Karte Kennung → ID wieder mit dem Stamm (der Seed übergibt sie heute nicht, weil der Startbestand keine Zylinder-Hersteller hat).

Payload-Felder:
- `hersteller.bereiche[].art`, `hersteller.bereiche[].einsatz`.
- `zylinderkatalog.hersteller[].stamm`, `.preisNichtBestaetigt`; `zylinderkatalog.bauformen[]/funktionen[]/extras[].preisNichtBestaetigt`; `zylinderkatalog.schluesselPreisNichtBestaetigt`. Hook `herstellerAusStamm` in `src/payload/globals/Zylinderkatalog.ts`.

Noch offen für Teil B:
- Herstellerwahl BKS und ABUS im Konfigurator sichtbar, auch ohne Preisdaten (heute erscheint der Schritt erst mit einem angebotenen Eintrag im Zylinderkatalog, dessen Hersteller-Liste leer ist); ehrlicher Text, dass die Wahl ohne Herstellerpreise eine Angabe für das Angebot ist; Logos nur mit Freigabe (R12). Der Satz „Weitere Hersteller oder Sonderlösungen auf Anfrage“ im Herstellerschritt von `konfigurator.tsx` enthält danach einen Gedankenstrich aus dem Bestand.
- Erweiterbarkeit als Frage mit Wirkung auf die Zusammenfassung, Schlüsselanzahl, Sicherungskarte (Frage, ob schon eine vorhanden ist; R13 bleibt).
- Weitere Bauformen (`BAUFORMEN` in `Zylinderkatalog.ts` ist eine feste Auswahl; neue Werte brauchen Migration).
- Oberflächentest des Konfigurators mit drei Maßen bis in Warenkorb und Serverprüfung (die Serverprüfung mit drei Maßen ist in `security.test.ts` schon abgedeckt).
- Der Schließplan-Planer übernimmt weitere Wünsche aus dem Link nicht (Optionen außer Ziehschutz und „erweiterbar“, etwa Sicherungskarte; auch den Hersteller nicht). Ist nur eine solche Option unbestätigt, rechnet der Planer ohne sie; der Kunde wählt sie dort neu. Übernahme in `src/components/konfigurator/schliessplan-planer.tsx` und `src/lib/konfigurator/preis.ts` (Teil B). Bis dahin sagt der Konfigurator ehrlich, dass Optionen und Hersteller dort noch einmal zu nennen sind.
- Der Schließplan-Planer kennt die Herstellerwahl noch nicht (`preis.ts`, „Den Hersteller wählen wir mit Ihnen“).

## NACHBESSERUNG (16.11.2026, nach zwei Gegenprüfungen)

Ein erster Lauf wurde durch das Nutzungslimit unterbrochen; sein Stand (Commit 4ea4193) ist geprüft und hier fortgesetzt.

1. [rot] Rubrikseite ohne Sperre: **behoben.** `page.tsx` fragt `priceUnconfirmed` bei Bauform, Funktion und Extra und `keyPriceUnconfirmed` beim Schlüsselpreis ab. Mit Haken steht „Preis auf Anfrage“ statt des Betrags; bei der Bauform entfällt der Satz zum Längenaufpreis, stattdessen „Diese Bauform schicken Sie uns als Anfrage.“ Ein Hinweis unter den Bauformen erklärt „Preis auf Anfrage“. Ist keine Bauform bestellbar, verspricht der Kopf keinen Direktkauf mehr („bekommen ein Angebot“). Test `page.test.tsx` (4 Tests, eindeutige Testbeträge, kein Betrag mit Haken).
2. [gelb] Beträge in den Schritten des Konfigurators: **behoben.** Bauform, Funktion, Hersteller, Extra, Erweiterbar und Zusatzkomponenten zeigen bei gesetztem Haken „Preis auf Anfrage“ schon bei der Wahl; Summe Schlüssel, Summe Optionen, Summe Zusatzkomponenten, Zwischensumme der Position zeigen bei `preisOffen` „auf Anfrage“. Der Hinweis zu Erweiterbar sagt dann „Ihren Preis nennen wir Ihnen im Angebot“ statt „in der Summe enthalten“. Unter der Laufenden Summe steht bei `preisOffen` gleich der Hinweis auf die Anfrage, nicht erst in Schritt 5.
3. [gelb] „Zylinder, Maße und Schlüssel gehen mit“ auch ohne Link: **behoben.** `anfrage` liefert neben `href` die Angabe `mitPlan` (`passtInLink`). Mit Link bleibt der Satz, ergänzt um „weitere Optionen wählen Sie dort noch einmal“; ohne Link: „Bitte nennen Sie uns in der Anfrage Bauform, Maße und Anzahl je Tür, die Zahl der Schlüssel und Ihre Optionen.“ Ein gewählter Hersteller gilt nicht als mitgenommen: „Den Hersteller … nennen Sie uns dort bitte noch einmal.“
4. [gelb] Kassenmeldung als Sackgasse: **behoben.** `preisSperre` hängt an die Meldung den Weg an (`PREIS_SPERRE_WEG` in `src/lib/konfigurator/preisbestaetigung.ts`): „Bitte stellen Sie sie im Konfigurator für gleichschließende Zylinder zusammen und schicken Sie sie uns dort als Anfrage; Sie bekommen ein Angebot.“ Die Kasse (`orders.ts`) bleibt unverändert und gibt die Meldung wie bisher weiter; keine Zahlungslogik berührt. Der Schließplan-Planer nimmt den Satz über `ohneSperreWeg` wieder heraus, weil er selbst ins Angebot führt. Test in `preisbestaetigung.test.ts`.
5. [gelb] Anleitung „nicht ‚In den Warenkorb‘“ und „Knopf“: **behoben.** `zylinder-pflegen.md` Abschnitt 5 und 7: „Link **Zusammenstellung als Anfrage schicken**“, „‚In den Warenkorb‘ ist gesperrt“; dazu der Weg ohne Link und der Hinweis der Kasse.
6. [gelb] Sperrhinweis verdeckt fehlende Angaben: **behoben.** Die Angaben prüft jetzt `angabenPruefen` gemeinsam für Schrittprüfung und Hinweis. Der Preishinweis erscheint nur, wenn Hersteller, Zylinder, Schlüssel und Erweiterbarkeit vollständig sind; sonst „Bitte vervollständigen Sie die vorherigen Schritte.“
7. [rot] Hilfetext am Feld „einsatz“: **behoben.** Neu: „Erscheint auf der Herstellerseite bei Schlüssel nach Code und auf der Startseite bei Herstellern ohne Bereich; mit Bereich zeigt die Startseite den Text des Bereichs.“ Ebenso berichtigt: der Hilfetext am Array „Bereiche“ („Ohne Bereich erscheint er auf keiner dieser beiden Seiten“ statt „nur auf der Startseite“), die Anleitung Abschnitt 1 Punkt 4 und Satz 1 unter WAS UND WARUM.
8. [gelb] wie Befund 3: **behoben** (dieselbe Änderung, Satz hängt an `mitPlan`).
9. [gelb] Migration nicht rein additiv: **behoben** nach Entscheidung des Orchestrators. `name` und `kennung` im Reiter Hersteller des Zylinderkatalogs haben keine `admin.condition` mehr, sind sichtbar, Pflicht und `admin.readOnly`. Payload kennt `readOnly` nur fest, nicht abhängig von der Zeile; deshalb sind beide immer nur lesbar. Eine eigene Prüfung lässt sie leer, wenn ein Hersteller aus der Liste gewählt ist (der Hook `herstellerAusStamm` füllt sie vor dem Speichern), und verlangt sonst die bisherigen Werte („Bitte oben den Hersteller aus der Liste wählen.“). Folge: Ein älterer Eintrag ohne Auswahl lässt sich im Admin nicht mehr umbenennen, nur durch Auswahl aus der Liste ändern; im Startbestand gibt es keinen solchen Eintrag (`manufacturers: []`). Die alte Migration `20261115_233016_zylinder_bestaetigt` (zwei Dateien und Eintrag in `index.ts`) ist gelöscht und mit `sicher.sh --pg -- npx payload migrate:create zylinder_bestaetigt` neu erzeugt: `src/migrations/20261116_021014_zylinder_bestaetigt.ts`. Inhalt von `up`: `CREATE TYPE` `enum_hersteller_bereiche_art` und `enum__hersteller_v_version_bereiche_art`; `CREATE TABLE` `hersteller_bereiche` und `_hersteller_v_version_bereiche`; `ADD COLUMN preis_nicht_bestaetigt boolean DEFAULT false` an `zylinderkatalog_bauformen`, `_funktionen`, `_extras`, `_hersteller`; `ADD COLUMN stamm_id integer` an `zylinderkatalog_hersteller`; `ADD COLUMN schluessel_preis_nicht_bestaetigt boolean DEFAULT false` an `zylinderkatalog`; Fremdschlüssel der beiden neuen Tabellen (`ON DELETE cascade`) und von `stamm_id` (`ON DELETE set null`); fünf neue Indizes. Kein DROP, kein `ALTER COLUMN`. Test `zylinderkatalog-hersteller.test.ts` (Pflicht, ohne Bedingung, nur lesbar, Prüfung mit und ohne Auswahl). Anleitung Abschnitt 2 angepasst.
10. [gelb] Schreibrechte `cylinder-rules.ts`, `types.ts`: **erledigt** durch Freigabe des Orchestrators; keine Codeänderung nötig.
11. [gelb] Doppelprüfung zählt leere Zeilen: **behoben.** `arten.filter(Boolean)` vor dem Vergleich; Test `hersteller-bereiche.test.ts` (zwei leere Zeilen gelten nicht als Doppel, ein echter Doppel wird abgelehnt).

`src/payload-types.ts` am Ende neu erzeugt (`sicher.sh --json -- npx payload generate:types`). Nicht angefasst: `src/app/(site)/schluessel-nach-code/**`, `src/lib/codelinie-texte.ts`, `src/payload/collections/Kategorien.ts`, `docs/betrieb/shop-pflegen.md`, `src/lib/actions/orders.ts`.

Prüfungen nach der Nachbesserung, alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 221 Dateien, 3472 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 23 Dateien, 135 Tests, alle grün (mit der neu erzeugten Migration).
- `sicher.sh --json -- npm run build`: grün.
