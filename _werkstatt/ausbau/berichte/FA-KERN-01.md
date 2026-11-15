# Bericht FA-KERN-01 · Fahrzeugdatenbank: Klasse, Krafträder und seltene Marken aus KBA FZ 2, Generationen als Struktur

Stand: 15.11.2026, Fortsetzung nach Abbruch. Der Zwischenstand aus Commit 8c26b50 wurde gegen die Paketdatei geprüft, behalten, wo er stimmte, und an fünf Stellen berichtigt (siehe unten).

## GEÄNDERTE DATEIEN
- content/fahrzeugkatalog.json (neu erzeugt aus FZ 2, wiederholbar)
- scripts/fahrzeuge-import-fz2.mjs (neu), scripts/fahrzeuge-import-fz2.test.ts (neu)
- scripts/fahrzeuge-generationen-import.mjs (neu), scripts/fahrzeuge-generationen-import.test.ts (neu)
- src/payload/collections/Fahrzeugreihen.ts (Feld „klasse“, Spalte „Klasse“, Feldgruppe „Generationen“)
- src/migrations/20261115_140000_fahrzeugklasse.ts und .json, src/migrations/index.ts (additiv)
- src/payload-types.ts (über generate:types; erneut erzeugt, unverändert)
- src/lib/types.ts (FahrzeugKlasse, FahrzeugGeneration, FahrzeugReihe.klasse und .generationen)
- src/lib/data/payload-mapping.ts (nur Fahrzeugreihen: klasse, generationen)
- src/lib/fahrzeuge/katalog.ts (FAHRZEUGKLASSEN, klasseVon, Bestand als pkw), src/lib/fahrzeuge/suche.ts (Klassenfilter, Generationen als Treffertext, UNTERMARKEN), src/lib/fahrzeuge/fahrzeuge.test.ts
- src/components/autoschluessel/fahrzeug-suche.tsx (Nachladen über useKatalog), fahrzeug-ziel.ts (Index je Klasse, Adressen, Quellenvermerke, markenAZ), fahrzeug-ziel.test.ts
- src/app/(site)/autoschluessel/anfrage/page.tsx, assistent.tsx (nur Fahrzeugschritt und Generationsauswahl), anfrage/fahrzeuge/route.ts (neu)
- src/app/(site)/autoschluessel/marken/page.tsx (Marken A bis Z)
- src/app/(site)/motorradschluessel/anfrage/anfrage-formular.tsx, kern.ts (Kommentar), motorrad-suche.tsx (neu), fahrzeuge/route.ts (neu)
- _werkstatt/ausbau/QUELLEN.md (Eintrag KBA FZ 2)
- seed.ts und defaults/fahrzeugkatalog.ts brauchten keine Änderung: Der Seed-Plan „fahrzeugreihen“ übernimmt über fahrzeugreiheZuPayload, das klasse und generationen trägt; der Startwert ohne JSON setzt über reihenAusBestand „pkw“.

