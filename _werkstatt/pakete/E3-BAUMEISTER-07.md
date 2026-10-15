E3-BAUMEISTER-07 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.3 · Schreibrechte (exakt): `src/app/(site)/autoschluessel/page.tsx` · JS-Budget: kein neues Client-JavaScript (großer Moment ist reines CSS im Server-Markup) · Umfang: Hauptansicht H02 `/autoschluessel` (Erzählansicht) mit großem Moment B-21

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Baue die Bereichsseite `/autoschluessel` nach dem Muster der Referenz-Startseite um, mit dem Zeichnungsblatt der Schlüsselarten als großem Moment, Begriffsliste statt Kartenraster und dem Ablauf am Scrollen.

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
- **Ansichtsart:** Erzählansicht; je Bildschirmhöhe ein Blickfang; benachbarte Abschnitte wechseln Struktur.
- **Großer Moment B-21:** Komponente `SchluesselartenReihe` aus `@/components/autoschluessel/schluesselarten-reihe` (fertig, vom Orchestrator; nicht ändern). Eigener Abschnitt direkt nach dem Seitenkopf: `<Section id="schluesselarten" labelledBy="schluesselarten-titel">` mit `SectionHeading` (`id="schluesselarten-titel"`, `nummer="01"`, `eyebrow="Schlüsselarten"`, `title={KEY_KIND_HINT.title}`, `lead={KEY_KIND_HINT.body}`) und darunter `<SchluesselartenReihe className="mt-8" />`. Der InfoTip mit `KEY_KIND_HINT` im Abschnitt „Fahrzeuge“ entfällt dadurch (Inhalt steht jetzt sichtbar oben).
- **Register:** B-03 Ablauf am Scrollen wie auf der Startseite (`src/app/(site)/page.tsx`, Abschnitt mit `sm24-scrub-y` und `sm24-scrub-marke`: Schiene `absolute left-5 w-px bg-border-strong`, Füllung `sm24-scrub-y … bg-area`, Marken `sm24-scrub-marke size-10 rounded-full border-2 border-area bg-surface font-mono`). B-06 Link-Hover (Pfeil verschiebt sich). Sonst keine Bewegung.
- **Zuordnung in dieser Datei:** `ArrowRight` an Knöpfen → Prop `pfeil`; in Links → `GlyphPfeilRechts` (size 16–18) · Gruppen-Icons der Begriffe: `KeyRound` → `IconSchluesselKopieren`, `Wrench` → `IconSchluesselProgrammieren`, die dritte Gruppe „Reparatur und Sonderfälle“ → `IconReparaturAustausch`; `Car` → `IconFahrzeugmarke`. Fach-Icons in 40 px, `text-area-strong`, ohne farbigen Kasten. Prüfe die Gruppen-Zuordnung in `TOPIC_GROUPS` und nimm das Fach-Icon, das zum Gruppentitel passt.
- **Seitenkopf:** `PageHeader` mit `bereich="autoschluessel"`; Primärknopf mit `pfeil`; die Kennzahlen (`dl`) als Schriftfeld wie auf der Startseite (Zeile mit Haarlinien `border-y`, Felder mit `border-l`, `dt` `font-mono text-caption uppercase tracking-label text-foreground-subtle`, `dd` `font-mono text-title-sm font-semibold tabular-nums`).

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
- Datenzugriffe (`getPageContent`, `getSettings`, `getVehicleMakes`), `generateMetadata`, `JsonLd`, `steps`, `FAQ`, `TOPIC_GROUPS`-Inhalte (Texte, Links, Hinweise) und alle Texte bleiben gleich. Nur Aufbau, Klassen und Icons ändern sich. Du darfst die Typdefinition von `TOPIC_GROUPS` anpassen, wenn das Icon-Feld nun ein Fach-Icon aufnimmt.
- Der Abschnitt mit `SchluesselartenReihe` ist der einzige neue Abschnitt; keine neuen Texte außer Mikrotexten (Alt-Neu-Liste).

## Schritte
1. Lies deinen Abschnitt in `_werkstatt/berichte/E3-KUNDSCHAFT-welle-b.md` (E3-B-07), die ganze Seite, die Startseite `src/app/(site)/page.tsx` (Muster) und `src/components/autoschluessel/schluesselarten-reihe.tsx`.
2. Seitenkopf wie im Kern-Auszug.
3. Neuer Abschnitt „Schlüsselarten“ (B-21) direkt nach dem Kopf; die übrigen Abschnitte bekommen in `SectionHeading` fortlaufende `nummer` ("02" …), wo sie eine `eyebrow` haben.
4. „Einordnung“: Raster 7/5 (`lg:grid-cols-12`, Text `lg:col-span-7`, `ImagePlaceholder` `lg:col-span-5`), `lg:gap-gutter`.
5. „Leistungsbegriffe“ als Begriffsliste statt Kartenraster: je Gruppe Kopfzeile (Fach-Icon 40 px, `h3` `text-title font-semibold`, Lead `text-small`), darunter eine Liste mit Haarlinien (`border-t`, je Eintrag `border-b`), je Eintrag ein Zwölfer-Raster auf `md`: Begriff `h4` `text-body font-semibold` mit InfoTip (`md:col-span-4`), Erklärung `text-small text-foreground-muted` (`md:col-span-6`), Link „Zur Seite“ mit `GlyphPfeilRechts` und `min-h-touch` (`md:col-span-2 md:justify-self-end`); der unsichtbare Begriff im Link (`sr-only`) bleibt.
6. „Ablauf“: Raster 5/7; die Schrittliste nach B-03 wie auf der Startseite statt `border-l` und `-left-[38px]`; Alert bleibt.
7. „Fahrzeuge“: Raster 7/5; Markenliste mit Tokens (`min-h-touch`, `text-small font-semibold`, `GlyphPfeilRechts`), Hover nur Farbe.
8. „Fragen“ und „Weiterführend“: nur Tokens.
9. Alle freien Werte nach K-005a ersetzen (21 Stellen, Liste im Kundschaftsbericht).
10. Schnellprüfung. Bilder: `/autoschluessel` mobil, tablet und desktop, jeweils mit `--ganz`; dazu `node _werkstatt/werkzeuge/bewegung.mjs einzelbilder /autoschluessel --selektor "#schluesselarten figure" --dauer 900 --geraet desktop --ziel /root/sm24-bilder/E3-BAUMEISTER-07/b21` gegen `SM24_BASIS_URL=http://localhost:3001` (5 Einzelbilder des großen Moments) und ansehen.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E3-BAUMEISTER-07 --json /root/sm24-bilder/E3-BAUMEISTER-07/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E3-BAUMEISTER-07 · BEREIT ZUR RÜCKGABE ===
