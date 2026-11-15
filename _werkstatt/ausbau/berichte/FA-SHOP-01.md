# FA-SHOP-01 · Bericht · Shop-Grundlage, Teil 1 (Datenmodell und Admin)

Anforderungen FA-10-01, FA-10-03, FA-10-10, FA-11-01 bis FA-11-19, FA-22-01 bis FA-22-10 · Stand 15.11.2026

Hinweis: Der Orchestrator hat meinen Zwischenstand schon mitcommittet (d6760fd, c8f1913, „Zwischenstand laufender Pakete, noch ungeprüft“). Der Arbeitsbaum war danach sauber; alle unten genannten Prüfungen liefen auf diesem Stand.

## GEÄNDERTE DATEIEN

Neu:
- `src/payload/collections/Kategorien.ts` (Sammlung „Shop-Kategorien“)
- `src/payload/collections/Hersteller.ts` (Sammlung „Hersteller“)
- `content/kategorien.json`, `content/hersteller.json` (JSON-Rückfall, G6)
- `src/lib/data/defaults/kategorien.ts`, `src/lib/data/defaults/hersteller.ts` (Startbestand)
- `src/lib/data/shop.ts` (reine Funktionen: Verfügbarkeit, Kategorien, Hersteller)
- `src/migrations/20261115_215557_shop_grundlage.ts` und `.json` (über `sicher.sh --pg -- npx payload migrate:create shop_grundlage`)
- `src/app/(site)/schluessel-nach-code/verfuegbarkeit-hinweis.tsx` (ruhiger Ersatz für den Kaufbereich)
- `docs/betrieb/shop-pflegen.md` (Betreiberanleitung)
- Tests: `src/lib/data/shop.test.ts`, `src/payload/collections/shop-sammlungen.test.ts`, `src/payload/shop-grundlage.db.test.ts`

Geändert:
- `src/payload/collections/Produkte.ts`, `src/payload.config.ts`, `src/migrations/index.ts`, `src/payload-types.ts` (erzeugt)
- `src/payload/seed.ts` (Pläne `kategorien`, `hersteller`; Verweise an Codelinien und Artikel)
- `src/lib/data/adapter.ts`, `json-adapter.ts`, `payload-adapter.ts`, `payload-mapping.ts`, `index.ts`, `defaults/index.ts`
- `src/lib/types.ts`, `src/lib/codelinie.ts` (nur Re-Export), `src/lib/artikel.ts` (Strukturdaten nur für Bestellbares)
- `src/lib/actions/orders.ts` (Sperre der Verfügbarkeit)
- `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`, `src/app/(site)/artikel/[slug]/page.tsx` (nur Anzeige und Sperre der Verfügbarkeit)
- Tests: `src/lib/data/payload-mapping.test.ts`, `src/lib/actions/security.test.ts`; in `src/lib/data/payload.db.test.ts`, `vorgaenge.db.test.ts`, `admin-alltag.db.test.ts`, `src/payload/seed.db.test.ts` je eine Zeile `system: 'Testsystem'` an den Testprodukten (System ist jetzt Pflicht beim Veröffentlichen)

Nicht angefasst: `content/code-lines.json`, Preise, `content/rubriken.json`, Navigation, Startseite, Zylinderkatalog, Rechtstexte, `src/components/**`, Warenkorb.

## WAS UND WARUM

