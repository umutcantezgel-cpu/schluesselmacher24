# E2-PRUEFER-03 · Ergebnis nach Prüfstufe A und B (Schritte 8 und 9)

Basis: Protokolle `_werkstatt/protokolle/E2-PRUEFER-03-*` (Schritte 1 bis 7, vorhanden) und die Funktionsliste aus Schritt 8 (Lauf 2026-10-16 04:28:59 UTC, Server `http://localhost:3000`). Vergleichswerte: `E0-PRUEFER-05-ausgangswerte.md` (E0), `E2-PRUEFER-01-ergebnis.md` (Anlauf 1). Keine neue Messung, kein Build, keine Typprüfung und kein Linter in diesem Schritt. Die Messwerte stammen aus den Protokollen; nichts ist gedeutet.

Umfang: Messung, Konsole, Zugänglichkeit, Bildsatz und reduzierte Bewegung wurden für die Route `/` (H01-start) gefahren. E0 und Anlauf 1 haben je 12 Ansichten. Die Vergleiche in den Tabellen unten sind deshalb H01 gegen H01.

Sperre: `/tmp/sm24-messfenster.lock` bestand bei Beginn nicht und besteht nicht. Ich habe sie weder gesetzt noch gelöscht.

## Tabelle 1 · Prüfung · E0 · Anlauf 1 · jetzt · Beleg

