E3-BAUMEISTER-03 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.3 · Schreibrechte (exakt): `src/components/forms/photo-upload.tsx` (Datei unter dem Logikwächter: nur Darstellung) · JS-Budget: kein neues Client-JavaScript · Umfang: Foto-Hochladen in allen Abläufen

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Bringe den Foto-Upload auf Tokens, SM24-Glyphen und 44-px-Ziele, ohne eine Zeile seiner Logik zu ändern.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.3, unveränderlich)
- **Tokens (KERN K-005a, Auszug):** `text-[10–12px]` → `text-caption` (Großbuchstaben-Zeilen zusätzlich `font-mono uppercase tracking-label`) · `text-[13px]`, `text-[14px]`, `text-sm` → `text-small` · `text-[15px]`, `text-[16px]`, `text-base` → `text-body` · Eingabefelder → `text-input` (16 px, kein Zoom auf iOS) · `text-lg` als Titel → `text-title-sm` · `text-xl` als Titel → `text-title` · `text-xs` → `text-caption` · `tracking-wider`/`tracking-[…]` bei Großbuchstaben → `tracking-label` · `min-h-[40px]`…`min-h-[48px]` → `min-h-touch` (44 px) · `min-h-[52px]`/`[56px]` → `min-h-touch-lg` · `min-w-[44px]` → `min-w-touch` · `shadow-lg`/`shadow-[…]` → `shadow-raised` (Karte) oder `shadow-overlay` (Menü, Popover) · `z-30` → `z-sticky`, `z-40` → `z-header`, `z-50` → `z-overlay` · `transition-[width]` → `transition-transform` mit `scaleX` · `duration-150`/`200` → `duration-quick`, `duration-300` → `duration-base` · Grid mit `[…]`-Spalten → Zwölfer-Raster (`sm:grid-cols-12` + `sm:col-span-*`). Zahlen, Maße und Zähler in `font-mono tabular-nums`.
- **Jeder Wert ohne passenden Token** kommt ins Feld GEMEINSAME DATEIEN deines Berichts und bleibt im Code unverändert stehen, nie erfunden.
- **Varianten (in `tailwind.config.ts`, Orchestrator):** `hover:` und `group-hover:` wirken projektweit nur bei Maus/feinem Zeiger (`future.hoverOnlyWhenSupported`); schreibe also einfach `hover:`. `zeiger:` gilt für Nicht-Hover-Effekte, die nur mit Maus sinnvoll sind. `fokus-innen:` = Element enthält ein Element mit sichtbarem Tastaturfokus (`&:has(:focus-visible)`), für Karten mit verstecktem Eingabefeld.
- **Zustände (K-009):** Ruhe, Hover (`hover:`, wirkt nur bei feinem Zeiger), Fokus (globaler Ring über `:focus-visible`, bei verstecktem Eingabefeld `fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2`), gedrückt, deaktiviert, lädt, Fehler, Erfolg.
- **Glyphen (K-008a, Auszug):** Import je Datei: `import { GlyphHaken } from '@/components/visual/glyphen/haken';` · Props `size` (Standard 20), `className`, dekorativ automatisch `aria-hidden`. Zuordnung: ArrowRight/ArrowLeft → `GlyphPfeilRechts`/`GlyphPfeilLinks` (`pfeil-rechts`, `pfeil-links`) · Check/CheckCircle2 → `GlyphHaken`/`GlyphHakenKreis` · ChevronDown/ChevronRight → `GlyphWinkelUnten`/`GlyphWinkelRechts` · X/Plus/Minus → `GlyphKreuz`/`GlyphPlus`/`GlyphMinus` · Info/AlertTriangle → `GlyphInfo`/`GlyphWarnung` · Loader2 → `GlyphLaden` · RotateCcw/Trash2/Save → `GlyphZuruecksetzen`/`GlyphPapierkorb`/`GlyphSpeichern` · ImageUp/Camera → `GlyphBildHochladen`/`GlyphKamera` · Scale → `GlyphWaage`. Glyphen haben keine `strokeWidth`-Prop; die Strichstärke kommt aus CSS.
- **Ton (K-010):** Sie-Form, kurz, sachlich; Mikrotexte (Knöpfe, Hinweise) darfst du schärfen, wenn sie unklar sind, mit Alt-Neu-Liste im Bericht. Keine neuen Inhalte, keine Zahlen erfinden.
- **Logikwächter:** `photo-upload.tsx` steht unter dem Logikwächter. Erlaubt sind nur Änderungen an JSX-Markup, `className`-Werten, JSX-Texten und Icon-Importen. Alles andere (Hooks, Handler, Zustände, Hilfsfunktionen, Konstanten, `fetch`, Typen) bleibt Zeichen für Zeichen gleich. Prüfung: `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` muss für `photo-upload.tsx` „gleich“ melden.
- **Register (K-007):** B-19 Ladeanzeige: `GlyphLaden` mit der Klasse `animate-spin` ist erlaubt (der Orchestrator bindet die Dauer an das Register); kein weiterer Bewegungseffekt.
- **Zuordnung in dieser Datei:** `Camera` → `GlyphKamera` · `Check` → `GlyphHaken` · `ImageUp` → `GlyphBildHochladen` · `Loader2` → `GlyphLaden` · `RotateCcw` → `GlyphZuruecksetzen` · `Trash2` → `GlyphPapierkorb`. Freie Werte in der Datei: `min-h-[44px]` (2), `min-h-[46px]` (2), `min-w-[44px]` (1), `text-[11px]` (4), `text-[13px]` (2), `text-[15px]` (2).

