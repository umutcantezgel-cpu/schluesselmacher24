# Prüfpunkt

- **Etappe:** E5 (übrige Ansichten und Befundpakete). Alle 12 Befundpakete der Sichtabnahme E4-L-23 sind abgenommen (H01, H02, H03, H06, H10, H11 nach L3 mit Nacharbeit des Orchestrators). KERN 1.13.
- **Laufend:**
  - E5-BAUMEISTER-26 (Service-Anfrage, Terminstatus) und -27 (Artikel): Workflow `wf_b1db5a2b-e07` (Task `w65a0r0x5`), Basis `f0e1382`.
  - E6-GRAFIKER-11 (Stiftzuhaltung `szene: 'scroll'`, K-01) und E5-DOKUMENTAR-01 (README): Workflow `wf_d95a29d7-2df` (Task `wz4dm1sav`), Basis `f0e1382`.
  - Server: Port 3001 (Entwicklung), Port 3000 (`server.sh start`, alter Build – Funktionsliste und Werkzeuge ohne `SM24_BASIS_URL` messen dort!). Port 3100 (E0) erst für Prüfstufe C.
- **Fertig seit dem letzten Prüfpunkt:** Nacharbeit und Abnahme H01 (5d8cf00), H02 (f741427), H03 (60705ce), H06 (0fca06c, neue Anzeigehilfe `src/lib/codelinie.ts`), H07 (3ca7232), H10 (31d5f33, Variante `korb-leer:`), H11 (46ced8f, `SummaryList` mit `betragAmEnde`); Zeitplan der Schlüsselzeichnung E5-L-28 (84f14d8, KERN 1.13); E5-BAUMEISTER-24 (8022fc1) und -25 (12bd2cd) abgenommen.
- **Als Nächstes:**
  1. B-26, B-27, E6-GRAFIKER-11, E5-DOKUMENTAR-01 abnehmen; danach Welle H (B-28, B-29) starten.
  2. K-01 einbauen: Stiftzuhaltung mit `szene: 'scroll'` auf `/gleichschliessende-zylinder` (Orchestrator), Registry/README.
  3. E5-L-12 lucide entfernen (Nutzungssuche, `npm uninstall`, Build).
  4. Prüfstufe B E5 mit Sichtabnahme (frischer Opus-Agent; Befundpakete Runde 2 nur, wo < 8), dann Kür-Rest, Prüfstufe C, Endprüfung, ABSCHLUSS.
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** 5105872. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
