# E2-PRUEFER-01 · L0-Plan nach Runde 1

Prüfstand: PLAN.json, ABNAHME.md, ANFORDERUNGEN.json (Dateistand 01:40), Arbeitsbaum = HEAD.

Gelöst seit Runde 1: Leerlauf, Tore, kritischer Pfad, E10-Prüfer, Z-22, G9, Blind-Pakete. Offen: Spiegel, Muster-Datei, Kapazität, Kanten zu Prüfern, Kür-Kante, MENSCHEN-Recht.

## GEÄNDERTE DATEIEN
Nur dieser Bericht.

## WAS UND WARUM
Werkzeuge und python3, nur lesend.

## PRÜFUNG UND ERGEBNIS
- plan.mjs pruefen: PLAN-PRÜFUNG: OK
- plan.mjs stand: Etappe E1 (2 von 12), Welle 1, Pflicht 23 von 122, Kür 0 von 10, läuft 4, blockiert 0
- plan.mjs naechste --plaetze 4: E1-RECHERCHEUR-03, E1-RECHERCHEUR-04
- anforderungen.mjs pruefen: OK · belegt 0/623 · G 0/51 · L 0/284 · EL 0/79 · M 0/37 · E 0/138 · K 0/34

Werkzeuge prüfen Spiegel und Muster-Datei nicht.

| Frage | Ergebnis | Beleg | Pakete |
|---|---|---|---|
| a Pflicht je Z, ABNAHME | Ja. 3 bis 20 Pflichtpakete je Z, ABNAHME vollständig | ABNAHME.md | alle |
| b G-01 bis G-51 | Ja, 51 von 51 gedeckt, Stichprobe passt. Lücke: 203 Spiegel-Abweichungen | ANFORDERUNGEN.json | EA-PRUEFER-02/03/04 |
| c G-21, G-50 | Ja. Nur E9-OPUS-04, offen | PLAN.json | E9-OPUS-04 |
| d prüfbares Tor | Ja. Tore haben Kanten. Lücke: E10-Tor ohne Zeitangabe | PLAN.json | E10-PRUEFER-01 |
| e Stufen | Ja. Opus 47 alle Stufe 3, Haiku Stufe 1 oder 2 | PLAN.json | alle |
| f Paketdatei je Haiku | Ja, 31 Dateien, 54 offen. Lücke: 45 Haiku nennen _MUSTER-REFERENZ.md, die es nicht gibt und kein Paket schreibt | pakete/ | Ohne Datei (54): E1-AUTOR-01, E3-DATENPFLEGER-01/02/03, E3-PRUEFER-01, E3-UPGRADE-01, E4-PRUEFER-01, E4-PROBENUTZER-01, E4-TEXTER-01, E5-AUTOR-01, E5-GRAFIKER-01, E5-PROBENUTZER-01, E5-PRUEFER-01, E6-BAUMEISTER-01/02/03/04/05/06/07, E6-PROBENUTZER-01, E6-PRUEFER-01, E7-AUTOR-01, E7-BAUMEISTER-01, E7-PRUEFER-01, E8-AUTOR-01/02/03, E8-DOKUMENTAR-01/02, E8-FAKTENPRUEFER-01, E8-PRUEFER-01/02, E8-TEXTER-01/02/03/04/05, E9-BAUMEISTER-01, E9-DOKUMENTAR-01, E9-PROBENUTZER-01, E9-PRUEFER-01, E10-KUER-02/03/04/06/07/08, E10-PRUEFER-01, EA-PRUEFER-01/02/03/04, EA-SPOTTER-01 |
| g Projektdateien ohne Prüfer | Teilweise. Prüfer je Etappe vorhanden. 28 Kanten zu Prüfern fehlen | PLAN.json | E0-OPUS-01, E3-OPUS-02/03/04/05, E3-GRAFIKER-01, E3-DATENPFLEGER-02, E4-OPUS-02/04, E5-GRAFIKER-01, E6-OPUS-02/03, E6-BAUMEISTER-01/02/03/04/05/07, E8-TEXTER-01/02/03/04/05, E8-AUTOR-03, E8-OPUS-03/04, E9-OPUS-02, EA-OPUS-01 |
| h G9 Preise, Zahlung, AGB | Ja. Schutz in den Titeln, E7-OPUS-01 als Entwurf | PLAN.json | E3-OPUS-07/10, E4-OPUS-05, E7-OPUS-01 |
| i Menschensachen | Ja. Lücke: MA-01 bis MA-16 ohne Paketzuordnung | MENSCHEN.md | E9-DOKUMENTAR-01, E8-DOKUMENTAR-01 |
| j kritischer Pfad | Ja. Längster Pfad: 44 Knoten, 43 direkte Kanten. Lücke: 34 offene Pflicht ohne Kante zum Endprüfer | PLAN.json | E1-FACHKUNDLER-03 bis EA-ENDPRUEFER-01 |
| k Kostenklassen | Teilweise. Raten M 24, L 6 statt 8 und 3, ohne Messwert und ENTSCHEIDUNGEN-Eintrag. Etappen-Tage 10,1 statt 14,5 | PLAN.json | kapazitaet, EA-PRUEFER-02/03/04 |
| l Jury, Blind, Endprüfer | Ja. Fünf Pakete, Opus Stufe 3, Klasse L, Blind-Pakete mit Nachfolger | PLAN.json | E4-JURY-01, E4-BLIND-01, E8-BLIND-01, EA-JURY-01, EA-ENDPRUEFER-01 |
| m Weg-Bausteine | Ja, 12 von 12 | PLAN.json | E4-OPUS-05, E5-OPUS-01/02, E6-OPUS-02, E6-BAUMEISTER-01/02/04/05/06/07 |
| n Agenturnennung | Ja, Schalter aus. Lücke: MENSCHEN.md ohne Recht für MA-11 | PLAN.json, AUFTRAG 15 | E8-OPUS-04 |

## GEMEINSAME DATEIEN (gewünschte Änderungen)
PLAN.json:
1. Datei _MUSTER-REFERENZ.md anlegen, ein Paket in E4 als Schreiber eintragen.
2. Raten belegen oder zurücksetzen, ENTSCHEIDUNGEN-Eintrag, etappen-tage auf 14,5 angleichen.
3. 28 Kanten zu Prüfern setzen (Zeile g).
4. EA-PRUEFER-01 (Pflicht) hängt an E10-PRUEFER-01 (Kür): Kante lösen oder Prüfer zur Pflicht machen.
5. E8-OPUS-04: Recht auf MENSCHEN.md für den Textvorschlag.
6. EA-PRUEFER-02/03/04 mit 119, 130 und 73 Anforderungen auf Sitzungsgröße prüfen.
7. E10-Tor: Laufzeit beziffern.
8. Offene Pflichtpakete als Vorfahren des Endprüfers führen.
ANFORDERUNGEN.json:
9. pakete-Felder an PLAN angleichen (203 Einträge, alle EA-PRUEFER-02 gegen -03 und -04).

## BELEGE
Kopie: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/snap2/ (PLAN.json, ANFORDERUNGEN.json, ABNAHME.md). Stichprobe G-03/07/09/14/16/18/20/21/22/24/27/31/37/44/49.

## OFFENE FRAGEN
1. Warum M 24 und L 6 vor einer Messung in E4?
2. Soll E10-PRUEFER-01 Pflicht sein?

=== ENDE E2-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
