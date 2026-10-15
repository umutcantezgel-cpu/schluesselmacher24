# Entscheidungen

Folgenreiche Entscheidungen mit Denkprotokoll (Ziel → drei Wege → Bewertung → Umkehrprobe → Folgen zweiter Ordnung).

## D-001 · Build-Gate im JSON-Modus (E0)
- **Ziel:** Ein Build, der in der Cloud verlässlich läuft und mit E0 vergleichbar bleibt.
- **Drei Wege:**
  1. `npm run build`: scheitert als root an `initdb`.
  2. Build mit lokaler Datenbank als Nutzer `ubuntu`: läuft, braucht aber `PAYLOAD_SECRET` und eine laufende Datenbank. Die Inhalte kämen aus dem Seed statt aus `content/`.
  3. `SM24_DATA=json npx next build`: entspricht dem Vercel-Weg ohne Datenbank, 198 Seiten.
- **Bewertung:** Weg 3 ist reproduzierbar, schnell und ohne Geheimnisse. Er prüft denselben Code wie Weg 1; nur die Datenquelle ist eine andere.
- **Umkehrprobe:** Weg 3 prüft keine Datenbankpfade. Die decken die DB-Tests ab, die über den Nutzer `ubuntu` laufen.
- **Folgen:**
  - Alle Bilder und Messungen laufen im JSON-Modus.
  - Richtwerte und Nachweise zeigen dort ihre Ersatzdarstellung. Das ist in E0 und am Ende gleich und deshalb vergleichbar.