## Maßstab
Muster für Tokens, Glyphen und Zustände: `src/components/ui/button.tsx` (Druck `active:scale-druck`, Laden mit `GlyphLaden`), `src/components/layout/breadcrumbs.tsx` (Glyph im Text, 24-px-Ziele), `src/components/layout/mobile-action-bar.tsx` (aktiver Zustand, `zeiger:`), `src/components/layout/page-header.tsx`. Lies sie vor dem ersten Schritt.

## Grenzen
- Nur die Dateien aus den Schreibrechten. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.

## Schritte
1. Lies `photo-upload.tsx` ganz, dann die Muster. Notiere jede Stelle mit lucide oder freiem Wert.
2. Ersetze die Icons nach der Zuordnung; übernimm die Größe (`size`) sinnvoll (14–20); entferne `strokeWidth`-Props an Icons (Glyphen haben keine).
3. Ersetze die freien Werte nach K-005a: `min-h-[44px]`/`[46px]` → `min-h-touch`, `min-w-[44px]` → `min-w-touch`, `text-[11px]` → `text-caption`, `text-[13px]` → `text-small`, `text-[15px]` → `text-body`.
4. Prüfe die Zustände: Ziehen/Ablegen-Fläche mit sichtbarem Fokus (`fokus-innen:` falls das Eingabefeld versteckt ist), Hover mit `hover:`, Fehlerzustand mit `GlyphWarnung` und `text-danger`, Ladezustand mit `GlyphLaden`.
5. `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` → `photo-upload.tsx` gleich. Bei „abweichend“: zurücknehmen, bis gleich.
6. Schnellprüfung. Bilder: `/schluessel-nach-vorlage/anfrage` (erster Schritt mit Foto-Upload) mobil und Desktop; `/autoschluessel/anfrage` bis zum Schritt „Fotos Ihres Schlüssels“ nur, wenn ohne Skript erreichbar, sonst weglassen.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E3-BAUMEISTER-03 --json /root/sm24-bilder/E3-BAUMEISTER-03/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.
- Logikwächter: `photo-upload.tsx` gleich (Ausgabe in den Bericht).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E3-BAUMEISTER-03 · BEREIT ZUR RÜCKGABE ===
