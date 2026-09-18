import { describe, it, expect } from 'vitest';
import { groupSlotsByDate } from './scheduling';
import type { TimeSlot } from './types';

describe('groupSlotsByDate', () => {
  it('should return an empty array when given no slots', () => {
    expect(groupSlotsByDate([])).toEqual([]);
  });

  it('should group a single slot correctly', () => {
    const slot1: TimeSlot = {
      date: '2023-10-01',
      time: '10:00',
      durationMinutes: 60,
      available: true,
    };

    expect(groupSlotsByDate([slot1])).toEqual([
      { date: '2023-10-01', slots: [slot1] },
    ]);
  });

  it('should group multiple slots on the same date', () => {
    const slot1: TimeSlot = {
      date: '2023-10-01',
      time: '10:00',
      durationMinutes: 60,
      available: true,
    };
    const slot2: TimeSlot = {
      date: '2023-10-01',
      time: '11:00',
      durationMinutes: 60,
      available: true,
    };

    expect(groupSlotsByDate([slot1, slot2])).toEqual([
      { date: '2023-10-01', slots: [slot1, slot2] },
    ]);
  });

  it('should group multiple slots on different dates and sort by date', () => {
    const slot1: TimeSlot = {
      date: '2023-10-02',
      time: '10:00',
      durationMinutes: 60,
      available: true,
    };
    const slot2: TimeSlot = {
      date: '2023-10-01',
      time: '11:00',
      durationMinutes: 60,
      available: true,
    };
    const slot3: TimeSlot = {
      date: '2023-10-02',
      time: '12:00',
      durationMinutes: 60,
      available: true,
    };

    expect(groupSlotsByDate([slot1, slot2, slot3])).toEqual([
      { date: '2023-10-01', slots: [slot2] },
      { date: '2023-10-02', slots: [slot1, slot3] },
    ]);
  });
});
