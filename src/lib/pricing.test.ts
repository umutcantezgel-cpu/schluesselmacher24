import { describe, it, expect } from 'vitest';
import { unitPriceForCodeLine } from './pricing';
import type { CodeLine } from './types';

describe('unitPriceForCodeLine', () => {
  const createCodeLine = (overrides: Partial<CodeLine> = {}): CodeLine => {
    return {
      id: 'test-id',
      slug: 'test-slug',
      name: 'Test Code Line',
      manufacturer: 'Test Mfg',
      application: 'Test App',
      keyType: 'Test Type',
      description: 'Test Desc',
      codeFormatLabel: 'Test Format',
      codePattern: 'Test Pattern',
      codeExample: 'Test Example',
      codeHint: 'Test Hint',
      codeLocationImage: { url: 'test', alt: 'test', width: 1, height: 1 },
      productImage: { url: 'test', alt: 'test', width: 1, height: 1 },
      priceCents: 1000,
      ...overrides,
    };
  };

  it('returns the base price if bulkPrices is undefined', () => {
    const line = createCodeLine({ bulkPrices: undefined });
    expect(unitPriceForCodeLine(line, 5)).toBe(1000);
  });

  it('returns the base price if bulkPrices is an empty array', () => {
    const line = createCodeLine({ bulkPrices: [] });
    expect(unitPriceForCodeLine(line, 5)).toBe(1000);
  });

  it('returns the base price if requested quantity is lower than any tier minimum', () => {
    const line = createCodeLine({
      bulkPrices: [{ minQty: 10, priceCents: 800 }],
    });
    expect(unitPriceForCodeLine(line, 5)).toBe(1000);
  });

  it('returns the correct bulk price if quantity matches or exceeds a tier minimum', () => {
    const line = createCodeLine({
      bulkPrices: [
        { minQty: 5, priceCents: 900 },
        { minQty: 10, priceCents: 800 },
      ],
    });

    // Exactly at tier minimum
    expect(unitPriceForCodeLine(line, 5)).toBe(900);
    // Between tiers
    expect(unitPriceForCodeLine(line, 7)).toBe(900);
    // Exceeding highest tier
    expect(unitPriceForCodeLine(line, 15)).toBe(800);
  });

  it('correctly picks the highest applicable tier even if bulkPrices are unsorted', () => {
    const line = createCodeLine({
      bulkPrices: [
        { minQty: 5, priceCents: 900 },
        { minQty: 20, priceCents: 700 },
        { minQty: 10, priceCents: 800 },
      ],
    });

    // The sorting logic inside the function should handle this correctly
    expect(unitPriceForCodeLine(line, 12)).toBe(800);
    expect(unitPriceForCodeLine(line, 25)).toBe(700);
    expect(unitPriceForCodeLine(line, 7)).toBe(900);
  });
});
