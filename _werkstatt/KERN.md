# KERN · SCHLÜSSELMACHER24 · Version 1.14

Quelle der Wahrheit für alle Pakete. Änderungen nur durch den Orchestrator, mit Versionsnummer und Grund (Änderungsliste am Ende). „(Annahme)“ = abgeleitet, nicht belegt.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## K-001 Leitidee
> **SCHLÜSSELMACHER24 sieht aus wie eine saubere Werkstattzeichnung: helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift – und an den entscheidenden Stellen fräst eine Linie sichtbar das Profil, damit man Genauigkeit sieht, bevor man sie liest.**

- **Herleitung:**
  - Marke: Fachbetrieb mit eigener Werkstatt, ausdrücklich keine Notdienst-Optik.
  - Angebot: Schlüssel sind Profile mit Einschnitten, Zylinder haben Maße, Anlagen haben Pläne.
  - Zielgruppe: Menschen wollen vor dem Kauf verstehen und sicher sein.
  - Vorhandenes System: Plex Mono, Bemaßung und Raster in den Generatoren, Stahlblau.
- **Austauschprobe:** Ein Notdienst wirbt mit Schnelligkeit (Gelb und Schwarz, Telefonnummer). Ein Möbel- oder Technikshop hat keine Schlüsselprofile, Zylindermaße oder Schließpläne. Die Profillinie entsteht aus echten Einschnitt-Regeln. Damit gehört die Idee nur diesem Angebot.

## K-002 Marke, Zielgruppe, Hauptaufgaben
- **Marke (Annahme):** sachlich, nachvollziehbar, ohne Überraschungen; erst prüfen, dann buchen; jeder Vorgang bekommt eine Nummer.
- **Zielgruppen (Annahme):**
  1. Privatleute mit Auto, die einen Zweit- oder Ersatzschlüssel brauchen, meist mobil und unter leichtem Zeitdruck.
  2. Mieter, Eigentümer und kleine Betriebe, die Schlüssel nach Code oder Vorlage oder gleichschließende Zylinder bestellen.
  3. Hausverwaltungen, Gewerbe und Bauherren, die Schließanlagen, Zutritt und Sicherheitstechnik planen.
- **Hauptaufgaben:**
  1. Autoschlüssel-Termin mit Anzahlung buchen
  2. Schlüssel nach Code bestellen und bezahlen
  3. Zylinder konfigurieren und kaufen
  4. Schlüssel nach Vorlage anfragen
  5. Schließanlagen-Projekt erfassen
  6. Terminstatus prüfen

## K-003 Gestaltungsprinzipien (Tun · Lassen)
1. **Bemaßt statt behauptet.** Tun: Zahlen, Maße, Schritte und Fristen sichtbar und in Mono setzen (Anzahlung, Vorlauf, Maß A/B, Vorgangsnummer). Lassen: Superlative und Floskeln wie „nahtlos“, „innovativ“ oder „Entdecken Sie …“; erfundene Kennzahlen; hochzählende Zahlen.
2. **Eine Linie, die schneidet.** Tun: Die Profillinie ist das einzige wiederkehrende Ornament (Trenner, Unterstrich der Augenbrauen-Zeile, Hero). Lassen: Verläufe, Glas, Leuchtkugeln, Partikel, Schatten als Effekt.
3. **Der Bereich zeigt Farbe, die Marke bleibt Stahlblau.** Tun: Die Akzentfarbe (`area`) gilt nur im Bereichskontext (Kachel, Kopf, Grafik); Aktionen bleiben `primary`. Lassen: Farbe als Fläche ohne Bedeutung, Signalfarben als Markenfläche.
4. **Erzählen, wo man wählt – ruhig, wo man arbeitet.** Tun: Erzählansichten haben je Bildschirmhöhe einen Blickfang und einen großen Moment; Arbeitsansichten sind dicht, ruhig und schnell. Lassen: Inszenierung in Formularen, Kasse, Warenkorb oder Rechtstexten.
5. **Werkstückkanten.** Tun: 1-px-Haarlinien, kleine Radien, Tiefe durch Flächenstufen (`surface` → `surface-muted` → `surface-sunken`); Raster mit bewussten Brüchen (asymmetrische Spalten, Grafik ragt aus der Spalte). Lassen: gleichförmige Kartenraster als vorherrschendes Muster, drei gleich gebaute Abschnitte in Folge, zentrierte Überschrift mit zwei Knöpfen vor leerem Hintergrund.
6. **Mobil ist eine eigene Komposition.** Tun: Daumenzone, Aktionsleiste, Ziele ab 44 px, horizontale Leisten statt gestapelter Kachelwüsten, kürzere Texte zuerst. Lassen: ein verkleinerter Desktop.
7. **Bewegung erklärt Mechanik.** Tun: Fräsen, Schließen, Signal und Ablauf zeigen; höchstens ein gewichtiger Auftritt je Bildschirmhöhe. Lassen: Bewegung als Dekoration, Dauerbewegung, Zeiger-Effekte auf Touch.
- **GESCHMACK:** keine Vorgaben (Standard).

## K-004 Stack und Konventionen
- **Stack:**
  - Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript strict, Tailwind CSS 3.4
  - Payload 3.90 auf Postgres; ohne `DATABASE_URL` oder mit `SM24_DATA=json` gilt der JSON-Adapter auf `content/`
  - Vitest 2 (Umgebung `node`, ohne DOM), ESLint 9 mit `eslint-config-next`
  - Schriften über `next/font/google`: IBM Plex Sans (Display), Inter (Text), IBM Plex Mono. Sie werden beim Build selbst gehostet.
- **Struktur:** `src/app/(site)` (Website), `src/app/(payload)` (Backend, ausgenommen), `src/components/<bereich>/`, `src/lib/`, `src/components/visual/` (Icons, Glyphen, Generatoren, Bewegung).
- **Konventionen:**
  - Dateinamen in kebab-case, benannte Exporte, Server-Komponenten als Standard; `'use client'` nur, wo nötig.
  - Klassen über `cn()` aus `src/lib/cn.ts`; deutsche Kommentare und Texte.
  - Commits `typ(scope): Beschreibung [Paketkennung]`.
  - Keine Sammeldateien (`index.ts`) in `components/visual`.
  - Generatoren deterministisch und mit Test.
  - Tests liegen neben der Quelle (`*.test.ts(x)`, `renderToStaticMarkup`).
