# Prüfpunkt

- **Etappe:** E5 (übrige Ansichten und Befundpakete). Alle 12 Befundpakete der Sichtabnahme E4-L-23 sind abgenommen (H01, H02, H03, H06, H10, H11 nach L3 mit Nacharbeit des Orchestrators). KERN 1.13.
- **Laufend:**
  - Bauwelle 1 Runde 2 (E6-BEFUND2-H01, -H02, -H03, -H12, Basis `69d8213`): Workflow `wf_78d2c95c-665` (Task `woo93513n`), Skript `scratchpad/e6/pakete-kette-e6.js` (höchstens 4 Plätze, Abhängigkeiten über `nach`). Fortsetzen mit `resumeFromRunId` und denselben args.
  - E6-L-31 ist erledigt (gemeinsame Bausteine, KERN 1.14, D-045). Paketerzeuger: `scratchpad/e6/befund2_pakete.py [HID …]` mit `zusatz.json` (Anpassungen je Ansicht) und `kern.md` (Auszug 1.14).
  - Entwürfe Befundpakete Runde 2, Erzählansichten H01, H02, H03, H05, H06, H08, H09, H12: Workflow `wf_e9710b7f-3ab` (Task `w7dwdvn77`, fortgesetzt 17.10.).
  - Entwürfe Runde 2, Arbeitsansichten H04, H07, H10, H11 und übrige U-SERVICE, U-ARTIKEL, U-STANDORTE: Workflow `wf_d633ea4c-f45` (Task `wodjj3qid`, fortgesetzt 17.10., Skript `workflows/scripts/befund2-entwuerfe-arbeit.js`, Ansichten als args).
  - Server: Port 3000 mit dem Build nach E5-L-30 (208/208), Port 3001 Entwicklung (nach Neustart am 17.10. 09:00 UTC neu gestartet). Bei Abbruch beide Workflows mit `resumeFromRunId` fortsetzen.
  - Morgenbericht 17.10. geschrieben; nächste Erinnerung `trig_01VjngwmVdyzGnq78x5xnmc7` am 18.10. 05:00 UTC.
- **Fertig seit dem letzten Prüfpunkt:** Prüfstufe B E5 vollständig (D-044, `E5-PRUEFER-B-ergebnis.md`): Bestand grün, Funktionsliste 14/14, Budgets eingehalten, axe 0; Sichtabnahme E5-L-29 aller vier Gruppen (6,8 · 7,0 · 7,1 · 6,4), keine Hauptansicht ≥ 8. E5-L-30: feste Ziele spät vorladen, Bildrate B-01 mobil im Median 0,0 % (`bewegung.mjs bildrate --laeufe`). Linter wieder 0 (eb5cda6).
- **Als Nächstes:**
  1. Entwürfe prüfen, gemeinsame Befunde selbst umsetzen (E6-L-31), dann Paketdateien `E6-BEFUND2-<id>` schreiben (Generator im Scratchpad `e5/befund_pakete.py`, Muster `pakete.paket`).
  2. Bau in Wellen zu ≤ 4 Plätzen mit `pakete-kette` (Prüfstufe A, ≤ 2 Reparaturen), Abnahme mit eigenen Bildern; danach abschließende Sichtabnahme der geänderten Ansichten.
  3. Prüfstufe C (E0 auf Port 3100, Bildrate mit `--laeufe 5`), Blindvergleich, Endprüfung, ABSCHLUSS.
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** d0e4784. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
