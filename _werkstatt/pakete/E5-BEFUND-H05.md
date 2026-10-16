E5-BEFUND-H05 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.10 · Schreibrechte (exakt): `src/app/(site)/schluessel-nach-code/page.tsx`, `src/app/(site)/schluessel-nach-code/shop-liste.tsx` · JS-Budget: kein neues Client-JavaScript außer dem Anzeige-Zustand „Alle n anzeigen“ · Umfang: Befundpaket 1 von höchstens 2 für H05 Code-Shop

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Setze die Befunde für den Code-Shop um: Fundstelle als Blickfang im Kopf, statt 52 gleicher Karten mit leeren Bildflächen dichte Datenzeilen nach Anwendungsfamilie gruppiert, Kennungen in Mono, ruhige Filterzeile.

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
#### Urteil der Sichtabnahme für H05 (Ansichtswert 5,2, Ziel ≥ 8)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Display-h1, Mono-Augenbraue mit Bemaßungsmarke und Mono-Datenzeilen (CODEFORMAT, Preis) tragen (D00, D01). Die 52 Kartentitel brechen aber unausgewogen um („Büroschrank und / Rollcontainer — Serie MS-01“, D01), der Untertitel wiederholt den Titel, und „01 52 CODELINIEN“ (D00) liest sich wie eine Zahl. |
| Komposition | 4 | Der Kopf (D00) hat keinen Blickfang, die rechten fünf Spalten bleiben leer. Danach folgen 52 gleiche Karten im Dreierraster (D01–D09), mobil 52 Karten übereinander (M01–M11): eine Kachelwüste auf beiden Geräten. |
| Farbe und Bild | 4 | Rund 60 % jeder Karte sind eine leere `surface-muted`-Fläche mit 24-px-Paket-Icon (D01–D09, M01–M11). Die Bereichsfarbe Violett erscheint nur als winziger Punkt in dieser Leere. |
| Bewegung | 7 | B-22 (E0–E4): Der Schlüssel erscheint, ein gestrichelter Kreis markiert die Fundstelle am Kopf, und die Lupe vergrößert den Code. Das zeigt Mechanik. In keinem der 19 Bildschirmbilder liegt dieser Moment aber im sichtbaren Bereich, und E0 ist ein leeres Raster. |
| Grafik | 4 | Die Fundstellen-Grafik (E4) ist präzise. Die Produktkarten zeigen aber keine Fachgrafik, sondern das Bereichs-Icon als Platzhalter (D01), obwohl H06 für dieselbe Serie ein eigenes Schlüsselprofil zeichnet (H06 D00). |
| Details | 6 | Mono-Preise mit Haarlinie und „Staffelpreis ab 3 Stück“ sind sauber (D02). Die Trennlinien über dem Preis springen innerhalb einer Reihe (D05: ZY-01 tiefer als MS/BK), und „Filter zurücksetzen“ steht deaktiviert in Blassgrau wie defekter Text (D01). |

