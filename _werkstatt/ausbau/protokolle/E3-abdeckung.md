# E3-abdeckung · Abdeckung des Fahrzeugkatalogs aus KBA FZ 12 (Stand 1.1.2026)

Kennung E3-DATENPFLEGER-01 · Stand 2026-11-03 · Ziel Z-07 (mindestens 95 %), Anforderung G-14, Entscheidung A-009 und A-018.

## 1. Quelle

- Datei: `_werkstatt/ausbau/daten/kba/fz12_2026.xlsx`, SHA-256 `08617982a04255cb22a78dceef5655f71f90baf79d90f618d0f6d14608ba1db5` (geprüft, stimmt mit QUELLEN.md überein).
- Abgeleitete Tabelle: `_werkstatt/ausbau/daten/kba/fz12_2026_modellreihen_abgeleitet.csv`, 663 Datenzeilen, 11 Spalten, CRLF. Elf Felder enthalten Kommas in Anführungszeichen (z. B. „FORD TRANSIT, TOURNEO“); das Skript liest sie nach RFC 4180.
- Quellenvermerk je Zeile: „Quelle: Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0“.

## 2. Zählung der KBA-Zeilen

| Gruppe | Zeilen | Summe Pkw |
|---|---:|---:|
| Benannte Modellreihen (benannt = 1) | 649 | 48.167.451 |
| Segmentzeilen „SONSTIGE (nicht benannt)“ (benannt = 0) | 13 | 179.777 |
| Gesamtzeile „SONSTIGE (Gesamtzeile Sonstige)“ (benannt = 0) | 1 | 1.139.259 |
| Alle Zeilen | 663 | 49.486.487 |

Die Summe aller Zeilen ist genau der Gesamtbestand aus QUELLEN.md (49.486.487). Das Skript bricht ab, wenn das nicht stimmt. Nicht benannte Zeilen sind keine Reihen und fehlen im Katalog.

Rang 1 bis 649 sind lückenlos und eindeutig vergeben.

## 3. Ergebnis des Katalogs

- Katalogzeilen: 624 (649 KBA-Zeilen, davon 25 mit einer anderen Zeile zusammengeführt; Bestandszeilen ohne KBA-Gegenstück: 0).
- Abdeckung: 48.167.451 von 49.486.487 Pkw = **97,33 %** (Ziel 95 %, erreicht).
- Erreicht 95 % mit den größten 338 Katalogzeilen (95,007 %), 97 % mit 514 (97,004 %).
- Kennungen eindeutig: 624 von 624.
- Marken: 63 (SSANGYONG ist in KGM enthalten).
- Datei: `content/fahrzeugkatalog.json`, 260.590 Byte (254,5 KB), zwei Leerzeichen Einzug, sortiert nach Marke und Reihe.

## 4. Zusammenführungen gleicher Reihen (25)

Dieselbe Modellreihe steht in der KBA-Tabelle in mehreren Segmenten (häufig Nutzfahrzeuge mit Wohnmobil-Segment) oder unter der alten Markenbezeichnung SSANGYONG. Die Zeilen werden zu einer Katalogzeile zusammengeführt: Bestand addiert, Rang = bester KBA-Rang der Zeilen, Segmente mit „ / “ verbunden, KBA-Namen wörtlich mit „ / “ verbunden.

| Katalogzeile | KBA-Zeilen (Bestand) |
|---|---|
| Citroën Jumper | CITROEN JUMPER (92.723) |
| Citroën Jumpy | CITROEN JUMPY (27.478) |
| Fiat Ducato | FIAT DUCATO (450.677) |
| Ford Transit | FORD TRANSIT, TOURNEO (114.999) |
| Ford Transit Custom | FORD TRANSIT CUSTOM (157.413) |
| KGM Korando | KGM KORANDO und SSANGYONG KORANDO (7.412) |
| KGM Rexton | KGM REXTON und SSANGYONG REXTON (6.898) |
| KGM Tivoli | KGM TIVOLI und SSANGYONG TIVOLI (9.234) |
| Land Rover Defender | LAND ROVER DEFENDER (22.843) |
| MAN TGE | MAN TGE (7.112) |
| Mercedes-Benz Sprinter | MERCEDES SPRINTER (109.375) |
| Mercedes-Benz V-Klasse | MERCEDES V-KLASSE (174.412) |
| Mercedes-Benz Viano | MERCEDES VIANO (41.599) |
| Mercedes-Benz Vito | MERCEDES VITO (114.724) |
| Opel Movano | OPEL MOVANO (5.576) |
| Opel Vivaro | OPEL VIVARO (34.729) |
| Opel Zafira Life | OPEL ZAFIRA LIFE (23.300) |
| Peugeot Boxer | PEUGEOT BOXER (28.842) |
| Renault Master | RENAULT MASTER (22.947) |
| Renault Trafic | RENAULT TRAFIC (35.639) |
| Volkswagen Caddy | VW CADDY (446.245) |
| Volkswagen Crafter | VW CRAFTER (31.678) |
| Volkswagen LT | VW LT (6.627) |
| Volkswagen Transporter | VW TRANSPORTER (749.856) |
| Volkswagen Typ 2 | VW TYP 2 (9.902) |

