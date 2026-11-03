# FACHWISSEN · Schließtechnik und Fahrzeugschlüssel (Stand 2026-11-03)

Verdichtet aus erhebung/E1-schliesstechnik-systeme.md (FK-01), E1-schliesstechnik-normen.md (FK-02) und E1-transponder.md (FK-03); Gegenprüfung in E1-gegenpruefung.md (FK-04). Jede Aussage nennt ihre Quelle in Kurzform; die vollständige Adresse mit Abrufdatum steht in der jeweiligen Erhebung. Ampel nach Auftrag 14: **grün** Bestand oder Antwort des Inhabers · **gelb** externe Quelle mit Link und Datum · **rot** unbelegt, nie sichtbar. Alles hier ist gelb, solange nichts anderes steht. Gegenprüfung FK-04 (30 Stichproben): 19 bestätigt, 5 abweichend und hier eingearbeitet, 6 nicht prüfbar; die nicht prüfbaren Herstellerdaten von ABUS und BKS sind unten als **ungeprüft** markiert.

Grundregel für Konfigurator und Fachseiten: Nur gelbe und grüne Aussagen dürfen erscheinen; was rot ist, wird zur Frage an den Inhaber (MENSCHEN.md) und bleibt unsichtbar.

## 1. Anlagenarten (für Konfigurator, Sperrschließung und Schließanlage, G-09, G-27, G-28, G-30)

| Begriff | Bedeutung | Quelle |
|---|---|---|
| Gleichschließung (im Gespräch und auf der Seite „Sperrschließung“) | Ein Schlüssel schließt mehrere Zylinder mit gleicher Codierung; die Bauformen dürfen verschieden sein. Typisch: Haustür, Kellertür und Garage eines Hauses. Begriff: „Sperrschließung“ ist das Wort des Inhabers (G-09, G-28: Sets gleichschließender Zylinder) und steht mit Laienerklärung in der Navigation; Händler schreiben „gleichschließend“, die Norm kennt „Einzelsperrschließung“ (VdS 2156-1) ohne Erklärung. Die Seite stellt beide Wörter nebeneinander („Sperrschließung, also gleichschließende Zylinder“) und behauptet keine Normgleichheit. | ABUS „Schließungsarten“ (B), VdS 2156-1 (B), FK-04 L4 |
| Einzelschließung | Jeder Zylinder nur mit seinem eigenen Schlüssel. | ABUS (B) |
| Schließanlage | Zylinder und Schlüssel mit verschiedenen Schließungen, untereinander verknüpft (Definition DIN 18252, Ausgabe 1999, zitiert). | Baunetz Wissen (B) |
| Zentralschließanlage (Z) | Mehrere Einzelschlüssel schließen je ihre Tür und gemeinsam mindestens einen Zentralzylinder (Haustür, Keller), ohne Hauptschlüssel. Die Quellen schreiben „Zentralschließanlage“; der Bestand schreibt „Zentralschlossanlage“. | Baunetz (B), ASSA ABLOY „Schließanlagenarten“ (B, Suchauszug) |
| Hauptschlüsselanlage (HS) | Ein Hauptschlüssel schließt alle Zylinder; Einzelschlüssel nur ihren Zylinder. Typisch Gewerbe. | Baunetz (B) |
| Generalhauptschlüsselanlage (GHS) | Hauptschlüsselanlage mit Gruppen; Ebenen GHS, Obergruppe (OGS), Gruppe (GS), Einzel (ES). | Baunetz (B), ASSA ABLOY (B) |
| Hauptschlüssel-Zentralschließanlage (HZ, KHZ) | Kombination aus Hauptschlüssel und Zentralzylindern; Wortlaut der Quellen widersprüchlich, Volltext fehlt. **Rot**: Auch die Gegenprüfung fand keinen Volltext; Suchauszüge widersprechen sich (beim Typ KHZ überragt der Hauptschlüssel alle Zylinder, bei ZUE endet er an den Zentralzylindern). Im Konfigurator nur als Beratungswunsch, ohne eigene Erklärung. | FK-01 offene Frage 2, FK-04 L5 |
| Schließplan | Verzeichnis aller Zylinder und Schlüssel mit Türbezeichnung, Schlüsselnummer und Zylinderlänge; die Matrix zeigt, welcher Schlüssel welche Tür schließt. | ABUS-Glossar (B), Baunetz (B) |
| Sicherungskarte | Bei geschützten Systemen Voraussetzung für Nachschlüssel und Nachbestellung (Berechtigungsnachweis, R13). | ABUS Produktblatt (B), BKS janus8000 (B) |
| Planreserve | Im Gespräch: Schlüssel oder Zylinder für später im Plan vorsehen. In keiner Quelle definiert. Auf der Seite als Laienbeschreibung „für später vormerken“, ohne Fachbegriff. | FK-01 offene Frage 3, FK-04 L3 (auch dort nicht definiert) |

