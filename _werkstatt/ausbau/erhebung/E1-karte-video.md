# E1-RECHERCHEUR-06 · Kartendaten Hessen und Videofassade

Stand: 2026-11-03 · Rechercheur E1-RECHERCHEUR-06 (Modell Haiku 5.5). Alle Abrufe am 2026-11-03.

Belegstufen: A Messung oder Schätzung eines genannten Anbieters · B nachweislich verwendete Formulierung oder Herstellerangabe (Gesetzeswortlaut, Anbieterseite) · C abgeleitet (eigene Auszählung oder Ableitung).

Rechtliche Aussagen sind Recherche zur Prüfung durch den Inhaber (R10), keine Rechtsberatung.

## 0. Ergebnis in Zahlen

- Verwaltungsgrenzen: BKG VG250, Stand 01.01.2026, GeoPackage als ZIP (69 MB laut Anbieter, 70,6 MB gemessen), Lizenz dl-de/by-2-0 mit Quellenvermerk.
- Hessen (Stand 01.01.2026): 21 Landkreise und 6 kreisfreie Städte, zusammen 27 Kreise. Das sind 5 kreisfreie Städte plus Hanau, das seit 01.01.2026 kreisfrei ist.
- Gemeinden: 421 Städte und Gemeinden (davon 6 kreisfreie Städte) und 4 gemeindefreie Gebiete.
- Lahn-Dill-Kreis: 23 Kommunen (8 Städte, 15 Gemeinden), Liste in Abschnitt 3.
- Lizenzfragen zu Grenzdaten des Landes Hessen sind offen (Abschnitt 2).
- Videofassade: siehe Abschnitte 4 und 5.

## 1. BKG Verwaltungsgebiete 1:250 000 (VG250), Schritt 1