- **Next-16-Besonderheiten:** `params` und `searchParams` sind Promises. Es gibt keine `proxy.ts` und keine experimentellen Flags.

### K-004a Belegte Technikfakten (E0-KUNDSCHAFTER-06, `_werkstatt/berichte/E0-KUNDSCHAFTER-06-next16.md`)
- **ViewTransition:**
  - Der App Router braucht keinen Schalter. Import über `import { ViewTransition } from 'react'`: Next bindet sein eigenes React-Canary ein, das `ViewTransition` exportiert. Typen nur über `react/canary`; dafür gibt es eine Typreferenz in einer `.d.ts`.
  - Reduzierte Bewegung regelt CSS (`::view-transition-*` unter `prefers-reduced-motion`).
- **Fehlerseiten:** `error.tsx` und `global-error.tsx` sind Client-Komponenten mit den Props `error` und `retry` (stabil seit 16.3). `not-found.tsx` hat keine Props.
- **tailwind-merge 3.6:** Eine unbekannte `text-<wort>`-Klasse gilt als Textfarbe. Erweiterung über `extendTailwindMerge({ extend: { theme: { text: […], shadow: […] }, classGroups: { z: […], 'min-h': […], duration: […], ease: […] } } })`, immer `extend`, nie `override`.
- **Prüfweg:** Build-Gate `SM24_DATA=json npx next build`, Server `_werkstatt/werkzeuge/server.sh start` (D-001).

## K-005 Designsystem mit Erweiterungen
Werte als CSS-Variablen in `src/app/(site)/globals.css`, als Tailwind-Klassen in `tailwind.config.ts`. **Nie Einzelwerte im Code** (keine `text-[13px]`, `min-h-[44px]`, `#hex`).

- **Farben (Bestand, bleiben):**
  - Flächen: `background`, `surface`, `surface-muted`, `surface-sunken`, `surface-ink`.
  - Text: `foreground`, `foreground-muted`, `foreground-subtle`, `foreground-inverse`.
  - Linien: `border`, `border-strong`, `input`, `ring`.
  - Aktion und Akzent: `primary` (+ `hover`, `soft`, `foreground`), `secondary`, `accent`.
  - Status: `success`, `warning`, `danger`, `info`, jeweils mit `-soft`.
  - Bereich: `area`, `area-strong`, `area-soft`, `area-muted`, `area-foreground`, gesetzt über `[data-area]`.
  - Kontraste prüft `src/lib/visual/area-theme.test.ts`.
  - `foreground-subtle` nie auf `surface-sunken` (dort unter 4,5:1); Nummern, Etiketten und Fußtexte stehen dort in `foreground-muted`.
  - Etiketten unter Karten- und Listentiteln (Ablaufart, „Direkt kaufen“, Themen) stehen in `foreground-muted`. Die Bereichsfarbe bleibt Augenbraue, Marke und Grafik vorbehalten.
- **Typoskala (neu, fließend 390 → 1440 px), Tailwind `fontSize`:**

| Token | Mobil → Desktop | Zeilenhöhe | Einsatz |
|---|---|---|---|
| `text-caption` | 12 px | 1,4 | Bemaßung, Meta, Augenbrauen-Zeile (Großbuchstaben, Sperrung 0,12em) |
| `text-small` | 13 → 14 px | 1,5 | Hilfstexte, Kartenmeta, Tabellen |
| `text-body` | 15 → 16 px | 1,6 | Fließtext |
| `text-eingabe` | 16 px | 1,5 | Eingabefelder (kein Zoom auf iOS; nicht `text-input`, das ist die Rahmenfarbe) |
| `text-lead` | 17 → 19 px | 1,55 | Einleitungen |
| `text-title-sm` | 16 → 18 px | 1,35 | Karten- und Feldtitel |
| `text-title` | 19 → 22 px | 1,3 | h3 |
| `text-headline` | 26 → 36 px | 1,15, Sperrung −0,015em | h2 |
| `text-display` | 34 → 60 px | 1,04, Sperrung −0,025em | h1 auf Erzählansichten |

- `text-display` wird mobil am längsten Wort geprüft. h1 auf Arbeitsansichten nutzt `text-headline`.
- **Abstände:**
  - Grundraster ist die Tailwind-Skala (4-px-Schritte).
  - Neu: `py-section` (56 → 104 px fließend) und `py-section-tight` (40 → 64 px); `gap-gutter` (20 → 32 px).
  - Messbreite: `max-w-measure` (68ch) für Fließtext.
- **Radien:** `--radius` 0,625 rem. Daraus folgen `rounded-lg` 10 px, `rounded-md` 6 px und `rounded-sm` 4 px; kleinere Radien heißt Werkstückkanten. `rounded-full` bleibt Punkten und Plaketten vorbehalten.
- **Schatten:** `shadow-raised` (gehobene Karte beim Hover) und `shadow-overlay` (Menüs, Drawer); Farbe aus `--shadow-color`. Sonst keine Schatten.
- **Ebenen (z-index):** `z-raised` 10 · `z-sticky` 30 · `z-header` 40 · `z-overlay` 50 · `z-drawer` 60 · `z-skip` 70.
- **Touch-Ziele:** `min-h-touch`/`min-w-touch` 44 px, `min-h-touch-lg` 52 px. Knopfgrößen: `sm` 40 px nur am Desktop neben anderen Bedienelementen, `md` 44 px, `lg` 52 px.
- **Dauern und Kurven:** siehe K-007.
- **Kein Dunkelmodus:** Das Projekt hat keinen (D-003). `darkMode` bleibt wirkungslos.
- **Sperrung:** `tracking-label` (0,12em) für Großbuchstaben-Zeilen; sonst Tailwind-Standard (`tracking-tight` usw.).

