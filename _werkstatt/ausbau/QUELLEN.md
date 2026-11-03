# QUELLEN · Datenquellen, Lizenzen und Lücken (Stand 2026-11-03)

Für jede Quelle: Zweck · Inhalt · Lizenz und Nutzung · Stand · Abruf · Ablage · Lücken. Vertrauliche oder große Rohdateien liegen in `_werkstatt/ausbau/daten/` (nie committet); ins Projekt gelangen nur abgeleitete, lizenzkonforme Auszüge mit Quellenvermerk.

## Fahrzeuge (G-14, G-17, Z-07)

### KBA FZ 12 · Bestand an Pkw nach Segmenten und Modellreihen
- Zweck: Marken und Modellreihen des Katalogs, Gewichtung, Abdeckungsmessung (Z-07).
- Inhalt: Stichtag 1.1.2026, veröffentlicht 27.4.2026, Blatt FZ 12.1 mit 696 Zeilen (Segment, Modellreihe mit Markenpräfix, Anzahl und Anteil 2026 und 2025). Gesamtbestand 49.486.487 Pkw; 649 benannte Reihen = 97,33 %; „SONSTIGE“ 2,66 %. Ausgewiesen ab 1.000 Fahrzeugen.
- Lizenz: KBA-AGB (Stand 9/2022) § 1 Abs. 3: kostenfreie statistische Veröffentlichungen uneingeschränkt nutzbar mit Quellenangabe nach Datenlizenz Deutschland, Namensnennung 2.0. Das Blatt selbst nennt „© Kraftfahrt-Bundesamt, Flensburg“. Pflicht: Quellenvermerk „Quelle: Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0“ auf der Seite des Fahrzeugkatalogs und in content/fahrzeugkatalog.json.
- Abruf: https://www.kba.de/SharedDocs/Downloads/DE/Statistik/Fahrzeuge/FZ12/fz12_2026.xlsx (2026-11-02), SHA-256 08617982a04255cb22a78dceef5655f71f90baf79d90f618d0f6d14608ba1db5, 132.783 Byte.
- Ablage: `_werkstatt/ausbau/daten/kba/fz12_2026.xlsx`, abgeleitet `fz12_2026_modellreihen_abgeleitet.csv` (663 Zeilen, Rang, Kennzeichen 95 %).
- Abdeckung: 348 größte Reihen = 95,004 % (Reserve 1.961 Fahrzeuge), 535 Reihen = 97 %, 26 Marken für 95 %. Ziel des Katalogs: alle 649 benannten Reihen, mindestens die 535 für 97 %.
- Lücken: kein Baujahr, keine Generation, Markennamen als Präfix in Großbuchstaben (Aliasliste nötig: VW → Volkswagen, MERCEDES → Mercedes-Benz, SKODA → Škoda, SSANGYONG → KGM). Wortlaut der Datenlizenz-Seite nicht abgerufen (robots.txt sperrt /DE/Service/).

### Wikidata · Automodelle mit Hersteller und Bauzeitraum
- Zweck: Bauzeiträume je Generation, wo vorhanden.
- Lizenz: strukturierte Daten CC0.
- Abruf: Einzelseiten möglich; der SPARQL-Endpunkt ist per robots.txt für automatisierte Abrufe gesperrt („Disallow: /sparql“). Daher kein automatischer Massenabruf in diesem Lauf. Optional: Ein Mensch führt die vorbereitete Abfrage (erhebung/E1-fahrzeugquellen.md Abschnitt 2) im Browser aus und legt das CSV in `eingang` (MENSCHEN.md).
- Lücken: Datumsfelder uneinheitlich (P571/P580, P2669/P582), Hersteller teils Konzern.

### EEA · CO2-Monitoring Neuzulassungen 2010 bis 2025
- Zweck: Kontrolle von Modellnamen und Zulassungsjahren (kein Bestand, kein Baujahr).
- Lizenz: CC BY 4.0 laut Katalog, mit widersprüchlichem Einschränkungsfeld. Nicht genutzt, solange KBA genügt.

