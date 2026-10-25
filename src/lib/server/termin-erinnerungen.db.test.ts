import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getRecord, vorgangAendern, vorgangAnlegen, type NeuerVorgang } from '@/lib/data';
import type { BusinessRecord, PaymentInfo, RecordStatus } from '@/lib/types';

import { terminErinnerungenSenden } from './termin-erinnerungen';

/* Gegen die Testdatenbank, wie der tägliche Cron sie aufruft: Erinnerung an
 * die Termine von morgen (Einstellung 1 Tag, Standard), kein Doppelversand
 * bei einem zweiten Lauf, erneute Erinnerung nach einer Verschiebung. Resend
 * ist ersetzt. Eigenes Jahr (2084), damit kein anderer Test dazwischenfunkt. */

const STAND = '2084-04-01T10:00:00.000Z';
/** 02:17 UTC wie der Cron — in Berlin (Sommerzeit) 04:17 Uhr am 9. Mai. */
const LAUF = new Date('2084-05-09T02:17:00.000Z');

interface Sendung {
  an: string[];
  betreff: string;
  schluessel?: string;
  anhaenge: Array<{ filename: string; content: string; content_type?: string }>;
}
const sendungen: Sendung[] = [];

beforeEach(() => {
  sendungen.length = 0;
  vi.stubEnv('MAIL_PROVIDER', 'resend');
  vi.stubEnv('MAIL_API_KEY', 're_test');
  vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
  vi.stubEnv('MAIL_TEAM_ADDRESS', 'team@schluesselmacher24.de');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string);
      sendungen.push({
        an: body.to,
        betreff: body.subject,
        schluessel: (init.headers as Record<string, string>)['Idempotency-Key'],
        anhaenge: body.attachments ?? [],
      });
      return new Response(JSON.stringify({ id: `re_erinnerung_${sendungen.length}` }), { status: 200 });
    }),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function termin(
  datum: string,
  status: RecordStatus,
  zahlung: PaymentInfo['status'] | null,
  email: string,
): Promise<BusinessRecord> {
  return vorgangAnlegen({
    art: 'termin',
    jahr: 2084,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status,
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email, phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      quote: { mode: 'fest', priceCents: 24900, depositCents: 6990, remainderCents: 17910, slotMinutes: 60, leadTimeDays: 7, requiresVehicleOnSite: true },
      appointment: { date: datum, time: '10:00', durationMinutes: 60, location: 'werkstatt' },
      ...(zahlung ? { payment: { scope: 'anzahlung' as const, amountCents: 6990, status: zahlung } } : {}),
      internalNotes: [],
      timeline: [],
    }),
  });
}

