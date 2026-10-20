STATUS · Branch claude/projekt-gestaltung-entwicklung-tofodh · Etappe Abschluss · Welle Endprüfung · Pflicht 106/107 · Kür 6/6 · Kriterien 8/10 (Z-04 und Z-08 als Ausnahme) · Ausnahmen 2 · Bestand grün (Build 208/208, Tests 1217, DB 52/52, Logikwächter 0) · Nächster Schritt: Endprüfung E6-L-13 (Teil A blind)

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

- 16.10.2026 20:48 · Welle G und H abgenommen (B-26 bis B-29, DOKUMENTAR-01 mit sicherem Probe-Befehl, GRAFIKER-11), Kür K-01 eingebaut (Stiftzuhaltung am Scrollen; Rahmen mit `clip`), lucide-react entfernt (Build 208/208). Prüfstufe B E5 mit Sichtabnahme gestartet.
- 16.10.2026 22:08 · Nach Container-Neustart Prüfstufe B E5 fortgesetzt und abgeschlossen (D-044): Bestand grün, keine Budget-Verstöße, axe 0; Sichtabnahme Mittel 6,4–7,1, keine Hauptansicht ≥ 8. Bildrate der Startseite mobil durch spätes Vorladen der festen Ziele behoben (E5-L-30). Entwürfe für Befundpakete Runde 2 laufen.
- 17.10.2026 09:01 · Neustart des Arbeitsprozesses, Server neu gestartet. Morgenbericht 17.10. mit 6 Bildern (`bilder/morgen-2026-10-17/`), nächste Erinnerung `trig_01VjngwmVdyzGnq78x5xnmc7` (18.10. 07:00 Berlin). Entwürfe Runde 2 werden fortgesetzt.
- 17.10.2026 13:55 · Runde 2 abgenommen (15/15, D-047/D-048), KERN 1.15. Prüfstufe C mit Tastatur-, SVG- und Registerprüfung und abschließende Sichtabnahme E6-L-34 laufen.
- 17.10.2026 22:45 · Neustart des Containers, Server neu gestartet. Prüfstufe C erneut versucht: Werkzeugfehler beim Tastatur-Eingeben behoben (F-01 per Tastatur bestanden), Register K-007 vervollständigt (KERN 1.16, E6-L-35, Build 208/208). Abschluss von Prüfstufe C und Blindvergleich E6-D-02 laufen.
- 18.10.2026 08:40 · Neustart des Containers. Abschlussversuch 1 ausgewertet (Z-08 Abstand zu E0 und Bildrate nicht erfüllt, siehe Plan E7 „Absichern“). Morgenbericht 18.10. mit 6 Bildern (`bilder/morgen-2026-10-18/`).
- 18.10.2026 09:40 · D-049: Ursachen gefunden (Menü: Fokus im Klick und `:has()` mit Attributen machten jede Einfügung seitenweit teuer; Bildrate: Vorladen und Kopfgrafiken im Ladefenster). E7-L-36 bis L-42 umgesetzt, Klickverarbeitung 114 → 0–2 ms, Stil beim Öffnen 2 × 894 → 170 Elemente. Werkzeuge und Welle 1 laufen.
- 18.10.2026 11:56 · Neustart des Arbeitsprozesses (Server aus), gesichert. Messung Anlauf 1 (E7-P-1): Bildrate 8/8 ≤ 5 %, INP 12/12, LCP mobil 3/12. Anlauf 2 (E7-L-43, D-050): CSS im Dokument, maßgleiche Ersatzschriften, Mono vorgeladen. Am Prüfstand mobil LCP 12/12 unter E0 (480–800 gegen 870–2580 ms), CLS nicht über E0, Desktop 36/36. KERN 1.18, M-28.
- 18.10.2026 15:10 · Prüfstufe C, Abschlussversuch 2 (wf_7a2d5363-c26, Nachlese wf_6c8d5283-31b): Bestand grün, 14/14, Tastatur 7/7, axe 0, Konsole 0, Bildrate 8/8, Leistung mobil 36/36, Desktop 35/36 (H05 LCP +28 bei Spanne 24). Register: R-1 bis R-8 offen. Teil 6 am Sitzungslimit gescheitert.
- 20.10.2026 12:46 · Der Arbeitsprozess hing seit der Erinnerung vom 19.10. (Neustart), der Morgenbericht 19.10. fiel aus. Server neu, Morgenbericht 20.10. nachgeholt, nächste Erinnerung trig_01D5ohguFrkqDLFuLTXhdg71 (21.10. 07:00 Berlin).
- 20.10.2026 15:40 · E7-L-44 (Register an den Code angeglichen, sechs Übergänge mit Token, KERN 1.19; Build nach Cache-Neuaufbau 208/208). Teil 6 vollständig. D-051: AUSNAHME 1 Z-04 (vorsorglich), AUSNAHME 2 Z-08. E7-D-03: neuer Bildsatz, Blindvergleich und Galerie. ABNAHME eingetragen, BERICHT-Abschnitt „Abschluss“.
