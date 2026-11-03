# E3-DATENPFLEGER-02 · Kartendaten Hessen aufbereiten

## 1. Kopfzeile
Kennung E3-DATENPFLEGER-02 · Rolle Datenpfleger · Modell Haiku 5.5 · Stufe 2 · Kern 2.1 · Kostenklasse M · Anforderung G-42 (Karte Einsatzgebiet), Kriterium Z-10 · Schreibrechte: scripts/karte-aufbereiten.mjs, content/karte/ (neue Dateien), _werkstatt/ausbau/daten/geo/ (nur Entpacktes, nie committet), _werkstatt/ausbau/berichte/E3-DATENPFLEGER-02.md · Umfang: ein Skript, zwei Datendateien, ein Lizenzvermerk

## 2. Rollenbriefing
Datenpfleger: überträgt Daten zeichengenau in Strukturen, mit Quelle je Eintrag. Fehler: runden oder ergänzen, wo es nicht vereinbart ist; Einträge auslassen; Quelle vergessen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Erzeuge aus den amtlichen Verwaltungsgrenzen (BKG VG250, Stand 1.1.2026) vereinfachte SVG-Formen aller 27 Kreise und aller 425 Gemeindeflächen Hessens mit Namen und Schlüssel, als kleine JSON-Dateien für eine Karte des Einsatzgebiets, mit Lizenzvermerk.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
- Quelle (erhebung/E1-karte-video.md Abschnitt 1 und 3): `_werkstatt/ausbau/daten/geo/vg250/vg250_01-01.utm32s.gpkg.ebenen.zip` (70.630.747 Byte, SHA-256 6b096eb4862b4eafda9294e425fb5a6d0e7773eb5815a4d4edc78b639ec2728f), GeoPackage in UTM Zone 32 (EPSG:25832), Tabellen `vg250_krs` (Kreise) und `vg250_gem` (Gemeinden), Hessen über Landesschlüssel `SN_L = '06'`. Erwartet: 27 Kreise (21 Landkreise, 6 kreisfreie Städte einschließlich Hanau 06415), 421 Städte und Gemeinden plus 4 gemeindefreie Gebiete, Lahn-Dill-Kreis 06532 mit 23 Kommunen. Weicht eine Zahl ab, brichst du ab und meldest es.
- Lizenz dl-de/by-2-0. Pflichtvermerk bei jeder öffentlichen Wiedergabe: „© BKG (2026) dl-de/by-2-0, Datenquellen: https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf“, mit Links auf https://www.bkg.bund.de und https://www.govdata.de/dl-de/by-2-0, dazu ein Veränderungshinweis (Wortlaut der BKG-Seite ist offen; bis dahin „Geometrien vereinfacht und in Bildkoordinaten umgerechnet“).
- Rohdaten bleiben in `_werkstatt/ausbau/daten/` (nie committet). Ins Projekt kommen nur die abgeleiteten, vereinfachten Formen.
- Werkzeuge: Node 22 mit `node:sqlite` (DatabaseSync) liest das GeoPackage; `unzip` entpackt. Keine neue Bibliothek, kein Paket installieren.

## 6. Maßstab
- `scripts/karte-aufbereiten.mjs`, aufrufbar mit `node scripts/karte-aufbereiten.mjs <pfad-zur-gpkg>`; ohne Argument sucht es die entpackte Datei unter `_werkstatt/ausbau/daten/geo/vg250/entpackt/`. Es liest die Geometrien (GeoPackage-Binärkopf „GP“, danach WKB Polygon oder MultiPolygon, Byte-Reihenfolge beachten), rechnet UTM-Meter linear in ein Bildkoordinatensystem um (Norden oben, Breite 1000 Einheiten, Höhe nach Seitenverhältnis), quantisiert auf 0,1 Einheiten, vereinfacht jeden Ring mit Douglas-Peucker (Toleranz für Kreise etwa 1,0 Einheit, für Gemeinden etwa 0,6 Einheiten, Ringe unter 2 Einheiten Fläche entfallen, Lücken zwischen Nachbarn höchstens so groß wie die Toleranz) und schreibt SVG-Pfade (`M … L … Z`, Ganzzahlen oder eine Nachkommastelle).
- Ausgabe `content/karte/hessen-kreise.json` und `content/karte/hessen-gemeinden.json`, je `{ "quelle": "…Pflichtvermerk…", "stand": "2026-01-01", "viewBox": "0 0 1000 H", "eintraege": [ … ] }`. Kreis: `{ "ags": "06532", "name": "Lahn-Dill-Kreis", "art": "Landkreis" | "kreisfreie Stadt", "d": "…", "mitte": [x, y] }`. Gemeinde: `{ "ags": "06532023", "name": "Wetzlar", "art": "Stadt" | "Gemeinde" | "gemeindefrei", "kreis": "06532", "d": "…", "mitte": [x, y] }`; `mitte` ist ein Punkt innerhalb der Fläche (für Beschriftung), nicht nur der Schwerpunkt, wenn dieser außerhalb läge.
- Größen: hessen-kreise.json höchstens 120 KB, hessen-gemeinden.json höchstens 450 KB. Namen exakt aus der Quelle (Umlaute, ß).
- `content/karte/LIZENZ.md`: Quelle, Stand, Lizenz mit Links, Pflichtvermerk, Veränderungshinweis, Abruf, Prüfsumme der Rohdatei, Aufruf des Skripts für die jährliche Aktualisierung.
- Selbsttest im Skript (am Ende, bricht mit Fehlercode ab): Zahl der Kreise 27, Gemeindeflächen 425 (421 plus 4 gemeindefrei), Lahn-Dill-Kreis 23 Kommunen mit Wetzlar 06532023, jeder Pfad nicht leer, jede `mitte` innerhalb der viewBox.

## 7. Grenzen
G4, G6, G11, G13 (Rohdaten nie committen), R4 (nichts ergänzen), R11. Keine Websuche, keine Downloads (die Datei liegt bereits vor). Keine Änderung an anderen Projektdateien; Code für die Karte selbst (Komponente) baut ein späteres Paket.

## 8. Schritte
1. Entpacke das ZIP nach `_werkstatt/ausbau/daten/geo/vg250/entpackt/` (prüfe vorher die Prüfsumme).
2. Untersuche Tabellen und Spalten mit `node:sqlite` (gpkg_contents, gpkg_geometry_columns, Spalten von vg250_krs und vg250_gem, Felder AGS, GEN, BEZ, SN_L, GF).
3. Schreibe das Skript, führe es aus, prüfe die Zahlen.
4. Erzeuge eine Vorschau (SVG beider Ebenen übereinander, Lahn-Dill-Kreis hervorgehoben) als PNG mit Chromium in den Scratchpad `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3-karte/` und prüfe Lücken an drei Grenzen bei 200 % Zoom.
5. Schreibe LIZENZ.md und den Bericht.

## 9. Selbstprüfung
Zahlen wie in Abschnitt 6; Dateigrößen unter den Grenzen; kein Rohdatenpfad im Repository außer dem Hinweis in LIZENZ.md; Namen stichprobenweise (zehn) gegen die Quelle verglichen.

## 10. Ausgabe
Dateien wie oben; Bericht nach _werkstatt/ausbau/berichte/E3-DATENPFLEGER-02.md (höchstens 500 Wörter: Zahlen, Größen, Toleranzen, Vorschau-Pfad, sichtbare Lücken, offene Fragen).

## 11. Letzte Zeile
=== ENDE E3-DATENPFLEGER-02 · BEREIT ZUR RÜCKGABE ===
