import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { defaults } from '@/lib/data/defaults';
import { PayloadAdapter } from '@/lib/data/payload-adapter';
import { inhalteUebernehmen } from './seed';

/* Tutorials (FA-INHALT-01) gegen die Testdatenbank: Startbestand aus dem Seed (veröffentlichte und Entwürfe),
 * Verweis auf den Ratgeber, YouTube-Link wird beim Speichern zur Kennung, fremde Adressen werden abgelehnt,
 * Entwürfe erscheinen nicht. Erfundene Testdaten und Kennungen (G4), kein Netzabruf. */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };
const aufraeumen: number[] = [];
const lauf = `${process.pid}`;
const ID = 'aB3_dE-5gH7';

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  for (const id of aufraeumen.reverse()) {
    await payload.delete({ collection: 'tutorials', id, trash: true, context }).catch(() => undefined);
  }
});

const neu = (extra: Record<string, unknown> = {}) => ({
  titel: `Wie testet man ein Tutorial ${lauf}?`,
  kurzantwort: 'Mit erfundenen Daten.',
  thema: 'schluessel-nach-vorlage' as const,
  schritte: [
    { ueberschrift: 'Erst', text: 'Erster Schritt.' },
    { ueberschrift: 'Dann', text: 'Zweiter Schritt.' },
  ],
  reihenfolge: 999,
  slug: `test-tutorial-${lauf}`,
  ...extra,
});

/** Meldungen eines abgelehnten Speicherns (Payload nennt im Fehlertext nur die Felder). */
async function meldungen(vorgang: Promise<unknown>): Promise<string> {
  try {
    await vorgang;
  } catch (fehler) {
    const daten = (fehler as { data?: { errors?: Array<{ message?: string }> } }).data;
    return [(fehler as Error).message, ...(daten?.errors ?? []).map((e) => e.message ?? '')].join(' | ');
  }
  throw new Error('Speichern wurde nicht abgelehnt.');
}

describe('Startbestand aus dem Seed', () => {
  it('legt alle zehn Themen an, zwei davon als Entwurf, und zeigt nur die veröffentlichten', async () => {
    const start = defaults.tutorials();
    const { docs } = await payload.find({ collection: 'tutorials', limit: 0, pagination: false, depth: 0, draft: true, trash: true });
    const kennungen = new Map(docs.map((d) => [d.kennung, d._status]));
    for (const t of start) expect(kennungen.get(t.id), t.id).toBe(t.published ? 'published' : 'draft');

    const sichtbar = (await adapter.read('tutorials')).filter((t) => start.some((s) => s.id === t.id));
    expect(sichtbar.map((t) => t.id)).toEqual(start.filter((t) => t.published).map((t) => t.id));
    expect(sichtbar.every((t) => t.published)).toBe(true);
  });

  it('löst den Verweis auf den Ratgeber auf und gibt die Schritte vollständig heraus', async () => {
    const messen = (await adapter.read('tutorials')).find((t) => t.id === 'profilzylinder-messen');
    const erwartet = defaults.tutorials().find((t) => t.id === 'profilzylinder-messen')!;
    expect(messen?.guideSlug).toBe('zylinder-richtig-ausmessen');
    expect(messen?.steps).toEqual(erwartet.steps);
    expect(messen?.places).toEqual(erwartet.places);
  });

  it('ist wiederholbar: ein zweiter Lauf legt nichts doppelt an und veröffentlicht keinen Entwurf', async () => {
    await inhalteUebernehmen(payload);
    const { totalDocs } = await payload.count({ collection: 'tutorials', where: { kennung: { equals: 'gehaeuseumbau' } }, trash: true });
    expect(totalDocs).toBe(1);
    expect((await adapter.read('tutorials')).map((t) => t.id)).not.toContain('gehaeuseumbau');
  });
});

describe('YouTube-Video im Admin', () => {
  it('speichert aus einem eingefügten Link nur die Kennung', async () => {
    const doc = await payload.create({
      collection: 'tutorials',
      data: neu({ video: { youtube: `https://www.youtube.com/watch?v=${ID}&t=12s`, dauer: '3:05' }, _status: 'published' }),
      context,
    });
    aufraeumen.push(doc.id);
    expect(doc.video?.youtube).toBe(ID);

    const getauscht = await payload.update({ collection: 'tutorials', id: doc.id, data: { video: { youtube: `https://youtu.be/${ID.split('').reverse().join('')}` } }, context });
    expect(getauscht.video?.youtube).toBe(ID.split('').reverse().join(''));

    const gelesen = (await adapter.read('tutorials')).find((t) => t.slug === `test-tutorial-${lauf}`);
    expect(gelesen?.video?.youtubeId).toBe(ID.split('').reverse().join(''));
  });

  it('lehnt fremde Adressen und kaputte Dauer ab', async () => {
    const fremd = await meldungen(
      payload.create({ collection: 'tutorials', data: neu({ slug: `fremd-${lauf}`, video: { youtube: `https://vimeo.com/${ID}` }, _status: 'published' }), context }),
    );
    expect(fremd).toMatch(/YouTube|youtube/);
    const dauer = await meldungen(
      payload.create({ collection: 'tutorials', data: neu({ slug: `dauer-${lauf}`, video: { youtube: ID, dauer: 'lang' }, _status: 'published' }), context }),
    );
    expect(dauer).toMatch(/Dauer|dauer/);
  });

  it('ein Entwurf erscheint nicht auf der Seite', async () => {
    const doc = await payload.create({ collection: 'tutorials', data: neu({ slug: `entwurf-${lauf}`, titel: `Entwurf ${lauf}?` }), draft: true, context });
    aufraeumen.push(doc.id);
    expect((await adapter.read('tutorials')).map((t) => t.slug)).not.toContain(`entwurf-${lauf}`);
  });
});

describe('Migration 20261116_174304_tutorials', () => {
  // Läuft zuletzt: down entfernt die Tabellen samt Inhalt, up legt sie leer wieder an.
  it('down und up laufen zurück und wieder vor, ohne fremde Tabellen anzufassen', async () => {
    const migration = await import('../migrations/20261116_174304_tutorials');
    const args = { db: payload.db.drizzle, payload, req: {} } as never;
    const tabelle = async (name: string) => {
      const ergebnis = (await payload.db.drizzle.execute(sql`SELECT to_regclass(${`public.${name}`}) AS t`)) as unknown as { rows: Array<{ t: string | null }> };
      return ergebnis.rows[0]?.t ?? null;
    };
    const spalte = async () => {
      const ergebnis = (await payload.db.drizzle.execute(
        sql`SELECT 1 FROM information_schema.columns WHERE table_name = 'payload_locked_documents_rels' AND column_name = 'tutorials_id'`,
      )) as unknown as { rows: unknown[] };
      return ergebnis.rows.length;
    };

    await migration.down(args);
    expect(await tabelle('tutorials')).toBeNull();
    expect(await tabelle('_tutorials_v')).toBeNull();
    expect(await spalte()).toBe(0);
    expect(await tabelle('ratgeber')).toBe('ratgeber');
    expect(await tabelle('payload_locked_documents_rels')).toBe('payload_locked_documents_rels');
    // Ein zweites down bricht nicht (IF EXISTS).
    await migration.down(args);

    await migration.up(args);
    expect(await tabelle('tutorials')).toBe('tutorials');
    expect(await spalte()).toBe(1);
  });
});
