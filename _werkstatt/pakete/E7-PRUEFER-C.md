E7-PRUEFER-C · Rolle Prüfer · Modell Haiku 5.5 · Stufe C · Kern-Version 1.18 · Schreibrechte (exakt): `_werkstatt/protokolle/E7-PRUEFER-C-*`, `_werkstatt/protokolle/*.json` und `*.md` deiner Läufe, Bilder nur unter `/root/sm24-bilder/e7-c/**` (außerhalb des Repos) · Umfang: Prüfstufe C (Endprüfung) mit 12 Hauptansichten, sechs übrigen Ansichten der Sichtabnahme und einer Zufallsstichprobe von sechs übrigen Ansichten

## Rollenbriefing
Du bist Prüfer. Du führst die Prüfungen deines Teils aus, deutest nicht und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median, deuten statt berichten, über deinen Teil hinaus prüfen, Werkzeuge gegen den falschen Port. Du committest und pushst nie, änderst keine Projektdatei und löschst nichts (einzige Ausnahme: die Sperrdatei `/tmp/sm24-messfenster.lock`, wenn dein Teil es sagt). Dateien unter /dev fasst du nie an, nur als Umleitungsziel.

## Aufgabe in einem Satz
Prüfe den Endstand nach Etappe E7 (Abschlussversuch 2) gegen E0 und gegen Abschlussversuch 1 nach Prüfstufe C des Auftrags.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Vergleichswerte: `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md` (E0) und `_werkstatt/protokolle/E6-PRUEFER-C-ergebnis.md` (Abschlussversuch 1), für Leistung zusätzlich `E7-PRUEFER-01-ergebnis.md` (Anlauf 1 der Etappe E7).
- Server:
  - Port 3000 ist `next start` mit dem neuen Build (Protokoll `_werkstatt/protokolle/E7-PRUEFER-C-build.log`). Alle Werkzeuge nutzen ohne `SM24_BASIS_URL` Port 3000; das ist richtig.
  - Port 3100 ist der Ausgangsstand E0 (`next start` aus `/root/sm24-e0`), nur für Teil 4 (als `--vergleich` bzw. `--basis`).
  - Port 3001 (Entwicklung) nicht benutzen.
- Hauptansichten: `HAUPTANSICHTEN` in `_werkstatt/werkzeuge/lib.mjs` (H01 bis H12). Ohne `--routen` prüfen die Werkzeuge alle 12.
- **UEBRIG6** (übrige Ansichten der Sichtabnahme): `/gleichschliessende-zylinder,/service-und-termin,/artikel,/standorte/berlin,/sicherheitstechnik/sicherheitscheck,/rechtliches/agb`.
- **STICH** (Zufallsstichprobe, 6 von 36 übrigen Ansichten, gezogen mit Startwert 20261017): `/artikel/beispiel-schluesselkasten,/autoschluessel/schluesselbart-fraesen,/elektronische-zutrittsloesungen,/rechtliches/agb,/rechtliches/impressum,/service-und-termin/vor-ort`.
- **ALLE_U** = UEBRIG6 und STICH ohne Doppel: `/gleichschliessende-zylinder,/service-und-termin,/artikel,/standorte/berlin,/sicherheitstechnik/sicherheitscheck,/rechtliches/agb,/artikel/beispiel-schluesselkasten,/autoschluessel/schluesselbart-fraesen,/elektronische-zutrittsloesungen,/rechtliches/impressum,/service-und-termin/vor-ort`.
- Hauptaufgaben (K-002) in der Funktionsliste: F-04 Autoschlüssel-Termin; F-01 und F-02 Schlüssel nach Code bis zur Kasse; F-05 Zylinder; F-07 Vorlage; F-06 Schließanlagen; F-08 Terminstatus.
- Budgets (K-011): LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms; Bildrate ≤ 5 % verworfen.
- Register der Bewegungen: `_werkstatt/KERN.md`, K-007, B-01 bis B-29.

## Grenzen
- Keine Projektdatei ändern.
- Rechenintensive Läufe nacheinander. Bash-Zeitlimit höchstens 600000 ms; Läufe über 9 Minuten mit `nohup … &` und Protokolldatei starten, dann in Abständen nachsehen.
- Sperre `/tmp/sm24-messfenster.lock` nur in den Teilen, die es sagen: setzen mit `echo E7-PRUEFER-C > /tmp/sm24-messfenster.lock`, am Ende (auch bei Abbruch) `rm -f /tmp/sm24-messfenster.lock`.
- Werkzeuge mit `--json` schreiben ihr JSON dorthin; ohne `--json` landet es in `_werkstatt/protokolle/` (erlaubt).

## Teile (jeder Agent führt nur seinen Teil aus)

