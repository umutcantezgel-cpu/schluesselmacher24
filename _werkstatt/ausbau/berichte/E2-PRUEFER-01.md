# E2-PRUEFER-01 · L0 Plan gegen Werkzeug und Checkliste

Prüfstand: PLAN.json (stand 01:28 UTC, Datei 01:29), ANFORDERUNGEN.json (623 Einträge), ABNAHME.md (00:41). Alles im Arbeitsbaum, nicht committet. Ausgewertet wurde eine unveränderte Kopie.

## GEÄNDERTE DATEIEN
Keine außer diesem Bericht.

## WAS UND WARUM
14 Fragen mit plan.mjs und anforderungen.mjs (direkt, nur lesend) sowie python3.

## PRÜFUNG UND ERGEBNIS
- plan.mjs pruefen: PLAN-PRÜFUNG: OK
- plan.mjs stand: Etappe E0 (1 von 12) · Welle 4 · Pflicht 22 von 120 · Kür 0 von 9 · läuft 4 · blockiert 0
- plan.mjs naechste --plaetze 4: Keine bereiten Pakete.
- anforderungen.mjs pruefen: OK · belegt 1/623 · G 0/51 · L 0/284 · EL 0/79 · M 1/37 · E 0/138 · K 0/34

Ohne Befund: b, c, e, m. Lücke: a, d, f, g, i, l, n. Nein oder teilweise: h, j, k. Der Leerlauf von naechste kommt von E0-OPUS-02: abgenommen, ohne Commit. Auf der Kopie mit Commit wären E1-RECHERCHEUR-03 und -04 bereit. Werkzeuglücke: pruefen erkennt keine falschen Mengen, kein Muster-Ziel, keine fehlenden Tor-Kanten und keinen kritischen Pfad.

| Frage | Ergebnis | Beleg | Pakete |
|---|---|---|---|
| a Pflicht je Z, ABNAHME vollständig | Nein. Z-22 ohne Ausgangswert (nur Strich). Z-01 nennt 127 Pakete, Z-03 622 Einträge, heute 129 und 623 | ABNAHME.md | Z-22: E0-OPUS-02, E2-OPUS-02, E8-DOKUMENTAR-01, E9-DOKUMENTAR-01, EA-OPUS-01, EA-ENDPRUEFER-01 |
| b G-01 bis G-51, Stichprobe 15 | Ja. 51 von 51 gedeckt, Zuordnung 623 von 623 gespiegelt. Stichprobe G-03, G-07, G-09, G-14, G-16, G-18, G-20, G-21, G-22, G-24, G-27, G-31, G-37, G-44, G-49 passt | ANFORDERUNGEN.json | E3-DATENPFLEGER-03, E9-OPUS-02 (G-22) |
| c G-21, G-50 nur Konzept | Ja. Nur E9-OPUS-04, Status offen. Die Konzeptvertiefung aus AUFTRAG 18 fehlt im Vorrat | PLAN.json | E9-OPUS-04 |
| d prüfbares Tor je Etappe | Ja mit Lücken. 12 von 12 haben ein Tor. E2 („Vorab-Scheitern eingearbeitet“) ist nicht messbar, E10 hat keinen Prüfer. Blind- und Probeläufe wirken auf kein Paket | PLAN.json | E4-BLIND-01, E8-BLIND-01, E5-PROBENUTZER-01, E6-PROBENUTZER-01, E9-PROBENUTZER-01 |
| e Opus Stufe 3, Haiku Stufe 1 oder 2 | Ja. 47 Opus alle Stufe 3. 82 Haiku: 44 Stufe 1, 38 Stufe 2 | PLAN.json | alle |
| f Paketdatei je Haiku | Ja. 31 vorhanden, 51 fehlen. Muster ab E5 falsch: 42 Haiku nennen _GEMEINSAM.md statt Startseite und Autoschlüssel-Weg | pakete/ | Ohne Datei: E1-AUTOR-01, E3-UPGRADE-01, E3-DATENPFLEGER-01, E3-DATENPFLEGER-02, E3-DATENPFLEGER-03, E3-PRUEFER-01, E4-TEXTER-01, E4-PROBENUTZER-01, E4-PRUEFER-01, E5-GRAFIKER-01, E5-AUTOR-01, E5-PROBENUTZER-01, E5-PRUEFER-01, E6-BAUMEISTER-01, E6-BAUMEISTER-02, E6-BAUMEISTER-03, E6-BAUMEISTER-04, E6-BAUMEISTER-05, E6-BAUMEISTER-06, E6-BAUMEISTER-07, E6-PROBENUTZER-01, E6-PRUEFER-01, E7-BAUMEISTER-01, E7-AUTOR-01, E7-PRUEFER-01, E8-TEXTER-01, E8-TEXTER-02, E8-TEXTER-03, E8-TEXTER-04, E8-TEXTER-05, E8-AUTOR-01, E8-AUTOR-02, E8-AUTOR-03, E8-PRUEFER-01, E8-DOKUMENTAR-01, E8-DOKUMENTAR-02, E8-FAKTENPRUEFER-01, E8-PRUEFER-02, E9-BAUMEISTER-01, E9-PROBENUTZER-01, E9-PRUEFER-01, E9-DOKUMENTAR-01, E10-KUER-02, E10-KUER-03, E10-KUER-04, E10-KUER-06, E10-KUER-07, E10-KUER-08, EA-PRUEFER-01, EA-SPOTTER-01, EA-PRUEFER-02 |
| g Projektdateien ohne Prüfer danach | Lücke. E10-KUER-01 bis -08 haben keinen Prüfer und nur die eigene Paketdatei als Recht, obwohl die Titel Seitenarbeit nennen. Nach Abhängigkeit fehlen 28 Kanten zu Prüfern: E0 1, E3 6, E4 2, E5 1, E6 8, E8 8, E9 1, EA 1 | PLAN.json | E10-KUER-01 bis -08, E3-OPUS-02, E6-BAUMEISTER-01, E8-TEXTER-01 (Beispiele) |
| h G9: Rechtstexte, Preise, Firma, Zahlung | Nein als Änderung. Preise: E3-OPUS-07 schreibt die Preisdatei ohne Wertesperre. Zahlung: E3-OPUS-10 ändert die Stripe-Anbindung, E4-OPUS-05 den Anzahlungsweg. AGB: Entwurfsvermerk fehlt | PLAN.json | E3-OPUS-07, E3-OPUS-10, E4-OPUS-05, E7-OPUS-01 |
| i Pakete für Menschensachen | Ja. E9-DOKUMENTAR-01 (79 Anforderungen) und E8-DOKUMENTAR-01 (AUSSEN.md). Lücke: MA-01 bis MA-16 ohne Paket | MENSCHEN.md | E9-DOKUMENTAR-01, E8-DOKUMENTAR-01 |
| j kritischer Pfad lückenlos | Nein. 16 Knoten, davon 10 von 15 Übergängen nur mittelbar. Längste offene Kette 41 Pakete. E10 hängt nicht am Abschluss | PLAN.json | E2-OPUS-02, E2-PRUEFER-01, EA-ENDPRUEFER-01 |
| k Kostenklassen | Teilweise. E6-OPUS-04 (M) wirkt als Kern zu klein. EA-PRUEFER-02 mit 321 Anforderungen ist zu groß. Kapazität: 10,5 Tage gemeldet, aus den Klassen folgen 26,3 Tage, mit Puffer 31,6 | PLAN.json | E6-OPUS-04, EA-PRUEFER-02, E9-DOKUMENTAR-01 |
| l Jury, Blind- und Endprüfer frisch | Ja. Fünf Pakete, alle Opus Stufe 3 Klasse L. Lücke: E4-BLIND-01 und E8-BLIND-01 wirken auf kein Paket | PLAN.json | E4-JURY-01, E4-BLIND-01, E8-BLIND-01, EA-JURY-01, EA-ENDPRUEFER-01 |
| m Weg-Baustein je G-03-Rubrik | Ja, 12 von 12. Elektronik, Sicherheitstechnik und Beratung teilen E6-BAUMEISTER-04 | PLAN.json | E4-OPUS-05, E5-OPUS-01, E5-OPUS-02, E6-OPUS-02, E6-BAUMEISTER-01, -02, -04, -05, -06, -07 |
| n Agenturnennung, Schalter aus | Ja, E8-OPUS-04, Schalter aus. Lücken: Fußzeile ohne Recht auf site-footer.tsx, LINKREGISTER.md und REFERENZ.md in keinem Paket, MENSCHEN.md ohne Recht für MA-11 | PLAN.json, AUFTRAG 15 | E8-OPUS-04, E3-OPUS-03, E4-OPUS-03, E8-AUTOR-02 |

