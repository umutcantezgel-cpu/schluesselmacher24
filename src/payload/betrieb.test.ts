import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MELDUNG_GEHEIMNIS_FEHLT,
  csrfHerkuenfte,
  datenbankZertifikat,
  ohneSslParameter,
  payloadGeheimnis,
  payloadServerUrl,
  poolKonfiguration,
} from './betrieb';

const VARIABLEN = [
  'DATABASE_URL', 'POSTGRES_URL', 'SM24_DATA', 'DATABASE_CA_CERT', 'PAYLOAD_SECRET', 'PORT',
  'VERCEL', 'VERCEL_ENV', 'VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL',
  'NEXT_PUBLIC_SERVER_URL', 'NEXT_PUBLIC_SITE_URL',
];

const PEM = '-----BEGIN CERTIFICATE-----\nMIIDxzCCAq+gAwIBAgIU\n-----END CERTIFICATE-----';

beforeEach(() => {
  for (const name of VARIABLEN) vi.stubEnv(name, undefined);
  vi.stubEnv('NODE_ENV', 'test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function produktion() {
  vi.stubEnv('VERCEL', '1');
  vi.stubEnv('VERCEL_ENV', 'production');
  vi.stubEnv('VERCEL_URL', 'sm24-abc123.vercel.app');
  vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'schluesselmacher24.de');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://schluesselmacher24.de');
}

describe('Server-Adresse und CSRF', () => {
  it('Produktion: feste Domain, CSRF mit www-Variante und Deployment-Adresse', () => {
    produktion();
    expect(payloadServerUrl()).toBe('https://schluesselmacher24.de');
    expect(csrfHerkuenfte()).toEqual([
      'https://schluesselmacher24.de',
      'https://www.schluesselmacher24.de',
      'https://sm24-abc123.vercel.app',
    ]);
  });

  it('Vorschau: keine Server-Adresse, CSRF mit Branch- und Deployment-Adresse', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('VERCEL_URL', 'sm24-abc123.vercel.app');
    vi.stubEnv('VERCEL_BRANCH_URL', 'sm24-git-feature.vercel.app');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://schluesselmacher24.de');
    expect(payloadServerUrl()).toBe('');
    const liste = csrfHerkuenfte();
    expect(liste).toContain('https://sm24-git-feature.vercel.app');
    expect(liste).toContain('https://sm24-abc123.vercel.app');
    expect(liste).not.toContain('');
    expect(new Set(liste).size).toBe(liste.length);
    expect(liste.some((h) => h.includes('localhost'))).toBe(false);
  });

  it('lokal: localhost, ohne www-Variante für localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
    expect(payloadServerUrl()).toBe('');
    expect(csrfHerkuenfte()).toEqual(['http://localhost:3000']);
    vi.stubEnv('PORT', '4000');
    expect(csrfHerkuenfte()).toEqual(['http://localhost:3000', 'http://localhost:4000']);
  });

  it('übernimmt eine gesetzte NEXT_PUBLIC_SERVER_URL ohne Schrägstrich', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3000/');
    expect(payloadServerUrl()).toBe('http://localhost:3000');
    expect(csrfHerkuenfte()[0]).toBe('http://localhost:3000');
  });
});

describe('PAYLOAD_SECRET', () => {
  it('ist in Produktion mit Datenbank Pflicht', () => {
    produktion();
    vi.stubEnv('DATABASE_URL', 'postgres://db');
    expect(() => payloadGeheimnis()).toThrow(MELDUNG_GEHEIMNIS_FEHLT);
    vi.stubEnv('PAYLOAD_SECRET', 'geheim-0123456789');
    expect(payloadGeheimnis()).toBe('geheim-0123456789');
  });

  it('fällt ohne Datenbank oder außerhalb der Produktion auf einen Zufallswert zurück', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    produktion();
    const ohneDb = payloadGeheimnis();
    expect(ohneDb).toMatch(/^[0-9a-f-]{72}$/);
    expect(payloadGeheimnis()).not.toBe(ohneDb);

    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('DATABASE_URL', 'postgres://db');
    expect(payloadGeheimnis()).toHaveLength(72);
  });
});

describe('Datenbank-Pool', () => {
  it('kleiner Pool auf Vercel, feste Zeitgrenzen, ohne SSL-Objekt', () => {
    vi.stubEnv('DATABASE_URL', 'postgres://u:p@pooler.supabase.com:6543/postgres?sslmode=require');
    expect(poolKonfiguration()).toEqual({
      connectionString: 'postgres://u:p@pooler.supabase.com:6543/postgres?sslmode=require',
      max: 10,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    vi.stubEnv('VERCEL', '1');
    expect(poolKonfiguration().max).toBe(5);
  });

  it('mit DATABASE_CA_CERT: CA prüfen und sslmode aus der Adresse entfernen', () => {
    vi.stubEnv('DATABASE_URL', 'postgres://u:p@pooler.supabase.com:6543/postgres?sslmode=require&application_name=sm24');
    vi.stubEnv('DATABASE_CA_CERT', PEM.replace(/\n/g, '\\n'));
    const pool = poolKonfiguration();
    expect(pool.ssl).toEqual({ ca: PEM, rejectUnauthorized: true });
    expect(pool.connectionString).toBe('postgres://u:p@pooler.supabase.com:6543/postgres?application_name=sm24');
  });

  it('liest das Zertifikat mit echten Zeilenumbrüchen unverändert', () => {
    vi.stubEnv('DATABASE_CA_CERT', `  ${PEM}\n`);
    expect(datenbankZertifikat()).toBe(PEM);
  });

  it('entfernt alle SSL-Parameter, lässt ungültige Adressen stehen', () => {
    expect(ohneSslParameter('postgres://h/db?ssl=true&sslrootcert=x.pem&sslmode=verify-full&uselibpqcompat=true')).toBe('postgres://h/db');
    expect(ohneSslParameter('kein url')).toBe('kein url');
  });
});
