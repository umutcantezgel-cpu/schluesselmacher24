import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import type { CollectionName, Collections } from '@/lib/data/adapter';
import { JsonFileAdapter } from '@/lib/data/json-adapter';
import type { PageContent } from '@/lib/types';
import { inhalteUebernehmen, type InhaltsQuelle, type Startwerte } from './seed';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Der Seed legt
 * neue Einträge an, überschreibt keine gepflegten, belebt keine gelöschten
 * wieder und gleicht unveränderte Startwerte ab. Geprüft wird an eigenen
 * Testseiten, damit die übrigen Inhalte für andere Tests unverändert bleiben. */

let payload: Payload;
const context = { disableRevalidate: true };
const dateien = new JsonFileAdapter();

beforeAll(async () => {
  payload = await getPayload({ config });
});

function seite(route: string, headline: string, subline = 'Unterzeile'): PageContent {
  return {
    route,
    headline,
    subline,
    intro: '',
    sections: [],
    faq: [{ question: 'Frage?', answer: 'Antwort.' }],
    seo: { title: `${headline} | Test`, description: 'Beschreibung', internalLinks: [] },
    updatedAt: '2026-10-25T00:00:00.000Z',
  };
}

/** Inhalte wie in `content/*.json`, mit zusätzlichen Testseiten. */
function quelleMit(seiten: PageContent[]): InhaltsQuelle {
  return {
    async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
      const inhalt = await dateien.read(name);
      return (name === 'pages' ? [...(inhalt as PageContent[]), ...seiten] : inhalt) as Collections[K];
    },
  };
}

async function finde(route: string) {
  const { docs } = await payload.find({ collection: 'seiten', where: { route: { equals: route } }, depth: 0, draft: true });
  return docs[0];
}

describe('Seed je Eintrag', () => {
  it('legt einen fehlenden Eintrag an und überschreibt einen geänderten nicht', async () => {
    await inhalteUebernehmen(payload, { quelle: quelleMit([seite('test/seed-neu', 'Neue Seite')]), startwerte: [] });
    const neu = await finde('test/seed-neu');
    expect(neu?.headline).toBe('Neue Seite');

    // Der Betrieb ändert die Überschrift; ein späterer Inhaltsstand ändert sie auch.
    await payload.update({ collection: 'seiten', id: neu.id, data: { headline: 'Vom Betrieb' }, context });
    await inhalteUebernehmen(payload, { quelle: quelleMit([seite('test/seed-neu', 'Neuer Startwert')]), startwerte: [] });
    expect((await finde('test/seed-neu'))?.headline).toBe('Vom Betrieb');
  });

  it('legt einen gelöschten Eintrag nicht wieder an', async () => {
    const quelle = quelleMit([seite('test/seed-geloescht', 'Wird gelöscht')]);
    await inhalteUebernehmen(payload, { quelle, startwerte: [] });
    const doc = await finde('test/seed-geloescht');
    await payload.delete({ collection: 'seiten', id: doc.id, context });

    await inhalteUebernehmen(payload, { quelle, startwerte: [] });
    expect(await finde('test/seed-geloescht')).toBeUndefined();
  });

  it('übernimmt beim ersten Lauf die Schlüssel des Livegang-Stands — Gelöschtes bleibt weg, Neues kommt', async () => {
    // Datenbank wie vor dem Umbau: nur der alte Vermerk „je Sammlung einmal“.
    await payload.kv.delete('sm24:seed-schluessel:seiten');
    await payload.kv.set('sm24:seed:seiten', { anzahl: 24 });
    const livegang: Startwerte = { pages: [seite('test/livegang-geloescht', 'Im Livegang angelegt')] };

    await inhalteUebernehmen(payload, {
      quelle: quelleMit([seite('test/livegang-geloescht', 'Im Livegang angelegt'), seite('test/nach-livegang', 'Später ergänzt')]),
      startwerte: [livegang],
    });

    expect(await finde('test/livegang-geloescht')).toBeUndefined();
    expect((await finde('test/nach-livegang'))?.headline).toBe('Später ergänzt');
    const liste = await payload.kv.get<{ schluessel: string[] }>('sm24:seed-schluessel:seiten');
    expect(liste?.schluessel).toEqual(expect.arrayContaining(['', 'test/livegang-geloescht', 'test/nach-livegang', 'test/seed-neu']));
  });
});