| Prüfung | E0 | Anlauf 1 | jetzt | Beleg |
|---|---|---|---|---|
| Typprüfung `tsc --noEmit` | 0 Fehler | 0 Fehler (Protokoll 0 Byte) | Protokoll 0 Byte, kein Fehlertext; Exit-Code nicht protokolliert | `E2-PRUEFER-03-typecheck.log` |
| Linter `eslint .` | 0 Fehler, 0 Warnungen | 0 Fehler, 0 Warnungen (Protokoll 0 Byte) | Protokoll 0 Byte; Exit-Code nicht protokolliert | `E2-PRUEFER-03-lint.log` |
| Build `SM24_DATA=json next build` | 198/198 Seiten; `.next/BUILD_ID` m-Nz5gJdEPI0m_fmJdMHt | 198/198 Seiten; jC9qdfvEhgdhFpmNWKmBM | „Compiled successfully“, 198/198 Seiten in 3,3 s; keine Fehlerzeile; `.next/BUILD_ID` Q4YKI77MEJWhBDCvJ-7hU | `E2-PRUEFER-03-build.log`, `/home/user/schluesselmacher24/.next/BUILD_ID` |
| Unit `vitest run`: Dateien | 31/31 | 44/44 | 45/45 | `E2-PRUEFER-03-test-unit.log` |
| Unit: Tests | 680/680 | 983/983 | 1002/1002 | `E2-PRUEFER-03-test-unit.log` |
| DB-Tests: Dateien | 7/7 | 7/7 | 7/7 | `E2-PRUEFER-03-test-db.log` |
| DB-Tests: Tests | 52/52 | 52/52 | 52/52 (Nutzer im Protokoll nicht vermerkt) | `E2-PRUEFER-03-test-db.log` |
| Logikwächter | kein E0-Wert | 15 Dateien, 0 abweichend | 15 Dateien, 0 abweichend (Basis b49fe04) | `E2-PRUEFER-03-logik.log` |
| Textabzug Rechtsseiten | kein E0-Wert | 6 Seiten gleich | 6 Seiten gleich | `E2-PRUEFER-03-textabzug.log` |
| Funktionsliste F-01 bis F-14 | 14/14 (Port 3100) | 14/14 (Port 3000) | 14/14 (Port 3000); keine NICHT BESTANDEN, daher keine `--nur`-Wiederholung; Serverlog neu 0 Zeichen, keine Treffer für Vorgang, Anfrage oder POST | `E2-PRUEFER-03-funktionsliste.log`, `funktionsliste-2026-10-16_06-29-50.md` |
| Konsole H01 Desktop: Konsolenfehler / Warnungen / Seitenfehler | 0 / 0 / 0 | 0 / 0 / 0 (alle 12 Ansichten) | 0 / 0 / 0 | `E2-PRUEFER-03-konsole.log` |
| Konsole H01 Desktop: fehlgeschlagene Anfragen | 0 | 2 | 2 (`net::ERR_ABORTED` auf `/autoschluessel/anfrage?_rsc=…`) | `E2-PRUEFER-03-konsole.log`, `E2-PRUEFER-01-ergebnis.md` Tabelle C |
| Bildsatz H01: Seitenüberlauf (mobil / Tablet / Desktop) | nein / nein / nein | nein / nein / nein | nein / nein / nein | `E2-PRUEFER-03-bildsatz.log` |
| Bildsatz H01: Befunde „über den rechten Rand“ (mobil / Tablet / Desktop) | 0 / 0 / 0 | 4 / 3 / 2 (11 / 7 / 7 Ausschnitte) | 47 / 4 / 2 (10 / 7 / 7 Ausschnitte) | `E2-PRUEFER-03-bildsatz.log`, `bildsatz-2026-10-16_06-18-08.json` |
| axe H01 mobil: Verstöße (ernst/kritisch), Stellen | 1 (1/0), 2 Stellen (`target-size`) | 0, 0 Stellen | 1 (1/0), 1 Stelle (`color-contrast`, `.eyebrow > .tabular-nums.text-foreground-subtle`) | `E2-PRUEFER-03-a11y.log`, `a11y-2026-10-16_06-18-43.json` |
| axe H01 Desktop: Verstöße (ernst/kritisch), Stellen | 1 (1/0), 2 Stellen (`target-size`) | 0, 0 Stellen | 1 (1/0), 1 Stelle (`color-contrast`, gleicher Selektor) | `E2-PRUEFER-03-a11y.log`, `a11y-2026-10-16_06-18-43.json` |
| LCP mobil, Median (Spanne), ms | 996 (996–1028) | 1024 (932–1040) | 1020 (1016–1056) | `E2-PRUEFER-03-messung.log`, `messung-2026-10-16_06-19-51.json` |
| CLS mobil, Median (Spanne) | 0,000 | 0,000 | 0,000 (0,000–0,000) | wie oben |
| INP mobil, Median (Spanne), ms | 56 (56–88) | 80 (56–80) | 96 (80–112) | wie oben |
| JS-KB mobil, Median (Spanne) | 246,3 | 293,0 (274,4–293,0) | 298,1 (291,0–298,1) | wie oben |
| Gesamt-KB mobil, Median (Spanne) | nicht gemessen | nicht gemessen | 632,4 (620,9–632,4) | wie oben |
| LCP Desktop, Median (Spanne), ms | 164 (124–168) | 148 (104–152) | 148 (132–148) | `E2-PRUEFER-03-messung.log` |
| CLS Desktop, Median (Spanne) | 0,000 | 0,000 | 0,000 (0,000–0,000) | wie oben |
| INP Desktop, Median (Spanne), ms | nicht bewertet | nicht bewertet | 32 (32–32) | wie oben |
| Leistung: Budget am Median (LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms) | eingehalten | eingehalten | eingehalten (mobil und Desktop) | wie oben |
| Bewegung reduziert H01: laufende Animationen / Befunde / verborgen | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | `E2-PRUEFER-03-bewegung-reduziert.log`, `bewegung-reduziert-2026-10-16_06-18-49.json` |
| Bewegung reduziert H01: Textelemente geprüft (Abdeckung, nicht bewertet) | 2.058 (12 Ansichten) | 155 / 201 (zwei Geräte) | 203 (ein Wert, Gerät nicht getrennt) | wie oben |
| Bewegung Bildrate Fräsbahn: gezeichnet, verworfen, Anteil (Schwelle 5 %) | kein E0-Wert | 97, 0, 0,0 % | 109, 0, 0,0 % (innerhalb Schwelle) | `E2-PRUEFER-03-bildrate.log`, `bewegung-bildrate-2026-10-16_06-18-53.json` |
| Bewegung Einzelbilder je Gerät | kein E0-Wert | 4 Läufe, je 5 Bilder | 2 Läufe (Desktop, mobil), je 5 Bilder bei 0 bis 1600 ms, 6 Animationen, `[data-motion]` auf `play` | `E2-PRUEFER-03-bewegung-einzelbilder-desktop.log`, `…-mobil.log` |
| Freie Werte (Wertesuche): ohne Ausnahmen / Ausnahmen | 707 / 10 (196 Dateien seit b49fe04) | 1 / 8 (91 Dateien seit fcbcfb2) | 5 / 8 (106 Dateien seit fcbcfb2) | `E2-PRUEFER-03-werte.json`, `E2-PRUEFER-03-werte.log`; E0 nicht vergleichbar (anderer Umfang) |