#### Befunde der Sichtabnahme (wörtlich, `_werkstatt/berichte/E4-L-23-sichtabnahme-erzaehl-2.md`)

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D01–D09, M01–M11, Kartenraster | 52 gleiche Karten von je etwa 600 px Höhe. Die Familien sind nicht gegliedert, und mobil sind es rund 30 Bildschirmhöhen Scrollen. | Nach Anwendungsfamilie gruppieren, je Gruppe eine Mono-Augenbraue (`.eyebrow`, „MS · MÖBEL- UND BÜROSCHLOSS“). Darunter dichte Zeilen statt Karten: Serie in Mono · Titel · Codeformat in Mono · Preis in Mono · Pfeil, Zeilenhöhe `min-h-touch-lg`, Haarlinie `border-b`. Mobil je Familie eine Liste mit 3 Zeilen und „alle n anzeigen“ oder eine `snap-x`-Leiste mit `scroll-px-5`. |
| Komposition | D00, M00, Kopf | Ohne Blickfang: Rechts liegen fünf leere Spalten, und der Hinweiskasten läuft über die volle Breite. | Kopf in 7/5 teilen: h1, Einleitung und Hinweiskasten in `lg:col-span-7`, die Fundstellen-Grafik (B-22) in `lg:col-span-5`, die über die Spalte ragt. Mobil steht die Grafik als Ausschnitt unter der Einleitung. |
| Komposition | M01, Suche und Filter | Suche, Filterknopf, Zähler und der deaktivierte Rücksetzer füllen eine ganze Bildschirmhöhe, bevor die erste Codelinie erscheint. | „Filter zurücksetzen“ erst bei aktivem Filter zeigen. Zähler „52 Codelinien von 52“ und „Filter anzeigen“ in eine Zeile setzen (`flex justify-between`). |
| Farbe und Bild | D01, M01, Kartenbildflächen | Quadratische Leerflächen mit 24-px-Icon dominieren jede Karte. Bild ist hier nur Leere. | Die Bildfläche ganz entfernen (Listenaufbau wie oben) oder auf `aspect-video` mit der Fachgrafik des Produkts verkleinern (siehe Grafik). |
| Bewegung | E0–E4, Fundstelle | E0 zeigt ein leeres Raster. Der Schlüssel selbst ist Inhalt und baut sich erst auf, sodass der eigentliche Moment (Code unter der Lupe) erst bei ¾ beginnt. | Den Schlüsselumriss sofort stehen lassen. Animieren nur den gestrichelten Kreis (`sm24-draw`), die zwei Verbindungslinien (`draw`, `enter` 600 ms) und die Lupe (`sm24-pop`), gesamt ≤ 1,2 s. Grafik in den Kopf setzen, damit der Moment in der ersten Bildschirmhöhe läuft. |
| Grafik | D01–D09, Kartenbild | Das Bereichs-Icon steht stellvertretend für ein Bild. H06 D00 zeigt, dass es je Serie ein gezeichnetes Schlüsselprofil gibt. | In jeder Karte (oder Zeile, dann 96 × 54 px) dieselbe deterministische Produktgrafik wie auf der Produktseite zeigen, mit Profil aus der Serienkennung, Strich `LINIE` und Farbe `stroke-area`. |
| Grafik | E3–E4 (und H06 D02), Fundstelle | Die untere Verbindungslinie vom Kreis zur Lupe läuft über Bart und Halm des Schlüssels. | Linien unter den Schlüssel legen (Schlüssel in der Malreihenfolge zuletzt) oder die untere Linie an der Tangente oberhalb der Halmkante enden lassen. |
| Typografie | D01–D09, Kartentitel | Unausgewogene Umbrüche. Die Serienkennung hängt am Titelende und bricht mit („— Serie MS-01“). | Serienkennung als eigene Mono-Zeile über dem Titel (`font-mono text-caption tracking-label text-foreground-muted`, „MS-01“). Titel ohne „— Serie …“ und mit `text-wrap: balance`. |
| Typografie | D01, M02, Untertitel | „Möbel- und Büroschloss: Büroschrank und Rollcontainer“ wiederholt den Titel. Die Karte hat damit zweimal denselben Text. | Untertitel auf die Familie kürzen („Möbel- und Büroschloss“), `text-small text-foreground-muted`. |
| Typografie | D00, M00, Augenbraue Abschnitt 01 | „01 52 CODELINIEN“: Zwei Zahlen stoßen aneinander. | „01 · CODELINIEN“. Die 52 steht ohnehin im Zähler darunter. |
| Details | D05 (ZY-01), D06 (ZY-03, ZY-05), D07 (VH-04) | Die Trennlinie über dem Preis sitzt je nach Textlänge auf anderer Höhe, darunter ist eine Leerzone. Die Reihe wirkt unruhig. | Karte als `flex flex-col`, Datenblock `flex-1`, Trennlinie und Preiszeile `mt-auto`. Dann sitzen alle Preise einer Reihe auf einer Linie. |
| Details | D01, deaktivierter Rücksetzer | „Filter zurücksetzen“ in Blassgrau auf `text-body`-Größe liest sich wie ein Darstellungsfehler. | Erst bei aktivem Filter zeigen (siehe Komposition), sonst nicht rendern. |

