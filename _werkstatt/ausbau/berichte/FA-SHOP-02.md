# FA-SHOP-02 · Bericht · Gehäuse, Ersatzteile und Umbau-Beispiele, Teil A (Datenmodell und Bausteine)

Anforderungen FA-14-01 bis FA-14-10, FA-10-05 bis FA-10-08, FA-20-05, FA-22-29, FA-22-30 (Teil A) · Stand 16.11.2026

## GEÄNDERTE DATEIEN

Neu:
- `src/payload/collections/Bauformen.ts` (Sammlung „Bauformen“, Gruppe Shop)
- `src/payload/collections/UmbauBeispiele.ts` (Sammlung „Umbau-Beispiele“, Gruppe Autoschlüssel)
- `src/migrations/20261116_042326_gehaeuse.ts` und `.json` (über `sicher.sh --pg -- npx payload migrate:create gehaeuse`)
- `src/lib/data/fahrzeugteile.ts` (reine Funktionen: Auswahlwerte, Pflichtprüfung, Filter, Adresse, Bauformen, Umbau-Beispiele)
- `src/lib/data/defaults/fahrzeugteile.ts` (Startbestand Bauformen, Umbau-Beispiele leer)
- `src/components/bild/vorher-nachher.tsx` (Baustein `VorherNachher`)
- `docs/betrieb/gehaeuse-pflegen.md` (Betreiberanleitung, Pflege der Daten)
- Tests: `src/lib/data/fahrzeugteile.test.ts`, `src/components/bild/vorher-nachher.test.tsx`, `src/payload/collections/fahrzeugteil-felder.test.ts`, `src/payload/gehaeuse.db.test.ts`

Geändert:
- `src/payload/collections/Produkte.ts` (Reiter „Gehäuse und Ersatzteile“ mit Gruppe `fahrzeugteil`, Prüfungen)
- `src/migrations/index.ts`, `src/payload-types.ts` (erzeugt)
- `src/payload/seed.ts` (Plan `bauformen`, Verweise `bauformen` und `fahrzeugreihen` für Artikel)
- `src/lib/types.ts`, `src/lib/data/adapter.ts`, `json-adapter.ts`, `payload-adapter.ts`, `payload-mapping.ts`, `index.ts`, `defaults/index.ts`
- Test ergänzt: `src/lib/data/payload-mapping.test.ts` (neuer Block am Ende)

Nicht angefasst: Preise, `content/vehicles.json`, `content/kategorien.json` (Ziele gehören zu Teil B), Navigation, Startseite, Rubriken, Gehäuse-Anfrage `/autoschluessel/gehaeuse/anfrage`, `src/lib/artikel.ts`, Seiten unter `src/app/**`.

## WAS UND WARUM

