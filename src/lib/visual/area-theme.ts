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

function parseColor(value: string): { type: 'hsl' | 'oklch', coords: [number, number, number] } {
  if (value.includes('%')) {
    const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
    if (!match) throw new Error(`Kein HSL-Tripel: "${value}"`);
    return { type: 'hsl', coords: [Number(match[1]), Number(match[2]), Number(match[3])] };
  } else {
    // Treat as OKLCH. Optional alpha at the end e.g. "0.890 0.008 260 / 0.55"
    const cleaned = value.split('/')[0].trim();
    const match = cleaned.match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
    if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
    return { type: 'oklch', coords: [Number(match[1]), Number(match[2]), Number(match[3])] };
  }
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function colorToLuminance(color: { type: 'hsl' | 'oklch', coords: [number, number, number] }): number {
  if (color.type === 'hsl') {
    return relativeLuminance(hslToRgb(color.coords));
  }
  // For OKLCH, L is perceived lightness. The relative luminance Y is roughly L^2 or L^(3).
  // Let's use a very basic approximation: Y ≈ L^3 or standard L to Y conversion.
  // We can just return L^2.4 or something similar since L = 100 in Lab is Y = 1, L = 0 is Y = 0.
  // Actually, standard formula from L to Y is: if L > 8 Y = ((L+16)/116)^3. But here L is 0..1!
  // In OKLCH, L is 0 to 1. So Y = L^3 is a decent approximation, but L in OKLab uses a cube root of linear Lightness.
  // Let's just return L^3.
  const l = color.coords[0];
  return Math.pow(l, 3);
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier HSL-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = colorToLuminance(parseColor(a));
  const lb = colorToLuminance(parseColor(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
