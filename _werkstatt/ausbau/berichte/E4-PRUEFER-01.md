# E4-PRUEFER-01 · Prüfstufe B nach Etappe E4

Stand: Quellcode Commit 188c6f6, 3. November 2026, JSON-Build auf Port 3000. Während der Prüfung wechselte HEAD durch einen Orchestrator-Commit auf 0fba280, der nur `_werkstatt/ausbau` ändert. Pfade relativ zu `_werkstatt/ausbau/`. Vergleich mit E0 (E0-PRUEFER-08) und E3 (E3-PRUEFER-01). Detailzahlen: `protokolle/E4-PRUEFER-01-ergebnis.log`. n. g. heißt nicht gemessen, n. v. nicht vorhanden.

## GEÄNDERTE DATEIEN
- Neu: `berichte/E4-PRUEFER-01.md`, 30 Protokolle `protokolle/E4-PRUEFER-01-*.log`, Ordner `protokolle/E4-PRUEFER-01/` (JSON, Bildsätze, Bildfolgen), 15 Bilder in `bilder/referenz/`.
- Keine Projektdatei geändert. Git zeigt außerhalb der Protokolle nur `protokolle/datenweiche.log`, getrackt und von der Datenweiche angehängt wie in E3.

## WAS UND WARUM
- Schritte 1 bis 5 vollständig gelaufen. Der Prüfserver steht am Ende auf dem JSON-Build.
- Abweichungen: Prüfstufe B steht im Auftrag in Abschnitt 16, nicht 17. Funktionsliste F-01 bis F-19 statt F-14. Lighthouse zusätzlich auf `/autoschluessel/anfrage`. Strukturdaten der Detailseiten als H03 und H06 gelesen. Bildfolge B-31 und die Zustände Megamenü und Schublade mit eigenen Playwright-Skripten, weil `bewegung.mjs` keine absoluten Zeiten und `a11y.mjs` keine Zustände kennt.
- Störungen: `pkill -f` traf die eigene Shell (Exit 144). `kontaktbogen.mjs` legte ein Protokoll außerhalb des Schreibrechts ab, es wurde verschoben.
- Umfang: 880 Wörter ohne Tabellenstriche. Die Paketgrenze liegt bei 900, die Tabelle ist Pflicht, Rohzahlen stehen im Ergebnisprotokoll. Die allgemeine Grenze von 600 wird damit überschritten.

## GEMEINSAME DATEIEN (nur Orchestrator)
1. `bewegung.mjs`: Option `--zeiten 0,200,400,800,1200` für Bildfolgen (wiederholt aus E3).
2. `bewegung.mjs bildrate`: Option `--ab-start` für das Fenster ab Seitenbeginn.
3. `a11y.mjs`: Option `--zustand schublade|megamenue` (wiederholt aus E3).
4. `kontaktbogen.mjs`: Protokoll nur an das Ziel von `--json`.

## PRÜFUNG UND ERGEBNIS
Gesamturteil: **gelb**, keine roten Punkte. Gelb sind Lighthouse-Budgets, Framezeiten im Fenster ab Seitenbeginn, zwei Texte über zwei Zeilen bei 360 px und ein Element mehr am rechten Rand (H06, Übertrag aus E3).

