# E1-gegenpruefung · Gegenprüfung der Erhebungen E1-FACHKUNDLER-01 bis 03

Kennung E1-FACHKUNDLER-04 · Abrufdatum 2026-11-03 · Schreibstand: alle 30 Stichproben (S01 bis S10, N01 bis N10, T01 bis T10) geprüft. Die Lücken L2 bis L7 sind offen.

## 0 Methode

- Stichproben: je 10 Faktenzeilen aus E1-schliesstechnik-systeme.md (Erhebung 01), E1-schliesstechnik-normen.md (Erhebung 02) und E1-transponder.md (Erhebung 03). Bevorzugt Zahlen, Normen, Maße und Klassen.
- Ergebnis je Zeile: bestätigt · abweichend (richtiger Wortlaut und Quelle) · nicht prüfbar (Grund).
- Jede fremde Quelle wird selbst gelesen, auch bei Suchauszug. Vor dem ersten Abruf einer Domain wird ihre robots.txt abgerufen. Weiterleitungen auf eine Anmeldung werden nicht verfolgt.
- Lokale Prüfungen beziehen sich auf Projektdateien, Stand 2026-11-03.
- Zu den Abrufen zählen Websuchen, Seitenabrufe und robots.txt-Abrufe.

## 1 Stichproben aus Erhebung 01 (Systeme und Bestand)

| Nr | Zeile | Aussage (gekürzt) | Ergebnis | Prüfquelle · Abruf · Stufe | Anmerkung |
|---|---|---|---|---|---|
| S01 | 01, Bestand | Katalog: Doppel- und Knaufzylinder 27 bis 80 mm, Halbzylinder bis 60 mm, Schritt 5 mm; Herstellerfeld leer | bestätigt | content/cylinder-catalog.json, Z. 19 (`"manufacturers": []`), Z. 42 bis 44, 71 bis 73, 99 bis 101 · lokal 2026-11-03 · Projektdaten | keine |
| S02 | 01, Bestand | Seite nennt „Die fünf Systeme“; Komponente beschreibt vier Schließsysteme; fünfte Karte „Erweiterbare Anlage“ heißt dort „Kein eigenes Schließsystem“ | abweichend (Wortlaut) | src/app/(site)/schliessanlagen/page.tsx Z. 355; src/components/schliessanlagen/system-erklaerung.tsx, fünf Einträge in Z. 35, 72, 110, 148, 187 · lokal 2026-11-03 · Projektdaten | Zahlen stimmen. Die Karte heißt „Erweiterbare Anlage“ (Z. 187 und 200). „Kein eigenes Schließsystem“ beginnt nur ihre Beschreibung (Z. 190). |
| S03 | 01, Bestand | „Bravus“ kommt in content/ nicht vor | bestätigt | Textsuche in content/ und src/payload/ · lokal 2026-11-03 · 0 Treffer | Die Aussage zu Zylinderkatalog.ts (ABUS und BKS als Beispiele) ist nicht geprüft. |
| S04 | 01, ABUS | Bravus 2000: Grundlängen 30/30 und 28/32 mm, Schritt 5 mm, Höchstmaß 70/70 mm laut Broschüre | nicht prüfbar | Prospekt auf c1.abus.com (Suchauszug) · robots.txt HTTP 403 am 2026-11-03 · Stufe B | Keine Seite abgerufen. Dasselbe gilt für abus.com laut Erhebung 01. |
| S05 | 01, ABUS | Bravus 2000: zwei Ebenen, bis zu zehn Schließelemente, Doppel-, Halb- und Knaufzylinder nur über MX-Teile | nicht prüfbar | wie S04 | wie S04 |
| S06 | 01, BKS | janus8000: Längen 27, 31 und 35 mm, danach 5-mm-Schritte bis 100 mm, Sonderlängen bis 250 mm | nicht prüfbar | bks.de-Produktseite (Suchauszug) · Abruf 2026-11-03 · Stufe B | Weiterleitung auf eine Anmeldung (identity.g-u.com), nicht verfolgt. |
| S07 | 01, BKS | janus8000: EN 1303 und DIN 18252 Klasse 6 | nicht prüfbar | wie S06 | wie S06 |
| S08 | 01, BKS | detect3000: bis 95 mm, fünf Stifte ab 27 mm, sechs ab 31 mm, Klasse 4 bzw. 6 | nicht prüfbar | bks.de-Produktseite (Suchauszug) · Abruf 2026-11-03 · Stufe B | Weiterleitung auf eine Anmeldung. |
| S09 | 01, BKS | nuvius (Serie 36): bis 120 mm, Klasse 6 | nicht prüfbar | bks.de-Produktseite (Suchauszug) · Abruf 2026-11-03 · Stufe B | Weiterleitung auf eine Anmeldung. |
| S10 | 01, Normen | VdS 2386 „Schließanlagen: Anforderungen und Prüfmethoden“, Ausgabe 2012-07 laut Suchauszug | bestätigt | dinmedia.de, Technische Regel 168155183 · 2026-11-03 · Stufe B | Ausgabe 2012-07, Status AKTUELL, 14 Seiten. Die Seite nennt Schließanlagen als Gegenstand. Einzelsperrschließungen und elektronische Systeme sind ausgenommen; für elektronische Systeme nennt sie VdS 2215 (Erhebung 02 nennt VdS 2156-2). |

