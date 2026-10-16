# Prüfpunkt

- **Etappe:** E2 Etappentor, Anlauf 2 (letzter nach L3); parallel Welle E3-B.
- **Laufend:** Workflow `wf_350555d8-5f0` (Skript `~/.claude/projects/…/workflows/scripts/e2-tor-anlauf-2-und-welle-e3b-wf_350555d8-5f0.js`):
  1. E2-PRUEFER-03, Schritte 1–3: Bestand und Build-Gate, danach Neustart von Port 3000.
  2. Schritte 4–7: Messfenster für `/`, Bildsatz `_werkstatt/bilder/referenz-2/`, Einzelbilder B-01 nach Animationszeit.
  3. Sichtabnahme E2-L-07b durch einen frischen Opus-Agenten, Bericht `_werkstatt/berichte/E2-L-07-sichtabnahme-2.md`.
  4. Parallel E3-BAUMEISTER-04, -05 und -06, je mit Prüfung und bis zu 2 Reparaturen, sowie E2-PRUEFER-03, Schritte 8–9 (Funktionsliste und Ergebnis).
- **Danach:**
  - Tor bestanden (≥ 8): Welle E3-B abnehmen, dann E3-BAUMEISTER-07 (`/autoschluessel`) mit der Referenz als Muster.
  - Tor nicht bestanden: Lücke als offener Punkt in PLAN.md (L3), Befunde als Pakete in E4; die Arbeit geht weiter.
  - Danach E4 (Hauptansichten).
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId: "wf_350555d8-5f0"})`.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007).
- **Letzter grüner Stand:** 2b69987. Typprüfung 0, Linter sauber, 45 Testdateien mit 1002 Tests grün, Logikwächter 0 abweichend.
