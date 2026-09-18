import { describe, it, expect } from 'vitest';
import { availableShipping } from '../pricing';
import type { CartItem, ShippingOption } from '../types';

describe('availableShipping', () => {
  const options: ShippingOption[] = [
    {
      id: 'versand-code',
      label: 'Post',
      description: 'Briefversand',
      priceCents: 290,
      tracked: false,
      insured: false,
      productClasses: ['code-schluessel'],
    },
    {
      id: 'versand-paket',
      label: 'DHL Paket',
      description: 'Paketversand',
      priceCents: 590,
      tracked: true,
      insured: true,
      productClasses: ['code-schluessel', 'zylinder', 'zubehoer'],
    },
    {
      id: 'versand-zylinder',
      label: 'Spezialversand Zylinder',
      description: 'Paketversand für Zylinder',
      priceCents: 890,
      tracked: true,
      insured: true,
      productClasses: ['zylinder'],
    },
  ];

  it('returns all options for an empty cart', () => {
    // Wenn der Warenkorb leer ist, gibt es keine productClasses.
    // .every() auf ein leeres Set gibt true zurück, also alle Optionen bleiben.
    // Das ist das aktuelle Verhalten von availableShipping
    const result = availableShipping([], options);
    expect(result).toHaveLength(options.length);
    expect(result).toEqual(options);
  });

  it('filters options for code-schluessel only', () => {
    const items: CartItem[] = [
      {
        kind: 'code-schluessel',
        uid: '1',
        codeLineId: 'line1',
        code: '123',
        qty: 1,
        unitPriceCents: 1000,
        photoRefs: [],
      },
    ];

    const result = availableShipping(items, options);
    expect(result).toHaveLength(2);
    expect(result.map(o => o.id)).toEqual(['versand-code', 'versand-paket']);
  });

  it('filters options for zylinder only', () => {
    const items: CartItem[] = [
      {
        kind: 'zylinder-schliessung',
        uid: '2',
        draft: { items: [], keyCount: 3, extraIds: [], expandable: false },
        unitPriceCents: 5000,
        qty: 1,
      },
    ];

    const result = availableShipping(items, options);
    expect(result).toHaveLength(2);
    expect(result.map(o => o.id)).toEqual(['versand-paket', 'versand-zylinder']);
  });

  it('filters options for mixed cart (code-schluessel and zylinder)', () => {
    const items: CartItem[] = [
      {
        kind: 'code-schluessel',
        uid: '1',
        codeLineId: 'line1',
        code: '123',
        qty: 1,
        unitPriceCents: 1000,
        photoRefs: [],
      },
      {
        kind: 'zylinder-schliessung',
        uid: '2',
        draft: { items: [], keyCount: 3, extraIds: [], expandable: false },
        unitPriceCents: 5000,
        qty: 1,
      },
    ];

    const result = availableShipping(items, options);
    // Nur das DHL Paket unterstützt sowohl code-schluessel als auch zylinder
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('versand-paket');
  });

  it('returns empty array if no shipping option supports all classes', () => {
    const items: CartItem[] = [
      {
        kind: 'code-schluessel',
        uid: '1',
        codeLineId: 'line1',
        code: '123',
        qty: 1,
        unitPriceCents: 1000,
        photoRefs: [],
      },
      {
        kind: 'zylinder-schliessung',
        uid: '2',
        draft: { items: [], keyCount: 3, extraIds: [], expandable: false },
        unitPriceCents: 5000,
        qty: 1,
      },
    ];

    const limitedOptions: ShippingOption[] = [
      {
        id: 'versand-code',
        label: 'Post',
        description: 'Briefversand',
        priceCents: 290,
        tracked: false,
        insured: false,
        productClasses: ['code-schluessel'],
      },
      {
        id: 'versand-zylinder',
        label: 'Spezialversand Zylinder',
        description: 'Paketversand für Zylinder',
        priceCents: 890,
        tracked: true,
        insured: true,
        productClasses: ['zylinder'],
      },
    ];

    const result = availableShipping(items, limitedOptions);
    expect(result).toHaveLength(0);
  });
});
