# Quellen und Lizenz des Ortsstamms

Die Dateien in diesem Ordner sind aus zwei Quellen abgeleitet (FA-PLATTFORM-03, Entscheidung A-051). Die Rohdateien liegen nicht im Repository. Erzeugt werden alle vier Dateien mit `node scripts/orte-import.mjs`.

| Datei | Inhalt | Quelle |
|---|---|---|
| `gemeinden.json` | 10.751 Gemeinden: Amtlicher Gemeindeschlüssel, Regionalschlüssel, Name, Bezeichnung, Art, Adresse, Kreis, Land, Postleitzahl des Verwaltungssitzes, Mittelpunkt, Einwohner | Gemeindeverzeichnis |
| `kreise.json` | 400 Kreise, kreisfreie Städte, Stadtkreise und der Regionalverband Saarbrücken | Gemeindeverzeichnis |
| `postleitzahlen.json` | 10.815 Postleitzahlen: Ortsnamen, Kreise, Gemeindeschlüssel (nur eindeutige), Mittelpunkt | GeoNames, Schlüssel aus dem Gemeindeverzeichnis |
| `prioritaet.json` | 348 Orte der Prioritätsliste des Inhabers mit Gemeindeschlüssel | Vorgabe des Inhabers (Anhang A), Schlüssel aus dem Gemeindeverzeichnis |

## Gemeindeverzeichnis (Statistisches Bundesamt)

- Produkt: Gemeindeverzeichnis-Informationssystem GV-ISys, „Alle politisch selbständigen Gemeinden mit ausgewählten Merkmalen am 31.12.2025“ (Jahresausgabe), Blatt „Onlineprodukt_Gemeinden31122025“
- Gebietsstand: 31.12.2025, erschienen August 2026
- Abruf: https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Administrativ/Archiv/GVAuszugJ/31122025_Auszug_GV.html (Datei `31122025_Auszug_GV.xlsx`, am 15.11.2026)
- Rohdatei: 1.867.597 Byte, SHA-256 5bfb8b7a5ce0dc65988ff30b28146ec2f08dd0b29756c9c8c427cbd7baa00e79
- Übernommen: Satzart 40 (Kreise) und Satzart 60 (Gemeinden) ohne die 202 gemeindefreien Gebiete (Textkennzeichen 65 und 66). Fläche, Reisegebiet und Grad der Verstädterung sind nicht übernommen.
- Die Koordinaten sind laut Kopf der Datei die geografischen Mittelpunkte nach dem Bundesamt für Kartographie und Geodäsie (BKG), Zuordnungsstand 31.12.2024. Die Bevölkerung beruht auf dem Zensus 2022.

Vermerk im Wortlaut des Blatts „Inhalt“:

> © Daten (im Auftrag der Herausgebergemeinschaft Statistische Ämter des Bundes und der Länder) Statistisches Bundesamt (Destatis), 2026. Vervielfältigung und Verbreitung, auch auszugsweise, mit Quellenangabe gestattet.

Quellenangabe auf Seiten: „Statistisches Bundesamt (Destatis), Gemeindeverzeichnis, Gebietsstand 31.12.2025“ (`ORTSSTAMM_QUELLEN.gemeinden` in `src/lib/orte/typen.ts`).

## Postleitzahlen (GeoNames)