1. **Shop-Kategorien als Daten** (FA-22-04, FA-22-05). Sammlung `kategorien` mit Name, Adresse (eindeutig; leer gelassen wird sie aus dem Namen gebildet), Kennung (fest), Beschreibung, übergeordnete Kategorie (Relation auf sich selbst, beliebig tief), Reihenfolge, Bild, SEO-Feldern, „Im Shop zeigen“, Art (`codeprodukte`, `artikel`, `konfigurator`, `anfrage`), Ziel (Adresse dieser Seite, optional mit `?thema=…`) und Hinweis für Kategorien ohne Produkte. Kreise werden beim Speichern abgelehnt (auch über mehrere Ebenen). Ändert der Betreiber die Adresse, legt ein Hook die alte unter „Frühere Adressen“ ab; `kategorieAufloesen()` liefert für eine frühere Adresse die Weiterleitung. Papierkorb, Versionen, Team darf pflegen, endgültig löschen nur Inhaber (wie Rubriken). Duplizieren ist bei Kategorien und Herstellern abgeschaltet, weil eindeutige Name/Adresse sonst ungültige Kopien ergäben.
2. **Startbestand** (Abschnitt 10 des Inhabers, seine Reihenfolge 10 bis 90): Schlüssel nach Code → `/schluessel-nach-code` (Produktliste); Schlüssel nach Vorlage → `/schluessel-nach-vorlage` (Anfrage); Autoschlüssel als Produkte → allgemeine Anfrage mit Thema Autoschlüssel und Anliegen Frage, getrennt vom Terminbereich; Autoschlüsselgehäuse → `/autoschluessel/gehaeuse`; Gehäuseumbau und Reparaturservice → `/autoschluessel/gehaeuse/anfrage`; Customizing und Modifikation → `/service-und-termin/anfrage`; Gleichschließende Zylinder und Sperrschließungen → `/gleichschliessende-zylinder/konfigurator`; Schließtechnik und Zubehör → `/artikel`; Weitere Sicherheitstechnik angelegt, `sichtbar: false`. Die vier ohne Produkte tragen „Produkte folgen; bis dahin Anfrage“. Ein Test prüft, dass jedes Ziel eine Seite der Anwendung ist.
3. **Hersteller-Stammliste** (FA-11-05 bis 11-07). Sammlung `hersteller`: Name (eindeutig, Schreibweise des Herstellers), Adresse, Kennung, „Wofür die Systeme eingesetzt werden“, „angeboten“, Logo-Gruppe mit „Freigabe liegt vor“ und Notiz, Reihenfolge. Ohne Freigabe-Haken gibt die Datenschicht kein Logo heraus (R12, Test). Startbestand leer: Der Bestand belegt keinen Hersteller (52 von 52 Codelinien mit Platzhalter, Zylinderkatalog und Artikel ohne Hersteller); nichts erfunden (R4).
4. **Produkte, additive Felder**: `herstellerAuswahl` (Relation auf die Stammliste) ersetzt im Admin den Freitext; `hersteller` (Freitext) bleibt in der Datenbank, im Admin nur lesbar und nur sichtbar, wenn gefüllt, und gilt als Rückfall, solange keine Auswahl gesetzt ist. Neu `system` (Pflicht beim Veröffentlichen echter Codeprodukte; Entwürfe und Beispiele ausgenommen), `codebereich`, `kategorie` (Relation), `verfuegbarkeit` (`lieferbar`, `auf-anfrage`, `nicht-lieferbar`, Vorgabe lieferbar, nicht löschbar in der Auswahl; leer gilt als lieferbar). `lieferzeit` gilt jetzt für alle Artikelarten (Feld gab es schon). Vorhandenes (Beispielcode, Codeformat, Prüfmuster, Codehinweis, Preis, Staffel, Höchstmenge, Hinweise, Bilder) unverändert.
5. **Admin ohne Entwickler** (FA-22-01 bis 22-10): Liste mit Spalten Name, Hersteller, System, Preis, Verfügbarkeit, Kategorie, Stand; Suche auch nach System; Vorschau-Knopf (`admin.preview`) auf die öffentliche Seite; Hilfetexte in Alltagssprache. Duplizieren: neue Adresse `…-kopie-…`, neue Kennung, Entwurf, Relationen und neue Felder bleiben (DB-Test). Löschen: Papierkorb wie bisher.
6. **Verfügbarkeit wirkt** (Schritt 3 und 4): `submitOrder` lehnt Positionen ab, die nicht lieferbar oder nur auf Anfrage sind, für Codelinien und Artikel, mit klarer Meldung (auch wenn sie schon im Warenkorb lagen). Detailseiten: Bei „auf Anfrage“ und „nicht lieferbar“ ersetzt `VerfuegbarkeitHinweis` den Kaufbereich. „Auf Anfrage“ führt bei Codelinien in „Code anfragen“ mit vorbelegtem Schloss, bei Artikeln in die allgemeine Anfrage; „nicht lieferbar“ sagt es ruhig und verweist auf die Übersicht. Strukturdaten (Product/Offer) nur bei lieferbaren Produkten (R8), damit kein Angebot behauptet wird, das nicht bestellbar ist.
7. **JSON-Rückfall und Seed** (G6): Ohne Datenbank lesen `getKategorien()`, `getShopKategorien()`, `getKategorie()`, `getHersteller()` aus `content/kategorien.json` bzw. `content/hersteller.json`, fehlt die Datei, aus den Defaults; mit leerer Datenbank ebenso. Seed legt Kategorien und Hersteller vor den Artikeln an (Schlüssel = Kennung, Gelöschtes kommt nicht wieder, Startwert-Abgleich für Name, Beschreibung, Hinweis, Ziel, Reihenfolge, SEO bzw. „einsatz“) und reicht die IDs an `codeLineZuPayload`/`standardartikelZuPayload` weiter. Migration rein additiv: zwei neue Tabellengruppen, fünf neue Spalten an `produkte` und `_produkte_v`, Verfügbarkeit mit `DEFAULT 'lieferbar'`, keine Änderung an Bestandsdaten.
8. **Betreiberanleitung** `docs/betrieb/shop-pflegen.md`: neues Codeprodukt, neue Kategorie oder Unterkategorie, Hersteller, Preis ändern, Bild tauschen, nicht lieferbar, Vorschau.

