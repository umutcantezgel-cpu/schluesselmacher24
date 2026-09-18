import { describe, it, expect } from 'vitest';
import { priceCylinderOrder } from '../pricing';
import type { CylinderCatalog, CylinderOrderDraft } from '../types';

describe('priceCylinderOrder', () => {
  const mockInfo = { title: 'Test Info', body: 'This is a test' };
  const mockImage = { motif: 'Test Motif', ratio: '1/1' as const };

  const catalog: CylinderCatalog = {
    forms: [
      {
        id: 'doppelzylinder',
        label: 'Doppelzylinder',
        description: 'Mock Doppelzylinder',
        measures: 'beide',
        measureLabels: { a: 'A', b: 'B' },
        info: mockInfo,
        figure: mockImage,
        minMm: 60,
        maxMm: 120,
        stepMm: 5,
        basePriceCents: 3000, // 30 EUR
        lengthSurchargeCents: 500, // 5 EUR
        baseLengthMm: 60,
        active: true,
      },
      {
        id: 'halbzylinder',
        label: 'Halbzylinder',
        description: 'Mock Halbzylinder',
        measures: 'eines',
        measureLabels: { a: 'A' },
        info: mockInfo,
        figure: mockImage,
        minMm: 30,
        maxMm: 60,
        stepMm: 5,
        basePriceCents: 2000, // 20 EUR
        lengthSurchargeCents: 300, // 3 EUR
        baseLengthMm: 30,
        active: true,
      }
    ],
    functions: [
      {
        id: 'not-und-gefahren',
        label: 'Not- und Gefahrenfunktion',
        description: 'Mock function',
        surchargeCents: 1000, // 10 EUR
        info: mockInfo,
        forms: ['doppelzylinder'],
        active: true,
      }
    ],
    extras: [
      {
        id: 'bohrschutz',
        label: 'Bohrschutz',
        description: 'Mock extra stueck',
        priceCents: 1500, // 15 EUR
        unit: 'stueck',
        info: mockInfo,
        active: true,
      },
      {
        id: 'sicherungskarte',
        label: 'Sicherungskarte',
        description: 'Mock extra einmal',
        priceCents: 2500, // 25 EUR
        unit: 'einmal',
        info: mockInfo,
        active: true,
      }
    ],
    keyPriceCents: 500, // 5 EUR
    includedKeys: 3,
    maxKeys: 10,
    maxCylinders: 10,
    measuringInfo: mockInfo,
    measuringFigure: mockImage,
  };

  it('calculates the base case correctly without surcharges', () => {
    const draft: CylinderOrderDraft = {
      items: [
        { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 }
      ],
      keyCount: 3,
      extraIds: [],
      expandable: false,
    };
    const result = priceCylinderOrder(draft, catalog);
    expect(result.cylindersCents).toBe(3000);
    expect(result.keysCents).toBe(0);
    expect(result.extrasCents).toBe(0);
    expect(result.totalCents).toBe(3000);
    expect(result.cylinderCount).toBe(1);
    expect(result.lines).toHaveLength(1);
  });

  it('calculates length surcharge correctly', () => {
    // 35+35 = 70mm -> 10mm over base 60mm -> 2 steps of 5mm -> 2 * 500 = 1000 cents
    const draft: CylinderOrderDraft = {
      items: [
        { uid: '1', form: 'doppelzylinder', measureAMm: 35, measureBMm: 35, qty: 1 }
      ],
      keyCount: 3,
      extraIds: [],
      expandable: false,
    };
    const result = priceCylinderOrder(draft, catalog);
    expect(result.cylindersCents).toBe(3000 + 1000); // 4000
    expect(result.totalCents).toBe(4000);
  });

  it('calculates function surcharge correctly', () => {
    const draft: CylinderOrderDraft = {
      items: [
        { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1, functionId: 'not-und-gefahren' }
      ],
      keyCount: 3,
      extraIds: [],
      expandable: false,
    };
    const result = priceCylinderOrder(draft, catalog);
    expect(result.cylindersCents).toBe(3000 + 1000); // base + function
    expect(result.totalCents).toBe(4000);
  });

  it('ignores function surcharge if not applicable to form', () => {
    const draft: CylinderOrderDraft = {
      items: [
        { uid: '1', form: 'halbzylinder', measureAMm: 30, qty: 1, functionId: 'not-und-gefahren' }
      ],
      keyCount: 3,
      extraIds: [],
      expandable: false,
    };
    const result = priceCylinderOrder(draft, catalog);
    // halbzylinder basePrice is 2000, function should not apply
    expect(result.cylindersCents).toBe(2000);
    expect(result.totalCents).toBe(2000);
  });

  it('calculates extra keys correctly', () => {
    const draft: CylinderOrderDraft = {
      items: [
        { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 }
      ],
      keyCount: 5, // 2 extra keys -> 2 * 500 = 1000
      extraIds: [],
      expandable: false,
    };
    const result = priceCylinderOrder(draft, catalog);
    expect(result.cylindersCents).toBe(3000);
    expect(result.keysCents).toBe(1000);
    expect(result.totalCents).toBe(4000);
  });

  it('calculates extras per piece and once correctly', () => {
    const draft: CylinderOrderDraft = {
      items: [
        { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 2 } // 2 cylinders
      ],
      keyCount: 3,
      extraIds: ['bohrschutz', 'sicherungskarte'],
      expandable: false,
    };
    const result = priceCylinderOrder(draft, catalog);
    // cylinders: 2 * 3000 = 6000
    // extras: bohrschutz (1500 * 2) + sicherungskarte (2500) = 3000 + 2500 = 5500
    expect(result.cylindersCents).toBe(6000);
    expect(result.extrasCents).toBe(5500);
    expect(result.totalCents).toBe(11500);
    expect(result.cylinderCount).toBe(2);
  });
});
