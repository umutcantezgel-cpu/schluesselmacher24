E2-PRUEFER-03 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.4 · Schreibrechte (exakt): `_werkstatt/protokolle/E2-PRUEFER-03-*`, `_werkstatt/protokolle/*.json` deiner Läufe, `_werkstatt/bilder/referenz-2/**` · Umfang: Prüfstufe A des Bestands und Prüfstufe B der Referenz `/` für das Etappentor, Anlauf 2

## Rollenbriefing
Du bist Prüfer. Du führst die Prüfungen deiner Stufe aus, deutest nicht und berichtest knapp mit Belegpfaden. Häufige Fehler sind Einzelmessung statt Median, deuten statt berichten und über die Stufe hinaus prüfen. Du committest und pushst nie, änderst keine Projektdatei und löschst nichts (Löschbefehle warten auf eine Freigabe, die niemand erteilt).

## Aufgabe in einem Satz
Prüfe den Stand nach der Überarbeitung der Startseite und nach Welle E3-A. Dazu gehören der Bestand mit Build und Prüfstufe B für `/` mit Bildsatz und Einzelbildern sowie die vollständige Funktionsliste, jede Zahl gegen Anlauf 1 (`E2-PRUEFER-01-*`) und E0.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Vergleichswerte: `_werkstatt/protokolle/E2-PRUEFER-01-*` (Anlauf 1) und `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md` (E0).
- Server:
  - Port 3000 ist `next start` und wird von dir neu gebaut.
  - Port 3001 ist der Entwicklungsserver; nicht anfassen.
  - Port 3100 ist der E0-Server; nicht anfassen.
- B-01 startet jetzt bei Sichtbarkeit. Die Hülle `[data-motion]` wechselt von „wait“ auf „play“, und der Fräser hebt am Ende ab. Das Werkzeug `bewegung.mjs einzelbilder` fotografiert zeitgenau nach Animationszeit (Option `--echtzeit` für den alten Ablauf).
- Budgets (K-011): LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms; Bildrate ≤ 5 % verworfen.

## Maßstab
Protokollform wie `_werkstatt/protokolle/E2-PRUEFER-01-ergebnis.md` (falls vorhanden), sonst wie `E0-PRUEFER-05-ausgangswerte.md`.

## Grenzen
- Keine Projektdatei ändern.
- Rechenintensive Läufe nacheinander.
- Sperre `/tmp/sm24-messfenster.lock` während der Schritte 4 bis 7 (`echo E2-PRUEFER-03 > /tmp/sm24-messfenster.lock`), danach `rm -f /tmp/sm24-messfenster.lock`.

## Schritte
1. Bestand, Protokolle `E2-PRUEFER-03-<name>.log`:
   - `npx tsc --noEmit` (typecheck)
   - `npx eslint .` (lint)
   - `npx vitest run` (test-unit)
   - DB-Tests als Nutzer ubuntu wie in E0-PRUEFER-05 (test-db)
   - `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` (logik)
   - `node _werkstatt/werkzeuge/textabzug.mjs vergleichen` (textabzug)
   - `node _werkstatt/werkzeuge/werte-suche.mjs --seit fcbcfb2 --json …/E2-PRUEFER-03-werte.json` (werte)
2. Build-Gate:
   - `./_werkstatt/werkzeuge/server.sh stop`
   - `SM24_DATA=json npx next build > _werkstatt/protokolle/E2-PRUEFER-03-build.log 2>&1` (Exit-Code und Seitenzahl melden)
   - `./_werkstatt/werkzeuge/server.sh start`
   - Prüfe, dass `/` 200 und `/gibt-es-nicht-pruefung` 404 liefert.
   - Prüfe im HTML von `/` (curl), dass der Text „Hinweis für die Redaktion“ NICHT vorkommt (Produktion).
3. `git status --short AGENTS.md`: nur melden.
4. Sperre setzen. `node _werkstatt/werkzeuge/konsole.mjs --routen /` → `E2-PRUEFER-03-konsole.log`.
5. Bilder:
   - `node _werkstatt/werkzeuge/bildsatz.mjs --routen / --ziel /home/user/schluesselmacher24/_werkstatt/bilder/referenz-2 > _werkstatt/protokolle/E2-PRUEFER-03-bildsatz.log 2>&1`
   - `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder / --selektor "main section:first-of-type [role=img]" --geraet desktop --ziel /home/user/schluesselmacher24/_werkstatt/bilder/referenz-2/b01-desktop`
   - dasselbe mit `--geraet mobil --ziel …/referenz-2/b01-mobil`
   - Sieh dir alle 10 Einzelbilder an. Bild 0 soll den Rohling zeigen, Bild 4 den gehobenen Fräser; die Bilder müssen sich unterscheiden. Melde, was du siehst.
6. Zugänglichkeit und Bewegung:
   - `node _werkstatt/werkzeuge/a11y.mjs --routen / --geraet beide` → `E2-PRUEFER-03-a11y.log`
   - `node _werkstatt/werkzeuge/bewegung.mjs reduziert --routen /` → `E2-PRUEFER-03-bewegung-reduziert.log`
   - `node _werkstatt/werkzeuge/bewegung.mjs bildrate / --selektor "main section:first-of-type [role=img]" --dauer 1600` → `E2-PRUEFER-03-bildrate.log`
7. `node _werkstatt/werkzeuge/messung.mjs --routen / --laeufe 3 --profil beide` (im Hintergrund mit nohup, Ende abwarten) → `E2-PRUEFER-03-messung.log`. Danach Sperre löschen.
8. `SM24_BASIS_URL=http://localhost:3000 node _werkstatt/werkzeuge/funktionsliste.mjs > _werkstatt/protokolle/E2-PRUEFER-03-funktionsliste.log 2>&1` → F-01 bis F-14. Jede NICHT BESTANDEN einmal mit `--nur F-xx` wiederholen und beide Ergebnisse melden.
9. Schreibe `_werkstatt/protokolle/E2-PRUEFER-03-ergebnis.md` mit einer Tabelle „Prüfung · E0 · Anlauf 1 · jetzt · Beleg“ und den Funden der Wertesuche.

## Schnellprüfung und Selbstprüfung
Jede Zahl hat ein Protokoll; die Messung hat 3 Läufe je Profil; 10 Einzelbilder sind angesehen.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E2-PRUEFER-03 · BEREIT ZUR RÜCKGABE ===
