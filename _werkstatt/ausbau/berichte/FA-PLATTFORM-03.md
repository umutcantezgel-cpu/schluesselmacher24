# FA-PLATTFORM-03 (Teil A) · Ortsstamm

Stand 16.11.2026. Teil A nach dem Zuschnitt: Ortsstamm, Import und Aktualisierung, Eindeutigkeit, Prioritätsliste als Datei, Postleitzahl-Abfrage, Quellen. Nicht angefasst: `Einsatzgebiete.ts`, `src/app/(site)/standorte/**`, `indexierung.ts`, `sitemap.ts`, `content/cities.json`, `src/lib/partner/**`, `src/payload/hooks/**`, Partnerbetriebe, die Dateien von FA-PLATTFORM-02B, `content/karte`.

## GEÄNDERTE DATEIEN

Neu:
- `scripts/orte-import.mjs`, `scripts/orte-import.test.ts`
- `content/orte/gemeinden.json` (2.569.854 Byte), `kreise.json` (33.726 Byte), `postleitzahlen.json` (1.157.730 Byte nach Nachbesserung 2), `prioritaet.json` (42.868 Byte), `LIZENZ.md`
- `src/lib/orte/typen.ts`, `index-stamm.ts`, `entfernung.ts`, `abfrage.ts`, `dateien.ts`, `stamm.ts` (server-only), `uebernahme.ts`, `uebernahme-lauf.ts`, `orte.test.ts`, `grenze.test.ts`, `stamm.test.ts`, `uebernahme.db.test.ts`
- `src/payload/collections/Orte.ts`
- `src/migrations/20261116_100017_orte_stamm.ts` und `.json`

Geändert:
- `src/payload.config.ts` (Sammlung `Orte` eingetragen)
- `src/migrations/index.ts`, `src/payload-types.ts` (erzeugt, nur Zusätze)
- `src/payload/seed.ts` (Schritt Ortsstamm, Option `ortsstamm`)
- `src/test/db-global-setup.ts` (`SM24_ORTSSTAMM: 'stichprobe'` für Seed und Testprozesse; Testinfrastruktur, als „zugehörige Tests“ gewertet)
- `_werkstatt/ausbau/QUELLEN.md` (Abschnitt Orte)

## WAS UND WARUM

