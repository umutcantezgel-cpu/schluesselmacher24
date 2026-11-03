# E3-DATENPFLEGER-03 · Erhebungsbögen

Keine Projektdatei geändert, nichts committet.

## GEÄNDERTE DATEIEN
Neu unter `_werkstatt/ausbau/erhebung/boegen/`: `preise`, `klonbar`, `sortiment`, `produkte`, `partner` als `.csv` und `.html`, dazu `LIESMICH.md` (222 Wörter) und `erzeugen.mjs`. Andere Änderungen im Arbeitsbaum sind nicht meine.

## WAS UND WARUM
- PREISE, 55 Zeilen: 4 Gruppen, 24 Leistungen, 22 Zylinder-, Set-, Anzahlungs- und Versandwerte, 5 neue Positionen. Vorschläge nur für Einsenden (E1-versand).
- KLONBAR, 27 Zeilen: 22 Fahrzeugangaben und 5 Transpondertypen ohne Fahrzeug (E1-transponder). Ohne Antwort: nicht klonbar.
- SORTIMENT, 52 Zeilen: alle Codelinien mit Bestandspreis, eigene Spalte Hersteller.
- PRODUKTE, 6 Zeilen: Produktnamen nur als Frage (MA-15, G-33).
- PARTNER, 7 Zeilen: Provision und Abrechnungsart bleiben leer und stehen nicht auf der Druckseite.
- Abweichungen: (1) `E1-RECHERCHEUR-03.md` fehlt, daher ist `E1-wettbewerb.md` nicht genutzt. (2) Elektronische Systeme stehen in `seo.json` und `rubriken.json`, nicht in `service-pages.json` oder `service-pricing.json`. (3) Bestandstexte mit Gedankenstrich bleiben in der CSV zeichengenau, die Druckseiten zeigen einen Doppelpunkt.

## GEMEINSAME DATEIEN
Neue Zeile für `MENSCHEN.md` (Nummer vorher prüfen):

| MA-18 | **Einsendepreis festlegen**: Zahlt der Kunde das Porto? Sind 4,45 Euro (versichert) und 1,80 Euro (unversichert) Porto oder Aufpreis? Der Bestand kennt nur Versandarten für Bestellungen. | G-24 sieht kostenloses Einschicken vor, R9 verbietet „kostenlos“ ohne echte Kostenfreiheit. | Einsenden erscheint nur als Anfrage ohne Preis. | Bogen PREISE, P-051 und P-052; Nachricht `PREISE …` |

## PRÜFUNG UND ERGEBNIS
- Form: BOM, Semikolon, Kopfzeile, eindeutige Kennungen, Antwortspalte leer. Alle 147 Hinweise beginnen mit „Vorschlag, bitte prüfen“.
- Bestand: gegen `content/*.json` geprüft. 46 Preisangaben in PREISE und 52 Sortimentspreise: 0 Abweichungen. Dazu 4 Gruppennamen und 6 Textbestände wörtlich.
- Stichprobe (8): P-005 149,00 (priceCents 14900). P-006 199,00 bis 299,00. P-017 399,00 bis 649,00, Anzahlung 79,00. P-029 39,00 (basePriceCents 3900). P-032 3,50 (lengthSurchargeCents 350). P-041 14,90 (keyPriceCents 1490). P-045 69,90 (depositCents 6990). S-001 8,00, 7,20 und 6,56 (priceCents 800, bulkPrices 720 und 656).
- Druck: Chromium 153 über Playwright. Seiten: PREISE 10, KLONBAR 6, SORTIMENT 11, PRODUKTE 2, PARTNER 2. Schrift mindestens 11 pt. Kopf mit Bogenname, Datum und Feld „Ausgefüllt von“, Fuß „Vorschlag, bitte prüfen“ mit Seitenzahl auf jeder Seite. Keine externen Dateien, keine Skripte. Sichtprüfung von 9 Seiten.
- Text: keine Gedankenstriche und keine Floskeln in HTML und LIESMICH. Das Ausrufezeichen steht nur im Doctype. Die CSV enthalten 57 Gedankenstriche aus Bestandstexten.

## BELEGE
- `content/`: pricing-groups, service-pricing, cylinder-catalog, settings, code-lines, car-key-services, rubriken, seo, service-pages, cities.
- Erhebung: E1-versand, E1-transponder, E1-schliesstechnik-systeme, E1-interview (I-CODE-01, I-CODE-09).
- Vorgaben: AUFTRAG G-18, G-24, G-33, G-34, G-40; FACHWISSEN; MENSCHEN MA-04, MA-06, MA-13, MA-15.

## OFFENE FRAGEN
1. Ohne Marktquelle bleiben Gehäuse ab, Transponder-Kopie und Sätze ab 11 Zylindern ohne Vorschlag.
2. Alle 52 Codelinien tragen im Bestand den Hersteller „[Hersteller eintragen]“.
3. BKS: Der Suchauszug nennt „ixalo“, im Gespräch fiel „Xialo“. „SE“ (BKS) und „One“ (ABUS) sind ohne Beleg.
4. PARTNER: „vor Ort“ meint im Bestand bei Autoschlüsseln oft die Werkstatt. Fahrzeugöffnung ist Leistung, aber keine Auftragsart.
5. Porto-Stand 2026-11-02, Änderungen für 2027 sind laut E1-versand offen.
6. E1-versand markiert den Großbrief zu 1,80 Euro einmal als Stufe B, einmal als Stufe C.
