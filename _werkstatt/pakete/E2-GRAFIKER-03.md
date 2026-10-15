E2-GRAFIKER-03 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.0 · Schreibrechte (exakt, beide neu): `src/components/visual/generators/tuer-schutz.tsx`, `src/components/visual/generators/tuer-schutz.test.tsx` · Umfang: neuer Grafik-Generator „Schutzpunkte einer Tür“ (großer Moment B-18 der Türtechnik-Seite)

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als das Register vorsieht; reduzierte Bewegung vergessen; uneinheitliche Strichstärken. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Zeichne als neuen Generator `tuer-schutz` die Innenansicht einer Tür mit Zarge und markiere mit nummerierten Punkten die fünf Stellen, an denen Tür- und Schließtechnik schützt, wahlweise eine davon hervorgehoben.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.0, unveränderlich)
- K-001 Leitidee: Werkstattzeichnung – helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift.
- K-008: Generatoren 480 × 300, reines SVG, Server-Komponente ohne `'use client'`, deterministisch (kein `Math.random`, kein `Date`), werfen nie; `GrafikRahmen` und `Raster` aus `grafik-basis.tsx`; Striche nur `KONTUR`, `LINIE`, `HILFSLINIE` (Summen wie `LINIE + 0.5` sind im Bestand üblich und erlaubt); runde Enden; keine `id`, keine festen Farben, keine `<marker>`, Pfeilspitzen über `pfeilspitze()`; Farben nur über Klassen (`stroke-foreground`, `stroke-foreground-muted`, `fill-surface`, `fill-surface-muted`, `stroke-area`, `stroke-area-strong`, `fill-area`, `fill-area-soft`, `fill-area-muted`, `fill-foreground-muted`, `stroke-border-strong`); Beschriftung als `<text className="fill-foreground-muted font-mono">` mit `fontSize={SCHRIFT}` bzw. `SCHRIFT_KLEIN`, nur sachliche Wörter.
- K-007 Register B-18: Marken erscheinen mit `sm24-pop`, gestaffelt höchstens 5 × 0,12 s (`motionStyle(0.3 + i * 0.12)`); Führungslinien zeichnen mit `sm24-draw` (`pathLength={1}`, `strokeDasharray: DRAW_DASHARRAY` über `motionStyle(…, …, { strokeDasharray: DRAW_DASHARRAY })`). Tür und Zarge sind statisch. Die Grafik ist ohne Bewegung vollständig (CSS sorgt dafür; nichts hinzufügen).
- Vertrag aus `src/components/visual/README.md`, Abschnitt „Grafik-Generatoren“.

## Maßstab
Muster: `generators/zutritt-signal.tsx` (Tür mit Zarge, Blatt, Beschlag; Aufbau, Konstanten, Kommentare) und `generators/zylinder-mass.tsx` (Beschriftungen in Mono). Test-Muster: `generators/zutritt-signal.test.tsx` und `generators/schliessplan.test.tsx` (`pruefeVertrag`, Unsinnswerte, Determinismus).

## Grenzen
- Nur die zwei neuen Dateien. **`registry.tsx` und `registry.test.tsx` nicht ändern**: Den Eintrag `'tuer-schutz': TuerSchutzGrafik` und den Namen in `NAMEN` überträgt der Orchestrator am Wellenende. Melde ihn unter GEMEINSAME DATEIEN. Bis dahin schlägt `registry.test.tsx` mit „jede Datei ist eingetragen“ fehl – das ist erwartet und zählt nicht als Fehler deiner Schnellprüfung.
- Keine Behauptungen über Widerstandsklassen, Normen oder Wirksamkeit; nur Bauteilnamen.