1. **Merkmale am Produkt, additiv** (FA-14-01 bis 14-03, FA-22-30). Kein neuer Wert im Feld `typ`: Die Kasse, der Seed und `istCodeSchluessel` (`typ !== 'standard'`) behandeln jeden anderen Wert als Codeprodukt, ein neuer Typ hätte Kasse und Widerrufslogik berührt. Stattdessen sind Gehäuse und Ersatzteile Standardartikel mit dem Haken „Dieser Artikel ist ein Gehäuse oder Ersatzteil für Autoschlüssel“ im neuen Reiter „Gehäuse und Ersatzteile“ (nur bei Standardartikeln sichtbar). Gruppe `fahrzeugteil`: `aktiv`, `teileart` (Gehäuse, Tasten, Gummimatte, Batterie, Klappmechanismus, Schlüsselbart, weitere), `elektronik` (ja, nein, nur nach Prüfung), `kompatibilitaet` (Pflichttext), `bauformen` (Relation auf die pflegbare Liste, mehrfach), `marke` (Text, geprüft gegen den Fahrzeugkatalog), `reihen` (Relation auf `fahrzeugreihen`, mehrfach, im Admin nur Reihen der Marke), `baujahrVon`, `baujahrBis`, `tastenzahl`, `schluesselarten` (Werte wie `KeyKind`).
2. **Keine falschen Versprechen beim Speichern.** Beim Veröffentlichen mit Haken sind Art, Kompatibilitätshinweis und Elektronik Pflicht, bei Gehäuse, Tasten und Gummimatte die Tastenzahl, bei Gehäusen mindestens eine Bauform. Baujahr „bis“ nicht vor „von“. Marke nur so, wie sie im Fahrzeugkatalog steht (leerer Katalog: keine Ablehnung); Reihen nur zur eingetragenen Marke, ohne Marke keine Reihen. Entwürfe speichern ohne Prüfung. Die Lesesicht (`fahrzeugteilZuSeite`) gibt ohne Haken oder ohne Pflichtangaben kein Fahrzeugteil heraus.
3. **Eine Fahrzeugliste.** Marke und Reihen kommen aus dem Fahrzeugkatalog (`fahrzeugreihen`, FA-KERN-01). Die alte Sammlung `fahrzeugmarken` (`content/vehicles.json`) bleibt unberührt. Die Marke ist ein geprüfter Text, weil der Katalog keine eigene Markensammlung hat.
4. **Bauformen als pflegbare Liste** (FA-14-02). Neue Sammlung `bauformen`: Name (eindeutig), kurze Erklärung (optional), Adresse aus dem Namen, feste Kennung, Reihenfolge, Papierkorb, Versionen, kein Duplizieren. Startbestand aus Abschnitt 14 und dem Paket: Klappschlüssel, Smart Key, Karte, Fernbedienung, Schlüsselkopf, ohne Erklärungstexte (R4).
5. **Umbau-Beispiele** (FA-14-07, FA-14-08, FA-20-05). Neue Sammlung `umbau-beispiele` mit Entwürfen: Titel, Vorher und Nachher (je Foto aus `medien` und Beschriftung, beide Pflicht), Fahrzeugmarke und Reihe aus dem Katalog (optional), Schlüsseltyp, „Was übernommen wurde“ (Elektronik, Transponder, Tasten, Schlüsselbart, weitere), Hinweis (Pflicht), „Wo das Beispiel erscheint“ (Customizing, Gehäuse, Reparatur), Haken „Fotos freigegeben“, Reihenfolge. Öffentlich nur veröffentlicht, mit Freigabe und beiden Fotos samt Beschriftung. Startbestand leer, kein Seed (keine erfundenen oder erzeugten Bilder).
6. **Baustein `VorherNachher`** (`src/components/bild/vorher-nachher.tsx`, Client-Komponente). Zwei Bilder mit Etikett und Beschriftung. Ruhige Fassung (Bewegung reduziert, ohne JavaScript): nebeneinander. Bewegte Fassung über die Variante `bewegt:` (`html[data-bewegung="an"]`, Bewegungsschalter des Bestands): ein Bild mit Trennlinie und nativem Schieberegler (`input type="range"`, Pfeiltasten, Bild auf und ab, Pos1, Ende), sichtbare Beschriftung und `aria-valuetext`. Fehlt ein Bild oder eine Beschriftung, gibt der Baustein nichts aus.
7. **Lesemodell und JSON-Rückfall** (G6). Typen `FahrzeugTeil`, `Teileart`, `ElektronikUebernahme`, `GehaeuseBauform`, `UmbauBeispiel`, `VergleichsBild`, `UmbauTeil`, `UmbauEinsatz`; `StandardArticle.fahrzeugteil?`. Neue Sammlungen der Datenschicht `bauformen` und `umbauBeispiele`: ohne Datenbank aus `content/bauformen.json` bzw. `content/umbau-beispiele.json`, fehlt die Datei (heute der Fall), aus den Defaults; mit leerer Datenbank Bauformen aus den Defaults.
8. **Seed wiederholbar.** Plan `bauformen` vor den Artikeln (Schlüssel = Kennung, Gelöschtes kommt nicht wieder, Abgleich von Name und Reihenfolge). Artikel-Verweise kennen jetzt Bauformen und Reihen; der Fahrzeugkatalog wird im Seed erst nach den Artikeln übernommen, beim allerersten Lauf entfallen Reihen-Verweise aus dem Inhalt darum (der Startbestand hat keine).
9. **Migration rein additiv**: neue Enums, Tabellen `bauformen`, `_bauformen_v`, `umbau_beispiele` (+ Versionen, Mehrfachwerte), neue Spalten `fahrzeugteil_*` an `produkte` und `_produkte_v` (Haken mit `DEFAULT false`), neue Spalten in `produkte_rels`, `_produkte_v_rels`, `payload_locked_documents_rels`. Kein `DROP`, kein `ALTER` bestehender Spalten.
10. **Betreiberanleitung** `docs/betrieb/gehaeuse-pflegen.md`: Gehäuse oder Ersatzteil anlegen, Bauform anlegen, Umbau-Beispiel mit Vorher und Nachher, Hinweis auf die Seiten aus Teil B.

