# KERN · SCHLÜSSELMACHER24 · Version 1.1

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
1. **Bemaßt statt behauptet.** Tun: Zahlen, Maße, Schritte und Fristen sichtbar und in Mono setzen (Anzahlung, Vorlauf, Maß A/I, Vorgangsnummer). Lassen: Superlative und Floskeln wie „nahtlos“, „innovativ“ oder „Entdecken Sie …“; erfundene Kennzahlen; hochzählende Zahlen.
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
- **Typoskala (neu, fließend 390 → 1440 px), Tailwind `fontSize`:**

| Token | Mobil → Desktop | Zeilenhöhe | Einsatz |
|---|---|---|---|
| `text-caption` | 12 px | 1,4 | Bemaßung, Meta, Augenbrauen-Zeile (Großbuchstaben, Sperrung 0,12em) |
| `text-small` | 13 → 14 px | 1,5 | Hilfstexte, Kartenmeta, Tabellen |
| `text-body` | 15 → 16 px | 1,6 | Fließtext |
| `text-input` | 16 px | 1,5 | Eingabefelder (kein Zoom auf iOS) |
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
| Eingabefelder `text-[15px]` | `text-input` | 16 px, kein Zoom auf iOS |
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

## K-007 Bewegungssystem und Register
- **Dauern** (CSS-Variablen `--dauer-*`, Tailwind `duration-*`): `instant` 120 ms · `quick` 180 ms · `base` 280 ms · `slow` 400 ms · `enter` 600 ms · `scene` 900 ms. Ein großer Moment dauert höchstens 1,6 s gesamt.
- **Kurven** (`--kurve-*`, Tailwind `ease-*`):
  - `standard` cubic-bezier(0.2, 0, 0, 1)
  - `enter` cubic-bezier(0.16, 1, 0.3, 1)
  - `exit` cubic-bezier(0.4, 0, 1, 1)
  - `draw` cubic-bezier(0.65, 0, 0.35, 1)
- **Animiert werden nur** `transform` und `opacity`. Erlaubt sind außerdem `stroke-dashoffset` und Masken für Linien, die sich zeichnen (nur Malen, kein Layout). Nie `width`, `height`, `top`, `left` oder `margin`.
- **Regeln:**
  - Ausgänge sind kürzer als Eingänge; Staffeln umfassen höchstens 8 Elemente.
  - Arbeitsansichten bekommen nur Rückmeldung und Zustandswechsel.
  - Zeiger-Effekte nur bei `(hover: hover) and (pointer: fine)`.
  - Scroll-Szenen über CSS `animation-timeline: view()` in `@supports`, mit nativem Scrollen und rückwärts stimmig; ohne Unterstützung zeigen sie den Endzustand.
  - Nichts startet automatisch und läuft länger als 5 s; `sm24-dash` läuft höchstens 3 Durchgänge.
- **Reduzierte Bewegung:** Bewegungen werden zu Sofortzuständen oder Überblendungen ≤ `quick`; Inhalte sind immer sichtbar. JavaScript-Scrollen nutzt `scrollVerhalten()` aus `src/lib/bewegung.ts`.
- **Ohne JavaScript:** Alle Einstiegsbewegungen spielen sofort ab oder entfallen; nichts bleibt unsichtbar.

