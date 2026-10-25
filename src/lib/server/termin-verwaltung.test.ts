import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { TerminVerschiebung, VorgangsAnlage } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { buildReference } from '@/lib/reference';
import type { BusinessRecord, Settings } from '@/lib/types';

/* Termin verschieben und Telefontermin: gleiche Prüfung wie die Online-
 * Buchung, Tagessperre der Datenschicht (hier nachgebildet), Mails über die
 * vorhandenen Benachrichtigungen (ersetzt). */

const stored: BusinessRecord[] = [];
const mails: string[] = [];

// Mittwoch, 3. März 2027 — Werktag in Hessen.
const TAG = '2027-03-03';
const SETTINGS: Settings = {
  ...defaults.settings(),
  openingHours: [3, 4, 5].map((day) => ({ day, spans: [{ from: '08:00', to: '18:00' }] })),
  booking: { ...defaults.settings().booking, slotsPerWindow: 1, federalState: 'HE' },
};

vi.mock('@/lib/data', () => {
  class TerminVergebenFehler extends Error {}
  const termine = (datum: string) => stored.filter((r) => r.appointment?.date === datum && r.status !== 'storniert');
  return {
    TerminVergebenFehler,
    getSettings: async () => SETTINGS,
    getCollection: async () => [],
    getRecord: async (id: string) => stored.find((r) => r.id === id) ?? null,
    vorgangAnlegen: async ({ art, jahr, aufbauen, termin }: VorgangsAnlage) => {
      if (termin && !termin.istFrei(termine(termin.datum))) throw new TerminVergebenFehler(termin.datum);
      const nummer = buildReference(art, jahr, stored.length + 1);
      const record: BusinessRecord = { ...aufbauen(nummer), id: String(stored.length + 1), reference: nummer, kind: art };
      stored.push(record);
      return record;
    },
    terminVerschieben: async ({ vorgangId, neu, istFrei, aendern }: TerminVerschiebung) => {
      const index = stored.findIndex((r) => r.id === vorgangId);
      if (index < 0) return null;
      if (!istFrei(termine(neu.date), stored[index])) throw new TerminVergebenFehler(neu.date);
      stored[index] = { ...stored[index], ...aendern(stored[index]), appointment: neu };
      return stored[index];
    },
  };
});

vi.mock('./benachrichtigungen', () => ({
  benachrichtigeStatus: async ({ status }: { status: string }) => {
    mails.push(`status-${status}`);
    return { kind: 'status', to: 'x', at: '', result: 'gesendet' };
  },
  benachrichtigeVertrag: async () => {
    mails.push('vertrag');
    return { kind: 'vertrag', to: 'x', at: '', result: 'gesendet' };
  },
}));

const { telefonterminEintragen, terminVerschieben } = await import('./termin-verwaltung');

const anruf = {
  vorname: 'Erika',
  nachname: 'Muster',
  email: 'erika@example.org',
  telefon: '06441 123456',
  datum: TAG,
  uhrzeit: '09:00',
  dauerMinuten: 150,
  leistung: 'Zweitschlüssel',
};

