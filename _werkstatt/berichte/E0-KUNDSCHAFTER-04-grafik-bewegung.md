# Grafik und Bewegung: Kundschafter-Bericht (E0)

Basis: `/home/user/schluesselmacher24`. Die Fundstellen sind Pfade relativ zu `src/` bzw. zur Basis, Zeilen per Read/Grep geprüft. Nur lesend, keine Änderungen.

## 1. src/components/visual (Icons, Generatoren, Registry)

- **Fach-Icons:** 54 Dateien plus `icons/icon-base.tsx` (55 Dateien). `icons/icons.test.tsx` listet alle 54.
- **IconBase** (`icons/icon-base.tsx:21-38`): viewBox 0 0 48 48, Standard 48 px, `fill="none"`, `stroke="currentColor"`, strokeWidth 2, runde Enden und Ecken, `shrink-0`. Ohne `title` aria-hidden, mit `title` `role="img"` plus `<title>`.
- In den 54 Icons gibt es keine strokeWidth-Overrides, keine `id`, keine Texte, Verläufe, Masken oder Marker.
- Zweitonflächen: 56x `fill-area-muted`, mit `stroke="none"` (bei mehrzeiligen Fällen in der Folgezeile, Stichprobe geprüft).
- Abweichung von der README-Regel (kräftiges `fill-area` statt `fill-area-muted`), 8 Stellen: `elektronische-zutrittsloesungen.tsx:13`, `halbzylinder.tsx:14`, `knaufzylinder.tsx:12`, `nachweis.tsx:15`, `panik-alarmtaster.tsx:10`, `profilzylinder.tsx:14`, `termin.tsx:15`, `videoueberwachung.tsx:10`. Alle sind kleine Punkte oder Schlitze.
- **Generatoren** (5, je Datei, viewBox 480x270, Schliessplan 480x300):
  - `schluessel.tsx`: typ (6 Werte), einschnitte (4 bis 8 Ziffern), code, anzahl (1 bis 3). 4 Parameter.
  - `zylinder-mass.tsx`: bauform (3), aussen und innen (25 bis 100), knaufseite. 4 Parameter.
  - `schliessplan.tsx`: system (4), gruppen (1 bis 4), tueren (2 bis 8). 3 Parameter.
  - `code-fundstelle.tsx`: ort (3). 1 Parameter.
  - `zutritt-signal.tsx`: medium (3). 1 Parameter.
  - Insgesamt 13 Parameter.
- **Registry** (`registry.tsx:31-37`): 5 Einträge. `renderVisual` in Zeile 44.
- **BereichIcon** (`bereich-icon.tsx:20-30`): `BEREICH_ICONS` mit 9 Bereichen. Komponente in Zeile 41.
- **AreaScope** (`area-scope.tsx:10`): setzt `data-area`.
- **Tatsächliche Verwendung:**
  - Fach-Icons: 0 Fundstellen außerhalb `visual/`.
  - BereichIcon: 0.
  - Generatoren: 0 Aufrufe mit `slot.visual`. Einziger Pfad ist `ui/image-placeholder.tsx:56-57`. `visual` wird nirgends gesetzt: `types.ts:22` ist nur die Definition, und in `content/*.json`, `src/payload` und `src/lib/data` gibt es kein `visual` oder `generator`.
  - AreaScope: 9 Layouts (`layout.tsx:3`): service-und-termin, tuer-und-schliesstechnik, sicherheitstechnik, schliessanlagen, schluessel-nach-vorlage, schluessel-nach-code, elektronische-zutrittsloesungen, gleichschliessende-zylinder, autoschluessel.
