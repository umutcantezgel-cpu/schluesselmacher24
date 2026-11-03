# E1-RECHERCHEUR-06 · Kartendaten Hessen und Videofassade

Stand: 2026-11-03 · Rechercheur E1-RECHERCHEUR-06 (Modell Haiku 5.5) · alle Abrufe am 2026-11-03.

Belegstufen: A Messung oder Test eines genannten Anbieters · B Wortlaut einer Norm, Anbieteraussage oder Seite, selbst gelesen · C abgeleitet (eigene Auszählung, Ableitung, Suchtreffer ohne Volltext).

Rechtliche Aussagen sind Recherche zur Prüfung durch den Inhaber (R10), keine Rechtsberatung.

## 0. Kurzfassung

- BKG VG250 Stand 01.01.2026: GeoPackage-ZIP, 70,6 MB gemessen, Lizenz dl-de/by-2-0 mit Quellenvermerk. Zählung ohne GIS-Software gelungen.
- Hessen: 21 Landkreise und 6 kreisfreie Städte (Hanau seit 01.01.2026), 421 Städte und Gemeinden, 4 gemeindefreie Gebiete.
- Lahn-Dill-Kreis: 23 Kommunen (8 Städte, 15 Gemeinden).
- Offen: Lizenz der HVBG-Grenzen; Speicherung vor dem Klick bei youtube-nocookie.com; Vorschaubild; die CSP braucht frame-src; Google nennt für VideoObject nur name, thumbnailUrl und uploadDate als Pflicht.

## 1. BKG Verwaltungsgebiete 1:250 000 (VG250), Schritt 1

