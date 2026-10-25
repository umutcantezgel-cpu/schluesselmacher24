import type Stripe from 'stripe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAppointments, getRecord, vorgangAendern, vorgangAnlegen, type NeuerVorgang } from '@/lib/data';
import { benachrichtigeNeuerVorgang } from '@/lib/server/benachrichtigungen';
import { defaults } from '@/lib/data/defaults';
import type { BusinessRecord } from '@/lib/types';

import { VERLAUF } from './uebergaenge';
import { sitzungVerbuchen } from './verbuchen';

/* Gegen die Testdatenbank: Webhook, Rückkehr und Abgleich verbuchen dieselbe
 * Zahlung genau einmal — auch gleichzeitig —, und ein verfallener Termin gibt
 * sein Zeitfenster frei. */

let laufend = 0;
const STAND = '2026-10-24T10:00:00.000Z';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function terminMitSitzung(datum: string): Promise<{ vorgang: BusinessRecord; sitzung: string }> {
  laufend += 1;
  const angelegt = await vorgangAnlegen({
    art: 'termin',
    jahr: 2082,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      appointment: { date: datum, time: '09:00', durationMinutes: 60, location: 'werkstatt' },
      payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen' },
      internalNotes: [],
      timeline: [{ at: STAND, actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
      accessTokenHash: 'b'.repeat(64),
    }),
  });
  const sitzung = `cs_test_${process.pid}_${Date.now()}_${laufend}`;
  const vorgang = await vorgangAendern(angelegt.id, (v) => ({ payment: { ...v.payment!, checkoutSessionId: sitzung } }));
  return { vorgang: vorgang!, sitzung };
}

function session(vorgang: BusinessRecord, id: string, teil: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session {
  return {
    id,
    object: 'checkout.session',
    mode: 'payment',
    status: 'complete',
    payment_status: 'paid',
    payment_intent: `pi_${id}`,
    amount_total: 6990,
    currency: 'eur',
    client_reference_id: vorgang.id,
    metadata: { vorgangId: vorgang.id, nummer: vorgang.reference, art: 'termin', umgebung: 'lokal' },
    ...teil,
  } as Stripe.Checkout.Session;
}

describe('sitzungVerbuchen', () => {
  it('bucht Webhook und Rückkehr gleichzeitig genau einmal', async () => {
    const { vorgang, sitzung } = await terminMitSitzung('2082-03-02');
    const s = session(vorgang, sitzung);

    const ergebnisse = await Promise.all([
      sitzungVerbuchen(`evt_${sitzung}`, 'checkout.session.completed', s),
      sitzungVerbuchen(`rueckkehr:${sitzung}`, 'checkout.session.completed', s),
      sitzungVerbuchen(`evt_${sitzung}`, 'checkout.session.completed', s),
    ]);
    const namen = ergebnisse.map((e) => e.ergebnis).sort();
    expect(namen).toEqual(['bezahlt', 'doppelt', 'ignoriert']);
    expect(ergebnisse.filter((e) => e.mail)).toHaveLength(1);

    const gespeichert = await getRecord(vorgang.id);
    expect(gespeichert?.payment).toMatchObject({ status: 'bezahlt', providerRef: `pi_${sitzung}`, checkoutSessionId: sitzung });
    expect(gespeichert?.timeline.filter((e) => e.message === VERLAUF.anzahlung)).toHaveLength(1);
  });

  it('gibt bei abgelaufener Sitzung das Zeitfenster frei', async () => {
    const datum = '2082-03-03';
    const { vorgang, sitzung } = await terminMitSitzung(datum);
    expect((await getAppointments(datum, datum)).map((r) => r.id)).toContain(vorgang.id);

    const verbucht = await sitzungVerbuchen(
      `evt_abgelaufen_${sitzung}`,
      'checkout.session.expired',
      session(vorgang, sitzung, { status: 'expired', payment_status: 'unpaid', payment_intent: null }),
    );
    expect(verbucht.ergebnis).toBe('termin-freigegeben');
    expect(verbucht.mail).toEqual({ art: 'nicht-abgeschlossen', terminFreigegeben: true });
    expect((await getAppointments(datum, datum)).map((r) => r.id)).not.toContain(vorgang.id);

    const gespeichert = await getRecord(vorgang.id);
    expect(gespeichert).toMatchObject({ status: 'storniert', payment: { status: 'fehlgeschlagen' } });
  });

  it('bucht keine Sitzung aus einer anderen Umgebung', async () => {
    const { vorgang } = await terminMitSitzung('2082-03-04');
    const fremd = session(vorgang, `cs_fremd_${vorgang.id}`, {
      metadata: { vorgangId: vorgang.id, nummer: vorgang.reference, art: 'termin', umgebung: 'production' },
    });
    const verbucht = await sitzungVerbuchen(`evt_fremd_${vorgang.id}`, 'checkout.session.completed', fremd);
    expect(verbucht.ergebnis).toBe('kein-vorgang');
    expect((await getRecord(vorgang.id))?.payment?.status).toBe('offen');
  });
});

describe('benachrichtigeNeuerVorgang', () => {
  it('schreibt das Mailprotokoll an den gespeicherten Vorgang, ohne anderes zu verlieren', async () => {
    vi.stubEnv('MAIL_PROVIDER', 'resend');
    vi.stubEnv('MAIL_API_KEY', 're_test');
    vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
    vi.stubEnv('MAIL_TEAM_ADDRESS', 'team@schluesselmacher24.de');
    let nummer = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        nummer += 1;
        return new Response(JSON.stringify({ id: `re_db_${nummer}` }), { status: 200 });
      }),
    );

    const { vorgang } = await terminMitSitzung('2082-03-05');
    const hinweise = await benachrichtigeNeuerVorgang({ saved: vorgang, token: 'tok', settings: defaults.settings() });
    expect(hinweise).toEqual([]);

    const gespeichert = await getRecord(vorgang.id);
    expect(gespeichert?.mailLog?.map((m) => [m.kind, m.result]).sort()).toEqual([
      ['eingang-kunde', 'gesendet'],
      ['eingang-team', 'gesendet'],
    ]);
    expect(gespeichert?.payment?.checkoutSessionId).toBe(vorgang.payment?.checkoutSessionId);
    expect(gespeichert?.timeline.at(-1)?.message).toBe('Eingangsbestätigung per E-Mail versendet.');
  });
});
