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
0. **Wichtig – E0-Stand einfrieren:**
   - Der Orchestrator ändert ab jetzt Dateien unter `src/`. Deshalb wird **nicht neu gebaut**.
   - Der laufende Server liefert den Build aus E0-PRUEFER-01 aus (`.next`, gebaut aus dem unveränderten Ausgangscode). Prüfe mit `./_werkstatt/werkzeuge/server.sh status`, dass er läuft; falls nicht, starte ihn mit `server.sh start` **ohne** vorherigen Build.
   - Notiere `cat .next/BUILD_ID` und das Änderungsdatum von `.next/BUILD_ID`. Führe **kein** `next build`, kein `npx tsc`, kein `npx eslint` und kein `npx vitest run` über das ganze Projekt aus; diese Ausgangszahlen stammen aus E0-PRUEFER-01 (Typprüfung 0, Linter 0/0, Unit 680/680) und werden nur übernommen.
1. (entfällt, siehe 0)
2. (entfällt, siehe 0)
3. DB-Tests über den Nutzer `ubuntu`:
   - `mkdir -p private-uploads && chown ubuntu private-uploads`. Prüfe vorher, dass `private-uploads/` in `.gitignore` steht.
   - Ist der Vitest-Cache nicht schreibbar, setze dem Wrapper `/home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs` ein `cacheDir` unter `/home/ubuntu/sm24-pg/` (die Datei liegt außerhalb des Repos).
   - Dann den Wrapper-Lauf aus E0-PRUEFER-01 wiederholen (Protokoll `E0-PRUEFER-05-test-db.log`) und die Zahlen notieren. Die DB-Tests betreffen nur `src/lib/*` und bleiben von den Gestaltungsänderungen unberührt.
3a. **Messfenster sperren:** Lege vor Schritt 4 die Datei `/tmp/sm24-messfenster.lock` an (`echo E0-PRUEFER-05 > /tmp/sm24-messfenster.lock`) und lösche sie nach Schritt 8 wieder. Solange sie existiert, starten andere Pakete keine Browser- oder Testläufe. Lösche sie auch, wenn du abbrichst.
4. `node _werkstatt/werkzeuge/konsole.mjs` (alle Hauptansichten).
5. `node _werkstatt/werkzeuge/bildsatz.mjs --ziel _werkstatt/bilder/e0` (12 × 3). Danach `du -sh _werkstatt/bilder/e0` und Zahl der Dateien. Wird der Ordner größer als 25 MB, wiederhole mit `--max 10` und notiere das.
6. `node _werkstatt/werkzeuge/a11y.mjs --geraet beide`.
7. `node _werkstatt/werkzeuge/messung.mjs --laeufe 3 --profil beide` (dauert 8–10 Minuten: im Hintergrund mit `nohup … > _werkstatt/protokolle/E0-PRUEFER-05-messung.log 2>&1 &` starten und das Ende abwarten) (Median, Minimum, Maximum je Ansicht und Profil).
8. `node _werkstatt/werkzeuge/bewegung.mjs reduziert`.
9. `node _werkstatt/werkzeuge/werte-suche.mjs` über **alle** Dateien unter `src/app/(site)` und `src/components` (nicht nur geänderte), als Ausgangszählung je Datei.
10. Schreibe `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md`:
    - Tabelle „Prüfung · Ergebnis · Beleg“.
    - Tabelle je Hauptansicht: LCP, CLS, INP-Näherung, JS-KB (mobil, Median, Spanne), LCP (Desktop, Median), axe ernst/kritisch, Konsolenfehler, Überlauf ja/nein, Befunde bei reduzierter Bewegung.
    - Liste der 10 häufigsten axe-Regeln.
    - Summe der freien Werte.

## Schnellprüfung und Selbstprüfung
- 12 Hauptansichten in jeder Tabelle; Messung mit 3 Läufen je Profil (Zahl der Läufe angeben).
- `git status --short`: Von dir stammen nur neue Dateien unter `_werkstatt/protokolle/` und `_werkstatt/bilder/e0/`. Andere geänderte Dateien unter `src/` stammen vom Orchestrator oder anderen Paketen; erwähne sie, fasse sie aber nicht an.
- `.next/BUILD_ID` ist am Ende unverändert (Beleg, dass alle Messungen am E0-Build liefen).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-PRUEFER-05 · BEREIT ZUR RÜCKGABE ===
