# E6-BAUMEISTER-01 · Motorradschlüssel: Rubrikseite und Anfrage mit Transponder-Pflichtfrage

## 1. Kopfzeile
Kennung E6-BAUMEISTER-01 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderung G-19 · Kriterium Z-05 · Schreibrechte: `src/app/(site)/motorradschluessel/` (nur dieser Ordner, neue Dateien darin erlaubt)

## 2. Rollenbriefing
Baumeister: baut nach vorhandenem Muster, erfindet nichts dazu. Fehler: eigene Komponenten statt der vorhandenen, erfundene Fakten oder Preise, Texte mit Gedankenstrichen, Logik ohne Test.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Baue die Rubrikseite `/motorradschluessel` und die Anfrage `/motorradschluessel/anfrage` (Motorrad, Transponder-Pflichtfrage, Fotos von Schlüssel und Fahrzeugschein, Kontakt, Absenden) genau nach den Mustern unten.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Jede Rubrik hat eine Seite mit „So läuft Ihr Auftrag ab“ aus den Rubrikdaten und einen Weg, der in einer vollständigen Anfrage endet. Die Rubrik „motorradschluessel“ steht schon in `content/rubriken.json` (Ziel `/motorradschluessel`, Nachweis Fahrzeugschein, Pflicht-Uploads Fahrzeugschein und Schlüsselfoto, vier Ablaufschritte), aber noch mit Status „spaeter“ und ohne Seite. Der Server prüft Fahrzeugschein und Schlüsselfoto schon selbst, wenn das payload `quelle: 'motorrad'` trägt und der Bereich `autoschluessel` ist. Den Status auf „live“ setzt der Orchestrator nach deiner Rückgabe.

## 5. Kern-Auszug (unveränderlich)
- G-19 wörtlich: „Motorradschlüssel nur als Anfrage: Typ, Baujahr, Fahrzeugschein, Foto des Schlüssels und die Pflichtfrage Transponder ja, nein oder weiß nicht, mit Erklärung, dass ein Motorrad mit Wegfahrsperre ohne Chip nicht anspringt; keine Fahrzeugdatenbank.“ Also: Hersteller und Typ als freie Eingabe, keine Auswahlliste von Modellen.
- R13: Fahrzeugschein ist Pflicht. R4: keine Preise, keine Fristen, keine Zusagen, die nicht im Muster stehen. R9: nichts „kostenlos“.
- Ton (K-010): Sie-Anrede, kurze Sätze, keine Gedankenstriche (– und —), keine Ausrufezeichen, keine Floskeln.

