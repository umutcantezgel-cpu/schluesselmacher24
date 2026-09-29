import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, contrastRatio, type AreaTheme } from './area-theme';

import * as culori from "culori";

function parseOklch(value: string) {
  const match = value.match(/oklch\(([^\s]+)\s+([^\s]+)\s+([^\s]+)/);
  if (!match) return value;
  const l = parseFloat(match[1]);
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);
  const color = culori.converter('hsl')({ mode: 'oklch', l, c, h });
  if (!color) return value;

  // Format to original HSL style: 214 45% 98.6%
  const fh = Math.round((color.h || 0) * 10) / 10;
  const fs = Math.round(color.s * 1000) / 10;
  const fl = Math.round(color.l * 1000) / 10;

  return `${fh} ${fs}% ${fl}%`;
}
function mapToHsl(oklchStr: string) {
  return parseOklch(oklchStr);
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
    expect(contrastRatio(mapToHsl(token(fg)), mapToHsl(token(bg)))).toBeGreaterThanOrEqual(4.5);
  });
});
