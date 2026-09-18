import { describe, it, expect } from 'vitest';
import { buildReference, buildRecordId } from './reference';

describe('reference utilities', () => {
  describe('buildReference', () => {
    it('builds a reference for bestellung', () => {
      expect(buildReference('bestellung', 2026, 42)).toBe('SM24-B-2026-0042');
    });

    it('builds a reference for anfrage', () => {
      expect(buildReference('anfrage', 2024, 1)).toBe('SM24-A-2024-0001');
    });

    it('builds a reference for termin', () => {
      expect(buildReference('termin', 2025, 999)).toBe('SM24-T-2025-0999');
    });

    it('builds a reference for projekt', () => {
      expect(buildReference('projekt', 2023, 10000)).toBe('SM24-P-2023-10000');
    });

    it('pads sequence numbers with leading zeros to 4 digits', () => {
      expect(buildReference('bestellung', 2026, 5)).toBe('SM24-B-2026-0005');
      expect(buildReference('bestellung', 2026, 50)).toBe('SM24-B-2026-0050');
      expect(buildReference('bestellung', 2026, 500)).toBe('SM24-B-2026-0500');
      expect(buildReference('bestellung', 2026, 5000)).toBe('SM24-B-2026-5000');
    });
  });

  describe('buildRecordId', () => {
    it('converts a reference to a lowercased URL-safe ID', () => {
      expect(buildRecordId('SM24-B-2026-0042')).toBe('sm24-b-2026-0042');
    });

    it('replaces non-alphanumeric characters with hyphens', () => {
      expect(buildRecordId('My Awesome Reference 123!')).toBe('my-awesome-reference-123-');
    });

    it('handles multiple consecutive non-alphanumeric characters correctly', () => {
      expect(buildRecordId('A_B--C  D')).toBe('a-b-c-d');
    });
  });
});
