import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import type { CollectionName, Collections } from '@/lib/data/adapter';
import { JsonFileAdapter } from '@/lib/data/json-adapter';
import { defaults } from '@/lib/data/defaults';
import type { CodeLine, PageContent, StandardArticle } from '@/lib/types';
import * as m from '@/lib/data/payload-mapping';
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

describe('Beispiel-Einträge (A-046)', () => {
  async function kennungen(): Promise<string[]> {
    const { docs } = await payload.find({ collection: 'produkte', pagination: false, trash: true, draft: true, depth: 0 });
    return docs.map((d) => d.kennung ?? '');
  }

  it('legt Beispiel-Codelinien und -Artikel nie an, auch mit SM24_BEISPIELE=1; echte schon', async () => {
    // Die Testkonfiguration macht Beispiele sichtbar; der Seed darf sich davon nicht leiten lassen.
    expect(process.env.SM24_BEISPIELE).toBe('1');
    const muster = (await dateien.read('codeLines'))[0];
    const artikel = defaults.standardArticles()[0];
    // Echte Linien brauchen Hersteller und Codebereich zum Veröffentlichen (FA-SHOP-05).
    const linie = (id: string, example: boolean): CodeLine => ({
      ...muster,
      id,
      slug: id,
      name: `Testlinie ${id}`,
      system: 'Testsystem',
      manufacturer: 'Testhersteller',
      codeRange: '0001 bis 9999',
      example,
    });
    const ware = (id: string, example: boolean): StandardArticle => ({ ...artikel, id, slug: id, name: `Testartikel ${id}`, example });
    const quelle: InhaltsQuelle = {
      async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
        const inhalt = await dateien.read(name);
        if (name === 'codeLines') return [...(inhalt as CodeLine[]), linie('test-seed-beispiellinie', true), linie('test-seed-echte-linie', false)] as Collections[K];
        if (name === 'standardArticles') return [ware('test-seed-beispielartikel', true), ware('test-seed-echter-artikel', false)] as Collections[K];
        return inhalt;
      },
    };

    await inhalteUebernehmen(payload, { quelle, startwerte: [] });

    const vorhanden = await kennungen();
    expect(vorhanden).toContain('test-seed-echte-linie');
    expect(vorhanden).toContain('test-seed-echter-artikel');
    expect(vorhanden).not.toContain('test-seed-beispiellinie');
    expect(vorhanden).not.toContain('test-seed-beispielartikel');
    // Keine der 52 Muster-Codelinien und keiner der Beispielartikel aus content/ bzw. den Standardwerten.
    for (const beispiel of [...(await dateien.read('codeLines')), ...defaults.standardArticles()]) {
      expect(beispiel.example).toBe(true);
      expect(vorhanden).not.toContain(beispiel.id);
    }
    expect((await payload.count({ collection: 'produkte', where: { beispiel: { equals: true } }, trash: true })).totalDocs).toBe(0);

    await payload.delete({ collection: 'produkte', where: { kennung: { in: ['test-seed-echte-linie', 'test-seed-echter-artikel'] } }, trash: true, context });
  });

  it('lässt einen Beispiel-Eintrag einer bestehenden Datenbank unberührt (kein Löschen, kein Abgleich)', async () => {
    const muster = (await dateien.read('codeLines'))[1];
    const bestand = await payload.create({
      collection: 'produkte',
      data: { ...m.codeLineZuPayload(muster), kennung: 'test-seed-bestand', slug: 'test-seed-bestand', name: 'Bestand vor A-046' },
      context,
    });
    const quelle: InhaltsQuelle = {
      async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
        const inhalt = await dateien.read(name);
        return (name === 'codeLines'
          ? [...(inhalt as CodeLine[]), { ...muster, id: 'test-seed-bestand', slug: 'test-seed-bestand', name: 'Neuer Name' }]
          : inhalt) as Collections[K];
      },
    };
    try {
      await inhalteUebernehmen(payload, { quelle, startwerte: [] });
      const nachher = await payload.findByID({ collection: 'produkte', id: bestand.id, depth: 0 });
      expect(nachher.name).toBe('Bestand vor A-046');
      expect(nachher.beispiel).toBe(true);
      expect(nachher.deletedAt ?? null).toBeNull();
    } finally {
      await payload.delete({ collection: 'produkte', id: bestand.id, trash: true, context });
    }
  });
});
