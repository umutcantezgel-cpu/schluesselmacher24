# Visuelles System — Icons, Grafik-Generatoren, Bewegung

Alle Grafiken der Seite sind **Vektorgrafiken aus Code und Daten**. Keine Stockfotos,
keine erzeugten Fotos, die eine echte Werkstatt vortäuschen. Echte Fotos kommen nur
aus der Medienbibliothek (`ImageSlot.bild`).

## Ordner

| Ordner | Inhalt |
|---|---|
| `icons/` | Fach-Icons, je Datei eine Komponente (`icons/fahrzeugschluessel.tsx` → `IconFahrzeugschluessel`) |
| `icons/icon-base.tsx` | gemeinsamer SVG-Rahmen aller Fach-Icons |
| `generators/` | Grafik-Generatoren, je Datei einer (`generators/schluessel.tsx` → `SchluesselGrafik`) |
| `motion/` | Bewegungsbausteine (`InView`, `DrawOn`, `Reveal`, `CheckDraw`) |
| `registry.tsx` | Liste der Generatoren, die Inhalte über `ImageSlot.visual` ansprechen dürfen |
| `area-scope.tsx` | setzt `data-area` → Akzentfarbe des Bereichs |

Keine Sammeldateien (`index.ts`). Importe immer direkt aus der Datei.

## Farben

Nur Tokens, nie feste Farbwerte (`#…`, `rgb()`, `oklch()`):

- Bereichsakzent: `fill-area`, `stroke-area`, `text-area-strong`, `fill-area-soft`, `fill-area-muted`,
  `stroke-area-muted` — wechselt automatisch mit `[data-area]` (Werte in `src/lib/visual/area-theme.ts`).
- Neutral: `stroke-foreground`, `stroke-foreground-muted`, `fill-surface`, `fill-surface-muted`,
  `stroke-border-strong`, `fill-foreground-muted` (Beschriftungen).
- Farbe per Tailwind-Klasse setzen, nicht per `fill="var(--…)"` (Safari).
- Deckkraft über Tailwind: `fill-area/20`.

## Fach-Icons

```tsx
import { IconBase, type IconProps } from './icon-base';

export function IconFahrzeugschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="…" />   {/* Zweitonfläche */}
      <path d="…" />                                               {/* Kontur: currentColor */}
    </IconBase>
  );
}
```

- `viewBox="0 0 48 48"`, Kontur `stroke="currentColor"`, `strokeWidth={2}`, runde Enden/Ecken
  (setzt `IconBase`). Zweitonflächen mit `className="fill-area-muted" stroke="none"`.
- Keine `id`s, keine Verläufe, keine Masken, keine Texte. Mindestabstand 3 Einheiten zum Rand.
- Standardgröße 48 px; lesbar ab 24 px.
- Ohne `title` dekorativ (`aria-hidden`), mit `title` → `role="img"`.

## Grafik-Generatoren

```tsx
import type { VisualProps } from '../registry';

export function SchluesselGrafik({ params, title, className }: VisualProps) { … }
```

- Reines SVG, **Server-Komponente** (kein `'use client'`), deterministisch (kein `Math.random`,
  kein `Date`) — gleiche Werte ergeben dieselbe Grafik.
- Eingaben selbst prüfen: unbekannte Werte → sinnvolle Standardwerte, Zahlen begrenzen.
  Ein Generator darf nie werfen.
- `role="img"`, `<title>{title}</title>` als erstes Kind, `preserveAspectRatio="xMidYMid meet"`,
  `viewBox` fest (z. B. `0 0 480 270` für 16:9).
- Keine `id`s (mehrfach auf einer Seite), Pfeilspitzen als eigene Pfade statt `<marker>`.
- Beschriftungen als `<text>` mit `className="fill-foreground-muted font-mono"` und fester
  `fontSize` in viewBox-Einheiten; nur sachliche Angaben aus `params`.
- Einstiegsbewegung optional über die CSS-Klassen unten; die Grafik muss auch ohne
  Bewegung vollständig sein.
- Jeder Generator hat einen Test (`*.test.tsx`, `renderToStaticMarkup`): Standardwerte,
  Unsinnswerte werfen nicht, `<title>` vorhanden, gleiche Eingabe → gleiche Ausgabe.
- Aufnahme in `registry.tsx` erfolgt zentral (Name = Dateiname ohne Endung).

## Bewegung

CSS zuerst, kein SMIL, keine Dauerbewegung ohne Grund. Klassen aus `globals.css`:

| Klasse | Wirkung | Hinweis |
|---|---|---|
| `sm24-draw` | Linie zeichnet sich | Element braucht `pathLength={1}` |
| `sm24-reveal` | blendet von unten ein | |
| `sm24-pop` | wächst aus der Mitte | Punkte, Haken, Marker |
| `sm24-float` | ruhiges Schweben | sparsam |
| `sm24-dash` | laufende Strichlinie | Funk, Signal, Datenfluss |

Verzögerung/Dauer per `style={{ '--sm24-delay': '0.2s' } as CSSProperties}`.
Einstiegsbewegungen starten erst im sichtbaren Bereich, wenn ein Vorfahr `InView`
(`motion/in-view.tsx`) ist. Bei „Bewegung reduzieren“ und ohne JavaScript sind
alle Grafiken sofort vollständig.

`framer-motion` nur, wenn CSS nicht reicht — dann in `<MotionConfig reducedMotion="user">`.
