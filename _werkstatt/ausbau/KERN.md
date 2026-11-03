# KERN · SCHLÜSSELMACHER24 · Version 2.5

Quelle der Wahrheit für alle Pakete des Ausbaulaufs. Baut auf KERN 1.19 des Gestaltungslaufs auf (docs/gestaltung/KERN.md): Leitidee, Prinzipien, Designsystem, Formsystem und Register gelten weiter und sind hier geschärft; ein zweites System entsteht nie. Änderungen nur durch den Orchestrator, mit Versionsnummer und Grund (Änderungsliste am Ende). „(Annahme)“ = abgeleitet, nicht belegt. Pfade `_werkstatt/…` in übernommenen Abschnitten meinen den Gestaltungslauf (Commit b8e7ea7).

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## K-001 Leitidee
> **SCHLÜSSELMACHER24 ist die offene Werkstatt im Netz: Auf hellem Papier zieht eine stahlblaue Linie vom Schlüssel über seinen Code bis zum fertigen Werkstück, und wer zusieht, versteht jeden Schritt und jeden Preis, bevor er bestellt.**

- **Herkunft:** KERN 1.19 („saubere Werkstattzeichnung: helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift, an den entscheidenden Stellen fräst eine Linie sichtbar das Profil“). Version 2 behält Papier, Linie, Bemaßung und Fräsbahn und ergänzt, was das Gespräch verlangt: den Weg vom Anliegen zum Werkstück (Hub, Abläufe, ein Abschluss) und das Vertrauen durch offene Schritte und Preise.
- **Vier Wörter, ein Satz:** Werkstatt (echte Fertigung in Wetzlar, Zeichnung und Maß) · Schlüssel (Profil, Bart, Zylinder) · Code (Schlüsselcode, Vorgangsnummer, bemaßte Werte in Mono) · Vertrauen (jeder Schritt sichtbar, Prüfung ist keine Zusage, Preis vor dem Kauf).
- **Austauschprobe:** Ein Notdienst wirbt mit Tempo und Telefonnummer auf Gelb und Schwarz; ein Shop zeigt Produktkacheln ohne Weg. Die Linie, die vom Anliegen über den Code zum Werkstück führt, setzt eine Werkstatt mit Fertigung, Codes und Schließplänen voraus. Sie passt zu keinem anderen Schlüsseldienst.
- **Signaturmoment:** Die Eingangsinszenierung (B-31) erzählt das Angebot als einen Handgriff: Ein Autoschlüssel fährt in einen Profilzylinder, der Kern dreht, der Zylinder rückt in einen Schließplan aus mehreren Türen. Sie steht neben der Auswahl und hält nichts zurück.

## K-002 Marke, Zielgruppe, Hauptaufgaben
- **Marke (Annahme):** sachlich, nachvollziehbar, ohne Überraschungen; erst prüfen, dann buchen; jeder Vorgang bekommt eine Nummer.
- **Zielgruppen (Annahme):**
  1. Privatleute mit Auto, die einen Zweit- oder Ersatzschlüssel brauchen, meist mobil und unter leichtem Zeitdruck.
  2. Mieter, Eigentümer und kleine Betriebe, die Schlüssel nach Code oder Vorlage oder gleichschließende Zylinder bestellen.
  3. Hausverwaltungen, Gewerbe und Bauherren, die Schließanlagen, Zutritt und Sicherheitstechnik planen.
- **Personas des Probelaufs (Auftrag 11):** Rentnerin, 72, Smartphone, wenig Technik · Eilige, die nur Preis und Ablauf will · Hausverwaltung mit 20 Türen · Schlüsseldienst aus Hamburg, der Partner werden will. Jeder Weg wird an der Rentnerin gemessen.
- **Hauptaufgaben (Version 2, Reihenfolge der Hub-Kacheln nach G-03):** Autoschlüssel nachmachen mit Termin und Anzahlung · Motorradschlüssel anfragen · Autoschlüssel-Gehäuse erneuern · Schlüssel nach Code bestellen · Schlüssel nach Foto prüfen lassen · Schlüssel einschicken · Sperrschließung zusammenstellen · Schließanlage planen · elektronische Schließsysteme anfragen · Sicherheitstechnik anfragen · Schlüsseldienst vor Ort (Partner) anfragen · Beratung anfragen. Dazu Terminstatus prüfen, Partner werden, Kontakt mit Foto.

## K-003 Gestaltungsprinzipien (Tun · Lassen)
1. **Bemaßt statt behauptet.** Tun: Zahlen, Maße, Schritte und Fristen sichtbar und in Mono setzen (Anzahlung, Vorlauf, Maß A/B, Vorgangsnummer). Lassen: Superlative und Floskeln wie „nahtlos“, „innovativ“ oder „Entdecken Sie …“; erfundene Kennzahlen; hochzählende Zahlen.
2. **Eine Linie, die schneidet.** Tun: Die Profillinie ist das einzige wiederkehrende Ornament (Trenner, Unterstrich der Augenbrauen-Zeile, Hero). Lassen: Verläufe, Glas, Leuchtkugeln, Partikel, Schatten als Effekt.
3. **Der Bereich zeigt Farbe, die Marke bleibt Stahlblau.** Tun: Die Akzentfarbe (`area`) gilt nur im Bereichskontext (Kachel, Kopf, Grafik); Aktionen bleiben `primary`. Lassen: Farbe als Fläche ohne Bedeutung, Signalfarben als Markenfläche.
4. **Erzählen, wo man wählt – ruhig, wo man arbeitet.** Tun: Erzählansichten haben je Bildschirmhöhe einen Blickfang und einen großen Moment; Arbeitsansichten sind dicht, ruhig und schnell. Lassen: Inszenierung in Formularen, Kasse, Warenkorb oder Rechtstexten.
5. **Werkstückkanten.** Tun: 1-px-Haarlinien, kleine Radien, Tiefe durch Flächenstufen (`surface` → `surface-muted` → `surface-sunken`); Raster mit bewussten Brüchen (asymmetrische Spalten, Grafik ragt aus der Spalte). Lassen: gleichförmige Kartenraster als vorherrschendes Muster, drei gleich gebaute Abschnitte in Folge, zentrierte Überschrift mit zwei Knöpfen vor leerem Hintergrund.
6. **Mobil ist eine eigene Komposition.** Tun: Daumenzone, Aktionsleiste, Kacheln und Hauptaktionen ab 48 px, sonst ab 44 px, kürzere Texte zuerst; Auswahl, die man treffen muss (Hub, Rubriken, Optionen), steht immer vollständig im Raster. Lassen: seitliches Wischen und Karussells für Auswahl (G-02); Leisten mit Anschnitt nur noch für ergänzende Listen (Ratgeber, Beispiele); ein verkleinerter Desktop.
7. **Bewegung erklärt Mechanik und lebt mit Maß.** Tun: Fräsen, Schließen, Signal und Ablauf zeigen; höchstens ein gewichtiger Auftritt je Bildschirmhöhe; je Erzählansicht höchstens ein dezentes Dauermotiv (G-06) mit sichtbarem Pause-Knopf, angehalten außerhalb des Bildes und im verborgenen Tab; Leuchten bei Hover und Fokus als System (B-30). Lassen: Bewegung als Dekoration, Dauerbewegung in Arbeitsansichten, Zeiger-Effekte auf Touch, alles, was Inhalt zurückhält.
- **GESCHMACK:** keine Vorgaben (Standard).

