# E1-FACHKUNDLER-04 · Gegenprüfung der Erhebungen und Lückenschlüsse

## GEÄNDERTE DATEIEN
- _werkstatt/ausbau/erhebung/E1-gegenpruefung.md (neu: 30 Stichproben, Lücken, Abrufe, offene Fragen)
- _werkstatt/ausbau/berichte/E1-FACHKUNDLER-04.md (dieser Bericht)

Keine Projektdatei geändert.

## WAS UND WARUM
Die Erhebungen 01 bis 03 wurden an je 10 Stichproben gegen ihre Quellen geprüft, die Lücken L2 bis L7 recherchiert. Details und Quellen stehen in E1-gegenpruefung.md.

## GEMEINSAME DATEIEN (gewünschte Änderungen, exakt)
1. E1-schliesstechnik-systeme.md, Z. 15: Satz „Die fünfte Karte „Erweiterbare Anlage“ heißt dort „Kein eigenes Schließsystem“.“ ersetzen durch „Die fünfte Karte heißt „Erweiterbare Anlage“; „Kein eigenes Schließsystem“ beginnt ihre Beschreibung.“
2. E1-schliesstechnik-normen.md, Z. 9: Satz „Eine andere DIN-Seite zeigt „Pre-order“, der Status ist deshalb offen.“ ersetzen durch „Die gelesenen Seiten zeigen 401073981 als AKTUELL und 225357321 als ZURÜCKGEZOGEN. „Pre-order“ ist nicht belegt.“
3. E1-schliesstechnik-normen.md, Z. 10: „(Fassung 2015, laut Kommission Polizeiliche Kriminalprävention, KPK)“ ersetzen durch „(laut KPK-Herstellerverzeichnis, Stand Januar 2025)“.
4. E1-schliesstechnik-normen.md, Z. 12: anfügen „VdS 2386 ordnet elektronische Schließsysteme der VdS 2215 zu; die Zuordnung ist uneinheitlich.“
5. E1-transponder.md, Z. 18: Satz „Hitag 3, Hitag Pro und Hitag AES nur lesen, programmieren, authentifizieren.“ ersetzen durch „Hitag 3 und Hitag Pro: lesen, programmieren, authentifizieren. Hitag AES steht auf derselben Seite in der Klon-Liste für Toyota, Lexus und Scion (H-Schlüssel).“
6. E1-transponder.md, Z. 28: Satz „Freigabe nur über das Herstellerbackend mit einem nicht übertragbaren Werkstattzertifikat (Dietrich).“ ersetzen durch „Bei Mercedes FBS4 und BMW FEM/BDC ist beim Verlust aller Schlüssel ein Online-Vorgang über das Hersteller-Backend nötig (Dietrich). Werkzeuge: XENTRY, ODIS, ISTA.“
7. E1-transponder.md, Z. 33: Zitat „Ohne Herstellerzugang und ohne Berechtigungsnachweis entsteht kein funktionierender Schlüssel.“ streichen oder durch „Ohne Legitimation als Halter legen wir keinen Schlüssel an.“ ersetzen (Dietrich, Anlernen-Seite).
8. E1-transponder.md, Z. 38: „Megamos Crypto (ID48)“ ersetzen durch „ID48/Megamos Crypto oder Hitag 2“.

## PRÜFUNG UND ERGEBNIS
- Stichproben: 19 bestätigt, 5 abweichend (S02, N06, T01, T07, T08), 6 nicht prüfbar (S04 bis S09).
- Erhebung 01: ABUS- und BKS-Herstellerangaben nicht prüfbar. abus.com und c1.abus.com verweigern die robots.txt (HTTP 403), bks.de leitet Produktseiten auf eine Anmeldung um.
- Erhebung 02 hält überwiegend stand. Abweichend: „Fassung 2015“ im KPK-Zitat. „Pre-order“ ist nicht belegt.
- Erhebung 03: Zeiträume und Chiplisten stimmen überwiegend. Abweichend: Hitag 2 bei ID48 fehlt, Herstellerbackend zu allgemein, Hitag AES laut Abrites klonbar.
- Lücken: keine vollständig belegt. L4 und L7 teilweise, L2, L3, L5 und L6 nicht belegt.
- Abrufe: 39 von höchstens 40.

## BELEGE
- E1-gegenpruefung.md: Quelle, Datum und Stufe je Zeile (Abschnitte 1 bis 3), Abrufe je Domain (Abschnitt 2).
- Vom Werkzeug gespeicherte PDF-Kopien, nur gelesen, unter /root/.claude/projects/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/tool-results/ (KPK-Verzeichnis: webfetch-1793669455552-4qqudy.pdf; Steinbach: webfetch-1793672055391-byiftv.pdf).

## OFFENE FRAGEN
1. ABUS-Zugang klären, ohne die robots-Sperre zu umgehen (Fachhändler-PDF oder Herstelleranfrage außerhalb dieses Laufs).
2. Sperrschließung: Begriff und Verhältnis zur Gleichschließung entscheiden. Der Kern-Auszug setzt beides gleich, die Normen tun das nicht.
3. Hauptschlüssel-Zentralschließanlage: Herstellerquelle mit Volltext fehlt, Suchauszüge widersprechen sich (KHZ gegen ZUE).
4. Steinbach-Datenblatt: Außenknauf gegen Knaufseite innen. Doppelknauf und „immer innen“ nicht belegt.
5. Planreserve: Begriff nicht belegt. Das Konzept steht nur in Suchauszügen (Stufe C).
6. Berechtigungsnachweis: Zitat in E1-transponder.md, Z. 33, ersetzen (Punkt 7). R13 nicht schwächen.
7. Quellen mit KI-Hinweis (kfz-dietrich.com, zeg-holz.de): Stufe B nur mit Vorbehalt.
8. Eingebettete Anweisungen auf sechs dinmedia-Seiten und ein Formathinweis der Websuche nicht befolgt (E1-gegenpruefung.md, Abschnitt 4).
