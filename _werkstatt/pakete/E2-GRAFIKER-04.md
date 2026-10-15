E2-GRAFIKER-04 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 0 (Formsystem-Auszug unten) · Schreibrechte (exakt): `src/components/visual/generators/schliessplan.tsx`, `src/components/visual/generators/schliessplan.test.tsx` · Umfang: Generator `schliessplan` um eine Markierung erweitern (Grundlage des interaktiven Schließplans)

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen; reduzierte Bewegung vergessen; uneinheitliche Strichstärken. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Erweitere `SchliessplanGrafik` um die Parameter `markiert` und `tuer`, die einen Schlüssel samt allen Türen, die er schließt (oder eine Tür samt allen Schlüsseln, die sie öffnen), hervorheben und alles andere zurücknehmen, und exportiere eine Liste der wählbaren Schlüssel.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (unveränderlich)
- K-008 Formsystem: Generatoren sind reines SVG, deterministisch, werfen nie; keine `id`, keine festen Farben, keine `<marker>`; Farben nur über Tailwind-Klassen (`stroke-area`, `stroke-area-strong`, `stroke-area-muted`, `fill-area-soft`, `fill-area-muted`, `fill-surface`, `stroke-foreground`, `fill-foreground-muted`); Strichstärken nur aus `grafik-basis.tsx` (`KONTUR`, `LINIE`, `HILFSLINIE`) oder deren Summen wie im Bestand.
- K-007 Bewegung: Die Einstiegsbewegung (`sm24-pop`, `sm24-draw`) bleibt unverändert. Der Wechsel der Markierung ist ein Zustandswechsel: nur `opacity` und Farbe, Übergang über die Tailwind-Klassen `transition-opacity` bzw. `transition-colors` und `motion-reduce:transition-none`. Keine neue Animation.
- Vertrag aus `src/components/visual/README.md`, Abschnitt „Grafik-Generatoren“.

## Maßstab
Muster: der bestehende Code in `schliessplan.tsx` (Aufbau, Benennung, Kommentare) und die Tests in `schliessplan.test.tsx` (`pruefeVertrag`, `kuerzel`, `tueren`).

## Grenzen
- Nur die zwei Dateien der Schreibrechte. `registry.tsx`, `grafik-basis.tsx`, README und andere Generatoren bleiben unverändert.
- **Ohne die neuen Parameter muss die Ausgabe byte-gleich zum heutigen Stand bleiben** (alle bestehenden Tests unverändert grün; keine bestehende Assertion ändern oder löschen).
- Hervorhebung nur über Klassen und Strichstärken an den **vorhandenen** Elementen; keine zusätzlichen `rect` mit `rx="2.5"`, keine zusätzlichen `<text>`-Knoten mit Großbuchstaben, keine zusätzlichen Elemente mit `class="sm24-draw stroke-area"` (bestehende Zählungen in Tests).

## Schritte
1. Lies `schliessplan.tsx`, `schliessplan.test.tsx`, `grafik-basis.tsx` und `src/components/visual/README.md` vollständig.
2. Gib jedem Knoten beim Auslegen eine stabile Kennung `kennung: string` und jedem Schlüsselknoten die Menge der Türen, die er schließt:
   - Wurzelschlüssel (GHS, HS, oder der unbeschriftete Schlüssel der Gleichschließung): `wurzel`
   - HGS unter dem GHS: `g1`…`g4` (von links); GS darunter: `g1.1`, `g1.2` …
   - ES-Schlüssel: `e1`…`e8` (von links)
   - Türen: `t1`…`t8` (von links); Zentraltüren der Zentralschlossanlage: `z1`, `z2`
   - Ein Schlüssel schließt alle Türen in seinem Teilbaum. Sonderfall `zentral`: ES `eN` schließt `tN`, `z1` und `z2`.
3. Neue Parameter (beide optional, über `wert()` und `auswahl()`/eigene Prüfung gelesen, unbekannte Werte = keine Markierung):
   - `markiert`: Kennung eines Schlüssels (`wurzel`, `g1`, `g1.1`, `e3` …). Hervorgehoben werden dieser Schlüssel, alle Türen, die er schließt, und alle Kanten auf den Wegen dazwischen.
   - `tuer`: Kennung einer Tür (`t3`, `z1`). Hervorgehoben werden diese Tür, alle Schlüssel, die sie öffnen (bei `z1`/`z2` alle ES), und die Kanten dazwischen. `markiert` hat Vorrang, wenn beide gesetzt sind.