### Teil 1 · Bestand (Protokolle `E7-PRUEFER-C-<name>.log`)
1. `npx tsc --noEmit; echo "EXIT $?"` (typecheck)
2. `npx eslint .; echo "EXIT $?"` (lint)
3. `npx vitest run` (test-unit; Dateien und Tests melden)
4. DB-Tests als Nutzer ubuntu genau wie in `E0-PRUEFER-05-ausgangswerte.md` beschrieben (test-db; Vergleich 7 Dateien, 52 Tests)
5. `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` (logik)
6. `node _werkstatt/werkzeuge/textabzug.mjs vergleichen` (textabzug)
7. `node _werkstatt/werkzeuge/werte-suche.mjs --json _werkstatt/protokolle/E7-PRUEFER-C-werte.json` (werte; „Summe ohne Ausnahmen“ melden)
8. Build-Protokoll lesen: Exit-Code und Seitenzahl aus `E7-PRUEFER-C-build.log`. Mit curl prüfen:
   - `/` liefert 200, `/gibt-es-nicht-pruefung` liefert 404.
   - Das HTML von `/` enthält „Hinweis für die Redaktion“ NICHT.
9. `git status --short AGENTS.md`: nur melden.

### Teil 2 · Messfenster A (Sperre setzen)
1. `node _werkstatt/werkzeuge/konsole.mjs > _werkstatt/protokolle/E7-PRUEFER-C-konsole.log 2>&1` und `node _werkstatt/werkzeuge/konsole.mjs --routen <ALLE_U> >> …konsole.log 2>&1`
2. Bildsatz:
   - `node _werkstatt/werkzeuge/bildsatz.mjs --ziel /root/sm24-bilder/e7-c --max 12 > _werkstatt/protokolle/E7-PRUEFER-C-bildsatz.log 2>&1`
   - danach `node _werkstatt/werkzeuge/bildsatz.mjs --routen <ALLE_U> --ziel /root/sm24-bilder/e7-c/uebrige --max 6 >> …bildsatz.log 2>&1`
3. `node _werkstatt/werkzeuge/gefuellt.mjs --ziel /root/sm24-bilder/e7-c/gefuellt > _werkstatt/protokolle/E7-PRUEFER-C-gefuellt.log 2>&1`
4. Einzelbilder der großen Momente (Desktop), je 5 Bilder. Protokoll `E7-PRUEFER-C-einzelbilder.log`, alle Ausgaben anhängen. Schlägt ein Selektor fehl, melde es und mach weiter.
   - `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder / --selektor "main section:first-of-type [role=img]" --geraet desktop --ziel /root/sm24-bilder/e7-c/einzelbilder/H01`
   - dasselbe für `/autoschluessel` mit `--selektor "main header [role=img]"` (…/H02)
   - `/schluessel-nach-code` mit `"main [role=img]"` (…/H05)
   - `/schliessanlagen` mit `"main header [role=img]"` (…/H08)
   - `/tuer-und-schliesstechnik` mit `"main header [role=img]"` (…/H09)
   - `/ratgeber/autoschluessel-verloren-was-tun` mit `"main header [role=img]"` (…/H12)
   - `/standorte/berlin` mit `"main header [role=img]"` (…/U-STANDORTE)
   - `/service-und-termin` mit `"main header [role=img]"` (…/U-SERVICE)
   - Das Werkzeug nimmt den ersten **gerenderten** Treffer und protokolliert, welcher es war; melde ihn je Moment. Endet ein Aufruf mit „keine endliche Animation“, wiederhole ihn einmal mit `--dauer 1600` (anhängen).
5. `node _werkstatt/werkzeuge/a11y.mjs --geraet beide > _werkstatt/protokolle/E7-PRUEFER-C-a11y.log 2>&1` und `node _werkstatt/werkzeuge/a11y.mjs --geraet beide --routen <ALLE_U> >> …a11y.log 2>&1`
6. `node _werkstatt/werkzeuge/bewegung.mjs reduziert > _werkstatt/protokolle/E7-PRUEFER-C-bewegung-reduziert.log 2>&1` und dasselbe mit `--routen <ALLE_U>` (anhängen)
7. (Bildrate läuft in Teil 4.)
8. Sieh dir je Ansicht (auch ALLE_U) das erste Desktop- und das erste Mobilbild an und melde nüchtern technische Auffälligkeiten (Überlauf, Abgeschnittenes, leere Flächen, Überdeckung). Nicht gestalterisch werten.
9. Sperre löschen.

### Teil 3 · Funktionsliste und Tastatur
1. `mkdir -p /root/sm24-bilder/e7-c/schritte && SM24_SCHRITTBILDER=/root/sm24-bilder/e7-c/schritte node _werkstatt/werkzeuge/funktionsliste.mjs > _werkstatt/protokolle/E7-PRUEFER-C-funktionsliste.log 2>&1`
   - Das Werkzeug wartet selbst, solange die Sperre besteht.
   - Jede NICHT BESTANDEN einmal mit `--nur F-xx` wiederholen (Protokoll anhängen) und beide Ergebnisse melden.
2. Hauptaufgaben nur mit Tastatur, mobil und am Desktop. Der Abschnitt „Tastatur“ im Markdown-Protokoll nennt Bedienungen, Tab-Schritte und Bedienungen ohne sichtbaren Fokus.
   - `node _werkstatt/werkzeuge/funktionsliste.mjs --tastatur --geraet mobil --nur F-01,F-02,F-04,F-05,F-06,F-07,F-08 > _werkstatt/protokolle/E7-PRUEFER-C-tastatur-mobil.log 2>&1`
   - dasselbe mit `--geraet desktop` (`…-tastatur-desktop.log`)
   - Jede NICHT BESTANDEN einmal mit `--nur` wiederholen.

