# E0-KUNDSCHAFTER-05 · Qualität: Tests, Evaluierung, offene Punkte, Livegang

Stand 2026-11-02 · HEAD f43efa2 · Pfade relativ zum Repo · Z. = Zeile · nur Lesen

Zählung: grep auf `^\s*(it|test)(\.\w+)?\s*\(`, Unit `*.test.ts(x)`, DB `*.db.test.ts`. `it.each` zählt als ein Aufruf.

## GEÄNDERTE DATEIEN
Keine. Geschrieben wurde nur diese Datei.

## WAS UND WARUM
Tests: 147 Dateien (132 Unit, 15 DB), 1.113 Unit- und 94 DB-Aufrufe. Offen: 38 Livegang-Schritte, 34 Menschen-Einträge, 45 Leitfaden-Zeilen, 15 Fehler aus 5.5.

## 1 TESTS
Ordner unter `src` (ohne Präfix): Testdateien U/DB, Aufrufe U/DB.

| Ordner | Dateien | Aufrufe |
|---|---|---|
| app | 3/0 | 10/0 |
| app/(site) | 3/0 | 6/0 |
| app/(site)/api/cron/taeglich | 1/0 | 9/0 |
| app/(site)/api/cron/zahlungen | 1/0 | 4/0 |
| app/(site)/api/kunden-upload | 1/0 | 12/0 |
| app/(site)/api/zahlung/rueckkehr | 1/0 | 5/0 |
| app/(site)/api/zahlung/stripe | 1/0 | 9/0 |
| app/(site)/autoschluessel/anfrage | 1/0 | 5/0 |
| app/(site)/rechtliches/cookie-einstellungen | 1/0 | 2/0 |
| app/(site)/rechtliches/impressum | 1/0 | 5/0 |
| app/(site)/rechtliches/versand-und-zahlung | 1/0 | 5/0 |
| components/autoschluessel | 4/0 | 31/0 |
| components/calculator | 1/0 | 7/0 |
| components/flow | 1/0 | 5/0 |
| components/forms | 2/0 | 13/0 |
| components/layout | 4/0 | 19/0 |
| components/recht | 1/0 | 4/0 |
| components/seo | 1/0 | 3/0 |
| components/ui | 3/0 | 18/0 |
| components/vertrauen | 3/0 | 12/0 |
| components/visual | 5/0 | 34/0 |
| components/visual/generators | 10/0 | 171/0 |
| components/visual/glyphen | 1/0 | 7/0 |
| components/visual/icons | 2/0 | 11/0 |
| components/visual/interaktiv | 6/0 | 34/0 |
| components/visual/motion | 5/0 | 21/0 |
| lib | 33/0 | 302/0 |
| lib/actions | 3/0 | 49/0 |
| lib/data | 2/5 | 19/47 |
| lib/flow | 1/0 | 7/0 |
| lib/integrations | 1/0 | 10/0 |
| lib/mail | 5/0 | 50/0 |
| lib/og | 1/0 | 4/0 |
| lib/rechtliches | 5/1 | 40/2 |
| lib/richtwerte | 2/0 | 28/0 |
| lib/server | 5/5 | 38/26 |
| lib/store | 1/0 | 10/0 |
| lib/visual | 2/0 | 22/0 |
| lib/zahlung | 2/1 | 25/4 |
| payload | 1/2 | 10/11 |
| payload/globals | 1/0 | 5/0 |
| payload/hooks | 3/1 | 32/4 |
| Summe | 132/15 | 1.113/94 |

Ohne Testdatei: `lib/data/defaults` und `lib/mail/vorlagen` (beide direkt importiert), `payload/access`, `payload/collections`, `payload/components`, `payload/fields` (von keinem Test importiert). Außerdem: `scripts`, `migrations`, `test`, `types`, 3 Ordner unter `components`, 54 unter `app`.

Abweichungen: README Z. 78 nennt 113 Unit-Dateien und 1531 Tests, der dort genannte Befehl ergibt 132. README Z. 79 nennt 11 DB-Dateien mit 77 Tests (heute 15 und 94). BERICHT Z. 10 und FORTSCHRITT Z. 54 nennen 52 DB-Prüfungen.

## 2 LIVEGANG-PRÜFUNG (`src/scripts/livegang-pruefen.ts`)

