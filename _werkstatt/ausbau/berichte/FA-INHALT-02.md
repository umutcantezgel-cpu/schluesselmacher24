# FA-INHALT-02 · Hersteller und Systeme früh sichtbar

Stand: 15.11.2026 · Rolle Autor und Baumeister · Stufe 3 (R12)

## GEÄNDERTE DATEIEN

- neu `src/components/hersteller/bereiche.ts`: Zuordnung Hersteller → Bereiche mit Einsatztext je Bereich, Logo-Regel, Auswahlfunktion `herstellerFuerAnzeige`.
- neu `src/components/hersteller/hersteller-bereich.tsx`: Server-Komponente `HerstellerBereich`.
- neu `src/components/hersteller/hersteller-bereich.test.tsx`: 12 Tests.
- `content/hersteller.json` und `src/lib/data/defaults/hersteller.ts`: drei Einträge BKS, ABUS, BURG-WÄCHTER.
- `src/app/(site)/gleichschliessende-zylinder/page.tsx`: Hersteller laden, Bereich nach Abschnitt 01 (vor 02 Bauformen) mit `bereich="sperrschliessung"`.
- `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`: Hersteller laden, Bereich nach der Einordnung (vor 01 Bausteine) mit `bereich="zutritt"`.
- `src/lib/data/shop.test.ts`: eine Stelle (siehe GEMEINSAME DATEIEN).

Nicht geändert: `src/app/(site)/page.tsx`, Navigation, Preise, Rechtstexte, Zylinderkatalog, Zutritts-Konfigurator (Begründung unten).

## WAS UND WARUM

1. Daten. Startbestand der Stammliste: BKS (Reihenfolge 10), ABUS (20), BURG-WÄCHTER (30), je `angeboten: true`, ohne Logo, Schreibweise nach Recherche 06, Abschnitt 2. Der Inhaber nennt sie in der Arbeitsanweisung selbst als angebotene Hersteller. Das Feld `einsatz` (300 Zeichen) trägt je einen allgemeinen Satz.
2. Bereiche. Die Sammlung `Hersteller` hat **kein Feld für die Bereiche** eines Herstellers (Sperrschließungen, elektronischer Zutritt) und nur einen Einsatztext für alle Bereiche. Die Zuordnung samt Einsatztext je Bereich liegt daher an einer Stelle in `src/components/hersteller/bereiche.ts` (`HERSTELLER_BEREICHE`), mit Test. Kein Datenschema in diesem Paket. Ein Hersteller, den der Betrieb neu anlegt und der dort nicht steht, erscheint nur im Bereich ohne Einschränkung (Startseite) mit seinem `einsatz`, nie auf den Rubrikseiten.
3. Baustein `HerstellerBereich` (Server-Komponente, Daten als Prop, damit Startseite und Rubrikseiten dieselbe Quelle `getHersteller()` nutzen). Überschrift „Systeme, mit denen wir arbeiten“, Augenbraue „Hersteller“, Einleitung „Wir arbeiten mit Systemen von …“ bzw. „Für Sperrschließungen / Für elektronischen Zutritt arbeiten wir mit Systemen von …“. Je Hersteller eine ruhige Karte (`rounded-lg border border-border bg-surface p-6`), Name als `h3` in der Seitenschrift, keine Herstellerfarben, kein nachgebautes Logo. Ohne `bereich`: je Karte die Bereiche als Haarlinienliste mit Bereichsname, Einsatztext und Verweis („Zu den Sperrschließungen“, „Zum elektronischen Zutritt“). Mit `bereich`: nur der Einsatztext dieses Bereichs. Darunter der sachliche Satz „Die Namen sind Marken der jeweiligen Hersteller. Wir nennen sie, weil wir mit ihren Systemen arbeiten.“ Kein „Partner“ als Auszeichnung, keine Strukturdaten (R8, R12). Mobil eine Spalte, ab sm zwei, ab lg drei (bei drei Herstellern). Wird kein Hersteller angeboten, gibt der Baustein nichts aus.
4. Logos. Die Datenschicht gibt ein Logo nur mit Haken „Freigabe liegt vor“ heraus (`herstellerZuSeite`, FA-SHOP-01). Der Baustein zeigt es zusätzlich nur, wenn eine Datei dahinter liegt (`freigegebenesLogo`). Dann ersetzt es den Schriftzug (Name bleibt als `sr-only`-Überschrift), per `next/image` mit `object-contain`, ohne Zuschnitt und Umfärbung, mit Schutzraum (Polster um eine feste Fläche 176 × 48 px); SVG ohne Bildoptimierung. JSON-Rückfall und Defaults tragen nie ein Logo (Test).
5. Einbindung Startseite (Orchestrator): `src/app/(site)/page.tsx`, nach dem Abschnitt „Bestellen ohne Termin“, vor „Projekte“:
   ```tsx
   import { getHersteller } from '@/lib/data';
   import { HerstellerBereich } from '@/components/hersteller/hersteller-bereich';
   // in der Seite: const hersteller = await getHersteller();
   <HerstellerBereich hersteller={hersteller} nummer="…" tone="…" />
   ```
   `nummer` und `tone` passend zur Abschnittsfolge der Startseite wählen; `id` ist `hersteller` (änderbar).
