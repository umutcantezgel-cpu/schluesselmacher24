E2-GRAFIKER-01 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.1 · Schreibrechte (exakt, alle neu): `src/components/visual/glyphen/zuruecksetzen.tsx`, `src/components/visual/glyphen/papierkorb.tsx`, `src/components/visual/glyphen/filter.tsx`, `src/components/visual/glyphen/speichern.tsx`, `src/components/visual/glyphen/bild-fehlt.tsx`, `src/components/visual/glyphen/bild-hochladen.tsx`, `src/components/visual/glyphen/kamera.tsx`, `src/components/visual/glyphen/pruefsiegel.tsx`, `src/components/visual/glyphen/waage.tsx`, `src/components/visual/glyphen/schluessel.tsx`, `src/components/visual/glyphen/ort.tsx`, `src/components/visual/glyphen/kalender.tsx`, `src/components/visual/glyphen/uhr.tsx` · Umfang: 13 UI-Glyphen der SM24-Icon-Familie

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen; reduzierte Bewegung vergessen; uneinheitliche Strichstärken. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Zeichne 13 einfarbige UI-Glyphen im 48er-Raster nach dem Muster der vorhandenen Glyphen, damit sie die lucide-Icons der Website ersetzen können.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.1, unveränderlich)
- K-008: Eine Icon-Familie über die gemeinsame `IconBase` (`src/components/visual/icons/icon-base.tsx`).
  - Raster 48 × 48, Kontur `currentColor`, runde Enden und Ecken, einheitlicher Bildschirmstrich über `data-sm24-icon`. Den setzt `IconBase`; du setzt **nie** `strokeWidth`.
  - UI-Glyphen sind **einfarbig**: keine `className` an Formen, keine Füllungen außer `fill="none"` (Standard), keine Zweitonfläche.
  - Keine `id`, keine Texte, keine Farben, keine Masken, keine Verläufe.
  - Formen nur als `<path>` mit **absoluten** Befehlen `M L H V A Z` (keine Kleinbuchstaben, keine Kurven `C/Q/S`) und als `<circle cx cy r>`. Ein Punkt ist ein Pfad der Länge 0,1, z. B. `M24 32.5V32.6`.
  - Mindestabstand 3 Einheiten zum Rand: Alle Koordinaten und Kreisränder liegen zwischen 3 und 45.
  - Lesbar ab 16 px: wenige, klare Formen, keine Details unter 4 Einheiten Abstand.
- Formensprache der Familie: geometrisch, ruhig, leicht technisch (Werkstattzeichnung). Rechtecke mit Ecken über `L`-Züge (runde Ecken entstehen durch `strokeLinejoin`), Kreise für Köpfe und Linsen, Bögen über `A`.

## Maßstab
Muster, genau so aufbauen (lies sie zuerst): `src/components/visual/glyphen/pfeil-rechts.tsx`, `haken-kreis.tsx`, `warnung.tsx`, `info.tsx`, `suche.tsx`, `laden.tsx`, `menue.tsx`. Vertrag: `src/components/visual/glyphen/glyphen.test.tsx` (findet neue Dateien selbst, keine Liste zu pflegen). Familienmerkmale zum Abgleich: Fach-Icons in `src/components/visual/icons/` (z. B. `warenkorb.tsx`, `termin.tsx`, `standort.tsx`) – Glyphen sind deren einfarbige, vereinfachte Geschwister.

## Grenzen
Nur die neuen Dateien aus den Schreibrechten. Keine bestehende Datei ändern, auch nicht den Test. Ein anderer Grafiker legt gleichzeitig andere Glyphen in demselben Ordner an – deren Dateien nicht anfassen.

## Schritte
1. Lies die Musterdateien und den Vertragstest vollständig.
2. Lege diese 13 Dateien an (Dateiname → Export → Motiv):

