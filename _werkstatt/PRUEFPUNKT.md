# Prüfpunkt

- **Etappe:** E5 (übrige Ansichten und Befundpakete). Alle 12 Befundpakete der Sichtabnahme E4-L-23 sind abgenommen (H01, H02, H03, H06, H10, H11 nach L3 mit Nacharbeit des Orchestrators). KERN 1.13.
- **Laufend:**
  - Prüfstufe B E5 mit Sichtabnahme E5-L-29: Workflow `wf_38dc5eaf-f8b` (Task `w7m23erhx`), Skript `workflows/scripts/pruefstufe-b-e5-wf_38dc5eaf-f8b.js`. Teile 1+2 parallel, dann Teil 3→4 neben vier Sichtabnahmen (Opus, nacheinander), dann Teil 5. Bilder `/root/sm24-bilder/e5-b/`.
  - Server: Port 3000 mit dem Build von d0e4784 (208/208), Port 3001 Entwicklung. Port 3100 (E0) erst für Prüfstufe C.
- **Fertig seit dem letzten Prüfpunkt:** Welle H nach Nacharbeit abgenommen (B-28 bacb687 mit CSS-Zähler `.sm24-zaehlung`, B-29 2a1fb8c, Textabzug gleich), E5-L-12 lucide entfernt (f10b677, D-043). Alle Pflichtpakete der Etappen E0 bis E5 sind gebaut.
- **Als Nächstes:**
  1. Ergebnis Prüfstufe B und Sichtabnahme auswerten (ENTSCHEIDUNGEN, PLAN, ABNAHME); Befundpakete Runde 2 nur für Ansichten unter 8 (höchstens 2 je Ansicht und Kategorie), in Wellen zu ≤ 4 Plätzen.
  2. Danach Prüfstufe C (E0-Server auf Port 3100: `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`), Blindvergleich (E6-D-02), Endprüfung (E6-L-13), ABSCHLUSS.
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** d0e4784. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