Laufzeitbibliothek: keine neue (G7).

## FÜR FA-SHOP-01B

Datenschicht (`src/lib/data/index.ts`, server-only):
- `getKategorien(): Promise<ShopKategorie[]>` alle, sortiert, auch verborgene.
- `getShopKategorien(): Promise<ShopKategorie[]>` nur sichtbare (Haken bei der Kategorie und allen übergeordneten).
- `getKategorie(slug): Promise<KategorieTreffer | null>` mit `{ kategorie }` oder `{ weiterleitung }` (frühere Adresse; Seite ruft `permanentRedirect` mit der neuen Adresse).
- `getHersteller(): Promise<ShopHersteller[]>` sortiert.
- Codelinien und Artikel weiter über `getCodeLines()` / `getCollection('standardArticles')`.

Reine Funktionen (`src/lib/data/shop.ts`, auch im Browser): `verfuegbarkeitVon`, `istBestellbar`, `VERFUEGBARKEITEN`, `VERFUEGBARKEIT_LABEL` (auch über `@/lib/codelinie` re-exportiert), `kategorienSortiert`, `kategorieKette` (Brotkrumen), `kategorieSichtbar`, `sichtbareKategorien`, `hauptkategorien`, `unterkategorien`, `kategorieAufloesen`, `fruehereAdressenNachAenderung`, `herstellerSortiert`, `angeboteneHersteller`, `produkteDesHerstellers` (FA-11-06: nur zugeordnete Produkte; Freitext nur bei exakt gleichem Namen), `produkteDerKategorie`.

Typen (`src/lib/types.ts`): `Verfuegbarkeit`, `KategorieArt`, `ShopKategorie` (`id`, `slug`, `name`, `beschreibung`, `eltern?`, `reihenfolge`, `art`, `ziel`, `hinweis?`, `sichtbar`, `bild?`, `seo?`, `fruehereAdressen`), `ShopHersteller` (`id`, `slug`, `name`, `einsatz`, `angeboten`, `reihenfolge`, `logo?` nur mit Freigabe). `CodeLine` neu: `system?`, `codeRange?`, `deliveryTime?`, `availability?`, `categoryId?`, `manufacturerId?`. `StandardArticle` neu: `availability?`, `categoryId?`, `manufacturerId?`. Fehlendes `availability` heißt lieferbar.