## Schritte
1. Lies `grafik-basis.tsx`, `zutritt-signal.tsx`, `zylinder-mass.tsx`, `motion/motion-style.ts` und die README vollständig.
2. Baue `export function TuerSchutzGrafik({ params, title, className }: VisualProps)` in `tuer-schutz.tsx`, `viewBox` 480 × 300:
   - Links (x ≈ 40–230): Innenansicht einer einflügeligen Tür, Zarge (`stroke-foreground`, `KONTUR`), Türblatt (`fill-surface stroke-foreground`), Raster im Hintergrund (`<Raster breite={480} hoehe={300} />`), Boden als `HILFSLINIE`. Bänder auf der linken Seite (zwei kurze Rechtecke an der Zarge), Schlossseite rechts.
   - Bauteile an der Schlossseite: Schutzbeschlag (Langschild mit Drücker oben, Zylinderrosette darunter, `fill-area-muted stroke-foreground`), Zylinder als kleiner Kreis mit Schlitz in der Rosette, Schließblech an der Zarge auf Höhe der Falle (schmales Rechteck), Zusatzschloss oberhalb des Beschlags (kleines Kastenschloss mit Riegel zur Zarge), Bandseitensicherung als kurzer Bolzen auf der Bandseite zwischen den Bändern.
   - Fünf Marken (Kreise r = 11, `fill-area stroke-surface`, Ziffer 1–5 als `<text>` in `fill-surface font-mono`, `textAnchor="middle"`), jeweils direkt am Bauteil, in dieser Reihenfolge: 1 Schließzylinder · 2 Schutzbeschlag · 3 Schließblech · 4 Zusatzschloss · 5 Bandseite.
   - Rechts (x ≈ 270–450) eine Legende: je Zeile die Ziffer in einem kleinen Kreis (r = 9, `stroke-area-strong`) und der Name in Mono (`SCHRIFT`): „Schließzylinder“, „Schutzbeschlag“, „Schließblech“, „Zusatzschloss“, „Bandseite“. Zeilenabstand gleichmäßig, senkrecht mittig.
   - Führungslinien (`stroke-area`, `LINIE`) verbinden jede Marke waagerecht mit ihrer Legendenzeile (Pfad mit höchstens einem Knick), gezeichnet mit `sm24-draw`.
3. Parameter (über `parameter()`, `wert()`, `auswahl()`):
   - `fokus`: `alle` (Standard) · `zylinder` · `beschlag` · `schliessblech` · `zusatzschloss` · `bandseite`. Bei einem einzelnen Fokus: die zugehörige Marke, Legendenzeile und Führungslinie bleiben, die übrigen vier Marken, Zeilen und Linien bekommen die zusätzliche Klasse `opacity-30`, und das Bauteil selbst wird mit `fill-area-soft stroke-area-strong` hervorgehoben.
   - `nummern`: `true` (Standard) · `false` → ohne Marken und Legende, nur Tür und Bauteile (für kleine Flächen). Booleans auch als Text `'false'`/`'nein'` akzeptieren.
4. Titel: `titel(title, 'Schutzpunkte einer Tür')`; bei Fokus ohne eigenen Titel „Schutzpunkte einer Tür – Schließzylinder“ usw.
5. Kopfkommentar wie bei den anderen Generatoren (Zweck, `params:`-Liste).
6. Tests in `tuer-schutz.test.tsx`, mindestens 8 Fälle: Vertrag mit Standardwerten (`viewBox="0 0 480 300"`, `role="img"`, `<title>` zuerst, keine `id`, keine Hex-Farbe, kein `rgb(`, kein `<marker`, kein `NaN|undefined`) · genau 5 Marken und 5 Legendenzeilen in der Standardansicht · jeder Fokus erzeugt eine eigene Ausgabe und genau 4 Elementgruppen mit `opacity-30` je Art (Marke, Zeile, Linie) · `nummern: false` ohne Legende und ohne `sm24-pop` · Unsinnswerte (`null`, `42`, `[]`, `{ fokus: 7 }`, `{ fokus: 'tür' }`, `{ nummern: 'vielleicht' }`) werfen nicht und erfüllen den Vertrag · leerer Titel → Ersatztitel · gleiche Eingabe → gleiche Ausgabe · höchstens 5 Elemente mit `sm24-pop`.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx vitest run src/components/visual/generators/tuer-schutz.test.tsx` grün (Zahl nennen); `npx eslint` beider Dateien und `npx tsc --noEmit` ohne Fehler.
- Bild: Schreibe mit einem Hilfsskript unter `/tmp` (nicht im Repo) `renderToStaticMarkup(<TuerSchutzGrafik params={{}} title="" />)` und eine Variante mit `fokus: 'schliessblech'` in eine HTML-Datei, die `http://localhost:3000/_next/static/css/…` nicht braucht: Setze dafür in einem `<style>` nur für die Vorschau einfache Ersatzfarben (z. B. `.stroke-foreground{stroke:#1f2937}`). Mache mit `node _werkstatt/werkzeuge/bild.mjs` **nicht**, sondern mit einem kleinen Playwright-Aufruf (`playwright-core` aus `_werkstatt/werkzeuge/node_modules`, Chromium aus `_werkstatt/werkzeuge/lib.mjs` → `CHROMIUM`) zwei PNG nach `/root/sm24-bilder/E2-GRAFIKER-03/`. Prüfe selbst: Nichts überlappt, Ziffern sind mittig, Legende passt in die viewBox.
- Zähle: 5 Marken, 5 Legendenzeilen, 6 Fokuswerte, mindestens 8 Tests.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (exakt: Registry-Eintrag und `NAMEN`-Eintrag, README-Abschnitt als fertiger Text) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-GRAFIKER-03 · BEREIT ZUR RÜCKGABE ===
