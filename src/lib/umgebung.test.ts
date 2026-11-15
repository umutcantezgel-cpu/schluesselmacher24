import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dateiablage,
  dateisystemSchreibbar,
  datenbankUrl,
  datenbankUrlDirekt,
  googleVerifizierung,
  indexierungErlaubt,
  istProduktion,
  istSchaufenster,
  mailKonfiguration,
  mitDatenbank,
  pruefhinweiseZeigen,
  PRODUKTIONS_HOST_MUSTER,
  serverUrl,
  speichernMoeglich,
  suchmaschinenKopfzeilen,
  zahlungKonfiguration,
} from './umgebung';

/* Jeder Test beginnt ohne die Variablen, die hier ausgewertet werden — Werte
 * aus der eigenen Shell dürfen das Ergebnis nicht verfälschen. */
const VARIABLEN = [
  'DATABASE_URL', 'POSTGRES_URL', 'DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING', 'SM24_DATA',
  'VERCEL', 'VERCEL_ENV', 'VERCEL_PROJECT_PRODUCTION_URL', 'SM24_READONLY_CONTENT', 'NEXT_PUBLIC_SERVER_URL',
  'SM24_STORAGE', 'STORAGE_ENDPOINT', 'STORAGE_REGION', 'STORAGE_BUCKET', 'STORAGE_ACCESS_KEY', 'STORAGE_SECRET_KEY',
  'MAIL_PROVIDER', 'MAIL_API_KEY', 'MAIL_FROM_ADDRESS', 'MAIL_FROM_NAME', 'MAIL_REPLY_TO', 'MAIL_TEAM_ADDRESS',
  'MAIL_REDIRECT_TO', 'PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET', 'PAYMENT_METHODS',
  'PAYMENT_INVOICES', 'GOOGLE_SITE_VERIFICATION', 'SM24_INDEXIERUNG',
];

beforeEach(() => {
  for (const name of VARIABLEN) vi.stubEnv(name, undefined);
  vi.stubEnv('NODE_ENV', 'test');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Datenbank', () => {
  it('nimmt DATABASE_URL vor POSTGRES_URL', () => {
    expect(datenbankUrl()).toBeUndefined();
    vi.stubEnv('POSTGRES_URL', 'postgres://vercel');
    expect(datenbankUrl()).toBe('postgres://vercel');
    vi.stubEnv('DATABASE_URL', 'postgres://eigen');
    expect(datenbankUrl()).toBe('postgres://eigen');
  });

  it('direkte Verbindung fällt auf die gepoolte zurück', () => {
    vi.stubEnv('DATABASE_URL', 'postgres://pooler');
    expect(datenbankUrlDirekt()).toBe('postgres://pooler');
    vi.stubEnv('POSTGRES_URL_NON_POOLING', 'postgres://vercel-direkt');
    expect(datenbankUrlDirekt()).toBe('postgres://vercel-direkt');
    vi.stubEnv('DATABASE_URL_UNPOOLED', 'postgres://direkt');
    expect(datenbankUrlDirekt()).toBe('postgres://direkt');
  });

  it('Datenbankbetrieb nur mit Verbindung und ohne SM24_DATA=json', () => {
    expect(mitDatenbank()).toBe(false);
    vi.stubEnv('DATABASE_URL', '   ');
    expect(mitDatenbank()).toBe(false);
    vi.stubEnv('POSTGRES_URL', 'postgres://vercel');
    expect(mitDatenbank()).toBe(true);
    vi.stubEnv('SM24_DATA', 'json');
    expect(mitDatenbank()).toBe(false);
  });
});

describe('Dateisystem und Produktion', () => {
  it('auf Vercel und mit SM24_READONLY_CONTENT=1 nicht schreibbar', () => {
    expect(dateisystemSchreibbar()).toBe(true);
    vi.stubEnv('SM24_READONLY_CONTENT', '1');
    expect(dateisystemSchreibbar()).toBe(false);
    vi.stubEnv('SM24_READONLY_CONTENT', undefined);
    vi.stubEnv('VERCEL', '1');
    expect(dateisystemSchreibbar()).toBe(false);
  });

  it('auf Vercel zählt nur die Produktionsumgebung', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(istProduktion()).toBe(true);
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(istProduktion()).toBe(false);
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(istProduktion()).toBe(true);
  });
});