1. Ortsstamm aus dem Gemeindeverzeichnis. `scripts/orte-import.mjs` liest die Jahresausgabe mit dem vorhandenen xlsx-Leser aus `scripts/fahrzeuge-import-fz2.mjs` (Bordmittel, keine neue Bibliothek, G7). Es prüft die Kopfzeilen (Satzart, Textkennzeichen, ARS-Teile, Postleitzahl, Längen- und Breitengrad) und bricht bei geänderter Spaltenfolge, unbekanntem Textkennzeichen, doppeltem Schlüssel, Gemeinde ohne Kreis oder abweichendem Ländernamen ab. Übernommen werden Satzart 40 (Kreise) und 60 (Gemeinden) ohne die gemeindefreien Gebiete (Textkennzeichen 65, 66). Schlüssel ist der achtstellige Amtliche Gemeindeschlüssel, daneben der Regionalschlüssel. Name und Bezeichnung werden am ersten Komma getrennt, die Art kommt aus dem Textkennzeichen.
2. Postleitzahlen aus GeoNames, ohne Großempfänger und Postfächer von Firmen und Behörden (Nachbesserung 2). Je Postleitzahl: Ortsnamen, Kreise, Gemeindeschlüssel und Mittelpunkt. Eine Gemeinde wird nur eindeutig zugeordnet: wenn der Kreis eine einzige Gemeinde hat, wenn der Name im Kreis genau einer Gemeinde gleicht (auch ohne Klammerzusatz) oder über die Postleitzahl des Verwaltungssitzes. Alles andere bleibt ohne Schlüssel, nichts wird geraten (R4).
3. Aktualisierung. Ein neuer Stand meldet Zugänge, Abgänge und Umbenennungen über den Gemeindeschlüssel (`staendeVergleichen`). Adressen bleiben über Stände gleich (`slugsVergeben` mit dem vorigen Stand). Gepflegte Ortsseiten fasst der Lauf nicht an. `--trocken` zeigt alles ohne zu schreiben. Ablauf in `content/orte/LIZENZ.md`, Abschnitt Aktualisierung.
4. Eindeutigkeit (A-051 Nr. 3). Adresse aus dem Namen. Gleichnamige Gemeinden bekommen den Kreis als Zusatz, heißt der Kreis wie die Gemeinde das Land, zuletzt den Schlüssel. Tests an echten Dubletten (Hof, Amberg, Mühlhausen, die Neustadt-Gemeinden). Ortsteile führt das Gemeindeverzeichnis nicht; sie bleiben Ortsnamen an der Postleitzahl ohne Schlüssel und auf einer Ortsseite freie Abschnitte (in LIZENZ.md dokumentiert).
5. Prioritätsliste. `anhangALesen` liest Anhang A aus dem Volltext (Seitenköpfe fallen weg, umbrochene Namen werden zusammengesetzt, Berlin und Hamburg stehen als Überschrift und Eintrag). Zuordnung nach Regeln „name“ (gleicher Name im Land, eindeutig), „ohne-klammer“ (amtlicher Name ohne Klammerzusatz, eindeutig) und „tabelle“ (geprüfte Tabelle `ZUORDNUNG_ANHANG_A`, gegen das Gemeindeverzeichnis geprüft, Lauf bricht bei Abweichung ab). Was keine Regel trifft, stünde als „offen“ mit Kandidaten in der Datei. Aus der Liste entsteht keine Seite.
6. Sammlung `Orte` (Gruppe Inhalte, Titel „Orte (Stamm)“): nur lesbar für das Team (create, update, delete immer verboten), Felder wie im Stamm plus Postleitzahlen als Text, `aktiv` und Gebietsstand. Migration `orte_stamm` geprüft: nur `CREATE TYPE enum_orte_art`, `CREATE TABLE orte` mit Indizes (Gemeindeschlüssel eindeutig) und die Spalte `orte_id` in `payload_locked_documents_rels`, die Payload für jede Sammlung braucht. Nichts Fremdes, nur additiv (G6).
7. Seed und Volllauf (Zusatz 1). `ortsstammUebernehmen` schreibt in Stapeln zu 500 per `INSERT … ON CONFLICT (gemeindeschluessel)`. Ein Vermerk (`sm24:orte-stamm`, Prüfsumme und Umfang) macht jeden weiteren Lauf ohne Änderung zu einem einzigen Lesezugriff. Abgänge werden nur im Volllauf auf „nicht aktiv“ gesetzt, nie gelöscht. Der Seed nimmt `SM24_ORTSSTAMM` (voll, stichprobe, aus; Standard voll). Die Datenbanktests laufen mit der Stichprobe (Lahn-Dill-Kreis und alle Orte der Prioritätsliste, 368 Gemeinden). Eigener Befehl für den Volllauf: `npx payload run src/lib/orte/uebernahme-lauf.ts` (mit `SM24_ORTSSTAMM_ERZWINGEN=1` auch bei gleichem Stand).
8. Nur auf dem Server (Zusatz 2). Die JSON-Dateien liest `dateien.ts` mit `node:fs`, nie per Import. Die Anwendung nutzt `stamm.ts` mit `import 'server-only'` (Index einmal je Prozess). `grenze.test.ts` prüft: `stamm.ts` beginnt mit `import 'server-only'`, keine Datei mit „use client“ importiert `stamm`, `dateien`, `uebernahme` oder `content/orte`, kein Modul importiert die JSON-Dateien, die reinen Module lesen keine Dateien. `uebernahme.ts` und `dateien.ts` tragen kein `server-only`, weil `payload run` die Bedingung „react-server“ nicht kennt; sie werden nur vom Seed und von `stamm.ts` benutzt. Nach dem Build steht kein Stammwert (etwa 06532023 oder 065320023023) in `.next/static` oder `.next/server`.
9. Postleitzahl-Abfrage (A-051 Nr. 7). Reiner Kern `postleitzahlAuskunft(plz, stamm, { eigenbereich, partner, leistung })` und die Serverfunktion `postleitzahlAbfragen(plz, leistung?)` in `stamm.ts`: Ort, Gemeinden, Kreise, Land, Eigenbereich (Einstellungen, sonst `35*`), Partner vorhanden (über `deckendePartner` aus `src/lib/partner/region.ts`, ohne Leistung mit dem Sammelwert für Autoschlüssel). Die Antwort nennt keinen Partner und keine Kennung. Ohne Datenbank gibt es keine Partner.
10. Entfernung (Auftrag aus FA-PLATTFORM-01B). `entfernungZwischenPostleitzahlen(plzA, plzB, stamm)` (rein) und `entfernungKm(plzA, plzB)` (Server): Großkreis zwischen den Mittelpunkten, auf 0,1 km gerundet, null wenn eine Postleitzahl fehlt. Luftlinie, keine Fahrstrecke.
11. Quellen. `content/orte/LIZENZ.md` mit Wortlaut der Vermerke, Prüfsummen, Veränderungshinweis, Verfahren und Aktualisierung; `QUELLEN.md` Abschnitt Orte; Kurzvermerke für Seiten als `ORTSSTAMM_QUELLEN` in `src/lib/orte/typen.ts` (Einbau auf den Seiten ist Teil B).

## PRÜFUNG UND ERGEBNIS

