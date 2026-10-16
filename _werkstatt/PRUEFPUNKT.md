# Prüfpunkt

- **Etappe:** E4 (Hauptansichten). Das Etappentor E2 ist nach zwei Anläufen nicht bestanden (7,0, D-022); die Befunde sind mit E4-L-16 umgesetzt (8dc1538, D-024).
- **Laufend:**
  1. Workflow `wf_f448236a-3de` (Skript `~/.claude/projects/…/workflows/scripts/e3-b07-und-kundschaft-welle-c-wf_f448236a-3de.js`): E3-BAUMEISTER-07 (`/autoschluessel`) in Reparatur oder Prüfung; die vier Kundschafter sind fertig (Bericht `_werkstatt/berichte/E4-KUNDSCHAFT-welle-c.md`).
  2. Workflow `wf_2c413c54-12a` (Skript `…/welle-c-e4-b08-bis-b11-wf_2c413c54-12a.js`): Welle C mit E4-BAUMEISTER-08 bis -11, 3 Plätze, je Bau, Prüfung und bis zu 2 Reparaturen.
- **Danach:**
  - B-07 abnehmen und committen (nur `src/app/(site)/autoschluessel/page.tsx`).
  - Welle C je Paket abnehmen, eigene Bildkontrolle, Commit je Paket, Build-Gate, Push.
  - Pakete der Welle D schreiben: B-12 Ratgeber, B-13 Zylinder-Konfigurator, B-14 Warenkorb, B-15 Kasse (Kundschaft zuerst).
  - Parallel als Orchestrator: L-11 Seitenwechsel, L-07 Leistung (JS-Menge mobil).
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId})` für den jeweiligen Lauf.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021).
- **Letzter grüner Stand:** 8dc1538. Typprüfung 0, Linter 0, 46 Testdateien mit 1008 Tests grün, Logikwächter 0 abweichend.
