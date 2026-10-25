import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VorgangsAenderung } from '@/lib/data';
import { createAccessToken } from '@/lib/server/access-token';
import type { BusinessRecord, PaymentInfo } from '@/lib/types';

/* „Jetzt bezahlen“ auf der Bestellseite — Stripe und Datenschicht ersetzt. */

const { token, hash } = createAccessToken();
let gespeichert: BusinessRecord | null = null;

vi.mock('@/lib/server/rate-limit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/rate-limit')>()),
  allowRequest: vi.fn(async () => true),
}));
vi.mock('@/lib/data', () => ({
  getRecord: async (id: string) => (gespeichert?.id === id ? gespeichert : null),
  vorgangAendern: async (id: string, aendern: (v: BusinessRecord) => VorgangsAenderung | null) => {
    if (!gespeichert || gespeichert.id !== id) return null;
    const aenderung = aendern(gespeichert);
    if (aenderung) gespeichert = { ...gespeichert, ...aenderung };
    return gespeichert;
  },
}));

const zahlungStarten = vi.fn();
vi.mock('@/lib/integrations', () => ({
  paymentStatus: () => ({ configured: true }),
  createPayment: (...args: unknown[]) => zahlungStarten(...args),
}));
const abrufen = vi.fn();
vi.mock('@/lib/integrations/stripe', () => ({ checkoutAbrufen: (id: string) => abrufen(id) }));
const verbuchen = vi.fn(async () => ({ ergebnis: 'bezahlt' }));
vi.mock('@/lib/zahlung/verbuchen', () => ({ sitzungVerbuchen: (...args: unknown[]) => verbuchen(...(args as [])) }));

const { zahlungFortsetzen } = await import('./zahlung');

function vorgang(teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-B-2026-0007',
    kind: 'bestellung',
    area: 'schluessel-nach-code',
    process: 'direktkauf',
    status: 'neu',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    lines: [{ kind: 'standard', productId: 'a', label: 'Artikel', details: 'Code 4711', qty: 1, unitPriceCents: 2580, totalCents: 2580, vatPercent: 19 }],
    totals: { itemsCents: 2580, shippingCents: 490, totalCents: 3070, vatCents: 490, shippingLabel: 'Brief' },
    payment: { scope: 'gesamt', amountCents: 3070, status: 'offen', checkoutSessionId: 'cs_alt', ...zahlung },
    accessTokenHash: hash,
    ...teil,
  };
}

beforeEach(() => {
  gespeichert = vorgang();
  zahlungStarten.mockReset();
  abrufen.mockReset();
  verbuchen.mockClear();
});

