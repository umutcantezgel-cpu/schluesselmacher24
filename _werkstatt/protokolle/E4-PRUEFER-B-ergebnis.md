# E4-PRUEFER-B · Ergebnis Prüfstufe B der Etappe E4

Workflow `wf_56da0846-979`, 16.10.2026. Geprüft wurde der Build vor E4-L-24/-25 (BUILD_ID dPntnmy7paL4z4Fq-eJ7P, Stand nach Welle E und E4-L-22). Zusammengestellt von Teil 5 (Prüfer); als Datei abgelegt vom Orchestrator, weil Unteragenten keine Berichtsdateien schreiben. Sichtabnahme: `_werkstatt/berichte/E4-L-23-sichtabnahme-*.md`.

Teil 5 (Ergebnis) aus den Protokollen zusammengestellt. Die Teile 1 bis 4 sind vollständig gelaufen; Teil 3 ist inzwischen abgeschlossen (14 von 14 BESTANDEN, keine Wiederholung nötig). Keine Projektdatei geändert, nichts committet, gelöscht oder gepusht. Die Sperre /tmp/sm24-messfenster.lock existiert nicht (geprüft). Nicht geschrieben wurde die Datei _werkstatt/protokolle/E4-PRUEFER-B-ergebnis.md, weil die Regel für Subagenten keine Berichtsdateien erlaubt; der Inhalt steht vollständig hier. Deshalb ok=false. Kein Urteil über Gestaltung.

TABELLE 1 · Prüfung · E0 · E2-Tor · jetzt · Beleg
| Prüfung | E0 | E2-Tor | jetzt | Beleg |
|---|---|---|---|---|
| Typprüfung tsc --noEmit | 0 Fehler | 0 Fehler, Protokoll 0 Byte, kein Exit-Code | 0 Fehler, EXIT 0 | E4-PRUEFER-B-typecheck.log |
| Linter eslint . | 0/0 | 0/0, Protokoll 0 Byte, kein Exit-Code | 0 Befunde, EXIT 0 | E4-PRUEFER-B-lint.log |
| Build | 198/198, BUILD_ID m-Nz5gJdEPI0m_fmJdMHt | 198/198, BUILD_ID Q4YKI77MEJWhBDCvJ-7hU | 198/198, Compiled successfully, EXIT 0, BUILD_ID dPntnmy7paL4z4Fq-eJ7P | E4-PRUEFER-B-build.log |
| Unit Dateien | 31/31 | 45/45 | 54/54 | E4-PRUEFER-B-test-unit.log |
| Unit Tests | 680/680 | 1002/1002 | 1039/1039 | E4-PRUEFER-B-test-unit.log |
| DB-Tests Dateien | 7/7 | 7/7 | 7/7 | E4-PRUEFER-B-test-db.log |
| DB-Tests Tests | 52/52 | 52/52 | 52/52 (Nutzer im Protokoll nicht vermerkt) | E4-PRUEFER-B-test-db.log |
| Logikwächter | kein Wert | 15 Dateien, 0 abweichend (Basis b49fe04) | 15 Dateien, 0 abweichend (Basis b49fe04) | E4-PRUEFER-B-logik.log |
| Textabzug Rechtsseiten | kein Wert | 6 gleich | 6 gleich | E4-PRUEFER-B-textabzug.log |
| Wertesuche ohne Ausnahmen / Ausnahmen | 707 / 10 (196 Dateien seit b49fe04) | 5 / 8 (106 Dateien seit fcbcfb2) | 0 / 10 (154 Dateien seit fcbcfb2) | E4-PRUEFER-B-werte.log, E4-PRUEFER-B-werte.json |
| Funktionsliste F-01 bis F-14 | 14/14 (Port 3100) | 14/14 | 14/14 (Lauf 08:02:23 UTC, Protokoll 08:13 UTC) | E4-PRUEFER-B-funktionsliste.log, funktionsliste-2026-10-16_10-13-29.md |
| HTTP / (200), /gibt-es-nicht-pruefung (404), Text „Hinweis für die Redaktion“ | nicht erhoben | nicht geprüft | 200 / 404 / 0 Treffer | E4-PRUEFER-B-http.log |
| git status AGENTS.md | nicht erhoben | nicht erhoben | leer (unverändert, letzter Commit da56209) | E4-PRUEFER-B-agents.log |