Laufzeitbibliothek: keine neue (G7).

## GEMEINSAME DATEIEN

- `src/payload.config.ts`: zwei Importe und zwei Einträge in `collections` (`Bauformen` nach `Hersteller`, `UmbauBeispiele` nach `Fahrzeugreihen`). Steht nicht wörtlich in den Schreibrechten, ist aber für die „neue Sammlung für Umbau-Beispiele“ nötig.
- `src/payload/seed.ts`: nur der Plan `bauformen` und zwei Einträge in `produktVerweise`, vor den Codelinien.
- `src/lib/data/adapter.ts`, `json-adapter.ts`, `payload-adapter.ts`, `index.ts`, `defaults/index.ts`: je ein Eintrag für `bauformen` und `umbauBeispiele` (in `src/lib/data/**`).

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche.
- `sicher.sh --json -- npx vitest run`: 233 Dateien, 3625 Tests, alle grün (neu: 3 Dateien mit 29 Tests, dazu 4 Tests in `payload-mapping.test.ts`).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 26 Dateien, 151 Tests, alle grün (neu: `gehaeuse.db.test.ts` mit 6 Tests; Migration läuft auf frischer Datenbank, Seed danach).
- `sicher.sh --json -- npm run build`: grün. Dieses Paket fügt keine Seiten hinzu.
- `sicher.sh --pg -- npx payload generate:types`: `src/payload-types.ts` neu erzeugt (Schnittstelle `Bauformen` über `typescript.interface`, sonst hieße sie „Bauforman“).

## BELEGE

- Migration additiv: `src/migrations/20261116_042326_gehaeuse.ts` (`up` nur `CREATE TYPE`, `CREATE TABLE`, `ADD COLUMN`, `ADD CONSTRAINT`, `CREATE INDEX`).
- Startbestand Bauformen, Seed belebt Gelöschtes nicht: `gehaeuse.db.test.ts` › „Bauformen“; Namen und keine erfundenen Texte: `fahrzeugteile.test.ts` › „Bauformen“.
- Gehäuse mit Marke und Reihe aus dem geseedeten Katalog veröffentlicht, Lesemodell vollständig, Filter nach Reihe und Baujahr: `gehaeuse.db.test.ts` › „veröffentlicht ein vollständiges Gehäuse …“.
- Pflichtangaben beim Veröffentlichen, Entwurf frei und unsichtbar: ebenda › „verlangt beim Veröffentlichen …“; Feldregeln ohne Datenbank: `fahrzeugteil-felder.test.ts`.
- Marke nur aus dem Katalog, Reihen nur zur Marke: `gehaeuse.db.test.ts` › „nimmt Marke und Reihen nur aus dem Fahrzeugkatalog“.
- Umbau-Beispiel erst mit Fotos und Freigabe: `gehaeuse.db.test.ts` › „Umbau-Beispiele“, `payload-mapping.test.ts` › „Umbau-Beispiel nur mit Freigabe …“.
- Verlustfreies Mapping: `payload-mapping.test.ts` › „Gehäuse, Ersatzteile und Umbau-Beispiele (FA-SHOP-02)“.
- Baustein: `vorher-nachher.test.tsx` (nichts ohne zwei Bilder, ruhige Fassung nebeneinander, Regler nur bei Bewegung, beschriftetes natives Eingabefeld, Alternativtexte).

## OFFENE FRAGEN

