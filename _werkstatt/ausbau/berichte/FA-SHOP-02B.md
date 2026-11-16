# FA-SHOP-02B · Bericht · Gehäuse, Reparatur und Customizing, Teil B (Listen, Seiten, Leistungen, Rubrik)

Anforderungen FA-14-01 bis FA-14-10, FA-10-05 bis FA-10-08, FA-20-05, FA-22-29, FA-22-30 (Teil B) · Stand 16.11.2026 · ohne neues Datenschema, ohne Migration

## GEÄNDERTE DATEIEN

Neu:
- `src/app/(site)/autoschluessel/gehaeuse/teile/page.tsx` (Liste Gehäuse und Ersatzteile mit Filter, dynamisch über `searchParams`)
- `src/app/(site)/autoschluessel/gehaeuse/teile/ansicht.ts` (reine Funktionen: Filter aus der Adresse, Etiketten, Gruppen, Karten, Filterzeilen)
- `src/app/(site)/autoschluessel/gehaeuse/teile/mein-fahrzeug.tsx` („Mein Fahrzeug“ über den vorhandenen Pkw-Katalog und `sucheFahrzeuge`)
- `src/app/(site)/autoschluessel/gehaeuse/leistungen.ts` (drei Leistungen, Ablauf, Versandempfehlung für Schlüssel mit Elektronik)
- `src/app/(site)/autoschluessel/customizing/page.tsx`, `texte.ts`, `umbau-beispiele.tsx`
- Tests: `teile/ansicht.test.ts`, `gehaeuse/leistungen.test.ts`, `customizing/texte.test.ts`

Geändert:
- `src/app/(site)/autoschluessel/gehaeuse/page.tsx` (Abschnitte 03 Leistungen, 04 Einsenden, 05 Teile, 06 Beispiele)
- `src/app/(site)/artikel/[slug]/page.tsx` (Fahrzeugteil: Brotkrume über die Liste, Angaben, Abschnitt „Passt das Teil zu Ihrem Schlüssel?“)
- `src/lib/artikel.ts` (`reiheName`, `baujahrText`, `fahrzeugText`, `fahrzeugteilAngaben`, `fahrzeugteilHinweise`) mit Test `src/lib/artikel.test.ts`
- `src/app/(site)/shop/kategorie-weg.ts` mit Test (Sonderregel entfällt)
- `content/kategorien.json`, `src/lib/data/defaults/kategorien.ts` (nur die drei Ziele)
- `src/app/sitemap.ts` mit Test `src/app/sitemap.test.ts`
- `src/lib/data/seo-laengen.test.ts` (zwei Routen in `RUECKFAELLE_B`)
- `src/payload/collections/Produkte.ts` (eine Zeile Hilfetext), danach `src/payload-types.ts` über `npm run generate:types` (eine Zeile)
- `docs/betrieb/gehaeuse-pflegen.md` (Abschnitt 4 „Was Kunden sehen“)

Nicht angefasst: Preise, Datenschema, Migrationen, `content/vehicles.json`, Navigation, Startseite, Rubriken, Gehäuse-Anfrage, Einsendeformular, Warenkorb, Kasse, `src/lib/server/unterlagen-pflicht.ts`.

## WAS UND WARUM

