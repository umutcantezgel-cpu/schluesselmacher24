# E6-BAUMEISTER-06 · Schlüssel nach Foto: gezeichnete Beispiele auch im Formular, Hinweis zur Ablesbarkeit

## 1. Kopfzeile
Kennung E6-BAUMEISTER-06 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderungen G-23, G-45 · Kriterium Z-05 · Schreibrechte: `src/app/(site)/schluessel-nach-vorlage/` (nur dieser Ordner)

## 2. Rollenbriefing
Baumeister: ändert nach vorhandenem Muster, erfindet nichts dazu. Fehler: Fotos vortäuschen, neue Zeichnungen erfinden statt vorhandene Generatoren zu nutzen, Logik ändern, Texte mit Gedankenstrichen.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Gib den Beispielbildern im Anfrageformular dieselben gezeichneten Generatoren wie auf der Seite und ergänze an zwei Stellen den Hinweis, dass nicht jedes Foto ablesbar ist und dann das Einschicken folgt.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Auf `/schluessel-nach-vorlage` zeigt der Abschnitt „Diese drei Aufnahmen brauchen wir“ (Liste `PHOTOS` in `page.tsx`) gezeichnete Beispiele über `visual: { generator: 'schluessel', … }` und `visual: { generator: 'profilschnitt', … }`. Im Anfrageformular `anfrage/anfrage-formular.tsx` haben die Beispielbilder `EXAMPLE_FRONT`, `EXAMPLE_BACK` und `EXAMPLE_TIP` nur eine Motivbeschreibung ohne Zeichnung. Echte Beispielfotos liefert später der Inhaber (G-45); bis dahin zeigt die gezeichnete Anleitung den Aufbau, ohne Fotos vorzutäuschen. Wer die Bilder nicht sicher bestimmen kann, bekommt die Bitte um Einsendung (Einsenden gibt es unter `/schluessel-einschicken`).

## 5. Kern-Auszug (unveränderlich)
- G-23: klarer Hinweis, dass nicht jedes Foto ablesbar ist und dann das Einschicken folgt; eine Prüfung ist keine Fertigungszusage.
- G-45: gezeichnete Anleitung statt vorgetäuschter Fotos.
- Hinweissatz genau: „Nicht jedes Foto ist ablesbar. Reichen die Bilder für eine sichere Bestimmung nicht, bitten wir Sie, den Schlüssel einzuschicken.“
- Ton (K-010): keine Gedankenstriche (– und —), keine Ausrufezeichen.

## 6. Maßstab
- `anfrage/anfrage-formular.tsx`: `EXAMPLE_FRONT` bekommt `visual: { generator: 'schluessel', params: { typ: 'zylinder' } }`, `EXAMPLE_BACK` `visual: { generator: 'schluessel', params: { typ: 'zylinder', code: 'rueckseite' } }`, `EXAMPLE_TIP` `visual: { generator: 'profilschnitt', params: { beschriftung: false } }`, genau wie die Einträge in `PHOTOS` in `page.tsx`. Prüfe vorher in `page.tsx`, dass die Werte dort so lauten, und übernimm sie wörtlich. Sonst nichts an der Logik.
- Hinweissatz aus Abschnitt 5: auf der Seite in `page.tsx` im Abschnitt „Diese drei Aufnahmen brauchen wir“ als eigener Absatz unter den drei Aufnahmen; im Formular im Hinweis (`hint`) des ersten Fotoschritts (`foto-vorderseite`) angehängt oder als kurzer Absatz über dem ersten Foto, nicht in jedem Schritt.
- Ein Test: In `anfrage/` gibt es noch keinen Test für die Beispielbilder; lege `anfrage/beispiele.test.ts` an, der den Quelltext von `anfrage-formular.tsx` liest und prüft, dass `EXAMPLE_FRONT`, `EXAMPLE_BACK` und `EXAMPLE_TIP` je einen `generator` tragen, und dass `page.tsx` und `anfrage-formular.tsx` den Hinweissatz enthalten.

## 7. Grenzen
G4, G5, G8, G9, R4. Nur die Schreibrechte aus Abschnitt 1. Kein Build, kein Commit.

## 8. Schritte
1. Lies `page.tsx` (Abschnitt `PHOTOS`) und `anfrage/anfrage-formular.tsx` (Beispielbilder, erster Fotoschritt).
2. Ändere nach Abschnitt 6.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/schluessel-nach-vorlage"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/schluessel-nach-vorlage"`.
4. Schlussantwort.

## 9. Selbstprüfung
`git diff` zeigt nur die drei `visual`-Einträge, den Hinweissatz an zwei Stellen und den neuen Test; Tests, Typprüfung und Lint grün.

## 10. Ausgabe
Geänderte Dateien und die Schlussantwort (höchstens 12 Zeilen).

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-06 · BEREIT ZUR RÜCKGABE ===
