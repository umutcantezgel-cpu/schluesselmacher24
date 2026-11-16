import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';
import { vorgangAnlegen, type NeuerVorgang } from '@/lib/data';

/* Vorschlagsliste am Vorgang gegen die Testdatenbank (FA-PLATTFORM-01C): Ein freigeschalteter Betrieb, der nur
 * einen Umkreis hat (keine Postleitzahlen, keine Regionen), erscheint für eine Postleitzahl im Umkreis mit Grund
 * und Kilometern, für eine außerhalb nicht. Stichprobe Lahn-Dill-Kreis: Sitz 35576 Wetzlar, 20 km; 35390 Gießen
 * liegt 10,8 km entfernt, 35683 Dillenburg 25,3 km. Erfundene Betriebe und Kunden (G4, G13).
 * Regel „Region geprüft“ (A-070): Der Umkreis zählt nur mit erledigtem Punkt „Region und Radius“ der Prüfliste.
 * Ein zweiter Betrieb mit demselben Umkreis, aber dem Vermerk „vor Einführung der Prüfliste“ und ohne den Punkt,
 * erscheint nie. */

let payload: Payload;
const STAND = '2026-11-16T10:00:00.000Z';
const FIRMA = 'Testbetrieb nur Umkreis';
const FIRMA_UNGEPRUEFT = 'Testbetrieb Umkreis ungeprüft';
const REGION_ERLEDIGT = { erledigt: true, am: '2026-11-16T09:00:00.000Z', pruefer: 'Testprüferin' };

let idGeprueft: number | string;
let idUngeprueft: number | string;

async function umkreisBetrieb(firma: string, pruefliste: Record<string, unknown>, auftragsarten: string[] = ['schluessel-nachmachen']) {
  const neu = await payload.create({
    collection: 'partnerbetriebe',
    data: {
      firma,
      plz: '35576',
      ort: 'Wetzlar',
      status: 'eingegangen',
      abrechnungsmodell: 'B',
      auftragsarten: auftragsarten as never,
      einsatzgebiet: { postleitzahlen: '', radiusKm: 20 },
    },
    overrideAccess: true,
  });
  // Freischalten ohne die übrige Prüfliste: Hier geht es nur um die Abdeckung, nicht um den Weg dorthin.
  await payload.db.updateOne({ collection: 'partnerbetriebe', id: neu.id, data: { status: 'freigeschaltet', pruefliste } });
  return neu.id;
}

beforeAll(async () => {
  vi.stubEnv('PARTNERMODELL_B', 'aktiv');
  payload = await getPayload({ config });
  idGeprueft = await umkreisBetrieb(FIRMA, { region: REGION_ERLEDIGT });
  idUngeprueft = await umkreisBetrieb(FIRMA_UNGEPRUEFT, { vorEinfuehrung: true });
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

  it('nennt einen Betrieb ohne erledigten Punkt „Region und Radius“ nicht (A-070)', async () => {
    const giessen = await partnerauftrag('35390');
    expect(await vorschlaege(giessen.id)).not.toContain(FIRMA_UNGEPRUEFT);
  });

  it('nennt ihn nicht mehr, wenn beim Punkt „Region und Radius“ der Prüfer fehlt', async () => {
    const gefunden = await payload.find({ collection: 'partnerbetriebe', where: { firma: { equals: FIRMA } }, depth: 0, overrideAccess: true });
    const id = gefunden.docs[0].id;
    await payload.db.updateOne({ collection: 'partnerbetriebe', id, data: { pruefliste: { region: { ...REGION_ERLEDIGT, pruefer: '' } } } });
    try {
      const giessen = await partnerauftrag('35390');
      expect(await vorschlaege(giessen.id)).not.toContain(FIRMA);
    } finally {
      await payload.db.updateOne({ collection: 'partnerbetriebe', id, data: { pruefliste: { region: REGION_ERLEDIGT } } });
    }
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

describe('Partnerweg für Kunden liest dieselben Angaben (Datenbank, A-070)', () => {
  it('partnerFuerAuftragsweg liefert Postleitzahl, Umkreis und den Punkt „Region und Radius“', async () => {
    const { partnerFuerAuftragsweg } = await import('./partnerweg-daten');
    const partner = await partnerFuerAuftragsweg();
    expect(partner.find((p) => p.id === String(idGeprueft))).toMatchObject({ plz: '35576', radiusKm: 20, regionGeprueft: true, abrechnungsmodell: 'B' });
    expect(partner.find((p) => p.id === String(idUngeprueft))).toMatchObject({ plz: '35576', radiusKm: 20, regionGeprueft: false });
  });
});

describe('Postleitzahl-Abfrage liest dieselben Angaben (Datenbank, Nachbesserung 3)', () => {
  /*
   * Zwei Betriebe nur mit Umkreis (20 km um 35576), je mit einer eigenen Leistung, die kein anderer Datenbanktest
   * vergibt: „Motorrad“ mit erledigtem Punkt „Region und Radius“, „Reparatur“ mit dem Vermerk „vor Einführung“.
   * Für 35390 (10,8 km) zählt nur der geprüfte. Liest `partnerFuerAbdeckung` (stamm.ts) `plz` oder
   * `pruefliste.region` nicht mehr aus, wird der erste Fall rot.
   */
  beforeAll(async () => {
    await umkreisBetrieb('Testbetrieb Abfrage geprüft', { region: REGION_ERLEDIGT }, ['motorrad-weitere']);
    await umkreisBetrieb('Testbetrieb Abfrage ungeprüft', { vorEinfuehrung: true }, ['reparatur-gehaeuse']);
  });

  it('postleitzahlAbfragen: der geprüfte Umkreis zählt, der ungeprüfte nicht', async () => {
    const { postleitzahlAbfragen } = await import('@/lib/orte/stamm');
    expect(await postleitzahlAbfragen('35390', 'motorrad-weitere')).toMatchObject({ bekannt: true, partnerVorhanden: true });
    expect(await postleitzahlAbfragen('35390', 'reparatur-gehaeuse')).toMatchObject({ bekannt: true, partnerVorhanden: false });
    // Außerhalb des Umkreises (25,3 km) auch der geprüfte nicht.
    expect(await postleitzahlAbfragen('35683', 'motorrad-weitere')).toMatchObject({ partnerVorhanden: false });
  });
});
