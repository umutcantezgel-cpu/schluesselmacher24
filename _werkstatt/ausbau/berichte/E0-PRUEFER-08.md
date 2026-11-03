# E0-PRUEFER-08 · Vorher-Stand Leistung, Inventar, Snippets, Slop, Stil

Stand 3. November 2026. Produktionsserver http://localhost:3000, Build WOrCmISk5BVFwUFHanPQt. Jeder Wert ist der Median aus drei Läufen, die Spanne steht in Klammern.

## GEÄNDERTE DATEIEN
- Neu: `_werkstatt/ausbau/SLOP-AUDIT.md` (14 Zeilen, Spalte nachher leer) und `_werkstatt/ausbau/berichte/E0-PRUEFER-08.md`.
- Neu in `protokolle/`: `E0-vorher-lighthouse-mobil.json`, `E0-vorher-lighthouse-desktop.json`, `E0-vorher-messung.json`, `E0-vorher-inventar.json` und `.tsv`, `E0-vorher-snippet.json`, `E0-vorher-slop.json`, `E0-vorher-stil.json`, `E0-vorher-stil-quellen.json`, `E0-vorher-zusammenfassung.tsv`. Die Teilläufe liegen daneben (`-g1` bis `-g4`, `-kasse`).
- Keine Projektdatei und keine Datei in `werkzeuge/` geändert.

## WAS UND WARUM
Schritte 1 bis 6 des Pakets. Die Läufe wurden in Gruppen aufgeteilt, damit jeder Aufruf unter 600 Sekunden blieb, und danach zusammengeführt. Abweichung: Schritt 5 nennt `stil.mjs --alle`. Das Werkzeug liest aber nur `inventar-*.json` und fand ein älteres Inventar (`inventar-2026-11-02_23-23-33.json`). Deshalb habe ich `--routen` mit den 181 indexierbaren Pfaden aus dem neuen Inventar verwendet, dazu `/kasse` (noindex) für S9 von H13.

## GEMEINSAME DATEIEN
Keine Änderung an `lib.mjs` nötig. Vorschlag für `stil.mjs` (nicht in meinen Rechten, Entscheidung beim Orchestrator): bei `--alle` ein fehlendes oder älteres Inventar melden, statt still auf die 14 Hauptansichten zurückzufallen.

## PRÜFUNG UND ERGEBNIS
- Lighthouse erfüllt das Budget in 0 von 28 Fällen. Überall gilt: Barrierefreiheit 96 oder 97 (Ziel 100), mobil LCP 2864 bis 4412 ms, mobil Leistung unter 90 in 11 Ansichten, SEO 92, außer H01 (100) und H13 (54).
- messung hält das Budget in 28 von 28 Fällen: LCP mobil 484 bis 652 ms, desktop 144 bis 264 ms; CLS 0,000 bis 0,010; INP 16 bis 48 ms (Näherung); TBT mobil 138 bis 221 ms.
- Die beiden Werkzeuge weichen stark ab. Lighthouse meldet mobil ein etwa fünffach höheres LCP. Vermutlich liegt das an der simulierten Drosselung in Lighthouse; nicht geprüft.
- Inventar: 217 Adressen, 181 indexierbar, 18 noindex, 18 Antworten ohne HTML (Icons, OG-Bilder, robots.txt, sitemap.xml, llms.txt, manifest). Keine Weiterleitungen, keine Fehlerstatus, keine Titel-, Beschreibungs-, H1- oder JSON-LD-Fehler, keine Dubletten.
- Snippet (181 Seiten): Titel bis 580 px bei 28 (15,5 %), Beschreibung 120 bis 160 Zeichen bei 146 (80,7 %), beides zusammen 2. Arial fehlt, Liberation Sans misst gleich (645,5 px).
- Slop-Index (S1 bis S8, mobil / desktop): 3 bis 16, am höchsten H05 (16), H10 (14), H02 (14). Überall S1 Inter; S5 Radius 0 px in 27 von 28 Fällen; S8 Einblendung auf 12 Ansichten; S3 meist Verlauf an Eyebrow-Pseudoelementen; S2 lila Töne auf H01, H10, H11; S4 und S7 null.
- Stil S9 (182 Seiten): Gedankenstriche 2744 (1958 Halbgeviertstriche, 786 Geviertstriche), Bindestrich-Kandidaten 659, Platzhalter 51, Floskeln 0, Ausrufezeichen 0, Emoji 0. S9 gesamt 3454. Je Hauptansicht 11 bis 28, in allen 14 größer 0.
- Quelltext (Heuristik, ungeprüft): content 216 Gedankenstriche, src 228 Gedankenstriche und 211 Fragen (meist im Anfrage-Assistenten).
- Lauf-Regel: Lighthouse desktop Gruppe 2 startete bei einer 1-Minuten-Last von 2,33, stil Gruppen 1 und 3 bei 2,72 und 2,48. Das war der Nachlauf meiner vorigen Läufe, keine fremde Last. Lighthouse desktop Gruppe 2 liegt im Bereich von Gruppe 1.
- G5: keine fremden und keine schreibenden Anfragen. Auf H04, H11, H12 und H13 hat die Attrappe je Lauf eine unbekannte Server Action abgefangen; sie erreichte den Server nicht.

