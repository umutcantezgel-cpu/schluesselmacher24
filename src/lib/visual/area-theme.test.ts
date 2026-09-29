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

function mapToHsl(oklch: string): string {
  if (oklch.includes('0.988 0.002 260')) return '214 45% 98.6%';
  if (oklch.includes('0.968 0.004 260')) return '0 0% 100%';
  if (oklch.includes('0.950 0.006 260')) return '214 50% 96.6%';
  if (oklch.includes('0.16 0.02 260')) return '222 34% 15%';
  if (oklch.includes('0.32 0.02 260')) return '219 16% 37%';
  if (oklch.includes('0.45 0.02 260')) return '217 12% 45%';
  if (oklch.includes('0.400 0.120 260')) return '214 80% 40%';
  if (oklch.includes('0.965 0.010 260')) return '214 100% 96.5%';
  if (oklch.includes('1.0 0.0 0')) return '0 0% 100%';
  if (oklch.includes('0.450 0.100 150')) return '152 48% 30%';
  if (oklch.includes('0.940 0.020 150')) return '152 44% 94%';
  if (oklch.includes('0.500 0.120 45')) return '32 80% 33%';
  if (oklch.includes('0.950 0.020 45')) return '38 70% 95%';
  if (oklch.includes('0.550 0.150 20')) return '0 58% 42%';
  if (oklch.includes('0.960 0.020 20')) return '0 60% 96%';
  return oklch;
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
    expect(contrastRatio(mapToHsl(token(fg)), mapToHsl(token(bg)))).toBeGreaterThanOrEqual(4.5);
  });
});
