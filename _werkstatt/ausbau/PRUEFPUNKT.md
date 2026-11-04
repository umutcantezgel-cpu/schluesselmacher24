# PRÜFPUNKT
Stand: 2026-11-04 19:27 · Sitzung 886a8f6e (übernommen von m40jjmy9)
Nächster exakter Schritt: E7-OPUS-01 Teil 2 nach dem Fenster-Reset (00:10). Offen in E7-OPUS-01 (G-39, E-44):
  (a) Unterschrift als Upload: Der Partnerbetrieb bekommt im Status „vertrag-versendet“ einen Einmal-Link (Muster: Kunden-Uploads mit Signaturprüfung und Einmal-Schlüssel, src/lib/server/kundendateien.ts, /api/kunden-upload). Die Datei landet in interne-dateien und wird an vertrag.datei gehängt; danach setzt ein Mensch „vertrag-unterschrieben“.
  (b) Nachweise (Sammlung Nachweise) in der Bewerbung: Gewerbe, Identität, Eignung als Upload im Formular /partner-werden oder per Nachreich-Link bei „nachweise-fehlen“.
  (c) Status für den Bewerber: die Bestätigung auf /partner-werden zeigt heute statusAbrufbar={false}; prüfen, ob der Terminstatus (Kundenstatus aus einer Quelle, G-25) die Bewerbung abbilden kann.
  (d) Verweis auf die Partner-AGB im Formular als markierter Platzhalter bis MA-29.
  Danach Abnahme, Paket committet, weiter mit E7-OPUS-02 und E7-OPUS-03 (Welle 2).
Laufende Pakete: E7-OPUS-01 (Orchestrator, Teil 1 committet: 9db8e29 Partnervertrag-PDF mit Endpunkt und Knopf im Admin). Keine Agenten laufen.
Letzter grüner Commit: 9db8e29 (Typprüfung, Lint 0, Unit 2239, DB 97, Build 232/232, axe Kontakt 0). main = 11a6c00.
Vorgemerkt: G-24 Porto beim Kunden (G9); MA-29 Vertragstext und Partner-AGB vom Anwalt; LCP-Budget (A-032).
Umgebung: npm ci, JSON-Build, Prüfserver Port 3000, Werkzeug-Abhängigkeiten /root/sm24-werkzeuge (einrichtung.md Schritt 11). Achtung: Prettier im Projekt ohne Konfiguration; nur neue Dateien mit --single-quote --print-width 160 --trailing-comma all formatieren, nie Bestand.
Tempomat: Woche 81 % um 19:26, Fenster 4 % (seit 19:10). Halten bis zum Reset 00:10; je Fenster höchstens rund 1,85 Wochenpunkte.
