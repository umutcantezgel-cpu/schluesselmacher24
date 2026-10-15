# Prüfpunkt

- **Etappe:** E2 Referenz (Startseite)
- **Nächster exakter Schritt:**
  1. Berichte von E0-PRUEFER-04 (Funktionsliste) und E0-PRUEFER-05 (Ausgangswerte) abnehmen und Ausgangswerte in LAGEBILD.md und ABNAHME.md eintragen.
  2. Danach Build-Gate `SM24_DATA=json npx next build`, `server.sh neu`, dann ein Haiku-Prüfer für Prüfstufe A der E2-L-Pakete und Prüfstufe B der Referenz `/`.
  3. Etappentor: Sichtabnahme durch einen frischen Opus-Unteragenten (Ansichtswert ≥ 8).
- **Laufende Pakete:** E0-PRUEFER-04, E0-PRUEFER-05, E2-GRAFIKER-02 (Bericht ausstehend; Dateien bereits committet in f8dde75)
- **Offene Pakete E2:** E2-GRAFIKER-05 (Strichskala), E2-GRAFIKER-06 (fehlschluessel), E3-GRAFIKER-07 (README)
- **Hinweise:**
  - Ein Entwicklungsserver läuft auf Port 3001 (`/tmp/sm24-dev.log`). Er ergänzt `AGENTS.md` automatisch; diese Änderung nie committen (D-007).
  - Der E0-Build liegt gesichert unter `/root/sm24-e0-next`.
- **Letzter grüner Commit:** 65aa9ce (vollständig geprüft); danach 3 ZWISCHENSTAND-Commits bis 9e51eff (Typprüfung, Linter, Tests grün, Build ausstehend).