## WAS UND WARUM
1. Klasse: Feld `klasse` (pkw, kraftrad) an jeder Zeile; die Auswahlliste FAHRZEUGKLASSEN macht eine weitere Klasse zu einem Eintrag. Migration nur additiv: Enum, Spalte mit Standard „pkw“ (jede vorhandene Zeile bleibt Pkw), Index, neue Tabelle für Generationen. Admin: Spalte „Klasse“ vorn in der Liste; als indizierte Auswahl ist sie im Listenfilter wählbar.
2. Krafträder: `scripts/fahrzeuge-import-fz2.mjs` liest die xlsx mit Bordmitteln (Zip-Verzeichnis, node:zlib, XML-Muster), keine neue Bibliothek, keine abgeleitete CSV. Befehl: `node scripts/fahrzeuge-import-fz2.mjs [--trocken] [--liste]`. FZ 2.6: je Hersteller und Handelsname eine Zeile, Bestände (Spalte Deutschland) über Typschlüssel summiert; die Summen je Hersteller und INSGESAMT müssen mit dem KBA aufgehen, sonst Abbruch. Sammelzeilen (SONSTIGE/NICHT GETYPT, ZUSAMMEN, SONSTIGE HERSTELLER) sind keine Modelle. Markenname nach fester Regel (Länderkürzel weg, Titelschreibung, Kurzwörter, Punkte und Ziffern nur über die Aliasliste HERSTELLER_ALIAS, sonst Abbruch statt Raten).
3. Seltene Automarken: FZ 2.2 gegen den FZ-12-Katalog über kompakte Namen (`entsprichtReihe`, Regel im Skript beschrieben und mit echten Namen getestet: Golf Variant, E 220 CDI, 320D, V40, S 40, DS 3 Cabrio, SX4). Markenworte im Handelsnamen (CUPRA LEON unter SEAT (E), ABARTH 500 und 500 ABARTH unter FCA (I), BMW ALPINA B3, Genesis GV80) gehen dem Hersteller vor. Nicht übernommen und gelistet: Namen ohne sichere Marke, Namen, die genau wie eine Reihe einer anderen Marke heißen (Kooperationsmodelle), reine Ausstattungswörter, Wohnmobil-Aufbauten.
4. Quellenvermerk je Zeile getrennt für FZ 12 und FZ 2 im Wortlaut des Impressums; sichtbar klein am Ende der Fahrzeugsuche im Assistenten, der Markenübersicht und des Fahrzeugschritts im Motorradweg. QUELLEN.md mit Datei, Stand, Größe, SHA-256 und Lizenzwortlaut.
5. Generationen: Unterfeld `generationen` (Bezeichnung, Baujahr von, Baujahr bis, Quelle), im Admin pflegbar, im JSON tragbar, in der Suche Treffertext. `scripts/fahrzeuge-generationen-import.mjs` liest eine CSV (marke, reihe, generation, baujahr_von, baujahr_bis, quelle) aus eingang oder daten, übernimmt nur eindeutige Reihen und listet den Rest. Es liegt keine Datei vor; es wurden keine Generationen eingetragen. Im Assistenten erscheint die Auswahl nur bei Reihen mit Generationen und grenzt die Jahre ein; sonst bleibt das Baujahr.
6. Suche und Wege: `sucheFahrzeuge(…, { klasse })`; Assistent sucht in pkw, Motorradweg in kraftrad. Die freie Eingabe im Motorradweg bleibt („Fahrzeug nicht gefunden? Tragen Sie Hersteller und Typ selbst ein.“). Untermarken Abarth, Alpina, Cupra, Genesis in der Suche (FA-06-U3); ein Test hält die Liste in Import und Suche gleich. Markenübersicht zeigt alle Automarken A bis Z; Marken ohne Markenseite führen in die Anfrage, keine neuen Seiten (R2).
7. Zeilen aus FZ 2: `leistungen: []`, klonbar und gehaeuse „unbekannt“, kein Transponder, kein gepflegtes Modell; ein Treffer führt in Prüfung oder Anfrage.
8. Leistung: Der Katalog lag bisher im Seitenaufruf des Assistenten (RSC-Daten). Jetzt kommt er aus zwei statischen Routen (`/autoschluessel/anfrage/fahrzeuge`, `/motorradschluessel/anfrage/fahrzeuge`, force-static, noindex) und wird erst beim ersten Fokus auf das Suchfeld geladen. Das Erneuern nach Backend-Änderungen deckt der bestehende Hook `revalidatePath('/', 'layout')` ab (laut node_modules/next/dist/docs, revalidatePath, auch für Route Handler).

