import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { PayloadAdapter } from '@/lib/data/payload-adapter';
import { inhalteUebernehmen } from '@/payload/seed';

/* Ortsseiten am Ortsstamm (FA-PLATTFORM-03B) gegen die Testdatenbank: Gemeindeschlüssel, Stufe aus Anhang A,
 * Partnerregion nur als Kennung, Seed ergänzt den Schlüssel von Wetzlar. Erfundene Daten (G4). */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };

beforeAll(async () => {
  payload = await getPayload({ config });
});

function stadt(slug: string, gemeindeschluessel: string | null) {
  return {
    kennung: slug,
    slug,
    stadt: slug,
    bundesland: 'Hessen',
    lokalIntro: 'Testeinleitung für eine erfundene Ortsseite.',
    leistungen: ['autoschluessel' as const],
    radiusKm: 0,
    seo: { titel: `Test ${slug}`, beschreibung: 'Test.' },
    gemeindeschluessel,
    _status: 'published' as const,
  };
}

describe('Ortsseiten am Ortsstamm', () => {
  it('setzt die Stufe aus Anhang A über den Gemeindeschlüssel', async () => {
    // Gießen (06531005) steht in Anhang A, Aßlar (06532001) nicht.
    const giessen = await payload.create({ collection: 'einsatzgebiete', data: stadt('test-giessen', '06531005'), context });
    const asslar = await payload.create({ collection: 'einsatzgebiete', data: stadt('test-asslar', '06532001'), context });
    try {
      expect(giessen.stufeAnhangA).toBe(true);
      expect(asslar.stufeAnhangA).toBe(false);
      const ohne = await payload.update({ collection: 'einsatzgebiete', id: giessen.id, data: { gemeindeschluessel: '' }, context });
      expect(ohne.gemeindeschluessel).toBeNull();
      expect(ohne.stufeAnhangA).toBe(false);
    } finally {
      await payload.delete({ collection: 'einsatzgebiete', where: { id: { in: [giessen.id, asslar.id] } }, context });
    }
  });

  it('lehnt einen Gemeindeschlüssel ab, der nicht acht Ziffern hat, und einen doppelten', async () => {
    await expect(payload.create({ collection: 'einsatzgebiete', data: stadt('test-falsch', '6532023'), context })).rejects.toThrow();
    await expect(payload.create({ collection: 'einsatzgebiete', data: stadt('test-doppelt', '06532023'), context })).rejects.toThrow();
  });

  it('meldet verständlich, wenn der Schlüssel an einer Ortsseite im Papierkorb hängt', async () => {
    const alt = await payload.create({ collection: 'einsatzgebiete', data: stadt('test-papierkorb', '06532004'), context });
    try {
      await payload.update({ collection: 'einsatzgebiete', id: alt.id, data: { deletedAt: new Date().toISOString() }, trash: true, context });
      const fehler = await payload.create({ collection: 'einsatzgebiete', data: stadt('test-papierkorb-neu', '06532004'), context }).then(
        () => null,
        (e: unknown) => e as { data?: { errors?: Array<{ message?: string }> } },
      );
      const meldung = fehler?.data?.errors?.[0]?.message ?? '';
      expect(meldung).toContain('im Papierkorb');
      expect(meldung).toContain('„test-papierkorb“');
      // Die Seite selbst lässt sich mit ihrem Schlüssel weiter speichern.
      const wieder = await payload.update({ collection: 'einsatzgebiete', id: alt.id, data: { gemeindeschluessel: '06532004', deletedAt: null }, trash: true, context });
      expect(wieder.gemeindeschluessel).toBe('06532004');
    } finally {
      await payload.delete({ collection: 'einsatzgebiete', id: alt.id, trash: true, context }).catch(() => undefined);
    }
  });

  it('der Seed hat Wetzlar an den Stamm gehängt, wiederholbar', async () => {
    await inhalteUebernehmen(payload);
    const [wetzlar] = (await payload.find({ collection: 'einsatzgebiete', where: { slug: { equals: 'wetzlar' } }, depth: 0 })).docs;
    expect(wetzlar.gemeindeschluessel).toBe('06532023');
    expect(wetzlar.stufeAnhangA).toBe(true);
  });

  it('liefert die Partnerregion nur als Kennung, nie mit Namen', async () => {
    const partner = await payload.create({
      collection: 'partnerbetriebe',
      data: { firma: 'Erfundener Testbetrieb GmbH', ort: 'Teststadt' } as never,
      context,
    });
    const ort = await payload.create({
      collection: 'einsatzgebiete',
      data: { ...stadt('test-partner', '06532005'), partnerregion: [partner.id] },
      context,
    });
    try {
      const seite = (await adapter.read('cities')).find((c) => c.slug === 'test-partner');
      expect(seite?.partnerregion).toEqual([String(partner.id)]);
      expect(JSON.stringify(seite)).not.toContain('Erfundener Testbetrieb');
    } finally {
      await payload.delete({ collection: 'einsatzgebiete', id: ort.id, context });
      await payload.delete({ collection: 'partnerbetriebe', id: partner.id, context });
    }
  });
});
