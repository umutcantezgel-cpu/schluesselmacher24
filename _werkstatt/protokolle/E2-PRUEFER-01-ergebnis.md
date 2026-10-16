# E2-PRUEFER-01 · Ergebnis nach Prüfstufe A und B (Schritt 12)

Basis: Protokolle `_werkstatt/protokolle/E2-PRUEFER-01-*` (Schritte 1 bis 11) und die darin genannten JSON-Protokolle. Keine neue Messung, kein Build, keine Typprüfung und kein Linter in diesem Schritt. Vergleichswerte: `E0-PRUEFER-05-ausgangswerte.md` (Prüfungen, Tabelle A Leistung, Tabelle B Zugänglichkeit und Konsole), `a11y-2026-10-15_23-33-13.json` (axe je Ansicht und Gerät), `funktionsliste-2026-10-15_23-58-16.md` (14/14). Pfade ohne Angabe liegen unter `/home/user/schluesselmacher24/_werkstatt/protokolle/`.

Hinweis: Der Workflow wurde durch einen Container-Neustart unterbrochen; die Teilprüfungen lagen vollständig vor. Die Werte sind nur gegenübergestellt, nicht gedeutet.

**Maßstab der Bewertung je Ansicht**
- Leistung LCP, INP, JS-KB: E2-Median gegen die E0-Spanne (Min bis Max). Innerhalb der Spanne: „innerhalb der E0-Spanne“. Unter dem E0-Min: „besser“. Über dem E0-Max: „schlechter“. Liefert E0 nur einen Wert, sind Min und Max gleich.
- CLS (E0 nur Median): gleich ergibt „innerhalb der E0-Spanne“, kleiner „besser“, größer „schlechter“.
- Zählwerte (axe, Konsole, Überlauf): E0 liefert je Ansicht einen Wert. Gleich ergibt „innerhalb“, weniger „besser“, mehr „schlechter“.
- Textelemente der reduzierten Bewegung sind eine Abdeckungszahl und werden nicht bewertet.

## Kurzfassung: schlechter als E0 zuerst

1. JS-Menge mobil: in 12 von 12 Ansichten über dem E0-Max (Tabelle A4).
2. Konsole Desktop: 22 fehlgeschlagene Anfragen gegenüber 14 in E0; in 7 Ansichten schlechter (Tabelle C).
3. Bildsatz, Befunde „über den rechten Rand“: 67 gegenüber 29 in E0; in 8 Ansichten schlechter, davon H08 mobil 33 gegenüber 27 (Tabelle D).
4. INP mobil: 4 Ansichten über dem E0-Max (H02, H03, H04, H10) (Tabelle A3).
5. LCP Desktop H10: 124 ms gegenüber E0-Spanne 108 bis 120 ms (Tabelle A5).
6. Verfahren: `.next/BUILD_ID` hat sich während des Laufs geändert; der Build steht im Protokoll (siehe Hinweise, Punkt 1).

Besser als E0: axe 30 auf 6 Verstöße und 56 auf 8 Stellen (Regel target-size entfällt in E2, siehe offene Fragen); LCP mobil in 7 Ansichten besser; LCP Desktop in 8 Ansichten besser; CLS in H10 und H11 besser (mobil und Desktop); Konsole in H05 und H10 besser.

## Tabelle 1 · Prüfung · E0 · jetzt · Differenz · Beleg

