# Prüfpunkt

- **Etappe:** E2 Referenz (Startseite), Etappentor Anlauf 2 (letzter nach L3); parallel Welle E3-A.
- **Stand:**
  - Prüfstufe B ist grün: Budgets, Funktionsliste 14/14, a11y 6 statt 30 in E0.
  - Die Sichtabnahme in Anlauf 1 ergab 6,8 und ist nicht bestanden (D-016, `_werkstatt/berichte/E2-L-07-sichtabnahme.md`).
- **Laufend:** Workflow `wf_a39c6e70-8a1` (Skript `~/.claude/projects/…/workflows/scripts/neustart-welle-e3a-wf_a39c6e70-8a1.js`, höchstens 4 Haiku gleichzeitig):
  - Welle E3-A: Baumeister 01, 02 und 03 sowie Grafiker 07, je mit Prüfstufe A und bis zu 2 Reparaturen.
  - E2-PRUEFER-01: Ergebnisprotokoll.
  - E2-PRUEFER-02: Einzelbilder zeitgenau.
  - E3-PRUEFER-01: Prüfstufe A für L-09 und L-14.
- **Orchestrator parallel, E2-L-06b Startseite nach den Befunden:**
  - Der Redaktionshinweis im Fuß erscheint nur außerhalb der Produktion.
  - Hero-Raster mit mobilem Halmstreifen (CSS-Ausschnitt).
  - B-01: Start bei Sichtbarkeit, Easing behoben, Fräser hebt ab.
  - Bereichsfarbtöne mit mindestens 30° Abstand.
  - `Section`-Ton `sunken` mit Haarlinien.
  - Typo-Stufen, mobiles Zweierraster und Ratgeber-Komposition.
  - Details stehen im Plan unter „Aktueller Abschnitt“.
- **Danach:** Workflow B, Etappentor Anlauf 2:
  1. Bestand und Build.
  2. Messfenster für `/` (Bildsatz `referenz-2`, Einzelbilder) und die Funktionsliste.
  3. Frischer Opus-Agent für die Sichtabnahme.
  4. Dann Welle E3-B: B-04 bis B-06 sofort, B-07 nach dem Tor.
- **Bei Abbruch:**
  - `Workflow({scriptPath, resumeFromRunId: "wf_a39c6e70-8a1"})`.
  - Server: `server.sh start` (Port 3000); Port 3100 mit `cd /root/sm24-e0 && SM24_DATA=json nohup npx next start -p 3100`; Port 3001 mit `SM24_DATA=json nohup npx next dev -p 3001`.
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007).
- **Letzter grüner Stand:** Prüfstufe A an e6550f3 grün (Typprüfung 0, 983 Unit- und 52 DB-Tests, Build 198/198). E3-L-14 (4abf697) wird in E3-PRUEFER-01 geprüft.