## Transponder (G-18)
- Herstellerseiten von Werkstattgeräten (Silca, Keyline, Abrites, Autel), Fachbetrieb kfz-dietrich.com, ADAC, TI-Datenblatt (erhebung/E1-transponder.md). Nur als Kandidatenliste für den Bogen KLONBAR, nie als Angabe auf der Seite. Lücken: Xhorse und NXP nicht erreichbar, JMA nur Stand 2010.

## Schließtechnik (G-27 bis G-32)
- Herstellerunterlagen ABUS (abus.com per robots.txt gesperrt; nur Suchauszüge und PDF auf c1.abus.com), BKS (bks.de, Produktseiten mit Anmeldung), ASSA ABLOY (dach.assaabloy.com sperrt ClaudeBot), Normenseiten DIN Media, KPK-Verzeichnis (Polizei Niedersachsen, Stand 2025-01), Baunetz Wissen. Einzelheiten in FACHWISSEN.md und den Erhebungen.

## Karte (G-42) · erhebung/E1-karte-video.md
- Zweck: Grenzen der Kreise, Städte und Gemeinden in Hessen für die selbst gehostete Karte mit Listenansicht (E7-OPUS-03).
- Quelle: BKG Verwaltungsgebiete 1:250 000 (VG250), Stand 01.01.2026, jährlich fortgeführt; GeoPackage-ZIP 70.630.747 Byte, SHA-256 6b096eb4862b4eafda9294e425fb5a6d0e7773eb5815a4d4edc78b639ec2728f.
- Inhalt (Eigenauszählung): Hessen mit 21 Landkreisen und 6 kreisfreien Städten (Hanau kreisfrei seit 01.01.2026, GVBl. 2025 Nr. 16), 421 Städte und Gemeinden, 4 gemeindefreie Gebiete; Lahn-Dill-Kreis mit 23 Kommunen (8 Städte, 15 Gemeinden).
- Lizenz: Datenlizenz Deutschland Namensnennung 2.0 (dl-de/by-2-0), geldleistungsfrei. Pflicht bei jeder Wiedergabe: „© BKG (Jahr des letzten Datenbezugs) dl-de/by-2-0, Datenquellen: https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf“, Links auf https://www.bkg.bund.de und https://www.govdata.de/dl-de/by-2-0, dazu ein Veränderungshinweis (Wortlaut noch nicht abgerufen).
- Ablage: `_werkstatt/ausbau/daten/geo/vg250/` (nicht committet); ins Projekt nur ein vereinfachter Auszug für Hessen mit Quellenvermerk.
- Alternativen: HVBG-Verwaltungsgrenzen (Lizenz-ID nicht belegt), opendata.hessen.de (robots.txt HTTP 403), OpenStreetMap (ODbL: Namensnennung; eigene abgeleitete Grenzdateien lösen die Weitergabepflicht aus). Entscheidung: BKG.
- Lücken: Veränderungshinweis, OSM-Namensnennung im Wortlaut, ältere Gemeindezahlen 422 und 426 aus Suchtreffern (gültig ist 421).

## Video (G-44) · erhebung/E1-karte-video.md
- Zweck: Anleitungen hinter einer Datenschutz-Fassade (E8-OPUS-03).
- Quellen: Google-Hilfe zum erweiterten Datenschutzmodus (youtube-nocookie.com, B); Google-Dokumentation VideoObject (Pflicht name, thumbnailUrl, uploadDate; empfohlen contentUrl oder embedUrl; seit 24.09.2026 Feld creator, B); § 25 TDDDG nur als Suchtreffer (C).
- Folgen: Zwei-Klick-Lösung, vor dem Klick keine Verbindung zu Google (auch kein Vorschaubild von YouTube, eigenes Bild); CSP braucht `frame-src https://www.youtube-nocookie.com`; Hinweistext als Entwurf zur Prüfung durch den Inhaber (R10).
- Lücken: Speicherung vor dem Klick bei youtube-nocookie.com nicht belegt (Test mit Attrappe vor dem Livegang), Drittlandübermittlung, DSK-Orientierungshilfe nur als Suchtreffer.

