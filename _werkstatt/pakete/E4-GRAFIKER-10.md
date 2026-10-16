E4-GRAFIKER-10 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.10 · Schreibrechte (exakt): `src/components/visual/generators/ablauf.tsx` (neu), `src/components/visual/generators/ablauf.test.tsx` (neu) · Umfang: neuer Generator `ablauf` – eine Folge von zwei bis vier Schritten als bemaßte Werkstattzeichnung, breit und schmal

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen, reduzierte Bewegung vergessen, uneinheitliche Strichstärken, bestehende Verträge brechen. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Baue den Generator `AblaufGrafik`: zwei bis vier nummerierte Stationen auf einer Bemaßungslinie mit kurzer Mono-Beschriftung („01 sichern → 02 prüfen → 03 bestellen“), als Fläche 480 × 270 (`breit`) und als senkrechte Fassung für Telefone (`schmal`).

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.10, unveränderlich)
- **Leitidee K-001:** saubere Werkstattzeichnung – helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift. Keine Verläufe, kein Glas, keine Leuchtkugeln, keine Schatten in Grafiken.
- **Formsystem K-008:** Striche nur aus der Strichskala in `generators/grafik-basis.tsx` (`DETAIL`, `HILFSLINIE`, `LINIE`, `LINIE_STARK`, `KONTUR`, `AKZENT`, `MARKE`); Schrift `SCHRIFT`/`SCHRIFT_KLEIN` oder benannte Konstanten; Farben nur über Klassen (`stroke-area`, `stroke-area-strong`, `fill-area-soft`, `stroke-border-strong`, `fill-surface`, `fill-foreground`, `fill-foreground-muted` …), nie Hex, `rgb(` oder `oklch(`; keine `id`-Attribute, keine `<marker>` (Pfeilspitzen über `pfeilspitze()` aus `grafik-basis`), Rahmen über `GrafikRahmen`, Hilfsraster über `Raster`.
- **Telefonbreiten:** Beschriftungen in Zeichnungen sind auf Telefonen mindestens etwa 11,5 px groß (Rechnung: Schriftgröße × 358 / Flächenbreite ≥ 11,5). Muster für zwei Formate: `src/components/visual/generators/zylinder-mass.tsx` (Konstante `FLAECHE` mit `breit` und `schmal`, Parameter `format`, Tests in `zylinder-mass.test.tsx`) und `schliessplan.tsx` (schmal mit Höhe nach Inhalt). Die Registry trägt der Orchestrator ein; `ImagePlaceholder` zeigt die schmale Fassung dann unter 640 px selbst.
- **Bewegung (neuer Registereintrag B-23, trägt der Orchestrator ein):** Auslöser Sichtbarkeit (die Hülle setzt `data-motion`). Die Bemaßungslinie zeichnet (`sm24-draw`, etwa 0,6 s), die Stationen erscheinen nacheinander (`sm24-pop`, Staffel höchstens 4 × 0,12 s), die Beschriftungen blenden mit ihrer Station ein (`sm24-fade`). Gesamtdauer unter 1,6 s. Verzögerungen nur über `motionStyle(verzoegerung, dauer)` aus `../motion/motion-style` (Muster `code-fundstelle.tsx`). Reduzierte Bewegung regelt `globals.css` für alle `sm24-*` – die Endlage muss ohne Animation vollständig sichtbar sein.
- **Ohne erfundene Inhalte:** Der Generator zeigt nur die übergebenen Wörter und Nummern; er erfindet keine Beschriftung. Ohne `schritte` zeigt er drei Stationen nur mit Nummern.

## Anlass (Sichtabnahme E4-L-23, H12 Ratgeber)
Auf `/ratgeber/autoschluessel-verloren-was-tun` steht als Bild ein vergrößerter Funkschlüssel ohne Bezug zum Thema. Gewünscht ist eine Ablaufgrafik aus dem vorhandenen Dreischritt der Unterzeile („erst sichern, dann prüfen, dann bestellen“): drei Marken auf einer Bemaßungslinie, Mono-Beschriftung, Strich `LINIE`, Raster 480 × 270. Die Grafik steht später im Seitenkopf (5 von 12 Spalten, etwa 400–520 px breit) und mobil über die volle Breite (etwa 358 px).

## Auftrag
1. **Datei `ablauf.tsx`**, exportiert `AblaufGrafik(props: VisualProps)` (Signatur wie die übrigen Generatoren, `import type { VisualProps } from '../registry'`), dazu die reinen Helfer `ablaufSchritte(params): string[]` (bereinigte Liste) und `ABLAUF_FLAECHE` (Maße beider Formate).
2. **Parameter** (lies sie über `parameter`, `wert`, `auswahl`, `kurztext`, `zahl` aus `grafik-basis`):
   | Parameter | Werte | Standard |
   |---|---|---|
   | `schritte` | Text, Schritte durch `|` getrennt; 2–4 Einträge, je höchstens 14 Zeichen (längere werden nicht abgeschnitten, sondern verworfen → Standard), leere Einträge entfallen | drei Stationen ohne Beschriftung |
   | `aktiv` | 0 (keine) oder 1–4: diese Station in Akzent (`stroke-area-strong`, Nummer `fill-area-strong`), alle anderen `stroke-border-strong` | `0` |
   | `format` | `breit` · `schmal` | `breit` |