| Prüfung | E0 | jetzt | Differenz | Beleg |
|---|---|---|---|---|
| Typprüfung `tsc --noEmit` | 0 Fehler | 0 Fehler (Protokoll 0 Byte; Exitcode nicht protokolliert) | gleich | `E2-PRUEFER-01-typecheck.log` |
| Linter `eslint .` | 0 Fehler, 0 Warnungen | 0 Fehler, 0 Warnungen (Protokoll 0 Byte) | gleich | `E2-PRUEFER-01-lint.log` |
| Build (Verfahrensvermerk, nicht Schritt 1 bis 11) | 198/198 Seiten; `.next/BUILD_ID` m-Nz5gJdEPI0m_fmJdMHt | 198/198 Seiten; `.next/BUILD_ID` jC9qdfvEhgdhFpmNWKmBM, Änderung 2026-10-15 23:18:54 UTC | Kennung geändert | `E2-PRUEFER-01-build.log`, `/home/user/schluesselmacher24/.next/BUILD_ID` |
| Unit `vitest run`: Dateien | 31/31 | 44/44 | +13 | `E2-PRUEFER-01-test-unit.log` |
| Unit: Tests | 680/680 | 983/983 | +303; 0 fehlgeschlagen | `E2-PRUEFER-01-test-unit.log` |
| DB-Tests (Wrapper, Nutzer `ubuntu` laut Auftrag): Dateien | 7/7 | 7/7 | gleich | `E2-PRUEFER-01-test-db.log` |
| DB-Tests: Tests | 52/52 | 52/52 (Nutzer im Protokoll nicht vermerkt) | gleich | `E2-PRUEFER-01-test-db.log` |
| Logikwächter (E0 ohne Wert) | kein E0-Wert | 15 Dateien, 0 abweichend | nicht vergleichbar | `E2-PRUEFER-01-logik.log` |
| Textabzug Rechtsseiten (E0 ohne Wert) | kein E0-Wert | 6 Seiten gleich, 0 abweichend | nicht vergleichbar | `E2-PRUEFER-01-textabzug.log` |
| Konsole Desktop, 12 Ansichten: Konsolenfehler, Warnungen, Seitenfehler | 0 / 0 / 0 | 0 / 0 / 0 | gleich | `konsole-2026-10-16_01-20-01.json` |
| Konsole Desktop: fehlgeschlagene Anfragen | 14 in 8 Ansichten | 22 in 12 Ansichten | +8 (schlechter) | `konsole-2026-10-16_01-20-01.json`, `E0-PRUEFER-05-ausgangswerte.md` Tabelle B |
| Bildsatz: Seitenüberlauf (36 Ansichten-Geräte) | nein in allen | nein in allen | gleich | `bildsatz-2026-10-16_01-23-32.json` |
| Bildsatz: Befunde „über den rechten Rand“ | 29 (H08 mobil 27, H09 mobil 1, H09 Tablet 1) | 67 | +38 (schlechter) | `bildsatz-2026-10-16_01-23-32.json`, `E0-PRUEFER-05-bildsatz.log` |
| Bildsatz: Bilder | 251 JPEG, 12 MB (`_werkstatt/bilder/e0`) | 254 JPEG in `/root/sm24-bilder/E2-bildsatz` (außerhalb des Repos), 25 Referenzbilder in `_werkstatt/bilder/referenz`; Gesamtgröße nicht protokolliert | +3 Bilder | `E2-PRUEFER-01-bildsatz.log`, `E2-PRUEFER-01-bildsatz-referenz.log` |
| axe: Verstöße gesamt (mobil und Desktop) | 30 (26 ernst, 4 kritisch) | 6 (2 ernst, 4 kritisch) | -24 (ernst -24, kritisch 0) | `a11y-2026-10-16_01-26-59.json`, `a11y-2026-10-15_23-33-13.json` |
| axe: Stellen gesamt | 56 | 8 | -48 | wie oben |
| axe: Regel target-size | 24 Auswertungen, 48 Stellen | 0 Auswertungen | -24 Auswertungen | wie oben (offene Frage 2) |
| Leistung: Ansichten über Budget am Median | 2 (H10 mobil LCP und CLS, H11 mobil CLS) | 0 (H10 mobil CLS 0,100 liegt genau auf dem Grenzwert) | besser | `messung-2026-10-16_01-42-57.json`, `E2-PRUEFER-01-messung.log` |
| Bewegung reduziert: laufende Animationen, Befunde, verborgene Inhalte | 0 / 0 / 0 | 0 / 0 / 0 | gleich | `bewegung-reduziert-2026-10-16_01-24-49.json` |
| Bewegung reduziert: Textelemente geprüft | 2.058 | 2.001 | -57 (Abdeckungszahl) | `bewegung-reduziert-2026-10-15_23-41-24.json`, `bewegung-reduziert-2026-10-16_01-24-49.json` |
| Bewegung Bildrate Fräsbahn (Feld `geraet` mobil) | kein E0-Wert | 97 gezeichnet, 0 verworfen, 0,0 % (Schwelle 5 %) | nicht vergleichbar, innerhalb der Schwelle | `bewegung-bildrate-2026-10-16_01-25-23.json` |
| Bewegung Einzelbilder (4 Läufe, je 5 Bilder) | kein E0-Wert | größte Abweichung soll/ist 2 (Desktop, `[data-fraesbahn]`, Bild 1: 352 gegen 350) | nicht vergleichbar | `bewegung-einzelbilder-2026-10-16_01-24-54.json`, `-01-25-02.json`, `-01-25-09.json`, `-01-25-16.json` |
| Funktionsliste F-01 bis F-14 | 14/14 (E0-Lauf gegen Port 3100) | 14/14 (Port 3000) | 0 | `funktionsliste-2026-10-16_01-46-26.md`, `funktionsliste-2026-10-15_23-58-16.md` |
| Freie Werte wie Schritt 11 (E0: 196 Dateien seit Quellstand b49fe04; jetzt: 91 Dateien seit fcbcfb2) | 707 ohne Ausnahmen, 10 Ausnahmen | 1 ohne Ausnahme, 8 Ausnahmen | nicht vergleichbar (anderer Umfang) | `E2-PRUEFER-01-werte.json`, `E0-PRUEFER-05-ausgangswerte.md` |

