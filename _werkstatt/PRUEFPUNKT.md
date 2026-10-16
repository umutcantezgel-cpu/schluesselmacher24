# Prüfpunkt

- **Etappe:** E4 (Hauptansichten). Das Etappentor E2 ist nach zwei Anläufen nicht bestanden (7,0, D-022); die Befunde sind mit E4-L-16 umgesetzt (8dc1538, D-024).
- **Laufend:**
  1. Workflow `wf_e1d06205-b24` (Welle D, Teil 3): E4-BAUMEISTER-14 Warenkorb und -15 Kasse (Prüfer-Basis `e3ad5bb`; Teil-B-Ausdrücke als gemeldete Ausnahmen, D-029).
- **Fertig seit dem letzten Prüfpunkt:** Welle C (B-08 bis -11), B-12, B-13, L-11 (Seitenwechsel), L-17 (Eingabeschrift, InView), L-18 (gemeinsame Bausteine), L-19 (Scrollen nach Seitenwechsel). Build 198/198 auf Port 3000 neu gestartet.
- **Danach:**
  - B-14 und B-15 abnehmen (Ausnahmen für Teil B prüfen und eintragen, ganzer Unterschied gegen `e3ad5bb`).
  - Kundschaft und Pakete Welle E: B-16 Assistent, B-17 Schlüssel nach Vorlage, B-18 Zutritt, B-19 Sicherheitstechnik.
  - Danach L-07 (Leistung) und Prüfstufe B der Etappe E4.
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId})` für den jeweiligen Lauf.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände der Welle C:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken verlangt saubere Arbeitskopie). Die Abnahme jedes Pakets prüft deshalb den ganzen Unterschied gegen `d8e2312` (Stand vor Welle C), nicht nur `git diff` gegen HEAD.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021).
- **Letzter grüner Stand:** 8dc1538. Typprüfung 0, Linter 0, 46 Testdateien mit 1008 Tests grün, Logikwächter 0 abweichend.
