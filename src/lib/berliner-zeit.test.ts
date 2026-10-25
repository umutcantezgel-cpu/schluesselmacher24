import { afterEach, describe, expect, it, vi } from 'vitest';

import { heuteInBerlin, jahrInBerlin, zeitpunktInBerlin } from './berliner-zeit';

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

describe('zeitpunktInBerlin', () => {
  it('rechnet Winter- und Sommerzeit nach dem Tag des Termins um', () => {
    expect(zeitpunktInBerlin('2026-10-27', '10:00').toISOString()).toBe('2026-10-27T09:00:00.000Z');
    expect(zeitpunktInBerlin('2026-07-01', '10:00').toISOString()).toBe('2026-07-01T08:00:00.000Z');
    expect(zeitpunktInBerlin('2027-01-01', '00:30').toISOString()).toBe('2026-12-31T23:30:00.000Z');
  });

  it('trifft die Tage der Zeitumstellung', () => {
    // 25.10.2026: um 3 Uhr Sommerzeit zurück auf 2 Uhr Winterzeit.
    expect(zeitpunktInBerlin('2026-10-25', '09:00').toISOString()).toBe('2026-10-25T08:00:00.000Z');
    // 28.03.2027: um 2 Uhr Winterzeit vor auf 3 Uhr Sommerzeit.
    expect(zeitpunktInBerlin('2027-03-28', '09:00').toISOString()).toBe('2027-03-28T07:00:00.000Z');
  });
});