## Tabelle A1 · Leistung mobil · LCP in ms (Median; Spanne in Klammern; 3 Läufe)

Belege: jetzt `/home/user/schluesselmacher24/_werkstatt/protokolle/messung-2026-10-16_01-42-57.json` (Log `E2-PRUEFER-01-messung.log`); E0 `E0-PRUEFER-05-ausgangswerte.md` Tabelle A.

| Ansicht | E0-Median | E0-Spanne | jetzt Median | jetzt Spanne | Bewertung |
|---|---|---|---|---|---|
| H01-start | 996 | 996–1028 | 1024 | 932–1040 | innerhalb der E0-Spanne |
| H02-autoschluessel | 960 | 956–992 | 940 | 940–964 | besser |
| H03-modell-golf | 976 | 956–1040 | 948 | 936–960 | besser |
| H04-assistent | 904 | 888–1012 | 892 | 888–900 | innerhalb der E0-Spanne |
| H05-code-shop | 1084 | 1080–1112 | 1056 | 1052–1068 | besser |
| H06-code-produkt | 964 | 956–976 | 976 | 952–992 | innerhalb der E0-Spanne |
| H07-zylinder-konfigurator | 1012 | 972–1028 | 968 | 968–976 | besser |
| H08-schliessanlagen | 976 | 940–984 | 960 | 960–964 | innerhalb der E0-Spanne |
| H09-tuertechnik | 1020 | 996–1024 | 948 | 944–952 | besser |
| H10-warenkorb | 2508 | 2480–2596 | 896 | 892–904 | besser |
| H11-kasse | 920 | 916–924 | 888 | 876–896 | besser |
| H12-ratgeber | 936 | 916–944 | 940 | 916–940 | innerhalb der E0-Spanne |

## Tabelle A2 · Leistung mobil · CLS (Median; E0 nur Median)

Belege: wie Tabelle A1.

| Ansicht | E0-Median | E0-Spanne | jetzt Median | jetzt Spanne | Bewertung |
|---|---|---|---|---|---|
| H01-start | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H02-autoschluessel | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H03-modell-golf | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H04-assistent | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H05-code-shop | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H06-code-produkt | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H07-zylinder-konfigurator | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H08-schliessanlagen | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H09-tuertechnik | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H10-warenkorb | 0,117 | nur Median | 0,100 | 0,100–0,100 | besser |
| H11-kasse | 0,104 | nur Median | 0,088 | 0,088–0,088 | besser |
| H12-ratgeber | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |

## Tabelle A3 · Leistung mobil · INP in ms (Median; Spanne in Klammern)

Belege: wie Tabelle A1.

| Ansicht | E0-Median | E0-Spanne | jetzt Median | jetzt Spanne | Bewertung |
|---|---|---|---|---|---|
| H01-start | 56 | 56–88 | 80 | 56–80 | innerhalb der E0-Spanne |
| H02-autoschluessel | 56 | 48–56 | 64 | 56–72 | schlechter |
| H03-modell-golf | 48 | 40–56 | 64 | 56–72 | schlechter |
| H04-assistent | 56 | 48–64 | 72 | 64–72 | schlechter |
| H05-code-shop | 56 | 56–64 | 64 | 56–72 | innerhalb der E0-Spanne |
| H06-code-produkt | 64 | 56–80 | 64 | 64–72 | innerhalb der E0-Spanne |
| H07-zylinder-konfigurator | 72 | 64–72 | 64 | 64–72 | innerhalb der E0-Spanne |
| H08-schliessanlagen | 64 | 64–72 | 56 | 56–64 | besser |
| H09-tuertechnik | 48 | 40–64 | 64 | 56–64 | innerhalb der E0-Spanne |
| H10-warenkorb | 56 | 56–56 | 64 | 56–64 | schlechter |
| H11-kasse | 64 | 56–72 | 72 | 56–72 | innerhalb der E0-Spanne |
| H12-ratgeber | 56 | 56–64 | 64 | 56–64 | innerhalb der E0-Spanne |