1. **Liste `/autoschluessel/gehaeuse/teile`** (Punkt 1; FA-14-01 bis FA-14-03, FA-14-10). Filter nach Marke, Modell, Baujahr, Bauform, Tastenzahl, Teil und Schlüsseltyp als Formular mit Adresse (GET), ohne JavaScript bedienbar; jedes gesetzte Merkmal steht als Verweis „entfernen“ darüber. Die Auswahl zeigt nur Werte, die es bei den Teilen gibt (`filterAuswahl`). „Mein Fahrzeug“ nutzt denselben Katalog (`KATALOG_ADRESSE.pkw`, `useKatalog`) und dieselbe Suche wie der Assistent; jeder Treffer ist ein Verweis mit Marke und Reihe. Eine Reihe bringt ihre Marke mit (ein Feld „Modell“ genügt ohne JavaScript); wählt der Kunde zuletzt eine andere Marke, gilt sie und die Reihe entfällt. Ohne Teile: ehrlicher Zustand und Weg in die Gehäuse-Anfrage. Suchmaschinen: canonical immer die Liste; noindex bei gesetztem Filter (R2, R3) und solange es kein indexierbares Teil gibt; Sitemap ebenso.
2. **Pflichtpunkte der Gegenprüfung von Teil A.** (1) `ELEKTRONIK_SATZ` „pruefung“ erscheint auf der Artikelseite nur mit dem Verweis „Zur Gehäuse-Anfrage mit Fahrzeug und Fotos“ (`fahrzeugteilHinweise(...).anfrage`). (2) Mit gewähltem Fahrzeug stehen markenübergreifende Teile getrennt unter „Passt zu jedem Fahrzeug“; ein Gehäuse ohne Marke erscheint bei keinem Fahrzeug (`teileGruppieren`). (3) „Passt zu Ihrem Modell“ nur bei Passung `reihe` und gewähltem Modell; bei `marke` „Passt zu Ihrer Marke, bitte Modell prüfen“. Zusätzlich: Hat der Kunde nur die Marke gewählt, liefert `fahrzeugPassung` für Teile mit Reihen ebenfalls `reihe`; das Etikett sagt dann „Für einzelne Modelle dieser Marke, bitte Modell prüfen“ statt „Ihr Modell“. (4) Admin-Hilfetext „Erscheint auf der Seite des Artikels.“, Typen neu erzeugt.
3. **Detailseite** bleibt `/artikel/[slug]` (eine Kasse, kein zweiter Kaufweg). Für Fahrzeugteile: Brotkrume über „Gehäuse und Ersatzteile“, Angaben Art des Teils, Fahrzeug (Marke, Reihen mit Namen aus dem Katalog, Baujahre), Bauform, Tasten, Schlüsseltyp, dazu Kompatibilitätshinweis (Pflichttext) und Elektronik-Satz. Preis nur bei bestellbaren Artikeln (Bestand). Strukturdaten unverändert: `Product` mit Angebot nur für bestellbare Artikel (R8); keine neuen Eigenschaften in den Strukturdaten.
4. **Dienstleistungen mit Einsendung** (Punkt 2; FA-14-04). Auf `/autoschluessel/gehaeuse` die drei Leistungen in der Benennung der Vorgabe, je mit Bedingung, und der Ablauf: Anfrage mit drei Fotos und Fahrzeugschein, Rückmeldung mit Preis und Ablauf, erst dann einschicken. Es gibt keinen Preis des Inhabers, darum kein Produkt mit Kasse (G9). Den Zahlungslink sagt die Seite nicht zu: Laut A-036 und MA-27 gilt die Freigabe mit Zahlungslink für Gehäuse noch nicht (siehe OFFENE FRAGE 1). Pflichtunterlagen über den vorhandenen Weg (Gehäuse-Anfrage mit Steckplätzen und `unterlagen-pflicht.ts`, unverändert, R13). Einsendung: kein zweiter Weg; die Seite nennt die Versandart, die in den Einstellungen für Originalschlüssel empfohlen ist (Start DHL Paket, aus `variantenAus`, nie Sonderfall, nie abgeschaltet), deren Haftung als Zahl, den Haftungshinweis und den Verpackungshinweis im Wortlaut des Inhabers.
5. **Rubrik Customizing `/autoschluessel/customizing`** (Punkt 3; FA-14-05 bis FA-14-11). Was möglich ist (optische Erneuerung; Umbau in eine neuere Gehäuseform als allgemeine Erklärung der Beispielidee), Bedingungen (Elektronik, Transponder, Tasten, Bart), der Satz des Inhabers im Wortlaut, Prüfung (Fotos und Fahrzeugschein, Fahrzeug und Schlüsseltyp, Rückmeldung ob es geht), Auswahl nach Fahrzeug („Mein Fahrzeug“, Ziel Liste mit Teil Gehäuse) oder Schlüsseltyp (Verweise auf die Liste), nur wenn es Gehäuse gibt; sonst Weg in die Anfrage. Keine konkreten Fahrzeuge oder Gehäuse (Test gegen alle Marken des Bestands). `VorherNachher` erscheint nur mit freigegebenen Beispielen aus `getUmbauBeispiele('customizing')`; auf der Gehäuse-Seite mit Beispielen für Gehäuse und Reparatur.
6. **Kategorien** (Punkt 5): „Autoschlüsselgehäuse“ → `/autoschluessel/gehaeuse/teile`, „Gehäuseumbau und Reparaturservice“ → `/autoschluessel/gehaeuse`, „Customizing und Modifikation“ → `/autoschluessel/customizing`; Daten und Rückfall wortgleich (bestehender Test `shop.test.ts`). Die Sonderregel `AUTOSCHLUESSEL_KATEGORIEN` ist entfallen; der Test prüft jetzt die Ziele aus den Daten und dass ein im Backend gepflegtes Ziel ohne Thema die allgemeine Anfrage mit Namen bleibt (angepasst, nicht gelöscht, G8). Der Seed gleicht `ziel` über den Startwert-Abgleich ab.
7. **Suchtexte und Verweise** (Punkt 5): Titel „Autoschlüssel-Gehäuse und Teile“ und „Customizing für Autoschlüssel“, Beschreibungen 152 und 157 Zeichen, beide in `seo-laengen.test.ts` (Länge, Breite, keine Zusagen). Brotkrumen sichtbar und in `SeitenDaten`; Customizing mit `Service` aus dem sichtbaren Kurztext. Eingehende Verweise: Customizing und Liste von der Gehäuse-Seite (`href`), Liste auch von Artikelseiten der Teile; `waisen.test.ts` grün.

