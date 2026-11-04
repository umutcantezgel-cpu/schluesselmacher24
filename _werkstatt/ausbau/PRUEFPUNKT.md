# PRÜFPUNKT
Stand: 2026-11-05 00:16 · Sitzung 886a8f6e (übergibt an eine frische Fortsetzungssitzung mit Repository-Quelle)
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
Tempomat: Woche 89 % um 00:16 (Reset Sa 02:00), Fenster 3 % (seit 00:10, Reset 05:10). Zwischen 19:26 und 00:15 stieg die Woche ohne Arbeit hier von 81 auf 89 %: Auf dem Konto wird anderswo stark verbraucht. Spielraum (99 − 89) ÷ 10 Fenster = rund 1 Wochenpunkt je Fenster; Teil 2 von E7-OPUS-01 in kleinen Schritten, vor jedem Schritt messen. Prüfserver nach Neustart der Umgebung neu starten (server.sh start), Werkzeug-Abhängigkeiten nach einrichtung.md Schritt 11.
