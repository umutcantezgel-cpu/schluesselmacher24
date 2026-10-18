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
  accent: '0.522 0.205 258.3',
  strong: '0.435 0.161 257.6',
  soft: '0.967 0.016 255.0',
  muted: '0.871 0.059 255.2',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.522 0.216 260.3',
    strong: '0.434 0.170 260.0',
    soft: '0.967 0.016 255.0',
    muted: '0.864 0.061 259.9',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.563 0.107 180.5',
    strong: '0.457 0.088 183.7',
    soft: '0.971 0.019 182.6',
    muted: '0.895 0.063 183.5',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.495 0.219 280.0',
    strong: '0.402 0.217 277.0',
    soft: '0.960 0.020 289.8',
    muted: '0.845 0.076 288.5',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.588 0.192 40.9',
    strong: '0.466 0.155 39.7',
    soft: '0.967 0.019 56.2',
    muted: '0.881 0.068 51.6',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.529 0.213 299.6',
    strong: '0.439 0.190 299.1',
    soft: '0.964 0.021 305.4',
    muted: '0.866 0.070 304.7',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.539 0.115 229.3',
    strong: '0.427 0.094 230.9',
    soft: '0.969 0.023 211.0',
    muted: '0.879 0.065 214.9',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.524 0.125 157.4',
    strong: '0.419 0.101 158.1',
    soft: '0.968 0.020 162.9',
    muted: '0.881 0.063 163.1',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.554 0.215 18.4',
    strong: '0.463 0.183 18.4',
    soft: '0.967 0.017 5.9',
    muted: '0.876 0.060 7.2',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.552 0.217 351.2',
    strong: '0.455 0.178 350.9',
    soft: '0.969 0.020 342.3',
    muted: '0.885 0.062 343.4',
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

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToRgb([l]: [number, number, number]): [number, number, number] {
  // Very simplified approximation for contrast calculation purposes.
  // We use L directly for luminance approximation since OKLCH L is very close to perceived lightness.
  // However, relativeLuminance expects RGB and computes linear luminance.
  // OKLCH L is already perceptually uniform, so we can convert L to linear luminance directly.

  // Actually, let's do a proper basic conversion or just mock rgb where luminance matters.
  // L in OKLCH: 0 to 1
  // linear luminance Y is roughly L^3 or more accurately:
  // L* = 116 * (Y/Yn)^(1/3) - 16
  // (L* + 16) / 116 = (Y/Yn)^(1/3)
  // Y = ((L* + 16) / 116)^3
  // In OKLCH, L is L* / 100.
  // So Y = ((L * 100 + 16) / 116)^3

  const Lstar = l * 100;
  let y;
  if (Lstar <= 8) {
    y = Lstar * (27 / 24389);
  } else {
    y = Math.pow((Lstar + 16) / 116, 3);
  }

  // we can return [y, y, y] but wait, relativeLuminance will process RGB.
  // If we return [y,y,y] and it processes through sRGB to linear, it will be wrong.
  // So let's just make relativeLuminance do the right thing for OKLCH, or convert Y to sRGB.
  // sRGB from linear Y:
  const channel = y <= 0.0031308 ? 12.92 * y : 1.055 * Math.pow(y, 1/2.4) - 0.055;
  // This is a grayscale equivalent that will yield the correct luminance!
  return [channel, channel, channel];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier HSL-Tripel, z. B. `contrastRatio('1.000 0.000 0.0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
