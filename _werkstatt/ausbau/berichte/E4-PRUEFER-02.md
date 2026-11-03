# E4-PRUEFER-02 · Prüfung des zweiten Anlaufs am Tor E4

Stand HEAD 0440da0, localhost:3000, JSON-Modus, 3. November 2026, 14:04 bis 14:35 MEZ. Vergleich: E4-PRUEFER-01 (188c6f6). Belege relativ zu `protokolle/E4-PRUEFER-02/`.

## GEÄNDERTE DATEIEN
- Neu: `berichte/E4-PRUEFER-02.md`, `protokolle/E4-PRUEFER-02/`.
- Überschrieben: 15 Bilder in `bilder/referenz/`.
- Angehängt: `protokolle/datenweiche.log`.
- `src/` und `content/` unverändert, kein Commit.

## WAS UND WARUM
- Schritte 1 bis 5 vollständig.
- Eigene Skripte im Scratchpad für Zustände, Assistent, B-31, B-32, B-35, Hub und Referenzsatz, weil die Werkzeuge sie nicht abdecken.
- Der Assistent hat zwei Wege: Die Suche führt direkt zum Baujahr, Schritt 2 erscheint nur über die Marke.
- Bei 1.024 px ist „Schließanlagen“ in der Leiste ausgeblendet, das Menü öffnete per DOM-Klick.
- Von 14:15 bis 14:27 MEZ liefen fremde Läufe auf demselben Server. Messungen unter Last sind nicht ausgeschlossen.

## GEMEINSAME DATEIEN (gewünscht)
1. `a11y.mjs`: Option `--zustand schublade|megamenue`, seit E4-PRUEFER-01 offen.
2. `bewegung.mjs`: Option `--zeiten 0,200,400,800,1200` für `einzelbilder`, seit E4-PRUEFER-01 offen.
3. `kontaktbogen.mjs`: Ohne `--json` kein Protokoll unter `protokolle/`.
4. `bildsatz.mjs`: Kopfzeile nennt 12 statt 14 Hauptansichten.
5. Übernahme prüfen: `hub.mjs`, `bildfolge.mjs`, `b32-reduziert.mjs` im Scratchpad `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e4p02/`.

## PRÜFUNG UND ERGEBNIS
Gesamturteil: gelb, keine roten Punkte. Gelb: Leitkachel-Erklärung, H02 am rechten Rand (+1 bei drei Geräten), Slop S3 und S6.

| Prüfung | E4-PRUEFER-01 | jetzt | Urteil | Beleg |
|---|---|---|---|---|
| Funktionsliste F-01 bis F-19 | 19 von 19 | 19 von 19 | grün | funktionsliste.md |
| Konsole, 14 Ansichten | 0 Fehler, 26 Abbrüche | 0 Fehler, 26 Abbrüche | grün | konsole.json |
| axe, 28 Hauptansichten | 0 | 0 | grün | a11y.json |
| axe, Megamenü 15, Schublade 2 | 0 | 0 | grün | zustaende-axe.json |
| axe, Assistent 1, 1b, 3, 8 | n. g. | 0 in 8 Zuständen | grün | weg.json |
| Hub, ganz sichtbar und über der Leiste | 9 von 9 bei 360, 390, 1.440; 9 über Leiste | 9 von 9 bei 360 bis 1.920; 9 über Leiste | grün | hub-messung.json |
| Hub, Texte über zwei Zeilen, 360 px | 2 Texte mit 3 Zeilen | keine | grün | hub-messung.json |
| Hub, Texte über zwei Zeilen, ab 768 px | n. g. | Leitkachel 3, 4 und 4 Zeilen | gelb | hub-messung.json |
| Hub, Leitkachel 2 × 2 | n. v. | ab 768 px ja, darunter nein | grün | hub-messung.json |
| Hub, Anruf im ersten Bildschirm | ja | ja, Leiste bei 360 und 390 | grün | hub-messung.json |
| Reduziert, 14 Ansichten | 0 | 0 | grün | bewegung-reduziert.json |
| Reduziert, Start | 0 Pause-Knöpfe | 0 Pause-Knöpfe, Lage 0 px | grün | bewegung-e4p02.json |
| B-32 läuft, hält, setzt fort | ja | 2, 0, 2 Wechsel, reduziert 0 | grün | bewegung-e4p02.json, b32-reduziert.json |
| B-35 Fokus auf h1 | bestätigt | bestätigt, Tipp und Klick | grün | bewegung-e4p02.json |
| Bildsatz, Seitenüberlauf | 0 | 0 | grün | bildsatz.json |
| Bildsatz, H01 (360, 390, 768, 1.440, 1.920) | 32, 32, 3, 2, 0 | 32, 32, 3, 2, 0 | grün | bildsatz.json |
| Bildsatz, H02 (360, 390, 768, 1.440, 1.920) | 84, 84, 2, 0, 0 | 85, 85, 3, 0, 0 | gelb | bildsatz.json |
| Bildfolge B-31, 0 bis 1.200 ms | 5 Bilder je Gerät | 5 je Gerät, Band identisch, Bühne neu | grün | bildfolge-b31.json |
| Werte außerhalb Designsystem | 44 | 44 | grün | werte-suche.json |
| Slop S1 bis S8 | 0, 2, 150, 0, 27, 8, 0, 24 | 0, 2, 152, 0, 26, 10, 0, 24 | gelb | slopscan.json |
| Referenz-Bildsatz | 15 | 15 neu | grün | referenz.json |

## BELEGE
- Bilder: `bilder/referenz/` (15), `protokolle/E4-PRUEFER-02/weg/` (10), `bildfolgen/` (10), `bildsatz/` (121), `bildfolge-b31-kontakt.jpg`.
- Protokolle: `protokolle/E4-PRUEFER-02/*.log` und `*.json`.

## OFFENE FRAGEN
1. Gilt die Vorgabe von zwei Zeilen auch für die Leitkachel-Erklärung (ab 768 px drei bis vier Zeilen)?
2. Auf `/autoschluessel` ragen mobil Ablaufzeichnungen über den rechten Rand (85 gegen 84). Ungeprüft: ob Teile abgeschnitten sind.
3. Bei 360 px liegt der Telefonlink im Inhalt unter der Leiste (750 gegen 724 px). Gewollt?
4. Vorabruf-Abbrüche (`ERR_ABORTED`, `?_rsc=`): 26 wie in E4, Ursache offen.
5. S3 steigt auf `/autoschluessel` um je ein Element, das Protokoll nennt nur drei Beispiele.
