# E1-gegenpruefung · Gegenprüfung der Erhebungen E1-FACHKUNDLER-01 bis 03

Kennung E1-FACHKUNDLER-04 · Prüfdatum 2026-11-03 · Stand: alle 30 Stichproben geprüft, Lücken L2 bis L7 bearbeitet.

## 0 Methode

- Je 10 Faktenzeilen aus Erhebung 01 (Systeme), 02 (Normen) und 03 (Transponder), bevorzugt mit Zahlen, Normen, Maßen und Klassen.
- Ergebnis: bestätigt · abweichend (richtiger Wortlaut und Quelle) · nicht prüfbar (Grund).
- Fremde Seiten selbst gelesen, auch bei Suchauszug. robots.txt vor dem ersten Abruf jeder Domain. Weiterleitungen auf Anmeldungen nicht verfolgt.
- Lokale Prüfungen an Projektdateien am 2026-11-03. Von den Werkzeugen gespeicherte PDF-Kopien unter /root/.claude/projects/ wurden nur gelesen, nicht ausgeführt.

## 1 Stichproben (30)

| Nr | Zeile | Aussage (gekürzt) | Ergebnis | Quelle · Stufe | Anmerkung |
|---|---|---|---|---|---|
| S01 | 01 Bestand | Katalog: Doppel- und Knaufzylinder 27 bis 80 mm, Halbzylinder bis 60 mm, Schritt 5 mm; Herstellerfeld leer | bestätigt | content/cylinder-catalog.json · lokal | Z. 19 (leere Liste), 42 bis 44, 71 bis 73, 99 bis 101 |
| S02 | 01 Bestand | Seite nennt „Die fünf Systeme“; vier Schließsysteme; fünfte Karte „Kein eigenes Schließsystem“ | abweichend (Wortlaut) | schliessanlagen/page.tsx Z. 355; system-erklaerung.tsx · lokal | Zahlen stimmen. Die Karte heißt „Erweiterbare Anlage“; „Kein eigenes Schließsystem“ beginnt nur ihre Beschreibung (Z. 190). |
| S03 | 01 Bestand | „Bravus“ kommt in content/ nicht vor | bestätigt | Textsuche content/ und src/payload/ · lokal | 0 Treffer |
| S04 | 01 ABUS | Bravus 2000: Grundlängen 30/30 und 28/32 mm, Schritt 5 mm, Höchstmaß 70/70 mm | nicht prüfbar | Prospekt auf c1.abus.com · Stufe B | robots.txt HTTP 403, keine Seite abgerufen (A1) |
| S05 | 01 ABUS | Bravus 2000: zwei Ebenen, bis zu zehn Schließelemente | nicht prüfbar | wie S04 | wie S04 |
| S06 | 01 BKS | janus8000: Längen 27, 31, 35 mm, 5-mm-Schritte bis 100 mm, Sonderlängen bis 250 mm | nicht prüfbar | bks.de-Produktseite · Stufe B | Weiterleitung auf Anmeldung identity.g-u.com (A3) |
| S07 | 01 BKS | janus8000: EN 1303 und DIN 18252 Klasse 6 | nicht prüfbar | wie S06 | wie S06 |
| S08 | 01 BKS | detect3000: bis 95 mm, fünf Stifte ab 27 mm, sechs ab 31 mm, Klasse 4 bzw. 6 | nicht prüfbar | wie S06 | Anmeldung (A4) |
| S09 | 01 BKS | nuvius (Serie 36): bis 120 mm, Klasse 6 | nicht prüfbar | wie S06 | Anmeldung (A5) |
| S10 | 01 Normen | VdS 2386 „Schließanlagen: Anforderungen und Prüfmethoden“, Ausgabe 2012-07 | bestätigt | dinmedia 168155183 · Stufe B | AKTUELL, 14 Seiten; elektronische Systeme nach Seite VdS 2215 |
| N01 | 02 Normen | DIN EN 1303:2026-08, AKTUELL, 52 Seiten, ersetzt 2015-08 | bestätigt | dinmedia 401073981 · Stufe B | Normtext nicht einsehbar; Änderungsvermerk nennt Schließanlagen und die dritte Klassenstelle |
| N02 | 02 Normen | DIN EN 1303:2015-08 ist zurückgezogen | bestätigt | dinmedia 225357321 · Stufe B | Seite: „ZURÜCKGEZOGEN“, ersetzt durch 2026-08. „Pre-order“ steht auf den gelesenen Seiten nicht. |
| N03 | 02 Normen | DIN 18252:2018-05 gültig, 32 Seiten, ersetzt 2006-12; Rund- und Ovalzylinder ausgenommen | bestätigt | dinmedia 286575374 · Stufe B | Umfang: mechanische und mechatronische Profilzylinder |
| N04 | 02 Normen | DIN EN 15684:2021-05 AKTUELL, 61 Seiten, ersetzt 2013-01; Angriffswiderstand verweist auf EN 1303 | bestätigt | dinmedia 325987131 · Stufe B | wie N03 |
| N05 | 02 Normen | VdS 2156-1:2023-10 „Schließzylinder mit Einzelsperrschließung“, AKTUELL, 27 Seiten; Verweise auf VdS 2386, 2156-2, 2215 | bestätigt | dinmedia 374614093 · Stufe B | Begriff „Einzelsperrschließung“ wird nicht erklärt (L4) |
| N06 | 02 Normen | KPK-Kennzeichnung „nach EN 1303 (Fassung 2015)“: achtstellig, letzte Stelle 0, A bis D | abweichend (Zusatz) | KPK-Herstellerverzeichnis, Stand Januar 2025, S. 2 · Stufe B | Inhalt stimmt; „Fassung 2015“ steht im Dokument nicht |
| N07 | 02 Normen | KPK, mechanisch: ABUS Pfaffenhain B; BKS B, D | bestätigt | KPK, S. 3 · Stufe B | Liste führt Firmen, keine Serien; Bravus 2000 offen |
| N08 | 02 Normen | KPK: Profilzylinder müssen mindestens Bohrschutz haben | bestätigt | KPK, S. 2 · Stufe B | zusätzlich: mindestens ES 1 mit Zylinderabdeckung |
| N09 | 02 Normen | KPK empfiehlt A besser B, mit Ziehschutz C besser D | bestätigt | KPK, S. 2 · Stufe B | mechatronisch: A und B |
| N10 | 02 Normen | DIN 18257:2022-02: vier Klassen ES0 bzw. 1 bis ES3 bzw. 4; Zylinder höchstens 3 mm vorstehend | bestätigt | baunetzwissen.de, Artikel · Stufe B | 3 mm als Empfehlung („sollte“); ES-1-Angabe steht im KPK-PDF, nicht im Artikel |
| T01 | 03 Typen | VW Golf 6, Passat B7, Audi A4 B8 · bis etwa 2015 · Megamos Crypto (ID48) | abweichend (Zusatz) | kfz-dietrich.com, „Transpondertypen“ · Stufe B | Seite: „ID48/Megamos Crypto oder Hitag2“; Hitag 2 fehlt in der Erhebung |
| T02 | 03 Typen | Peugeot, Citroën, Renault, Honda · ID46 (PCF7936) | bestätigt | wie T01 · Stufe B | Wortlaut: „Verbreitet bei …“ |
| T03 | 03 Typen | Golf 7, Skoda Octavia 3, Audi A3 8V · ab 2013 · MQB-Chips, AES-128 | bestätigt | wie T01 · Stufe B | Seite ergänzt „ausschließlich ODIS Online“ |
| T04 | 03 Generationen | Festcode etwa 1995 bis 2000; Crypto etwa 1998 bis 2012; AES ab etwa 2010 | bestätigt | kfz-dietrich.com, „Generationen“ · Stufe B | Überschriften „ca.“, FAQ „etwa“ |
| T05 | 03 Anlernen | Anlernen mit Originalschlüssel dauert 30 bis 60 Minuten | bestätigt | kfz-dietrich.com, „Anlernen“ · Stufe B | Seite: „meist in 30 bis 60 Minuten“ |
| T06 | 03 Anlernen | Ersatzschlüssel: Zulassungsbescheinigung Teil I, Personalausweis; bei Firmenfahrzeugen Vollmacht | bestätigt | wie T05 · Stufe B | Zitat der Erhebung nicht wortgleich (OFFENE FRAGE 7) |
| T07 | 03 Anlernen | AES: Freigabe nur über Herstellerbackend mit Werkstattzertifikat; Werkzeuge XENTRY, ODIS, ISTA | abweichend (zu allgemein) | wie T05 · Stufe B | Backend nur für Mercedes FBS4 und BMW FEM/BDC bei Verlust aller Schlüssel; Werkzeuge bestätigt; Zertifikat nicht genannt |
| T08 | 03 Chips | Hitag 3, Hitag Pro, Hitag AES nur lesen, programmieren, authentifizieren; AVDI mit Jahresabo | abweichend (Hitag AES) | abrites.com, PROTAG · Stufe B | AVDI bestätigt; Hitag AES steht in der Klon-Liste (H-Schlüssel) |
| T09 | 03 Chips | Temic 11 und 12 bei Mercedes Sprinter, Actros (Beispiele) | bestätigt | abrites.com, PROTAG · Stufe B | Wortlaut: „All types Temic 11/12 (example …)“ |
| T10 | 03 Chips | Toyota, Lexus, Scion (H Schlüssel): DST AES und Hitag AES | bestätigt | abrites.com, PROTAG · Stufe B | Liste „cloning support“; widerspricht Dietrich (OFFENE FRAGE 8) |