## GEMEINSAME DATEIEN (gewünschte Änderungen)
PLAN.json:
1. E0-OPUS-02 auf committet setzen, sobald der Commit steht.
2. E10: Rechte ergänzen oder als Konzept markieren, Prüfer E10-PRUEFER-01 anlegen, EA-ENDPRUEFER-01 von E10 abhängig machen.
3. E8-OPUS-04: Rechte auf site-footer.tsx, MENSCHEN.md und LINKREGISTER.md. REFERENZ.md einem Paket geben, Vorschlag E8-AUTOR-02. E4-OPUS-03: Recht auf site-footer.tsx.
4. Muster der 42 Haiku ab E5: Startseite und Autoschlüssel-Weg statt _GEMEINSAM.md.
5. kritischer_pfad: längste offene Kette (41 Pakete) mit direkten Kanten.
6. Tor-Kanten: E4-BLIND-01 nach E5-OPUS-01, E8-BLIND-01 nach EA-JURY-01, E5-PROBENUTZER-01 nach E6-OPUS-01, E6-PROBENUTZER-01 nach E7-PRUEFER-01, E9-PROBENUTZER-01 nach EA-PRUEFER-01.
7. EA-PRUEFER-02 teilen und M-17 aufnehmen. E9-DOKUMENTAR-01 auf Größe prüfen.
8. mengengeruest.anforderungen von 622 auf 623. kapazitaet.tage und Etappen-Tage neu rechnen.
9. G9: E3-OPUS-07 Preiswerte unverändert. E3-OPUS-10 und E4-OPUS-05 Zahlungsverhalten unverändert, mit Test. E7-OPUS-01 Partner-AGB nur als Entwurf (R10).
ABNAHME.md:
10. Z-22 einen Ausgangswert geben. Z-01 und Z-03 an 129 Pakete und 623 Einträge angleichen.
ANFORDERUNGEN.json:
11. M-17 (umgesetzt) auf offen setzen, bis EA-PRUEFER-02 es prüft. Die Ergänzung selbst ist richtig, denn im Stand HEAD fehlte M-17.

## BELEGE
- Auswertung auf der Kopie: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/snap/ (PLAN.json b239e66bf329, ANFORDERUNGEN.json c886faabe474, ABNAHME.md 24eb08247e91).
- Testkopie mit committetem E0-OPUS-02: .../scratchpad/snap/PLAN.test.json.

## OFFENE FRAGEN
1. Kommt E10 vor den Abschluss? AUFTRAG 18 sagt ja, der Plan lässt beides zu.
2. Gibt es für Z-22 einen messbaren E0-Ausgangswert?
3. Soll E6-BAUMEISTER-04 (Elektronik, Sicherheitstechnik, Beratung) geteilt werden?

=== ENDE E2-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
