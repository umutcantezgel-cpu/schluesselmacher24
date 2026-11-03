# E3-PRUEFER-01 · Prüfstufe B nach Etappe E3

Stand: Commit 92e2ef5, 3. November 2026. Vergleich mit dem Vorher-Stand E0 (E0-PRUEFER-08, Protokolle `E0-vorher-*`). Pfade relativ zu `_werkstatt/ausbau/`.

## GEÄNDERTE DATEIEN
- Neu: `berichte/E3-PRUEFER-01.md` (dieser Bericht).
- Neu: 25 Schrittprotokolle `protokolle/E3-PRUEFER-01-*.log`, Ordner `protokolle/E3-PRUEFER-01/` mit 17 JSON-Dateien, 524 Bildsatz-Bildern, 10 Bildfolgen (26 MB).
- Keine Projektdatei geändert: `git status` außerhalb `_werkstatt/ausbau` ist leer. Die Datenweiche schrieb `protokolle/datenweiche.log`. Die übrigen Änderungen unter `_werkstatt/ausbau` stammen vom Orchestrator.

## WAS UND WARUM
- Schritte 1 bis 5: pg- und JSON-Build, Admin-Rauchtest auf Port 3001 (keine Anmeldung), Prüfserver, Typprüfung, Lint, Unit, DB, Werkzeuge, Handprüfung des Schalters.
- Zusätzlich nach Auftrag Abschnitt 14: Zustände, Strukturdaten, Framezeiten und Bildfolgen der Fräsbahn (B-01), Funktionen F-15 bis F-19.
- Störungen: Ein zweiter `server.sh start` hing bei laufendem Server an `flock`, weil der Serverprozess die Sperre erbt. Nur dieser Aufruf wurde beendet. Ein Kindprozess auf Port 3001 blieb nach `pkill` stehen, `fuser` beseitigte ihn.
- Endzustand: Prüfserver läuft auf dem JSON-Build (Port 3000, HTTP 200).

## PRÜFUNG UND ERGEBNIS
Gesamturteil: **gelb**, keine roten Punkte.

| Prüfung | E0 | E3 | Urteil | Beleg |
|---|---|---|---|---|
| Build JSON | 224 Seiten | 224 Seiten | grün | build-json.log |
| Build pg, Seed, Livegang | 224, ohne Funde | 224, ohne Funde | grün | build-pg.log |
| Admin /admin, /admin/login | 200 | 200, 200, 0 Konsolenfehler | grün | admin.log, admin-login.json |
| Typprüfung | 0 Fehler | 0 Fehler | grün | typecheck.log |
| Lint | 0 Fehler, 0 Warnungen | 0 Fehler, 0 Warnungen | grün | lint.log |
| Unit | 133 Dateien, 1735 von 1735 | 144 Dateien, 1936 von 1936 | grün | unit.log |
| DB (pg) | 15 Dateien, 94 von 94 | 16 Dateien, 97 von 97 | grün | db.log |
| Konsole, Desktop, 14 Ansichten | 0 Fehler, 19 Abbrüche | 0 Fehler, 25 Abbrüche | grün, Frage 4 | konsole.json |
| Funktionsliste F-01 bis F-14 | 14 von 14 | 14 von 14 | grün | funktionsliste.json |
| Funktionsliste F-15 bis F-19 | 5 von 5 | 5 von 5 | grün | funktionsliste-zusatz.json |
| Bildsatz Seitenüberlauf, 70 Zeilen | 0 | 0 | grün | bildsatz.json |
| Bildsatz Elemente am rechten Rand | je Zeile gleich | H06 mobil-klein 6 auf 7 | gelb | bildsatz.json, tab-sicherungskarte.json |
| axe, 14 Ansichten, mobil und Desktop | 28 ernste Befunde | 0 | grün | a11y.json |
| axe, Schublade mobil und Megamenü offen | je 1 ernster Befund | 0 | grün | a11y-zustaende.json |
| Lighthouse, Median aus 3, mobil, 4 Routen | siehe Text | keine Verschlechterung | grün | lighthouse.json |
| Reduzierte Bewegung, 14 Ansichten | 0 Befunde | 0 Befunde | grün | bewegung-reduziert.json |
| Bewegungsschalter, Handprüfung | nicht vorhanden | 18 von 18 | grün | bewegungsschalter.json |
| Framezeiten B-01, mobil, 4-fach gedrosselt | nicht gemessen | 0,0 % verworfen, Schwelle 5 % | grün | bewegung-bildrate-start.json |
| Bildfolge B-01, 0 bis 1.200 ms | nicht gemessen | 5 Bilder je Gerät | grün, Frage 5 | bewegung-einzelbilder-desktop.json, -mobil.json |
| Slop S1, Schriften | 28 (Inter) | 0 | grün | slopscan.json |
| Slop S2, Farben außerhalb Tokens, Lila | 16, alle Lila | 41, kein Lila | gelb | slopscan.json |
| Slop S3 bis S8 | 152, 0, 27, 8, 0, 24 | unverändert | grün | slopscan.json |
| Werte außerhalb Designsystem | 46 Funde, 2 Ausnahmen | 59 Funde, 1 Ausnahme | gelb | werte-suche.json |
| Inventar indexierbar | 181 von 217, 0 Fehler | 181 von 217, 0 Fehler | grün | inventar.json |
| Strukturdaten Detailseiten | 0 von 17 | 17 von 17 | grün | inventar.json |

