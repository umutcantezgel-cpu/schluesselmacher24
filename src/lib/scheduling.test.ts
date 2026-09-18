import { describe, it, expect } from 'vitest';
import { earliestBookableDate, addDays, toIsoDate, weekdayOf } from './scheduling';

describe('scheduling', () => {
  describe('toIsoDate', () => {
    it('formats dates correctly with zero padding', () => {
      expect(toIsoDate(new Date('2024-01-05T12:00:00Z'))).toBe('2024-01-05');
      expect(toIsoDate(new Date('2024-11-20T12:00:00Z'))).toBe('2024-11-20');
    });
  });

  describe('addDays', () => {
    it('adds days correctly without time zone issues', () => {
      expect(addDays('2024-01-01', 5)).toBe('2024-01-06');
    });
  });

  describe('weekdayOf', () => {
    it('returns 1 for Monday', () => {
      expect(weekdayOf('2024-01-01')).toBe(1); // 2024-01-01 is Monday
    });

    it('returns 7 for Sunday instead of 0', () => {
      expect(weekdayOf('2024-01-07')).toBe(7); // 2024-01-07 is Sunday
    });
  });

  describe('earliestBookableDate', () => {
    it('adds lead time days correctly', () => {
      expect(earliestBookableDate('2024-01-01', 2)).toBe('2024-01-03');
    });

    it('handles month transitions', () => {
      expect(earliestBookableDate('2024-01-31', 1)).toBe('2024-02-01');
      expect(earliestBookableDate('2024-04-30', 1)).toBe('2024-05-01');
    });

    it('handles year transitions', () => {
      expect(earliestBookableDate('2024-12-31', 1)).toBe('2025-01-01');
    });

    it('handles leap years correctly', () => {
      expect(earliestBookableDate('2024-02-28', 1)).toBe('2024-02-29');
      expect(earliestBookableDate('2024-02-28', 2)).toBe('2024-03-01');
      // Year 2000 was a leap year
      expect(earliestBookableDate('2000-02-28', 1)).toBe('2000-02-29');
    });

    it('handles non-leap years correctly', () => {
      expect(earliestBookableDate('2023-02-28', 1)).toBe('2023-03-01');
      // Year 2100 is not a leap year
      expect(earliestBookableDate('2100-02-28', 1)).toBe('2100-03-01');
    });

    it('handles negative lead times', () => {
      expect(earliestBookableDate('2024-01-05', -2)).toBe('2024-01-03');
    });

    it('handles 0 lead time', () => {
      expect(earliestBookableDate('2024-01-01', 0)).toBe('2024-01-01');
    });

    it('handles large day additions', () => {
      expect(earliestBookableDate('2024-01-01', 365)).toBe('2024-12-31'); // 2024 is leap year, 366 days
      expect(earliestBookableDate('2023-01-01', 365)).toBe('2024-01-01'); // 2023 is not leap year
    });
  });
});
