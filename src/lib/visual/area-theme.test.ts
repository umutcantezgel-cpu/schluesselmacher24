import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, contrastRatio, type AreaTheme } from './area-theme';


// OKLCH implementation for the test
function parseColor(value: string) {
  if (value.includes('%')) {
    const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
    if (!match) throw new Error(`Kein HSL-Tripel: "${value}"`);
    return { type: 'hsl', values: [Number(match[1]), Number(match[2]), Number(match[3])] };
  } else {
    // OKLCH
    const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?$/);
    if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
    return { type: 'oklch', values: [Number(match[1]), Number(match[2]), Number(match[3])] };
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

// Convert OKLCH to RGB (simplified approx for test, or exact if we use matrix)
// To keep it simple, L in OKLCH correlates closely with relative luminance, but we'll implement a basic conversion:
// Wait, relative luminance Y is exactly L^2 in OKLAB/OKLCH? Actually, L in OKLCH is Lightness, we can convert OKLCH -> OKLAB -> Linear sRGB -> sRGB.
function oklchToRgb([L, C, h]: [number, number, number]): [number, number, number] {
    const hRad = h * Math.PI / 180;
    const l = L;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l__ = l_ ** 3;
    const m__ = m_ ** 3;
    const s__ = s_ ** 3;

    const rL = +4.0767416621 * l__ - 3.3077115913 * m__ + 0.2309699292 * s__;
    const gL = -1.2684380046 * l__ + 2.6097574011 * m__ - 0.3413193965 * s__;
    const bL = -0.0041960863 * l__ - 0.7034186147 * m__ + 1.7076147010 * s__;

    const srgb = (c: number) => {
        if (c <= 0.0031308) return 12.92 * c;
        return 1.055 * (c ** (1 / 2.4)) - 0.055;
    };
    return [srgb(rL), srgb(gL), srgb(bL)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function anyContrastRatio(a: string, b: string): number {
  const pa = parseColor(a);
  const pb = parseColor(b);
  const rgbA = pa.type === 'hsl' ? hslToRgb(pa.values as [number, number, number]) : oklchToRgb(pa.values as [number, number, number]);
  const rgbB = pb.type === 'hsl' ? hslToRgb(pb.values as [number, number, number]) : oklchToRgb(pb.values as [number, number, number]);
  const la = relativeLuminance(rgbA);
  const lb = relativeLuminance(rgbB);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}


const WHITE = '0 0% 100%';

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
    expect(anyContrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
