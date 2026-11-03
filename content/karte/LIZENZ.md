# Lizenz und Quellenvermerk der Kartendaten

Die Formen der Kreise und Gemeinden in `hessen-kreise.json` und `hessen-gemeinden.json` sind aus den Verwaltungsgebieten 1:250 000 (VG250) des Bundesamtes für Kartographie und Geodäsie (BKG) abgeleitet. Veröffentlicht werden nur die vereinfachten Formen. Die Rohdaten liegen nicht im Repository.

## Quelle

- Produkt: Verwaltungsgebiete 1:250 000 (VG250), Ebenen Kreise (Tabelle vg250_krs) und Gemeinden (Tabelle vg250_gem), gefiltert auf den Landesschlüssel 06 (Hessen)
- Stand: 01.01.2026
- Koordinatensystem der Quelle: ETRS89 / UTM Zone 32N (EPSG:25832)
- Herausgeber: BKG, https://www.bkg.bund.de
- Abruf: https://daten.gdz.bkg.bund.de/produkte/vg/vg250_ebenen_0101/aktuell/vg250_01-01.utm32s.gpkg.ebenen.zip (am 3. November 2026)
- Rohdatei: vg250_01-01.utm32s.gpkg.ebenen.zip, 70.630.747 Byte, SHA-256 6b096eb4862b4eafda9294e425fb5a6d0e7773eb5815a4d4edc78b639ec2728f
- Darin enthaltenes GeoPackage: vg250_ebenen_0101/DE_VG250.gpkg, SHA-256 25dfeadf75c9d03939144a43e0a073b5311fdf2b72ae3097e31b3abda3edefcb

## Lizenz

Datenlizenz Deutschland Namensnennung Version 2.0 (dl-de/by-2-0), https://www.govdata.de/dl-de/by-2-0. Die Daten sind urheberrechtlich geschützt und werden geldleistungsfrei unter dieser Lizenz zur Verfügung gestellt.

## Pflichtvermerk

© BKG (2026) dl-de/by-2-0, Datenquellen: https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf

Auf Webseiten sind „BKG“ mit https://www.bkg.bund.de und „dl-de/by-2-0“ mit https://www.govdata.de/dl-de/by-2-0 zu verlinken.

Statistische Schlüssel: © Daten (im Auftrag der Herausgebergemeinschaft Statistische Ämter des Bundes und der Länder) Statistisches Bundesamt (Destatis), 2026

## Veränderungshinweis

Geometrien vereinfacht und in Bildkoordinaten umgerechnet.

## Verfahren

- Bildkoordinaten: Breite 1000 Einheiten, Norden oben, Höhe nach Seitenverhältnis (viewBox 0 0 1000 1444.2). Eine Einheit entspricht rund 174 m.
- Koordinaten auf 0,1 Einheiten gerundet.
- Vereinfachung nach Douglas-Peucker mit einer Toleranz von 1,0 Einheiten für Kreise und 0,6 Einheiten für Gemeinden. Grenzen, die zwei Flächen gemeinsam haben, werden einmal vereinfacht, damit zwischen Nachbarn keine Lücke entsteht.
- Ringe, deren vereinfachte Form unter 2 Einheiten Fläche hat (rund 0,06 km²), entfallen.
- Die Pfade enthalten Außen- und Innenringe und werden mit der Füllregel evenodd gezeichnet.

## Erzeugung und jährliche Aktualisierung

1. Neue Datei vom BKG-Geodatenzentrum laden, SHA-256 notieren und in `_werkstatt/ausbau/daten/geo/vg250/` ablegen.
2. Entpacken: `unzip <datei>.zip -d _werkstatt/ausbau/daten/geo/vg250/entpackt/`
3. Aufruf aus dem Projektordner: `node scripts/karte-aufbereiten.mjs` (ohne Argument wird die einzige .gpkg-Datei unter `entpackt/` verwendet, alternativ den Pfad zur .gpkg angeben).
4. Das Skript prüft vor dem Schreiben die Zahlen der Quelle (27 Kreise, 421 Städte und Gemeinden, 4 gemeindefreie Gebiete, 23 Kommunen im Lahn-Dill-Kreis) und führt einen Selbsttest aus. Weicht etwas ab, bricht es ab und schreibt nichts.
5. Stand, Prüfsummen und Pflichtvermerk in dieser Datei aktualisieren.