## K-004 Stack und Konventionen
- **Stack:**
  - Next.js 16.4 (App Router, Turbopack), React 19.2 (Laufzeit: React-Canary von Next mit ViewTransition), TypeScript strict, Tailwind CSS 3.4
  - Payload 3.90 auf Postgres; ohne `DATABASE_URL` oder mit `SM24_DATA=json` gilt der JSON-Adapter auf `content/`
  - Vitest 2 (Umgebung `node`, ohne DOM), ESLint 9 mit `eslint-config-next`
  - Schriften (seit 2.0, A-003): IBM Plex Sans für Text und Überschriften, IBM Plex Mono für Zahlen, Maße und Kennungen, als Dateien im Projekt (`src/fonts/`, OFL) über `next/font/local`, Teilmenge latin, latin-ext nur über unicode-range, Ersatzschrift mit angepassten Maßen. Inter entfällt (S1).
  - PDF (seit 2.0, A-004, umgesetzt in E3-OPUS-04, A-015): pdfkit 0.20.2 nur serverseitig (`serverExternalPackages`) für Vorgangsblatt, Schließplan, Begleitschein und Partnervertrag. Aufbau: Datenmodell `src/lib/pdf/blatt.ts` (Kopf, Abschnitte mit Zeilen, Tabellen, Bildern), Renderer `erzeuge-pdf.ts` (einzige Stelle mit pdfkit; A4, Plex Sans 400/600 und Plex Mono 400 als WOFF, Farben aus den Tokens, Fußzeile mit Seitenzahl, Überschrift nie allein am Seitenende), Inhalte je Vorgangsart als reine Funktion (`vorgangsblatt.ts`). Zeichen laufen je Schriftteil (latin, latin-ext, sonst „?“), weil fontkit fehlende oder leere Glyphen nicht lesen kann. Ein neues Blatt (Schließplan, Begleitschein) ist eine neue Inhaltsfunktion, kein neuer Renderer.
  - Datenweiche (seit 2.0): jeder Projektbefehl über `_werkstatt/ausbau/werkzeuge/sicher.sh`.
  - CSS steht als `<style>` im Dokument (`experimental.inlineCss`, E7-L-43): Auf langsamen Leitungen entfällt die eigene Anfrage vor dem ersten Zeichnen. Neue Regeln halten das CSS darum klein; seitenspezifisches CSS gehört als Klasse an die Seite, nicht in neue globale Blöcke.
- **Struktur:** `src/app/(site)` (Website), `src/app/(payload)` (Backend, ausgenommen), `src/components/<bereich>/`, `src/lib/`, `src/components/visual/` (Icons, Glyphen, Generatoren, Bewegung).
- **Konventionen:**
  - Dateinamen in kebab-case, benannte Exporte, Server-Komponenten als Standard; `'use client'` nur, wo nötig.
  - Klassen über `cn()` aus `src/lib/cn.ts`; deutsche Kommentare und Texte.
  - Commits `typ(scope): Beschreibung [Paketkennung]`.
  - Keine Sammeldateien (`index.ts`) in `components/visual`.
  - Generatoren deterministisch und mit Test.
  - Tests liegen neben der Quelle (`*.test.ts(x)`, `renderToStaticMarkup`).
- **Next-16-Besonderheiten:** `params` und `searchParams` sind Promises. Es gibt keine `proxy.ts`. Einziges experimentelles Flag ist `inlineCss` (K-004, D-050).

### K-004a Belegte Technikfakten (E0-KUNDSCHAFTER-06, `_werkstatt/berichte/E0-KUNDSCHAFTER-06-next16.md`)
- **ViewTransition:**
  - Der App Router braucht keinen Schalter. Import über `import { ViewTransition } from 'react'`: Next bindet sein eigenes React-Canary ein, das `ViewTransition` exportiert. Typen nur über `react/canary`; dafür gibt es eine Typreferenz in einer `.d.ts`.
  - Reduzierte Bewegung regelt CSS (`::view-transition-*` unter `prefers-reduced-motion`).
- **Fehlerseiten:** `error.tsx` und `global-error.tsx` sind Client-Komponenten mit den Props `error` und `retry` (stabil seit 16.3). `not-found.tsx` hat keine Props.
- **tailwind-merge 3.6:** Eine unbekannte `text-<wort>`-Klasse gilt als Textfarbe. Erweiterung über `extendTailwindMerge({ extend: { theme: { text: […], shadow: […] }, classGroups: { z: […], 'min-h': […], duration: […], ease: […] } } })`, immer `extend`, nie `override`.
- **Prüfweg (seit 2.0):** Build `sicher.sh --json -- npm run build` und `sicher.sh --pg -- npm run build`, Server `_werkstatt/ausbau/werkzeuge/server.sh start`.

## K-005 Designsystem mit Erweiterungen
Werte als CSS-Variablen in `src/app/(site)/globals.css`, als Tailwind-Klassen in `tailwind.config.ts`. **Nie Einzelwerte im Code** (keine `text-[13px]`, `min-h-[44px]`, `#hex`).