## Tabelle A4 · Leistung mobil · JS-KB (Gesamtmenge Skript-Ressourcen in KB; Median; Spanne in Klammern)

Belege: wie Tabelle A1. E0 liefert je Ansicht nur einen Wert; die E0-Spanne ist dieser Wert.

| Ansicht | E0-Median | E0-Spanne | jetzt Median | jetzt Spanne | Bewertung |
|---|---|---|---|---|---|
| H01-start | 246,3 | 246,3–246,3 | 293,0 | 274,4–293,0 | schlechter |
| H02-autoschluessel | 219,1 | 219,1–219,1 | 229,6 | 229,6–229,6 | schlechter |
| H03-modell-golf | 219,1 | 219,1–219,1 | 229,6 | 229,6–229,6 | schlechter |
| H04-assistent | 227,0 | 227,0–227,0 | 243,7 | 236,0–243,7 | schlechter |
| H05-code-shop | 234,9 | 234,9–234,9 | 258,1 | 258,1–258,1 | schlechter |
| H06-code-produkt | 234,9 | 234,9–234,9 | 251,9 | 251,9–251,9 | schlechter |
| H07-zylinder-konfigurator | 210,0 | 210,0–210,0 | 230,1 | 230,1–230,1 | schlechter |
| H08-schliessanlagen | 248,5 | 248,5–248,5 | 268,3 | 268,3–268,3 | schlechter |
| H09-tuertechnik | 222,2 | 222,2–222,2 | 240,7 | 240,7–240,7 | schlechter |
| H10-warenkorb | 231,0 | 231,0–231,0 | 254,8 | 254,8–254,8 | schlechter |
| H11-kasse | 217,0 | 217,0–217,0 | 235,4 | 235,4–235,4 | schlechter |
| H12-ratgeber | 212,6 | 212,6–212,6 | 237,9 | 237,9–237,9 | schlechter |

## Tabelle A5 · Leistung Desktop · LCP in ms (Median; Spanne in Klammern)

Belege: jetzt `messung-2026-10-16_01-42-57.json` (Log `E2-PRUEFER-01-messung.log`); E0 `E0-PRUEFER-05-ausgangswerte.md` Tabelle A. Für Desktop-INP und Desktop-JS-KB gibt es in E0 keinen Wert; sie sind im Messprotokoll enthalten, aber hier nicht bewertet.

| Ansicht | E0-Median | E0-Spanne | jetzt Median | jetzt Spanne | Bewertung |
|---|---|---|---|---|---|
| H01-start | 164 | 124–168 | 148 | 104–152 | innerhalb der E0-Spanne |
| H02-autoschluessel | 172 | 156–192 | 116 | 108–124 | besser |
| H03-modell-golf | 188 | 152–208 | 104 | 92–104 | besser |
| H04-assistent | 144 | 136–168 | 124 | 120–128 | besser |
| H05-code-shop | 144 | 140–176 | 148 | 124–160 | innerhalb der E0-Spanne |
| H06-code-produkt | 136 | 124–160 | 148 | 108–156 | innerhalb der E0-Spanne |
| H07-zylinder-konfigurator | 160 | 152–192 | 132 | 108–156 | besser |
| H08-schliessanlagen | 140 | 140–144 | 116 | 108–132 | besser |
| H09-tuertechnik | 156 | 152–172 | 132 | 104–144 | besser |
| H10-warenkorb | 116 | 108–120 | 124 | 84–132 | schlechter |
| H11-kasse | 116 | 112–120 | 88 | 84–88 | besser |
| H12-ratgeber | 116 | 108–128 | 92 | 88–132 | besser |

## Tabelle A6 · Leistung Desktop · CLS (Median; E0 nur Median)

