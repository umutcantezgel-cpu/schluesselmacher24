E5-BEFUND-H10 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.10 · Schreibrechte (exakt): `src/app/(site)/warenkorb/page.tsx`, `src/app/(site)/warenkorb/warenkorb-ansicht.tsx` (Logikwächter) · JS-Budget: kein neues Client-JavaScript · Umfang: Befundpaket 1 von höchstens 2 für H10 Warenkorb

## Rollenbriefing
Du bist Baumeister. Du setzt Gestaltung nach KERN und Muster um, Datei für Datei. Häufige Fehler: freie Werte statt Tokens; Logik oder Props-Verträge anfassen; Bewegung ohne Registereintrag; Bewegung ohne reduzierte Variante. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Setze die Befunde für den Warenkorb um: Versandart links unter den Positionen, rechts nur Summe und Kasse; mobil eine eigene Leiste „Gesamtsumme · Zur Kasse“; Betrag neben dem Stepper; Hinweis als Zeile; das Positionsbild zeigt das Schlüsselprofil des Codes.

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
- **`warenkorb-ansicht.tsx` steht unter dem Logikwächter:** Ändere dort nur JSX im `return`, `className`-Werte, JSX-Texte und Importe aus `@/components/visual/` (dazu zählen Glyphen und Fach-Icons). Alles andere – Hooks, Zustände, Handler, Berechnungen, Konstanten, Zeichenketten außerhalb von JSX, Speicherschlüssel – bleibt Zeichen für Zeichen gleich. Prüfe mit `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen`. **Teil B** des Wächters zählt jeden Ausdruck in JSX (`{…}` in Kindern und Attributen außer `className`, `style` u. ä.); ein neuer Ausdruck wie `aussen={item.measureAMm}` oder `{name}` in einem `sr-only` meldet deshalb eine Abweichung. Das ist gewollt: Solche **reinen Anzeige-Ausdrücke** (nur Lesen vorhandener Werte, kein Aufruf mit Wirkung, kein Handler, keine neue Bedingung, die Logik verändert) sind erlaubt, wenn du **jeden einzelnen** wörtlich im Bericht unter GEMEINSAME DATEIEN als „Ausnahme Logikwächter: <Ausdruck> – <Zweck>“ aufführst. Der Orchestrator prüft sie und trägt sie als benannte Ausnahme in `_werkstatt/werkzeuge/logik-ausnahmen.json` ein; du änderst diese Datei nicht. Jede andere Abweichung (Teil A oder nicht gemeldete Ausdrücke) ist ein Fehler. Brauchst du eine Hilfsfunktion, schreibe sie nicht in die Datei, sondern melde sie im Feld GEMEINSAME DATEIEN.


### Befund und Entscheidungen für dieses Paket
#### Urteil der Sichtabnahme für H10 (Ansichtswert 6,0, Ziel ≥ 8)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Der Summenblock ist rechtsbündig in Mono, die Gesamtsumme 20,95 € gut gestuft (gefüllt desktop__01). „Weiter einkaufen“ bricht mit rund 44 px Lücke (desktop__01), und mobil hängt der Betrag lose unter dem Stepper (mobil__00). |
| Komposition | 5 | Links bleiben rund 650 px leer, rechts stapelt alles, und „Zur Kasse“ liegt unter der Falz (gefüllt desktop__00, __01). Mobil kommt der Knopf erst nach 1,5 Bildschirmhöhen, während die Leiste unten die globale Navigation zeigt (gefüllt mobil__00, __01). |
| Farbe und Bild | 6 | Das Positionsbild ist ein kleines Glyph auf grauer Fläche und wirkt wie ein Platzhalter (gefüllt desktop__00). Der blaue Hinweiskasten ist so groß wie die Summe (desktop__01). |
| Bewegung | 7 | Der Zähler-Pop (B-20) am Kopf passt. Ein Wechsel der Versandart ändert die Gesamtsumme aber ohne sichtbare Rückmeldung (gefüllt desktop__00/01). |
| Grafik | 5 | Der Code 0812 ist bekannt, trotzdem zeigt die Position kein Schlüsselprofil, obwohl der Live-Schlüssel-Generator existiert (gefüllt desktop__00). |
| Details | 6 | Die Einleitung „Prüfen Sie Ihre Positionen…“ steht auch im leeren Korb (desktop__00), im Leerzustand ein Einkaufswagen, im Kopf eine Tasche, und mobil steht „Position entfernen“ vor der Stückzahl. |

