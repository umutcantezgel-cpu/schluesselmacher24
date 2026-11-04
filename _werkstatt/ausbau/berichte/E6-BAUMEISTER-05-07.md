# E6 Welle 4 · BAUMEISTER-05, -06, -07 (Workflow mit Haiku, Abnahme Orchestrator)

Gebaut am 2026-11-04 ab 09:10 als Workflow `e6-welle-4` (Lauf wf_c9e3ec86-f01): drei Haiku-Baumeister parallel in getrennten Ordnern, je ein Haiku-Gegenprüfer mit der Prüfliste aus der Paketdatei, Nachbesserung bei Befunden hoch oder mittel (05 und 07). Acht Agenten, keiner ausgefallen. Commits 3f49c08 (05), ec036c2 (06), 83d90ee (07).

## Ergebnis
- **05 Vor Ort (G-40 Teil Anfrage, EL-44, EL-45):** Abschnitt „Einsatz anfragen“ auf /service-und-termin/vor-ort mit eingebetteter Anfrage in drei Schritten (Anliegen, Beschreibung, Fotos frei, Postleitzahl und Ort Pflicht, Straße frei; Kontakt, Wunschzeitraum als Wunsch, Pflichthaken zur Berechtigung mit dem Satz aus dem Kern; Prüfen). Knopf „Einsatz anfragen“ im Kopf. Zusagen nur aus der Rubrik (R4), keine Zeiten, kein Notdienst, kein Preis (R9).
- **06 Foto (G-23, G-45):** Die Beispielbilder im Formular zeigen dieselben gezeichneten Generatoren wie die Seite; der Hinweis zur Ablesbarkeit steht unter den drei Aufnahmen und über dem ersten Foto.
- **07 Nach Code (E-89):** Jeder Treffer der Codesuche trägt „Nach Code bestellen“ mit `?code=`; die Produktseite übernimmt nur einen Code im Format der Linie (Client-Komponente in einer Suspense-Grenze, Seiten bleiben statisch vorgerendert). Prüfung im Formular und auf dem Server unverändert (G9).

## Abnahme durch den Orchestrator
- Ergänzt: Der Server nimmt eine Einsatz-Anfrage nur mit `berechtigt: true` an (R13, `vorOrtOhneBerechtigung`, Test in security.test.ts); Abschnittsfolge 01, 02, 03 mit wechselndem Ton statt 01, 03, 02; Gedankenstrich im vorhandenen Text „Bestandsaufnahme und Beratung“ durch einen Satz ersetzt; jeder Code-Knopf hat für Screenreader den Namen seiner Linie (WCAG 2.4.4).
- Prüfstufe A: Typprüfung und Lint ohne Befund, Unit 2185 von 2185 (vorher 2145), Build grün, Produktseiten der Codelinien weiter statisch (SSG).
- Funktionsliste F-01, F-07, F-14, F-17, F-19 bestanden (protokolle/funktionsliste-2026-11-04_09-30-31.md).
- Sichtprüfung (Playwright gegen den Prüfserver, fremde Dienste und Absendungen als Attrappe, Testdaten pruefung@example.invalid) bei 390 × 844 und 1440 × 900: kein Überlauf, keine Konsolenfehler. Vor Ort: Kopfknopf springt zu #einsatz, „Weiter“ erst mit Haken, Zusammenfassung mit allen Angaben. Code „0812“: 19 Treffer mit Knopf, Klick führt zu /schluessel-nach-code/ms-01?code=0812 mit vorbelegtem Feld; ein ungültiger Code wird verworfen. Foto: Satz auf Seite und im ersten Schritt, Zeichnungen sichtbar.

## Offen
- Gedankenstriche im Bestand (K-010), nicht Teil dieser Pakete: /schluessel-nach-vorlage (page.tsx und anfrage-formular.tsx, mehrere Stellen, auch „Licht — kein direkter Blitz“), Produktseite der Codelinien (Bildunterschrift „0812 – keine echte Schließung“, Kopfzeile „je Stück – Ihr Originalschlüssel“), Codeseite („Schließzylinder — sichtbar“). Der Satz zum Widerrufsrecht im Bestellformular ist Rechtstext und bleibt (G9, R10). Für die Prüfstufe B der Etappe vorgemerkt.
- Echte Beispielfotos für die Foto-Anfrage liefert der Inhaber (G-45); bis dahin bleibt die Zeichnung.
