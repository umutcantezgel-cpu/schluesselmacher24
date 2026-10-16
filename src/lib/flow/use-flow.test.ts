import { describe, expect, it } from 'vitest';

import { zeigtGeladenenStand } from './use-flow';

describe('zeigtGeladenenStand', () => {
  it('meldet einen gespeicherten Stand vor der ersten eigenen Eingabe', () => {
    expect(zeigtGeladenenStand(true, false, false)).toBe(true);
  });

  it('meldet nichts, wenn die Anzeige aus eigener Eingabe stammt', () => {
    // Nach der ersten Eingabe steht der Stand im Speicher, ist aber kein geladener.
    expect(zeigtGeladenenStand(true, true, false)).toBe(false);
  });

  it('meldet nichts ohne gespeicherten Stand oder nach dem Schließen des Hinweises', () => {
    expect(zeigtGeladenenStand(false, false, false)).toBe(false);
    expect(zeigtGeladenenStand(false, true, false)).toBe(false);
    expect(zeigtGeladenenStand(true, false, true)).toBe(false);
  });
});
