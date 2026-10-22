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
 * Bewusst kein Gelb/Schwarz: keine Notdienstoptik. Benachbarte Bereiche liegen im
 * Farbton mindestens 30° auseinander, damit sie nebeneinander unterscheidbar bleiben
 * (Sichtabnahme E2-L-07, D-017). Code und Schließanlagen liegen im Blau-Violett, wo
 * 30° kaum zu sehen sind; zwischen ihnen stehen deshalb 42° (Sichtabnahme E4-L-23).
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
    accent: '0.544 0.227 262.2',
    strong: '0.459 0.177 262.1',
    soft: '0.963 0.017 264.5',
    muted: '0.858 0.064 264.2',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.584 0.121 163.4',
    strong: '0.485 0.102 163.1',
    soft: '0.970 0.020 174.0',
    muted: '0.890 0.066 172.2',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.544 0.207 284.8',
    strong: '0.460 0.199 282.9',
    soft: '0.961 0.021 293.7',
    muted: '0.850 0.075 292.4',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.647 0.186 43.3',
    strong: '0.531 0.146 44.6',
    soft: '0.966 0.019 52.3',
    muted: '0.881 0.068 51.6',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.617 0.227 322.1',
    strong: '0.524 0.188 322.1',
    soft: '0.969 0.025 321.7',
    muted: '0.885 0.078 321.8',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.612 0.108 217.6',
    strong: '0.497 0.087 217.1',
    soft: '0.969 0.022 211.0',
    muted: '0.884 0.066 211.3',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.521 0.124 132.3',
    strong: '0.429 0.105 132.5',
    soft: '0.966 0.020 128.7',
    muted: '0.872 0.068 129.4',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.603 0.215 20.3',
    strong: '0.512 0.183 20.3',
    soft: '0.967 0.017 8.2',
    muted: '0.875 0.060 9.4',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.590 0.218 347.3',
    strong: '0.498 0.175 346.6',
    soft: '0.969 0.021 339.2',
    muted: '0.886 0.061 340.1',
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
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToRgb([l, c, h]: [number, number, number]): [number, number, number] {
  // 1. OKLCH -> OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // 2. OKLab -> Linear LMS
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_l = l_ ** 3;
  const m_l = m_ ** 3;
  const s_l = s_ ** 3;

  // 3. Linear LMS -> Linear sRGB
  const rLin =  4.0767416621 * l_l - 3.3077115913 * m_l + 0.2309699292 * s_l;
  const gLin = -1.2684380046 * l_l + 2.6097574011 * m_l - 0.3413193965 * s_l;
  const blLin = -0.0041960863 * l_l - 0.7034186147 * m_l + 1.7076147010 * s_l;

  // 4. Linear sRGB -> sRGB (Gamma Encoding)
  const gamma = (v: number) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1/2.4) - 0.055;
  };

  return [gamma(rLin), gamma(gLin), gamma(blLin)];
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