### K-005a Umrechnungstabelle freie Werte → Tokens (für alle Pakete)
| Frei | Token | Hinweis |
|---|---|---|
| `text-[10px]`, `text-[11px]`, `text-[12px]` | `text-caption` | mindestens 12 px; Großbuchstaben-Zeilen zusätzlich `uppercase tracking-label` |
| `text-[13px]`, `text-[14px]` | `text-small` | |
| `text-[15px]`, `text-[16px]` | `text-body` | |
| `text-[17px]`, `text-lg` als Titel | `text-title-sm` | Fließtext-Einleitung stattdessen `text-lead` |
| `text-xl` als Abschnitts- oder Kartentitel | `text-title` | |
| h2 `text-2xl md:text-3xl` | `text-headline` | |
| h1 `text-[1.75rem]`, `text-[2rem] md:text-5xl` | `text-display` (Erzählansicht) oder `text-headline` (Arbeitsansicht) | |
| Eingabefelder `text-[15px]` | `text-eingabe` | 16 px, kein Zoom auf iOS |
| `tracking-[0.14em]`, `tracking-wider` bei Großbuchstaben | `tracking-label` | |
| `min-h-[40px]` … `min-h-[48px]` | `min-h-touch` | |
| `min-h-[52px]`, `min-h-[56px]` | `min-h-touch-lg` | |
| `min-w-[1rem]` u. ä. | Tailwind-Skala (`min-w-4`) | |
| `w-[min(24rem,100%)]` | `w-full max-w-sm` | |
| `shadow-[…]`, `shadow-lg` | `shadow-raised` (Karte) oder `shadow-overlay` (Menü, Drawer) | |
| `z-[60]`, `z-50`, `z-40` | `z-skip`, `z-overlay`/`z-drawer`, `z-header` | |
| `grid-cols-[1.1fr_1fr]` u. ä. | Zwölfer-Raster `lg:grid-cols-12` + `lg:col-span-*` | |
| Positionen wie `-left-[38px]` | Aufbau mit Flex/Grid und Tailwind-Skala | |
| `transition-[width]` | `transition-transform` + `scaleX` | |
| `duration-300`, `duration-150` | `duration-base`, `duration-quick` | |
| `#hex`, `rgb()`, `rgba(var(--…))` | Farbtoken (`text-*`, `bg-*`, `border-*`) | |
| `py-14 md:py-20` (Abschnitt) | `py-section`; eng: `py-section-tight` | |

Für jeden Wert ohne passenden Token gilt: ins Feld GEMEINSAME DATEIEN schreiben, nie frei lassen.
- **`cn()`:** `extendTailwindMerge` kennt alle neuen Gruppen (Größe, Schatten, Ebene, Dauer, Kurve, Mindesthöhe), damit `cn('text-small', 'text-foreground-muted')` beide Klassen behält.

## K-006 Typografie und Komposition
- **Schriften:** Display IBM Plex Sans (600/700), Text Inter (400–600), Zahlen, Maße und Kennungen in IBM Plex Mono (`font-mono`, `tabular-nums`). Keine neuen Schriften.
- **Hierarchie:** pro Ansicht genau eine h1. Abstand Display zu Fließtext mindestens Faktor 2,2. Fließtext höchstens `max-w-measure`. Silbentrennung `hyphens: auto` für Fließtext (`lang="de"` ist gesetzt), nie für Überschriften unter `text-headline`.
- **Augenbrauen-Zeile (`.eyebrow`):** `text-caption`, Mono, Großbuchstaben, davor eine Bemaßungsmarke statt eines Strichs, optional eine laufende Nummer („01“). Darunter darf die Profillinie stehen.
- **Raster:**
  - `shell` (1240 px, Rand 20/24/32 px).
  - Erzählansichten nutzen asymmetrische Zwölfer-Teilungen (7/5, 5/7, 8/4) und lassen Grafiken über die Spalte hinausragen.
  - Benachbarte Abschnitte wechseln Struktur und Dichte (Liste ↔ Grafik ↔ Text).
- **Blickfang:** je Bildschirmhöhe einer (eine Grafik, eine Zahl oder eine Überschrift).
- **Mobil:** eigene Reihenfolge (Handlung vor Erklärung), horizontale Scroll-Leisten mit sichtbarem Anschnitt statt langer Kachelstapel, Aktionsleiste unten.
  - Scroll-Leisten mit `snap-x` brauchen `scroll-px-*` passend zum Rand der `shell` (`scroll-px-5 sm:scroll-px-6`), sonst rastet die erste Karte am Bildschirmrand ein.
  - Große Zeichnungen zeigen unter 640 px einen Ausschnitt (`.sm24-ausschnitt` über `ImagePlaceholder ausschnitt` oder `ausschnittStil()` an einer Hülle, deren direktes Kind das SVG ist). Ziel: Beschriftungen ab 12 px, keine seitlich scrollenden Grafiken.
  - Kennzahlen im Schriftfeld behalten auch mobil `text-title-sm`; passt die Zeile nicht, bekommt das wichtigste Feld eine eigene Zeile.
- **Fuß:** Schriftfeld auf `surface-sunken`; der Abstand für die mobile Aktionsleiste (`pb-safe-nav`) sitzt im Fuß, nicht in `main`.
- **Muster aus der Sichtabnahme E4-L-23 (seit 1.10, gelten für alle Ansichten):**
  - **Kopf mit Blickfang:** Erzählansichten setzen ihre Fachgrafik über `PageHeader visual` in den Kopf (7/5; mobil Kopf → Grafik → Aktion). Die Grafik steht ohne Kartenrahmen auf Papier oder auf `bg-area-soft/40`; der große Moment der Ansicht liegt damit in der ersten Bildschirmhöhe. Das Bereichs-Icon bleibt klein neben der Augenbraue (B-13).
  - **Leiste statt Stapel:** Mehr als drei gleichartige Karten werden mobil eine Leiste mit Anschnitt (Muster Startseite „Bestellen ohne Termin“: `-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid … md:overflow-visible md:px-0 scroll-px-5 sm:scroll-px-6 md:scroll-px-0`, Karte `shrink-0 basis-3/4 snap-start md:basis-auto`).
  - **Ordnung durchziehen:** Jeder Abschnitt hat Augenbraue und laufende Nummer (`SectionHeading nummer`), auch „Weiterlesen“ und „Fragen“.
  - **Keine Linkwörter:** „Zur Seite“, „Ansehen“, „Leistungsdetails“, „… erkunden“ entfallen; die ganze Zeile oder Karte ist der Link, rechts nur `GlyphPfeilRechts` mit B-06.
  - **Links im Satz** bleiben `inline` (ohne `inline-flex` und `min-h-touch`; WCAG 2.5.8 nimmt sie aus), sonst reißen Zeilen auf.
  - **Hauptknöpfe mobil einzeilig:** kürzerer vorhandener Wortlaut oder `w-full justify-between text-left`.
  - **Werte:** Beträge, Maße, Kennungen und Tabellenwerte in `font-mono tabular-nums`, Summen rechtsbündig, Endsummen in Textfarbe (Primärblau nur für Aktionen).
  - **Flächen sparsam:** Hinweise ohne eigenen Anlass als Zeile mit Glyphe statt getönter Kasten; Warnungen höchstens 8 Spalten, `surface` mit 2-px-Leiste links in Warnfarbe.