Belege: wie Tabelle A5.

| Ansicht | E0-Median | E0-Spanne | jetzt Median | jetzt Spanne | Bewertung |
|---|---|---|---|---|---|
| H01-start | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H02-autoschluessel | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H03-modell-golf | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H04-assistent | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H05-code-shop | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H06-code-produkt | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H07-zylinder-konfigurator | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H08-schliessanlagen | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H09-tuertechnik | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |
| H10-warenkorb | 0,038 | nur Median | 0,029 | 0,029–0,029 | besser |
| H11-kasse | 0,031 | nur Median | 0,024 | 0,024–0,024 | besser |
| H12-ratgeber | 0,000 | nur Median | 0,000 | 0,000–0,000 | innerhalb der E0-Spanne |

## Tabelle B · Zugänglichkeit axe (WCAG 2.2 AA; Verstöße gesamt in Klammern ernst/kritisch; Stellen)

Belege: jetzt `/home/user/schluesselmacher24/_werkstatt/protokolle/a11y-2026-10-16_01-26-59.json` (Log `E2-PRUEFER-01-a11y.log`); E0 `/home/user/schluesselmacher24/_werkstatt/protokolle/a11y-2026-10-15_23-33-13.json` (entspricht `E0-PRUEFER-05-ausgangswerte.md` Tabelle B). Ernst entspricht „serious“, kritisch „critical“; moderate und gering sind in beiden Läufen 0.

| Ansicht | E0 mobil | jetzt mobil | Bewertung mobil | E0 Desktop | jetzt Desktop | Bewertung Desktop |
|---|---|---|---|---|---|---|
| H01-start | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H02-autoschluessel | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H03-modell-golf | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H04-assistent | 2 (1/1) · 3 St. | 1 (0/1) · 1 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H05-code-shop | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H06-code-produkt | 2 (1/1) · 4 St. | 1 (0/1) · 2 St. | besser | 2 (1/1) · 4 St. | 1 (0/1) · 2 St. | besser |
| H07-zylinder-konfigurator | 2 (1/1) · 3 St. | 1 (0/1) · 1 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H08-schliessanlagen | 2 (2/0) · 3 St. | 1 (1/0) · 1 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H09-tuertechnik | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 2 (2/0) · 3 St. | 1 (1/0) · 1 St. | besser |
| H10-warenkorb | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H11-kasse | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| H12-ratgeber | 1 (1/0) · 2 St. | 0 · 0 St. | besser | 1 (1/0) · 2 St. | 0 · 0 St. | besser |
| **Summe** | **16 (13/3)** · **29 St.** | **4 (1/3)** · **5 St.** | | **14 (13/1)** · **27 St.** | **2 (1/1)** · **3 St.** | |

Summe gesamt: E0 30 Verstöße (26 ernst, 4 kritisch), 56 Stellen; jetzt 6 Verstöße (2 ernst, 4 kritisch), 8 Stellen. Die Summenzeile zählt die Verstöße je Gerät. Kritisch sind in beiden Läufen 4 Verstöße, nämlich H04 mobil, H06 mobil, H06 Desktop und H07 mobil.

**Liste der jetzt festgestellten axe-Befunde** (aus `E2-PRUEFER-01-a11y.log`):
- H04-assistent mobil, button-name (kritisch): `.hover\:border-foreground-subtle`
- H06-code-produkt mobil und Desktop, label (kritisch): `#foto-ms-01-camera`, `#foto-ms-01-gallery`
- H07-zylinder-konfigurator mobil, button-name (kritisch): `.mx-auto > .hover\:border-foreground-subtle.select-none.transition`
- H08-schliessanlagen mobil, scrollable-region-focusable (ernst): `.table-scroll`
- H09-tuertechnik Desktop, color-contrast (ernst): `.text-3xl`

Die E0-Regelliste hatte zusätzlich `target-size` (ernst, 24 Auswertungen, 48 Stellen), in allen 12 Ansichten und auf beiden Geräten. Die E2-Protokolle enthalten diese Regel nicht.

## Tabelle C · Konsole Desktop · fehlgeschlagene Anfragen je Ansicht

