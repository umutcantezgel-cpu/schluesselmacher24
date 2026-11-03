import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { NAV_AREAS } from '@/lib/navigation';

import { bereichsInhalt, farbe, tokensAusCss } from './bereichsbild';

describe('tokensAusCss', () => {
  it('liest die Grundfarben aus globals.css (eine Quelle für Seite und Vorschaubild)', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
    const t = tokensAusCss(css);
    for (const wert of Object.values(t)) expect(wert).toMatch(/^\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/);
    /* `--foreground` darf nicht von `--foreground-muted` überdeckt werden und umgekehrt. */
    expect(t.foreground).not.toBe(t['foreground-muted']);
  });

  it('meldet ein fehlendes Token, statt eine Farbe zu raten', () => {
    expect(() => tokensAusCss(':root { --background: 0 0% 100%; }')).toThrow(/--foreground/);
  });
});

describe('farbe', () => {
  it('macht aus dem OKLCH-Tripel einen Hex-Wert, den Satori lesen kann', () => {
    /* --primary, bisher HSL 214 80% 40% */
    expect(farbe('0.4852 0.1611 257.63')).toBe('#145bb8');
    expect(farbe('1 0 0')).toBe('#ffffff');
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
