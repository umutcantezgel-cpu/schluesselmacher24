import { describe, expect, it } from 'vitest';

import { buildReference, counterKey, nextSequenceFromExisting, parseSequence } from './reference';

describe('counterKey', () => {
  it('trennt Zähler nach Art und Jahr', () => {
    expect(counterKey('bestellung', 2026)).toBe('B-2026');
    expect(counterKey('anfrage', 2026)).toBe('A-2026');
    expect(counterKey('termin', 2027)).toBe('T-2027');
    expect(counterKey('projekt', 2026)).toBe('P-2026');
  });
});

describe('parseSequence', () => {
  it('liest die laufende Nummer passender Vorgangsnummern', () => {
    expect(parseSequence('SM24-B-2026-0042', 'bestellung', 2026)).toBe(42);
    expect(parseSequence(buildReference('termin', 2026, 12345), 'termin', 2026)).toBe(12345);
  });

  it('ignoriert andere Arten, Jahre und fremde Formate', () => {
    expect(parseSequence('SM24-B-2026-0042', 'anfrage', 2026)).toBeNull();
    expect(parseSequence('SM24-B-2025-0042', 'bestellung', 2026)).toBeNull();
    expect(parseSequence('SM24-2026-0007', 'bestellung', 2026)).toBeNull();
    expect(parseSequence('SM24-B-2026-00x2', 'bestellung', 2026)).toBeNull();
  });
});

describe('nextSequenceFromExisting', () => {
  it('beginnt je Art und Jahr bei 1', () => {
    expect(nextSequenceFromExisting([], 'bestellung', 2026)).toBe(1);
    expect(nextSequenceFromExisting(['SM24-A-2026-0003', 'SM24-B-2025-0009'], 'bestellung', 2026)).toBe(1);
  });

  it('zählt ab der höchsten vorhandenen Nummer weiter, auch wenn dazwischen etwas fehlt', () => {
    const vorhanden = ['SM24-B-2026-0001', 'SM24-B-2026-0004', 'SM24-A-2026-0010'];
    expect(nextSequenceFromExisting(vorhanden, 'bestellung', 2026)).toBe(5);
    expect(nextSequenceFromExisting(vorhanden, 'anfrage', 2026)).toBe(11);
  });
});
