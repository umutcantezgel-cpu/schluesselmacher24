import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { dekodiere, kodiere, planZuEntwurf } from '@/lib/konfigurator';
import { priceCylinderOrder } from '@/lib/pricing';
import type { CylinderLineItem } from '@/lib/types';

import { istStartzustand, masseRueckfragen, planZuPositionen, positionenZuPlan } from './kern';

const KATALOG = defaults.cylinderCatalog();
const FORM = KATALOG.forms[0];

/* Erfundene Testdaten (G4): zwei Haustüren gleich, ein Keller anders. */
const POSITIONEN: CylinderLineItem[] = [
  { uid: 'position-1', form: FORM.id, measureAMm: 30, measureBMm: 35, qty: 2 },
  { uid: 'position-2', form: FORM.id, measureAMm: 30, measureBMm: 30, qty: 1 },
];

describe('Bestandskonfigurator auf dem Konfigurator-Kern (E5-OPUS-02)', () => {
  it('macht aus Positionen je Zylinder eine Tür und einen Schlüssel für alle Türen', () => {
    const plan = positionenZuPlan(POSITIONEN, 5);
    expect(plan.tueren.map((t) => t.bezeichnung)).toEqual(['Zylinder 1', 'Zylinder 2', 'Zylinder 3']);
    expect(plan.schluessel).toEqual([{ id: 's1', bezeichnung: 'Schlüssel', anzahl: 5 }]);
    expect(plan.berechtigungen.s1).toEqual(['t1', 't2', 't3']);
  });

  it('kommt über den Link des Planers verlustfrei zurück, mit Positionen und Schlüsselzahl', () => {
    const zurueck = planZuPositionen(dekodiere(kodiere(positionenZuPlan(POSITIONEN, 5)))!);
    expect(zurueck).toEqual({ items: POSITIONEN.map(({ functionId: _f, ...rest }) => (void _f, rest)), keyCount: 5 });
  });

  it('rechnet über den Kern denselben Preis wie der Bestand (G9)', () => {
    const plan = positionenZuPlan(POSITIONEN, 5);
    const kern = priceCylinderOrder(planZuEntwurf(plan), KATALOG);
    const bestand = priceCylinderOrder({ items: POSITIONEN, keyCount: 5, extraIds: [], expandable: false }, KATALOG);
    expect(kern.totalCents).toBe(bestand.totalCents);
    expect(kern.cylinderCount).toBe(3);
  });

  it('nimmt nur Gleichschließungen aus einem Link; ein Plan mit Ebenen gehört in den Planer', () => {
    const plan = positionenZuPlan(POSITIONEN, 5);
    const mitEbenen = { ...plan, schluessel: [...plan.schluessel, { id: 's2', bezeichnung: 'Kind', anzahl: 1 }], berechtigungen: { ...plan.berechtigungen, s2: ['t1'] } };
    expect(planZuPositionen(mitEbenen)).toBeNull();
  });

  it('meldet Rückfragen der Maßprüfung je Position, ohne etwas aufzuhalten', () => {
    expect(masseRueckfragen(POSITIONEN, KATALOG)).toEqual([]);
    const ungleich: CylinderLineItem[] = [{ uid: 'position-1', form: FORM.id, measureAMm: 30, measureBMm: 70, qty: 1 }];
    const rueckfragen = masseRueckfragen(ungleich, KATALOG);
    expect(rueckfragen).toHaveLength(1);
    expect(rueckfragen[0]).toContain('Tür 1');
  });

  it('erkennt den Startzustand unabhängig von den Kennungen', () => {
    const start = { items: [{ ...POSITIONEN[1], uid: 'position-1' }], keyCount: 3 };
    expect(istStartzustand([{ ...POSITIONEN[1], uid: 'position-7' }], 3, start)).toBe(true);
    expect(istStartzustand(POSITIONEN, 3, start)).toBe(false);
    expect(istStartzustand(start.items, 4, start)).toBe(false);
  });
});
