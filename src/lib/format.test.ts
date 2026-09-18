import { describe, expect, it } from 'vitest';
import {
  formatCents,
  formatNumber,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatDuration,
  formatMillimeter,
  formatWeekday,
  formatFileSize,
} from './format';

describe('format utilities', () => {
  describe('formatCents', () => {
    it('formats positive amounts correctly', () => {
      expect(formatCents(6990)).toBe('69,90\u00A0€');
      expect(formatCents(100)).toBe('1,00\u00A0€');
      expect(formatCents(50)).toBe('0,50\u00A0€');
      expect(formatCents(9)).toBe('0,09\u00A0€');
    });

    it('formats zero correctly', () => {
      expect(formatCents(0)).toBe('0,00\u00A0€');
    });

    it('formats negative amounts correctly', () => {
      expect(formatCents(-150)).toBe('-1,50\u00A0€');
      expect(formatCents(-5)).toBe('-0,05\u00A0€');
    });

    it('handles large numbers', () => {
      expect(formatCents(123456789)).toBe('1.234.567,89\u00A0€');
    });

    it('handles decimal inputs gracefully', () => {
      expect(formatCents(6990.5)).toBe('69,91\u00A0€');
      expect(formatCents(6990.1)).toBe('69,90\u00A0€');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with thousands separators', () => {
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1234567)).toBe('1.234.567');
    });

    it('formats decimals correctly', () => {
      expect(formatNumber(12.34)).toBe('12,34');
    });
  });

  describe('formatDate', () => {
    it('formats a valid ISO date', () => {
      expect(formatDate('2026-10-02')).toBe('Freitag, 2. Oktober 2026');
    });

    it('returns the input if the date is invalid', () => {
      expect(formatDate('not-a-date')).toBe('not-a-date');
      expect(formatDate('2026-15-40')).toBe('2026-15-40');
      expect(formatDate('')).toBe('');
      expect(formatDate('null')).toBe('null');
      expect(formatDate('undefined')).toBe('undefined');
      expect(formatDate('abc')).toBe('abc');
    });

    it('handles leap years correctly', () => {
      expect(formatDate('2024-02-29')).toBe('Donnerstag, 29. Februar 2024');
    });
  });

  describe('formatDateShort', () => {
    it('formats a valid ISO date into short format', () => {
      expect(formatDateShort('2026-10-02')).toBe('02.10.2026');
    });

    it('returns the input if the date is invalid', () => {
      expect(formatDateShort('not-a-date')).toBe('not-a-date');
    });
  });

  describe('formatDateTime', () => {
    it('formats a valid ISO datetime', () => {
      expect(formatDateTime('2026-10-02T14:30:00Z')).toMatch(/02\.10\.2026, \d{2}:30/); // Timezone dependent
    });

    it('returns the input if the datetime is invalid', () => {
      expect(formatDateTime('not-a-datetime')).toBe('not-a-datetime');
    });
  });

  describe('formatDuration', () => {
    it('formats minutes less than an hour', () => {
      expect(formatDuration(0)).toBe('0 Min.');
      expect(formatDuration(30)).toBe('30 Min.');
      expect(formatDuration(45)).toBe('45 Min.');
      expect(formatDuration(59)).toBe('59 Min.');
    });

    it('formats exact hours', () => {
      expect(formatDuration(60)).toBe('1 Std.');
      expect(formatDuration(120)).toBe('2 Std.');
      expect(formatDuration(180)).toBe('3 Std.');
      expect(formatDuration(600)).toBe('10 Std.');
    });

    it('formats hours and minutes', () => {
      expect(formatDuration(61)).toBe('1 Std. 1 Min.');
      expect(formatDuration(90)).toBe('1 Std. 30 Min.');
      expect(formatDuration(125)).toBe('2 Std. 5 Min.');
    });
  });

  describe('formatMillimeter', () => {
    it('formats millimeters', () => {
      expect(formatMillimeter(35.5)).toBe('35,5 mm');
      expect(formatMillimeter(1000)).toBe('1.000 mm');
    });
  });

  describe('formatWeekday', () => {
    it('returns the correct day name for 1-7', () => {
      expect(formatWeekday(1)).toBe('Montag');
      expect(formatWeekday(3)).toBe('Mittwoch');
      expect(formatWeekday(7)).toBe('Sonntag');
    });

    it('returns empty string for invalid days', () => {
      expect(formatWeekday(0)).toBe('');
      expect(formatWeekday(8)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(1500)).toBe('1 KB');
      expect(formatFileSize(1024 * 500)).toBe('500 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });
  });
});