Zahlen (Gebietsstand 31.12.2025):
- Gemeinden: 10.751 (Satzart 60: 10.953, davon 202 gemeindefreie Gebiete nicht übernommen). Recherche nannte 10.775 für Ende 2023 (Sekundärquelle); plausibel.
- Kreise: 400 (97 kreisfreie Städte, 9 Stadtkreise, 42 Kreise, 251 Landkreise, 1 Regionalverband); Länder 16.
- Postleitzahlen (Stand nach Nachbesserung 2): 8.282 aus 23.296 GeoNames-Zeilen; 7.028 Zeilen und 2.533 Postleitzahlen (Großempfänger, Postfächer) entfallen. Gemeinde eindeutig in 12.612 der 16.268 übernommenen Zeilen, 358 weitere Zuordnungen über den Verwaltungssitz, 44 Verwaltungssitz-Postleitzahlen fehlen. 180 Postleitzahlen ohne Gemeindeschlüssel (Ortsteilnamen). 10.749 von 10.751 Gemeinden haben mindestens eine Postleitzahl (ohne: Oberzent, Wesertal). Alle 400 Kreise des Gemeindeverzeichnisses kommen in GeoNames vor. Erste Fassung: 10.815 Postleitzahlen, darunter rund 3.400 Firmen- und Behördennamen.
- Anhang A: 348 Einträge (BW 38, BY 37, BE 1, BB 18, HB 2, HH 1, HE 35, MV 12, NI 35, NW 67, RP 22, SL 9, SN 19, ST 16, SH 19, TH 17, wie im Abgleich). Zugeordnet 348, offen 0: 332 nach Name, 5 ohne Klammer (Singen, Kempten, Oberursel, Langen, Oldenburg), 11 über die Tabelle (Amberg, Weiden in der Oberpfalz, Neumarkt in der Oberpfalz, Cottbus, Senftenberg, Bad Homburg vor der Höhe, Limburg an der Lahn, Neunkirchen Saar, Bautzen, Hoyerswerda, Lutherstadt Wittenberg). 348 verschiedene Gemeindeschlüssel.
- Dateigrößen: gemeinden.json 2,57 MB, postleitzahlen.json 1,16 MB (vorher 1,64 MB), kreise.json 34 KB, prioritaet.json 43 KB (je Datensatz eine Zeile).

Prüfungen über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 252 Dateien, 3.977 von 3.977 Tests grün (darin 36 neue: 19 Import, 13 Stamm, 4 Grenze; der Rohdaten-Test lief, weil die Rohdateien lokal liegen).
- `sicher.sh --json -- npm run typecheck`: grün.
- `sicher.sh --json -- npm run lint`: grün.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 28 Dateien, 171 von 171 grün, 118,6 s. Der erste Lauf scheiterte an meinem eigenen Test: `seed.db.test.ts` ruft den Seed im Testprozess auf, dort fehlte `SM24_ORTSSTAMM`, so lief der Volllauf. Behoben, indem `db-global-setup.ts` die Variable an die Testprozesse weitergibt; im zweiten Lauf meldet jeder Seed-Aufruf „orte: aktuell (stichprobe)“.
- `sicher.sh --json -- npm run build`: 181 Seiten, 42,7 s (Kompilieren 10,0 s, Typprüfung 24,3 s, statische Seiten 4,3 s). Vorher laut FA-PLATTFORM-01B ebenfalls 181 Seiten. Eine Dauer für „vorher“ habe ich nicht gemessen (ohne git kein sauberer Stand vor dem Paket); das Paket fügt keine Route hinzu und erzeugt keine Seite je Gemeinde.
- Volllauf gegen das lokale Postgres der Datenweiche (`--pg`, Migration dort angewandt): erster Lauf 10.751 geschrieben, 3,4 s mit Start von Payload; zweiter Lauf „aktuell“, 2,4 s; erzwungen 3,5 s, 0 neu, 0 umbenannt, 0 nicht mehr aktiv.

## BELEGE

Drei Stichproben gegen die Rohdateien (Werte in `orte-import.test.ts` fest geprüft; der Test „Rohdateien“ vergleicht außerdem alle Kreise und alle Postleitzahlen mit einem neuen Lesen der Rohdateien):
- Wetzlar: Rohzeile Satzart 60, Textkennzeichen 63, Land 06, RB 5, Kreis 32, VB 0023, Gem 023, „Wetzlar, Stadt“, Bevölkerung 54865, Postleitzahl 35578, Länge 8,501069, Breite 50,554439. Stamm: `06532023`, Regionalschlüssel `065320023023`, Name Wetzlar, Bezeichnung Stadt, Art stadt, Adresse wetzlar, plz 35578, 50.55444 / 8.50107, 54.865 Einwohner.
- Lahn-Dill-Kreis: Rohzeile Satzart 40, Textkennzeichen 44, 06 5 32. Stamm: `06532`, Lahn-Dill-Kreis, landkreis, Land 06.
- 35576: GeoNames-Zeile „DE 35576 Wetzlar Hessen HE Regierungsbezirk Gießen 065 Lahn-Dill-Kreis 06532 50.5665 8.5247 4“. Stamm: Orte [Wetzlar], Kreise [06532], Gemeinden [06532023], 50.5665 / 8.5247. Wetzlar hat im Stamm die Postleitzahlen 35576 bis 35586.

