# E1-gegenpruefung · Gegenprüfung der Erhebungen E1-FACHKUNDLER-01 bis 03

Kennung E1-FACHKUNDLER-04 · Abrufdatum 2026-11-03 · Schreibstand: Stichproben S01 bis S09 geprüft, S10 bis T10 und die Lücken L2 bis L7 offen.

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

## 2 Abrufprotokoll (laufend)

| Nr | Ziel | Art | Ergebnis |
|---|---|---|---|
| A1 | c1.abus.com/robots.txt | robots.txt | HTTP 403, daher keine Seite dieser Domain abgerufen |
| A2 | www.bks.de/robots.txt | robots.txt | keine Sperre für /de-de/produkte/, kein Crawl-delay |
| A3 | bks.de, Produkt janus8000 | Seite | Weiterleitung auf identity.g-u.com (Anmeldung), nicht verfolgt |
| A4 | bks.de, Produkt detect3000 | Seite | wie A3 |
| A5 | bks.de, Produkt nuvius | Seite | wie A3 |

Abrufe bisher: 5 von höchstens 40.
