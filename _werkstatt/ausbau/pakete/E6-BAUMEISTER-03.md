# E6-BAUMEISTER-03 · Kontaktseite: Nachricht mit Fotos und gewünschtem Antwortweg

## 1. Kopfzeile
Kennung E6-BAUMEISTER-03 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderung G-36 · Kriterium Z-05 · Schreibrechte: `src/app/(site)/service-und-termin/kontakt/` (nur dieser Ordner, neue Dateien darin erlaubt)

## 2. Rollenbriefing
Baumeister: baut nach vorhandenem Muster, erfindet nichts dazu. Fehler: eigene Komponenten statt der vorhandenen, Zusagen zu Rückrufzeiten, Texte mit Gedankenstrichen, Logik ohne Test.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Ergänze die vorhandene Seite `/service-und-termin/kontakt` um einen kurzen Abschnitt „Nachricht schreiben“ mit einem Formular in drei Schritten (Nachricht mit freiwilligen Fotos, Kontakt mit gewünschtem Antwortweg, Absenden), ohne die bestehenden Abschnitte zu verändern.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Die Kontaktseite zeigt heute Anschrift, Telefon, E-Mail und Öffnungszeiten und verweist für Anfragen auf `/service-und-termin/anfrage`. Für kurze Nachrichten fehlt ein Formular mit Foto (G-36). Jeder Weg endet mit der gemeinsamen Bestätigung `WegBestaetigung` (Vorgangsnummer, „So geht es weiter“). Die Seite bleibt sonst, wie sie ist.

## 5. Kern-Auszug (unveränderlich)
- G-36: Kontaktformular mit Foto-Upload.
- R4 und R9: keine Zusage zu Antwortzeiten oder Rückrufzeiten. Der Kunde wählt nur, wie er die Antwort bekommen möchte (E-Mail oder Telefon, beim Telefon ein bevorzugtes Zeitfenster vormittags, nachmittags oder egal). Text dazu: „Wir antworten auf dem Weg, den Sie wählen.“
- Ton (K-010): Sie-Anrede, kurze Sätze, keine Gedankenstriche (– und —), keine Ausrufezeichen, keine Floskeln.

## 6. Maßstab (Muster, Datei für Datei)
- `src/app/(site)/service-und-termin/kontakt/kern.ts`: reine Funktionen ohne React: Typ `KontaktDaten` (anliegen, nachricht, antwortweg `'email' | 'telefon'`, zeitfenster `'vormittags' | 'nachmittags' | 'egal'`, vorgangsnummer, anrede, vorname, nachname, email, telefon), `INITIAL`, `ANLIEGEN` (Liste: „Frage zu einem laufenden Auftrag“, „Frage zu einer Leistung“, „Rückmeldung zu unserer Arbeit“, „Etwas anderes“), `schrittGueltig(daten, schritt)` und `kontaktZusammenfassung(daten)` (SummarySection[] mit „Nachricht“ und „Kontakt“). Regeln: Nachricht Pflicht, 10 bis 2000 Zeichen; Vorgangsnummer frei, höchstens 40 Zeichen; Vorname und Nachname Pflicht; E-Mail Pflicht (Muster wie `EMAIL_MUSTER` im Einsende-Formular); Telefon Pflicht nur beim Antwortweg Telefon (mindestens sechs Ziffern).
- `src/app/(site)/service-und-termin/kontakt/kontakt-formular.tsx` (Client): Aufbau genau wie `src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx` (FlowShell, `useFlow`, `useFormularSchutz`, `AnfrageHinweis`, gesperrte Hinweise je Schritt, Fehlermeldung, `WegBestaetigung`). Drei Schritte:
  1. `nachricht`: Anliegen als `Select` (Pflicht), Nachricht als `TextArea` (Pflicht), Vorgangsnummer (frei, Hinweis „falls Sie schon eine haben“), ein `PhotoUpload` (frei, `category="dokument"`, `allowDocuments`, höchstens drei Dateien, `example` wie im Muster der allgemeinen Anfrage `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx`).
  2. `kontakt`: Anrede (frei), Vorname, Nachname, E-Mail, dann Antwortweg als zwei `OptionCard` („Per E-Mail“, „Per Telefon“); bei Telefon zusätzlich Telefon (Pflicht) und Zeitfenster als drei `OptionCard`.
  3. `absenden`: `SummaryList` mit der Zusammenfassung.
  Absenden: `submitRecord({ schutz, kind: 'anfrage', area: 'service-und-termin', process: 'gefuehrte-anfrage', contact, payload: { quelle: 'kontakt', anliegen, nachricht, antwortweg, zeitfenster, vorgangsnummer }, summary, uploads })` mit `alsUpload(datei, 'dokument')`. Bestätigung: `marke="Nachricht eingegangen"`, `titel="Ihre Nachricht ist bei uns"`, `text="Wir antworten auf dem Weg, den Sie gewählt haben."`, `schritte={SCHRITTE_NACH_ART.anfrage}` aus `@/lib/wege/naechste-schritte`, `summary`, `zurueck={{ href: '/service-und-termin/kontakt', label: 'Zurück zum Kontakt' }}`.