| Datei | Export | Motiv |
|---|---|---|
| `zuruecksetzen.tsx` | `GlyphZuruecksetzen` | Zurücksetzen (lucide RotateCcw): Kreisbogen gegen den Uhrzeigersinn mit Pfeilspitze oben links |
| `papierkorb.tsx` | `GlyphPapierkorb` | Papierkorb (Trash2): Deckel als waagerechte Linie mit Griff, Behälter leicht konisch, zwei senkrechte Rillen |
| `filter.tsx` | `GlyphFilter` | Filter (SlidersHorizontal): drei waagerechte Schienen mit je einem kleinen Kreis als Regler an versetzter Stelle |
| `speichern.tsx` | `GlyphSpeichern` | Speichern (Save): Diskette als Rechteck mit abgeschrägter Ecke oben rechts, Etikett unten, Schieber oben |
| `bild-fehlt.tsx` | `GlyphBildFehlt` | Bild fehlt (ImageOff): Bildrahmen mit Bergkontur und Sonne, diagonal durchgestrichen |
| `bild-hochladen.tsx` | `GlyphBildHochladen` | Bild hochladen (ImageUp): Bildrahmen mit Bergkontur, Pfeil nach oben aus der rechten oberen Ecke |
| `kamera.tsx` | `GlyphKamera` | Kamera (Camera): Gehäuse mit Sucheraufbau oben, Objektiv als Kreis mittig |
| `pruefsiegel.tsx` | `GlyphPruefsiegel` | Prüfsiegel (BadgeCheck/ShieldCheck): Schild mit spitzem unteren Ende und Haken darin |
| `waage.tsx` | `GlyphWaage` | Waage (Scale): senkrechte Säule, waagerechter Balken, zwei Schalen als flache Bögen |
| `schluessel.tsx` | `GlyphSchluessel` | Schlüssel (KeyRound): runder Schlüsselkopf links mit Loch, Halm nach rechts mit zwei kurzen Bartstufen nach unten – Seitenansicht wie im Generator `schluessel` |
| `ort.tsx` | `GlyphOrt` | Ort (MapPin): Tropfenform mit Kreis innen |
| `kalender.tsx` | `GlyphKalender` | Kalender (CalendarClock/Check/Search): Blatt mit zwei Aufhängeringen oben, Kopfzeile als Linie, darunter 2×3 Punkte (als kurze Striche mit runden Enden) |
| `uhr.tsx` | `GlyphUhr` | Uhr (Clock): Kreis mit Zeigern auf 12 und 3 Uhr |

3. Jede Datei folgt exakt dem Muster: Import `{ IconBase, type IconProps } from '../icons/icon-base'`, eine JSDoc-Zeile mit Motiv und Einsatz, `export function Glyph… ({ size = 20, ...props }: IconProps)`, Formen als Kinder von `IconBase`.
4. Zeichne sorgfältig: Mittelachse bei 24, optisches Gewicht wie `suche.tsx` (Hauptform etwa 26–34 Einheiten groß).

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx vitest run src/components/visual/glyphen` grün; nenne die Zahl der Tests. Schlägt ein Test für eine fremde Datei fehl, melde ihn, statt ihn zu beheben.
- `npx eslint src/components/visual/glyphen` und `npx tsc --noEmit` ohne Fehler.
- Bild: Erzeuge mit einem Skript unter `/tmp` (nicht im Repo) eine HTML-Seite, die alle Glyphen des Ordners per `renderToStaticMarkup` in drei Größen (16, 20, 32 px) in einem Raster zeigt (`color:#1f2937`, dazu im `<style>` nur für die Vorschau `[data-sm24-icon]{stroke-width:1.75px} [data-sm24-icon] *{vector-effect:non-scaling-stroke}`), und fotografiere sie mit `playwright-core` aus `_werkstatt/werkzeuge/node_modules` (Chromium-Pfad aus `_werkstatt/werkzeuge/lib.mjs` → `CHROMIUM`) nach `/root/sm24-bilder/E2-GRAFIKER-01/glyphen.png`. Sieh dir das Bild an: Jeder Glyph ist bei 16 px erkennbar, keiner wirkt schwerer oder leichter als die Muster.
- Zähle: 13 Dateien, 13 Exporte.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-GRAFIKER-01 · BEREIT ZUR RÜCKGABE ===