Berichtigungen an diesem Lauf (der Zwischenstand hatte 5 rote Tests und 7 Typfehler):
- Abgleich: Eine Reihe aus Ziffern galt als Treffer für jedes Wort mit Buchstaben davor (MX-3 → Mazda 3, M3 → DS 3). Regel d) jetzt erst ab zwei Ziffern; Präfixregel a) nimmt nach einer Ziffer keine weitere Ziffer an („400“ ist nicht Volvo 40). Folge: Mazda MX-3 (378 Fahrzeuge) ist jetzt eine eigene Reihe, sonst keine Änderung im Katalog.
- Sortierung: Klassen in der Reihenfolge von FAHRZEUGKLASSEN (erst pkw), nicht alphabetisch; Test hält beide gleich.
- Test zum Kürzen auf 25 Zeichen hatte Eingaben mit 25 und 26 Zeichen vertauscht; berichtigt.
- Index- und Rundweg-Tests kannten klasse und generationen nicht; ergänzt, dazu neue Tests für Klassenfilter, Generationen als Treffertext, Untermarken, Marken A bis Z, „auffindbar, nicht buchbar“, eindeutige Kennungen und getrennte Quellenvermerke.
- Typprüfung: JSDoc-Typen im Importskript statt Lockerung der Prüfung.

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 187 Dateien, 2427 Tests bestanden.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 16 Dateien, 99 Tests bestanden (mit Migration).
- `sicher.sh --json -- npm run build`: erfolgreich, 168 Seiten erzeugt; beide Katalogrouten statisch (○).
- `sicher.sh --json -- npm run generate:types`: src/payload-types.ts unverändert.
- Importlauf zweimal hintereinander: Ausgabe byteweise gleich (wiederholbar).

Zählung:
- Vorher: pkw 63 Marken, 624 Reihen; kraftrad 0.
- Nachher: pkw 72 Marken, 1.014 Reihen (390 neu aus FZ 2.2); kraftrad 57 Marken, 1.909 Reihen; insgesamt 2.923 Zeilen.
- Neue Automarken: Abarth, Alpina, Cupra, Daewoo, Daimler, Genesis, Rover, Trabant, Wartburg.
- FZ 2.6: 2.887 Typzeilen, 74 KBA-Hersteller als 57 Marken (zusammengeführt etwa HONDA (J) und HONDA MOTOR), 1.909 Handelsnamen; 79 Sammelzeilen übersprungen (1.438.872 Krafträder), 34 Zeilen ohne Handelsnamen (18.121); benannt 3.366.482 von 5.071.468 Krafträdern. Abgelehnte Herstellernamen: 0 (die Regel bricht ab; alle Sonderfälle stehen in HERSTELLER_ALIAS).
- FZ 2.2: 16.524 Typzeilen; 79 Sammelzeilen, 22 ohne Handelsnamen, 558 Wohnmobil-Aufbauten (470.740), 12.995 entsprechen einer vorhandenen Reihe, 40 nur Markenname; gelistet und nicht übernommen: 803 ohne sichere Marke, 92 mit dem Namen einer Reihe einer anderen Marke, 235 nur Ausstattungswörter (`--liste` zeigt sie).
- Ausgelieferte Katalogdaten (JSON, ohne und mit gzip): vorher 56.663 Byte (9.648) für 624 Zeilen, eingebettet in den Seitenaufruf des Assistenten. Nachher im ersten Laden 0 Byte; nachgeladen pkw 90.153 Byte (14.537) für 1.014 Zeilen, kraftrad 252.716 Byte (33.281) für 1.909 Zeilen, nur auf Fokus des Suchfelds.

## BELEGE
Stichproben gegen fz2_2026.xlsx (SHA-256 8dc0b15c…49a4, 4.680.834 Byte), Spalte Deutschland, im Test „Stichproben gegen KBA FZ 2 (lokal)“ festgehalten:
1. KAWASAKI (J), Handelsname „Z900“ (13 Typschlüssel, Zeilen 1343 bis 1355 in FZ 2.6, zusammen 20.349) und „Z900,Z900 ABS“ (AFG, 6.359): Katalog Kawasaki Z900, Bestand 26.708.
2. APRILIA (I), „PEGASO 650“, Typschlüssel 109, Zeile 31: 521; Katalog Aprilia Pegaso 650, Bestand 521.
3. ZUENDAPP-WERKE, „BELLA 203“, Typschlüssel 203, Zeile 2960: 144; Katalog Zündapp Bella 203, Bestand 144.
Untermarke: SEAT (E), „CUPRA LEON“ ab Zeile 12872 in FZ 2.2 → Katalog Cupra Leon (81.015). Impressum, Zeile Nutzungsbedingungen: „© Kraftfahrt-Bundesamt, Flensburg“ / „Datenlizenz Deutschland - Namensnennung - Version 2.0“; das Skript bricht ab, wenn dieser Wortlaut oder der Stand „1. Januar 2026“ fehlt.

