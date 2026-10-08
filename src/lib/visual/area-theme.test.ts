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


function getLuminanceFromOklch(oklchStr: string) {
  if (oklchStr === '1 0 0' || oklchStr === '100% 0 0' || oklchStr.startsWith('1 ')) return 1;
  const parts = oklchStr.split(' ');
  const l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);

  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_cubed = l_ * l_ * l_;
  const m_cubed = m_ * m_ * m_;
  const s_cubed = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l_cubed - 3.3077115913 * m_cubed + 0.2309699292 * s_cubed;
  const g_lin = -1.2684380046 * l_cubed + 2.6097574011 * m_cubed - 0.3413193965 * s_cubed;
  const b_lin = -0.0041960863 * l_cubed - 0.7034186147 * m_cubed + 1.7076147010 * s_cubed;

  const r_c = Math.max(0, Math.min(1, r_lin));
  const g_c = Math.max(0, Math.min(1, g_lin));
  const b_c = Math.max(0, Math.min(1, b_lin));

  return 0.2126 * r_c + 0.7152 * g_c + 0.0722 * b_c;
}

function oklchContrastRatio(color1: string, color2: string) {
  const l1 = getLuminanceFromOklch(color1);
  const l2 = getLuminanceFromOklch(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
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
    expect(oklchContrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
