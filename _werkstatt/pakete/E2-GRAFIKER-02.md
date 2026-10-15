E2-GRAFIKER-02 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.1 · Schreibrechte (exakt, alle neu): `src/components/visual/glyphen/gebaeude.tsx`, `src/components/visual/glyphen/personen.tsx`, `src/components/visual/glyphen/lineal.tsx`, `src/components/visual/glyphen/hilfe.tsx`, `src/components/visual/glyphen/warenkorb.tsx`, `src/components/visual/glyphen/telefon.tsx`, `src/components/visual/glyphen/mail.tsx`, `src/components/visual/glyphen/nachricht.tsx`, `src/components/visual/glyphen/dokument.tsx`, `src/components/visual/glyphen/raute.tsx`, `src/components/visual/glyphen/rechner.tsx`, `src/components/visual/glyphen/verbot.tsx` · Umfang: 12 UI-Glyphen der SM24-Icon-Familie

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen; reduzierte Bewegung vergessen; uneinheitliche Strichstärken. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Zeichne 12 einfarbige UI-Glyphen im 48er-Raster nach dem Muster der vorhandenen Glyphen, damit sie die lucide-Icons der Website ersetzen können.

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
2. Lege diese 12 Dateien an (Dateiname → Export → Motiv):

| Datei | Export | Motiv |
|---|---|---|
| `gebaeude.tsx` | `GlyphGebaeude` | Gebäude (Building2): Hochhaus-Rechteck mit 3×2 Fensterstrichen und Tür unten mittig, Grundlinie |
| `personen.tsx` | `GlyphPersonen` | Personen (Users/UserCog): zwei Personen, vordere größer (Kopf als Kreis, Schultern als Bogen), hintere versetzt rechts dahinter |
| `lineal.tsx` | `GlyphLineal` | Lineal (Ruler): schräg gelegtes Rechteck mit fünf Teilstrichen abwechselnd lang und kurz |
| `hilfe.tsx` | `GlyphHilfe` | Hilfe (LifeBuoy): Rettungsring – zwei konzentrische Kreise mit vier kurzen Verbindungen |
| `warenkorb.tsx` | `GlyphWarenkorb` | Warenkorb (ShoppingBag/ShoppingCart): Tasche mit Henkel als Bogen oben, Körper leicht trapezförmig |
| `telefon.tsx` | `GlyphTelefon` | Telefon (Phone): Hörer als geschwungene Form, schräg |
| `mail.tsx` | `GlyphMail` | Mail (Mail): Umschlag als Rechteck mit V-förmiger Klappe |
| `nachricht.tsx` | `GlyphNachricht` | Nachricht (MessageSquare): Sprechblase als abgerundetes Rechteck mit Ecke unten links |
| `dokument.tsx` | `GlyphDokument` | Dokument (FileText): Blatt mit Eselsohr oben rechts, drei Textzeilen |
| `raute.tsx` | `GlyphRaute` | Raute/Nummer (Hash): zwei senkrechte, leicht schräge Striche und zwei waagerechte Striche |
| `rechner.tsx` | `GlyphRechner` | Rechner (Calculator): Gehäuse als Rechteck, Anzeige oben, 3×2 Tasten als kurze Striche |
| `verbot.tsx` | `GlyphVerbot` | Verbot (Ban): Kreis mit diagonalem Strich von links oben nach rechts unten |

3. Jede Datei folgt exakt dem Muster: Import `{ IconBase, type IconProps } from '../icons/icon-base'`, eine JSDoc-Zeile mit Motiv und Einsatz, `export function Glyph… ({ size = 20, ...props }: IconProps)`, Formen als Kinder von `IconBase`.
4. Zeichne sorgfältig: Mittelachse bei 24, optisches Gewicht wie `suche.tsx` (Hauptform etwa 26–34 Einheiten groß).

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx vitest run src/components/visual/glyphen` grün; nenne die Zahl der Tests. Schlägt ein Test für eine fremde Datei fehl, melde ihn, statt ihn zu beheben.
- `npx eslint src/components/visual/glyphen` und `npx tsc --noEmit` ohne Fehler.
- Bild: Erzeuge mit einem Skript unter `/tmp` (nicht im Repo) eine HTML-Seite, die alle Glyphen des Ordners per `renderToStaticMarkup` in drei Größen (16, 20, 32 px) in einem Raster zeigt (`color:#1f2937`, dazu im `<style>` nur für die Vorschau `[data-sm24-icon]{stroke-width:1.75px} [data-sm24-icon] *{vector-effect:non-scaling-stroke}`), und fotografiere sie mit `playwright-core` aus `_werkstatt/werkzeuge/node_modules` (Chromium-Pfad aus `_werkstatt/werkzeuge/lib.mjs` → `CHROMIUM`) nach `/root/sm24-bilder/E2-GRAFIKER-02/glyphen.png`. Sieh dir das Bild an: Jeder Glyph ist bei 16 px erkennbar, keiner wirkt schwerer oder leichter als die Muster.
- Zähle: 12 Dateien, 12 Exporte.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-GRAFIKER-02 · BEREIT ZUR RÜCKGABE ===
