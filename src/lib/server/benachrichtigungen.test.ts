import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { VorgangsAenderung } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { MAIL_NICHT_EINGERICHTET, MAIL_NICHT_VERSENDET } from '@/lib/mail/hinweise';
import type { BusinessRecord, Settings } from '@/lib/types';

/* Benachrichtigungen mit ersetztem fetch (Resend) und ersetzter Datenschicht. */

let gespeichert: BusinessRecord;
const aenderungen: VorgangsAenderung[] = [];

const ECHTE_FIRMA: Settings = {
  ...defaults.settings(),
  company: { ...defaults.settings().company, email: 'info@schluesselmacher24.de', isPlaceholder: false },
};

vi.mock('@/lib/data', () => ({
  getSettings: async () => ECHTE_FIRMA,
  vorgangAendern: async (_id: string, aendern: (v: BusinessRecord) => VorgangsAenderung | null) => {
    const aenderung = aendern(gespeichert);
    if (aenderung) {
      aenderungen.push(aenderung);
      gespeichert = { ...gespeichert, ...aenderung };
    }
    return gespeichert;
  },
}));

const { benachrichtigeNeuerVorgang, benachrichtigeZahlung, sendeWiderrufBetrieb, sendeWiderrufEingang } = await import(
  './benachrichtigungen'
);

function vorgang(): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-T-2026-0007',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-24T10:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    appointment: { date: '2026-11-02', time: '09:30', durationMinutes: 60, location: 'werkstatt' },
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen', checkoutSessionId: 'cs_1', expiresAt: '2026-10-24T10:31:00.000Z' },
  };
}

type Aufruf = { an: string[]; betreff: string; antwortAn?: string[]; schluessel?: string };
const aufrufe: Aufruf[] = [];
let antworten: Array<{ status: number; body: unknown }> = [];

function fetchErsatz() {
  return vi.fn(async (_url: string, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    aufrufe.push({
      an: body.to,
      betreff: body.subject,
      antwortAn: body.reply_to,
      schluessel: (init.headers as Record<string, string>)['Idempotency-Key'],
    });
    const naechste = antworten.shift() ?? { status: 200, body: { id: `re_${aufrufe.length}` } };
    return new Response(JSON.stringify(naechste.body), { status: naechste.status });
  });
}

function mailEinrichten() {
  vi.stubEnv('MAIL_PROVIDER', 'resend');
  vi.stubEnv('MAIL_API_KEY', 're_test');
  vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
  vi.stubEnv('MAIL_TEAM_ADDRESS', 'team@schluesselmacher24.de, inhaber@schluesselmacher24.de');
  vi.stubEnv('MAIL_REPLY_TO', '');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubGlobal('fetch', fetchErsatz());
}

