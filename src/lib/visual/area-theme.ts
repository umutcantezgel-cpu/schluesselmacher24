import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „L C H“ (wie die übrigen Tokens in `globals.css`).
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
  accent: '0.572 0.205 258.3',
  strong: '0.485 0.161 257.6',
  soft: '0.967 0.016 255.0',
  muted: '0.871 0.059 255.2',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.572 0.216 260.3',
    strong: '0.484 0.170 260.0',
    soft: '0.967 0.016 255.0',
    muted: '0.864 0.061 259.9',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.505 0.104 195.3',
    strong: '0.413 0.113 197.8',
    soft: '0.947 0.021 190.2',
    muted: '0.825 0.038 193.3',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.640 0.163 283.4',
    strong: '0.540 0.198 284.1',
    soft: '0.970 0.012 281.8',
    muted: '0.893 0.046 282.8',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.643 0.187 49.3',
    strong: '0.551 0.176 46.1',
    soft: '0.957 0.014 62.4',
    muted: '0.864 0.042 54.4',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.620 0.173 301.7',
    strong: '0.520 0.198 301.9',
    soft: '0.970 0.012 299.7',
    muted: '0.894 0.046 300.9',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.485 0.125 231.1',
    strong: '0.407 0.117 232.5',
    soft: '0.949 0.016 223.3',
    muted: '0.826 0.038 226.7',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.490 0.091 169.5',
    strong: '0.402 0.098 171.1',
    soft: '0.948 0.019 164.0',
    muted: '0.825 0.037 167.0',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.638 0.203 14.6',
    strong: '0.548 0.192 14.3',
    soft: '0.967 0.011 11.2',
    muted: '0.887 0.040 12.8',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.627 0.204 353.1',
    strong: '0.536 0.194 353.4',
    soft: '0.968 0.012 352.0',
    muted: '0.889 0.042 352.6',
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
    '--area-foreground': '0.968 0.004 260',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

export function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^(?:oklch\()?([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\))?$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function oklchToRgb([l, c, h]: [number, number, number]): [number, number, number] {
  const hr = h * Math.PI / 180;

  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const rl =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const toSrgb = (c_val: number) => {
    const abs = Math.abs(c_val);
    if (abs > 0.0031308) {
      return Math.sign(c_val) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
    }
    return 12.92 * c_val;
  };

  return [toSrgb(rl), toSrgb(gl), toSrgb(bl)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1 0 0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
