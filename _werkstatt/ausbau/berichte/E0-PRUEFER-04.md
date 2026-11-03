# E0-PRUEFER-04 · Slop-Scan, Stilprüfer, SVGO-Prüfung, Kontingent

(Vom Orchestrator aus der Schlussantwort des Pakets übernommen; das Paket schrieb keine Berichtsdatei.)

## GEÄNDERTE DATEIEN
- Neu: werkzeuge/slopscan.mjs, stil.mjs, svgo-pruefung.mjs, kontingent.mjs.
- Protokolle: protokolle/E0-PRUEFER-04-*.log (9), Werkzeug-Protokolle, protokolle/kontingent-kalibrierung.json.

## PRÜFUNG UND ERGEBNIS
- node --check aller vier ok; Selbsttest 31 von 31.
- Slop-Scan aller Hauptansichten (14 × 2 Geräte): Slop-Index 3 bis 16, Mittel 9,1. S1 28 (Inter als Fließtext überall), S2 16 in 6 Zeilen (Lila aus der Bereichsfarbe Schließanlagen, 292 Grad, auf H01, H10, H11), S3 152 (Verlauf an p.eyebrow::before), S4 0, S5 27 (Radius 0 px auf über 40 % der Flächen), S6 8 (H02), S7 0, S8 24 (data-motion=play).
- Stil --alle (181 indexierbare Seiten): 3.807 Befunde (Gedankenstriche 2.734, Bindestriche 658, Fragen 364, Platzhalter 51). Floskeln, Ausrufezeichen, Emojis 0. Stil --quellen: content/code-lines.json 218 Befunde, src/**/*.tsx 524 (Gedankenstriche 228, Fragen 211, Bindestriche 69, Platzhalter 16).
- svgo: icon.svg 1.171 auf 939 Bytes; preset-default entfernt role am Wurzel-SVG, mit keepRoleAttr erhalten.
- Kontingent: Kalibrierpunkt 2 % um 21:23:09 UTC entspricht 0,355 % je Million gewichteter Token (ein Punkt).

## OFFENE FRAGEN (Antworten des Orchestrators in ENTSCHEIDUNGEN A-005)
1. Zeiträume mit Halbgeviertstrich (09:00–13:00) und die Firmierung „SCHLÜSSELMACHER24 – Inhaber Mina Saad“ zählen als Gedankenstrich.
2. Akkordeon-Fragen zählen als Frage.
3. Indigo um 239 Grad liegt außerhalb der Prüfspanne 260 bis 330 Grad.
4. „folgt“ und „analog“ treffen normale Sätze; Mercedes-Benz gilt als Bindestrich-Kandidat.
