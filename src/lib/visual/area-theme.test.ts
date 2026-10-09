import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';



// Local OKLCH and sRGB conversion functions
function parseOklchOrHsl(value: string): number {
  if (value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)) {
    // Falls noch alte HSL-Werte reinkommen (z. B. durch areaTheme)
    return relativeLuminance(hslToRgb(parseHsl(value)));
  }

  // Parse OKLCH
  // e.g. "0.988 0.002 260"
  const parts = value.trim().split(/\s+/);
  if (parts.length >= 3) {
    const l = parseFloat(parts[0]);
    const c = parseFloat(parts[1]);
    const h = parseFloat(parts[2]);
    return relativeLuminance(oklchToRgb([l, c, h]));
  }

  if (value === '0 0% 100%') {
    return 1;
  }

  throw new Error(`Unbekanntes Farbformat: "${value}"`);
}

function oklchToRgb([L, C, h]: [number, number, number]): [number, number, number] {
  // simplified for test
  // L is roughly perceived lightness. But we need accurate luminance for WCAG contrast.
  // Actually, we can use the true formula or a close approximation.
  // To avoid complex matrix math in the test, we'll implement a basic conversion.
  // Wait, the memory states: "inject local mathematical conversion functions (e.g., OKLCH to linear sRGB relative luminance) directly into the test file."
  // It's better to implement the exact conversion or an approximation.
  // Let's implement full OKLCH -> OKLAB -> linear sRGB -> sRGB.

  const hRad = h * Math.PI / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLAB to LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = Math.pow(l_, 3);
  const m = Math.pow(m_, 3);
  const s = Math.pow(s_, 3);

  // LMS to Linear sRGB
  const rL = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gL = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bL = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Linear sRGB to sRGB
  const toSRGB = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return [toSRGB(rL), toSRGB(gL), toSRGB(bL)];
}

function parseHsl(value: string): [number, number, number] {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) throw new Error(`Kein HSL-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => {
    // clamp to 0-1
    v = Math.max(0, Math.min(1, v));
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function localContrastRatio(a: string, b: string): number {
  let la, lb;
  try {
    la = parseOklchOrHsl(a);
  } catch (e) {
    if (a === '0 0% 100%') la = 1; // pure white fallback
    else if (a === '1 0 0') la = 1; // oklch white
    else throw e;
  }

  try {
    lb = parseOklchOrHsl(b);
  } catch (e) {
    if (b === '0 0% 100%') lb = 1;
    else if (b === '1 0 0') lb = 1;
    else throw e;
  }
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}


import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, type AreaTheme } from './area-theme';

const WHITE = '0 0% 100%';

function checkTheme(name: string, theme: AreaTheme) {
  it(`${name}: Text in Akzentfarbe ist lesbar (≥ 4,5:1)`, () => {
    expect(localContrastRatio(theme.strong, WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(localContrastRatio(theme.strong, theme.soft)).toBeGreaterThanOrEqual(4.5);
  });

  it(`${name}: Grafikfarbe hebt sich ab (≥ 3:1)`, () => {
    expect(localContrastRatio(theme.accent, WHITE)).toBeGreaterThanOrEqual(3);
    expect(localContrastRatio(theme.accent, theme.soft)).toBeGreaterThanOrEqual(3);
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
    expect(localContrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