Entfernung, drei Stichproben: Wetzlar 35576 und Gießen 35390 10,8 km (von Hand nachgerechnet: 2,05 km Nord-Süd, 10,57 km Ost-West); Berlin 10115 und Hamburg 20095 zwischen 250 und 262 km; Frankfurt 60311 und München 80331 zwischen 295 und 310 km; ein Breitengrad 111,2 km.

Adressen an echten Dubletten: `hof-bayern` und `hof-westerwaldkreis`, `amberg-bayern` und `amberg-unterallgaeu`, `muehlhausen-rhein-neckar-kreis`, `muehlhausen-erlangen-hoechstadt`, `muehlhausen-neumarkt-i-d-opf`, `muehlhausen-thueringen`; `neustadt-wied`, `neustadt-hessen`, `neustadt-an-der-weinstrasse` sind schon im amtlichen Namen verschieden. Alle 10.751 Adressen eindeutig.

## OFFENE FRAGEN

1. Amberg (Bayern, Rang 23): zwei Gemeinden heißen Amberg. Gewählt ist die kreisfreie Stadt 09361000 (rund 42.600 Einwohner), nicht die Gemeinde im Unterallgäu 09778111 (rund 1.550). Der Hinweis steht in `prioritaet.json`; bitte bestätigen.
2. Weitere Tabellenzuordnungen zur Bestätigung: Neunkirchen Saar → Neunkirchen, Kreisstadt (10043114, einzige im Saarland); Lutherstadt Wittenberg → „Wittenberg, Lutherstadt“ (15091375); die übrigen acht sind amtliche Abkürzungen oder zweisprachige Namen derselben Stadt.
3. G13: `content/orte/prioritaet.json` liegt nach A-051 und Paketauftrag im öffentlichen Repository. Der Abgleich (Block 04, Risiken) hielt Prioritätswerte für intern. Die Datei enthält nur Ortsnamen, Reihenfolge und Schlüssel, keine Zahlen, keine Partner und keinen Namen des Inhabers. Soll sie trotzdem nach `_werkstatt/ausbau/daten`?
4. Koordinaten der Gemeinden stammen laut Kopf der Datei vom BKG. Genügt der Destatis-Vermerk, oder braucht es zusätzlich den BKG-Vermerk (dl-de/by-2-0)? Vorsorglich in LIZENZ.md genannt.
5. GeoNames-Lizenz: Die heruntergeladene `readme.txt` nennt CC BY 4.0, die Recherche fand widersprüchliche Angaben (3.0 oder 4.0). Übernommen ist der Wortlaut der Datei.
6. Build-Dauer vorher: nicht gemessen (siehe oben). Für den Vergleich in Teil B dient 42,7 s bei 181 Seiten als Ausgang.
7. `src/test/db-global-setup.ts` liegt nicht ausdrücklich in den Schreibrechten; zwei Zeilen dort waren nötig, damit die Tests mit der Stichprobe laufen (Zusatz 1).

## FÜR MENSCHEN

- Inhaber: Zuordnungen Amberg, Neunkirchen und Lutherstadt Wittenberg bestätigen (Offene Fragen 1, 2).
- Inhaber oder Rechtsprüfung: Quellenvermerke Destatis und BKG, GeoNames CC BY 4.0 (Offene Fragen 4, 5); Entwürfe zur Prüfung (R10).
- Orchestrator: Entscheidung zu `prioritaet.json` und G13 (Offene Frage 3).
- Betrieb: Nach jeder neuen Jahresausgabe den Ablauf in `content/orte/LIZENZ.md` (Abschnitt Aktualisierung) ausführen; die Rohdateien beschafft ein Mensch.

## Stand für Teil B