1. Gehäuse als Standardartikel mit Haken statt eigener Artikelart: bewusst, damit Kasse, Seed und Widerruf unberührt bleiben. Bestellbar wird ein Gehäuse erst mit Preis des Inhabers, wie jeder Artikel. Ob Gehäuse als Anfertigung nach Kundenvorgabe gelten (§ 312g BGB, Widerruf), ist nicht entschieden und nicht umgesetzt.
2. Bauform „weitere“: nicht als Eintrag angelegt, weil die Liste pflegbar ist und der Betrieb jede weitere Bauform selbst anlegt. Passt das?
3. Schlüsseltyp nutzt die fünf Werte des Bestands (mechanisch, Funk, Klappschlüssel, Smart Key, Keyless). „Karte“ ist eine Bauform, kein Schlüsseltyp. Gewünscht, oder soll der Schlüsseltyp eine eigene Liste werden?
4. Teile ohne Marke gelten als markenübergreifend und erscheinen bei jedem Fahrzeug (abschaltbar über `allgemeineTeile: false`). Seit der Nachbesserung ist die Marke bei Gehäuse, Tasten und Gummimatte Pflicht; ohne Marke passen sie zu keinem Fahrzeug. Ob auch Klappmechanismus und Schlüsselbart eine Marke brauchen, entscheidet der Inhaber oder die Werkstatt.
7. Umbau-Fotos liegen in der öffentlich lesbaren Sammlung `medien`: Jedes hochgeladene Foto ist sofort abrufbar, der Haken „Fotos freigegeben“ steuert nur die Anzeige. Admin und Anleitung verlangen jetzt das Unkenntlichmachen vor dem Hochladen. Brauchen Umbau-Fotos eine nicht öffentliche Ablage, bis sie freigegeben sind? Entscheidet der Inhaber (Datenschutz).
8. Schreibweise „Smart Key“: Bauform und die neue Liste `SCHLUESSELTYP_LABEL` schreiben jetzt „Smart Key“ wie der Inhaber und die meisten Seiten. Die Auswahl `SCHLUESSELARTEN` in `src/payload/fields/gemeinsam.ts` (Bestand, außerhalb der Schreibrechte) und die Zeichnung in `src/components/visual/generators/schluessel.tsx` schreiben noch „Smart-Key“; im Backend steht der Schlüsseltyp daher noch mit Bindestrich. Angleichen in einem Paket mit Schreibrecht auf den Bestand?
5. Freigabe der Umbau-Fotos: Der Haken „Fotos freigegeben“ und der Anleitungssatz „Der Kunde ist einverstanden“ sind meine Formulierung. Wie die Einwilligung des Kunden zu Fotos eingeholt und belegt wird (G9, Datenschutz), legt der Inhaber fest.
6. Seed-Reihenfolge: Der Fahrzeugkatalog wird nach den Artikeln übernommen. Für den heutigen Bestand ohne Folgen; sollte der Inhalt einmal Gehäuse mit Reihen tragen, wäre der Katalog vorzuziehen (Änderung an der Reihenfolge im Seed).

## FÜR MENSCHEN

- Liste der Gehäuse und Ersatzteile mit Fahrzeug, Bauform, Tastenzahl, Kompatibilitätshinweis und Preisen (FA-14-01 bis 14-03, FA-22-30; Preise nur vom Inhaber, G9).
- Bauformen bestätigen oder ergänzen (Startbestand: Klappschlüssel, Smart Key, Karte, Fernbedienung, Schlüsselkopf).
- Echte Vorher-Nachher-Fotos mit Einverständnis der Kunden und eine Regel, wie das Einverständnis belegt wird (FA-14-08, FA-20-05).
- Formulierung der Kompatibilitätshinweise je Teil durch die Werkstatt: was übernommen wird und was nicht passt (FA-14-09, FA-14-11).
- Probe im Backend mit erfundenen Testdaten (G4) nach `docs/betrieb/gehaeuse-pflegen.md`: Bauform anlegen, Gehäuse mit Marke und Reihe veröffentlichen, unvollständiges Gehäuse veröffentlichen (muss abgelehnt werden).

## Stand für Teil B

Datenschicht (`src/lib/data/index.ts`, server-only):
- `getFahrzeugteile(): Promise<Fahrzeugartikel[]>`: veröffentlichte Standardartikel mit `fahrzeugteil`, ohne Beispiele.
- `getBauformen(): Promise<GehaeuseBauform[]>`: sortiert, ohne Datenbank der Startbestand.
- `getUmbauBeispiele(einsatz: 'customizing' | 'gehaeuse' | 'reparatur'): Promise<UmbauBeispiel[]>`: nur zeigbare, sortiert; leer heißt: keinen Baustein zeigen.
- Fahrzeugsuche weiter über `getFahrzeugkatalog()` (Reihen mit `id`, `marke`, `reihe`, Baujahren).