| Prüfung | E0 | E3 | E4 | Urteil | Beleg |
|---|---|---|---|---|---|
| Build JSON, Build pg | 224 | 224 | 224 | grün | build-json.log, build-pg.log |
| Admin /admin, /admin/login | 200 | 200, 200, 0 Fehler | 200, 200, 0 Fehler | grün | admin-status.log |
| Typprüfung, Lint | 0, 0 | 0, 0 | 0, 0 | grün | typecheck.log, lint.log |
| Unit | 1735 von 1735 | 1936 von 1936 | 1986 von 1986 | grün | unit.log |
| DB | 94 von 94 | 97 von 97 | 97 von 97 | grün | db.log |
| Konsole, 14 Ansichten | 0 Fehler, 19 Abbrüche | 0, 25 | 0 Fehler, 26 Abbrüche | grün | konsole.log |
| Funktionsliste | 14 von 14 | 19 von 19 | 19 von 19 | grün | funktionsliste.log |
| Bildsatz Überlauf, 70 Zeilen | 0 | 0 | 0 | grün | bildsatz.log |
| Bildsatz rechter Rand, H01 | 73 | 73 | 32 | grün | ergebnis.log |
| Bildsatz rechter Rand, H06 mobil-klein | 6 | 7 | 7 | gelb | ergebnis.log |
| axe, 28 Hauptansichten | 28 ernst | 0 | 0 | grün | a11y.log |
| axe, 15 Megamenü-Zustände, 2 Schubladen | n. g. | n. g. | 0 | grün | interaktion.log |
| Reduzierte Bewegung, 14 Ansichten | 0 | 0 | 0 | grün | ergebnis.log |
| Werte außerhalb Designsystem, ohne Ausnahmen | 46 | 59 | 44 | grün | werte-suche.log |
| Slop S1, S2 | 28, 16 | 0, 41 | 0, 2 | grün | slopscan.log |
| Slop S3 bis S8 | 152, 0, 27, 8, 0, 24 | unverändert | 150, 0, 27, 8, 0, 24 | grün | slopscan.log |
| Inventar, indexierbar | 181 von 217 | 181 von 217 | 181 von 217 | grün | inventar.log |
| Strukturdaten Detailseiten | 0 von 17 | 17 von 17 | H03, H06 gültig | grün | r8-strukturdaten.log |
| Lighthouse Startseite, Leistung, LCP | 83, 3516 ms | 95, 2805 ms | 92, 2943 ms | gelb | ergebnis.log |
| Lighthouse Anfrage, Leistung, LCP | 83, 4412 ms | n. g. | 85, 3829 ms | gelb | ergebnis.log |
| Lighthouse H02, H05, H09, Leistung/LCP | 87/3178, 90/3495, 88/3794 | 88/3521, 91/3407, 94/3085 | 92/3010, 89/2548, 90/3606 | gelb | ergebnis.log |
| Hub, erster Bildschirm, 9 Kacheln | 0 von 8 | n. v. | 9 von 9 bei 360, 390, 1440 px | grün | hub-messung.json |
| Eingang B-31, Bildfolge 0 bis 1200 ms | n. g. | 5 Bilder (B-01) | 5 Bilder je Gerät | grün | bildfolge-b31-kontakt.jpg |
| Framezeit offiziell, mobil 4-fach | n. g. | 0,0 % (B-01) | 0,0 % | grün | bewegung-bildrate-b31.log |
| Framezeit, Fenster ab Seitenbeginn | n. g. | n. g. | 30 % mit Einstieg, 43 % ohne | gelb | framezeit-kontrolle.json |
| Kacheltexte 360 px, höchstens 2 Zeilen | n. g. | n. g. | 2 Texte mit 3 Zeilen | gelb | ergebnis.log |
| Dauerschleife B-32 | n. v. | n. v. | läuft, hält, setzt fort, ruht | grün | interaktion.log |
| Übergang B-35, Fokus auf h1 | n. v. | n. v. | Tipp und Klick bestätigt | grün | interaktion.log |
| Navigation G-08, einzeilig | n. g. | n. v. | 1024, 1280, 1440 px einzeilig | grün | ergebnis.log |
| Schublade 390 und 768 px | n. g. | n. v. | axe 0 | grün | interaktion.log |
| Aktionsleiste mit Anruf | n. v. | n. v. | 360 und 390 px sichtbar | grün | interaktion.log |
| Fahrzeugsuche „vw golf“ bis Baujahr | n. v. | n. v. | erreicht, mobil und Desktop | grün | interaktion.log |
| Bewegungsschalter von Hand | n. g. | 18 von 18 | Animationen 6 zu 0 | grün | interaktion.log |

Lighthouse, Budgets: Der LCP-Grenzwert von 2.500 ms ist auf keiner Route erfüllt. Die Leistungsgrenze 90 verfehlen `/schluessel-nach-code` (89) und `/autoschluessel/anfrage` (85). SEO 92 auf vier Routen ist Altbestand. Gegenüber E0 ist keine Route schlechter, die Spannen der drei Läufe liegen im Protokoll.

Framezeit: Die offizielle Messung nach dem Laden liegt bei 0,0 %. Im Fenster ab Seitenbeginn verwerfen beide Modi mit und ohne Inszenierung 30 bis 43 % der Bilder. Die Last entsteht beim Seitenaufbau, nicht durch B-31.

## BELEGE
- Schrittprotokolle `protokolle/E4-PRUEFER-01-*.log`, Detailzahlen `protokolle/E4-PRUEFER-01-ergebnis.log`, JSON in `protokolle/E4-PRUEFER-01/`.
- Bilder `protokolle/E4-PRUEFER-01/`: `bildfolgen/` (10), `bildfolge-b31-kontakt.jpg`, `hub-kacheln-360.png`, `admin-login.png`, `bildsatz/` (524).

## OFFENE FRAGEN
1. Gilt die Schwelle von 5 % auch für das Fenster ab Seitenbeginn? Ursache der Last beim Seitenaufbau nicht ermittelt.
2. Lighthouse-Budgets: Wie wird mit LCP und SEO (Altbestand) umgegangen?
3. Soll die Zwei-Zeilen-Vorgabe bei 360 px gelten? Die Umbrüche stammen vermutlich aus de6cb4f (Hub).
4. Vorabruf-Abbrüche: 26 gegenüber 25 in E3, Ursache offen.
5. Faktenprüfung geänderter Schlüsselseiten und `stil.mjs` sind nicht im Paket und nicht ausgeführt.
