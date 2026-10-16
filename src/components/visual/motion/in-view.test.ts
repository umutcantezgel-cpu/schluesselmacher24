import { describe, expect, it } from 'vitest';
import { istSichtbarGenug } from './in-view';

const eintrag = (sichtbar: number, gesamt: number, bildschirm = 900) => ({
  isIntersecting: sichtbar > 0,
  intersectionRatio: sichtbar / gesamt,
  intersectionRect: { height: sichtbar } as DOMRectReadOnly,
  rootBounds: { height: bildschirm } as DOMRectReadOnly,
});

describe('istSichtbarGenug', () => {
  it('startet kurze Bereiche ab einem Viertel ihrer Höhe', () => {
    expect(istSichtbarGenug(eintrag(99, 400), 0.25)).toBe(false);
    expect(istSichtbarGenug(eintrag(100, 400), 0.25)).toBe(true);
  });

  it('startet sehr hohe Bereiche, sobald sie ein Viertel des Bildschirms füllen', () => {
    // 6500 px hoch: Anteil bleibt unter 25 %, der sichtbare Teil füllt aber den Bildschirm
    expect(istSichtbarGenug(eintrag(224, 6500), 0.25)).toBe(false);
    expect(istSichtbarGenug(eintrag(225, 6500), 0.25)).toBe(true);
    expect(istSichtbarGenug(eintrag(900, 6500), 0.25)).toBe(true);
  });

  it('startet nichts, was nicht im Bild ist', () => {
    expect(istSichtbarGenug(eintrag(0, 400), 0)).toBe(false);
    expect(istSichtbarGenug({ ...eintrag(300, 6500), rootBounds: null }, 0.25)).toBe(false);
  });
});
