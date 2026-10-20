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
  accent: '0.572 0.205 258.3',
  strong: '0.485 0.161 257.6',
  soft: '0.967 0.016 255',
  muted: '0.871 0.059 255.2',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.572 0.216 260.3',
    strong: '0.484 0.17 260',
    soft: '0.967 0.016 255',
    muted: '0.864 0.061 259.9',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.613 0.107 180.5',
    strong: '0.507 0.088 183.7',
    soft: '0.971 0.019 182.6',
    muted: '0.895 0.063 183.5',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.545 0.219 280',
    strong: '0.452 0.217 277',
    soft: '0.96 0.02 289.8',
    muted: '0.845 0.076 288.5',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.638 0.192 40.9',
    strong: '0.516 0.155 39.7',
    soft: '0.967 0.019 56.2',
    muted: '0.881 0.068 51.6',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.579 0.213 299.6',
    strong: '0.489 0.19 299.1',
    soft: '0.964 0.021 305.4',
    muted: '0.866 0.07 304.7',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.589 0.115 229.3',
    strong: '0.477 0.094 230.9',
    soft: '0.969 0.023 211',
    muted: '0.879 0.065 214.9',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.574 0.125 157.4',
    strong: '0.469 0.101 158.1',
    soft: '0.968 0.02 162.9',
    muted: '0.881 0.063 163.1',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.604 0.215 18.4',
    strong: '0.513 0.183 18.4',
    soft: '0.967 0.017 5.9',
    muted: '0.876 0.06 7.2',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.602 0.217 351.2',
    strong: '0.505 0.178 350.9',
    soft: '0.969 0.02 342.3',
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
    '--area-foreground': '1 0 0', // OKLCH white
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function parseOklch(value: string): { l: number, c: number, h: number } | null {
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) return null;
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) };
}

// Minimal implementation of OKLCH to RGB to compute correct relative luminance
// We approximate or adapt culori's math if possible, but since we cannot use culori directly in the browser/client if it's not imported.
// Actually, let's just write a proper conversion. Wait, we can implement it by converting OKLCH to OKLab, then OKLab to Linear sRGB, then compute luminance.

// Convert OKLCH to OKLab
function oklchToOklab(l: number, c: number, h: number) {
  const hRad = h * Math.PI / 180;
  return {
    l: l,
    a: c * Math.cos(hRad),
    b: c * Math.sin(hRad)
  };
}

// Convert OKLab to Linear sRGB
function oklabToLinearSrgb(l: number, a: number, b: number) {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_cube = l_ * l_ * l_;
  const m_cube = m_ * m_ * m_;
  const s_cube = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube,
    g: -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube,
    b: -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.7076147010 * s_cube
  };
}

function relativeLuminance(rgb: { r: number, g: number, b: number }): number {
  // In linear sRGB, relative luminance is just a linear combination.
  // We can just use the standard linear sRGB luminance weights.
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

export function contrastRatio(a: string, b: string): number {
  let la = 1;
  let lb = 1;

  if (a === '0 0% 100%') {
    la = 1;
  } else {
    const oklchA = parseOklch(a);
    if (oklchA) {
      const oklab = oklchToOklab(oklchA.l, oklchA.c, oklchA.h);
      const linearRgb = oklabToLinearSrgb(oklab.l, oklab.a, oklab.b);
      la = relativeLuminance(linearRgb);
    }
  }

  if (b === '0 0% 100%') {
    lb = 1;
  } else {
    const oklchB = parseOklch(b);
    if (oklchB) {
      const oklab = oklchToOklab(oklchB.l, oklchB.c, oklchB.h);
      const linearRgb = oklabToLinearSrgb(oklab.l, oklab.a, oklab.b);
      lb = relativeLuminance(linearRgb);
    }
  }

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