6. Rubrikseiten: ohne laufende Nummer eingebunden, damit die Nummern der überarbeiteten Abschnitte (FA-INHALT-03C) unverändert bleiben. Sichtbare Texte der Seiten sonst unverändert.
7. Zutritts-Konfigurator: **nicht geändert**. In `zutritt-konfigurator.tsx` gibt es keine Herstellerliste; der Kopfkommentar legt fest „Preise, Systeme und Produkte werden hier bewusst nicht genannt; sie gehören ins spätere Angebot.“ Die leere, aus dem Zylinderkatalog gespeiste Herstellerliste steht im Sperrschließungs-Konfigurator (`gleichschliessende-zylinder/konfigurator/konfigurator.tsx`, Schritt „hersteller“, nur bei aktiven Katalog-Herstellern); den soll ich laut Schritt 4 ohne Preisdaten so lassen. Siehe OFFENE FRAGE 1.
8. Zylinderkatalog: **nicht geändert**. Eine Auswahl aus dem Stamm (Relationsfeld `stamm` → `hersteller` im Array `hersteller` des Globals) braucht eine neue Spalte in der Array-Tabelle des Globals und damit eine Migration. Nach Paketvorgabe gelassen. Vorschlag für ein Folgepaket: additives Feld `stamm` (relationship, `relationTo: 'hersteller'`, optional) im Array; Mapping `zylinderkatalogZuSeite` nimmt Name und Kennung aus dem Stamm, wenn gesetzt, sonst wie heute aus den Freitextfeldern; `zylinderkatalogZuPayload` bleibt verlustfrei; Preise, Aufpreise, Bauformen, Zusatzkomponenten und Maßbereiche unberührt (G9); Migration nur `ADD COLUMN … NULL` plus Fremdschlüssel. Ohne Preisdaten der Hersteller bleibt der Konfigurator unverändert.

## GEMEINSAME DATEIEN

- `src/lib/data/shop.test.ts`, Test „stimmt mit content/kategorien.json und content/hersteller.json überein“: Die Festlegung „Hersteller leer“ galt dem bisherigen Startbestand und wäre mit dem Auftrag dieses Pakets rot geworden. Ersetzt durch eine strengere Prüfung: JSON gleich Defaults, genau BKS, ABUS, BURG-WÄCHTER in dieser Reihenfolge, kein Logo. Keine Prüfung gelockert (G8).
- Beide Rubrikseiten nur an drei Stellen je Datei mit dem Bearbeitungswerkzeug geändert (Import, Laden, Einbindung).
- Seed: Der bestehende Seed (FA-SHOP-01) legt die drei Hersteller aus `content/hersteller.json` an; keine Änderung am Seed. DB-Tests (`--pg`) laut Paket nicht gelaufen.

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche.
- `sicher.sh --json -- npx vitest run`: 211 Dateien, 3187 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- Kein Build, kein Server, kein `--pg`, kein git.

Verlangte Tests in `src/components/hersteller/hersteller-bereich.test.tsx`:
- „ohne Freigabe kein Logo, auch wenn eine Datei hinterlegt ist“ (gespeichertes Payload-Dokument mit Datei, Haken aus, über `herstellerZuSeite` gerendert: kein `<img>`, Name als Schriftzug).
- „mit Freigabe und Datei ersetzt das Logo den Schriftzug“.
- „zeigt nur angebotene Hersteller“, „zeigt nichts, wenn kein Hersteller angeboten wird“.
- „Sperrschließungen zeigen genau BKS und ABUS“ (Daten und gerendertes HTML), dazu Zutritt mit allen drei, Startseite mit Verweisen, Ziele existieren als Seiten, Texte ohne Gedankenstriche, ohne Preise, ohne „Partner“.

