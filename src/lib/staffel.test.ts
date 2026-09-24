import { describe, expect, it } from 'vitest';

import codeLines from '../../content/code-lines.json';
import { rabattAusPreis, staffelPreis } from './staffel';

describe('Mengenstaffeln in Prozent', () => {
  it('ergeben für alle bisherigen Codelinien exakt die alten Staffelpreise', () => {
    let geprueft = 0;
    for (const line of codeLines) {
      for (const tier of line.bulkPrices ?? []) {
        const rabatt = rabattAusPreis(line.priceCents, tier.priceCents);
        expect(staffelPreis(line.priceCents, rabatt), `${line.id} ab ${tier.minQty}`).toBe(tier.priceCents);
        expect(rabatt).toBeGreaterThan(0);
        expect(rabatt).toBeLessThan(100);
        geprueft += 1;
      }
    }
    expect(geprueft).toBeGreaterThan(0);
  });

  it('folgt einem geänderten Grundpreis', () => {
    expect(staffelPreis(800, 10)).toBe(720);
    expect(staffelPreis(1000, 10)).toBe(900);
    expect(staffelPreis(999, 12.5)).toBe(874);
  });
});