- `src/app/(site)/service-und-termin/kontakt/page.tsx`: nur ergänzen, nichts Bestehendes ändern: nach dem letzten vorhandenen `Section` ein neuer `Section` mit `SectionHeading` (`nummer` die nächste freie Nummer der Seite, `eyebrow="Nachricht"`, `title="Nachricht schreiben"`, `lead="Kurze Frage, ein Foto dazu: Wir antworten auf dem Weg, den Sie wählen. Für ausführliche Anfragen nutzen Sie die Anfrage mit allen Angaben."` mit Link auf `/service-und-termin/anfrage` im Text darunter) und darin `<KontaktFormular />`. Prüfe vorher, ob der vorherige Abschnitt `tone="muted"` hat, und wähle den anderen Ton.
- `src/app/(site)/service-und-termin/kontakt/kern.test.ts`: Tests für `schrittGueltig` (jeder Schritt gültig und ungültig, Telefon nur beim Antwortweg Telefon Pflicht, Nachricht 9 und 2001 Zeichen ungültig) und `kontaktZusammenfassung`.

## 7. Grenzen
G4 (nur erfundene Testdaten), G5, G8 (keine Prüfung abschalten, kein eslint-disable), G9, R4, R9. Nur die Schreibrechte aus Abschnitt 1. Gemeinsame Komponenten, `src/lib/**`, `content/**` änderst du nicht; brauchst du dort etwas, schreib es unter GEMEINSAME DATEIEN in den Bericht. Kein Build, kein Commit.

## 8. Schritte
1. Lies die Muster aus Abschnitt 6 vollständig und die vorhandene `page.tsx` der Kontaktseite.
2. Lege `kern.ts`, `kern.test.ts` und `kontakt-formular.tsx` an und ergänze `page.tsx`.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/service-und-termin/kontakt"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/service-und-termin/kontakt"`.
4. Bericht.

## 9. Selbstprüfung
Kein `—`, kein `–`, kein Ausrufezeichen in Texten; keine Zusage zu Zeiten; die bestehenden Abschnitte der Seite sind unverändert (`git diff` zeigt in `page.tsx` nur Ergänzungen); Tests, Typprüfung und Lint grün; `git status` zeigt nur Dateien unter `src/app/(site)/service-und-termin/kontakt/`.

## 10. Ausgabe
Dateien aus Abschnitt 6, Bericht nach `_werkstatt/ausbau/berichte/E6-BAUMEISTER-03.md` (höchstens 600 Wörter) nach dem Ausgabeformular in `_GEMEINSAM.md`.

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-03 · BEREIT ZUR RÜCKGABE ===
