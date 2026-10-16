# E5-PRUEFER-B · Ergebnis (Prüfstufe B der Etappe E5)

Abgelegt vom Orchestrator aus dem Bericht von Teil 5 (Prüfer schreiben keine Berichtsdateien). Stand der Messung: Build d0e4784; der Linterfehler wurde danach behoben (eb5cda6, `npx eslint .` EXIT 0).

PRÜFUNG UND ERGEBNIS

Tabelle 1 · Bestand · E0 · E4 · jetzt · Beleg
| Prüfung | E0 | E4 | jetzt | Beleg |
|---|---|---|---|---|
| Typprüfung tsc --noEmit | 0 Fehler | 0 Fehler, EXIT 0 | 0 Fehler, EXIT 0 | E5-PRUEFER-B-typecheck.log |
| Linter eslint . | 0/0 | 0/0, EXIT 0 | 1 Fehler, 0 Warnungen, EXIT 1 | E5-PRUEFER-B-lint.log |
| Build | 198/198 | 198/198, EXIT 0 | 208/208, Compiled successfully, EXIT 0 | E5-PRUEFER-B-build.log |
| Unit Dateien / Tests | 31/31 · 680/680 | 54/54 · 1039/1039 | 66/66 · 1150/1150, EXIT 0 | E5-PRUEFER-B-test-unit.log |
| DB-Tests Dateien / Tests | 7/7 · 52/52 | 7/7 · 52/52 | 7/7 · 52/52, EXIT 0 (Nutzer nicht im Protokoll) | E5-PRUEFER-B-test-db.log |
| Funktionsliste F-01 bis F-14 | 14/14 (Port 3100) | 14/14 | 14/14 BESTANDEN | E5-PRUEFER-B-funktionsliste.log |
| Logikwächter | kein Wert | 15 Dateien, 0 abweichend | 15 Dateien, 0 abweichend, EXIT 0 | E5-PRUEFER-B-logik.log |
| Textabzug Rechtsseiten | kein Wert | 6 gleich | 6 gleich, EXIT 0 | E5-PRUEFER-B-textabzug.log |
| Wertesuche ohne Ausnahmen / Ausnahmen | 707 / 10 (196 Dateien seit b49fe04) | 0 / 10 (154 seit fcbcfb2) | 0 / 18 (217 seit fcbcfb2) | E5-PRUEFER-B-werte.log, E5-PRUEFER-B-werte.json |
| HTTP / · /gibt-es-nicht-pruefung · „Hinweis für die Redaktion“ | nicht erhoben | 200 · 404 · 0 Treffer | 200 (281485 Byte) · 404 · 0 Treffer | E5-PRUEFER-B-http.log |
| git status --short AGENTS.md | nicht erhoben | leer | leer (HEAD jetzt d693a8e) | Befehl ohne Ausgabe |

Tabelle 2a · Hauptansichten · Netzfehler, Überlauf, axe, Bewegung · E0 → E4 → jetzt
Konsole (Konsolenfehler, Warnungen, Seitenfehler): 0/0/0 in allen 12 Zeilen und allen drei Ständen. Seitenüberlauf: nein/nein/nein in allen 12 Zeilen und allen drei Ständen.
| Ansicht | Netzfehler Desktop | Elemente über rechten Rand m/t/d | axe mobil ernst/kritisch | axe Desktop ernst/kritisch | Bewegung reduziert: Befunde (Textelemente E4 → jetzt) |
|---|---|---|---|---|---|
| H01-start | 0 → 2 → 2 | – → 31/3/2 → 55/3/2 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (203 → 203) |
| H02-autoschluessel | 0 → 0 → 2 | – → 3/3/1 → 86/2/0 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (182 → 190) |
| H03-modell-golf | 2 → 1 → 2 | – → 4/2/1 → 4/4/3 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (120 → 132) |
| H04-assistent | 1 → 1 → 1 | – → – → 0/0/0 | 1/1 → 0/1 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (131 → 126) |
| H05-code-shop | 2 → 1 → 2 | – → 1/1/1 → 1/1/1 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (562 → 421) |
| H06-code-produkt | 2 → 2 → 1 | – → 3/2/– → 4/3/1 | 1/1 → 0/1 → 0/0 | 1/1 → 0/1 → 0/0 | 0 → 0 → 0 (129 → 143) |
| H07-zylinder-konfigurator | 0 → 1 → 1 | – → 2/1/– → 1/1/– | 1/1 → 0/1 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (127 → 123) |
| H08-schliessanlagen | 1 → 2 → 1 | 27/0/0 → 12/7/4 → 3/3/2 | 2/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (252 → 215) |
| H09-tuertechnik | 3 → 3 → 1 | 1/1/0 → 1/1/1 → 16/1/1 | 1/0 → 0/0 → 0/0 | 2/0 → 0/0 → 0/0 | 0 → 0 → 0 (186 → 172) |
| H10-warenkorb | 2 → 2 → 1 | 0 → 0 → 0 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (66 → 66) |
| H11-kasse | 1 → 1 → 1 | 0 → 0 → 0 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (66 → 65) |
| H12-ratgeber | 0 → 2 → 1 | 0 → 1/1/– → 1/1/1 | 1/0 → 0/0 → 0/0 | 1/0 → 0/0 → 0/0 | 0 → 0 → 0 (80 → 84) |
Hinweis: E0 führt „–“ als keinen Befund. Netzfehler sind alle net::ERR_ABORTED. E0-Textelemente je Ansicht sind nicht ausgewiesen (E0-Summe 2058). Die Ausschnittgrenze war bei E0 15, bei E4 und jetzt 12 (H08 mobil jetzt 12 von 13 Ausschnitten).

