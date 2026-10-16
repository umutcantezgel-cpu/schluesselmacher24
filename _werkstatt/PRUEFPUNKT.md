# Prüfpunkt

- **Etappe:** E4 (Hauptansichten). Das Etappentor E2 ist nach zwei Anläufen nicht bestanden (7,0, D-022); die Befunde sind mit E4-L-16 umgesetzt (8dc1538, D-024).
- **Laufend:**
  1. Workflow `wf_8c908891-137` (Welle E): E4-BAUMEISTER-16 Assistent, -17 Vorlage, -18 Zutritt, -19 Sicherheitstechnik (4 Plätze, Prüfer-Basis `fab24ac`).
- **Fertig seit dem letzten Prüfpunkt:** Welle D vollständig (B-14, B-15 mit Nacharbeit D-031), L-20 (SummaryList als Schriftfeld, `istPlatzhalter`), L-21 (Motiv-Zuordnung nach der Sache, D-032), `OptionCard` mit ReactNode-Titel.
- **Danach:**
  - Welle E abnehmen (ganzer Unterschied gegen `fab24ac`, Ausnahmen Logikwächter für `assistent.tsx` prüfen).
  - Prüfstufe B der Etappe E4: Build, alle Prüfungen, Bildsatz der 12 Hauptansichten, a11y, Messung, Funktionsliste.
  - Danach E5 (übrige Ansichten B-20 bis B-29, L-07 Leistung, L-12 lucide entfernen).
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId})` für den jeweiligen Lauf.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände der Welle C:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken verlangt saubere Arbeitskopie). Die Abnahme jedes Pakets prüft deshalb den ganzen Unterschied gegen `d8e2312` (Stand vor Welle C), nicht nur `git diff` gegen HEAD.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021).
- **Letzter grüner Stand:** 8dc1538. Typprüfung 0, Linter 0, 46 Testdateien mit 1008 Tests grün, Logikwächter 0 abweichend.
