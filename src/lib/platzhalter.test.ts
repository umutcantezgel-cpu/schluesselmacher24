import { describe, expect, it } from 'vitest';
import { istPlatzhalter } from './platzhalter';

describe('istPlatzhalter', () => {
  it('erkennt Redaktions-Platzhalter und leere Werte', () => {
    expect(istPlatzhalter('[Hersteller eintragen]')).toBe(true);
    expect(istPlatzhalter('  [Platzhalter: Baujahre]')).toBe(true);
    expect(istPlatzhalter('')).toBe(true);
    expect(istPlatzhalter(undefined)).toBe(true);
  });

  it('lässt echte Werte stehen', () => {
    expect(istPlatzhalter('ABUS')).toBe(false);
    expect(istPlatzhalter('Möbelschloss [Serie 2]')).toBe(false);
  });
});
