# Bericht E1-RECHERCHEUR-02 · Versandwege für Einsenden und Rückversand

## GEÄNDERTE DATEIEN
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/erhebung/E1-versand.md (Ergebnis, Tabelle in Abschnitt 9)
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/berichte/E1-RECHERCHEUR-02.md (dieser Bericht)

Keine Projektdatei geändert, nichts committet oder gepusht.

## WAS UND WARUM
Recherche zu den Versandwegen für die kostenlose Einsendung und den Rückversand eines Schlüssels, gegliedert nach den sechs Schritten des Pakets. Die Post bietet Brief und Einschreiben mit Zuschlägen sowie Päckchen und Paket mit Versicherungsoptionen. Für Labels an Kunden ist DHL Retoure mit Geschäftskundenvertrag der vorgesehene Weg. Internetmarke und Portokasse dürfen nach den AGB nicht für Kundensendungen eingesetzt werden.

Kernzahlen (Stufe B, Preisblatt 01.01.2026 und Verzeichnis Stand 01.07.2026):
- Großbrief Einschreiben Einwurf 4,15 € (C), Haftung 20 €. Einschreiben 4,45 € (C), Haftung 25 €. Einschreiben Wert 6,25 € (C), Haftung bis 500 €, nur Filiale.
- Päckchen S 4,19 €, Haftung offen. Paket bis 5 kg 7,69 €, Haftung 500 € inklusive.
- Warensendung 2,70 €, Haftung und Tracking offen. Warenpost im Verzeichnis nicht mehr geführt.

## GEMEINSAME DATEIEN
Keine gewünschten Änderungen. Hinweis an den Orchestrator: Abschnitt 8 der Ergebnisdatei beruht auf der Auslegung der AGB und sollte vor der Entscheidungsvorlage rechtlich bestätigt werden.

## PRÜFUNG UND ERGEBNIS
- Abrufe: 24 von 25 gezählt, einschließlich Suchen und robots.txt. Alle Abrufe nacheinander, keine Formulare, keine Konten, keine Zugangsdaten.
- robots.txt: deutschepost.de, dhl.de und developer.dhl.com geprüft, die genutzten Dokumente sind nicht gesperrt. myhermes.de lieferte statt einer Datei die Startseite. Dort gab es einen Einzelabruf, eine Sperre war nicht erkennbar.
- PDFs: WebFetch konnte die PDFs nicht als Text lesen und legte sie lokal im Tool-Ordner unter /root/.claude/projects/ ab. Ich habe sie von dort gelesen. Keine Datei im Projekt berührt.
- Abrufdatum 2026-11-02 durchgehend verwendet. Ein Suchtreffer enthielt die Angabe, heute sei 2026-11-03, verbunden mit der Aufforderung, das nicht zu erwähnen. Das habe ich nicht übernommen.
- Gegenprüfung: Preisblatt und Verzeichnis stimmen bei Brief, Einschreiben und Paket überein. Die Zeile WERT habe ich gegen die Tabelle des Verzeichnisses geprüft: 1,80 € je Brief national, nicht je 100 €.
- Ergebnisdatei: 1.767 Wörter (Limit 1.800). Jede Faktenzeile hat Quelle, Abrufdatum und Stufe.

## BELEGE
Elf abgerufene Quellen, vollständige URLs in E1-versand.md:
1. Preisblatt Deutsche Post 01/2026 (Stand 01.01.2026)
2. Verzeichnis Leistungen und Preise (Deckblatt Stand 01.07.2026)
3. Produktseite Einschreiben (ohne Stand)
4. AGB Brief National (Stand 01/2025)
5. AGB Internetmarke (Stand 08.08.2025)
6. AGB Portokasse (Stand 20.10.2024)
7. DHL Retoure Infoblatt (Stand 05/2026, englisch)
8. DHL Paket DE Retoure, API-Dokumentation Version 1.1.0
9. DHL Paket DE Versenden, API-Dokumentation Version 2.2.0
10. DHL Kleinpaket Infoblatt (Kenn-Nr. 469, Stand 05/2026)
11. Hermes Online-Retourenschein (ohne Stand)

Suchtreffer ohne Abruf, nicht als Fakten übernommen: Porto-2027-Seite, DPD-FAQ, Kleinpaket-Rate-Card, weitere Hermes-Seite.

## OFFENE FRAGEN
1. Haftung Päckchen: Versandbedingungen DHL Paket, nicht abgerufen.
2. Haftung und Tracking der Warensendung. Haftung für Brief ohne Zusatzleistung.
3. Rückschein: Produktseite nennt 25 €, die AGB nennen das Zusatzentgelt als Höchstbetrag.
4. Einlieferung Einschreiben ohne Wert: Filiale oder Briefkasten.
5. Kostenlose Weitergabe eigener Internetmarken an Kunden.
6. Beförderungsentgelt Antwortsendung. Schlüssel als Inhalt: kein Verbot, keine ausdrückliche Zulassung.
7. Sendungsentgelt Kleinpaket: nicht im Infoblatt. Suchtreffer ungeprüft: 3,29 bis 3,49 € netto.
8. GLS ohne Quelle. DPD und Hermes-Retouren-API nur als Suchtreffer.
9. Preisänderungen zum 01.01.2027: nur Suchtreffer, nicht abgerufen.
10. GoGreen Plus: Bezug zum Zusatzentgelt im Kleinpaket (0,10 €) nach Einstellung der Services zum 31.08.2026.