Benutzbar:
- Typen (`src/lib/orte/typen.ts`): `Gemeinde`, `Kreis`, `PostleitzahlEintrag`, `PrioritaetEintrag`, `OrtsstammDaten`, `LAENDER`, `ORTSSTAMM_QUELLEN` (Kurzvermerke für `/standorte` und den Fuß der Ortsseiten).
- Server (`src/lib/orte/stamm.ts`, server-only): `ortsstamm()` liefert `OrtsstammIndex` mit `gemeinde(ags)`, `gemeindeNachSlug(slug)`, `kreis(schluessel)`, `postleitzahl(plz)`, `postleitzahlenDerGemeinde(ags)`, `gemeindenDesKreises(kreis)`, `prioritaet`, `gebietsstand`; `postleitzahlAbfragen(plz, leistung?)` für Assistent und Partnerzuordnung; `entfernungKm(plzA, plzB)` für den Umkreis der Partner (`einsatzgebiet.radiusKm`).
- Rein (überall nutzbar, ohne Daten): `ortsstammIndex(daten)`, `normalisierePostleitzahl`, `landName` (`index-stamm.ts`); `grosskreisKm`, `entfernungZwischenPostleitzahlen` (`entfernung.ts`); `postleitzahlAuskunft` (`abfrage.ts`).
- Datenbank: Sammlung `orte` (Slug `orte`, eindeutiger Index auf `gemeindeschluessel`), Seed-Schritt `ortsstammUebernehmen` (`uebernahme.ts`), Testdaten in der DB-Testumgebung: Stichprobe mit allen 348 Prioritätsorten und dem Lahn-Dill-Kreis.
- Dateien: `content/orte/*.json`; Wetzlar ist `06532023` (für den Verweis in `content/cities.json`).

Fehlt noch (Teil B): Verweis der `Einsatzgebiete` auf den Stamm (Gemeindeschlüssel oder Beziehung auf `orte`), Felder Priorität, Stufe, Suchvolumen, Fahrzeit, Partnerregion, eingetragene Verfügbarkeit; Admin-Ansicht „Prioritätsorte“; Erweiterung von `stadtIndexierbar` um Substanz und Leistungsweg, Prüfung auf Textgleichheit; Sitemap nur für indexierbare Ortsseiten; Quellenvermerk auf `/standorte` und im Fuß der Ortsseiten; Landkreis, Postleitzahlen und Partnerbezug auf der Ortsseite; `serviceAreaSchema` nur für Sichtbares; Betreiberanleitung `docs/betrieb/orte-pflegen.md`; Auswertung des Partner-Umkreises mit `entfernungKm` (späteres Paket). Hinweis: `/standorte/[city]` darf weiterhin nur Seiten für gepflegte Einsatzgebiete erzeugen, nie für Gemeinden des Stamms.

## Nachbesserung

Stand 16.11.2026, nach zwei Gegenprüfungen. Neun Befunde, alle am Code geprüft.

1. Amberg nicht eindeutig (`prioritaet.json`): behoben. In `ZUORDNUNG_ANHANG_A` trägt Amberg jetzt `bestaetigt: false` und die Kandidaten 09361000 und 09778111. `anhangAZuordnen` macht daraus einen Eintrag mit `zuordnung: "offen"`, `schluessel: null`, `vorschlag: "09361000"` und den Kandidaten. Die Kandidaten werden gegen das Gemeindeverzeichnis geprüft. Der Kopf meldet jetzt `offen: 1`, 347 Einträge sind zugeordnet (332 nach Name, 5 ohne Klammer, 10 über die Tabelle). Bestätigt der Inhaber, entfallen `bestaetigt` und `kandidaten`, dann den Import neu ausführen. Der Typ `PrioritaetEintrag` hat das Feld `vorschlag`, LIZENZ.md beschreibt die Regel. Die Stichprobe der Datenbanktests verliert die Stadt Amberg, sie liegt weiter über 348 Gemeinden.
2. Quellenvermerk ohne Links (`typen.ts`): behoben. `ORTSSTAMM_QUELLEN` liefert je Quelle `{ text, url, lizenzUrl? }`. Destatis verweist auf die Abrufseite aus LIZENZ.md, GeoNames auf https://www.geonames.org mit `lizenzUrl` https://creativecommons.org/licenses/by/4.0/. LIZENZ.md nennt die Felder. Bisher benutzt kein anderes Modul die Konstante.
3. und 5. Kreis fehlt bei Zuordnung über den Verwaltungssitz (`orte-import.mjs`, ein Befund, zweimal gemeldet): behoben. Die Schleife nimmt jetzt auch `g.kreis` in `e.kreise` auf. Ich habe den Import erneut ausgeführt (über die Datenweiche in einen Zwischenordner, danach übernommen). Geändert hat sich nur die Zeile 57629, Kreise jetzt `["07132","07143"]`. `gemeinden.json` und `kreise.json` sind bytegleich geblieben. Neue Tests: Für jede Postleitzahl steht der Kreis jeder ihrer Gemeinden in der Kreisliste, dazu ein Test für 57629 mit Malberg und eine Probe mit erfundenen Daten für `postleitzahlenBilden`.
4. Satz in `docs/betrieb/partner-pruefen.md` Zeile 71: Der Befund trifft zu, liegt aber außerhalb der Schreibrechte von Teil A. Nicht geändert, nur vorgemerkt (siehe unten).
6. `down` der Migration `orte_stamm` scheitert: behoben. Erst kommen Fremdschlüssel, Index und Spalte in `payload_locked_documents_rels` weg (mit `IF EXISTS`), danach `DROP TABLE "orte" CASCADE` und der Typ. `up` bleibt unverändert. Die erzeugten Migrationen im Bestand (etwa `gehaeuse`) sind nicht angefasst.
7. Der Stamm wird in jede Serverfunktion gebündelt (`outputFileTracingIncludes`): Der Befund trifft zu, `next.config` liegt aber nicht in den Schreibrechten. Nicht geändert, vorgemerkt für Teil B.
8. `src/test/db-global-setup.ts` außerhalb der ausdrücklichen Schreibrechte: Der Befund trifft zu, eine Codeänderung ist nicht nötig. Die Änderung ist additiv und lockert keine Prüfung. Der Orchestrator bestätigt sie als zugehörige Testinfrastruktur und trägt sie im Paket nach (Offene Frage 7).
9. Ländertabelle steht doppelt: behoben mit einem Test in `orte-import.test.ts`, der `LAENDER` aus dem Import mit `LAENDER` aus `typen.ts` gleichsetzt.

