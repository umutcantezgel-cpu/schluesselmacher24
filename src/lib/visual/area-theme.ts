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
  accent: '0.500 0.150 260',
  strong: '0.450 0.150 260',
  soft: '0.950 0.020 260',
  muted: '0.880 0.030 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.530 0.160 260',
    strong: '0.480 0.150 260',
    soft: '0.950 0.020 260',
    muted: '0.880 0.030 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.450 0.100 170',
    strong: '0.350 0.080 170',
    soft: '0.940 0.020 170',
    muted: '0.840 0.040 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.620 0.180 280',
    strong: '0.540 0.160 280',
    soft: '0.960 0.030 280',
    muted: '0.880 0.050 280',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.550 0.160 40',
    strong: '0.450 0.140 40',
    soft: '0.950 0.030 40',
    muted: '0.840 0.060 40',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.600 0.180 300',
    strong: '0.500 0.150 300',
    soft: '0.960 0.020 300',
    muted: '0.880 0.040 300',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.450 0.120 220',
    strong: '0.380 0.100 220',
    soft: '0.940 0.020 220',
    muted: '0.820 0.040 220',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.450 0.100 150',
    strong: '0.350 0.080 150',
    soft: '0.940 0.020 150',
    muted: '0.820 0.040 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.550 0.160 10',
    strong: '0.480 0.140 10',
    soft: '0.960 0.020 10',
    muted: '0.880 0.040 10',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.580 0.160 340',
    strong: '0.480 0.140 340',
    soft: '0.960 0.020 340',
    muted: '0.880 0.040 340',
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
    '--area-foreground': '1.000 0.000 0',
  };
}


/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function oklchToRgb([L, C, h]: [number, number, number]): [number, number, number] {
    h = h * Math.PI / 180;

    let L_lab = L;
    let a = C * Math.cos(h);
    let b = C * Math.sin(h);

    let l_ = L_lab + 0.3963377774 * a + 0.2158037573 * b;
    let m_ = L_lab - 0.1055613458 * a - 0.0638541728 * b;
    let s_ = L_lab - 0.0894841775 * a - 1.2914855480 * b;

    let l = l_ ** 3;
    let m = m_ ** 3;
    let s = s_ ** 3;

    let r =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_rgb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const gamma = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * (c ** (1/2.4)) - 0.055;

    return [
        Math.max(0, Math.min(1, gamma(r))),
        Math.max(0, Math.min(1, gamma(g))),
        Math.max(0, Math.min(1, gamma(b_rgb)))
    ];
}

function parseOklch(value: string): [number, number, number] {
    const parts = value.trim().split(/\s+/);
    if (parts.length < 3) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