Import (`src/lib/data/payload-mapping.ts`): `codeLineZuPayload(line, { kategorien, hersteller })` und `standardartikelZuPayload(article, verweise)` nehmen Kennung→ID-Karten (`ProduktVerweise`); `kategorieZuPayload(k, ids)`, `herstellerZuPayload(h)`; Rückrichtung `kategorieZuSeite`, `herstellerZuSeite`. Im Seed: `produktVerweise` in `src/payload/seed.ts`. Für echte Codeprodukte ist `system` beim Veröffentlichen Pflicht; Import ohne System nur als Entwurf.

Payload-Felder (`src/payload/collections/Produkte.ts`): `herstellerAuswahl`, `hersteller` (Freitext, nur Rückfall), `system`, `codebereich`, `lieferzeit`, `verfuegbarkeit`, `kategorie`, `produktbild`, `weitereBilder`. Kategorien: `src/payload/collections/Kategorien.ts` (`eltern`, `art`, `ziel`, `hinweis`, `imShop`, `fruehereAdressen`, `bild`, `seo`). Hersteller: `src/payload/collections/Hersteller.ts` (`logo.bild`, `logo.freigabe`).

Noch offen für die Seiten:
- Kategorie- und Herstellerseiten auf die neuen Daten umstellen (heute Schlagwort-Familien und Freitext in `src/lib/codelinie.ts` `codeFamilien`/`codeHersteller`), Unterkategorien unter `/schluessel-nach-code/kategorie/…`, Weiterleitung früherer Adressen.
- System, Codebereich und Lieferzeit auf der Codeseite zeigen; Produktbild und Galerie (FA-11-11, FA-22-07).
- Verfügbarkeit in Listen (`linien-liste.tsx`, `shop-liste.tsx`, `/artikel`) und im Warenkorb (`src/app/(site)/warenkorb/warenkorb-ansicht.tsx` markiert heute nur Beispiele) anzeigen.
- Strukturdaten: `productSchema` in `src/components/seo/json-ld.tsx` kennt nur `active`; für „auf Anfrage“ wäre `https://schema.org/MadeToOrder` oder kein Angebot zu entscheiden. Heute gibt die Codeseite bei nicht lieferbar gar kein Product aus.
- Vorschau von Entwürfen (Next `draftMode`) gibt es nicht; der Knopf zeigt die veröffentlichte Fassung.

Gewünschte Einträge für Navigation und Startseite (nicht umgesetzt, nicht meine Dateien):
- Navigation „Shop“ mit den acht sichtbaren Hauptkategorien aus `getShopKategorien()` in deren Reihenfolge, Ziel je `ziel`.
- Startseite, Abschnitt „Bestellen ohne Termin“: Kacheln aus `getShopKategorien()` statt fester Liste; Kategorien mit `hinweis` zeigen ihn.
- Fuß: Verweis „Shop-Kategorien“ auf eine spätere Übersichtsseite.

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche.
- `sicher.sh --json -- npx vitest run`: 209 Dateien, 3169 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 22 Dateien, 126 Tests, alle grün (neu: `shop-grundlage.db.test.ts` mit 8 Tests).
- `sicher.sh --json -- npm run build`: grün, 177 statische Seiten. Dieses Paket fügt keine Seiten hinzu; die Zahl folgt dem gemeinsamen Arbeitsbaum.

## BELEGE