Laufzeitbibliothek: keine neue (G7). Prettier nicht auf Bestand angewendet.

## GEMEINSAME DATEIEN

- `src/payload/collections/Produkte.ts`, Zeile 267: „Erscheint später auf der Seite des Artikels.“ → „Erscheint auf der Seite des Artikels.“ (Zusatzrecht laut Paket). `src/payload-types.ts`: dieselbe Zeile, erzeugt über `sicher.sh --json -- npm run generate:types`.
- Warenkorb, Kasse, Einsendeformular: nicht angefasst.
- `src/app/(site)/artikel/[slug]/page.tsx` importiert Pfade aus `autoschluessel/gehaeuse/teile/ansicht.ts`; `customizing/page.tsx` nutzt `MeinFahrzeug` und `teileAdresse` aus demselben Ordner, `gehaeuse/page.tsx` den Baustein `UmbauBeispiele` aus `customizing/`.

## PRÜFUNG UND ERGEBNIS

Alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 236 Dateien, 3657 Tests bestanden, 0 Fehler (neu: 3 Dateien; ergänzt: `artikel.test.ts`, `sitemap.test.ts`, `kategorie-weg.test.ts`, `seo-laengen.test.ts`).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Befund.
- `sicher.sh --json -- npm run build`: erfolgreich, 180 von 180 Seiten; `/autoschluessel/customizing` statisch, `/autoschluessel/gehaeuse/teile` dynamisch (Filter in der Adresse).
- `sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/reste.mjs --quellen quelltext`: keine Funde, keine neuen Ausnahmen.
- Kein Server, keine Sichtprobe im Browser, kein git (Paketvorgabe).

## BELEGE

- Etiketten, Gruppen, Filter aus der Adresse: `teile/ansicht.test.ts` (Blöcke „Etikett zum Fahrzeug“, „Mein Fahrzeug: markenübergreifende Teile getrennt“, „Filter aus der Adresse“).
- Elektronik-Satz nur mit Anfrage: `artikel.test.ts` › „der Satz ‚nur nach Prüfung‘ kommt nur mit dem Verweis in die Anfrage“; Darstellung `artikel/[slug]/page.tsx` (`teilHinweise.anfrage`).
- Leistungen ohne Preis, Zahlungslink und Frist, Ablauf mit Fahrzeugschein und drei Fotos, Versand nie Sonderfall oder abgeschaltet: `gehaeuse/leistungen.test.ts`.
- Wortlaut des Inhabers, keine Marken, Vergleich nur aus Daten: `customizing/texte.test.ts`.
- Sitemap: `sitemap.test.ts` › „führt Customizing immer und die Liste … nur mit echten Teilen“.
- Kategorien: `kategorie-weg.test.ts`, `shop.test.ts` (Daten gleich Rückfall).

## OFFENE FRAGEN

