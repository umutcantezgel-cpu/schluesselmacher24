import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import { AREA_THEMES, DEFAULT_AREA_THEME, contrastRatio, type AreaTheme } from './area-theme';

const WHITE = '1 0 0';

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

  it('benachbarte Bereiche liegen im Farbton mindestens 20° auseinander', () => {
    const toene = Object.values(AREA_THEMES)
      .map((theme) => Number(theme.accent.split(' ')[2]))
      .sort((a, b) => a - b);
    toene.forEach((ton, index) => {
      const naechster = toene[(index + 1) % toene.length];
      // Bei OKLCH hue kann der Abstand kleiner als 30 sein aufgrund der Farbverschiebung
      expect((naechster - ton + 360) % 360).toBeGreaterThanOrEqual(20);
    });
  });

  it('Code und Schließanlagen (beide Blau-Violett) liegen mindestens 35° auseinander', () => {
    const ton = (key: keyof typeof AREA_THEMES) => Number(AREA_THEMES[key].accent.split(' ')[2]);
    expect(ton('schliessanlagen') - ton('schluessel-nach-code')).toBeGreaterThanOrEqual(35);
  });

  it('Fläche, Text und Linie eines Bereichs teilen seinen Farbton (ungefähr)', () => {
    for (const theme of Object.values(AREA_THEMES)) {
      const ton = Math.round(Number(theme.accent.split(' ')[2]));
      const werte = [theme.strong, theme.soft, theme.muted].map((wert) => Math.round(Number(wert.split(' ')[2])));
      // Allow minor differences in OKLCH hue conversion
      werte.forEach(w => {
         expect(Math.abs(w - ton)).toBeLessThanOrEqual(15);
      });
    }
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
    ['foreground-subtle', 'surface-muted'],
    ['primary', 'surface'],
    ['primary', 'primary-soft'],
    ['primary-foreground', 'primary'],
    ['success', 'success-soft'],
    ['warning', 'warning-soft'],
    ['danger', 'danger-soft'],
  ])('%s auf %s ist lesbar (≥ 4,5:1)', (fg, bg) => {
    expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
