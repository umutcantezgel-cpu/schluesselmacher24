# FA-BLINDPRUEFUNG-11 · Blindprüfung Kundschafter 11 (Abschnitte 25, 26, 27, Anhang B Punkt 4)

Rolle Blindprüfer, Stufe 3, nur lesend. Keine Projektbefehle ausgeführt; Belege aus Quelltext und vorhandenen Protokollen.

## Zählung
Abschnitt 25: 6 Aufzählungspunkte (aufgefächert in 21 Einzelanforderungen) plus Zielwert-Kasten mit Einschränkung „kein Selbstzweck“, plus Einleitungssatz „von Anfang an technisch mitdenken“. Abschnitt 26: 9 Punkte. Abschnitt 27: Grundsatz, 13 Tabellenzeilen, Abnahme-Kasten (drei Teile: echte Testbestellung/-anfrage, Nachweis per Screenshot oder Protokoll, keine Demo-Daten/Platzhalter/falschen Kontaktdaten). Anhang B Punkt 4: 1.
Vom Kundschafter nicht eigens gelistet: Einleitungssatz 25 (SEO von Anfang an, pflegbar), Einschränkung des Zielwerts, „keine falschen Kontaktdaten“ und der Nachweisteil des Abnahmekastens.

## Geprüft am Code: 22 Urteile, 17 bestätigt, 5 geändert

| Kennung | alt | neu | Grund |
|---|---|---|---|
| FA-26-04 | erfuellt | teilweise | `use-flow.ts:120-122` speichert ausdrücklich keine Dateien; Schritte stehen nicht in der Browser-Historie (kein pushState/popstate in den Abläufen außer Zylinder und Planer). Die Zurück-Taste des Browsers oder Android verlässt den Ablauf, gewählte Fotos sind weg, Text kommt nur aus localStorage zurück (kann scheitern, `saved`). Nur der eigene Zurück-Knopf ist verlustfrei. |
| FA-27-01 | fehlt | teilweise | `werkzeuge/funktionsliste.mjs:1151-1169` treibt F-01 bis F-19 im Browser (Playwright) durch Warenkorb, Kasse, Assistent, Konfiguratoren, Vorlage, Sicherheitscheck, Zutritt, Partner; Protokolle in `protokolle/funktionsliste-*.md`. Schreibende Anfragen sind Attrappen (lib.mjs:149-177), also kein Durchlauf bis Datenbank, Mail, Zahlung, Admin. |
| FA-27-03 | teilweise | widerspricht | Pflichttest verlangt „Datenbank, alternative Dokumente“; `motorradschluessel/anfrage/kern.ts:1-4` und AUFTRAG G-19: „keine Fahrzeugdatenbank“; Fahrzeugschein ist Pflicht (`anfrage-formular.tsx:87,149`), keine alternativen Dokumente. Arbeitsanweisung Z.166/174 verlangt Motorrad-Hersteller und -Modelle. |
| FA-27-10 | fehlt | teilweise | F-07 durchläuft `/elektronische-zutrittsloesungen/konfigurator` bis Absenden (Attrappe); `submitRecord` serverseitig getestet (`lib/actions/security.test.ts`). Aber: der Ablauf hat gar keine Uploads (`zutritt-konfigurator.tsx:673 uploads: []`) — Pflichtpunkt „Uploads“ ist Baulücke, nicht nur Testlücke. |
| FA-27-11 | fehlt | teilweise | F-07 durchläuft `/sicherheitstechnik/sicherheitscheck` bis Absenden (Attrappe); Uploads vorhanden (`sicherheitscheck.tsx:929,944`). Kein Unit-Test, kein Durchlauf bis Kontakt/Admin. |

Bestätigt (am Code oder Protokoll): FA-25-02, -03, -04, -05, -06, -07, -08, -11, -12, -19, -20, -21, -22, FA-26-03, FA-26-08, FA-27-15, FA-AB-04.

## Ergänzungen zu bestätigten Urteilen (Lückentexte zu schwach)
- FA-25-02: Snippet-Protokoll `protokolle/snippet-2026-11-02_23-23-34.json`: nur 28 von 181 indexierbaren Titeln innerhalb 580 px (15,5 %), nicht nur Startseite und Codelinien.
- FA-25-03: dasselbe Protokoll: 35 von 181 Beschreibungen außerhalb 120–160 Zeichen (nicht 6 von 26).
- FA-25-04: Inventar `protokolle/inventar-2026-11-02_23-23-33.tsv` belegt genau eine h1 auf allen 199 HTML-Seiten (Stand 2.11.). Offen bleibt nur die Hierarchie h2/h3 und ein aktueller Lauf.
- FA-25-08/-10/-11: Inventar: Locksmith 1 Seite, Service 1 Seite, 38 indexierbare Seiten ohne BreadcrumbList, 37 ganz ohne JSON-LD (u. a. alle Leistungsseiten unter /tuer-und-schliesstechnik und /sicherheitstechnik, /autoschluessel/nachmachen).
- FA-26-08: Motorrad hat „Weiß ich nicht“ beim Transponder (`kern.ts` TRANSPONDER_OPTIONEN); Sackgasse ist dort der Pflicht-Fahrzeugschein ohne Alternative (Kleinstfahrzeuge mit Versicherungskennzeichen).
- FA-25-19: bessere Belege `schluessel-nach-code/[slug]/page.tsx`, `ratgeber/[slug]/page.tsx:69-75` (interne Links aus dem Admin, `seoFeld().interneLinks`).

## Übersehen
- FA-25-00 SEO von Anfang an, im Admin pflegbar: `payload/fields/gemeinsam.ts:186-219` (Titel, Beschreibung, interne Links, noindex in sechs Sammlungen) — teilweise: maxLength 90/320 ohne Führung auf 580 px/120–160 Zeichen. Aufwand S.
- FA-25-23 Zielwert kein Selbstzweck: durch R3/R4 abgedeckt — erfuellt, kein Bau.
- FA-27-16 Nachweis der Abnahme per Screenshot oder Testprotokoll je Hauptprozess: Protokolle der Funktionsliste existieren nur mit Attrappen, keine echte Testbestellung — teilweise.
- FA-27-17 Keine falschen Kontaktdaten übrig: Firmendaten-Prüfung `livegang-pruefung.ts:40-50`, Rechtsseiten-Platzhalter `:84`; Testdaten in Seeds/Inhalten (example.org) nicht vom Gate erfasst — teilweise.

## Risiken
Siehe strukturierte Rückgabe.

## OFFENE FRAGEN
- Gelten Inventar und Snippet-Werte vom 2.11. noch? Neuer Lauf nötig, bevor gebaut wird.
- Motorrad-Datenbank: G-19 (keine Datenbank) gegen Arbeitsanweisung vom 11.11. — Inhaberentscheidung.
- Seobility: Konto und Crawl sind Menschensache (G3); im Repository höchstens Prüfliste und Protokollablage.
