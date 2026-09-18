import { describe, it, expect } from 'vitest';
import { cartTotals } from '../pricing';
import type { Cart, CartItem, ShippingOption } from '../types';

describe('cartTotals', () => {
  const dummyShippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      label: 'Standard',
      description: 'Standard shipping',
      priceCents: 490,
      tracked: false,
      insured: false,
      productClasses: [],
    },
    {
      id: 'express',
      label: 'Express',
      description: 'Express shipping',
      priceCents: 990,
      tracked: true,
      insured: true,
      productClasses: [],
    },
  ];

  const dummyItem1 = {
    kind: 'code-schluessel',
    uid: '1',
    codeLineId: 'line1',
    code: '123',
    qty: 1,
    unitPriceCents: 1500, // 15.00 EUR
    photoRefs: [],
  } as CartItem;

  const dummyItem2 = {
    kind: 'code-schluessel',
    uid: '2',
    codeLineId: 'line2',
    code: '456',
    qty: 2,
    unitPriceCents: 800, // 8.00 EUR
    photoRefs: [],
  } as CartItem;

  it('calculates totals for an empty cart', () => {
    const cart: Cart = { items: [] };
    const result = cartTotals(cart, dummyShippingOptions);

    expect(result).toEqual({
      itemsCents: 0,
      shippingCents: 0,
      totalCents: 0,
      vatCents: 0,
      vatRate: 0.19,
    });
  });

  it('calculates totals for a cart with items but no shipping option', () => {
    const cart: Cart = { items: [dummyItem1, dummyItem2] };
    const result = cartTotals(cart, dummyShippingOptions);

    // items: 1 * 1500 + 2 * 800 = 3100
    // shipping: 0
    // total: 3100
    // vat: 3100 - (3100 / 1.19) = 3100 - 2605.04 = 494.96 -> 495
    expect(result).toEqual({
      itemsCents: 3100,
      shippingCents: 0,
      totalCents: 3100,
      vatCents: 495,
      vatRate: 0.19,
    });
  });

  it('calculates totals for a cart with items and a shipping option', () => {
    const cart: Cart = {
      items: [dummyItem1, dummyItem2],
      shippingOptionId: 'express',
    };
    const result = cartTotals(cart, dummyShippingOptions);

    // items: 3100
    // shipping: 990
    // total: 4090
    // vat: 4090 - (4090 / 1.19) = 4090 - 3436.97 = 653.03 -> 653
    expect(result).toEqual({
      itemsCents: 3100,
      shippingCents: 990,
      totalCents: 4090,
      vatCents: 653,
      vatRate: 0.19,
    });
  });

  it('calculates totals correctly when shipping option is not found', () => {
    const cart: Cart = {
      items: [dummyItem1],
      shippingOptionId: 'invalid-id',
    };
    const result = cartTotals(cart, dummyShippingOptions);

    // items: 1500
    // shipping: 0 (not found)
    // total: 1500
    // vat: 1500 - (1500 / 1.19) = 1500 - 1260.504... = 239.495... -> 239
    expect(result).toEqual({
      itemsCents: 1500,
      shippingCents: 0,
      totalCents: 1500,
      vatCents: 239,
      vatRate: 0.19,
    });
  });

  it('rounds VAT correctly', () => {
    // 1000 total cents
    // vat: 1000 - 1000 / 1.19 = 1000 - 840.336... = 159.663... -> 160
    const cart: Cart = {
      items: [
        { ...dummyItem1, unitPriceCents: 500, qty: 1 },
        { ...dummyItem2, unitPriceCents: 500, qty: 1 },
      ],
    };
    const result = cartTotals(cart, dummyShippingOptions);
    expect(result.vatCents).toBe(160);

    // Let's try a case rounding down
    // total: 1100 cents
    // vat: 1100 - 1100 / 1.19 = 1100 - 924.369... = 175.630... -> 176
    const cart2: Cart = {
      items: [{ ...dummyItem1, unitPriceCents: 1100, qty: 1 }],
    };
    const result2 = cartTotals(cart2, dummyShippingOptions);
    expect(result2.vatCents).toBe(176);
  });
});
