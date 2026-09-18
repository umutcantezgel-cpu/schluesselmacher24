import { unitPriceForCodeLine } from './pricing';
import type { CodeLine } from './types';

describe('unitPriceForCodeLine', () => {
  it('returns the base price if bulkPrices is not defined', () => {
    const line = { priceCents: 1000 } as CodeLine;
    expect(unitPriceForCodeLine(line, 1)).toBe(1000);
    expect(unitPriceForCodeLine(line, 5)).toBe(1000);
  });

  it('returns the base price if bulkPrices is an empty array', () => {
    const line = { priceCents: 1000, bulkPrices: [] } as CodeLine;
    expect(unitPriceForCodeLine(line, 1)).toBe(1000);
    expect(unitPriceForCodeLine(line, 5)).toBe(1000);
  });

  it('returns the base price if qty is less than all minQty in bulkPrices', () => {
    const line = {
      priceCents: 1000,
      bulkPrices: [{ minQty: 5, priceCents: 900 }],
    } as CodeLine;
    expect(unitPriceForCodeLine(line, 1)).toBe(1000);
    expect(unitPriceForCodeLine(line, 4)).toBe(1000);
  });

  it('returns the tier price if qty exactly matches a minQty', () => {
    const line = {
      priceCents: 1000,
      bulkPrices: [{ minQty: 5, priceCents: 900 }],
    } as CodeLine;
    expect(unitPriceForCodeLine(line, 5)).toBe(900);
  });

  it('returns the matching lower tier price if qty is between tiers', () => {
    const line = {
      priceCents: 1000,
      bulkPrices: [
        { minQty: 5, priceCents: 900 },
        { minQty: 10, priceCents: 800 },
      ],
    } as CodeLine;
    expect(unitPriceForCodeLine(line, 7)).toBe(900);
    expect(unitPriceForCodeLine(line, 9)).toBe(900);
  });

  it('picks the correct tier even if bulkPrices are unsorted', () => {
    const line = {
      priceCents: 1000,
      bulkPrices: [
        { minQty: 10, priceCents: 800 },
        { minQty: 5, priceCents: 900 },
        { minQty: 20, priceCents: 700 },
      ],
    } as CodeLine;
    // Less than 5 -> base price
    expect(unitPriceForCodeLine(line, 3)).toBe(1000);
    // 5 to 9 -> 900
    expect(unitPriceForCodeLine(line, 5)).toBe(900);
    expect(unitPriceForCodeLine(line, 9)).toBe(900);
    // 10 to 19 -> 800
    expect(unitPriceForCodeLine(line, 10)).toBe(800);
    expect(unitPriceForCodeLine(line, 15)).toBe(800);
    // >= 20 -> 700
    expect(unitPriceForCodeLine(line, 20)).toBe(700);
    expect(unitPriceForCodeLine(line, 50)).toBe(700);
  });
});