- **Farbraum und Abstufungsregel (seit 2.0, Auftrag 12, umgesetzt in E3-OPUS-02, A-013):** Alle Farbtokens stehen als OKLCH-Tripel in `globals.css` (`--x: L C H`), Tailwind setzt sie als `oklch(var(--x) / <alpha-value>)` ein (Tailwind 3.4 liest OKLCH nicht selbst; so bleiben Deckkraft-Varianten wie `border-warning/30` erhalten). Regel je Familie (`ABSTUFUNG` in `area-theme.ts`): `accent` L 0,605 (Grafik, ≥ 3:1) · `strong` L 0,485 (Text und Aktion, ≥ 4,5:1; so hell wie das Markenblau `--primary`) · `soft` L 0,96 · `muted` L 0,90; Buntheit höchstens 0,162 (accent, strong), 0,06 (muted), 0,022 (soft), immer im sRGB-Farbraum; ein Farbton je Familie. Funktionsfarben (`accent`, `success`, `warning`, `danger`) folgen derselben Regel (Text L 0,485, Fläche L 0,96). Neutrale Stufen bleiben die Werte des Bestands, exakt umgerechnet (Stahlblau H 255 bis 266, Buntheit unter 0,05). Das Markenblau `--primary` ist unverändert (`#145bb8`, Wortmarke, G9). Kein Lila und kein Indigo (S2): kein Ton zwischen 270° und 335° in OKLCH bei Buntheit über 0,05 und umgerechnet kein HSL-Ton zwischen 230° und 330° (A-005); geprüft für alle Tokens in `area-theme.test.ts`, im Slop-Scan ebenso streng.
- **Bereichstöne (seit 2.0):** Sicherheitstechnik 33° (Signalrot) · Zylinder 65° (Kupfer) · Schlüssel nach Code 97° (Messing, gedecktes Ocker, kein Signalgelb) · Tür und Schließtechnik 130° (Moosgrün) · Schlüssel nach Vorlage 163° (Grün) · Elektronische Zutrittslösungen 196° (Petrol) · Schließanlagen 229° (Stahlblau) · Autoschlüssel 262° (Blau) · Service und Termin 2° (Himbeerrot); Grundfarbe 257,63° (Markenblau). Abstand benachbarter Töne 31° bis 33°, die Lücke 262° bis 2° ist das ausgeschlossene Lila-Fenster.
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
| `text-small` | 15 px (seit 2.0) | 1,5 | Hilfstexte, Kartenmeta, Tabellen, Navigation; nie für Pflichtinformation |
| `text-body` | 17 → 18 px (seit 2.0, Laien) | 1,6 | Fließtext |
| `text-eingabe` | 17 px (seit 2.0) | 1,5 | Eingabefelder (kein Zoom auf iOS; nicht `text-input`, das ist die Rahmenfarbe) |
| `text-lead` | 18 → 20 px (seit 2.0, über dem Fließtext) | 1,55 | Einleitungen |
| `text-title-sm` | 17 → 19 px (seit 2.0, nie kleiner als der Fließtext) | 1,35 | Karten- und Feldtitel |
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
- **Touch-Ziele (seit 2.0):** Kacheln und Hauptaktionen `min-h-touch-lg` mindestens 48 px (Standard 52 px), sonst `min-h-touch` 44 px, nie unter 24 × 24 px (auch Telefon-Link im Kopf, axe target-size). Knopfgrößen: `sm` 40 px nur am Desktop neben anderen Bedienelementen, `md` 44 px, `lg` 52 px.
- **Leuchten (seit 2.0, G-06, B-30):** Hover und Fokus einer Kachel oder Hauptaktion zeigen ein Leuchten als System: weicher Lichthof in der Bereichsfarbe (Token `--leuchten` in `globals.css`, Klasse `shadow-leuchten`: `box-shadow` mit Bereichsfarbe bei 0 Versatz, Unschärfe 24 px, Deckkraft 0,28) plus Rahmen in `area-strong`; im Fokus zusätzlich der Ring. Kein Leuchten als Flächenschmuck (S3); nur als Rückmeldung auf Hover, Fokus und Druck.
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
| Eingabefelder `text-[15px]` | `text-eingabe` | 17 px, kein Zoom auf iOS |
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
- **Schriften (seit 2.0):** IBM Plex Sans für Überschriften (600/700) und Text (400/500), Zahlen, Maße und Kennungen in IBM Plex Mono (`font-mono`, `tabular-nums`). Inter entfällt (S1). Keine weiteren Schriften. Dateien in `src/fonts/` (OFL, `LIESMICH.md`): Plex Sans variabel (100 bis 700, latin 45,7 KB vorgeladen, latin-ext 31 KB nur bei Bedarf über `unicode-range`), Plex Mono 400/500/600 (je etwa 15 KB, nicht vorgeladen). Eingebunden über `next/font/local` in `src/fonts/schriften.ts`; Familienname gleich dem Namen der Konstante (`plexSans`, `plexMono`), sonst zeigt die CSS-Variable ins Leere. Variablen: `--font-sans` (Tailwind `font-sans` und `font-display`) und `--font-mono`. Fließtext mobil mindestens 17 px, Zeilenlänge 60 bis 75 Zeichen, Silbentrennung auto mit `lang="de"`, Display am längsten Wort geprüft.
- **Ersatz während des Ladens:** Hinter jeder Webschrift steht ein maßgleicher lokaler Ersatz (`SM24 Ersatz Plex Sans`, `… Plex Mono`, `… Wortmarke` in `globals.css`), damit beim Schrifttausch nichts springt; next/font legt keinen eigenen Ersatz an (`adjustFontFallback: false`). Die variable Plex Sans hat dieselben Maße wie die statischen Schnitte (Oberlänge 1025, Unterlänge 275, mittlere Breite 533). Wer Schriftschnitte oder die Wortmarke ändert, misst die Ausgleichswerte neu (Verfahren in D-050).
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
  - **Leiste statt Stapel (seit 2.0 eingeschränkt):** Gilt nur für ergänzende Listen (Ratgeber, Beispiele, Artikel), nie für Auswahl, die man treffen muss (Hub, Rubriken, Optionen; G-02). Mehr als drei gleichartige ergänzende Karten werden mobil eine Leiste mit Anschnitt (Muster Startseite „Bestellen ohne Termin“: `-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid … md:overflow-visible md:px-0 scroll-px-5 sm:scroll-px-6 md:scroll-px-0`, Karte `shrink-0 basis-3/4 snap-start md:basis-auto`).
  - **Ordnung durchziehen:** Jeder Abschnitt hat Augenbraue und laufende Nummer (`SectionHeading nummer`), auch „Weiterlesen“ und „Fragen“.
  - **Keine Linkwörter:** „Zur Seite“, „Ansehen“, „Leistungsdetails“, „… erkunden“ entfallen; die ganze Zeile oder Karte ist der Link, rechts nur `GlyphPfeilRechts` mit B-06.
  - **Links im Satz** bleiben `inline` (ohne `inline-flex` und `min-h-touch`; WCAG 2.5.8 nimmt sie aus), sonst reißen Zeilen auf.
  - **Hauptknöpfe mobil einzeilig:** kürzerer vorhandener Wortlaut oder `w-full justify-between text-left`.
  - **Werte:** Beträge, Maße, Kennungen und Tabellenwerte in `font-mono tabular-nums`, Summen rechtsbündig, Endsummen in Textfarbe (Primärblau nur für Aktionen).
  - **Flächen sparsam:** Hinweise ohne eigenen Anlass als Zeile mit Glyphe statt getönter Kasten; Warnungen höchstens 8 Spalten, `surface` mit 2-px-Leiste links in Warnfarbe.