- Produkt: GeoNames Postal Codes, Datei `DE.zip` mit `DE.txt` und `readme.txt` (https://download.geonames.org/export/zip/)
- Abruf: am 15.11.2026; `geonames_DE.zip` 388.077 Byte, SHA-256 1951e1fd5f577a5d315fbddd490c6b0bec032225eadee86191ed85a9fdfdfc28; `DE.txt` 23.296 Zeilen, SHA-256 c5fa1e0905bedc2d67724cf142ac7ce8159b69658e419b912088068ff8128ea7
- Lizenz laut `readme.txt`: „This work is licensed under a Creative Commons Attribution 4.0 License … you can use the dump as long as you give credit to geonames (a link on your website to www.geonames.org is ok)“, https://creativecommons.org/licenses/by/4.0/
- Gewähr laut `readme.txt`: „provided "as is" without warranty or any representation of accuracy, timeliness or completeness“.
- Übernommen: Postleitzahl, Ortsname, Kreisschlüssel (Feld admin code3), Koordinaten. Je Postleitzahl ist der Mittelpunkt das Mittel der Koordinaten ihrer Zeilen.

Quellenangabe auf Seiten: „Postleitzahlen: GeoNames (www.geonames.org), CC BY 4.0“ mit Link auf https://www.geonames.org und auf die Lizenz (`ORTSSTAMM_QUELLEN.postleitzahlen`).

## Veränderungshinweis

Aus beiden Quellen ausgewählt und neu angeordnet. Namen am ersten Komma in Name und Bezeichnung geteilt („Wetzlar, Stadt“), Koordinaten gerundet (Gemeinden fünf, Postleitzahlen vier Nachkommastellen). Die Zuordnung von Postleitzahlen zu Gemeindeschlüsseln ist eigene Ableitung (Regel unten), nicht Teil der Quellen.

## Verfahren

- Schlüssel jeder Gemeinde ist der achtstellige Amtliche Gemeindeschlüssel (Land, Regierungsbezirk, Kreis, Gemeinde). Der zwölfstellige Regionalschlüssel steht daneben.
- Adresse (`slug`): aus dem Namen; tragen mehrere Gemeinden dieselbe, bekommt jede den Kreis als Zusatz (`muehlhausen-rhein-neckar-kreis`), heißt der Kreis wie die Gemeinde, das Land (`hof-bayern`), zuletzt den Schlüssel. Eine einmal vergebene Adresse bleibt bei jedem neuen Stand.
- Postleitzahl zu Gemeinde: eindeutig nur, wenn der Kreis eine einzige Gemeinde hat (kreisfreie Städte, Berlin, Hamburg), der Ortsname im Kreis genau einer Gemeinde gleicht (auch ohne Klammerzusatz) oder es die Postleitzahl des Verwaltungssitzes ist. Stand 31.12.2025: 16.208 von 23.296 GeoNames-Zeilen eindeutig, 647 Zuordnungen über den Verwaltungssitz; 1.101 Postleitzahlen ohne Gemeindeschlüssel; 10.747 Gemeinden haben mindestens eine Postleitzahl.
- Ortsteile führt das Gemeindeverzeichnis nicht. Ortsnamen aus GeoNames, die keiner Gemeinde gleichen, sind meist Ortsteile; sie stehen bei der Postleitzahl als Name, ohne Schlüssel. Auf einer Ortsseite bleiben Ortsteile freie Abschnitte.
- Prioritätsliste: Namen des Anhangs je Land in der Reihenfolge des Inhabers; Schlüssel über den gleichen Namen im Land, den Namen ohne Klammerzusatz oder die geprüfte Tabelle `ZUORDNUNG_ANHANG_A` in `scripts/orte-import.mjs`. Was keine Regel trifft, steht mit Kandidaten als `offen` in der Datei und wird nicht geraten.

## Aktualisierung

1. Neue Jahresausgabe des Gemeindeverzeichnisses und eine aktuelle `DE.zip` von GeoNames nach `_werkstatt/ausbau/daten/orte/` legen (nicht committen), Prüfsummen hier eintragen.
2. `node scripts/orte-import.mjs --trocken` zeigt Zahlen, Zugänge, Abgänge und Umbenennungen gegenüber dem vorhandenen Stand, ohne zu schreiben. Andere Dateinamen: `--gv pfad.xlsx --geonames pfad/DE.txt`. `--liste` zeigt alle Änderungen und Zuordnungen.
3. `node scripts/orte-import.mjs` schreibt die Dateien. Gepflegte Ortsseiten (Sammlung Einsatzgebiete, `content/cities.json`) fasst der Lauf nicht an. Fehlt der Volltext der Arbeitsanweisung, bleibt `prioritaet.json`; der Lauf bricht ab, wenn einer ihrer Schlüssel im neuen Stand fehlt.
4. `npx vitest run scripts/orte-import.test.ts src/lib/orte`; erwartete Zahlen in den Tests an den neuen Stand anpassen.
5. Datenbank: Der Seed beim Build übernimmt den neuen Stand von selbst (in Stapeln, nur wenn sich etwas geändert hat). Ohne Build: `npx payload run src/lib/orte/uebernahme-lauf.ts` (mit `SM24_ORTSSTAMM_ERZWINGEN=1` auch bei gleichem Stand). Gemeinden, die der neue Stand nicht mehr führt, werden auf „nicht aktiv“ gesetzt, nie gelöscht.
