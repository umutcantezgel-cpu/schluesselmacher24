# E3-DATENPFLEGER-01 · Fahrzeugdaten-Import aus KBA FZ 12

## 1. Kopfzeile
Kennung E3-DATENPFLEGER-01 · Rolle Datenpfleger · Modell Haiku 5.5 · Stufe 2 · Kern 2.1 · Kostenklasse L · Anforderung G-14, Kriterium Z-07 · Schreibrechte: scripts/fahrzeuge-import.mjs, scripts/fahrzeuge-import.test.ts, content/fahrzeugkatalog.json, _werkstatt/ausbau/protokolle/E3-abdeckung.md, _werkstatt/ausbau/berichte/E3-DATENPFLEGER-01.md

## 2. Rollenbriefing
Datenpfleger: überträgt Daten zeichengenau in Strukturen, mit Quelle je Eintrag. Fehler: runden oder ergänzen; Einträge auslassen; Quelle vergessen; Markennamen raten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Schreibe ein wiederholbares Importskript, das alle benannten Modellreihen aus der KBA-Statistik FZ 12 (Stand 1.1.2026) in `content/fahrzeugkatalog.json` überführt, die 49 gepflegten Modelle des Bestands zuordnet und die Abdeckung misst.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
- Quelle (QUELLEN.md, A-009, A-018): `_werkstatt/ausbau/daten/kba/fz12_2026.xlsx` (SHA-256 08617982a04255cb22a78dceef5655f71f90baf79d90f618d0f6d14608ba1db5, Blatt FZ 12.1) und die abgeleitete Tabelle `_werkstatt/ausbau/daten/kba/fz12_2026_modellreihen_abgeleitet.csv` (Spalten rang_2026_benannt, segment, marke_abgeleitet, modellreihe_kba, anzahl_1_1_2026, benannt). Gesamtbestand 49.486.487 Pkw; 649 benannte Reihen = 97,33 %; „SONSTIGE“ ist keine Reihe. Rohdaten nie ins Repository.
- Lizenz: Quellenvermerk „Quelle: Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0“ als Feld `quelle` jeder KBA-Zeile.
- Schema je Zeile (Typ `FahrzeugReihe` in src/lib/types.ts, Beispiele in der heutigen content/fahrzeugkatalog.json): id (über die Regel von `reiheKennung` in src/lib/fahrzeuge/katalog.ts), marke (Anzeigename), reihe (Anzeigename), kbaName (wörtlich aus der Quelle), segment, bestand, rang, quelle, optional bestandsModell, baujahrVon, baujahrQuelle, klonbar „unbekannt“, gehaeuse „unbekannt“, leistungen [], sichtbar true.
- Markennamen: Aliasliste im Skript (etwa VW → Volkswagen, MERCEDES → Mercedes-Benz, SKODA → Škoda, CITROEN → Citroën, SSANGYONG → KGM, ALFA ROMEO, LAND ROVER, MINI); Reihennamen in lesbarer Schreibweise (erster Buchstabe groß, Ziffern und Kürzel wie im Handel, „GOLF, JETTA“ wird „Golf, Jetta“); nichts erfinden, im Zweifel der KBA-Name in Titelschreibung.
- Bestand bleibt: Jede der 49 Zeilen aus content/vehicles.json bekommt ihren Verweis `bestandsModell` (marke/modell) an der passenden KBA-Reihe, mit `baujahrVon` und `baujahrQuelle` „Bestand: content/vehicles.json“. Findet sich keine passende KBA-Reihe, bleibt die Bestandszeile mit Quelle „Bestand“ erhalten. Keine Bestandszeile geht verloren.

## 6. Maßstab
- `node scripts/fahrzeuge-import.mjs [pfad-zur-csv]` schreibt content/fahrzeugkatalog.json (sortiert nach marke, reihe; zwei Leerzeichen Einzug) und gibt die Abdeckung aus; ohne Argument nimmt es die CSV unter _werkstatt/ausbau/daten/kba/. Keine neue Bibliothek.
- Abdeckung (Z-07): Anteil des Bestands, den die Katalogzeilen abdecken, an 49.486.487; Ziel mindestens 95 %, erwartet 97,33 % mit allen benannten Reihen. Ergebnis mit Zahl der Reihen und der 20 größten Reihen nach `_werkstatt/ausbau/protokolle/E3-abdeckung.md`.
- Test `scripts/fahrzeuge-import.test.ts` (Vitest, mit einer kleinen erfundenen CSV im Test selbst): Aliasliste, Titelschreibung, Kennung, Zuordnung zum Bestand, keine Bestandszeile verloren, SONSTIGE ausgeschlossen, Abdeckungsrechnung.

## 7. Grenzen
G4, G6, G11, G13 (Rohdaten nie committen), R4. Keine Websuche. Andere Dateien nicht ändern.

## 8. Schritte
1. Lies src/lib/types.ts (FahrzeugReihe), src/lib/fahrzeuge/katalog.ts, src/lib/fahrzeuge/suche.ts, content/vehicles.json, QUELLEN.md (Fahrzeuge), ENTSCHEIDUNGEN.md A-009 und A-018.
2. Schreibe Skript und Test; führe den Test über die Datenweiche aus (`/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run scripts/fahrzeuge-import.test.ts src/lib/fahrzeuge`).
3. Führe das Skript aus, prüfe Zahlen, Stichproben (20 Reihen gegen die CSV) und dass `sucheFahrzeuge` für „vw golf“, „opel corsa“, „skoda octavia“, „bmw 3er“ sinnvolle erste Treffer liefert (kleines Node-Skript im Scratchpad, keine Projektdatei).
4. Schreibe Abdeckungsprotokoll und Bericht.

## 9. Selbstprüfung
Zahl der Zeilen (erwartet 649 KBA-Reihen plus Bestandszeilen ohne KBA-Gegenstück); jede Zeile mit Quelle; alle 49 Bestandsmodelle verwiesen; Abdeckung mindestens 95 %; Test grün; Dateigröße von content/fahrzeugkatalog.json genannt.

## 10. Ausgabe
Dateien wie in den Schreibrechten; Bericht nach _werkstatt/ausbau/berichte/E3-DATENPFLEGER-01.md (höchstens 500 Wörter: Zahlen, Abdeckung, unklare Markennamen, Bestandszuordnung, offene Fragen).

## 11. Letzte Zeile
=== ENDE E3-DATENPFLEGER-01 · BEREIT ZUR RÜCKGABE ===