- **Kleinregeln aus der Sichtabnahme E5-L-29 (seit 1.14, gelten für alle Ansichten):**
  - **Zeilenpfeil:** `GlyphPfeilRechts` in ganzen Link-Zeilen und -Karten steht in Ruhe in `text-foreground-muted`, bei Hover und Tastaturfokus der Zeile in `text-primary` (`group-hover:text-primary group-focus-visible:text-primary`), in Bereichskacheln in `text-area-strong`; Bewegung B-06 (`zeiger:group-hover:translate-x-1 duration-quick ease-standard`). Pfeile in Textlinks („Alle Leistungen“, Etiketten) behalten die Linkfarbe. Ist die Zeile ein Behälter mit überdeckendem Link (und etwa einem InfoTip), steht statt `group-focus-visible:` die Form `group-focus-within:`.
  - **Primärblau nur für Aktionen und Links:** Nicht klickbare laufende Nummern, Stationen, Zähler und Kennungen stehen in `text-foreground` (Augenbrauen behalten die Bereichsfarbe). Ausnahme: Die Abschnittsnummern im Ratgeber ruhen in `text-foreground-muted`, weil B-24 die aktive Nummer an der Leselinie in Primärfarbe hebt.
  - **Schriftfeld:** Wortwerte in Plex Sans `text-title-sm font-semibold`, Mono nur für Zahlen, Maße, Beträge und Kennungen.
  - **Zahl und Einheit untrennbar:** geschütztes Leerzeichen, im Quelltext als Escape `\u00a0` (in Template-Literalen `\xa0`), nie als `&nbsp;` in einer Zeichenkette.
  - **Kein Rahmen im Rahmen:** Auswahlen in einer Fläche als Liste (`Auswahlgruppe liste` + `OptionCard zeile`) oder als Karten direkt auf `bg-background`, nicht als Karten in einer Karte. Preise in Optionslisten als rechte Spalte (`OptionCard metaSpalte`).
  - **Leere Zustände von Warenkorb und Kasse:** gleicher Bau, Rohling-Zeichnung (`schluessel` mit `rohling: true`, `w-40`, `sm24-ruhig`, ohne Rahmen); die Einleitung steht im Kopf und bleibt in allen Zuständen sichtbar, mit zustandsneutralem Wortlaut (Textvorschlag). Ausblenden nach dem Laden verschiebt die Seite (CLS), deshalb kein `korb-leer:hidden` am Kopf (D-046). Ein Summenbegriff: „Gesamtbetrag“.
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
- **Bewegungsschalter (seit 2.0, A-007, umgesetzt in E3-OPUS-03, A-014):** `html[data-bewegung="an"|"ruhig"]`, gesetzt vor dem ersten Rendern vom Inline-Skript `STARTSKRIPT` (`src/lib/bewegung.ts`, im `<head>` des Root-Layouts, Prüfsumme im Test) aus der gespeicherten Wahl (`localStorage` `sm24-bewegung`, abgesichert) oder, ohne Wahl, aus `prefers-reduced-motion`. Alle Bewegung hängt an `:where(:root[data-bewegung="an"])` (globals.css, ohne zusätzliche Spezifität); „ruhig“, Systemeinstellung ohne Wahl und eine Seite ohne JavaScript (kein Attribut) zeigen die ruhige Fassung. Tailwind-Varianten `bewegt:` und `ruhig:`; `motion-safe:` und `motion-reduce:` sind gesperrt (folgen nur der Systemeinstellung, Test). JavaScript-Bewegung fragt `bewegungReduziert()`, Client-Komponenten `useBewegung()`. Umschaltknopf `BewegungSchalter` im Fuß jeder Seite (`aria-pressed`, sichtbar „Bewegung: an“ oder „Bewegung: ruhig“, die Angabe wählt CSS vom ersten Bild an; ohne JavaScript ausgeblendet). Startzustände der Inszenierung hängen an der Klasse `sm24-start`, die das Startskript nur bei „an“ setzt und nach höchstens 2 s wegnimmt. Jede Dauerschleife nutzt `useDauerschleife` (läuft nur bei „an“, im Bild, im sichtbaren Tab und ohne Pause) und zeigt den `PauseKnopf` (44 px, „… anhalten“ und „… fortsetzen“).
- **Kennungen (seit 2.0):** Jede Animation trägt `data-motion="B-xx"` (Hülle oder Element; `InView` mit Prop `kennung`, Standard B-27); die Zustände `wait` und `play` stehen in `data-zustand`. Ein Prüfwerkzeug gleicht die Kennungen mit diesem Register ab (`werkzeuge/bewegung.mjs` wartet auf `data-zustand="play"`).
- **Plattform zuerst (seit 2.0):** Einstiege über `@starting-style`, wo der Browser es kann; Scroll-Zeitleisten hinter `@supports` mit Rückfall; View Transitions für Seitenwechsel; die vorhandene CSS-Mechanik bleibt die einzige Bewegungsbibliothek.
- **Reduzierte Bewegung:** Bewegungen werden zu Sofortzuständen; die globale Regel in `globals.css` verkürzt jede Animation und jeden Übergang auf 0,01 ms. Die Spalte „Reduziert“ nennt das Höchstmaß, „sofort“ ist immer zulässig. Inhalte sind immer sichtbar. JavaScript-Scrollen nutzt `scrollVerhalten()` aus `src/lib/bewegung.ts`.
- **Bausteine in `globals.css` und `tailwind.config.ts`:** `sm24-draw`, `sm24-reveal`, `sm24-fade`, `sm24-pop`, `sm24-dash`, `sm24-aufdecken` (Fläche deckt sich von links auf, `clip-path`), `sm24-scrub-*`, `sm24-schritt-vor`/`-zurueck` (B-11), `.sm24-ruhig` (keine Einstiegsbewegung nach dem ersten Wechsel), `animate-spin` mit `--dauer-scene` (B-19). Varianten: `hover:`/`group-hover:` wirken projektweit nur bei feinem Zeiger (`future.hoverOnlyWhenSupported`), `zeiger:` für übrige Zeiger-Effekte, `fokus-innen:` (enthält sichtbaren Tastaturfokus). Hilfsklasse `zahl-ohne-pfeile` für Zahlenfelder mit eigenen Knöpfen.
- **Ohne JavaScript:** Alle Einstiegsbewegungen spielen sofort ab oder entfallen; nichts bleibt unsichtbar.

