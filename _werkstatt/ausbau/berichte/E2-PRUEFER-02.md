# E2-PRUEFER-02 · Vorab-Scheitern

## GEÄNDERTE DATEIEN
Nur dieser Bericht.

## WAS UND WARUM
PLAN.json 01:51, nur lesend. Jedes Szenario: Am dritten Tag stockt der Lauf, weil … (P Wahrscheinlichkeit, W Wirkung, je 1 bis 5, sortiert nach P mal W).

1. **P5 W5, E3-Kette.** E3-OPUS-08 bis E3-PRUEFER-01 läuft Glied für Glied; zehn von 16 E3-Paketen sind Opus (A-011: nacheinander). Signal: naechste nennt in E3 höchstens zwei Pakete. Maßnahme: Punkt 2. Aufwand klein.

2. **P5 W4, Schreibrechte fehlen.** E3-OPUS-06 bis -08 und E7-OPUS-02 legen Sammlungen oder Globals an, dürfen aber payload.config.ts und Migrationen nicht ändern. Signal: Registrierung fehlt nach Abnahme. Maßnahme: Punkt 1. Aufwand klein.

3. **P4 W5, Wochenuhr blind.** Woche seit 21:23 unverändert, Fenster nur geschätzt (02:51: 61,0 % gegen Soll ≈93), betrifft alle Pakete. Signal: Wochenwert älter als 15 Minuten. Maßnahme: Wochenwert je Blick aus rate_limit_event; bis dahin Ziel 95. Aufwand klein.

4. **P4 W4, Herzschlag reißt ab.** Übernahme erst nach 150 Minuten, Wachhund nur alle 120; beim Neustart 02:10 wurden zwei Pakete ohne Teilausgabe neu gestartet. Betrifft alle L-Pakete. Signal: HERZSCHLAG älter als 45 Minuten. Maßnahme: L-Pakete auf 60 Minuten teilen, Frist angleichen. Aufwand klein.

5. **P4 W4, E1-Schranke.** naechste wählt keine E2-Pakete, solange E1 mit acht offenen Paketen läuft, darunter E1-OPUS-01 (36 Anforderungen). Signal: E1-OPUS-01 läuft über 120 Minuten. Maßnahme: Punkt 5. Aufwand mittel.

6. **P5 W3, Paketdateien fehlen.** 54 Haiku-Pakete haben keine Maßstab-Datei, acht davon in E3 und E4; plan.mjs prüft nur das Feld. Signal: Start scheitert an fehlender Datei. Maßnahme: Dateiprüfung in plan.mjs, Erzeugung je Welle. Aufwand mittel.

7. **P3 W4, Fahrzeugdaten ungeklärt.** Lizenz KBA FZ 12 nicht bestätigt (E1-RECHERCHEUR-01), MENSCHEN.md führt sie nicht; E3-DATENPFLEGER-01 ist Vorgänger von E3-PRUEFER-01. Signal: Lizenzfrage bei Welle 4 offen. Maßnahme: Menschen-Eintrag, Katalog hinter Schalter. Aufwand klein.

8. **P4 W3, Kür nicht nutzbar.** E10-KUER-01 bis -08 hängen an E9-PRUEFER-01; Leerlauf bleibt ungenutzt. Signal: naechste liefert weniger Pakete als freie Plätze bei Gas. Maßnahme: Punkt 4. Aufwand klein.

9. **P4 W3, Zustandsdrift.** PRUEFPUNKT (02:13) und PLAN widersprechen sich zu E2-DATENPFLEGER-01; drei abgenommene Pakete sind nicht committet und halten die Welle (plan.mjs Zeile 267). Signal: Stundenzeile älter als 60 Minuten. Maßnahme: Commit nach jeder Abnahme. Aufwand klein.

10. **P3 W3, Menschenstau.** MA-04 verspricht die Bögen für E1 oder E2, E3-DATENPFLEGER-03 erzeugt sie in Welle 2; E5-OPUS-01 hängt an den Preisen. Signal: kein Rücklauf bis E3-Welle 4. Maßnahme: Frist setzen, Preisschalter. Aufwand klein.

## GEMEINSAME DATEIEN (gewünschte Änderungen)
PLAN.json:
1. E3-OPUS-06, E3-OPUS-07, E3-OPUS-08, E7-OPUS-02: payload.config.ts und src/migrations/ ins Recht.
2. E3-OPUS-09 an E3-OPUS-04 (Welle 3). E3-OPUS-10 an E2-PRUEFER-01 (Welle 2). E3-UPGRADE-01 an E3-OPUS-08, -09, -10.
3. E3-OPUS-04 ohne package.json, package-lock.json und next.config.ts; pdfkit bringt der Orchestrator ein. E8-OPUS-03 ohne next.config.ts.
4. E10-KUER-01 an E4-JURY-01; -02 und -08 an E3-OPUS-02; -03 an E4-OPUS-01; -04 an E4-OPUS-04; -05 an E5-OPUS-02; -06 an E8-OPUS-02; -07 an E4-PRUEFER-01; E9-PRUEFER-01 streichen.
5. E1-AUTOR-01 nach E3, Welle 1. E1-OPUS-01 in drei Pakete zu je zwölf Anforderungen; E2-OPUS-01 an alle drei.
6. E8-OPUS-04: MENSCHEN.md ins Recht. EA-PRUEFER-02 bis -04: je höchstens 40 Anforderungen (Richtwert).
7. etappen tage auf 14,5 angleichen; E10-Tor mit Laufzeit.
MENSCHEN.md: Lizenz KBA FZ 12 als Eintrag. ENTSCHEIDUNGEN.md: nicht umgesetzte Befunde begründen.

## PRÜFUNG UND ERGEBNIS
Erledigt seit Runde 1: Prüfer-Kanten, Muster-Datei, Spiegel, EA-PRUEFER-01 ohne Kür. Offen: Etappen-Tage, E8-OPUS-04, EA-PRUEFER-02 bis -04, E10-Tor. Stand: 132 Pakete, 101 offen, kritischer Pfad 42.

## BELEGE
PLAN.json, ENTSCHEIDUNGEN.md (A-009, A-011), werkzeuge/plan.mjs (191, 267, 303 bis 352), AUFTRAG.md (Zeile 28, Abschnitte 9, 17), MENSCHEN.md (Zeile 14), berichte/E1-RECHERCHEUR-01.md (Zeile 46), KONTINGENT.md (Zeile 12), STATUS.md, PRUEFPUNKT.md.

## OFFENE FRAGEN
1. Gilt die Dateihoheit auch für Opus-Pakete mit gemeinsamen Dateien?
2. Wie misst der Tempomat die Woche ohne rate_limit_event?