Die Zahlen in Klammern sind die Summen der Bestände der zusammengeführten KBA-Zeilen.

## 5. Bestandszuordnung (49 von 49)

- Jedes Modell aus `content/vehicles.json` hat genau eine Katalogzeile mit `bestandsModell`, `baujahrVon` (aus `yearFrom`) und `baujahrQuelle` „Bestand: content/vehicles.json“.
- Die 49 Kennungen des Startwerts (HEAD-Stand) bleiben unverändert (z. B. `volkswagen-golf`), mit gleichem Verweis, gleicher Marke, gleicher Reihe und gleichem Baujahr. Der Seed (Schlüssel `kennung`) legt damit keine Doppel an.
- Der Name der Bestandsreihe bleibt Anzeigename („Golf“), der KBA-Name steht in `kbaName`, weitere Namen der KBA-Reihe als `alias` (nur „Transit“ mit „Tourneo“).
- Keine Bestandszeile ging verloren; ohne KBA-Gegenstück wäre sie mit Quelle „Bestand: content/vehicles.json“ erhalten geblieben (Test).

## 6. Die 20 größten Katalogzeilen nach Bestand

| Rang Katalog | Reihe | Bestand | KBA-Rang |
|---:|---|---:|---:|
| 1 | Volkswagen Golf | 3.231.990 | 1 |
| 2 | Volkswagen Polo | 1.300.548 | 2 |
| 3 | Opel Corsa | 1.114.652 | 3 |
| 4 | Mercedes-Benz C-Klasse | 937.433 | 4 |
| 5 | Opel Astra | 911.272 | 5 |
| 6 | BMW 3er | 895.266 | 6 |
| 7 | Volkswagen Passat | 891.326 | 7 |
| 8 | Škoda Fabia | 815.911 | 8 |
| 9 | Volkswagen Tiguan | 811.016 | 9 |
| 10 | Audi A4 | 750.066 | 10 |
| 11 | Volkswagen Transporter | 749.856 | 17 |
| 12 | Škoda Octavia | 724.473 | 11 |
| 13 | Ford Fiesta | 721.774 | 12 |
| 14 | Audi A3 | 708.850 | 13 |
| 15 | Ford Focus | 690.757 | 14 |
| 16 | Mercedes-Benz E-Klasse | 616.445 | 15 |
| 17 | Mercedes-Benz A-Klasse | 610.894 | 16 |
| 18 | Volkswagen Touran | 588.519 | 18 |
| 19 | MINI Mini | 587.315 | 19 |
| 20 | BMW 1er | 563.996 | 20 |

## 7. Stichprobe: 20 Zeilen gegen die CSV

Zufallsauswahl mit festem Startwert (20261103) aus den 624 Katalogzeilen, Vergleich mit einem unabhängigen Lesen der CSV (Python-Modul csv). Bestand und Rang stimmen in allen 20 Fällen überein; über alle 624 Zeilen gab es 0 Abweichungen.

| Katalogzeile | KBA-Name | CSV-Zeile | Segment | Bestand | Rang |
|---|---|---:|---|---:|---:|
| Citroën C5 | CITROEN C5 | 204 | MITTELKLASSE | 51.639 | 183 |
| Ford B-Max | FORD B-MAX | 557 | MINI-VANS | 65.542 | 156 |
| Ford Probe | FORD PROBE | 211 | MITTELKLASSE | 1.158 | 622 |
| Hyundai H-1 Starex | HYUNDAI H-1 STAREX | 623 | UTILITIES | 7.760 | 388 |
| Fiat Grande Panda | FIAT GRANDE PANDA | 67 | KLEINWAGEN | 2.217 | 532 |
| BMW Z4 | BMW Z4 | 515 | SPORTWAGEN | 59.374 | 170 |
| Suzuki Swace | SUZUKI SWACE | 181 | KOMPAKTKLASSE | 4.253 | 460 |
| Kia Venga | KIA VENGA | 563 | MINI-VANS | 39.818 | 211 |
| Suzuki Swift | SUZUKI SWIFT | 109 | KLEINWAGEN | 133.556 | 91 |
| Subaru BRZ | SUBARU BRZ | 547 | SPORTWAGEN | 1.470 | 588 |
| Dodge Nitro | DODGE NITRO | 459 | GELÄNDEWAGEN | 2.190 | 535 |
| Honda FR-V | HONDA FR-V | 559 | MINI-VANS | 2.877 | 503 |
| Renault Kadjar | RENAULT KADJAR | 405 | SUVs | 52.902 | 180 |
| Hyundai Bayon | HYUNDAI BAYON | 342 | SUVs | 16.308 | 297 |
| Mercedes-Benz MB 100 | MERCEDES MB 100 | 665 | WOHNMOBILE | 1.162 | 621 |
| Škoda Yeti | SKODA YETI | 419 | SUVs | 147.747 | 80 |
| Honda HR-V | HONDA HR-V | 340 | SUVs | 26.264 | 246 |
| Mercedes-Benz CLA-Klasse | MERCEDES CLA-KLASSE | 230 | MITTELKLASSE | 165.548 | 69 |
| Mercedes-Benz GLA | MERCEDES GLA | 378 | SUVs | 157.052 | 73 |
| Renault Koleos | RENAULT KOLEOS | 406 | SUVs | 19.026 | 276 |