| ID | Bewegung | Zweck | Auslöser | Stufen | Reduziert |
|---|---|---|---|---|---|
| B-01 | Fräsbahn im Hero (Startseite) | Charakter | Grafik zur Hälfte sichtbar (Hülle `FraesbahnBewegung`, `data-motion`) | Fräser blendet ein (Verzögerung 0,3 s), Profil zeichnet `draw` 1,1 s, die gefräste Fläche deckt sich im selben Takt auf (`sm24-aufdecken`), Fräser folgt per `transform` (WAAPI), sein Rad dreht dabei linear (`rotate`, WAAPI), hebt danach `quick`/`exit` ab | Profil sofort vollständig, Fräser ruht gehoben frei von der Spitze |
| B-02 | Profillinie zeichnet sich | Hierarchie | Abschnitt sichtbar (InView) | `enter` 600 ms, `draw` | sofort vollständig |
| B-03 | Ablauf am Scrollen (Startseite, Autoschlüssel-Ablauf) | Orientierung | Scrollposition (`view()`) | Fortschrittslinie `scaleY` 0 → 1, Schrittmarken wachsen nur über `scale` (keine Deckkraft, damit die Ziffern lesbar bleiben) | Endzustand statisch |
| B-04 | Abschnittsauftritt (`sm24-reveal`) | Hierarchie | InView, höchstens einer je Bildschirmhöhe | `enter` 600 ms, 8 px; Reihen gleichartiger Stellen (Fotostellen der Vorlage) gestaffelt ≤ 120 ms je Stelle | sofort sichtbar |
| B-05 | Knopfdruck | Rückmeldung | `:active` | `scale(0.98)` `quick` (ein Übergang für Druck und Farbe) | keine Skalierung, Farbwechsel bleibt |
| B-06 | Karten- und Link-Hover | Rückmeldung | Hover (feiner Zeiger), Fokus | Pfeil `translateX(4px)`, Rahmenfarbe, `shadow-raised`; `quick` | nur Farbe |
| B-07 | Mobiler Drawer | Zustandswechsel | Menüknopf (Öffnen in einer React-Transition, `startTransition`; Fokus ein Bild später) | Schublade fährt ein (`animate-schublade-ein`, `translateX(100%)` → 0, `base` `enter`), Schleier blendet ein (`animate-schleier-ein`, `quick`); Untermenü eines Bereichs `animate-menue-ein` (`base`); Schließen ohne Ausgang (die Schublade wird ausgehängt) | sofort |
| B-08 | Megamenü | Zustandswechsel | Klick, Tastatur, Überfahren (feiner Zeiger) | Deckkraft + `translateY(-4px)` `base` (`animate-menue-ein`); Winkel am Menüpunkt dreht 180° `base` | sofort |
| B-09 | Akkordeon | Zustandswechsel | Klick | Pfeil dreht 180° `base`; Inhalt blendet ein `quick` | sofort |
| B-10 | Flow-Fortschritt | Orientierung | Schrittwechsel | `scaleX` `slow`, `standard` (statt `width`); Schrittknöpfe wechseln die Farbe `quick` `standard` | sofort |
| B-11 | Schrittwechsel im Ablauf | Zusammenhang | weiter/zurück | Inhalt blendet ein + 8 px in Richtung `base` | sofort |
| B-12 | Bestätigungshaken (CheckDraw) | Rückmeldung | Bestätigung erscheint | Fläche, Kreis, Haken, gesamt ≤ 900 ms | sofort vollständig |
| B-13 | Seitenwechsel mit gemeinsamem Element | Zusammenhang | Bereichskarte → Bereichskopf | ViewTransition `slow`, nur wo der Browser sie kennt (`seitenwechsel.tsx`); das Prüfwerkzeug erfasst sie nicht, belegt ist sie am Code | keiner |
| B-14 | Schließplan wählen | Zusammenhang | Schlüssel oder Tür wählen | Deckkraft und Farbe `base` `standard` (Übergang an Kanten und Knoten) | sofort |
| B-15 | Live-Schlüssel | Rückmeldung | Code-Eingabe | vor der Eingabe Rohling (gestrichelte Einschnittzone); erster Code zeichnet die Einschnitte (`draw`, `.sm24-nur-zeichnen`), jede weitere Änderung überblendet `quick` | sofort |
| B-16 | Code-Fundstelle umschalten | Orientierung | Auswahl Ort | Überblendung `animate-schleier-ein` (`quick`) über einen wechselnden `key`; die Einstiegsbewegung der Zeichnung spielt danach nicht erneut (`.sm24-ruhig`) | sofort |
| B-17 | Zylindermaß live | Rückmeldung | erstes Anzeigen und jede Maßänderung im Konfigurator | Überblendung `quick` | sofort |
| B-18 | Tür-Schutzpunkte | Hierarchie | InView | Marken `sm24-pop`, gestaffelt ≤ 5 × 120 ms; mit Hervorhebung (`fokus`) stehen die übrigen Linien und Marken bei 30 % Deckkraft, ihre Legende ohne Deckkraft in `foreground-subtle` (≥ 4,5:1) | sofort |
| B-19 | Ladeanzeige | Rückmeldung | Laden | Glyph `laden` dreht (`transform`), 900 ms/Umdrehung | ruht, Text „lädt …“ bleibt |
| B-20 | Warenkorb-Zähler, Summen, Trefferzähler | Rückmeldung | Menge, Summe oder Trefferzahl ändert sich | Zähler `sm24-pop` `quick` (Warenkorb; Trefferzahl der Shop-Liste `/artikel` über einen wechselnden `key`); Summen (Warenkorb, Kasse, laufende Summe im Konfigurator und im Band der `FlowShell`, Summe im Artikelkauf) blenden beim ersten Anzeigen und bei jeder Änderung über einen wechselnden `key` mit `animate-schleier-ein` (`quick`) ein | sofort |
| B-21 | Reihe der Schlüsselarten (Autoschlüssel; Modellseite H03 mit den erfassten Arten) | Hierarchie | InView; in der Kopfreihe hat jede Karte ihr eigenes InView (Schwelle 0,25), Karten außerhalb der mobilen Leiste zeichnen erst beim Wischen | Schlüssel nacheinander `sm24-reveal`, Staffel ≤ 4 × 120 ms; in jeder Zeichnung erst die Körper (0,4 s, Kopien 80 ms gestaffelt), dann zeichnen die Profile, zuletzt Marken (eine Gruppe je Schlüssel, `sm24-fade`) und Ziffern; Funk-Bögen der Funkschlüssel als `sm24-dash` (ein Durchgang, 1,0–1,2 s); je Zeichnung höchstens 1,6 s | sofort |
| B-22 | Code-Fundstelle (Generator-Einstieg) | Orientierung | InView | Bestand `sm24-draw`/`sm24-pop` | sofort |
| B-23 | Ablaufzeichnung (Generator `ablauf`, Köpfe von Ratgeber und Service und Termin) | Reihenfolge | InView | Bemaßungslinie `sm24-draw` ≈ 0,6 s, bis fünf Stationen `sm24-pop` Staffel ≤ 5 × 120 ms, Beschriftung `sm24-fade` mit ihrer Station; gesamt < 1,6 s | sofort |
| B-24 | Lesefortschritt (Ratgeber) | Orientierung | Scrollen (`animation-timeline`, nur wo unterstützt) | Leiste am Verzeichnis `scaleY` mit dem Artikel; Nummer des Abschnitts an der Leselinie (40 %) in Primärfarbe; Klassen `sm24-lesen*` | ruht (keine Leiste, keine Hervorhebung) |
| B-25 | Stiftzuhaltung am Scrollen (Kür K-01, `/gleichschliessende-zylinder`) | Mechanik | Scrollen (`animation-timeline: --szene`, nur wo unterstützt) | Schlüssel fährt ein (`translateX`), dann heben sich je Bohrung Stifte (`translateY`) und Federn (`scaleY`), Staffel über `--stift-nr`; Prüfmarken erscheinen zuletzt; Klassen `sm24-szene`, `sm24-scrub-*`; ein Rahmen mit `overflow: hidden` um die Szene schneidet mit `clip` (kein Scrollcontainer) | Endlage: Schlüssel steckt, alles passt |
| B-26 | Einsatzradius im Standortkopf (`/standorte/[city]`, `EinsatzradiusZeichnung`) | Orientierung (Reichweite vor Ort) | Kopf sichtbar nach dem Hydrieren (InView des Seitenkopfs) | Marke `sm24-pop` ab 0 s, Ort `sm24-fade` ab 0,2 s, Kreis `sm24-draw` `enter` ab 0,1 s, Radius-Maßlinie `sm24-draw` `base` ab 0,7 s, Pfeilspitze und „r … km“ `sm24-pop` ab 0,95 s; gesamt ≤ 1,6 s | sofort vollständig |
| B-27 | Einstieg der Fachgrafiken (alle Generatoren der Registry, etwa über `ImagePlaceholder`, u. a. `zylinder-mass`, `schliessplan`, `tuer-schutz`, `zutritt-signal`, `profilschnitt`, `schluessel`, `code-fundstelle`) | Hierarchie (die Zeichnung entsteht wie auf dem Reißbrett) | beim Sichtbarwerden nach dem Hydrieren (InView, `data-motion`) – in `Section` und im Seitenkopf | Körper `sm24-reveal`, Linien und Kanten `sm24-draw`, Marken und Knoten `sm24-pop`, Beschriftungen `sm24-fade`, gefräste Flächen `sm24-aufdecken`, Funk- und Signalbögen `sm24-dash` (ein Durchgang); gestaffelt über `--sm24-delay`; je Zeichnung ≤ 1,6 s. Eigene Einträge (B-01, B-14 bis B-18, B-21 bis B-23, B-26) gehen vor | sofort vollständig |
| B-28 | Markierung des aktiven Bereichs (Bemaßungsstrich unter dem Kopfeintrag, Markierung oben in der mobilen Aktionsleiste) | Orientierung | Seitenwechsel in einen Bereich | `scaleX` 0 → 1 aus der Mitte, `base` `standard`; die Beschriftung der Aktionsleiste wechselt die Farbe `quick` | sofort |
| B-29 | Auswahlzustand und Eingabefelder (Termin-Tage und Zeitfenster, Optionskarten, Schalter, Filter der Artikelliste, Eingabe- und Auswahlfelder in `forms/controls.tsx`) | Rückmeldung | Wahl, Fokus, Hover | Farbe, Rahmen und Fläche `quick` (`transition-colors`) | sofort |

