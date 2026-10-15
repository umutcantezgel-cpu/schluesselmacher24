# Prüfpunkt

- **Etappe:** E2 Referenz (Startseite), Etappentor; parallel Welle E3-A
- **Laufend:** Workflow `wf_353415f5-ce1` (Skript unter `~/.claude/projects/…/workflows/scripts/e2-tor-und-welle-e3a-wf_353415f5-ce1.js`):
  1. E2-PRUEFER-01 Teil A Bestand: Typprüfung, Linter, Tests, DB-Tests, Logikwächter, Textabzug, Wertesuche, Build-Gate und Neustart Port 3000.
  2. Messfenster B1–B5: Konsole und Bildsätze (Referenz ins Repo), Bewegung (B-01-Einzelbilder, Bildrate), a11y, Messung, Funktionsliste; dann `E2-PRUEFER-01-ergebnis.md`.
  3. Sichtabnahme E2-L-07 (frischer Opus-Agent) ab den Referenzbildern, Bericht `_werkstatt/berichte/E2-L-07-sichtabnahme.md`.
  4. Welle E3-A: E3-BAUMEISTER-01/02/03 und E3-GRAFIKER-07, je Prüfstufe A durch einen Haiku-Prüfer, bis zu zwei Reparaturrunden.
- **Bei Abbruch:** `Workflow({scriptPath, resumeFromRunId: "wf_353415f5-ce1"})`; vorher `/tmp/sm24-messfenster.lock` prüfen (verwaist, wenn kein Prüfer läuft).
- **Danach:**
  - Ergebnisse abnehmen. Befunde der Sichtabnahme unter 8 werden Pakete; die Startseite (E2-L-06) bessert der Orchestrator selbst nach, höchstens zwei Anläufe.
  - Welle E3-A je Paket committen (AGENTS.md vorher zurücknehmen, D-007).
  - Dann Welle E3-B (B-04 bis B-07).
- **Hinweise:**
  - Der erste Prüfer (E2-PRUEFER-01, Einzelagent) hing an einer Löschfreigabe. Seine 174 Fehlbilder liegen unter `/root/sm24-bilder/E2-PRUEFER-01-abgebrochen`.
  - Pakete verbieten jetzt das Löschen.
- **Letzter grüner Commit:** f1f0bf9. Danach ZWISCHENSTAND: e6550f3 (404, Fehlerseite, Hover-Einstellung, wird im laufenden Bestand geprüft).