## OFFENE FRAGEN
- Doppelte Treffer über Untermarken: Das KBA führt in FZ 12 manche Cupra-Modelle unter SEAT (etwa Formentor, Born). „Cupra Formentor“ findet deshalb SEAT Formentor; eine eigene Reihe Cupra Formentor entsteht nicht. Soll die Anzeige solche Reihen als Cupra führen? Das wäre eine redaktionelle Umbenennung ohne amtlichen Beleg und ist hier nicht gemacht.
- 803 Pkw-Handelsnamen ohne sichere Marke (Hersteller mehrerer Marken wie FCA, Stellantis, GM, Jaguar Land Rover ohne Markenwort im Namen) sind nicht übernommen. Eine Zuordnung bräuchte eine belegte Liste; Durchsicht mit `--liste`.
- Der Kraftrad-Index ist mit 253 KB (33 KB gzip) groß. Bei Bedarf könnten Aliase oder sehr seltene Handelsnamen ausgelassen werden; das ist eine Abwägung zwischen Auffindbarkeit und Ladegröße.
- Markenübersicht: 9 neue Marken führen in die Anfrage. Ob einzelne davon (etwa Cupra) eine eigene Markenseite mit gepflegten Preisen bekommen, ist eine Inhaber-Entscheidung (G9).

## FÜR MENSCHEN
- Generationen mit Bauzeitraum: Es gibt keine amtliche Quelle; Wikidata (CC0) darf wegen robots.txt nicht automatisch abgefragt werden. Ein Mensch kann die vorbereitete Abfrage (erhebung/E1-fahrzeugquellen.md, Abschnitt 2) im Browser ausführen oder eine lizenzierte Fahrzeugdatenbank beschaffen und eine CSV nach `_werkstatt/ausbau/eingang/fahrzeug-generationen.csv` legen; danach `node scripts/fahrzeuge-generationen-import.mjs`. Das Skript füllt nur den JSON-Stand (content/fahrzeugkatalog.json, Startwert des Seeds). Im Betrieb mit Datenbank gleicht der Seed-Plan „fahrzeugreihen“ vorhandene Zeilen nicht ab (`abgleich: []`); dort werden Generationen im Admin gepflegt, oder es braucht einen eigenen Abgleich nur für das Feld generationen.
- E-Scooter, Mofas mit Versicherungskennzeichen, Seniorenmobile und Fahrräder: keine belegte Datenquelle. Eine lizenzierte Quelle oder ein gepflegter Import muss beschafft werden; bis dahin bleibt dafür die freie Anfrage.
- Klonbarkeit, Gehäuse und Leistungen für Zeilen aus FZ 2 kann nur der Betrieb bestätigen (Bogen KLONBAR); ohne Bestätigung bleiben sie Prüfung oder Anfrage.
- Freigabe des Quellenvermerks im Wortlaut der Datenlizenz (R10, nur zur Prüfung).
- Migration auf der echten Datenbank und Seed laufen erst beim Livegang (G3).

## Nachbesserung (Gegenprüfung, 15.11.2026)
Geänderte Dateien: scripts/fahrzeuge-import-fz2.mjs, scripts/fahrzeuge-import-fz2.test.ts, scripts/fahrzeuge-import.mjs, scripts/fahrzeuge-generationen-import.mjs (Kopf), content/fahrzeugkatalog.json (neu erzeugt), src/app/(site)/motorradschluessel/anfrage/motorrad-suche.tsx, src/app/(site)/autoschluessel/marken/page.tsx, src/app/(site)/autoschluessel/anfrage/assistent.tsx (nur payload), dieser Bericht.