| B-30 | Leuchten der Kacheln und Hauptaktionen (seit 2.0) | Rückmeldung | Hover (feiner Zeiger), Fokus | Lichthof in Bereichsfarbe (Token `--leuchten`) blendet `quick` ein, Rahmen `area-strong`; keine Größenänderung | nur Rahmen und Ring |
| B-31 | Eingangsinszenierung (Startseite, seit 2.0, umgesetzt in E4-OPUS-02) | Charakter, Angebot erklären | erstes Bild, solange das Startskript `sm24-start` gesetzt hat (höchstens 2 s) | reines CSS (`.sm24-eingang-teil`, Keyframe `sm24-eingang` nur mit `from`, Startwerte als `--start-x`, `--start-dreh`, `--start-gross`, `--start-deckkraft`, je Teil alle vier gesetzt): Autoschlüssel fährt an den Profilzylinder (0,1 s, 0,5 s `enter`), Kern dreht 90° (0,6 s, 0,28 s), Paar rückt als Tür 01 in den Plan (0,85 s, 0,4 s), Türen 02 bis 04 blenden ein (ab 0,95 s, Staffel 3 × 120 ms); gesamt 1,47 s. Mobil Band 320 × 56, ab 1024 px Bühne 480 × 300 mit Türnummern (`src/components/visual/inszenierung/`) | Endbild des Schließplans ohne Bewegung (auch ohne JavaScript und nach dem Zeitlimit) |
| B-32 | Dauermotiv der Inszenierung (seit 2.0, umgesetzt in E4-OPUS-02) | Lebendigkeit (G-06) | nach B-31, nur bei laufender Schleife (`useDauerschleife`: Bewegung an, im Bild, Tab sichtbar, nicht pausiert) | alle 6 s wechselt `data-phase`: Schlüssel zieht 12 px zurück und der Kern dreht zurück, dann wieder hinein (`slow`, `standard`); Pause-Knopf unten rechts | steht still |
| B-33 | Code-Motiv (seit 2.0, G-13) | Markenwelt | sichtbar, höchstens drei Elemente je Ansicht | Schließcode-Ziffern ordnen sich zu einer Bartlinie (Deckkraft, `translateY` ≤ 4 px, Staffel), dann Ruhe; nie Zeichenregen | statische Linie |
| B-34 | Druckrückmeldung der Kacheln (seit 2.0) | Rückmeldung | `:active`, Touch | `scale(0.97)` `instant`, Lichthof kurz kräftiger | nur Farbe |
| B-35 | Übergang Kachel zu Rubrik (seit 2.0, erweitert B-13, umgesetzt in E4-OPUS-04) | Zusammenhang | Tipp auf eine Hub-Kachel | gemeinsames Element: Kachel-Icon wird Rubrikkopf (`Seitenwechsel` mit `rubrik-<id>`, `PageHeader rubrik`, ViewTransition `slow`); ohne Unterstützung Überblendung des Kopfs `quick` (`.sm24-ueberblendung`); ein Tippen beendet den Übergang (`activeViewTransition.skipTransition`); danach Fokus auf der h1 (`RubrikAnkunft`, nur nach dem Tipp im Hub, gemerkt in `sessionStorage`) | sofort |
| B-36 | Pause und Bewegungsschalter (seit 2.0) | Steuerung | Klick | Glyph wechselt Pause/Abspielen mit Überblendung `quick` | sofort |

- Neue Einträge gibt es nur durch den Orchestrator. Bewegung ohne Eintrag wird entfernt.
- Jeder Übergang trägt ein Dauer-Token (`duration-quick`, `duration-base`, …); ein nacktes `transition-*` ohne Token gibt es nicht.
- Reduzierte Bewegung: Die globale Regel in `globals.css` setzt Dauer und Übergang auf 0,01 ms. „sofort“ heißt deshalb: Endzustand ohne Zwischenbilder.

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
- **Neue Fach-Icons (seit 2.0, E3-GRAFIKER-01):** `motorradschluessel`, `schluesselgehaeuse`, `transponder-kopie`, `schluesselfinder`, `vor-ort`, `karte`, `video`; neue Glyphen `pause`, `bewegung`. Alle im 48er-Raster mit `IconBase`, Strich 1,75 px, Zweiton nur bei Fach-Icons.
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
- **Ohne KI-Spuren (seit 2.0, G-48, Auftrag 14):** keine Gedankenstriche (weder lang noch halblang; Einschübe in Kommas, Klammern oder eigenen Sätzen), Bindestriche nur, wo die Rechtschreibung sie verlangt (Abkürzungen, Ziffern, Namen wie Burg-Wächter), Bereiche mit „bis“ (09:00 bis 13:00 Uhr), keine Ausrufezeichen, keine Emojis, keine rhetorischen Fragen außer der Hub-Frage und echten Kundenfragen in Akkordeons, keine Dreierreihen von Adjektiven, keine Floskeln der Liste in Auftrag 14. Austauschprobe: Passt ein Satz unverändert zu einem anderen Schlüsseldienst, wird er neu geschrieben.
- **Laiensprache (seit 2.0):** Jeder Fachbegriff wird beim ersten Auftreten in einem Halbsatz erklärt (Glossar K-012). Jede Seite sagt in einem Satz, was hier passiert und was es kostet.
- **Ehrlichkeit (seit 2.0):** Eine Prüfung ist nie eine Fertigungszusage; „kostenlos einschicken“ nur, wenn wirklich nichts zusätzlich berechnet wird; die 24 im Namen verspricht keinen Notdienst rund um die Uhr.
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

### K-012a Glossar Schließtechnik für Laien (seit 2.0, aus FACHWISSEN.md)
Jede Erklärung ist ein Halbsatz zum Einsetzen beim ersten Auftreten eines Begriffs.
- **Sperrschließung (gleichschließende Zylinder):** ein Schlüssel für alle Türen.
- **Schließanlage:** jeder Schlüssel öffnet nur die Türen, für die er gedacht ist; der Schlüssel des Kindes nur sein Zimmer und die Haustür, der Schlüssel der Eltern alle Türen.
- **Zentralschließanlage:** jeder Bewohner hat seinen Schlüssel, und alle öffnen zusätzlich die gemeinsamen Türen wie Haustür und Keller.
- **Hauptschlüsselanlage:** ein Hauptschlüssel öffnet alle Türen, die übrigen Schlüssel nur ihre eigene.
- **Generalhauptschlüssel:** öffnet in einer großen Anlage alle Gruppen, darunter gibt es Gruppenschlüssel.
- **Schließplan:** die Liste, welcher Schlüssel welche Tür öffnet.
- **Profilzylinder:** der Teil des Schlosses, in den man den Schlüssel steckt.
- **Maß A und Maß B:** wie weit der Zylinder von der Mitte der Befestigungsschraube nach außen (A) und nach innen (B) reicht.
- **Stulpschraube:** die lange Schraube in der Türkante, die den Zylinder hält.
- **Not- und Gefahrenfunktion:** die Tür lässt sich von außen öffnen, auch wenn innen ein Schlüssel steckt.
- **Freilauf:** der Schließbart dreht frei, wenn kein Schlüssel steckt, nötig bei manchen Fluchttürschlössern.
- **Bohrschutz und Ziehschutz:** gehärtete Teile gegen Aufbohren; Schutz gegen das Herausziehen des Zylinders.
- **Sicherungskarte:** der Ausweis zur Anlage; ohne sie gibt es keine Nachschlüssel.
- **Transponder:** der kleine Funkchip im Autoschlüssel, ohne den die Wegfahrsperre den Motor nicht starten lässt.
- **Klonen und Anlernen:** Klonen kopiert den Chip in der Werkstatt; Anlernen trägt den Schlüssel im Auto ein, dafür muss das Auto vor Ort sein.
- **Fahrzeugschein:** die Zulassungsbescheinigung Teil I, Nachweis, dass Ihnen das Fahrzeug zusteht.

