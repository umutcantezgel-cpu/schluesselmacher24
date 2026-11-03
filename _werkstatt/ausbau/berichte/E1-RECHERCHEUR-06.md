# E1-RECHERCHEUR-06 · Bericht Kartendaten Hessen und Videofassade

Stand 2026-11-03 · Ergebnisdatei: /home/user/schluesselmacher24/_werkstatt/ausbau/erhebung/E1-karte-video.md (1.525 Wörter)

## GEÄNDERTE DATEIEN

- _werkstatt/ausbau/erhebung/E1-karte-video.md (neu geschrieben; Git-Commit ba68481 enthält eine ältere Fassung derselben Datei, die Arbeitskopie fehlte beim Start)
- _werkstatt/ausbau/berichte/E1-RECHERCHEUR-06.md (dieser Bericht)
- _werkstatt/ausbau/daten/geo/vg250/vg250_01-01.utm32s.gpkg.ebenen.zip (eine Datei, 70,6 MB, durch .gitignore von Git ausgeschlossen)
- Keine Projektdatei geändert.

## WAS UND WARUM

- Schritt 1: BKG VG250 Stand 01.01.2026 als GeoPackage geladen, Ebenen, Formate, Lizenz dl-de/by-2-0 und Quellenvermerk ermittelt. Zählung über die Datei ohne GIS-Software.
- Schritt 2: HVBG-Lizenz für „Verwaltungsgrenzen“ nicht belegt (offen). OSM-Pflichten belegt: Namensnennung, Weitergabe bei veränderten Daten. Empfehlung: BKG-Grenzen verwenden.
- Schritt 3: Hessen 21 Landkreise und 6 kreisfreie Städte, weil Hanau seit 01.01.2026 kreisfrei ist (GVBl. 2025 Nr. 16, § 1). 421 Städte und Gemeinden, 4 gemeindefreie Gebiete. Lahn-Dill-Kreis: 23 Kommunen, Liste in der Ergebnisdatei.
- Schritt 4: Google belegt den erweiterten Datenschutzmodus nur teilweise. Zu Speicherungen vor dem Klick gibt es keine belegte Aussage, ein Test ist nötig. Die aktuelle CSP enthält kein frame-src und würde ein YouTube-Embed blockieren. Vorschaubild: eigenes Bild statt Kopie, wegen R11.
- Schritt 5: Google nennt als Pflicht nur name, thumbnailUrl und uploadDate. contentUrl und embedUrl sind empfohlen, nicht Pflicht. Das weicht vom Paket ab.

## GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste)

1. next.config.ts, Funktion csp(), nach der Zeile `"img-src 'self' data: blob: https:",` einfügen: `"frame-src 'self' https://www.youtube-nocookie.com",` Nur umsetzen, wenn der Video-Embed nach dem Klick freigegeben wird. Das 'self' muss bleiben, sonst blockiert die Zeile bestehende Frames.

## PRÜFUNG UND ERGEBNIS

- Zählung der BKG-Datei: 1 Land, 27 Kreise, 421 Kommunen, davon 191 Städte inklusive 6 kreisfreier, 230 Gemeinden. Abgleich: Der Main-Kinzig-Kreis hat nach § 2 des Gesetzes 28 Kommunen, die Datei zählt ebenfalls 28.
- Herkunft der Datei verifiziert: Größe 70.630.747 Byte, SHA-256 6b096eb4862b4eafda9294e425fb5a6d0e7773eb5815a4d4edc78b639ec2728f.
- Robots.txt für 9 Hosts geprüft, keine Sperre für die genutzten Pfade. Nicht abgerufen: opendata.hessen.de (HTTP 403) und gesetze-im-internet.de (HTTP 503).
- Abrufe: 29 von 30 (13 Suchen, 15 WebFetch einschließlich 9 robots.txt, 1 curl-Download). WebFetch seriell, ein Abruf je Antwort.
- Ein PDF war für WebFetch nicht lesbar. Die gespeicherte Abrufkopie wurde lokal gelesen.

## BELEGE

- Gelesen (8): BKG-Produktseite, BKG-Nutzungsbedingungen (aus dem Download), GVBl. 2025 Nr. 16, HVBG-Open-Data-Seite, OSM-Copyright, Google-Hilfe zum Einbetten, Google-Doku VideoObject, BKG-Datei (eigene Auszählung).
- Suchtreffer ohne Volltext (8): Geodatenkatalog, TDDDG § 25, Fashion-ID-Kommentierung, DSK-Orientierungshilfe, zwei Blogbeiträge, MDN frame-src, ODbL-Zusammenfassung.
- Jede Faktenzeile der Ergebnisdatei trägt Quelle, Abrufdatum und Belegstufe.

## OFFENE FRAGEN

1. Wortlaut des Veränderungshinweises des BKG, auf einer nicht abgerufenen Seite.
2. Lizenz-ID des HVBG-Grenzdatensatzes und Geltung der allgemeinen Nutzungsbestimmungen.
3. Datensatz „grenzen“ auf opendata.hessen.de (dl-by-de/2.0): nur Suchtreffer.
4. Speicherung vor dem Klick bei youtube-nocookie.com: Test mit Browser-Attrappe nötig (G5).
5. Vorschaubild: eigenes Bild oder neutrale Grafik, nicht die Kopie eines YouTube-Bildes (R11). Die YouTube-Nutzungsbedingungen sind nicht geprüft.
6. VideoObject: Hauptinhalt-Regel und Thumbnail-Richtlinien (Search Essentials) nicht gelesen.
7. DSK-Orientierungshilfen, EuGH-Urteil C-40/17 und Drittlandübermittlung an Google nur über Sekundärquellen oder nicht untersucht.
8. Gemeindezahlen 422 und 426 aus Suchtreffern weichen ab. Gültig ist 421 nach BKG, Stand 01.01.2026.
9. Ein Suchtreffer enthielt eine Formatanweisung an den Rechercheur. Sie wurde nicht befolgt (G11).

=== ENDE E1-RECHERCHEUR-06 · BEREIT ZUR RÜCKGABE ===