## 2 Abrufe (39 von höchstens 40)

| Domain | Abrufe | Ergebnis |
|---|---|---|
| abus.com, c1.abus.com | 1 | robots.txt HTTP 403, keine Seite abgerufen (A1) |
| bks.de | 4 | robots.txt ohne Sperre; drei Produktseiten auf Anmeldung umgeleitet (A2 bis A5) |
| dinmedia.de | 7 | robots.txt ohne Sperre; sechs Normseiten (A6 bis A12) |
| lka.polizei-nds.de | 2 | robots.txt HTTP 404; KPK-PDF als Bild, gelesen (A13, A14) |
| baunetzwissen.de | 2 | robots.txt ohne Sperre; ein Artikel (A15, A16) |
| kfz-dietrich.com | 4 | robots.txt ohne Sperre; drei Artikel (A17 bis A20) |
| abrites.com | 2 | robots.txt sperrt nur /admin/; eine Seite (A21, A22) |
| zeg-holz.de | 3 | robots.txt ohne Sperre; zwei PDF-Exporte ohne Text (A24 bis A26) |
| dormakaba.rokka.io | 2 | robots.txt ohne Sperre; PDF HTTP 404 (A29, A30) |
| assaabloy.com | 2 | robots.txt erlaubt alles; KESO-PDF ohne lesbaren Text (A32, A33) |
| stuv.de | 2 | robots.txt sperrt nur /account; Datenblatt als Bild, gelesen (A38, A39) |
| Websuche | 8 | Händler und Suchauszüge (A23, A27, A28, A31, A34 bis A37) |