- **lucide-react** (einzige aktive Icon-Familie): 167 benannte Importe in 62 Dateien, 60 verschiedene Namen. Am häufigsten: ArrowRight (38 Dateien), Check (9), CheckCircle2 (8), Layers (6).
  - `src/app/(site)/` (Anzahl je Datei):
    - `page.tsx` 9
    - `elektronische-zutrittsloesungen/`: `page.tsx` 13, `konfigurator/page.tsx` 1, `konfigurator/zutritt-konfigurator.tsx` 1
    - `gleichschliessende-zylinder/`: `page.tsx` 4, `konfigurator/konfigurator.tsx` 2, `konfigurator/page.tsx` 1
    - `schliessanlagen/`: `page.tsx` 4, `konfigurator/projekt-konfigurator.tsx` 3, `konfigurator/page.tsx` 1
    - `sicherheitstechnik/`: `page.tsx` 8, `[slug]/page.tsx` 2, `sicherheitscheck/page.tsx` 1, `sicherheitscheck/sicherheitscheck.tsx` 1
    - `tuer-und-schliesstechnik/`: `page.tsx` 11, `[slug]/page.tsx` 2
    - `schluessel-nach-vorlage/`: `page.tsx` 6, `anfrage/anfrage-formular.tsx` 2
    - `schluessel-nach-code/`: `page.tsx` 2, `shop-liste.tsx` 3, `[slug]/page.tsx` 2, `[slug]/bestell-formular.tsx` 2
    - `service-und-termin/`: `page.tsx` 5, `kontakt/page.tsx` 3, `vor-ort/page.tsx` 1, `anfrage/anfrage-formular.tsx` 1, `terminstatus/status-formular.tsx` 1
    - `autoschluessel/`: `page.tsx` 4, `marken/page.tsx` 1, `marken/[make]/page.tsx` 1, `marken/[make]/[model]/page.tsx` 1, `anfrage/page.tsx` 1, `anfrage/assistent.tsx` 2
    - `artikel/`: `page.tsx` 2, `artikel-liste.tsx` 4, `[slug]/page.tsx` 2, `[slug]/artikel-kauf.tsx` 1
    - `standorte/`: `page.tsx` 2, `[city]/page.tsx` 1
    - `ratgeber/`: `page.tsx` 1, `[slug]/page.tsx` 1
    - `warenkorb/`: `page.tsx` 1, `warenkorb-ansicht.tsx` 2
    - `bestellung/[id]/page.tsx` 1
    - `rechtliches/cookie-einstellungen/cookie-einstellungen.tsx` 2
  - `src/components/`:
    - `autoschluessel/`: `bestaetigung.tsx` 3, `preis-anzeige.tsx` 3, `service-article.tsx` 3, `termin-auswahl.tsx` 2
    - `calculator/rechner-bausteine.tsx` 2
    - `flow/flow-shell.tsx` 5
    - `forms/option-card.tsx` 1, `forms/photo-upload.tsx` 6
    - `layout/breadcrumbs.tsx` 1, `layout/mobile-action-bar.tsx` 4, `layout/site-header.tsx` 5
    - `ui/accordion.tsx` 1, `ui/alert.tsx` 4, `ui/button.tsx` 1, `ui/image-placeholder.tsx` 1, `ui/info-tip.tsx` 2
    - `vertrauen/nachweise-liste.tsx` 1
- **Gemischte Familien:** Es gibt nur eine aktive Familie. Die Fach-Icons sind nicht gemischt, weil sie ungenutzt sind. Relatives Strichgewicht: lucide 2/24 (8,3 %), Fach-Icon 2/48 (4,2 %), Generatoren 2,25/480 (ca. 0,5 % der Breite).

## 2. Weitere SVGs

