E5-BEFUND-H03 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.10 · Schreibrechte (exakt): `src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx`, `src/components/autoschluessel/vehicle-facts.tsx` (nur Darstellung) · JS-Budget: kein neues Client-JavaScript · Umfang: Befundpaket 1 von höchstens 2 für H03 Modellseite (VW Golf)

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Setze die Befunde für die Modellseite um: Stapelgrafik als Blickfang im Kopf, Tabelle mit Mono-Werten, durchgehende Nummern, ruhiger Warnkasten, Bauformen mobil als Leiste, ein Wortlaut für dieselbe Handlung.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.10, unveränderlich)
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
- **Platzhalter nie als Fakt (M-03, harter Katalog):** Werte, die mit `[` beginnen (etwa „[Platzhalter: …]“), werden nicht angezeigt – Prüfung mit `istPlatzhalter` aus `@/lib/platzhalter`. Texte, die einen Platzhalter mitten im Satz enthalten („… [Platzhalter: Stadtteile ergänzen] …“, „[PLZ] [Ort]“), prüfst du mit `enthaeltPlatzhalter` aus derselben Datei und zeigst sie dann nicht. Redaktionshinweise („Hinweis für die Redaktion …“) erscheinen nur im Entwicklungsmodus (`process.env.NODE_ENV !== 'production'`), wie im Fuß (D-016).
- **Bildstellen ohne Foto** zeigen eine Fachgrafik nach dem Motiv (`src/lib/visual/motiv.ts`, D-032); wo die Zuordnung nicht zur Sache passt, setzt das Paket `visual` im `slot`-Objekt ausdrücklich.
- **Neu in KERN 1.8:** Beschriftungen in Zeichnungen sind auf Telefonen mindestens etwa 11,5 px groß. Mittel: `ausschnitt` an `ImagePlaceholder` (unter 640 px nur ein Teil der Zeichnung) oder Generatoren mit schmalem Format (`zylinder-mass` mit `format: 'schmal'`; `ImagePlaceholder` zeigt es unter 640 px selbst). Eine Zeichnung, die mobil kleinere Schrift zeigt, meldest du unter GEMEINSAME DATEIEN.
- **Fach-Icon ohne Foto:** `ImagePlaceholder` zeigt ohne passende Grafik ein Fach-Icon, das mit der Fläche wächst. Keine eigenen Icon-Flächen oder Icon-Tabellen für Bildstellen bauen; die Zuordnung steht zentral in `src/lib/visual/motiv.ts` (D-032). Passt sie nicht, setze `visual` im Slot oder melde es.
- **Neu nach E4 (gemeinsame Bausteine, D-033 bis D-036 und E4-L-26):**
  - `Alert` hat die optionale Prop `role` (`note` Standard · `alert` · `status`). Fehler, die nach einer Aktion erscheinen (Absenden fehlgeschlagen, nichts gefunden), bekommen `role="alert"`; Rückmeldungen wie „gespeichert“ `role="status"`. Als Zeichenkette ist das auch in Logikwächter-Dateien erlaubt.
  - `FlowShell` hat keine Glas-Effekte mehr und setzt `data-ablauf`; Fokus und Sprungziele liegen in Abläufen nicht mehr unter Kopf, Fortschritts- oder Aktionsleiste. Nichts davon in deinen Dateien nachbauen.
  - Große Bestätigungen (Anfrage gesendet, Bestellung angelegt) nutzen `CheckDraw` aus `@/components/visual/motion/check-draw` (Register B-12, Muster `src/components/autoschluessel/bestaetigung.tsx`).
  - `SummaryList` kennt `variante="schriftfeld"` und `hervorheben="<Beschriftung>"` (Muster Kasse); als Zeichenketten sind beide auch in Logikwächter-Dateien erlaubt.
  - Lucide-Zeichen ohne eigene Zuordnung in K-008a: `Truck` → `IconLieferung` bzw. `IconVersandPaket` (ab 24 px) oder ganz weglassen, `PackageOpen` → `IconVersandPaket`, `Layers` → entfällt, `SlidersHorizontal` → `GlyphFilter`, `Search` → `GlyphSuche`, `MapPin` → `GlyphOrt`, `Phone` → `GlyphTelefon`, `Mail` → `GlyphMail`, `MessageSquare` → `GlyphNachricht`, `CalendarSearch` → `GlyphKalender`, `KeyRound` → `GlyphSchluessel`, `Ruler` → `GlyphLineal`, `Trash2` → `GlyphPapierkorb`, `Plus` → `GlyphPlus`, `RotateCcw` → `GlyphZuruecksetzen`. Glyphen 14–24 px; ein 11-px-Haken wird `GlyphHaken size={14}`.
