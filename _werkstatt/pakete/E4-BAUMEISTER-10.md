E4-BAUMEISTER-10 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.7 · Schreibrechte (exakt): `src/app/(site)/schliessanlagen/page.tsx`, `src/components/schliessanlagen/system-erklaerung.tsx` · nur lesen: `src/components/visual/interaktiv/schliessplan-interaktiv.tsx` · JS-Budget: nur die vorhandene Client-Hülle `SchliessplanInteraktiv` (unter 5 KB komprimiert), sonst kein neues Client-JavaScript · Umfang: Hauptansicht H08 `/schliessanlagen` (Erzählansicht)

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Baue die Bereichsseite Schließanlagen nach dem Muster der Referenz um, mit dem interaktiven Schließplan als großem Moment, einer Zeichnung je Anlagenart und einem Systemvergleich, der mobil ohne seitliches Scrollen lesbar ist.

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
- **Großer Moment H08 (Register B-14):** Im Abschnitt `#systeme` steht zuerst `<SchliessplanInteraktiv anfang="haupt" tueren={4} gruppen={2} />` aus `@/components/visual/interaktiv/schliessplan-interaktiv` auf Papier (`rounded-lg border border-border bg-surface p-4 sm:p-6`), Kopf links (5/7, mitlaufend), danach die Erklärungen. Die Komponente nicht ändern; Wünsche ins Feld GEMEINSAME DATEIEN. Der Bereich hat bereits `AreaScope` über `src/app/(site)/schliessanlagen/layout.tsx`.
- **Zeichnung je Anlagenart:** In `LOCK_SYSTEMS` bekommt jedes `figure`-Objekt ein `visual`: `gleichschliessung` → `{ generator: 'schliessplan', params: { system: 'gleichschliessung', tueren: 3 } }`, `z` → `{ … system: 'zentral', tueren: 4 }`, `hs` → `{ … system: 'haupt', tueren: 4 }`, `ghs` → `{ … system: 'generalhaupt', gruppen: 2, tueren: 4 }`, `erweiterbar` → `{ … system: 'generalhaupt', gruppen: 2, tueren: 6 }`. Motiv-, Notiz- und Inhaltstexte bleiben. Die Info-Schemata im `InfoTip` bleiben, wie sie sind.
- **Bildstelle „Werkstattfoto: Schließplan … neben sortierten Profilzylindern“** (`page.tsx` Z. 284–290): `visual: { generator: 'schluessel', params: { typ: 'zylinder', anzahl: 3 } }`, damit nicht der Profilschnitt erscheint.
- **Systemvergleich:** ab `lg` die Tabelle ohne `min-w-[46rem]` und ohne `table-scroll`; unter `lg` dieselben Daten als gestapelte `dl` je Anlagenart (Name `text-title-sm font-semibold`, Zeilen mit Haarlinien, `dt` Etikett-Stil). Die `caption` bleibt für die Tabelle.
- **Für wen:** Kartenraster → Stückliste; `Building2` → `GlyphGebaeude`, `Users` → `GlyphPersonen`, `Layers` → `GlyphSchluessel` (Glyphen 24 px, `text-area-strong`), die `icon`-Typen in `AUDIENCES` passen sich an.
- **Register:** B-04, B-06, B-14. Sonst keine Bewegung.
- **Zuordnung:** `ArrowRight` → Prop `pfeil` am Knopf, sonst `GlyphPfeilRechts`.

## Maßstab
Muster: die Startseite `src/app/(site)/page.tsx` (Referenz: Schriftfeld, Stückliste, nummerierte Abschnitte, Fachgrafik auf Papier, Leiste mit Anschnitt), die Bereichsseite `src/app/(site)/autoschluessel/page.tsx` (E3-BAUMEISTER-07: Begriffsliste, Ablauf B-03, Schlüsselarten B-21), `src/components/layout/fehler-ansicht.tsx` (Haarlinienliste mit Pfeil-Glyph), `src/components/ui/button.tsx` (Prop `pfeil`), `src/components/layout/page-header.tsx` und `src/components/layout/section.tsx`. Bestandsaufnahme aller Dateien mit Zeilen: `_werkstatt/berichte/E4-KUNDSCHAFT-welle-c.md` (lies deinen Abschnitt).

## Grenzen
- Nur die Dateien aus den Schreibrechten; andere Dateien liest du nur. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.
- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.
- `getPageContent`, `JsonLd`/`pageGraphSchema`, die FAQ-Ersatzlogik, die Schlüssel von `LOCK_SYSTEMS` (`gleichschliessung`, `z`, `hs`, `ghs`, `erweiterbar`), `systemName` und alle Texte bleiben gleich.
- Normangaben in `FALLBACK_FAQ` (DIN EN 179, DIN EN 1125) nicht ändern; der Orchestrator führt sie als Prüfpunkt für den Menschen.

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E4-KUNDSCHAFT-welle-c.md` (E4-B-10), beide Dateien, `schliessplan-interaktiv.tsx`, `src/components/visual/generators/schliessplan.tsx` (Parameter) und die Startseite (Muster).
2. Kopf: Primärknopf mit `pfeil`, zweiter Knopf `outline` auf `#systeme`.
3. „Einstieg“ 7/5: Fließtext, Prozesshinweis als Schriftfeld-Zeile (Ablaufart als Etikett), Glossar als `dl` mit Haarlinien (Begriff `text-title-sm font-semibold` mit `InfoTip`, Erklärung `text-small text-foreground-muted`), Bildstelle rechts.
4. `#systeme` (`tone="sunken"`): großer Moment, darunter `SystemErklaerung` als Zeichnungsblätter (`rounded-lg border border-border bg-surface`, Grafik oben auf `bg-area-soft/40`, Text darunter, Merkpunkte mit `GlyphHaken` in `text-area-strong`, „Geeignet für“ als Etikett), dann der Systemvergleich.
5. „Für wen“, FAQ und Abschluss: Stückliste und Tokens; Linkkarten mit `min-h-touch`.
6. Alle freien Werte nach K-005a ersetzen (Liste im Kundschaftsbericht).
7. Schnellprüfung. Bilder: `/schliessanlagen` mobil, tablet und desktop mit `--ganz`; Tastaturprobe des Schließplans mit einem kurzen Skript in `/root/sm24-bilder/E4-BAUMEISTER-10/` (Tab bis zur Registerleiste, Pfeil rechts, ein Schlüssel-Chip mit Leertaste, Bild).

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E4-BAUMEISTER-10 --json /root/sm24-bilder/E4-BAUMEISTER-10/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E4-BAUMEISTER-10 · BEREIT ZUR RÜCKGABE ===
