import { afterEach, describe, it, expect, vi } from 'vitest';
import { heuteInBerlin } from './berliner-zeit';
import {
  earliestBookableDate,
  addDays,
  toIsoDate,
  weekdayOf,
  groupSlotsByDate,
  availableSlots,
  minutenInBerlin,
  zeitpunktPruefen,
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

    describe('Vorlauf 0: heute nur Fenster, die noch nicht begonnen haben', () => {
      afterEach(() => {
        vi.useRealTimers();
      });

      it('rechnet die Uhrzeit in deutscher Zeit', () => {
        expect(minutenInBerlin(new Date('2026-10-27T16:00:00Z'))).toBe(17 * 60); // Winterzeit
        expect(minutenInBerlin(new Date('2026-07-01T22:30:00Z'))).toBe(30); // Sommerzeit, schon nach Mitternacht
      });

      it('überspringt heute Fenster mit Beginn bis jetzt, andere Tage bleiben', () => {
        const slots = availableSlots({ ...baseQuery, jetztMinuten: 10 * 60 });
        expect(slots.filter((s) => s.date === '2026-10-01')).toEqual([]);
        expect(slots.filter((s) => s.date === '2026-10-02').map((s) => s.time)).toEqual(['09:00', '10:00']);

        const halbZehn = availableSlots({ ...baseQuery, jetztMinuten: 9 * 60 + 30 });
        expect(halbZehn.filter((s) => s.date === '2026-10-01').map((s) => s.time)).toEqual(['10:00']);
      });

      it('mit festgesetzter Uhr: um 10:30 Uhr ist heute nichts mehr frei', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-10-01T08:30:00Z')); // 10:30 Uhr in Wetzlar
        const slots = availableSlots({ ...baseQuery, today: heuteInBerlin(), jetztMinuten: minutenInBerlin() });
        expect(slots.some((s) => s.date === '2026-10-01')).toBe(false);
        expect(slots.filter((s) => s.date === '2026-10-02')).toHaveLength(2);
      });
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

  describe('availableSlots – Überschneidung nach Dauer', () => {
    // 2027-03-03 ist ein Mittwoch, kein Feiertag in Hessen.
    const tag = '2027-03-03';
    const fenster = ['09:00', '10:00', '11:00', '12:00', '13:00'].map((from) => ({ from, to: from }));

    function termin(id: string, time: string, durationMinutes: number, status: BusinessRecord['status'] = 'terminiert'): BusinessRecord {
      return {
        id,
        reference: `SM24-T-2027-000${id}`,
        kind: 'termin',
        area: 'autoschluessel',
        process: 'termin-mit-anzahlung',
        status,
        createdAt: '2027-02-01T10:00:00Z',
        updatedAt: '2027-02-01T10:00:00Z',
        contact: { firstName: 'Max', lastName: 'Muster', email: 'max@example.com', phone: '1', country: 'Deutschland' },
        payload: {},
        summary: [],
        uploads: [],
        internalNotes: [],
        timeline: [],
        appointment: { date: tag, time, durationMinutes, location: 'werkstatt' },
      };
    }

    function frei(existing: BusinessRecord[], { slotsPerWindow = 1, durationMinutes = 60 } = {}): Record<string, boolean> {
      const slots = availableSlots({
        today: tag,
        durationMinutes,
        leadTimeDays: 0,
        booking: {
          leadTimeDays: 0,
          depositCents: 0,
          depositMinCents: 0,
          depositMaxCents: 0,
          slotMinutes: 60,
          bookingHorizonDays: 1,
          slotsPerWindow,
          windows: fenster,
        },
        openingHours: [{ day: 3, spans: [{ from: '08:00', to: '18:00' }] }],
        blockedDays: [],
        existing,
        daysToScan: 1,
      });
      return Object.fromEntries(slots.map((s) => [s.time, s.available]));
    }

    it.each([
      // [Beschreibung, vorhandene Termine (Start, Dauer), Termine je Fenster, erwartete Belegung]
      ['150 min um 09:00 sperrt 10:00 und 11:00', [['09:00', 150]], 1, { '09:00': false, '10:00': false, '11:00': false, '12:00': true }],
      ['60 min um 09:00 sperrt 10:00 nicht', [['09:00', 60]], 1, { '09:00': false, '10:00': true, '11:00': true }],
      ['45 min um 09:00 sperrt 10:00 nicht', [['09:00', 45]], 1, { '09:00': false, '10:00': true }],
      ['90 min um 10:30 sperrt 10:00 und 11:00', [['10:30', 90]], 1, { '09:00': true, '10:00': false, '11:00': false, '12:00': true }],
      ['2 je Fenster: ein langer Termin lässt Platz', [['09:00', 150]], 2, { '09:00': true, '10:00': true, '11:00': true }],
      ['2 je Fenster: zwei überlappende Termine sperren', [['09:00', 150], ['10:00', 60]], 2, { '09:00': true, '10:00': false, '11:00': true, '12:00': true }],
      ['2 je Fenster: zwei Termine um 09:00 füllen 09:00', [['09:00', 60], ['09:00', 60]], 2, { '09:00': false, '10:00': true }],
    ] as const)('%s', (_name, vorhanden, slotsPerWindow, erwartet) => {
      const existing = vorhanden.map(([time, dauer], i) => termin(String(i + 1), time, dauer));
      const ergebnis = frei(existing, { slotsPerWindow });
      for (const [zeit, verfuegbar] of Object.entries(erwartet)) expect(ergebnis[zeit], zeit).toBe(verfuegbar);
    });

    it('prüft das ganze Intervall des neuen Termins (120 min ab 09:00 gegen 10:00–10:30)', () => {
      const ergebnis = frei([termin('1', '10:00', 30)], { durationMinutes: 120 });
      expect(ergebnis['09:00']).toBe(false);
      expect(ergebnis['11:00']).toBe(true);
    });

    it('ignoriert stornierte Termine und auf Wunsch den eigenen', () => {
      expect(frei([termin('1', '09:00', 150, 'storniert')])['10:00']).toBe(true);
      const slots = availableSlots({
        today: tag,
        durationMinutes: 60,
        leadTimeDays: 0,
        booking: { leadTimeDays: 0, depositCents: 0, depositMinCents: 0, depositMaxCents: 0, slotMinutes: 60, bookingHorizonDays: 1, slotsPerWindow: 1, windows: fenster },
        openingHours: [{ day: 3, spans: [{ from: '08:00', to: '18:00' }] }],
        blockedDays: [],
        existing: [termin('7', '09:00', 150)],
        daysToScan: 1,
        exceptRecordId: '7',
      });
      expect(slots.every((s) => s.available)).toBe(true);
    });

    it('zeitpunktPruefen: beliebige Startzeit, gleiche Regeln', () => {
      const rahmen = {
        booking: { leadTimeDays: 7, depositCents: 0, depositMinCents: 0, depositMaxCents: 0, slotMinutes: 60, bookingHorizonDays: 90, slotsPerWindow: 1, windows: fenster },
        openingHours: [{ day: 3, spans: [{ from: '08:00', to: '18:00' }] }],
        blockedDays: [],
      };
      const existing = [termin('1', '09:00', 150)];
      expect(zeitpunktPruefen({ ...rahmen, date: tag, time: '11:30', durationMinutes: 30, existing })).toBeNull();
      expect(zeitpunktPruefen({ ...rahmen, date: tag, time: '11:15', durationMinutes: 30, existing })).toBe('vergeben');
      expect(zeitpunktPruefen({ ...rahmen, date: tag, time: '11:15', durationMinutes: 30, existing, exceptRecordId: '1' })).toBeNull();
      expect(zeitpunktPruefen({ ...rahmen, date: tag, time: '17:30', durationMinutes: 60, existing })).toBe('oeffnungszeit');
      expect(zeitpunktPruefen({ ...rahmen, date: '2027-03-07', time: '10:00', durationMinutes: 60, existing })).toBe('geschlossen');
      expect(zeitpunktPruefen({ ...rahmen, openingHours: [{ day: 5, spans: [{ from: '08:00', to: '18:00' }] }], date: '2027-03-26', time: '10:00', durationMinutes: 60, existing })).toBe('feiertag');
    });
  });

  describe('availableSlots – gesetzliche Feiertage', () => {
    const werktage = [1, 2, 3, 4, 5].map((day) => ({ day, spans: [{ from: '09:00', to: '17:00' }] }));
    const booking = {
      leadTimeDays: 0,
      depositCents: 0,
      depositMinCents: 0,
      depositMaxCents: 0,
      slotMinutes: 60,
      bookingHorizonDays: 120,
      slotsPerWindow: 1,
      windows: [{ from: '10:00', to: '11:00' }],
    };

    function tage(today: string, daysToScan: number, federalState?: 'HE' | 'BY' | 'NI') {
      return new Set(
        availableSlots({
          today,
          durationMinutes: 60,
          booking: { ...booking, federalState },
          openingHours: werktage,
          blockedDays: [],
          existing: [],
          daysToScan,
        }).map((s) => s.date),
      );
    }

    it('sperrt die hessischen Feiertage im Frühjahr 2027 ganz (Standard ohne Angabe)', () => {
      const angeboten = tage('2027-03-22', 70);
      for (const feiertag of ['2027-03-26', '2027-03-29', '2027-05-06', '2027-05-17', '2027-05-27']) {
        expect(angeboten.has(feiertag), feiertag).toBe(false);
      }
      expect(angeboten.has('2027-03-25')).toBe(true);
      expect(angeboten.has('2027-03-30')).toBe(true);
    });

    it('richtet sich nach dem Bundesland der Einstellungen', () => {
      // Fronleichnam 2027: in Hessen und Bayern Feiertag, in Niedersachsen nicht.
      expect(tage('2027-05-27', 1, 'HE').size).toBe(0);
      expect(tage('2027-05-27', 1, 'BY').size).toBe(0);
      expect(tage('2027-05-27', 1, 'NI').size).toBe(1);
    });
  });
});