- **Muster aus der Sichtabnahme E4-L-23 (seit 1.10, gelten für alle Ansichten):**
  - **Kopf mit Blickfang:** Erzählansichten setzen ihre Fachgrafik über `PageHeader visual` in den Kopf (7/5; mobil Kopf → Grafik → Aktion). Die Grafik steht ohne Kartenrahmen auf Papier oder auf `bg-area-soft/40`; der große Moment der Ansicht liegt damit in der ersten Bildschirmhöhe. Das Bereichs-Icon bleibt klein neben der Augenbraue (B-13).
  - **Leiste statt Stapel:** Mehr als drei gleichartige Karten werden mobil eine Leiste mit Anschnitt (Muster Startseite „Bestellen ohne Termin“: `-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid … md:overflow-visible md:px-0 scroll-px-5 sm:scroll-px-6 md:scroll-px-0`, Karte `shrink-0 basis-3/4 snap-start md:basis-auto`).
  - **Ordnung durchziehen:** Jeder Abschnitt hat Augenbraue und laufende Nummer (`SectionHeading nummer`), auch „Weiterlesen“ und „Fragen“.
  - **Keine Linkwörter:** „Zur Seite“, „Ansehen“, „Leistungsdetails“, „… erkunden“ entfallen; die ganze Zeile oder Karte ist der Link, rechts nur `GlyphPfeilRechts` mit B-06.
  - **Links im Satz** bleiben `inline` (ohne `inline-flex` und `min-h-touch`; WCAG 2.5.8 nimmt sie aus), sonst reißen Zeilen auf.
  - **Hauptknöpfe mobil einzeilig:** kürzerer vorhandener Wortlaut oder `w-full justify-between text-left`.
  - **Werte:** Beträge, Maße, Kennungen und Tabellenwerte in `font-mono tabular-nums`, Summen rechtsbündig, Endsummen in Textfarbe (Primärblau nur für Aktionen).
  - **Flächen sparsam:** Hinweise ohne eigenen Anlass als Zeile mit Glyphe statt getönter Kasten; Warnungen höchstens 8 Spalten, `surface` mit 2-px-Leiste links in Warnfarbe.
- **Summen (B-20):** Summen blenden bei Änderung über einen wechselnden `key` mit `animate-schleier-ein` ein.

### Befund und Entscheidungen für dieses Paket
#### Urteil der Sichtabnahme für H03 (Ansichtswert 6,0, Ziel ≥ 8)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Die H1 sitzt einzeilig und kräftig (D00). Die Tabellenwerte stehen in Inter statt Mono (D01/M01), „ab 2003.“ bricht als Waise um (D00), und drei Abschnitte haben keine Augenbrauen-Zeile. |
| Komposition | 5 | Der Kopf ist reiner Text, die rechten 5 Spalten bleiben leer (D00). Etwa 200 px Leere vor „Schlüsselarten“ (D01), die Keyless-Zeile hängt (D02), mobil folgen ein Kartenstapel (M02–M03) und eine reine Textstrecke (M04). |
| Farbe und Bild | 6 | Ruhig und korrekt. Die einzige warme Fläche ist der vollbreite Warnkasten (D03, M05), der die Seite farblich dominiert. |
| Bewegung | 6 | Keine Einzelbilder. Nach Register gilt nur B-21 für die Bauformen in Bildschirmhöhe 2; die erste Bildschirmhöhe hat keinen Moment. |
| Grafik | 7 | Die gestapelte Schlüsselgrafik für „hinterlegt“ ist eine gute Idee (D00/M01). Die Bauformen sind 1:1 die H02-Zeichnungen, und Keyless bleibt ungezeichnet (D02). |
| Details | 6 | Der Knopfwortlaut wechselt für dieselbe Handlung (D00 gegenüber D03). Dazu ein umbrechendes Tabellenlabel (D01) und eine isolierte ⓘ-Glyphe (D00). |