Laienbeispiel (G-09), aus den Definitionen abgeleitet (C): In der Sperrschließung öffnet ein Schlüssel alle Türen gleich. In der Schließanlage öffnet der Schlüssel des Kindes nur sein Zimmer und die Haustür, der Schlüssel der Eltern alle Türen.

Privat oder Unternehmen (G-30): Eine Schließanlage ist angezeigt, sobald Personen unterschiedliche Berechtigungen brauchen; Änderungen am Schließplan nur über den Fachhandel (ABUS Schweiz, B). Eine Türenzahl als Grenze nennt keine Quelle; die Seite empfiehlt nach Berechtigungen, nicht nach Türenzahl, und bietet Beratung als Ausweg.

## 2. Systeme ABUS und BKS (Systemdaten für den Konfigurator)

ABUS (Angaben aus Herstellerunterlagen, teils nur Suchauszug; abus.com und c1.abus.com sperren Abrufe über robots.txt). **Ungeprüft**: Die Gegenprüfung konnte keine ABUS-Angabe nachlesen (FK-04 S04, S05, L2). Maße und Funktionen erscheinen nur, wenn der Inhaber sie im Zylinderkatalog bestätigt:
- **Bravus 1000 bis 4000**: vier Stufen mit dem Mechanismus Intellitec (Produktblatt, B).
- **Bravus 2000**: Wendeschlüssel; Schließanlagen mit zwei Ebenen, erweiterbar; Doppelzylinder, Halb- und Knaufzylinder als MX-Teile; Grundlängen 30/30 und 28/32 mm, Schritt 5 mm; Höchstmaß laut Prospekt 70/70 mm (Lesung unsicher; Händler nennen 30/30, 35/50 und 45/45, Stufe C); Schließsicherheit 6 nach EN 1303; VdS-zertifizierbar; Schutzrecht mit widersprüchlicher Laufzeit (2030, 2037, 2038). (Prospekt Bravus 2000, Bravus MX Magnet, B)
- **EC550**: Doppel-, Halb-, Knaufzylinder, Notfunktion, ohne Sicherungskarte; **EC660**: mit Sicherungskarte; **XP20S**: Wendeschlüssel mit wechselbaren Farbkappen, Kopien nur gegen Karte. EC660 und XP20S schließen Schließanlagen mit abgestuften Rechten aus (ABUS, B).
- Schlüsselkappen: **Pro Cap** (farbig, neun Farben, beschriftbar, für Bravus) belegt; **Skuni Cap** (Kappe mit Transponder) und **Combi Cap** (bis zwei Transponder) belegt; „Scun Cap“ aus dem Gespräch nicht gefunden, vermutlich Skuni Cap (Frage an den Inhaber, MA-14). „Farbclip“ ist kein ABUS- oder BKS-Begriff (dormakaba nutzt ihn).

