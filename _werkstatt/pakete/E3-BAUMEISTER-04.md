E3-BAUMEISTER-04 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.3 · Schreibrechte (exakt): `src/components/autoschluessel/service-article.tsx`, `src/components/autoschluessel/key-kinds.tsx`, `src/components/autoschluessel/vehicle-facts.tsx` · JS-Budget: kein Client-JavaScript (alle drei bleiben Server-Komponenten) · Umfang: Vorlage der sieben Autoschlüssel-Leistungsseiten

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Mache die gemeinsame Vorlage der sieben Autoschlüssel-Leistungsseiten zu einer ruhigen, bemaßten Erzählansicht mit Tokens, SM24-Glyphen und Listen statt gleichförmiger Karten.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.3, unveränderlich)
- **Tokens (KERN K-005a, Auszug):** `text-[10–12px]` → `text-caption` (Großbuchstaben-Zeilen zusätzlich `font-mono uppercase tracking-label`) · `text-[13px]`, `text-[14px]`, `text-sm` → `text-small` · `text-[15px]`, `text-[16px]`, `text-base` → `text-body` · Eingabefelder → `text-input` (16 px, kein Zoom auf iOS) · `text-lg` als Titel → `text-title-sm` · `text-xl` als Titel → `text-title` · `text-xs` → `text-caption` · `tracking-wider`/`tracking-[…]` bei Großbuchstaben → `tracking-label` · `min-h-[40px]`…`min-h-[48px]` → `min-h-touch` (44 px) · `min-h-[52px]`/`[56px]` → `min-h-touch-lg` · `min-w-[44px]` → `min-w-touch` · `shadow-lg`/`shadow-[…]` → `shadow-raised` (Karte) oder `shadow-overlay` (Menü, Popover) · `z-30` → `z-sticky`, `z-40` → `z-header`, `z-50` → `z-overlay` · `transition-[width]` → `transition-transform` mit `scaleX` · `duration-150`/`200` → `duration-quick`, `duration-300` → `duration-base` · Grid mit `[…]`-Spalten → Zwölfer-Raster (`sm:grid-cols-12` + `sm:col-span-*`). Zahlen, Maße und Zähler in `font-mono tabular-nums`.
- **Jeder Wert ohne passenden Token** kommt ins Feld GEMEINSAME DATEIEN deines Berichts und bleibt im Code unverändert stehen, nie erfunden.
- **Varianten (in `tailwind.config.ts`, Orchestrator):** `hover:` und `group-hover:` wirken projektweit nur bei Maus/feinem Zeiger (`future.hoverOnlyWhenSupported`); schreibe also einfach `hover:`. `zeiger:` gilt für Nicht-Hover-Effekte, die nur mit Maus sinnvoll sind. `fokus-innen:` = Element enthält ein Element mit sichtbarem Tastaturfokus (`&:has(:focus-visible)`), für Karten mit verstecktem Eingabefeld.
- **Zustände (K-009):** Ruhe, Hover (`hover:`, wirkt nur bei feinem Zeiger), Fokus (globaler Ring über `:focus-visible`, bei verstecktem Eingabefeld `fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2`), gedrückt, deaktiviert, lädt, Fehler, Erfolg.
- **Glyphen (K-008a, Auszug):** Import je Datei: `import { GlyphHaken } from '@/components/visual/glyphen/haken';` · Props `size` (Standard 20), `className`, dekorativ automatisch `aria-hidden`. Zuordnung: ArrowRight/ArrowLeft → `GlyphPfeilRechts`/`GlyphPfeilLinks` (`pfeil-rechts`, `pfeil-links`) · Check/CheckCircle2 → `GlyphHaken`/`GlyphHakenKreis` · ChevronDown/ChevronRight → `GlyphWinkelUnten`/`GlyphWinkelRechts` · X/Plus/Minus → `GlyphKreuz`/`GlyphPlus`/`GlyphMinus` · Info/AlertTriangle → `GlyphInfo`/`GlyphWarnung` · Loader2 → `GlyphLaden` · RotateCcw/Trash2/Save → `GlyphZuruecksetzen`/`GlyphPapierkorb`/`GlyphSpeichern` · ImageUp/Camera → `GlyphBildHochladen`/`GlyphKamera` · Scale → `GlyphWaage`. Glyphen haben keine `strokeWidth`-Prop; die Strichstärke kommt aus CSS.
- **Ton (K-010):** Sie-Form, kurz, sachlich; Mikrotexte (Knöpfe, Hinweise) darfst du schärfen, wenn sie unklar sind, mit Alt-Neu-Liste im Bericht. Keine neuen Inhalte, keine Zahlen erfinden.
- **Fach-Icons** (Zweiton, ab 24 px, ohne farbigen Kasten): Import je Datei, z. B. `import { IconZahlung } from '@/components/visual/icons/zahlung';` (Name = `Icon` + Dateiname in Großschreibung). Props `size`, `className`; Bereichsfarbe über `text-area-strong` im Bereichskontext, sonst `text-primary`.
- **Register (K-007):** B-06 Link-Hover: Pfeil `translate-x-1` mit `transition-transform duration-quick ease-standard`, Farbe wechselt; B-04 Abschnittsauftritt kommt aus `Section` (nichts hinzufügen).
- **Zuordnung in diesen Dateien:** `ArrowRight` → am Knopf Prop `pfeil` von `ButtonLink`, in Linklisten `GlyphPfeilRechts` (size 18) · `Check` → `GlyphHaken` (size 16) · `Minus` → `GlyphMinus` (size 16).
- **Komposition (K-006):** Zwölfer-Raster statt `lg:grid-cols-[1.15fr_1fr]` u. ä.: Text `lg:col-span-7`, Bild/Grafik `lg:col-span-5` (bzw. umgekehrt 5/7), Abstand `lg:gap-gutter`. Benachbarte Abschnitte wechseln Struktur (Liste ↔ Grafik ↔ Text); gleichförmige Karten sind nicht das vorherrschende Muster.
- **Platzhalter (harter Katalog):** `KeyKindBadges` zeigt bei leerer Liste heute „[Platzhalter: Schlüsselarten noch nicht erfasst]“. Ersetze den Text durch die sachliche Angabe „Schlüsselarten noch nicht hinterlegt“ (`text-small text-foreground-muted`); das ist ein Mikrotext, kein erfundener Inhalt. Alt-Neu-Liste im Bericht.