- **Kleinregeln aus der Sichtabnahme E5-L-29 (seit 1.14, gelten für alle Ansichten):**
  - **Zeilenpfeil:** `GlyphPfeilRechts` in ganzen Link-Zeilen und -Karten steht in Ruhe in `text-foreground-muted`, bei Hover und Tastaturfokus der Zeile in `text-primary` (`group-hover:text-primary group-focus-visible:text-primary`), in Bereichskacheln in `text-area-strong`; Bewegung B-06 (`zeiger:group-hover:translate-x-1 duration-quick ease-standard`). Pfeile in Textlinks („Alle Leistungen“, Etiketten) behalten die Linkfarbe.
  - **Primärblau nur für Aktionen und Links:** Nicht klickbare laufende Nummern, Stationen, Zähler und Kennungen stehen in `text-foreground` (Augenbrauen behalten die Bereichsfarbe).
  - **Schriftfeld:** Wortwerte in Inter `text-title-sm font-semibold`, Mono nur für Zahlen, Maße, Beträge und Kennungen.
  - **Zahl und Einheit untrennbar:** geschütztes Leerzeichen, im Quelltext als Escape `\u00a0` (in Template-Literalen `\xa0`), nie als `&nbsp;` in einer Zeichenkette.
  - **Kein Rahmen im Rahmen:** Auswahlen in einer Fläche als Liste (`Auswahlgruppe liste` + `OptionCard zeile`) oder als Karten direkt auf `bg-background`, nicht als Karten in einer Karte. Preise in Optionslisten als rechte Spalte (`OptionCard metaSpalte`).
  - **Leere Zustände von Warenkorb und Kasse:** gleicher Bau, Rohling-Zeichnung (`schluessel` mit `rohling: true`, `w-40`, `sm24-ruhig`, ohne Rahmen); die Einleitung des Kopfes blendet im Leerzustand aus (`PageHeader leadClassName="korb-leer:hidden"`). Ein Summenbegriff: „Gesamtbetrag“.
  - **Akkordeon:** Die Antwort folgt `max-w-measure` mit Silbentrennung (im Baustein gesetzt), die Fläche bleibt breit.
  - **Abläufe (`FlowShell`):** Das klebende Band zeigt auf allen Breiten „Schritt n von m · Name“ über die ganze Shell; der Ablauftitel steht nur in der h1. Ab 768 px stehen Zurück und Weiter in einer Zeile, Weiter rechtsbündig in Inhaltsbreite. Lange Abläufe setzen ab 1024 px `raster="seite"` (Schritt 8 Spalten, klebende Seite mit senkrechter Schrittliste und `seite`-Zusatz 4 Spalten). Eine laufende Summe kommt über `summe` (mobil links in der Leiste wie im Warenkorb, ab 768 px rechts im Band). Im laufenden Ablauf ist „Weiter“ die einzige Hauptaktion; der Kopfknopf blendet aus (`data-kopfknopf`).
  - **Maße der Zylinder** heißen überall „Maß A“ (außen) und „Maß B“ (innen), auch in Zeichnungen.


## K-007 Bewegungssystem und Register
- **Dauern** (CSS-Variablen `--dauer-*`, Tailwind `duration-*`): `instant` 120 ms · `quick` 180 ms · `base` 280 ms · `slow` 400 ms · `enter` 600 ms · `scene` 900 ms. Ein großer Moment dauert höchstens 1,6 s gesamt.
- **Kurven** (`--kurve-*`, Tailwind `ease-*`):
  - `standard` cubic-bezier(0.2, 0, 0, 1)
  - `enter` cubic-bezier(0.16, 1, 0.3, 1)
  - `exit` cubic-bezier(0.4, 0, 1, 1)
  - `draw` cubic-bezier(0.65, 0, 0.35, 1)
- **Animiert werden nur** `transform` und `opacity`. Erlaubt sind außerdem `stroke-dashoffset`, Masken und `clip-path` (`sm24-aufdecken`) für Linien und Flächen, die sich zeichnen (nur Malen, kein Layout). Nie `width`, `height`, `top`, `left` oder `margin`.
- **Regeln:**
  - Ausgänge sind kürzer als Eingänge; Staffeln umfassen höchstens 8 Elemente.
  - Arbeitsansichten bekommen nur Rückmeldung und Zustandswechsel.
  - Zeiger-Effekte nur bei `(hover: hover) and (pointer: fine)`.
  - Scroll-Szenen über CSS `animation-timeline: view()` in `@supports`, mit nativem Scrollen und rückwärts stimmig; ohne Unterstützung zeigen sie den Endzustand.
  - Nichts startet automatisch und läuft länger als 5 s; `sm24-dash` läuft höchstens 3 Durchgänge.
- **Reduzierte Bewegung:** Bewegungen werden zu Sofortzuständen; die globale Regel in `globals.css` verkürzt jede Animation und jeden Übergang auf 0,01 ms. Die Spalte „Reduziert“ nennt das Höchstmaß, „sofort“ ist immer zulässig. Inhalte sind immer sichtbar. JavaScript-Scrollen nutzt `scrollVerhalten()` aus `src/lib/bewegung.ts`.
- **Bausteine in `globals.css` und `tailwind.config.ts`:** `sm24-draw`, `sm24-reveal`, `sm24-fade`, `sm24-pop`, `sm24-dash`, `sm24-aufdecken` (Fläche deckt sich von links auf, `clip-path`), `sm24-scrub-*`, `sm24-schritt-vor`/`-zurueck` (B-11), `.sm24-ruhig` (keine Einstiegsbewegung nach dem ersten Wechsel), `animate-spin` mit `--dauer-scene` (B-19). Varianten: `hover:`/`group-hover:` wirken projektweit nur bei feinem Zeiger (`future.hoverOnlyWhenSupported`), `zeiger:` für übrige Zeiger-Effekte, `fokus-innen:` (enthält sichtbaren Tastaturfokus). Hilfsklasse `zahl-ohne-pfeile` für Zahlenfelder mit eigenen Knöpfen.
- **Ohne JavaScript:** Alle Einstiegsbewegungen spielen sofort ab oder entfallen; nichts bleibt unsichtbar.