## 2 Stichproben aus Erhebung 02 (Normen)

| Nr | Zeile | Aussage (gekürzt) | Ergebnis | Prüfquelle · Abruf · Stufe | Anmerkung |
|---|---|---|---|---|---|
| N01 | 02, Normen | DIN EN 1303:2026-08, AKTUELL, 52 Seiten, ersetzt 2015-08 | bestätigt | dinmedia.de, Norm 401073981 · 2026-11-03 · Stufe B | Der Normtext war auf der Seite nicht einsehbar. Der Änderungsvermerk nennt die erweiterte Anwendung auf Schließanlagen und die dritte Klassenstelle „mechanische Codierung“. |
| N02 | 02, Normen | DIN EN 1303:2015-08 ist zurückgezogen, Nachfolger 2026-08 | bestätigt | dinmedia.de, Norm 225357321 · 2026-11-03 · Stufe B | Die Seite zeigt „ZURÜCKGEZOGEN“ und „ersetzt durch DIN EN 1303:2026-08“. Die Angabe „Pre-order“ aus Erhebung 02 steht auf dieser und auf 401073981 nicht. |
| N03 | 02, Normen | DIN 18252:2018-05 gültig, 32 Seiten, ersetzt 2006-12; Rund- und Ovalzylinder ausgenommen | bestätigt | dinmedia.de, Norm 286575374 · 2026-11-03 · Stufe B | Alle Angaben bestätigt. Umfang: mechanische und mechatronische Profilzylinder. |
| N04 | 02, Normen | DIN EN 15684:2021-05 AKTUELL, 61 Seiten, ersetzt 2013-01; Angriffswiderstand verweist auf EN 1303 | bestätigt | dinmedia.de, Norm 325987131 · 2026-11-03 · Stufe B | Die Seite nennt den Verweis auf EN 1303 beim Angriffswiderstand. |
| N05 | 02, Normen | VdS 2156-1:2023-10 „Schließzylinder mit Einzelsperrschließung“, AKTUELL, 27 Seiten; Schließanlagen zu VdS 2386, elektronische Zylinder zu VdS 2156-2, Systeme allgemein zu VdS 2215; keine Klassen | bestätigt | dinmedia.de, Technische Regel 374614093 · 2026-11-03 · Stufe B | Alle Angaben stehen so auf der Seite. „Einzelsperrschließung“ wird verwendet, aber nicht erklärt (siehe L4). Klassen werden nicht genannt. |
| N06 | 02, Normen | Kennzeichnung nach EN 1303 „(Fassung 2015, laut KPK)“: achtstelliger Schlüssel, letzte Stelle 0, A, B, C, D | abweichend (Zusatz) | KPK-Herstellerverzeichnis „Geprüfte und zertifizierte Profilzylinder“, Stand Januar 2025, S. 2 · Abruf 2026-11-03 · Stufe B | Inhalt bestätigt, auch die Zuordnung alt 1 gleich A/C und alt 2 gleich B/D. Die Angabe „Fassung 2015“ steht im Dokument nicht; dort heißt es nur „DIN EN 1303“. |
| N07 | 02, Normen | KPK-Liste, mechanisch: ABUS Pfaffenhain B; BKS B, D | bestätigt | KPK-Herstellerverzeichnis, S. 3 · Abruf 2026-11-03 · Stufe B | Die Liste führt Firmen, keine Serien. Ob Bravus 2000 Klasse B erreicht, bleibt offen. |
| N08 | 02, Normen | KPK: Profilzylinder müssen mindestens Bohrschutz haben | bestätigt | KPK-Herstellerverzeichnis, S. 2 · Abruf 2026-11-03 · Stufe B | Wortlaut: müssen „mindestens durch einen Bohrschutz geschützt werden“. Die Seite nennt zusätzlich mindestens ES 1 mit Zylinderabdeckung. |
| N09 | 02, Normen | KPK empfiehlt A besser B, mit Ziehschutz C besser D | bestätigt | KPK-Herstellerverzeichnis, S. 2, Abschnitt „Klassen“ · Abruf 2026-11-03 · Stufe B | Die Seite spricht von Empfehlenswert sind diese. Für mechatronische Zylinder (DIN EN 15684) nennt sie A und B. |
| N10 | 02, Normen | DIN 18257:2022-02: vier Widerstandsklassen ES0 oder Klasse 1 bis ES3 oder Klasse 4; Zylinder soll höchstens 3 mm vorstehen | bestätigt | baunetzwissen.de, Artikel „DIN 18257“ · Abruf 2026-11-03 · Stufe B | Der Artikel nennt 3 mm als Empfehlung („sollte“) für den herausragenden Teil des Zylinders. Die Empfehlung „mindestens ES 1 mit ZA“ steht im Artikel nicht, sondern im KPK-PDF (N08). |

