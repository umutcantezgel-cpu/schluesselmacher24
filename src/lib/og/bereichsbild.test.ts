import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { NAV_AREAS } from '@/lib/navigation';

import { bereichsInhalt, farbe, tokensAusCss } from './bereichsbild';

describe('tokensAusCss', () => {
  it('liest die Grundfarben aus globals.css (eine Quelle für Seite und Vorschaubild)', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
    const t = tokensAusCss(css);
    for (const wert of Object.values(t)) expect(wert).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?% \d+(\.\d+)?%$/);
    /* `--foreground` darf nicht von `--foreground-muted` überdeckt werden und umgekehrt. */
    expect(t.foreground).not.toBe(t['foreground-muted']);
  });

  it('meldet ein fehlendes Token, statt eine Farbe zu raten', () => {
    expect(() => tokensAusCss(':root { --background: 0 0% 100%; }')).toThrow(/--foreground/);
  });
});

describe('farbe', () => {
  it('macht aus dem HSL-Tripel einen Farbwert', () => {
    expect(farbe('214 80% 40%')).toBe('hsl(214 80% 40%)');
  });
});

describe('bereichsInhalt', () => {
  it('nimmt nur vorhandene Texte aus der Navigation', () => {
    for (const area of NAV_AREAS) {
      expect(bereichsInhalt(area.key)).toEqual({
        augenbraue: 'SCHLÜSSELMACHER24',
        titel: area.label,
        text: area.summary,
        bereich: area.key,
      });
    }
  });
});
