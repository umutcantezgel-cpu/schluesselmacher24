# FA-BLINDPRUEFUNG-08 · Blindprüfung zu FA-KUNDSCHAFTER-08

Stand 15.11.2026. Rolle: Blindprüfer, Stufe 3, nur lesen. Quelle: `_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Zeilen 388 bis 459 (Abschnitte 16 bis 19), Maßstab Abschnitt 29 (Zeilen 684 bis 699).

Ergebnis: 56 Urteile am Code nachgeprüft, 52 bestätigt, 4 geändert, 2 Anforderungen ergänzt.

## Korrekturen

| Kennung | alt | neu | Begründung |
|---|---|---|---|
| FA-16-18 | teilweise | erfuellt | Der Kunde sieht die Zusammenfassung nicht nur auf der Bestätigungsseite. Die Eingangsmail enthält den privaten Link `/bestellung/[id]?t=…` (`src/lib/mail/vorlagen/gemeinsam.ts:54`). Diese Seite zeigt bei Nicht-Bestellungen `record.summary` (`src/app/(site)/bestellung/[id]/page.tsx:218-223`, Ausgabe `:393`). Die Mail selbst lässt Freitext bewusst weg (Datenschutz, `kunde-eingang.ts:8`). Ein Neubau „Zusammenfassung in die Mail“ wäre doppelt und würde diese Regel brechen. |
| FA-17-01 | erfuellt | teilweise | `navigation.ts:169-185` ist nur die alte Bereichsliste `NAV_AREAS`. Der Kopf nutzt `navigationsGruppen` (`src/app/(site)/layout.tsx:75`) mit fünf festen Gruppen (`navigation.ts:325-337`). Die Rubrik „Elektronische Schließsysteme“ hängt dort unter „Mehr“, zusammen mit Sicherheitstechnik und Tür- und Schließtechnik (`content/rubriken.json`, `navigation: "mehr"`). In der Hauptnavigation ist der Zutritt also keine Hauptkategorie und steht im selben Topf wie Sicherheitstechnik. Im Hub (`imHub: true`) und im Abschnitt Projekte der Startseite ist er eigenständig. |
| FA-19-02 | fehlt | teilweise | Der Bau ist vorhanden, nur die Daten fehlen. Im Backend gibt es den Reiter „Hersteller“ im Global Zylinderkatalog (`src/payload/globals/Zylinderkatalog.ts:127-169`) mit Name, Kennung, Haken „Angeboten“, Beschreibung, Aufpreis und Zusatzkomponenten. Der Sperrschließungs-Konfigurator zeigt den Schritt, sobald ein Eintrag aktiv ist, und zeigt dann auch die Beschreibung (`gleichschliessende-zylinder/konfigurator/konfigurator.tsx:53-57`, `:700-720`). Tests decken das ab (`cylinder-rules.test.ts`, `pricing.test.ts:708ff`). Es fehlen die Einträge (`content/cylinder-catalog.json:19`) und eine Anzeige auf der Landingpage `/gleichschliessende-zylinder`. Ein neuer Herstellerschritt wäre doppelter Bau. |
| FA-19-04 | fehlt | teilweise | Für Sperrschließungen gibt es das Feld `beschreibung` je Hersteller, das der Betrieb pflegt und das der Konfigurator anzeigt (siehe FA-19-02). Für den Zutritt und die Startseite fehlt das. |

## Bestätigt mit Hinweis

- FA-17-02: In der Elektronik-Seite fehlen BKS und ABUS, das stimmt. Im Schließanlagen-Konfigurator stehen sie aber bereits als Systemwahl mit festem Satz: „Mechanische Schließanlagen planen wir mit Systemen von ABUS und BKS“ (`projekt-konfigurator.tsx:306-310`, `:779-785`, `:1312-1331`). Der Partnerbereich sollte diese Stelle als Datenquelle mitnehmen, statt eine zweite feste Liste anzulegen.
- FA-16-02: Inhalt stimmt mit der Tabelle überein. Offen ist nur der Begriff. „Zentralschlossanlage“ ist der fachübliche Begriff, „Zentralschließung“ kann mit Fahrzeugen verwechselt werden. OFFENE FRAGE an den Inhaber, keine Pflicht zur Umbenennung.
- FA-16-19: Die Zusammenfassung aus dem Browser wird ungeprüft übernommen (`records.ts:159`). Bei einer Anfrage ohne Preis ist das hinnehmbar.
- FA-19-06: Die Regel gilt nur, solange es keine Logos gibt. Vorbild für eine Freigabesperre ist `src/payload/collections/Nachweise.ts` („liegt vor“ plus „auf der Seite zeigen“).
- FA-17-18: Kein Feld zur Erweiterbarkeit, auch nicht unter einem anderen Namen. Schritt 6 „Standorte“ fragt den heutigen Bestand ab, nicht die Erweiterung.

## Ergänzt (übersehen)

- FA-16-20 „verständlich und interaktiv“ (Überschrift Abschnitt 16): erfuellt. `SchliessplanInteraktiv` mit Reitern je System (`schliessanlagen/page.tsx:375`), Vergleichstabelle (`:390`).
- FA-16-21 Pflegbarkeit der Erklärtexte (Abschnitte 16 und 17 mit Maßstab Abschnitt 29, Zeile 693): teilweise. Die Erklärungen der Systeme Z, HS und GHS (`system-erklaerung.tsx:32-222`, Kommentar `:11-13`), die Erklärblöcke zum Zutritt (`elektronische-zutrittsloesungen/page.tsx:64-221`) und die Auswahllisten des Zutrittskonfigurators (`zutritt-konfigurator.tsx:40-366`) stehen fest im Code. Pflegbar sind nur Kopftexte, häufige Fragen (`getPageContent`) und die Leistungsseiten.

## Risiken

- Markenrecht: Logos und Namen von BKS, ABUS und BURG WÄCHTER nur mit belegter Bezugs- oder Partnerbeziehung und nach den Markenrichtlinien der Hersteller zeigen (Abschnitt 19, R12, G9). Freigabe- und Nachweisfeld je Partner einplanen, Vorbild `Nachweise.ts`. BURG WÄCHTER kommt im Bestand nirgends vor.
- Tests: `src/lib/navigation.test.ts:63` legt fest, dass `elektronische-schliesssysteme` unter „Mehr“ steht. Wird der Zutritt zur Hauptkategorie, muss der Test bewusst angepasst werden, nicht gelockert (G8). Die fünf Gruppen gehen auf die frühere Vorgabe G-08 zurück. OFFENE FRAGE: Gilt G-08 oder Abschnitt 17?
- Recht: Ein Hinweis auf Strafrecht (FA-18-14) und auf heimliche Aufzeichnung (FA-18-13) berührt Rechtstexte (`datenschutz-inhalt.tsx`). Nur als Entwurf zur Prüfung (G9, R10).
- Sperrschließung: Hersteller nur mit echten Preisen und Aufpreisen anlegen. Ein aktiver Hersteller ohne Daten verändert die Preisberechnung (`pricing.test.ts:708ff`). Keine erfundenen Werte (G9, R4).
- Abnahmetabelle (Abschnitt 27, Zeile 623, außerhalb dieses Pakets): Der Zutritt verlangt „Systemauswahl, Uploads“. Der Zutrittskonfigurator sendet `uploads: []` (`zutritt-konfigurator.tsx:673`) und hat keine Hersteller- oder Systemwahl. Das passt zu FA-17-02 und FA-19-03 und sollte im selben Bau erledigt werden.
- Startseite: Ein Logoband braucht Bilder in hoher Qualität bei schnellem Laden (Abschnitt 19, „gute Qualität“). Ein `public`-Verzeichnis gibt es nicht. Die Logos müssen über die Sammlung Medien im Backend kommen, mit JSON-Fallback (G6).
- Sicherheitstechnik („eigener großer Bereich“) steht in der Hauptnavigation ebenfalls unter „Mehr“. Siehe FA-17-01. OFFENE FRAGE.