1. OFFENE FRAGE (A-036, MA-27): Das Paket nennt „Anfrage mit Angebot und Zahlungslink (Bestand)“. Für Gehäuse besteht laut A-036 nur die Anfrage; der Inhaber antwortet mit Preis und Ablauf, die Freigabe mit Zahlungslink ist bis MA-27 gesperrt. Die Seiten sagen darum nur „Rückmeldung mit Preis und Ablauf“ zu. Nach MA-27: Freigabe für Gehäuse als Leistung (`freigabeLeistung`) und den Satz im Ablauf ergänzen.
2. OFFENE FRAGE (Einsendeweg): Was für die Einsendung von Schlüsseln mit Fahrzeugelektronik noch fehlt: (a) Das Einsendeformular `/schluessel-einschicken/anmelden` nimmt Schlüssel mit Fahrzeugelektronik nicht an (Schlüsselart „elektronik“ ist „nicht für Fahrzeuge“, Autoschlüssel mit Transponder oder Funk werden weiterverwiesen). (b) Der Vorgang der Gehäuse-Anfrage bekommt keinen Begleitschein, keine Variantenwahl und kein Feld für die Sendungsnummer; das alles hängt an der Freigabe (`approval.sendInRequired`), die für Gehäuse gesperrt ist (Frage 1). (c) Nötig wäre: Freigabe mit Einsendung für die Quelle `gehaeuse`, dann zeigen Vorgangsseite, Begleitschein (`?v=`), Varianten mit Empfehlung DHL Paket und das Feld für die Sendungsnummer automatisch. Bis dahin nennt die Gehäuse-Seite Versandart und Verpackung und sagt, dass der Weg mit der Rückmeldung kommt.
3. OFFENE FRAGE (Nachbesserung: bis zur Entscheidung mit der Einleitung „Unser Grundsatz:“ als Zitat gesetzt): Der Satz des Inhabers lautet „Keine falschen Versprechen: Optischer Umbau nur dort anbieten, wo …“. Er steht unverändert auf der Customizing-Seite, ist aber als Anweisung an den Betrieb formuliert. Soll er für Kunden umformuliert werden (etwa „Wir bieten einen optischen Umbau nur dort an, wo …“)? Entscheidet der Inhaber.
4. OFFENE FRAGE: Die Sätze zu den Bedingungen (etwa „Der Transponder muss mit umziehen, sonst startet das Fahrzeug nicht.“, „Der Schlüsselbart muss … neu gefräst werden können.“) sind meine sachliche Zusammenfassung; bitte von der Werkstatt bestätigen (R4).
5. Erledigt in der Nachbesserung (Befund 2). Früherer Stand: Gibt es bestellbare Teile, sagt der Hinweis der Kategorie „Autoschlüsselgehäuse“ weiter „Direkt bestellen können Sie hier derzeit nicht.“, bis der Betrieb das Feld leert (Anleitung nennt das). Eine automatische Regel bräuchte die Zahl der Fahrzeugteile in `/shop`; die Kategorie hat die Art „anfrage“, und eine Umstellung auf „artikel“ würde Artikel ohne Kategorie dieser Kategorie zuordnen (erste Artikel-Kategorie). Gewünscht?
6. OFFENE FRAGE: Der Assistent (`/autoschluessel/anfrage`) bietet weiter die Leistung „Gehäuse, Tasten und Batterie“ mit Preis aus `content/service-pricing.json` an (Herkunft der Preise unbelegt, siehe FA-ABGLEICH Block 07). Es bleiben zwei Gehäuse-Wege; zusammenführen nur mit Entscheidung des Inhabers (G9).
7. Hinweis: Fahrzeugteile erscheinen weiter auch in der allgemeinen Liste `/artikel` (unverändert). Soll `/artikel` sie ausblenden und nur auf die neue Liste verweisen?

## FÜR MENSCHEN

