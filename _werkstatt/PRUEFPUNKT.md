# Prüfpunkt

- **Etappe:** E5 (übrige Ansichten und Befundpakete). Alle 12 Befundpakete der Sichtabnahme E4-L-23 sind abgenommen (H01, H02, H03, H06, H10, H11 nach L3 mit Nacharbeit des Orchestrators). KERN 1.13.
- **Laufend:**
  - Welle H: E5-BAUMEISTER-28 (Standorte, Bestellseite) und -29 (Rechtstexte): Workflow `wf_34547259-9b0` (Task `w6avycioc`), Basis `0ee0bf7`.
  - Server: Port 3001 (Entwicklung), Port 3000 (`server.sh start`, alter Build – Werkzeuge ohne `SM24_BASIS_URL` messen dort). Port 3100 (E0) erst für Prüfstufe C.
- **Fertig seit dem letzten Prüfpunkt:** B-26 (b7968d5), B-27 (b8eddb7), E5-DOKUMENTAR-01 (c7b3309, sicherer Probe-Befehl), E6-GRAFIKER-11 (e22662c) und Einbau K-01 (92a4435; `clip` für Rahmen um Szenen, B-25), Staffeltest der Schlüsselarten-Reihe präzisiert (63318de); Pakete E5-PRUEFER-B und E5-L-29 (Sichtabnahme) geschrieben (8399323).
- **Als Nächstes:**
  1. B-28, B-29 abnehmen (Textabzug wortgleich, Funktionsliste F-03, F-09).
  2. E5-L-12 lucide entfernen (`npm uninstall lucide-react`, null Importe, README-Zeile „Icons“ fortschreiben), Build-Gate `SM24_DATA=json npx next build`, Port 3000 neu starten.
  3. Prüfstufe B E5 (`_werkstatt/pakete/E5-PRUEFER-B.md`, vier Teile, Haiku) und Sichtabnahme E5-L-29 (vier frische Opus-Agenten, Gruppen im Paket); Befundpakete Runde 2 nur, wo < 8.
  4. Kür-Rest (K-03 läuft in den Paketen), Prüfstufe C (Port 3100), Endprüfung, ABSCHLUSS.
- **Bei Abbruch:**
  - `Workflow({scriptPath: <pakete-kette-Skript>, resumeFromRunId})` für den jeweiligen Lauf; Skript: `/root/.claude/projects/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/workflows/scripts/pakete-kette-wf_be39e9e0-a87.js`, args `{pakete:[{id,basis}], andere}`.
  - Paketerzeuger im Scratchpad `e5/` (`befund_pakete.py [H..]`, `welle_f.py`, `welle_gh.py [Kennung..]`); die erzeugten Pakete liegen im Repo.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
  - `/tmp/sm24-messfenster.lock` ist verwaist, wenn kein Prüfer läuft.
- **Zwischenstände:** Laufende Baumeister-Dateien werden als ZWISCHENSTAND committet (Stopp-Haken). Die Abnahme prüft den ganzen Unterschied gegen die Basis der Welle.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Agenten auf Port 3001 brauchen `SM24_BASIS_URL=http://localhost:3001`.
- **Letzter grüner Stand:** 92a4435. Typprüfung 0, Linter 0, Komponenten- und Lib-Tests grün, Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme. Port 3000 zeigt den Build der L-07a-Prüfung.
