# E0-PRUEFER-07 · Vorher-Stand Prüfstufe B, Teil 1

Stand 2. November 2026. Produktionsserver Port 3000, Werkzeuge direkt mit node.

## GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/_werkstatt/ausbau/bilder/vorher/: 24 JPEG (5 Kontaktbögen, 19 Einzelbilder)
- /home/user/schluesselmacher24/_werkstatt/ausbau/bilder/arbeit/vorher/: 494 JPEG aus dem Bildsatz (durch .gitignore ausgeschlossen)
- /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E0-vorher-*.json und *.log: neun Protokolle
- /home/user/schluesselmacher24/_werkstatt/ausbau/berichte/E0-PRUEFER-07.md

Keine Projektdatei und kein Werkzeug geändert.

## WAS UND WARUM
- Bildsatz in drei Routengruppen, da das Werkzeug keine Geräteauswahl kennt. Die Teilprotokolle sind zusammengeführt.
- Kontaktbögen aus den ersten Bildschirmen. Die Liste ergibt 20 Einzelbilder, erlaubt sind 19. Ausgelassen: H14 desktop.
- Hub und axe mit offenem Menü über ein eigenes Skript, weil `a11y.mjs` offene Menüs nicht kennt. Hub-Zeiten: Median aus drei Läufen.

## GEMEINSAME DATEIEN
Keine Änderung an `lib.mjs` nötig. Vorschläge: `bildsatz.mjs` und `bild.mjs` für das Gerät breit auf 1.440 px begrenzen. Die Kopfzeilen von `bildsatz.mjs`, `a11y.mjs` und `svg-pruefung.mjs` nennen 12 Hauptansichten, der Code nutzt 14.

## PRÜFUNG UND ERGEBNIS
Hub, Vorher: Keine der 8 Schnelleinstieg-Kacheln ist ohne Scrollen sichtbar.

| Gerät | Überschrift y | LCP Median | LCP-Element |
|---|---|---|---|
| 360 × 780 | 1155 px | 192 ms | Einleitung, 320 × 132 |
| 390 × 844 | 1145 px | 188 ms | h1, 350 × 106 |
| 1440 × 900 | 971 px | 176 ms | h1, 572 × 187 |

| Ansicht | Überlauf | Elementbefunde | axe serious mobil / desktop | Konsole | reduziert | CSS mobil |
|---|---|---|---|---|---|---|
| H01 Start | nein | 151 | 1 / 1 | 0 | 0 | 49 |
| H02 Autoschlüssel | nein | 170 | 1 / 1 | 0 | 0 | 29 |
| H03 Modell Golf | nein | 11 | 1 / 1 | 0 | 0 | 27 |
| H04 Anfrage | nein | 0 | 1 / 1 | 0 | 0 | 0 |
| H05 Code | nein | 16 | 1 / 1 | 0 | 0 | 10 |
| H06 Code-Produkt | nein | 16 | 1 / 1 | 0 | 0 | 18 |
| H07 Foto | nein | 14 | 1 / 1 | 0 | 0 | 22 |
| H08 Einschicken | nein | 0 | 1 / 1 | 0 | 0 | 2 |
| H09 Sperrschließung | nein | 4 | 1 / 1 | 0 | 0 | 3 |
| H10 Schließanlagen | nein | 126 | 1 / 1 | 0 | 0 | 79 |
| H11 Schließanlagen-Konfigurator | nein | 0 | 1 / 1 | 0 | 0 | 0 |
| H12 Partner | nein | 0 | 1 / 1 | 0 | 0 | 1 |
| H13 Kasse | nein | 0 | 1 / 1 | 0 | 0 | 0 |
| H14 Ratgeber | nein | 4 | 1 / 1 | 0 | 0 | 29 |

- Seitenüberlauf: in allen 70 Läufen nein. Die 512 Elementbefunde liegen meist in Wischleisten oder Zierlinien (Stichprobe).
- Seitenhöhe in px, Spanne je Gerät: mobil-klein 2700 bis 11483, mobil 2701 bis 11179, tablet 1936 bis 10215, desktop 1417 bis 7703, breit 1424 bis 7797.
- axe: je Lauf ein serious-Befund `target-size` am Telefon-Link, auch bei offenem mobilem Menü und offenem Megamenü. Keine critical, moderate oder minor.
- Konsole: 0 Fehler, 0 Warnungen, 0 Seitenfehler. 19 Anfragen mit ERR_ABORTED auf `/rechtliches/widerruf/erklaeren`. Die Adresse liefert HTTP 200.
- Bewegung reduziert: 0 laufende Animationen, 0 Befunde, 2.404 Textelemente geprüft.
- Animationen mobil: 269 CSS-Animationen, 10 Keyframe-Arten, alle bekannt. Keine Übergänge, WAAPI nur auf H01.
- SVG: 634 Elemente, 0 unbenannt und sichtbar, 0 doppelte IDs, 0 lucide-Reste. `src/app/icon.svg` enthält einen Kommentar.
- Kontaktbögen: je 14 Felder, alle geladen.

## BELEGE
- /home/user/schluesselmacher24/_werkstatt/ausbau/bilder/vorher/ (Kontaktbögen und Einzelbilder)
- /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E0-vorher-hub.json (weitere E0-vorher-*.json, je mit .log)
- /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e0-vorher-hub-menues.mjs

## OFFENE FRAGEN
1. Einzelbilder: H14 desktop nachreichen oder Limit 19 anheben?
2. 69 Bilder des Geräts breit sind 1.920 px breit, die Regel verlangt 1.440 px. Werkzeug ändern oder Regel ausnehmen?
3. Die Überschrift lautet im Quelltext „Wobei können wir helfen?“, im Kern „Wobei können wir Ihnen helfen?“. Welcher Wortlaut gilt?
4. LIESMICH verlangt die Datenweiche für jeden Probelauf, das Paket den direkten Aufruf. Direkt gewählt (root). Bitte festlegen.
5. Die Ursache der 19 abgebrochenen Anfragen ist nicht geprüft.
6. Das Hub- und Menüskript liegt außerhalb des Repositorys und hat keinen Selbsttest. Als Werkzeug übernehmen?
7. Die Animationen sind nicht den Bausteinen B-01 bis B-26 zugeordnet (nicht im Paket).
8. LCP-Werte stammen von localhost ohne Drosselung und sind nur untereinander vergleichbar.
