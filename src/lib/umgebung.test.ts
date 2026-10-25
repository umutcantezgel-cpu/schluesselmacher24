import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dateiablage,
  dateisystemSchreibbar,
  datenbankUrl,
  datenbankUrlDirekt,
  googleVerifizierung,
  indexierungErlaubt,
  istProduktion,
  mailKonfiguration,
  mitDatenbank,
  serverUrl,
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
  'PAYMENT_INVOICES', 'GOOGLE_SITE_VERIFICATION',
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

describe('Suchmaschinen', () => {
  it('erlaubt die Indexierung nur in der Produktion', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(indexierungErlaubt()).toBe(false);
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(indexierungErlaubt()).toBe(true);
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
