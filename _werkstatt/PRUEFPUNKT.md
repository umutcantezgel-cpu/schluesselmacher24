# Prüfpunkt

- **Etappe:** E5 (übrige Ansichten und Befundpakete). Prüfstufe B für E4 ist grün; die Sichtabnahme E4-L-23 ergab 6,2 (D-037). Die gemeinsamen Befunde sind mit E4-L-27 umgesetzt, KERN 1.11.
- **Laufend:**
  - Befundwelle 1 (E5-BEFUND-H05, -H09, -H04): Workflow `wf_5006ebc4-e4c` (Task `wt7fmju7i`), Basis `1171973`.
  - E5-BEFUND-H12 (Ratgeber): Workflow `wf_915efddc-a38` (Task `wpyg86yy5`), Basis `b929023`.
  - E5-BAUMEISTER-20 (Service, Kontakt, Vor Ort): Workflow `wf_bb43646e-b0f` (Task `wtnkxe0ac`), Basis `8faad51`.
  - Je Workflow laufen höchstens zwei Agenten gleichzeitig (4 Kerne); zusammen nie mehr als vier Haiku-Plätze.
- **Fertig seit dem letzten Prüfpunkt:** E4-GRAFIKER-10 abgenommen (ec7db44, b929023), Kür K-02 (fe069ba), K-05 Druckansicht, K-06 Vorschaubilder (D-039), B-25 Stiftzuhaltung als CSS vorbereitet (Paket E6-GRAFIKER-11), Paket E5-DOKUMENTAR-01. Davor: Prüfstufe B E4 (6798995, 0468a38), L-07a Warenkorb mobil (21d8833), Sichtabnahme E4-L-23, E4-L-24 bis -27, E4-GRAFIKER-09 (385bcf2), E5-L-28 Lesefortschritt B-24 und `ablaufAusText`; Pakete E5-BEFUND-H01 bis -H12, E5-BAUMEISTER-20 bis -29, E4-GRAFIKER-10.
- **Als Nächstes:**
  1. Welle 1 und GRAFIKER-10 abnehmen: ganzer Unterschied, Logikwächter, Wertesuche, Bilder, Berichte; GRAFIKER-10 in Registry (`SCHMALES_FORMAT`), README, Registry-Test eintragen.
  2. Befundwelle 2: H02, H03, H06, H08. Danach Welle 3: H01, H07, H10, H11, dann H12 (braucht `ablauf`).
  3. E5 Wellen F (B-20 bis -23), G (B-24 bis -27), H (B-28, B-29, D-01); dann L-12 lucide entfernen.
  4. Prüfstufe B E5 mit Sichtabnahme (Runde 2 der Befunde nur, wo < 8), Kür K-01 bis K-06, Prüfstufe C, Endprüfung.
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** 99d805c. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
