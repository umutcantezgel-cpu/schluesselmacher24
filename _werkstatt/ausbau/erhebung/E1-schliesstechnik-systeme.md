# E1-FACHKUNDLER-01 · Schließtechnik: Systeme, Anlagenarten, ABUS und BKS

Stand 2026-11-02. Titel sind ohne Gedankenstriche wiedergegeben, Doppelpunkte ersetzen die Striche.

## 0 Methode und Grenzen

- Suche per WebSearch. Angaben zu abus.com, bks.de, g-u.com und dach.assaabloy.com stammen aus Suchauszügen und sind nicht am Original geprüft.
- Abgerufen per WebFetch nach robots.txt-Prüfung: DIN EN 1303:2026 (dinmedia.de) und ein Baunetz-Artikel.
- Nicht abgerufen: abus.com (robots.txt HTTP 403) und dach.assaabloy.com (robots.txt sperrt ClaudeBot). bks.de und g-u.com leiten Produktseiten auf eine Anmeldung um. Diese Umleitung wurde nicht verfolgt.
- Belegstufen: keine Stufe A, da keine Messungen vorliegen. B: Herstellerangabe oder verwendete Formulierung. C: abgeleitet oder Berichterstattung. Markt jeweils am Ende der Angabe.

## 1 Bestand

- Katalog gleichschließender Zylinder: Doppel- und Knaufzylinder 27 bis 80 mm, Halbzylinder bis 60 mm, Schritt 5 mm. Herstellerfeld leer. Preise nicht übernommen. [Quelle: /home/user/schluesselmacher24/content/cylinder-catalog.json · abgerufen 2026-11-02 · Stufe C]
- Die Seite nennt „Die fünf Systeme“. Die Komponente beschreibt vier Schließsysteme. Die fünfte Karte „Erweiterbare Anlage“ heißt dort „Kein eigenes Schließsystem“. Die Hauptschlüssel-Zentralschlossanlage fehlt. [Quelle: /home/user/schluesselmacher24/src/components/schliessanlagen/system-erklaerung.tsx · abgerufen 2026-11-02 · Stufe C]
- „Bravus“ kommt in content/ nicht vor. Zylinderkatalog.ts nennt ABUS und BKS nur als Beispiele (OFFENE FRAGE 1). [Quelle: /home/user/schluesselmacher24/src/payload/globals/Zylinderkatalog.ts · abgerufen 2026-11-02 · Stufe C]

## 2 Anlagenarten und Begriffe

