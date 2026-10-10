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
  accent: '0.500 0.086 214',
  strong: '0.400 0.080 214',
  soft: '0.965 0.100 214',
  muted: '0.860 0.090 214',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.530 0.091 217',
    strong: '0.420 0.076 217',
    soft: '0.965 0.100 214',
    muted: '0.860 0.090 217',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.340 0.076 172',
    strong: '0.250 0.084 174',
    soft: '0.945 0.064 168',
    muted: '0.800 0.060 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.620 0.078 245',
    strong: '0.500 0.058 245',
    soft: '0.970 0.100 245',
    muted: '0.880 0.090 245',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.480 0.088 20',
    strong: '0.370 0.084 18',
    soft: '0.955 0.100 24',
    muted: '0.840 0.095 22',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.600 0.072 266',
    strong: '0.480 0.052 266',
    soft: '0.970 0.100 266',
    muted: '0.880 0.080 266',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.370 0.090 195',
    strong: '0.280 0.090 196',
    soft: '0.945 0.090 190',
    muted: '0.800 0.075 192',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.340 0.064 152',
    strong: '0.250 0.068 153',
    soft: '0.945 0.056 148',
    muted: '0.800 0.050 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.540 0.078 350',
    strong: '0.430 0.068 350',
    soft: '0.970 0.100 350',
    muted: '0.880 0.085 350',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.520 0.068 326',
    strong: '0.410 0.062 326',
    soft: '0.970 0.100 326',
    muted: '0.880 0.075 326',
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


function gammaCompress(linear: number): number {
  if (linear <= 0.0031308) return 12.92 * linear;
  return 1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055;
}

function oklchToSrgb(l: number, c: number, h: number): [number, number, number] {
  const hRad = h * Math.PI / 180.0;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  const l__ = l_ * l_ * l_;
  const m__ = m_ * m_ * m_;
  const s__ = s_ * s_ * s_;
  const rLin =  4.0767416621 * l__ - 3.3077115913 * m__ + 0.2309699292 * s__;
  const gLin = -1.2684380046 * l__ + 2.6097574011 * m__ - 0.3413193965 * s__;
  const bLin = -0.0041960863 * l__ - 0.7034186147 * m__ + 1.7076147010 * s__;
  const rC = Math.max(0, Math.min(1, rLin));
  const gC = Math.max(0, Math.min(1, gLin));
  const bC = Math.max(0, Math.min(1, bLin));
  return [gammaCompress(rC), gammaCompress(gC), gammaCompress(bC)];
}

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToSrgb(...parseOklch(a)) as [number, number, number]);
  const lb = relativeLuminance(oklchToSrgb(...parseOklch(b)) as [number, number, number]);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
