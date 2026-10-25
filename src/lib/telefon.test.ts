import { describe, expect, it } from 'vitest';

import { telefonE164, telefonLink } from './telefon';

describe('telefonE164', () => {
  it('wandelt deutsche Schreibweisen in E.164 um', () => {
    expect(telefonE164('06441 8056279')).toBe('+4964418056279');
    expect(telefonE164('06441/80 56 279')).toBe('+4964418056279');
    expect(telefonE164('(06441) 805-6279')).toBe('+4964418056279');
    expect(telefonE164('+49 (0) 6441 8056279')).toBe('+4964418056279');
    expect(telefonE164('0049 6441 8056279')).toBe('+4964418056279');
    expect(telefonE164('+43 1 234567')).toBe('+431234567');
  });

  it('gibt bei Platzhaltern und Unsinn null zurück', () => {
    expect(telefonE164('[Platzhalter: Telefonnummer]')).toBeNull();
    expect(telefonE164('')).toBeNull();
    expect(telefonE164(undefined)).toBeNull();
    expect(telefonE164('8056279')).toBeNull();
    expect(telefonE164('Tel. 06441 8056279')).toBeNull();
    expect(telefonE164('0644+18056279')).toBeNull();
    expect(telefonE164('012')).toBeNull();
  });
});

describe('telefonLink', () => {
  it('liefert den tel:-Link oder null', () => {
    expect(telefonLink('06441 8056279')).toBe('tel:+4964418056279');
    expect(telefonLink('[Platzhalter: Telefonnummer]')).toBeNull();
  });
});