describe('Schaufenster', () => {
  it('ist nur die Produktion auf Vercel ohne Datenbank', () => {
    expect(istSchaufenster()).toBe(false);
    vi.stubEnv('NODE_ENV', 'production');
    expect(istSchaufenster()).toBe(false);
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(istSchaufenster()).toBe(false);
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(istSchaufenster()).toBe(true);
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    expect(istSchaufenster()).toBe(false);
    vi.stubEnv('SM24_DATA', 'json');
    expect(istSchaufenster()).toBe(true);
  });

  it('zeigt Redaktions- und Prüfhinweise überall außer auf der Live-Seite', () => {
    // Lokal in der Entwicklung
    expect(pruefhinweiseZeigen()).toBe(true);
    // Lokaler Produktionsstart: wie die Live-Seite
    vi.stubEnv('NODE_ENV', 'production');
    expect(pruefhinweiseZeigen()).toBe(false);
    // Vorschau auf Vercel
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(pruefhinweiseZeigen()).toBe(true);
    // Schaufenster: Produktion ohne Datenbank
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(pruefhinweiseZeigen()).toBe(true);
    // Live-Seite: Produktion mit Datenbank
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    expect(pruefhinweiseZeigen()).toBe(false);
  });

  it('kann nur mit Datenbank oder beschreibbarem Dateisystem speichern', () => {
    expect(speichernMoeglich()).toBe(true);
    vi.stubEnv('SM24_READONLY_CONTENT', '1');
    expect(speichernMoeglich()).toBe(false);
    vi.stubEnv('SM24_READONLY_CONTENT', undefined);
    vi.stubEnv('VERCEL', '1');
    expect(speichernMoeglich()).toBe(false);
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    expect(speichernMoeglich()).toBe(true);
    vi.stubEnv('SM24_DATA', 'json');
    expect(speichernMoeglich()).toBe(false);
  });
});