| Prüfpunkt | Fundstelle |
|---|---|
| Firmendaten (ohne DB aus `content/settings.json`), Fund bei fehlenden Daten | `src/scripts/livegang-pruefen.ts:23-32`; `src/lib/livegang-pruefung.ts:31` |
| Haken „Noch Platzhalter hinterlegt“ gesetzt | `src/lib/livegang-pruefung.ts:33-38` |
| Backend-Regel für Firmen-, Standort- und Registerfelder | `src/lib/livegang-pruefung.ts:40-49`; `src/payload/globals/Einstellungen.ts:53-120` |
| Rechtsseiten-Quelltext auf Platzhalter-Klammern | `src/scripts/livegang-pruefen.ts:37`; `src/lib/livegang-pruefung.ts:56-91` |
| Muster: Platzhalter, „eintragen“, „ergänzen“, PLZ, Ort | `src/lib/platzhalter.ts:15-18` |
| Ausgabe ohne Werte; Exit 0 ohne Fund, sonst 1 | `src/lib/livegang-pruefung.ts:12-13`; `src/scripts/livegang-pruefen.ts:40-49` |
| Build: Pflicht in Produktion | `scripts/build.mjs:162-165` |

Nicht erfasst: Eigentexte im Backend (`src/payload/globals/Einstellungen.ts:345-350`) und eckige Klammern außerhalb des Musters. Getestet wird nur die Bibliothek (7 Aufrufe), nicht das Skript.

## 3 LIVEGANG.MD (`docs/LIVEGANG.md`)
Keine Statusmarken, daher alle offen. Erfasst: Abschnitte 1 bis 7 und „Was nicht technisch ist“, nicht Betrieb (ab Z. 164).

| Abschnitt (Z.) | Offene Schritte (Z.) |
|---|---|
| §1 Postfach (23) | Einrichten (23) |
| §2 Supabase (27-41) | Projekt (27); Verbindungen (28-32); SSL (33-34); Bucket (35); S3-Zugang (36-40) |
| §3 Resend (45-56) | Domain (45); DNS (46-49); Verifizierung (50); Schlüssel (51); Variablen (52-56) |
| §4 Stripe (60-81) | Konto (60-62); Public details (63-67); Branding (68); Zahlarten (69); Belegmails (70); Webhook (71-79); Schlüssel (80); Rechnungen (81) |
| §5 Vercel (89-105) | Tarif (89); Variablen (90-103); Domain (105) |
| §6 Erster Deploy (110-131) | Redeploy (110-115); Passwort (116); Einstellungen (117-121); Abläufe (124-130); Testvorgänge (131) |
| §7 Stripe live (135-137) | Live-Webhook (135); Live-Schlüssel (136); Erstattung (137) |
| Nicht technisch (143-162) | Rechtstexte (143-147); AV-Verträge (148); LUCID (149); Freigaben (151-154); Standortseiten (155); BFSG (156); Search Console (157); GA4 (158-162) |

38 Schritte insgesamt.

## 4 MENSCHEN.MD (`docs/gestaltung/MENSCHEN.md`)
Zeile = Nummer + 8. Nach Wortlaut: 34 offen, 2 erledigt mit Restpunkt (M-02, M-10), 1 erledigt (M-17).