#### Befunde der Sichtabnahme (wörtlich, `_werkstatt/berichte/E4-L-23-sichtabnahme-arbeit.md`)

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | gefuellt/warenkorb-gefuellt__desktop__00 und __01 | Unter der einzigen Position bleiben links rund 650 px leer. Rechts stapeln Versandart, Summe, Knopf und Hinweis, „Zur Kasse“ liegt bei 1440 × 900 unter der Falz. | Versandart in die linke Spalte unter die Positionen (`lg:col-span-8`). Rechts `lg:col-span-4` nur Summe, „Zur Kasse“ und Hinweis, `sticky top-24`. |
| Komposition | gefuellt/warenkorb-gefuellt__mobil__00 und __01 | „Zur Kasse“ erscheint erst nach 1,5 Bildschirmhöhen, die Aktionsleiste zeigt Autoschlüssel/Nach Code/Termin/Service. | Im gefüllten Warenkorb mobil die Aktionsleiste ersetzen durch „Gesamtsumme 20,95 € · Zur Kasse“ (`min-h-touch-lg`, Betrag Mono), wie die Weiter-Leiste der Abläufe. |
| Komposition | H10-warenkorb__desktop__00, Leerzustand | Die Leerkarte läuft über die volle Breite mit Inhalt im linken Drittel. Darunter wiederholt „Passend dazu“ dieselben zwei Ziele. | Leerkarte `lg:col-span-8`, „Passend dazu“ als Haarlinienliste rechts in `lg:col-span-4` statt als eigener Abschnitt. |
| Typografie | gefuellt/warenkorb-gefuellt__desktop__01 y 625–670 | „Weiter einkaufen: Schlüssel nach Code oder / Zylinder-Konfigurator.“ bricht mit rund 44 px Zeilenabstand. | Links `inline`, Touch-Höhe nur über vertikales Padding am Link. Oder zwei Haarlinienzeilen mit Pfeil (B-06). |
| Typografie | gefuellt/warenkorb-gefuellt__mobil__00 y 740–775 | „8,00 € je Stück“ und „16,00 €“ stehen linksbündig unter dem Stepper, losgelöst von der Menge. | Eine Zeile: Stepper links, Betrag `text-right` Mono rechts, der Einzelpreis `text-caption` darunter. |
| Farbe und Bild | gefuellt/warenkorb-gefuellt__desktop__01 y 395–565 | Der blaue Hinweiskasten „Hinweis zur Preisberechnung“ ist fast so groß wie der Summenblock und zieht den Blick vom Knopf. | Als `text-small text-foreground-muted` Zeile mit `GlyphInfo` unter den Knopf, ohne Fläche. |
| Bewegung | gefuellt/warenkorb-gefuellt__desktop__00/01, Gesamtsumme | Ein Wechsel der Versandart ändert „Versand“ und „Gesamtsumme“ ohne Rückmeldung. | B-20 (`sm24-pop`, `quick`) auf die Gesamtsumme anwenden. Die Registererweiterung beschließt der Orchestrator. |
| Grafik | gefuellt/warenkorb-gefuellt__desktop__00, Positionsbild (x 132–248, y 467–581) | Ein kleines Glyph auf grauer Fläche wirkt wie ein Platzhalter, obwohl der Code bekannt ist. | Das Schlüsselprofil deterministisch aus dem Live-Schlüssel-Generator mit Code 0812 auf `surface-sunken` mit Raster 30. Mobil das gleiche Bild 64 px links vom Titel. |
| Details | H10-warenkorb__desktop__00, mobil__00 | Die Einleitung „Prüfen Sie Ihre Positionen, wählen Sie die Versandart…“ steht auch über dem leeren Korb. | Die Einleitung im Leerzustand ausblenden, der Leertext steht ohnehin in der Karte. |
| Details | H10-warenkorb__desktop__00, Leer-Icon gegen Kopf-Icon | Der Leerzustand zeigt einen Einkaufswagen, der Kopf eine Tasche: zwei Bilder für denselben Korb. | Fach-Icon `warenkorb` und `GlyphWarenkorb` auf dieselbe Form bringen (Tasche). |
| Details | gefuellt/warenkorb-gefuellt__mobil__00 y 590–615 | „Position entfernen“ steht vor der Stückzahl, die seltene, zerstörende Handlung also vor der häufigen. | Ans Ende der Position, `text-small text-foreground-muted`, mit `GlyphPapierkorb`. |

**Das Stärkste**
- Der Summenblock: Zwischensumme, Versand und Gesamtsumme rechtsbündig in Mono mit USt-Zeile (gefüllt desktop__01).
- Die Versandarten als ruhige Optionskarten mit Mono-Preisen (gefüllt desktop__00).

