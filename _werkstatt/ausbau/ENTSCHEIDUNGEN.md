# ENTSCHEIDUNGEN des Ausbaulaufs

Form folgenreicher Einträge: Ziel → drei Wege → Bewertung (Nordstern, Belege, Risiko für Bestand und Sicherheit, Aufwand, Kontingent) → Umkehrprobe → Folgen zweiter Ordnung.

## A-001 · Datenweiche als Nutzer ubuntu (2026-11-02 22:22, E0)
- Ziel: Jeder Projektbefehl läuft ohne Weg zur Produktion, und Build mit Postgres sowie Datenbanktests laufen in dieser Umgebung (root).
- Wege: (1) Befehle als root mit JSON-Modus, Postgres-Weg als Ausnahme · (2) sicher.sh führt jeden Befehl als ubuntu aus und stellt ein eigenes Postgres auf 127.0.0.1:5433 bereit · (3) Projektskripte (db.mjs) für root umbauen.
- Bewertung: (1) lässt Z-02 (Build mit lokalem Postgres, DB-Tests) unbelegt. (3) ändert Bestand ohne Nutzen für die Seite. (2) ändert keine Projektdatei, deckt beide Modi und hält .next mit einem Besitzer.
- Gewählt: (2). Umkehrprobe: Entfernen von sicher.sh stellt den Ausgangszustand her; chmod a+rwX ändert keine von Git erfassten Rechte.
- Folgen: Agenten dürfen Projektbefehle nie direkt starten (gemischte Besitzer). Prüfwerkzeuge im Browser laufen als root, sprechen nur HTTP auf localhost.

## A-002 · Arbeitsordner aus Lint, Typprüfung und Tests ausschließen (2026-11-02 22:22, E0)
- Ziel: Prüfwerkzeuge in _werkstatt beeinflussen weder Build noch Prüfungen der Seite (Auftrag 8.3).
- Umsetzung: "_werkstatt/**" in eslint.config.mjs, "_werkstatt" in tsconfig.json, '_werkstatt/**' in vitest.config.ts. Kein Produktcode wird ausgenommen (G8 gewahrt). Beim Abschluss wieder entfernt, wie im Gestaltungslauf (Commit 504e905).
