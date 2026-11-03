import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

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

  it('nennt keine Schrift aus der Liste S1', () => {
    expect(quelle).not.toMatch(/\bInter\b/);
  });
});