| ID | Bewegung | Zweck | Auslöser | Stufen | Reduziert |
|---|---|---|---|---|---|
| B-01 | Fräsbahn im Hero (Startseite) | Charakter | Grafik zur Hälfte sichtbar (Hülle `FraesbahnBewegung`, `data-motion`) | Fräser blendet ein (Verzögerung 0,3 s), Profil zeichnet `draw` 1,1 s, die gefräste Fläche deckt sich im selben Takt auf (`sm24-aufdecken`), Fräser folgt per `transform`, hebt danach `quick`/`exit` ab | Profil sofort vollständig, Fräser ruht gehoben frei von der Spitze |
| B-02 | Profillinie zeichnet sich | Hierarchie | Abschnitt sichtbar (InView) | `enter` 600 ms, `draw` | sofort vollständig |
| B-03 | Ablauf am Scrollen (Startseite, Autoschlüssel-Ablauf) | Orientierung | Scrollposition (`view()`) | Fortschrittslinie `scaleY` 0 → 1, Schrittmarken wachsen nur über `scale` (keine Deckkraft, damit die Ziffern lesbar bleiben) | Endzustand statisch |
| B-04 | Abschnittsauftritt (`sm24-reveal`) | Hierarchie | InView, höchstens einer je Bildschirmhöhe | `enter` 600 ms, 8 px | sofort sichtbar |
| B-05 | Knopfdruck | Rückmeldung | `:active` | `scale(0.98)` `instant` | keine Skalierung, Farbwechsel bleibt |
| B-06 | Karten- und Link-Hover | Rückmeldung | Hover (feiner Zeiger), Fokus | Pfeil `translateX(4px)`, Rahmenfarbe, `shadow-raised`; `quick` | nur Farbe |
| B-07 | Mobiler Drawer | Zustandswechsel | Menüknopf | rein `translateX` + Deckkraft `base`/`enter`; raus `quick`/`exit` | Überblendung `quick` |
| B-08 | Megamenü | Zustandswechsel | Klick, Tastatur | Deckkraft + `translateY(-4px)` `base` | Überblendung `quick` |
| B-09 | Akkordeon | Zustandswechsel | Klick | Pfeil dreht 180° `base`; Inhalt blendet ein `quick` | sofort |
| B-10 | Flow-Fortschritt | Orientierung | Schrittwechsel | `scaleX` `slow`, `standard` (statt `width`) | sofort |
| B-11 | Schrittwechsel im Ablauf | Zusammenhang | weiter/zurück | Inhalt blendet ein + 8 px in Richtung `base` | Überblendung `quick` |
| B-12 | Bestätigungshaken (CheckDraw) | Rückmeldung | Bestätigung erscheint | Fläche, Kreis, Haken, gesamt ≤ 900 ms | sofort vollständig |
| B-13 | Seitenwechsel mit gemeinsamem Element | Zusammenhang | Bereichskarte → Bereichskopf | ViewTransition `slow` | keiner |
| B-14 | Schließplan wählen | Zusammenhang | Schlüssel oder Tür wählen | Deckkraft und Farbe `base` | sofort |
| B-15 | Live-Schlüssel | Rückmeldung | Code-Eingabe | vor der Eingabe Rohling (gestrichelte Einschnittzone); erster Code zeichnet die Einschnitte (`draw`, `.sm24-nur-zeichnen`), jede weitere Änderung überblendet `quick` | sofort |
| B-16 | Code-Fundstelle umschalten | Orientierung | Auswahl Ort | Überblendung `base` | sofort |
| B-17 | Zylindermaß live | Rückmeldung | Maßänderung im Konfigurator | Überblendung `quick` | sofort |
| B-18 | Tür-Schutzpunkte | Hierarchie | InView | Marken `sm24-pop`, gestaffelt ≤ 5 × 120 ms | sofort |
| B-19 | Ladeanzeige | Rückmeldung | Laden | Glyph `laden` dreht (`transform`), 900 ms/Umdrehung | ruht, Text „lädt …“ bleibt |
| B-20 | Warenkorb-Zähler, Summen | Rückmeldung | Menge oder Summe ändert sich | Zähler `sm24-pop` `quick`; Summen (Warenkorb, Kasse, laufende Summe im Konfigurator) blenden über einen wechselnden `key` mit `animate-schleier-ein` ein | sofort |
| B-21 | Reihe der Schlüsselarten (Autoschlüssel; Modellseite H03 mit den erfassten Arten) | Hierarchie | InView | Schlüssel nacheinander `sm24-reveal`, Staffel ≤ 4 × 120 ms; in jeder Zeichnung erst die Körper (0,4 s, Kopien 80 ms gestaffelt), dann zeichnen die Profile, zuletzt Marken und Ziffern; je Zeichnung höchstens 1,6 s | sofort |
| B-22 | Code-Fundstelle (Generator-Einstieg) | Orientierung | InView | Bestand `sm24-draw`/`sm24-pop` | sofort |
| B-23 | Ablaufzeichnung (Generator `ablauf`, Ratgeber-Kopf) | Reihenfolge | InView | Bemaßungslinie `sm24-draw` ≈ 0,6 s, Stationen `sm24-pop` Staffel ≤ 4 × 120 ms, Beschriftung `sm24-fade` mit ihrer Station; gesamt < 1,6 s | sofort |
| B-24 | Lesefortschritt (Ratgeber) | Orientierung | Scrollen (`animation-timeline`, nur wo unterstützt) | Leiste am Verzeichnis `scaleY` mit dem Artikel; Nummer des Abschnitts an der Leselinie (40 %) in Primärfarbe; Klassen `sm24-lesen*` | ruht (keine Leiste, keine Hervorhebung) |
| B-25 | Stiftzuhaltung am Scrollen (Kür K-01, `/gleichschliessende-zylinder`) | Mechanik | Scrollen (`animation-timeline: --szene`, nur wo unterstützt) | Schlüssel fährt ein (`translateX`), dann heben sich je Bohrung Stifte (`translateY`) und Federn (`scaleY`), Staffel über `--stift-nr`; Prüfmarken erscheinen zuletzt; Klassen `sm24-szene`, `sm24-scrub-*`; ein Rahmen mit `overflow: hidden` um die Szene schneidet mit `clip` (kein Scrollcontainer) | Endlage: Schlüssel steckt, alles passt |