## K-013 Intent-Hub und erster Bildschirm (seit 2.0, G-01 bis G-05, A-008; umgesetzt in E4-OPUS-01, Version 2.2)
- **Aufbau:** Frage „Wobei können wir Ihnen helfen?“ (einzige rhetorische Frage der Seite, `HUB_FRAGE`) als h1 in `text-display`, ein Satz darunter (`subline` der Startseite in `content/seo.json`, höchstens zwei Zeilen bei 390 px), das Kachelraster aus den Rubriken (`getHubRubriken`: `imHub`, `status: live`, `reihenfolge`), Anrufen als sichtbarer `tel:`-Link mit Nummer. Bausteine in `src/components/hub/` (`IntentHub`, `HubKachel`, `CodeMotiv`). Das größte Element ist die Frage, nie die Grafik. Direkt danach folgt der Autoschlüssel-Abschnitt (L-004) mit der Fräsbahn (B-01), Handlung und Eckdaten.
- **Raster:** mobil immer drei Spalten (`gap-2`), ab 768 px vier, oder drei, wenn sich die Zahl der Kacheln nur durch drei teilt (`hubSpalten`, etwa neun Kacheln, solange Motorrad, Gehäuse und Beratung noch nicht live sind). Ab 1024 px steht das Raster links in 7 von 12 Spalten; rechts (5 Spalten) oben die Bühne der Inszenierung (B-31), unten Anrufen. Unter 1024 px löst sich die rechte Spalte auf: Bühne als Band über der Frage (56 px hoch, höchstens 64 px, damit bei 390 × 844 auch zwölf Kacheln über der Aktionsleiste sichtbar bleiben), Anrufen nach dem Raster; mobil liegt Anrufen zusätzlich in der Aktionsleiste (E4-OPUS-03). Kein Wischen, kein Karussell. Gemessen (E4-OPUS-01, auch mit zwölf Kacheln nachgebildet): bei 390 × 844 und 1440 × 900 alle Kacheln ohne Scrollen, bei 360 × 780 mindestens neun.
- **Kachel:** Fach-Icon aus der Registry `src/components/visual/fach-icon.tsx` (`FachIcon`, Name aus `Rubrik.icon`) mit 32 px, ab 768 px 40 px, in `text-area-strong`; Laienname mobil `text-small` halbfett zentriert, ab 768 px `text-title-sm` linksbündig; `zusatz` (Laienerklärung, G-09) mobil `text-caption`, ab 768 px `text-small`. Trennung nur an guten Stellen (`.trennung-kachel`: `hyphens: auto`, `hyphenate-limit-chars: auto 4 5`). Längen: Laienname höchstens zwei Zeilen bei 360 px (etwa 11 Zeichen je Zeile), `zusatz` höchstens zwei Zeilen; längere Rubriknamen bekommen einen kürzeren Laiennamen (etwa „Elektronisch schließen“ für „Elektronische Schließsysteme“), der Name bleibt Seitentitel. Mindestens 96 px hoch (`min-h-24`), `rounded-lg`, Rahmen `border`, die ganze Fläche ist der Link (`prefetch={false}`). Leuchten (B-30) bei Hover und Fokus mit Rahmen `area-strong`, Druck (B-34) `scale-kachel` (0,97) mit `shadow-leuchten-druck`; Lichthof und Druck nur mit `bewegt:`, die ruhige Fassung zeigt Rahmen und Ring.
- **Übergang (B-35):** Das Kachel-Icon trägt den Namen `rubrik-<id>` (`rubrikUebergang`), je Rubrik eindeutig, weil sich mehrere Rubriken einen Bereich teilen; der Rubrikkopf übernimmt denselben Namen (E4-OPUS-04).
- **Code-Motiv (B-33, G-13):** sieben Schließcode-Ziffern über der Bartlinie, die sie beschreiben (Tiefe je Ziffer), unskaliert 320 × 56 px, Ziffern 12 px; erst ordnen sich die Ziffern (`.sm24-ordnen`: Deckkraft und 4 px, Staffel 80 ms), dann zeichnet sich die Linie (`sm24-draw`). Ab 640 px unter dem Raster, mobil nicht (dort ist die Höhe dem Raster vorbehalten). Höchstens einmal je Ansicht.
- **Ausnahme S6:** Der Hub ist das eine gewollte Raster gleich gebauter Kacheln; er hebt sich durch eigenes Formsystem, Bewegung und Laiensprache ab. Weitere Kachelraster auf der Startseite gibt es nicht.

## K-014 Rubriken-Modell und Wege-Bausteine (seit 2.0, G-10, G-11, G-38, A-006, Auftrag 11)
- **Eine Quelle:** Sammlung `rubriken` mit Spiegel `content/rubriken.json`. Hub, Navigation (G-08), Sitemap und Rubrikseiten lesen nur dort. Felder: kennung, name, laienname, erklaerung, icon, ziel, ablaufschritte, abschlussart (kasse, anfrage, termin-anzahlung, angebot-zahlungslink, beratung), formular, pflichtUploads, berechtigungsnachweis, status (live, spaeter, aus), reihenfolge, navigationsgruppe, imHub, bereich.
- **Bausteine jedes Wegs:** Ablaufschritte mit Icons („So läuft Ihr Auftrag ab“, `RubrikAblauf` aus `rubrik.ablauf`, Platzhalter `{anzahlung}` und `{vorlauf}` aus den Einstellungen; ein Satz mit fehlendem Wert entfällt) · Formular mit sichtbaren Beschriftungen, `autocomplete`, hilfreichen Fehlern · Upload mit Vorschau und Fotohilfe · Berechtigungsnachweis (R13) serverseitig geprüft · Zusammenfassung vor dem Absenden · Bestätigung in einfacher Sprache mit nächstem Schritt · Vorgangsblatt als PDF · Messereignis nur nach Einwilligung.
- **Laientauglich:** vom Hub bis zur ersten Eingabe höchstens drei Tipps; keine Sackgassen; Anrufen und Rückruf von jeder Rubrik in einem Schritt.
- **Navigation aus den Rubriken (seit 2.4, E4-OPUS-03, G-08):** `navigationsGruppen(rubriken)` in `src/lib/navigation.ts` bildet die fünf Gruppen Autoschlüssel · Schlüssel nach Code · Sperrschließungen · Schließanlagen · Mehr aus den Rubriken mit Status „live“ (Feld `navigation`), dazu die Spalten des bisherigen Bereichs und unter „Mehr“ Partner werden, Ratgeber und Anleitungen, Service und Termin, Kontakt (Über uns folgt mit E8-AUTOR-02). Das Root-Layout holt Rubriken und Einstellungen auf dem Server und reicht Gruppen, die serverseitig gezeichneten Fach-Icons und das Telefon an `SiteHeader` und `MobileActionBar`. Leiste: ab 1024 px Autoschlüssel, Nach Code, Sperrschließungen, Mehr; ab 1280 px zusätzlich Schließanlagen. Die Aktionsleiste trägt „Anrufen“ (`tel:`), ohne wählbare Nummer „Service“. Der Fuß listet die Leistungen aus den Rubriken und jede Bereichsseite ohne Rubrik. Rückruf als eigener Weg folgt mit E6-BAUMEISTER-03.


