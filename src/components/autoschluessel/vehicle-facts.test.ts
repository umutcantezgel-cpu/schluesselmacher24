import { describe, expect, it } from 'vitest';
import type { VehicleModel } from '@/lib/types';
import { formatModelYears, hatBaujahre } from './vehicle-facts';

type Baujahre = Pick<VehicleModel, 'yearFrom' | 'yearTo'>;

describe('Baujahre', () => {
  it('nennt „nicht erfasst“ statt eines Platzhalters, wenn yearFrom fehlt', () => {
    const ohne = { yearFrom: undefined, yearTo: undefined } as unknown as Baujahre;
    expect(formatModelYears(ohne)).toBe('nicht erfasst');
    expect(hatBaujahre(ohne)).toBe(false);
  });

  it('ignoriert ein yearTo ohne yearFrom und bleibt bei „nicht erfasst“', () => {
    const nurEnde = { yearFrom: undefined, yearTo: 2010 } as unknown as Baujahre;
    expect(formatModelYears(nurEnde)).toBe('nicht erfasst');
    expect(hatBaujahre(nurEnde)).toBe(false);
  });

  it('zeigt „ab“ bei offenem Ende', () => {
    const offen = { yearFrom: 2003, yearTo: undefined } as unknown as Baujahre;
    expect(formatModelYears(offen)).toBe('ab 2003');
    expect(hatBaujahre(offen)).toBe(true);
  });

  it('zeigt den Zeitraum, wenn yearFrom und yearTo erfasst sind', () => {
    const zeitraum = { yearFrom: 2003, yearTo: 2010 };
    expect(formatModelYears(zeitraum)).toBe('2003–2010');
    expect(hatBaujahre(zeitraum)).toBe(true);
  });

  it('enthält nie einen Platzhalter-Text', () => {
    const ohne = { yearFrom: undefined, yearTo: undefined } as unknown as Baujahre;
    expect(formatModelYears(ohne)).not.toContain('Platzhalter');
  });
});