## Suche und KI-Antworten (Auftrag 13) · erhebung/E1-lagebild-suche.md
- Zweck: Prüfung des Lagebilds und der Hebel (LAGEBILD.md Abschnitt 8, KANTEN.md).
- Quellen (alle abgerufen 2026-11-03, Herstellerangaben Stufe B): developers.google.com (Ranking-Systeme, KI-Funktionen, KI-Leitfaden, Spam-Richtlinien, Hinweise zu generativer KI, Updates-Seite, Strukturdaten LocalBusiness, Product, Merchant Listings, Video, FAQPage, Favicon, Seitennamen, Robots-Meta-Tag, Steuerung „control what you share“, Blogbeiträge vom 03.06. und 30.10.2026), blogs.bing.com (KI-Leistung in Bing Webmaster Tools, 10.02.2026), indexnow.org (Dokumentation und Teilnehmerliste), web.dev (Schwellen der Core Web Vitals), developer.chrome.com (Speculation Rules), Crawler-Seiten von OpenAI, Anthropic und Perplexity; Messung Vercel zu KI-Crawlern (Dezember 2024, Stufe A).
- Lücken: Bing und llms.txt, offizielle Dokumentation zu Google-Extended, aktuelle Messung der KI-Crawler, Ergebnisbilder für Deutschland.

## Nachfrage (Auftrag 13) · erhebung/E1-nachfrage.md
- Zweck: Suchfamilien, Leitanfragen und Ergebnisbilder (KARTE.md).
- Quellen: Suchauszüge und gelesene Seiten vom 2026-11-03 (Stufe B für Formulierungen, A nur für Preisangaben genannter Anbieter: ADAC, AutoScout24, Allianz Direct, pkw.de, GDV). 73 belegte Adressen.
- Lücken: kein Suchvolumen, keine Suchvorschläge, keine Kartenergebnisse; die Websuche kann US-gewichtet sein. Datenanfrage an den Inhaber: MA-10.

## Wettbewerb (G-31) · erhebung/E1-wettbewerb.md
- Zweck: Struktur, Abläufe, Preise und Preisgründe von vier Anbietern (WETTBEWERB.md).
- Quellen: e-schliessanlage.de, schluessel24.com, schliessanlagen-direkt.de, schliesszylinder-shop.com, gelesen am 2026-11-03; autoschluesselgehaeuse.de nicht lesbar (robots.txt HTTP 503).
- Nutzung: nur als Entscheidungsvorlage, nichts übernehmen (R11); Preise ohne Stand-Datum der Anbieter, Momentaufnahme.

## Versand (G-24, G-25, Z-08) · erhebung/E1-versand.md
- Deutsche Post „Leistungen und Preise“ (Stand 09/2026) und Preisblatt 01/2026: Kompaktbrief 1,10 €, Großbrief 1,80 €, Einschreiben Einwurf 4,15 € im Großbrief (Haftung 20 €), Einschreiben 4,45 € (25 €), Einschreiben Wert 6,25 € (bis 500 €, nur Filiale); DHL Päckchen S 4,19 €, Paket bis 5 kg 7,69 € (500 € Haftung inklusive).
- AGB Internetmarke und Portokasse (Stand 01/2024): Kundensendungen über die eigene Portokasse unzulässig (Ziffer VI 4); gewerbliche Weitergabe vertragswidrig. Folge: Versandmarken für Kunden nur über DHL Retoure mit Geschäftskundenvertrag (Retouren-API v1.1.0, developer.dhl.com); ohne Vertrag Begleitschein, der Kunde frankiert.
- Lücken: Retourenpreise nicht veröffentlicht, Haftung Päckchen und Brief ohne Zusatz offen, GLS und DPD ohne Quelle, Preise 2027 nicht geprüft.
