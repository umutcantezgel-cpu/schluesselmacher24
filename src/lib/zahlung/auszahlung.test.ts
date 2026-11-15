import { afterEach, describe, expect, it, vi } from 'vitest';

import { auszahlungsWeg } from '../umgebung';

import { AUSZAHLUNG_MELDUNG, aktiverAuszahlungswegText, auszahlungswegFuer, manuelleAuszahlung, stripeConnectAuszahlung } from './auszahlung';

/* FA-KERN-04: Partnerbetrag auszahlen. Zahlungsdienst nur als Attrappe (G3, G5). */

afterEach(() => {
  vi.unstubAllEnvs();
});

function stripeAn() {
  vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
  vi.stubEnv('PAYMENT_API_KEY', 'sk_test_x');
  vi.stubEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_x');
}

describe('Partnerauszahlung', () => {
  it('ruft ohne Schalter nichts beim Zahlungsdienst auf', async () => {
    stripeAn();
    vi.stubEnv('PARTNER_AUSZAHLUNG', '');
    const laden = vi.fn();
    expect(auszahlungsWeg()).toBe('manuell');
    expect(await auszahlungswegFuer('zahlungsdienst', laden)).toEqual({ meldung: AUSZAHLUNG_MELDUNG.ausgeschaltet });
    expect(await auszahlungswegFuer('ueberweisung', laden)).toBe(manuelleAuszahlung);
    expect(laden).not.toHaveBeenCalled();
    expect(aktiverAuszahlungswegText()).toMatch(/Überweisung von Hand/);
  });

  it('schaltet Stripe Connect nur mit Schalter und vollständiger Stripe-Anbindung ein', () => {
    vi.stubEnv('PARTNER_AUSZAHLUNG', 'stripe-connect');
    vi.stubEnv('PAYMENT_PROVIDER', '');
    expect(auszahlungsWeg()).toBe('manuell');
    stripeAn();
    expect(auszahlungsWeg()).toBe('stripe-connect');
  });

  it('zahlt manuell nichts aus, sondern bestätigt nur den Weg', async () => {
    expect(await manuelleAuszahlung.auszahlen({ nummer: 'SM24-T-2026-0042', partnerbetragCents: 27_000 })).toEqual({ ok: true, weg: 'ueberweisung' });
    expect(await manuelleAuszahlung.auszahlen({ nummer: 'SM24-T-2026-0042', partnerbetragCents: 0 })).toEqual({ ok: false, meldung: AUSZAHLUNG_MELDUNG.betrag });
  });

  it('überweist mit Stripe Connect an das verbundene Konto (Attrappe) mit Gruppe und Idempotenz-Schlüssel', async () => {
    const attrappe = vi.fn(async () => ({ id: 'tr_test_1' }));
    const weg = stripeConnectAuszahlung(attrappe);
    expect(await weg.auszahlen({ nummer: 'SM24-T-2026-0042', partnerbetragCents: 27_000, kontoKennung: 'acct_TEST1234' })).toEqual({
      ok: true,
      weg: 'zahlungsdienst',
      referenz: 'tr_test_1',
    });
    expect(attrappe).toHaveBeenCalledWith({ betragCents: 27_000, ziel: 'acct_TEST1234', gruppe: 'SM24-T-2026-0042', idempotenz: 'sm24-auszahlung-SM24-T-2026-0042' });

    attrappe.mockClear();
    expect(await weg.auszahlen({ nummer: 'SM24-T-2026-0042', partnerbetragCents: 27_000, kontoKennung: null })).toEqual({ ok: false, meldung: AUSZAHLUNG_MELDUNG.konto });
    expect(attrappe).not.toHaveBeenCalled();

    const scheitert = stripeConnectAuszahlung(vi.fn(async () => Promise.reject(new Error('abgelehnt'))));
    expect(await scheitert.auszahlen({ nummer: 'X', partnerbetragCents: 100, kontoKennung: 'acct_TEST1234' })).toEqual({ ok: false, meldung: AUSZAHLUNG_MELDUNG.fehler });
  });
});