Tabelle 2b · Hauptansichten · Leistung · Median aus 3 Läufen · mobil · E0 → E4 → jetzt
| Ansicht | LCP ms | CLS | INP ms | JS-KB | Budget jetzt |
|---|---|---|---|---|---|
| H01-start | 996 → 1116 → 1072 | 0,000 → 0,000 → 0,000 | 56 → 72 → 168 | 246,3 → 315,4 → 300,0 | eingehalten |
| H02-autoschluessel | 960 → 1036 → 1152 | 0,000 → 0,000 → 0,000 | 56 → 88 → 160 | 219,1 → 251,5 → 237,1 | eingehalten |
| H03-modell-golf | 976 → 992 → 1052 | 0,000 → 0,000 → 0,000 | 48 → 112 → 136 | 219,1 → 253,7 → 240,9 | eingehalten |
| H04-assistent | 904 → 1004 → 996 | 0,000 → 0,000 → 0,000 | 56 → 88 → 96 | 227,0 → 259,5 → 242,5 | eingehalten |
| H05-code-shop | 1084 → 1144 → 1100 | 0,000 → 0,000 → 0,000 | 56 → 80 → 144 | 234,9 → 256,9 → 252,3 | eingehalten |
| H06-code-produkt | 964 → 1112 → 1060 | 0,000 → 0,000 → 0,000 | 64 → 88 → 128 | 234,9 → 263,5 → 255,8 | eingehalten |
| H07-zylinder-konfigurator | 1012 → 1088 → 1020 | 0,000 → 0,000 → 0,000 | 72 → 88 → 88 | 210,0 → 237,0 → 230,5 | eingehalten |
| H08-schliessanlagen | 976 → 1164 → 1052 | 0,000 → 0,000 → 0,000 | 64 → 96 → 136 | 248,5 → 274,1 → 262,8 | eingehalten |
| H09-tuertechnik | 1020 → 1116 → 1020 | 0,000 → 0,000 → 0,000 | 48 → 96 → 128 | 222,2 → 254,1 → 247,9 | eingehalten |
| H10-warenkorb | 2508 (ÜBER) → 2776 (ÜBER) → 968 | 0,117 (ÜBER) → 0,146 (ÜBER) → 0,000 | 56 → 96 → 96 | 231,0 → 266,7 → 262,0 | eingehalten |
| H11-kasse | 920 → 952 → 956 | 0,104 (ÜBER) → 0,098 → 0,007 | 64 → 96 → 80 | 217,0 → 247,0 → 239,9 | eingehalten |
| H12-ratgeber | 936 → 1004 → 976 | 0,000 → 0,000 → 0,000 | 56 → 136 → 88 | 212,6 → 249,3 → 244,9 | eingehalten |
Desktop jetzt: LCP 96 bis 196 ms, CLS 0,000 in allen 12 Ansichten, INP 24 bis 56 ms, alle Budgets eingehalten. CLS Desktop H10: 0,038 (E0) → 0,056 (E4) → 0,000. H11: 0,031 → 0,030 → 0,000.