describe('Suchmaschinen', () => {
  it('erlaubt die Indexierung nur in der Produktion', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('NODE_ENV', 'production');
    // Außerhalb von Vercel nur mit ausdrücklichem Schalter (FA-25-20).
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(indexierungErlaubt()).toBe(true);
  });

  it('sperrt das Schaufenster wie eine Vorschau', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('POSTGRES_URL', 'postgres://vercel/db');
    expect(indexierungErlaubt()).toBe(true);
  });

  /* Jede Kombination der Umgebung (FA-SEO-01C): Ort × Umgebung × Datenbank × Schalter. */
  const FAELLE: Array<{ fall: string; env: Record<string, string>; erwartet: boolean }> = [
    { fall: 'lokal, Entwicklung', env: { NODE_ENV: 'development' }, erwartet: false },
    { fall: 'lokal, Entwicklung, Schalter an', env: { NODE_ENV: 'development', SM24_INDEXIERUNG: 'an' }, erwartet: false },
    { fall: 'eigener Server, Produktionsbuild ohne Schalter', env: { NODE_ENV: 'production' }, erwartet: false },
    { fall: 'eigener Server, Produktionsbuild mit Datenbank ohne Schalter', env: { NODE_ENV: 'production', DATABASE_URL: 'postgres://x/db' }, erwartet: false },
    { fall: 'eigener Server, Schalter an', env: { NODE_ENV: 'production', SM24_INDEXIERUNG: 'an' }, erwartet: true },
    { fall: 'eigener Server, Schalter AN mit Leerzeichen', env: { NODE_ENV: 'production', SM24_INDEXIERUNG: ' AN ' }, erwartet: true },
    { fall: 'eigener Server, Schalter mit anderem Wert', env: { NODE_ENV: 'production', SM24_INDEXIERUNG: 'ja' }, erwartet: false },
    { fall: 'eigener Server, Schalter aus', env: { NODE_ENV: 'production', SM24_INDEXIERUNG: 'aus' }, erwartet: false },
    { fall: 'Vercel-Vorschau', env: { VERCEL: '1', VERCEL_ENV: 'preview', DATABASE_URL: 'postgres://x/db' }, erwartet: false },
    { fall: 'Vercel-Vorschau, Schalter an', env: { VERCEL: '1', VERCEL_ENV: 'preview', DATABASE_URL: 'postgres://x/db', SM24_INDEXIERUNG: 'an' }, erwartet: false },
    { fall: 'Vercel-Entwicklung', env: { VERCEL: '1', VERCEL_ENV: 'development', DATABASE_URL: 'postgres://x/db' }, erwartet: false },
    { fall: 'Vercel-Produktion ohne Datenbank (Schaufenster, A-042)', env: { VERCEL: '1', VERCEL_ENV: 'production' }, erwartet: false },
    { fall: 'Schaufenster, Schalter an', env: { VERCEL: '1', VERCEL_ENV: 'production', SM24_INDEXIERUNG: 'an' }, erwartet: false },
    { fall: 'Vercel-Produktion mit Datenbank, aber SM24_DATA=json', env: { VERCEL: '1', VERCEL_ENV: 'production', DATABASE_URL: 'postgres://x/db', SM24_DATA: 'json' }, erwartet: false },
    { fall: 'Vercel-Produktion mit Datenbank', env: { VERCEL: '1', VERCEL_ENV: 'production', DATABASE_URL: 'postgres://x/db' }, erwartet: true },
    { fall: 'Vercel-Produktion mit Datenbank, Schalter aus', env: { VERCEL: '1', VERCEL_ENV: 'production', DATABASE_URL: 'postgres://x/db', SM24_INDEXIERUNG: 'aus' }, erwartet: false },
  ];

  it.each(FAELLE)('$fall → indexierbar: $erwartet', ({ env, erwartet }) => {
    for (const [name, wert] of Object.entries(env)) vi.stubEnv(name, wert);
    expect(indexierungErlaubt()).toBe(erwartet);
    const regeln = suchmaschinenKopfzeilen();
    expect(regeln).toHaveLength(1);
    expect(regeln[0].headers).toEqual([{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]);
    // Nicht indexierbar: noindex für jede Adresse; indexierbar: für jede außer der Produktionsdomain.
    expect(regeln[0].missing).toEqual(erwartet ? [{ type: 'host', value: PRODUKTIONS_HOST_MUSTER }] : undefined);
  });

  it('nimmt nur die Produktionsdomain mit oder ohne www von der Kopfzeile aus', () => {
    const muster = new RegExp(`^${PRODUKTIONS_HOST_MUSTER}$`);
    expect(muster.test('schluesselmacher24.de')).toBe(true);
    expect(muster.test('www.schluesselmacher24.de')).toBe(true);
    for (const fremd of ['schluesselmacher24.vercel.app', 'sm24-git-main.vercel.app', 'localhost', 'schluesselmacher24xde', 'staging.schluesselmacher24.de']) {
      expect(muster.test(fremd)).toBe(false);
    }
  });

  it('liest die Google-Bestätigung, leer ist keine', () => {
    vi.stubEnv('GOOGLE_SITE_VERIFICATION', '  ');
    expect(googleVerifizierung()).toBeUndefined();
    vi.stubEnv('GOOGLE_SITE_VERIFICATION', 'abc123');
    expect(googleVerifizierung()).toBe('abc123');
  });
});