TABELLE 2a · je Hauptansicht · Konsole (Desktop) · Seitenüberlauf · Elemente über den rechten Rand (Bildsatz m/t/d) · axe ernst/kritisch mobil und Desktop · Bewegung reduziert. Format E0 → jetzt.
| Ansicht | Konsole Fehler/Warn/Seitenfehler | fehlgeschl. Anfragen (Desktop) | Seitenüberlauf m/t/d | Über rechten Rand m/t/d | axe mobil ernst/kritisch | axe Desktop ernst/kritisch | Bewegung reduziert: Befunde/laufend/verborgen (Textelemente jetzt) |
|---|---|---|---|---|---|---|---|
| H01-start | 0/0/0 | 0 → 2 | nein/nein/nein | – → 31/3/2 | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (203) |
| H02-autoschluessel | 0/0/0 | 0 → 0 | nein | – → 3/3/1 | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (182) |
| H03-modell-golf | 0/0/0 | 2 → 1 | nein | – → 4/2/1 | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (120) |
| H04-assistent | 0/0/0 | 1 → 1 | nein | – → –/–/– | 1/1 → 0/1 | 1/0 → 0/0 | 0/0/0 (131) |
| H05-code-shop | 0/0/0 | 2 → 1 | nein | – → 1/1/1 (gekappt: 12 von 42, 19, 17) | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (562) |
| H06-code-produkt | 0/0/0 | 2 → 2 | nein | – → 3/2/– | 1/1 → 0/1 | 1/1 → 0/1 | 0/0/0 (129) |
| H07-zylinder-konfigurator | 0/0/0 | 0 → 1 | nein | – → 2/1/– | 1/1 → 0/1 | 1/0 → 0/0 | 0/0/0 (127) |
| H08-schliessanlagen | 0/0/0 | 1 → 2 | nein | 27/0/0 → 12/7/4 (gekappt: 12 von 17, 13; desktop 10 von 10) | 2/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (252) |
| H09-tuertechnik | 0/0/0 | 3 → 3 | nein | 1/1/0 → 1/1/1 (gekappt: 12 von 15) | 1/0 → 0/0 | 2/0 → 0/0 | 0/0/0 (186) |
| H10-warenkorb | 0/0/0 | 2 → 2 | nein | 0 → 0/0/0 | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (66) |
| H11-kasse | 0/0/0 | 1 → 1 | nein | 0 → 0/0/0 | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (66) |
| H12-ratgeber | 0/0/0 | 0 → 2 | nein | 0 → 1/1/– | 1/0 → 0/0 | 1/0 → 0/0 | 0/0/0 (80) |
Anmerkung: E0 führt „–“ als keine Befunde; E0-Werte für Seitenüberlauf und Bewegung waren überall 0 bzw. nein. Bewegung reduziert: 0 laufende Animationen, 0 Befunde, 0 verborgene Inhalte in allen 12 Ansichten; Textelemente zusammen 2.104 (E0: 2.058, Tabellensumme). Konsole: alle 12 Ansichten 0 Konsolenfehler, 0 Warnungen, 0 Seitenfehler; die 18 fehlgeschlagenen Anfragen sind alle net::ERR_ABORTED (17 auf /autoschluessel/anfrage?_rsc=…, 1 auf /service-und-termin/anfrage?thema=…).

TABELLE 2b · je Hauptansicht · Leistung mobil, Median (3 Läufe) · E0 → jetzt
| Ansicht | LCP ms | CLS | INP ms | JS-KB |
|---|---|---|---|---|
| H01-start | 996 → 1116 | 0,000 → 0,000 | 56 → 72 | 246,3 → 315,4 |
| H02-autoschluessel | 960 → 1036 | 0,000 → 0,000 | 56 → 88 | 219,1 → 251,5 |
| H03-modell-golf | 976 → 992 | 0,000 → 0,000 | 48 → 112 | 219,1 → 253,7 |
| H04-assistent | 904 → 1004 | 0,000 → 0,000 | 56 → 88 | 227,0 → 259,5 |
| H05-code-shop | 1084 → 1144 | 0,000 → 0,000 | 56 → 80 | 234,9 → 256,9 |
| H06-code-produkt | 964 → 1112 | 0,000 → 0,000 | 64 → 88 | 234,9 → 263,5 |
| H07-zylinder-konfigurator | 1012 → 1088 | 0,000 → 0,000 | 72 → 88 | 210,0 → 237,0 |
| H08-schliessanlagen | 976 → 1164 | 0,000 → 0,000 | 64 → 96 | 248,5 → 274,1 |
| H09-tuertechnik | 1020 → 1116 | 0,000 → 0,000 | 48 → 96 | 222,2 → 254,1 |
| H10-warenkorb | 2508 → 2776 (ÜBER) | 0,117 → 0,146 (ÜBER) | 56 → 96 | 231,0 → 266,7 |
| H11-kasse | 920 → 952 | 0,104 → 0,098 | 64 → 96 | 217,0 → 247,0 |
| H12-ratgeber | 936 → 1004 | 0,000 → 0,000 | 56 → 136 | 212,6 → 249,3 |
Desktop (Median LCP ms / CLS / INP ms): alle Serien innerhalb der Budgets; H10 Desktop CLS 0,038 → 0,056; H11 Desktop CLS 0,031 → 0,030.

