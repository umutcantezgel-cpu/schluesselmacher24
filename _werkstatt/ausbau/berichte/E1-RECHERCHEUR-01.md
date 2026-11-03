# E1-RECHERCHEUR-01 · Bericht Fahrzeugdatenquellen

## GEÄNDERTE DATEIEN

- Neu: `_werkstatt/ausbau/erhebung/E1-fahrzeugquellen.md` (Ergebnis, 1.619 Wörter).
- Neu: `_werkstatt/ausbau/berichte/E1-RECHERCHEUR-01.md` (dieser Bericht).
- Neu, von Git ignoriert: `_werkstatt/ausbau/daten/kba/fz12_2026.xlsx` (einziger Download) und `_werkstatt/ausbau/daten/kba/fz12_2026_modellreihen_abgeleitet.csv`.
- Keine Projektdatei geändert, nichts committet, keine Git Konfiguration verändert.

## WAS UND WARUM

- Auftrag: offene, lizenzierbare Quellen für Marken, Modellreihen und Bauzeiträume der Pkw in Deutschland, dazu eine Methode für 95 Prozent Abdeckung.
- Korrektur: Der Pkw Bestand nach Modellreihen steht in KBA FZ 12, nicht in FZ 10. FZ 10 ist eine monatliche Neuzulassungsstatistik. Den Bestand nach Marken liefert FZ 17.
- Die KBA Datei (Stichtag 1. Januar 2026) ist geladen und geprüft: 49.486.487 Pkw, 649 benannte Modellreihen, Obergrenze 97,33 Prozent.
- Wikidata: Lizenz CC0. Die SPARQL Abfrage ist nicht ausgeführt, weil robots.txt von query.wikidata.org den Pfad /sparql sperrt. Der Entwurf steht im Ergebnis.
- Ergänzt um EEA Neuzulassungsdaten (CC BY 4.0 laut Katalog) und Wikipedia (CC BY-SA 4.0 für Texte).

## GEMEINSAME DATEIEN

Keine Änderungen gewünscht.

## PRÜFUNG UND ERGEBNIS

- Die Summen der KBA Datei stimmen exakt, ebenso die Segmentsummen.
- 95 Prozent: 348 größte benannte Reihen, Reserve 1.961 Fahrzeuge. 97 Prozent: 535 Reihen. Marken: 63 mit Bestand, 26 davon erreichen 95 Prozent. Volkswagen allein kommt auf 20,38 Prozent.
- Wikidata: Klasse car model, Hersteller über P176, Datumsfelder wechselnd P580/P582 oder P571/P2669. Der Hersteller ist mal der Konzern (Volkswagen Group), mal die Marke (Volkswagen). Zeiten fehlen teils, etwa beim Golf Sportsvan.
- Trefferzahl und Beispielzeilen aus einer Abfrage liegen nicht vor. Ersatz sind drei Einzelseiten: Golf Mk1 1974 bis 1983, Golf Mk2 1983 bis 1992, Golf Sportsvan ohne Zeitangabe.
- Lizenzen: Das KBA erlaubt laut AGB § 1 Abs. 3 kostenfreie Statistik mit Quellenangabe unter DL-DE BY 2.0. Die Datei selbst nennt nur einen Copyright Vermerk. EEA CC BY 4.0 laut Katalog, dort mit Widerspruch. Wikipedia Texte CC BY-SA 4.0, Daten ungeregelt.
- Abstand zu kba.de: 30 Sekunden eingehalten, außer zwischen robots.txt und Downloadbereich (nicht gemessen, siehe Ergebnis Abschnitt 6).

## BELEGE

- KBA Datei FZ 12, Stufe A: https://www.kba.de/SharedDocs/Downloads/DE/Statistik/Fahrzeuge/FZ12/fz12_2026.xlsx?__blob=publicationFile&v=3
- KBA AGB § 1, Stufe B: https://www.kba.de/DE/Statistik/agb_202209_pdf.pdf?__blob=publicationFile&v=2
- KBA Produktseite FZ 12, Stufe B: https://www.kba.de/DE/Statistik/Produktkatalog/produkte/Fahrzeuge/fz12_b_uebersicht.html?nn=852774
- Wikidata Lizenz, Stufe B: https://www.wikidata.org/wiki/Wikidata:Licensing
- Wikidata robots für Abfrage, Stufe B: https://query.wikidata.org/robots.txt
- Wikidata Einzelseiten, Stufe B: https://www.wikidata.org/wiki/Q1545536 · https://www.wikidata.org/wiki/Q1393500 · https://www.wikidata.org/wiki/Q15305557
- EEA Katalogeintrag, Stufe B: https://sdi.eea.europa.eu/catalogue/srv/api/records/5814203d-f36d-4fee-90d4-64bb348d15a6?language=eng
- Wikipedia Lizenz, Stufe B, abgerufen 2026-11-03: https://de.wikipedia.org/wiki/Wikipedia:Lizenzbestimmungen

Alle übrigen URLs mit Abrufdatum stehen im Ergebnis.

## OFFENE FRAGEN

1. Lizenz KBA FZ 12 bestätigen, durch das KBA oder eine Rechtsprüfung. Die Datenlizenz Seiten des KBA liegen im für Crawler gesperrten Pfad /DE/Service/.
2. Wikidata Abfrage nur von einer Person im Browser oder nach Entscheidung des Orchestrators ausführen. Konzernlabels außer Volkswagen Group ergänzen.
3. Herstellerseiten mit Modellhistorie sind nicht geprüft.
4. Acht KBA Reihen liegen unter der Schwelle von 1.000 aus den Hinweisen. Die Produktseite nennt laut Abruf 2027 in der Überschrift.
5. Die EEA Lizenzangaben widersprechen sich, die Tabellendefinition ist ungelesen.
6. Wikipedia: Daten und Fakten sind nicht geregelt.
7. Die Aliasliste für Marken braucht FZ 17 als Kontrolle, diese Datei ist nicht geladen.
8. Der Abstand zu kba.de zwischen robots.txt und Downloadbereich ist nicht gemessen.