BKS (Marke der GU-Gruppe; Produktseiten nur als Suchauszug). **Ungeprüft** wie ABUS: Die Produktseiten leiten auf eine Anmeldung um (FK-04 S06 bis S09):
- **janus8000**: Wendeschlüssel, modular, Längen 27, 31, 35 mm, dann 5-mm-Schritte bis 100 mm, Sonderlängen bis 250 mm; EN 1303 und DIN 18252 Klasse 6; Schlüssel nur für Kartenberechtigte (B).
- **livius6000** (Serie 50, EN 1303 Klasse 6, Patentpiktogramm bis 2038), **belvius** (Serie 57, ab 27 mm), **helius4000**, **nuvius** (Serie 36, bis 120 mm, Klasse 6), **detect3000** (bis 95 mm, Klasse 4 bzw. 6), **PZ 88** (Serie 88, bis 80 mm, Klasse 4) (B).
- **ixalo** ist ein elektronisches RFID-System (G-33), nicht mechanisch (B).

Folgerung für den Bestand: Der Zylinderkatalog führt Doppel- und Knaufzylinder 27 bis 80 mm, Halbzylinder bis 60 mm, Schritt 5 mm; „Bravus“ steht nicht in content/ (FK-01, FK-04 S01 und S03 bestätigt). 27/27 ist keine belegte kleinste Stufe: Händler nennen auch 24/40 und 10/30, die größte gefundene Händlerlänge ist 45/70 (FK-04 L6, Stufe C). Maße bleiben Systemdaten des Inhabers (Zylinderkatalog im Admin); der Konfigurator bietet nur an, was der Katalog führt, und alles darüber als Anfrage.

## 3. Normen und Klassen (für Fachseiten und Produktangaben)
- **DIN 18252:2018-05** „Profilzylinder für Türschlösser“, gültig, ersetzt 2006-12; Klassenschlüssel neu (DIN Media, B).
- **DIN EN 1303:2026-08** „Schließzylinder und Hauptschlüsselanlagen (HS-Anlagen)“ Status AKTUELL, 52 Seiten, ersetzt die zurückgezogene Ausgabe 2015-08; eine Vorbestellung steht auf den gelesenen Seiten nicht (FK-04 N01, N02). Der Änderungsvermerk nennt Schließanlagen und die dritte Klassenstelle; der Normtext ist nicht einsehbar. Seiten nennen „DIN EN 1303:2026-08“, Klassen aber nur so, wie der Hersteller sie für sein Produkt angibt (DIN Media, B).
- Kennzeichnung nach EN 1303 laut KPK-Verzeichnis (achtstellig; „Fassung 2015“ steht dort nicht, FK-04 N06): letzte Stelle Angriffswiderstand: A und B ohne, C und D mit Ziehschutz; KPK empfiehlt mindestens A, besser B, mit Ziehschutz C, besser D; für mechatronische Zylinder A und B (KPK-Verzeichnis, Stand 2025-01, B, FK-04 N09).
- **DIN EN 15684:2021-05** mechatronische Zylinder; **VdS 2156-1:2023-10** Einzelsperrschließung; **VdS 2386:2012-07** Schließanlagen (elektronische Systeme nach VdS 2215, elektronische Zylinder nach VdS 2156-2; die Verweise sind uneinheitlich, FK-04 S10 und Frage 4); **DIN 18257:2022-02** Schutzbeschläge, Klassen ES0 bis ES3, Zylinderabdeckung empfohlen (B).
- Zertifizierung: PIV CERT (Velbert), SKG-IKOB (NL), VdS-Zertifizierungsstelle (Köln) (KPK, B).

## 4. Schutzfunktionen (Konfigurator: Auswahl mit Laienerklärung)
- **Bohrschutz**: gehärtete Stifte oder Platten erschweren Aufbohren; laut KPK Mindestanforderung für Profilzylinder, dazu mindestens ein Schutzbeschlag ES 1 mit Zylinderabdeckung (KPK, B, FK-04 N08).
- **Ziehschutz**: verhindert das Herausziehen des Kerns, über Profilzylinder mit Ziehschutz oder Schutzbeschlag mit Zylinderabdeckung (B).
- **Kopierschutz**: rechtlich (Patent, Marke des Profils) und technisch (Berechtigungsprüfung); Sicherungskarte ist der Nachweis (ABUS, B).
- **Aufsperrschutz, Schlagschutz**: keine belegte Definition; nur mit Herstellerangabe je Produkt nennen, sonst nicht (rot).

