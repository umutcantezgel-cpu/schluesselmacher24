# E3-DATENPFLEGER-01 · Fahrzeugkatalog aus KBA FZ 12 (Stand 1.1.2026)

## GEÄNDERTE DATEIEN
- `scripts/fahrzeuge-import.mjs` (neu): Einlesen, Namensregeln, Zusammenführung, Bestandsverknüpfung, Abdeckung.
- `scripts/fahrzeuge-import.test.ts` (neu): 16 Fälle mit einer erfundenen Tabelle.
- `content/fahrzeugkatalog.json` (ersetzt den Startwert mit 49 Zeilen): 624 Zeilen, 260.590 Byte.
- `_werkstatt/ausbau/protokolle/E3-abdeckung.md` (neu): Zählung, Zusammenführungen, 20 größte Reihen, Stichprobe, Schreibweisen.

## WAS UND WARUM
- Die CSV hat 663 Zeilen, davon 649 benannt. Die 14 übrigen (13 Segmentzeilen SONSTIGE und eine Gesamtzeile) sind keine Reihen und fehlen. Alle Zeilen ergeben zusammen 49.486.487, den Gesamtbestand. Das Skript bricht ab, wenn das nicht stimmt.
- 25 KBA-Zeilen wiederholen eine Reihe in einem anderen Segment (vor allem Transporter und Vans) oder unter der Marke SSANGYONG. Sie werden zu einer Zeile zusammengeführt, weil die Kennung eindeutig sein muss. Die Bestände werden addiert, die Abdeckung bleibt gleich. Der Rang ist der beste KBA-Rang der Zeilen. Daher 624 statt 649 Zeilen.
- Gepflegte Modelle behalten ihren Anzeigenamen („Golf“) und ihre Kennung (`volkswagen-golf`). Der KBA-Name steht in `kbaName`, weitere Namen der Reihe in `alias` (nur Transit mit Tourneo). Die 49 Startwert-Kennungen bleiben erhalten, der Seed legt keine Doppel an.
- Marken: Aliasliste für alle 63 KBA-Marken, SSANGYONG als KGM. Eine unbekannte Marke bricht den Lauf ab, statt geraten zu werden.
- Reihennamen: Titelschreibung nach festen Regeln, dazu eine Sondertabelle mit 24 Einträgen.
- Die Datei wird atomar geschrieben, also über eine temporäre Datei und Umbenennung.

## GEMEINSAME DATEIEN
Keine Änderung gewünscht. Keine gemeinsame Datei berührt.

## PRÜFUNG UND ERGEBNIS
- Abdeckung: 48.167.451 von 49.486.487 Pkw, also 97,33 % (Ziel 95 %). Die größten 338 Zeilen erreichen 95 %, die größten 514 erreichen 97 %.
- Bestand: 49 von 49 verknüpft, 0 ohne KBA-Gegenstück, jede Verknüpfung mit `baujahrVon` und `baujahrQuelle`.
- Test über die Datenweiche: `scripts/fahrzeuge-import.test.ts` 16 von 16, `src/lib/fahrzeuge` 8 von 8, alles grün.
- ESLint und die strikte Typprüfung der Testdatei ohne Befund. Zwei Läufe ergeben dieselbe Datei (SHA-256 43f2f42a…).
- Unabhängige Prüfung gegen die CSV mit einem zweiten Lesen (Python csv): Summen stimmen, 624 eindeutige Kennungen, 0 Abweichungen bei Bestand und Rang, 20 von 20 Stichproben stimmen.
- Suche (`sucheFahrzeuge`): „vw golf“, „opel corsa“, „skoda octavia“ und „bmw 3er“ liefern die richtige erste Zeile.

## BELEGE
- Zählung, Stichprobe und Schreibweisen: `_werkstatt/ausbau/protokolle/E3-abdeckung.md`.
- Lauf: `_werkstatt/ausbau/protokolle/datenweiche.log`.
- Quelle: SHA-256 der xlsx stimmt mit QUELLEN.md überein.

## OFFENE FRAGEN
1. Zusammenführung bestätigen: 649 benannte Zeilen ergeben 624 Reihen. Die Alternative, das Segment in die Kennung aufzunehmen, verletzt die Kennungsregel.
2. „MINI Mini“ (KBA-Zeile „MINI MINI“, Bestand 587.315) ist eine Sammelzeile ohne Modellnamen. Die Anzeige sollte der Inhaber festlegen.
3. Schreibweisen zur Sichtprüfung (Protokoll, Abschnitt 9): Ion, Up, Ka, E:NY1, ORA, WEY, Landcruiser, Roewe und Rover unter MG, Lynk & Co 01, Smart, XPeng.
4. Verknüpfte Reihen zeigen den Bestandsnamen („Golf“) statt des KBA-Namens („Golf, Jetta“). Ein Wechsel würde die Kennungen ändern und den Seed mit Doppeln belasten.
5. Die xlsx wurde nicht zeilenweise gelesen. Geprüft sind die Summen der CSV, die Prüfsumme und die Angaben in QUELLEN.md (649 benannt, 97,33 %).