- Startbestand und JSON-Gleichheit: `src/lib/data/shop.test.ts` › „Startbestand (FA-SHOP-01)“ (neun Namen in Reihenfolge, Ziele existieren als Seiten, `content/kategorien.json` = Defaults, Hersteller leer).
- Seed legt die neun an, legt nichts doppelt an, belebt Gelöschtes nicht: `src/payload/shop-grundlage.db.test.ts` › „Shop-Kategorien“.
- Umbenennen mit Weiterleitung, Kennung bleibt: ebenda › „behält beim Umbenennen …“; Hook-Logik: `shop-sammlungen.test.ts`.
- Unterkategorie, Kreis abgelehnt: ebenda › „legt eine Unterkategorie an und verhindert Kreise“.
- Hersteller eindeutig, Logo nur mit Freigabe: `shop-grundlage.db.test.ts` › „Hersteller-Stammliste“, `payload-mapping.test.ts` › „Hersteller: Logo nur mit Freigabe (R12)“.
- System Pflicht beim Veröffentlichen, nicht im Entwurf: `shop-grundlage.db.test.ts` › „verlangt das System …“.
- Duplizieren mit neuer Kennung und Adresse, neue Felder und Relationen bleiben: ebenda › „… dupliziert sie mit neuer Kennung“ (zusätzlich bestehender Test in `admin-alltag.db.test.ts`).
- Serversperre: `src/lib/actions/security.test.ts` › „sperrt die Codelinie test-auf-anfrage/test-nicht-lieferbar …“, „sperrt einen nicht lieferbaren Artikel …“.
- Verlustfreies Mapping mit den neuen Feldern: `payload-mapping.test.ts` › „Shop-Grundlage (FA-SHOP-01)“.

## OFFENE FRAGEN

1. Ziele der Kategorien ohne Produkte sind meine Wahl aus den vorhandenen Wegen: Autoschlüssel als Produkte → allgemeine Anfrage (Thema Autoschlüssel, Anliegen Frage), Customizing → allgemeine Anfrage ohne Thema, Autoschlüsselgehäuse → Gehäuseseite, Gehäuseumbau → Gehäuse-Anfrage. Passt das, oder soll es eigene Anfragethemen geben?
2. Gleichschließende Zylinder: Ziel ist der Konfigurator (wie im Paket), nicht die Erklärseite `/gleichschliessende-zylinder`. Richtig so?
3. „Auf Anfrage“ bei Standardartikeln führt in die allgemeine Anfrage („Artikel anfragen“), nicht in „Code anfragen“, weil dort kein Code abgefragt wird. Einverstanden?
4. System ist Pflicht beim Veröffentlichen eines echten Codeprodukts. Ein bestehendes echtes Codeprodukt ohne System (gibt es nach A-046 nicht, die Musterlinien sind Beispiele) müsste beim nächsten Veröffentlichen das System bekommen.
5. Bedeutung von „System“ und „Codebereich“ (FA-11-08, FA-11-09) ist nicht festgelegt. Umgesetzt als freie Texte in der Schreibweise des Herstellers.
6. Unterkategorien im Seed: Die übergeordnete Kategorie wird nur verknüpft, wenn sie vor dem Lauf schon in der Datenbank steht. Der Startbestand hat nur Hauptkategorien; künftige Unterkategorien in `content/kategorien.json` brauchen einen zweiten Seed-Lauf.
7. Kategorie- und Herstellerseiten nutzen die neuen Daten noch nicht (FA-SHOP-01B). Bis dahin sind die Sammlungen gepflegt, aber nur über die Detailseiten (Verfügbarkeit) sichtbar wirksam.

## FÜR MENSCHEN

- Hersteller-Liste mit Schreibweise und kurzem Einsatztext liefern (FA-11-07), welche davon wir anbieten; Logos nur mit schriftlicher Freigabe.
- Ziele und Hinweistexte der Kategorien ohne Produkte bestätigen (Offene Fragen 1 bis 3).
- Festlegen, was „System“ und „Codebereich“ je Hersteller heißen (FA-11-08, FA-11-09).
- Lieferzeiten je Artikelart festlegen (FA-22-09) und ob ein Lagerbestand geführt werden soll (FA-22-10).
- Probe im Backend mit erfundenen Testdaten (G4) nach `docs/betrieb/shop-pflegen.md`: Codeprodukt anlegen, duplizieren, auf „nicht lieferbar“ setzen, Kategorie umbenennen.

=== ENDE FA-SHOP-01 · BEREIT ZUR RÜCKGABE ===
