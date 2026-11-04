# E6-BAUMEISTER-05 · Schlüsseldienst vor Ort: Anfrage mit Ort

## 1. Kopfzeile
Kennung E6-BAUMEISTER-05 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderungen G-40 (Teil Anfrage mit Ort, die Vermittlung selbst folgt mit E7), EL-44, EL-45 · Kriterium Z-05 · Schreibrechte: `src/app/(site)/service-und-termin/vor-ort/` (nur dieser Ordner, neue Dateien darin erlaubt)

## 2. Rollenbriefing
Baumeister: baut nach vorhandenem Muster, erfindet nichts dazu. Fehler: Notdienst oder Reaktionszeiten versprechen, Preise nennen, Partner nennen, eigene Komponenten statt der vorhandenen, Texte mit Gedankenstrichen, Logik ohne Test.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Ergänze die vorhandene Seite `/service-und-termin/vor-ort` um den Abschnitt „Einsatz anfragen“ mit einer eingebetteten Anfrage in drei Schritten (Anliegen und Ort, Kontakt mit Berechtigung, Absenden), als Kopie der fertigen Rückruf-Anfrage der Beratung.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Die Seite `/service-und-termin/vor-ort` listet Leistungen vor Ort mit Links, hat aber keinen Weg in eine Anfrage mit Ort. Die Rubrik „schluesseldienst-vor-ort“ beschreibt den Ablauf: Ort und Anliegen angeben, „Wir klären den Einsatz: Ob die Werkstatt oder ein Partner kommen kann“, „Vor der Terminbestätigung erfahren Sie, was der Einsatz kostet“. Die Vermittlung an Partner (E7) gibt es noch nicht; die Anfrage geht an die Werkstatt. Dein Muster ist `src/app/(site)/beratung/` (kern.ts, beratung-formular.tsx, kern.test.ts), eingebettet in eine Seite mit `<FlowShell eingebettet …>`.

## 5. Kern-Auszug (unveränderlich)
- R9: Die „24“ verspricht keinen Notdienst rund um die Uhr. Keine Reaktionszeit, keine Uhrzeit, kein Preis. Wunschzeitraum nur als Wunsch.
- R13: Vor Arbeiten an Türen und Schlössern weist der Kunde nach, dass er darüber verfügen darf. Pflichtbestätigung im Formular genau: „Ich bin berechtigt, die Arbeiten zu beauftragen (etwa als Eigentümer, Mieter mit Erlaubnis oder im Auftrag), und weise das vor Ort nach.“
- R4: Zusagen nur aus der Rubrik: „Wir klären, ob die Werkstatt oder ein Partner zu Ihnen kommen kann. Vor der Terminbestätigung erfahren Sie, was der Einsatz kostet.“
- Ton (K-010): Sie-Anrede, kurze Sätze, keine Gedankenstriche (– und —), keine Ausrufezeichen, keine Floskeln.

## 6. Maßstab (Muster und Abweichungen)
- `vor-ort/kern.ts`: Kopie von `beratung/kern.ts` mit: `ANLIEGEN` statt `THEMEN` (Zylinder oder Schloss tauschen, Tür nachrüsten oder sichern, Schließanlage oder Zutritt vor Ort, Etwas anderes); Postleitzahl (Pflicht, fünf Ziffern) und Ort (Pflicht), Straße frei; Wunschzeitraum Pflicht als drei Werte `bald` („In den nächsten Tagen“), `spaeter` („In den nächsten Wochen“), `flexibel` („Ich bin flexibel“); Berechtigung als Pflicht-Haken (`berechtigt: boolean`); Telefon und E-Mail Pflicht. Zusammenfassung „Anliegen und Ort“ und „Kontakt“.
- `vor-ort/einsatz-formular.tsx` (Client): Kopie von `beratung/beratung-formular.tsx` mit `eingebettet` an der FlowShell, drei Schritte `anliegen` (Anliegen, Beschreibung, bis zu drei Fotos frei, Postleitzahl, Ort, Straße frei), `kontakt` (Anrede, Name, Telefon, E-Mail, Wunschzeitraum als drei `OptionCard`, Berechtigung als Kontrollkästchen mit dem Satz aus Abschnitt 5), `absenden`. Absenden mit `kind: 'anfrage'`, `area: 'service-und-termin'`, `process: 'gefuehrte-anfrage'`, Kontakt mit `postalCode` und `city`, `payload: { quelle: 'vor-ort', anliegen, beschreibung, zeitraum, berechtigt: true }`. Bestätigung: `marke="Anfrage eingegangen"`, `titel="Ihre Einsatz-Anfrage ist bei uns"`, `text` mit dem Satz aus Abschnitt 5 (R4), `schritte={SCHRITTE_NACH_ART.anfrage}`, `zurueck` zu `/service-und-termin/vor-ort` mit „Zurück zu Vor Ort“.
- `vor-ort/page.tsx`: nur ergänzen, nichts Bestehendes ändern: vor dem bestehenden Ablauf-Abschnitt (RubrikAblaufAbschnitt, falls vorhanden; sonst am Ende) ein `Section` mit `id="einsatz"`, `SectionHeading` (nächste freie Nummer, `eyebrow="Anfrage"`, `title="Einsatz anfragen"`, `lead="Sagen Sie uns, wo und was zu tun ist. Wir klären, ob die Werkstatt oder ein Partner zu Ihnen kommen kann."`) und darin `<EinsatzFormular />`; im Kopf der Seite ein zusätzlicher Knopf „Einsatz anfragen“ zum Anker `#einsatz`, falls der Kopf `actions` hat. Ton der Abschnitte abwechselnd wie auf der Seite.
- `vor-ort/kern.test.ts`: Fälle wie im Muster, dazu Postleitzahl vierstellig ungültig, Berechtigung ohne Haken ungültig.

## 7. Grenzen
G4 (nur erfundene Testdaten), G5, G8 (keine Prüfung abschalten, kein eslint-disable), G9, R4, R9, R13. Nur die Schreibrechte aus Abschnitt 1. Kein Build, kein Commit.

## 8. Schritte
1. Lies das Muster `src/app/(site)/beratung/` vollständig und die vorhandene `vor-ort/page.tsx`.
2. Lege die Dateien nach Abschnitt 6 an und ergänze die Seite.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/service-und-termin/vor-ort"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/service-und-termin/vor-ort"`.
4. Schlussantwort.

## 9. Selbstprüfung
Kein `—`, kein `–`, kein Ausrufezeichen; kein Notdienst, keine Uhrzeit, kein Preis; Berechtigung Pflicht; bestehende Abschnitte unverändert; Tests, Typprüfung und Lint grün; `git status` zeigt nur Dateien unter `src/app/(site)/service-und-termin/vor-ort/`.

## 10. Ausgabe
Dateien aus Abschnitt 6 und die Schlussantwort (höchstens 12 Zeilen).

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-05 · BEREIT ZUR RÜCKGABE ===