- **Gleichschließung:** ein Schlüssel für mehrere Zylinder mit gleicher Codierung, Bautypen dürfen verschieden sein. Einzelschließung: jeder Zylinder nur mit seinem Schlüssel. Typisch laut ABUS: Mietwohnungen, Garagentore, Einfamilienhäuser. Baunetz definiert das Substantiv nicht. [Quelle: https://www.abus.com/de/Privat/Themenwelten-Highlights/Themenwelt-Tuerzylinder/Schliessungsarten · abgerufen 2026-11-02 · Stufe B · DE]
- **Schließanlage:** Zylinder und Schlüssel mit verschiedenen Schließungen oder Profilen, untereinander verknüpft (DIN 18252, Ausgabe 1999, zitiert von Baunetz). [Quelle: https://www.baunetzwissen.de/sicherheitstechnik/fachwissen/mechan-schliesstechnik/schliessanlagen---arten-und-funktionen-164832 · abgerufen 2026-11-02 · Stufe B · DE]
- **Zentralschließanlage (Z):** mehrere Einzelschlüssel öffnen je mindestens einen Zentralzylinder, ohne Hauptschlüssel (ASSA ABLOY, Suchauszug). Die Quellen schreiben überwiegend „Zentralschließanlage“, das Projekt „Zentralschlossanlage“. [Quelle: https://www.baunetzwissen.de/sicherheitstechnik/fachwissen/mechan-schliesstechnik/schliessanlagen---arten-und-funktionen-164832 · abgerufen 2026-11-02 · Stufe B · DE; https://dach.assaabloy.com/de/images/catalog/mediacockpit/IKON/orig/Schliessanlagenarten_DE.pdf · abgerufen 2026-11-02 · Stufe B · DACH]
- **Hauptschlüsselanlage (HS):** ein Hauptschlüssel bedient jeden Zylinder, typisch für Industrie und Gewerbe. **Generalhauptschlüsselanlage (GHS):** Hauptschlüsselanlage mit Generalschlüssel. ASSA ABLOY nennt vier Ebenen: GHS, OGS, GS, ES. [Quelle: https://www.baunetzwissen.de/sicherheitstechnik/fachwissen/mechan-schliesstechnik/schliessanlagen---arten-und-funktionen-164832 · abgerufen 2026-11-02 · Stufe B · DE; https://dach.assaabloy.com/de/images/catalog/mediacockpit/IKON/orig/Schliessanlagenarten_DE.pdf · abgerufen 2026-11-02 · Stufe B · DACH]
- **Hauptschlüssel-Zentralschließanlage (KHZ):** im abgerufenen Baunetz-Artikel nicht enthalten. Suchauszüge von ASSA ABLOY und sanier.de beschreiben einen Hauptschlüssel über allen Zylindern, ein anderer Baunetz-Suchauszug eine Variante, in der Einzelschlüssel-Zylinder nicht unter dem Hauptschlüssel liegen. Originaltext fehlt (OFFENE FRAGE 2). [Quelle: https://www.sanier.de/einbruchschutz/schliessanlagen-und-schliesssysteme · abgerufen 2026-11-02 · Stufe B · DE]
- **Schließplan:** Register der Zylinder und Schlüssel (ABUS-Glossar), mit Raumbezeichnungen, Schlüsselnummern und Zylinderlängen (Baunetz, Suchauszug). [Quelle: https://www.abus.com/ch_de/Service/Glossar/Schliessanlagen · abgerufen 2026-11-02 · Stufe B · CH; https://www.baunetzwissen.de/beschlaege/fachwissen/zubehoer/schliessanlagen-150148 · abgerufen 2026-11-02 · Stufe B · DE]
- **Schließung:** nur im Zusammenhang belegt, nicht definiert. **Sicherungskarte:** bei ABUS-Systemen Voraussetzung für Nachschlüssel. Ohne Karte ist eine Nachbestellung nicht belegt. [Quelle: https://www.abus.com/de/abusproductsheet.pdf/212146/ger-DE · abgerufen 2026-11-02 · Stufe B · DE]
- **Planreserve:** in keiner Quelle definiert (OFFENE FRAGE 3). Die Projektbegriffe „Erweiterbare Anlage“ und „Erweiterbar reservieren“ sind dadurch nicht belegt. [Quelle: keine Trefferseite mit Definition, Suchen „Planreserve“ und „Reservezylinder“ · abgerufen 2026-11-02 · Stufe C]
- **Sperrschließung:** der Kern-Auszug setzt sie mit gleichschließenden Zylindern gleich. Keine Quelle definiert den Begriff. VdS 2156-1 nennt „Einzelsperrschließung“ im Titel (OFFENE FRAGE 4). [Quelle: https://www.dinmedia.de/de/technische-regel/vds-2156-1/374614093 · abgerufen 2026-11-02 · Stufe B · DE]

## 3 Normen und Richtlinien

- **DIN EN 1303:2026-08:** Titel gekürzt: „Schlösser und Baubeschläge: Schließzylinder und Hauptschlüsselanlagen (HS-Anlagen) für Schlösser: Anforderungen …“. Status „AKTUELL“. Laut Seite ersetzt sie „DIN EN 1303:2015-08“. Schließzylinder für Schließanlagen sind neu im Anwendungsbereich. [Quelle: https://www.dinmedia.de/de/norm/din-en-1303/401073981 · abgerufen 2026-11-02 · Stufe B · DE]
- **Zurückziehung 2015:** laut genorma (Suchauszug) zurückgezogen, laut DIN-Suchauszug zur Zurückziehung vorgesehen. Auf der DIN-Normseite nicht genannt (OFFENE FRAGE 5). [Quelle: https://genorma.com/en/standards/en-1303-2026 · abgerufen 2026-11-02 · Stufe C · international]
- **Klassen:** Herstellerangaben nennen Schließsicherheit 4 und 6 sowie Angriffswiderstand D, ohne Ausgabe. Laut Suchauszug gibt es seit 2015 fünf Angriffsklassen statt drei. Am Normtext nicht geprüft. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/detect3000 · abgerufen 2026-11-02 · Stufe B · DE; https://www.bks.de/de-de/loesungen-metallbau · abgerufen 2026-11-02 · Stufe B · DE]
- **DIN 18252:2018-05:** „Profilzylinder für Türschlösser: Begriffe, Maße, Anforderungen, Prüfverfahren und Kennzeichnung“, laut DIN Media aktuell. [Quelle: https://www.dinmedia.de/de/norm/din-18252/286575374 · abgerufen 2026-11-02 · Stufe B · DE, Suchauszug]
- **VdS 2156-1:** „Schließzylinder mit Einzelsperrschließung“, Ausgabe 2023-10 laut VdS-Datei. Gilt für Einzelschließungen, nicht für Schließanlagen. **VdS 2386:** „Schließanlagen: Anforderungen und Prüfmethoden“, Ausgabe 2012-07 laut Suchauszug, einschlägig für Schließanlagen. [Quelle: https://www.dinmedia.de/de/technische-regel/vds-2156-1/374614093 · abgerufen 2026-11-02 · Stufe B · DE, Suchauszug; https://www.dinmedia.de/de/technische-regel/vds-2386/168155183 · abgerufen 2026-11-02 · Stufe B · DE, Suchauszug]

## 4 ABUS (nur Suchauszüge)

- **Bravus 1000 bis 4000:** vier Stufen, alle mit dem Mechanismus Intellitec. [Quelle: https://www.abus.com/de/abusproductsheet.pdf/212146/ger-DE · abgerufen 2026-11-02 · Stufe B · DE]
- **Bravus 2000:** Wendeschlüssel, zwei Reihen, Schließanlage mit zwei Ebenen und bis zu zehn Schließelementen, erweiterbar. Bauform Doppelzylinder, Halb- und Knaufzylinder nur über MX-Teile. Grundlängen 30/30 und 28/32 mm, Schritt 5 mm, Höchstmaß 70/70 mm laut Broschüre (Text unleserlich, unsicher). [Quelle: https://c1.abus.com/akg-pim-assets-01/WEB%20PDF%20Dateien/APf%20Prospekte/Prospekt_Bravus_2000.pdf · abgerufen 2026-11-02 · Stufe B · DE]
- **Bravus 2000, Prüfung und Patent:** VdS-zertifizierbar, Schließsicherheit 6 nach EN 1303 (Ausgabe nicht genannt). Patent „angemeldet“, Laufzeit 2030 laut Fußnote, 2038 in MX-Magnet-Broschüre und Verbraucherbroschüre, 2037 laut Drittquelle (OFFENE FRAGE 6). [Quelle: https://www.abus.com/de/content/download/367251/file/Bravus%20MX%20Magnet.pdf?inLanguage=ger-DE · abgerufen 2026-11-02 · Stufe B · DE]
- **Bravus 1000, 3000, 4000:** Bauform- und Maßdaten nicht belegt (OFFENE FRAGE 7). [Quelle: keine Bauform- und Maßangaben in den Trefferseiten · abgerufen 2026-11-02 · Stufe C]
- **EC550 (Komfort):** Doppel-, Halb- und Knaufzylinder, acht Schließelemente, SKG-Bohrschutz, Notfunktion, ohne Sicherungskarte. ABUS-Wertung 7 von 10 ist keine EN-1303-Klasse. Schließanlagen nur über Gleichschließung mit ABUS-Schlössern belegt. [Quelle: https://www.abus.com/de/Privat/Tuersicherheit/Tuerzylinder/Komfort/EC550 · abgerufen 2026-11-02 · Stufe B · DE]
- **EC660 (Premium):** zehn Schließelemente, ABUS-Wertung 8 von 10, Sicherungskarte für Originalschlüssel. Eine Fußnote schließt Schließanlagen mit abgestuften Rechten aus. [Quelle: https://www.abus.com/de/Privat/Tuersicherheit/Tuerzylinder/Premium/EC660 · abgerufen 2026-11-02 · Stufe B · DE]
- **XP20S (Premium):** zwölf Schließelemente in drei Ebenen, gehärteter Stahl, drei codierte Wendeschlüssel mit wechselbaren Farbkappen, Kopien nur gegen Karte. Die Premium-Seite schließt Schließanlagen aus. [Quelle: https://www.abus.com/de/abusproductsheet.pdf/78352/ger-DE · abgerufen 2026-11-02 · Stufe B · DE]
- **XD250:** individuelle Schließberechtigungen laut ABUS, nicht geprüft (OFFENE FRAGE 8). [Quelle: https://www.abus.com/de/Privat/Tuersicherheit/Tuerzylinder/Premium/XD250 · abgerufen 2026-11-02 · Stufe B · DE]
- **ABUS Pfaffenhain GmbH (Jahnsdorf):** laut ABUS seit 2003 Schließsysteme, VdS- und ISO-9001-zertifiziert. Die Unternehmensseite nennt Y14, Integral, Wavy Line und Bravus. Die Bravus-Zuordnung ist offen (OFFENE FRAGE 14). [Quelle: https://www.abus.com/Ueber-ABUS/Unternehmensgruppe/ABUS-Pfaffenhain-GmbH · abgerufen 2026-11-02 · Stufe B · DE]

## 5 BKS (nur Suchauszüge)

- **Gruppe:** G-U-Seitentitel „Wendeschlüsselsysteme von BKS“ (Suchtreffer, Abruf 404). BKS ist danach Marke der GU-Gruppe (Stufe C, abgeleitet). [Quelle: https://www.g-u.com/de/AT/produkte/tuertechnik/schliessanlagen/mechanische-schliesssysteme/wendeschluesselsysteme.html · abgerufen 2026-11-02 · Stufe B · AT]
- **janus8000:** Wendeschlüssel, modular, Serie 45/46 laut BKS-Unterlagen (OFFENE FRAGE 13). Längen 27, 31 und 35 mm, dann 5-mm-Schritte bis 100 mm, Sonderlängen bis 250 mm. EN 1303 und DIN 18252 Klasse 6. Anti-Bump serienmäßig. Schlüsselbestellung nur für Kartenberechtigte. Schlüsselkugel rot. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/janus8000 · abgerufen 2026-11-02 · Stufe B · DE; https://www.g-u.com/ch-de/produkte/tuertechnik/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/janus8000 · abgerufen 2026-11-02 · Stufe B · CH]
- **helius4000:** Wendeschlüssel, Anti-Bump, Bohrwiderstand. EN 1303 und DIN 18252 nur als Konformität, ohne Klasse. Zielgruppe widersprüchlich. Schlüsselkugel gelb, Serie offen. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/helius4000 · abgerufen 2026-11-02 · Stufe B · DE]
- **livius6000:** Wendeschlüssel, Serie 50, EN 1303 Klasse 6, SKG Klasse 2, Schlüsselkugel blau, Patentpiktogramm bis 2038. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/livius6000 · abgerufen 2026-11-02 · Stufe B · DE]
- **belvius:** Wendeschlüssel, modular, Serie 57, ab 27 mm, EN 1303 und DIN 18252 Klasse 6. VdS-Klassen B und BZ laut Downloads, Nummern nicht geprüft. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/belvius/downloads · abgerufen 2026-11-02 · Stufe B · DE]
- **PZ 88 (Serie 88):** konventionell laut Seitentitel, fünf Stifte, Bump- und Bohrschutz, bis 80 mm, Klasse 4. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/pz-88 · abgerufen 2026-11-02 · Stufe B · DE]
- **nuvius (Serie 36):** konventionell, Varianten SL und SLX, bis 120 mm, Klasse 6. Patent „bis 2038“ laut BKS-Broschüre, Geltungsbereich offen (OFFENE FRAGE 15). [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/nuvius · abgerufen 2026-11-02 · Stufe B · DE]
- **detect3000:** konventionell laut Seitentitel, Schutz gegen Schlagen, Bohren und Ziehen, fünf Stifte ab 27 mm, sechs ab 31 mm, bis 95 mm, Klasse 4 bzw. 6, Serie offen. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/detect3000 · abgerufen 2026-11-02 · Stufe B · DE]
- **ixalo:** elektronisches RFID-System, nicht mechanisch. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/elektronische-schliesssysteme/ixalo-rfid/downloads · abgerufen 2026-11-02 · Stufe B · DE]

## 6 Schlüsselkennzeichnung

- **Pro Cap (ABUS):** farbige Schlüsselkappe für Bravus und Bravus Magnet, neun Farben, werkseitig oder nachrüstbar, beschriftbar. Der Begriff ist belegt. Die Farbempfehlung von ABUS ist Werbung. [Quelle: https://www.abus.com/de/Privat/Tuersicherheit/Tuerzylinder/Premium/Schluesselkappe-Pro-Cap · abgerufen 2026-11-02 · Stufe B · DE]
- **Skuni Cap (ABUS):** Schlüsselkappe mit Transponderfunktion, laut Verbraucherseite auch werkseitig. Nächstliegende Schreibweise zu „Scun Cap“, Zuordnung offen (OFFENE FRAGE 9). **Combi Cap (ABUS):** nachrüstbar, bis zu zwei Transponder. [Quelle: https://www.abus.com/de/Privat/Themenwelten-Highlights/Themenwelt-Tuerzylinder/Schluesselkappen-und-typen · abgerufen 2026-11-02 · Stufe B · DE; https://c1.abus.com/content/download/26019/557992/file/DE_WRBFL53_CombiCap_Flyer_WEB.pdf · abgerufen 2026-11-02 · Stufe B · DE]
- **„Scun Cap“:** kein Treffer bei ABUS, BKS oder allgemein. [Quelle: keine Trefferseite, Suchen „Scun Cap“ und „Scuncap“ · abgerufen 2026-11-02 · Stufe C]
- **BKS:** keine Schlüsselkappe gefunden. Farbige Schlüsselkugeln dienen als Systemmerkmal. [Quelle: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/livius6000 · abgerufen 2026-11-02 · Stufe B · DE]
- **Farbclip:** kein ABUS- oder BKS-Begriff laut Treffern. dormakaba führt Kaba star Farbclips in 14 Farben (Stand 2017-10). [Quelle: https://dormakaba.rokka.io/original/7be56f/1516096793_Factsheet_star-farbclips_EN-CH_201710.pdf · abgerufen 2026-11-02 · Stufe B · CH]

## 7 Privat oder Unternehmen

- Schließanlage bei unterschiedlichen Berechtigungen. Änderungen am Schließplan nur durch Fachhändler (ABUS Schweiz). [Quelle: https://www.abus.com/ch_de/Gewerbe/Tuersicherheit/Tuerzylinder-Schliessanlagen/Schliessanlagen-Arten · abgerufen 2026-11-02 · Stufe B · CH]
- Eine Türenzahl als Grenze nennt keine Quelle (OFFENE FRAGE 10). [Quelle: keine Trefferseite, Suche nach Entscheidungskriterien · abgerufen 2026-11-02 · Stufe C]
- Schlüsselverlust, Mietrecht: BGH März 2014 laut Fachberichten. Schadensersatz für die Anlage nur bei tatsächlichem Austausch. Nicht übertragbar auf Eigentümer oder Arbeitgeber, keine Rechtsberatung. [Quelle: https://www.iww.de/mk/wohnraummiete/schadenersatz-verlust-des-schluessels-zu-einer-schliessanlage-mieter-muss-nur-bei-tatsaechlichem-austausch-der-schliessanlage-n74132 · abgerufen 2026-11-02 · Stufe C · DE]
- Universität Bayreuth verlangt sofortige Meldung eines Schlüsselverlusts (Stand unbekannt). [Quelle: https://www.zt.uni-bayreuth.de/pool/dokumente/Schluessel/Schluesselrichtlinien1.pdf · abgerufen 2026-11-02 · Stufe B · DE]

## 8 Abgleich mit dem Bestand

1. „Fünf Systeme“ stehen vier Schließsystemen und einer Planungskarte gegenüber. Die KHZ fehlt. [Quelle: /home/user/schluesselmacher24/src/components/schliessanlagen/system-erklaerung.tsx · abgerufen 2026-11-02 · Stufe C]
2. „Zentralschlossanlage“ weicht von „Zentralschließanlage“ ab, der überwiegenden Schreibweise der Quellen. [Quelle: https://www.baunetzwissen.de/sicherheitstechnik/fachwissen/mechan-schliesstechnik/schliessanlagen---arten-und-funktionen-164832 · abgerufen 2026-11-02 · Stufe B · DE]
3. Die IKON-Ausschreibung (2017-05, Suchauszug) verbietet GHS, HS und GS aus Sicherheitsgründen. Die DIN-Seite 2026 nennt „HS-Anlagen“. Entscheidung nötig. [Quelle: https://dach.assaabloy.com/de/images/catalog/mediacockpit/IKON/orig/Mechanische_Schliessanlage_System_SK6_Vectorprofil_V02_2017_05.pdf · abgerufen 2026-11-02 · Stufe B · DACH]
4. „Sperrschließung“ und der Bravus-Bezug des Kerns sind nicht belegt (OFFENE FRAGE 1, 4). [Quelle: Abschnitte 1 und 2 · abgerufen 2026-11-02 · Stufe C]
5. VdS 2156-1 gilt nicht für Schließanlagen, einschlägig ist VdS 2386. EN 1303 in Seitentexten mit Ausgabe 2026 nennen. [Quelle: https://www.dinmedia.de/de/technische-regel/vds-2386/168155183 · abgerufen 2026-11-02 · Stufe B · DE]

## 9 Offene Fragen

1. Bravus-Bezug im Kern-Auszug: in content/ und src/payload nicht belegt.
2. KHZ: Suchauszüge widersprechen sich, Originaltext fehlt.
3. Planreserve und Reservezylinder: nicht definiert.
4. Sperrschließung: nicht definiert.
5. EN 1303:2015: Zurückziehung nicht auf der DIN-Seite. Klassensystem 2026 am Normtext prüfen.
6. Bravus-Patentlaufzeit widersprüchlich. DPMA und Espacenet nicht abgefragt.
7. Bravus 1000, 3000 und 4000: keine Bauform- und Maßdaten.
8. XD250 für Schließanlagen ungeprüft.
9. „Scun Cap“ ohne Treffer. Rückfrage, ob „Skuni Cap“ gemeint ist.
10. Keine Quelle nennt eine Türenzahl als Grenze.
11. Produktseiten bks.de und g-u.com nur als Suchauszug. Die Anmeldung wurde nicht verfolgt.
12. abus.com und dach.assaabloy.com nicht abgerufen (robots.txt).
13. Serie 45 nur laut BKS-Unterlagen. helius4000 und detect3000 ohne Serie. „janus“ ohne Zusatz ungeklärt.
14. Bravus-Zuordnung zu Pfaffenhain offen.
15. nuvius-Patent: Geltungsbereich offen.
16. BKS als GU-Marke nur Stufe C.
