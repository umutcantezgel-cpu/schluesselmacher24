import { describe, it, expect } from 'vitest';
import {
  earliestBookableDate,
  addDays,
  toIsoDate,
  weekdayOf,
  groupSlotsByDate,
  availableSlots,
  type SlotQuery,
} from './scheduling';
import type { TimeSlot, BusinessRecord } from './types';

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
      expect(earliestBookableDate('2023-10-15', 3)).toBe('2023-10-18');
    });

    it('handles month transitions', () => {
      expect(earliestBookableDate('2024-01-31', 1)).toBe('2024-02-01');
      expect(earliestBookableDate('2024-04-30', 1)).toBe('2024-05-01');
      expect(earliestBookableDate('2023-10-30', 3)).toBe('2023-11-02');
    });

    it('handles year transitions', () => {
      expect(earliestBookableDate('2024-12-31', 1)).toBe('2025-01-01');
      expect(earliestBookableDate('2023-12-30', 3)).toBe('2024-01-02');
    });

    it('handles leap years correctly', () => {
      expect(earliestBookableDate('2024-02-28', 1)).toBe('2024-02-29');
      expect(earliestBookableDate('2024-02-28', 2)).toBe('2024-03-01');
      // Year 2000 was a leap year
      expect(earliestBookableDate('2000-02-28', 1)).toBe('2000-02-29');
    });

    it('handles non-leap years correctly', () => {
      expect(earliestBookableDate('2023-02-28', 1)).toBe('2023-03-01');
      expect(earliestBookableDate('2023-02-28', 2)).toBe('2023-03-02');
      // Year 2100 is not a leap year
      expect(earliestBookableDate('2100-02-28', 1)).toBe('2100-03-01');
    });

    it('handles negative lead times', () => {
      expect(earliestBookableDate('2024-01-05', -2)).toBe('2024-01-03');
      expect(earliestBookableDate('2023-10-15', -2)).toBe('2023-10-13');
    });

    it('handles 0 lead time', () => {
      expect(earliestBookableDate('2024-01-01', 0)).toBe('2024-01-01');
      expect(earliestBookableDate('2023-10-15', 0)).toBe('2023-10-15');
    });

    it('handles large day additions', () => {
      expect(earliestBookableDate('2024-01-01', 365)).toBe('2024-12-31'); // 2024 is leap year, 366 days
      expect(earliestBookableDate('2023-01-01', 365)).toBe('2024-01-01'); // 2023 is not leap year
    });
  });

  describe('groupSlotsByDate', () => {
    it('should return an empty array when given no slots', () => {
      expect(groupSlotsByDate([])).toEqual([]);
    });

    it('should group a single slot correctly', () => {
      const slot: TimeSlot = {
        date: '2024-05-15',
        time: '10:00',
        durationMinutes: 30,
        available: true,
      };
      expect(groupSlotsByDate([slot])).toEqual([
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
      expect(groupSlotsByDate([slot1, slot2])).toEqual([
        {
          date: '2024-05-15',
          slots: [slot1, slot2],
        },
      ]);
    });

    it('should group multiple slots on different dates and sort by date', () => {
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
      expect(groupSlotsByDate([slot1, slot2, slot3])).toEqual([
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
        time: '11:00',
        durationMinutes: 30,
        available: true,
      };
      const slot2: TimeSlot = {
        date: '2024-05-15',
        time: '10:00',
        durationMinutes: 30,
        available: true,
      };
      expect(groupSlotsByDate([slot1, slot2])).toEqual([
        {
          date: '2024-05-15',
          slots: [slot1, slot2],
        },
      ]);
    });
  });

  describe('availableSlots', () => {
    const baseQuery: SlotQuery = {
      today: '2026-10-01',
      durationMinutes: 30,
      leadTimeDays: 0,
      booking: {
        leadTimeDays: 0,
        depositCents: 0,
        depositMinCents: 0,
        depositMaxCents: 0,
        slotMinutes: 30,
        bookingHorizonDays: 7,
        slotsPerWindow: 1,
        windows: [
          { from: '09:00', to: '09:30' },
          { from: '10:00', to: '10:30' },
          { from: '18:00', to: '18:30' },
        ],
      },
      openingHours: [
        {
          day: 4, // Thursday (2026-10-01 is a Thursday)
          spans: [{ from: '09:00', to: '17:00' }],
        },
        {
          day: 5, // Friday
          spans: [{ from: '09:00', to: '17:00' }],
        },
      ],
      blockedDays: [],
      existing: [],
      daysToScan: 2,
    };

    it('returns available slots within opening hours', () => {
      const slots = availableSlots(baseQuery);
      expect(slots.length).toBe(4);

      const thursSlots = slots.filter(s => s.date === '2026-10-01');
      expect(thursSlots.length).toBe(2);
      expect(thursSlots[0].time).toBe('09:00');
      expect(thursSlots[0].available).toBe(true);
      expect(thursSlots[1].time).toBe('10:00');
      expect(thursSlots[1].available).toBe(true);
    });

    it('skips days that are fully blocked', () => {
      const query = {
        ...baseQuery,
        blockedDays: [
          { id: '1', date: '2026-10-01', reason: 'Feiertag' }
        ],
      };

      const slots = availableSlots(query);
      expect(slots.length).toBe(2);
      expect(slots[0].date).toBe('2026-10-02');
    });

    it('marks slots overlapping with partial blocks as unavailable', () => {
      const query = {
        ...baseQuery,
        blockedDays: [
          {
            id: '1',
            date: '2026-10-01',
            reason: 'Pause',
            spans: [{ from: '09:15', to: '10:15' }],
          },
        ],
      };

      const slots = availableSlots(query);
      expect(slots.length).toBe(4);

      const thurs0900 = slots.find(s => s.date === '2026-10-01' && s.time === '09:00');
      expect(thurs0900?.available).toBe(false);
      expect(thurs0900?.blockedReason).toBe('Interne Sperrzeit');

      const thurs1000 = slots.find(s => s.date === '2026-10-01' && s.time === '10:00');
      expect(thurs1000?.available).toBe(false);
      expect(thurs1000?.blockedReason).toBe('Interne Sperrzeit');

      const fri0900 = slots.find(s => s.date === '2026-10-02' && s.time === '09:00');
      expect(fri0900?.available).toBe(true);
    });

    it('marks slots as unavailable if taken by existing bookings', () => {
      const existing: BusinessRecord = {
        id: '1',
        reference: 'R1',
        kind: 'termin',
        area: 'autoschluessel',
        process: 'termin-mit-anzahlung',
        status: 'terminiert',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
        contact: { firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com', phone: '123', country: 'DE' },
        payload: {},
        summary: [],
        uploads: [],
        internalNotes: [],
        timeline: [],
        appointment: {
          date: '2026-10-01',
          time: '09:00',
          durationMinutes: 30,
          location: 'werkstatt'
        }
      };

      const query = {
        ...baseQuery,
        existing: [existing],
      };

      const slots = availableSlots(query);
      const thurs0900 = slots.find(s => s.date === '2026-10-01' && s.time === '09:00');

      expect(thurs0900?.available).toBe(false);
      expect(thurs0900?.blockedReason).toBe('Bereits vergeben');
    });

    it('respects lead time days', () => {
      const query = {
        ...baseQuery,
        leadTimeDays: 1,
        daysToScan: 2,
      };

      const slots = availableSlots(query);
      expect(slots.length).toBe(2);
      expect(slots[0].date).toBe('2026-10-02');
    });
  });
});
