# E5-PRUEFER-01 · Prüfstufe B Etappe E5 und Prüfliste G-27 bis G-30

Stand HEAD 5d694ca, Prüfserver localhost:3000 (Build 3. November 2026, 23:28 Uhr). Vergleich E4 = E4-PRUEFER-02. Belege relativ zu `protokolle/E5-PRUEFER-01/`. Gesamturteil: **gelb**, kein Rot.

## GEÄNDERTE DATEIEN
- Neu: `berichte/E5-PRUEFER-01.md`, `protokolle/E5-PRUEFER-01/`.
- Keine Projektdatei geändert. Die Datenweiche hat `protokolle/datenweiche.log` angehängt.

## WAS UND WARUM
- Build, Typprüfung, Lint, Unit und DB über die Datenweiche, alle grün.
- Werkzeuge gegen den Prüfserver auf 16 Routen: 14 Hauptansichten, Schließplan-Planer, Sperrschließungs-Konfigurator.
- Eigene Playwright-Skripte (`scratchpad/e5p01/`) für Konfigurator-Schritte, offene Menüs und G-27 bis G-30. Alle Anfragen blieben in den Attrappen.
- axe-core liegt unter `/root`, daher `--als-root`. Meine Protokollordner sind für ubuntu beschreibbar.

## PRÜFUNG UND ERGEBNIS

| Prüfung | E4 | E5 | Urteil | Beleg |
|---|---|---|---|---|
| Build JSON und pg | 224 Seiten | 226 Seiten, exit 0 | grün | build-json.log, build-pg.log |
| Typprüfung, Lint | 0, 0 | 0, 0 | grün | typecheck.log, lint.log |
| Unit | 1986 von 1986 | 2050 von 2050 | grün | test-unit.log |
| DB (pg) | 97 von 97 | 97 von 97 | grün | test-db.log |
| Konsole, 16 Ansichten | 0 Fehler, 26 Abbrüche | 0 Fehler, 0 Warnungen; 33 Vorabruf-Abbrüche, 28 davon auf 14 Hauptansichten | grün | konsole.json |
| Funktionsliste F-01 bis F-19 | 19 von 19 | 19 von 19 | grün | funktionsliste.md |
| axe WCAG 2.2 AA, 16 Routen, mobil und desktop | 0 | 0 in 32 Läufen | grün | a11y.json |
| axe je Konfigurator-Schritt | n. v. | Schließplan 2 bis 5, Sperrschließung 1 bis 5: 0 in 20 Schritten | grün | schritte-axe.json |
| axe offene Menüs | 0 | Schublade, 5 Megamenüs: 0 | grün | menues-axe.json |
| Lighthouse mobil, Leistung / LCP (Median aus 3) | Start 92 / 2943 ms; Anfrage 85 / 3829; H02 92 / 3010; H09 90 / 3606 | Start 93 / 3084; Anfrage 92 / 3142; H02 92 / 3157; H09 88 / 3707; Schließplan 94 / 3011 | gelb | lighthouse-mobil.json |
| Lighthouse SEO | 92 auf H02, H04, H09 | 100 auf allen 5 | grün | lighthouse-mobil.json |
| Bildsatz Seitenüberlauf, 80 Zeilen, 608 Bilder | 0 | 0 | grün | bildsatz.json |
| Bildsatz H01, Befunde am rechten Rand | 32, 32, 3, 2, 0 | 32, 32, 3, 2, 0 | grün | bildsatz.md |
| Bildsatz H02, Befunde am rechten Rand | 85, 85, 3, 0, 0 | 85, 85, 3, 0, 0 | gelb | bildsatz.md |
| Bewegung reduziert, 16 Ansichten | 0 | 0 | grün | bewegung-reduziert.json |
| Werte außerhalb Designsystem | 44 | 45 (Basis 822a0d9, E4-Basis fehlt); neu 1 im Schließplan-Editor | gelb | werte-suche.json |
| Slop S1 bis S8, 14 Hauptansichten | 0, 2, 152, 0, 26, 10, 0, 24 | 0, 2, 150, 0, 26, 10, 0, 24 | grün | slopscan.json |
| Inventar, indexierbar | 181 von 217 | 182 von 218; Schließplan nicht in der Sitemap | gelb | inventar.json, inventar.tsv |
| Schließplan-PDF | n. v. | 200, application/pdf, 1 Seite A4 | grün | plan-kopf.txt, plan-vorschau.png |

