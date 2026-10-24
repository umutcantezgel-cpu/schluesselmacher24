import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { OrderLine } from '@/lib/types';

import type { PaymentIntent } from './index';

/* Stripe wird ersetzt: Es entsteht nie eine echte Sitzung. */

const erstellen = vi.fn();
const konstruktor = vi.fn();
vi.mock('stripe', () => ({
  default: class {
    checkout = { sessions: { create: erstellen } };
    constructor(...args: unknown[]) {
      konstruktor(...args);
    }
  },
}));

const { checkoutParameter, starteCheckout, ABLAUF_MINUTEN } = await import('./stripe');
const { createPayment } = await import('./index');

const JETZT = new Date('2026-10-24T12:00:00.000Z');
const SITE = 'https://schluesselmacher24.de/';
const UMFELD = { jetzt: JETZT, site: SITE, konfiguration: { zahlarten: ['card', 'paypal'], rechnungen: false }, umgebung: 'production' };

const LINES: OrderLine[] = [
  { kind: 'code-schluessel', productId: 'ms-01', label: 'Schlüssel nach Code (MS)', details: 'Code 4711-GEHEIM', qty: 2, unitPriceCents: 1290, totalCents: 2580, vatPercent: 19 },
  { kind: 'standard', productId: 'anh-1', label: 'Schlüsselanhänger', details: 'Farbe: rot', qty: 1, unitPriceCents: 450, totalCents: 450, vatPercent: 19 },
];

function bestellung(teil: Partial<PaymentIntent> = {}): PaymentIntent {
  return {
    recordId: '42',
    reference: 'SM24-B-2026-0007',
    recordKind: 'bestellung',
    amountCents: 3520,
    scope: 'gesamt',
    description: 'Bestellung über 35,20 €',
    accessToken: 'tok_abc-123',
    customerEmail: 'erika@example.org',
    lines: LINES,
    shipping: { label: 'Brief (Deutsche Post)', cents: 490 },
    ...teil,
  };
}

const termin = (teil: Partial<PaymentIntent> = {}): PaymentIntent => ({
  recordId: '43',
  reference: 'SM24-T-2026-0003',
  recordKind: 'termin',
  amountCents: 6990,
  scope: 'anzahlung',
  description: 'Anzahlung Autoschlüssel-Termin',
  accessToken: 'tok_xyz',
  customerEmail: 'erika@example.org',
  appointment: { date: '2026-11-02', time: '09:30', durationMinutes: 90, location: 'werkstatt' },
  ...teil,
});

