import { afterEach, describe, expect, it, vi } from 'vitest';

import { ZAHLART_TEXTE, onlineZahlarten, zahlartenAnzeige } from './zahlarten';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Zahlarten', () => {
  it('übersetzt Stripe-Zahlarten in Anzeigetexte', () => {
    expect(zahlartenAnzeige(['card', 'paypal', 'klarna', 'sepa_debit'])).toEqual([
      ZAHLART_TEXTE.card,
      'PayPal',
      'Klarna',
      'SEPA-Lastschrift',
    ]);
    expect(ZAHLART_TEXTE.card).toContain('Apple Pay und Google Pay je nach Gerät');
    expect(zahlartenAnzeige(['card', 'card'])).toHaveLength(1);
  });

  it('meldet ohne vollständige Stripe-Anbindung und Datenbank keine Online-Zahlung', () => {
    vi.stubEnv('PAYMENT_PROVIDER', '');
    expect(onlineZahlarten()).toBeNull();

    vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
    vi.stubEnv('PAYMENT_API_KEY', 'sk_test_x');
    vi.stubEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_x');
    vi.stubEnv('PAYMENT_METHODS', 'card,paypal');
    vi.stubEnv('DATABASE_URL', '');
    vi.stubEnv('POSTGRES_URL', '');
    expect(onlineZahlarten()).toBeNull();

    vi.stubEnv('DATABASE_URL', 'postgres://localhost/x');
    vi.stubEnv('SM24_DATA', '');
    expect(onlineZahlarten()).toEqual([ZAHLART_TEXTE.card, 'PayPal']);
  });
});
