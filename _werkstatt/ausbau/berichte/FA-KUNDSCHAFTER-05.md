# FA-KUNDSCHAFTER-05: Online-Shop und Schlüssel nach Code

Abgleich der Abschnitte 10 (Online-Shop und Bestellen ohne Termin) und 11 (Schlüssel nach Code komplett neu aufbauen) der Finalen Arbeitsanweisung vom 11.11.2026 mit dem Bestand. Abschnitte 01 und 29 dienten als Maßstab (echte End-to-End-Funktion, keine Platzhalter, vom Betreiber ohne Entwickler pflegbar).

Quelle: `_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Zeilen 271 bis 301 (Abschnitte 10 und 11), Zeilen 38 bis 56 (Abschnitt 01), Zeilen 684 bis 699 (Abschnitt 29).

Grenzen dieser Prüfung: nur Lesen, keine Projektbefehle, keine Tests, keine Netzabrufe. Die Datei `.env` wurde nicht gelesen. Gelesen wurden die Seiten unter `src/app/(site)/schluessel-nach-code`, `src/app/(site)/warenkorb`, `src/app/(site)/kasse`, `src/app/(site)/autoschluessel`, `src/app/(site)/schluessel-einschicken`, `src/app/(site)/gleichschliessende-zylinder`, `src/app/(site)/artikel`, `src/lib/store`, `src/lib/codelinie*.ts`, `src/lib/actions/orders.ts`, `src/lib/data/*`, `src/payload/collections/Produkte.ts`, `src/payload/seed.ts`, `src/payload/hooks/revalidate.ts`, `src/components/seo/json-ld.tsx`, `content/code-lines.json`, `content/rubriken.json`, `content/pricing-groups.json`, `content/startwerte/2026-10-25/*`, `_werkstatt/ausbau/erhebung/boegen/sortiment.csv` und die Erhebungsnotizen.

## 1. Übersicht

| Urteil | Anzahl | Anforderungen |
|---|---|---|
| erfuellt | 10 | FA-10-03, FA-10-04, FA-10-09, FA-11-04, FA-11-10, FA-11-12, FA-11-13, FA-11-14, FA-11-15, FA-11-16 |
| teilweise | 10 | FA-10-01, FA-10-06, FA-10-12, FA-11-01, FA-11-05, FA-11-07, FA-11-08, FA-11-09, FA-11-17, FA-11-19 |
| fehlt | 9 | FA-10-05, FA-10-07, FA-10-08, FA-10-10, FA-10-11, FA-11-03, FA-11-06, FA-11-11, FA-11-18 |
| widerspricht | 2 | FA-10-02, FA-11-02 |

Kernbefund: Die Bausteine des Code-Shops (Suche, Kategorien, Bestellformular mit Musterprüfung, Staffelpreise, Warenkorb, Kasse, serverseitige Prüfung, Admin-Sammlung `produkte`) sind vorhanden und zusammenhängend verdrahtet. Der Inhalt ist jedoch Demo-Bestand: Alle 52 Codelinien stammen aus einem Generator (`src/lib/data/defaults/code-lines.ts`), tragen als Hersteller überall den Platzhalter „[Hersteller eintragen]“ und erfundene Codes. Die Anweisung verlangt deren Entfernung; das ist bisher nicht geschehen. Außerdem fehlt jede reale Datenquelle im Repository (keine Angebotsliste, keine Hersteller, keine Produktfotos, keine bestätigte Sortimentsliste).

## 2. Tabelle aller Anforderungen

| ID | Anforderung (knapp) | Urteil | Aufwand | Lücke in einem Satz |
|---|---|---|---|---|
| FA-10-01 | Shop wird ein echter Fach-Onlineshop | teilweise | M | Bestellweg steht, aber nur zwei Artikelarten, Standardartikel sind nur Beispiele. |
| FA-10-02 | Demo-Produkte und künstliche Beispiele bleiben nicht live | widerspricht | M | 52 Demo-Codelinien sind aktiv, 8 Beispielartikel sind unter /artikel erreichbar. |
| FA-10-03 | Hauptkategorie Schlüssel nach Code | erfuellt | - | Seite, Suche, Filter, Kategorie- und Herstellerseiten vorhanden; Inhalt siehe FA-11. |
| FA-10-04 | Hauptkategorie Schlüssel nach Vorlage | erfuellt | - | Foto-Anfrage mit Formular und Zahlungsweg vorhanden; Preisfreigabe liegt beim Inhaber. |
| FA-10-05 | Hauptkategorie Autoschlüssel als Produkte | fehlt | L | Kein Produkttyp und kein Warenkorbweg für Autoschlüssel; Autoschlüssel laufen nur über Termin. |
| FA-10-06 | Hauptkategorie Autoschlüsselgehäuse | teilweise | M | Rubrik und Anfrageformular vorhanden, aber kein buchbares Produkt im Warenkorb. |
| FA-10-07 | Hauptkategorie Gehäuseumbau und Reparaturservice | fehlt | M | Nur Informationsseiten und Termin; keine Shop-Kategorie, kein Produkt, keine Einsendung im Warenkorb. |
| FA-10-08 | Hauptkategorie Customizing und Modifikation | fehlt | M | Kein Route, kein Text, kein Produkt im Bestand. |
| FA-10-09 | Hauptkategorie Gleichschließende Zylinder und Sperrschließungen | erfuellt | - | Seiten, Konfigurator und Warenkorbart „zylinder-schliessung“ vorhanden; Katalogdaten nicht geprüft. |
| FA-10-10 | Hauptkategorie Schließtechnik und Zubehör | fehlt | M | Keine Kategorie; Zubehör nur als Beispielartikel mit Versandklasse „zubehoer“. |
| FA-10-11 | Später weitere Sicherheitstechnik-Produkte | fehlt | - | Kein Bauauftrag jetzt; Informationsseiten unter /sicherheitstechnik vorhanden. |
| FA-10-12 | Terminbereich getrennt; Einsendeservice im Shop buchbar | teilweise | M | Trennung erfüllt; der Einsendeservice ist eine Anmeldung mit Begleitschein, kein Warenkorbartikel. |
| FA-11-01 | Schlüssel nach Code komplett neu aufbauen | teilweise | M | Struktur ist neu, der Datenbestand ist aber der alte Demo-Satz. |
| FA-11-02 | Beispielprodukte (Büroschrank, Rollcontainer, erfundene Codes) entfernen | widerspricht | S | Alle 52 Linien einschließlich „Büroschrank und Rollcontainer“ und Codes wie „0812“ sind in Datei und Seed vorhanden. |
| FA-11-03 | Etwa 50 bis 52 reale Angebote übernehmen | fehlt | M | 52 Zeilen da, aber keine realen Daten; Sortimentsbogen unbeantwortet (0 von 52). |
| FA-11-04 | Laufend erweiterbar | erfuellt | - | Anlage über die Admin-Sammlung „produkte“ mit Veröffentlichung und Revalidierung. |
| FA-11-05 | Produkte nach Hersteller und System gruppieren | teilweise | S | Gruppiert wird nach Anwendungsfamilie; Herstellergruppen sind leer, System gar nicht. |
| FA-11-06 | Unter BKS nur tatsächlich angebotene BKS-Codeprodukte | fehlt | S | Kein BKS-Produkt im Bestand; alle 52 Hersteller sind Platzhalter. |
| FA-11-07 | Jedes Produkt mit Hersteller | teilweise | S | Feld vorhanden und angezeigt, Freitext ohne Stammliste, Daten fehlen (52 von 52 Platzhalter). |
| FA-11-08 | Jedes Produkt mit System | teilweise | S | Nur optionale Felder „Profil“ und „Codeserie“ auf der Detailseite; kein Feld „System“. |
| FA-11-09 | Jedes Produkt mit Codebereich | teilweise | S | Codeformat und Prüfmuster vorhanden; kein Feld für einen Nummernbereich. |
| FA-11-10 | Jedes Produkt mit Beispielcode | erfuellt | - | Feld, Validierung, Anzeige vorhanden; die 52 Beispielcodes sind erfunden. |
| FA-11-11 | Jedes Produkt mit Bild | fehlt | S | Produktbild wird nirgends angezeigt; nur generierte Zeichnungen. |
| FA-11-12 | Jedes Produkt mit Preis | erfuellt | - | Preis und Staffel vorhanden und angezeigt; Höhe ist Inhaberentscheidung. |
| FA-11-13 | Jedes Produkt mit Stückzahl | erfuellt | - | Höchstmenge je Linie, im Formular und serverseitig geprüft; alle Linien stehen auf 20. |
| FA-11-14 | Jedes Produkt mit Codefeld | erfuellt | - | Eingabefeld mit Musterprüfung im Browser und auf dem Server. |
| FA-11-15 | Jedes Produkt mit Hinweisen | erfuellt | - | Hinweis zur Fundstelle, Formathinweis und Foto-Hinweis vorhanden; Texte sind Muster. |
| FA-11-16 | Jedes Produkt mit Warenkorb | erfuellt | - | „In den Warenkorb“ mit Serverprüfung bei der Bestellung. |
| FA-11-17 | Anfrageoption bei nicht eindeutigem Code | teilweise | S | Verweis auf Schlüssel nach Vorlage (Foto), aber keine Code-Anfrage im Bestellformular. |
| FA-11-18 | Eigene Ebay-Angebote als reale Datenquelle | fehlt | S | Keine Angebotsdaten im Repository; Fakten dürfen übernommen, Texte nicht kopiert werden (R11). |
| FA-11-19 | Neue Codeprodukte ohne Entwickler im Admin anlegen | teilweise | S | Anlage und Anzeige funktionieren mit Datenbank; Seed legt Demo-Daten neu an, Bilder fehlen. |

## 3. Einzelheiten mit Fundstellen

### Abschnitt 10

**FA-10-01 (teilweise).** Bestand: Der Bestellweg ist durchgehend vorhanden: Warenkorb `src/lib/store/cart.ts:47-72` (Art `code-schluessel`), Kasse `src/app/(site)/kasse/kasse-formular.tsx:145-200`, Serverbestellung `src/lib/actions/orders.ts:196-240`, Artikelsammlung `src/payload/collections/Produkte.ts:55-64` mit genau zwei Arten („Schlüssel nach Code“ und „Standardartikel“). Lücke: Standardartikel existieren im Bestand nur als Beispiele (siehe FA-10-02), Autoschlüssel und Zubehör sind nicht angelegt. Bauen: Kategorienfeld oder weitere Artikelarten in `Produkte.ts` ergänzen, Listenseiten je Kategorie. Aufwand M. Mensch: Sortiment, Preise, Freigabe.

**FA-10-02 (widerspricht).** Bestand: `content/code-lines.json` enthält 52 aktive Linien (alle `"active": true`), darunter „Büroschrank und Rollcontainer, Serie MS-01“ (`content/code-lines.json:5`) mit Beispielcode „0812“ (`:12`). Außerdem sind acht Beispielartikel aktiv: `src/lib/data/defaults/standard-articles.ts:130-152` (Generator, `example: true`, `noindex: true`), u. a. „Schlüsselkasten für 20 Schlüssel“ zu 40,00 Euro (`:26`, Preis `:32`). Die Seite `/artikel` zeigt sie mit dem Hinweis „Derzeit nur Beispielartikel“ (`src/app/(site)/artikel/page.tsx:85-86`, `:116-120`). Die Seite ist nicht im Hauptmenü (`src/lib/navigation.ts`) und im Footer ausgeblendet (`src/components/layout/site-footer.tsx:14`), aber unter der URL erreichbar. Bauen: Demo-Linien und Beispielartikel aus Inhalt, Seed-Startwerten (`content/startwerte/2026-10-25/code-lines.json`, `standard-articles.json`) und den Generatoren `src/lib/data/defaults/code-lines.ts` und `standard-articles.ts` entfernen; `/artikel` bis zum ersten echten Artikel nicht ausliefern. Aufwand M. Mensch: Freigabe zum Löschen der Einträge in der Live-Datenbank; reale Ersatzdaten.

**FA-10-03 (erfuellt).** Fundstellen: `src/app/(site)/schluessel-nach-code/page.tsx:84-160` (Kopf, Hauptaktion „Nach Code bestellen“), `:160-174` (Suche und Liste), `:176-232` (Kategorien, Hersteller), `src/lib/navigation.ts:99-118` (Hauptnavigation). Inhalt ist Demo, siehe FA-11.

**FA-10-04 (erfuellt).** Fundstellen: `src/lib/navigation.ts:75-94`, Formular `src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`, Zahlungsansicht `src/lib/zahlung/ansicht.ts:5`. Der Weg ist eine Foto-Anfrage, kein Warenkorbartikel; das entspricht der Beschreibung „Schlüssel nach Vorlage“. Der Preis ist nicht geprüft (Inhaberfreigabe, G9).

**FA-10-05 (fehlt).** Bestand: Produktarten nur `code_key` und `standard` (`src/payload/collections/Produkte.ts:60-63`). Autoschlüssel sind rein terminbezogen: `src/app/(site)/autoschluessel/page.tsx:321-328`, `:370-375` („Termin anfragen“). Das Gehäuse läuft über Anfrage: `src/app/(site)/autoschluessel/gehaeuse/page.tsx:12`. Bauen: neue Artikelart oder Kategorie „Autoschlüssel“ mit Fahrzeugbezug, Preisrahmen, Bestellweg und Versandklasse; Terminentkopplung beibehalten. Aufwand L. Mensch: Sortiment, Preise, Lieferbedingungen, Rechtstexte (R10).

**FA-10-06 (teilweise).** Bestand: Rubrik „Autoschlüsselgehäuse“ mit dem Satz „Nach Ihrer Anfrage nennen wir Ihnen den Preis“ (`src/lib/data/defaults/rubriken.ts:96-99`, `content/rubriken.json`), Anfrageseite `src/app/(site)/autoschluessel/gehaeuse/page.tsx:12`, `:55-56`, `:67-68`. Lücke: kein Produkt mit Preis im Warenkorb. Bauen: Gehäusetypen als Artikel mit Preis oder Preisrahmen, Anfrage bleibt als Weg für Sonderfälle. Aufwand M. Mensch: Gehäusepreise, Fahrzeugliste.

**FA-10-07 (fehlt).** Bestand: `src/lib/navigation.ts:213` verweist auf „Reparatur und Austausch“ in Tür- und Schließtechnik (Infoseite), `src/app/(site)/autoschluessel/page.tsx:155-157` auf „Reparatur und Sonderfälle“ (Termin). Keine Shop-Kategorie. Bauen: Kategorie „Gehäuseumbau und Reparatur“ mit Einsendung oder Anfrage im Warenkorb. Aufwand M. Mensch: Leistungen und Preise.

**FA-10-08 (fehlt).** Suche in `src/app` und `src/lib` nach „Customiz“, „Individuali“, „Modifikation“ ohne Treffer. Nur allgemeine Umbau-Hinweise (`src/components/schliessanlagen/system-erklaerung.tsx:195`). Bauen: Kategorie mit Anfrageformular oder Artikeln, nach Inhaberangaben. Aufwand M. Mensch: Was angeboten wird, zu welchen Preisen.

**FA-10-09 (erfuellt).** Fundstellen: `src/app/(site)/gleichschliessende-zylinder/page.tsx`, `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`, Warenkorbart `src/lib/store/cart.ts:83` („zylinder-schliessung“), Navigation `src/lib/navigation.ts:122-145` und Sperrschließung `:329`. Nicht geprüft: `content/cylinder-catalog.json` (Katalogdaten, Preise). Offene Frage dazu im Abschnitt 4.

**FA-10-10 (fehlt).** Bestand: Zubehörartikel nur als Beispiele mit Versandklasse „zubehoer“ (`src/lib/data/defaults/standard-articles.ts:33`, `:46`, `:85`, `:98`, `:111`, `:124`). Keine Kategorie, keine Seite. Bauen: Kategorie „Schließtechnik und Zubehör“ als Artikelgruppe in der Artikelsammlung, Liste, Detailseite. Aufwand M. Mensch: Sortiment, Preise, Fotos.

**FA-10-11 (fehlt, später).** Bestand: Informationsseiten `src/app/(site)/sicherheitstechnik/page.tsx`. Kein Bauauftrag jetzt. Hinweis: Die Struktur aus FA-10-10 kann wiederverwendet werden. Aufwand „-“.

**FA-10-12 (teilweise).** Trennung erfüllt: Termin über `src/app/(site)/autoschluessel/page.tsx:321-328`, Gehäuse über Anfrage `gehaeuse/page.tsx:12`. Einsendeservice: `src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx:454` („Mit dem Absenden melden Sie Ihre Einsendung an“), kein Bezug zu Warenkorb oder Kasse (`src/app/(site)/schluessel-einschicken/**` enthält keinen Warenkorbaufruf). Die Anweisung verlangt, dass der Kunde ein Produkt oder einen Einsendeservice direkt im Shop buchen kann. Bauen: Einsendung als Warenkorbposition mit Versandklasse, oder bewusste Entscheidung für Anmeldung. Aufwand M. Mensch: Entscheidung, Einsendepreise. Hinweis aus Anhang B: Einschreiben Einwurf haftet nur bis 20 Euro, DHL Paket national bis 500 Euro; das darf nicht als voll versichert dargestellt werden.

### Abschnitt 11

**FA-11-01 (teilweise).** Die Struktur ist neu: Bestellformular, Filter und Kategorien (`src/app/(site)/schluessel-nach-code/shop-liste.tsx`, `[slug]/bestell-formular.tsx`). Der Datenbestand ist der alte Demo-Satz (`content/code-lines.json`, 52 Einträge). Aufwand M (Daten neu aufnehmen, siehe FA-11-03).

**FA-11-02 (widerspricht).** Fundstellen: `content/code-lines.json:5` (Büroschrank), `:12` (Code „0812“), 52 Blöcke insgesamt; `src/lib/data/defaults/code-lines.ts:162` (Namensgenerator „[Anwendung] Serie XX-NN“), `:236` (Platzhalter für den Hersteller), `:1-12` (Kopfkommentar „52 Codelinien als vollständig pflegbare Produkte“); `src/payload/seed.ts:469-486` (übernimmt `content/code-lines.json` in die Datenbank); `src/lib/data/payload-adapter.ts:84-92`. Die Seed-Logik legt gelöschte Einträge nicht neu an (`src/payload/seed.ts:298-305`, `bekannteSchluessel` `:217-231`), aber auf einer leeren Datenbank werden die Demo-Linien angelegt. Bauen: Inhaltsdatei und Startwert leeren oder ersetzen, Generator entfernen, Seed-Abgleich prüfen. Aufwand S. Mensch: Freigabe für das Löschen in der Datenbank.

**FA-11-03 (fehlt).** Bestand: 52 Zeilen, aber keine realen Angaben. Hersteller 52 von 52 Platzhalter (`content/code-lines.json`, Feld `manufacturer`). Der Sortimentsbogen `_werkstatt/ausbau/erhebung/boegen/sortiment.csv` enthält 52 Zeilen mit dem Vorschlag „im Sortiment ja. Foto nein (nur Platzhalter im Bestand)“, Quelle `erhebung/E1-interview.md`, I-CODE-01 und I-CODE-09. Die Spalte „Antwort“ ist bei allen 52 Zeilen leer. Die Interviewfrage I-CODE-01 (`erhebung/E1-interview.md:117`) notiert „Hersteller bisher leer“. Der Vorschlag „im Sortiment ja“ für Büroschrank und Rollcontainer widerspricht Abschnitt 10 der Anweisung, wonach diese Beispiele nicht dem realen Angebot entsprechen. Bauen: nach Antwort des Betriebs Datensätze neu anlegen (im Admin, nicht im Code). Aufwand M. Mensch: die realen Codelinien, Hersteller, Codebereiche, Beispielcodes, Preise, Lieferzeit (I-CODE-03, I-CODE-06 unbeantwortet), Fotos.

**FA-11-04 (erfuellt).** Mechanismus: Admin-Sammlung `src/payload/collections/Produkte.ts:43-49` (Anlage für Team), Art „Schlüssel nach Code“ (`:55-64`), Entwürfe, Terminierung und Papierkorb (`:50-51`), Shop liest nur veröffentlichte Codeprodukte (`src/lib/data/payload-adapter.ts:84-92`, `src/lib/data/payload-mapping.ts:263` `active`), Revalidierung nach Änderung (`src/payload/hooks/revalidate.ts:41-44`). Aufwand „-“.

**FA-11-05 (teilweise).** Gruppiert wird nach Anwendungsfamilie: `src/lib/codelinie.ts:81-100` (`codeFamilien`), `src/app/(site)/schluessel-nach-code/shop-liste.tsx:78-105` (`gruppenVon`). Hersteller: `src/lib/codelinie.ts:108-125` (`codeHersteller`, nur gepflegte Werte), `src/app/(site)/schluessel-nach-code/page.tsx:96` und `:222-232` (Abschnitt „Nach Hersteller“ ist ohne gepflegte Werte leer), `src/app/(site)/schluessel-nach-code/hersteller/[hersteller]/page.tsx:27-28` (keine Seiten). System wird nicht gruppiert. Bauen: Ebene „Hersteller“ über die Familien setzen, sobald Daten vorliegen. Aufwand S.

**FA-11-06 (fehlt).** Kein BKS-Produkt im Bestand; alle Hersteller sind Platzhalter (`content/code-lines.json`, 52 Treffer). Die Gruppierung ist vorbereitet, zeigt aber nichts. Bauen: nach Datenerfassung automatisch; zusätzlich Stammliste der Herstellernamen, damit „BKS“ und „bks“ nicht getrennt werden (`codelinie.ts:108-125`, `slugify`). Aufwand S. Mensch: BKS-Codelinien. Herstellermarken nur sachlich (R12).

**FA-11-07 (teilweise), Hersteller je Produkt.** Feld: `src/payload/collections/Produkte.ts:96` (Freitext), Mapping `src/lib/data/payload-mapping.ts:248`. Anzeige nur bei gepflegtem Wert: `src/app/(site)/schluessel-nach-code/[slug]/page.tsx:112-117`, Strukturdaten ohne Marke bei Platzhalter `src/components/seo/json-ld.tsx:173-175`. Lücke: Freitext ohne Auswahl, Tippfehler erzeugen eigene Herstellerseiten; Daten fehlen. Aufwand S. Mensch: Hersteller je Linie.

**FA-11-08 (teilweise), System.** Vorhanden sind nur die optionalen Felder „Profil“ (`Produkte.ts:104`) und „Codeserie“ (`:105`), angezeigt auf der Detailseite (`[slug]/page.tsx:118-119`) und in keiner Liste. Ein Feld „System“ gibt es nicht. Offene Frage: Was ist „System“ (Schließsystem, Profil oder Codeserie)? Aufwand S.

**FA-11-09 (teilweise), Codebereich.** Vorhanden: „Aufbau des Codes“ (`Produkte.ts:179`), Prüfmuster (`:184-188`), Beispielcode (`:192`), Anzeige `[slug]/page.tsx:124`, `shop-liste.tsx` (Codeformat je Zeile). Ein Feld für einen Nummernbereich (von bis) fehlt. Offene Frage: Meint „Codebereich“ einen Nummernbereich oder das Format? Aufwand S.

**FA-11-10 (erfuellt).** Feld `Produkte.ts:192-205` (Pflicht, muss zum Prüfmuster passen), Anzeige `bestell-formular.tsx:152` (Hinweis „Beispiel“), `:170` (Platzhalter im Eingabefeld), `src/app/(site)/schluessel-nach-code/[slug]/page.tsx:181-196` (Bildunterschrift „keine echte Schließung“). Die 52 Beispielcodes sind erfunden (Mensch).

**FA-11-11 (fehlt), Bild.** Feld vorhanden: `src/payload/collections/Produkte.ts:231` (`produktbild`), Mapping `src/lib/data/payload-mapping.ts:257`, `:309`. Nirgends angezeigt: Suche in `src/app` und `src/components` nach `productImage` liefert keinen Treffer außerhalb des Mappings. Auf der Liste fehlt ein Bild (`shop-liste.tsx`). Die Detailseite zeigt bei fehlendem Fundstellenfoto eine generierte Grafik (`[slug]/page.tsx:231-240`). Bauen: Produktbild in der Liste und im Kopf der Detailseite, Fallback Fach-Icon; Aufwand S. Mensch: eigene Fotos (MA-05, I-CODE-09), keine fremden Bilder (R11).

**FA-11-12 (erfuellt), Preis.** `Produkte.ts:138` (`preis`), `:140-161` (Staffeln mit Rabatt), Anzeige `shop-liste.tsx:446`, `[slug]/bestell-formular.tsx` (Preisübersicht), Staffeltabelle `[slug]/page.tsx:131`. Die Höhe der Preise ist nicht geprüft und liegt beim Inhaber (G9, R9). Auffällig: alle 52 Linien haben Staffelstufen ab 3 und 5 Stück mit exakt gleichen Abstufungen (`content/code-lines.json`, `bulkPrices`).

**FA-11-13 (erfuellt), Stückzahl.** `Produkte.ts:168` (`maxMenge`, Standard 20), Formular `bestell-formular.tsx:222-227` (`max={line.maxQty}`), Serverprüfung `src/lib/actions/orders.ts:208-210`, Anzeige `[slug]/page.tsx:129`. Alle 52 Linien stehen auf 20 (`content/code-lines.json`, `maxQty`); Quelle der Zahl ist nicht belegt (offene Frage).

**FA-11-14 (erfuellt), Codefeld.** `bestell-formular.tsx:146-175` (Feld „Schlüsselcode“, Pflicht, Format-Hinweis, Musterprüfung beim Tippen), `:50-75` (Normalisierung und Fehlertext), Serverprüfung `src/lib/actions/orders.ts:201-206` (`codePasst`, Ablehnung mit Formatangabe).

**FA-11-15 (erfuellt), Hinweise.** `Produkte.ts:206` (`codeHinweis`), `:223` (`fotoHinweis`), `[slug]/page.tsx:229` (Hinweis zur Fundstelle), `:291-296` (Hinweis „Anfertigung nach Ihrer Codeangabe“), `bestell-formular.tsx:149-156`. Die Texte sind je Linie aus Feldern zusammengesetzt (`src/lib/codelinie-texte.ts:1-17`), also schematisch; siehe offene Frage zur redaktionellen Qualität (Mensch).

**FA-11-16 (erfuellt), Warenkorb.** `bestell-formular.tsx:119` (`addCodeKey`), `:356` („In den Warenkorb“), `src/lib/store/cart.ts:47-72`, `src/app/(site)/warenkorb/warenkorb-ansicht.tsx:85`, `src/app/(site)/kasse/kasse-formular.tsx:190-196`, Serverprüfung `src/lib/actions/orders.ts:200-229`. Test vorhanden: `src/lib/store/cart.test.ts`.

**FA-11-17 (teilweise), Anfrageoption.** Vorhanden: Verweis „Dann geht es über Schlüssel nach Vorlage weiter“ (`[slug]/page.tsx:256-262`), Hinweis „falsch eingegebener Code führt zu einem nicht passenden Schlüssel“ (`:291-296`), Leerzustand mit Link auf Vorlage (`shop-liste.tsx:503-516`), Festlinks (`page.tsx:23-27`). Lücke: Im Bestellformular gibt es bei unklarem Code keine Anfrage (`bestell-formular.tsx:71-75`, nur Fehlermeldung). Der Verweis führt zur Foto-Anfrage, nicht zu einer Klärung des Codes. Bauen: Hinweis „Code unsicher?“ mit Anfrage im Bestellformular, Ziel Vorlage oder eigener Code-Anfrageweg. Aufwand S bis M. Mensch: Entscheidung über den Weg.

**FA-11-18 (fehlt), Ebay-Angebote.** Im Repository liegen keine übermittelten Angebote vor. eBay erscheint nur als Fundstelle für Trefferbilder (`erhebung/E1-nachfrage.md:31-67`, Stufe B). Bauen: Importliste mit Fakten (Anwendung, Schlüsseltyp, Codeformat, Preis, Hersteller), Texte selbst schreiben. Nicht übernehmen: Fremdtexte und Fremdbilder (R11). Aufwand S. Mensch: Umut liefert die Angebotsliste, Bildrechte klären.

**FA-11-19 (teilweise), Admin ohne Entwickler.** Funktioniert: Anlage, Entwurf, Veröffentlichung, Prüfmuster mit Validierung (`Produkte.ts:184-205`, `src/lib/code-pattern.ts`), Shop-Anzeige aus der Datenbank (`payload-adapter.ts:84-92`), Revalidierung (`revalidate.ts:41-44`). Lücken: (a) auf einer leeren Datenbank legt der Seed die 52 Demo-Linien an (`seed.ts:469-486`); (b) ohne Datenbank (`SM24_DATA=json`, `src/lib/data/index.ts:24-29`) ist nichts im Admin pflegbar; (c) Hersteller als Freitext (siehe FA-11-07); (d) Produktbild unsichtbar (FA-11-11). Bauen: Seed auf leere Datenbank für Codeprodukte umstellen, Bild anzeigen, Herstellerauswahl. Aufwand S bis M. Mensch: Test im Admin mit erfundenen Testdaten (G4), Betreiberanleitung.

## 4. Weitere Feststellungen

- **Strukturdaten.** `src/components/seo/json-ld.tsx:144-180`: Produkt-Schema mit Preis; Marke nur bei gepflegtem Hersteller (`:173-175`). Verfügbarkeit ist für alle aktiven Linien „InStock“ (`:181`), ohne Lagerbestand. Das ist eine Aussage, die der Bestand nicht belegt (R8, R9).
- **Dokumentation veraltet.** `_werkstatt/ausbau/LAGEBILD.md:16` sagt, die Sicherungskarte werde „nur im Browser erzwungen“. Der Bestand prüft sie serverseitig (`src/lib/actions/orders.ts:212-214`, `src/lib/server/unterlagen-pflicht.ts:64-66`). Bei fehlender Ablage genügt das Vorhandensein eines Foto-Eintrags aus dem Browser (`unterlagen-pflicht.ts:53-57`), das ist eine Restschwäche.
- **Sicherungskarte.** Nur `zy-02` verlangt ein Pflichtfoto (`content/code-lines.json`, `photoUpload: pflicht`; Erhebung I-CODE-10). Ob weitere geschützte Profile betroffen sind, ist offen (R13, I-CODE-04).
- **Tests.** Vorhanden sind Unit-Tests: `src/app/(site)/schluessel-nach-code/[slug]/code-uebernahme.test.ts`, `src/lib/codelinie.test.ts`, `src/lib/codelinie-texte.test.ts`, `src/lib/store/cart.test.ts`, `src/payload/seed.db.test.ts`, `src/payload/payload.db.test.ts`. Keine End-to-End-Tests (kein Playwright, kein `tests/`-Ordner). Die Anweisung (Abschnitt 01, 29) verlangt echtes End-to-End-Durchspielen; das fehlt für den Code-Shop. Nicht ausgeführt, da Projektbefehle untersagt waren.
- **Mail und PDF.** Code-Positionen sind in Bestätigung und Druckansicht berücksichtigt: `src/lib/mail/vorlagen/vertragsbestaetigung.ts:51`, `src/lib/druckansichten.ts:33`, `:243`. Nicht inhaltlich geprüft.
- **Interne Daten.** Der Einkaufspreis je Linie ist als vertraulich markiert (I-CODE-08) und ist in diesem Bericht nicht enthalten.

## 5. Offene Fragen

1. Welche der 52 Codelinien führt der Betrieb tatsächlich, mit welchem Hersteller? Der Sortimentsbogen schlägt für alle 52 „im Sortiment ja“ vor, obwohl Abschnitt 10 Büroschrank und Rollcontainer als nicht reales Angebot nennt.
2. Was meint „System“ (FA-11-08): Schließsystem, Profil oder Codeserie?
3. Was meint „Codebereich“ (FA-11-09): Nummernbereich von bis oder Codeformat?
4. Welche Linien verlangen eine Sicherungskarte (R13)? Derzeit nur zy-02.
5. Woher stammt die Höchstmenge 20 je Linie?
6. Liegt die Liste der übermittelten eBay-Angebote Umut vor, und in welcher Form soll sie kommen?
7. Soll die Anfrage bei unklarem Code über die Foto-Anfrage laufen oder einen eigenen Code-Weg bekommen (FA-11-17)?
8. Soll der Einsendeservice im Warenkorb buchbar sein oder als Anmeldung bleiben (FA-10-12)?
9. Welche Gehäuse-, Umbau-, Reparatur- und Customizing-Leistungen werden mit welchen Preisen angeboten (FA-10-06 bis FA-10-08)?
10. Sollen die acht Beispielartikel und die 52 Demo-Linien aus der Live-Datenbank gelöscht werden? Das braucht eine Freigabe des Betreibers.
11. Cylinder-Katalog (`content/cylinder-catalog.json`) ist nicht geprüft. Soll er im nächsten Durchgang abgeglichen werden?

## 6. Hinweis zur Kennung der Anforderungen

Die Kennungen FA-10-01 bis FA-10-12 folgen der Liste der Hauptkategorien und der Terminregel in Abschnitt 10. FA-11-01 bis FA-11-19 folgen der Reihenfolge in Abschnitt 11, wobei die Produktfelder je Punkt einzeln geführt sind.
