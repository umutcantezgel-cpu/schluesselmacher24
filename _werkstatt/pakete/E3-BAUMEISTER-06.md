E3-BAUMEISTER-06 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.3 · Schreibrechte (exakt): `src/components/calculator/rechner-bausteine.tsx`, `src/components/calculator/service-einsatz-rechner.tsx`, `src/components/calculator/tuer-absicherung-rechner.tsx`, `src/components/calculator/rechner.test.tsx` (nur Alt-Neu), `src/components/vertrauen/nachweise-liste.tsx`, `src/components/vertrauen/nachweise-liste.test.tsx` (nur Alt-Neu) · JS-Budget: kein neues Client-JavaScript · Umfang: Rechner (Serviceeinsatz, Türabsicherung) und Nachweisliste

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Mache die beiden Richtwert-Rechner und die Nachweisliste zu bemaßten Werkzeugen: Ergebnis als Maßangabe in Mono, Auswahl mit sichtbarem Fokus, Tokens und SM24-Glyphen.

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
- **Register (K-007):** keine neue Bewegung; das Ergebnis wechselt ohne Animation (aria-live bleibt).
- **Zuordnung in diesen Dateien:** `Calculator` → `GlyphRechner` (size 20, ohne farbigen Kasten, `text-primary`) · `ArrowRight` am Knopf → Prop `pfeil` von `ButtonLink` · `BadgeCheck` → `GlyphPruefsiegel` (size 18, `text-primary`).
- **Fokus:** `Fokusrahmen` nutzt heute `has-[:focus-visible]:…`; ersetze das durch die Variante `fokus-innen:` (`fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2 fokus-innen:ring-offset-background`). Das ist gleichwertig und ohne freien Wert.
- **Ergebnis als Maßangabe:** Spanne `font-mono text-headline tabular-nums` (statt `text-3xl`), Zusatz und Hinweis `text-small`; die Zusammenfassung als Zwölfer-Raster (`sm:grid-cols-12`, `dt` `sm:col-span-4`, `dd` `sm:col-span-8`) statt `sm:grid-cols-[8rem_minmax(0,1fr)]`; Rahmentitel `text-title font-semibold` mit Glyph.
- **Tests:** `rechner.test.tsx` prüft Markup (u. a. eine `dd`-Klasse in Z. 43, Zählungen von fieldset, radio, checkbox, aria-live, Texte). Passe einen Test nur an, wenn sich genau das geprüfte Markup durch die Token-Umstellung ändert, mit Alt-Neu-Liste; Zählungen und Texte bleiben. `nachweise-liste.test.tsx` entsprechend.

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
- Rechner-Logik (Zustände, `umschalten`, `aufforderung`, `auswaehlbar`, Aufrufe von `…Berechnen`/`…Zusammenfassung`, Export `KEIN_RICHTWERT_TEXT`, Verzweigung nach `ergebnis.art`, `aria-live`) bleibt Zeichen für Zeichen gleich. Nachweisliste: Early Return bei leerer Liste und Prop `ebene` bleiben.

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E3-KUNDSCHAFT-welle-b.md` (E3-B-06), alle Dateien und beide Testdateien.
2. `rechner-bausteine.tsx`: Rahmen, Auswahlgruppe (`legend` `text-title-sm font-semibold`, Hinweis `text-small`), Fokusrahmen, Ergebnis wie im Kern-Auszug; freie Werte nach K-005a.
3. `service-einsatz-rechner.tsx` und `tuer-absicherung-rechner.tsx`: nur Klassen auf Tokens, falls vorhanden; Logik unverändert.
4. `nachweise-liste.tsx`: `GlyphPruefsiegel`; Titel `text-body font-semibold`, Angaben `text-small`, Datum `font-mono tabular-nums`; Liste mit Haarlinien statt Kästen.
5. Tests ausführen; nur bei geändertem geprüftem Markup anpassen (Alt-Neu-Liste).
6. Schnellprüfung. Bilder: `/tuer-und-schliesstechnik` und `/service-und-termin` mit `--ganz` (Rechner und Nachweise), mobil und desktop.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E3-BAUMEISTER-06 --json /root/sm24-bilder/E3-BAUMEISTER-06/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E3-BAUMEISTER-06 · BEREIT ZUR RÜCKGABE ===