| ID | Bewegung | Zweck | Auslöser | Stufen | Reduziert |
|---|---|---|---|---|---|
| B-01 | Fräsbahn im Hero (Startseite) | Charakter | erster Bildschirm geladen | Profil zeichnet `enter` + `draw` 1,1 s; Fräskopf folgt per `transform` | Profil sofort vollständig, Fräskopf ruht am Ende |
| B-02 | Profillinie zeichnet sich | Hierarchie | Abschnitt sichtbar (InView) | `enter` 600 ms, `draw` | sofort vollständig |
| B-03 | Ablauf am Scrollen (Startseite, Autoschlüssel-Ablauf) | Orientierung | Scrollposition (`view()`) | Fortschrittslinie `scaleY` 0 → 1, Schrittmarken füllen sich | Endzustand statisch |
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
| B-15 | Live-Schlüssel | Rückmeldung | Code-Eingabe | Profil überblendet `quick` | sofort |
| B-16 | Code-Fundstelle umschalten | Orientierung | Auswahl Ort | Überblendung `base` | sofort |
| B-17 | Zylindermaß live | Rückmeldung | Maßänderung im Konfigurator | Überblendung `quick` | sofort |
| B-18 | Tür-Schutzpunkte | Hierarchie | InView | Marken `sm24-pop`, gestaffelt ≤ 5 × 120 ms | sofort |
| B-19 | Ladeanzeige | Rückmeldung | Laden | Glyph `laden` dreht (`transform`), 900 ms/Umdrehung | ruht, Text „lädt …“ bleibt |
| B-20 | Warenkorb-Zähler | Rückmeldung | Menge ändert sich | `sm24-pop` `quick` | sofort |
| B-21 | Reihe der Schlüsselarten (Autoschlüssel) | Hierarchie | InView | Schlüssel nacheinander `sm24-reveal`, Staffel ≤ 4 × 120 ms, Profile zeichnen | sofort |
| B-22 | Code-Fundstelle (Generator-Einstieg) | Orientierung | InView | Bestand `sm24-draw`/`sm24-pop` | sofort |

- Neue Einträge gibt es nur durch den Orchestrator. Bewegung ohne Eintrag wird entfernt.

## K-008 SVG-Formsystem
- **Grundgeometrie:** Schlüsselprofil (Rücken, Bart mit Einschnitten), Kreis (Zylinderkern, Knoten), Rechteck mit kleinem Radius (Tür, Körper), Bemaßungslinie mit Pfeilspitzen als Pfad. Raster: Fach-Icons und Glyphen 48 × 48, Generatoren 480 × 270 (16:9) bzw. 480 × 300; Zeichenpapier-Raster im Abstand 30.
- **Striche:** Enden und Ecken immer rund.
  - **Icons und Glyphen:** gleiche Bildschirmstrichstärke in jeder Größe über `vector-effect: non-scaling-stroke`. Die Regel steht in `globals.css` für `[data-sm24-icon]`; der Wert wird in L-02 am Bild festgelegt (1,75–2 px).
  - **Generatoren:** `KONTUR` 2,25 · `LINIE` 1,5 · `HILFSLINIE` 1 (aus `grafik-basis.tsx`); weitere Literale werden auf diese Stufen zurückgeführt.
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
- **Leitelement Profillinie** (`visual/profillinie.tsx`): gestufte Linie aus Schlüsselrücken, Einschnitten und Spitze, deterministisch aus einem Text; Höhe 12–24 px, Strich `LINIE`, Farbe `stroke-area` oder `stroke-primary`. Sie zeichnet sich einmal (B-02).
- **Grafiken statt Platzhalter:** Fehlt ein Foto, zeigt `ImagePlaceholder` eine passende Fachgrafik (Generator) statt „Bild folgt“. `bild` hat Vorrang. Fotos werden nie erzeugt.

## K-009 Komponenten, Zustände, Ansichtsarten
- **Zustände jedes interaktiven Elements:** Ruhe, Hover (nur feiner Zeiger), Fokus (`ring` 2 px + Abstand, nie verdeckt, auch `focus-within` bei versteckten Eingaben), gedrückt, deaktiviert, lädt, Fehler, Erfolg. Dazu leere Zustände und Fehlerseiten mit Charakter (`not-found.tsx`, `error.tsx`).
- **Erzählansichten:** Start, Bereichsseiten, Leistungs-, Marken- und Modellseiten, Code-Shop und Produkt, Ratgeber, Standorte.
- **Arbeitsansichten:** alle Abläufe und Konfiguratoren, Warenkorb, Kasse, Bestellung, Terminstatus, Rechtstexte, Cookie-Einstellungen.
- **Bausteine (Bestand, werden erweitert, nicht ersetzt):** `Button`/`ButtonLink`, `Card`, `Badge`, `Alert`, `Accordion`, `InfoTip`, `ImagePlaceholder`, `Section`/`SectionHeading`, `PageHeader`, `Breadcrumbs`, `SummaryList`, `FlowShell`, `OptionCard`, Formularfelder, `SiteHeader`, `SiteFooter`, `MobileActionBar`.
- **Props-Verträge** gemeinsamer Bausteine bleiben in einer Welle eingefroren.

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
