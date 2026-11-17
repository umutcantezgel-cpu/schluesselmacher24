import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { DEFAULT_AREA_THEME, contrastRatio } from '@/lib/visual/area-theme';

/* Die letzte Fehlergrenze lädt keine globalen Stile; ihre Farben müssen trotzdem die Tokens sein. */
describe('Fehlerseite global-error', () => {
  const css = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
  const quelle = readFileSync(path.join(process.cwd(), 'src/app/global-error.tsx'), 'utf8');
  const token = (name: string) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();

  it.each([
    ['hintergrund', 'background'],
    ['flaeche', 'surface'],
    ['text', 'foreground'],
    ['leise', 'foreground-muted'],
    ['linie', 'border'],
    ['primaer', 'primary'],
  ])('%s entspricht --%s', (schluessel, name) => {
    const wert = quelle.match(new RegExp(`${schluessel}: 'oklch\\(([^)]+)\\)'`))?.[1];
    expect(wert).toBeDefined();
    expect(wert).toBe(token(name));
  });

  it('die „24“ trägt die Grafikfarbe des Markenblaus: lesbar auf Weiß, abgesetzt von der Tinte', () => {
    const marke = quelle.match(/marke: 'oklch\(([^)]+)\)'/)?.[1];
    expect(marke).toBe(DEFAULT_AREA_THEME.accent);
    expect(contrastRatio(marke!, token('surface')!)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(marke!, token('foreground')!)).toBeGreaterThanOrEqual(2.5);
  });

  it('nennt keine Schrift aus der Liste S1', () => {
    expect(quelle).not.toMatch(/\bInter\b/);
  });
});