Belege: jetzt `/home/user/schluesselmacher24/_werkstatt/protokolle/konsole-2026-10-16_01-20-01.json` (Log `E2-PRUEFER-01-konsole.log`); E0 `/home/user/schluesselmacher24/_werkstatt/protokolle/konsole-2026-10-15_23-28-37.json` (entspricht `E0-PRUEFER-05-ausgangswerte.md` Tabelle B, Spalte „Netzfehler (Desktop)“). Konsolenfehler, Warnungen, Seitenfehler und Attrappen-Abbrüche sind in beiden Läufen 0.

| Ansicht | E0 | jetzt | Bewertung |
|---|---|---|---|
| H01-start | 0 | 2 | schlechter |
| H02-autoschluessel | 0 | 1 | schlechter |
| H03-modell-golf | 2 | 2 | innerhalb der E0-Spanne |
| H04-assistent | 1 | 1 | innerhalb der E0-Spanne |
| H05-code-shop | 2 | 1 | besser |
| H06-code-produkt | 2 | 2 | innerhalb der E0-Spanne |
| H07-zylinder-konfigurator | 0 | 2 | schlechter |
| H08-schliessanlagen | 1 | 2 | schlechter |
| H09-tuertechnik | 3 | 4 | schlechter |
| H10-warenkorb | 2 | 1 | besser |
| H11-kasse | 1 | 2 | schlechter |
| H12-ratgeber | 0 | 2 | schlechter |
| **Summe** | **14** | **22** | schlechter |

Alle 22 Meldungen sind `net::ERR_ABORTED`; sie betreffen `/autoschluessel/anfrage?_rsc=…`, in H09 zusätzlich `/service-und-termin/anfrage?…`.

## Tabelle D · Bildsatz · Befunde „über den rechten Rand“ je Ansicht (mobil / Tablet / Desktop)

Belege: jetzt `/home/user/schluesselmacher24/_werkstatt/protokolle/bildsatz-2026-10-16_01-23-32.json` (Log `E2-PRUEFER-01-bildsatz.log`); E0 `/home/user/schluesselmacher24/_werkstatt/protokolle/E0-PRUEFER-05-bildsatz.log` (Befunde „–“ = 0; entspricht `E0-PRUEFER-05-ausgangswerte.md` Tabelle B). Seitenüberlauf ist in allen Ansichten und Geräten „nein“, E0 wie jetzt. Bewertung nach der Summe je Ansicht.

| Ansicht | E0 | jetzt | Bewertung |
|---|---|---|---|
| H01-start | 0 / 0 / 0 | 4 / 3 / 2 | schlechter |
| H02-autoschluessel | 0 / 0 / 0 | 1 / 1 / 1 | schlechter |
| H03-modell-golf | 0 / 0 / 0 | 1 / 1 / 1 | schlechter |
| H04-assistent | 0 / 0 / 0 | 0 / 0 / 0 | innerhalb der E0-Spanne |
| H05-code-shop | 0 / 0 / 0 | 0 / 0 / 0 | innerhalb der E0-Spanne |
| H06-code-produkt | 0 / 0 / 0 | 1 / 0 / 0 | schlechter |
| H07-zylinder-konfigurator | 0 / 0 / 0 | 1 / 1 / 0 | schlechter |
| H08-schliessanlagen | 27 / 0 / 0 | 33 / 6 / 3 | schlechter |
| H09-tuertechnik | 1 / 1 / 0 | 2 / 2 / 1 | schlechter |
| H10-warenkorb | 0 / 0 / 0 | 0 / 0 / 0 | innerhalb der E0-Spanne |
| H11-kasse | 0 / 0 / 0 | 0 / 0 / 0 | innerhalb der E0-Spanne |
| H12-ratgeber | 0 / 0 / 0 | 1 / 1 / 0 | schlechter |
| **Summe** | **29** | **67** | schlechter |

Ausschnitte je Ansicht (E0 gegen jetzt): H01 mobil 10 gegen 11, Tablet 6 gegen 7, Desktop 5 gegen 7; H02 Tablet 8 gegen 7, Desktop 6 gegen 7; H03 Tablet 6 gegen 5; H04 Tablet 4 gegen 3, Desktop 3 gegen 4; H09 mobil 15 von 16 gegen 15 von 17 (jeweils gekappt). Alle übrigen Ansichten gleiche Anzahl. Belege: `bildsatz-2026-10-15_23-31-46.json` und `bildsatz-2026-10-16_01-23-32.json`.