beforeEach(() => {
  gespeichert = vorgang();
  aenderungen.length = 0;
  aufrufe.length = 0;
  antworten = [];
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('benachrichtigeNeuerVorgang', () => {
  it('meldet ohne Einrichtung nur den Hinweis und versendet nichts', async () => {
    const fetchSpion = vi.fn();
    vi.stubGlobal('fetch', fetchSpion);
    expect(await benachrichtigeNeuerVorgang({ saved: vorgang(), token: 't', settings: ECHTE_FIRMA })).toEqual([MAIL_NICHT_EINGERICHTET]);
    expect(fetchSpion).not.toHaveBeenCalled();
    expect(aenderungen).toHaveLength(0);
  });

  it('schreibt Kunde und Betrieb an und protokolliert beide Mails am Vorgang', async () => {
    mailEinrichten();
    const hinweise = await benachrichtigeNeuerVorgang({ saved: vorgang(), token: 'tok', settings: ECHTE_FIRMA });
    expect(hinweise).toEqual([]);

    const kunde = aufrufe.find((a) => a.an.includes('erika@example.org'));
    const team = aufrufe.find((a) => a.an.includes('team@schluesselmacher24.de'));
    expect(kunde?.betreff).toBe('Ihre Terminbuchung SM24-T-2026-0007 ist eingegangen');
    expect(kunde?.antwortAn).toEqual(['info@schluesselmacher24.de']);
    expect(kunde?.schluessel).toBe('lokal-SM24-T-2026-0007-eingang-kunde');
    expect(team?.an).toEqual(['team@schluesselmacher24.de', 'inhaber@schluesselmacher24.de']);
    expect(team?.schluessel).toBe('lokal-SM24-T-2026-0007-eingang-team');

    expect(gespeichert.mailLog?.map((m) => [m.kind, m.result])).toEqual([
      ['eingang-kunde', 'gesendet'],
      ['eingang-team', 'gesendet'],
    ]);
    expect(gespeichert.mailLog?.[0].providerId).toMatch(/^re_/);
    expect(gespeichert.timeline.at(-1)?.message).toBe('Eingangsbestätigung per E-Mail versendet.');
  });

  it('meldet eine gescheiterte Kundenmail als Hinweis — die Betriebsmail geht trotzdem', async () => {
    mailEinrichten();
    // Kunde zuerst gesendet: 422; Betrieb: 200
    antworten = [{ status: 422, body: { name: 'validation_error' } }];
    const hinweise = await benachrichtigeNeuerVorgang({ saved: vorgang(), token: 'tok', settings: ECHTE_FIRMA });
    expect(hinweise).toEqual([MAIL_NICHT_VERSENDET]);
    expect(gespeichert.mailLog?.find((m) => m.kind === 'eingang-kunde')).toMatchObject({ result: 'fehlgeschlagen', error: 'HTTP 422 (validation_error)' });
    expect(gespeichert.mailLog?.find((m) => m.kind === 'eingang-team')?.result).toBe('gesendet');
    expect(gespeichert.timeline).toHaveLength(0);
  });

  it('schickt ohne Team-Adresse und mit Platzhalter-Firma keine Betriebsmail', async () => {
    mailEinrichten();
    vi.stubEnv('MAIL_TEAM_ADDRESS', '');
    await benachrichtigeNeuerVorgang({ saved: vorgang(), token: 'tok', settings: defaults.settings() });
    expect(aufrufe).toHaveLength(1);
    expect(aufrufe[0].antwortAn).toBeUndefined();
  });
});

describe('benachrichtigeZahlung', () => {
  it('informiert bei Zahlungseingang Kunde und Betrieb und bestätigt den Vertrag', async () => {
    mailEinrichten();
    await benachrichtigeZahlung({ vorgang: vorgang(), mail: { art: 'bezahlt' }, ereignisId: 'evt_1' });
    expect(aufrufe.map((a) => a.betreff)).toEqual([
      'Zahlung erhalten – SM24-T-2026-0007',
      'Bezahlt: Termin SM24-T-2026-0007',
      'Vertragsbestätigung – SM24-T-2026-0007',
    ]);
    expect(aufrufe[2]).toMatchObject({ an: ['erika@example.org'], schluessel: 'lokal-SM24-T-2026-0007-vertrag' });
    expect(gespeichert.mailLog?.map((m) => m.kind)).toEqual(['zahlung-erhalten', 'zahlung-erhalten', 'vertrag']);
  });

  it('sendet die Vertragsbestätigung nur einmal', async () => {
    mailEinrichten();
    const schonBestaetigt: BusinessRecord = {
      ...vorgang(),
      mailLog: [{ kind: 'vertrag', to: 'erika@example.org', at: '2026-10-24T10:05:00.000Z', result: 'gesendet' }],
    };
    gespeichert = schonBestaetigt;
    await benachrichtigeZahlung({ vorgang: schonBestaetigt, mail: { art: 'bezahlt' }, ereignisId: 'evt_9' });
    expect(aufrufe.map((a) => a.betreff)).not.toContain('Vertragsbestätigung – SM24-T-2026-0007');
    expect(gespeichert.mailLog?.filter((m) => m.kind === 'vertrag')).toHaveLength(1);
  });

  it('meldet einen verfallenen Termin dem Kunden', async () => {
    mailEinrichten();
    await benachrichtigeZahlung({ vorgang: vorgang(), mail: { art: 'nicht-abgeschlossen', terminFreigegeben: true }, ereignisId: 'evt_2' });
    expect(aufrufe).toHaveLength(1);
    expect(aufrufe[0].an).toEqual(['erika@example.org']);
    expect(aufrufe[0].schluessel).toBe('lokal-SM24-T-2026-0007-zahlung-nicht-abgeschlossen-evt_2');
  });
});

describe('sendeWiderrufEingang', () => {
  it('liefert das Ergebnis für die Ablage', async () => {
    mailEinrichten();
    const eintrag = await sendeWiderrufEingang({ an: 'erika@example.org', eingegangenAm: '2026-10-24T10:00:00.000Z', vorgangsnummer: 'SM24-B-2026-0001' });
    expect(eintrag).toMatchObject({ kind: 'widerruf', to: 'erika@example.org', result: 'gesendet' });
    expect(aufrufe[0].betreff).toBe('Eingang Ihrer Widerrufserklärung');
  });

  it('meldet ohne Einrichtung „nicht eingerichtet“', async () => {
    const eintrag = await sendeWiderrufEingang({ an: 'erika@example.org', eingegangenAm: '2026-10-24T10:00:00.000Z' });
    expect(eintrag.result).toBe('nicht-eingerichtet');
  });
});

describe('sendeWiderrufBetrieb', () => {
  it('meldet den Widerruf an die Team-Adresse mit Link ins Backend', async () => {
    mailEinrichten();
    const eintrag = await sendeWiderrufBetrieb({
      widerrufId: 7,
      name: 'Erika Muster',
      email: 'erika@example.org',
      vorgangsnummer: 'SM24-B-2026-0042',
      eingegangenAm: '2026-10-24T12:30:05.000Z',
      zugeordnet: true,
      angaben: 'Bestellung vom 20.10.',
      settings: ECHTE_FIRMA,
    });
    expect(eintrag).toMatchObject({ kind: 'widerruf', result: 'gesendet' });
    expect(aufrufe).toHaveLength(1);
    expect(aufrufe[0]).toMatchObject({
      an: ['team@schluesselmacher24.de', 'inhaber@schluesselmacher24.de'],
      betreff: 'Widerruf eingegangen: SM24-B-2026-0042',
    });
  });

  it('versendet ohne Einrichtung nichts', async () => {
    const fetchSpion = vi.fn();
    vi.stubGlobal('fetch', fetchSpion);
    expect(
      await sendeWiderrufBetrieb({ widerrufId: 1, name: 'A', email: 'a@example.org', eingegangenAm: '2026-10-24T12:30:05.000Z', zugeordnet: false }),
    ).toBeNull();
    expect(fetchSpion).not.toHaveBeenCalled();
  });
});