## BELEGE (Quelle je Systemname und Einsatzzweck)

Alle aus `_werkstatt/ausbau/erhebung/FA-RECHERCHE-06.md`, Belegstufe B (Herstellerangabe).

| Hersteller · Bereich | Text | Quelle |
|---|---|---|
| Schreibweisen | BKS, ABUS, BURG-WÄCHTER | Recherche 06, Abschnitt 2 (bks.de Impressum; ABUS-Katalog, nur Suchausschnitt; burg.biz) |
| BKS · Sperrschließungen | Schließzylinder für Gleichschließungen und Schließanlagen, Reihe belvius | bks.de, Broschüre belvius 10/23 (02043_Broschuere_belvius_10-23_DEU.pdf), Abschnitt 3.1 |
| BKS · Zutritt | Elektronisches Schließsystem SE: Zylinder, Beschläge, Wandleser, Transponder; Rechte zeitlich begrenzbar | bks.de, 02018_Elektronisches_Schliesssystem_SE_01-24_DEU.pdf, Abschnitt 3.2 |
| ABUS · Sperrschließungen | Schließzylinder als Gleichschließung und als Schließanlage mit Schließplan; ohne Familiennamen | ABUS-Katalog Schließsysteme 2023 auf abus.com, **nur Suchausschnitt**, Abschnitt 3.1 |
| ABUS · Zutritt | wAppLoxx: Zutrittssystem mit Wandlesern und batteriebetriebenen Zylindern, kleine bis mittlere Objekte und Einfamilienhäuser | abus.com/de/Gewerbe/Zutrittskontrolle/wAppLoxx-System, **nur Suchausschnitt**, Abschnitt 3.2 |
| BURG-WÄCHTER · Zutritt | secuENTRY pro: elektronische Zylinder für Unternehmen, Behörden und Privatnutzer | burg.biz/en/products/entrypro-7000-zylinder, Abschnitt 3.2 |

Bewusst nicht genannt: PZ 88 (nur Suchausschnitt), livius und janus (Quelle ist ein Händlerserver, keine Herstellerseite), ixalo | key, RFID, KeyManager, CodeLoxx, TECTIQ, ENTRYhome und secuENTRY easy (Händlerangaben oder archiviert), alle Preise und Leistungswerte.

## ANSCHREIBEN (drei Entwürfe, nicht abgeschickt)

`_werkstatt/ausbau/AUSSEN.md` gibt es nicht; die Vorlagen stehen deshalb hier. Platzhalter in eckigen Klammern füllt der Inhaber.

### 1 · BKS GmbH (Gretsch-Unitas-Gruppe)