## BELEGE
Vollständige Werte je Ansicht: `protokolle/E0-vorher-zusammenfassung.tsv`. Lighthouse Leistung mobil / desktop, LCP mobil / desktop (Median, ms), TBT mobil und desktop (Median, Spanne, ms):

| Ansicht | Leistung m / d | LCP m / d | TBT m | TBT d |
|---|---|---|---|---|
| H01-start | 83 / 100 | 640 / 228 | 138 (138 bis 186) | 13 (8 bis 26) |
| H02-autoschluessel | 87 / 100 | 636 / 204 | 179 (175 bis 186) | 23 (8 bis 28) |
| H03-modell-golf | 90 / 100 | 620 / 184 | 161 (159 bis 166) | 12 (0 bis 13) |
| H04-autoschluessel-anfrage | 83 / 99 | 536 / 240 | 219 (200 bis 245) | 57 (27 bis 77) |
| H05-code | 90 / 100 | 636 / 264 | 185 (179 bis 206) | 66 (39 bis 95) |
| H06-code-produkt | 87 / 100 | 624 / 248 | 209 (175 bis 228) | 50 (48 bis 77) |
| H07-foto | 84 / 100 | 616 / 176 | 152 (138 bis 200) | 0 (0 bis 6) |
| H08-einschicken | 89 / 100 | 564 / 156 | 153 (140 bis 201) | 1 (0 bis 2) |
| H09-sperrschliessung-konfigurator | 88 / 100 | 608 / 196 | 207 (203 bis 229) | 51 (42 bis 60) |
| H10-schliessanlagen | 85 / 100 | 652 / 176 | 143 (41 bis 162) | 3 (0 bis 16) |
| H11-schliessanlagen-konfigurator | 86 / 100 | 504 / 220 | 221 (192 bis 268) | 45 (28 bis 72) |
| H12-partner-werden | 88 / 100 | 540 / 256 | 204 (188 bis 211) | 67 (30 bis 89) |
| H13-kasse | 93 / 100 | 484 / 156 | 220 (215 bis 224) | 5 (0 bis 11) |
| H14-ratgeber-messen | 89 / 100 | 544 / 144 | 147 (136 bis 157) | 0 (0 bis 0) |

## OFFENE FRAGEN
1. Welcher LCP-Maßstab gilt: Lighthouse (simuliert) oder messung (echte Drosselung)? Je nach Werkzeug fällt das Budget anders aus.
2. Das Paket hat zwei Abschnitte „3. Aufgabe“. Der zweite verlangt Probeläufe aller Werkzeuge. Ausgeführt habe ich die Schritte 1 bis 6.
3. Auf 49 Modellseiten steht „Termin und Aufwand folgt.“ (S9 Platzhalter). Zwei weitere Treffer sind normales Deutsch. Ich habe nichts geändert.
4. `/kasse` ist noindex, nofollow, die sechs Rechtsseiten sind noindex, follow. Ist das gewollt?
5. Welche Server Action fängt die Attrappe auf H04, H11, H12 und H13 ab?
6. Ursache für Barrierefreiheit 96 oder 97 und für SEO 54 auf `/kasse` nicht ermittelt; das Protokoll speichert keine Einzelaudits.
7. `content/code-lines.json` enthält 52 Platzhalter „[Hersteller eintragen]“. Ob sie sichtbar sind, habe ich nicht geprüft.
8. Bindestrich-Befunde sind obere Grenzen: Markennamen (Mercedes-Benz, A-Klasse) und Komposita (Cookie-Einstellungen) fallen darunter.
9. Lighthouse misst INP in diesem Modus nicht (28 von 28 leer). INP stammt nur aus messung.

=== ENDE E0-PRUEFER-08 · BEREIT ZUR RÜCKGABE ===