## 3 Lücken (Schritte 2 bis 7)

**L2 Bravus 2000 (Maßbereiche je Bauform, Schrittweite, Höchstmaß, Ebenen): nicht belegt.** ABUS-Original und Prospekt nicht abrufbar (A1). Zwei zeg-holz-PDF-Exporte ohne Text. Händlerwerte, Stufe C, nur aus Suchauszügen: Doppelzylinder 30/30 und 35/50 (eBay), Modell 30x30 und MX 45x45 (weitere Händler), „Tiefe 30 bis 60“ ohne Einheit (eBay), MX-Verlängerung 5 bis 80 mm (zeg-holz). Schrittweite, Höchstmaß, Bauformmaße und Ebenen sind nicht belegt. Die Angaben aus Erhebung 01 bleiben ungeprüft.

**L3 Planreserve: nicht belegt.** Keine Trefferseite definiert „Planreserve“, „Reserve“ oder „Reservezylinder“ (A35). Die Sache ist in Suchauszügen beschrieben, Stufe C: Der Keyplanner von Heinze erfasst die erwartete Gesamtgröße einer Anlage, ein Firmenprofil auf sellwerk.de nennt Schließpläne mit Raum für Erweiterungen, eine ASSA-ABLOY-Ausschreibung verlangt Software für spätere Erweiterungen. Eine Einschätzung zum Begriff, die im Suchtext ohne Quelle stand, habe ich nicht übernommen.

**L4 Sperrschließung: Verwendung belegt, Gleichsetzung nicht belegt.** Norm, Stufe B: „Einzelsperrschließung“ steht im Titel von VdS 2156-1 und als Ausnahme im Geltungsbereich von VdS 2386. VdS 2156-1 erklärt den Begriff nicht (N05, S10). Die Normen ordnen diese Zylinder außerhalb von Schließanlagen ein. Ob der Begriff dasselbe meint wie Gleichschließung, sagen die Quellen nicht. Händler und Schlüsseldienste verwenden „Sperrschließung“ in der Suche nicht (A36). Der Kern-Auszug setzt beides gleich (OFFENE FRAGE 5).

**L5 Hauptschlüssel-Zentralschließanlage: nicht belegt.** Herstellerquellen mit Volltext nicht erreichbar: dormakaba-Broschüre HTTP 404 (A30), KESO-Übersicht ist eine einseitige Logodatei (A33), ASSA-ABLOY-Datei auf dach.assaabloy.com sperrt ClaudeBot laut Erhebung 01 und wurde nicht abgerufen. Suchauszüge, Stufe B und nicht gelesen, widersprechen sich: Nach einem ASSA-ABLOY-Auszug überragt der Hauptschlüssel beim Typ KHZ alle Zylinder, bei der Anlage ZUE endet er an den Zentralzylindern. Baunetz verweist für die Begriffe auf DIN 18252 (Ausgabe 1999); das ist keine Herstellerquelle.