Reine Funktionen (`src/lib/data/fahrzeugteile.ts`, auch im Browser):
- Filter: `FahrzeugteilFilter` (`marke`, `reihe`, `baujahr`, `bauform`, `tastenzahl`, `teileart`, `schluesselart`), `fahrzeugteileFiltern(artikel, filter, { allgemeineTeile? })` (genaue Treffer vorn), `passtZumFilter`, `fahrzeugPassung` (`reihe`, `marke`, `allgemein`, `keine`, etwa für ein Etikett „passt zu Ihrem Modell“), `fahrzeugFilter(reihe, baujahr?)` für „Mein Fahrzeug“, `filterAuswahl(artikel)` (nur vorhandene Werte, kein Filter führt ins Leere).
- Adresse ohne JavaScript: `FILTER_PARAMETER` (`marke`, `reihe`, `baujahr`, `bauform`, `tasten`, `teil`, `typ`), `filterAusSuchparametern(searchParams)` (verwirft Ungültiges, Reihe nur mit Marke), `filterZuSuchparametern(filter)`, `filterGesetzt(filter)` (für noindex der gefilterten Ansicht, R2, R3).
- Texte: `TEILEART_LABEL`, `ELEKTRONIK_LABEL`, `ELEKTRONIK_SATZ` (ganzer Satz für die Detailseite), `SCHLUESSELTYP_LABEL`, `UMBAU_TEIL_LABEL`, `UMBAU_EINSATZ_LABEL`.
- Bauformen: `bauformenSortiert`, `bauformNamen(kennungen, bauformen)`.
- Umbau-Beispiele: `umbauBeispieleFuer`, `umbauBeispielZeigbar`.
- Backend: `fahrzeugteilLuecken`, `baujahrePruefen`, `TEILEARTEN_MIT_TASTEN`, `TEILEARTEN_MIT_BAUFORM`, `TEILEARTEN_MIT_MARKE`, Typ `TeilFeld`.
- `ELEKTRONIK_SATZ` beschreibt das Teil, keinen Umbau. Der Satz zu „pruefung“ verspricht eine Klärung vor dem Kauf: Teil B zeigt ihn nur zusammen mit einem Verweis auf die Anfrage (der Kassenweg hat keinen Prüfschritt).

Typen (`src/lib/types.ts`): `FahrzeugTeil` (`teileart`, `bauformen[]` Kennungen, `marke?`, `reihen[]` Kennungen des Fahrzeugkatalogs, `baujahrVon?`, `baujahrBis?`, `tastenzahl?`, `schluesselarten[]`, `kompatibilitaet`, `elektronik`), `StandardArticle.fahrzeugteil?`, `GehaeuseBauform`, `UmbauBeispiel` (`vorher`, `nachher` als `VergleichsBild` mit `url`, `alt`, `beschriftung`, `width?`, `height?`), `Teileart`, `ElektronikUebernahme`, `UmbauTeil`, `UmbauEinsatz`.

Baustein: `VorherNachher` aus `src/components/bild/vorher-nachher.tsx`, Eigenschaften `vorher`, `nachher`, `titel?`, `className?`, `sizes?`. Direkt mit einem `UmbauBeispiel` nutzbar: `<VorherNachher vorher={b.vorher} nachher={b.nachher} titel={b.titel} />`.

Payload: `src/payload/collections/Produkte.ts` (Gruppe `fahrzeugteil`, exportiert `fahrzeugteilFeld`, `markeImKatalog`, `reihenZurMarke`, `reihenDerMarke`), `src/payload/collections/Bauformen.ts`, `src/payload/collections/UmbauBeispiele.ts`. Import: `fahrzeugteilZuPayload(teil, { bauformen, fahrzeugreihen })`, `bauformZuPayload`; Lesen: `fahrzeugteilZuSeite`, `bauformZuSeite`, `umbauBeispielZuSeite`.