| Nr | Thema | Status | Kurzinhalt |
|---|---|---|---|
| M-01 | Fotos | offen | Echte Fotos fehlen |
| M-02 | Firmendaten | erledigt, Rest offen | Kammer bestätigen |
| M-03 | Codelinien | offen | Hersteller eintragen |
| M-04 | Stadtseiten | offen | Texte oder offline |
| M-05 | Rechtstexte | offen | Freigabe durch Anwalt |
| M-06 | Online-Zahlung | offen | Stripe verbinden |
| M-07 | Geräte, Browser | offen | Abnahme auf Geräten |
| M-08 | Geschmack | offen | Leitidee freigeben |
| M-09 | Abhängigkeiten | offen | Vier Pakete entscheiden |
| M-10 | npm-Meldungen | erledigt, Rest offen | Vitest und Vite offen |
| M-11 | Build als root | offen | Lokaler Build scheitert |
| M-12 | Slugs | offen | koda, m-gane ändern |
| M-13 | Dokumentation | offen (Wortlaut) | Umsetzung klären |
| M-14 | Zusammenführen | offen (Wortlaut) | Git: Merge 0a34dc4 |
| M-15 | Cookie-Kategorien | offen | Abschaltung bestätigen |
| M-16 | Türtechnik | offen | Normen belegen |
| M-17 | Codelinien-Texte | erledigt | Startwerte korrigiert |
| M-18 | Video-Rechtsaussagen | offen | Prüfung durch Anwalt |
| M-19 | Bearbeitungsdauer | offen | FAQ-Antwort fehlt |
| M-20 | Fachangaben Service | offen | Normen prüfen |
| M-21 | Schwelle Zutritt | offen | Zahl belegen |
| M-22 | Bestellbeispiel | offen | Echt oder Muster |
| M-23 | Zylinderdaten | offen | Daten abgleichen |
| M-24 | Aufbewahrungsfrist | offen | Frist bestätigen |
| M-25 | Artikelkatalog | offen | Acht Beispielartikel |
| M-26 | Zusagen Bestellung | offen | Mit Ablauf abgleichen |
| M-27 | Widerrufshinweis | offen | Platzierung prüfen |
| M-28 | CSS im Dokument | offen (Wiedervorlage) | Bei Next-Update prüfen |
| M-29 | Konten verbinden | offen | Vier Dienste anlegen |
| M-30 | Preise, Termine | offen | Startwerte freigeben |
| M-31 | Verpackungsgesetz | offen | LUCID vor Versand |
| M-32 | Produktsicherheit | offen | Herstellerangaben pflegen |
| M-33 | Auftragsverarbeitung | offen | Vier AV-Verträge |
| M-34 | Vertragsbestätigung | offen | Liste bestätigen |
| M-35 | BFSG | offen | Ausnahme festhalten |
| M-36 | Lieferzeiten | offen | Je Versandart eintragen |
| M-37 | Codelinien-Pflege | offen | Hersteller und Adresse |

## 5 EVALUIERUNG.MD (`docs/wert/EVALUIERUNG.md`)

**5.1 Abschnitt 4 (Z. 279 bis 376).** 98 Zeilen: 53 erfüllt, 33 teilweise, 12 fehlt oder verletzt. Nicht erfüllt, mit Zeile:
- fehlt oder verletzt (12): P09-b 316, P16-b 328, P17-e 335, E1-c 350, E1-d 351, E4-g 367, E5-b 369 (verletzt), E6 370, E7-a 371, E7-b 372, E7-c 373, E8-b 375
- teilweise (33): P02-a 282, P02-c 284, P03-c 287, P04-b 289, P05-b 291, P05-c 292, P06-c 295, P06-h 300, P07-b 303, P08-b 306, P08-e 309, P08-f 310, P08-g 311, P11-c 321, P14-b 325, P16-d 330, P17-g 337, P17-h 338, P18-d 344, P20 347, E1-a 348, E1-b 349, E1-e 352, E2-a 353, E2-b 354, E3-a 357, E3-b 358, E3-c 359, E3-d 360, E4-e 365, E4-f 366, E5-a 368, E9 376

**5.2 Abschnitt 5.5 (Z. 459 bis 473).** Keine Zeile behoben, alle 15 offen. Format: Zeile Idee, Entscheidung.
459 I-12, F-15 · 460 I-35, F-18 · 461 I-44, F-19 · 462 K-01, F-10 · 463 I-54 · 464 Fehlerticket, F-28 · 465 I-21, F-12 · 466 I-24 · 467 I-41 · 468 F-18 · 469 F-16 · 470 I-60 · 471 I-60 · 472 F-14 · 473 K-02

**5.3 Abschnitt 6 (Z. 487 bis 556).** 70 Einträge. Zeile = 486 + Nummer bei I-, 548 + Nummer bei K-.
- besteht (49): I-04, I-06, I-07, I-09, I-10, I-11, I-12, I-14, I-19 bis I-46, I-48, I-49, I-52 bis I-62
- besteht, korrigiert (6): I-01, I-02, I-05, I-16, I-17, I-18
- besteht, reduziert (2): I-08, I-15
- neu (7): K-01, K-02, K-03, K-05 bis K-08; neu, eingeschränkt (1): K-04
- verworfen (2): I-13, I-47; in dieser Form verworfen (2): I-03, I-50; zurückgestellt (1): I-51

**5.4 Abschnitt 10 (Z. 722 bis 740).** 13 Punkte: Widersprüche 723 bis 727, Grenzen 730 bis 733, Nebenwirkungen 736 bis 738, nächster Schritt 740.

## 6 FORTSCHRITT.MD (`docs/nacht/FORTSCHRITT.md`)