- `src/app/(site)/icon.svg`: Favicon, 32x32. Verwendet Hex-Farben (#0f172a, #1e293b, #334155, #60a5fa, #2563eb, #38bdf8), was der Token-Regel widerspricht (Datei liegt außerhalb von `visual/`). IDs `sm24-grad` und `sm24-key`, je einmal.
- `src/payload/components/Marke.tsx`: `Logo` (Zeile 21) und `Icon` (Zeile 19) für den Payload-Admin, eingebunden in `src/payload.config.ts:53-54`. Inline-SVG mit `aria-hidden="true"` und festen Hex-Farben (#1d5fd1, #ffffff, #bcd4ff), laut Kommentar bewusst.
- Website-Logo: Wortmarke als Text in `src/components/layout/site-header.tsx:49-51`, kein SVG.
- Inline-`<svg>` außerhalb von `visual/`: nur `Marke.tsx`. Inline-Formen (path, circle, rect) außerhalb von `visual/`: keine.
- Doppelte `id`-Attribute: keine gefunden (0 `id=` in `visual/`, zwei eindeutige IDs in `icon.svg`). Das ist grep-basiert und nicht am gerenderten DOM geprüft.
- Assets: kein `public/`-Ordner, keine Bilddateien außer `icon.svg`, keine apple-icon, opengraph-image oder Manifest-Metadaten.
- aria: `GrafikRahmen` (`generators/grafik-basis.tsx:210-226`) setzt `role="img"`, `aria-label` und `<title>` (doppelt, aber konsistent). `CheckDraw` (`motion/check-draw.tsx`) ebenso.

## 3. ImagePlaceholder / ImageSlot

- `ui/image-placeholder.tsx` nutzt eine feste Rangfolge:
  1. `bild.url`: next/image mit `fill` und `object-cover` (Zeilen 31-45).
  2. `visual`: `renderVisual`, Container `bg-area-soft` (Zeilen 56-69).
  3. Platzhalter: gestrichelter Rahmen, `role="img"`, `aria-label="Bildplatzhalter: …"`, lucide `ImageOff`, Motiv, Hinweis, "Bild folgt" (Zeilen 71-96).
- Seitenverhältnisse: 16/9, 4/3, 1/1, 3/2, 21/9 (Zeilen 8-14).
- Verwendung: 37 JSX-Aufrufe in 27 Dateien. Dazu kommen `ImageSlot`-Objekte in Daten und Konstanten, z. B. `components/autoschluessel/optionen.ts:146,205`, `app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx:174-192`, `app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx:88`.
- Mit visual-Generator: 0.
- Die Motive sind Fototexte ("Werkstattfoto: …", "Objektfoto", "Produktfoto") ohne hinterlegtes Bild, z. B. `app/(site)/page.tsx:141-146`.

## 4. Bewegung

- **globals.css** (`src/app/(site)/globals.css`):
  - Vertrag: Zeilen 198-209.
  - Keyframes: 211-233.
  - `sm24-draw`: stroke-dashoffset 1 zu 0, `cubic-bezier(0.65,0,0.35,1)`, 1,4 s, Zeilen 237-241.
  - `sm24-reveal`: Opacity und translateY(8px), `cubic-bezier(0.16,1,0.3,1)`, 0,6 s, Zeilen 243-246.
  - `sm24-pop`: scale 0,6 bis 1,06 (bei 70 %) bis 1, 0,5 s, Zeilen 248-253.
  - `sm24-float`: ease-in-out, 6 s, infinit, Zeilen 255-257. Keine Verwendung.
  - `sm24-dash`: dashoffset zu -24, linear, 1,6 s, infinit, Zeilen 259-263.
  - `[data-motion=wait]`: Pausierung, Zeilen 265-269.
  - Reduce: Zeilen 272-279.
- Keine Keyframes für Layout-Eigenschaften.
- Einsatz: nur in den Generatoren, z. B. `schluessel.tsx:172,345,491,497,508,518,529,541`, `zylinder-mass.tsx:168,214,245-268,282`, `schliessplan.tsx:186,222,303`, `code-fundstelle.tsx:285-311`, `zutritt-signal.tsx:231-334`. Diese Grafiken werden nirgends gerendert (siehe 1).
- `InView`, `Reveal`, `DrawOn`, `CheckDraw` (`motion/`): 0 Importe außerhalb von `motion/`. `InView` ist `'use client'` und arbeitet mit IntersectionObserver. Das Gating "Start erst bei InView" greift damit nirgends.
- framer-motion: `package.json:36` als Abhängigkeit, kein Import im Repo. Keine Layout-Animationen.
- Tailwind:
  - `animate-spin`: 5x (`ui/button.tsx:48`, `components/autoschluessel/termin-auswahl.tsx:84`, `app/(site)/autoschluessel/anfrage/assistent.tsx:1379,1428`, `components/forms/photo-upload.tsx:388`).
  - `animate-fade-in`: Keyframe in `tailwind.config.ts:108-116` definiert, keine Verwendung.
  - `transition-colors`: 43x. `transition-transform`: 24x in 19 Dateien. `transition-all`: 4x. `transition-[width] duration-300`: 1x (`components/flow/flow-shell.tsx:60`).
  - Dauern: nur 300 ms explizit, sonst Tailwind-Standard 150 ms.
  - Hover-Bewegungen: `group-hover:translate-x-0.5` auf nahezu allen Pfeilen, `group-hover:scale-110` (`tuer-und-schliesstechnik/page.tsx:235`), `active:scale-[0.99]` (`:139`), Chevron `rotate-180` (`site-header.tsx:254`).
- View Transitions: keine. `next.config.ts` hat kein `experimental.viewTransition`. Auch kein `view-transition-name` und kein `startViewTransition`.

## 5. Animationen mit Layout-Eigenschaften

- `components/flow/flow-shell.tsx:60`: `transition-[width]`, Fortschrittsbalken.
- `transition-all`: `app/(site)/tuer-und-schliesstechnik/page.tsx:139,233,341` und `app/(site)/page.tsx:301`. Animiert alle Eigenschaften, betrifft aktuell aber nur Schatten, Rahmen und Transform.
- `ui/accordion.tsx:35`: nur Chevron mit `transition-transform`. Der Inhalt hat keine Höhenanimation.

## 6. Reduzierte Bewegung

- Abgedeckt:
  - Alle `sm24-*`-Animationen stehen unter `prefers-reduced-motion: no-preference` (`globals.css:236`). Die Generatoren sind bei reduce sofort vollständig.
  - Globale Regel für `*` (`globals.css:272-279`).
  - `components/forms/photo-upload.tsx:388`: `motion-reduce:animate-none`.
- Lücken:
  - JS-Smooth-Scroll mit `behavior: 'smooth'`, von der CSS-Regel nicht erfasst: `app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx:373`, `app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx:675`, `lib/flow/use-flow.ts:153`.
  - Spinner ohne eigene Regel (`button.tsx:48`, `termin-auswahl.tsx:84`, `assistent.tsx:1379,1428`): nur durch die globale Regel gedämpft. Der Ladezustand wird dadurch statisch.
  - Tailwind-Transitions und Hover-Transforms: nur global gedämpft, kein gezieltes `motion-reduce:`. Im ganzen `src` gibt es genau einen `motion-reduce`-Treffer.

## 7. Große Momente

- Keine Hero-Grafik und keine Szene.
- Startseite: ImagePlaceholder 4/3 (`app/(site)/page.tsx:141`) als Fotoplatz.
- Der stärkste Kandidat, `zutritt-signal` (Schlüsselfluss), ist nicht eingebunden.
- Alle 37 Stellen sind Platzhalterflächen.

## 8. Bewertung

- Fach-Icons: konsistent (IconBase für alle 54, keine Overrides, nur Tokens). Lücke: ungenutzt.
- Generatoren: Konturklassen `KONTUR` 2,25, `LINIE` 1,5, `HILFSLINIE` 1 (`grafik-basis.tsx:14-18`). Daneben viele Literale: 2 (3x), 2,5 (3x), 3, 4 (4x), 4,5, 6, 8, 9, 10, 11, 13 (je 1x), `LINIE+0,25` und `LINIE+0,5` (9x). Uneinheitlich.
- Strichgewichte passen relativ nicht zusammen (8,3 % lucide, 4,2 % Fach-Icon, ca. 0,5 % Generator). Würden sie nebeneinander stehen, wirkten sie unterschiedlich schwer.
- Tokens: Ausnahmen sind `icon.svg` und `Marke.tsx` (Hex). In `app/(site)/page.tsx:301` steht `hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]`. `--primary` ist ein HSL-Tripel (`globals.css:36`: `214 80% 40%`), deshalb ist das `rgba(...)` vermutlich ungültig und der Glow wirkungslos. Nicht im Browser geprüft.
- Ungenutzter Bestand: 54 Fach-Icons, 5 Generatoren, 4 Motion-Bausteine, framer-motion, `animate-fade-in`, `sm24-float`. Genutzt werden sie nur von Tests.
- Positiv: Generatoren sind deterministisch (kein `Math.random` und kein `Date`), es gibt keine `id`-Attribute, und `'use client'` steht nur bei `InView`. 13 Testdateien (6 Generatoren, Registry, Motion 3, Icons 2, BereichIcon 1).
- Lücke: Der Mindestabstand von 3 Einheiten zum Rand der Icons ist nur grob geprüft. Absolute Koordinaten unter 3 oder über 45 fand ich keine, relative Pfade wurden nicht vollständig geprüft.

## 9. OFFENE FRAGEN

- Ist der Generator-Pfad (`slot.visual`) für die Redaktion gedacht? Im Repo ist er nicht setzbar: kein Payload-Feld, keine Daten. Geplant oder Altlast?
- Sollen Fach-Icons oder `BereichIcon` in Navigation oder Kacheln eingesetzt werden, oder bleibt es bei lucide?
- Ist das InView-Gating vorgesehen? Der README-Vertrag wird im Code nicht genutzt.
- Ist framer-motion bewusst als Abhängigkeit ohne Nutzung gehalten?
- Smooth-Scroll bei reduce: bewusst ausgenommen oder übersehen?
- Sind die 8 kräftigen `fill-area`-Punkte eine gewollte Ausnahme?
- Glow-Shadow in `page.tsx:301` im Browser prüfen.
- Soll für alle Strichstärken-Literale eine Skala (KONTUR, LINIE, HILFSLINIE) gelten?

=== ENDE E0-KUNDSCHAFTER-grafik · BEREIT ZUR RÜCKGABE ===