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
  accent: '214 86% 50%',
  strong: '214 80% 40%',
  soft: '214 100% 96.5%',
  muted: '214 90% 86%',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '217 91% 53%',
    strong: '217 76% 42%',
    soft: '214 100% 96.5%',
    muted: '217 90% 86%',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '172 76% 34%',
    strong: '174 84% 25%',
    soft: '168 64% 94.5%',
    muted: '170 60% 80%',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '245 78% 62%',
    strong: '245 58% 50%',
    soft: '245 100% 97%',
    muted: '245 90% 88%',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '20 88% 48%',
    strong: '18 84% 37%',
    soft: '24 100% 95.5%',
    muted: '22 95% 84%',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '266 72% 60%',
    strong: '266 52% 48%',
    soft: '266 100% 97%',
    muted: '266 80% 88%',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '195 90% 37%',
    strong: '196 90% 28%',
    soft: '190 90% 94.5%',
    muted: '192 75% 80%',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '152 64% 34%',
    strong: '153 68% 25%',
    soft: '148 56% 94.5%',
    muted: '150 50% 80%',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '350 78% 54%',
    strong: '350 68% 43%',
    soft: '350 100% 97%',
    muted: '350 85% 88%',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '326 68% 52%',
    strong: '326 62% 41%',
    soft: '326 100% 97%',
    muted: '326 75% 88%',
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

function parseColor(value: string): [number, number, number] {
  const oklchMatch = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (oklchMatch) {
    const l = Number(oklchMatch[1]);
    const c = Number(oklchMatch[2]);
    const h = Number(oklchMatch[3]);

    // Convert oklch to srgb
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l__ = l_ ** 3;
    const m__ = m_ ** 3;
    const s__ = s_ ** 3;

    const rL =  4.0767416621 * l__ - 3.3077115913 * m__ + 0.2309699292 * s__;
    const gL = -1.2684380046 * l__ + 2.6097574011 * m__ - 0.3413193965 * s__;
    const bL = -0.0041960863 * l__ - 0.7034186147 * m__ + 1.7076147010 * s__;

    // Apply standard sRGB companding to linear RGB values before returning them
    const compand = (v: number) => {
      const abs = Math.abs(v);
      const val = abs <= 0.0031308 ? 12.92 * abs : 1.055 * Math.pow(abs, 1 / 2.4) - 0.055;
      return v < 0 ? -val : val;
    };

    return [
      Math.max(0, Math.min(1, compand(rL))),
      Math.max(0, Math.min(1, compand(gL))),
      Math.max(0, Math.min(1, compand(bL)))
    ];
  }

  const hslMatch = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!hslMatch) throw new Error(`Unbekanntes Farbformat: "${value}"`);

  const h = Number(hslMatch[1]);
  const s = Number(hslMatch[2]);
  const l = Number(hslMatch[3]);
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier HSL-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(parseColor(a));
  const lb = relativeLuminance(parseColor(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
