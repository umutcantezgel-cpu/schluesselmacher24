import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „L C h“ (wie die übrigen Tokens in `globals.css`).
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
  accent: '0.50 0.12 260',
  strong: '0.36 0.1 260',
  soft: '0.96 0.02 260',
  muted: '0.86 0.04 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.53 0.12 217',
    strong: '0.36 0.1 217',
    soft: '0.96 0.02 217',
    muted: '0.86 0.04 217',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.38 0.1 172',
    strong: '0.32 0.08 174',
    soft: '0.94 0.02 168',
    muted: '0.80 0.06 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.62 0.1 245',
    strong: '0.36 0.1 245',
    soft: '0.97 0.02 245',
    muted: '0.88 0.04 245',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.55 0.12 20',
    strong: '0.36 0.1 18',
    soft: '0.96 0.02 24',
    muted: '0.84 0.06 22',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.60 0.12 266',
    strong: '0.36 0.1 266',
    soft: '0.97 0.02 266',
    muted: '0.88 0.04 266',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.45 0.1 195',
    strong: '0.36 0.1 196',
    soft: '0.94 0.02 190',
    muted: '0.80 0.04 192',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.45 0.1 152',
    strong: '0.36 0.1 153',
    soft: '0.94 0.02 148',
    muted: '0.80 0.04 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.54 0.12 350',
    strong: '0.36 0.1 350',
    soft: '0.97 0.02 350',
    muted: '0.88 0.04 350',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.52 0.12 326',
    strong: '0.36 0.1 326',
    soft: '0.97 0.02 326',
    muted: '0.88 0.04 326',
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

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s+\/\s+[\d.]+)?$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToRgb([L, C, h]: [number, number, number]): [number, number, number] {
  const hRad = h * Math.PI / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (c: number) => c >= 0.0031308 ? 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055 : 12.92 * c;
  return [gamma(Math.max(0, rLin)), gamma(Math.max(0, gLin)), gamma(Math.max(0, bLin))];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