**Das Stärkste**
- Die Mono-Datenzeilen CODEFORMAT und SCHLÜSSELTYP sowie Mono-Preise (D01–D09) machen jede Karte zum kleinen Datenblatt. Das ist „bemaßt statt behauptet“.
- Die Fundstellen-Sequenz (E1–E4) erklärt mit Kreis, Leitlinien und Lupe genau die Frage des Bereichs: Wo steht der Code?

#### Entscheidungen des Orchestrators
- **Kopf (Komposition 2, Bewegung):** `PageHeader visual` mit der Fundstellen-Grafik (vorhandene `CodeFundstelleInteraktiv` oder der Generator `code-fundstelle`), ohne Kartenrahmen; mobil steht sie nach der Einleitung. Der Hinweiskasten bleibt in den 7 Spalten.
- **Liste (Komposition 1, Farbe, Grafik 1, harter Treffer):** Die Codelinien werden nach Anwendungsfamilie gruppiert (Familie = Präfix der Kennung, etwa „MS“, mit dem vorhandenen Familiennamen aus den Daten, etwa „Möbel- und Büroschloss“). Je Gruppe eine Augenbraue („MS · MÖBEL- UND BÜROSCHLOSS“), darunter dichte Zeilen statt Karten: Kennung in Mono · Titel · Codeformat in Mono · Preis in Mono · Pfeil; Zeile `min-h-touch-lg`, Haarlinie `border-b`, die ganze Zeile ist der Link. **Keine Bildfläche** mehr in der Liste (die leeren Flächen mit Icon sind der harte Katalogtreffer). Mobil zeigt jede Gruppe zunächst höchstens 4 Zeilen und darunter einen Textknopf „Alle n anzeigen“ (Mikrotext, lokaler Anzeige-Zustand).
- **Titel (Typografie 1, 2):** Kennung als eigene Mono-Zeile; der Titel ohne „— Serie …“, wenn der Datentitel so endet (nur Anzeige, `text-balance`); Untertitel nur die Familie.
- **Augenbraue (Typografie 3):** „01 · Codelinien“ ohne zweite Zahl.
- **Filter (Komposition 3, Details 2):** „Filter zurücksetzen“ nur bei aktivem Filter; Zähler und „Filter anzeigen“ in einer Zeile.
- **Details 1** entfällt mit dem Listenaufbau.
- Suche, Filterlogik, Sortierung, Anzahl, Links und Preise bleiben gleich (nur andere Darstellung).
- **Schon erledigt durch den Orchestrator (E4-L-24 bis E4-L-27, nicht nachbauen):** gesperrte Knöpfe als ruhige Fläche; FlowShell (Zurück-Knopf mit Namen und auf Schritt 1 ausgeblendet, mobil einzeilig mit Schrittname, keine Glas-Effekte, klebende Leiste nur Titel und Balken, Hinweis „Zwischenstand“ nur für geladene Stände); Datei-Eingaben mit Namen und Beispielbild als Fachgrafik; Dateigrößen deutsch; Bereichstöne Code/Schließanlagen; Fundstelle (Leitlinien unter dem Schlüssel, Bewegung < 1,2 s); Tür-Schutzpunkte (Marke 4, Leitlinie 5); Schlüssel-Generator (Zeiten gestrafft, Notschlüssel im Smart Key, Signal ein Durchgang); Live-Schlüssel mit Rohling; Maßzeichnung im schmalen Format; Summenfarbe im Konfigurator; Warenkorbzeichen; Schriftfeld-Zusammenfassung (rechtsbündig, Kennungen ohne Umbruch, Prop `leer`); `PageHeader visual` als 7/5-Kopf; Warenkorb-Messwerte (Mindesthöhen von Lade- und Leerzustand nicht entfernen).
- **Texte mit Inhalt** (Abschnittstitel, Einleitungen, Floskeln wie „Wobei können wir helfen?“ oder „Präzise Handwerkskunst …“) änderst du nicht; der Orchestrator führt sie als Vorschläge. Mikrotexte (Linkwörter, Knopftexte, Etiketten, Typografie wie „z. B.“) darfst du ändern, mit Alt-Neu-Liste im Bericht.

