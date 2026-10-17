# Prüfpunkt

- **Etappe:** E5 (übrige Ansichten und Befundpakete). Alle 12 Befundpakete der Sichtabnahme E4-L-23 sind abgenommen (H01, H02, H03, H06, H10, H11 nach L3 mit Nacharbeit des Orchestrators). KERN 1.13.
- **Laufend:**
  - Prüfstufe C und abschließende Sichtabnahme E6-L-34: Workflow `wf_b30ac901-56c` (Task `wjgxxbs7m`), Paket `_werkstatt/pakete/E6-PRUEFER-C.md` und `E6-L-34-sichtabnahme.md`. Bilder `/root/sm24-bilder/e6-c/`. Fortsetzen mit `resumeFromRunId`.
  - Server: Port 3000 mit dem Build nach Runde 2 (Commit addae34, 208/208), Port 3100 E0 (`/root/sm24-e0`), Port 3001 Entwicklung.
- **Fertig seit dem letzten Prüfpunkt:** Runde 2 vollständig abgenommen (15/15; D-047, D-048), E6-L-31 und E6-L-33 (gemeinsame Bausteine, KERN 1.15). Werkzeuge für Prüfstufe C: `funktionsliste.mjs --tastatur`, `svg-pruefung.mjs`, `animationen.mjs`.
- **Als Nächstes:**
  1. Ergebnis Prüfstufe C und Sichtabnahme E6-L-34 auswerten (ENTSCHEIDUNGEN D-049, ABNAHME.md mit Belegen).
  2. Blindvergleich E6-D-02: Haiku-Dokumentar benennt Vorher/Nachher neutral in zufälliger Reihenfolge, Schlüssel getrennt; Galerie `_werkstatt/bilder/galerie.html`; BERICHT mit Anleitung zum Zusammenführen und Zurückrollen.
  3. Endprüfung E6-L-13 durch frischen Opus-Unteragenten (Belege, kein Testlauf), dann ABSCHLUSS (CLAUDE.md-Block entfernen).
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** d0e4784. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