describe('Startwert-Abgleich', () => {
  it('ersetzt nur Texte, die noch genau einem Startwert entsprechen', async () => {
    // Bestand aus der Zeit vor dem Seed-Vermerk: zwei Seiten mit dem alten Startwert.
    for (const route of ['test/abgleich-alt', 'test/abgleich-betrieb']) {
      await payload.create({
        collection: 'seiten',
        data: {
          route,
          headline: 'Alte Überschrift',
          subline: 'Alte Unterzeile',
          faq: [{ frage: 'Frage?', antwort: 'Antwort.' }],
          seo: { titel: 'Alte Überschrift | Test', beschreibung: 'Beschreibung' },
          _status: 'published',
        },
        context,
      });
    }
    const betrieb = await finde('test/abgleich-betrieb');
    await payload.update({ collection: 'seiten', id: betrieb.id, data: { headline: 'Eigene Überschrift' }, context });

    const startwerte: Startwerte[] = [
      { pages: [seite('test/abgleich-alt', 'Alte Überschrift', 'Alte Unterzeile'), seite('test/abgleich-betrieb', 'Alte Überschrift', 'Alte Unterzeile')] },
    ];
    const quelle = quelleMit([
      seite('test/abgleich-alt', 'Neue Überschrift', 'Neue Unterzeile'),
      seite('test/abgleich-betrieb', 'Neue Überschrift', 'Neue Unterzeile'),
    ]);
    await inhalteUebernehmen(payload, { quelle, startwerte });

    const alt = await finde('test/abgleich-alt');
    expect(alt.headline).toBe('Neue Überschrift');
    expect(alt.subline).toBe('Neue Unterzeile');
    expect(alt.seo?.titel).toBe('Neue Überschrift | Test');
    const eigen = await finde('test/abgleich-betrieb');
    expect(eigen.headline).toBe('Eigene Überschrift');
    // Felder, die der Betrieb nicht angefasst hat, gleicht der Seed trotzdem ab.
    expect(eigen.subline).toBe('Neue Unterzeile');

    // Was der Seed eingespielt hat, gilt beim nächsten Inhaltsstand wieder als Startwert.
    await inhalteUebernehmen(payload, { quelle: quelleMit([seite('test/abgleich-alt', 'Noch neuer', 'Neue Unterzeile')]), startwerte: [] });
    expect((await finde('test/abgleich-alt')).headline).toBe('Noch neuer');
  });

  it('füllt neue, leere Felder der Einstellungen und lässt gepflegte stehen', async () => {
    const db = payload.db.drizzle as unknown as { execute: (q: ReturnType<typeof sql>) => Promise<unknown> };
    await db.execute(sql`UPDATE einstellungen SET buchung_erinnerung_tage_vorher = NULL`);
    await inhalteUebernehmen(payload, { startwerte: [] });
    expect((await payload.findGlobal({ slug: 'einstellungen', depth: 0 })).buchung.erinnerungTageVorher).toBe(1);

    await db.execute(sql`UPDATE einstellungen SET buchung_erinnerung_tage_vorher = 2`);
    await inhalteUebernehmen(payload, { startwerte: [] });
    expect((await payload.findGlobal({ slug: 'einstellungen', depth: 0 })).buchung.erinnerungTageVorher).toBe(2);
    await db.execute(sql`UPDATE einstellungen SET buchung_erinnerung_tage_vorher = 1`);
  });
});
