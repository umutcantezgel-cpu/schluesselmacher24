# Prüfpunkt

- **Etappe:** E2 Referenz (Startseite), Etappentor
- **Nächster exakter Schritt:**
  1. Bericht E2-PRUEFER-01 (Prüfstufe A der L-Pakete, Prüfstufe B der Referenz) abnehmen; Befunde beheben, die die Referenz betreffen.
  2. Etappentor: Sichtabnahme durch einen frischen Opus-Unteragenten anhand `_werkstatt/bilder/referenz/` (Ansichtswert ≥ 8).
  3. Parallel E3-L-09: `not-found.tsx` und neues `error.tsx` mit `stiftzuhaltung` (passt-nicht, Code 404 / abgebrochen, Code 500); dann E3-GRAFIKER-07 (visual/README) und Welle E3-A.
- **Laufende Pakete:** E2-PRUEFER-01
- **Server:** Port 3000 neuer Stand (Build nach 4a985f3), Port 3100 eingefrorener E0-Stand (`/root/sm24-e0`), Port 3001 frei.
- **Hinweise:**
  - Ein Entwicklungsserver ergänzt `AGENTS.md` automatisch; diese Änderung nie committen (D-007).
  - Vor rechenintensiven Läufen `/tmp/sm24-messfenster.lock` prüfen.
- **Letzter grüner Commit:** 4a985f3 (Build, Typprüfung, Linter, Komponenten-Tests grün; Prüfstufe B läuft).
