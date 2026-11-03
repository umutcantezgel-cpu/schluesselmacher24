# E0-PRUEFER-08 · Vorher-Stand Leistung, Inventar, Snippets, Slop, Stil

Stand 3. November 2026, Produktionsserver, Build WOrCmISk5BVFwUFHanPQt, Mediane aus drei Läufen.

## GEÄNDERTE DATEIEN
- Neu: `_werkstatt/ausbau/SLOP-AUDIT.md`, `_werkstatt/ausbau/berichte/E0-PRUEFER-08.md`.
- Neu in `protokolle/`: `E0-vorher-*` (Lighthouse, messung, inventar, snippet, slop, stil, zusammenfassung.tsv), Teilläufe `-g1` bis `-g4`.
- Keine Projektdatei und nichts in `werkzeuge/` geändert.

## WAS UND WARUM
Schritte 1 bis 6 in Gruppen unter 600 Sekunden, danach zusammengeführt. Schritt 5 wich ab: `stil.mjs --alle` liest nur `inventar-*.json` und hätte ein älteres Inventar genommen. Ich habe `--routen` mit den 181 indexierbaren Pfaden und `/kasse` genutzt.

## GEMEINSAME DATEIEN
Keine Änderung an `lib.mjs`. Vorschlag: `stil.mjs --alle` soll ein fehlendes oder älteres Inventar melden.

## PRÜFUNG UND ERGEBNIS
- Lighthouse erfüllt das Budget in 0 von 28 Fällen: Barrierefreiheit 96 oder 97, SEO 92 (H01 100, H13 54), mobil LCP 2864 bis 4412 ms, mobil Leistung 83 bis 93.
- messung erfüllt es in 28 von 28 Fällen: mobil LCP 484 bis 652 ms, CLS höchstens 0,010, INP 16 bis 48 ms.
- Beim LCP weichen die Werkzeuge stark ab: Lighthouse liegt mobil um den Faktor 4,6 bis 8,2 höher. Vermutlich simulierte Drosselung, nicht geprüft.
- Inventar: 217 Adressen, 181 indexierbar, 18 noindex, 18 ohne HTML. Keine Fehler und keine Dubletten.
- Snippet: Titel bis 580 px bei 15,5 %, Beschreibung 120 bis 160 Zeichen bei 80,7 %, beides bei 2 Seiten.
- Slop-Index 3 bis 16, am höchsten H05 (16). S1 und S5 fast überall, S4 und S7 null.
- Stil S9 (182 Seiten): 2744 Gedankenstriche, 659 Bindestrich-Kandidaten, 51 Platzhalter. Floskeln, Ausrufe und Emoji je 0. Je Hauptansicht 11 bis 28.
- G5 eingehalten. Auf H04, H11, H12, H13 je Lauf eine unbekannte Server Action abgefangen, nicht zum Server gesendet.
- Lauf-Regel: Läufe begannen teils bei Last 2,3 bis 2,7 (Nachlauf eigener Läufe).

## BELEGE
Mediane je Ansicht, TBT mit Spanne in ms. Alle Werte: `protokolle/E0-vorher-zusammenfassung.tsv`. Kennungen zu Pfaden: `SLOP-AUDIT.md`.

| Ansicht | LCP m / d | TBT m | TBT d |
|---|---|---|---|
| H01 | 640 / 228 | 138 (138 bis 186) | 13 (8 bis 26) |
| H02 | 636 / 204 | 179 (175 bis 186) | 23 (8 bis 28) |
| H03 | 620 / 184 | 161 (159 bis 166) | 12 (0 bis 13) |
| H04 | 536 / 240 | 219 (200 bis 245) | 57 (27 bis 77) |
| H05 | 636 / 264 | 185 (179 bis 206) | 66 (39 bis 95) |
| H06 | 624 / 248 | 209 (175 bis 228) | 50 (48 bis 77) |
| H07 | 616 / 176 | 152 (138 bis 200) | 0 (0 bis 6) |
| H08 | 564 / 156 | 153 (140 bis 201) | 1 (0 bis 2) |
| H09 | 608 / 196 | 207 (203 bis 229) | 51 (42 bis 60) |
| H10 | 652 / 176 | 143 (41 bis 162) | 3 (0 bis 16) |
| H11 | 504 / 220 | 221 (192 bis 268) | 45 (28 bis 72) |
| H12 | 540 / 256 | 204 (188 bis 211) | 67 (30 bis 89) |
| H13 | 484 / 156 | 220 (215 bis 224) | 5 (0 bis 11) |
| H14 | 544 / 144 | 147 (136 bis 157) | 0 (0 bis 0) |

## OFFENE FRAGEN
1. Welcher LCP-Maßstab gilt, Lighthouse oder messung?
2. Zwei Abschnitte „3. Aufgabe“. Den zweiten (Probeläufe aller Werkzeuge) habe ich nicht ausgeführt.
3. Auf 49 Modellseiten steht ein Platzhaltersatz zu Termin und Aufwand (S9). Nichts geändert.
4. `/kasse` ist noindex, nofollow, sechs Rechtsseiten sind noindex, follow. Gewollt?
5. Welche Server Action fängt die Attrappe auf H04, H11, H12, H13 ab?
6. Ursache für A11y 96 oder 97 und SEO 54 auf `/kasse` nicht ermittelt.
7. `content/code-lines.json`: 52 Platzhalter „[Hersteller eintragen]“, Sichtbarkeit ungeprüft.

=== ENDE E0-PRUEFER-08 · BEREIT ZUR RÜCKGABE ===