#### Befunde der Sichtabnahme (wörtlich, `_werkstatt/berichte/E4-L-23-sichtabnahme-erzaehl-1.md`)

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D00, Kopf | Reiner Text: Die rechte Hälfte (ab etwa 1060 px) ist leer, die Stapelgrafik erscheint erst in Bildschirmhöhe 2. | Kopf auf 7/5: Die Stapelgrafik in die 5er-Spalte holen, ohne Kartenrahmen, über die Spalte nach rechts ragend. Der Abschnitt „hinterlegt“ zeigt dann nur die Tabelle über 8 Spalten. |
| Komposition | D01, zwischen Tabellenende (321 px) und „Schlüsselarten“ (525 px) | Rund 200 px Leere. Die Grafikkarte rechts endet 170 px über der Tabelle, so entsteht ein Loch rechts unten. | Den Abschnittsabstand auf den regulären Takt reduzieren. Fällt Befund 1 weg, die Grafikkarte auf Tabellenhöhe strecken (`self-stretch`, Grafik mittig). |
| Komposition | M02–M03, Bauformen | Drei Karten gestapelt über etwa 1,3 Bildschirmhöhen, Keyless hängt als Textzeile darunter. | Horizontale Leiste mit Anschnitt (`snap-x scroll-px-5`, Karte etwa 80 % breit). Keyless wird vierte Karte, siehe Grafik-Befund. |
| Typografie | D01/M01, Tabelle „Hinterlegte Fahrzeugangaben“ | Die Werte „Golf“, „ab 2003“ und „Ja“ stehen in Inter. Nach K-003.1 gehören Kennungen und Baujahre in Mono. | Die Wertespalte auf `font-mono tabular-nums` setzen, die Labelspalte bleibt Inter, wie die Faktenleiste auf H02 D00. |
| Typografie | D00, Unterzeile | Der Umbruch nach „Baujahre:“ lässt „ab 2003.“ allein in Zeile 2. | Das Baujahr aus dem Satz lösen und als Mono-Feld „BAUJAHRE · ab 2003“ in die Chipzeile stellen. Sonst `text-wrap: balance` mit geschütztem Leerzeichen `Baujahre:&nbsp;ab&nbsp;2003`. |
| Typografie | D00 „Das ist zu diesem Modell hinterlegt“, D03 „Was wir ohne Ihre Unterlagen…“, „Der nächste Schritt“ | Drei von fünf Abschnitten haben keine Augenbrauen-Zeile, die anderen sind nicht nummeriert. Die Ordnung der Seite ist unklar. | `.eyebrow` mit Bemaßungsmarke und laufender Nummer 01–05 für alle Abschnitte. |
| Farbe und Bild | D03/M05, Warnkasten „Angaben ohne Gewähr“ | Eine beige Vollfläche über 12 Spalten ist die stärkste Farbfläche der Seite. Die Signalfarbe wird zur Fläche. | Auf 8 Spalten begrenzen, Hintergrund `surface`, links 2-px-Leiste in Warnfarbe, Glyph `GlyphWarnung` bleibt. |
| Bewegung | D00, erste Bildschirmhöhe | Kein Moment über der Falz. B-21 wirkt erst bei den Bauformen. | Mit Komposition-Befund 1: Die drei Ebenen der Stapelgrafik nacheinander per `sm24-reveal` (3 × 120 ms), danach zeichnet das vordere Profil (`draw`, höchstens 1,1 s), als H03-Stufe von B-21. Reduziert: sofort. Einzelbilder für H03 nachmessen. |
| Grafik | D02/M03, Keyless | Vier Arten sind erfasst, aber nur drei gezeichnet. Keyless hängt als nackte Textzeile auf 8/12 Breite unter dem Raster. | Den vorhandenen Smart-Key-Generator aus H02 als vierte Karte einsetzen, Raster auf `grid-cols-4`. |
| Details | D00 „Mit diesem Fahrzeug starten“ gegenüber D03/M05 „Volkswagen Golf auswählen“ | Zwei Wortlaute für dieselbe Handlung. | Einen Wortlaut für beide Knöpfe, „Mit diesem Fahrzeug starten“. |
| Details | D01, Label „Fahrzeug zum Anlernen vor Ort“ | Das Label bricht zweizeilig, die Wertespalte beginnt bei etwa 33 %. | Labelspalte auf 40 % (`grid-cols-[2fr_3fr]`). |
| Details | D00/M00, ⓘ nach Chip „Fahrzeug vor Ort nötig“ | Die Glyphe steht 12 px abgesetzt und ohne Bezug neben der Chipzeile. | Die InfoTip-Glyphe in den Chip ziehen (rechts im Chip, 14 px). |