#### Entscheidungen des Orchestrators
- **Desktop (Komposition 1):** Positionen und Versandart in `lg:col-span-8`; rechts `lg:col-span-4` nur Summe, „Zur Kasse“ und Hinweis, `lg:sticky lg:top-28 lg:self-start`.
- **Mobil (Komposition 2):** Bei gefülltem Warenkorb unter `md` eine feste Leiste unten mit „Gesamtsumme <Betrag> · Zur Kasse“ (`min-h-touch-lg`, Betrag Mono). Die Leiste trägt `data-eigene-leiste`; die globale Aktionsleiste blendet sich dann selbst aus (globals.css). Der Inhalt bekommt unten Platz (`pb-*`). Die wiederholten Ausdrücke (Betrag, Link) melden.
- **Leerzustand (Komposition 3):** Leerkarte `lg:col-span-8`, „Passend dazu“ rechts als Haarlinienliste in `lg:col-span-4` (`page.tsx` + Ansicht; Mindesthöhen der Karten nicht entfernen).
- **Links (Typografie 1):** „Weiter einkaufen: …“ als zwei Haarlinienzeilen mit Pfeil oder Links `inline`.
- **Betrag mobil (Typografie 2):** eine Zeile: Stepper links, Betrag rechts in Mono, Einzelpreis `text-caption` darunter.
- **Hinweis (Farbe):** „Hinweis zur Preisberechnung“ als `text-small text-foreground-muted`-Zeile mit `GlyphInfo` unter dem Knopf, ohne Fläche.
- **Gesamtsumme (Bewegung, B-20):** `key` am Wert und `animate-schleier-ein`.
- **Positionsbild (Grafik):** Für Code-Positionen statt des kompakten Symbols das Profil aus `SchluesselGrafik` mit dem Code der Position (`{ typ: 'zylinder', code }`) auf `surface-sunken`; mobil 64 px links vom Titel. Zylinder-Positionen behalten ihr Bild.
- **„Position entfernen“ (Details 3):** ans Ende der Position, `text-small text-foreground-muted` mit `GlyphPapierkorb`.
- **Nicht umsetzen:** Details 1 (die Einleitung steht im Server-Kopf, der den Inhalt des Warenkorbs nicht kennt), Details 2 (erledigt).
- **Schon erledigt durch den Orchestrator (E4-L-24 bis E4-L-27, nicht nachbauen):** gesperrte Knöpfe als ruhige Fläche; FlowShell (Zurück-Knopf mit Namen und auf Schritt 1 ausgeblendet, mobil einzeilig mit Schrittname, keine Glas-Effekte, klebende Leiste nur Titel und Balken, Hinweis „Zwischenstand“ nur für geladene Stände); Datei-Eingaben mit Namen und Beispielbild als Fachgrafik; Dateigrößen deutsch; Bereichstöne Code/Schließanlagen; Fundstelle (Leitlinien unter dem Schlüssel, Bewegung < 1,2 s); Tür-Schutzpunkte (Marke 4, Leitlinie 5); Schlüssel-Generator (Zeiten gestrafft, Notschlüssel im Smart Key, Signal ein Durchgang); Live-Schlüssel mit Rohling; Maßzeichnung im schmalen Format; Summenfarbe im Konfigurator; Warenkorbzeichen; Schriftfeld-Zusammenfassung (rechtsbündig, Kennungen ohne Umbruch, Prop `leer`); `PageHeader visual` als 7/5-Kopf; Warenkorb-Messwerte (Mindesthöhen von Lade- und Leerzustand nicht entfernen).
- **Texte mit Inhalt** (Abschnittstitel, Einleitungen, Floskeln wie „Wobei können wir helfen?“ oder „Präzise Handwerkskunst …“) änderst du nicht; der Orchestrator führt sie als Vorschläge. Mikrotexte (Linkwörter, Knopftexte, Etiketten, Typografie wie „z. B.“) darfst du ändern, mit Alt-Neu-Liste im Bericht.