Geänderte Dateien: `scripts/orte-import.mjs`, `scripts/orte-import.test.ts`, `src/lib/orte/typen.ts`, `src/migrations/20261116_100017_orte_stamm.ts`, `content/orte/prioritaet.json` (42.868 Byte), `content/orte/postleitzahlen.json` (1.643.304 Byte), `content/orte/LIZENZ.md`.

Prüfungen über die Datenweiche:
- `npx vitest run`: 255 Dateien, 4.000 von 4.000 grün (Import-Test jetzt 25 Tests, Rohdaten-Abgleich lief mit)
- `npm run typecheck`: grün
- `npm run lint`: grün
- `--pg` Datenbanktests: 28 Dateien, 171 von 171 grün, 119,6 s. Das neue `down` habe ich nicht gegen die Datenbank ausgeführt, die Reihenfolge ist aus dem SQL abgeleitet.
- `npm run build`: grün, 181 Seiten, 39 s (wie vorher, keine neue Route).

Vorgemerkt für Teil B (zu „Stand für Teil B“):
- `ORTSSTAMM_QUELLEN` ist jetzt ein Objekt. Auf `/standorte` und im Fuß der Ortsseiten `text` als Vermerk ausgeben, mit Link auf `url` und bei GeoNames zusätzlich auf `lizenzUrl`.
- Einträge mit `zuordnung: "offen"` haben keinen Schlüssel. Die Admin-Ansicht „Prioritätsorte“ zeigt sie mit Kandidaten und Vorschlag für Menschen, ordnet sie aber nicht zu.
- `docs/betrieb/partner-pruefen.md` Zeile 71 neu fassen, etwa: „Wird noch nicht ausgewertet. Maßgeblich sind nur die Postleitzahlen.“ (gehört zu Teil B oder zum Umkreis-Paket).
- `next.config`: die Tracing-Regel für `content/orte` auf die Routen beschränken, die `stamm.ts` benutzen, und `content/orte` aus dem Sammelmuster `'/*': ['./content/**/*']` nehmen. Heute landen rund 3,7 MB in jeder Serverfunktion (nach Nachbesserung 2), im Browser nichts.

## Nachbesserung 2 (Abnahme des Orchestrators, rot)

Stand 16.11.2026. Die neun Befunde der Gegenprüfer habe ich kurz nachgeprüft; die Behebungen oben stehen im Code (Amberg offen, `ORTSSTAMM_QUELLEN` mit `url` und `lizenzUrl`, Kreis über den Verwaltungssitz, `down` mit `IF EXISTS` in richtiger Reihenfolge, Ländertest). Dort nichts geändert.

Befund: `postleitzahlen.json` führte Firmen und Behörden als Ortsnamen (45117 „Stadtwerke Essen AG“, 01053 „Commerzbank AG“, 11501 „Zalando SE“). Zutreffend, behoben.

Befund am Rohmaterial (`DE.txt`, 23.296 Zeilen, nachgezählt): zwölfte Spalte (Genauigkeit) 14.543 mal „4“, 497 mal „6“, 14 mal „1“, 8.242 mal leer. Keine der 15.054 Zeilen mit Genauigkeit trägt ein Organisationskennzeichen (geprüft mit der Regel unten; Freiamt, Freigericht und Linsengericht sind Gemeinden, deshalb gelten „Amt“ und „Gericht“ nur als ganzes Wort). 8.173 Postleitzahlen haben eine Zeile mit Genauigkeit, 2.642 nur Zeilen ohne.

