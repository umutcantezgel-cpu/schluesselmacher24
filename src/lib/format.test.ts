import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formats a valid ISO date string correctly', () => {
    expect(formatDate('2026-10-02')).toBe('Freitag, 2. Oktober 2026');
  });

  it('returns the original string if the date is invalid (NaN)', () => {
    expect(formatDate('invalid-date')).toBe('invalid-date');
    expect(formatDate('2026-15-40')).toBe('2026-15-40');
    expect(formatDate('')).toBe('');
  });

  it('handles leap years correctly', () => {
    expect(formatDate('2024-02-29')).toBe('Donnerstag, 29. Februar 2024');
  });

  it('handles empty strings and random inputs', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('null')).toBe('null');
    expect(formatDate('undefined')).toBe('undefined');
    expect(formatDate('abc')).toBe('abc');
  });
});