**Das Stärkste**
- Ehrliche Datenhaltung als Gestaltung: Tabelle „Hinterlegte Fahrzeugangaben“ und klar abgegrenzter Hinweis, was der Datensatz nicht weiß (D01, D03).
- Gestapelte Schlüsselgrafik mit Ebenen als Bild für „Varianten innerhalb der Baureihe“ (D00/M01).

#### Entscheidungen des Orchestrators
- **Kopf (Komposition 1, Bewegung):** `PageHeader visual` mit der vorhandenen gestapelten Schlüsselgrafik (ohne Kartenrahmen); der Abschnitt „hinterlegt“ zeigt dann nur noch die Tabelle über 8 Spalten. Die Ebenen erscheinen mit der vorhandenen Staffel des Generators.
- **Abstände (Komposition 2):** regulärer Abschnittstakt, keine Lücke vor „Schlüsselarten“.
- **Bauformen mobil (Komposition 3):** Leiste mit Anschnitt (KERN 1.10), ab `md` Raster. **Keyless** bleibt ein Hinweis (D-030/B-21: Keyless ist eine Funktion des Smart Key, keine eigene Bauform), aber als Haarlinienzeile mit `GlyphInfo` direkt unter den Zeichnungen, nicht als hängende Textzeile.
- **Tabelle (Typografie 1, Details 2):** Wertespalte `font-mono tabular-nums`; Beschriftungsspalte im Zwölfer-Raster breit genug, dass „Fahrzeug zum Anlernen vor Ort“ einzeilig bleibt (kein `grid-cols-[…]`).
- **Baujahr (Typografie 2):** als Mono-Feld „Baujahre · ab 2003“ in die Chipzeile (Wert wie bisher aus `formatModelYears`/`hatBaujahre`, ohne Platzhalter); im Satz entfällt die Angabe nur, wenn sie im Chip steht.
- **Ordnung (Typografie 3):** Augenbraue mit laufender Nummer für alle Abschnitte.
- **Warnkasten (Farbe):** höchstens 8 Spalten, `surface`, links 2-px-Leiste in Warnfarbe, `GlyphWarnung` bleibt.
- **Knopf (Details 1):** ein Wortlaut „Mit diesem Fahrzeug starten“ für beide Knöpfe (Mikrotext).
- **InfoTip (Details 3):** in den Chip „Fahrzeug vor Ort nötig“ (rechts im Chip, 14 px).
- **Schon erledigt durch den Orchestrator (E4-L-24 bis E4-L-27, nicht nachbauen):** gesperrte Knöpfe als ruhige Fläche; FlowShell (Zurück-Knopf mit Namen und auf Schritt 1 ausgeblendet, mobil einzeilig mit Schrittname, keine Glas-Effekte, klebende Leiste nur Titel und Balken, Hinweis „Zwischenstand“ nur für geladene Stände); Datei-Eingaben mit Namen und Beispielbild als Fachgrafik; Dateigrößen deutsch; Bereichstöne Code/Schließanlagen; Fundstelle (Leitlinien unter dem Schlüssel, Bewegung < 1,2 s); Tür-Schutzpunkte (Marke 4, Leitlinie 5); Schlüssel-Generator (Zeiten gestrafft, Notschlüssel im Smart Key, Signal ein Durchgang); Live-Schlüssel mit Rohling; Maßzeichnung im schmalen Format; Summenfarbe im Konfigurator; Warenkorbzeichen; Schriftfeld-Zusammenfassung (rechtsbündig, Kennungen ohne Umbruch, Prop `leer`); `PageHeader visual` als 7/5-Kopf; Warenkorb-Messwerte (Mindesthöhen von Lade- und Leerzustand nicht entfernen).
- **Texte mit Inhalt** (Abschnittstitel, Einleitungen, Floskeln wie „Wobei können wir helfen?“ oder „Präzise Handwerkskunst …“) änderst du nicht; der Orchestrator führt sie als Vorschläge. Mikrotexte (Linkwörter, Knopftexte, Etiketten, Typografie wie „z. B.“) darfst du ändern, mit Alt-Neu-Liste im Bericht.

