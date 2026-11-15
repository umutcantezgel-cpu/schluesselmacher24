import { describe, expect, it } from 'vitest';

import { INITIAL, buildAnswerSummary, buildPayload, fragtZuwachs, validate, type ZutrittData } from './zutritt-konfigurator';

/** FA-17-18: Erweiterbarkeit im Zutrittskonfigurator. */
describe('Erweiterbarkeit im Zutrittskonfigurator', () => {
  const umfang: ZutrittData = { ...INITIAL, tueren: '2-5', nutzer: '6-20' };

  it('verlangt die Angabe zur späteren Erweiterung', () => {
    expect(validate(umfang, 'umfang')).toBe(false);
    expect(validate({ ...umfang, erweiterung: 'keine' }, 'umfang')).toBe(true);
  });

  it('führt Erweiterung und ungefähren Zuwachs in der Zusammenfassung', () => {
    const zeilen = buildAnswerSummary({ ...umfang, erweiterung: 'beides', erweiterungUmfang: 'etwa 5 Türen' })
      .find((s) => s.title === '2. Umfang')?.rows ?? [];
    expect(zeilen).toContainEqual({ label: 'Spätere Erweiterung', value: 'Ja, weitere Türen und Nutzer' });
    expect(zeilen).toContainEqual({ label: 'Ungefährer Zuwachs', value: 'etwa 5 Türen' });
  });

  it('lässt den Zuwachs weg, wenn keine Erweiterung vorgesehen ist', () => {
    const zeilen = buildAnswerSummary({ ...umfang, erweiterung: 'keine', erweiterungUmfang: 'alt' })
      .find((s) => s.title === '2. Umfang')?.rows ?? [];
    expect(zeilen.some((r) => r.label === 'Ungefährer Zuwachs')).toBe(false);
  });

  it('fragt bei „Noch nicht absehbar“ nicht nach dem Zuwachs und führt ihn nicht', () => {
    expect(fragtZuwachs('unklar')).toBe(false);
    expect(fragtZuwachs('keine')).toBe(false);
    expect(fragtZuwachs('')).toBe(false);
    expect(['tueren', 'nutzer', 'beides'].every(fragtZuwachs)).toBe(true);
    const zeilen = buildAnswerSummary({ ...umfang, erweiterung: 'unklar', erweiterungUmfang: 'alt' })
      .find((s) => s.title === '2. Umfang')?.rows ?? [];
    expect(zeilen.some((r) => r.label === 'Ungefährer Zuwachs')).toBe(false);
  });

  it('sendet den Zuwachs nur mit, wenn die Frage gestellt wurde', () => {
    expect(buildPayload({ ...umfang, erweiterung: 'keine', erweiterungUmfang: 'alt' }).erweiterungUmfang).toBe('');
    expect(buildPayload({ ...umfang, erweiterung: 'tueren', erweiterungUmfang: 'etwa 5' }).erweiterungUmfang).toBe('etwa 5');
  });
});