Tabelle 3 · Übrige Ansichten (UEBRIG) · nur jetzt, keine Vergleichswerte in E0 oder E4
Konsole: 0/0/0 in allen 16. Seitenüberlauf nein in allen 48 Zeilen (16 Ansichten × 3 Geräte). axe ernst/kritisch 0/0 in allen 32 Zeilen (mobil und Desktop). Bewegung reduziert: 0 Befunde, 0 laufende Animationen, 0 verborgene Inhalte.
| Ansicht | Netzfehler Desktop | Elemente über rechten Rand m/t/d | Textelemente (Bewegung) |
|---|---|---|---|
| gleichschliessende-zylinder | 0 | 8/4/4 | 226 |
| service-und-termin | 3 | – | 176 |
| service-und-termin-kontakt | 3 | – | 81 |
| service-und-termin-vor-ort | 2 | 1/1/1 | 127 |
| service-und-termin-anfrage | 2 | – | 87 |
| service-und-termin-terminstatus | 2 | – | 62 |
| schluessel-nach-vorlage-anfrage | 1 | 1/–/– | 88 |
| sicherheitstechnik-sicherheitscheck | 2 | – | 98 |
| elektronische-zutrittsloesungen-konfigurator | 2 | – | 110 |
| schliessanlagen-konfigurator | 1 | – | 102 |
| artikel | 0 | – | 135 |
| artikel-beispiel-schluesselkasten | 2 | 1/1/– | 114 |
| standorte | 4 | 1/1/1 | 81 |
| standorte-berlin | 2 | 1/1/1 | 80 |
| rechtliches-agb | 1 | 8/2/– | 94 |
| rechtliches-cookie-einstellungen | 0 | 8/2/– | 85 |
Ausschnittgrenzen übrige Ansichten: gleichschliessende-zylinder mobil 6 von 14, tablet 6 von 10, desktop 6 von 10. service-und-termin mobil 6 von 14, tablet 6 von 8, desktop 6 von 9.

BUDGET-VERSTÖSSE (jetzt): keine. Am Median 0 von 24 Serien verletzt, kein Einzellauf über Budget. Höchstwerte je Einzellauf: LCP 1172 ms (H02 mobil), CLS 0,0074 (H11 mobil), INP 168 ms (H01 mobil). Nächster Wert am Budget: INP H01 mobil, 168 ms bei 200 ms. Zum Vergleich: E4 hatte H10 mobil LCP 2776 ms und CLS 0,146. E0 hatte H10 mobil LCP 2508 ms und CLS 0,117 sowie H11 mobil CLS 0,104.

