import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel "L C H".
 * - `accent`: Flächen und Linien in Grafiken (≥ 3:1 auf Weiß und `soft`)
 * - `strong`: Text, Schaltflächen, Kennzeichnungen (≥ 4,5:1 auf Weiß und `soft`)
 * - `soft`:   heller Hintergrund des Bereichs
 * - `muted`:  zarte Linien und Füllungen in Grafiken (rein dekorativ)
 *
 * Bewusst kein Gelb/Schwarz: keine Notdienstoptik. Benachbarte Bereiche liegen im
 * Farbton mindestens 30° auseinander, damit sie nebeneinander unterscheidbar bleiben
 * (Sichtabnahme E2-L-07, D-017). Code und Schließanlagen liegen im Blau-Violett, wo
 * 30° kaum zu sehen sind; zwischen ihnen stehen deshalb 42° (Sichtabnahme E4-L-23).
 */
export interface AreaTheme {
  label: string;
  accent: string;
  strong: string;
  soft: string;
  muted: string;
}

/** Grundfarbe außerhalb der Bereiche (Startseite, Warenkorb, Kasse …). */
export const DEFAULT_AREA_THEME: AreaTheme = {
  label: 'Allgemein',
  accent: '0.58 0.15 260',
  strong: '0.48 0.14 260',
  soft: '0.965 0.02 260',
  muted: '0.86 0.05 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.58 0.15 260',
    strong: '0.48 0.14 260',
    soft: '0.965 0.02 260',
    muted: '0.86 0.05 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.45 0.12 160',
    strong: '0.35 0.12 160',
    soft: '0.945 0.02 160',
    muted: '0.80 0.05 160',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.50 0.14 290',
    strong: '0.55 0.12 290',
    soft: '0.97 0.02 290',
    muted: '0.88 0.04 290',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.62 0.16 40',
    strong: '0.50 0.14 40',
    soft: '0.955 0.02 40',
    muted: '0.84 0.05 40',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.65 0.16 332',
    strong: '0.54 0.14 332',
    soft: '0.97 0.02 332',
    muted: '0.88 0.04 332',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.50 0.12 210',
    strong: '0.40 0.12 210',
    soft: '0.945 0.02 210',
    muted: '0.80 0.05 210',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.42 0.1 130',
    strong: '0.32 0.08 130',
    soft: '0.94 0.01 130',
    muted: '0.78 0.03 130',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.64 0.18 10',
    strong: '0.52 0.16 10',
    soft: '0.97 0.02 10',
    muted: '0.88 0.04 10',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.62 0.16 90',
    strong: '0.52 0.14 90',
    soft: '0.97 0.02 90',
    muted: '0.88 0.04 90',
  },
};

export const AREA_KEYS_WITH_THEME = Object.keys(AREA_THEMES) as AreaKey[];

/** CSS-Variablen eines Bereichs, z. B. für `style` oder das Tailwind-Plugin. */
export function areaCssVariables(theme: AreaTheme): Record<string, string> {
  return {
    '--area': theme.accent,
    '--area-strong': theme.strong,
    '--area-soft': theme.soft,
    '--area-muted': theme.muted,
    '--area-foreground': '1 0 0',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function parseOklch(value: string): [number, number, number] {
  // Erwartet "L C H", z.B. "0.968 0.004 260"
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToOklab([l, c, h]: [number, number, number]): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  return [l, c * Math.cos(hRad), c * Math.sin(hRad)];
}

function oklabToLinearSrgb([L, a, b]: [number, number, number]): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_out = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [r, g, b_out];
}

function relativeLuminance(rgbLinear: [number, number, number]): number {
  return 0.2126 * rgbLinear[0] + 0.7152 * rgbLinear[1] + 0.0722 * rgbLinear[2];
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklabToLinearSrgb(oklchToOklab(parseOklch(a))));
  const lb = relativeLuminance(oklabToLinearSrgb(oklchToOklab(parseOklch(b))));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
