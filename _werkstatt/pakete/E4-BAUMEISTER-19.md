E4-BAUMEISTER-19 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.7 · Schreibrechte (exakt): `src/app/(site)/sicherheitstechnik/page.tsx`, `src/app/(site)/sicherheitstechnik/[slug]/page.tsx` · JS-Budget: kein neues Client-JavaScript · Umfang: Bereichsseite `/sicherheitstechnik` und ihre Leistungsseiten (Erzählansicht)

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Baue die Bereichsseite Sicherheitstechnik und ihre Leistungsseiten nach dem Muster der Türtechnik um: Fach-Icons statt lucide, Leistungen als Raster mit Haarlinien, Grundsatz als nummerierte Liste und Bereichskopf mit Fach-Icon.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.7, unveränderlich)
- **Tokens (KERN K-005a, Auszug):** `text-[10–12px]` → `text-caption` (Großbuchstaben-Zeilen zusätzlich `font-mono uppercase tracking-label`) · `text-[13px]`, `text-[14px]`, `text-sm` → `text-small` · `text-[15px]`, `text-[16px]`, `text-base` → `text-body` · Eingabefelder → `text-eingabe` (16 px, kein Zoom auf iOS; nie `text-input`, das ist die Rahmenfarbe) · `text-lg` als Titel → `text-title-sm` · `text-xl` als Titel → `text-title` · `text-xs` → `text-caption` · `tracking-wider`/`tracking-[…]` bei Großbuchstaben → `tracking-label` · `min-h-[40px]`…`min-h-[48px]` → `min-h-touch` (44 px) · `min-h-[52px]`/`[56px]` → `min-h-touch-lg` · `min-w-[44px]` → `min-w-touch` · `shadow-lg`/`shadow-[…]` → `shadow-raised` (Karte) oder `shadow-overlay` (Menü, Popover) · `z-30` → `z-sticky`, `z-40` → `z-header`, `z-50` → `z-overlay` · `transition-[width]` → `transition-transform` mit `scaleX` · `duration-150`/`200` → `duration-quick`, `duration-300` → `duration-base` · Grid mit `[…]`-Spalten → Zwölfer-Raster (`sm:grid-cols-12` + `sm:col-span-*`). Zahlen, Maße und Zähler in `font-mono tabular-nums`.
- **Jeder Wert ohne passenden Token** kommt ins Feld GEMEINSAME DATEIEN deines Berichts und bleibt im Code unverändert stehen, nie erfunden.
- **Varianten (in `tailwind.config.ts`, Orchestrator):** `hover:` und `group-hover:` wirken projektweit nur bei Maus/feinem Zeiger (`future.hoverOnlyWhenSupported`); schreibe also einfach `hover:`. `zeiger:` gilt für Nicht-Hover-Effekte, die nur mit Maus sinnvoll sind. `fokus-innen:` = Element enthält ein Element mit sichtbarem Tastaturfokus (`&:has(:focus-visible)`), für Karten mit verstecktem Eingabefeld.
- **Zustände (K-009):** Ruhe, Hover (`hover:`, wirkt nur bei feinem Zeiger), Fokus (globaler Ring über `:focus-visible`, bei verstecktem Eingabefeld `fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2`), gedrückt, deaktiviert, lädt, Fehler, Erfolg.
- **Glyphen (K-008a, Auszug):** Import je Datei: `import { GlyphHaken } from '@/components/visual/glyphen/haken';` · Props `size` (Standard 20), `className`, dekorativ automatisch `aria-hidden`. Zuordnung: ArrowRight/ArrowLeft → `GlyphPfeilRechts`/`GlyphPfeilLinks` (`pfeil-rechts`, `pfeil-links`) · Check/CheckCircle2 → `GlyphHaken`/`GlyphHakenKreis` · ChevronDown/ChevronRight → `GlyphWinkelUnten`/`GlyphWinkelRechts` · X/Plus/Minus → `GlyphKreuz`/`GlyphPlus`/`GlyphMinus` · Info/AlertTriangle → `GlyphInfo`/`GlyphWarnung` · Loader2 → `GlyphLaden` · RotateCcw/Trash2/Save → `GlyphZuruecksetzen`/`GlyphPapierkorb`/`GlyphSpeichern` · ImageUp/Camera → `GlyphBildHochladen`/`GlyphKamera` · Scale → `GlyphWaage`. Glyphen haben keine `strokeWidth`-Prop; die Strichstärke kommt aus CSS.
- **Ton (K-010):** Sie-Form, kurz, sachlich; Mikrotexte (Knöpfe, Hinweise) darfst du schärfen, wenn sie unklar sind, mit Alt-Neu-Liste im Bericht. Keine neuen Inhalte, keine Zahlen erfinden.
- **Fach-Icons** (Zweiton, ab 24 px, ohne farbigen Kasten): Import je Datei, z. B. `import { IconZahlung } from '@/components/visual/icons/zahlung';` (Name = `Icon` + Dateiname in Großschreibung). Props `size`, `className`; Bereichsfarbe über `text-area-strong` im Bereichskontext, sonst `text-primary`.
- **Neu in KERN 1.6 (gilt für alle Pakete):**
  - `foreground-subtle` nie auf `surface-sunken` oder `muted`-Flächen; Nummern, Etiketten und Hilfstexte stehen dort in `foreground-muted`.
  - Etiketten unter Titeln (Ablaufart, „Direkt kaufen“, Themen, „Geeignet für“) in `font-mono text-caption uppercase tracking-label text-foreground-muted`. Die Bereichsfarbe (`text-area-strong`) bleibt Augenbraue, Marke, Fach-Icon und Grafik vorbehalten.
  - Mobil: keine seitlich scrollenden Tabellen oder Grafiken. Breite Tabellen werden unter dem Umbruchpunkt zu gestapelten `dl`-Zeilen (gleiche Daten), die Tabelle erscheint erst ab `md` oder `lg` ohne `min-w-[…]`. Horizontale Karten-Leisten nur mit `snap-x snap-mandatory`, `-mx-5 px-5 sm:-mx-6 sm:px-6` und passendem `scroll-px-5 sm:scroll-px-6`.
  - Kennzahlen als **Schriftfeld** (Muster Startseite, Hero): `dl` mit `border-y border-border`, Felder mit `border-l border-border pl-3 sm:pl-4` ab dem zweiten, `dt` `font-mono text-caption uppercase tracking-label text-foreground-muted`, `dd` `mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground`.
  - **Stückliste statt Kartenraster** (Muster Startseite „Schnelleinstieg“ und „Warum wir“): Liste mit `border-t border-border`, je Eintrag `border-b border-border py-6`, Nummer `font-mono tabular-nums` (`text-caption text-foreground-muted` oder groß `text-title font-semibold text-primary`), Titel `text-title-sm font-semibold`, Text `text-small text-foreground-muted max-w-measure`, Pfeil `GlyphPfeilRechts` mit Hover-Verschiebung. Ganze Zeile ist der Link, wo es einen Link gibt.
  - Zwölfer-Raster statt `grid-cols-[…]`: Text und Grafik 7/5 oder 5/7 (`lg:grid-cols-12 lg:gap-gutter`, `lg:col-span-7`/`5`), Kopf links darf auf `lg` mitlaufen (`lg:sticky lg:top-28 lg:self-start`).
  - Abschnittsköpfe über `SectionHeading` mit fortlaufender `nummer` ("01", "02" …) und `eyebrow`; benachbarte Abschnitte wechseln Struktur (Liste ↔ Grafik ↔ Text) und Ton (`default`, `muted`, `sunken`).
  - Fachgrafik auf Papier: `rounded-lg border border-border bg-surface p-4 sm:p-6` (oder `bg-area-soft/40` im Bereich).