### Teil 4 · Messfenster B (läuft allein)
Führe das Paket `_werkstatt/pakete/E7-PRUEFER-02.md` vollständig aus, Schritte 0 bis 5 (Leistung mobil und Desktop im Vergleich mit E0 auf Port 3100, Bildrate der 8 Momente, Ladeweg, Sperre). Dessen Protokolle heißen `E7-PRUEFER-02-*`, die Ergebnisdatei `_werkstatt/protokolle/E7-PRUEFER-02-ergebnis.md` schreibst du nach dessen Abschnitt „Auswertung“ (Funktionsliste, Tastatur und Konsole stehen dort als Verweis auf Teil 2 und 3 dieses Pakets, nicht doppelt laufen lassen). Melde je Ansicht und Profil Median LCP, CLS, INP jetzt und E0, die E0-Spanne, ob Z-08 erfüllt ist und die Budgets.

### Teil 5 · Register und SVG
1. Animationen:
   - `node _werkstatt/werkzeuge/animationen.mjs --bedienen --geraet desktop --json /root/sm24-bilder/e7-c/animationen-desktop.json > _werkstatt/protokolle/E7-PRUEFER-C-animationen.log 2>&1`
   - dasselbe mit `--geraet mobil` und mit `--routen <ALLE_U>` (anhängen).
2. Ordne jeden Keyframe-Namen und jede WAAPI-Animation aus dem Protokoll (auch die beim Bedienen beobachteten Übergänge, Spalte „Bedienung“) einem Eintrag B-01 bis B-29 in `_werkstatt/KERN.md` (K-007) zu. Suche dazu die Klassen im Code (`grep -rn "sm24-<name>\|animate-<name>" src`).
   - Schreibe `_werkstatt/protokolle/E7-PRUEFER-C-register.md` mit der Tabelle „Keyframe oder WAAPI · Ansichten · Fundstellen im Code · Registereintrag“.
   - Was keinem Eintrag zugeordnet werden kann, ist ein Befund. Übergänge (`transition`) bei Hover, Fokus und Zustandswechsel gehören zu B-06 (Knopfdruck und Zeilenpfeil), B-08 (Megamenü), B-07 (Drawer) oder B-09 (Akkordeon); prüfe das stichprobenartig.
3. SVG:
   - `node _werkstatt/werkzeuge/svg-pruefung.mjs --json /root/sm24-bilder/e7-c/svg-haupt.json > _werkstatt/protokolle/E7-PRUEFER-C-svg.log 2>&1`
   - dasselbe mit `--routen <ALLE_U>` (anhängen).
   - Melde: Dateien mit Befund, unbenannte sichtbare SVG, doppelte id, lucide-Reste, Familie (Icons mit `data-sm24-icon`, Grafiken mit `role=img`, andere).
4. `grep -rln "lucide-react" src package.json`: Ergebnis melden (Erwartung: kein Treffer).

### Teil 6 · Ergebnis
Schreibe `_werkstatt/protokolle/E7-PRUEFER-C-ergebnis.md`:
- **Tabelle 1** „Prüfung · E0 · Abschlussversuch 1 · jetzt · Beleg“ für Bestand, Build, Funktionsliste, Tastatur (mobil und Desktop), Wertesuche, Logikwächter und Textabzug.
- **Tabelle 2** je Hauptansicht (H01 bis H12), jeweils E0 → Abschlussversuch 1 → jetzt:
  - Konsole (Fehler, Warnungen, Seitenfehler)
  - Überlauf je Gerät
  - axe ernst und kritisch je Gerät
  - Bewegung reduziert
  - LCP, CLS, INP mobil und Desktop (Median, mit E0 heute und E0-Spanne, aus `E7-PRUEFER-02-ergebnis.md`)
- **Tabelle 3** je Ansicht aus ALLE_U: Konsole, Überlauf je Gerät, axe ernst und kritisch je Gerät, Bewegung reduziert.
- **Tabelle 4** Bildrate der großen Momente (Median aus 5 Läufen, alle Einzelwerte, gemessenes Element; aus Teil 4).
- **Tabelle 5** „Kriterium · Prüfung · Ergebnis · Beleg“ für Z-02, Z-05, Z-06, Z-07, Z-08 und Z-09, nach den Kriterien in `_werkstatt/ABNAHME.md`. Nur Messergebnisse; das Urteil fällt der Endprüfer.
- Liste aller Budget-Verstöße, aller axe-Befunde „serious“ oder „critical“ (mit Regel und Selektor), aller nicht bestandenen Funktionen und aller Registerbefunde.
- Kein Urteil über Gestaltung.

## Schnellprüfung und Selbstprüfung
Jede Zahl hat ein Protokoll. Die Messung hat 5 Läufe mobil und 3 Läufe Desktop je Server, die Bildrate 5 Läufe. Die Sperre ist am Ende gelöscht.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E7-PRUEFER-C · BEREIT ZUR RÜCKGABE ===