## Maßstab
Muster: die Startseite `src/app/(site)/page.tsx` (Referenz: Schriftfeld, Stückliste, nummerierte Abschnitte, Fachgrafik auf Papier), die Bereichsseiten `src/app/(site)/sicherheitstechnik/page.tsx` und `src/app/(site)/tuer-und-schliesstechnik/page.tsx` (Leistungsraster mit Haarlinien und Fach-Icons, Hinweiskasten mit `GlyphInfo`, Abschnitt „Weiterlesen“ als Stückliste), `src/app/(site)/schluessel-nach-vorlage/page.tsx` (Fotoblätter, Schriftfeld im Kopf), die Arbeitsansichten `src/app/(site)/kasse/kasse-formular.tsx` und `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (nummerierte Abschnitte mit Mono-Ziffer und Haarlinie, Werte in Mono, Schriftfeld), `src/components/layout/page-header.tsx`, `src/components/layout/section.tsx`, `src/components/ui/button.tsx` (Prop `pfeil`). Bestandsaufnahme aller Dateien mit Zeilen: `_werkstatt/berichte/E5-KUNDSCHAFT.md` (lies deinen Abschnitt vollständig, auch „Auffälliges“; die Antworten des Orchestrators auf die Fragen stehen unten im Kern-Auszug). Bilder der Sichtabnahme: `/root/sm24-bilder/e4-b/` (Dateien `H10-…__<gerät>__<k>.jpg`, gefüllt: `gefuellt/`, Schritte: `schritte/`).

## Grenzen
- Nur die Dateien aus den Schreibrechten; andere Dateien liest du nur. Gemeinsame Dateien (`globals.css`, `tailwind.config.ts`, `cn.ts`, Registry, Layout) nie ändern; Wünsche ins Feld GEMEINSAME DATEIEN.
- **Props-Verträge bleiben gleich** (Namen, Typen, Standardwerte), außer wo das Paket ausdrücklich eine Ergänzung nennt. Alle Aufrufer müssen ohne Änderung weiter funktionieren.
- Hooks, Handler, Zustände, Speicherschlüssel, Texte mit Inhalt und `aria-*`-Bedeutungen bleiben gleich, außer das Paket nennt eine Änderung.
- Bestehende Tests nie lockern oder löschen. Ändert sich Markup, das ein Test prüft, passe den Test nur mit Alt-Neu-Liste im Bericht an; die Zahl der Prüfungen sinkt nie.
- Keine neuen Abhängigkeiten, kein `lucide-react` mehr in deinen Dateien.
- Vor `tsc`, `vitest` und Bildern: Besteht `/tmp/sm24-messfenster.lock`, läuft gerade eine Messung. Arbeite dann an den Dateien weiter und prüfe später; nie während der Sperre bauen, testen oder fotografieren.
- `AGENTS.md` kann sich durch den Entwicklungsserver ändern; ignoriere das.
- **Nie Dateien löschen** (`rm`, Überschreiben fremder Dateien): Löschbefehle warten auf eine Freigabe, die in diesem Lauf niemand erteilt, und halten das Paket an. Falsche eigene Ausgaben bleiben liegen; schreibe neue in einen neuen Ordner und nenne beide im Bericht.
- Hooks, Store, automatische Versandwahl, Mengenlogik, Preise, Speicherschlüssel und Texte mit Inhalt bleiben gleich.

## Schritte
1. Lies den Befundteil, beide Dateien und die Bilder `gefuellt/warenkorb-gefuellt__*`.
2. Nur JSX/`className` in der Ansicht; jeden neuen Anzeige-Ausdruck melden.
3. Schnellprüfung, Logikwächter, Bilder mit gefülltem Warenkorb: `SM24_BASIS_URL=http://localhost:3001 node _werkstatt/werkzeuge/gefuellt.mjs --ziel /root/sm24-bilder/E5-BEFUND-H10/gefuellt`, dazu der Leerzustand mit `bild.mjs`.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx tsc --noEmit` ohne Fehler; `npx eslint "src/app/(site)/warenkorb/page.tsx" "src/app/(site)/warenkorb/warenkorb-ansicht.tsx"` ohne Befund.
- `npx vitest run src/components src/lib` grün (Zahl nennen).
- `node _werkstatt/werkzeuge/werte-suche.mjs "src/app/(site)/warenkorb/page.tsx" "src/app/(site)/warenkorb/warenkorb-ansicht.tsx"`: null Funde, oder jeder verbliebene Fund ist im Bericht begründet.
- `grep -n "lucide-react" "src/app/(site)/warenkorb/page.tsx" "src/app/(site)/warenkorb/warenkorb-ansicht.tsx"`: kein Treffer.
- `grep -n "\[Platzhalter\|\[PLZ\]\|\[Ort\]" ` im gerenderten HTML deiner Seiten (`curl -s http://localhost:3001<pfad>`): kein sichtbarer Treffer außerhalb von Rechtstexten.
- Bilder: Entwicklungsserver auf Port 3001 (läuft; falls nicht: melden, nicht selbst starten). `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs <pfad> --geraet mobil --ganz --ziel /root/sm24-bilder/E5-BEFUND-H10 --json /root/sm24-bilder/E5-BEFUND-H10/bild-mobil.json`, dasselbe mit `--geraet tablet` und `--geraet desktop`. Pfade:
  - `/warenkorb`
- Sieh dir jedes Bild an (Read) und prüfe: nichts abgeschnitten, kein Überlauf, keine leeren Flächen, Abstände gleichmäßig, benachbarte Abschnitte verschieden gebaut, Beschriftungen in Zeichnungen mobil lesbar.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E5-BEFUND-H10 · BEREIT ZUR RÜCKGABE ===
