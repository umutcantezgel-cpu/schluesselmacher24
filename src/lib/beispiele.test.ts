import { describe, expect, it } from 'vitest';

import { beispieleSichtbar, istBeispiel, oeffentlicheEintraege, ohneBeispiele } from './beispiele';

const echt = { id: 'echt', example: false };
const ohneFeld: { id: string; example?: boolean } = { id: 'ohne-feld' };
const beispiel = { id: 'beispiel', example: true };

describe('Beispiel-Einträge (A-046)', () => {
  it('sind nur mit SM24_BEISPIELE genau „1“ sichtbar', () => {
    expect(beispieleSichtbar({ SM24_BEISPIELE: '1' })).toBe(true);
    for (const wert of [undefined, '', '0', 'true', 'ja', ' 1', '1 ']) {
      expect(beispieleSichtbar({ SM24_BEISPIELE: wert }), String(wert)).toBe(false);
    }
  });

  it('erkennt Beispiele nur am Haken', () => {
    expect(istBeispiel(beispiel)).toBe(true);
    expect(istBeispiel(echt)).toBe(false);
    expect(istBeispiel(ohneFeld)).toBe(false);
    expect(istBeispiel({ example: null })).toBe(false);
  });

  it('nimmt Beispiele aus der öffentlichen Sicht, Reihenfolge bleibt', () => {
    const alle = [beispiel, echt, ohneFeld];
    expect(ohneBeispiele(alle)).toEqual([echt, ohneFeld]);
    expect(oeffentlicheEintraege(alle, {})).toEqual([echt, ohneFeld]);
    expect(oeffentlicheEintraege(alle, { SM24_BEISPIELE: '1' })).toEqual(alle);
    // Die Eingabe bleibt unverändert.
    expect(alle).toHaveLength(3);
  });
});