Regel (`zustellzeilenWaehlen` in `scripts/orte-import.mjs`):
1. Zeilen mit Genauigkeit bleiben.
2. Eine Zeile ohne Genauigkeit bleibt nur ohne Organisationskennzeichen (`ORGANISATION`: Rechtsformen wie GmbH, AG, KG, SE, eG, e.V., mbH, OHG, GbR; Bank, Kasse, Versicherung, Niederlassung, Postfach, Agentur, Behörde, Stiftung, Verein, Verband und weitere auch als Wortende; Amt, Gericht, Jobcenter, Regierung, Justiz, Hochschule, Verlag, Zeitung, Magistrat und weitere als ganzes Wort; AOK, BKK, IKK, DAK, BARMER, HUK, ADAC; „&“; Ziffernfolgen ab drei Stellen) und wenn ihr Name in der Kurzform gleich dem Namen einer Gemeinde ihres Kreises ist oder mit ihm und einem Leerzeichen beginnt.
3. Anpassungen nach Prüfung am Rohmaterial, weil die Grundregel echte Orte verlor: Kurzform mit ausgeschriebenen Abkürzungen des Gemeindeverzeichnisses („Gars a.Inn“ = „Gars am Inn“, „i.d.OPf.“ = „in der Oberpfalz“, „St.“ = „Sankt“, Füllwörter weg); jeder Teil eines zweisprachigen Namens; Ortsteile, die GeoNames im selben Kreis mit Genauigkeit führt („Töplitz“); „Ortsteil, Gemeinde Name“; „Bad“ darf fehlen („Lobenstein“); genauer Name einer Gemeinde des Landes, wenn GeoNames einen Nachbarkreis nennt (67661 Kaiserslautern); genaue Bezeichnung plus Name („Lutherstadt Wittenberg“, nicht aber Landeshauptstadt, Hansestadt, Universitätsstadt, unter denen GeoNames die Stadtverwaltungen führt); an der Postleitzahl des Verwaltungssitzes das erste Wort der Gemeinde (02730 „Ebersbach/Sachsen“).
4. Alles andere ohne Genauigkeit entfällt; eine Postleitzahl ohne verbleibende Zeile entfällt ganz. Der Kopf von `postleitzahlen.json` nennt unter `entfallen` Zeilen, Postleitzahlen, Gründe und die Regel.

Zusätzlich ordnet `postleitzahlenBilden` eine Zeile ohne Treffer in der bisherigen Vergleichsform über die Kurzform zu (`gemeindeNamen`). Grund: Bad Homburg v. d. Höhe (Anhang A) hing bisher nur an der Postleitzahl des Verwaltungssitzes 61343, und die ist ein Großempfänger; jetzt hat die Stadt ihre Zustell-Postleitzahlen. Neu zugeordnet sind auch Neumarkt i.d.OPf., Neufahrn b.Freising und Schwarzenbach a.d.Saale.

Zahlen (Import über die Datenweiche nach `_werkstatt/ausbau/daten/orte/zwischen`, danach `postleitzahlen.json` übernommen):
- Postleitzahlen vorher 10.815, nachher 8.282 (8.173 mit Genauigkeit, 109 nur über behaltene Zeilen ohne Genauigkeit, etwa 14461 Potsdam, 06886 Lutherstadt Wittenberg, 02730 Ebersbach/Sachsen).
- Zeilen: 7.028 von 8.242 Zeilen ohne Genauigkeit entfallen (5.256 Organisation, 1.771 kein Ort im Kreis, 1 ohne Kreis: 87491 Jungholz, liegt in Tirol); 1.214 bleiben. 2.533 Postleitzahlen entfallen ganz.
- `gemeinden.json`, `kreise.json`, `prioritaet.json` bytegleich (cmp), Abgleich 0 Zugänge, 0 Abgänge, 0 Umbenennungen. Alle 347 zugeordneten Orte der Prioritätsliste haben eine Postleitzahl (Test).
- Gemeinden mit Postleitzahl: 10.749 (vorher 10.747). Ohne: Oberzent (schon vorher) und Wesertal (34399 führt GeoNames nur als „Oberweser“, den Namen der früheren Gemeinde, ohne Genauigkeit).
- Bekannte Verluste echter Orte (27 Zeilen, je eine eigene Postleitzahl ohne Genauigkeit, meist Postfach-Postleitzahlen von Ortsteilen ohne Gemeindenamen): etwa 82493 Klais, 82349 Pentenried, 83359 Hallabruck, 08325 „Carlsfeld, Erzgebirge“, 09227 „Einsiedel bei Chemnitz“, 23629 Sarkwitz, 31246 Lahstedt und 34399 Oberweser (frühere Gemeinden), 99891 Emsetal und Tabarz. Sie werden nicht geraten (R4); Ortsteile bleiben freie Abschnitte der Ortsseiten.