3. **Zeichnung `breit` (480 × 270):** Eine waagerechte Bemaßungslinie (`LINIE`, `stroke-border-strong`) über die nutzbare Breite mit Anfangs- und Endstrich (Bemaßungsenden wie in `zylinder-mass.tsx`). Je Station eine Hilfslinie nach oben (`HILFSLINIE`, gestrichelt wie die Hilfslinien in `zylinder-mass`), ein Kreis (Radius etwa 22, `KONTUR`, `fill-surface`) mit der Nummer „01“… in Mono, darunter die Beschriftung in Mono, Kleinbuchstaben wie übergeben. Zwischen zwei Stationen eine Pfeilspitze in Laufrichtung auf der Linie (`pfeilspitze`). Stationen gleichmäßig verteilt, Ränder gleich, das Ganze vertikal mittig. Schrift: Nummer und Beschriftung so groß, dass bei 358 px Darstellungsbreite ≥ 11,5 px gilt (also mindestens 16 Einheiten in `breit`); bei vier Stationen mit 14 Zeichen dürfen sich Beschriftungen nicht überlappen (Test über eine Breitenschätzung: Zeichen × 0,6 × Schriftgröße ≤ Stationsabstand − 8).
4. **Zeichnung `schmal` (Breite 300–360, Höhe nach Anzahl):** dieselben Elemente senkrecht – Bemaßungslinie links von oben nach unten, Stationen untereinander, Beschriftung rechts neben dem Kreis, Pfeilspitzen nach unten. Schrift ≥ 11,5 px bei 358 px Darstellungsbreite.
5. **Bewegung** wie im Kern-Auszug (B-23); die Linie zeichnet zuerst, dann Station für Station.
6. **Tests `ablauf.test.tsx`** (Muster `zylinder-mass.test.tsx`, `schliessplan.test.tsx`): Rendern ohne Parameter (drei Stationen, keine Beschriftung, Nummern 01–03); mit `schritte: 'sichern|prüfen|bestellen'` (drei Beschriftungen in Reihenfolge); 2 und 4 Schritte; zu lange oder zu viele Einträge fallen auf den Standard zurück; `aktiv` färbt genau eine Station; beide Formate mit eigener `viewBox` und Mindest-Schriftgröße (Rechnung oben); alle Elemente innerhalb der Fläche; keine Überlappung der Beschriftungen bei 4 × 14 Zeichen; deterministisch (zweimal gleiche Ausgabe); keine `id`, kein `<marker>`, keine Farbwerte; Bewegungsklassen vorhanden und Gesamtverzögerung + Dauer < 1,6 s.

## Maßstab
`src/components/visual/generators/zylinder-mass.tsx` (Formate, Bemaßung, Hilfslinien), `code-fundstelle.tsx` (Bewegung mit `motionStyle`), `schliessplan.tsx` (schmal mit Höhe nach Inhalt), `grafik-basis.tsx` (Skala, Helfer), `src/components/visual/README.md` (Abschnitte der Generatoren; die README ändert der Orchestrator).

## Grenzen
- Nur die zwei neuen Dateien. Registry (`registry.tsx`, `registry.test.tsx`), README, `motiv.ts` und Seiten ändert der Orchestrator; Wünsche ins Feld GEMEINSAME DATEIEN.
- Keine neuen Abhängigkeiten, keine Helferdateien in `generators/`.
- Nie Dateien löschen. Vor `vitest` prüfen: Besteht `/tmp/sm24-messfenster.lock`, wartest du.

## Schritte
1. Lies `grafik-basis.tsx`, `zylinder-mass.tsx` samt Test, `code-fundstelle.tsx` und den Kopf von `registry.tsx` (Typ `VisualProps`).
2. `breit`, dann `schmal`, jeweils mit Tests.
3. `npx tsc --noEmit`, `npx eslint` der zwei Dateien, `npx vitest run src/components/visual` (Zahl nennen), `node _werkstatt/werkzeuge/werte-suche.mjs` der zwei Dateien.
4. Bilder: Schreibe ein kleines Skript nur unter `/root/sm24-bilder/E4-GRAFIKER-10/`, das mit `react-dom/server` die Varianten als SVG-Dateien ausgibt (ohne Parameter; `sichern|prüfen|bestellen` breit und schmal; vier Schritte mit 14 Zeichen breit und schmal; `aktiv: 2`), wandle sie mit Chromium (`/opt/pw-browsers/chromium-1194`, playwright-core aus `_werkstatt/werkzeuge`) in PNG bei 358 px und 480 px Breite und sieh sie dir an.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E4-GRAFIKER-10 · BEREIT ZUR RÜCKGABE ===