## Markierte Annahmen
- Marke und Zielgruppe sind aus Texten abgeleitet (K-002).
- Die Schwelle 96 px Bandhöhe der Inszenierung mobil und die Kachelhöhe von 96 px sind aus dem Platzbedarf bei 390 × 844 abgeleitet und werden in E4 am Bild bestätigt.
- Der iOS-Zoom ist aus der Kaskade abgeleitet und nicht am Gerät geprüft.
- Die Wirkung von tailwind-merge auf eigene Größen wird mit E0-KUNDSCHAFTER-06 belegt.

## Änderungen
- **2.5 (2026-11-03, E4-OPUS-04):** B-35 wie umgesetzt; `RubrikAblauf` mit Platzhaltern; Rubrikkopf über `PageHeader rubrik` auf allen Hub-Zielen.
- **2.4 (2026-11-03, E4-OPUS-03):** K-014 um die Navigation aus den Rubriken ergänzt (Gruppen nach G-08, Leiste je Breite, Anrufen in der Aktionsleiste, Fuß aus den Rubriken).
- **2.3 (2026-11-03, E4-OPUS-02):** B-31 und B-32 wie umgesetzt (reines CSS ab dem ersten Bild, Startwerte je Teil vollständig, Schleife mit `data-phase`), Band 56 px, Kachel-Icon mobil 32 px; G-07: Fräsbahn-Schlüssel mit Halm 194 × 46 (gut 4 : 1), Einschnitte im Abstand von rund 22 px, Ausschnitt fasst den ganzen Schlüssel.
- **2.2 (2026-11-03, E4-OPUS-01):** K-013 nach Umsetzung und Messung: Spaltenregel (mobil 3, ab 768 px 4 oder 3), Raster links mit Bühne und Anrufen rechts ab 1024 px, Band mobil höchstens 64 px, Kachelschrift mobil `text-small`, Trennung `.trennung-kachel`, Längenregeln für Laiennamen, Übergangsnamen je Rubrik, Code-Motiv mit `.sm24-ordnen`, Icon-Registry `fach-icon.tsx`. Grund: Mit `text-title-sm` und sechs Spalten passen deutsche Leistungsnamen nicht in zwei Zeilen, und zwölf Kacheln stehen sonst nicht vollständig im ersten Bildschirm.
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
- 1.15 · E6 · K-007: B-20 auch für den Trefferzähler der Shop-Liste und die Summe im Band der `FlowShell`; B-23 bis fünf Stationen (Köpfe von Ratgeber und Service und Termin); neu B-26 Einsatzradius im Standortkopf. K-006: Einleitung von Warenkorb und Kasse bleibt sichtbar (D-046). Grund: Entwürfe der Runde 2 (U-ARTIKEL, U-SERVICE, U-STANDORTE, H10), vor dem Bau festgelegt. Dazu K-006: Zeilenpfeil in Behältern mit überdeckendem Link `group-focus-within:`; Ausnahme Abschnittsnummern im Ratgeber (B-24). Grund: Abnahme Bauwelle 1 (D-047).
- 1.16 · E6 · K-007: Register vervollständigt. B-01 Fräserrad (WAAPI), B-04 Staffel der Fotostellen, B-05 `quick` wie im Baustein, B-08 Winkel, B-14 mit Dauer-Token, B-16 `schleier-ein`, B-17 und B-20 auch beim ersten Anzeigen, B-21 Funk-Bögen; neu B-27 Einstieg der Fachgrafiken, B-28 Markierung des aktiven Bereichs, B-29 Auswahlzustand. Code: Zähler im Kopf `quick` (B-20), Schließplan-Übergänge mit `duration-base ease-standard` (B-14), ungenutzter Keyframe `sm24-scrub-x` entfernt (Nutzungssuche ohne Fund). Grund: Registerabgleich Prüfstufe C Teil 5 (`_werkstatt/protokolle/E6-PRUEFER-C-register.md`), Kriterium Z-05 „jede Animation im Register“.
- 1.17 · E7 · K-007 nach Etappe E7: B-07 Öffnen als Transition, B-08 Auslöser Überfahren, B-10 Schrittknöpfe, B-18 Legende der Hervorhebung ohne Deckkraft, B-21 Markengruppe, Funk-Bögen 1,0–1,2 s und Karten der Kopfreihe je InView, B-26 und B-27 im Seitenkopf nach Sichtbarkeit, B-28 Beschriftung der Aktionsleiste; zutritt-signal endet ≤ 1,55 s. Grund: Registernachprüfung (`E6-PRUEFER-C-register-nachtrag.md`) und Etappe E7 (D-049).
- 1.18 · E7 · K-004 CSS im Dokument, K-006 Ersatzschriften während des Ladens. Grund: Messung Anlauf 1 (`E7-PRUEFER-01-ergebnis.md`, LCP 3/12) und Anlauf 2 (Paket E7-L-43, D-050).
- 1.19 · E7 · K-007 an den Code angeglichen: B-07 (Keyframes Schublade, Schleier, Untermenü; Schließen ohne Ausgang), B-08 mit Keyframe-Namen, B-07/B-08/B-11 reduziert „sofort“ (globale Regel), B-13 nur am Code belegt, B-29 mit Eingabefeldern und Artikelfilter, Regel „kein Übergang ohne Dauer-Token“. Korrektur zu 1.17: zutritt-signal endet bei 1,60 s (≤ 1,6 s), nicht ≤ 1,55 s. Grund: Registerbefunde R-1 bis R-8 und N-1 der Prüfstufe C, Abschlussversuch 2 (`E7-PRUEFER-C-register.md`, Paket E7-L-44).
- 2.0 · E2 · Ausbaulauf: Leitidee geschärft (offene Werkstatt, Linie vom Schlüssel über den Code zum Werkstück), Personas und Hauptaufgaben nach G-03, Prinzipien 6 und 7 (kein Wischen für Auswahl, ein Dauermotiv mit Pause), Stack 16.4, Schriften lokal ohne Inter (A-003), PDF (A-004), OKLCH mit Abstufungsregel, Fließtext 17 px, Tippziele 48 px, Leuchten B-30, Bewegungsschalter und Kennungen, B-30 bis B-36, neue Icons, Ton ohne KI-Spuren, Glossar Schließtechnik, K-013 Hub, K-014 Rubriken und Wege. Grund: Auftrag Abschnitte 4, 11, 12, 14; E0-Kundschafter 03; FACHWISSEN.md.
- 2.1 · E3 · K-005 Abstufungsregel mit Zahlen (accent 0,605, strong 0,485 = Markenblau, soft 0,96, muted 0,90), neue Bereichstöne ohne Lila (Code Messing 97°, Schließanlagen Stahlblau 229°, Service Himbeerrot 2°, übrige neu verteilt mit 31° bis 33°), Funktionsfarben nach der Regel, Lila-Prüfung in OKLCH und HSL; K-006 Schriften als Dateien (Plex Sans variabel, Mono drei Schnitte), Familienname gleich Konstante, Ersatz nur aus globals.css; Typoskala `text-lead` 18 → 20 px und `text-title-sm` 17 → 19 px über dem Fließtext; Token `--leuchten` mit `shadow-leuchten`. Grund: Umsetzung E3-OPUS-02 (A-013).