- Inhaber: MA-27 beantworten (Gehäuse wie Vorlage ja/nein, freigegebene Sätze), damit Zahlungslink und Einsendung mit Begleitschein für Gehäuse kommen können.
- Inhaber: Preise für Gehäusetausch, Reparatur und Umbau, falls sie als Produkt mit Kasse laufen sollen (G9).
- Inhaber: Freigabe oder Umformulierung des Satzes „Keine falschen Versprechen …“ für Kunden (Frage 3); Werkstatt: Bedingungssätze bestätigen (Frage 4).
- Betrieb: Teile, Kompatibilitätssätze und echte Vorher-Nachher-Fotos pflegen (MA-53); danach Probe nach `docs/betrieb/gehaeuse-pflegen.md`, Abschnitt 4.
- Orchestrator, gewünschte Einträge außerhalb der Schreibrechte (nicht umgesetzt):
  - Rubrik „Customizing“ in `content/rubriken.json` und `src/lib/data/defaults/rubriken.ts` mit Ziel `/autoschluessel/customizing` (dann auch `rubrik` im `PageHeader` der Seite).
  - Navigation unter Autoschlüssel: „Gehäuse und Ersatzteile“ (`/autoschluessel/gehaeuse/teile`) und „Customizing“ (`/autoschluessel/customizing`).
  - Rubrik `autoschluessel-gehaeuse`, Ablauf: prüfen, ob er „Angebot mit Zahlungslink“ zusagt (FA-ABGLEICH Block 07, `content/rubriken.json`); bis MA-27 nur „Preis und Ablauf“.
  - Optional Einträge in `content/seo.json` für die zwei neuen Routen, wenn der Betrieb Titel und Beschreibung im Admin pflegen soll.
- Sichtprobe im Browser (Orchestrator): Liste mit erfundenem Teil (G4), „Mein Fahrzeug“, Filter ohne JavaScript, Artikelseite mit „Nur nach Prüfung“.

## Nachbesserung (Gegenprüfung, 16.11.2026)

Alle dreizehn Befunde am Code geprüft; alle trafen zu und sind behoben (Befund 4 und 7 teils als gewünschte Einträge außerhalb der Schreibrechte).