## Maßstab
Muster: die Startseite `src/app/(site)/page.tsx` (Referenz: Schriftfeld, Stückliste, nummerierte Abschnitte, Fachgrafik auf Papier), die Bereichsseiten `src/app/(site)/sicherheitstechnik/page.tsx` und `src/app/(site)/tuer-und-schliesstechnik/page.tsx` (Leistungsraster mit Haarlinien und Fach-Icons, Hinweiskasten mit `GlyphInfo`, Abschnitt „Weiterlesen“ als Stückliste), `src/app/(site)/schluessel-nach-vorlage/page.tsx` (Fotoblätter, Schriftfeld im Kopf), die Arbeitsansichten `src/app/(site)/kasse/kasse-formular.tsx` und `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (nummerierte Abschnitte mit Mono-Ziffer und Haarlinie, Werte in Mono, Schriftfeld), `src/components/layout/page-header.tsx`, `src/components/layout/section.tsx`, `src/components/ui/button.tsx` (Prop `pfeil`). Bestandsaufnahme aller Dateien mit Zeilen: `_werkstatt/berichte/E5-KUNDSCHAFT.md` (lies deinen Abschnitt vollständig, auch „Auffälliges“; die Antworten des Orchestrators auf die Fragen stehen unten im Kern-Auszug). Bilder der Sichtabnahme: `/root/sm24-bilder/e4-b/` (Dateien `H05-…__<gerät>__<k>.jpg`, gefüllt: `gefuellt/`, Schritte: `schritte/`).

## Grenzen
- Nur die Dateien aus den Schreibrechten; andere Dateien liest du nur. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.
- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.
- Datenabruf, Filter- und Suchlogik, Sortierung, Hersteller-Platzhalter-Regel (`istPlatzhalter`), Preise und Linkziele bleiben gleich.

## Schritte
1. Lies den Befundteil, beide Dateien und die Bilder der Sichtabnahme.
2. Kopf, dann die Liste in `shop-liste.tsx` (Gruppierung als reine Anzeige über die vorhandenen Daten).
3. Schnellprüfung und Bilder (mobil, tablet, desktop, `--ganz`), dazu ein Bild mit aktivem Filter.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint "src/app/(site)/schluessel-nach-code/page.tsx" "src/app/(site)/schluessel-nach-code/shop-liste.tsx"` ohne Befund.
- `npx vitest run src/components src/lib` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs "src/app/(site)/schluessel-nach-code/page.tsx" "src/app/(site)/schluessel-nach-code/shop-liste.tsx"`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" "src/app/(site)/schluessel-nach-code/page.tsx" "src/app/(site)/schluessel-nach-code/shop-liste.tsx"`: kein Treffer.
- `grep -n "\[Platzhalter\|\[PLZ\]\|\[Ort\]" ` im gerenderten HTML deiner Seiten (`curl -s http://localhost:3001<pfad>`): kein sichtbarer Treffer außerhalb von Rechtstexten.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ganz --ziel /root/sm24-bilder/E5-BEFUND-H05 --json /root/sm24-bilder/E5-BEFUND-H05/bild-mobil.json`, dasselbe mit `--geraet tablet` und `--geraet desktop`. Pfade:
  - `/schluessel-nach-code`
- Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, keine leeren Flächen, Abstände gleichmäßig, benachbarte Abschnitte verschieden gebaut, Beschriftungen in Zeichnungen mobil lesbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E5-BEFUND-H05 · BEREIT ZUR RÜCKGABE ===
