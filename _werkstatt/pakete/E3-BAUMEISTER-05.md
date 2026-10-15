E3-BAUMEISTER-05 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.3 · Schreibrechte (exakt): `src/components/autoschluessel/preis-anzeige.tsx`, `src/components/autoschluessel/termin-auswahl.tsx`, `src/components/autoschluessel/bestaetigung.tsx`, neu `src/components/autoschluessel/bestaetigung.test.tsx` · JS-Budget: kein neues Client-JavaScript · Umfang: Preis, Terminwahl und Bestätigung im Autoschlüssel-Assistenten

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Mache Preis, Terminwahl und Bestätigung des Autoschlüssel-Assistenten zu präzisen Arbeitsansichten mit bemaßten Zahlen in Mono, SM24-Glyphen und dem Bestätigungshaken CheckDraw.

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
- **Ansichtsart (K-009):** Arbeitsansicht: ruhig, kompakt, nur Rückmeldung als Bewegung.
- **Register (K-007):** B-12 Bestätigungshaken: `CheckDraw` aus `@/components/visual/motion/check-draw` (Props `title`, `size`, `delay`, `className`) ersetzt `CheckCircle2` in der Bestätigung, Größe 56, oberhalb der Statuszeile. B-19 Ladeanzeige: `GlyphLaden` mit `animate-spin` (900 ms, bei reduzierter Bewegung ruhend).
- **Zuordnung in diesen Dateien:** `Car` → `IconFahrzeugmarke` (size 24) · `Clock` → `GlyphUhr` (size 18) · `Info` → `GlyphInfo` (size 16) · `CalendarClock`, `CalendarCheck` → `GlyphKalender` (size 18) · `Loader2` → `GlyphLaden` · `CheckCircle2` → `CheckDraw` (s. o.) · `CreditCard` → `IconZahlung` (size 24).
- **Zahlen (K-010):** Preise, Beträge, Dauer, Uhrzeiten und die Vorgangsnummer in `font-mono tabular-nums`; Hauptpreis `text-headline`, Nebenwerte `text-title-sm`; Kartenbezeichnungen als `font-mono text-caption uppercase tracking-label`.

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
- Alle drei Dateien sind Darstellung im Assistenten (`assistent.tsx` steht unter dem Logikwächter und wird nicht geändert). Verzweigungen (`mode`, `priceCents`, `staleSelection`, `loading`, `redirectUrl`, `notices`), Berechnungen (Restbetrag), Callbacks (`onSelect`) und Keys bleiben Zeichen für Zeichen gleich.

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E3-KUNDSCHAFT-welle-b.md` (E3-B-05), alle drei Dateien und `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (nur lesen: wo und wie die drei eingebunden sind).
2. `preis-anzeige.tsx`: Zeilen-Hilfskomponente auf Tokens (`text-body`/`text-small`, Werte Mono); Festpreis, Rahmen und Prüfung je als ruhige Fläche (`rounded-lg border border-border bg-surface`), Hauptwert `font-mono text-headline tabular-nums`; Icons nach Zuordnung; Fußnote `text-small` mit `GlyphInfo`.
3. `termin-auswahl.tsx`: Ladezeile `text-body` mit `GlyphLaden`; Tagesüberschrift `text-title-sm font-semibold` mit `GlyphKalender`, Datum Mono; Zeitfenster bleiben `OptionCard` (deren Gestaltung kommt aus einem anderen Paket).
4. `bestaetigung.tsx`: Kopf mit `CheckDraw` (56 px, Titel „Vorgang angelegt“), Statuszeile `font-mono text-caption uppercase tracking-label text-success`, Überschrift `text-headline`; Vorgangsnummer als bemaßtes Feld (`font-mono text-headline tabular-nums`, Bezeichnung als Caption); Karten Termin und Anzahlung mit Fach-Icons; Hinweise `text-small`; Link mit `hover:underline` und sichtbarem Fokus.
5. Alle freien Werte nach K-005a ersetzen (Liste im Kundschaftsbericht).
6. Schnellprüfung. Bilder: Preis- und Terminschritt sind nur über den Assistenten erreichbar. Schreibe ein Skript `/root/sm24-bilder/E3-BAUMEISTER-05/assistent.mjs`, das den Weg aus `_werkstatt/werkzeuge/funktionsliste.mjs` (Funktion `f04`, Hilfsfunktionen lesen, nicht ändern) nachbildet, mit `attrappenSetzen()` aus `lib.mjs`, gegen `SM24_BASIS_URL=http://localhost:3001`, und die Schritte „Preis für Ihren Fall“ und „Termin auswählen“ mobil und desktop fotografiert. Die Bestätigung ist ohne echte Sendung nicht erreichbar: prüfe sie stattdessen mit einem kleinen Vitest-Rendertest `src/components/autoschluessel/bestaetigung.test.tsx` (neue Datei, in deinen Schreibrechten) mit Beispielprops: rendert ohne Fehler, Vorgangsnummer erscheint, `CheckDraw`-Titel erscheint, kein `lucide`.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E3-BAUMEISTER-05 --json /root/sm24-bilder/E3-BAUMEISTER-05/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E3-BAUMEISTER-05 · BEREIT ZUR RÜCKGABE ===
