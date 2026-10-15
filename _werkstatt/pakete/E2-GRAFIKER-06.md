E2-GRAFIKER-06 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.1 · Schreibrechte (exakt, beide neu): `src/components/visual/generators/stiftzuhaltung.tsx`, `src/components/visual/generators/stiftzuhaltung.test.tsx` · Umfang: neuer Grafik-Generator „Stiftzuhaltung im Schnitt“ (Fehlerseiten 404/500, später Kür-Szene)

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als das Register vorsieht; reduzierte Bewegung vergessen; uneinheitliche Strichstärken. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Zeichne als Generator `stiftzuhaltung` einen Schließzylinder im Längsschnitt mit fünf Stiftpaaren und eingestecktem Schlüssel, in drei Zuständen: Der Schlüssel passt, passt nicht oder ist abgebrochen.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.1, unveränderlich)
- K-001 Leitidee: Werkstattzeichnung – helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift.
- K-008 Generatoren:
  - 480 × 270, reines SVG, Server-Komponente ohne `'use client'`, deterministisch (kein `Math.random`, kein `Date`), werfen nie.
  - `GrafikRahmen` und `Raster` aus `grafik-basis.tsx`; Striche nur `KONTUR`, `LINIE`, `HILFSLINIE` (Summen wie `LINIE + 0.5` erlaubt), runde Enden.
  - Keine `id`, keine festen Farben, keine `<marker>`; Pfeilspitzen über `pfeilspitze()`.
  - Farben nur über Klassen: `stroke-foreground`, `stroke-foreground-muted`, `fill-surface`, `fill-surface-muted`, `stroke-area`, `stroke-area-strong`, `fill-area`, `fill-area-soft`, `fill-area-muted`, `fill-foreground-muted`, `stroke-border-strong`, `stroke-danger`, `fill-danger-soft`, `stroke-success`.
  - Beschriftung als `<text className="fill-foreground-muted font-mono">` mit `SCHRIFT` bzw. `SCHRIFT_KLEIN`, nur sachliche Wörter oder Werte aus `params`.
  - Gemeinsame Helfer gehören nach `grafik-basis.tsx` (nicht ändern; vorhandene nutzen: `hash`, `zahlenfolge`, `ziffern`, `kerben`, `positionen`, `r`, `auswahl`, `parameter`, `wert`, `kurztext`, `titel`). Keine Hilfsdatei in `generators/`.
- K-007 Bewegung: höchstens zwei Bewegungen, beide aus dem Bestand.
  - Die Marken an der Trennlinie erscheinen mit `sm24-pop`, gestaffelt (`motionStyle(0.3 + i * 0.12)`, höchstens 5).
  - Die Trennlinie zeichnet sich mit `sm24-draw` (`pathLength={1}`, `strokeDasharray: DRAW_DASHARRAY` über `motionStyle`).
  - Alles andere ist statisch, die Grafik ist ohne Bewegung vollständig.
- Vertrag aus `src/components/visual/README.md`, Abschnitt „Grafik-Generatoren“.

## Maßstab
Muster: `generators/zylinder-mass.tsx` (Zylinder, Maßlinien, Mono-Beschriftung) und `generators/schluessel.tsx` (Schlüsselgeometrie mit `kerben`). Formensprache des neuen Hero-Generators: `generators/profilschnitt.tsx`. Test-Muster: `generators/profilschnitt.test.tsx` (`pruefeVertrag`, Unsinnswerte, Determinismus).

## Grenzen
- Nur die zwei neuen Dateien. **`registry.tsx` und `registry.test.tsx` nicht ändern**: Den Eintrag überträgt der Orchestrator. Melde ihn unter GEMEINSAME DATEIEN. Bis dahin ist der Rotfall „führt jede Generator-Datei …“ in `registry.test.tsx` erwartet.
- Keine Aussagen über Sicherheitsklassen oder Wirksamkeit.