Zehn Stichproben entfallener Zeilen ohne Genauigkeit: 45117 Stadtwerke Essen AG (Organisation), 10875 GVG Daimler AG & Co. Gamma OHG (Organisation), 71060 Breuninger GmbH & Co. (Organisation), 79095 Staatl. Hochschule f. Musik Freiburg (Organisation), 85747 Technische Universität München (Organisation), 88129 Amtsgericht Lindau (Bodensee) (kein Ort im Kreis), 35573 Continental Automotive Technologies GmbH (Organisation), 30153 Sparda Bank Hannover eG (Organisation), 50318 Agentur für Arbeit Brühl (Organisation), 03139 Terpe (kein Ort im Kreis, Ortsteil).

Zehn Stichproben behaltener Zeilen ohne Genauigkeit: 14461 Potsdam, 01994 „Schipkau Annahütte, Annahütte-Siedlung“, 15518 Briesen (Mark), 16259 Oderaue Altreetz, 70327 Stuttgart Stuttgart-Ost, 91604 Flachslanden, 26419 Schortens Addernhausen, 29459 Clenze Prießeck, 55452 Rümmelsheim/Burg Layen, 01824 Rosenthal-Bielatal. Suche über alle 1.133 verschiedenen behaltenen Namen ohne Genauigkeit nach Firmen- und Behördenwörtern (Werk, Haus, Zentrum, Center, Shop, Blatt, Brauerei, Referat und weitere): keine Firma, keine Behörde; Treffer nur Ortsnamen wie „Stuttgart Zuffenhausen“ (gefunden und per Kennzeichen ausgeschlossen: „Mühlacker Tagblatt“, „Büdingen Med“, „Büdingen Dent“, „Westerwald-Brauerei“, „Landeshauptstadt München Baureferat“).

Tests (neu): Regel mit erfundenen Zeilen; Organisationskennzeichen trifft Firmen, nicht Freiamt, Linsengericht, Bad Homburg vor der Höhe; Kurzform und Namensformen; kein Ortsname in `postleitzahlen.json` mit Organisationskennzeichen; 45117, 01053, 11501 fehlen, 35576 Wetzlar, 14461 Potsdam und 57629 mit Malberg bleiben, Bad Homburg hat Postleitzahlen, 61343 entfällt; jede zugeordnete Gemeinde der Prioritätsliste hat eine Postleitzahl; Rohdaten-Abgleich mit Regel (keine Zeile mit Genauigkeit entfällt); `src/lib/orte/stamm.test.ts`: `postleitzahlAbfragen` für 45117, 01053, 11501 liefert `bekannt: false` ohne Fehler, 35576 und 14461 bekannt.

Geänderte Dateien: `scripts/orte-import.mjs` (`leseGeonames` mit Feld `genau`, `ORGANISATION`, `istOrganisation`, `kurzname`, `gemeindeNamen`, `zustellzeilenWaehlen`, Kurzform in `postleitzahlenBilden`, Kopf `entfallen`), `scripts/orte-import.test.ts`, `src/lib/orte/typen.ts` (Feld `entfallen` im Typ `PostleitzahlenDatei`), `src/lib/orte/stamm.test.ts` (neu), `content/orte/postleitzahlen.json` (1.157.730 Byte), `content/orte/LIZENZ.md`, `_werkstatt/ausbau/QUELLEN.md`. `reste.mjs` nicht angefasst.

Prüfungen über die Datenweiche:
- `npx vitest run`: 256 Dateien, 4.014 von 4.018 grün. Die Fehlschläge liegen in `src/app/(site)/schriftstufen.test.ts` (Schrift der SVG-Grafiken) und schwanken zwischen Läufen; sie gehören zu den gleichzeitig geänderten, nicht von mir berührten Dateien unter `src/components/visual/generators/**` (laufendes Paket FA-QA-04D). Alle Tests des Ortsstamms grün (`orte-import.test.ts` 31, `src/lib/orte` 19).
- `npm run typecheck`: grün. `npm run lint`: grün.
- `--pg` Datenbanktests: 28 Dateien, 171 von 171 grün, 121 s.
- `npm run build`: grün, 181 Seiten, 112 s gesamt (Kompilieren 79 s auf belasteter Maschine, statische Seiten 4,0 s).

Für Teil B (zu „Stand für Teil B“):
- `postleitzahlen.json` führt nur noch Zustell-Postleitzahlen und Postfach-Postleitzahlen mit Ortsnamen. Eine Großempfänger-Postleitzahl liefert `bekannt: false`; Assistent und Partnerzuordnung sollen dann nach dem Ort fragen statt einen Fehler zu zeigen.
- Kopf `entfallen` (Typ `PostleitzahlenDatei.entfallen`) für eine Anzeige im Admin oder in der Betreiberanleitung.
- `istOrganisation` und `kurzname` liegen nur im Import (`.mjs`); braucht Teil B sie in der Anwendung, gehört eine Fassung nach `src/lib/orte/` mit einem Gleichheitstest wie bei `LAENDER`.