BUDGET-VERSTÖSSE (jetzt, Median): H10 Warenkorb mobil, LCP 2776 ms (Läufe 2760 bis 2796; Budget 2500) und CLS 0,146 (alle drei Läufe; Budget 0,1). Das ist die einzige verletzte Serie: 23 von 24 Serien eingehalten. E0 hatte zwei verletzte Serien (H10 mobil LCP 2508 und CLS 0,117; H11 mobil CLS 0,104). INP überall unter 200 ms.

AXE SERIOUS ODER CRITICAL (jetzt): ernst (serious) 0 in allen 24 Läufen. Kritisch 4:
- H04-assistent, mobil, button-name (kritisch), Selektor `.hover\:border-foreground-subtle`
- H06-code-produkt, mobil, label (kritisch), Selektoren `#foto-ms-01-camera`; `#foto-ms-01-gallery`
- H06-code-produkt, Desktop, label (kritisch), Selektoren `#foto-ms-01-camera`; `#foto-ms-01-gallery`
- H07-zylinder-konfigurator, mobil, button-name (kritisch), Selektor `.mx-auto > .hover\:border-foreground-subtle.select-none.transition`
E0 hatte dieselben 4 kritischen Befunde und zusätzlich 26 ernst (target-size in 24 Auswertungen, scrollable-region-focusable H08 mobil, color-contrast H09 Desktop). Diese 26 sind jetzt nicht mehr vorhanden.

EINZELBILDER (Desktop, je 5 Bilder): H01 0 bis 1580 ms (6 Animationen); H02 0 bis 6000 ms (53); H05 0 bis 1920 ms (10); H08 0 bis 1930 ms (130); H09 300 bis 1580 ms (10). Bildrate H01: 110 gezeichnet, 0 verworfen, 0,0 Prozent (Schwelle 5 Prozent; E2-Tor 109, 0,0 Prozent). Gefüllter Warenkorb und Kasse: 27 Bilder (mobil 5 und 7, Tablet 3 und 5, Desktop 3 und 4).

BILDSATZ: Seitenüberlauf „nein“ in 36 von 36 Ansicht-Geräte-Kombinationen; 242 Bilder unter /root/sm24-bilder/e4-b. Die Ausschnittgrenze war 12 (E0: 15), siehe Befunde.

Protokolle: alle unter /home/user/schluesselmacher24/_werkstatt/protokolle/. Keine Datei unter /dev angefasst.

## Messung (Teil 4)

Teil 4 (Messfenster B) ist vollständig gelaufen: messung.mjs mit --laeufe 3 --profil beide, 12 Ansichten × 2 Profile, alle 72 Läufe gewertet (3 von 3 je Serie, keine fehlgeschlagenen Läufe im Protokoll). Sperre /tmp/sm24-messfenster.lock gesetzt 08:03:47 UTC, gelöscht 08:11:47 UTC; Datei danach nicht mehr vorhanden. Protokolle: /home/user/schluesselmacher24/_werkstatt/protokolle/E4-PRUEFER-B-messung.log (Tabelle) und /home/user/schluesselmacher24/_werkstatt/protokolle/messung-2026-10-16_10-11-40.json (Rohdaten, Einzelläufe). Exit-Code des Prozesses wurde nicht erfasst; das Log enthält keinen Abschnitt „Fehlgeschlagene Läufe“.

