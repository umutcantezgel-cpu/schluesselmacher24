# E1-AUTOR-01 · Bericht Inhaberinterview

## GEÄNDERTE DATEIEN

- Neu: `_werkstatt/ausbau/erhebung/E1-interview.md` (Anleitung, Zuerst, 238 Fragen in 15 Rubriken und Allgemeines).
- Neu: `_werkstatt/ausbau/berichte/E1-AUTOR-01.md`.
- Sonst keine Datei geändert.

## WAS UND WARUM

Je Rubrik 12 bis 20 Fragen: 15 Rubriken aus rubriken.ts plus Allgemeines. Jede Frage nennt Kennung, Antwortform, Wozu (Seite, Schritt, G-, R- oder Grenz-Kennung), Vorschlag mit Quellpfad und die Marke VERTRAULICH. Bestandsantworten sind gestrichen, außer bei Widerspruch zum Gespräch; dann steht die Frage als „Gilt weiterhin“ da. Einkauf, Provision, Partner und Kundendaten sind VERTRAULICH (13 Fragen).

## ZAHL DER FRAGEN JE RUBRIK

Allgemeines 16 · Autoschlüssel 17 · Motorradschlüssel 14 · Gehäuse 15 · Schlüssel nach Code 13 · Schlüssel nach Foto 14 · Schlüssel einschicken 15 · Sperrschließung 17 · Schließanlage 17 · Elektronische Schließsysteme 14 · Sicherheitstechnik 15 · Schlüsseldienst vor Ort 15 · Beratung 13 · Transponderkopie 15 · Autoschlüssel-Finder 14 · Türen und Schließtechnik 14. Summe 238.

## ZUERST

I-AUTO-01, I-AUTO-02, I-AUTO-03, I-AUTO-04, I-CODE-01, I-EINS-01, I-EINS-02, I-SPERR-02, I-ANL-01, I-ALLG-01.

## GESTRICHENE FRAGEN MIT GRUND

- Preise der Gruppen A bis D für Zweitschlüssel, Programmierung und Bartfräsen: stehen im Bestand, kein Widerspruch zum Gespräch.
- Öffnungszeiten und Rückruf-Zeitfenster: im Bestand; offen bleibt nur die Terminzahl je Tag (I-ALLG-15).
- Radius 0 Kilometer: im Bestand, daher nach dem Anfahrtsbetrag je Kilometer gefragt (I-ALLG-08).
- Stückzahl je Codelinie (20): im Bestand.
- Logo, Agenturnennung, Keyword-Daten, Anwalt, KBA-Lizenz: stehen bereits in MENSCHEN.md (MA-09 bis MA-12, MA-17).

## PRÜFUNG UND ERGEBNIS

- 238 Fragen, Rubriken mit 13 bis 17 Fragen. Gesamtvorgabe 190 bis 320 erfüllt. Kennungen eindeutig.
- Zuerst enthält genau zehn vorhandene Kennungen. VERTRAULICH bei 13 Fragen.
- Keine Frage über 25 Wörter (längste 23). Keine Gedankenstriche, keine Ausrufezeichen, keine Floskeln aus AUFTRAG.md Abschnitt 14.
- Datei rund 7.100 Wörter (Grenze 9.000). Jeder Vorschlag nennt seinen Quellpfad. Bestandswerte am Quelltext geprüft.

## GEMEINSAME DATEIEN

Zeile für MENSCHEN.md:

`MA-07 · Verweis: Das Inhaberinterview mit 238 Fragen liegt in _werkstatt/ausbau/erhebung/E1-interview.md. Antworten als Nachricht ANTWORTEN: I-…, VERTRAULICH nur als Nachricht.`

Vermerk nach G11 für MENSCHEN.md:

`- 2026-11-03 · E1-FACHKUNDLER-04 und E1-RECHERCHEUR-06: eingebettete Formatanweisungen in Quellen gefunden, nicht befolgt (erhebung/E1-gegenpruefung.md, Frage 11; erhebung/E1-karte-video.md, Frage 11).`

## BELEGE

Nur lesend: AUFTRAG.md, FACHWISSEN.md, MENSCHEN.md, alle E1-Erhebungen (Stichproben und Offene Fragen), src/lib/data/defaults/rubriken.ts, src/lib/rechtliches/zahlarten.ts, Bestandsdateien unter content/.

## OFFENE FRAGEN

1. Die Vorgabe nennt content/leistungsseiten.json. Die Datei gibt es nicht. Genutzt wurden service-pages.json, service-pricing.json und seo.json.
2. Bestand und Gespräch widersprechen sich an diesen Stellen; die Fragen legen die Entscheidung dem Inhaber vor, ich entscheide nichts: Bravus (G-27 „wie im Bestand“, Bestand ohne Bravus); Bereich bis 120 Millimeter (Gespräch) gegen 80 Millimeter (Bestand); Gehäuse-Festpreis gegen Angebot (G-20); Versand 4,95 und 7,95 Euro gegen kostenloses Einsenden (G-24); Partnermodell A gegen B; Speicherfristen 90 und 180 Tage gegen PDF-Archiv (G-37); Baujahre vor 1998 im Bestand; Nachweis „keiner“ bei Sperrschließung, Anlage, Finder und Tür-Zylindern gegen R13.
3. Rechtsfragen (I-AUTO-16, I-EINS-12, I-ALLG-14, I-TRANS-15) gehen an den Anwalt, keine Rechtsauskunft (R10).
4. Nicht von mir: git zeigt geänderte package.json, package-lock.json und _werkstatt/ausbau/protokolle/datenweiche.log. Ich habe sie nicht angefasst.