beforeEach(() => {
  stored.length = 0;
  mails.length = 0;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2027-02-20T10:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Telefontermin eintragen', () => {
  it('legt einen terminierten Vorgang ohne Online-Zahlung an und informiert den Kunden', async () => {
    const ergebnis = await telefonterminEintragen(anruf, 'Mina Saad');
    expect(ergebnis).toMatchObject({ ok: true, nummer: 'SM24-T-2027-0001' });
    expect(stored[0]).toMatchObject({
      kind: 'termin',
      process: 'termin-mit-anzahlung',
      status: 'terminiert',
      appointment: { date: TAG, time: '09:00', durationMinutes: 150, location: 'werkstatt' },
    });
    expect(stored[0].payment).toBeUndefined();
    expect(stored[0].internalNotes[0].message).toContain('Telefonisch eingetragen (Mina Saad)');
    expect(mails).toEqual(['status-terminiert', 'vertrag']);
  });

  it('prüft die Belegung nach Dauer: 150 min um 09:00 sperren 10:00 und 11:00', async () => {
    expect((await telefonterminEintragen(anruf, 'Team')).ok).toBe(true);
    const zweiter = await telefonterminEintragen({ ...anruf, uhrzeit: '11:00', dauerMinuten: 60 }, 'Team');
    expect(zweiter).toMatchObject({ ok: false, status: 409, fehler: expect.stringContaining('Bereits vergeben') });
    expect((await telefonterminEintragen({ ...anruf, uhrzeit: '11:30', dauerMinuten: 60 }, 'Team')).ok).toBe(true);
  });

  it('lehnt Feiertage, geschlossene Tage, Vergangenheit und unvollständige Angaben ab', async () => {
    expect(await telefonterminEintragen({ ...anruf, datum: '2027-03-26' }, 'Team')).toMatchObject({ ok: false, fehler: expect.stringContaining('Feiertag') });
    expect(await telefonterminEintragen({ ...anruf, datum: '2027-03-01' }, 'Team')).toMatchObject({ ok: false, fehler: expect.stringContaining('geschlossen') });
    expect(await telefonterminEintragen({ ...anruf, datum: '2027-02-19' }, 'Team')).toMatchObject({ ok: false, status: 400 });
    expect(await telefonterminEintragen({ ...anruf, email: '' }, 'Team')).toMatchObject({ ok: false, status: 400 });
    expect(stored).toHaveLength(0);
  });

  it('schickt ohne Haken keine Terminmail — die Vertragsbestätigung geht trotzdem', async () => {
    await telefonterminEintragen({ ...anruf, kundeInformieren: false }, 'Team');
    expect(mails).toEqual(['vertrag']);
  });
});

describe('Termin verschieben', () => {
  it('verschiebt unter Ausschluss des eigenen Termins und vermerkt es', async () => {
    await telefonterminEintragen(anruf, 'Team');
    mails.length = 0;
    // Um 30 Minuten verschieben überschneidet nur den eigenen alten Termin.
    const ergebnis = await terminVerschieben('1', { datum: TAG, uhrzeit: '09:30' }, 'Mina Saad');
    expect(ergebnis).toMatchObject({ ok: true });
    expect(stored[0].appointment).toMatchObject({ date: TAG, time: '09:30', durationMinutes: 150 });
    expect(stored[0].timeline.at(-1)?.message).toContain('Termin verlegt auf');
    expect(stored[0].internalNotes.at(-1)?.message).toContain('verschoben (Mina Saad)');
    expect(mails).toEqual(['status-terminiert', 'vertrag']);
  });

  it('verschiebt nicht in einen belegten Zeitraum', async () => {
    await telefonterminEintragen(anruf, 'Team');
    await telefonterminEintragen({ ...anruf, datum: '2027-03-04' }, 'Team');
    const ergebnis = await terminVerschieben('2', { datum: TAG, uhrzeit: '10:00' }, 'Team');
    expect(ergebnis).toMatchObject({ ok: false, status: 409 });
    expect(stored[1].appointment?.date).toBe('2027-03-04');
  });

  it('nur Termine, nicht storniert, nicht in der Vergangenheit', async () => {
    await telefonterminEintragen(anruf, 'Team');
    stored.push({ ...stored[0], id: '9', kind: 'anfrage', reference: 'SM24-A-2027-0001' });
    expect(await terminVerschieben('9', { datum: TAG, uhrzeit: '14:00' }, 'Team')).toMatchObject({ ok: false, status: 400 });
    expect(await terminVerschieben('1', { datum: '2027-02-01', uhrzeit: '14:00' }, 'Team')).toMatchObject({ ok: false, status: 400 });
    stored[0] = { ...stored[0], status: 'storniert' };
    expect(await terminVerschieben('1', { datum: TAG, uhrzeit: '14:00' }, 'Team')).toMatchObject({ ok: false, status: 409 });
    expect(await terminVerschieben('77', { datum: TAG, uhrzeit: '14:00' }, 'Team')).toMatchObject({ ok: false, status: 404 });
  });
});
