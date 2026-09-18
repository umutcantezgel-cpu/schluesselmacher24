import { describe, it, expect } from 'vitest';
import { buildRecordId } from '@/lib/reference';

describe('buildRecordId', () => {
  it('should lowercase string and replace non-alphanumeric chars with hyphen', () => {
    expect(buildRecordId('My Reference 123')).toBe('my-reference-123');
  });

  it('should replace consecutive special characters with a single hyphen', () => {
    expect(buildRecordId('foo--bar___baz!!qux')).toBe('foo-bar-baz-qux');
  });

  it('should handle strings that are already valid IDs', () => {
    expect(buildRecordId('valid-id-1')).toBe('valid-id-1');
  });

  it('should handle empty strings', () => {
    expect(buildRecordId('')).toBe('');
  });

  it('should replace spaces at the beginning and end with a hyphen (per current implementation)', () => {
    // Current implementation doesn't trim, it just replaces regex matches
    expect(buildRecordId('  test  ')).toBe('-test-');
  });

  it('should handle german umlauts by replacing them with hyphens (current behavior)', () => {
    // Testing current behavior: [^a-z0-9]+ matches äöü
    expect(buildRecordId('Müller')).toBe('m-ller');
  });
});
