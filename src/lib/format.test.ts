import { describe, it, expect } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('formats exactly 60 minutes as 1 Std.', () => {
    expect(formatDuration(60)).toBe('1 Std.');
  });

  it('formats less than 60 minutes correctly', () => {
    expect(formatDuration(0)).toBe('0 Min.');
    expect(formatDuration(30)).toBe('30 Min.');
    expect(formatDuration(45)).toBe('45 Min.');
    expect(formatDuration(59)).toBe('59 Min.');
  });

  it('formats exact hours correctly', () => {
    expect(formatDuration(120)).toBe('2 Std.');
    expect(formatDuration(180)).toBe('3 Std.');
    expect(formatDuration(600)).toBe('10 Std.');
  });

  it('formats hours and minutes correctly', () => {
    expect(formatDuration(90)).toBe('1 Std. 30 Min.');
    expect(formatDuration(125)).toBe('2 Std. 5 Min.');
    expect(formatDuration(61)).toBe('1 Std. 1 Min.');
  });
});
