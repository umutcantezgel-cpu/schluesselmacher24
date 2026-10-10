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
  accent: '0.350 0.129 214',
  strong: '0.350 0.120 214',
  soft: '0.960 0.150 214',
  muted: '0.880 0.135 214',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.350 0.137 217',
    strong: '0.350 0.114 217',
    soft: '0.960 0.150 214',
    muted: '0.880 0.135 217',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.350 0.114 172',
    strong: '0.350 0.126 174',
    soft: '0.960 0.096 168',
    muted: '0.350 0.090 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.350 0.117 245',
    strong: '0.350 0.087 245',
    soft: '0.960 0.150 245',
    muted: '0.880 0.135 245',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.350 0.132 20',
    strong: '0.350 0.126 18',
    soft: '0.960 0.150 24',
    muted: '0.880 0.142 22',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.350 0.108 266',
    strong: '0.350 0.078 266',
    soft: '0.960 0.150 266',
    muted: '0.880 0.120 266',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.350 0.135 195',
    strong: '0.350 0.135 196',
    soft: '0.960 0.135 190',
    muted: '0.350 0.112 192',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.350 0.096 152',
    strong: '0.350 0.102 153',
    soft: '0.960 0.084 148',
    muted: '0.350 0.075 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.350 0.117 350',
    strong: '0.350 0.102 350',
    soft: '0.960 0.150 350',
    muted: '0.880 0.128 350',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.350 0.102 326',
    strong: '0.350 0.093 326',
    soft: '0.960 0.150 326',
    muted: '0.880 0.112 326',
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
    '--area-foreground': '0.960 0.000 0',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

function linearSrgbToSrgb(rgb: [number, number, number]): [number, number, number] {
  return [
    rgb[0] >= 0.0031308 ? 1.055 * Math.pow(rgb[0], 1.0 / 2.4) - 0.055 : 12.92 * rgb[0],
    rgb[1] >= 0.0031308 ? 1.055 * Math.pow(rgb[1], 1.0 / 2.4) - 0.055 : 12.92 * rgb[1],
    rgb[2] >= 0.0031308 ? 1.055 * Math.pow(rgb[2], 1.0 / 2.4) - 0.055 : 12.92 * rgb[2],
  ];
}

function oklchToSrgb(l: number, c: number, h: number): [number, number, number] {
  const h_rad = h * Math.PI / 180;
  const a = c * Math.cos(h_rad);
  const b = c * Math.sin(h_rad);
  const linear = oklabToLinearSrgb(l, a, b);
  return linearSrgbToSrgb(linear);
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1 0 0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const cA = oklchToSrgb(...parseOklch(a));
  const cB = oklchToSrgb(...parseOklch(b));
  const la = relativeLuminance(cA);
  const lb = relativeLuminance(cB);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