1. [rot] „oder“ ohne Wortgrenze: behoben. `teile()` trennt an „oder“ und „or“ nur als eigenes Wort, an „od.“ und „o.“ weiter auch ohne Leerzeichen danach („JB od.RIO“, „PARTNER OD.RANCH“). Tests mit „Chevrolet Orlando“, „BRUTALE ORO;BRUTALE S“, „Carens or Rondo“. Nach dem Lauf ist chevrolet-lando weg; „Chevrolet Orlando“ findet genau eine Zeile; MV Agusta hat jetzt „Brutale ORO“ (437) statt den Bestand in „Brutale“ zu mischen.
2. [rot] MINI unter BMW: behoben. Neue Liste HANDELSNAMEN_MARKE (BMW → MINI: Countryman, Clubman, Aceman, JCW, JohnCooperWorks, John Cooper Works, Cooper, One), belegt durch Handelsnamen derselben Datei mit Markenwort („One,One Countryman,MINI“, „Cooper Clubman,MINI“, „John Cooper Works,MINI“). bmw-countryman, bmw-clubman, bmw-aceman, bmw-jcw, bmw-johncooperworks und mini-john-cooper sind weg; neu mini-countryman (42.947), mini-clubman (37.362), mini-aceman (5.377), mini-john-cooper-works (27.017, JCW und Schreibweisen zusammengeführt). „Mini Countryman“, „Mini Clubman“, „Mini John Cooper Works“ liefern im Test den MINI-Treffer zuerst; „BMW Countryman“ findet nichts mehr.
3. [rot] FZ-12-Lauf löscht FZ-2-Zeilen: behoben. `fahrzeuge-import.mjs` liest den vorhandenen Katalog und übernimmt über `behalteBestand` alle Zeilen aus FZ 2 oder einer anderen Klasse als pkw, setzt die Klasse und behält Generationen je Kennung; fiele eine Zeile mit Generationen weg, bricht der Lauf ab. Der Kopf und die Ausgabe nennen die Reihenfolge (danach FZ 2 erneut). Test „übersteht FZ 12 und FZ 2 hintereinander ohne Verlust“; dazu am echten Katalog geprüft: FZ-12-Zeilen ohne Klasse und Generationen durch `behalteBestand` ergeben den Katalog byteweise gleich (2.290 Zeilen behalten). Die FZ-12-CSV liegt in dieser Umgebung nicht unter daten/kba; den Lauf selbst konnte ich deshalb nicht ausführen.
4. [rot] Gepflegtes geht beim FZ-2-Lauf verloren: behoben. `fuehreZusammen` übernimmt je Kennung GEPFLEGTE_FELDER (generationen, bestandsModell, transponder, sichtbar) der früheren FZ-2-Zeile; Aliase bildet das Skript selbst und bildet sie neu, weil gepflegte und gebildete Aliase sich nicht unterscheiden lassen. Fiele eine Zeile mit gepflegten Angaben weg, bricht der Lauf mit ihrer Kennung ab. Kopfkommentar berichtigt. Tests: Zeile mit Generation und sichtbar false übersteht den Wiederholungslauf; Wegfall bricht ab.
5. [gelb] „Kia LD/Kia Cerato“: behoben. Ein Schrägstrich trennt im Pkw-Teil, wenn danach ein Markenwort folgt; „318I/CABRIO“ oder „200 D/8“ bleiben ganz. kia-ld-kia ist weg, die Zeile entspricht Kia Cerato.
6. [gelb] „Škoda Suberb“: behoben. KBA_SCHREIBVARIANTEN (Škoda: SUBERB → SUPERB) bildet den Schreibfehler auf die vorhandene Reihe ab; skoda-suberb ist weg, „Skoda Superb“ findet eine Zeile. Der Lauf gibt zusätzlich einen Prüfhinweis für neue Reihen mit Tippfehlerabstand 1 zu einer Reihe derselben Marke aus; heute 5 Hinweise (eVito, XCeed, e-NV200, NV400 gegen NV200 und NV300), alle echte Modelle, keine weiteren Schreibfehler.
7. [gelb] Umschreibungen ohne Umlaut: behoben. UMLAUT_WOERTER (Käfer, Kapitän, Militär, Behörde, Gelände, Geländewagen) nur als ganze Wörter; BLUETEC, PHAETON, ZOE bleiben. Neu volkswagen-kafer „Käfer“, opel-kapitan-p-l „Kapitän-P-L“, kraftrad-bmw-f-650-gs-militar; kbaName behält den KBA-Wortlaut. „Vespa SEI Giorni“ ist keine Umlautfrage („SEI“ bleibt als Dreibuchstabenwort groß) und bleibt so.
8. [gelb] Beispiel „Vespa GTS“: behoben, das Beispiel heißt jetzt „Vespa GTS 125“ und trifft als Erstes Piaggio Vespa GTS 125 (Test). Ursache ist kein Tippfehler, sondern der Alias „Vespa GTS“ an der Reihe Vespa GTV aus dem KBA-Namen „VESPA GTV,VESPA GTS…“; die Gewichtung der Suche bleibt unverändert.
9. [gelb] Generationen-Import und Datenbank: zutreffend, im Bericht (FÜR MENSCHEN) und im Skriptkopf berichtigt: Das Skript füllt nur den JSON-Stand; im Betrieb mit Datenbank Pflege im Admin oder ein eigener Abgleich nur für generationen.
10. [gelb] „12 Modellreihen, Anfrage“: behoben. Unter Marken ohne eigene Seite steht jetzt eine eigene Zeile „Wir prüfen Ihr Fahrzeug auf Anfrage.“
11. [rot] Doppelmeldung zu 1: behoben wie dort.
12. [rot] Markenwort Teil der FZ-12-Reihe: behoben. Teile mit Markenwort werden zusätzlich mit genauem Schlüssel gegen die Reihen der Marke geprüft („WEY 05“ → GWM WEY 05, „MG TF“ → MG Rover MGF, MG TF; nur genau, damit „MINI COOPER“ nicht auf die Reihe „Mini“ fällt). Dazu REIHEN_VORSILBEN: FZ 12 führt MG-Modelle als „Roewe ZS“, FZ 2 als „MG ZS“; dadurch entfallen auch mg-zs, mg-marvel und mg-rx6. gwm-05 und mg-tf sind weg. Test mit den echten Namen unter GREAT WALL MOTOR (RC), MG ROVER (UK) und SAIC (RC); zusätzlich prüft ein Test am echten Katalog, dass diese Kennungen fehlen.
13. [rot] Doppelmeldung zu 4: behoben wie dort.
14. [gelb] Zahlen mit Kurzwort: behoben. Drei- und vierstellige Zahlen nehmen ein Kurzwort mit, das keine Ausstattung ist („200 SX“, „300 ZX“, „100 NX“); gibt es zur selben Zahl bei der Marke mehrere solche Namen oder führt der Katalog die Zahl schon, bleibt die Zahl die Reihe („230 CE“ und „230 SL“ → 230), sonst zerfielen die Mercedes-Klassiker in Dutzende Zeilen. NAMENSANFANG greift auch vor Wörtern mit Ziffern („Daimler Super V8“). Die Sammelreihe „Mercedes-Benz AMG“ (97.971) ist weg: Der Vorsatz AMG wird für den Abgleich abgelöst („AMG A 35“ → A-Klasse), übrig bleiben AMG EQE und AMG EQS als eigene Reihen, weil FZ 12 kein EQE und EQS führt. Tests zu „200 SX“, „300 ZX“, „SUPER V8“, „240 GL“, „AMG A 35“.
15. [gelb] Generation nicht im payload: behoben, `generation: data.generation || null` steht neben registrationMonth.

Prüfung nach der Nachbesserung:
- `sicher.sh --json -- npx vitest run`: 187 Dateien, 2.439 Tests bestanden (vorher 2.427; 12 neue in scripts/fahrzeuge-import-fz2.test.ts).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler. `… -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 16 Dateien, 99 Tests bestanden.
- `sicher.sh --json -- npm run build`: erfolgreich, 168 Seiten; beide Katalogrouten statisch (○).
- FZ-2-Lauf zweimal hintereinander: Ausgabe byteweise gleich.

Zählung neu: pkw 72 Marken, 1.004 Reihen (380 neu aus FZ 2.2, vorher 390); kraftrad 57 Marken, 1.910 Reihen (Brutale ORO kommt hinzu); insgesamt 2.914 Zeilen. FZ 2.2: 13.161 Typzeilen entsprechen einer Reihe, 227 nur Ausstattungswörter, 803 ohne sichere Marke, 92 Name einer anderen Marke. Ausgelieferte Katalogdaten (gzip): pkw 89.417 Byte (14.548), kraftrad 252.847 Byte (33.180).

