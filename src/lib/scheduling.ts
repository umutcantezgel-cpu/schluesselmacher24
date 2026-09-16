import type { BlockedDay, BookingDefaults, BusinessRecord, OpeningHour, TimeSlot } from '@/lib/types';

/* ==========================================================================
   Terminlogik
   Vorlaufzeit, Terminlänge, Buchungsfenster und Sperrtage kommen
   ausschließlich aus der Datenschicht.
   ========================================================================== */

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** 1 = Montag … 7 = Sonntag */
export function weekdayOf(iso: string): number {
  const day = new Date(`${iso}T12:00:00`).getDay();
  return day === 0 ? 7 : day;
}

/** Frühester buchbarer Tag unter Berücksichtigung des Vorlaufs. */
export function earliestBookableDate(today: string, leadTimeDays: number): string {
  return addDays(today, leadTimeDays);
}

function timeToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

function overlaps(
  aFrom: number,
  aTo: number,
  bFrom: number,
  bTo: number,
): boolean {
  return aFrom < bTo && bFrom < aTo;
}

export interface SlotQuery {
  /** Heutiges Datum als ISO-Tag. */
  today: string;
  /** Wie lange der Termin dauert. */
  durationMinutes: number;
  /** Abweichender Vorlauf, sonst der Standard. */
  leadTimeDays?: number;
  booking: BookingDefaults;
  openingHours: OpeningHour[];
  blockedDays: BlockedDay[];
  /** Bereits vergebene Termine. */
  existing: BusinessRecord[];
  /** Wie viele Tage ab dem frühesten Termin geprüft werden. */
  daysToScan?: number;
}

/** Erzeugt die buchbaren Zeitfenster für den angefragten Zeitraum. */
export function availableSlots(query: SlotQuery): TimeSlot[] {
  const leadTime = query.leadTimeDays ?? query.booking.leadTimeDays;
  const start = earliestBookableDate(query.today, leadTime);
  const scan = Math.min(
    query.daysToScan ?? query.booking.bookingHorizonDays,
    query.booking.bookingHorizonDays,
  );

  const taken = new Map<string, number>();
  for (const record of query.existing) {
    const a = record.appointment;
    if (!a) continue;
    if (record.status === 'storniert') continue;
    const key = `${a.date}T${a.time}`;
    taken.set(key, (taken.get(key) ?? 0) + 1);
  }

  const slots: TimeSlot[] = [];

  for (let offset = 0; offset < scan; offset += 1) {
    const date = addDays(start, offset);
    const weekday = weekdayOf(date);
    const hours = query.openingHours.find((h) => h.day === weekday);

    if (!hours || hours.spans.length === 0) continue;

    const fullBlock = query.blockedDays.find((b) => b.date === date && !b.spans?.length);
    if (fullBlock) continue;

    const partialBlocks = query.blockedDays
      .filter((b) => b.date === date && b.spans?.length)
      .flatMap((b) => b.spans ?? []);

    for (const window of query.booking.windows) {
      const from = timeToMinutes(window.from);
      const to = from + query.durationMinutes;

      // Termin muss vollständig in eine Öffnungszeit passen.
      const insideOpening = hours.spans.some(
        (span) => from >= timeToMinutes(span.from) && to <= timeToMinutes(span.to),
      );
      if (!insideOpening) continue;

      const blocked = partialBlocks.some((span) =>
        overlaps(from, to, timeToMinutes(span.from), timeToMinutes(span.to)),
      );

      const used = taken.get(`${date}T${window.from}`) ?? 0;
      const free = used < query.booking.slotsPerWindow;

      slots.push({
        date,
        time: window.from,
        durationMinutes: query.durationMinutes,
        available: !blocked && free,
        blockedReason: blocked ? 'Interne Sperrzeit' : free ? undefined : 'Bereits vergeben',
      });
    }
  }

  return slots;
}

/** Gruppiert Zeitfenster nach Tag — für die Darstellung im Kalender. */
export function groupSlotsByDate(slots: TimeSlot[]): Array<{ date: string; slots: TimeSlot[] }> {
  const map = new Map<string, TimeSlot[]>();
  for (const slot of slots) {
    const list = map.get(slot.date) ?? [];
    list.push(slot);
    map.set(slot.date, list);
  }
  return [...map.entries()]
    .map(([date, list]) => ({ date, slots: list }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Nur Tage, an denen mindestens ein Fenster frei ist. */
export function bookableDays(slots: TimeSlot[]): Array<{ date: string; slots: TimeSlot[] }> {
  return groupSlotsByDate(slots).filter((day) => day.slots.some((s) => s.available));
}
