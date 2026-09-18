import { describe, it, expect } from 'vitest';
import { formatCents } from './format';

describe('formatCents', () => {
  // Helper function to normalize non-breaking spaces (char code 160) to standard spaces (char code 32)
  const normalizeSpaces = (str: string) => str.replace(/\u00A0/g, ' ');

  it('formats positive cents correctly', () => {
    expect(normalizeSpaces(formatCents(6990))).toBe('69,90 €');
    expect(normalizeSpaces(formatCents(100))).toBe('1,00 €');
    expect(normalizeSpaces(formatCents(5))).toBe('0,05 €');
    expect(normalizeSpaces(formatCents(123456789))).toBe('1.234.567,89 €');
  });

  it('formats zero cents correctly', () => {
    expect(normalizeSpaces(formatCents(0))).toBe('0,00 €');
  });

  it('formats negative cents correctly', () => {
    expect(normalizeSpaces(formatCents(-6990))).toBe('-69,90 €');
    expect(normalizeSpaces(formatCents(-5))).toBe('-0,05 €');
  });

  it('handles decimal inputs gracefully (though technically should be ints)', () => {
    expect(normalizeSpaces(formatCents(6990.5))).toBe('69,91 €'); // rounded depending on Intl format rules
    expect(normalizeSpaces(formatCents(6990.1))).toBe('69,90 €');
  });
});
