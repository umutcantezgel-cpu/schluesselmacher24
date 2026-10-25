import { STANDARD_BUNDESLAND, feiertagAm } from '@/lib/feiertage';
import type { BlockedDay, BookingDefaults, BusinessRecord, OpeningHour, TimeSlot } from '@/lib/types';

/* ==========================================================================
   Terminlogik
   Vorlaufzeit, Terminlänge, Buchungsfenster und Sperrtage kommen
   ausschließlich aus der Datenschicht, die gesetzlichen Feiertage aus
   `feiertage.ts`. „Heute“ ist immer der Tag in deutscher Zeit
   (`heuteInBerlin`).
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
  /** Heutiges Datum als ISO-Tag (in deutscher Zeit, siehe `heuteInBerlin`). */
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
  /** Kennung eines Vorgangs, dessen Termin nicht zählt (beim Verschieben). */
  exceptRecordId?: string;
}

/** Belegte Zeit eines Tages als Intervall [von, bis) in Minuten. */
type Belegung = readonly [von: number, bis: number];

/** Nicht stornierte Termine als Intervalle [Start, Start + Dauer), je Tag. */
function belegungenJeTag(existing: BusinessRecord[], exceptRecordId?: string): Map<string, Belegung[]> {
  const tage = new Map<string, Belegung[]>();
  for (const record of existing) {
    const a = record.appointment;
    if (!a || record.status === 'storniert') continue;
    if (exceptRecordId !== undefined && record.id === exceptRecordId) continue;
    const von = timeToMinutes(a.time);
    if (!Number.isFinite(von)) continue;
    const liste = tage.get(a.date) ?? [];
    liste.push([von, von + Math.max(1, a.durationMinutes || 0)]);
    tage.set(a.date, liste);
  }
  return tage;
}

/** Warum ein Zeitfenster nicht buchbar ist. */
export type SperrGrund = 'geschlossen' | 'feiertag' | 'gesperrt' | 'oeffnungszeit' | 'sperrzeit' | 'vergeben';

export const SPERRGRUND_TEXT: Record<SperrGrund, string> = {
  geschlossen: 'An diesem Tag ist geschlossen',
  feiertag: 'Gesetzlicher Feiertag',
  gesperrt: 'Ganzer Tag gesperrt',
  oeffnungszeit: 'Außerhalb der Öffnungszeiten',
  sperrzeit: 'Interne Sperrzeit',
  vergeben: 'Bereits vergeben',
};

interface TagesRahmen {
  booking: BookingDefaults;
  openingHours: OpeningHour[];
  blockedDays: BlockedDay[];
}

/** Ob der ganze Tag ausfällt (geschlossen, Feiertag, ganztägige Sperre). */
function tagGesperrt(date: string, rahmen: TagesRahmen): SperrGrund | null {
  const hours = rahmen.openingHours.find((h) => h.day === weekdayOf(date));
  if (!hours || hours.spans.length === 0) return 'geschlossen';
  if (feiertagAm(date, rahmen.booking.federalState ?? STANDARD_BUNDESLAND)) return 'feiertag';
  if (rahmen.blockedDays.some((b) => b.date === date && !b.spans?.length)) return 'gesperrt';
  return null;
}

/**
 * Prüft ein Zeitfenster an einem Tag, der nicht ganz ausfällt: Öffnungszeit,
 * Teilsperren und Belegung. Frei ist es, wenn höchstens `slotsPerWindow − 1`
 * vergebene Termine das Intervall [from, from + Dauer) überlappen.
 */
function fensterPruefen(
  date: string,
  from: number,
  durationMinutes: number,
  rahmen: TagesRahmen,
  belegt: readonly Belegung[],
): SperrGrund | null {
  const to = from + durationMinutes;
  const hours = rahmen.openingHours.find((h) => h.day === weekdayOf(date));
  // Termin muss vollständig in eine Öffnungszeit passen.
  const insideOpening = (hours?.spans ?? []).some(
    (span) => from >= timeToMinutes(span.from) && to <= timeToMinutes(span.to),
  );
  if (!insideOpening) return 'oeffnungszeit';

  const teilsperre = rahmen.blockedDays
    .filter((b) => b.date === date && b.spans?.length)
    .flatMap((b) => b.spans ?? [])
    .some((span) => overlaps(from, to, timeToMinutes(span.from), timeToMinutes(span.to)));
  if (teilsperre) return 'sperrzeit';

  const ueberlappend = belegt.filter(([von, bis]) => overlaps(from, to, von, bis)).length;
  return ueberlappend < rahmen.booking.slotsPerWindow ? null : 'vergeben';
}

/** Erzeugt die buchbaren Zeitfenster für den angefragten Zeitraum. */
export function availableSlots(query: SlotQuery): TimeSlot[] {
  const leadTime = query.leadTimeDays ?? query.booking.leadTimeDays;
  const start = earliestBookableDate(query.today, leadTime);
  const scan = Math.min(
    query.daysToScan ?? query.booking.bookingHorizonDays,
    query.booking.bookingHorizonDays,
  );

  const belegungen = belegungenJeTag(query.existing, query.exceptRecordId);
  const slots: TimeSlot[] = [];

  for (let offset = 0; offset < scan; offset += 1) {
    const date = addDays(start, offset);
    // Geschlossen, Feiertag oder ganz gesperrt: Der Tag erscheint gar nicht.
    if (tagGesperrt(date, query)) continue;

    for (const window of query.booking.windows) {
      const grund = fensterPruefen(date, timeToMinutes(window.from), query.durationMinutes, query, belegungen.get(date) ?? []);
      // Fenster außerhalb der Öffnungszeit werden nicht angeboten.
      if (grund === 'oeffnungszeit') continue;

      slots.push({
        date,
        time: window.from,
        durationMinutes: query.durationMinutes,
        available: grund === null,
        blockedReason: grund ? SPERRGRUND_TEXT[grund] : undefined,
      });
    }
  }

  return slots;
}

export interface ZeitpunktPruefung extends TagesRahmen {
  date: string;
  /** Startzeit „HH:MM“ — beliebig, nicht nur die Buchungsfenster. */
  time: string;
  durationMinutes: number;
  existing: BusinessRecord[];
  exceptRecordId?: string;
}

/**
 * Prüft einen frei gewählten Zeitpunkt (Termine, die das Team einträgt oder
 * verschiebt): gleiche Regeln wie `availableSlots`, aber ohne Vorlauf,
 * Buchungshorizont und Raster der Buchungsfenster. Liefert `null`, wenn der
 * Zeitpunkt frei ist, sonst den Grund.
 */
export function zeitpunktPruefen(pruefung: ZeitpunktPruefung): SperrGrund | null {
  const tag = tagGesperrt(pruefung.date, pruefung);
  if (tag) return tag;
  const belegt = belegungenJeTag(pruefung.existing, pruefung.exceptRecordId).get(pruefung.date) ?? [];
  return fensterPruefen(pruefung.date, timeToMinutes(pruefung.time), pruefung.durationMinutes, pruefung, belegt);
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