## 5. Not- und Gefahrenfunktion, Freilauf (zwei getrennte Fragen im Konfigurator)
- **Not- und Gefahrenfunktion (N+G)**: Die Tür lässt sich von außen öffnen, auch wenn innen ein Schlüssel steckt (ABUS, Baunetz, B). Varianten einseitig und beidseitig im Handel (C); bei BKS belvius optional ab 31/31 beidseitig, 27/31 einseitig (B).
- **Freilauf (FZG)**: Der Schließbart dreht bei abgezogenem Schlüssel frei; Einsatz bei Getriebeschlössern in Fluchttüren (Prüfrichtlinie Gütegemeinschaft, über Baunetz, B). Nicht mit N+G gleichsetzen.

## 6. Bauformen
- Doppelzylinder (Maß A und B), Halbzylinder (eine Länge), Knaufzylinder (Knauf meist innen; ein Herstellerdatenblatt nennt auch einen Außenknauf, eine allgemeine Regel ist nicht belegt; Doppelknauf ohne Quelle, FK-04 L7; eigener Maßbereich), Hebelzylinder (Briefkasten, eigene Maße), Vorhangschloss, Möbel- und Außenzylinder, Schließeinsatz: nur nennen, was der Zylinderkatalog führt (B für Doppel, Halb, Hebel; übrige ohne Definition).

## 7. Messen (Messhilfe G-29, Plausibilität)
- Bezugspunkt ist die Mitte der Stulpschraube (Befestigungsschraube). Maß A reicht nach außen bis zur Außenkante des Beschlags, Maß B nach innen; Schreibweise A/B, etwa 35/40 (ASSA-Messkarte, B).
- Jedes Teilmaß ist halbe Türstärke plus Beschlagdicke derselben Seite; A plus B ergibt Türstärke plus beide Beschläge (abgeleitet aus der Messkarte, C).
- Längen in 5-mm-Stufen; Zwischenwerte zur nächsthöheren Stufe, wenn der Beschlag es erlaubt (C, Herstellerdatenblatt B).
- Überstand: Der Zylinder soll höchstens 3 mm über den Außenbeschlag vorstehen; das ist eine Empfehlung („sollte“, DIN 18257 laut Baunetz, SimonsVoss, B, FK-04 N10). Ein Baumarkt nennt 1 bis 2 mm (toom, B). Die Messhilfe nennt „höchstens 3 mm“ und keine engere Zahl.
- Plausibilitätsregeln für den Konfigurator (abgeleitet, C, jeweils als Rückfrage, nie als Sperre): Maß außerhalb des Katalogs → Anfrage; A und B sehr ungleich ohne Knauf oder Schutzbeschlag → Hinweis prüfen; Summe A+B unter 54 mm oder über dem Katalog → Rückfrage; immer Pflichtbestätigung „Maße geprüft“ und Prüfung durch die Werkstatt vor der Fertigung.