- Neue Einträge gibt es nur durch den Orchestrator. Bewegung ohne Eintrag wird entfernt.

## K-008 SVG-Formsystem
- **Grundgeometrie:** Schlüsselprofil (Rücken, Bart mit Einschnitten), Kreis (Zylinderkern, Knoten), Rechteck mit kleinem Radius (Tür, Körper), Bemaßungslinie mit Pfeilspitzen als Pfad. Raster: Fach-Icons und Glyphen 48 × 48, Generatoren 480 × 270 (16:9), 480 × 300 oder für Szenen mit Bemaßung und Legende 480 × 360 (4:3, `profilschnitt`); Zeichenpapier-Raster im Abstand 30. Gemeinsame Helfer der Generatoren stehen nur in `generators/grafik-basis.tsx`; weitere Hilfsdateien liegen außerhalb von `generators/`. **Telefonbreiten:** Beschriftungen im Bild mindestens etwa 11,5 px. Erreicht wird das über einen Ausschnitt (`ausschnitt`, `.sm24-ausschnitt`; Legenden mit `data-legende` werden darin größer gesetzt; die Bemaßung mit `data-bemassung` blendet der Ausschnitt aus, außer die Hülle trägt `sm24-ausschnitt-bemasst` und das Fenster fasst sie ganz) oder über ein schmales Format (`format: 'schmal'`, eingetragen in `SCHMALES_FORMAT` der Registry, von `ImagePlaceholder` unter 640 px gezeigt).
- **Striche:** Enden und Ecken immer rund.
  - **Icons und Glyphen:** gleiche Bildschirmstrichstärke in jeder Größe über `vector-effect: non-scaling-stroke`. Die Regel steht in `globals.css` für `[data-sm24-icon]`; der Wert wird in L-02 am Bild festgelegt (1,75–2 px).
  - **Generatoren:** Strichskala aus `grafik-basis.tsx`: `DETAIL` 0,75 · `HILFSLINIE` 1 · `LINIE` 1,5 · `LINIE_STARK` 2 · `KONTUR` 2,25 · `AKZENT` 3 · `MARKE` 4. In `strokeWidth={…}` stehen nur diese Namen.
  - **Ausnahmen (D-010):** Flächen aus breiten Strichen sind keine Linien und stehen als Zahl mit Kommentar: Doppelstrich-Halos (Außen- und Innenstrich, z. B. Griff 13/8) und Spurbänder (z. B. 10). Werte, die zugleich die Geometrie steuern, bleiben ebenfalls stehen.
- **Eine Familie** über die gemeinsame `IconBase`:
  - Fach-Icons (`visual/icons/`, 48er-Raster, Zweitonfläche `fill-area-muted`) für Leistungen, Kacheln und Abschnitte ab 24 px.
  - UI-Glyphen (`visual/glyphen/`, 48er-Raster, einfarbig, ohne Zweiton) für Text, Knöpfe, Status und Steuerung von 14 bis 24 px.
  - lucide-react entfällt vollständig (L-12). Die Zuordnung steht in K-008a.

### K-008a Zuordnung lucide → SM24 (aus E0-KUNDSCHAFTER-07)
- **Grundregel nach Zusammenhang:**
  - Text, Knopf, Status und Steuerung (14–24 px) → **Glyph** aus `visual/glyphen/`.
  - Kachel, Leistung oder Abschnitt → **Fach-Icon** aus `visual/icons/` in Kachelgröße (32–48 px, Zweiton, ohne farbigen Kasten). Steht die Kachel für einen ganzen Bereich, gilt `BereichIcon area="…"`.
  - Ohne passendes Fach-Icon → Glyph.

| lucide | Glyph (Text/Knopf/Status/Steuerung) | Kachel → Fach-Icon (nach Bedeutung) |
|---|---|---|
| ArrowRight / ArrowLeft | `GlyphPfeilRechts` / `GlyphPfeilLinks` | – |
| Check / CheckCircle2 | `GlyphHaken` / `GlyphHakenKreis` | Bestätigung groß: `CheckDraw` |
| ChevronDown / ChevronRight | `GlyphWinkelUnten` / `GlyphWinkelRechts` | – |
| X · Plus · Minus · Menu | `GlyphKreuz` · `GlyphPlus` · `GlyphMinus` · `GlyphMenue` | – |
| Search | `GlyphSuche` | `pruefung` |
| Info · AlertTriangle | `GlyphInfo` · `GlyphWarnung` | – |
| Loader2 | `GlyphLaden` (B-19) | – |
| RotateCcw · Trash2 · SlidersHorizontal · Save | `GlyphZuruecksetzen` · `GlyphPapierkorb` · `GlyphFilter` · `GlyphSpeichern` | – |
| ImageOff · ImageUp · Camera | `GlyphBildFehlt` · `GlyphBildHochladen` · `GlyphKamera` | Kamera als Leistung: `videoueberwachung`; Fotos aufnehmen: `foto-hochladen` |
| BadgeCheck · ShieldCheck | `GlyphPruefsiegel` | Bereich Sicherheit: `BereichIcon sicherheitstechnik`; geprüft: `pruefung`; Nachweis: `nachweis` |
| Scale | `GlyphWaage` | – |
| KeyRound | `GlyphSchluessel` | Bereich: `BereichIcon autoschluessel`; Kopie: `schluessel-kopieren`; Zylinder: `profilzylinder` |
| MapPin | `GlyphOrt` | `standort` |
| CalendarClock / CalendarCheck / CalendarSearch | `GlyphKalender` | `termin` |
| Clock | `GlyphUhr` | – (Glyph) |
| Building2 · UserCog · Users | `GlyphGebaeude` · `GlyphPersonen` · `GlyphPersonen` | Bereich Schließanlagen: `BereichIcon schliessanlagen` |
| Ruler | `GlyphLineal` | `zylinder-mass` |
| LifeBuoy | `GlyphHilfe` | `technische-beratung` |
| ShoppingBag / ShoppingCart | `GlyphWarenkorb` | `warenkorb` |
| Phone · Mail · MessageSquare | `GlyphTelefon` · `GlyphMail` · `GlyphNachricht` | Telefon: `beratung-telefon` |
| FileText · Hash · Calculator · Ban | `GlyphDokument` · `GlyphRaute` · `GlyphRechner` · `GlyphVerbot` | – (Glyph) |
| Layers | – | Bereich Zylinder: `BereichIcon gleichschliessende-zylinder`; Verriegelung: `mehrfachverriegelung` |
| Lock · DoorClosed · PanelTop | – | `einsteckschloss` · Bereich `tuer-und-schliesstechnik` oder `tuerschliesser` · `tuerzusatzschloss` |
| Car | – | `fahrzeugmarke` oder Bereich `autoschluessel` |
| ClipboardList | – | `sicherheitscheck`; Bereich Schließanlagen: `BereichIcon schliessanlagen` |
| CreditCard | – | Zahlung: `zahlung`; Zutrittskarte: `transponder` |
| Package / PackageOpen · Truck | – | Bereich Code: `BereichIcon schluessel-nach-code`; Versand: `versand-paket` · `lieferung` |
| Siren / BellRing | – | `alarmtechnik` / `panik-alarmtaster` |
| Smartphone · ScanLine · Blend · Wrench | – | `smarte-funktionen` · Bereich Vorlage oder `technische-beratung` · `kombinierte-konzepte` · `montage`/`reparatur-austausch`/`werkstatt` |