- Produkt „Verwaltungsgebiete 1:250 000, Stand 01.01. (VG250 01.01.)“, Aktualitätsstand 01.01.2026, Fortführungszyklus 1 Jahr. [Quelle: https://gdz.bkg.bund.de/index.php/default/digitale-geodaten/verwaltungsgebiete/verwaltungsgebiete-1-250-000-stand-01-01-vg250-01-01.html · abgerufen 2026-11-03 · Stufe B]
- Ebenen: Staat, Länder, Regierungsbezirke, Kreise, Verwaltungsgemeinschaften und Gemeinden. [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Formate im Direktdownload, jeweils ZIP: Shape GK3 64 MB, Shape TM32 66 MB, Shape UTM32s 66 MB, GeoPackage UTM32s 69 MB, Excel 5,5 MB. Datenmenge laut Seite 70 MB. GeoPackage nur in UTM32s angeboten. [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Download-Adresse GeoPackage: https://daten.gdz.bkg.bund.de/produkte/vg/vg250_ebenen_0101/aktuell/vg250_01-01.utm32s.gpkg.ebenen.zip [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Lizenz: Datenlizenz Deutschland Namensnennung 2.0 (dl-de/by-2-0), geldleistungsfrei, Nutzungsberechtigte „Jedermann“. [Quelle: wie oben und Nutzungsbedingungen · abgerufen 2026-11-03 · Stufe B]
- Nutzungsbedingungen (Dokument Stand 19.08.2025, Produktstand ab 31.12.2023): „Die Daten sind urheberrechtlich geschützt.“ Die Verwendung für Pflege und Erweiterung von OpenStreetMap ist unter Einhaltung der Namensnennung ausdrücklich erlaubt. [Quelle: https://sgx.geodatenzentrum.de/web_public/gdz/lizenz/deu/nutzungsbedingungen_vg250.pdf (gelesen aus der Download-Datei dokumentation/nutzungsbedingungen_vg250.pdf) · abgerufen 2026-11-03 · Stufe B]
- Quellenvermerk: Bei jeder öffentlichen Wiedergabe, Verbreitung oder Präsentation sowie bei externer Nutzung einer Bearbeitung ist ein deutlich sichtbarer Quellenvermerk mit Veränderungshinweis anzubringen. Auf Webseiten sind „BKG“ (Link https://www.bkg.bund.de) und „dl-de/by-2-0“ (Link https://www.govdata.de/dl-de/by-2-0) zu verlinken. Vorgegebener Text: „© BKG (Jahr des letzten Datenbezugs) dl-de/by-2-0, Datenquellen: https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf“. [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Der Wortlaut des Veränderungshinweises steht nicht im PDF, sondern auf einer verlinkten Seite (gdz.bkg.bund.de, Hinweise zu Nutzungsbedingungen und Quellenvermerken). Diese Seite wurde nicht abgerufen. OFFENE FRAGE.
- Eigene Prüfung der Datei: vg250_01-01.utm32s.gpkg.ebenen.zip, 70.630.747 Byte, SHA-256 6b096eb4862b4eafda9294e425fb5a6d0e7773eb5815a4d4edc78b639ec2728f. Ablage in einem eigens angelegten leeren Ordner unter _werkstatt/ausbau/daten/geo/vg250/, den .gitignore nicht erfasst (Regel /daten/). [Quelle: Eigenmessung, Datei vom 2026-11-03 · Stufe C]
- Enthalten ist DE_VG250.gpkg (118.579.200 Byte, nur im Scratch-Ordner entpackt). Die Tabellen vg250_lan, vg250_krs und vg250_gem tragen den Landesschlüssel im Feld SN_L. Die Zählung erfolgte schreibgeschützt mit der Python-Standardbibliothek, ohne GIS-Software. [Quelle: Eigenmessung · Stufe C]

## 2. Alternativen: Hessen und OpenStreetMap, Schritt 2

### 2.1 HVBG und Geoportal Hessen

- Die HVBG-Seite nennt „Verwaltungsgrenzen“ als einzigen Grenzdatensatz. Er gehört zu den ALKIS-Bestandsdaten ohne Eigentümer und ohne personenbezogene Daten und ist über Downloadcenter, WMS und WFS erhältlich. [Quelle: https://hvbg.hessen.de/open-data · abgerufen 2026-11-03 · Stufe B]
- Gemeinde-, Kreis- und Landesgrenzen als eigene Datensätze nennt die Seite nicht. Auch Lizenz-ID, Quellenvermerk, Stand und Dateiformate fehlen. [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Die allgemeinen Nutzungsbestimmungen der Seite erlauben die Nutzung von Geobasisdaten laut Zusammenfassung „ohne Einschränkung oder Bedingung“. Ausgenommen sind personenbezogene Daten. Ob das für den Grenzdatensatz gilt, ist nicht belegt. OFFENE FRAGE. [Quelle: wie oben · abgerufen 2026-11-03 · Stufe B]
- Suchtreffer im Geodatenkatalog (nicht abgerufen) nennen für HVBG-Dienste die Lizenz dl-zero-de/2.0 und einen Revisionsstand 2024-03-13. Welcher Datensatz gemeint ist, ist nicht geklärt. [Quelle: https://gdk.gdi-de.org (Suchtreffer) · abgerufen 2026-11-03 · Stufe A]
- Das hessische Open-Data-Portal führt laut Suchtreffer einen Datensatz „grenzen“ mit Lizenz dl-by-de/2.0. Die Seite selbst wurde nicht abgerufen, weil die robots.txt von opendata.hessen.de mit HTTP 403 nicht lesbar war. OFFENE FRAGE. [Quelle: https://opendata.hessen.de/robots.txt (Antwort HTTP 403) · abgerufen 2026-11-03 · Stufe B]

### 2.2 OpenStreetMap

- ZUSATZ FOLGT IM NÄCHSTEN SCHRITT (wird ergänzt, sobald die OSM-Seite gelesen ist)

## 3. Hessen: Kreise, kreisfreie Städte, Gemeinden, Lahn-Dill-Kreis, Schritt 3

Alle Zahlen dieses Abschnitts stammen aus der BKG-Datei, Stand 01.01.2026 (Eigenauszählung, Belegstufe C). Die Datei ist die Quelle: [Quelle: https://daten.gdz.bkg.bund.de/produkte/vg/vg250_ebenen_0101/aktuell/vg250_01-01.utm32s.gpkg.ebenen.zip · abgerufen 2026-11-03 · Stufe C]

- Land: 1 (Hessen, Schlüssel 06).
- Kreise: 27 = 21 Landkreise + 6 kreisfreie Städte.
- Kreisfreie Städte (6): Darmstadt (06411), Frankfurt am Main (06412), Offenbach am Main (06413), Wiesbaden (06414), Hanau (06415), Kassel (06611).
- Landkreise (21): Bergstraße, Darmstadt-Dieburg, Groß-Gerau, Hochtaunuskreis, Main-Kinzig-Kreis, Main-Taunus-Kreis, Odenwaldkreis, Offenbach, Rheingau-Taunus-Kreis, Wetteraukreis, Gießen, Lahn-Dill-Kreis, Limburg-Weilburg, Marburg-Biedenkopf, Vogelsbergkreis, Fulda, Hersfeld-Rotenburg, Kassel, Schwalm-Eder-Kreis, Waldeck-Frankenberg, Werra-Meißner-Kreis.
- Hanau: Das Gesetz vom 3. März 2025 (GVBl. 2025 Nr. 16, § 1) erklärt die Stadt „mit Wirkung zum 1. Januar 2026 zur kreisfreien Stadt“ und gliedert sie aus dem Main-Kinzig-Kreis aus. [Quelle: https://verkuendung.hessen.de/sites/verkuendung.hessen.de/files/veroeffentlichungsplattform_plugin/published/813/GVBl_2025_Nr_16_Regelungstext.pdf · abgerufen 2026-11-03 · Stufe B]
- Main-Kinzig-Kreis nach § 2 des Gesetzes: 28 Kommunen (11 Städte, 17 Gemeinden). Die BKG-Datei liefert dieselbe Zahl. [Quelle: wie oben · Stufe B; Abgleich Stufe C]
- Städte und Gemeinden: 421 insgesamt, davon 191 Städte (einschließlich 6 kreisfreie) und 230 Gemeinden. Kreisangehörig sind 415. [Quelle: BKG-Datei · abgerufen 2026-11-03 · Stufe C]
- Gemeindefreie Gebiete (4): Michelbuch (06431200), Gutsbezirk Spessart (06435200), Gutsbezirk Reinhardswald (06633200), Gutsbezirk Kaufunger Wald (06636200). [Quelle: BKG-Datei · abgerufen 2026-11-03 · Stufe C]
- Abweichende ältere Zahlen aus Suchtreffern (nicht gelesen): 422 Städte und Gemeinden (Planungsblatt, Stand März 2022) und 426 Gemeinden insgesamt (KV-Planungsdokument). Die Ursache der Abweichung ist nicht geklärt. OFFENE FRAGE. [Quelle: Suchtreffer 2026-11-03 · Stufe A]
- Lahn-Dill-Kreis (06532), 23 Kommunen:
  - Städte (8): Aßlar (06532001), Braunfels (06532003), Dillenburg (06532006), Haiger (06532011), Herborn (06532012), Leun (06532016), Solms (06532021), Wetzlar (06532023).
  - Gemeinden (15): Bischoffen (06532002), Breitscheid (06532004), Dietzhölztal (06532005), Driedorf (06532007), Ehringshausen (06532008), Eschenburg (06532009), Greifenstein (06532010), Hohenahr (06532013), Hüttenberg (06532014), Lahnau (06532015), Mittenaar (06532017), Schöffengrund (06532018), Siegbach (06532019), Sinn (06532020), Waldsolms (06532022).
  - [Quelle: BKG-Datei · abgerufen 2026-11-03 · Stufe C]

## 4. Videofassade (YouTube), Schritt 4

- AUSSTEHEND: wird nach der Quellenlesung ergänzt.

## 5. VideoObject, Schritt 5

- AUSSTEHEND: wird nach der Quellenlesung ergänzt.

## 6. Offene Fragen (Zwischenstand)

- Veränderungshinweis: Wortlaut nicht gelesen (Verweisseite des BKG).
- Lizenz des HVBG-Grenzdatensatzes und der Geltungsbereich der allgemeinen Nutzungsbestimmungen sind nicht belegt.
- Lizenz des Datensatzes „grenzen“ auf opendata.hessen.de (dl-by-de/2.0, nur Suchtreffer) ist nicht geprüft; die Seite war nicht abrufbar.
- Ältere Gemeindezahlen (422, 426) weichen ab. Die Ursache ist offen.
- Suchergebnisse zu Hessen enthielten eine Formatanweisung an den Rechercheur. Sie wurde nicht befolgt (G11).
