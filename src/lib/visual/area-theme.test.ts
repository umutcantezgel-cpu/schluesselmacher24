import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, contrastRatio, type AreaTheme } from './area-theme';

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



function oklchRelativeLuminance(oklchStr: string): number {
  // Simple regex parsing for OKLCH: "oklch(0.988 0.002 260)"
  const match = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return 0;

  const L = parseFloat(match[1]); // This is roughly perceptual luminance
  // For relative luminance, normally we convert OKLCH -> OKLAB -> Linear sRGB -> Relative Luminance
  // but for the sake of these tests, let's do a rough approximation or a full conversion.
  // Full conversion:
  const C = parseFloat(match[2]);
  const h = parseFloat(match[3]) * Math.PI / 180;

  const l_ = L;
  const a_ = C * Math.cos(h);
  const b_ = C * Math.sin(h);

  const l = l_ + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m = l_ - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s = l_ - 0.0894841775 * a_ - 1.2914855480 * b_;

  const l3 = l*l*l;
  const m3 = m*m*m;
  const s3 = s*s*s;

  const rL = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gL = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bL = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // linear sRGB relative luminance is simply:
  return 0.2126 * Math.max(0, Math.min(1, rL)) + 0.7152 * Math.max(0, Math.min(1, gL)) + 0.0722 * Math.max(0, Math.min(1, bL));
}

export function oklchContrastRatio(a: string, b: string): number {
  const la = oklchRelativeLuminance(a);
  const lb = oklchRelativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}


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
    expect(oklchContrastRatio(`oklch(${token(fg)})`, `oklch(${token(bg)})`)).toBeGreaterThanOrEqual(4.5);
  });
});