Das 400-px-Dekor-Icon auf der Türtechnik-Seite (`tuer-und-schliesstechnik/page.tsx:263`) entfällt; dort steht künftig der Generator `tuer-schutz`.
- **Farben** nur über Tailwind-Klassen (`text-*`, `stroke-*`, `fill-*` der Tokens), nie `fill="var(--…)"` oder `#hex`.
- **Zugänglichkeit:** dekorativ → `aria-hidden`; bedeutungstragend → `role="img"` + `<title>`. Keine `id` in Icons, Glyphen und Generatoren. Masken nur in Generatoren.
- **Leitelement Profillinie** (`visual/profillinie.tsx`): gestufte Linie aus Schlüsselrücken, Einschnitten und Spitze, deterministisch aus einem Text; Höhe 10–24 px (klein 10 px unter Augenbrauen-Zeilen, groß 16 px in Köpfen), Strich `LINIE`, Farbe `stroke-area` oder `stroke-primary`. Sie zeichnet sich einmal (B-02).
- **Grafiken statt Platzhalter:** Fehlt ein Foto, zeigt `ImagePlaceholder` eine passende Fachgrafik (Generator) statt „Bild folgt“. `bild` hat Vorrang. Fotos werden nie erzeugt.

## K-009 Komponenten, Zustände, Ansichtsarten
- **Zustände jedes interaktiven Elements:** Ruhe, Hover (nur feiner Zeiger), Fokus (`ring` 2 px + Abstand, nie verdeckt, auch `focus-within` bei versteckten Eingaben), gedrückt, deaktiviert, lädt, Fehler, Erfolg. Dazu leere Zustände und Fehlerseiten mit Charakter (`not-found.tsx`, `error.tsx`).
- **Erzählansichten:** Start, Bereichsseiten, Leistungs-, Marken- und Modellseiten, Code-Shop und Produkt, Ratgeber, Standorte.
- **Arbeitsansichten:** alle Abläufe und Konfiguratoren, Warenkorb, Kasse, Bestellung, Terminstatus, Rechtstexte, Cookie-Einstellungen.
- **Bausteine (Bestand, werden erweitert, nicht ersetzt):** `Button`/`ButtonLink`, `Card`, `Badge`, `Alert`, `Accordion`, `InfoTip`, `ImagePlaceholder`, `Section`/`SectionHeading`, `PageHeader`, `Breadcrumbs`, `SummaryList`, `FlowShell`, `OptionCard`, Formularfelder, `SiteHeader`, `SiteFooter`, `MobileActionBar`.
- **Props-Verträge** gemeinsamer Bausteine bleiben in einer Welle eingefroren. Erweiterungen nur additiv und optional, ohne Wirkung auf bisherige Aufrufer (seit 1.14: `OptionCard zeile`, `bildLage`, `metaSpalte`; `FlowShell raster`, `seite`, `summe`; `PageHeader leadClassName`).

## K-010 Ton und Mikrotexte
- **Ton:** Sie-Form (Bestand), kurz, sachlich, konkret.
- **Knöpfe** sagen, was passiert: „Termin starten“, „In den Warenkorb“, „Projekt erfassen“; nicht „Mehr erfahren“ oder „Entdecken“.
- **Fehlertexte** nennen Ursache und nächsten Schritt.
- **Zahlen** stehen in Mono mit Einheit („69,90 €“, „7 Tage“, „30 / 45 mm“).
- **Platzhalter aus Inhalten** (`[Hersteller eintragen]`) erscheinen nie als Fakt.
- Mikrotexte werden direkt geändert; alle übrigen Texte nur als Vorschlag in `TEXTVORSCHLAEGE.md`. Rechtstexte bleiben wortgleich.

## K-011 Budgets
- **LCP** ≤ 2,5 s, **CLS** ≤ 0,1, **INP** ≤ 200 ms (Laborwerte nach `messung.mjs`: mobil 4-fach gedrosselt, langsames 4G; Desktop ungedrosselt). Keine Hauptansicht wird schlechter als in E0 um mehr als die Spanne der drei E0-Läufe.
- **Bewegungscode** zusätzlich ≤ 60 KB komprimiert insgesamt. Ein großer Moment nutzt CSS und höchstens eine kleine Client-Hülle (< 3 KB komprimiert).
- **Bildrate:** große Momente mobil bei 4-facher Drosselung ≤ 5 % verworfene Bilder.
- Keine neue Laufzeitbibliothek. framer-motion bleibt ungenutzt (D-004).

