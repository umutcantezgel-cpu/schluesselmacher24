# E0-PRUEFER-02 · Übernommene Werkzeuge in Gang setzen

Stand 2. November 2026. Der Produktionsserver auf Port 3000 läuft unverändert (`server.sh status`).

## GEÄNDERTE DATEIEN
- `_werkstatt/ausbau/werkzeuge/`: `a11y`, `bild`, `bildsatz`, `bewegung`, `konsole`, `ladeweg`, `messung`, `svg-pruefung`, `textabzug`, `logikwaechter`, `funktionsliste` (je `.mjs`), `LIESMICH.md`
- `_werkstatt/ausbau/protokolle/E0-PRUEFER-02-*.log`
- Nicht geändert: `lib.mjs`, `sicher.sh`, `sicher.test.sh`, `server.sh`, `package.json`. Nichts committet.
- Commit 7aaf72a (21:57 UTC, nicht von mir) hat meine damaligen Änderungen mitgenommen. `textabzug.mjs` und `LIESMICH.md` weichen seitdem ab.

## WAS UND WARUM
1. **Geräte nach Kennung** in sieben Werkzeugen. `lib.mjs` führt fünf Größen; `GERAETE[0]` ist jetzt mobil-klein (360 px), `GERAETE[2]` tablet (768 px). Ohne Korrektur wären Mobil- und Desktop-Prüfungen in falschen Breiten gelaufen.
2. **`a11y.mjs`**: `@axe-core/playwright` ist nicht installiert. Umgestellt wie vorgegeben: `axe.min.js` aus `node_modules` wird je Ansicht eingefügt. Ausgabe unverändert.
3. **Schreibrechte**: Standardablagen lagen außerhalb meiner Rechte. Umlenkbar gemacht, Standard unverändert: `textabzug` (`SM24_TEXTABZUG`; der Ordner entsteht nur bei `sichern`, vorher legte schon der Import ihn an), `logikwaechter` (`SM24_FINGERABDRUECKE`), `funktionsliste` (`--md`, `SM24_FOTO`; Bericht und Testbild gingen sonst nach `protokolle` bzw. `/tmp`).
4. **Doku**: `bild` und `bildsatz` nennen fünf Größen. `LIESMICH.md` neu: Einrichtung, je Werkzeug eine Zeile, Stand.

## GEMEINSAME DATEIEN
Keine gewünschte Änderung.

## PRÜFUNG UND ERGEBNIS
`node --check` aller Werkzeuge: ok. Selbstprüfung: 14 Werkzeuge mit Ergebnis. Log = `protokolle/E0-PRUEFER-02-<Log>.log`.

| Werkzeug | Probelauf | Ergebnis | Änderung | Log |
|---|---|---|---|---|
| bild.mjs | `/ --geraet mobil` | läuft: HTTP 200, JPEG 36 KB | Doku | bild |
| bildsatz.mjs | `--routen /,/kasse --max 2` | läuft: 10 Zeilen, 20 Bilder | Doku | bildsatz |
| konsole.mjs | `--routen /` | läuft: keine Konsolen- oder Seitenfehler, 2 Netzabbrüche | Gerät | konsole |
| a11y.mjs | `--routen / --geraet mobil` | läuft: 1 serious (target-size) | axe-core, Gerät | a11y |
| svg-pruefung.mjs | `--routen /` | läuft: 1 Datei mit Kommentar | Gerät | svg-pruefung |
| werte-suche.mjs | ohne Argumente; `--seit b8e7ea7` | läuft mit Einschränkung: Standardbasis fehlt; mit b8e7ea7: 321 Dateien, 46 Funde | keine | werte-suche |
| messung.mjs | `--routen / --laeufe 1 --profil mobil` | läuft: LCP 648 ms, CLS 0, INP 40 ms (ein Lauf) | Gerät | messung |
| ladeweg.mjs | `--routen / --laeufe 1` | läuft: mobil 390 × 844, LCP 676 ms | Gerät | ladeweg |
| bewegung.mjs | `reduziert --routen /` | läuft mit Einschränkung: 0 Befunde; einzelbilder und bildrate ungeprüft | Gerät | bewegung |
| animationen.mjs | `--routen / --geraet mobil` | läuft mit Einschränkung: 22 Keyframes, 0 unbekannt; `--bedienen` ungeprüft | keine | animationen |
| textabzug.mjs | sichern, vergleichen (Prüfordner) | läuft: 6 Seiten gleich; ohne Sicherung Bedienfehler 2 | Ablage | textabzug |
| gefuellt.mjs | `--geraet mobil` | läuft: Warenkorb 5, Kasse 7 Bilder | keine | gefuellt |
| logikwaechter.mjs | sichern, pruefen (Prüfordner) | läuft: 15 Dateien gleich | Protokollort | logikwaechter |
| funktionsliste.mjs | `--nur F-01`, dann F-02 bis F-14 | läuft: 14 von 14 BESTANDEN | Gerät, `--md`, `SM24_FOTO` | funktionsliste |

Befunde, nicht bewertet: `konsole` H01 mit zwei abgebrochenen Anfragen (ERR_ABORTED) auf `/rechtliches/widerruf/erklaeren`. `bildsatz` H01 mit Elementen über den rechten Rand, ohne Seitenüberlauf. `ladeweg`: Tabelle „Bytes vor FCP je Typ“ leer.

## BELEGE
- `_werkstatt/ausbau/protokolle/E0-PRUEFER-02-install.log`, `_werkstatt/ausbau/protokolle/datenweiche.log` (Zeilen mit `als=root`)
- Bilder: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e0-pruefer-02/bilder/`
- Textabzug: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e0-pruefer-02/textabzug/`
- Logik-Protokoll: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e0-pruefer-02/logik/logik-fingerabdruecke.json`
- Funktionsliste: `_werkstatt/ausbau/protokolle/E0-PRUEFER-02-funktionsliste*.log`

## OFFENE FRAGEN
1. `/root` ist für `ubuntu` nicht lesbar, daher laufen die Werkzeuge mit `--als-root`. Sollen die Abhängigkeiten an eine lesbare Stelle?
2. Die Standardbasis `fcbcfb2` von `werte-suche.mjs` fehlt im Repository. Welcher Commit gilt im Ausbau?
3. `lib.mjs` (7aaf72a, nicht von mir): Hauptansichten von 12 auf 14, `H11-kasse` heißt jetzt `H13-kasse`. Protokolle von `bildsatz` nennen noch die alte ID.
4. `messung.mjs` mit einem Lauf geprüft, wie vorgegeben. Messergebnisse brauchen drei Läufe und den Median.
5. Ungeprüft: `bewegung.mjs` mit `einzelbilder` und `bildrate`, `animationen.mjs` mit `--bedienen`.
6. Die Kopfzeile von `funktionsliste.mjs` nennt noch „E0-PRUEFER-04“ (Altbestand, nicht geändert).
7. Eigene Tests für die neuen Pfadoptionen habe ich nicht geschrieben; die Probeläufe belegen sie.