1. [rot] Sackgasse bei „Mein Fahrzeug“: **behoben.** `MeinFahrzeug` hat die Pflicht-Eigenschaft `rueckfall` (`mein-fahrzeug.tsx`). Auf der Liste: „Wählen Sie das Modell bitte im Filter darunter.“, ohne Feld „Modell“ „Wählen Sie die Marke bitte im Filter darunter.“ (`filterFormular(...).modellFeld`). Auf der Customizing-Seite: Verweis „Zur Liste der Gehäuse“ auf `teileAdresse({ teileart: 'gehaeuse' })`, dazu immer ein gewöhnlicher Verweis „Alle Gehäuse ansehen“, der ohne JavaScript geht.
2. [gelb] Hinweis der Kategorie „Autoschlüsselgehäuse“: **behoben.** `anzahlJeKategorie` zählt für Anfrage-Kategorien mit der Teileliste als Ziel (`istTeileliste`) die bestellbaren Fahrzeugteile (kein Beispiel, lieferbar, `istBestellbar`). `kategorieWeg` zeigt den Hinweis dort nur bei null Teilen; mit Teilen heißt der Knopf „Ansehen“. Ohne Änderung an `shop/page.tsx` (die Seite reicht die Artikel schon durch). Anleitung angepasst: Das Feld muss niemand mehr leeren. Offene Frage 5 entfällt. Tests in `kategorie-weg.test.ts`.
3. [gelb] `fahrzeugText`: **behoben.** Teil mit Passform (`TEILEARTEN_MIT_MARKE`) ohne Marke: „Fahrzeug nicht angegeben, bitte anfragen“ (`FAHRZEUG_FEHLT` in `src/lib/artikel.ts`); Batterie bleibt „Passt zu jedem Fahrzeug“. Test in `artikel.test.ts`, Anleitung nennt den Text.
4. [gelb] „die Elektronik bleibt“ ohne Bedingung: **behoben in den Schreibrechten.** `gehaeuse/page.tsx` Beschreibung: „Neues Gehäuse für Ihren Funkschlüssel, die Elektronik bleibt, wenn sie hineinpasst. …“ (157 Zeichen, `seo-laengen.test.ts` grün). `customizing/texte.ts`: „Die Technik Ihres Schlüssels bleibt, wenn sie in das neue Gehäuse passt.“ Stellen außerhalb der Schreibrechte stehen unten unter FÜR MENSCHEN.
5. [gelb] Satz des Inhabers vor Kunden: **behoben bis zur Entscheidung.** Wortlaut unverändert (`KEINE_FALSCHEN_VERSPRECHEN`), jetzt als Zitat (`figure`/`blockquote`) mit der Einleitung „Unser Grundsatz:“ (`GRUNDSATZ_EINLEITUNG`). Umformulierung bleibt beim Inhaber (Frage 3).
6. [gelb] „Alle Marken“ hebt die Fahrzeugwahl nicht auf: **behoben.** `teileFilter` unterscheidet leer übergebene Marke von fehlender. Damit ein neu gewähltes Modell bei „Alle Marken“ weiter seine Marke mitbringt (Feld „Modell“ allein genügt), schickt das Formular das vorher gewählte Modell im verborgenen Feld `modell-vorher` mit: Marke leer und Modell unverändert (oder ohne Formular) heißt Fahrzeugwahl aufheben; Marke leer und neues Modell heißt Marke aus dem Modell. Drei Fälle in `ansicht.test.ts`.
7. [gelb] Zwei Abläufe auf der Gehäuse-Seite: **behoben.** `GEHAEUSE_ABLAUF` entfällt; Abschnitt 03 zeigt die drei Leistungen mit Bedingung und den Satz `LEISTUNGEN_ABLAUF_VERWEIS` („Wie es abläuft, steht oben unter 01. … Ihren Schlüssel schicken Sie erst nach unserer Rückmeldung.“). Test in `leistungen.test.ts` umgestellt, nicht gelöscht (G8). Gewünschter Eintrag Rubrikdaten siehe unten.
8. [gelb] Leistung geht nicht in die Anfrage mit: **behoben auf der Seite, Rest als offene Frage.** Customizing (Abschnitt Prüfung): „Schreiben Sie in der Anfrage, dass Sie einen Umbau wünschen.“; Gehäuse-Seite Abschnitt 03: „Schreiben Sie in der Anfrage, welche der drei Leistungen Sie wünschen.“ Anleitung ergänzt. Neue OFFENE FRAGE 8 unten.
9. [gelb] Formular verliert Fahrzeug und verborgene Merkmale: **behoben.** Neue reine Funktion `filterFormular` (`ansicht.ts`): Ein gesetzter Wert ohne Option erscheint als zusätzliche gewählte Option („Testmarke Beta (gewählt)“); ein Feld erscheint auch dann, wenn nur der gesetzte Wert es braucht (etwa „Teil“ bei einer einzigen Teileart vom Customizing-Einstieg, Baujahr). Marke wird ohne Rücksicht auf Groß- und Kleinschreibung auf die Option abgebildet. Die Liste baut das Formular daraus. Tests: Fahrzeug ohne Teile über `teileAdresse` übersteht das erneute Absenden, Teileart vom Customizing, alle Merkmale zusammen.
10. [gelb] Versandempfehlung fest verdrahtet: **behoben** nach Vorschlag mit `empfehlungFuer({ schluesselart: 'elektronik' })`; Test „folgt der Regel empfehlungFuer“.
11. [gelb] Vorspann zum Preis: **behoben**: „… wenn wir die Fotos Ihres Schlüssels gesehen haben.“ (im Test geprüft).
12. [gelb] Nummerierung ohne Teile: **behoben**: Abschnitt „Weiter“ hat ohne Teile die Nummer 01.
13. [gelb] Beschreibung bei nur Beispielartikeln: **behoben**: Beschreibung und Vorspann der Liste unterscheiden nach `teile.some((t) => !t.example)`.

Geänderte Dateien der Nachbesserung: `src/app/(site)/autoschluessel/gehaeuse/teile/{ansicht.ts,ansicht.test.ts,mein-fahrzeug.tsx,page.tsx}`, `src/app/(site)/autoschluessel/gehaeuse/{page.tsx,leistungen.ts,leistungen.test.ts}`, `src/app/(site)/autoschluessel/customizing/{page.tsx,texte.ts}`, `src/lib/artikel.ts`, `src/lib/artikel.test.ts`, `src/app/(site)/shop/{kategorie-weg.ts,kategorie-weg.test.ts}`, `docs/betrieb/gehaeuse-pflegen.md`. Keine gemeinsamen Dateien, `content/kategorien.json` unverändert.