## 3 Stichproben aus Erhebung 03 (Transponder)

| Nr | Zeile | Aussage (gekürzt) | Ergebnis | Prüfquelle · Abruf · Stufe | Anmerkung |
|---|---|---|---|---|---|
| T01 | 03, Typen | VW Golf 6, Passat B7, Audi A4 B8 · bis etwa 2015 · Megamos Crypto (ID48) | abweichend (Zusatz) | kfz-dietrich.com, Artikel „Transpondertypen“ (Datum 3. März 2026, aktualisiert 30. Oktober 2026) · Abruf 2026-11-03 · Stufe B | Zeitraum „bis ca. 2015“ stimmt. Die Zeile nennt „ID48/Megamos Crypto oder Hitag2“, Hitag 2 fehlt in der Erhebung. Die Seite trägt den Hinweis „Mit KI-Unterstützung erstellt, redaktionell geprüft“. |
| T02 | 03, Typen | Peugeot, Citroën, Renault, Honda · ID46 (PCF7936) | bestätigt | kfz-dietrich.com, Artikel „Transpondertypen“ · Abruf 2026-11-03 · Stufe B | Wortlaut: „Verbreitet bei Peugeot, Citroën, Renault und Honda.“ |
| T03 | 03, Typen | Golf 7, Skoda Octavia 3, Audi A3 8V · ab 2013 · MQB-Chips, AES-128 | bestätigt | kfz-dietrich.com, Artikel „Transpondertypen“ · Abruf 2026-11-03 · Stufe B | Die Seite nennt zusätzlich „ausschließlich ODIS Online“. Das fehlt in der Erhebung. |
| T04 | 03, Generationen | Festcode etwa 1995 bis 2000, Crypto mit Abfrage etwa 1998 bis 2012, AES mit Herstellerbackend ab etwa 2010 | bestätigt | kfz-dietrich.com, Artikel „Generationen“ (11. Juni 2026, aktualisiert 30. Oktober 2026) · Abruf 2026-11-03 · Stufe B | Zeiträume laut Überschriften „ca.“ und FAQ „etwa“ übereinstimmend. |
| T05 | 03, Anlernen | Mit Originalschlüssel dauert das Anlernen laut Dietrich 30 bis 60 Minuten | bestätigt | kfz-dietrich.com, Artikel „Anlernen“ (12. Juni 2026, aktualisiert 29. Oktober 2026) · Abruf 2026-11-03 · Stufe B | Wortlaut: „meist in 30 bis 60 Minuten“. Die Erhebung lässt „meist“ weg. |
| T06 | 03, Anlernen | Ersatzschlüssel: Zulassungsbescheinigung Teil I, Personalausweis, bei Firmenfahrzeugen Vollmacht des Halters | bestätigt | kfz-dietrich.com, Artikel „Anlernen“ · Abruf 2026-11-03 · Stufe B | Das Zitat aus Erhebung 03 („Ohne Herstellerzugang und ohne Berechtigungsnachweis entsteht kein funktionierender Schlüssel“) steht auf dieser Seite nicht wortgleich. Ähnlich heißt es: „Ohne Legitimation als Halter legen wir keinen Schlüssel an.“ Die zweite Quelle des Zitats (Generationen) ist für das Zitat nicht geprüft. |
| T07 | 03, Anlernen | Dritte Generation (AES): Freigabe nur über das Herstellerbackend mit nicht übertragbarem Werkstattzertifikat; Werkzeuge XENTRY, ODIS, ISTA | abweichend (zu allgemein) | kfz-dietrich.com, Artikel „Anlernen“ · Abruf 2026-11-03 · Stufe B | Werkzeuge XENTRY, ODIS und ISTA sind genannt. Das Herstellerbackend nennt die Seite nur für Mercedes FBS4 und BMW FEM/BDC, wenn alle Schlüssel verloren sind. Eine generelle Pflicht und das Werkstattzertifikat stehen hier nicht. |
| T08 | 03, Chips | Hitag 3, Hitag Pro und Hitag AES nur lesen, programmieren, authentifizieren; Verfahren brauchen AVDI-Schnittstelle mit Jahresabo | abweichend (Hitag AES) | abrites.com, PROTAG-Seite · Abruf 2026-11-03 · Stufe B · ohne Stand, nur Jahresangabe 2026 in der Fußzeile | AVDI-Angabe bestätigt („An AVDI interface with an active annual subscription is required“). „Read/program/authenticate“ steht für Hitag 3, Pro und AES im Abschnitt LF 125 kHz. Hitag AES steht aber in der Klon-Liste (H-Schlüssel Toyota, Lexus, Scion). Die Einschränkung „nur“ ist für Hitag AES daher falsch. |
| T09 | 03, Chips | Mercedes-Benz Sprinter, Actros · Temic 11 und 12 (Beispiele) | bestätigt | abrites.com, PROTAG-Seite · Abruf 2026-11-03 · Stufe B | Wortlaut: „All types Temic 11/12 (example Mercedes Sprinter, Mercedes Actros, ...)“. |
| T10 | 03, Chips | Toyota, Lexus, Scion (H Schlüssel) · DST AES und Hitag AES | bestätigt | abrites.com, PROTAG-Seite · Abruf 2026-11-03 · Stufe B | Wortlaut: „All types Toyota/Lexus/Scion DST-AES/Hitag AES keys (H Type keys)“ in der Liste „Key/Transponder cloning support“. Abrites nennt diese Schlüssel also als klonbar. Das steht im Gegensatz zu Dietrich (siehe OFFENE FRAGE). |

