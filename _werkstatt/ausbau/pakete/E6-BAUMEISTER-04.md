# E6-BAUMEISTER-04 · Beratung: Rubrikseite und Rückruf-Anfrage

## 1. Kopfzeile
Kennung E6-BAUMEISTER-04 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderungen G-33, G-34 (Beratung per Anfrage), L-380, L-431 · Kriterium Z-05 · Schreibrechte: `src/app/(site)/beratung/` (nur dieser Ordner, neue Dateien darin erlaubt)

## 2. Rollenbriefing
Baumeister: baut nach vorhandenem Muster, erfindet nichts dazu. Fehler: eigene Komponenten statt der vorhandenen, Zusagen zu Uhrzeiten oder Preisen, Produktnamen von Herstellern, Texte mit Gedankenstrichen, Logik ohne Test.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Baue die Rubrikseite `/beratung` mit Wegweiser zu den Beratungsthemen und eine Rückruf-Anfrage in drei Schritten, als Kopie des fertigen Kontaktformulars mit festem Antwortweg Telefon.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Die Rubrik „beratung“ steht in `content/rubriken.json` (Ziel `/beratung`, Bereich `service-und-termin`, Abschluss „beratung“, drei Ablaufschritte: Anliegen schildern, Rückruf, Lösung), noch mit Status „spaeter“. Für Elektronik, Türen und Schließtechnik und Sicherheitstechnik gibt es eigene Rubrikseiten mit eigenen Wegen; die Beratung ist der Weg für alle anderen und für offene Fragen dazu. Das Kontaktformular unter `src/app/(site)/service-und-termin/kontakt/` (kern.ts, kontakt-formular.tsx, kern.test.ts) ist fertig und abgenommen und dein Muster. Den Status auf „live“ setzt der Orchestrator.

## 5. Kern-Auszug (unveränderlich)
- G-34: Beratung per Anfrage mit kurzer Erklärung. G-33: bei elektronischen Schließsystemen nur Hersteller und Technik nennen (BKS, ABUS, Burg-Wächter; NFC und RFID), keine Produktnamen.
- R4 und R9: keine Uhrzeit, keine Frist, kein Preis zusagen. Satz zum Rückruf genau: „Wir rufen Sie zurück, nach Möglichkeit in dem Zeitraum, den Sie nennen.“
- Ton (K-010): Sie-Anrede, kurze Sätze, keine Gedankenstriche (– und —), keine Ausrufezeichen, keine Floskeln.

## 6. Maßstab (Muster und Abweichungen)
- `src/app/(site)/beratung/layout.tsx`: wie `src/app/(site)/schluessel-einschicken/layout.tsx` mit `area="service-und-termin"`.
- `src/app/(site)/beratung/page.tsx` (Server): `generateMetadata` (Titel „Beratung mit Rückruf“, kanonisch `/beratung`); `PageHeader` mit `rubrik={await getRubrik('beratung')}` (wörtlich so, ein Test sucht den Aufruf), `bereich="service-und-termin"`, Knopf „Rückruf anfragen“ zum Anker `#rueckruf`; `RubrikAblaufAbschnitt` mit `nummer="01"`; Abschnitt 02 „Themen mit eigenem Weg“ als Liste mit Links: Elektronische Schließsysteme (`/elektronische-zutrittsloesungen`), Türen und Schließtechnik (`/tuer-und-schliesstechnik`), Sicherheitstechnik mit Einbruchschutz, Alarm, Video und Schlüsselaufbewahrung (`/sicherheitstechnik`), Schließanlage planen (`/schliessanlagen`), je ein Satz Erklärung ohne Produktnamen; Abschnitt 03 mit `id="rueckruf"`, Überschrift „Rückruf anfragen“ und darin das Formular.
- `src/app/(site)/beratung/kern.ts`: Kopie von `kontakt/kern.ts` mit: `THEMEN` statt `ANLIEGEN` (Elektronische Schließsysteme, Türen und Schließtechnik, Sicherheitstechnik, Schlüsselaufbewahrung, Etwas anderes); kein Antwortweg (immer Telefon), Zeitfenster Pflicht (vormittags, nachmittags, egal); Telefon und E-Mail Pflicht; Postleitzahl und Ort frei; Vorgangsnummer entfällt; Zusammenfassung „Anliegen“ und „Kontakt und Rückruf“.
- `src/app/(site)/beratung/beratung-formular.tsx` (Client): Kopie von `kontakt-formular.tsx`, drei Schritte `anliegen` (Thema als Select, Beschreibung, bis zu drei Fotos frei), `kontakt` (Anrede, Name, Telefon, E-Mail, Postleitzahl und Ort frei, Zeitfenster als drei `OptionCard` mit dem Satz aus Abschnitt 5), `absenden`. Absenden mit `kind: 'anfrage'`, `area: 'service-und-termin'`, `process: 'gefuehrte-anfrage'`, `payload: { quelle: 'beratung', thema, beschreibung, zeitfenster }`. Bestätigung: `marke="Anfrage eingegangen"`, `titel="Ihre Rückruf-Anfrage ist bei uns"`, `text="Wir rufen Sie zurück, nach Möglichkeit in dem Zeitraum, den Sie nennen."`, `schritte={SCHRITTE_NACH_ART.anfrage}`, `zurueck` zu `/beratung` mit „Zurück zur Beratung“.
- `src/app/(site)/beratung/kern.test.ts`: dieselben Fälle wie im Muster, angepasst (Zeitfenster Pflicht, Telefon Pflicht, Thema Pflicht).

## 7. Grenzen
G4 (nur erfundene Testdaten), G5, G8 (keine Prüfung abschalten, kein eslint-disable), G9, R4, R9. Nur die Schreibrechte aus Abschnitt 1. `content/**`, `src/lib/**`, `src/app/sitemap.ts`, gemeinsame Komponenten und das Kontaktformular änderst du nicht. Kein Build, kein Commit.

## 8. Schritte
1. Lies das Muster unter `src/app/(site)/service-und-termin/kontakt/` vollständig und eine fertige Rubrikseite (`src/app/(site)/motorradschluessel/page.tsx`).
2. Lege die Dateien nach Abschnitt 6 an.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/beratung"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/beratung"`.
4. Schlussantwort.

## 9. Selbstprüfung
Kein `—`, kein `–`, kein Ausrufezeichen in Texten; keine Uhrzeit, kein Preis, keine Produktnamen; `getRubrik('beratung')` wörtlich; Tests, Typprüfung und Lint grün; `git status` zeigt nur Dateien unter `src/app/(site)/beratung/`.

## 10. Ausgabe
Dateien aus Abschnitt 6 und die Schlussantwort (höchstens 12 Zeilen).

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-04 · BEREIT ZUR RÜCKGABE ===