Referenzansicht Startseite (Schritt 6, `bildsatz-2026-10-16_01-20-22.json`): mobil 11 von 11 Ausschnitte, 4 Befunde; Tablet 7 von 7, 3 Befunde; Desktop 7 von 7, 2 Befunde; Seitenüberlauf nein.

## Tabelle E · Bewegung reduziert je Ansicht (laufend / Befunde / verborgen / Textelemente)

Belege: jetzt `/home/user/schluesselmacher24/_werkstatt/protokolle/bewegung-reduziert-2026-10-16_01-24-49.json`; E0 `/home/user/schluesselmacher24/_werkstatt/protokolle/bewegung-reduziert-2026-10-15_23-41-24.json` (je Ansicht; die Summen stehen in `E0-PRUEFER-05-ausgangswerte.md`). Laufende Animationen, Befunde und verborgene Inhalte sind in allen Ansichten 0. Bewertung: Befunde gleich = innerhalb; Textelemente nur Abdeckung, nicht bewertet.

| Ansicht | laufend E0 / jetzt | Befunde E0 / jetzt | verborgen E0 / jetzt | Textelemente E0 / jetzt | Bewertung |
|---|---|---|---|---|---|
| H01-start | 0 / 0 | 0 / 0 | 0 / 0 | 155 / 201 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H02-autoschluessel | 0 / 0 | 0 / 0 | 0 / 0 | 175 / 168 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H03-modell-golf | 0 / 0 | 0 / 0 | 0 / 0 | 123 / 116 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H04-assistent | 0 / 0 | 0 / 0 | 0 / 0 | 124 / 120 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H05-code-shop | 0 / 0 | 0 / 0 | 0 / 0 | 608 / 552 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H06-code-produkt | 0 / 0 | 0 / 0 | 0 / 0 | 137 / 126 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H07-zylinder-konfigurator | 0 / 0 | 0 / 0 | 0 / 0 | 126 / 124 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H08-schliessanlagen | 0 / 0 | 0 / 0 | 0 / 0 | 211 / 216 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H09-tuertechnik | 0 / 0 | 0 / 0 | 0 / 0 | 177 / 170 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H10-warenkorb | 0 / 0 | 0 / 0 | 0 / 0 | 71 / 67 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H11-kasse | 0 / 0 | 0 / 0 | 0 / 0 | 71 / 67 | innerhalb (Befunde); Abdeckung nicht bewertet |
| H12-ratgeber | 0 / 0 | 0 / 0 | 0 / 0 | 80 / 74 | innerhalb (Befunde); Abdeckung nicht bewertet |
| **Summe** | **0 / 0** | **0 / 0** | **0 / 0** | **2.058 / 2.001** | |

Bildrate und Einzelbilder der Fräsbahn sind in Tabelle 1 aufgeführt. Der E0-Stand hatte dazu keinen Wert.

## Liste aller Funde der Wertesuche (Schritt 11, `--seit fcbcfb2`)

Beleg: `/home/user/schluesselmacher24/_werkstatt/protokolle/E2-PRUEFER-01-werte.json` (Log `E2-PRUEFER-01-werte.log`). Geprüft: 91 Dateien. Summe ohne Ausnahmen: 1. Ausnahmen: 8.

| Datei | Zeile | Kategorie | Fund | Ausnahme |
|---|---|---|---|---|
| `src/app/(site)/layout.tsx` | 63 | Hex-Farbe | `#f7f9fb` | nein |
| `src/components/visual/generators/profilschnitt.test.tsx` | 20, 21 | Farbfunktion | `rgb(`, `oklch(` | ja (Bildinhalt) |
| `src/components/visual/generators/schliessplan.test.tsx` | 23, 24 | Farbfunktion | `rgb(`, `oklch(` | ja (Bildinhalt) |
| `src/components/visual/generators/stiftzuhaltung.test.tsx` | 20, 21 | Farbfunktion | `rgb(`, `oklch(` | ja (Bildinhalt) |
| `src/components/visual/generators/tuer-schutz.test.tsx` | 23, 24 | Farbfunktion | `rgb(`, `oklch(` | ja (Bildinhalt) |

