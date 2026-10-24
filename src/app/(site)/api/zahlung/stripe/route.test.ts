import Stripe from 'stripe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Zahlungsereignis } from '@/lib/data';
import type { BusinessRecord } from '@/lib/types';

/* Der Webhook so, wie Stripe ihn aufruft — mit echter Signatur. Die
 * Datenschicht ist ersetzt; Verbuchung und Idempotenz gegen die Datenbank
 * prüft src/lib/zahlung/verbuchen.db.test.ts. */

const GEHEIMNIS = 'whsec_test_geheimnis';

let gespeichert: BusinessRecord;
const verbuchteIds = new Set<string>();
const zustand = { fehler: false };

function termin(): BusinessRecord {
  return {
    id: '7',
    reference: 'SM24-T-2026-0007',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-10-24T11:00:00.000Z',
    updatedAt: '2026-10-24T11:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen', checkoutSessionId: 'cs_test_1' },
  };
}

const verbuchen = vi.fn(async (ereignis: Zahlungsereignis) => {
  if (zustand.fehler) throw new Error('Datenbank weg');
  if (verbuchteIds.has(ereignis.ereignisId)) return { ergebnis: 'doppelt' };
  verbuchteIds.add(ereignis.ereignisId);
  const wirkung = ereignis.anwenden(gespeichert);
  if (!wirkung) return { ergebnis: 'ignoriert', vorgang: gespeichert };
  if (wirkung.aenderung) gespeichert = { ...gespeichert, ...wirkung.aenderung };
  return { ergebnis: wirkung.ergebnis, vorgang: gespeichert };
});

vi.mock('@/lib/data', () => ({
  zahlungsereignisVerbuchen: (e: Zahlungsereignis) => verbuchen(e),
  findeVorgangFuerZahlung: async () => null,
}));

const zahlungsmail = vi.fn(async () => {});
vi.mock('@/lib/server/benachrichtigungen', () => ({
  benachrichtigeZahlung: (...args: unknown[]) => zahlungsmail(...(args as [])),
  nachDerAntwort: async (arbeit: () => Promise<unknown>) => {
    await arbeit().catch(() => undefined);
  },
}));

const { POST } = await import('./route');

function ereignis(typ: string, objekt: Record<string, unknown>, id = `evt_${Math.random().toString(36).slice(2)}`) {
  return JSON.stringify({ id, object: 'event', type: typ, api_version: '2026-08-26.dahlia', data: { object: objekt } });
}

function sitzung(teil: Record<string, unknown> = {}) {
  return {
    id: 'cs_test_1',
    object: 'checkout.session',
    mode: 'payment',
    status: 'complete',
    payment_status: 'paid',
    payment_intent: 'pi_test_1',
    amount_total: 6990,
    currency: 'eur',
    metadata: { vorgangId: '7', nummer: 'SM24-T-2026-0007', art: 'termin', umgebung: 'lokal' },
    ...teil,
  };
}

function anfrage(body: string, signatur: string | null = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: GEHEIMNIS })) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (signatur !== null) headers['stripe-signature'] = signatur;
  return new Request('http://localhost:3000/api/zahlung/stripe', { method: 'POST', body, headers });
}

