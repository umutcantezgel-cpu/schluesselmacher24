# Prüfpunkt

- **Etappe:** E6 Abschluss. Runde 2 abgenommen, Sichtabnahme E6-L-34 fertig (vier Berichte `_werkstatt/berichte/E6-L-34-sichtabnahme-*.md`), KERN 1.16 (Register vervollständigt, E6-L-35, Commit 2cdcbab, Build 208/208).
- **Laufend:**
  - Prüfstufe C, Abschluss: Workflow `wf_2708b732-5cf` (Skript `workflows/scripts/pruefstufe-c-abschluss-wf_3ee9d33c-56a.js`) mit Teil 2 und 4 als Nachlese, Teil 3b Nachlauf Funktionsliste und Tastatur gegen 2cdcbab, Teil 5b Register-Nachprüfung, dann Teil 6 Ergebnis (`_werkstatt/protokolle/E6-PRUEFER-C-ergebnis.md`). Berichte der Teile 1, 3, 5 aus dem ersten Lauf: `_werkstatt/protokolle/E6-PRUEFER-C-teilberichte-1-3-5.md`.
  - E6-D-02 Dokumentar (Paket `_werkstatt/pakete/E6-DOKUMENTAR-02.md`): Abschluss-Bildsatz nach `_werkstatt/bilder/abschluss/`, Blindvergleich `_werkstatt/bilder/blind/` (Schlüssel außerhalb des Repositorys; Ort steht nur in der Notiz des Orchestrators im Scratchpad), Galerie `_werkstatt/bilder/galerie.html`.
  - Server: Port 3000 mit Build 2cdcbab, Port 3100 E0 (`/root/sm24-e0`), Port 3001 Entwicklung.
- **Fertig seit dem letzten Prüfpunkt:** Tastatur-Eingabe im Werkzeug berichtigt (F-01 per Tastatur mobil bestanden), Registerabgleich (KERN 1.16), verwaiste Sperre entfernt.
- **Als Nächstes:**
  1. Ergebnis Prüfstufe C abnehmen; ENTSCHEIDUNGEN D-049; ABNAHME.md je Kriterium mit Beleg; Z-04 nach Urteil des Endprüfers, voraussichtlich AUSNAHME 1 (zwei Befundrunden verbraucht, L3/L7).
  2. E6-D-02 abnehmen; BERICHT-Abschnitt „Abschluss“ mit Galerie, Anleitung zum Zusammenführen und Zurückrollen und Hinweis zu `_werkstatt`.
  3. Endprüfung E6-L-13: frischer Opus-Unteragent, zuerst nur der Blindordner, Schlüssel erst nach seinem Urteil (SendMessage), dann jedes Kriterium gegen den Beleg; Urteil wörtlich wiedergeben; ABSCHLUSS (CLAUDE.md-Block entfernen).
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** d0e4784. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