Mediane mobil (LCP ms / CLS / INP ms / JS KB): H01 start 1116 / 0,000 / 72 / 315,4; H02 autoschluessel 1036 / 0,000 / 88 / 251,5; H03 modell-golf 992 / 0,000 / 112 / 253,7; H04 assistent 1004 / 0,000 / 88 / 259,5; H05 code-shop 1144 / 0,000 / 80 / 256,9; H06 code-produkt 1112 / 0,000 / 88 / 263,5; H07 zylinder-konfigurator 1088 / 0,000 / 88 / 237,0; H08 schliessanlagen 1164 / 0,000 / 96 / 274,1; H09 tuertechnik 1116 / 0,000 / 96 / 254,1; H10 warenkorb 2776 / 0,146 / 96 / 266,7; H11 kasse 952 / 0,098 / 96 / 247,0; H12 ratgeber 1004 / 0,000 / 136 / 249,3.

Mediane desktop (LCP ms / CLS / INP ms / JS KB): H01 232 / 0,000 / 32 / 376,7; H02 164 / 0,000 / 32 / 294,8; H03 152 / 0,000 / 48 / 294,8; H04 184 / 0,000 / 56 / 317,7; H05 156 / 0,000 / 24 / 304,5; H06 172 / 0,000 / 32 / 304,5; H07 188 / 0,000 / 40 / 306,9; H08 172 / 0,000 / 40 / 314,8; H09 156 / 0,000 / 24 / 294,8; H10 112 / 0,056 / 40 / 306,9; H11 112 / 0,030 / 40 / 303,1; H12 164 / 0,000 / 32 / 294,8.

Budgets (LCP ≤ 2500, CLS ≤ 0,1, INP ≤ 200, am Median): eingehalten in 22 von 24 Serien. Verstöße: H10 warenkorb mobil LCP 2776 ms (Läufe 2760–2796) und CLS 0,146 (alle drei Läufe 0,146). INP überall unter 200 ms. Ein Vergleich mit E0 und E2 ist in diesem Teil nicht erfolgt (gehört zu Teil 5).

## Auffälligkeiten (Teil 5)

