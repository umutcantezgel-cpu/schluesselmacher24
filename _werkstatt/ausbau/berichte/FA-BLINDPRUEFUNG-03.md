# FA-BLINDPRUEFUNG-03 · Blindprüfung Kundschafter 03 (Abschnitte 07, 08)

Stand 2026-11-15 · Stufe 3 · nur gelesen, nichts ausgeführt.

## Vollständigkeit
Abschnitt 07: Einleitung (2), Kasten Plattformgedanke (1), 9 Partnerleistungen, 7 Punkte Qualitätskontrolle = 19.
Abschnitt 08: Einleitung (1), Startseiten-Sektion (1), Landingpages (1 + 5), Formular (7 Merkmale), Regionszuordnung (1), Leadnachweis (1) = 17.
Alle 36 sind beim Kundschafter gelistet. Nichts übersehen.

## Nachgeprüft: 31 Urteile, 29 bestätigt, 2 geändert

### Korrekturen
- **FA-07-13 erfuellt → teilweise.** Das Gate (bewerbung.ts:55-72, Partnerbetriebe.ts:36-43) sperrt nur den Status „freigeschaltet“ der Sammlung `partnerbetriebe`. Dieser Status wirkt nirgends: Die Vermittlung zeigt auf den Bewerbungs-Vorgang (Vorgaenge.ts:386-391, `relationTo: 'vorgaenge'`), nicht auf den Partnerbetrieb. `darfVermitteln` wird nur im Test aufgerufen (partner.test.ts:46-48). freigabe.db.test.ts:136-148 belegt, dass ein Bewerber mit Status „neu“ Aufträge erhalten kann. „Prüfen vor Freischaltung“ ist damit nur ein Häkchen ohne Folge. Zudem gibt es keinen Nachweisbezug, kein Datum und keinen Prüfer.
- **FA-08-09 erfuellt → teilweise.** Im Formular sind PLZ und Ort Pflicht, die Prüfung ist aber schwach (partner-formular.tsx:106: PLZ ab 4 beliebigen Zeichen). Der Server prüft beim Partner nur Bereich und Einwilligung (records.ts:151), die Angaben zur Region also nicht. Eine Auswahl der Region im Sinne des Inhabers (Einsatzgebiet oder Region, Abschnitt 09) gibt es nicht.

### Bestätigt (Auswahl mit Ergänzungen)
- FA-07-02 widerspricht: bestätigt. Es gibt weitere Fundstellen. navigation.ts:313 („Für Schlüsseldienste und Betriebe“), partner-werden/page.tsx:29 („Für Schlüsseldienste und Fachbetriebe“) und AUFTRAGSARTEN in partnervertrag.ts:79-86 sprechen Schlüsseldienste an.
- FA-07-03 teilweise: bestätigt. Zusätzlich sagt partner-werden/page.tsx:55 „Ihr Betrieb … rechnet direkt mit dem Kunden ab“, und Modell A ist Standard (Partnerbetriebe.ts:72-80). Abschnitt 05 verlangt dagegen, dass der Gesamtbetrag zentral vereinnahmt wird. Das ist Zahlverhalten nach G9 und braucht den Inhaber.
- FA-07-19 teilweise: bestätigt, sogar schärfer. Ein Filter nach Status ist mit dem heutigen Modell gar nicht möglich, weil die Beziehung auf `vorgaenge` zeigt.
- FA-08-17 teilweise: bestätigt. `vorgaenge` hat keine Versionen, der Hook vorgang-benachrichtigen.ts protokolliert nur Status und Zahlung und keine Vermittlung.
- FA-07-04: Die Lücke „vor Ort statt Werkstatt“ ist strittig. Laut Kasten erbringt der Partner die Leistung „vor Ort“. Das Urteil bleibt teilweise, weil es nur einen Sammelpunkt gibt.
- FA-07-17 fehlt: bestätigt. Nur die freie Prüfnotiz (Partnerbetriebe.ts:105) könnte einen Besuch aufnehmen, ein eigenes Feld gibt es nicht.
- FA-07-06/07/08/09/11/12, FA-08-02 bis FA-08-08: Gezielt gesucht (Profi?, Kooperation, Aufträge erhalten, Keyless, Transponder, Motorrad, Gehäuse, Schlüsselverlust, Besuch, Startseite). Nichts gefunden, „fehlt“ ist bestätigt.
- FA-08-13 und FA-08-15 erfuellt: bestätigt. Radius und mobil sind Pflicht, die Kontaktfelder sind Pflicht, und beide Mails gibt es (kunde-eingang.ts:40, betrieb-neuer-vorgang.ts:57-85).

Nicht am Code nachgeprüft: FA-07-05, FA-07-10, FA-08-11, FA-08-14 (nur über das Formular plausibel).

## Risiken für den Bau
1. **Datenmodell:** `vermittlung.partner` zeigt auf Bewerbungs-Vorgänge. Ein Umstieg auf `partnerbetriebe` muss additiv geschehen, also mit neuem Feld, Übernahme der Daten und ohne das alte Feld zu löschen (G6). Davon hängen freigabe.db.test.ts:136-148, leitfaden.db.test.ts:145 und `referral.partnerId` in payload-mapping.ts ab.
2. **Auftragsarten und Leistungen kürzen:** Werte aus Postgres-Enums zu entfernen ist nicht additiv. Vorhandene Werte bleiben deshalb ausgeblendet erhalten. Die Provisionen je Auftragsart (nur Inhaber, G13) hängen an den alten Werten.
3. **Zahlungs- und Steuerrecht:** Wenn S24 zentral vereinnahmt (Modell B), geht es um ZAG (Fremdgeld), Umsatzsteuer (Vermittler oder Leistender) und Rechnungsstellung. B ist bewusst per Umgebungsvariable gesperrt. Seitentext und Vertragsentwurf widersprechen Abschnitt 05. Das entscheiden nur Inhaber, Anwalt und Steuerberatung.
4. **Fünf Landingpages:** Nahezu gleichlautende Keyword-Seiten gefährden R2 und R3 (Brückenseiten, Massenware). Jede Seite braucht eigenen Informationsgewinn, sonst ist sie mit Canonical oder einer zusammengeführten Seite zu lösen. OFFENE FRAGE an den Inhaber.
5. **Datenschutz:** Besuchsprotokolle, Identitätsnachweise und die Weitergabe von Leads an Partner (Übermittlung von Kundendaten) verlangen eine Ergänzung in verarbeitungen.ts und in den Kundenhinweisen.
6. **Markenrecht:** Die Fahrzeugabdeckung nennt Herstellermarken nur sachlich (R12).
7. **Tests:** navigation.test.ts:75-79 (Partner unter „Mehr“). Das Entfernen der Rubrik „Schlüsseldienst vor Ort“ (rubriken.json:391, imHub) berührt Hub und Vor-Ort-Tests. Das braucht die Klärung durch den Inhaber (OFFENE FRAGE des Kundschafters bleibt).
