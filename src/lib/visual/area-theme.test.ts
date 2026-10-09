import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error culori types are missing
import * as culori from "culori";

import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, contrastRatio as originalContrastRatio, type AreaTheme } from './area-theme';

function relativeLuminance(rgb: { r: number; g: number; b: number }) {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const r = channel(rgb.r);
  const g = channel(rgb.g);
  const b = channel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function oklchContrastRatio(a: string, b: string) {
  // Try to parse OKLCH, fallback to original if not matching
  if (!a.match(/^[\d.]+\s+[\d.]+\s+[\d.]+$/)) {
      return originalContrastRatio(a, b);
  }
  const parseOklchStr = (str: string) => {
    const parts = str.trim().split(/\s+/);
    return { mode: 'oklch', l: Number(parts[0]), c: Number(parts[1]), h: Number(parts[2]) || 0 };
  };
  const colorA = parseOklchStr(a);
  const colorB = parseOklchStr(b);

  const rgbA = culori.converter('rgb')(colorA);
  const rgbB = culori.converter('rgb')(colorB);

  const la = relativeLuminance(rgbA);
  const lb = relativeLuminance(rgbB);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const WHITE = '0 0% 100%';

function checkTheme(name: string, theme: AreaTheme) {
  it(`${name}: Text in Akzentfarbe ist lesbar (≥ 4,5:1)`, () => {
    expect(oklchContrastRatio(theme.strong, WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(oklchContrastRatio(theme.strong, theme.soft)).toBeGreaterThanOrEqual(4.5);
  });

  it(`${name}: Grafikfarbe hebt sich ab (≥ 3:1)`, () => {
    expect(oklchContrastRatio(theme.accent, WHITE)).toBeGreaterThanOrEqual(3);
    expect(oklchContrastRatio(theme.accent, theme.soft)).toBeGreaterThanOrEqual(3);
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
    expect(oklchContrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
