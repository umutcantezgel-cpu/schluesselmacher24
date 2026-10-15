E0-PRUEFER-05 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.0 · Schreibrechte (exakt): `_werkstatt/protokolle/E0-PRUEFER-05-*`, `_werkstatt/bilder/e0/**` (Bildsatz E0 im Repo), außerhalb des Repos `/root/sm24-bilder/**`; Umgebung: Verzeichnis `private-uploads/` (vom Repo ignoriert) anlegen und dem Nutzer `ubuntu` übergeben · Umfang: Ausgangswerte nach Prüfstufe B

## Rollenbriefing
Du bist Prüfer. Du führst die Prüfungen deiner Stufe aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen. Du committest und pushst nie und änderst keine Projektdatei.

## Aufgabe in einem Satz
Erhebe für die 12 Hauptansichten den vollständigen Ausgangsstand nach Prüfstufe B, damit jedes spätere Ergebnis mit E0 verglichen werden kann.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Prüfstufe B (Auftrag Abschnitt 9): Build, Typprüfung und Linter des ganzen Projekts, vollständige Testsuite, Konsolenfehler, Bildsatz mit Überlaufprüfung, Zugänglichkeit WCAG 2.2 AA, Leistungsmessung der Hauptansichten als Median aus 3 Läufen, Durchlauf mit reduzierter Bewegung, Suche nach freien Werten. Große Momente gibt es in E0 noch nicht, daher entfallen Einzelbilder und Bildrate.
- Werkzeuge nur aus `_werkstatt/werkzeuge` (siehe `LIESMICH.md`); Server über `server.sh`.
- Bildsatz E0 kommt **ins Repo** nach `_werkstatt/bilder/e0/` (JPEG, Qualität 60, höchstens 1.440 px breit).

## Maßstab
Protokollform wie `_werkstatt/protokolle/E0-PRUEFER-01-ergebnis.md`.

## Grenzen
Nur lesen und messen; keine Projektdatei ändern. Rechenintensive Läufe nacheinander (Build, Tests, Bildsatz, Messung nie gleichzeitig).

## Schritte
1. `SM24_DATA=json npx next build` (Protokoll `E0-PRUEFER-05-build.log`), danach `./_werkstatt/werkzeuge/server.sh neu`.
2. `npx tsc --noEmit`, `npx eslint .`, `npx vitest run`, jeweils als Protokoll. Die Zahlen müssen mit E0-PRUEFER-01 übereinstimmen, plus die neuen Tests in `src/lib/store/cart.test.ts`.
3. DB-Tests über den Nutzer `ubuntu`:
   - `mkdir -p private-uploads && chown ubuntu private-uploads`. Prüfe vorher, dass `private-uploads/` in `.gitignore` steht.
   - Ist der Vitest-Cache nicht schreibbar, setze dem Wrapper `/home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs` ein `cacheDir` unter `/home/ubuntu/sm24-pg/` (die Datei liegt außerhalb des Repos).
   - Dann den Wrapper-Lauf aus E0-PRUEFER-01 wiederholen (Protokoll `E0-PRUEFER-05-test-db.log`). Notiere die Zahlen. Der Lauf darf nichts im Repository anlegen außer in `private-uploads/` (ignoriert).
4. `node _werkstatt/werkzeuge/konsole.mjs` (alle Hauptansichten).
5. `node _werkstatt/werkzeuge/bildsatz.mjs --ziel _werkstatt/bilder/e0` (12 × 3). Danach `du -sh _werkstatt/bilder/e0` und Zahl der Dateien. Wird der Ordner größer als 25 MB, wiederhole mit `--max 10` und notiere das.
6. `node _werkstatt/werkzeuge/a11y.mjs --geraet beide`.
7. `node _werkstatt/werkzeuge/messung.mjs --laeufe 3 --profil beide` (Median, Minimum, Maximum je Ansicht und Profil).
8. `node _werkstatt/werkzeuge/bewegung.mjs reduziert`.
9. `node _werkstatt/werkzeuge/werte-suche.mjs` über **alle** Dateien unter `src/app/(site)` und `src/components` (nicht nur geänderte), als Ausgangszählung je Datei.
10. Schreibe `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md`:
    - Tabelle „Prüfung · Ergebnis · Beleg“.
    - Tabelle je Hauptansicht: LCP, CLS, INP-Näherung, JS-KB (mobil, Median, Spanne), LCP (Desktop, Median), axe ernst/kritisch, Konsolenfehler, Überlauf ja/nein, Befunde bei reduzierter Bewegung.
    - Liste der 10 häufigsten axe-Regeln.
    - Summe der freien Werte.

## Schnellprüfung und Selbstprüfung
- 12 Hauptansichten in jeder Tabelle; Messung mit 3 Läufen je Profil (Zahl der Läufe angeben).
- `git status --short` zeigt nur neue Dateien unter `_werkstatt/protokolle/` und `_werkstatt/bilder/e0/`.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-PRUEFER-05 · BEREIT ZUR RÜCKGABE ===
