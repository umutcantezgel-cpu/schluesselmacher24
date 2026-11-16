import { describe, expect, it } from 'vitest';

import { Hersteller } from './Hersteller';

/* Prüfung am Array „Bereiche“ (FA-SHOP-04): doppelte Bereiche werden abgelehnt, leere Zeilen meldet
 * das Pflichtfeld „Bereich“ selbst. */

type Pruefung = (wert: unknown) => true | string;

function bereichePruefung(): Pruefung {
  const feld = Hersteller.fields.find((f) => 'name' in f && f.name === 'bereiche');
  if (!feld || !('validate' in feld) || typeof feld.validate !== 'function') throw new Error('Feld „bereiche“ ohne Prüfung');
  return feld.validate as unknown as Pruefung;
}

describe('Hersteller: Prüfung der Bereiche', () => {
  const pruefe = bereichePruefung();

  it('nimmt verschiedene Bereiche und eine leere Liste an', () => {
    expect(pruefe([{ art: 'sperrschliessung' }, { art: 'zutritt' }])).toBe(true);
    expect(pruefe([])).toBe(true);
    expect(pruefe(undefined)).toBe(true);
  });

  it('lehnt einen doppelten Bereich ab', () => {
    expect(pruefe([{ art: 'zutritt' }, { art: 'zutritt' }])).toBe('Jeder Bereich darf nur einmal vorkommen.');
  });

  it('meldet zwei neue Zeilen ohne Auswahl nicht als Doppel', () => {
    expect(pruefe([{}, { art: undefined }])).toBe(true);
    expect(pruefe([{ art: 'zutritt' }, {}])).toBe(true);
  });
});