## Schritte
1. Lies `grafik-basis.tsx`, `zylinder-mass.tsx`, `profilschnitt.tsx`, `motion/motion-style.ts` und die README.
2. Baue `export function StiftzuhaltungGrafik({ params, title, className }: VisualProps)` mit `viewBox` 480 × 270:
   - **Gehäuse:** Rechteck mit kleinem Radius, etwa x 150–430, y 40–215, Klasse `fill-surface stroke-foreground`, `KONTUR`.
   - **Kern:** im unteren Teil des Gehäuses, etwa y 118–195, `fill-area-soft stroke-foreground`.
   - **Trennlinie:** auf der Oberkante des Kerns; ragt links und rechts je 14 Einheiten heraus; gestrichelt `stroke-area-strong`, `LINIE`, `sm24-draw`. Beschriftung „Trennlinie“ rechts außen (Mono, `SCHRIFT_KLEIN`).
   - **Fünf Bohrungen:** bei x = 200, 245, 290, 335, 380, Breite 18, vom Gehäusedach bis in den Kern. Je Bohrung von oben nach unten:
     - Feder als Zickzack-Pfad (`stroke-foreground-muted`, `LINIE`)
     - Gehäusestift als Rechteck (`fill-area-muted stroke-foreground`)
     - Kernstift als Rechteck mit spitzem unteren Ende (`fill-surface stroke-area-strong`)
   - **Schlüssel:** kommt von links in den Kern. Die Reide außerhalb (x 30–140, Rechteck mit Radius, `fill-area-muted stroke-foreground`, Loch als Kreis). Der Halm liegt im Kern (etwa y 150–182); seine Oberkante hat unter jeder Bohrung einen Einschnitt (mit `kerben`). Die Spitze der Kernstifte liegt genau auf der Einschnittkante.
   - **Fünf Stifttiefen:** `ziffern(wert(p,'einschnitte'), 5, 5)` oder Standard `[3, 6, 2, 7, 4]`, Stufen 0–9.
   - **Zustand `passt` (Standard):** Die Stiftlängen gleichen die Tiefen so aus, dass jede Fuge zwischen Kern- und Gehäusestift genau auf der Trennlinie liegt. An jeder Fuge sitzt eine kleine Marke (Kreis r 4, `stroke-success`, `sm24-pop`).
   - **Zustand `passt-nicht`:**
     - Gleiche Stiftlängen wie bei `passt`, aber der Schlüssel hat andere Tiefen: deterministisch aus `[3, 6, 2, 7, 4]` verschoben, mindestens 3 von 5 abweichend.
     - Die Fugen liegen dann über oder unter der Trennlinie. An jeder falschen Fuge sitzt eine Marke `stroke-danger` mit einem kurzen senkrechten Strich, der den Versatz zur Trennlinie zeigt (Pfeilspitze über `pfeilspitze()`).
     - Die richtigen Fugen behalten die Marke `stroke-success`.
   - **Zustand `abgebrochen`:**
     - Der Halm endet nach der zweiten Bohrung mit einer gezackten Bruchkante; das abgebrochene Stück liegt im Kern unter den Bohrungen 3–5.
     - Die Reide liegt mit einem kurzen Halmstumpf etwa 30 Einheiten links abgesetzt vor dem Zylinder.
     - Fugen wie bei `passt-nicht` nicht ausgerichtet, wo kein Schlüssel trägt (Kernstift ganz unten).
   - **`code`** (optional, bis 4 Ziffern als Text, z. B. `'404'`): erscheint in Mono (`SCHRIFT`, `fill-foreground-muted`) auf der Reide. Ohne `code` keine Beschriftung auf der Reide.
3. Parameter über `parameter()`, `wert()`, `auswahl()`: `zustand` (`passt` · `passt-nicht` · `abgebrochen`, Standard `passt`), `einschnitte`, `code` (nur Ziffern 0–9, höchstens 4; alles andere entfällt).
4. Titel: `titel(title, …)`. Standards:
   - „Stiftzuhaltung: Der Schlüssel passt“
   - „Stiftzuhaltung: Der Schlüssel passt nicht“
   - „Abgebrochener Schlüssel im Zylinder“
5. Kopfkommentar mit `params:`-Liste wie bei den anderen Generatoren.
6. Tests in `stiftzuhaltung.test.tsx`, mindestens 9 Fälle:
   - Vertrag für alle drei Zustände: `viewBox="0 0 480 270"`, `role="img"`, `<title>` zuerst, keine `id`, kein Hex, kein `rgb(`, kein `<marker`, kein `NaN|undefined`.
   - Bei `passt` 5 Marken `stroke-success` und keine `stroke-danger`.
   - Bei `passt-nicht` mindestens 3 Marken `stroke-danger`.
   - Bei `abgebrochen` ist eine Bruchkante vorhanden (prüfe ein eindeutiges Merkmal deiner Wahl, z. B. ein `data-bruch=""`-Attribut am Pfad).
   - `code: '404'` erscheint als Text; `code: 'abc'` und `code: '12345'` erscheinen nicht vollständig (höchstens 4 Ziffern, nur Ziffern).
   - Unsinnswerte (`null`, `42`, `[]`, `{ zustand: 7 }`, `{ einschnitte: 'x' }`) werfen nicht.
   - Gleiche Eingabe ergibt die gleiche Ausgabe.
   - Ein eigener Titel wird übernommen.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx vitest run src/components/visual/generators/stiftzuhaltung.test.tsx` grün (Zahl nennen); `npx eslint` beider Dateien und `npx tsc --noEmit` ohne Fehler.
- Bild:
  - Rendere die drei Zustände per `renderToStaticMarkup` in eine HTML-Datei unter `/tmp`. Nimm `code: '404'` bei `passt-nicht` und `code: '500'` bei `abgebrochen`, und setze im `<style>` nur für die Vorschau Ersatzfarben, etwa `.stroke-foreground{stroke:#1f2937} .fill-area-soft{fill:#e8f0fe} …`.
  - Fotografiere sie mit `playwright-core` aus `_werkstatt/werkzeuge/node_modules` (Chromium-Pfad `CHROMIUM` aus `_werkstatt/werkzeuge/lib.mjs`) nach `/root/sm24-bilder/E2-GRAFIKER-06/`.
  - Prüfe selbst: Fugen liegen bei `passt` exakt auf der Trennlinie, nichts überlappt falsch, Beschriftungen bleiben in der viewBox.
- Zähle: 5 Bohrungen, 3 Zustände, mindestens 9 Tests.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (Registry-Eintrag `stiftzuhaltung: StiftzuhaltungGrafik`, `NAMEN`-Eintrag, README-Abschnitt als fertiger Text) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-GRAFIKER-06 · BEREIT ZUR RÜCKGABE ===