Noch offen für Teil B:
- Listen- und Detailseiten mit Filter und „Mein Fahrzeug“; die Artikelseite `/artikel/[slug]` zeigt `fahrzeugteil` heute nicht (Kompatibilitätshinweis, `ELEKTRONIK_SATZ`, Bauform, Fahrzeug).
- `src/lib/artikel.ts` kennt `fahrzeugteil` nicht (Strukturdaten, Karten); Strukturdaten nur für Sichtbares (R8).
- Namen der Reihen für die Anzeige: `fahrzeugteil.reihen` sind Kennungen, die Namen kommen aus `getFahrzeugkatalog()`.
- Dienstleistungen mit Einsendung, Rubrik Customizing, Ziele der drei Kategorien in `content/kategorien.json` und Rückfall.
- Gewünschte Einträge außerhalb der Schreibrechte (nicht umgesetzt): Rubrik „Customizing“ in `content/rubriken.json` und `src/lib/data/defaults/rubriken.ts` mit Ziel `/autoschluessel/customizing`; Navigation unter Autoschlüssel mit „Gehäuse und Ersatzteile“ und „Customizing“, sobald die Seiten stehen.

## Nachbesserung (16.11.2026, Befunde der Gegenprüfer)

1. [rot] Fotos vor dem Unkenntlichmachen öffentlich: behoben. `medien` ist öffentlich lesbar (`Medien.ts`, `read: oeffentlich`), der Befund stimmt. Die Anleitung (Abschnitt 3) setzt das Bearbeiten jetzt als Schritt 1 vor das Hochladen und sagt, dass jedes hochgeladene Foto sofort öffentlich abrufbar ist; derselbe Satz steht im Feld `bild` und in der Beschreibung der Sammlung (`UmbauBeispiele.ts`). Nicht öffentliche Ablage: OFFENE FRAGE 7.
2. [rot] Gehäuse ohne Marke passt scheinbar zu jedem Auto: behoben. Neu `TEILEARTEN_MIT_MARKE` (Gehäuse, Tasten, Gummimatte); `fahrzeugteilLuecken` meldet „Bitte die Fahrzeugmarke eintragen. Ein Gehäuse passt nie zu allen Marken.“, das Feld `marke` prüft das beim Veröffentlichen (`teilMarke`). Zusätzlich gibt `fahrzeugPassung` für solche Teile ohne Marke `keine` statt `allgemein` zurück, und `fahrzeugteilZuSeite` liest sie nicht als Fahrzeugteil (falls Altdaten vor der Regel gespeichert wurden). Admin-Text und Anleitung: „Leer nur bei Teilen, die zu jeder Marke passen, etwa Batterien.“ Tests: `fahrzeugteile.test.ts`, `fahrzeugteil-felder.test.ts`, `payload-mapping.test.ts`, `gehaeuse.db.test.ts`.
3. [gelb] „Erscheint auf der Seite des Artikels“: behoben, jetzt „Erscheint später auf der Seite des Artikels.“
4. [gelb] `ELEKTRONIK_SATZ` verspricht Umbau und Fotoprüfung: behoben. Die Sätze beziehen sich auf das Teil („lassen sich mit diesem Teil weiter verwenden“), „pruefung“ sagt „klären wir vor dem Kauf. Schreiben Sie uns dazu.“; für Teil B festgehalten, dass dieser Satz nur mit Verweis auf die Anfrage erscheint.
5. [gelb] „Smart Key“ und „Smart-Key“: teilweise behoben. `SCHLUESSELTYP_LABEL` schreibt jetzt „Smart Key“ wie die Bauform und der Inhaber. `SCHLUESSELARTEN` in `gemeinsam.ts` gehört zum Bestand ohne Schreibrecht: OFFENE FRAGE 8.
6. [gelb] Paketkennung im Admin: behoben, Klammer gestrichen.
7. [gelb] Längenprüfung am Produkt fällt weg: behoben. Der Befund stimmt (eigene `validate` ersetzt die Standardprüfung). `teilPflicht` prüft mit `max` zuerst die Länge (Kompatibilitätshinweis 600, auch ohne Haken), `markeImKatalog` prüft 60 Zeichen auch bei leerem Katalog. Konstanten `KOMPATIBILITAET_MAX`, `MARKE_MAX`. Tests mit 601 und 61 Zeichen in `fahrzeugteil-felder.test.ts` und `gehaeuse.db.test.ts`.
8. [gelb] Länge der Marke am Umbau-Beispiel: behoben über dieselbe Prüfung in `markeImKatalog`; Test über das Feld der Sammlung in `fahrzeugteil-felder.test.ts`.
9. [gelb] Doppelt zu 3: behoben mit 3.
10. [gelb] „lehnt das Speichern ab“: behoben, jetzt „lehnt das Veröffentlichen ab. Diese Prüfung greift erst, wenn der Fahrzeugkatalog Einträge hat.“
11. [gelb] Ausnahmen der Filter: behoben. Kopfkommentar in `fahrzeugteile.ts` und Anleitung nennen die drei Fälle (ohne Marke jede Marke, ohne Reihen alle Reihen der Marke, ohne Baujahre jedes Baujahr) und dass leere Felder eine breite Passung zusagen.
12. [gelb] Leere Bauformen-Tabelle bringt Startbestand zurück: behoben. Der Adapter nimmt den Startbestand nur, wenn auch mit `trash: true` keine Bauform existiert; liegen alle im Papierkorb, bleibt die Liste leer. Test in `gehaeuse.db.test.ts` (alle in den Papierkorb, Liste leer, danach zurückgeholt).