## 8. Transponder und Klonbarkeit (G-17, G-18; alles Kandidaten, nichts bestätigt)
- Generationen: Festcode (etwa 1995 bis 2000), Crypto mit Abfrage (etwa 1998 bis 2012), AES mit Herstellerfreigabe (ab etwa 2010) (Fachbetrieb, B).
- **Klonen** kopiert die Chipdaten auf einen Rohling in der Werkstatt; **Anlernen** trägt einen Schlüssel im Fahrzeug ein und braucht das Fahrzeug vor Ort (ADAC, B). Das Herstellerbackend ist nach dem Fachbetrieb in bestimmten Fällen nötig, etwa bei Mercedes FBS4 und BMW FEM/BDC, wenn alle Schlüssel verloren sind; Werkstattgeräte sind etwa XENTRY, ODIS und ISTA. Ein Werkstattzertifikat nennt die Quelle nicht (Fachbetrieb, B, FK-04 T07).
- Kandidaten klonbar laut Geräteherstellern (B): ID4C, ID4D, ID11, ID12, ID13, ID33, ID46, ID48 (Megamos Crypto), DST AES; widersprüchlich: ID49, ID4A (Hitag AES), DST80; nicht belegt: ID88 (Megamos AES), Hitag Pro. Belegte Fahrzeugbeispiele: VW Golf 6, Passat B7, Audi A4 B8 (ID48 Megamos Crypto oder Hitag 2, FK-04 T01); Golf 7, Octavia 3, Audi A3 8V ab 2013 (MQB, AES-128, nicht klassisch klonbar; Anlernen laut Quelle nur über ODIS Online, FK-04 T03) (Fachbetrieb, B). Hitag AES und DST AES führt ein Gerätehersteller als klonbar, der Fachbetrieb verneint klassisches Kopieren (FK-04 T08, T10): bleibt widersprüchlich.
- Quellenvorbehalt: Die Artikel des Fachbetriebs tragen den Hinweis „Mit KI-Unterstützung erstellt, redaktionell geprüft“ (FK-04 Frage 10). Ihre Aussagen erscheinen auf der Seite nur mit einer zweiten Quelle oder nach Bestätigung des Inhabers.
- Nachweise seriöser Anbieter: Zulassungsbescheinigung Teil I, Personalausweis, bei Firmenfahrzeugen Vollmacht des Halters (ADAC, Fachbetrieb, B). Das deckt R13.
- Konsequenz: Die Transponder-Kopie (G-18) ist online nur für Fahrzeuge buchbar, die der Inhaber im Bogen KLONBAR mit Datum bestätigt; alle anderen landen in der Anfrage.

## 9. Fahrzeugkatalog (G-14, Z-07)
- Quelle für Abdeckung und Modellreihen: **KBA FZ 12**, Bestand an Pkw nach Modellreihen, Stichtag 1.1.2026, 49.486.487 Pkw; 649 benannte Reihen decken 97,33 % ab; die 348 größten Reihen ergeben 95,004 %, 535 Reihen 97 %; 63 Marken, davon 26 für 95 % (KBA, A). Nutzung mit Quellenangabe nach KBA-AGB § 1 Abs. 3 (Datenlizenz Deutschland Namensnennung 2.0) (B). Quellenvermerk auf der Seite: „Quelle: Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0“ (QUELLEN.md).
- Bauzeiträume: Wikidata (CC0) liefert Beginn und Ende je Generation, ist aber uneinheitlich; die SPARQL-Schnittstelle ist für automatisierte Abrufe per robots.txt gesperrt. Baujahr ist daher eine Angabe des Kunden (1998 bis 2026); Bauzeiträume je Reihe nur, wo eine Quelle sie nennt.

## 10. Offene Fachfragen (nach der Gegenprüfung FK-04)
1. Systemdaten von ABUS und BKS (Bravus 2000, janus8000 und weitere): nicht prüfbar (robots.txt, Anmeldung; FK-04 Frage 1 und 2, die Sperren werden nicht umgangen). Weg: Der Inhaber bestätigt Maße und Funktionen je System im Zylinderkatalog oder legt Händlerunterlagen in `eingang` (Bogen PREISE); bis dahin bietet die Seite nur an, was der Katalog führt.
2. Hauptschlüssel-Zentralschließanlage: rot (FK-04 L5); nur als Beratungswunsch.
3. Sperrschließung: entschieden (Abschnitt 1, FK-04 L4).
4. „Scun Cap“ (Inhaber, MA-14).
5. DIN EN 1303:2026-08: geklärt, AKTUELL (FK-04 N01, N02).
6. Welche Systeme der Betrieb tatsächlich führt (Inhaber, Bogen PREISE und Zylinderkatalog).
7. Knauf außen oder innen, Doppelknauf (Inhaber, FK-04 L7).
8. Hitag AES und DST AES: Widerspruch bleibt; online entscheidet nur der Bogen KLONBAR (G-18).
