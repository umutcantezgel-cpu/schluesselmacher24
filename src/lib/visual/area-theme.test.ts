import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, contrastRatio, type AreaTheme } from './area-theme';

const WHITE = '0 0% 100%';

// Helper for OKLCH luminance in tests
function oklchToLuminance([L, C, h]: [number, number, number]): number {
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return Math.max(0, Math.min(1, 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin));
}

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().split(/\s+/);
  return [Number(match[0]), Number(match[1]), Number(match[2] || 0)];
}

function mixedContrastRatio(a: string, b: string): number {
  const isOklchA = !a.includes('%');
  const isOklchB = !b.includes('%');

  let lumA = 0;
  let lumB = 0;

  if (!isOklchA && !isOklchB) {
    return contrastRatio(a, b);
  }

  if (isOklchA) {
    lumA = oklchToLuminance(parseOklch(a));
  } else {
    // using the contrastRatio logic is hard since we can't get lum alone.
    // we just compute HSL lum manually for this side
    // Actually just use the built in contrastRatio with white/black to extract lum?
    // Let's implement relativeLuminance for HSL here
    const parseHsl = (val: string) => {
      const match = val.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
      if (!match) return [0, 0, 0] as [number, number, number];
      return [Number(match[1]), Number(match[2]), Number(match[3])] as [number, number, number];
    };
    const hslToRgb = ([h, s, l]: [number, number, number]) => {
      const sat = s / 100;
      const light = l / 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = sat * Math.min(light, 1 - light);
      const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [f(0), f(8), f(4)];
    };
    const relLum = (rgb: number[]) => {
      const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const [r, g, b] = rgb.map(channel);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    lumA = relLum(hslToRgb(parseHsl(a)));
  }

  if (isOklchB) {
    lumB = oklchToLuminance(parseOklch(b));
  } else {
    const parseHsl = (val: string) => {
      const match = val.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
      if (!match) return [0, 0, 0] as [number, number, number];
      return [Number(match[1]), Number(match[2]), Number(match[3])] as [number, number, number];
    };
    const hslToRgb = ([h, s, l]: [number, number, number]) => {
      const sat = s / 100;
      const light = l / 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = sat * Math.min(light, 1 - light);
      const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [f(0), f(8), f(4)];
    };
    const relLum = (rgb: number[]) => {
      const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const [r, g, b] = rgb.map(channel);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    lumB = relLum(hslToRgb(parseHsl(b)));
  }

  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}


function checkTheme(name: string, theme: AreaTheme) {
  it(`${name}: Text in Akzentfarbe ist lesbar (≥ 4,5:1)`, () => {
    expect(contrastRatio(theme.strong, WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(theme.strong, theme.soft)).toBeGreaterThanOrEqual(4.5);
  });

  it(`${name}: Grafikfarbe hebt sich ab (≥ 3:1)`, () => {
    expect(contrastRatio(theme.accent, WHITE)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(theme.accent, theme.soft)).toBeGreaterThanOrEqual(3);
  });
}

describe('Bereichsfarben', () => {
  it('jeder Bereich hat eine Farbe', () => {
    expect(Object.keys(AREA_THEMES).sort()).toEqual([...AREA_KEYS].sort());
  });

  checkTheme('Allgemein', DEFAULT_AREA_THEME);
  for (const [key, theme] of Object.entries(AREA_THEMES)) {
    checkTheme(key, theme);
  }
});

describe('Grundfarben in globals.css', () => {
  const css = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
  const token = (name: string) => {
    const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
    if (!match) throw new Error(`Token --${name} fehlt`);
    return match[1].trim();
  };

  it.each([
    ['foreground', 'background'],
    ['foreground-muted', 'background'],
    ['foreground-muted', 'surface-muted'],
    ['foreground-subtle', 'surface'],
    ['primary', 'surface'],
    ['primary', 'primary-soft'],
    ['primary-foreground', 'primary'],
    ['success', 'success-soft'],
    ['warning', 'warning-soft'],
    ['danger', 'danger-soft'],
  ])('%s auf %s ist lesbar (≥ 4,5:1)', (fg, bg) => {
    expect(mixedContrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
