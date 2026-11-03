import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import {
  ABSTUFUNG,
  AREA_THEMES,
  DEFAULT_AREA_THEME,
  WEISS,
  contrastRatio,
  farbton,
  imSrgb,
  istLilaOderIndigo,
  oklchZuHex,
  parseOklch,
  type AreaTheme,
} from './area-theme';

const STUFEN = ['accent', 'strong', 'soft', 'muted'] as const;

function checkTheme(name: string, theme: AreaTheme) {
  it(`${name}: Text in Akzentfarbe ist lesbar (≥ 4,5:1)`, () => {
    expect(contrastRatio(theme.strong, WEISS)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(theme.strong, theme.soft)).toBeGreaterThanOrEqual(4.5);
  });

  it(`${name}: Grafikfarbe hebt sich ab (≥ 3:1)`, () => {
    expect(contrastRatio(theme.accent, WEISS)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(theme.accent, theme.soft)).toBeGreaterThanOrEqual(3);
  });

  it(`${name}: folgt der Abstufungsregel (Helligkeit je Stufe, Buntheit gedeckelt, im sRGB-Farbraum)`, () => {
    for (const stufe of STUFEN) {
      const [l, c] = parseOklch(theme[stufe]);
      expect(Math.abs(l - ABSTUFUNG[stufe].L), `${stufe} L`).toBeLessThanOrEqual(0.002);
      expect(c, `${stufe} C`).toBeLessThanOrEqual(ABSTUFUNG[stufe].cHoechstens);
      expect(imSrgb(theme[stufe]), `${stufe} im Farbraum`).toBe(true);
    }
  });

  it(`${name}: kein Lila und kein Indigo (S2)`, () => {
    for (const stufe of STUFEN) expect(istLilaOderIndigo(theme[stufe]), stufe).toBe(false);
  });
}

describe('Bereichsfarben', () => {
  it('jeder Bereich hat eine Farbe', () => {
    expect(Object.keys(AREA_THEMES).sort()).toEqual([...AREA_KEYS].sort());
  });

  it('benachbarte Bereiche liegen im Farbton mindestens 30° auseinander', () => {
    const toene = Object.values(AREA_THEMES)
      .map((theme) => farbton(theme.accent))
      .sort((a, b) => a - b);
    toene.forEach((ton, index) => {
      const naechster = toene[(index + 1) % toene.length];
      expect((naechster - ton + 360) % 360).toBeGreaterThanOrEqual(30);
    });
  });

  it('Code und Schließanlagen liegen mindestens 40° auseinander (Sichtabnahme E4-L-23)', () => {
    const ton = (key: keyof typeof AREA_THEMES) => farbton(AREA_THEMES[key].accent);
    expect(ton('schliessanlagen') - ton('schluessel-nach-code')).toBeGreaterThanOrEqual(40);
  });

  it('Fläche, Text und Linie eines Bereichs teilen seinen Farbton', () => {
    for (const theme of [DEFAULT_AREA_THEME, ...Object.values(AREA_THEMES)]) {
      const ton = farbton(theme.accent);
      expect([theme.strong, theme.soft, theme.muted].map(farbton)).toEqual([ton, ton, ton]);
    }
  });

  checkTheme('Allgemein', DEFAULT_AREA_THEME);
  for (const [key, theme] of Object.entries(AREA_THEMES)) {
    checkTheme(key, theme);
  }
});

describe('Umrechnung', () => {
  it('rechnet OKLCH in Hex um und erkennt Lila', () => {
    expect(oklchZuHex(WEISS)).toBe('#ffffff');
    expect(oklchZuHex('0 0 0')).toBe('#000000');
    /* Bestand: Primärblau HSL 214 80% 40% */
    expect(oklchZuHex('0.4852 0.1611 257.63')).toBe('#145bb8');
    expect(istLilaOderIndigo('0.606 0.25 292.7')).toBe(true); /* Tailwind violet-500 */
    expect(istLilaOderIndigo('0.585 0.233 277.1')).toBe(true); /* Tailwind indigo-500 */
    expect(istLilaOderIndigo('0.6165 0.2269 322.07')).toBe(true); /* bisherige Schließanlagen */
    expect(istLilaOderIndigo('0.5904 0.2181 347.28')).toBe(true); /* bisheriger Service (HSL 322°) */
    expect(istLilaOderIndigo('0.2497 0.0366 266')).toBe(false); /* Schriftfarbe, kaum bunt */
  });

  it('meldet ein ungültiges Tripel, statt eine Farbe zu raten', () => {
    expect(() => parseOklch('214 80% 40%')).toThrow(/OKLCH/);
  });
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
    ['accent', 'accent-soft'],
  ])('%s auf %s ist lesbar (≥ 4,5:1)', (fg, bg) => {
    expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it('der Fokusring hebt sich von Weiß und Hintergrund ab (≥ 3:1)', () => {
    expect(contrastRatio(token('ring'), token('surface'))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(token('ring'), token('background'))).toBeGreaterThanOrEqual(3);
  });

  it('alle Farbtokens sind OKLCH-Tripel im sRGB-Farbraum, ohne Lila und Indigo', () => {
    const tokens = [...css.matchAll(/--([a-z-]+):\s*(\d[\d.]*\s+[\d.]+\s+-?[\d.]+);/g)];
    expect(tokens.length).toBeGreaterThan(25);
    expect(css).not.toMatch(/--[a-z-]+:\s*\d[\d.]*\s+[\d.]+%\s+[\d.]+%;/);
    for (const [, name, wert] of tokens) {
      expect(imSrgb(wert), name).toBe(true);
      expect(istLilaOderIndigo(wert), name).toBe(false);
    }
  });

  it('das Markenblau bleibt der bisherige Wert und ist die Grundfarbe für Text (Wortmarke, G9)', () => {
    expect(token('primary')).toBe(DEFAULT_AREA_THEME.strong);
    expect(oklchZuHex(token('primary'))).toBe('#145bb8');
    expect(token('ring')).toBe(DEFAULT_AREA_THEME.accent);
    expect(token('primary-soft')).toBe(DEFAULT_AREA_THEME.soft);
  });
});
