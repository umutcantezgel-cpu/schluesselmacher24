E2-PRUEFER-02 · Rolle Prüfer (Werkzeug) · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.3 · Schreibrechte (exakt): `_werkstatt/werkzeuge/bewegung.mjs`, `_werkstatt/werkzeuge/LIESMICH.md` (nur der Abschnitt zu `bewegung.mjs`), Ausgaben nach `/root/sm24-bilder/E2-PRUEFER-02/**` · Umfang: Einzelbilder großer Momente zeitgenau statt nach Wanduhr

## Rollenbriefing
Du bist Prüfer und pflegst ein Prüfwerkzeug. Ein Werkzeug misst ehrlich und wiederholbar, es beschönigt nichts. Häufige Fehler: Zeitpunkte nach Wanduhr statt nach Animationszeit; Animationen nach dem Pausieren unbeabsichtigt wieder gestartet; Ausschnitt zu klein. Du committest und pushst nie und änderst keine Projektdatei unter `src/`.

## Aufgabe in einem Satz
Stelle `bewegung.mjs einzelbilder` so um, dass die fünf Bilder bei 0, ¼, ½, ¾ und 1 der Animationszeit des Moments entstehen, unabhängig davon, wann die Seite fertig geladen ist.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Befund aus der Sichtabnahme E2-L-07: Die Einzelbilder von B-01 zeigen bei „0“ schon zwei Einschnitte, und die Bilder 2 bis 4 sind gleich, weil nach Wanduhr ab dem Laden fotografiert wurde. Der Ausschnitt mit `[data-fraesbahn]` war nur etwa 60 px groß.
- Große Momente starten bald bei Sichtbarkeit. Eine Hülle setzt dann `data-motion` von „wait“ auf „play“, und CSS-Animationen (`.sm24-*`) laufen erst ab diesem Moment. Dazu kommen WAAPI-Animationen der Hülle mit gleicher `startTime`.

## Maßstab
Die übrigen Unterbefehle von `bewegung.mjs` und `lib.mjs` (Gerätekontexte, Attrappen) bleiben unverändert. Der Aufbau der Ausgabe (Tabelle, JSON-Protokoll) bleibt gleich.

## Grenzen
- Nur die Dateien aus den Schreibrechten. Nichts löschen. Keine neuen Abhängigkeiten.
- Port 3000 (Produktion) für die Probe; Port 3100 nicht anfassen.

## Schritte
1. Lies `bewegung.mjs` ganz und `lib.mjs`.
2. Neuer Ablauf in `einzelbilder` (Standard; der alte Wanduhr-Ablauf bleibt als Option `--echtzeit`):
   1. Nach `scrollIntoView` warten, bis das nächste Element `[data-motion]` um den Selektor „play“ zeigt (höchstens 5 s; gibt es keines, sofort weiter).
   2. Im Browser `Promise.all(anims.map(a => a.ready))` abwarten, dann zwei Bildschirmframes (`requestAnimationFrame`). Die Hülle setzt `startTime` erst nach `ready`; wer davor pausiert, wird wieder gestartet.
   3. `anims` = `el.getAnimations({ subtree: true })` ohne `CSSTransition`, alle pausieren. Zeitfenster: kleinste Verzögerung bis größte endliche `endTime`. Unendliche Animationen überspringen. `--dauer` bleibt als Überschreibung.
   4. Je Bild für jede Animation `currentTime = t_k` setzen (gleiche absolute Zeit, `currentTime` enthält die Verzögerung), zwei Frames warten, fotografieren. Playwright-Standard `animations: 'allow'` beibehalten.
   5. Im Protokoll und in der Tabelle `t_k` in ms statt Soll/Ist der Wanduhr ausgeben.
3. Neue Option `--rand <px>` (Standard 24): Der Ausschnitt wird um diesen Rand erweitert und auf die Seitengröße begrenzt. Ist das Element kleiner als 200 × 120 px, nimm automatisch das nächste Vorfahrenelement mit `role="img"` oder `<svg>` und vermerke das im Protokoll.
4. `LIESMICH.md`: Abschnitt zu `bewegung.mjs` aktualisieren.
5. Probe gegen Port 3000:
   - `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder / --selektor "main section:first-of-type [role=img]" --geraet desktop --ziel /root/sm24-bilder/E2-PRUEFER-02/b01`
   - `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder / --selektor "[data-fraesbahn]" --geraet desktop --ziel /root/sm24-bilder/E2-PRUEFER-02/b01-klein` (muss automatisch auf die Grafik erweitern)
   - Sieh dir alle Bilder an: Bild 0 muss den Anfang zeigen, die Bilder müssen sich unterscheiden.
   - Zusätzlich einmal `--echtzeit` zum Vergleich.

## Schnellprüfung und Selbstprüfung
- `node --check _werkstatt/werkzeuge/bewegung.mjs`; beide Probeläufe mit Exit 0; Bild 0 ≠ Bild 4; Bildbeschreibung je Bild im Bericht.
- `git status --short`: von dir nur `_werkstatt/werkzeuge/bewegung.mjs`, `LIESMICH.md` und Protokolle unter `_werkstatt/protokolle/bewegung-einzelbilder-*.json`.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
