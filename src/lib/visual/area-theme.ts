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
  accent: '0.5 0.15 260',
  strong: '0.35 0.15 260',
  soft: '0.96 0.02 260',
  muted: '0.9 0.05 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.5 0.15 240',
    strong: '0.35 0.15 240',
    soft: '0.96 0.02 240',
    muted: '0.9 0.05 240',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.5 0.15 170',
    strong: '0.35 0.15 170',
    soft: '0.96 0.02 170',
    muted: '0.9 0.05 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.5 0.15 280',
    strong: '0.35 0.15 280',
    soft: '0.96 0.02 280',
    muted: '0.9 0.05 280',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.5 0.15 30',
    strong: '0.35 0.15 30',
    soft: '0.96 0.02 30',
    muted: '0.9 0.05 30',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.5 0.15 300',
    strong: '0.35 0.15 300',
    soft: '0.96 0.02 300',
    muted: '0.9 0.05 300',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.5 0.15 200',
    strong: '0.35 0.15 200',
    soft: '0.96 0.02 200',
    muted: '0.9 0.05 200',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.5 0.15 150',
    strong: '0.35 0.15 150',
    soft: '0.96 0.02 150',
    muted: '0.9 0.05 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.5 0.15 350',
    strong: '0.35 0.15 350',
    soft: '0.96 0.02 350',
    muted: '0.9 0.05 350',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.5 0.15 330',
    strong: '0.35 0.15 330',
    soft: '0.96 0.02 330',
    muted: '0.9 0.05 330',
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

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToLuminance([L, C, H]: [number, number, number]): number {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = Math.pow(Math.max(0, l_), 3);
  const m = Math.pow(Math.max(0, m_), 3);
  const s = Math.pow(Math.max(0, s_), 3);

  const Y = -0.0405801784 * l + 1.1122568696 * m - 0.0716766787 * s;
  return Math.max(0, Y);
}

export function contrastRatio(a: string, b: string): number {
  const la = oklchToLuminance(parseOklch(a));
  const lb = oklchToLuminance(parseOklch(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