- Die Ergebnisdatei _werkstatt/protokolle/E4-PRUEFER-B-ergebnis.md ist nicht geschrieben. Grund: Die Regel für Subagenten verbietet Berichtsdateien; der volle Inhalt steht in zusammenfassung. Soll die Datei nachgeliefert werden, ist ein eigener Schritt nötig.
- Teil 3 war im Teil-3-Bericht als unvollständig geführt. Das Protokoll zeigt den Abschluss um 08:13 UTC (funktionsliste-2026-10-16_10-13-29.md): 14 von 14 BESTANDEN, keine NICHT BESTANDEN, daher keine --nur-Wiederholung.
- Der Funktionsliste-Lauf startete um 08:02:23 UTC und das Werkzeug meldete im Protokoll „Messfenster: /tmp/sm24-messfenster.lock existiert; warte“. Die Sperre von Teil 4 lag zwischen 08:03:47 und 08:11:47 UTC. Das Werkzeug hat also auf die Sperre gewartet. Ob alle F-Schritte außerhalb der Sperrzeit liefen, ist im Protokoll ohne Zeitstempel nicht ablesbar.
- Teil-4-Bericht nennt „22 von 24 Serien eingehalten“. Das Messprotokoll ergibt 23 von 24: nur H10 mobil verletzt (LCP und CLS), H11 mobil liegt mit CLS 0,098 knapp unter 0,1.
- Teil-2-Bericht nennt 34 Einzelbilder. Tatsächlich liegen in den fünf Ordnern je 5 Bilder vor, also 25 (/root/sm24-bilder/e4-b/einzelbilder/H01, H02, H05, H08, H09).
- Der Bildsatz lief mit --max 12, E0 mit 15. Dadurch sind Ausschnitte gekappt: H05 mobil 12 von 42, H05 Tablet 12 von 19, H05 Desktop 12 von 17, H08 mobil 12 von 17, H08 Tablet 12 von 13, H09 mobil 12 von 15. Die Befundzahlen dieser Ansichten sind mit E0 nur eingeschränkt vergleichbar.
- Befunde „über den rechten Rand“ (technische Auffälligkeit, nicht gewertet): H01 mobil 31 (E0 0; E2-Tor meldete 47 bei 10 Ausschnitten, andere Ausschnittzahl). Summe über alle Ansichten und Geräte jetzt 89, E0 29 (H08 mobil 27, H09 mobil 1 und Tablet 1). Die Ziele sind überwiegend `svg.block > path.stroke-area-muted40`. Seitenüberlauf ist trotzdem überall „nein“.
- Wertesuche: E4 meldet „Keine Funde“, 0 ohne Ausnahmen bei 154 Dateien seit fcbcfb2; 10 Ausnahmen. E2-Tor hatte 5 ohne Ausnahmen bei 106 Dateien. Drei E2-Funde fehlen in E4: src/components/flow/flow-shell.tsx:165 (calc mit env), src/components/forms/controls.tsx:66 (url data:image/svg+xml), src/components/ui/info-tip.tsx:48 (w-[min(20rem,calc(100vw-3rem))]). Zwei stehen jetzt als „einzeln benannte“ Ausnahmen: src/app/(site)/layout.tsx:63 (#f7f9fb) und src/components/forms/photo-upload.tsx:102 (#fff). Die Ursache der Umklassifizierung ist nicht untersucht.
- axe H01: E2-Tor meldete 1 ernst color-contrast am Selektor `.eyebrow > .tabular-nums.text-foreground-subtle` (mobil und Desktop). In E4 ist H01 mobil und Desktop 0/0. Ursache nicht untersucht.
- Konsole: 18 fehlgeschlagene Anfragen in Desktop-Läufen (E0: 14), alle net::ERR_ABORTED; Attrappen-Abbrüche 0. Ansichten H01 2, H03 1, H04 1, H05 1, H06 2, H07 1, H08 2, H09 3, H10 2, H11 1, H12 2 (H02 0).
- Build-Protokoll E4-PRUEFER-B-build.log: Die Meldung „PAYLOAD_SECRET fehlt — Backend deaktiviert, Seite läuft aus content/*.json.“ erscheint sechsmal. Teil 1 nennt keine Warnungen; das Protokoll enthält keine Zeile mit warn oder error, aber diese Meldung.
- DB-Tests: Das Protokoll E4-PRUEFER-B-test-db.log vermerkt den Nutzer nicht (Teil 1 nennt den Wrapper als Nutzer ubuntu). Außerdem enthält es Zeilen „Warning: Ignoring extra certs from /root/.ccr/ca-bundle.crt … Permission denied“ (Umgebung, kein Testfehler).
- Messung (Teil 4): Der Exit-Code wurde laut Teil-4-Bericht nicht erfasst. Das Protokoll zeigt 3 von 3 Läufen je Serie, ohne Abschnitt „Fehlgeschlagene Läufe“.
- Desktop-Leistung: keine Budgetverletzung. H10 Desktop CLS 0,056 (E0 0,038), H11 Desktop CLS 0,030 (E0 0,031).
- Bewegung reduziert: Die Textelemente betragen zusammen 2.104 (E0 2.058). Das sind Abdeckungszahlen, nicht bewertet.
- Gestaltung: Dieser Teil enthält kein Urteil über Gestaltung. Die Befunde über den rechten Rand und die axe-Befunde sind nur gemeldet.

## Auffälligkeiten der Messung (Teil 4)

- Budget-Verstoß H10 warenkorb, mobil: LCP-Median 2776 ms (Budget 2500), Läufe 2760 / 2796 / 2760 ms; Protokoll E4-PRUEFER-B-messung.log.
- Budget-Verstoß H10 warenkorb, mobil: CLS-Median 0,146 (Budget 0,1), in allen drei Läufen identisch 0,146; kein Einzelausreißer.
- Grenznah, nicht verletzt: H11 kasse, mobil, CLS-Median 0,098 (Budget 0,1).
- Nicht verletzt, aber auffällig: H10 warenkorb, desktop, CLS 0,056 und H11 kasse, desktop, CLS 0,030; alle anderen Desktop-Ansichten CLS 0,000.
- Parallelbetrieb vor der Messung: Beim Start lief ein fremder Lauf funktionsliste.mjs (PID 7186, Teil 3) mit eigenem Chromium. Nach dem Setzen der Sperre pausierte er laut Protokollzeile „Messfenster: ... existiert; warte“; vor dem Start der Messung war kein Chromium des Funktionslaufs mehr aktiv. Die ersten rund 55 Sekunden ab 08:03 sind trotzdem nicht ganz lastfrei; betroffen ist nur die Zeit vor dem Messstart, nicht die Messung selbst.
- Der Messprozess schreibt sein Tabellen-Log erst am Ende; Abbruch- oder Exit-Code wurde nicht erfasst, die Vollständigkeit ist aber durch 3 von 3 Läufen je Serie und das JSON-Protokoll belegt.
- Gesamtmenge JS KB ist die Summe aller Skript-Ressourcen; das Bewegungscode-Budget (60 KB) wurde nach Werkzeugvorgabe nicht gesondert gemessen.