beforeEach(() => {
  gespeichert = termin();
  verbuchteIds.clear();
  zustand.fehler = false;
  verbuchen.mockClear();
  zahlungsmail.mockClear();
  vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
  vi.stubEnv('PAYMENT_API_KEY', 'sk_test_123');
  vi.stubEnv('PAYMENT_WEBHOOK_SECRET', GEHEIMNIS);
  vi.stubEnv('DATABASE_URL', 'postgres://test@localhost/test');
  vi.stubEnv('SM24_DATA', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/zahlung/stripe', () => {
  it('antwortet ohne Einrichtung mit 503', async () => {
    vi.stubEnv('PAYMENT_WEBHOOK_SECRET', '');
    const response = await POST(anfrage(ereignis('checkout.session.completed', sitzung())));
    expect(response.status).toBe(503);
    expect(verbuchen).not.toHaveBeenCalled();
  });

  it('lehnt fehlende und falsche Signaturen mit 400 ohne Details ab', async () => {
    const body = ereignis('checkout.session.completed', sitzung());
    const ohne = await POST(anfrage(body, null));
    expect(ohne.status).toBe(400);
    const falsch = await POST(anfrage(body, Stripe.webhooks.generateTestHeaderString({ payload: body, secret: 'whsec_falsch' })));
    expect(falsch.status).toBe(400);
    expect(await falsch.json()).toEqual({ error: 'Ungültige Anfrage.' });
    // Veränderter Körper mit alter Signatur
    const signatur = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: GEHEIMNIS });
    const veraendert = await POST(anfrage(body.replace('6990', '1'), signatur));
    expect(veraendert.status).toBe(400);
    expect(verbuchen).not.toHaveBeenCalled();
  });

  it('verbucht eine bezahlte Sitzung einmal und schickt die Zahlungsmail', async () => {
    const body = ereignis('checkout.session.completed', sitzung(), 'evt_bezahlt');
    const response = await POST(anfrage(body));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ erhalten: true, ergebnis: 'bezahlt' });
    expect(verbuchen.mock.calls[0][0]).toMatchObject({
      ereignisId: 'evt_bezahlt',
      typ: 'checkout.session.completed',
      anbieter: 'stripe',
      finde: { vorgangId: '7' },
    });
    expect(gespeichert.payment).toMatchObject({ status: 'bezahlt', providerRef: 'pi_test_1' });
    expect(zahlungsmail).toHaveBeenCalledTimes(1);
    expect(zahlungsmail.mock.calls[0]).toEqual([expect.objectContaining({ mail: { art: 'bezahlt' }, ereignisId: 'evt_bezahlt' })]);

    // Stripe stellt dasselbe Ereignis erneut zu: 200, keine zweite Mail.
    const nochmal = await POST(anfrage(body));
    expect(nochmal.status).toBe(200);
    expect(await nochmal.json()).toEqual({ erhalten: true, ergebnis: 'doppelt' });
    expect(zahlungsmail).toHaveBeenCalledTimes(1);
  });

  it('sucht Sitzungen aus einer anderen Umgebung nur über die Sitzungskennung', async () => {
    const body = ereignis('checkout.session.completed', sitzung({ metadata: { vorgangId: '7', nummer: 'SM24-T-2026-0007', umgebung: 'production' } }));
    await POST(anfrage(body));
    expect(verbuchen.mock.calls[0][0].finde).toEqual({ checkoutSitzung: 'cs_test_1' });
  });

  it('gibt bei Ablauf einen neuen Termin frei', async () => {
    const response = await POST(anfrage(ereignis('checkout.session.expired', sitzung({ status: 'expired', payment_status: 'unpaid' }))));
    expect(await response.json()).toEqual({ erhalten: true, ergebnis: 'termin-freigegeben' });
    expect(gespeichert.status).toBe('storniert');
    expect(zahlungsmail.mock.calls[0]).toEqual([
      expect.objectContaining({ mail: { art: 'nicht-abgeschlossen', terminFreigegeben: true } }),
    ]);
  });

  it('quittiert unbekannte Ereignisse mit 200', async () => {
    const response = await POST(anfrage(ereignis('customer.created', { id: 'cus_1', object: 'customer' })));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ erhalten: true, verarbeitet: false });
    expect(verbuchen).not.toHaveBeenCalled();
  });

  it('antwortet 500, wenn das Verbuchen scheitert — Stripe stellt dann erneut zu', async () => {
    zustand.fehler = true;
    const response = await POST(anfrage(ereignis('checkout.session.completed', sitzung())));
    expect(response.status).toBe(500);
    expect(zahlungsmail).not.toHaveBeenCalled();
  });

  it('bleibt bei 200, wenn die Mail scheitert', async () => {
    zahlungsmail.mockRejectedValueOnce(new Error('Resend weg'));
    const response = await POST(anfrage(ereignis('checkout.session.completed', sitzung())));
    expect(response.status).toBe(200);
  });

  it('weist zu große Körper ab', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/zahlung/stripe', {
        method: 'POST',
        body: 'x'.repeat(600 * 1024),
        headers: { 'stripe-signature': 't=1,v1=abc' },
      }),
    );
    expect(response.status).toBe(413);
  });
});