beforeEach(() => {
  erstellen.mockReset();
  konstruktor.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('checkoutParameter', () => {
  it('überträgt Positionen nur mit Bezeichnung, Menge und Preis — nie Codes oder Angaben', () => {
    const p = checkoutParameter(bestellung(), UMFELD);
    expect(p.line_items).toEqual([
      { quantity: 2, price_data: { currency: 'eur', unit_amount: 1290, product_data: { name: 'Schlüssel nach Code (MS)' } } },
      { quantity: 1, price_data: { currency: 'eur', unit_amount: 450, product_data: { name: 'Schlüsselanhänger' } } },
    ]);
    expect(p.shipping_options).toEqual([
      { shipping_rate_data: { type: 'fixed_amount', display_name: 'Brief (Deutsche Post)', fixed_amount: { amount: 490, currency: 'eur' } } },
    ]);
    const alles = JSON.stringify(p);
    expect(alles).not.toContain('4711');
    expect(alles).not.toContain('GEHEIM');
    expect(alles).not.toContain('Farbe');
  });

  it('nimmt eine Sammelposition, wenn die Summe nicht zum Betrag passt', () => {
    const p = checkoutParameter(bestellung({ amountCents: 9999 }), UMFELD);
    expect(p.line_items).toEqual([
      { quantity: 1, price_data: { currency: 'eur', unit_amount: 9999, product_data: { name: 'Bestellung SM24-B-2026-0007' } } },
    ]);
    expect(p.shipping_options).toBeUndefined();
  });

  it('setzt Metadaten, Beschreibung, Zahlarten, Sprache und Kunde vom Server', () => {
    const p = checkoutParameter(bestellung(), UMFELD);
    const metadata = { vorgangId: '42', nummer: 'SM24-B-2026-0007', art: 'bestellung', umgebung: 'production' };
    expect(p).toMatchObject({
      mode: 'payment',
      locale: 'de',
      customer_email: 'erika@example.org',
      client_reference_id: '42',
      metadata,
      payment_intent_data: { metadata, description: 'SM24-B-2026-0007 – Bestellung' },
      payment_method_types: ['card', 'paypal'],
      adaptive_pricing: { enabled: false },
    });
    expect(p.invoice_creation).toBeUndefined();
    expect(checkoutParameter(bestellung(), { ...UMFELD, konfiguration: { zahlarten: ['card'], rechnungen: true } }).invoice_creation).toMatchObject({
      enabled: true,
    });
  });

  it('baut absolute Rücksprungadressen mit Link-Schlüssel und unkodiertem Platzhalter', () => {
    const p = checkoutParameter(bestellung(), UMFELD);
    expect(p.success_url).toBe(
      'https://schluesselmacher24.de/api/zahlung/rueckkehr?id=42&t=tok_abc-123&session_id={CHECKOUT_SESSION_ID}',
    );
    expect(p.cancel_url).toBe('https://schluesselmacher24.de/bestellung/42?t=tok_abc-123&abbruch=1');
  });

  it('lässt den Termin 31 Minuten offen, die Bestellung 23 Stunden', () => {
    const sekunden = Math.floor(JETZT.getTime() / 1000);
    expect(checkoutParameter(termin(), UMFELD).expires_at).toBe(sekunden + 31 * 60);
    expect(checkoutParameter(bestellung(), UMFELD).expires_at).toBe(sekunden + ABLAUF_MINUTEN.bestellung * 60);
  });

  it('nennt beim Termin Datum und Uhrzeit in der einzigen Position', () => {
    const p = checkoutParameter(termin(), UMFELD);
    expect(p.line_items).toEqual([
      { quantity: 1, price_data: { currency: 'eur', unit_amount: 6990, product_data: { name: 'Anzahlung Autoschlüssel-Termin 02.11.2026 09:30 Uhr' } } },
    ]);
    expect(p.payment_intent_data?.description).toBe('SM24-T-2026-0003 – Anzahlung Autoschlüssel-Termin');
    expect(p.shipping_options).toBeUndefined();
  });
});

describe('starteCheckout und createPayment', () => {
  function einrichten() {
    vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
    vi.stubEnv('PAYMENT_API_KEY', 'sk_test_123');
    vi.stubEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_test');
    vi.stubEnv('DATABASE_URL', 'postgres://test@localhost/test');
    vi.stubEnv('SM24_DATA', '');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://schluesselmacher24.de');
  }

  it('liefert Sitzung, Ablauf und Weiterleitung', async () => {
    einrichten();
    erstellen.mockResolvedValue({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1', expires_at: 1_800_000_000, payment_intent: null });
    const ergebnis = await createPayment(termin());
    expect(ergebnis).toMatchObject({
      status: 'offen',
      checkoutSessionId: 'cs_test_1',
      redirectUrl: 'https://checkout.stripe.com/c/pay/cs_test_1',
      expiresAt: new Date(1_800_000_000 * 1000).toISOString(),
    });
    expect(ergebnis.providerRef).toBeUndefined();
    expect(konstruktor).toHaveBeenCalledWith('sk_test_123', expect.objectContaining({ maxNetworkRetries: 2 }));
    // Kein eigener Idempotenz-Schlüssel (Kennungen wiederholen sich zwischen Umgebungen).
    expect(erstellen.mock.calls[0]).toHaveLength(1);
    expect(erstellen.mock.calls[0][0].metadata.umgebung).toBe('lokal');
  });

  it('legt unter 50 Cent keine Sitzung an und vermerkt das intern', async () => {
    einrichten();
    const ergebnis = await starteCheckout(termin({ amountCents: 30 }));
    expect(ergebnis.status).toBe('offen');
    expect(ergebnis.redirectUrl).toBeUndefined();
    expect(ergebnis.internalNote).toContain('Mindestbetrag');
    expect(erstellen).not.toHaveBeenCalled();
  });

  it('bleibt ohne vollständige Einrichtung beim Rückfall „offen“', async () => {
    vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
    vi.stubEnv('PAYMENT_API_KEY', 'sk_test_123');
    const ergebnis = await createPayment(termin());
    expect(ergebnis).toMatchObject({ status: 'offen' });
    expect(ergebnis.redirectUrl).toBeUndefined();
    expect(erstellen).not.toHaveBeenCalled();
  });
});