## 8. Suche mit `sucheFahrzeuge` (src/lib/fahrzeuge/suche.ts)

Geprüft mit dem Katalog aus `content/fahrzeugkatalog.json`, Ausgabe der ersten Treffer:

- „vw golf“ → Volkswagen Golf (volkswagen/golf)
- „opel corsa“ → Opel Corsa (opel/corsa)
- „skoda octavia“ → Škoda Octavia (skoda/octavia)
- „bmw 3er“ → BMW 3er (bmw/3er)
- Zusätzlich: „vw jetta“ → Volkswagen Jetta (nur KBA-Zeile, ohne gepflegtes Modell), „ssangyong korando“ → KGM Korando, „vw transporter“ → Volkswagen Transporter (bestandsModell volkswagen/transporter), „mercedes a klasse“ → Mercedes-Benz A-Klasse.

## 9. Anzeigenamen und Schreibweisen

Regel: Marken über die Aliasliste MARKEN (unbekannte Marke bricht ab, kein Raten). Reihennamen: Wörter mit Ziffern bleiben groß; zweibuchstabige Wörter bleiben groß (Ausnahmen KA und UP, geschrieben „Ka“ und „Up“), dreibuchstabige nur aus der Liste KUERZEL3 (AMG, ASX, BRZ, CLA, CLE, CLK, CLS, GLA, GLB, GLC, GLE, GLK, GLS, LBX, MGF, ORA, RCZ, SLC, SLK, SLS, TGE, WEY); alle übrigen Wörter mit erstem Buchstaben groß („GOLF, JETTA“ wird „Golf, Jetta“). Ausnahmen stehen vollständig in SONDERSCHREIBWEISE (24 Einträge, z. B. BMW 3ER → 3er, HYUNDAI I 20 → i20, TOYOTA RAV 4 → RAV4, HONDA E → e).

Zur Sichtprüfung durch den Inhaber, weil die Schreibweise im Handel abweicht oder unsicher ist:

- Anzeige „MINI Mini“ (KBA-Zeile „MINI MINI“, Bestand 587.315): Sammelzeile der KBA ohne Modellnamen.
- „Ion“ (Handel „iOn“), „Up“ (Handel „up“ mit Ausrufezeichen), „Ka“ (Handel „Ka+“), „E:NY1“ (Honda, Handel „e:Ny1“).
- „ORA 03“, „WEY 05“ und „MAN TGE“ mit Großbuchstaben als Kürzel.
- „MG“ mit den Reihen „Roewe …“ und „Rover …“, weil KBA die Marke so führt.
- „Lynk & Co 01“ (KBA-Reihe „LYNK & CO 01“, Marke aus LYNK abgeleitet).
- „Landcruiser“ (Handel „Land Cruiser“), „C-Elysee“ (KBA ohne Akzent).
- „Smart“ und „XPeng“ als Titelschreibung der KBA-Marke.

## 10. Prüfungen

- Schema je Zeile: Pflichtfelder gesetzt, `klonbar`, `gehaeuse` „unbekannt“, `leistungen` leer, `sichtbar` true, Bestand und Rang ganze Zahlen; keine Zeile mit SONSTIGE; keine Gedankenstriche.
- Test: `scripts/fahrzeuge-import.test.ts` (16 Fälle mit erfundener CSV) und `src/lib/fahrzeuge/fahrzeuge.test.ts` (8 Fälle) über die Datenweiche: 24 von 24 grün.
- Lint der beiden neuen Dateien und Typprüfung der Testdatei (strict): ohne Befund.
- Lauf: `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- node scripts/fahrzeuge-import.mjs` (Exit 0), Ausgabe siehe Abschnitte 2 bis 6.