Weg laut Recherche: Servicebereich für Fachpartner bzw. Download-Portal auf bks.de (https://www.bks.de/de-en/service/service-with-system/service-for-installer-partners); eine Ansprechstelle für Logos ist nicht belegt, daher über den zuständigen Außendienst oder den Fachpartner-Service.

> Betreff: Bitte um Freigabe des BKS-Logos und Ihrer Markenvorgaben
>
> Sehr geehrte Damen und Herren,
>
> wir sind [Firma laut Impressum], ein Schlüsseldienst mit Werkstatt in [Ort]. Wir arbeiten mit Schließzylindern und dem elektronischen Schließsystem SE von BKS und möchten das auf unserer Website schluesselmacher24.de sachlich zeigen: in einem Bereich „Systeme, mit denen wir arbeiten“ auf der Startseite sowie auf unseren Seiten zu Sperrschließungen und elektronischem Zutritt.
>
> Bisher nennen wir nur den Namen BKS in unserer eigenen Schrift. Ein Logo verwenden wir erst, wenn Sie es freigeben. Bitte teilen Sie uns mit,
> 1. ob und in welcher Form wir das BKS-Logo nutzen dürfen,
> 2. wo wir die Logodateien in guter Qualität erhalten und
> 3. welche Markenvorgaben (Schutzraum, Mindestgröße, Farben, Hintergrund) gelten.
>
> Gern senden wir Ihnen vorab eine Ansicht der Seite. Unsere Kundennummer bei [Bezugsquelle]: [Nummer].
>
> Mit freundlichen Grüßen
> [Name, Firma, Kontakt]

### 2 · ABUS

Weg laut Recherche: ABUS Partner-Portal (https://www.abus.com/at/Partner-Portal, Werbemittel im geschützten Bereich; Punkt „ABUS Urheberrechte“); Service-Adresse info@abus.de nur im Suchausschnitt genannt, vor dem Versand prüfen.

> Betreff: Bitte um Freigabe des ABUS-Logos und Ihrer Markenvorgaben
>
> Sehr geehrte Damen und Herren,
>
> wir sind [Firma laut Impressum], ein Schlüsseldienst mit Werkstatt in [Ort]. Wir arbeiten mit Schließzylindern für Gleichschließungen und Schließanlagen sowie mit dem Zutrittssystem wAppLoxx von ABUS und möchten das auf schluesselmacher24.de sachlich zeigen: auf der Startseite im Bereich „Systeme, mit denen wir arbeiten“ und auf unseren Seiten zu Sperrschließungen und elektronischem Zutritt.
>
> Bis zu Ihrer Freigabe nennen wir nur den Namen ABUS in unserer eigenen Schrift. Bitte teilen Sie uns mit,
> 1. ob und in welcher Form wir das ABUS-Logo nutzen dürfen,
> 2. ob die Logodateien im Partner-Portal liegen und wie wir Zugang erhalten und
> 3. welche Markenvorgaben gelten.
>
> Unsere Händler- oder Kundennummer: [Nummer].
>
> Mit freundlichen Grüßen
> [Name, Firma, Kontakt]

### 3 · BURG-WÄCHTER

Weg laut Recherche: Händlerbereich („dealer area“) unter SERVICE auf burg.biz mit Bildarchiv (Login nötig, https://burg.biz/en/blogs/burg-guard-news); eine Ansprechstelle für die Logofreigabe ist nicht belegt.

> Betreff: Bitte um Freigabe des BURG-WÄCHTER-Logos und Ihrer Markenvorgaben
>
> Sehr geehrte Damen und Herren,
>
> wir sind [Firma laut Impressum], ein Schlüsseldienst mit Werkstatt in [Ort]. Wir arbeiten mit elektronischen Zylindern der Reihe secuENTRY pro von BURG-WÄCHTER und möchten das auf schluesselmacher24.de sachlich zeigen: auf der Startseite im Bereich „Systeme, mit denen wir arbeiten“ und auf unserer Seite zu elektronischem Zutritt.
>
> Bis zu Ihrer Freigabe nennen wir nur den Namen BURG-WÄCHTER in unserer eigenen Schrift. Bitte teilen Sie uns mit,
> 1. ob und in welcher Form wir das BURG-WÄCHTER-Logo nutzen dürfen,
> 2. ob wir es aus dem Bildarchiv im Händlerbereich laden dürfen oder wie wir Zugang erhalten und
> 3. welche Markenvorgaben gelten.
>
> Unsere Händler- oder Kundennummer: [Nummer].
>
> Mit freundlichen Grüßen
> [Name, Firma, Kontakt]

Nach einer Freigabe: Logo im Backend unter Shop › Hersteller hochladen, Haken „Freigabe liegt vor“ setzen, in „Wer hat wann zugestimmt?“ Absender und Datum eintragen.

## OFFENE FRAGEN

1. Zutritts-Konfigurator: Das Paket nennt „die leere Herstellerliste“ dort; es gibt sie nicht, und der Konfigurator schließt Systeme bewusst aus. Soll er die Hersteller zeigen (etwa als ruhiger Hinweis vor dem ersten Schritt oder als optionale Frage nach einem bevorzugten Hersteller), oder war der Sperrschließungs-Konfigurator gemeint (dort bleibt der Herstellerschritt ohne Preisdaten aus, Schritt 4)? Nicht geraten, nicht gebaut.
2. Fehlendes Feld: Die Sammlung `Hersteller` braucht für die Pflege ohne Entwickler ein Feld „Bereiche“ (Mehrfachauswahl Sperrschließungen, elektronischer Zutritt) und einen Einsatztext je Bereich. Heute liegen beide in `src/components/hersteller/bereiche.ts`. Folgepaket mit additiver Migration?
3. Zylinderkatalog mit Stamm verbinden: braucht eine Migration (siehe WAS UND WARUM, Punkt 8); in diesem Paket gelassen.
4. Systemnamen: Soll die Seite belvius, SE, wAppLoxx und secuENTRY pro nennen? Belegt ist, dass die Hersteller sie führen; nicht belegt ist, welche davon die Werkstatt tatsächlich verbaut. Der Inhaber sollte die Einsatztexte bestätigen oder kürzen.
5. ABUS-Texte stützen sich nur auf Suchausschnitte der Herstellerseiten (Recherche 06, Offene Frage 3 und 8). Vor dem Livegang auf abus.com gegenlesen.
6. Rechtliche Einordnung der Namensnennung ohne Freigabe (§ 23 MarkenG, Recherche 06, Abschnitt 4) liegt nicht vor (R10). Der Hinweissatz unter den Karten ist ein Entwurf zur Prüfung.

## FÜR MENSCHEN

- Die drei Anschreiben prüfen, ergänzen und selbst versenden; Logos erst nach schriftlicher Freigabe hochladen.
- Einsatztexte und genannte Systemnamen bestätigen (Offene Frage 4).
- Entscheiden, ob der Zutritts-Konfigurator Hersteller zeigen soll (Offene Frage 1).
- Rechtliche Prüfung der Markennennung (Offene Frage 6).

## Nachbesserung (15.11.2026, nach zwei Gegenprüfungen)

1. [rot] `src/payload/collections/Hersteller.ts:27`, Admin-Beschreibung „erscheinen mit dem nächsten Ausbau der Shopseiten“: **trifft zu, nicht im Code behoben**, weil die Datei außerhalb der Schreibrechte liegt. Seit diesem Paket macht der Haken „angeboten“ den Hersteller sofort sichtbar (`herstellerFuerAnzeige` filtert auf `angeboten`). Vorschlag für Orchestrator oder Folgepaket, wörtlich: „Mit dem Haken „angeboten“ erscheint der Hersteller sofort auf der Startseite und, wenn ihm ein Bereich zugeordnet ist, auf den Seiten Sperrschließungen und elektronischer Zutritt. Ein Logo erscheint nur mit Datei und Haken „Freigabe liegt vor“.“ Neu unter GEMEINSAME DATEIEN und OFFENE FRAGE 7.
2. [gelb] `Hersteller.ts:49`, Feld `einsatz` für BKS, ABUS und BURG-WÄCHTER wirkungslos: **trifft zu, nicht im Code behoben** (Datei außerhalb der Schreibrechte). Für zugeordnete Hersteller zeigen die Karten die Texte aus `HERSTELLER_BEREICHE`; `einsatz` erscheint nur bei Herstellern ohne Zuordnung (und auf der Herstellerseite des Shops aus FA-SHOP-01B). Als Pflegefalle unter OFFENE FRAGE 2 ergänzt, mit Vorschlag für die Feldbeschreibung.
3. [gelb] Produktreihen in den Einsatztexten: **behoben**. `bereiche.ts` nennt nur noch Hersteller und Einsatzzweck ohne Reihennamen (BKS: Schließzylinder für Gleichschließungen und Schließanlagen; elektronische Schließsysteme mit Zylindern, Beschlägen, Wandlesern und Transpondern. ABUS: Zutrittssysteme mit Wandlesern und batteriebetriebenen Zylindern für kleine bis mittlere Objekte und Einfamilienhäuser. BURG-WÄCHTER: elektronische Zylinder für Unternehmen, Behörden und Privatnutzer). Die Aussage, dass Transponderrechte zeitlich begrenzbar sind, ist entfallen, weil sie nur für SE belegt ist. Dasselbe in `content/hersteller.json` und `src/lib/data/defaults/hersteller.ts` (Feld `einsatz`, gleichlautend). Neuer Test „nennt keine Produktreihen, solange der Inhaber sie nicht bestätigt hat (R4)“. Abnahmebedingung: Vor dem Livegang gibt der Inhaber die Einsatztexte frei (OFFENE FRAGE 4).
4. [gelb] Satzbruchstück „Kurz erklärt, wofür sie eingesetzt werden.“: **behoben**. Neu: „Wir arbeiten mit Systemen von BKS, ABUS und BURG-WÄCHTER. Auf den Karten steht, wofür ihre Systeme eingesetzt werden.“ (bewusst nicht „wofür wir sie einsetzen“, das wäre eine unbelegte Aussage über den Einsatz der Werkstatt). Test angepasst.
5. [gelb] Gleicher Ton wie Abschnitt 01: **behoben**. Beide Rubrikseiten übergeben `tone="sunken"`; Nachbarn sind `default` (davor) und `muted` (danach). Baustein unverändert.
6. [gelb] Rückfall bei leerer Sammlung: **trifft zu, als Hinweis festgehalten** (OFFENE FRAGE 8). Das Verhalten des Adapters gehört dem Datenschicht-Paket.

Ergänzte offene Fragen:

2a. Pflegefalle zu Frage 2: Bis es ein Bereichsfeld gibt, ändert eine Korrektur am Feld „Wofür die Systeme eingesetzt werden“ bei BKS, ABUS und BURG-WÄCHTER nichts an Startseite und Rubrikseiten. Vorschlag für die Feldbeschreibung in `Hersteller.ts`: „Erscheint nur bei Herstellern ohne Bereichszuordnung. Für BKS, ABUS und BURG-WÄCHTER zeigen Startseite und Bereichsseiten einen eigenen Text.“
7. Admin-Beschreibung der Sammlung `Hersteller` (`src/payload/collections/Hersteller.ts`, Zeile 27) ist seit diesem Paket falsch; Text siehe Nachbesserung 1. Außerhalb der Schreibrechte.
8. Leere Sammlung: `payload-adapter.ts` (Zeile 133) fällt bei leerer Sammlung auf die Defaults zurück. Löscht der Betrieb alle Hersteller im Backend, erscheinen BKS, ABUS und BURG-WÄCHTER trotzdem. Ausblenden geht nur über den Haken „angeboten“. Änderung, falls gewünscht, im Datenschicht-Paket.

Gemeinsame Dateien (Nachtrag): `src/payload/collections/Hersteller.ts` (Beschreibungen der Sammlung und des Felds `einsatz`) braucht eine Änderung, die nicht in diesem Paket liegt.

Prüfung nach der Nachbesserung, über die Datenweiche:
- `npx vitest run`: 214 Dateien, 3381 Tests, alle grün.
- `npm run lint`: ohne Fehler.
- `npm run typecheck`: 3 Fehler, zweimal gelaufen, alle in fremden Dateien: `.next/types/validator.ts` (veralteter Verweis auf `schluessel-nach-code/kategorie/[familie]`, Umbenennung aus FA-SHOP-01B) und `src/components/seo/json-ld.test.ts:172`. Keiner in Dateien dieses Pakets.

## ABNAHME (Orchestrator, 15.11.2026)

- **Startseite:** `HerstellerBereich` ist eingebunden, nach „Ohne Termin bestellen oder anfragen“ und vor „Projekte“ (`src/app/(site)/page.tsx`, Daten aus `getHersteller()`, Ton `sunken`). Damit erscheinen BKS, ABUS und BURG-WÄCHTER beim normalen Scrollen, als Schriftzug in der Seitenschrift, ohne Logo.
- **Hilfetexte im Admin berichtigt** (Befunde 1 und 2): Die Sammlung Hersteller sagt jetzt, dass der Haken „angeboten“ sofort wirkt und ein Logo nur mit Datei und Freigabe erscheint; das Feld „Wofür die Systeme eingesetzt werden“ sagt, dass die drei genannten Hersteller zurzeit feste Texte je Bereich zeigen.
- **Entschieden:** Der Zutritts-Konfigurator bleibt ohne Herstellerliste (er fragt den Bedarf ab, kein System). Ein Feld „Bereiche“ an der Sammlung und die Verbindung des Zylinderkatalogs mit dem Stamm brauchen ein Datenschema und kommen mit FA-SHOP-04. Produktreihen der Hersteller stehen nicht auf der Seite, bis der Inhaber sie bestätigt (MA-48).
- Typprüfung und Lint der Dateien dieses Pakets ohne Fehler; die drei Typfehler im gemeinsamen Lauf gehören zum gleichzeitig laufenden FA-SHOP-01B (umbenannte Route, `json-ld.test.ts`). Build und Sichtprobe folgen mit dessen Abnahme.
- **Für Menschen:** MA-48 (Einsatztexte freigeben, Anschreiben zur Logo-Freigabe versenden, Markennennung rechtlich prüfen lassen).
