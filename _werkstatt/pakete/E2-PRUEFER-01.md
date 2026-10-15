E2-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.1 · Schreibrechte (exakt): `_werkstatt/protokolle/E2-PRUEFER-01-*`, `_werkstatt/bilder/referenz/**`, außerhalb des Repos `/root/sm24-bilder/**` · Umfang: Prüfstufe A der Opus-Pakete E2-L-01 bis E2-L-06 und Prüfstufe B der Referenzansicht

## Rollenbriefing
Du bist Prüfer. Du führst die Prüfungen deiner Stufe aus, deutest nicht und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen. Du committest und pushst nie und änderst keine Projektdatei.

## Aufgabe in einem Satz
Prüfe den neuen Stand (Designsystem, Formsystem, Hülle, Startseite) nach Prüfstufe A und B und stelle jede Zahl dem Ausgangswert aus E0 gegenüber.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Ausgangswerte: `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md` und `_werkstatt/protokolle/E0-PRUEFER-01-ergebnis.md`.
- Server:
  - Port 3000 liefert den neuen Stand. Er ist gebaut; starte ihn bei Bedarf mit `./_werkstatt/werkzeuge/server.sh start` neu, aber **ohne neu zu bauen**.
  - Port 3100 ist der eingefrorene E0-Vergleichsserver; nicht anfassen.
  - Port 3001 ist frei.
- Budgets (K-011): LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms; große Momente mobil bei 4-facher Drosselung ≤ 5 % verworfene Bilder.
- Großer Moment B-01 (Fräsbahn im Hero der Startseite): Selektor `[data-fraesbahn]`, Dauer 1.400 ms ab dem Laden (Verzögerung 0,3 s + Zeichnung 1,1 s).
- Zwei Grafiker-Pakete ändern gleichzeitig Dateien unter `src/components/visual/generators/`. Melde einen Rotfall in `registry.test.tsx` zu `stiftzuhaltung` als „erwartet (Paket läuft)“, nicht als Fehler.
- Ein Entwicklungsserver kann `AGENTS.md` verändern; das ist nicht Teil der Prüfung.

## Maßstab
Protokollform wie `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md`: gleiche Tabellen, jede Zeile mit E0-Wert, neuem Wert und Differenz.

## Grenzen
Keine Projektdatei ändern; nicht neu bauen. Rechenintensive Läufe nacheinander. Lege während der Schritte 5 bis 9 die Sperre `/tmp/sm24-messfenster.lock` an (`echo E2-PRUEFER-01 > /tmp/sm24-messfenster.lock`) und lösche sie danach, auch bei Abbruch.

## Schritte
1. `npx tsc --noEmit` und `npx eslint .` (ganzes Projekt) → Fehler und Warnungen; Protokolle `E2-PRUEFER-01-typecheck.log`, `-lint.log`.
2. `npx vitest run` → Dateien und Tests bestanden/fehlgeschlagen (`-test-unit.log`). Danach DB-Tests über den Nutzer `ubuntu` mit dem Wrapper wie in E0-PRUEFER-05 (`-test-db.log`).
3. `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` → je Datei gleich oder abweichend (`-logik.log`).
4. `node _werkstatt/werkzeuge/textabzug.mjs vergleichen` → je Rechtsseite gleich oder abweichend (`-textabzug.log`).
5. `node _werkstatt/werkzeuge/konsole.mjs` (alle 12 Hauptansichten) → Konsolenfehler, Seitenfehler, fehlgeschlagene Anfragen.
6. `node _werkstatt/werkzeuge/bildsatz.mjs --routen / --ziel _werkstatt/bilder/referenz` (Startseite, 3 Geräte, ins Repo) und `node _werkstatt/werkzeuge/bildsatz.mjs --ziel /root/sm24-bilder/E2-bildsatz` (alle 12 Hauptansichten, außerhalb des Repos) → Überlaufbefunde je Ansicht und Gerät.
7. `node _werkstatt/werkzeuge/a11y.mjs --geraet beide` → Befunde nach Schwere je Ansicht, Regeln mit Zielen.
8. `node _werkstatt/werkzeuge/messung.mjs --laeufe 3 --profil beide` (im Hintergrund mit Protokoll, Ende abwarten) → Median, Minimum, Maximum je Ansicht und Profil.
9. Bewegung:
   - `node _werkstatt/werkzeuge/bewegung.mjs reduziert` (alle 12).
   - `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder / --selektor "[data-fraesbahn]" --dauer 1400 --geraet desktop --ziel _werkstatt/bilder/referenz/b01-fraesbahn`: 5 Einzelbilder. Falls das Werkzeug den Ausschnitt an der Fräser-Gruppe zu klein schneidet, nimm als Selektor `main section:first-of-type [role="img"]`.
   - `node _werkstatt/werkzeuge/bewegung.mjs bildrate / --selektor "[data-fraesbahn]" --dauer 1400`.
10. `node _werkstatt/werkzeuge/werte-suche.mjs --seit fcbcfb2` → Funde je geänderter Datei (Ausnahmen getrennt).
11. Lösche die Sperre. Schreibe `_werkstatt/protokolle/E2-PRUEFER-01-ergebnis.md`:
    - Tabelle „Prüfung · E0 · jetzt · Differenz · Beleg“.
    - Leistungs- und Zugänglichkeitstabelle je Hauptansicht im Format der E0-Ausgangswerte, mit Spalte „E0-Median“ und „E0-Spanne“ und der Bewertung „innerhalb der E0-Spanne / besser / schlechter“.
    - Liste aller Funde der Wertesuche.

## Schnellprüfung und Selbstprüfung
- Jede Zahl hat ein Protokoll; 12 Ansichten in jeder Tabelle; Messung mit 3 Läufen je Profil.
- `git status --short`: Von dir stammen nur Dateien unter `_werkstatt/protokolle/E2-PRUEFER-01-*`, `_werkstatt/protokolle/*.json` deiner Läufe und `_werkstatt/bilder/referenz/`.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
