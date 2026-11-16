import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';

import { ortsstammLesen } from './dateien';
import { ORTSSTAMM_VERMERK, ortsstammUebernehmen } from './uebernahme';
import type { OrtsstammDaten } from './typen';

/* Gegen die Testdatenbank: Der Seed hat den Stamm als Stichprobe übernommen (src/test/db-global-setup.ts). */

let payload: Payload;
let daten: OrtsstammDaten;
const still = () => {};

type Zeile = Record<string, unknown>;
async function zeile(schluessel: string): Promise<Zeile | undefined> {
  const db = payload.db.drizzle as unknown as { execute: (q: ReturnType<typeof sql>) => Promise<{ rows: Zeile[] }> };
  const { rows } = await db.execute(sql`SELECT * FROM "orte" WHERE "gemeindeschluessel" = ${schluessel}`);
  return rows[0];
}

beforeAll(async () => {
  payload = await getPayload({ config });
  daten = await ortsstammLesen();
});

describe('Ortsstamm in der Datenbank', () => {
  it('der Seed hat die Stichprobe übernommen, nicht den ganzen Stamm', async () => {
    const { totalDocs } = await payload.count({ collection: 'orte' });
    expect(totalDocs).toBeGreaterThan(348);
    expect(totalDocs).toBeLessThan(500);
    const wetzlar = await payload.find({ collection: 'orte', where: { gemeindeschluessel: { equals: '06532023' } }, depth: 0 });
    expect(wetzlar.docs[0]).toMatchObject({
      name: 'Wetzlar',
      slug: 'wetzlar',
      kreisName: 'Lahn-Dill-Kreis',
      land: 'Hessen',
      plzVerwaltungssitz: '35578',
      einwohner: 54865,
      aktiv: true,
      stand: '31.12.2025',
    });
    expect(wetzlar.docs[0].postleitzahlen).toContain('35576');
  });

  it('ein zweiter Lauf mit gleichem Stand schreibt nichts', async () => {
    const ergebnis = await ortsstammUebernehmen(payload, { umfang: 'stichprobe', daten, protokoll: still });
    expect(ergebnis.uebersprungen).toBe(true);
  });

  it('übernimmt eine Umbenennung, schreibt in Stapeln und setzt Abgänge im Volllauf auf nicht aktiv', async () => {
    const lahnDill = daten.gemeinden.gemeinden.filter((g) => g.kreis === '06532');
    const geaendert: OrtsstammDaten = {
      ...daten,
      gemeinden: {
        ...daten.gemeinden,
        // Erfundener neuer Stand (G4): Herborn umbenannt, nur der Lahn-Dill-Kreis.
        gemeinden: lahnDill.map((g) => (g.name === 'Herborn' ? { ...g, name: 'Herborn (Test)' } : g)),
      },
      prioritaet: { ...daten.prioritaet, eintraege: [] },
    };
    const ergebnis = await ortsstammUebernehmen(payload, { umfang: 'voll', daten: geaendert, stapel: 7, protokoll: still });
    expect(ergebnis).toMatchObject({ uebersprungen: false, geschrieben: lahnDill.length, zugaenge: 0, umbenennungen: 1 });
    expect(ergebnis.abgaenge).toBeGreaterThan(300);
    const herborn = lahnDill.find((g) => g.name === 'Herborn')!;
    expect((await zeile(herborn.schluessel))?.name).toBe('Herborn (Test)');
    expect((await zeile('11000000'))?.aktiv).toBe(false);
    expect((await payload.kv.get<{ umfang: string }>(ORTSSTAMM_VERMERK))?.umfang).toBe('voll');

    // Zurück auf den echten Stand: Berlin wieder aktiv, Herborn wieder richtig, nichts gelöscht.
    const zurueck = await ortsstammUebernehmen(payload, { umfang: 'stichprobe', daten, erzwingen: true, protokoll: still });
    expect(zurueck.umbenennungen).toBe(1);
    expect((await zeile('11000000'))?.aktiv).toBe(true);
    expect((await zeile(herborn.schluessel))?.name).toBe('Herborn');
  });

  it('im Admin nur lesbar', async () => {
    const team = { collection: 'benutzer', rolle: 'inhaber' } as never;
    await expect(
      payload.create({ collection: 'orte', data: { name: 'X', art: 'gemeinde', gemeindeschluessel: '99999999' }, overrideAccess: false, user: team }),
    ).rejects.toThrow();
  });
});
