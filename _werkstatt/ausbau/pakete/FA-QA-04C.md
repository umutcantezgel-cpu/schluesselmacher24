# FA-QA-04C · Bedienbarkeit, Teil 2C: Beispielzeichnungen an den Upload-Feldern, Upload-Schritt im Zutritt-Konfigurator

Kopf: Etappe FA Priorität 7 · Rolle Grafiker und Baumeister · Modell Opus · Stufe 3 (Upload-Strecke mit Steckplätzen, R13) · Kostenklasse M · ohne Datenschema · Anforderungen FA-26-06, FA-27-10 · Befunde: `berichte/FA-BESTAND.md` (Zeilen FA-26-06, FA-27-10), `berichte/FA-KERN-02.md` (Steckplätze), `berichte/FA-QA-02.md`.

## Aufgabe in einem Satz
Jedes Upload-Feld zeigt eine gezeichnete Vorlage, was auf dem Foto zu sehen sein muss, und der Zutritt-Konfigurator bekommt einen freiwilligen Schritt für Grundriss und Fotos.

## Vorgabe des Inhabers (wörtlich, Abschnitte 26 und 27)
„Foto Upload mit konkreten Beispielen.“ Pflichttest Zutritt: Der Konfigurator wird bis zur vollständigen Anfrage geprüft, einschließlich Unterlagen.

## So bauen
1. Beispielzeichnungen (FA-26-06): `src/components/forms/photo-upload.tsx` zeigt an jedem Feld ein Beispiel; für Fahrzeugschein, Typenschild, Ersatznachweis, Gewerbeanmeldung und Schlüsselspitze gibt es bisher nur ein Symbol und einen Satz (`src/lib/visual/motiv.ts`, `beispielZeigtBild`). Zeichne je Steckplatz eine schlichte Fachgrafik im Stil der vorhandenen Generatoren unter `src/components/visual/generators` (lies zwei davon und KERN K-008 in `_werkstatt/ausbau/KERN.md`): Fahrzeugschein als Blatt mit allen vier Ecken und den markierten Feldern, die der Bestand im Text nennt (nur Felder, die die Seiten heute schon nennen; nichts erfinden, R4); Typenschild; Schlüsselspitze mit Profil von vorn; Ersatznachweis und Gewerbeanmeldung als Dokument mit Kopf und markierter Stelle. Keine echten Daten, keine Marken, keine lesbaren Kennzeichen (R12). Ordne sie in `visualFuerMotiv` zu, damit das Feld die Zeichnung zeigt. Die Zeichnung trägt einen Alternativtext, der sagt, was zu sehen sein muss. Echte Fotos (MA-05) ersetzen sie später über das Bildfeld. Test je Steckplatz.
2. Upload-Schritt im Zutritt-Konfigurator (FA-27-10): `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx` sendet `uploads: []`. Baue einen freiwilligen Schritt „Unterlagen“ mit `PhotoUpload` für Grundriss und Fotos von Türen und Bestand, nach dem Muster des Sicherheitschecks (`sicherheitscheck.tsx`): Steckplätze vergibt der Server, die Rückfrage vor dem Verlassen gilt (`ungesichert`, `mitDateien`), der Fortschritt zählt den Schritt mit, „Weiter“ geht auch ohne Datei. Prüfe am Code, ob der Server für diesen Weg Uploads annimmt und in den Vorgang schreibt (`src/lib/actions/records.ts`, Upload-Kategorien in `src/lib/server/datei-pruefung.ts`); fehlt eine Zeile, ergänze sie an der vorhandenen Stelle und nenne sie im Bericht. Eintrag `dateien: true` im Sammeltest `formulare-bedienbarkeit.test.ts`, Test der Zusammenfassung.

## Schreibrechte
`src/components/visual/generators/**` (neue Zeichnungen), `src/lib/visual/motiv.ts`, `src/components/forms/photo-upload.tsx` (nur die Zuordnung des Beispiels), `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/**`, `src/lib/actions/records.ts` und `src/lib/server/datei-pruefung.ts` nur an der einen Stelle für den Zutritt-Weg, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-QA-04C.md`.
Nicht anfassen: Pflichtregeln der Schlüsselwege (`src/lib/server/unterlagen-pflicht.ts`), Texte der Seiten, Datenschema, `src/lib/flow/**` (dort arbeitet FA-QA-04B).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git, keine Formularsendung (G5). Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs`.

## Grenzen
G4, G5, G8, R4, R11 (nichts kopieren: eigene Zeichnungen), R12, R13.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-04C · BEREIT ZUR RÜCKGABE ===
