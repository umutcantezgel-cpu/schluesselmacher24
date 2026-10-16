# Prüfpunkt

- **Etappe:** E4 (Hauptansichten). Das Etappentor E2 ist nach zwei Anläufen nicht bestanden (7,0, D-022); die Befunde sind mit E4-L-16 umgesetzt (8dc1538, D-024).
- **Laufend:**
  1. Workflow `wf_2c413c54-12a` (Welle C, fortgesetzt nach Schemafehler eines Prüfers; Skript mit Fehlerfang `sicher()`): E4-B-09 Prüfung, E4-B-10 Prüfung, E4-B-11 Bau. E4-B-08 ist abgenommen (7f5653c).
  2. Workflow `wf_1f9e8729-882` (Welle D, Teil 1): E4-BAUMEISTER-12 Ratgeber.
- **Danach:**
  - Welle C je Paket abnehmen (ganzer Unterschied gegen `d8e2312`), eigene Bildkontrolle, Commit je Paket.
  - Welle D, Teil 2 starten: E4-BAUMEISTER-13, -14, -15 (Pakete fertig, e3ad5bb), Prüfer-Basis `e3ad5bb`.
  - Build-Gate, Seitenwechsel B-13 im Produktionsbuild prüfen, dann Pakete Welle E (B-16 bis B-19) mit Kundschaft.
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId})` für den jeweiligen Lauf.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände der Welle C:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken verlangt saubere Arbeitskopie). Die Abnahme jedes Pakets prüft deshalb den ganzen Unterschied gegen `d8e2312` (Stand vor Welle C), nicht nur `git diff` gegen HEAD.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021).
- **Letzter grüner Stand:** 8dc1538. Typprüfung 0, Linter 0, 46 Testdateien mit 1008 Tests grün, Logikwächter 0 abweichend.