- **Seitenstruktur (D-030):** Keine Seite fasst ihren ganzen Inhalt in ein `AreaScope` – die Bereichsfarbe kommt aus dem `layout.tsx` des Bereichs (sonst springt die Seite nach einem Wechsel nicht nach oben; Test `src/app/(site)/seitenstruktur.test.ts`).
- **Bereichsfarbe:** Augenbraue, Fach-Icons, Marken und Grafik nutzen die Bereichstokens (`text-area-strong`, `bg-area-soft`, `border-area`); Aktionen (Knöpfe, Links) bleiben `primary`.
- **Platzhalter nie als Fakt (M-03):** Werte, die mit `[` beginnen (etwa „[Platzhalter: …]“), werden nicht angezeigt – Prüfung mit `istPlatzhalter` aus `@/lib/platzhalter`.
- **Bildstellen ohne Foto** zeigen eine Fachgrafik nach dem Motiv (`src/lib/visual/motiv.ts`, D-032); wo die Zuordnung nicht zur Sache passt, setzt das Paket `visual` im `slot`-Objekt ausdrücklich.
- **Kopf:** `PageHeader` mit `bereich="sicherheitstechnik"` (Fach-Icon als Anker, Ziel des Seitenwechsels B-13); Primärknopf mit `pfeil`.
- **Fach-Icons für `SERVICE_ICONS`:** `videoueberwachung` → `IconVideoueberwachung` · `alarmtechnik` → `IconAlarmtechnik` · `aussenhautsicherung` → `IconAussenhautsicherung` · `mechanischer-schutz` → `IconMechanischerSchutz` · `smarte-funktionen` → `IconSmarteFunktionen` · `panik-und-alarmtaster` → `IconPanikAlarmtaster` · `kombinierte-konzepte` → `IconKombinierteKonzepte` · Rückfall `BereichIcon area="sicherheitstechnik"`. Typ der Tabelle `ComponentType<{ size?: number; className?: string }>`.
- **Grundsatz (drei Begriffe):** nummerierte Liste mit großen Mono-Nummern in `text-area-strong` (Muster „Warum wir“ der Startseite), Kopf links 5/7.
- **Leistungen:** Raster mit Haarlinien wie die Türtechnik (Zelle als Link, Fach-Icon 40 px, Titel `text-title-sm`, Zusammenfassung `text-small`, Etikett, Pfeil).
- **Bildstellen:** Die Leistungsseiten zeigen ihre Bildstelle aus den Daten; die Zuordnung zur Sache ist seit D-032 korrekt. Die Hauseingangs-Stelle der Bereichsseite bekommt `visual: { generator: 'tuer-schutz' }` (Schutzpunkte mit Nummern).
- **Rechtliche Hinweise (Videoüberwachung, Audio, Mitbestimmung):** Kasten mit Haarlinien und `GlyphInfo`, Texte unverändert (der Orchestrator führt sie in MENSCHEN).
- **Leistungsseiten (`[slug]`):** Muster `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` (fertig): Raster 7/5, Punkte mit `GlyphHaken` im Kreis aus Tokens, Kasten „So läuft es ab“ mit Etikett-Stil, weitere Leistungen als Haarlinienliste, Links `min-h-touch`.
- **Register:** B-04, B-06, B-13 (Ziel), B-18 (Schutzpunkte). Sonst keine Bewegung.

