# Prüfpunkt

- **Etappe:** E4 (Hauptansichten). Das Etappentor E2 ist nach zwei Anläufen nicht bestanden (7,0, D-022); die Befunde sind mit E4-L-16 umgesetzt (8dc1538, D-024).
- **Laufend:** nichts.
- **Fertig seit dem letzten Prüfpunkt:** Welle E abgenommen und committet (B-16 e37ace1, B-17 d7a0541, B-18 fe069ba, B-19 b6ec4a4; D-033). E4-L-22 Wertesuche ohne offene Funde (63eac59, D-034). Funktionsliste: Bild je Schritt (`SM24_SCHRITTBILDER`), Lese-Actions auch aus `.next/dev`.
- **Als Nächstes:**
  1. Prüfstufe B der Etappe E4: Build-Gate, Neustart von Port 3000, Typprüfung, Linter, Unit- und DB-Tests, Logikwächter, Textabzug, Wertesuche, Konsole, Bildsatz der 12 Hauptansichten, a11y, Messung (Median aus 3), Bewegung (reduziert), Funktionsliste 14/14.
  2. Danach E5: Wellen F bis H (B-20 bis B-29), L-07 Leistung, L-12 lucide entfernen, Maßzeichnung schmal, Wiederherstellungs-Hinweis (use-flow).
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId})` für den jeweiligen Lauf.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken verlangt saubere Arbeitskopie). Die Abnahme prüft deshalb den ganzen Unterschied gegen den Stand vor der Welle (Welle C `d8e2312`, D `e3ad5bb`, E `fab24ac`).
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** 63eac59. Typprüfung 0, Linter 0, 54 Testdateien mit 1039 Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt noch den Build vor Welle C; der Neubau folgt in Prüfstufe B.
