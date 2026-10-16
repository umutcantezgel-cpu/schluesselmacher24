STATUS · Branch claude/projekt-gestaltung-entwicklung-tofodh · Etappe 5/6 · Welle G/H: B-26, B-27, E6-GRAFIKER-11, E5-DOKUMENTAR-01 laufen · Pflicht 79/88 · Kür 4/6 · Kriterien 0/10 · Ausnahmen 0 · Bestand grün (5105872: Logikwächter 0 außer laufendem B-26, Wertesuche 0, 1135 Tests) · Nächster Schritt: laufende Pakete abnehmen, Welle H (B-28, B-29), K-01 einbauen, lucide entfernen, Prüfstufe B E5

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
- 16.10.2026 08:40 · Welle C abgenommen (B-08 Marken, B-09 Code-Shop, B-10 Schließanlagen, B-11 Türtechnik) mit Nacharbeit: Eingabeschrift und InView (L-17, D-028), gemeinsame Bausteine (L-18, D-029). Welle D: B-12 Ratgeber, B-13 Zylinder-Konfigurator.
- 16.10.2026 09:00 · Welle D vollständig (B-14 Warenkorb, B-15 Kasse, D-031), Seitenwechsel springt wieder nach oben (L-19, D-030), SummaryList als Schriftfeld (L-20), Motiv-Zuordnung nach der Sache (L-21, D-032). Welle E gestartet. Morgenbericht 07:00 in BERICHT.md.
- 16.10.2026 09:50 · Welle E abgenommen (B-16 Assistent, B-17 Vorlage, B-18 Zutritt, B-19 Sicherheitstechnik, D-033) mit Nacharbeit: Hauseingang mobil lesbar (12,5 px), Fach-Icon wächst mit der Fläche, keine Lücke auf dem Tablet. Wertesuche 0 ohne Ausnahme (L-22, D-034). F-04 auf Port 3001 durch alle 13 Schritte.
- 16.10.2026 11:10 · Prüfstufe B E4 grün, Warenkorb mobil im Budget (L-07a). Sichtabnahme E4-L-23: 6,2 (D-037); gemeinsame Befunde umgesetzt (E4-L-24 bis -27, KERN 1.10/1.11), Schließplan mit Reserve und Telefonformat (GRAFIKER-09), Lesefortschritt im Ratgeber als reine CSS-Szene (L-28). Befundpakete H01–H12 und Pakete der Wellen F–H geschrieben; Befundwelle 1 und Generator `ablauf` laufen.
- 16.10.2026 16:15 · Neustart des Arbeitsprozesses (Server neu gestartet). Abgenommen: Befundwelle 1 (H04, H05, H09), H08, H12, B-20 bis B-23; Kür K-02, K-04, K-05, K-06; Hinweiskästen ruhig (D-041); H04 Runde 2 mit Schlüsselart-Zeichnungen (D-042). Nachprüfung der vom Sitzungslimit unterbrochenen Pakete läuft.
- 16.10.2026 16:56 · Alle 12 Befundpakete der Sichtabnahme E4-L-23 abgenommen; H01, H02, H03, H06, H10, H11 nach L3 mit Nacharbeit des Orchestrators (Kopfgrafik und Ordnung der Codelinien-Seite, Schlüsselzeichnung mit Profilen nach den Körpern ≤ 1,6 s, Schriftfeld mit Kennungen ohne Umbruch und Betrag in eigener Zeile, Variante `korb-leer:`; KERN 1.13). B-24 und B-25 abgenommen (Plan im Vorschlag auf Telefonen lesbar). Laufend: B-26, B-27, E6-GRAFIKER-11, E5-DOKUMENTAR-01.