describe('terminErinnerungenSenden', () => {
  it('erinnert an die Termine von morgen, einmal, und nach einer Verschiebung erneut', async () => {
    const bezahlt = await termin('2084-05-10', 'neu', 'bezahlt', 'bezahlt@example.org');
    const telefonisch = await termin('2084-05-10', 'terminiert', null, 'telefon@example.org');
    await termin('2084-05-10', 'neu', 'offen', 'offen@example.org');
    await termin('2084-05-10', 'storniert', 'fehlgeschlagen', 'storniert@example.org');
    const uebermorgen = await termin('2084-05-11', 'neu', 'bezahlt', 'uebermorgen@example.org');

    // Erster Lauf: zwei Erinnerungen (bezahlt, terminiert), nicht offen, storniert oder übermorgen.
    const erster = await terminErinnerungenSenden(LAUF);
    expect(erster).toEqual({ tageVorher: 1, termintag: '2084-05-10', termine: 2, gesendet: 2, bereitsErinnert: 0, fehlgeschlagen: 0 });
    expect(sendungen.map((s) => s.an[0]).sort()).toEqual(['bezahlt@example.org', 'telefon@example.org']);
    const mail = sendungen.find((s) => s.an[0] === 'bezahlt@example.org')!;
    expect(mail.betreff).toBe(`Erinnerung an Ihren Termin am 10.05.2084 um 10:00 Uhr – ${bezahlt.reference}`);
    expect(mail.schluessel).toBe(`lokal-${bezahlt.reference}-erinnerung-2084-05-10-10:00`);
    expect(mail.anhaenge).toHaveLength(1);
    expect(mail.anhaenge[0].filename).toBe(`termin-${bezahlt.reference}.ics`);
    const ics = Buffer.from(mail.anhaenge[0].content, 'base64').toString('utf8');
    // 10:00 Uhr Sommerzeit = 08:00 UTC; Werkstatt aus den Firmendaten des Seeds.
    expect(ics).toContain('DTSTART:20840510T080000Z');
    expect(ics.replace(/\r\n /g, '')).toContain('Langgasse 70\\, 35576 Wetzlar');

    const gespeichert = await getRecord(bezahlt.id);
    expect(gespeichert?.mailLog?.map((m) => [m.kind, m.result, m.to])).toEqual([['erinnerung', 'gesendet', 'bezahlt@example.org']]);
    expect(gespeichert?.timeline.at(-1)?.message).toBe('Terminerinnerung per E-Mail versendet.');
    expect((await getRecord(telefonisch.id))?.mailLog?.[0]?.kind).toBe('erinnerung');

    // Zweiter Lauf am selben Tag: nichts doppelt.
    sendungen.length = 0;
    const zweiter = await terminErinnerungenSenden(new Date('2084-05-09T09:00:00.000Z'));
    expect(zweiter).toMatchObject({ termine: 2, gesendet: 0, bereitsErinnert: 2 });
    expect(sendungen).toHaveLength(0);
    expect((await getRecord(bezahlt.id))?.mailLog).toHaveLength(1);

    // Verschoben auf den 11.05.: am 10.05. erneut erinnern — zusammen mit dem Termin von übermorgen.
    await vorgangAendern(bezahlt.id, (v) => ({ appointment: { ...v.appointment!, date: '2084-05-11', time: '14:00' } }));
    const naechsterTag = await terminErinnerungenSenden(new Date('2084-05-10T02:17:00.000Z'));
    expect(naechsterTag).toMatchObject({ termintag: '2084-05-11', termine: 2, gesendet: 2, bereitsErinnert: 0 });
    expect(sendungen.map((s) => s.an[0]).sort()).toEqual(['bezahlt@example.org', 'uebermorgen@example.org']);
    expect(sendungen.find((s) => s.an[0] === 'bezahlt@example.org')?.schluessel).toBe(
      `lokal-${bezahlt.reference}-erinnerung-2084-05-11-14:00`,
    );
    expect((await getRecord(bezahlt.id))?.mailLog?.filter((m) => m.kind === 'erinnerung')).toHaveLength(2);
    expect((await getRecord(uebermorgen.id))?.mailLog?.[0]?.kind).toBe('erinnerung');
  });

  it('ohne Mailversand nichts senden und nichts protokollieren', async () => {
    vi.stubEnv('MAIL_PROVIDER', '');
    const vorgang = await termin('2084-06-02', 'terminiert', 'bezahlt', 'ohne-mail@example.org');
    const ergebnis = await terminErinnerungenSenden(new Date('2084-06-01T02:17:00.000Z'));
    expect(ergebnis).toMatchObject({ termine: 1, gesendet: 0, fehlgeschlagen: 0, mailNichtEingerichtet: true });
    expect(sendungen).toHaveLength(0);
    expect((await getRecord(vorgang.id))?.mailLog).toBeUndefined();
  });

  it('meldet eine abgelehnte Mail als Fehlschlag und versucht es beim nächsten Lauf erneut', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ name: 'validation_error' }), { status: 422 })));
    const log = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const vorgang = await termin('2084-07-02', 'terminiert', null, 'abgelehnt@example.org');
    const ergebnis = await terminErinnerungenSenden(new Date('2084-07-01T02:17:00.000Z'));
    expect(ergebnis).toMatchObject({ termine: 1, gesendet: 0, fehlgeschlagen: 1 });
    expect((await getRecord(vorgang.id))?.mailLog?.[0]).toMatchObject({ kind: 'erinnerung', result: 'fehlgeschlagen' });
    // Eine gescheiterte Erinnerung zählt nicht als versendet.
    const nochmal = await terminErinnerungenSenden(new Date('2084-07-01T09:00:00.000Z'));
    expect(nochmal).toMatchObject({ bereitsErinnert: 0, fehlgeschlagen: 1 });
    log.mockRestore();
  });
});