## Maßstab
Muster: die Startseite `src/app/(site)/page.tsx` (Referenz: Schriftfeld, Stückliste, nummerierte Abschnitte, Fachgrafik auf Papier, Leiste mit Anschnitt), die Bereichsseite `src/app/(site)/autoschluessel/page.tsx` (E3-BAUMEISTER-07: Begriffsliste, Ablauf B-03, Schlüsselarten B-21), `src/components/layout/fehler-ansicht.tsx` (Haarlinienliste mit Pfeil-Glyph), `src/components/ui/button.tsx` (Prop `pfeil`), `src/components/layout/page-header.tsx` und `src/components/layout/section.tsx`. Bestandsaufnahme aller Dateien mit Zeilen: `_werkstatt/berichte/E4-KUNDSCHAFT-welle-e.md` (lies deinen Abschnitt). Weitere fertige Muster: Marken- und Modellseiten (`src/app/(site)/autoschluessel/marken/…`, E4-BAUMEISTER-08). Weitere fertige Muster der Welle C und D: Türtechnik (`src/app/(site)/tuer-und-schliesstechnik/page.tsx`: Leistungsraster mit Fach-Icons, Schutzpunkte), Schließanlagen (`src/app/(site)/schliessanlagen/page.tsx`), Kasse und Warenkorb (Arbeitsansichten).

## Grenzen
- Nur die Dateien aus den Schreibrechten; andere Dateien liest du nur. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.
- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.
- Datenabfragen, `generateStaticParams`, `notFound`, `noindex`, `LEGAL_RELEVANT`, `PROCESS_LABELS`, Metadaten und alle Texte bleiben gleich.

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E4-KUNDSCHAFT-welle-e.md` (E4-B-19), beide Seiten und die Türtechnik-Seiten (Muster).
2. Bereichsseite wie im Kern-Auszug; Abschnitte mit Nummern, Ton wechselt.
3. Leistungsseiten wie im Kern-Auszug.
4. Alle freien Werte nach K-005a ersetzen (Liste im Kundschaftsbericht).
5. Schnellprüfung. Bilder: `/sicherheitstechnik` und `/sicherheitstechnik/videoueberwachung` sowie `/sicherheitstechnik/smarte-funktionen` (falls die Slugs nicht existieren: die ersten zwei aus `generateStaticParams`), jeweils mobil, tablet und desktop mit `--ganz`.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E4-BAUMEISTER-19 --json /root/sm24-bilder/E4-BAUMEISTER-19/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E4-BAUMEISTER-19 · BEREIT ZUR RÜCKGABE ===