## Maßstab
Muster: die Startseite `src/app/(site)/page.tsx` (Referenz: Schriftfeld, Stückliste, nummerierte Abschnitte, Fachgrafik auf Papier), die Bereichsseiten `src/app/(site)/sicherheitstechnik/page.tsx` und `src/app/(site)/tuer-und-schliesstechnik/page.tsx` (Leistungsraster mit Haarlinien und Fach-Icons, Hinweiskasten mit `GlyphInfo`, Abschnitt „Weiterlesen“ als Stückliste), `src/app/(site)/schluessel-nach-vorlage/page.tsx` (Fotoblätter, Schriftfeld im Kopf), die Arbeitsansichten `src/app/(site)/kasse/kasse-formular.tsx` und `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (nummerierte Abschnitte mit Mono-Ziffer und Haarlinie, Werte in Mono, Schriftfeld), `src/components/layout/page-header.tsx`, `src/components/layout/section.tsx`, `src/components/ui/button.tsx` (Prop `pfeil`). Bestandsaufnahme aller Dateien mit Zeilen: `_werkstatt/berichte/E5-KUNDSCHAFT.md` (lies deinen Abschnitt vollständig, auch „Auffälliges“; die Antworten des Orchestrators auf die Fragen stehen unten im Kern-Auszug). Bilder der Sichtabnahme: `/root/sm24-bilder/e4-b/` (Dateien `H03-…__<gerät>__<k>.jpg`, gefüllt: `gefuellt/`, Schritte: `schritte/`).

## Grenzen
- Nur die Dateien aus den Schreibrechten; andere Dateien liest du nur. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.
- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.
- Datenabfragen, `generateStaticParams`, `notFound`, Metadaten, JSON-LD, Linkziele mit Vorbelegung (`?marke=…&modell=…`) und Texte mit Inhalt bleiben gleich. Andere Aufrufer von `vehicle-facts.tsx` müssen unverändert funktionieren (Props-Vertrag gleich).

## Schritte
1. Lies den Befundteil, die Seite und `vehicle-facts.tsx` samt Aufrufern (`grep -rn vehicle-facts src`).
2. Kopf, Tabelle, Bauformen, Ordnung, Warnkasten, Knöpfe, InfoTip.
3. Schnellprüfung und Bilder (zwei Modelle/Marken wie unten).

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint "src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx" src/components/autoschluessel/vehicle-facts.tsx` ohne Befund.
- `npx vitest run src/components src/lib` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs "src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx" src/components/autoschluessel/vehicle-facts.tsx`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" "src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx" src/components/autoschluessel/vehicle-facts.tsx`: kein Treffer.
- `grep -n "\[Platzhalter\|\[PLZ\]\|\[Ort\]" ` im gerenderten HTML deiner Seiten (`curl -s http://localhost:3001<pfad>`): kein sichtbarer Treffer außerhalb von Rechtstexten.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ganz --ziel /root/sm24-bilder/E5-BEFUND-H03 --json /root/sm24-bilder/E5-BEFUND-H03/bild-mobil.json`, dasselbe mit `--geraet tablet` und `--geraet desktop`. Pfade:
  - `/autoschluessel/marken/volkswagen/golf`
  - `/autoschluessel/marken/bmw`
- Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, keine leeren Flächen, Abstände gleichmäßig, benachbarte Abschnitte verschieden gebaut, Beschriftungen in Zeichnungen mobil lesbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E5-BEFUND-H03 · BEREIT ZUR RÜCKGABE ===
