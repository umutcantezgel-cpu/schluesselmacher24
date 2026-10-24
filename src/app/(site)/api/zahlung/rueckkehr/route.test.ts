import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAccessToken } from '@/lib/server/access-token';
import type { BusinessRecord } from '@/lib/types';

/* Rückkehr von der Zahlungsseite. Stripe, Datenschicht und Ratenbegrenzung
 * sind ersetzt. */

const { token, hash } = createAccessToken();
const zustand = { erlaubt: true, record: null as BusinessRecord | null };

vi.mock('@/lib/server/rate-limit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/rate-limit')>()),
  allowRequest: vi.fn(async () => zustand.erlaubt),
}));
vi.mock('@/lib/data', () => ({ getRecord: async (id: string) => (zustand.record?.id === id ? zustand.record : null) }));
vi.mock('@/lib/integrations', () => ({ paymentStatus: () => ({ configured: true }) }));

const abrufen = vi.fn();
vi.mock('@/lib/integrations/stripe', () => ({ checkoutAbrufen: (id: string) => abrufen(id) }));

const verbuchen = vi.fn();
vi.mock('@/lib/zahlung/verbuchen', () => ({ sitzungVerbuchen: (...args: unknown[]) => verbuchen(...args) }));

const zahlungsmail = vi.fn(async () => {});
vi.mock('@/lib/server/benachrichtigungen', () => ({
  benachrichtigeZahlung: (...args: unknown[]) => zahlungsmail(...(args as [])),
  nachDerAntwort: async (arbeit: () => Promise<unknown>) => {
    await arbeit();
  },
}));

const { GET } = await import('./route');

function record(): BusinessRecord {
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
    accessTokenHash: hash,
  };
}

const aufruf = (query: string) => GET(new Request(`https://schluesselmacher24.de/api/zahlung/rueckkehr?${query}`));

beforeEach(() => {
  zustand.erlaubt = true;
  zustand.record = record();
  abrufen.mockReset();
  verbuchen.mockReset();
  zahlungsmail.mockClear();
  abrufen.mockResolvedValue({ id: 'cs_test_1', status: 'complete', client_reference_id: '7', metadata: { vorgangId: '7' } });
  verbuchen.mockResolvedValue({ ergebnis: 'bezahlt', vorgang: record(), mail: { art: 'bezahlt' } });
});

describe('GET /api/zahlung/rueckkehr', () => {
  it('verbucht die abgeschlossene Sitzung und leitet per 303 zur Bestellseite', async () => {
    const response = await aufruf(`id=7&t=${token}&session_id=cs_test_1`);
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(`https://schluesselmacher24.de/bestellung/7?t=${token}&rueckkehr=1`);
    expect(verbuchen).toHaveBeenCalledWith('rueckkehr:cs_test_1', 'checkout.session.completed', expect.objectContaining({ id: 'cs_test_1' }));
    expect(zahlungsmail).toHaveBeenCalledWith(expect.objectContaining({ ereignisId: 'rueckkehr:cs_test_1' }));
  });

  it('prüft den Link-Schlüssel, bevor Stripe gefragt wird', async () => {
    const response = await aufruf('id=7&t=falsch&session_id=cs_test_1');
    expect(response.status).toBe(404);
    expect(abrufen).not.toHaveBeenCalled();
    expect((await aufruf(`id=abc&t=${token}`)).status).toBe(404);
  });

  it('verbucht keine fremde Sitzung', async () => {
    abrufen.mockResolvedValue({ id: 'cs_test_9', status: 'complete', client_reference_id: '8', metadata: { vorgangId: '8' } });
    const response = await aufruf(`id=7&t=${token}&session_id=cs_test_9`);
    expect(response.status).toBe(303);
    expect(verbuchen).not.toHaveBeenCalled();
  });

  it('fragt bei Überlast oder ungültiger Sitzungskennung nicht bei Stripe nach', async () => {
    zustand.erlaubt = false;
    expect((await aufruf(`id=7&t=${token}&session_id=cs_test_1`)).status).toBe(303);
    zustand.erlaubt = true;
    expect((await aufruf(`id=7&t=${token}&session_id={CHECKOUT_SESSION_ID}`)).status).toBe(303);
    expect(abrufen).not.toHaveBeenCalled();
  });

  it('leitet auch weiter, wenn Stripe nicht antwortet', async () => {
    abrufen.mockRejectedValue(new Error('Netzwerk'));
    const response = await aufruf(`id=7&t=${token}&session_id=cs_test_1`);
    expect(response.status).toBe(303);
  });
});
