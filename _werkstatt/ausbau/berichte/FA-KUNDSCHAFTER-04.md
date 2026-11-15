# FA-KUNDSCHAFTER-04 · Stadt- und Regionsseiten, Ortsdatenbasis

Stand der Prüfung: 15.11.2026 · Rolle Kundschafter · Stufe 1 · nur lesend
Quelle: `_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Abschnitt 09, Anhang A (inklusive „Technischer Auftrag für die Ortsdatenbank“), Anhang B letzter Punkt. Maßstab: Abschnitt 01 und 29.

## Ergebnis in Kürze

- 18 Anforderungen geprüft: 0 erfüllt, 11 teilweise, 7 fehlt, 0 widerspricht.
- Bestand an Ortsdaten: genau ein Datensatz (Wetzlar, `content/cities.json`). Die Anhang-A-Liste umfasst 348 Einträge in 16 Ländern, davon ist 1 abgebildet (Wetzlar), also 0,3 Prozent.
- Die vorhandene Technik für Stadtseiten (Sammlung „Einsatzgebiete“ in Payload, Standortseiten, Sitemap, Noindex-Steuerung) funktioniert für einzelne Orte. Eine amtliche Ortsdatenbasis, ein Import, eine Verknüpfung mit Landkreis, Postleitzahl und Partnerregion sowie eine Prioritätssteuerung gibt es nicht.
- Die einzige amtliche Ortsdatenbasis im Repository (`content/karte/hessen-gemeinden.json`, 425 Hessen-Einträge mit amtlichem Gemeindeschlüssel, BKG-Quelle mit Destatis-Schlüsseln) wird von der Anwendung nicht gelesen. Sie deckt nur Hessen ab und nennt keine Postleitzahlen.

## Tabelle aller Anforderungen

| ID | Anforderung (kurz) | Bestand | Aufwand | Lücke (kurz) |
|---|---|---|---|---|
| FA-09-01 | Bundesweit skalierbare Ortsstruktur, nicht nur wenige Großstädte | teilweise | M | Ein Datensatz je Ort von Hand, keine Struktur für Landkreis, PLZ, Schlüssel |
| FA-09-02 | Keine handgeschriebene Miniliste, sondern amtliche Ortsbasis (GV-ISys) als Grundlage | teilweise | M | Nur Hessen-Schlüssel im Repository, ungenutzt, GV-ISys nicht verwendet |
| FA-09-03 | Alle relevanten deutschen Städte und Gemeinden technisch verfügbar | fehlt | M | Keine Daten außerhalb Hessens, kein Import |
| FA-09-04 | Priorität nach Suchvolumen und Regionen mit Partnern | fehlt | S | Kein Prioritätsfeld, Liste ungeordnet, keine Partnerregion |
| FA-09-05 | Keine 1:1 kopierten SEO-Seiten, jede Seite mit Mehrwert, Leistung, Partnerbezug oder Verfügbarkeit | teilweise | S | Noindex-Gate prüft nur Platzhalter, nicht Mehrwert oder Partnerbezug |
| FA-09-06 | Ortsseite automatisch mit Partnerregion, Kontaktweg und Leistungen verknüpfbar | teilweise | M | Leistungen und Werkstatt verknüpft, Partnerregion fehlt, Kontakt nur über Handlinks |
| FA-09-07 | Ortsdatenbasis importierbar und aktualisierbar, nicht fest verdrahtet | teilweise | M | Templates frei von Verdrahtung, aber kein Importweg, Seed nur für `cities.json` |
| FA-09-08 | Datenbank soll alle deutschen Städte und Gemeinden abbilden können (Anhang ist keine Obergrenze) | teilweise | S | Schema ohne Gemeindeschlüssel, Kapazität nie erprobt |
| FA-AA-01 | Anhang-A-Liste als breite Start- und Prioritätsliste für Ortsseiten und Partnergewinnung | fehlt | S | Liste nur im Anweisungsdokument, nicht als Daten, keine Partnergewinnung daran gekoppelt |
| FA-AA-02 | Ortsdatenbank beruht auf vollständiger amtlicher Basis und kann alle Städte und Gemeinden abbilden | teilweise | M | Wie FA-09-02 |
| FA-AA-03 | Ortsseiten nur mit echtem Inhalt, Partnerbezug oder klarem Leistungsmehrwert | teilweise | S | Gate nur für Platzhalter, Partnerbezug und Mehrwert ungeprüft |
| FA-AA-04 | Vollständige amtliche Ortsstruktur importierbar machen | fehlt | M | Kein Importskript, keine Importoberfläche, keine Zuordnung zur Sammlung |
| FA-AA-05 | Priorisierung nach Suchvolumen, Partnerabdeckung, Fahrzeit, tatsächlicher Leistung | fehlt | S | Keine Felder, keine Sortierung, keine Fahrzeitdaten |
| FA-AA-06 | Ortsseite erst mit echtem Inhalt und plausiblem Leistungsweg veröffentlichen | teilweise | S | Leistungsweg wird nicht geprüft, Veröffentlichung nur über Status und Platzhalter |
| FA-AA-07 | Stadt, Landkreis, Postleitzahl und Partnerregion sauber verknüpfen | fehlt | M | Keine Felder Landkreis, PLZ, Partnerregion in der Sammlung, Partnerdaten nicht verbunden |
| FA-AA-08 | Dubletten, ähnliche Ortsnamen und Ortsteile eindeutig behandeln | teilweise | M | Slug und Kennung eindeutig, Name und Ortsteil nicht; Schreibvarianten im Hessen-Abgleich |
| FA-AA-09 | Anhang-A-Städte im System abgebildet | fehlt | S (Technik), L (Inhalt) | 1 von 348 vorhanden (Wetzlar) |
| FA-AB-05 | GV-ISys beziehungsweise gleichwertige gepflegte amtliche Quelle als Referenz | teilweise | S | Hessen-Daten aus BKG VG250 mit Destatis-Schlüsseln, nicht GV-ISys, nicht in der App |

Aufwand: S bis zwei Stunden, M bis ein Tag, L mehr. Die Spalte „Mensch“ steht in den Einzelheiten.

## Einzelheiten

### Abschnitt 09: Deutschlandweite Stadt- und Regionsseiten

**FA-09-01 · teilweise.** Die Anforderung verlangt eine bundesweit skalierbare Ortsstruktur. Vorhanden sind eine Payload-Sammlung für Einsatzgebiete (`src/payload/collections/Einsatzgebiete.ts:8-46`), Routen für Übersicht und Einzelort (`src/app/(site)/standorte/page.tsx:14-17`, `src/app/(site)/standorte/[city]/page.tsx:22-25` mit `generateStaticParams`) und eine Sitemap mit Filter (`src/app/sitemap.ts:186-203`). Die Mechanik trägt viele Orte. Die Struktur trägt sie nicht: Die Sammlung kennt nur Stadt, Bundesland, Einleitung, Angaben, Leistungen, Radius, SEO, Slug und Kennung (`Einsatzgebiete.ts:17-44`). Landkreis, Postleitzahl, Gemeindeschlüssel und Partnerregion fehlen. Der Bestand umfasst einen Datensatz (`content/cities.json:1-53`). Die Übersichtsseite sortiert nicht (`standorte/page.tsx:79` übernimmt die Reihenfolge der Daten).
- Bauen: Felder `landkreis`, `plz` (Liste), `gemeindeschluessel` (AGS, eindeutig), `partnerregion`, `prioritaet` in `Einsatzgebiete.ts` ergänzen (additive Migration nach G6), Mapping in `src/lib/data/payload-mapping.ts:735-762` und Typ `CityPage` (`src/lib/types.ts:888-898`) anpassen, Übersicht nach Priorität sortieren (`standorte/page.tsx`).
- Mensch: Entscheidung, welche Felder der Betrieb pflegt.

**FA-09-02 · teilweise.** Die Anforderung nennt GV-ISys als Grundlage und verbietet eine handgeschriebene Miniliste. Im Repository liegt `content/karte/hessen-gemeinden.json` (425 Einträge: 191 Stadt, 230 Gemeinde, 4 gemeindefrei; Felder `ags`, `name`, `art`, `kreis`, `d`, `mitte`; `stand` 2026-01-01, Zeile 4). Die Datei stammt aus VG250 des BKG mit Destatis-Schlüsseln (`content/karte/LIZENZ.md:3` und Zeile 25). Die Anwendung liest sie nicht: Suche nach `hessen-gemeinden` und `content/karte` in `src` und `scripts` findet keinen Lesezugriff. Schreibend erzeugt nur das Skript `scripts/karte-aufbereiten.mjs` die Dateien (`:9-10`, `:34-35`). Die Ortsdaten der Anwendung (`src/lib/data/defaults/content.ts:718-726`) sind leer, die Datei `content/cities.json` enthält Wetzlar. GV-ISys ist nicht im Repository.
- Bauen: Eine Importquelle `content/ortsbasis/` oder ein Importskript, das GV-ISys (oder die Quelle nach Entscheidung) in die Sammlung einliest; ein Adapter-Zugriff für Karte und Ortsseiten; Test mit Zahlen wie in `scripts/karte-aufbereiten.mjs:35` (SOLL-Werte) als Prüfung.
- Mensch: Entscheidung über die Quelle und deren Lizenz (siehe FA-AB-05), Bereitstellung des Downloads.

**FA-09-03 · fehlt.** Keine Datensätze außerhalb Hessen, keine Gemeinden jenseits des einen Eintrags, kein Importpfad (`src/payload/seed.ts:585-592` lädt nur `content/cities.json`). Die Anwendung kann keine vollständige Ortsbasis halten, bis ein Import existiert.
- Bauen: Import aller Gemeinden der gewählten Quelle mit Status „ungeprüft“, nicht veröffentlicht. Die Gesamtzahl steht im Anweisungsdokument nicht; sie folgt aus der Quelle (siehe Offene Frage 2).
- Mensch: Quelle beschaffen und freigeben.

**FA-09-04 · fehlt.** Kein Prioritäts- oder Suchvolumenfeld in `Einsatzgebiete.ts`. Partnerregionen sind nicht mit Orten verbunden. Die Partnerdaten (`src/payload/collections/Partnerbetriebe.ts:85-93`, Feld `einsatzgebiet.postleitzahlen` und `radiusKm`) werden über keinen Adapter gelesen (`src/lib/data/payload-adapter.ts` enthält keinen Partnerpfad, Suche nach `partnerbetriebe` in `src` findet nur Sammlung, Vertrags-PDF und Komponente `src/payload/components/PartnervertragKnopf.tsx`).
- Bauen: Feld `prioritaet` (Zahl oder Stufe) und ein Abgleich mit Partnerregionen; Sortierung in `standorte/page.tsx`.
- Mensch: Suchvolumen (extern, Rechte an Daten prüfen), Partnerregionen (Inhaber).

**FA-09-05 · teilweise.** Das Gate in `src/lib/rechtliches/indexierung.ts:11-20` prüft nur Platzhalter (`src/lib/platzhalter.ts:5-18`) und das Feld `seo.noindex`. Mehrwert, Partnerbezug oder Verfügbarkeit werden nicht geprüft. Die Sammlung sagt „kein Massentext“ (`Einsatzgebiete.ts:7`), das ist nur ein Kommentar. Die Ortsseite gleicht sich strukturell (Überschrift `Schlüssel- und Schließtechnik in ${city.city}`, `standorte/[city]/page.tsx:117`; Bereichsliste `:177-204`), was bei dünnen Texten 1:1-Muster erzeugt. Der Hinweis in `src/lib/data/defaults/content.ts:718-722` beschreibt die Absicht, aber kein Prüfschritt setzt sie um.
- Bauen: Prüfung in `indexierung.ts`, die eine Ortsseite nur indexierbar macht, wenn mindestens eins gilt: Partnerregion gesetzt, eigene Einleitung ab Mindestlänge, Angaben zur Werkstatt oder Radius (siehe FA-AA-03). Test in `src/app/sitemap.test.ts`.
- Mensch: Redaktionelle Texte je Ort.

**FA-09-06 · teilweise.** Vorhanden: Leistungen je Ort aus `servicesOffered` mit Bereichsliste (`standorte/[city]/page.tsx:63`, `:177-204`), Werkstatt-Angaben nur, wenn der Ortsname exakt zur Werkstatt passt (`:53-54`, `:130-166`), interne Links aus `seo.internalLinks` (`:207-223`, `content/cities.json:37-50`). Fehlt: Partnerregion (kein Feld, keine Anzeige) und ein automatischer Kontaktweg, der aus dem Ort abgeleitet wird. Die Kontaktwege sind Handlinks.
- Bauen: Partnerregion-Block auf der Ortsseite, Kontaktweg aus Partnerzuordnung (`partner-werden` und `service-und-termin/vor-ort` als Ziel).
- Mensch: Partnerzuordnung und Freigabe des Kontaktwegs.

**FA-09-07 · teilweise.** Die Templates sind nicht fest verdrahtet: Seiten lesen über `getCities` und `getCity` (`src/lib/data/index.ts:111-122`), das Mapping stellt die Daten bereit (`src/lib/data/payload-mapping.ts:735-748`). Ein Importweg für eine Ortsliste fehlt. Die Sammlung ist per Hand pflegbar (Admin, Versionen mit Entwurf, `Einsatzgebiete.ts:13`). Seed und JSON-Datei gelten nur für `content/cities.json` (`src/payload/seed.ts:585-592`, `src/lib/data/json-adapter.ts:22`).
- Bauen: Import-Endpunkt oder Importskript mit Vorschau, Aktualisierungslauf und Protokoll; Schlüssel AGS als Idempotenzschlüssel (`seed.ts` nutzt `schluessel: (c) => c.id`).
- Mensch: Festlegung, wer den Import anstößt.

**FA-09-08 · teilweise.** Die Sammlung kennt keine Obergrenze im Schema. Das Schlüsselfeld fehlt (`kennungFeld` und `slugFeld` sind eindeutig, `src/payload/fields/gemeinsam.ts:44-80`, Migration `src/migrations/20260924_004222_datenmodell.ts:1333-1334`). Die Kapazität für eine vollständige Ortsbasis ist nicht geprüft. `generateStaticParams` (`standorte/[city]/page.tsx:22-25`) erzeugt eine Seite je Eintrag von `getCities`; dort kommen nur veröffentlichte Datensätze an (`payload-adapter.ts:108-111`, Filter `VEROEFFENTLICHT`). Bei tausenden Orten wäre der Build-Aufwand zu messen.
- Bauen: Test mit Vollbestand, Build-Zeit prüfen, Schlüssel AGS.
- Mensch: Entscheidung, ob nicht veröffentlichte Gemeinden bei Build und Sitemap bleiben.

### Anhang A: bundesweite SEO-Prioritätsliste

**Zählung der Liste (Anforderung FA-AA-09, Bestandsfeststellung).** Die Anweisung nennt 16 Länder. Nach Zählung der Liste im Anweisungsdokument (Zeilen 710 bis 798):

| Land | Einträge |
|---|---|
| Baden Württemberg | 38 |
| Bayern | 37 |
| Berlin | 1 |
| Brandenburg | 18 |
| Bremen | 2 |
| Hamburg | 1 |
| Hessen | 35 |
| Mecklenburg Vorpommern | 12 |
| Niedersachsen | 35 |
| Nordrhein Westfalen | 67 |
| Rheinland Pfalz | 22 |
| Saarland | 9 |
| Sachsen | 19 |
| Sachsen Anhalt | 16 |
| Schleswig Holstein | 19 |
| Thüringen | 17 |
| **Summe** | **348** |

Die Zählung erfolgte mit einem Skript über die Zeilen, nicht manuell. Bei Berlin und Hamburg steht der Stadtname als Ländername; beide wurden einzeln ergänzt. Abweichungen gegenüber einer manuellen Zählung sind möglich, OFFENE FRAGE: Stichprobe durch den Inhaber.

**Im System abgebildet.** Von den 348 Einträgen steht genau einer als Datensatz bereit: Wetzlar (`content/cities.json:3-5`, im Anhang A unter Hessen enthalten). Die übrigen 347 fehlen.

**Hessen-Abgleich mit der amtlichen Datei (Stichprobe für FA-AA-08).** Von den 35 Hessen-Einträgen stehen 28 wörtlich in `content/karte/hessen-gemeinden.json`. Die übrigen 7 sind Schreibvarianten derselben Gemeinde:
- „Bad Homburg vor der Höhe“ ist „Bad Homburg v.d.Höhe“ (AGS 06434001)
- „Oberursel“ ist „Oberursel (Taunus)“ (AGS 06434008)
- „Langen“ ist „Langen (Hessen)“ (AGS 06438006); ähnlich ist „Langenselbold“ (AGS 06435017)
- „Neu Isenburg“ ist „Neu-Isenburg“ (AGS 06438009)
- „Limburg an der Lahn“ ist „Limburg a.d.Lahn“ (AGS 06533009)
- „Friedberg Hessen“ ist „Friedberg (Hessen)“ (AGS 06440008)
- „Mörfelden Walldorf“ ist „Mörfelden-Walldorf“ (AGS 06433008)

Die Schreibweisen der Anweisung (Leerzeichen statt Bindestrich, Kurzformen) weichen also überall ab. Ein Abgleich über den Namen allein ist unzuverlässig. Außerhalb Hessens liegt keine Vergleichsdatei vor; Beispiele wie „Baden Baden“, „Villingen Schwenningen“, „Frankfurt Oder“ oder „Homburg“ (Saarland) sind ohne Daten nicht prüfbar.

**FA-AA-01 · fehlt.** Die Liste steht nur im Anweisungsdokument (`_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt:710-798`). Sie ist nicht als Daten hinterlegt, hat keine Prioritätsangaben und ist nicht mit Partnergewinnung verknüpft (`src/app/(site)/partner-werden/page.tsx` ohne Bezug zu Orten).
- Bauen: Liste als Prioritätsdatensatz im Datenmodell (Feld `prioritaet` und Quellvermerk), nach G13 nicht in öffentlichen Inhalten.
- Mensch: Bestätigung der Liste und Reihenfolge durch den Inhaber.

**FA-AA-02 · teilweise.** Siehe FA-09-02. Für Hessen existiert eine amtliche Basis mit Gemeindeschlüsseln, für den Rest Deutschlands nicht.

**FA-AA-03 · teilweise.** Die Anweisung verlangt Veröffentlichung nur mit echtem Inhalt, Partnerbezug oder klarem Leistungsmehrwert. Das Gate prüft nur Platzhalter (`src/lib/rechtliches/indexierung.ts:18-20`). Ein Eintrag mit Status „veröffentlicht“ ohne Platzhalter erscheint in Übersicht, Sitemap und Vor-Ort-Seite (`src/app/(site)/service-und-termin/vor-ort/page.tsx:88-89, 175-191`), auch ohne Partnerbezug. Die Vor-Ort-Seite nutzt dieselbe Filterlogik.
- Bauen: Erweiterung von `stadtIndexierbar` um die Mehrwertregel (siehe FA-09-05).

**FA-AA-04 · fehlt.** Die vollständige Ortsstruktur ist nicht importierbar. Es gibt keinen Importpfad, keine Admin-Oberfläche für eine Liste und kein Skript außer `scripts/karte-aufbereiten.mjs`, das Kartenformen erzeugt und nicht in die Sammlung schreibt (`package.json` enthält nur `generate:importmap`).
- Bauen: Importskript oder Admin-Endpunkt, der eine Datei mit Gemeindeschlüssel, Name, Kreis, PLZ einliest, idempotent speichert (wie `eintraegeUebernehmen` in `src/payload/seed.ts:585-592`).

**FA-AA-05 · fehlt.** Keine Felder für Suchvolumen, Partnerabdeckung, Fahrzeit oder tatsächliche Leistung in `Einsatzgebiete.ts`. Die Sortierung der Übersicht ist nicht festgelegt (`standorte/page.tsx:79`).
- Bauen: Felder und Sortierlogik, Auswertung über Vorgänge (Leistung je Ort aus `src/lib/data/payload-mapping.ts` Vorgänge mit Adresse, Postleitzahl aus `contact.postalCode`, `src/lib/data/payload-mapping.ts:1312`).
- Mensch: Suchvolumen (extern, Lizenz prüfen), Fahrzeiten (Betrieb), Leistungsdaten (Betrieb).

**FA-AA-06 · teilweise.** Der plausible Leistungsweg wird nicht geprüft. Ein Ort kann Leistungen angezeigt bekommen, ohne dass die Leistungsseiten dort einen Weg haben (`standorte/[city]/page.tsx:63` übernimmt `servicesOffered` ungeprüft in `areaByKey`). Die Vorlage für Ortsseiten hat keine Warnung.
- Bauen: Prüfung, dass jede angebotene Leistung einen Weg hat (Bereichsseite und Kasse oder Anfrage), in `indexierung.ts`.

**FA-AA-07 · fehlt.** Landkreis, Postleitzahl und Partnerregion sind in der Sammlung nicht verknüpft (`Einsatzgebiete.ts:17-44`). Die Kreisgeometrie (`content/karte/hessen-kreise.json`, 27 Einträge) und die Partnerpostleitzahlen (`Partnerbetriebe.ts:90`, Eingabe als Text, Platzhalter `355*`) sind getrennte Datenbestände. Die Partnerbewerbung speichert Postleitzahl, Ort und Radius nur im Vorgang (`src/app/(site)/partner-werden/partner-formular.tsx:175-186`). Die Partnersammlung und das Vorgangsmodell widersprechen sich damit nicht, sie sind aber unverbunden.
- Bauen: Gemeinsamer Schlüssel (AGS) für Ort, Kreis und Partnerregion, PLZ-Zuordnung als Liste (eine PLZ kann zu mehreren Gemeinden gehören, Regel festlegen).
- Mensch: Regel für Postleitzahlen mit mehreren Gemeinden und Partnerzuordnung.

**FA-AA-08 · teilweise.** Eindeutig sind Slug und Kennung (`src/payload/fields/gemeinsam.ts:50` und `:74`, Migration `datenmodell.ts:1333-1334`). Nicht eindeutig behandelt sind: Stadt und Bundesland (keine Kombinationsprüfung), Schreibvarianten (siehe Hessen-Abgleich oben), ähnliche Namen (Langen und Langenselbold; Homburg in Hessen gegenüber Homburg im Saarland), Ortsteile (kein Feld, keine Regel). `src/lib/data/payload-mapping.ts:750-762` übernimmt den Namen unverändert.
- Bauen: Gemeindeschlüssel als eindeutiger Schlüssel, Schreibweisentabelle, Ortsteile als eigene Tabelle mit Zuordnung zu einer Gemeinde.
- Mensch: Regel, wie Ortsteile gezeigt werden.

**FA-AA-09 · fehlt.** Siehe Zählung oben: 1 von 348.
- Bauen: Import (FA-AA-04), danach Entwürfe je Ort mit Status „ungeprüft“.
- Mensch: Redaktionelle Texte und Partnerzuordnung für die Prioritätsstufen. Technik allein genügt nicht.

### Anhang B: technische Hinweise, letzter Punkt

**FA-AB-05 · teilweise.** Die Anweisung nennt GV-ISys als Referenz oder gleichwertige gepflegte amtliche Quelle. Im Repository steht eine Hessen-Datei aus VG250 des BKG mit Destatis-Schlüsseln (`content/karte/LIZENZ.md:3, 25`). GV-ISys wird nicht genannt, die Quelle ist eine andere (BKG-Geodatenprodukt, nicht das Gemeindeverzeichnis). Ob sie als „gleichwertig“ gilt, ist eine Entscheidung. Die Datei wird nicht von der Anwendung gelesen (siehe FA-09-02). Die Lizenz verlangt Pflichtvermerk und Links (`LIZENZ.md:19-23`); der Vermerk ist auf keiner Seite der Anwendung zu finden (`grep` auf `dl-de`, `BKG`, `Destatis` in `src` ohne Treffer).
- Bauen: Quellenentscheidung dokumentieren (`_werkstatt/ausbau/ENTSCHEIDUNGEN.md`), Pflichtvermerk einbinden, sobald die Karte oder Ortsdaten ausgeliefert werden.
- Mensch: Entscheidung über GV-ISys oder gleichwertige Quelle und Lizenzprüfung (nicht durch den Kundschafter bewertet).

## Maßstab Abschnitt 01 und 29

- Echte End-to-End-Funktion: Der Weg Admin, Sammlung, Adapter, Seite ist testbar (`src/lib/data/payload-mapping.test.ts:84-105`, `src/payload/leitfaden.db.test.ts:41-59`, `src/app/sitemap.test.ts`). Ein Importweg für Ortsdaten existiert nicht, daher auch keine End-to-End-Prüfung eines Imports.
- Keine Platzhalter: Der Platzhaltermechanismus (`src/lib/platzhalter.ts`) verhindert Indexierung, nicht Anzeige im Admin. Ein Datensatz mit Platzhalter erscheint im Admin ohne Warnung über die Zahl der offenen Orte.
- Vom Betreiber ohne Entwickler pflegbar: Die Sammlung ist im Admin pflegbar (`Einsatzgebiete.ts`, Entwürfe, Papierkorb). 348 Orte bedeuten 348 Einzelanlagen von Hand, ohne Import nicht praktikabel.

## Offene Fragen

1. Quelle: GV-ISys (Destatis) oder die vorhandene BKG-VG250-Basis mit Schlüsseln? Lizenz und Abrufweg der Quelle sind nicht geprüft (kein Netzabruf nach Auftrag).
2. Zahl der Gemeinden in Deutschland: Das Anweisungsdokument nennt keine Zahl; die genaue Zahl folgt aus der gewählten Quelle.
3. Partnerregion: Gemeinde (AGS), Postleitzahl oder Radius? Eine Mischform ist möglich, die Regel fehlt.
4. Veröffentlichungsregel: Wer entscheidet, ob ein Ort Mehrwert hat, und ist die Regel als Prüfung automatisierbar oder redaktionell?
5. Ortsteile: Sollen Ortsteile eigene Seiten bekommen oder nur Angaben zur Gemeinde?
6. Anhang-A-Liste: Die Zählung (348) weicht möglicherweise ab. Stichprobe durch den Inhaber empfohlen.
7. Ob `_werkstatt/ausbau/daten/` öffentlich im Repository liegt, wurde nicht geprüft; die Anhang-A-Liste ist intern.
