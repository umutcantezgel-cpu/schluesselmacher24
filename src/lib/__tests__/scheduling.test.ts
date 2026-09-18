import { describe, it, expect } from 'vitest';
import { availableSlots, type SlotQuery } from '../scheduling';
import type { BusinessRecord } from '../types';

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

    // The 18:00 window should be filtered out as it falls outside opening hours
    expect(slots.length).toBe(4); // 2 on Thursday, 2 on Friday

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
        { id: '1', date: '2026-10-01', reason: 'Feiertag' } // No spans means fully blocked
      ],
    };

    const slots = availableSlots(query);
    expect(slots.length).toBe(2); // Only Friday slots
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
          spans: [{ from: '09:15', to: '10:15' }], // Overlaps both 09:00 and 10:00
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

    // Friday should be unaffected
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
      leadTimeDays: 1, // Skip today (2026-10-01)
      daysToScan: 2,
    };

    const slots = availableSlots(query);

    // Expected to scan 2026-10-02 and 2026-10-03
    // But Saturday (2026-10-03) has no opening hours in baseQuery
    expect(slots.length).toBe(2);
    expect(slots[0].date).toBe('2026-10-02');
  });
});
