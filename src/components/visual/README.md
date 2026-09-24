# Visuelles System — Icons, Grafik-Generatoren, Bewegung

Alle Grafiken der Seite sind **Vektorgrafiken aus Code und Daten**. Keine Stockfotos,
keine erzeugten Fotos, die eine echte Werkstatt vortäuschen. Echte Fotos kommen nur
aus der Medienbibliothek (`ImageSlot.bild`).

## Ordner

| Ordner | Inhalt |
|---|---|
| `icons/` | Fach-Icons, je Datei eine Komponente (`icons/schluessel-nach-code.tsx` → `IconSchluesselNachCode`) |
| `icons/icon-base.tsx` | gemeinsamer SVG-Rahmen aller Fach-Icons |
| `generators/` | Grafik-Generatoren, je Datei einer (`generators/schluessel.tsx` → `SchluesselGrafik`) |
| `generators/grafik-basis.tsx` | gemeinsame Helfer der Generatoren (Parameterleser, Strichstärken, Raster, Rahmen) |
| `motion/` | Bewegungsbausteine (`InView`, `Reveal`, `DrawOn`, `CheckDraw`, `motionStyle`) |
| `registry.tsx` | Liste der Generatoren, die Inhalte über `ImageSlot.visual` ansprechen dürfen |
| `bereich-icon.tsx` | `BereichIcon` — Fach-Icon je Leistungsbereich |
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
- Aufnahme in `registry.tsx` erfolgt zentral (Name = Dateiname ohne Endung);
  `registry.test.tsx` prüft, dass jede Datei in `generators/` eingetragen ist.

## Registry — Namen und Parameter

Inhalte verweisen mit `ImageSlot.visual = { generator, params }` auf eine Grafik;
`ImagePlaceholder` zeichnet sie über `renderVisual(ref, title, className)`.
Unbekannte Namen oder unvollständige Verweise ergeben `null` (dann greift der
neutrale Platzhalter). `visualNames()` liefert die Namen sortiert.

```ts
{ generator: 'zylinder-mass', params: { bauform: 'knauf', aussen: 30, innen: 45 } }
```

Für alle Generatoren gilt: Auswahltexte ohne Rücksicht auf Groß-/Kleinschreibung und
Leerzeichen am Rand, Zahlen auch als Text mit Dezimalkomma (`'32,5'`), Werte außerhalb des
Bereichs werden begrenzt, alles Unbekannte fällt auf den Standard zurück. Ein leerer
`title` wird durch einen sachlichen Ersatztitel ersetzt.

### `schluessel` — Schlüssel in Seitenansicht (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `typ` | `zylinder` · `buntbart` · `klapp` · `funk` · `smart-key` · `transponder` | `zylinder` |
| `einschnitte` | 4–8 Ziffern 0–9, als Liste oder Text (`'35274'`); werden unter dem Bart beschriftet, Vorrang vor `code` | ruhiges Profil ohne Beschriftung |
| `code` | Text (es zählen die ersten 40 Zeichen) → daraus abgeleitetes Profil, bewusst ohne Ziffern | – |
| `anzahl` | 1–3 (ganzzahlig); weitere Schlüssel versetzt dahinter, etwa für „Kopie“ | `1` |

Beim `smart-key` gibt es keinen Bart; `funk` und `smart-key` zeigen Funkbögen.

### `zylinder-mass` — Maßzeichnung eines Schließzylinders (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `bauform` | `profil-doppel` · `profil-halb` · `knauf` | `profil-doppel` |
| `aussen` | Maß A in mm, 25–100 | `30` |
| `innen` | Maß I in mm, 25–100 (bei `profil-halb` ohne Wirkung) | `30` |
| `knaufseite` | `innen` · `aussen` (nur bei `knauf`) | `innen` |

Gemessen wird von der Mitte der Stulpschraube bis zum Zylinderende, maßstäblich.

### `schliessplan` — Hierarchie einer Schließanlage (`viewBox 0 0 480 300`)

| Parameter | Werte | Standard |
|---|---|---|
| `system` | `gleichschliessung` · `zentral` · `haupt` · `generalhaupt` | `haupt` |
| `gruppen` | 1–4 Hauptgruppen (nur bei `generalhaupt`) | `2` |
| `tueren` | 2–8 Türen (bei `zentral`: Wohnungstüren) | `4` |

### `code-fundstelle` — wo die Schlüsselnummer steht (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `ort` | `schluesselkopf` · `sicherungskarte` · `zylinderstirn` | `schluesselkopf` |

Die Nummer erscheint nur als Platzhalter-Striche, nie als Ziffern.

### `zutritt-signal` — elektronische Zutrittslösung (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `medium` | `transponder` · `karte` · `smartphone` | `transponder` |

Medium → Funkbögen (`sm24-dash`) → Leser im Türbeschlag → Freigabe-Haken
(`sm24-pop`, Haken `sm24-draw`). Ohne Aufdruck, Marke oder App-Oberfläche.

## BereichIcon