AXE SERIOUS ODER CRITICAL (jetzt): keine. In allen 56 Zeilen 0 ernst, 0 kritisch, 0 moderat, 0 gering. Zum Vergleich: E4 hatte 4 kritische Befunde (H04 mobil button-name, Selektor .hover\:border-foreground-subtle; H06 mobil und Desktop label, #foto-ms-01-camera und #foto-ms-01-gallery; H07 mobil button-name, Selektor .mx-auto > .hover\:border-foreground-subtle.select-none.transition). E0 hatte 4 kritische und 26 ernste. Das Protokoll zählt nur Verstöße; es gibt keinen Nachweis bestandener Regeln.

NICHT BESTANDENE FUNKTIONEN: keine. F-01 bis F-14 alle BESTANDEN (14 von 14). Keine Wiederholung nötig.

ABWEICHUNGEN IM BESTAND (jetzt gegenüber E4, sonst E0)
1. Linter: 1 Fehler, EXIT 1, src/components/layout/page-header.test.tsx Zeile 20 Spalte 18, Regel @next/next/no-html-link-for-pages. E4 0/0. Git zeigt: Datei seit 107026e unverändert bis Commit eb5cda6 (nach dem Lauf; nur diese Datei; Meldung „Linter wieder ohne Befund“). Nicht neu gelaufen, Ursache nicht untersucht.
2. Wertesuche: 18 Ausnahmen statt 10 (E4). Alle 10 aus E4 bleiben. Neu: ablauf.test.tsx (2), schluessel.test.tsx (2), zylinder-mass.test.tsx (2), og/bereichsbild.test.ts (1), og/bereichsbild.tsx (1). Alle sind Farbfunktionen (rgb(, oklch(, hsl() in Test-Fixtures oder der OG-Bildfunktion. Ohne Ausnahmen 0 wie E4.
3. Unit: 66/66 Dateien und 1150/1150 Tests, E4 54 und 1039 (+12 Dateien, +111 Tests).
4. Build: 208 statische Seiten statt 198. Die Meldung „PAYLOAD_SECRET fehlt“ erscheint 6-mal, wie in E4.
5. Bildrate mobil (Selektor H01, 1600 ms, CPU 4-fach gedrosselt, ein Lauf): 29 von 109 verworfen, 26,6 %. Schwelle 5 %: ÜBER. E4: 0 von 110, 0,0 %. Gleiches Werkzeug und gleiche Parameter, daher vergleichbar.
6. INP mobil (Median): gegenüber E4 in 8 von 12 Ansichten höher (H01 72 → 168, H02 88 → 160, H03 112 → 136, H04 88 → 96, H05 80 → 144, H06 88 → 128, H08 96 → 136, H09 96 → 128). Gleich bei H07 und H10. Niedriger bei H11 (96 → 80) und H12 (136 → 88). Gegenüber E0 in allen 12 höher, Budget 200 ms in keiner Ansicht erreicht.
7. LCP mobil (Median): gegenüber E4 höher bei H02 (1036 → 1152), H03 (992 → 1052) und H11 (952 → 956), in den übrigen 9 niedriger.
8. JS-KB mobil (Median): gegenüber E4 in allen 12 niedriger (H01 315,4 → 300,0). Gegenüber E0 in allen 12 höher (H01 246,3 → 300,0). Das 60-KB-Bewegungscode-Budget misst messung.mjs nicht.
9. Elemente über den rechten Rand, Hauptansichten: Summe 201 (mobil 171, Tablet 19, Desktop 11). E4 89, E0 29. Größte Werte: H02 mobil 86 (E4 3), H01 mobil 55 (E4 31), H09 mobil 16 (E4 1). Technischer Befund, nicht gewertet. Seitenüberlauf ist trotzdem in keiner Zeile „ja“.
10. Netzfehler Desktop (Konsole): Hauptansichten 16 (E4 18, E0 14), übrige 27. Alle net::ERR_ABORTED, überwiegend RSC-Vorabrufe auf /autoschluessel/anfrage bzw. /service-und-termin/anfrage. Ursache nicht untersucht.
11. Bewegung reduziert: 0 Befunde, 0 Animationen, 0 verborgene Inhalte in allen 28 Ansichten (E0 und E4 ebenso). Textelemente Hauptansichten 1940 (E4 2104, E0 2058).
12. Einzelbilder (Desktop): Animationsfenster H01 0 bis 1580 ms (E4 gleich), H02 0 bis 1500 ms (E4 0 bis 6000), H05 100 bis 1370 ms (E4 0 bis 1920), H08 0 bis 1930 ms (E4 gleich), H09 300 bis 1580 ms (E4 gleich). Animationen H08 63 (E4 130).
13. Warenkorb und Kasse gefüllt: 27 Bilder (mobil 5 und 7, Tablet 3 und 5, Desktop 3 und 4), wie E4.

ABLAUF UND PRÜFPFAD (keine Änderung am Ergebnis)
- Teil 1 und Teil 2 liefen von 18:48:49 bis 18:50:57 UTC parallel. Die Sperre setzte Teil 2. Der „fremde“ Lauf PID 5309 (bildsatz --ziel /root/sm24-bilder/e5-b --max 12, Start 18:50:11) entspricht dem Befehl von Teil 2 Schritt 2. Die Bildrate lief um 19:00:55 UTC, als Teil 1 beendet war.
- Zeitangaben: Dateinamen sind Ortszeit (UTC+2), das JSON-Feld zeit ist UTC. Der Widerspruch aus Teil 4 besteht nicht (messung zeit 19:13:28Z, Dateiname 21-13-28).
- Git: Das Protokoll nennt als letzten Commit da56209. HEAD ist jetzt d693a8e. Seit dem Build-Stand d0e4784 hat sich unter src, content, public und den Konfigurationsdateien nur eb5cda6 (Testdatei) geändert.
- Protokollkopf der Funktionsliste nennt E0-PRUEFER-04 als Werkzeugnamen. Der Server localhost:3000 ist korrekt.

BILDBELEGE
Teil 5 erzeugt keine Bilder. Vorhandene Belege: /root/sm24-bilder/e5-b/ (234 Hauptansichten, 200 in uebrige/), /root/sm24-bilder/e5-b/einzelbilder/, /root/sm24-bilder/e5-b/gefuellt/, /root/sm24-bilder/e5-b/schritte/ (62 Dateien). Protokolle: /home/user/schluesselmacher24/_werkstatt/protokolle/E5-PRUEFER-B-*.log und die zugehörigen JSON-Dateien.

OFFENE FRAGEN
1. Bildrate 26,6 % liegt über der Schwelle. Es ist ein Einzellauf. Wiederholung nur auf Auftrag.
2. Die axe-Nullen sind nicht unabhängig belegt, weil das Protokoll keine bestandenen Regeln ausweist.
3. Der Lint-Befund war zum Messzeitpunkt vorhanden und ist laut Commit eb5cda6 behoben. Nicht neu gelaufen.
4. Die Startzeit der Messung ist im Protokoll nicht vermerkt. Teil 3 endete laut Dateiname um 19:05:02 UTC, die Messung um 19:13:28 UTC. Eine Überlappung in den ersten Sekunden ist nicht sicher ausgeschlossen. Teil 4 hat sie vorab verneint.
5. Die acht neuen Ausnahmen in der Wertesuche sind nach Datei und Zeile übernommen, inhaltlich nicht gegen die Bildinhalte geprüft.
6. Der Nutzer ubuntu für die DB-Tests steht nicht im Protokoll (wie in E4).
7. Das Messungs-JSON trägt den Werkzeug-Standardnamen messung-2026-10-16_21-13-28.json, nicht das Präfix E5-PRUEFER-B.
8. Die Sichtprüfung aus Teil 2 (Punkt 8) ist hier nicht gegengeprüft.

=== ENDE E5-PRUEFER-B · BEREIT ZUR RÜCKGABE ===

## Auffälligkeiten

- Budget-Verstöße: keine. Am Median 0 von 24 Serien, kein Einzellauf über Budget. E4 hatte H10 mobil (LCP 2776 ms, CLS 0,146).
- axe serious oder critical: keine in 56 Zeilen. E4 hatte 4 kritische Befunde (H04 mobil, H06 mobil und Desktop, H07 mobil).
- Nicht bestandene Funktionen: keine, 14 von 14 BESTANDEN.
- Lint: 1 Fehler (EXIT 1) in src/components/layout/page-header.test.tsx Zeile 20 Spalte 18, E4 0/0. Commit eb5cda6 nach dem Lauf behebt ihn laut Meldung. Nicht neu gelaufen.
- Bildrate mobil H01: 26,6 % verworfen, über Schwelle 5 %. E4 0,0 %. Einzellauf, gleiches Werkzeug und gleiche Parameter.
- Wertesuche: 18 Ausnahmen (E4 10), 8 neu in ablauf.test.tsx, schluessel.test.tsx, zylinder-mass.test.tsx und og/bereichsbild (ts und tsx). Ohne Ausnahmen 0, wie E4.
- INP mobil (Median) in 8 von 12 Ansichten höher als E4. Höchster Wert H01 mobil 168 ms bei Budget 200 ms.
- Elemente über den rechten Rand, Hauptansichten: Summe 201 (E4 89, E0 29). H02 mobil 86, H01 mobil 55, H09 mobil 16. Technischer Befund, nicht gewertet.
- Ablauf: Teil 1 und Teil 2 liefen von 18:48:49 bis 18:50:57 UTC parallel. Der fremde Lauf PID 5309 entspricht dem eigenen bildsatz-Befehl von Teil 2. Bildrate und Messung lagen außerhalb dieses Fensters.
- Ergebnisdatei E5-PRUEFER-B-ergebnis.md nicht geschrieben (Systemregel für Subagenten). Der Volltext steht im Bericht und muss vom Orchestrator abgelegt werden.
- Git: Protokoll nennt da56209 als letzten Commit, HEAD ist d693a8e. Seit dem Build-Stand d0e4784 hat sich unter src nur die Testdatei eb5cda6 geändert.
- Zeitangaben: Dateinamen in Ortszeit (UTC+2), JSON-Feld zeit in UTC. Der Widerspruch aus Teil 4 besteht nicht.
