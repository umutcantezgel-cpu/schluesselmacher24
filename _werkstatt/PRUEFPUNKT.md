# Prüfpunkt

- **Etappe:** E7 „Absichern“, Anlauf 2 für Z-08 (E7-L-43, D-050) ist abgeschlossen. Danach folgt Prüfstufe C, Abschlussversuch 2. Plan: Abschnitt „Neustart während E7-L-43“ in der Plandatei; Pakete `_werkstatt/pakete/E7-PRUEFER-C.md`, `E7-PRUEFER-02.md` (Teil 4 von C), `E7-DOKUMENTAR-03.md` und `E6-L-13-endpruefung.md` (Kern 1.18).
- **Fertig:**
  - E7-L-35 bis L-42 und Welle 1 (e4d7336).
  - Messung Anlauf 1, E7-P-1 (`E7-PRUEFER-01-ergebnis.md`): Bildrate 8/8, INP 12/12, LCP mobil 3/12.
  - E7-L-43: Code in acc9455, Vorprüfung und D-050 im Commit [E7-L-43]. Am Prüfstand mobil 12/12 schneller als E0, Desktop 36/36.
  - Morgenbericht 18.10. ist erledigt. Die nächste Erinnerung ist `trig_012YdSA5a5zqbxz4A5A9Pasq` (19.10., 07:00 Berlin).
- **Als Nächstes:**
  1. Build-Gate: `server.sh stop` → `SM24_DATA=json npx next build > _werkstatt/protokolle/E7-PRUEFER-C-build.log` → `server.sh start`. Den Prüfstand 3203 beenden: PID über `/proc/<pid>/cwd` = `/root/sm24-v3` finden.
  2. Prüfstufe C, Abschlussversuch 2, per Workflow nach dem Paket `E7-PRUEFER-C`, in dieser Reihenfolge:
     - Teil 1 Bestand
     - Teil 4 Messung (E7-PRUEFER-02, allein)
     - Teil 2 Messfenster A
     - Teil 3 und Teil 5 parallel
     - Teil 6 Ergebnis
  3. D-051 mit dem Ergebnis von Z-08 (bei Lücke AUSNAHME 2) und Z-04 (AUSNAHME 1 nach Urteil). Dann den alten Bildsatz, Blindvergleich und Galerie entfernen (`git rm`, mit Vermerk) und E7-DOKUMENTAR-03 starten. Den Schlüsselordner nennt nur der Prompt.
  4. ABNAHME je Kriterium mit Beleg, BERICHT-Abschnitt „Abschluss“, MENSCHEN prüfen.
  5. Endprüfung E6-L-13 mit frischem Opus-Agenten: zuerst Teil A blind (nur `_werkstatt/bilder/blind/`), dann Schlüssel und Paket per SendMessage. Das Urteil wörtlich wiedergeben.
  6. ABSCHLUSS: CLAUDE.md-Block entfernen, committen, pushen.
- **Bei Abbruch:**
  - Server: `server.sh start` (Port 3000). Port 3100: `cd /root/sm24-e0 && SM24_DATA=json setsid nohup npx next start -p 3100`.
  - Die Sperre `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
  - Workflows mit `resumeFromRunId` fortsetzen.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021).
- **Letzter grüner Stand:** E7-L-43 mit tsc 0, ESLint 0, Vitest 1217/1217, Logikwächter 0 abweichend, Wertesuche 0.