describe('Dateiablage', () => {
  it('braucht Bucket und beide Schlüssel', () => {
    vi.stubEnv('STORAGE_BUCKET', 'sm24');
    vi.stubEnv('STORAGE_ACCESS_KEY', 'schluessel');
    expect(dateiablage()).toBeNull();
    vi.stubEnv('STORAGE_SECRET_KEY', 'geheim');
    expect(dateiablage()).toEqual({
      region: 'auto',
      bucket: 'sm24',
      accessKeyId: 'schluessel',
      secretAccessKey: 'geheim',
    });
  });

  it('übernimmt Endpunkt und Region, SM24_STORAGE=lokal schaltet ab', () => {
    vi.stubEnv('STORAGE_BUCKET', 'sm24');
    vi.stubEnv('STORAGE_ACCESS_KEY', 'schluessel');
    vi.stubEnv('STORAGE_SECRET_KEY', 'geheim');
    vi.stubEnv('STORAGE_ENDPOINT', 'https://projekt.storage.supabase.co/storage/v1/s3');
    vi.stubEnv('STORAGE_REGION', 'eu-central-1');
    expect(dateiablage()).toMatchObject({
      endpoint: 'https://projekt.storage.supabase.co/storage/v1/s3',
      region: 'eu-central-1',
    });
    vi.stubEnv('SM24_STORAGE', 'lokal');
    expect(dateiablage()).toBeNull();
  });
});

describe('Server-Adresse', () => {
  it('lokal und in Vorschauen leer, sofern nicht gesetzt', () => {
    expect(serverUrl()).toBe('');
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'schluesselmacher24.de');
    expect(serverUrl()).toBe('');
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3000/');
    expect(serverUrl()).toBe('http://localhost:3000');
  });

  it('in Produktion die feste Domain', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(serverUrl()).toBe('');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'schluesselmacher24.de');
    expect(serverUrl()).toBe('https://schluesselmacher24.de');
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://www.schluesselmacher24.de');
    expect(serverUrl()).toBe('https://www.schluesselmacher24.de');
  });
});

describe('Mailversand', () => {
  it('nur mit Resend, Schlüssel und Absender', () => {
    vi.stubEnv('MAIL_PROVIDER', 'resend');
    vi.stubEnv('MAIL_API_KEY', 're_test');
    expect(mailKonfiguration()).toBeNull();
    vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
    expect(mailKonfiguration()).toEqual({
      provider: 'resend',
      apiKey: 're_test',
      fromAddress: 'info@schluesselmacher24.de',
      fromName: 'SCHLÜSSELMACHER24',
      teamAdressen: [],
    });
    vi.stubEnv('MAIL_PROVIDER', 'smtp');
    expect(mailKonfiguration()).toBeNull();
  });

  it('Team-Adressen, Antwortadresse und Umleitung außerhalb der Produktion', () => {
    vi.stubEnv('MAIL_PROVIDER', 'resend');
    vi.stubEnv('MAIL_API_KEY', 're_test');
    vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
    vi.stubEnv('MAIL_REPLY_TO', 'info@schluesselmacher24.de');
    vi.stubEnv('MAIL_TEAM_ADDRESS', 'werkstatt@example.org, , inhaber@example.org');
    vi.stubEnv('MAIL_REDIRECT_TO', 'test@example.org');
    expect(mailKonfiguration()).toMatchObject({
      replyTo: 'info@schluesselmacher24.de',
      teamAdressen: ['werkstatt@example.org', 'inhaber@example.org'],
      redirectTo: 'test@example.org',
    });
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(mailKonfiguration()?.redirectTo).toBeUndefined();
  });
});

describe('Zahlung', () => {
  it('nur mit Stripe, Schlüssel und Webhook-Geheimnis', () => {
    vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
    vi.stubEnv('PAYMENT_API_KEY', 'sk_test_123');
    expect(zahlungKonfiguration()).toBeNull();
    vi.stubEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_123');
    expect(zahlungKonfiguration()).toEqual({
      provider: 'stripe',
      apiKey: 'sk_test_123',
      webhookSecret: 'whsec_123',
      zahlarten: ['card'],
      rechnungen: false,
    });
    vi.stubEnv('PAYMENT_PROVIDER', 'paypal');
    expect(zahlungKonfiguration()).toBeNull();
  });

  it('Zahlarten und Rechnungen aus der Umgebung', () => {
    vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
    vi.stubEnv('PAYMENT_API_KEY', 'sk_test_123');
    vi.stubEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_123');
    vi.stubEnv('PAYMENT_METHODS', 'card, paypal,');
    vi.stubEnv('PAYMENT_INVOICES', '1');
    expect(zahlungKonfiguration()).toMatchObject({ zahlarten: ['card', 'paypal'], rechnungen: true });
  });
});
