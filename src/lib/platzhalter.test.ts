import { describe, expect, it } from 'vitest';
import { enthaeltPlatzhalter, istPlatzhalter } from './platzhalter';

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

describe('enthaeltPlatzhalter', () => {
  it('findet Platzhalter auch mitten im Text', () => {
    expect(enthaeltPlatzhalter('Wir sind in [Platzhalter: Stadtteile ergänzen] unterwegs.')).toBe(true);
    expect(enthaeltPlatzhalter('Musterstraße 1, [PLZ] [Ort]')).toBe(true);
    expect(enthaeltPlatzhalter('[Hersteller eintragen] · Möbelschloss')).toBe(true);
    expect(enthaeltPlatzhalter('Dauer: [übliche Bearbeitungsdauer ergänzen]')).toBe(true);
  });

  it('lässt Text ohne Platzhalter und andere Klammern stehen', () => {
    expect(enthaeltPlatzhalter('Möbelschloss [Serie 2]')).toBe(false);
    expect(enthaeltPlatzhalter('Einsatz im Umkreis von 40 km.')).toBe(false);
    expect(enthaeltPlatzhalter('')).toBe(false);
    expect(enthaeltPlatzhalter(undefined)).toBe(false);
  });
});
