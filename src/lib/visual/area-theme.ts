import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als HSL-Tripel „H S% L%“ (wie die übrigen Tokens in `globals.css`).
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
  accent: '0.550 0.160 260.0',
  strong: '0.450 0.140 260.0',
  soft: '0.965 0.020 260.0',
  muted: '0.860 0.040 260.0',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.580 0.160 260.0',
    strong: '0.480 0.140 260.0',
    soft: '0.965 0.020 260.0',
    muted: '0.860 0.040 260.0',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.450 0.120 170.0',
    strong: '0.350 0.100 170.0',
    soft: '0.945 0.040 170.0',
    muted: '0.800 0.080 170.0',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.620 0.160 245.0',
    strong: '0.500 0.140 245.0',
    soft: '0.970 0.020 245.0',
    muted: '0.880 0.060 245.0',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.520 0.160 20.0',
    strong: '0.420 0.140 20.0',
    soft: '0.955 0.030 20.0',
    muted: '0.840 0.060 20.0',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.600 0.150 266.0',
    strong: '0.480 0.130 266.0',
    soft: '0.970 0.020 266.0',
    muted: '0.880 0.050 266.0',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.450 0.120 195.0',
    strong: '0.350 0.100 195.0',
    soft: '0.945 0.040 195.0',
    muted: '0.800 0.080 195.0',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.420 0.110 152.0',
    strong: '0.320 0.090 152.0',
    soft: '0.945 0.040 152.0',
    muted: '0.800 0.080 152.0',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.550 0.160 350.0',
    strong: '0.450 0.140 350.0',
    soft: '0.970 0.020 350.0',
    muted: '0.880 0.050 350.0',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.580 0.160 326.0',
    strong: '0.480 0.140 326.0',
    soft: '0.970 0.020 326.0',
    muted: '0.880 0.050 326.0',
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
    '--area-foreground': '1.000 0.000 0.0',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

import { converter } from 'culori';
const toRgb = converter('rgb');

function parseOklch(value: string): { mode: 'oklch'; l: number; c: number; h: number } {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return { mode: 'oklch' as const, l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) };
}

function oklchToRgb(color: { mode: 'oklch'; l: number; c: number; h: number }): [number, number, number] {
  const rgb = toRgb(color);
  if (!rgb) throw new Error('Color conversion failed');
  return [Math.max(0, Math.min(1, rgb.r)), Math.max(0, Math.min(1, rgb.g)), Math.max(0, Math.min(1, rgb.b))];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1.000 0.000 0.0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
