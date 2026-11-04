import { describe, expect, it } from 'vitest';

import type { BusinessRecord } from '../types';
import { NEU_BUCHEN_PFAD, folgeterminErlaubt, neuBuchenHref, vorherAusAdresse } from './neu-buchen';

const termin = (payload: Record<string, unknown> = {}) => ({ kind: 'termin' as const, reference: 'SM24-T-2026-0042', payload });

describe('Termin neu buchen (E-120)', () => {
  it('belegt den Assistenten mit Fahrzeug, vorhandenen Schlüsseln und der alten Nummer vor', () => {
    expect(neuBuchenHref(termin({ makeSlug: 'volkswagen', modelSlug: 'golf', workingKeys: 1 }))).toBe(
      `${NEU_BUCHEN_PFAD}?marke=volkswagen&modell=golf&vorhanden=1&vorher=SM24-T-2026-0042`,
    );
  });

  it('lässt unpassende Werte weg und nimmt das Modell nur mit der Marke', () => {
    expect(neuBuchenHref(termin({ makeSlug: 'Volks Wagen', modelSlug: 'golf', workingKeys: 12 }))).toBe(
      `${NEU_BUCHEN_PFAD}?vorher=SM24-T-2026-0042`,
    );
    expect(neuBuchenHref(termin({ makeSlug: 'bmw', modelSlug: null, workingKeys: 0 }))).toBe(
      `${NEU_BUCHEN_PFAD}?marke=bmw&vorhanden=0&vorher=SM24-T-2026-0042`,
    );
    expect(neuBuchenHref({ kind: 'bestellung', reference: 'SM24-B-2026-0001', payload: {} })).toBe(NEU_BUCHEN_PFAD);
  });

  it('liest die alte Nummer nur in der Form einer Vorgangsnummer', () => {
    expect(vorherAusAdresse(' sm24-t-2026-0042 ')).toBe('SM24-T-2026-0042');
    expect(vorherAusAdresse('SM24-T-2026-0042x')).toBeUndefined();
    expect(vorherAusAdresse('<script>')).toBeUndefined();
    expect(vorherAusAdresse(undefined)).toBeUndefined();
  });

  it('erlaubt den Verweis nur auf einen stornierten Termin derselben E-Mail-Adresse', () => {
    const alt = { kind: 'termin', status: 'storniert', contact: { email: 'Erika.Test@example.invalid' } } as Pick<BusinessRecord, 'kind' | 'status' | 'contact'>;
    expect(folgeterminErlaubt(alt, 'erika.test@example.invalid ')).toBe(true);
    expect(folgeterminErlaubt({ ...alt, status: 'neu' }, 'erika.test@example.invalid')).toBe(false);
    expect(folgeterminErlaubt({ ...alt, kind: 'anfrage' }, 'erika.test@example.invalid')).toBe(false);
    expect(folgeterminErlaubt(alt, 'andere@example.invalid')).toBe(false);
    expect(folgeterminErlaubt(null, 'erika.test@example.invalid')).toBe(false);
  });
});
