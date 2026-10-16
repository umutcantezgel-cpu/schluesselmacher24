STATUS · Branch claude/projekt-gestaltung-entwicklung-tofodh · Etappe 4/6 · Welle C fertig (B-08 bis -11), Welle D: B-12, B-13 fertig, B-14 und B-15 im Bau · Pflicht 47/76 · Kür 0/6 · Kriterien 0/10 · Ausnahmen 0 · Bestand grün (e523e49: Build 198/198, 1029 Tests, Logikwächter gleich außer laufenden B-14/B-15) · Nächster Schritt: B-14 und B-15 abnehmen, Kundschaft Welle E (B-16 bis B-19)

# Status des Gestaltungslaufs

## Einstellungen (Standardwerte, als Annahmen)
- VORHABEN (Standard), geschärft in drei Sätzen:
  1. Das vorhandene, aber ungenutzte Grafik- und Bewegungssystem (54 Fach-Icons, 5 Grafikgeneratoren, Bewegungsbausteine) kommt auf jede Seite.
  2. Eine echte Typo-, Bewegungs- und Formskala ersetzt rund 690 freie Werte, und lucide verschwindet als zweite Icon-Familie.
  3. Die Erzählansichten bekommen je einen großen Moment mit Bedeutung; die Arbeitsansichten werden ruhiger, zugänglicher und schneller.
- SCHWERPUNKT: alles · BEREICH: ganzes Projekt (Website; Payload-Admin ausgenommen) · AUSBAU: maximal
- MARKE UND ZIELGRUPPE: abgeleitet, siehe LAGEBILD.md (Annahme)
- GESCHMACK: keine · TEXTE: Mikrotexte direkt, übrige Texte als Vorschlag · FREIGABE: Plan im Planmodus vorgelegt, Ausführung läuft · LAUFZEIT: bis Pflicht und Kür erfüllt sind
- UNANTASTBAR: Logo und Favicon, Inhalte der Rechtstexte, Geschäftslogik (Server Actions, Preis- und Terminlogik, Integrationen, Payload-Modelle), Zahlungs- und Kontoabläufe; dort nur Darstellung (siehe Logikwächter in PLAN.md)
- HAIKU-PLÄTZE: 4 · GERÄTEGRÖSSEN: 390×844, 768×1024, 1440×900 · BUDGETS: Standard (LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms, Bewegungscode ≤ 60 KB komprimiert)
- ARBEITSBRANCH: claude/projekt-gestaltung-entwicklung-tofodh (von der Cloud-Sitzung angelegt)

## Einrichtung (E0-PRUEFER-01, Belege in `_werkstatt/protokolle/E0-PRUEFER-01-*`)
- Nach neu aufgesetzter Umgebung in dieser Reihenfolge wiederholen:
  1. `npm ci`
  2. Build-Gate: `SM24_DATA=json npx next build` (198 Seiten, etwa 50 s). `npm run build` scheitert als root an `initdb` und taugt nicht als Gate.
  3. Server: `_werkstatt/werkzeuge/server.sh start` (`next start` im JSON-Modus, Port 3000).
  4. Werkzeuge: siehe `_werkstatt/werkzeuge/LIESMICH.md` (Abhängigkeiten nach `/root/sm24-werkzeuge`, Symlink `node_modules`).
  5. DB-Tests nur als Nutzer `ubuntu`: Postgres-Daten unter `/home/ubuntu/sm24-pg/`, Vitest über den Wrapper `/home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs`. Das Repo gehört root, daher braucht `ubuntu` Schreibrecht auf `private-uploads/` (vom Repo ignoriert).
- Ausgangsstand des Bestands:
  - Typprüfung: 0 Fehler
  - Linter: 0 Fehler, 0 Warnungen
  - Unit-Tests: 31 Dateien, 680/680 grün
  - DB-Tests: als root nicht lauffähig, als `ubuntu` 39/52, die 13 Fehler sind Schreibrechte
  - HTTP: 15/15 Adressen liefern 200

## Verlauf (eine Zeile je Stunde oder Welle)
- 15.10.2026 23:08 · E0 begonnen: _werkstatt angelegt, Auftrag wörtlich gespeichert, Erkundung (5 Kundschafter + Lückenprüfung) und L0-Vorprüfung des Plans aus der Planphase übernommen.
- 15.10.2026 23:17 · E0-PRUEFER-01 abgenommen: Build-Gate JSON grün, Bestand dokumentiert; Welle E0-b läuft (Werkzeuge, Next-16-Doku, lucide-Inventar).
- 15.10.2026 23:48 · E1 abgeschlossen (KERN 1.1, PLAN 1.0). E2: Designsystem, Bewegung, Formsystem mit 39 Glyphen, Profillinie, Generatoren profilschnitt/tuer-schutz, Schließplan-Markierung, Hülle und Referenz-Startseite als ZWISCHENSTAND gepusht (9e51eff).
- 16.10.2026 00:06 · E0-Ausgangswerte und Funktionsliste abgenommen (14/14; F-05 geschärft, D-013). Attrappen fangen jede nicht lesende Action ab (D-011). Strichskala der Generatoren (D-010, KERN 1.2), Generator `stiftzuhaltung`, Seitenkopf und Client-Hüllen der großen Momente committet. Build grün, Server neu.
- 16.10.2026 01:55 · Container-Neustart. Workflow und Server verloren, Platte erhalten. Sichtabnahme Anlauf 1: 6,8, nicht bestanden (D-016). Prüfstufe B sonst grün (Budgets, 14/14, a11y 6 statt 30).
- 16.10.2026 05:30 · Startseite Anlauf 2 (E2-L-06b, D-018): Hero mobil, B-01 bei Sichtbarkeit mit Abheben, Easing-Fehler behoben, Bereichsfarben ≥ 30° (D-017). Welle E3-A abgenommen (Formular-Bausteine, Ablauf-Hülle, Foto-Upload, README); 404 auch für unbekannte Adressen (D-019). Etappentor Anlauf 2 und Welle E3-B gestartet.