## Tabelle 2 · Funde der Wertesuche (`--seit fcbcfb2`, 106 Dateien)

| Datei | Zeile | Kategorie | Fund | Gegenüber Anlauf 1 |
|---|---|---|---|---|
| `src/app/(site)/layout.tsx` | 63 | Hex-Farbe | `#f7f9fb` | gleich |
| `src/components/flow/flow-shell.tsx` | 165 | style mit Zahl und px/rem | `calc(1rem + env(safe-area-inset-bottom))` | neu (in Anlauf 1 nicht gelistet) |
| `src/components/forms/controls.tsx` | 66 | style mit Zahl und px/rem | `url("data:image/svg+xml;…")` | neu |
| `src/components/forms/photo-upload.tsx` | 102 | Hex-Farbe | `#fff` | neu |
| `src/components/ui/info-tip.tsx` | 48 | Tailwind-Klasse mit `[]` | `w-[min(20rem,calc(100vw-3rem))]` | neu |

Ausnahmen (Bildinhalte): 8 Treffer, wie in Anlauf 1, in `src/components/visual/generators/` (`profilschnitt`, `schliessplan`, `stiftzuhaltung`, `tuer-schutz`, je Test-Datei zwei Farbfunktionen).

## Tabelle 3 · Funktionsliste F-01 bis F-14 (Schritt 8)

| F-Nr. | Ergebnis jetzt |
|---|---|
| F-01 bis F-14 | alle BESTANDEN (14 von 14) |

Einzelbegründungen stehen in `E2-PRUEFER-03-funktionsliste.log`. Keine Wiederholung nötig.

## Offene Hinweise zum Verfahren (nur melden)

1. H01 mobil und Desktop: axe 0 Verstöße in Anlauf 1, jetzt je 1 ernst `color-contrast` an derselben Stelle. Ursache nicht untersucht.
2. Bildsatz H01 mobil: 47 Befunde „über den rechten Rand“ (Ziele u. a. `svg.block > path.stroke-area-muted40` in `div.lgcol-span-6`), gegenüber 4 in Anlauf 1 und 0 in E0. Seitenüberlauf ist in allen Geräten „nein“.
3. Einzelbilder: Auftrag Schritt 5 nennt 10 Einzelbilder je Gerät. Die Protokolle zeigen je Gerät 5 Bilder (0 bis 1600 ms in 400-ms-Schritten). Die Bilder selbst sind nicht Teil dieses Schritts.
4. Typprüfung und Linter: Protokolle sind 0 Byte, Exit-Codes fehlen. Erfolg ist nur aus leerer Ausgabe ableitbar.
5. Build-Gate (Schritt 2: Status 200 für `/`, 404 für `/gibt-es-nicht-pruefung`, fehlender Text „Hinweis für die Redaktion“): nicht Teil dieses Auftrags und hier nicht geprüft.
6. `.next/BUILD_ID` hat sich gegenüber Anlauf 1 geändert (jC9qdfvEhgdhFpmNWKmBM zu Q4YKI77MEJWhBDCvJ-7hU). Für die Vergleiche gilt der Build aus dem Protokoll.

=== ENDE E2-PRUEFER-03-ergebnis ===
