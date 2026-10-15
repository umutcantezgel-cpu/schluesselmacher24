import { describe, expect, it } from 'vitest';

import { bahnPunkte, bahnSchluesselbilder } from './fraesbahn-bewegung';

describe('bahnPunkte', () => {
  it('liest Punktpaare und überspringt Unsinn', () => {
    expect(bahnPunkte('140,153 178.5,160 x,1 200,153')).toEqual([
      [140, 153],
      [178.5, 160],
      [200, 153],
    ]);
    expect(bahnPunkte('')).toEqual([]);
    expect(bahnPunkte(null)).toEqual([]);
  });
});

describe('bahnSchluesselbilder', () => {
  it('endet in der Ruhelage und beginnt am ersten Punkt', () => {
    const bilder = bahnSchluesselbilder([
      [0, 0],
      [30, 40],
      [60, 0],
    ]);
    expect(bilder[0]).toEqual({ transform: 'translate(-60px, 0px)', offset: 0 });
    expect(bilder.at(-1)).toEqual({ transform: 'translate(0px, 0px)', offset: 1 });
  });

  it('verteilt die Versätze nach zurückgelegter Strecke', () => {
    const bilder = bahnSchluesselbilder([
      [0, 0],
      [10, 0],
      [40, 0],
    ]);
    expect(bilder.map((b) => b.offset)).toEqual([0, 0.25, 1]);
  });

  it('liefert für weniger als zwei Punkte keine Bewegung', () => {
    expect(bahnSchluesselbilder([[1, 2]])).toEqual([]);
    expect(bahnSchluesselbilder([])).toEqual([]);
  });
});