describe('zahlungFortsetzen', () => {
  it('lehnt einen falschen Link-Schlüssel ab', async () => {
    expect(await zahlungFortsetzen({ recordId: '42', token: 'falsch' })).toMatchObject({ ok: false });
    expect(abrufen).not.toHaveBeenCalled();
  });

  it('nutzt eine offene Zahlungsseite weiter, statt eine zweite anzulegen', async () => {
    abrufen.mockResolvedValue({ id: 'cs_alt', status: 'open', url: 'https://checkout.stripe.com/c/pay/cs_alt' });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toEqual({ ok: true, url: 'https://checkout.stripe.com/c/pay/cs_alt' });
    expect(zahlungStarten).not.toHaveBeenCalled();
  });

  it('startet bei abgelaufener Bestellung eine neue Sitzung und speichert sie', async () => {
    abrufen.mockResolvedValue({ id: 'cs_alt', status: 'expired', url: null });
    zahlungStarten.mockResolvedValue({
      status: 'offen',
      checkoutSessionId: 'cs_neu',
      expiresAt: '2026-10-25T10:00:00.000Z',
      redirectUrl: 'https://checkout.stripe.com/c/pay/cs_neu',
      message: '',
    });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toEqual({ ok: true, url: 'https://checkout.stripe.com/c/pay/cs_neu' });
    expect(zahlungStarten.mock.calls[0][0]).toMatchObject({
      recordId: '42',
      reference: 'SM24-B-2026-0007',
      recordKind: 'bestellung',
      amountCents: 3070,
      accessToken: token,
      shipping: { label: 'Brief', cents: 490 },
    });
    expect(gespeichert?.payment).toMatchObject({ checkoutSessionId: 'cs_neu', expiresAt: '2026-10-25T10:00:00.000Z', status: 'offen' });
    expect(gespeichert?.timeline.at(-1)?.message).toBe('Online-Zahlung erneut gestartet.');
  });

  it('verlangt beim abgelaufenen Termin eine neue Buchung', async () => {
    gespeichert = vorgang({ kind: 'termin', reference: 'SM24-T-2026-0001', lines: undefined, totals: undefined }, { scope: 'anzahlung' });
    abrufen.mockResolvedValue({ id: 'cs_alt', status: 'expired', url: null });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toEqual({
      ok: false,
      meldung: 'Die Reservierung ist abgelaufen – bitte buchen Sie den Termin neu.',
      neuBuchen: '/autoschluessel/anfrage',
    });
    expect(zahlungStarten).not.toHaveBeenCalled();
  });

  it('startet beim frischen Termin ohne Sitzung die Zahlung', async () => {
    gespeichert = vorgang({ kind: 'termin', lines: undefined, totals: undefined }, { scope: 'anzahlung', checkoutSessionId: undefined });
    zahlungStarten.mockResolvedValue({ status: 'offen', checkoutSessionId: 'cs_t', redirectUrl: 'https://checkout.stripe.com/c/pay/cs_t', message: '' });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toMatchObject({ ok: true });
  });

  it('meldet „bereits bezahlt“ und verbucht eine abgeschlossene Sitzung', async () => {
    abrufen.mockResolvedValue({ id: 'cs_alt', status: 'complete', payment_status: 'paid', url: null });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toEqual({ ok: false, meldung: 'Ihre Zahlung ist bereits eingegangen.' });
    expect(verbuchen).toHaveBeenCalledWith('rueckkehr:cs_alt', 'checkout.session.completed', expect.anything());

    gespeichert = vorgang({}, { status: 'bezahlt' });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toEqual({ ok: false, meldung: 'Dieser Vorgang ist bereits bezahlt.' });
  });

  it('startet nach gescheiterter Lastschrift eine neue Sitzung, statt „eingeleitet“ zu melden', async () => {
    // Stripe lässt die Sitzung nach async_payment_failed auf complete/unpaid stehen.
    gespeichert = vorgang({}, { status: 'fehlgeschlagen' });
    abrufen.mockResolvedValue({ id: 'cs_alt', status: 'complete', payment_status: 'unpaid', url: null });
    zahlungStarten.mockResolvedValue({ status: 'offen', checkoutSessionId: 'cs_neu', redirectUrl: 'https://checkout.stripe.com/c/pay/cs_neu', message: '' });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toEqual({ ok: true, url: 'https://checkout.stripe.com/c/pay/cs_neu' });
    expect(verbuchen).not.toHaveBeenCalled();
    expect(gespeichert?.payment).toMatchObject({ status: 'offen', checkoutSessionId: 'cs_neu' });

    // Ein Termin muss dagegen neu gebucht werden.
    gespeichert = vorgang({ kind: 'termin', lines: undefined, totals: undefined }, { scope: 'anzahlung', status: 'fehlgeschlagen' });
    zahlungStarten.mockClear();
    expect(await zahlungFortsetzen({ recordId: '42', token })).toMatchObject({ ok: false, neuBuchen: '/autoschluessel/anfrage' });
    expect(zahlungStarten).not.toHaveBeenCalled();
  });

  it('bietet bei stornierten Vorgängen keine Zahlung an', async () => {
    gespeichert = vorgang({ status: 'storniert' });
    expect(await zahlungFortsetzen({ recordId: '42', token })).toMatchObject({ ok: false, meldung: 'Dieser Vorgang ist storniert.' });
    expect(abrufen).not.toHaveBeenCalled();
  });
});