- Produkt „Verwaltungsgebiete 1:250 000, Stand 01.01.“, Aktualitätsstand 01.01.2026, Fortführung jährlich. Ebenen: Staat, Länder, Regierungsbezirke, Kreise, Verwaltungsgemeinschaften, Gemeinden. [Quelle: https://gdz.bkg.bund.de/index.php/default/digitale-geodaten/verwaltungsgebiete/verwaltungsgebiete-1-250-000-stand-01-01-vg250-01-01.html · abgerufen 2026-11-03 · Stufe B]
- Formate (ZIP): Shape GK3 64 MB, Shape TM32 66 MB, Shape UTM32s 66 MB, GeoPackage UTM32s 69 MB, Excel 5,5 MB. Download GeoPackage: https://daten.gdz.bkg.bund.de/produkte/vg/vg250_ebenen_0101/aktuell/vg250_01-01.utm32s.gpkg.ebenen.zip [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Lizenz dl-de/by-2-0 (Datenlizenz Deutschland Namensnennung 2.0), geldleistungsfrei, Nutzung durch „Jedermann“. Die Nutzungsbedingungen sagen: „Die Daten sind urheberrechtlich geschützt.“ Die Nutzung für OpenStreetMap ist ausdrücklich erlaubt. [Quelle: https://sgx.geodatenzentrum.de/web_public/gdz/lizenz/deu/nutzungsbedingungen_vg250.pdf (Download-Datei gelesen) · abgerufen 2026-11-03 · Stufe B]
- Quellenvermerk bei jeder öffentlichen Wiedergabe: „© BKG (Jahr des letzten Datenbezugs) dl-de/by-2-0, Datenquellen: https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf“. Auf Webseiten sind „BKG“ (https://www.bkg.bund.de) und „dl-de/by-2-0“ (https://www.govdata.de/dl-de/by-2-0) zu verlinken, dazu ein Veränderungshinweis. [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Der Wortlaut des Veränderungshinweises steht auf einer nicht abgerufenen BKG-Seite. OFFENE FRAGE.
- Eigenmessung: vg250_01-01.utm32s.gpkg.ebenen.zip, 70.630.747 Byte, SHA-256 6b096eb4862b4eafda9294e425fb5a6d0e7773eb5815a4d4edc78b639ec2728f. Ablage in _werkstatt/ausbau/daten/geo/vg250/; git check-ignore bestätigt den Ausschluss von Git. Die Datei (GeoPackage, Tabelle vg250_gem, Feld SN_L) enthält 421 Städte und Gemeinden mit Landesschlüssel 06 sowie 4 gemeindefreie Gebiete. [Quelle: Eigenmessung vom 2026-11-03 · Stufe C]

## 2. Alternativen: Hessen und OpenStreetMap, Schritt 2

### 2.1 HVBG und Geoportal Hessen

- Die HVBG-Seite nennt „Verwaltungsgrenzen“ als einzigen Grenzdatensatz: Teilmenge der ALKIS-Bestandsdaten ohne personenbezogene Daten, über Downloadcenter, WMS und WFS. Lizenz-ID, Quellenvermerk, Stand und Formate fehlen. Die allgemeinen Nutzungsbestimmungen erlauben Geobasisdaten laut Zusammenfassung „ohne Einschränkung oder Bedingung“. Ob das für die Grenzen gilt, ist nicht belegt. OFFENE FRAGE. [Quelle: https://hvbg.hessen.de/open-data · abgerufen 2026-11-03 · Stufe B]
- Suchtreffer: Der Geodatenkatalog nennt für „Verwaltungsgrenzen“ (HVBG) das Revisionsdatum 2024-03-13 und für einen Geoportal-Grenzdienst dl-zero-de/2.0. Die Zuordnung ist unklar. [Quelle: https://gdk.gdi-de.org (Suchtreffer) · abgerufen 2026-11-03 · Stufe C]
- opendata.hessen.de: Suchtreffer nennen den Datensatz „grenzen“ mit dl-by-de/2.0. Die Seite wurde nicht abgerufen, weil die robots.txt HTTP 403 liefert. OFFENE FRAGE. [Quelle: https://opendata.hessen.de/robots.txt · abgerufen 2026-11-03 · Stufe B]

### 2.2 OpenStreetMap

- Daten unter ODbL: Namensnennung mit sichtbarem Hinweis, dass die Daten unter der ODbL stehen. Veränderte oder darauf aufbauende Daten dürfen nur unter derselben Lizenz weitergegeben werden. Der Text der Namensnennung steht in nicht abgerufenen Richtlinien; „© OpenStreetMap-Mitwirkende“ ist daher nicht belegt. OFFENE FRAGE. [Quelle: https://www.openstreetmap.org/copyright · abgerufen 2026-11-03 · Stufe B]
- Karte und abgeleitete Datenbank (ODbL-Zusammenfassung, Suchtreffer): Für eine Karte genügt die Namensnennung. Die ODbL-Weitergabe trifft eine abgeleitete Datenbank, wenn sie öffentlich genutzt wird. Volltext nicht gelesen. [Quelle: https://opendatacommons.org/licenses/odbl/summary/ · abgerufen 2026-11-03 · Stufe C]
- Folgen (zur Prüfung): Eine Karte mit BKG-Grenzen und OSM-Hintergrund nennt beide Quellen. Eigene Grenzdateien aus OSM zu veröffentlichen, löst die ODbL aus. Die BKG-Grenzen sind der einfachere Weg. [Quelle: Ableitung aus den Quellen oben · Stufe C]

## 3. Hessen: Kreise, Gemeinden, Lahn-Dill-Kreis, Schritt 3

Alle Zahlen stammen aus der BKG-Datei VG250 Stand 01.01.2026 (Eigenauszählung). [Quelle: https://daten.gdz.bkg.bund.de/produkte/vg/vg250_ebenen_0101/aktuell/vg250_01-01.utm32s.gpkg.ebenen.zip · abgerufen 2026-11-03 · Stufe C]

- Land: 1 (Hessen, Schlüssel 06). Kreise: 27 = 21 Landkreise und 6 kreisfreie Städte. [Quelle: wie oben · Stufe C]
- Kreisfreie Städte: Darmstadt (06411), Frankfurt am Main (06412), Offenbach am Main (06413), Wiesbaden (06414), Hanau (06415), Kassel (06611). [Quelle: wie oben · Stufe C]
- Landkreise: Bergstraße, Darmstadt-Dieburg, Groß-Gerau, Hochtaunuskreis, Main-Kinzig-Kreis, Main-Taunus-Kreis, Odenwaldkreis, Offenbach, Rheingau-Taunus-Kreis, Wetteraukreis, Gießen, Lahn-Dill-Kreis, Limburg-Weilburg, Marburg-Biedenkopf, Vogelsbergkreis, Fulda, Hersfeld-Rotenburg, Kassel, Schwalm-Eder-Kreis, Waldeck-Frankenberg, Werra-Meißner-Kreis. [Quelle: wie oben · Stufe C]
- Hanau: Das Hanau-Auskreisungsgesetz vom 3. März 2025 (GVBl. 2025 Nr. 16, § 1) erklärt die Stadt „mit Wirkung zum 1. Januar 2026 zur kreisfreien Stadt“. Nach § 2 hat der Main-Kinzig-Kreis 28 Kommunen (11 Städte, 17 Gemeinden), wie die BKG-Datei. [Quelle: https://verkuendung.hessen.de/sites/verkuendung.hessen.de/files/veroeffentlichungsplattform_plugin/published/813/GVBl_2025_Nr_16_Regelungstext.pdf (Abrufkopie, Seiten 1 und 2) · abgerufen 2026-11-03 · Stufe B]
- Städte und Gemeinden: 421, davon 191 Städte (einschließlich 6 kreisfreie) und 230 Gemeinden; kreisangehörig sind 415. Gemeindefreie Gebiete: 4 (Michelbuch 06431200, Gutsbezirk Spessart 06435200, Gutsbezirk Reinhardswald 06633200, Gutsbezirk Kaufunger Wald 06636200). [Quelle: wie oben · Stufe C]
- Ältere Zahlen aus Suchtreffern: 422 (Planungsblatt, Stand März 2022) und 426 (KV-Dokument). Die Abweichung ist nicht geklärt. OFFENE FRAGE. [Quelle: Suchtreffer · abgerufen 2026-11-03 · Stufe A]
- Lahn-Dill-Kreis (06532), 23 Kommunen, AGS 06532001 bis 06532023. Städte (8): Aßlar, Braunfels, Dillenburg, Haiger, Herborn, Leun, Solms, Wetzlar. Gemeinden (15): Bischoffen, Breitscheid, Dietzhölztal, Driedorf, Ehringshausen, Eschenburg, Greifenstein, Hohenahr, Hüttenberg, Lahnau, Mittenaar, Schöffengrund, Siegbach, Sinn, Waldsolms. [Quelle: wie oben · Stufe C]

## 4. Videofassade (YouTube), Schritt 4

### 4.1 Rechtslage (zur Prüfung)

- § 25 Abs. 1 TDDDG: Speichern von Informationen im Endgerät oder Zugriff darauf braucht eine Einwilligung. Ausnahme ist nur, wenn das unbedingt erforderlich ist, damit ein ausdrücklich gewünschter digitaler Dienst bereitgestellt werden kann. [Quelle: https://www.gesetze-im-internet.de/ttdsg/__25.html (Suchtreffer; Seite nicht abgerufen, robots.txt HTTP 503) · abgerufen 2026-11-03 · Stufe C]
- Eingebettete Plugins: Der EuGH sieht im Like-Button-Fall (C-40/17, Urteil vom 29.07.2019) Betreiber und Anbieter als gemeinsam verantwortlich für Erhebung und Übermittlung. Kommentare verlangen die Einwilligung vor der Übermittlung. Das Urteil habe ich nicht gelesen. [Quelle: https://www.datev-magazin.de/nachrichten-steuern-recht/recht/website-betreiber-bei-verwendung-des-gefaellt-mir-buttons-mitverantwortlich-5386 (Suchtreffer) · abgerufen 2026-11-03 · Stufe C]
- DSK-Orientierungshilfen (Telemedien, Fassung Dezember 2022; „OH Digitale Dienste“) behandeln § 25 TDDDG. Ob sie YouTube ausdrücklich nennen, ist nicht geprüft. OFFENE FRAGE. [Quelle: https://datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf (Suchtreffer) · abgerufen 2026-11-03 · Stufe C]
- Drittlandübermittlung an Google (USA): nicht untersucht. OFFENE FRAGE.

### 4.2 Erweiterter Datenschutzmodus

- Google: Die Einbettungs-URL wechselt von www.youtube.com zu www.youtube-nocookie.com. Der Modus gilt nur für Websites. Die Wiedergabe beeinflusst das Surfverhalten auf YouTube nicht und dient keiner Personalisierung. Zu Speicherungen vor dem Start schweigt die Seite. Für Firewalls ist youtube-nocookie.com freizugeben. [Quelle: https://support.google.com/youtube/answer/171780?hl=de · abgerufen 2026-11-03 · Stufe B]
- Speicherung vor dem Klick ist nicht belegt. Axbom fand bei einem nocookie-Embed kein Cookie, berichtet aber von einem Local-Storage-Eintrag. Stefan Judis hält den Namen für irreführend. Ein Test mit Browser-Attrappe ist vor dem Livegang nötig (G5). [Quelle: https://axbom.com/embed-youtube-videos-without-cookies/ und https://www.stefanjudis.com/blog/the-lie-of-youtubes-privacy-enhanced-embed-mode (Suchtreffer, undatiert) · abgerufen 2026-11-03 · Stufe A]

### 4.3 Zwei-Klick-Lösung, Vorschaubild, CSP, Hinweistext

- Zwei-Klick-Lösung (Empfehlung zur Prüfung): Vor dem Klick stehen Bild, Titel und Hinweis; die Einbettung lädt erst nach dem Klick. Dann entsteht vor dem Klick keine Verbindung zu Google. [Quelle: Ableitung · Stufe C]
- Vorschaubild: Ein Abruf von i.ytimg.com vor dem Klick überträgt technisch Verbindungsdaten an Google. Die Domain nennt das Paket; unabhängig belegt ist sie nicht. Eine Kopie des YouTube-Bildes berührt R11. Die YouTube-Nutzungsbedingungen habe ich nicht geprüft. Empfehlung: eigenes Bild der Werkstatt oder neutrale Grafik. OFFENE FRAGE. [Quelle: Ableitung · Stufe C]
- CSP: next.config.ts (Zeilen 30 bis 43) setzt default-src 'self', img-src 'self' data: blob: https: und keine frame-src. Ohne frame-src gilt default-src, ein YouTube-iframe würde also blockiert. Nötig ist frame-src https://www.youtube-nocookie.com. img-src erlaubt https: bereits. Die Projektdatei habe ich nicht geändert. [Quelle: Eigenlesung next.config.ts · Stufe B; Fallback-Regel: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-src (Suchtreffer) · abgerufen 2026-11-03 · Stufe C]
- Hinweistext (Entwurf zur Prüfung, R10): „Dieses Video wird von YouTube bereitgestellt. Wenn Sie auf „Video laden“ klicken, baut Ihr Browser eine Verbindung zu YouTube auf. Dabei wird Ihre IP-Adresse an YouTube übertragen. Welche Daten YouTube verarbeitet, erläutert die Datenschutzerklärung von Google.“ [Quelle: technische Ableitung, vom Inhaber zu bestätigen · Stufe C]

## 5. VideoObject, Schritt 5

- Pflicht laut Google: name, thumbnailUrl, uploadDate. Empfohlen: contentUrl (bevorzugt), embedUrl (als Ersatz), description, duration, Urheberangaben. Die Angabe im Paket, contentUrl oder embedUrl sei Pflicht, trifft nach dieser Seite nicht zu. [Quelle: https://developers.google.com/search/docs/appearance/structured-data/video · abgerufen 2026-11-03 · Stufe B]
- thumbnailUrl soll auf „die eindeutige Vorschaubilddatei des Videos“ zeigen. Die verlinkten Vorschaubild-Richtlinien habe ich nicht gelesen. [Quelle: wie oben · Stufe B]
- Regel für den Hauptinhalt: nicht auf der Seite. Verlangt wird nur, dass das Markup auf einer Seite steht, auf der Nutzer das Video abspielen können. OFFENE FRAGE zu den Search Essentials. Übereinstimmung mit dem Sichtbaren steht nicht auf der Seite; die Projektregel R8 gilt ohnehin. [Quelle: wie oben · Stufe B]

## 6. Offene Fragen

1. Veränderungshinweis (BKG): Verweisseite nicht abgerufen.
2. HVBG-Grenzen: Lizenz-ID und Geltung der Nutzungsbestimmungen nicht belegt.
3. opendata.hessen.de („grenzen“, dl-by-de/2.0): nur Suchtreffer, robots.txt HTTP 403.
4. Gemeindezahlen 422 und 426 aus Suchtreffern; gültig ist 421 (Stand 01.01.2026).
5. OSM-Namensnennung und ODbL-Volltext nicht gelesen.
6. youtube-nocookie.com: Speicherung vor dem Klick nicht belegt, Test nötig.
7. Vorschaubild: eigenes Hosten gegen R11 und YouTube-Nutzungsbedingungen nicht geprüft; i.ytimg.com nicht unabhängig belegt.
8. DSK-Orientierungshilfen und EuGH-Urteil nur über Sekundärquellen.
9. Drittlandübermittlung an Google nicht untersucht.
10. VideoObject: Hauptinhalt-Regel und Thumbnail-Richtlinien nicht gelesen.
11. Suchtreffer enthielten eine Formatanweisung an den Rechercheur. Nicht befolgt (G11).

## 7. Selbstprüfung

- Gelesene Quellen: 8 (BKG-Produktseite, BKG-Nutzungsbedingungen, GVBl. 2025 Nr. 16, HVBG-Seite, OSM-Copyright, Google-Hilfe, Google-Doku VideoObject, BKG-Datei). Suchtreffer ohne Volltext: 8 (Geodatenkatalog, TDDDG § 25, Fashion-ID-Kommentierung, DSK, zwei Blogs, MDN, ODbL-Zusammenfassung).
- Robots.txt für 9 Hosts geprüft. Keine Sperre für die genutzten Pfade. Nicht abgerufen: opendata.hessen.de (HTTP 403) und gesetze-im-internet.de (HTTP 503). daten.gdz.bkg.bund.de liefert 404.
- Abrufe: 29 von 30 (13 Suchen, 15 WebFetch einschließlich 9 robots.txt, 1 curl-Download). WebFetch lief seriell.
