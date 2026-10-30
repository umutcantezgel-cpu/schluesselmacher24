import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';

import { betriebPruefen, messwerteLesen } from './betriebszustand';
import type { SqlAusfuehrer } from './ratenzaehler';

/* Gegen die Testdatenbank, die wie Projekt A gehärtet ist (src/test/db-global-setup.ts):
 * Laufzeitrolle sm24_app, Lebenszeichen-Tabelle aus supabase/sql/0004. */

let payload: Payload;

function db(): SqlAusfuehrer {
  return (payload.db as unknown as PostgresAdapter).drizzle as unknown as SqlAusfuehrer;
}

async function lebenszeichen(quelle: string) {
  const { rows } = await db().execute(sql`SELECT "details" FROM intern.lebenszeichen WHERE "quelle" = ${quelle}`);
  return rows[0] as { details: Record<string, unknown> } | undefined;
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Betriebsprüfung', () => {
  it('misst Datenbank, Tabellen und Dateiablage und erkennt die Lebenszeichen-Tabelle', async () => {
    const messung = await messwerteLesen(db());
    expect(messung.datenbankBytes).toBeGreaterThan(1024 * 1024);
    expect(messung.tabellenBytes).toBeGreaterThan(0);
    expect(messung.ablageBytes).toBeGreaterThanOrEqual(0);
    expect(messung.lebenszeichen).not.toBeNull();
    expect(messung.lebenszeichenSetzbar).toBe(true);
  });

  it('setzt das Lebenszeichen des Crons mit dessen Ergebnis', async () => {
    // Je nach Reihenfolge der Tests fehlen hier noch Sicherungs-Lebenszeichen (→ Betriebsmail).
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await betriebPruefen({ cronStatus: 'fehler' });
    expect((await lebenszeichen('cron-taeglich'))?.details).toEqual({ status: 'fehler' });
    await betriebPruefen({ cronStatus: 'ok' });
    expect((await lebenszeichen('cron-taeglich'))?.details).toEqual({ status: 'ok' });
    warnung.mockRestore();
  });

  it('meldet nichts bei frischer Sicherung und kritisch, sobald sie 36 Stunden ausbleibt', async () => {
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await db().execute(sql`SELECT intern.lebenszeichen_setzen('sicherung-db', '{}'::jsonb)`);
    await db().execute(sql`SELECT intern.lebenszeichen_setzen('sicherung-dateien', '{}'::jsonb)`);

    const frisch = await betriebPruefen({ cronStatus: 'ok' });
    expect(frisch.befunde).toEqual([]);
    expect(frisch.mail).toBeUndefined();
    expect(frisch.datenbankMb).toBeGreaterThan(0);

    const spaeter = await betriebPruefen({ cronStatus: 'ok', jetzt: new Date(Date.now() + 40 * 3_600_000) });
    expect(spaeter.befunde.map((befund) => [befund.art, befund.stufe]).sort()).toEqual([
      ['sicherung-dateien', 'kritisch'],
      ['sicherung-db', 'kritisch'],
    ]);
    // Ohne Mailanbieter in Tests wird nichts gesendet, aber versucht.
    expect(spaeter.mail).toBe('nicht-eingerichtet');
    warnung.mockRestore();
  });

  it('lässt sich ohne eingerichtete Sicherung stumm schalten', async () => {
    vi.stubEnv('SM24_SICHERUNG_PRUEFEN', '0');
    const ergebnis = await betriebPruefen({ cronStatus: 'ok', jetzt: new Date('2099-01-01T00:00:00Z') });
    expect(ergebnis.befunde).toEqual([]);
  });
});