Prüfung nach der Nachbesserung (Datenweiche): `npx vitest run` 236 Dateien, 3667 Tests grün; `npm run typecheck` ohne Fehler; `npm run lint` ohne Befund; `npm run build` erfolgreich; `reste.mjs --quellen quelltext`: keine Funde.

8. OFFENE FRAGE (Nachbesserung, Befund 8): Die Gehäuse-Anfrage sollte die Leistung vorbelegen, etwa über den Adressparameter `?leistung=gehaeusetausch|reparatur|umbau`, damit der Betrieb sie im Vorgang als Angabe sieht und nicht nur in der freien Beschreibung. Dafür braucht es Schreibrecht für `src/app/(site)/autoschluessel/gehaeuse/anfrage/**` samt Vorgang (ob ein Feld im Vorgang ohne neues Datenschema geht, ist zu prüfen; sonst als Teil der Beschreibung vorbelegen). Danach verweisen „Umbau anfragen“ und die Leistungen mit Parameter.

FÜR MENSCHEN (Nachbesserung), gewünschte Einträge außerhalb der Schreibrechte:
- Bedingung ergänzen, wo „die Elektronik bleibt“ oder „kommt im neuen Gehäuse zurück“ ohne Bedingung steht (FA-14-11): `content/rubriken.json` Z. 546 (Erklärung `autoschluessel-gehaeuse`) und Z. 567 (Ablauf, Schritt Rückversand), gleichlautend `src/lib/data/defaults/rubriken.ts` Z. 552 und Z. 573; `content/car-key-services.json` Z. 63 („Die Elektronik bleibt erhalten.“); `src/app/(site)/autoschluessel/page.tsx` Z. 172 („Die vorhandene Elektronik bleibt erhalten.“). Vorschlag: „…, wenn sie in das neue Gehäuse passt“ bzw. „Passt alles, kommt Ihr Schlüssel im neuen Gehäuse zurück.“
- Rubrik `autoschluessel-gehaeuse`, Ablauf: Er ist jetzt der einzige Ablauf der Gehäuse-Seite. Schritt 2 „Preis erhalten“ sollte sagen, dass wir auch melden, wenn es bei dem Schlüssel nicht geht; Schritt 3 deckt „erst nach Rückmeldung einschicken“ ab.

## Abnahme durch den Orchestrator (16.11.2026)

Erledigt aus den gewünschten Einträgen außerhalb der Schreibrechte des Pakets:
- **Eigene Rubrik „Customizing und Modifikation“ als Datensatz** (Abschnitt 14 des Inhabers: „Eigene Rubrik für Customizing, Modifikation und optische Erneuerung“): Kennung `customizing` in `content/rubriken.json` und wortgleich in `src/lib/data/defaults/rubriken.ts`; live, Navigation „Autoschlüssel“, nicht im Hub (die 14 Hauptzugänge des Inhabers bleiben), Nachweis Fahrzeugschein, Abschluss Anfrage. Damit steht die Rubrik ohne Umbau in der Hauptnavigation unter Autoschlüssel und im Fuß der Seite. Der Seed legt sie in einer bestehenden Datenbank an (Abgleich über die Kennung).
- **Ablauf der Customizing-Seite aus den Rubrikdaten**: Die Seite zeigt `RubrikAblaufAbschnitt` mit `getRubrik('customizing')`; die Liste `PRUEFUNG` im Code ist entfallen (eine Quelle, im Admin pflegbar). Fehlt die Rubrik in einer Datenbank noch, gilt der Startinhalt, damit die Prüfung nie von der Seite verschwindet. Tests in `customizing/texte.test.ts` umgestellt und ergänzt, nicht gelöscht (G8); `wege/ablauf.test.tsx` kennt die Icons der neuen Rubrik.
- **Rubrik `autoschluessel-gehaeuse`**: Erklärung mit Bedingung („Die Elektronik bleibt, wenn sie hineinpasst.“), Schritt „Preis erhalten“ sagt jetzt auch: „Geht es bei Ihrem Schlüssel nicht, sagen wir Ihnen das.“ Einen Zahlungslink sagt der Ablauf nicht zu (geprüft). Das Feld `abschluss` erscheint nirgends vor Kunden.
- Nicht geändert, mit Begründung: `content/car-key-services.json` und `src/app/(site)/autoschluessel/page.tsx` („Die Elektronik bleibt erhalten.“). Dort geht es um den Tausch in ein gleiches Gehäuse und um Tasten und Batterie; die Aussage beschreibt die Leistung und ist keine Zusage zu einem Umbau. Die Datei mit den Leistungen trägt außerdem Preise (G9).
- Einträge in `content/seo.json` für die zwei neuen Routen: nicht angelegt; Titel und Beschreibung kommen aus den Seiten und sind in `seo-laengen.test.ts` geprüft.

