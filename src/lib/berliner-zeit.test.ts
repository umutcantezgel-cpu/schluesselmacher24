import { afterEach, describe, expect, it, vi } from 'vitest';

import { heuteInBerlin, jahrInBerlin } from './berliner-zeit';

afterEach(() => {
  vi.useRealTimers();
});

describe('Tag und Jahr in deutscher Zeit', () => {
  it('Silvester 23:30 UTC ist in Berlin schon Neujahr', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-31T23:30:00Z'));
    expect(heuteInBerlin()).toBe('2027-01-01');
    expect(jahrInBerlin()).toBe(2027);
    // Die Uhr des Servers (UTC) stünde noch auf dem alten Jahr.
    expect(new Date().getUTCFullYear()).toBe(2026);
  });

  it('Sommerzeit: 22:30 UTC ist 00:30 Uhr am nächsten Tag', () => {
    expect(heuteInBerlin(new Date('2027-07-14T22:30:00Z'))).toBe('2027-07-15');
    expect(heuteInBerlin(new Date('2027-07-14T21:59:00Z'))).toBe('2027-07-14');
  });

  it('Winterzeit: 22:59 UTC ist noch derselbe Tag', () => {
    expect(heuteInBerlin(new Date('2027-01-14T22:59:00Z'))).toBe('2027-01-14');
    expect(jahrInBerlin(new Date('2027-12-31T22:59:59Z'))).toBe(2027);
    expect(jahrInBerlin(new Date('2027-12-31T23:00:00Z'))).toBe(2028);
  });
});
