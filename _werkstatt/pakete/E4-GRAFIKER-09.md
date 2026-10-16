E4-GRAFIKER-09 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.8 · Schreibrechte (exakt): `src/components/visual/generators/schliessplan.tsx`, `src/components/visual/generators/schliessplan.test.tsx` · Umfang: Generator `schliessplan` um Reserveplätze und ein schmales Format für Telefone erweitern

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen, reduzierte Bewegung vergessen, uneinheitliche Strichstärken, bestehende Verträge brechen. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Erweitere `SchliessplanGrafik` um den Parameter `reserve` (freie Plätze gestrichelt) und um `format: 'schmal'` (eigene, schmalere Fläche mit größerer Schrift für Telefone), ohne das Bild bestehender Aufrufe zu verändern.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.8, unveränderlich)
- **Formsystem K-008:** Striche nur aus der Strichskala in `generators/grafik-basis.tsx` (`DETAIL`, `HILFSLINIE`, `LINIE`, `LINIE_STARK`, `KONTUR`, `AKZENT`, `MARKE`); Schrift `SCHRIFT`/`SCHRIFT_KLEIN` oder benannte Konstanten; Farben nur über Klassen (`stroke-area`, `stroke-border-strong`, `fill-surface` …), nie Hex, `rgb(` oder `oklch(`; keine `id`-Attribute, keine `<marker>`.
- **Telefonbreiten (neu in 1.8):** Beschriftungen in Zeichnungen sind auf Telefonen mindestens etwa 11,5 px groß. Muster für ein schmales Format: `src/components/visual/generators/zylinder-mass.tsx` (Konstante `FLAECHE` mit `breit` und `schmal`, Parameter `format`, Tests in `zylinder-mass.test.tsx`). Die Registry (`src/components/visual/registry.tsx`, `SCHMALES_FORMAT`) trägt der Orchestrator ein; `ImagePlaceholder` zeigt die schmale Fassung dann unter 640 px selbst.
- **Bewegung (Register B-14):** Der Plan baut sich von oben nach unten auf (vorhandene `sm24-*`-Klassen und Verzögerungen). Reserveplätze erscheinen mit ihrer Ebene, ohne eigene neue Bewegung. Gesamtdauer höchstens etwa 2 s wie bisher.
- **Gestrichelt** heißt im Formsystem: verdecktes oder noch nicht vorhandenes Teil (Muster: Notschlüssel im Smart Key, `strokeDasharray="4 3"`, `stroke-border-strong`, ohne Füllung oder mit `fill-surface`).

## Anlass (Sichtabnahme E4-L-23, H08 Schließanlagen)
- „Erweiterbare Anlage“ zeigt nur einen größeren GHS-Baum; die Aussage „Plätze bleiben frei“ ist nicht gezeichnet. Gewünscht: zwei ES-Knoten und zwei Türen als Reserve, Umriss gestrichelt (`stroke-dasharray`, `stroke-border-strong`), ohne Füllung, Leitung dorthin ebenfalls gestrichelt.
- Auf 390 px sind die Kürzel HGS, GS und ES in GHS-Plänen etwa 8–9 px groß.

## Auftrag
1. **`reserve`** (ganze Zahl 0–2, Standard 0): Für `haupt` und `generalhaupt` hängt der Plan so viele zusätzliche Einzelschlüssel samt je einer Tür an (bei `generalhaupt` an die letzte Gruppe). Sie sind gestrichelt gezeichnet (Knotenumriss, Türsymbol und Leitung, `strokeDasharray="4 3"`, `stroke-border-strong`, ohne farbige Füllung), ihre Beschriftung ist „frei“ in `fill-foreground-muted` und Mono. Sie zählen nicht als wählbare Schlüssel oder Türen (`markiert`, `tuer` und die exportierten Listen bleiben unverändert). Bei `gleichschliessung` und `zentral` hat `reserve` keine Wirkung. Ohne `reserve` bleibt jede Ausgabe Zeichen für Zeichen gleich (Test: Ausgabe vorher und nachher für die bestehenden Testfälle identisch).
2. **`format: 'schmal'`** (Standard `breit`): eigene Zeichenfläche (Breite etwa 320 bis 360 Einheiten, Höhe nach Bedarf), Schrift so groß, dass bei 358 px Darstellungsbreite alle Beschriftungen mindestens 11,5 px groß sind, auch bei `generalhaupt`, 2 Gruppen, 6 Türen und `reserve: 2`. Ist das bei 8 Türen nicht erreichbar, darf das schmale Format Türen enger setzen oder die Türbeschriftung kürzen („T1“ statt „Tür 1“) – beschreibe die Wahl im Bericht. `schliessplanAusschnitt` und die exportierten Listen funktionieren für beide Formate.
3. **Tests** in `schliessplan.test.tsx` (bestehende Prüfungen bleiben, ihre Zahl sinkt nie): Reserve gezeichnet und gestrichelt; Reserve nicht wählbar; ohne `reserve` unverändert; schmales Format mit eigener `viewBox` und Mindest-Schriftgröße (Rechnung: Schriftgröße × 358 / Flächenbreite ≥ 11,5); alle Knoten innerhalb der Fläche; deterministisch.

## Maßstab
`src/components/visual/generators/schliessplan.tsx` (bestehender Aufbau, Verträge in `schliessplan.test.tsx`), `zylinder-mass.tsx` (Formate), `tuer-schutz.tsx` (Ausschnitt), `schluessel.tsx` (gestrichelter Notschlüssel), `src/components/visual/README.md` (Parameter-Tabellen; die README ändert der Orchestrator).

## Grenzen
- Nur die zwei Dateien aus den Schreibrechten. Registry, README, `system-erklaerung.tsx` und Seiten ändert der Orchestrator; Wünsche ins Feld GEMEINSAME DATEIEN.
- Bestehende Exporte, Parameter und deren Standardwerte bleiben gleich; `SchliessplanInteraktiv` (`src/components/visual/interaktiv/schliessplan-interaktiv.tsx`) muss ohne Änderung weiter funktionieren.
- Nie Dateien löschen. Vor `vitest` prüfen: Besteht `/tmp/sm24-messfenster.lock`, wartest du.

## Schritte
1. Lies den Generator vollständig, seine Tests, die Muster und den README-Abschnitt.
2. `reserve`, dann `format: 'schmal'`, jeweils mit Tests.
3. `npx tsc --noEmit`, `npx eslint` der zwei Dateien, `npx vitest run src/components/visual` (Zahl nennen), `node _werkstatt/werkzeuge/werte-suche.mjs` der zwei Dateien.
4. Bilder: Schreibe ein kleines Skript nur unter `/root/sm24-bilder/E4-GRAFIKER-09/`, das mit `react-dom/server` die Varianten als SVG-Dateien ausgibt (`generalhaupt` 2/6 ohne und mit `reserve: 2`, je breit und schmal), oder prüfe sie mit `bild.mjs` auf `http://localhost:3001/schliessanlagen` (`SM24_BASIS_URL`). Sieh dir die Bilder an.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E4-GRAFIKER-09 · BEREIT ZUR RÜCKGABE ===