Lighthouse: Die E5-Spannen umfassen die E4-Mediane, die Abweichungen (101 bis 147 ms) liegen in der Streuung. H04 ist besser. H09 fällt von 90 auf 88 und liegt in der E5-Streuung (87 bis 92). Das LCP-Budget von 2500 ms verfehlen alle fünf Ansichten (A-032).

## PRÜFLISTE G-27 BIS G-30 (Bilder: `bilder-planer/`, `bilder-g28/`)
- **G-27 teilweise.** Erfüllt: Tür mit Bezeichnung, Bauform (3 Formen), Funktion, Maße 27 bis 80 mm, Bohr- und Ziehschutz; Schlüssel mit Anzahl und Vormerkung; Matrix; Gesamtpreis; bearbeitbare Liste; PDF. Fehlt: Bauformen Vorhangschloss, Hebelzylinder, Schließeinsatz, Außenzylinder; Maße nur bis 80 statt 120; Oberfläche; Schlüsselkappen. ABUS- und BKS-Systemdaten fehlen nach MA-22 (vermerkt, kein Fehler). Bilder: `s2-tueren.jpg` bis `s5-abschluss.jpg`.
- **G-28 teilweise.** Erfüllt: Hinweis „Mehr als 10 Zylinder“ ab elf; jede Position einzeln; Schlüsselzahl 1 bis 50. Abweichung: Direkt bestellbar sind bis 30 Zylinder, nicht „mehr auf Anfrage“ ab 10. Bild: `g28-mehr-als-zehn.jpg`.
- **G-29 teilweise.** Erfüllt: Messhilfe mit Maßzeichnung je Position; Rückfrage bei Auffälligkeit (80 und 27 ergeben „unterscheiden sich um 53 mm“); Pflichtbestätigung „Maße geprüft“ im Planer. Fehlt: Video; Pflichtbestätigung im Sperrschließungs-Konfigurator. Bilder: `g29-messhilfe.jpg`, `g29-auffaellig.jpg`.
- **G-30 teilweise.** Erfüllt: Empfehlung mit dem Wortlaut „Für Firmen mit mehreren Bereichen empfehlen wir eine Schließanlage“ auf beiden Seiten; Beratung („Unsicher? Wir beraten Sie“) nur im Planer. Bilder: `g30-planer-empfehlung.jpg`, `g30-sperr-empfehlung.jpg`.

## BELEGE
- `protokolle/E5-PRUEFER-01/`: alle JSON-, Markdown- und Logdateien, `plan.pdf`, `planlink.json`, `schritte-axe.json`, `menues-axe.json`, Bilderordner.
- Skripte: `scratchpad/e5p01/` (nicht im Projekt).

## OFFENE FRAGEN
1. G-28: Gilt die Anfrage ab 10 Zylindern (G-28) oder bleibt die Bestellung bis 30 (G9)? Inhaber entscheidet.
2. G-29: „Maße geprüft“ auch im Sperrschließungs-Konfigurator? Das Video fehlt; nicht erfunden, nur gemeldet.
3. G-30: Beratung als Ausweg im Sperrschließungs-Konfigurator ergänzen?
4. PDF-Textebene: In `pdftotext` fehlt das „u“ (etwa „Bauform“), das Sichtbild ist korrekt. Vermutlich ToUnicode der Schrift.
5. Schließplan-Seite fehlt in der Sitemap, Beschreibung 226 Zeichen.
6. LCP-Budget auf fünf Ansichten nicht erreicht (A-032, E9-OPUS-05).
7. Werte-Vergleich eingeschränkt, E4-Basis b8e7ea7 fehlt im Repository.

=== ENDE E5-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