Geänderte Dateien der Nachbesserung: `src/lib/data/fahrzeugteile.ts`, `src/lib/data/payload-mapping.ts`, `src/lib/data/payload-adapter.ts`, `src/payload/collections/Produkte.ts`, `src/payload/collections/UmbauBeispiele.ts`, `docs/betrieb/gehaeuse-pflegen.md`, Tests `src/lib/data/fahrzeugteile.test.ts`, `src/lib/data/payload-mapping.test.ts`, `src/payload/collections/fahrzeugteil-felder.test.ts`, `src/payload/gehaeuse.db.test.ts`. Keine Schemaänderung (nur Admin-Texte und Prüfungen), keine neue Migration.

Prüfung nach der Nachbesserung (über `sicher.sh`): vitest 233 Dateien, 3627 Tests grün; typecheck ohne Fehler; lint ohne Befund; DB-Tests 26 Dateien, 152 Tests grün (davon `gehaeuse.db.test.ts` 7); build erfolgreich.

=== ENDE FA-SHOP-02 · BEREIT ZUR RÜCKGABE ===

## ABNAHME (Orchestrator, 16.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-SHOP-02`, Build mit `SM24_INDEXIERUNG=an`): Typprüfung, Lint, Unit 3.627 Tests in 233 Dateien, Datenbanktests 152 in 26 Dateien (mit der Migration `20261116_042326_gehaeuse`), Build ohne Datenbank 178 von 178 Seiten (keine neuen Seiten; die folgen mit Teil B). Onpage-Messung: 135 Seiten, Median 100,0, kein Befund. `reste.mjs` über alle vier Quellen: kein neuer Fund.
- **Migration geprüft:** `up` enthält nur CREATE und ADD; kein DROP, kein ALTER COLUMN.
- **Vom Orchestrator nachgezogen:** Die Fahrzeugmarke ist auch bei Klappmechanismus und Schlüsselbart Pflicht (offene Frage 3 der Nachbesserung), mit Test; Admin-Hilfetext und Anleitung nennen die fünf Teilearten. Die Auswahl der Schlüsseltypen schreibt „Smart Key“ wie der Inhaber (nur die Beschriftung, der gespeicherte Wert bleibt).
- **Freigegeben:** die Einträge in `src/payload.config.ts` und die zweite neue Sammlung `Bauformen` (A-062).
- **Sichtprobe:** nicht möglich und nicht nötig; das Paket baut Datenmodell, Admin und einen Baustein, der erst mit echten, freigegebenen Fotos erscheint. Die Probe im Backend steht in MA-46 und MA-53.
- **Offen für Menschen:** MA-53 (Liste der Teile mit Preisen, Kompatibilitätssätze, Bauformen, echte Vorher-Nachher-Fotos mit Einverständnis; Ablage der Fotos vor der Freigabe; Widerruf bei Gehäusen).