## Maßstab
Muster für Tokens, Glyphen und Zustände: `src/components/ui/button.tsx` (Prop `pfeil` statt eigenem Pfeil-Icon, Druck, Laden), `src/components/layout/breadcrumbs.tsx`, `src/components/layout/page-header.tsx`, `src/components/layout/fehler-ansicht.tsx` (Liste mit Haarlinien statt Karten, Pfeil-Glyph mit Hover-Verschiebung) und die Startseite `src/app/(site)/page.tsx` (Referenz der Etappe E2: Schriftfeld, Stückliste, Ablauf am Scrollen). Bestandsaufnahme aller Dateien mit Zeilen: `_werkstatt/berichte/E3-KUNDSCHAFT-welle-b.md` (lies deinen Abschnitt).

## Grenzen
- Nur die Dateien aus den Schreibrechten. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.
- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.
- `service-article.tsx` ist eine Server-Komponente ohne Hooks: Reihenfolge der Abschnitte (Kommentar Z. 17–20), Vorrang von `content.faq` vor dem Prop `faq`, `dedupeLinks` und alle Keys bleiben unverändert. `key-kinds.tsx`: alle Exporte, Texte und Typen bleiben gleich (außer dem Platzhaltertext oben).

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E3-KUNDSCHAFT-welle-b.md` (E3-B-04), dann alle drei Dateien und die Muster.
2. `service-article.tsx`, Kopf: `PageHeader` bekommt `bereich="autoschluessel"` (zeigt das Fach-Icon des Bereichs); Primärknopf mit `pfeil` statt eigenem `ArrowRight`.
3. Abschnitt „Was ist das“: Raster 7/5 (Text links, `ImagePlaceholder` rechts); `prose-sm24` bleibt.
4. Abschnitt „Wann brauchen Sie das“: statt Kartenraster eine nummerierte Liste mit Haarlinien (`border-t border-border`, je Eintrag `border-b`), Nummer `font-mono text-caption tabular-nums text-foreground-subtle` ("01"), Titel `text-title-sm font-semibold`, Text `text-small text-foreground-muted`, InfoTip bleibt am Titel; auf `lg` zwei Spalten (`lg:grid-cols-2 lg:gap-x-gutter`).
5. Abschnitt „Was wir von Ihnen brauchen“: Raster 5/7; Liste mit `GlyphHaken` in `text-success` statt Kreis-Kasten; Alert bleibt.
6. Abschnitt „Abgrenzung“: Liste mit `GlyphMinus` (`text-foreground-subtle`), ohne `Card`; Titel `text-body font-semibold`, Text `text-small`.
7. FAQ unverändert (Accordion wird in einem anderen Paket überarbeitet).
8. „Nächster Schritt“: Raster 7/5; Linkliste „Passend dazu“ als Stückliste: Zeile = ganzer Link mit `min-h-touch`, Titel `text-body font-semibold`, Beschreibung `text-small`, `GlyphPfeilRechts` nach B-06; Überschrift „Passend dazu“ als `eyebrow`.
9. Alle freien Werte nach K-005a ersetzen (Liste im Kundschaftsbericht).
10. `key-kinds.tsx`: `text-[13px]` → `text-small`, Platzhaltertext wie oben; `className`-Verkettung über `cn()` statt Template-String.
11. `vehicle-facts.tsx`: nur prüfen, ob Tokens und Mono für Jahreszahlen (`font-mono tabular-nums`) passen; sonst unverändert.
12. Schnellprüfung. Bilder: `/autoschluessel/nachmachen` und `/autoschluessel/smart-key` (je mobil, desktop und desktop `--ganz`), `/autoschluessel/marken/volkswagen/golf` (nutzt `key-kinds`, mobil).

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E3-BAUMEISTER-04 --json /root/sm24-bilder/E3-BAUMEISTER-04/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E3-BAUMEISTER-04 · BEREIT ZUR RÜCKGABE ===
