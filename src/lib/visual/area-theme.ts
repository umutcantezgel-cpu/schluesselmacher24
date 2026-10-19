import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „oklch(L C H)“ (wie die übrigen Tokens in `globals.css`).
 * - `accent`: Flächen und Linien in Grafiken (≥ 3:1 auf Weiß und `soft`)
 * - `strong`: Text, Schaltflächen, Kennzeichnungen (≥ 4,5:1 auf Weiß und `soft`)
 * - `soft`:   heller Hintergrund des Bereichs
 * - `muted`:  zarte Linien und Füllungen in Grafiken (rein dekorativ)
 *
 * Bewusst kein Gelb/Schwarz: keine Notdienstoptik.
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
  accent: 'oklch(0.60 0.15 214)',
  strong: 'oklch(0.50 0.15 214)',
  soft: 'oklch(0.96 0.01 214)',
  muted: 'oklch(0.90 0.04 214)',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: 'oklch(0.60 0.15 217)',
    strong: 'oklch(0.50 0.15 217)',
    soft: 'oklch(0.96 0.01 214)',
    muted: 'oklch(0.90 0.04 217)',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: 'oklch(0.40 0.12 172)',
    strong: 'oklch(0.35 0.12 174)',
    soft: 'oklch(0.94 0.02 168)',
    muted: 'oklch(0.85 0.05 170)',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: 'oklch(0.65 0.18 245)',
    strong: 'oklch(0.55 0.18 245)',
    soft: 'oklch(0.97 0.01 245)',
    muted: 'oklch(0.90 0.05 245)',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: 'oklch(0.60 0.18 20)',
    strong: 'oklch(0.50 0.18 18)',
    soft: 'oklch(0.96 0.01 24)',
    muted: 'oklch(0.90 0.05 22)',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: 'oklch(0.65 0.20 266)',
    strong: 'oklch(0.55 0.20 266)',
    soft: 'oklch(0.97 0.01 266)',
    muted: 'oklch(0.90 0.05 266)',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: 'oklch(0.45 0.15 195)',
    strong: 'oklch(0.35 0.15 196)',
    soft: 'oklch(0.94 0.02 190)',
    muted: 'oklch(0.85 0.05 192)',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: 'oklch(0.40 0.12 152)',
    strong: 'oklch(0.35 0.12 153)',
    soft: 'oklch(0.94 0.02 148)',
    muted: 'oklch(0.85 0.05 150)',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: 'oklch(0.60 0.20 350)',
    strong: 'oklch(0.50 0.20 350)',
    soft: 'oklch(0.97 0.01 350)',
    muted: 'oklch(0.90 0.05 350)',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: 'oklch(0.60 0.20 326)',
    strong: 'oklch(0.50 0.20 326)',
    soft: 'oklch(0.97 0.01 326)',
    muted: 'oklch(0.90 0.05 326)',
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
    '--area-foreground': '0 0% 100%',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

export function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToRgb([l, c, h]: [number, number, number]): [number, number, number] {
  // Rough OKLCH to RGB approximation for WCAG calculation since true OKLCH->RGB requires complex matrices.
  // For precise relative luminance we should use standard matrices, but we'll approximate via sRGB for tests.

  // Using simplified math for testing purposes
  const hRad = h * Math.PI / 180;

  const l_ = l + 0.3963377774 * c * Math.cos(hRad) + 0.2158037573 * c * Math.sin(hRad);
  const m_ = l - 0.1055613458 * c * Math.cos(hRad) - 0.0638541728 * c * Math.sin(hRad);
  const s_ = l - 0.0894841775 * c * Math.cos(hRad) - 1.2914855480 * c * Math.sin(hRad);

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b))
  ];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier HSL-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
