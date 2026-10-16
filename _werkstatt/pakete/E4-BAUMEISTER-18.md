E4-BAUMEISTER-18 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.7 · Schreibrechte (exakt): `src/app/(site)/elektronische-zutrittsloesungen/page.tsx` · nur lesen: `src/components/visual/generators/zutritt-signal.tsx` · JS-Budget: kein neues Client-JavaScript · Umfang: Bereichsseite `/elektronische-zutrittsloesungen` (Erzählansicht)

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Baue die Bereichsseite „Elektronische Zutrittslösungen“ nach dem Muster der Referenz um, mit dem Zutritts-Signal (Medium, Funk, Leser, Freigabe) als großem Moment im Kopf, den elf Bausteinen als Raster mit Haarlinien und Fach-Icons und einer klaren Entscheidungshilfe.

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
- **Großer Moment:** `PageHeader` mit `bereich="elektronische-zutrittsloesungen"` und `visual={<ZutrittSignalGrafik params={{ medium: 'transponder' }} title="Zeichnung: Transponder öffnet eine Tür mit Leser" />}` (Import aus `@/components/visual/generators/zutritt-signal`). Die Bewegung (Funkbögen, Freigabe-Haken) steckt im Generator.
- **Bildstellen:** Die Werkstattfoto-Stelle der Einordnung bekommt `visual: { generator: 'zutritt-signal', params: { medium: 'karte' } }`; die Schemazeichnung Türübersicht `visual: { generator: 'zutritt-signal', params: { medium: 'smartphone' } }`. So zeigt die Seite die drei Medien.
- **Bausteine (elf):** Raster mit Haarlinien wie das Leistungsportfolio der Türtechnik (`grid border-t border-border sm:grid-cols-2 lg:grid-cols-3`, Zellen `border-b`, Trennlinien), kein `Card`. Der breite Baustein „protokoll“ läuft über zwei Spalten (`lg:col-span-2`), so entsteht keine Lücke; prüfe die Reihen auf `sm` und `lg` im Bild. Icons 40 px in `text-area-strong`: `rfid` → `IconTransponder`, `smartphone` → `IconSmarteFunktionen`, `pin` → `GlyphRaute` (24 px), `digitale-zylinder` → `IconProfilzylinder`, `beschlaege` → `IconSchutzbeschlag`, `zeitlich-begrenzt` → `IconTermin`, `benutzerverwaltung` → `GlyphPersonen` (24 px), `zeitprofile` → `GlyphUhr` (24 px), `sperren` → `GlyphVerbot` (24 px), `protokoll` → `IconNachweis`, `kombination` → `IconKombinierteKonzepte`. Der Typ des Feldes `icon` wird `ComponentType<{ size?: number; className?: string }>`. Punkte mit `GlyphHaken`.
- **Entscheidung mechanisch/elektronisch (`DECISION_ROWS`):** ab `md` Tabelle mit Mono-Kopf, darunter gestapelte `dl` (KERN 1.6), keine seitlich scrollende Tabelle.
- **Abschnitte:** `SectionHeading` mit fortlaufender `nummer`; Raster 7/5; Ton wechselt.
- **Zuordnung:** übrige lucide-Icons → K-008a (`ArrowRight` → `pfeil`/`GlyphPfeilRechts`).
- **Register:** B-04, B-06, Bewegung des Generators `zutritt-signal` (Bestand). Sonst keine Bewegung.

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
- `getPageContent`, Rückfälle, `PROCESS_LABELS`, Metadaten und alle Texte (Bausteine, Hinweise, FAQ, Links) bleiben gleich. Aussagen wie „Ihre Angaben bleiben im Browser gespeichert“ und „Acht Fragen“ prüft der Orchestrator.
- `zutritt-signal.tsx` nicht ändern; Wünsche ins Feld GEMEINSAME DATEIEN.

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E4-KUNDSCHAFT-welle-e.md` (E4-B-18), die Seite, den Generator `zutritt-signal.tsx` (Parameter) und die Türtechnik-Seite (Muster).
2. Kopf mit großem Moment; Abschnitte mit Nummern.
3. Bausteine, Hinweise (`InfoTip` bleibt), Entscheidungshilfe, Bildstellen, FAQ, „Passend dazu“ als Haarlinienliste.
4. Alle freien Werte nach K-005a ersetzen (Liste im Kundschaftsbericht).
5. Schnellprüfung. Bilder: `/elektronische-zutrittsloesungen` mobil, tablet und desktop mit `--ganz`; dazu `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder /elektronische-zutrittsloesungen --selektor "header svg" --dauer 1200 --geraet desktop --ziel /root/sm24-bilder/E4-BAUMEISTER-18/signal`.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E4-BAUMEISTER-18 --json /root/sm24-bilder/E4-BAUMEISTER-18/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E4-BAUMEISTER-18 · BEREIT ZUR RÜCKGABE ===