Befund der Sichtprobe, behoben:
- Nach einem Wechsel ohne Neuladen (Treffer aus „Mein Fahrzeug“, Verweis „entfernen“) blieben die Auswahlfelder des Filters auf dem alten Stand: Die Liste war gefiltert, das Formular zeigte „Alle Marken“, und „Filter anwenden“ hätte das Fahrzeug verloren. Das Formular bekommt jetzt seinen Schlüssel aus dem Filter (`key={teileAdresse(filter)}`) und wird neu aufgebaut. Browserprobe vorher (Bild) und nachher: Formular zeigt „Volkswagen“ und „Volkswagen Golf“, „Filter anwenden“ behält das Fahrzeug, nach „entfernen“ steht wieder „Alle“. Zwei Tests in `teile/ansicht.test.ts`.

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-SHOP-02B`, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3670 von 3670, Datenbanktests 152 von 152, Build 180 von 180 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 136 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29), kein neuer Fund.

Sichtprobe im Browser (Attrappen, keine Sendung, G5):
- Ohne Teile (Stand des Repos), 390 und 1280 px: `/autoschluessel/customizing`, `/autoschluessel/gehaeuse`, `/autoschluessel/gehaeuse/teile`. Keine Konsole-Fehler, kein waagerechtes Rollen, ehrlicher Leerzustand mit Weg in die Gehäuse-Anfrage, Navigation und Fuß nennen „Customizing und Modifikation“.
- Mit fünf erfundenen Testteilen (G4; nur lokal in einer Entwicklungsinstanz auf eigenem Port, Datei danach gelöscht, nichts davon im Repo): Liste mit Preis nur bei bestellbaren Teilen; Filter nach Marke und Modell ohne JavaScript; „Passt zu Ihrem Modell“ nur beim Teil mit genannter Reihe, „Passt zu Ihrer Marke, bitte Modell prüfen“ beim Teil ohne Reihen; markenübergreifendes Teil getrennt unter „Passt zu jedem Fahrzeug“; gefilterte Ansicht `noindex, follow`, canonical auf die Liste; Fahrzeug ohne Teile bleibt als „(gewählt)“ im Formular und übersteht das erneute Absenden; „Mein Fahrzeug“ findet Reihen auch mit Tippfehler und führt mit Marke und Reihe in die Liste, von der Customizing-Seite zusätzlich mit „Teil: Gehäuse“; Artikelseite mit Angaben, Kompatibilitätssatz und dem Satz zur Elektronik samt Verweis in die Gehäuse-Anfrage; Artikel „auf Anfrage“ ohne Preis und ohne Warenkorb; alle Bedienelemente des Filters mindestens 44 px hoch.
- Nicht im Browser geprüft: Vorher-Nachher mit echten Beispielen (es gibt keine Fotos, R4); die Darstellung deckt der Test des Bausteins aus Teil A.

Beobachtungen ohne Änderung:
- Ein Fahrzeugteil „auf Anfrage“ zeigt zwei Wege: „Artikel anfragen“ (allgemeine Anfrage mit Artikelname) und „Zur Gehäuse-Anfrage mit Fahrzeug und Fotos“. Beide sind vollständig; ob für Fahrzeugteile nur die Gehäuse-Anfrage stehen soll, gehört zu MA-53.
- Der Schlüsseltyp heißt in Auswahl und Angaben „Funk“; „Funkschlüssel“ wäre für Laien klarer. Offen für die Schlussredaktion (MA-41).

Folgepaket: `pakete/FA-SHOP-02C.md` (gewünschte Leistung als Angabe in der Gehäuse-Anfrage, Vorbelegung über `?leistung=`; offene Frage 8). Bis dahin stehen die Behelfssätze auf beiden Seiten.

=== ENDE FA-SHOP-02B · BEREIT ZUR RÜCKGABE ===