## 4 Abrufprotokoll (laufend)

## 2 Abrufprotokoll (laufend)

| Nr | Ziel | Art | Ergebnis |
|---|---|---|---|
| A1 | c1.abus.com/robots.txt | robots.txt | HTTP 403, daher keine Seite dieser Domain abgerufen |
| A2 | www.bks.de/robots.txt | robots.txt | keine Sperre für /de-de/produkte/, kein Crawl-delay |
| A3 | bks.de, Produkt janus8000 | Seite | Weiterleitung auf identity.g-u.com (Anmeldung), nicht verfolgt |
| A4 | bks.de, Produkt detect3000 | Seite | wie A3 |
| A5 | bks.de, Produkt nuvius | Seite | wie A3 |
| A6 | www.dinmedia.de/robots.txt | robots.txt | keine Sperre für /de/norm/ und /de/technische-regel/, kein Crawl-delay |
| A7 | dinmedia.de, Technische Regel VdS 2386 (168155183) | Seite | S10 |
| A8 | dinmedia.de, DIN EN 1303:2026-08 (401073981) | Seite | N01 |
| A9 | dinmedia.de, DIN EN 1303:2015-08 (225357321) | Seite | N02 |
| A10 | dinmedia.de, DIN 18252:2018-05 (286575374) | Seite | N03 |
| A11 | dinmedia.de, DIN EN 15684:2021-05 (325987131) | Seite | N04 |
| A12 | dinmedia.de, VdS 2156-1:2023-10 (374614093) | Seite | N05 |
| A13 | www.lka.polizei-nds.de/robots.txt | robots.txt | HTTP 404, also keine Sperre |
| A14 | lka.polizei-nds.de, KPK-Herstellerverzeichnis (download/74074) | PDF | Bild-PDF, Stand Januar 2025, Seiten 1 bis 3 lesbar gemacht; das Werkzeug speicherte die Datei lokal, nicht ausgeführt |
| A15 | www.baunetzwissen.de/robots.txt | robots.txt | keine Sperre für /beschlaege/, kein Crawl-delay |
| A16 | baunetzwissen.de, Artikel DIN 18257 | Seite | N10 |
| A17 | kfz-dietrich.com/robots.txt | robots.txt | /blog/ erlaubt, kein Crawl-delay für * oder ClaudeBot |
| A18 | kfz-dietrich.com, Transpondertypen | Seite | T01 bis T03 |
| A19 | kfz-dietrich.com, Generationen | Seite | T04 |
| A20 | kfz-dietrich.com, Anlernen | Seite | T05 bis T07 |
| A21 | abrites.com/robots.txt | robots.txt | nur /admin/ gesperrt, /taxons/ erlaubt |
| A22 | abrites.com, PROTAG (taxons/protag) | Seite | T08 bis T10 |

Abrufe bisher: 22 von höchstens 40.
