import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { anwenden, befundeFormatieren, istSupabase, sqlDateien, verbindungsOptionen, verbindungsUrl } from './supabase-rechte.mjs';

const CA = '-----BEGIN CERTIFICATE-----\\nMIIC…\\n-----END CERTIFICATE-----';

describe('verbindungsUrl', () => {
  it('nimmt SUPABASE_RECHTE_URL vor DATABASE_URL vor POSTGRES_URL', () => {
    expect(verbindungsUrl({ SUPABASE_RECHTE_URL: 'a', DATABASE_URL: 'b', POSTGRES_URL: 'c' })).toBe('a');
    expect(verbindungsUrl({ SUPABASE_RECHTE_URL: ' ', DATABASE_URL: 'b', POSTGRES_URL: 'c' })).toBe('b');
    expect(verbindungsUrl({ POSTGRES_URL: 'c' })).toBe('c');
    expect(verbindungsUrl({})).toBeUndefined();
  });
});

describe('verbindungsOptionen', () => {
  const url = 'postgres://sm24_app.ref:pw@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&application_name=sm24';

  it('lässt die Adresse ohne CA unverändert', () => {
    expect(verbindungsOptionen(url, {})).toEqual({ connectionString: url });
  });

  it('prüft mit CA das Zertifikat und entfernt die SSL-Angaben der Adresse (wie src/payload/betrieb.ts)', () => {
    const optionen = verbindungsOptionen(url, { DATABASE_CA_CERT: CA });
    expect(optionen.ssl).toEqual({ ca: '-----BEGIN CERTIFICATE-----\nMIIC…\n-----END CERTIFICATE-----', rejectUnauthorized: true });
    expect(optionen.connectionString).not.toMatch(/sslmode/);
    expect(optionen.connectionString).toMatch(/application_name=sm24/);
  });
});

describe('istSupabase', () => {
  it('erkennt Pooler und direkte Adresse von Supabase', () => {
    expect(istSupabase('postgres://u:p@aws-1-eu-central-1.pooler.supabase.com:5432/postgres')).toBe(true);
    expect(istSupabase('postgres://u:p@db.abcdefghijklmnopqrst.supabase.co:5432/postgres')).toBe(true);
    expect(istSupabase('postgres://postgres:postgres@127.0.0.1:5434/sm24_test')).toBe(false);
    expect(istSupabase('kein url')).toBe(false);
  });

  it('wendet bei Supabase nichts an (dort per MCP apply_migration)', async () => {
    await expect(anwenden('postgres://u:p@aws-1-eu-central-1.pooler.supabase.com:5432/postgres', {})).rejects.toThrow(
      /MCP apply_migration/,
    );
  });
});

describe('sqlDateien', () => {
  it('liefert die nummerierten Dateien in Reihenfolge', () => {
    const namen = sqlDateien().map((datei: string) => path.basename(datei));
    expect(namen[0]).toBe('0001_grundschutz.sql');
    expect(namen).toEqual([...namen].sort());
    expect(namen.every((name: string) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))).toBe(true);
  });
});

describe('befundeFormatieren', () => {
  it('richtet die Art bündig aus', () => {
    expect(
      befundeFormatieren([
        { art: 'rls-aus', objekt: 'public.a' },
        { art: 'api-recht-tabelle', objekt: 'public.b → anon' },
      ]),
    ).toEqual(['  rls-aus            public.a', '  api-recht-tabelle  public.b → anon']);
  });
});