4. Darstellung bei aktiver Markierung:
   - Hervorgehobene Kanten: Klasse `sm24-draw stroke-area-strong transition-colors motion-reduce:transition-none`, `strokeWidth={KONTUR}`.
   - Nicht hervorgehobene Kanten: `sm24-draw stroke-area-muted transition-colors motion-reduce:transition-none`, `strokeWidth={LINIE}`.
   - Hervorgehobene Schlüssel- und Türknoten: die äußere `<g>` bekommt zusätzlich `transition-opacity motion-reduce:transition-none`; das Türrechteck `fill-area-soft stroke-area-strong` statt `fill-surface stroke-foreground`.
   - Nicht hervorgehobene Knoten: äußere `<g>` mit zusätzlich `opacity-30 transition-opacity motion-reduce:transition-none`.
   - Die Grafik meldet die Markierung im `<title>`: Wenn `title` leer oder fehlend ist, ergänze den Standardtitel um „ – markiert: <Kürzel oder Tür n>“ (z. B. „Schließplan Hauptschlüsselanlage – markiert: ES 3“). Ein übergebener `title` bleibt unverändert.
5. Exportiere zusätzlich aus `schliessplan.tsx` die reine Funktion `schliessplanSchluessel(params: unknown): { kennung: string; kuerzel: string; tueren: string[] }[]` – alle Schlüssel des Plans in der Reihenfolge von oben nach unten, links nach rechts, mit Kürzel („GHS“, „HGS 1“, „GS 1.2“, „HS“, „ES 3“, beim unbeschrifteten Schlüssel der Gleichschließung „Schlüssel“) und den Kennungen der Türen, die er schließt. Gleiche Parameterlogik wie die Grafik (dieselbe interne Planfunktion verwenden, nicht duplizieren).
6. Neue Tests in `schliessplan.test.tsx` (bestehende Tests nicht anfassen), mindestens 8:
   - `markiert: 'e2'` bei `haupt`, 4 Türen: genau 1 Tür mit `fill-area-soft`, genau 2 hervorgehobene Kanten (`stroke-area-strong` an `sm24-draw`-Pfaden), `pruefeVertrag` erfüllt, `tueren(html)` weiterhin 4.
   - `markiert: 'wurzel'` bei `haupt`: alle 4 Türen hervorgehoben, keine Klasse `opacity-30` an Türen.
   - `markiert: 'g1'` bei `generalhaupt`, `gruppen: 2`, `tueren: 4`: genau die Türen der ersten Hauptgruppe hervorgehoben.
   - `tuer: 't3'` bei `haupt`: Tür 3, ES 3 und HS hervorgehoben (Zahl der Knoten ohne `opacity-30` = 3).
   - `zentral` mit `markiert: 'e1'`: Tür `t1` und beide Zentraltüren hervorgehoben.
   - Unbekannte Werte (`markiert: 'x9'`, `tuer: 42`, `markiert: ['e1']`) → Ausgabe identisch zur Ausgabe ohne Parameter.
   - Ohne neue Parameter: Ausgabe enthält weder `opacity-30` noch `fill-area-soft`.
   - `schliessplanSchluessel({ system: 'generalhaupt', gruppen: 2, tueren: 4 })` liefert GHS zuerst, enthält „HGS 1“, „HGS 2“, und jede Tür kommt bei genau einem ES vor; Gleichschließung liefert genau einen Eintrag „Schlüssel“ mit allen Türen.
   - Determinismus: gleiche Eingabe → gleiche Ausgabe.
7. Kommentar am Funktionskopf (`params:`-Liste) um die beiden Parameter ergänzen.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx vitest run src/components/visual/generators/schliessplan.test.tsx src/components/visual/registry.test.tsx` grün (alte und neue Fälle; Zahlen nennen).
- `npx eslint src/components/visual/generators/schliessplan.tsx src/components/visual/generators/schliessplan.test.tsx` und `npx tsc --noEmit` ohne Fehler.
- Bild: Rendere mit einem kurzen Node-Skript unter `/tmp` (nicht im Repo) `renderToStaticMarkup` für `{system:'generalhaupt', markiert:'g1'}` in eine HTML-Datei unter `/root/sm24-bilder/E2-GRAFIKER-04/` – ein Bildschirmfoto ist nicht nötig, die HTML-Datei genügt als Beleg.
- Zähle: 8 neue Testfälle, 2 neue Parameter, 1 neuer Export.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste, z. B. README-Zeilen) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-GRAFIKER-04 · BEREIT ZUR RÜCKGABE ===
