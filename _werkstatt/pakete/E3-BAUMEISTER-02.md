E3-BAUMEISTER-02 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.3 · Schreibrechte (exakt): `src/components/flow/flow-shell.tsx`, `src/components/layout/summary-list.tsx` · JS-Budget: kein neues Client-JavaScript außer einem `useState` für die Richtung des Schrittwechsels · Umfang: Ablauf-Hülle aller mehrstufigen Formulare

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Mache die Ablauf-Hülle (Fortschritt, Schrittliste, Schrittwechsel, Navigation) und die Zusammenfassung ruhig, präzise und tokenbasiert, mit Fortschritt per `scaleX` statt `width`.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.3, unveränderlich)
- **Tokens (KERN K-005a, Auszug):** `text-[10–12px]` → `text-caption` (Großbuchstaben-Zeilen zusätzlich `font-mono uppercase tracking-label`) · `text-[13px]`, `text-[14px]`, `text-sm` → `text-small` · `text-[15px]`, `text-[16px]`, `text-base` → `text-body` · Eingabefelder → `text-input` (16 px, kein Zoom auf iOS) · `text-lg` als Titel → `text-title-sm` · `text-xl` als Titel → `text-title` · `text-xs` → `text-caption` · `tracking-wider`/`tracking-[…]` bei Großbuchstaben → `tracking-label` · `min-h-[40px]`…`min-h-[48px]` → `min-h-touch` (44 px) · `min-h-[52px]`/`[56px]` → `min-h-touch-lg` · `min-w-[44px]` → `min-w-touch` · `shadow-lg`/`shadow-[…]` → `shadow-raised` (Karte) oder `shadow-overlay` (Menü, Popover) · `z-30` → `z-sticky`, `z-40` → `z-header`, `z-50` → `z-overlay` · `transition-[width]` → `transition-transform` mit `scaleX` · `duration-150`/`200` → `duration-quick`, `duration-300` → `duration-base` · Grid mit `[…]`-Spalten → Zwölfer-Raster (`sm:grid-cols-12` + `sm:col-span-*`). Zahlen, Maße und Zähler in `font-mono tabular-nums`.
- **Jeder Wert ohne passenden Token** kommt ins Feld GEMEINSAME DATEIEN deines Berichts und bleibt im Code unverändert stehen, nie erfunden.
- **Varianten (in `tailwind.config.ts`, Orchestrator):** `hover:` und `group-hover:` wirken projektweit nur bei Maus/feinem Zeiger (`future.hoverOnlyWhenSupported`); schreibe also einfach `hover:`. `zeiger:` gilt für Nicht-Hover-Effekte, die nur mit Maus sinnvoll sind. `fokus-innen:` = Element enthält ein Element mit sichtbarem Tastaturfokus (`&:has(:focus-visible)`), für Karten mit verstecktem Eingabefeld.
- **Zustände (K-009):** Ruhe, Hover (`hover:`, wirkt nur bei feinem Zeiger), Fokus (globaler Ring über `:focus-visible`, bei verstecktem Eingabefeld `fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2`), gedrückt, deaktiviert, lädt, Fehler, Erfolg.
- **Glyphen (K-008a, Auszug):** Import je Datei: `import { GlyphHaken } from '@/components/visual/glyphen/haken';` · Props `size` (Standard 20), `className`, dekorativ automatisch `aria-hidden`. Zuordnung: ArrowRight/ArrowLeft → `GlyphPfeilRechts`/`GlyphPfeilLinks` (`pfeil-rechts`, `pfeil-links`) · Check/CheckCircle2 → `GlyphHaken`/`GlyphHakenKreis` · ChevronDown/ChevronRight → `GlyphWinkelUnten`/`GlyphWinkelRechts` · X/Plus/Minus → `GlyphKreuz`/`GlyphPlus`/`GlyphMinus` · Info/AlertTriangle → `GlyphInfo`/`GlyphWarnung` · Loader2 → `GlyphLaden` · RotateCcw/Trash2/Save → `GlyphZuruecksetzen`/`GlyphPapierkorb`/`GlyphSpeichern` · ImageUp/Camera → `GlyphBildHochladen`/`GlyphKamera` · Scale → `GlyphWaage`. Glyphen haben keine `strokeWidth`-Prop; die Strichstärke kommt aus CSS.
- **Ton (K-010):** Sie-Form, kurz, sachlich; Mikrotexte (Knöpfe, Hinweise) darfst du schärfen, wenn sie unklar sind, mit Alt-Neu-Liste im Bericht. Keine neuen Inhalte, keine Zahlen erfinden.
- **Register (K-007):** B-10 Flow-Fortschritt: Balken `origin-left transition-transform duration-slow ease-standard`, Breite über `style={{ transform: `scaleX(${…})` }}` (Wert 0,04 bis 1); kein `width` mehr. B-11 Schrittwechsel: Der Inhaltsbereich des Schritts bekommt `key={flow.step?.id}` und die Klasse `sm24-schritt-vor` (weiter) oder `sm24-schritt-zurueck` (zurück); beide Klassen stellt der Orchestrator in `globals.css` bereit, inklusive reduzierter Bewegung. Die Richtung bestimmst du nach React-Muster „Information aus vorigem Render“: `const [vorher, setVorher] = useState(flow.stepIndex); const [richtung, setRichtung] = useState<'vor' | 'zurueck'>('vor'); if (vorher !== flow.stepIndex) { setRichtung(flow.stepIndex > vorher ? 'vor' : 'zurueck'); setVorher(flow.stepIndex); }` (kein `useRef`, kein `useEffect`). Beim ersten Render keine Animation: Klasse nur, wenn sich der Schritt schon einmal geändert hat (eigener Zustand `gewechselt`).
- **Ansichtsart (K-009):** Abläufe sind Arbeitsansichten: ruhig, kompakt, keine großen Überschriften.

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
- `flow-shell.tsx` wird von 9 Abläufen genutzt (Assistent, Konfiguratoren, Anfragen, Sicherheitscheck). Props und Verhalten (Weiter, Zurück, Schrittliste nur rückwärts klickbar, Zwischenstand-Hinweis, Absenden mit `loading`) bleiben exakt gleich.

- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.

## Schritte
1. Lies beide Dateien, `src/lib/flow/use-flow.ts` (nur lesen) und die Muster.
2. Kopfzeile: Ablauf-Titel als `text-caption font-mono uppercase tracking-label`; „Schritt X von Y“ als `text-caption font-mono tabular-nums`. Klebende Leiste `sticky top-header z-sticky` statt `top-16 md:top-20 z-30` (Spacing-Token `header` = Höhe des Kopfs).
3. Fortschritt nach B-10. `role="progressbar"` und alle `aria-*` bleiben.
4. Schrittliste (ab Tablet): `text-caption`, Zielhöhe `min-h-6`; erledigte Schritte mit `GlyphHaken` (size 14), aktueller Schritt `text-primary` mit `aria-current="step"` (neu), offene Schritte `text-foreground-subtle`; Hover `hover:text-primary`.
5. Zwischenstand-Hinweis: `Save` → `GlyphSpeichern` (size 16, als eigenes Element mit `flex items-center gap-2` statt `inline align-[-2px]`), Text `text-small`; `RotateCcw` → `GlyphZuruecksetzen`.
6. Schritt: Überschrift `text-title font-bold` (statt `text-xl md:text-2xl`), Hinweis `text-body max-w-measure`; B-11 auf den Inhaltsbereich (Überschrift, Hinweis und Kinder zusammen).
7. Navigation unten: `z-sticky` statt `z-40`; `ArrowLeft`/`ArrowRight` → `GlyphPfeilLinks`/`GlyphPfeilRechts` (size 18); Sperrhinweis `text-small`. Das Inline-`style` mit `env(safe-area-inset-bottom)` bleibt (funktional).
8. `summary-list.tsx`: Abschnittstitel `text-caption font-mono uppercase tracking-label`; Zeilen im Zwölfer-Raster `sm:grid sm:grid-cols-12 sm:gap-4` mit `dt` `sm:col-span-4` und `dd` `sm:col-span-8`; `dt` `text-small font-semibold`, `dd` `text-body`.
9. Schnellprüfung. Bilder: `/service-und-termin/anfrage` (erster Schritt) mobil und Desktop; dazu zwei Bilder nach einem Klick auf „Weiter“ bzw. mit Zusammenfassung: Schreibe ein kurzes Skript nach `/root/sm24-bilder/E3-BAUMEISTER-02/ablauf.mjs` mit `lib.mjs` (Exporte lesen), das auf `/service-und-termin/anfrage` die erste Auswahl trifft, „Weiter“ klickt und den zweiten Schritt fotografiert (mobil 390 px und Desktop 1440 px). Prüfe am Bild: Fortschritt sichtbar gewachsen, Leiste klebt unter dem Kopf, nichts verdeckt.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint <deine Dateien>` ohne Befund.
- `npx vitest run src/components` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs <deine Dateien>`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" <deine Dateien>`: kein Treffer.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E3-BAUMEISTER-02 --json /root/sm24-bilder/E3-BAUMEISTER-02/bild-mobil.json` und dasselbe mit `--geraet desktop`. Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Fokus sichtbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E3-BAUMEISTER-02 · BEREIT ZUR RÜCKGABE ===
