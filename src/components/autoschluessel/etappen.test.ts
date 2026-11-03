import { describe, expect, it } from 'vitest';

import { etappenAus } from '@/components/flow/flow-shell';
import { defaults } from '@/lib/data/defaults';

import { ETAPPEN } from './etappen';

describe('Etappen des Assistenten (A-025)', () => {
  it('heißen wie die Schritte von „So läuft Ihr Auftrag ab“ der Rubrik Autoschlüssel', () => {
    const auto = defaults.rubriken().find((r) => r.id === 'autoschluessel')!;
    expect(Object.values(ETAPPEN)).toEqual(auto.ablauf.map((s) => s.titel));
  });

  it('fasst aufeinanderfolgende Schritte zusammen und kennt Abläufe ohne Etappen', () => {
    expect(etappenAus([{ etappe: 'A' }, { etappe: 'A' }, { etappe: 'B' }])).toEqual([
      { name: 'A', von: 0, bis: 1 },
      { name: 'B', von: 2, bis: 2 },
    ]);
    expect(etappenAus([{}, {}])).toEqual([]);
  });
});