## K-012 Glossar
- **Profillinie:** gestufte Linie nach dem Vorbild eines Schlüsselbarts, Leitelement.
- **Fräsbahn:** großer Moment der Startseite: Das Profil wird sichtbar gefräst.
- **Bereich:** einer der neun Leistungsbereiche mit eigener Akzentfarbe (`data-area`).
- **Fach-Icon / Glyph:** zweifarbiges Leistungssymbol bzw. einfarbiges Bediensymbol derselben Familie.
- **Generator:** deterministische SVG-Grafik aus Parametern (`visual/generators/`).
- **Logikwächter:** Prüfwerkzeug, das Änderungen an Geschäftslogik in Darstellungsdateien aufdeckt.
- **Build-Gate:** `SM24_DATA=json npx next build`.

## Markierte Annahmen
- Marke und Zielgruppe sind aus Texten abgeleitet (K-002).
- Der iOS-Zoom ist aus der Kaskade abgeleitet und nicht am Gerät geprüft.
- Die Wirkung von tailwind-merge auf eigene Größen wird mit E0-KUNDSCHAFTER-06 belegt.

## Änderungen
- 1.0 · E1 · Erstfassung aus Erkundung, L0 und Plan.
- 1.1 · E1 · K-004a (Technikfakten Next 16 und tailwind-merge), K-005a (Umrechnungstabelle), K-008a (Zuordnung lucide → SM24), Sperrung `tracking-label`. Grund: Berichte E0-KUNDSCHAFTER-06 und -07.
- 1.2 · E2 · K-008 Strichskala um DETAIL, LINIE_STARK, AKZENT und MARKE erweitert, Ausnahmen benannt. Grund: Bericht E2-GRAFIKER-05.
- 1.3 · E3 · K-007: reduzierte Bewegung = sofort (globale Regel), Bausteinliste mit `sm24-schritt-*`, `fokus-innen:`, `zahl-ohne-pfeile`, Spinner 900 ms, `hover:` nur bei feinem Zeiger. Grund: Vorbereitung Welle E3-A.
- 1.4 · E2 · B-01 startet bei Sichtbarkeit und hebt ab; Bereichsfarbtöne mit mindestens 30° Abstand (D-017); `Section`-Ton `sunken` mit Haarlinien; Tokens `min-w-zeichnung`, `grid-rows-kopf`, `tracking-label-eng`; Ausschnitt `.sm24-ausschnitt`. Grund: Sichtabnahme E2-L-07, Anlauf 1.
- 1.5 · E3 · K-008: Raster 480 × 360 für Szenen mit Bemaßung zugelassen, Ort der Generator-Helfer festgelegt, Profillinie 10–24 px. Grund: Prüfung E3-GRAFIKER-07 (README entsprach dem Code, KERN nicht).
- 1.6 · E4 · K-005: `foreground-subtle` nie auf `surface-sunken`, Etiketten in `foreground-muted`; K-006: Ausschnitt unter 640 px, `scroll-px` für Leisten, Schriftfeld mobil, Fuß auf `surface-sunken`; K-007: `clip-path` für `sm24-aufdecken`, B-01 mit aufdeckender Fläche, B-03-Marken nur `scale`; Farbton Tür 125 → 90 (D-024). Grund: Sichtabnahme E2-L-07, Anlauf 2 (Paket E4-L-16).
- 1.7 · E4 · B-21 gilt auch für die Modellseite (erfasste Schlüsselarten als Zeichnungen). Grund: Pakete der Welle C (E4-BAUMEISTER-08).
- 1.8 · E4 · K-008: Mindestgröße der Beschriftung in Zeichnungen auf Telefonen; Ausschnitt mit vergrößerter Legende (`tuer-schutz`, D-033) und schmales Format (`zylinder-mass`, D-036). Grund: Abnahme Welle E und offener Punkt Maßzeichnung schmal.
- 1.9 · E4 · B-15 mit Rohling und gezeichnetem ersten Profil; `sm24-dash` ein Durchgang; gesperrte Knöpfe als ruhige Fläche; Bereichstöne Code 250°/Schließanlagen 292° (42°). Grund: Sichtabnahme E4-L-23 (Paket E4-L-27).
- 1.10 · E4 · K-006 Muster aus der Sichtabnahme (Kopf mit Blickfang, Leiste statt Stapel, Ordnung, keine Linkwörter, Links im Satz, Werte, Flächen); B-20 auch für Summen; `PageHeader visual` als 7/5-Kopf. Grund: Sichtabnahme E4-L-23 (D-037).
- 1.11 · E5 · B-23 Ablaufzeichnung und B-24 Lesefortschritt (Kür K-04). Grund: Sichtabnahme E4-L-23, H12 Ratgeber.
- 1.12 · E6 · B-25 Stiftzuhaltung am Scrollen (Kür K-01). Grund: Kür nach Plan.
- 1.13 · E5 · B-21 Reihenfolge in der Schlüsselzeichnung (Profile erst, wenn alle Körper stehen) und Obergrenze 1,6 s je Zeichnung. Grund: Nachprüfung H02/H03 (Paket E5-L-28). Dazu: `SummaryList` im Schriftfeld setzt Kennungen auch in der Beschriftung ohne Umbruch und Angaben mit Betrag zweizeilig (Angaben klein, Betrag in Mono); Variante `korb-leer:` für die Geschwister der Leerkarte im Warenkorb. Grund: Nachprüfung H10/H11. B-25 eingebaut (K-01) mit `clip` für Rahmen um die Szene. Grund: Abnahme E6-GRAFIKER-11.
- 1.14 · E6 · K-006 Kleinregeln aus der Sichtabnahme E5-L-29 (Zeilenpfeil, Primärblau nur für Aktionen, Schriftfeld, Zahl und Einheit, kein Rahmen im Rahmen, leere Zustände, Akkordeon, Abläufe, Maß A/B), K-003 Maß A/B, K-008 `sm24-ausschnitt-bemasst`, K-009 additive Props. Schlüsselzeichnung: Lineal nur mit beschrifteten Einschnitten (D-045). Grund: gemeinsame Befunde der Sichtabnahme E5-L-29 (Paket E6-L-31).
