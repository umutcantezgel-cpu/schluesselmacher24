import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';
import { vorgangAnlegen, type NeuerVorgang } from '@/lib/data';

/* Vorschlagsliste am Vorgang gegen die Testdatenbank (FA-PLATTFORM-01C): Ein freigeschalteter Betrieb, der nur
 * einen Umkreis hat (keine Postleitzahlen, keine Regionen), erscheint für eine Postleitzahl im Umkreis mit Grund
 * und Kilometern, für eine außerhalb nicht. Stichprobe Lahn-Dill-Kreis: Sitz 35576 Wetzlar, 20 km; 35390 Gießen
 * liegt 10,8 km entfernt, 35683 Dillenburg 25,3 km. Erfundene Betriebe und Kunden (G4, G13). */

let payload: Payload;
const STAND = '2026-11-16T10:00:00.000Z';
const FIRMA = 'Testbetrieb nur Umkreis';

beforeAll(async () => {
  vi.stubEnv('PARTNERMODELL_B', 'aktiv');
  payload = await getPayload({ config });
  const neu = await payload.create({
    collection: 'partnerbetriebe',
    data: {
      firma: FIRMA,
      plz: '35576',
      ort: 'Wetzlar',
      status: 'eingegangen',
      abrechnungsmodell: 'B',
      auftragsarten: ['schluessel-nachmachen'],
      einsatzgebiet: { postleitzahlen: '', radiusKm: 20 },
    },
    overrideAccess: true,
  });
  // Freischalten ohne Prüfliste: Hier geht es nur um die Abdeckung, nicht um den Weg dorthin.
  await payload.db.updateOne({ collection: 'partnerbetriebe', id: neu.id, data: { status: 'freigeschaltet' } });
});

afterAll(() => {
  vi.unstubAllEnvs();
});

async function partnerauftrag(postalCode: string) {
  return vorgangAnlegen({
    art: 'termin',
    jahr: 2085,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', postalCode, country: 'Deutschland' },
      payload: { auftragsweg: 'partner' },
      summary: [],
      uploads: [],
      auftragsweg: 'partner',
      payment: { scope: 'gesamt', amountCents: 30_000, status: 'offen' },
      internalNotes: [],
      timeline: [],
    }),
  });
}

const vorschlaege = async (id: string) =>
  (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })).vermittlung?.partnerVorschlaege ?? '';

describe('Vorschlagsliste mit Umkreis (Datenbank)', () => {
  it('nennt den Betrieb mit nur einem Umkreis innerhalb, mit Grund und Kilometern', async () => {
    const giessen = await partnerauftrag('35390');
    expect(await vorschlaege(giessen.id)).toContain(`${FIRMA} (Wetzlar): Umkreis: 10,8 km von 35576 (bis 20 km)`);
  });

  it('nennt ihn außerhalb des Umkreises nicht, auch nicht im selben Landkreis', async () => {
    const dillenburg = await partnerauftrag('35683');
    expect(await vorschlaege(dillenburg.id)).not.toContain(FIRMA);
  });

  it('nennt ihn nicht, wenn er pausiert ist', async () => {
    const gefunden = await payload.find({ collection: 'partnerbetriebe', where: { firma: { equals: FIRMA } }, depth: 0, overrideAccess: true });
    const id = gefunden.docs[0].id;
    await payload.db.updateOne({ collection: 'partnerbetriebe', id, data: { status: 'pausiert' } });
    try {
      const giessen = await partnerauftrag('35390');
      expect(await vorschlaege(giessen.id)).not.toContain(FIRMA);
    } finally {
      await payload.db.updateOne({ collection: 'partnerbetriebe', id, data: { status: 'freigeschaltet' } });
    }
  });
});
