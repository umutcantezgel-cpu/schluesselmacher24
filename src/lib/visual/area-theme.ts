import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 */
export interface AreaTheme {
  label: string;
  accent: string;
  strong: string;
  soft: string;
  muted: string;
}

export const DEFAULT_AREA_THEME: AreaTheme = {
  label: 'Allgemein',
  accent: '0.637 0.1 250',
  strong: '0.538 0.1 250',
  soft: '0.96 0.01 250',
  muted: '0.90 0.04 250',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.637 0.1 250',
    strong: '0.538 0.1 250',
    soft: '0.96 0.01 250',
    muted: '0.90 0.04 250',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.627 0.1 170',
    strong: '0.528 0.1 170',
    soft: '0.96 0.01 170',
    muted: '0.90 0.04 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.643 0.1 280',
    strong: '0.545 0.1 280',
    soft: '0.96 0.01 280',
    muted: '0.90 0.04 280',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.647 0.1 40',
    strong: '0.549 0.1 40',
    soft: '0.96 0.01 40',
    muted: '0.90 0.04 40',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.647 0.1 300',
    strong: '0.548 0.1 300',
    soft: '0.96 0.01 300',
    muted: '0.90 0.04 300',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.631 0.1 220',
    strong: '0.531 0.1 220',
    soft: '0.96 0.01 220',
    muted: '0.90 0.04 220',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.628 0.1 150',
    strong: '0.529 0.1 150',
    soft: '0.96 0.01 150',
    muted: '0.90 0.04 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.649 0.1 20',
    strong: '0.550 0.1 20',
    soft: '0.96 0.01 20',
    muted: '0.90 0.04 20',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.650 0.1 340',
    strong: '0.551 0.1 340',
    soft: '0.96 0.01 340',
    muted: '0.90 0.04 340',
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
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 3) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

function oklchToRgb([l, c, h]: [number, number, number]): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_3 = l_ * l_ * l_;
  const m_3 = m_ * m_ * m_;
  const s_3 = s_ * s_ * s_;

  const linR =  4.0767416621 * l_3 - 3.3077115913 * m_3 + 0.2309699292 * s_3;
  const linG = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193965 * s_3;
  const linB = -0.0041960863 * l_3 - 0.7034186147 * m_3 + 1.7076147010 * s_3;

  const gamma = (v: number) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  return [gamma(linR), gamma(linG), gamma(linB)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1 0 0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