Nicht in dieser Liste: fünf spätere Einzeldateiläufe `werte-suche-2026-10-16_05-17-37.json`, `-05-21-54.json`, `-05-23-53.json`, `-05-26-59.json`, `-05-29-05.json` (alle `/home/user/schluesselmacher24/_werkstatt/protokolle/`, Zeitstempel 03:17 bis 03:29 UTC, also nach dem Prüflauf). Sie betreffen `src/components/flow/flow-shell.tsx` (Zeile 150, dann 153, `style` mit `calc(1rem + …)`), `src/components/layout/summary-list.tsx` (ohne Fund) und `src/components/forms/photo-upload.tsx` (Zeile 102, `#fff`). Sie gehören nicht zu Schritt 11 und sind nicht gewertet.

## Gemeinsame Stände im Repo

- Prüfstand laut Auftrag: Commit `f1f0bf9` (Build auf Port 3000). Dieser Commit ist Vorfahr von HEAD.
- Stand bei Erstellung dieses Protokolls: HEAD `1b4447c` (2026-10-16 03:28:51 UTC, „Welle E3-A im Bau … ZWISCHENSTAND“). Der Stand hat sich nach dem Prüflauf verändert.
- Arbeitsbaum: `git status --short` zeigt nur `_werkstatt/protokolle/werte-suche-2026-10-16_05-29-05.json` (nicht von diesem Prüfer; siehe oben). Von diesem Schritt entstand nur `_werkstatt/protokolle/E2-PRUEFER-01-ergebnis.md`.
- Vergleichsstände E0: `b49fe04` (Quellstand für die freien Werte), `fcbcfb2` (Start des Gestaltungslaufs). Beide sind im Clone vorhanden.

## Hinweise zum Verfahren und offene Fragen

1. **Build während des Laufs.** `E2-PRUEFER-01-build.log` (Ende 23:18:57 UTC) zeigt einen Produktionsbuild („Creating an optimized production build“, 198/198 Seiten). `.next/BUILD_ID` trägt jetzt `jC9qdfvEhgdhFpmNWKmBM` mit Änderungsdatum 23:18:54 UTC. Die E0-Basis war `m-Nz5gJdEPI0m_fmJdMHt`. Der Auftrag verbietet einen Neubau (Grenzen: „nicht neu bauen“). Die Messungen und Prüfungen ab 23:20 UTC liefen danach. Wer den Build ausgelöst hat und welche Build-Kennung die Läufe jeweils bedienten, ist aus den Protokollen nicht belegt. Die E2-Protokolle halten die Kennung nicht fest.
2. **target-size.** Die E0-Protokolle weisen target-size in 24 Auswertungen aus (48 Stellen). Die E2-Protokolle enthalten die Regel nicht. Die Tags sind gleich (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`). Die Werkzeugversion ist im E2-JSON nicht vermerkt. Ob die Regel durch den Stand, das Werkzeug oder die Seite entfiel, ist aus den Protokollen nicht ablesbar.
3. **Bildrate.** Das Protokoll `bewegung-bildrate-2026-10-16_01-25-23.json` nennt keine Drosselungsstufe. Der Auftrag nennt 4-fache Drosselung.
4. **DB-Tests.** `E2-PRUEFER-01-test-db.log` vermerkt den Nutzer nicht. Der Auftrag nennt `ubuntu`.
5. **Typprüfung und Linter.** Die Protokolle sind leer (0 Byte). Exitcodes sind nicht protokolliert.
6. **Einzelbilder.** Die vier Einzelbild-Protokolle (`bewegung-einzelbilder-2026-10-16_01-24-54.json`, `-01-25-02.json`, `-01-25-09.json`, `-01-25-16.json`) nennt kein E2-Log. Sie sind hier nur als Belege aufgeführt. Jeder Lauf enthält 5 Bilder. Die größte Abweichung soll/ist ist 2 (Feld in ms).
7. **Sperrdatei.** `/tmp/sm24-messfenster.lock` existiert zum Zeitpunkt dieses Protokolls nicht. Anlage und Löschung sind nicht protokolliert.
8. **Funktionsliste.** Der E0-Lauf lief gegen Port 3100 (E0-Vergleichsserver), der E2-Lauf gegen Port 3000.
9. **Bildsatz-Größe.** Die Gesamtgröße des E2-Bildsatzes ist nicht protokolliert (E0: 12 MB).
10. **Freie Werte.** E0 (196 Dateien, Quellstand `b49fe04`) und jetzt (91 Dateien seit `fcbcfb2`) sind nicht vergleichbar. Die Zahlen stehen nur nebeneinander.
