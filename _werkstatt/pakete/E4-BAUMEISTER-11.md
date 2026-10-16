E4-BAUMEISTER-11 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.7 · Schreibrechte (exakt): `src/app/(site)/tuer-und-schliesstechnik/page.tsx`, `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` · JS-Budget: kein neues Client-JavaScript · Umfang: Hauptansicht H09 `/tuer-und-schliesstechnik` (Erzählansicht) und die Leistungsseiten des Bereichs

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Baue die Bereichsseite Tür- und Schließtechnik und ihre Leistungsseiten nach dem Muster der Referenz um, mit den Tür-Schutzpunkten als großem Moment, Fach-Icons statt lucide und lesbarem Regulatorik-Kasten.

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
- **Großer Moment H09 (Register B-18):** Die Bildstelle Z. 203–209 („Werkstattfoto: … Mehrfachverriegelung …“) bekommt `visual: { generator: 'tuer-schutz' }` (Schutzpunkte mit Nummern und Legende, Marken treten gestaffelt mit `sm24-pop` auf). Sie steht auf Papier in der rechten Spalte, oberhalb des Rechners.
- **Regulatorik-Kasten (`bg-surface-ink`):** Das 400-px-Dekor `ShieldCheck` entfällt ersatzlos (KERN K-008a: an seine Stelle tritt der Generator `tuer-schutz` auf derselben Seite). Die `h2` bekommt `text-foreground-inverse` (bisher erbt sie die dunkle Überschriftfarbe: Kontrastfehler); Text `text-foreground-inverse/80` nur, wenn der Kontrast mindestens 4,5:1 bleibt, sonst voll; Link mit `GlyphPfeilRechts` und sichtbarem Fokus (`focus-visible:ring-offset-surface-ink`). Größe `text-headline` statt `text-3xl md:text-4xl`, `z-raised` statt `z-10`.
- **Leistungsportfolio:** Kachelraster → Raster mit Haarlinien wie der Schnelleinstieg der Startseite (`grid border-t border-border sm:grid-cols-2 lg:grid-cols-3`, Zellen `border-b`, Trennlinien `sm:border-l`), je Zelle Fach-Icon 40 px in `text-area-strong`, Titel `text-title-sm font-semibold`, Zusammenfassung `text-small text-foreground-muted`, Etikett „Leistungsdetails“ im Etikett-Stil, Pfeil-Glyph. Ganze Zelle ist der Link.
- **Fach-Icons für `SERVICE_ICONS`:** `profilzylinder-und-spezialzylinder` → `IconProfilzylinder` · `einsteckschloesser` → `IconEinsteckschloss` · `mehrfachverriegelungen` → `IconMehrfachverriegelung` · `schutzbeschlaege` → `IconSchutzbeschlag` · `tuerzusatzschloesser` → `IconTuerzusatzschloss` · `tuerschliesser` → `IconTuerschliesser` · `panik-und-fluchttuertechnik` → `IconPanikFluchttuer` · `reparatur-und-austausch` → `IconReparaturAustausch` · `technische-beratung` → `IconTechnischeBeratung` · `montage-und-anpassung` → `IconMontage` · Rückfall → `BereichIcon area="tuer-und-schliesstechnik"`. Der Typ der Tabelle wird `ComponentType<{ size?: number; className?: string }>`.
- **Glyphen:** `ArrowRight` → Prop `pfeil` am Knopf, sonst `GlyphPfeilRechts` · `CheckCircle2` → `GlyphHakenKreis` · `Check` → `GlyphHaken`.
- **Register:** B-04, B-06, B-18. Sonst keine Bewegung.

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
- Datenabrufe (`Promise.all`, `getServicePage(s)`, `getRichtwerte`, `getNachweise`), `PROCESS_LABELS`, `generateMetadata`, `generateStaticParams`, `notFound`, `RELATED_AREAS`, `EXPERT_FAQ` und alle Texte bleiben gleich. Fachaussagen und Normangaben (DIN EN 1627, 179, 1125, T30) nicht ändern; der Orchestrator führt sie als Prüfpunkt für den Menschen.
- `TuerAbsicherungRechner` und `NachweiseListe` bleiben unverändert (fertig aus E3-BAUMEISTER-06).

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E4-KUNDSCHAFT-welle-c.md` (E4-B-11), beide Seiten, `src/components/visual/generators/tuer-schutz.tsx` (Parameter) und die Startseite (Muster).
2. Kopf: `PageHeader` mit `bereich="tuer-und-schliesstechnik"` (zeigt das Fach-Icon groß als Anker des Kopfes, wie `/autoschluessel`; Ziel des Seitenwechsels B-13); Primärknopf mit `pfeil`, ohne eigenes `active:scale-[…]` und `shadow-md` (der Knopf bringt Druck und Hover mit).
3. Abschnitt „Die Tür als geschlossenes Sicherheitssystem“: Raster 7/5; die drei Punkte als Haarlinienliste mit `GlyphHakenKreis`; Kasten „Ablauf in diesem Bereich“ als Schriftfeld-Zeile; rechts großer Moment und Rechner.
4. Leistungsportfolio wie oben.
5. Regulatorik-Kasten wie oben, `NachweiseListe` unverändert darunter.
6. FAQ und „Angrenzende Bereiche“ nur Tokens (`min-h-touch`).
7. `[slug]/page.tsx`: Raster 7/5 statt `grid-cols-[1.1fr_1fr]`; Punkte mit `GlyphHaken` im Kreis aus Tokens (`size-6 rounded-full bg-area-soft text-area-strong`); Kasten „So läuft es ab“ mit Etikett-Stil (`tracking-label` statt `tracking-wider`); „Weitere Leistungen“ als Haarlinienliste; Link-Chips mit `min-h-touch`.
8. Alle freien Werte nach K-005a ersetzen (Liste im Kundschaftsbericht).
9. Schnellprüfung. Bilder: `/tuer-und-schliesstechnik` und `/tuer-und-schliesstechnik/schutzbeschlaege` (falls der Slug nicht existiert: der erste aus `generateStaticParams`), jeweils mobil, tablet und desktop mit `--ganz`; dazu `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder /tuer-und-schliesstechnik --selektor "<Selektor der Bildstelle>" --dauer 900 --geraet desktop --ziel /root/sm24-bilder/E4-BAUMEISTER-11/b18`.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E4-BAUMEISTER-11 --json /root/sm24-bilder/E4-BAUMEISTER-11/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E4-BAUMEISTER-11 · BEREIT ZUR RÜCKGABE ===