```tsx
import { BereichIcon } from '@/components/visual/bereich-icon';

<BereichIcon area="schliessanlagen" size={32} className="text-area-strong" />
<BereichIcon area={area} title="Schließanlagen" />   {/* als Bild angesagt */}
```

- Ordnet jedem der neun Bereiche (`AreaKey`) das gleichnamige Fach-Icon zu
  (`autoschluessel` → `icons/autoschluessel.tsx` … `service-und-termin`).
- Nimmt alle `IconProps` (`size`, Standard 48; `title`; `className` …). Ohne `title`
  dekorativ, mit `title` → `role="img"`.
- Unbekannter Bereich (etwa aus fehlerhaften Inhalten) → `null`.
- Die Zuordnung liegt als `BEREICH_ICONS` vor; ein neuer Bereich ohne Icon kompiliert nicht.

## Bewegung

CSS zuerst, kein SMIL, keine Dauerbewegung ohne Grund. Klassen aus `globals.css`:

| Klasse | Wirkung | Hinweis |
|---|---|---|
| `sm24-draw` | Linie zeichnet sich | Element braucht `pathLength={1}` |
| `sm24-reveal` | blendet von unten ein | |
| `sm24-pop` | wächst aus der Mitte | Punkte, Haken, Marker |
| `sm24-float` | ruhiges Schweben | sparsam |
| `sm24-dash` | laufende Strichlinie | Funk, Signal, Datenfluss |

Verzögerung/Dauer typsicher mit `motionStyle(delay, duration?, style?)` aus
`motion/motion-style.ts` (Sekunden; ungültige Werte entfallen):

```tsx
<path className="sm24-draw stroke-area" pathLength={1} style={motionStyle(0.2, 0.8)} d="…" />
```

Einstiegsbewegungen starten erst im sichtbaren Bereich, wenn ein Vorfahr `InView`
(`motion/in-view.tsx`) ist. Ohne JavaScript spielen sie sofort ab, bei „Bewegung
reduzieren“ sind alle Grafiken sofort vollständig.

Runde Linienenden zeigen bei `sm24-draw` im Wartezustand einen Punkt am Pfadende
(besonders sichtbar bei Kreisen). Dagegen hilft das Strichmuster
`DRAW_DASHARRAY` (`'1 2'`) als Inline-Stil:
`style={motionStyle(0.2, 0.8, { strokeDasharray: DRAW_DASHARRAY })}` —
`DrawOn` und `CheckDraw` setzen es selbst.

### Bewegungsbausteine

Alle außer `InView` sind Server-Komponenten ohne JavaScript im Browser.

| Baustein | Datei | Zweck |
|---|---|---|
| `InView` | `motion/in-view.tsx` | Client-Hülle: hält `sm24-draw`/`-reveal`/`-pop` darunter an, bis der Bereich sichtbar ist (`threshold`, Standard 0,25; `as`, Standard `div`) |
| `Reveal` | `motion/reveal.tsx` | Hülle mit `sm24-reveal`; `delay`, `duration` (Sekunden), `as` (Standard `div`, in SVG `g`), `className`, `style` |
| `DrawOn` | `motion/draw-on.tsx` | SVG-`<g>`, dessen Kinder nacheinander erscheinen; `delay` (erstes Kind), `stagger` (Abstand, Standard 0,12 s), `duration`, dazu alle Attribute eines `<g>` |
| `CheckDraw` | `motion/check-draw.tsx` | Bestätigungshaken im Kreis: Fläche, dann Kreis, dann Haken; `title` (Standard „Bestätigt“), `size` (Standard 48), `delay`, `className` |

```tsx
<InView>
  <Reveal delay={0.1}>…Text…</Reveal>
  <svg viewBox="0 0 200 80" fill="none" strokeLinecap="round">
    <DrawOn delay={0.2} stagger={0.15} className="stroke-area" strokeWidth={2}>
      <path d="…" />      {/* zeichnet sich, pathLength 1 wird gesetzt */}
      <circle … />         {/* zeichnet sich danach */}
      <text …>…</text>     {/* blendet als Drittes ein */}
    </DrawOn>
  </svg>
  <CheckDraw title="Anfrage gesendet" size={64} delay={0.3} />
</InView>
```

- `DrawOn`: Linienformen (`path`, `line`, `polyline`, `polygon`, `circle`, `ellipse`,
  `rect`) bekommen `sm24-draw` und `pathLength={1}`; alles andere (`g`, `text`,
  Komponenten) `sm24-reveal`. Fragmente werden aufgelöst, loser Text entfällt,
  `className` und `style` der Kinder bleiben erhalten. Für Linien am besten `<path>`.
- `CheckDraw` nutzt die Bereichsfarben (`fill-area-soft`, `stroke-area`,
  `stroke-area-strong`) und ist immer ein Bild mit `<title>` — neben einem Text, der
  dasselbe sagt, einen knappen Titel wählen.

`framer-motion` nur, wenn CSS nicht reicht — dann in `<MotionConfig reducedMotion="user">`.
