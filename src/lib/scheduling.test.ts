import { earliestBookableDate } from './scheduling';

describe('scheduling', () => {
  describe('earliestBookableDate', () => {
    it('should add the correct number of lead time days to today', () => {
      const today = '2023-10-15';
      const leadTimeDays = 3;
      const expected = '2023-10-18';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });

    it('should handle zero lead time days', () => {
      const today = '2023-10-15';
      const leadTimeDays = 0;
      const expected = '2023-10-15';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });

    it('should handle negative lead time days', () => {
      const today = '2023-10-15';
      const leadTimeDays = -2;
      const expected = '2023-10-13';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });

    it('should correctly cross month boundaries', () => {
      const today = '2023-10-30';
      const leadTimeDays = 3;
      const expected = '2023-11-02';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });

    it('should correctly cross year boundaries', () => {
      const today = '2023-12-30';
      const leadTimeDays = 3;
      const expected = '2024-01-02';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });

    it('should correctly handle leap years', () => {
      const today = '2024-02-28'; // 2024 is a leap year
      const leadTimeDays = 2;
      const expected = '2024-03-01';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });

    it('should correctly handle non-leap years', () => {
      const today = '2023-02-28'; // 2023 is not a leap year
      const leadTimeDays = 2;
      const expected = '2023-03-02';
      expect(earliestBookableDate(today, leadTimeDays)).toBe(expected);
    });
  });
});
