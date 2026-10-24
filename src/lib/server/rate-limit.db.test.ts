import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';

/* Zählung über die Tabelle sm24_ratenbegrenzung (siehe src/test/db-global-setup.ts). */

const ADRESSE = '198.51.100.23';
let adresse = ADRESSE;

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': `${adresse}, 10.0.0.1` }),
}));

const { allowRequest, alteZaehlerLoeschen, resetRateLimits } = await import('./rate-limit');

let payload: Payload;

async function zeilen() {
  const db = (payload.db as unknown as PostgresAdapter).drizzle;
  const result = await db.execute(sql`SELECT "schluessel", "anzahl" FROM "sm24_ratenbegrenzung"`);
  return result.rows as Array<{ schluessel: string; anzahl: number }>;
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

beforeEach(() => {
  adresse = ADRESSE;
  resetRateLimits();
});

describe('Ratenbegrenzung über die Datenbank', () => {
  it('lässt bis zur Grenze durch und sperrt danach', async () => {
    const rule = { name: 'test-grenze', limit: 3, windowMs: 60_000 };
    const now = Date.now();
    const ergebnisse = [];
    for (let i = 0; i < 5; i += 1) ergebnisse.push(await allowRequest(rule, now + i));
    expect(ergebnisse).toEqual([true, true, true, false, false]);

    // Der Speicher im Prozess war nicht beteiligt: Nach dem Leeren bleibt die Sperre.
    resetRateLimits();
    expect(await allowRequest(rule, now + 10)).toBe(false);
  });

  it('beginnt nach Ablauf des Fensters neu', async () => {
    const rule = { name: 'test-fenster', limit: 2, windowMs: 60_000 };
    const now = Date.now();
    expect(await allowRequest(rule, now)).toBe(true);
    expect(await allowRequest(rule, now + 1)).toBe(true);
    expect(await allowRequest(rule, now + 2)).toBe(false);
    expect(await allowRequest(rule, now + 60_001)).toBe(true);
    const zeile = (await zeilen()).find((z) => z.schluessel.startsWith('test-fenster:'));
    expect(Number(zeile?.anzahl)).toBe(1);
  });

  it('zählt Absender getrennt und speichert keine Adresse im Klartext', async () => {
    const rule = { name: 'test-absender', limit: 1, windowMs: 60_000 };
    const now = Date.now();
    expect(await allowRequest(rule, now)).toBe(true);
    expect(await allowRequest(rule, now)).toBe(false);
    adresse = '198.51.100.99';
    expect(await allowRequest(rule, now)).toBe(true);

    const eigene = (await zeilen()).filter((z) => z.schluessel.startsWith('test-absender:'));
    expect(eigene).toHaveLength(2);
    for (const zeile of await zeilen()) {
      expect(zeile.schluessel).not.toContain('198.51.100');
      expect(zeile.schluessel).toMatch(/^[a-z-]+:[0-9a-f]{64}$/);
    }
  });

  it('zählt gleichzeitige Aufrufe exakt (ein einziges UPSERT)', async () => {
    const rule = { name: 'test-parallel', limit: 5, windowMs: 60_000 };
    const now = Date.now();
    const ergebnisse = await Promise.all(Array.from({ length: 20 }, () => allowRequest(rule, now)));
    expect(ergebnisse.filter(Boolean)).toHaveLength(5);
  });

  it('zählt IPv6-Absender je /64-Netz', async () => {
    const rule = { name: 'test-ipv6', limit: 2, windowMs: 60_000 };
    const now = Date.now();
    adresse = '2001:db8:85a3:1234::1';
    expect(await allowRequest(rule, now)).toBe(true);
    adresse = '2001:db8:85a3:1234:dead:beef:0:7';
    expect(await allowRequest(rule, now)).toBe(true);
    adresse = '2001:db8:85a3:1234:ffff:ffff:ffff:ffff';
    expect(await allowRequest(rule, now)).toBe(false);
    adresse = '2001:db8:85a3:9999::1';
    expect(await allowRequest(rule, now)).toBe(true);
  });

  it('löscht Zähler, deren Fenster älter als einen Tag ist', async () => {
    const rule = { name: 'test-alt', limit: 5, windowMs: 60_000 };
    const tag = 24 * 60 * 60 * 1000;
    const now = Date.now();
    adresse = '198.51.100.202';
    await allowRequest(rule, now - 60_000);
    // Direkt eingefügt: allowRequest räumt selbst gelegentlich auf.
    const db = (payload.db as unknown as PostgresAdapter).drizzle;
    await db.execute(sql`
      INSERT INTO "sm24_ratenbegrenzung" ("schluessel", "fenster_start", "anzahl")
      VALUES ('test-alt:veraltet', ${new Date(now - 2 * tag).toISOString()}::timestamptz, 3)
    `);

    const geloescht = await alteZaehlerLoeschen(now);
    expect(geloescht).toBeGreaterThanOrEqual(1);
    const uebrig = (await zeilen()).filter((z) => z.schluessel.startsWith('test-alt:'));
    expect(uebrig).toHaveLength(1);
    expect(await alteZaehlerLoeschen(now)).toBe(0);
  });
});