## 6. Maßstab (Muster, Datei für Datei)
- `src/app/(site)/motorradschluessel/layout.tsx`: wie `src/app/(site)/schluessel-einschicken/layout.tsx`, aber `area="autoschluessel"`.
- `src/app/(site)/motorradschluessel/page.tsx` (Server): Aufbau wie `src/app/(site)/schluessel-einschicken/page.tsx` in klein: `generateMetadata` mit Titel „Motorradschlüssel nachmachen lassen: Anfrage mit Fotos“ und kanonischer Adresse; `PageHeader` mit `rubrik={await getRubrik('motorradschluessel')}`, `bereich="autoschluessel"`, Knopf „Anfrage stellen“ zu `/motorradschluessel/anfrage`; danach `RubrikAblaufAbschnitt` aus `@/components/rubrik/rubrik-ablauf` mit `nummer="01"`; danach ein Abschnitt 02 „Chip im Schlüssel“ mit diesem Inhalt: Ein Motorrad mit Wegfahrsperre springt ohne den passenden Chip im Schlüssel nicht an. Deshalb fragen wir, ob Ihr Schlüssel einen Chip hat. Wenn Sie es nicht wissen, wählen Sie „weiß nicht“; wir klären es anhand Ihrer Fotos. Kein weiterer Inhalt, keine Fragen, keine Preise.
- `src/app/(site)/motorradschluessel/anfrage/page.tsx` (Server): wie `src/app/(site)/schluessel-einschicken/anmelden/page.tsx` (PageHeader `art="arbeit"`, Brotkrumen Motorradschlüssel und Anfrage, darunter das Formular).
- `src/app/(site)/motorradschluessel/anfrage/kern.ts`: reine Funktionen ohne React: Typ `MotorradDaten`, `INITIAL`, `schrittGueltig(daten, schritt)` und `motorradZusammenfassung(daten)` (SummarySection[] mit Abschnitt „Motorrad“ und „Kontakt“). Baujahr: genau vier Ziffern zwischen 1950 und dem laufenden Jahr plus 1.
- `src/app/(site)/motorradschluessel/anfrage/anfrage-formular.tsx` (Client): Aufbau genau wie `src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx` (FlowShell, `useFlow`, `useFormularSchutz`, `AnfrageHinweis`, gesperrte Hinweise je Schritt, Fehlermeldung, `WegBestaetigung` nach dem Absenden). Fünf Schritte:
  1. `motorrad`: Hersteller (Pflicht, höchstens 60 Zeichen), Modell oder Typ (Pflicht, höchstens 80), Baujahr (Pflicht, `inputMode="numeric"`).
  2. `transponder`: Pflichtfrage als drei `OptionCard`: „Ja, mit Chip“, „Nein, ohne Chip“, „Weiß ich nicht“ (Werte `ja`, `nein`, `unklar`), darüber der Satz zur Wegfahrsperre aus Abschnitt 6.
  3. `unterlagen`: zwei `PhotoUpload` wie im Muster `src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`: Schlüsselfoto (`category="schluesselfoto"`, mindestens eins) und Fahrzeugschein (`category="fahrzeugschein"`, `allowDocuments`, mindestens eins), jeweils mit `example` (ImageSlot mit Motivbeschreibung wie im Muster). „Weiter“ erst, wenn beide da sind (wie `karteFehlt` im Einsende-Muster).
  4. `kontakt`: Anrede (frei), Vorname, Nachname, E-Mail, Telefon (Pflicht), Postleitzahl und Ort (frei); Felder mit `autoComplete` wie im Muster.
  5. `absenden`: `Alert tone="legal" title="Noch kein Vertrag"` mit: Mit dem Absenden stellen Sie eine Anfrage. Preis und Termin nennen wir Ihnen nach der Prüfung. Danach `SummaryList`.
  Absenden: `submitRecord({ schutz, kind: 'anfrage', area: 'autoschluessel', process: 'gefuehrte-anfrage', contact, payload: { quelle: 'motorrad', hersteller, modell, baujahr, transponder, anmerkung }, summary, uploads })` mit den Fotos über `alsUpload(datei, 'schluesselfoto')` und `alsUpload(datei, 'fahrzeugschein')`. Bestätigung: `marke="Anfrage eingegangen"`, `titel="Ihre Motorrad-Anfrage ist bei uns"`, `text="Wir prüfen Typ, Schlüssel und Fahrzeugschein und melden uns mit Preis und Termin."`, `schritte={naechsteSchritte({ kind: 'anfrage', area: 'autoschluessel', process: 'gefuehrte-anfrage', payload: { quelle: 'motorrad' } })}`, `summary`, `zurueck={{ href: '/motorradschluessel', label: 'Zurück zum Motorradschlüssel' }}`.
- `src/app/(site)/motorradschluessel/anfrage/kern.test.ts`: Tests für `schrittGueltig` (jeder Schritt gültig und ungültig, Baujahr 1949, 2026, „19a0“) und `motorradZusammenfassung` (Transponder als Text „mit Chip“, „ohne Chip“, „unklar, bitte prüfen“).

## 7. Grenzen
G4 (nur erfundene Testdaten), G5, G8 (keine Prüfung abschalten, kein eslint-disable), G9, R4, R9, R13. Nur die Schreibrechte aus Abschnitt 1. `content/rubriken.json`, `src/app/sitemap.ts`, `src/lib/**` und gemeinsame Komponenten änderst du nicht; brauchst du dort etwas, schreib es unter GEMEINSAME DATEIEN in den Bericht. Kein Build, kein Commit.

## 8. Schritte
1. Lies die Muster aus Abschnitt 6 vollständig und `node_modules/next/dist/docs` zu `page.tsx` und `generateMetadata`.
2. Lege die Dateien aus Abschnitt 6 an, Muster zuerst kopieren, dann anpassen.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/motorradschluessel"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/motorradschluessel"`.
4. Bericht.

## 9. Selbstprüfung
Kein `—`, kein `–`, kein Ausrufezeichen in Texten; keine Modellliste, keine Preise; Fahrzeugschein und Schlüsselfoto sind Pflicht im Formular; Tests, Typprüfung und Lint grün; `git status` zeigt nur Dateien unter `src/app/(site)/motorradschluessel/`.

## 10. Ausgabe
Dateien aus Abschnitt 6, Bericht nach `_werkstatt/ausbau/berichte/E6-BAUMEISTER-01.md` (höchstens 600 Wörter) nach dem Ausgabeformular in `_GEMEINSAM.md`.

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-01 · BEREIT ZUR RÜCKGABE ===
