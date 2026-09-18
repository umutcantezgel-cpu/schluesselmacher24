import { describe, it, expect } from 'vitest';
import { groupSlotsByDate } from '../scheduling';
import type { TimeSlot } from '../types';

describe('groupSlotsByDate', () => {
  it('should return an empty array when given no slots', () => {
    const slots: TimeSlot[] = [];
    const result = groupSlotsByDate(slots);
    expect(result).toEqual([]);
  });

  it('should group a single slot correctly', () => {
    const slot: TimeSlot = {
      date: '2024-05-15',
      time: '10:00',
      durationMinutes: 30,
      available: true,
    };
    const result = groupSlotsByDate([slot]);
    expect(result).toEqual([
      {
        date: '2024-05-15',
        slots: [slot],
      },
    ]);
  });

  it('should group multiple slots on the same date', () => {
    const slot1: TimeSlot = {
      date: '2024-05-15',
      time: '10:00',
      durationMinutes: 30,
      available: true,
    };
    const slot2: TimeSlot = {
      date: '2024-05-15',
      time: '10:30',
      durationMinutes: 30,
      available: true,
    };
    const result = groupSlotsByDate([slot1, slot2]);
    expect(result).toEqual([
      {
        date: '2024-05-15',
        slots: [slot1, slot2],
      },
    ]);
  });

  it('should group slots by different dates and sort them by date', () => {
    const slot1: TimeSlot = {
      date: '2024-05-16',
      time: '10:00',
      durationMinutes: 30,
      available: true,
    };
    const slot2: TimeSlot = {
      date: '2024-05-15',
      time: '10:30',
      durationMinutes: 30,
      available: true,
    };
    const slot3: TimeSlot = {
      date: '2024-05-15',
      time: '11:00',
      durationMinutes: 30,
      available: true,
    };
    const result = groupSlotsByDate([slot1, slot2, slot3]);
    expect(result).toEqual([
      {
        date: '2024-05-15',
        slots: [slot2, slot3],
      },
      {
        date: '2024-05-16',
        slots: [slot1],
      },
    ]);
  });

  it('should preserve original slot order within the same date', () => {
    const slot1: TimeSlot = {
      date: '2024-05-15',
      time: '11:00', // Later time
      durationMinutes: 30,
      available: true,
    };
    const slot2: TimeSlot = {
      date: '2024-05-15',
      time: '10:00', // Earlier time
      durationMinutes: 30,
      available: true,
    };
    // Input order is slot1 then slot2
    const result = groupSlotsByDate([slot1, slot2]);
    expect(result).toEqual([
      {
        date: '2024-05-15',
        slots: [slot1, slot2],
      },
    ]);
  });
});
