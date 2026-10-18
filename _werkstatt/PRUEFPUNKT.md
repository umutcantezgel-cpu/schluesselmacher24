# Prüfpunkt

- **Etappe:** E7 „Absichern“ nach Abschlussversuch 1 (D-049). Plan: Abschnitt „Abschlussversuch 2“ in der Plandatei; Pakete `_werkstatt/pakete/E7-*.md`.
- **Fertig:** E7-L-35 (2cdcbab), E7-L-36 bis L-39 und L-41 (db3de18), E7-L-42 (bbb260e). Morgenbericht 18.10. (0609ada); nächste Erinnerung `trig_012YdSA5a5zqbxz4A5A9Pasq` (19.10. 07:00 Berlin).
- **Laufend:**
  - E7-W-01 Werkzeuge: Workflow `wf_f71d2297-859` (Skript `workflows/scripts/e7-werkzeug-01-wf_f71d2297-859.js`).
  - Welle 1 (E7-B-02, -03, -04): Workflow `wf_083a3c28-cfc` (Skript `workflows/scripts/e7-welle-1-wf_d5024926-3a3.js`, args `{basis: "bbb260e"}`).
  - Prüfstand `/root/sm24-v1` (Kopie mit Hardlinks, Port 3201) für Diagnosen; Skripte `scratchpad/e6/perf/` (diag, diag2, spur, ladespur, wasserfall, ausloeser, klassentest).
  - Server: 3000 alter Build (2cdcbab), 3100 E0, 3001 Entwicklung.
- **Als Nächstes:**
  1. W-01 und Welle 1 abnehmen (Diff, Bilder, Bildrate), committen; KERN 1.17 (E7-L-40: B-08, B-10, B-21, B-26, B-27, B-28, B-18).
  2. Build-Gate, Port 3000 neu; Messung Anlauf 1 durch Haiku-Prüfer (E7-P-1): `messung --vergleich http://localhost:3100 --laeufe 5 --profil mobil`, Bildrate H01, H02, H05, H08, H09 am gerenderten Element, Funktionsliste und Tastatur. Entscheidung D-050 (Anlauf 2 oder weiter).
  3. Prüfstufe C, Abschlussversuch 2 (E7-P-C); E7-D-03 Bildsatz, Blindvergleich und Galerie neu; ABNAHME; BERICHT-Abschnitt Abschluss; Endprüfung E6-L-13; ABSCHLUSS.
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** d0e4784. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