**L6 Kleinste und größte Maße: nicht belegt.** 27/27 findet sich nur als Händlerangebot, Stufe C: ABUS E50 bei bauhaus.at, BKS 8802 27/35 mit Variante 27/27 bei eBay (A37). Händler nennen kleinere Längen: BKS 8802 Doppelzylinder 24/40 und ABUS E20 NP 10/30 (bauhaus.info). 27/27 ist daher keine belegte kleinste Stufe, 26/26 wurde nicht gefunden. Größte Stufe: Händlerangebot BKS 45/70 (eBay). 100/100 und 120/120 wurden nicht gefunden. Die ABUS- und BKS-Systemdaten sind nicht abrufbar (A1, S06 bis S09).

**L7 Knauf: teilweise belegt, Frage offen.** Herstellerangabe, Stufe B: Steinbach & Vollmann, Datenblatt PL61XX (elektronischer Knaufzylinder), Technische Daten: „Knaufseite (Innen): 30 bis 60 mm, Kontaktstellenseite (Außen): 30 bis 60 mm“ (A39, Seite 2). Derselbe Datenblatt-Text nennt auf Seite 1 einen „Außenknauf“ (OFFENE FRAGE 9). „Immer innen“ ist nicht belegt, ein Produktdatenblatt begründet keine allgemeine Regel. Doppelknauf: keine Quelle gefunden.

## 4 Offene Fragen

1. ABUS: abus.com und c1.abus.com antworten auf robots.txt mit HTTP 403. Alle ABUS-Herstellerangaben aus Suchauszügen bleiben ungeprüft (S04, S05, L2, L6). Den weiteren Weg entscheidet der Orchestrator, ohne die Sperre zu umgehen.
2. BKS: Produktseiten leiten auf eine Anmeldung um (identity.g-u.com). Nicht verfolgt. S06 bis S09 und der BKS-Teil von L6 sind nicht prüfbar.
3. Pre-order (Erhebung 02, OFFENE FRAGE 1): auf den gelesenen DIN-Seiten nicht belegt. Der Suchauszug auf din.de (Beuth) wurde nicht abgerufen.
4. Elektronische Systeme: VdS 2156-1 verweist auf VdS 2156-2 (elektronische Zylinder), VdS 2386 auf VdS 2215. Die Zuordnung in Erhebung 02 ist damit uneinheitlich.
5. Sperrschließung: Bedeutung und Verhältnis zur Gleichschließung entscheiden (L4).
6. KPK-Zusatz „Fassung 2015“ (N06): im Dokument nicht genannt.
7. Zitat in Erhebung 03 (T06): „Ohne Herstellerzugang und ohne Berechtigungsnachweis entsteht kein funktionierender Schlüssel“ steht auf der Anlernen-Seite nicht wortgleich, die zweite Quelle ist nicht geprüft. Der Berechtigungsnachweis (R13) darf dabei nicht geschwächt werden.
8. Hitag AES: Abrites führt Hitag AES (H-Schlüssel) als klonbar, Dietrich verneint klassisches Kopieren. Der Widerspruch bleibt (Erhebung 03, OFFENE FRAGE 3).
9. Steinbach PL61XX: „Außenknauf“ (Seite 1) und „Knaufseite (Innen)“ (Seite 2) widersprechen sich.
10. Quellenqualität: Die drei kfz-dietrich-Artikel tragen den Hinweis „Mit KI-Unterstützung erstellt, redaktionell geprüft“. zeg-holz weist ebenfalls auf KI-gestützte Daten hin. Stufe B dieser Quellen ist mit Vorbehalt zu lesen.
11. Eingebettete Anweisungen: Auf allen sechs gelesenen dinmedia-Seiten (168155183, 401073981, 225357321, 286575374, 325987131, 374614093) steht ein Block „Hilfe & Kontakt“ mit Formatvorgaben. Er wurde nicht befolgt. Die Websuche hängt außerdem einen Hinweis zur Quellenformatierung an, er ist kein Auftrag an diese Prüfung.

## 5 Ergebnis in Zahlen

- 30 Stichproben: 19 bestätigt, 5 abweichend (S02, N06, T01, T07, T08), 6 nicht prüfbar (S04 bis S09).
- Lücken: keine vollständig belegt. L4 und L7 teilweise, L2, L3, L5 und L6 nicht belegt.
- Abrufe: 39 von höchstens 40.
