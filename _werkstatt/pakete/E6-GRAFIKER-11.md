E6-GRAFIKER-11 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.12 · Schreibrechte (exakt): `src/components/visual/generators/stiftzuhaltung.tsx`, `src/components/visual/generators/stiftzuhaltung.test.tsx` · Umfang: Kür K-01 – Parameter `szene: 'scroll'` für die Stiftzuhaltung (Schlüssel fährt ein, Stifte richten sich aus), ohne bestehende Ausgaben zu verändern

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen, reduzierte Bewegung vergessen, uneinheitliche Strichstärken, bestehende Verträge brechen. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Ergänze `StiftzuhaltungGrafik` um `szene: 'scroll'`: Die Zeichnung trägt dann nur Klassen und CSS-Variablen, mit denen die fertigen Regeln in `globals.css` (B-25) beim Scrollen den Schlüssel einfahren und die Stifte sich ausrichten lassen – die Endlage ist das bekannte Bild „passt“.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.12, unveränderlich)
- **Formsystem K-008:** Striche nur aus der Strichskala in `generators/grafik-basis.tsx`; Farben nur über Klassen; keine `id`-Attribute, keine `<marker>`; Rahmen über `GrafikRahmen`.
- **Bewegung B-25 (fertig in `src/app/(site)/globals.css`, lies den Block „Stiftzuhaltung am Scrollen“ und die Keyframes `sm24-schluessel-ein`, `sm24-stift-heben`, `sm24-feder-heben`, `sm24-erscheinen`):**
  - `.sm24-szene` am äußeren SVG (über `className` an `GrafikRahmen`) stellt die Zeitleiste `--szene`.
  - `.sm24-scrub-schluessel` mit `--schluessel-von` (Zahl in viewBox-Einheiten, negativ = links): Reide, Halm und Bruchkante verschieben sich gemeinsam.
  - `.sm24-scrub-stift` mit `--stift-von` (Zahl, positiv = tiefer) und `--stift-nr` (0–4): Gehäusestift und Kernstift einer Bohrung verschieben sich gemeinsam.
  - `.sm24-scrub-feder` mit `--feder-von` (Faktor > 1, die Feder ist in der Ausgangslage länger) und `--stift-nr`: die Feder streckt sich von oben (`transform-origin: top` setzt das CSS).
  - `.sm24-scrub-pruefung`: Gruppe um die Prüfmarken an der Trennlinie, erscheint zuletzt.
  - Ohne Unterstützung oder bei reduzierter Bewegung greift keine Regel: Die Zeichnung steht in der Endlage. Deshalb muss die Endlage **ohne jede Variable** genau das heutige Bild „passt“ sein.
- **Keine Längenangaben mit Einheit in `style`:** Die Variablen sind reine Zahlen (`style={{ '--stift-von': 24 } as CSSProperties}`), das CSS rechnet `* 1px`.

## Auftrag
1. **Parameter `szene`** (`'scroll'` oder nichts; Standard nichts). Wirkt nur bei `zustand: 'passt'`; bei `passt-nicht` und `abgebrochen` bleibt die Ausgabe wie ohne `szene`.
2. **Mit `szene: 'scroll'`:**
   - `className` von `GrafikRahmen` um `sm24-szene` ergänzen (vorhandene `className` bleibt erhalten, Reihenfolge: übergebene Klasse, dann `sm24-szene`).
   - Schlüsselteile (Füllung und Kontur des Halms, Reide, Reidenloch, Code-Text) in eine Gruppe `<g className="sm24-scrub-schluessel" style={{ '--schluessel-von': … }}>`. Wert: so weit nach links, dass die Halmspitze vor der ersten Bohrung steht (etwa −(Bohrung 1 − Gehäuse links) − 20, gerundet).
   - Je Bohrung Gehäusestift und Kernstift in eine Gruppe `sm24-scrub-stift` mit `--stift-von` = Abstand der Ausgangslage (ohne Schlüssel fällt der Kernstift auf `STIFT_BODEN`): `STIFT_BODEN − spitze`, höchstens 30, mindestens 8 (damit jede Bohrung sichtbar arbeitet), und `--stift-nr` = Index.
   - Je Feder `sm24-scrub-feder` mit `--feder-von` = (Federlänge in der Ausgangslage) / (Federlänge in der Endlage), auf zwei Stellen gerundet, und `--stift-nr`.
   - Die Prüfmarken (heute `sm24-pop`-Kreise an der Trennlinie) in eine Gruppe `sm24-scrub-pruefung`.
   - Die Zeichenreihenfolge der Elemente bleibt (Kernstifte über dem Halm wie heute).
3. **Ohne `szene`:** Ausgabe Zeichen für Zeichen gleich (Test: Ausgabe vorher und nachher für alle bestehenden Testfälle identisch; lege die Vergleichstexte vor deiner Änderung an).
4. **Tests** in `stiftzuhaltung.test.tsx` (bestehende Prüfungen bleiben, ihre Zahl sinkt nie): `sm24-szene` nur mit `szene`; fünf `sm24-scrub-stift` und fünf `sm24-scrub-feder` mit `--stift-nr` 0–4; `--stift-von` zwischen 8 und 30; `--feder-von` > 1; genau eine `sm24-scrub-schluessel`-Gruppe mit negativem `--schluessel-von`; `sm24-scrub-pruefung` vorhanden; `szene` bei `passt-nicht` und `abgebrochen` ohne Wirkung; ohne `szene` unverändert; keine Einheit in `style`; deterministisch.

## Maßstab
`src/components/visual/generators/stiftzuhaltung.tsx` samt Test, `src/components/visual/generators/zylinder-mass.tsx` (Parameter `format` als Muster für einen zusätzlichen Parameter), `src/app/(site)/globals.css` (Block B-25), `src/components/visual/README.md` (Abschnitt `stiftzuhaltung`; die README ändert der Orchestrator).

## Grenzen
- Nur die zwei Dateien. Registry, README, `globals.css` und Seiten ändert der Orchestrator; Wünsche ins Feld GEMEINSAME DATEIEN.
- Bestehende Exporte, Parameter und Standardwerte bleiben gleich.
- Nie Dateien löschen. Vor `vitest` prüfen: Besteht `/tmp/sm24-messfenster.lock`, wartest du.

## Schritte
1. Lies Generator, Test, den CSS-Block B-25 und `zylinder-mass.tsx`.
2. Vergleichstexte ohne `szene` sichern (im Test), dann `szene` umsetzen, dann Tests.
3. `npx tsc --noEmit`, `npx eslint` der zwei Dateien, `npx vitest run src/components/visual` (Zahl nennen), `node _werkstatt/werkzeuge/werte-suche.mjs` der zwei Dateien.
4. Bilder: Skript nur unter `/root/sm24-bilder/E6-GRAFIKER-11/`, das mit `react-dom/server` die Szene in eine HTML-Seite mit 1200 px Leerraum davor und danach einbettet (CSS: `npx tailwindcss -c tailwind.config.ts -i 'src/app/(site)/globals.css' -o /root/sm24-bilder/E6-GRAFIKER-11/tw.css`), mit Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `playwright-core` aus `_werkstatt/werkzeuge/node_modules`) an fünf Scrollpositionen fotografiert (Schlüssel draußen, halb drin, drin, Stifte halb, alles ausgerichtet) und einmal mit `reducedMotion: 'reduce'`. Sieh dir die Bilder an.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E6-GRAFIKER-11 · BEREIT ZUR RÜCKGABE ===
