import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { defaults } from '@/lib/data/defaults';
import { PayloadAdapter } from '@/lib/data/payload-adapter';
import { inhalteUebernehmen } from './seed';

/* FA-SHOP-03, Teil A, gegen die Testdatenbank (Migration „einsende_varianten“ und Seed aus dem
 * globalen Aufbau): Varianten des Inhabers als Daten in den Einstellungen, Sonderfall-Freigabe am
 * Vorgang. Erfundene Testdaten (G4); die alten Felder bleiben lesbar (G6). */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };

beforeAll(async () => {
  payload = await getPayload({ config });
});

describe('Einsende-Varianten', () => {
  it('der Seed legt die drei Varianten mit den Startwerten an; die Seite liest sie aus der Datenbank', async () => {
    const settings = await adapter.read('settings');
    expect(settings.sendIn?.varianten).toEqual(defaults.settings().sendIn!.varianten);
    // Die alten Felder bleiben lesbar.
    expect(settings.sendIn).toMatchObject({ portoVersichertCents: 445, haftungVersichertEuro: 25 });
  });

  it('eine Änderung im Admin wirkt; leeres Porto bleibt „nicht belegt“', async () => {
    const vorher = await payload.findGlobal({ slug: 'einstellungen', depth: 0 });
    const varianten = vorher.einsenden?.varianten ?? [];
    try {
      await payload.updateGlobal({
        slug: 'einstellungen',
        data: { einsenden: { ...vorher.einsenden, varianten: varianten.map((v) => (v.kennung === 'einschreiben-einwurf' ? { ...v, porto: null, aufpreis: 1.5 } : v)) } },
        context,
      });
      const einwurf = (await adapter.read('settings')).sendIn?.varianten?.find((v) => v.kennung === 'einschreiben-einwurf');
      expect(einwurf).toMatchObject({ portoCents: null, aufpreisCents: 150, haftungEuro: 20 });
    } finally {
      await payload.updateGlobal({ slug: 'einstellungen', data: { einsenden: { ...vorher.einsenden, varianten } }, context });
    }
  });

  it('der Seed füllt eine leere Variantenliste einmal (ältere Datenbankstände)', async () => {
    const db = payload.db.drizzle as unknown as { execute: (q: ReturnType<typeof sql>) => Promise<unknown> };
    await db.execute(sql`DELETE FROM einstellungen_einsenden_varianten`);
    // Ohne Zeilen gelten auf der Seite die Startwerte.
    expect((await adapter.read('settings')).sendIn?.varianten?.map((v) => v.kennung)).toEqual(['dhl-paket', 'einschreiben-einwurf', 'einschreiben-wert']);
    await inhalteUebernehmen(payload, { startwerte: [] });
    const gespeichert = (await payload.findGlobal({ slug: 'einstellungen', depth: 0 })).einsenden?.varianten ?? [];
    expect(gespeichert.map((v) => [v.kennung, v.haftung, v.porto, v.nurSonderfall])).toEqual([
      ['dhl-paket', 500, 7.69, false],
      ['einschreiben-einwurf', 20, 4.15, false],
      ['einschreiben-wert', 500, 6.25, true],
    ]);
  });
});