Lighthouse, Median mobil: Startseite Leistung 83 auf 95, LCP 3516 auf 2805 ms. `/autoschluessel` LCP 3178 auf 3521 ms, die Differenz von 343 ms liegt innerhalb der Streuung von 772 ms (größte Spanne der drei Läufe). Die übrigen Routen sind besser. Altbestand: LCP über 2.500 ms auf allen vier Routen, SEO 92 auf drei Routen (E0 ebenso).

Gelbe Punkte:
1. Slop S2 steigt von 16 auf 41. Alle Treffer liegen nicht auf `:root`, sie sind Bereichsfarben mit Deckkraft (`stroke-area-muted/40`, `fill-area-muted/60`) aus `src/lib/visual/area-theme.ts` (4cf61af). Kein Lila. Fremdfarben sind nicht bewiesen.
2. Werte außerhalb Designsystems netto +13: fünf Hex-Farben in `src/lib/pdf/erzeuge-pdf.ts` (73c6fb9), sieben in Testdateien, die Themefarbe `#fafbfd` in `src/app/(site)/layout.tsx` statt der Ausnahme `#f7f9fb` (D-015). Die `oklch(`-Funde in `global-error.tsx` ersetzen `hsl(`, netto 0.
3. Bildsatz H06 mobil-klein: ein Element mehr am rechten Rand, der neue Reiter „Auf der Sicherungskarte“ (1800660) in einer horizontal scrollbaren Leiste (Inhalt 552 px bei 360 px). Die Seite läuft nicht über.

## GEMEINSAME DATEIEN (gewünschte Änderungen, nur durch den Orchestrator)
1. `werkzeuge/server.sh`: `nohup`-Aufruf mit `9>&-` starten, sonst blockiert `start` bei laufendem Server.
2. `werkzeuge/slopscan.mjs`: Bereichsvariablen je Bereich als Tokens führen.
3. `werkzeuge/bewegung.mjs`: Bildfolgezeitpunkte wählbar machen, etwa `--zeiten 0,200,400,800,1200`.
4. `werkzeuge/a11y.mjs`: Option `--zustand schublade|megamenue`.
5. `werkzeuge/LIESMICH.md`: Basis von werte-suche angleichen (Text fcbcfb2, Code 063b752); Kopf von funktionsliste nennt noch E0-PRUEFER-04.
6. Ausnahmenliste werte-suche: `layout.tsx` auf `#fafbfd` nachziehen (D-015).

## BELEGE
- Schrittprotokolle: `protokolle/E3-PRUEFER-01-*.log`, darunter `build-json.log`, `lighthouse.log`, `kette.log`.
- Daten und Bilder in `protokolle/E3-PRUEFER-01/`: JSON je Prüfung (`lighthouse.json` mit Median und Spanne je Route), `bildsatz/` (524 Bilder), `bildfolgen/` (10), `admin-login.png`, `bewegungsschalter-an.png`, `bewegungsschalter-ruhig.png`.

## OFFENE FRAGEN
1. S2: Sollen Bereichsvariablen als Tokens zählen, oder sind Bereichsfarben so gewollt?
2. Werte außerhalb Designsystems: PDF-Farben und Testdateien ausnehmen?
3. Reiter bei 360 px: Ist die Scrollbarkeit erkennbar? Probenutzer prüfen.
4. Konsole: 25 statt 19 Vorabrufe (`ERR_ABORTED`), ohne HTTP-Fehler. Ursache offen.
5. Bildfolgen: Auftrag fordert 0, 200, 400, 800 und 1.200 ms, das Werkzeug liefert 0, 300, 600, 900 und 1.200 ms. Framezeiten nur für B-01 gemessen.
6. Bildsatz H03, H05 und H10 mobil-klein: 15 Ausschnitte gekappt. Der Überlauf wurde je Seite vollständig geprüft.
7. Nicht ausgeführt: Faktenprüfung geänderter Schlüsselseiten und Stilprüfung (`stil.mjs`).
8. `/sicherheitstechnik/sicherheitscheck` hat kein JSON-LD. Gehört die Unterseite zum Umfang?
9. SEO 92 und LCP über 2.500 ms sind Altbestand aus E0. Ursache offen.

=== ENDE E3-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
