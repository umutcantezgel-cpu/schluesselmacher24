import { sql } from '@payloadcms/db-postgres';
import { createLocalReq, getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { defaults } from '@/lib/data/defaults';
import { rubrikZuSeite } from '@/lib/data/payload-mapping';
import { hubKacheln } from '@/lib/rubriken';
import type { Rubrik } from '@/lib/types';
import { up as hubMigrieren } from '@/migrations/20261115_182441_rubrik_symbole_fahrzeugklassen';
import type { Rubriken } from '@/payload-types';
import { inhalteUebernehmen } from './seed';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Hub mit den 14 Hauptzugängen des
 * Inhabers (FA-SOFORT-05). Die Testdatenbank ist frisch migriert und geseedet; hier wird zusätzlich der
 * Weg einer bestehenden Datenbank nachgestellt: alte Reihenfolge, Gehäuse im Hub, alte Namen. */

let payload: Payload;
const context = { disableRevalidate: true };

beforeAll(async () => {
  payload = await getPayload({ config });
});

const FA03 = [
  'autoschluessel',
  'motorradschluessel',
  'roller-und-kleinstfahrzeuge',
  'e-scooter',
  'seniorenmobile',
  'fahrradschluessel',
  'schluessel-nach-vorlage',
  'schluessel-nach-code',
  'sperrschliessung',
  'schliessanlage',
  'elektronische-schliesssysteme',
  'sicherheitstechnik',
  'schluesseldienst-vor-ort',
  'beratung',
];

/** Reihenfolge vor FA-SOFORT-05, wie in einer bestehenden Datenbank. */
const ALT: ReadonlyArray<[string, number]> = [
  ['autoschluessel-gehaeuse', 30],
  ['schluessel-nach-code', 40],
  ['schluessel-nach-vorlage', 50],
  ['schluessel-einschicken', 60],
  ['sperrschliessung', 70],
  ['schliessanlage', 80],
  ['elektronische-schliesssysteme', 90],
  ['sicherheitstechnik', 100],
  ['schluesseldienst-vor-ort', 110],
  ['beratung', 120],
  ['transponder-kopie', 130],
  ['schluesselfinder', 140],
  ['tuer-und-schliesstechnik', 150],
];

async function rubrikenAusDb(): Promise<Rubrik[]> {
  const { docs } = await payload.find({ collection: 'rubriken', pagination: false, depth: 0 });
  return (docs as Rubriken[]).map(rubrikZuSeite);
}

async function migrieren() {
  const req = await createLocalReq({}, payload);
  await hubMigrieren({ db: payload.db.drizzle as never, payload, req });
}

describe('Rubriken nach Migration und Seed (FA-SOFORT-05)', () => {
  it('frische Datenbank: Hub mit den 14 Zugängen, neue Symbole und Ersatznachweis gespeichert', async () => {
    const rubriken = await rubrikenAusDb();
    expect(hubKacheln(rubriken).map((r) => r.id)).toEqual(FA03);
    const nach = new Map(rubriken.map((r) => [r.id, r]));
    expect(nach.get('roller-und-kleinstfahrzeuge')).toMatchObject({ icon: 'roller', nachweis: 'fahrzeugschein', ziel: '/roller-und-kleinstfahrzeuge' });
    expect(nach.get('e-scooter')).toMatchObject({ icon: 'e-scooter', nachweis: 'ersatznachweis' });
    expect(nach.get('seniorenmobile')).toMatchObject({ icon: 'seniorenmobil', nachweis: 'ersatznachweis' });
    expect(nach.get('fahrradschluessel')).toMatchObject({ icon: 'fahrradschluessel', nachweis: 'ersatznachweis' });
    expect(nach.get('autoschluessel-gehaeuse')?.imHub).toBe(false);
    // Der Inhalt in der Datenbank gleicht dem Startinhalt (ohne Datenbank dieselben Kacheln).
    expect(hubKacheln(defaults.rubriken()).map((r) => r.id)).toEqual(FA03);
  });

  it('bestehende Datenbank: die Datenmigration setzt Reihenfolge und Hub-Haken des Inhabers, wiederholbar', async () => {
    for (const [kennung, reihenfolge] of ALT) {
      await payload.db.drizzle.execute(sql`UPDATE "rubriken" SET "reihenfolge" = ${reihenfolge} WHERE "kennung" = ${kennung};`);
    }
    await payload.db.drizzle.execute(sql`UPDATE "rubriken" SET "im_hub" = true WHERE "kennung" = 'autoschluessel-gehaeuse';`);
    expect(hubKacheln(await rubrikenAusDb()).map((r) => r.id)).not.toEqual(FA03);

    await migrieren();
    await migrieren(); // wiederholbar: Wertelisten mit IF NOT EXISTS, Daten nur auf dem alten Startwert

    const rubriken = await rubrikenAusDb();
    expect(hubKacheln(rubriken).map((r) => r.id)).toEqual(FA03);
    expect(rubriken.find((r) => r.id === 'autoschluessel-gehaeuse')?.imHub).toBe(false);
  });

  it('bestehende Datenbank: eine vom Betrieb geänderte Reihenfolge bleibt bei der Migration', async () => {
    for (const [kennung, reihenfolge] of ALT) {
      await payload.db.drizzle.execute(sql`UPDATE "rubriken" SET "reihenfolge" = ${reihenfolge} WHERE "kennung" = ${kennung};`);
    }
    // Der Betrieb hat die Beratung selbst nach vorn gestellt (kein Startwert).
    await payload.db.drizzle.execute(sql`UPDATE "rubriken" SET "reihenfolge" = 5 WHERE "kennung" = 'beratung';`);

    await migrieren();
    await migrieren();

    const rubriken = await rubrikenAusDb();
    expect(rubriken.find((r) => r.id === 'beratung')?.reihenfolge).toBe(5);
    expect(rubriken.find((r) => r.id === 'sperrschliessung')?.reihenfolge).toBe(90);
    expect(hubKacheln(rubriken).map((r) => r.id)).toEqual(['beratung', ...FA03.filter((id) => id !== 'beratung')]);

    // Aufräumen für andere Tests: Reihenfolge aus dem Inhalt zurück.
    await payload.db.drizzle.execute(sql`UPDATE "rubriken" SET "reihenfolge" = 140 WHERE "kennung" = 'beratung';`);
    expect(hubKacheln(await rubrikenAusDb()).map((r) => r.id)).toEqual(FA03);
  });

  it('bestehende Datenbank: der Seed gleicht alte Namen ab, gepflegte Namen bleiben', async () => {
    const vorOrt = defaults.rubriken().find((r) => r.id === 'schluesseldienst-vor-ort')!;
    const zutritt = defaults.rubriken().find((r) => r.id === 'elektronische-schliesssysteme')!;
    const alt = {
      vorOrt: { ...vorOrt, name: 'Schlüsseldienst vor Ort', laienname: 'Schlüsseldienst', zusatz: 'vor Ort, mit Termin' },
      zutritt: { ...zutritt, name: 'Elektronische Schließsysteme', laienname: 'Elektronisch schließen' },
    };
    const finde = async (kennung: string) =>
      (await payload.find({ collection: 'rubriken', where: { kennung: { equals: kennung } }, depth: 0 })).docs[0] as Rubriken;

    // Stand vor FA-SOFORT-05: Namen des Seeds von damals, kein eigener Stand für diese Einträge.
    await payload.update({ collection: 'rubriken', id: (await finde(vorOrt.id)).id, data: { name: alt.vorOrt.name, laienname: alt.vorOrt.laienname, zusatz: alt.vorOrt.zusatz }, context });
    await payload.update({ collection: 'rubriken', id: (await finde(zutritt.id)).id, data: { name: 'Vom Betrieb gepflegt' }, context });
    const stand = (await payload.kv.get<Record<string, unknown>>('sm24:seed-stand:rubriken')) ?? {};
    delete stand[vorOrt.id];
    delete stand[zutritt.id];
    await payload.kv.set('sm24:seed-stand:rubriken', stand);

    await inhalteUebernehmen(payload, { startwerte: [{ rubriken: [alt.vorOrt, alt.zutritt] }] });

    const neuVorOrt = await finde(vorOrt.id);
    expect(neuVorOrt.name).toBe('Service vor Ort nach Termin');
    expect(neuVorOrt.laienname).toBe('Vor Ort');
    expect(neuVorOrt.zusatz ?? null).toBeNull();
    // Vom Betrieb geändert: bleibt.
    expect((await finde(zutritt.id)).name).toBe('Vom Betrieb gepflegt');

    // Ein zweiter Lauf ändert nichts mehr.
    await inhalteUebernehmen(payload, { startwerte: [{ rubriken: [alt.vorOrt, alt.zutritt] }] });
    expect((await finde(vorOrt.id)).name).toBe('Service vor Ort nach Termin');
    expect((await finde(zutritt.id)).name).toBe('Vom Betrieb gepflegt');
    expect(hubKacheln(await rubrikenAusDb()).map((r) => r.id)).toEqual(FA03);

    // Aufräumen für andere Tests: Name aus dem Inhalt zurück.
    await payload.update({ collection: 'rubriken', id: (await finde(zutritt.id)).id, data: { name: zutritt.name }, context });
  });
});