| Paket | Dokument (Z.) | Git |
|---|---|---|
| 0 Einrichtung | fertig (10) | 64429c9 im Verlauf |
| 1 Payload-Probelauf | fertig (11) | c5cea73 im Verlauf |
| 2 Sicherheit, Aufräumen | fertig (12) | 55ece02 im Verlauf |
| 3 Modell, Seed, Datenschicht | fertig (13) | kein Hash |
| 4 Bestellungen, Termine | fertig (14) | 1b685f3 im Verlauf |
| 5 Stripe, Visual, E2E | offen (15) | Stripe-Commits ab 24.10.2026, kein E2E |
| 6 Puffer, Abschluss | offen (16) | kein Eintrag |

Letzter Eintrag: Paket 4, zuletzt geändert 24.09.2026 (822a0d9), danach 141 Commits. Prüf-Workflow ohne dokumentiertes Ergebnis (Z. 19).

## 7 GESTALTUNGSLAUF (`docs/gestaltung/BERICHT.md`)
- AUSNAHME 1 (Z-04, Z. 17, 35, 42): Gestaltungsnote, Schwelle 8 nur bei H01. Endprüfung bestätigt.
- AUSNAHME 2 (Z-08, Z. 18, 39, 43): Ladezeit Code-Shop, LCP +28 ms. Endprüfung bestätigt.
- Offen: Z-05 Rest R-8 (Z. 36), Z-01 nur E6-L-13 (Z. 32), Codestand 3315165 ohne Lint- und Unit-Protokoll (Z. 48).
- Überholt: Z. 52 und 60 bis 62. Git: Merge 0a34dc4 am 20.10.2026, `_werkstatt` entfernt mit 504e905.

## 8 MESSWERTE (`docs/wert/belege`)
- Im Ordner liegen 23 JPG-Screenshots und keine Textdatei. Deren Inhalt habe ich nicht ausgewertet. Messwerte stehen in EVALUIERUNG Z. 396 bis 409 (Persona-Zeiten, Desktop und Handy) und Z. 361 (LCP 0,58 bis 0,79 s). Rohdaten `a11y-perf.json` fehlen im Repo.
- Vorbehalt: Zeitmodell ist Annahme (Z. 386 bis 390), Testbuild ohne Stripe und Resend (Z. 732).

## PRÜFUNG UND ERGEBNIS
M-01 bis M-37 ohne Lücke. Jeder offene Befund hat eine Zeile (45, 15, 70, 13). Zählkontrolle: 53 + 33 + 12 = 98; 132 + 15 = 147.

## GEMEINSAME DATEIEN (gewünscht, nicht ausgeführt)
1. `README.md` Z. 78 und 79: 113 auf 132 und 11 auf 15 setzen, Testanzahlen nach einem Testlauf.
2. `docs/LIVEGANG.md`: Erledigt-Vermerk je Schritt.
3. `docs/nacht/FORTSCHRITT.md`: Pakete 5 und 6 nachtragen oder als überholt markieren.
4. `docs/gestaltung/MENSCHEN.md` Z. 22 und `BERICHT.md` Z. 52, 60 bis 62: Merge vermerken, nur mit Freigabe.

## BELEGE
Git: 0a34dc4, 504e905, ff39e7f, 9a7aafa, 285a6cf, b8e7ea7 (in main). Fundstellen wie oben.

## OFFENE FRAGEN
1. Testzahlen in README, BERICHT und FORTSCHRITT weichen ab. Nur ein Testlauf klärt sie.
2. Eigentexte und weitere Klammern erfasst die Prüfung nicht. Entscheidung beim Orchestrator.
3. M-14: Merge laut Git am 20.10.2026, Bestätigung des Inhabers fehlt im Repo.
4. FORTSCHRITT endet bei Paket 4, E2E fehlt.
5. Welche Liste gilt: BERICHT Z. 26 (M-01 bis M-28) oder `MENSCHEN.md` (M-01 bis M-37)?
6. M-13: Wortlaut offen, BERICHT Z. 57 meldet Umsetzung.
7. E5-b (EVALUIERUNG Z. 369) ist Pflicht vor dem Livegang, LIVEGANG.md führt sie nicht auf. Ebenso die Test-DB-Bereinigung (Z. 738).
8. Endstatus je offenem Eintrag (Kern-Auszug) vergibt der Inhaber.
9. `_werkstatt/…`-Belege des Gestaltungslaufs fehlen im Arbeitsbaum, nur über Git erreichbar.

Umfang: 1470 Wörter ohne Tabellenzeichen.
