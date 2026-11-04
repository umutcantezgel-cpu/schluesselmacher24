# E6-BAUMEISTER-02 · Autoschlüssel-Gehäuse: Rubrikseite und Anfrage

## 1. Kopfzeile
Kennung E6-BAUMEISTER-02 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderung G-20 (Teil Anfrage, A-036) · Kriterium Z-05 · Schreibrechte: `src/app/(site)/autoschluessel/gehaeuse/` (nur dieser Ordner, neue Dateien darin erlaubt)

## 2. Rollenbriefing
Baumeister: baut nach vorhandenem Muster, erfindet nichts dazu. Fehler: eigene Komponenten statt der vorhandenen, Zusagen zu Preis, Zahlungslink oder Fristen, Texte mit Gedankenstrichen, Logik ohne Test.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und `_werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Baue die Rubrikseite `/autoschluessel/gehaeuse` und die Anfrage `/autoschluessel/gehaeuse/anfrage` (Fahrzeug, Fotos von Schlüssel und Fahrzeugschein, Kontakt, Absenden) als Kopie des fertigen Motorrad-Wegs mit den Abweichungen aus Abschnitt 6.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Der Motorrad-Weg unter `src/app/(site)/motorradschluessel/` ist fertig und abgenommen; er ist dein Muster, Datei für Datei. Die Rubrik „autoschluessel-gehaeuse“ steht in `content/rubriken.json` (Ziel `/autoschluessel/gehaeuse`, Nachweis Fahrzeugschein, Pflicht-Uploads Fahrzeugschein und Schlüsselfoto, vier Ablaufschritte), noch mit Status „spaeter“. Der Server prüft Fahrzeugschein und Schlüsselfoto selbst, wenn das payload `quelle: 'gehaeuse'` trägt und der Bereich `autoschluessel` ist. Einen Zahlungslink gibt es für das Gehäuse noch nicht (A-036): Der Inhaber antwortet mit Preis und Ablauf; das Seitenlayout `src/app/(site)/autoschluessel/layout.tsx` gilt schon für den Ordner.

## 5. Kern-Auszug (unveränderlich)
- G-20, Teil Anfrage: „Anfrage mit Fahrzeug (mindestens Baujahre 1998 bis 2022), Foto und Fahrzeugschein“. Den Rest von G-20 (Preis mit Zahlungslink, Buchung mit einem Klick) baust du nicht und sagst ihn nirgends zu.
- R13: Fahrzeugschein ist Pflicht. R4: keine Preise, keine Fristen, keine Zusagen außer „Wir melden uns mit Preis und Ablauf“. R9: nichts „kostenlos“.
- Ton (K-010): Sie-Anrede, kurze Sätze, keine Gedankenstriche (– und —), keine Ausrufezeichen, keine Floskeln.

## 6. Maßstab (Muster und Abweichungen)
Kopiere die Dateien aus `src/app/(site)/motorradschluessel/` (ohne `layout.tsx`, das Layout gibt es schon) nach `src/app/(site)/autoschluessel/gehaeuse/` und ändere nur:
- `page.tsx`: `getRubrik('autoschluessel-gehaeuse')` wörtlich so (ein Test sucht genau diesen Aufruf); Titel „Autoschlüssel-Gehäuse erneuern“; Brotkrumen Autoschlüssel (`/autoschluessel`) und Gehäuse; kanonische Adresse `/autoschluessel/gehaeuse`; Knopf „Anfrage stellen“ zu `/autoschluessel/gehaeuse/anfrage`. Abschnitt 02 statt „Chip im Schlüssel“: Überschrift „Wann ein neues Gehäuse hilft“, Text genau: „Ist das Gehäuse gebrochen oder klemmen die Tasten, tauschen wir die Hülle; die vorhandene Elektronik bleibt erhalten. Ob das bei Ihrem Schlüssel geht, sehen wir an Ihren Fotos.“ Darunter ein Textlink „Funkschlüssel und Gehäuse im Überblick“ zu `/autoschluessel/funkschluessel`.
- `anfrage/kern.ts`: Fahrzeug statt Motorrad: Marke (Pflicht, höchstens 60), Modell (Pflicht, höchstens 80), Baujahr (Pflicht, vier Ziffern zwischen 1990 und dem laufenden Jahr plus 1). Statt der Chip-Frage die Frage „Wie viele Tasten hat der Schlüssel?“ mit drei `OptionCard`-Werten `1-2`, `3-4`, `unklar` (Titel „1 oder 2 Tasten“, „3 oder 4 Tasten“, „Weiß ich nicht“), Pflicht. `payloadAus` mit `quelle: 'gehaeuse'`, Feldern `marke`, `modell`, `baujahr`, `tasten`, `anmerkung: null`. Zusammenfassung mit Abschnitt „Fahrzeug und Schlüssel“ und „Kontakt“.
- `anfrage/anfrage-formular.tsx`: fünf Schritte `fahrzeug`, `tasten`, `unterlagen`, `kontakt`, `absenden`; Fotos wie im Muster (Schlüsselfoto mit Hinweis „Vorder- und Rückseite, gern auch das gebrochene Teil“, Fahrzeugschein), beide Pflicht. Absenden mit `area: 'autoschluessel'`. Bestätigung: `marke="Anfrage eingegangen"`, `titel="Ihre Gehäuse-Anfrage ist bei uns"`, `text="Wir prüfen Fahrzeug, Schlüssel und Fahrzeugschein und melden uns mit Preis und Ablauf."`, `zurueck` zu `/autoschluessel/gehaeuse` mit „Zurück zum Gehäuse“. Schritte wie im Muster aus `naechsteSchritte(...)` mit `payload: { quelle: 'gehaeuse' }`.
- `anfrage/page.tsx`: Titel „Gehäuse-Anfrage“, Brotkrumen Autoschlüssel, Gehäuse, Anfrage.
- `anfrage/kern.test.ts`: dieselben Fälle wie im Muster, angepasst (Baujahr 1989 und „19a0“ ungültig, 1998 und 2022 gültig; Tasten Pflicht; `payloadAus` mit `quelle: 'gehaeuse'`).

## 7. Grenzen
G4 (nur erfundene Testdaten), G5, G8 (keine Prüfung abschalten, kein eslint-disable), G9, R4, R9, R13. Nur die Schreibrechte aus Abschnitt 1. `content/**`, `src/lib/**`, `src/app/sitemap.ts`, gemeinsame Komponenten und die Dateien des Motorrad-Wegs änderst du nicht; brauchst du dort etwas, schreib es in deine Schlussantwort. Kein Build, kein Commit.

## 8. Schritte
1. Lies den Motorrad-Weg vollständig.
2. Kopiere und ändere nach Abschnitt 6.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run "src/app/(site)/autoschluessel/gehaeuse"`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint "src/app/(site)/autoschluessel/gehaeuse"`.
4. Schlussantwort nach `_GEMEINSAM.md` (Ausgabeformular in Kurzform).

## 9. Selbstprüfung
Kein `—`, kein `–`, kein Ausrufezeichen in Texten; kein Wort „Zahlungslink“ und keine Preise auf den Seiten; `getRubrik('autoschluessel-gehaeuse')` wörtlich; Fahrzeugschein und Schlüsselfoto Pflicht; Tests, Typprüfung und Lint grün; `git status` zeigt nur Dateien unter `src/app/(site)/autoschluessel/gehaeuse/` (dazu die vorhandenen Änderungen des Orchestrators an `content/rubriken.json` und dem Startinhalt, die du nicht anfasst).

## 10. Ausgabe
Dateien aus Abschnitt 6 und die Schlussantwort (höchstens 12 Zeilen).

## 11. Letzte Zeile
=== ENDE E6-BAUMEISTER-02 · BEREIT ZUR RÜCKGABE ===
