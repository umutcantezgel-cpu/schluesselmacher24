import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { createRecord } from '@/lib/server/create-record';

/* Gegen die Testdatenbank: Freischaltung nur nach Prüfung und Vertrag (MA-16), Modell B gesperrt,
 * Provisionen nur für den Inhaber sichtbar (G13). Erfundene Testdaten (G4). */

let payload: Payload;
let team: Record<string, unknown> & { collection: 'benutzer' };
let inhaber: Record<string, unknown> & { collection: 'benutzer' };

beforeAll(async () => {
  payload = await getPayload({ config });
  const anlegen = async (rolle: 'mitarbeiter' | 'inhaber') => ({
    ...(await payload.create({
      collection: 'benutzer',
      data: { email: `partner-${rolle}-${Date.now()}@example.org`, password: 'nur-fuer-tests-123456', rollen: [rolle] },
      overrideAccess: true,
    })),
    collection: 'benutzer' as const,
  });
  team = await anlegen('mitarbeiter');
  inhaber = await anlegen('inhaber');
});

describe('Partnerbetriebe', () => {
  it('schaltet erst nach allen Prüfungen und dem unterschriebenen Vertrag frei', async () => {
    const neu = await payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Nord', ort: 'Hamburg', status: 'eingegangen', abrechnungsmodell: 'A' }, overrideAccess: false, user: team });
    expect(neu.status).toBe('eingegangen');
    await expect(payload.update({ collection: 'partnerbetriebe', id: neu.id, data: { status: 'freigeschaltet' }, overrideAccess: false, user: team })).rejects.toThrow();
    for (const status of ['in-pruefung', 'vertrag-versendet', 'vertrag-unterschrieben'] as const) {
      await payload.update({ collection: 'partnerbetriebe', id: neu.id, data: { status }, overrideAccess: false, user: team });
    }
    await expect(payload.update({ collection: 'partnerbetriebe', id: neu.id, data: { status: 'freigeschaltet' }, overrideAccess: false, user: team })).rejects.toThrow(/Gewerbenachweis/);
    await payload.update({
      collection: 'partnerbetriebe',
      id: neu.id,
      data: { pruefung: { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true }, vertrag: { unterschriebenAm: '2026-11-03T00:00:00.000Z' } },
      overrideAccess: false,
      user: team,
    });
    const frei = await payload.update({ collection: 'partnerbetriebe', id: neu.id, data: { status: 'freigeschaltet' }, overrideAccess: false, user: team });
    expect(frei.status).toBe('freigeschaltet');
  });

  it('lässt Modell B nicht zu, solange es ausgeschaltet ist', async () => {
    await expect(
      payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Süd', ort: 'München', status: 'eingegangen', abrechnungsmodell: 'B' }, overrideAccess: false, user: team }),
    ).rejects.toThrow(/Modell B/);
  });

  it('zeigt Provisionen nur dem Inhaber', async () => {
    const doc = await payload.create({
      collection: 'partnerbetriebe',
      data: { firma: 'Testbetrieb West', ort: 'Köln', status: 'eingegangen', abrechnungsmodell: 'A', provisionen: [{ auftragsart: 'funk', prozent: 10 }] },
      overrideAccess: false,
      user: inhaber,
    });
    const alsTeam = await payload.findByID({ collection: 'partnerbetriebe', id: doc.id, overrideAccess: false, user: team });
    /* Payload liefert Felder ohne Leserecht als leere Liste. */
    expect(alsTeam.provisionen ?? []).toEqual([]);
    const alsInhaber = await payload.findByID({ collection: 'partnerbetriebe', id: doc.id, overrideAccess: false, user: inhaber });
    expect(alsInhaber.provisionen?.[0]?.prozent).toBe(10);
  });

  it('nimmt nur die neun Leistungen neu an, frühere Werte bleiben lesbar (FA-PLATTFORM-01)', async () => {
    await expect(
      payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Tür', ort: 'Kassel', status: 'eingegangen', abrechnungsmodell: 'A', auftragsarten: ['schluesseldienst-vor-ort'] }, overrideAccess: false, user: team }),
    ).rejects.toThrow(/nur Autoschlüssel und Fahrzeugschlüssel/);
    const neu = await payload.create({
      collection: 'partnerbetriebe',
      data: { firma: 'Testbetrieb Funk', ort: 'Kassel', plz: '34117', status: 'eingegangen', abrechnungsmodell: 'A', auftragsarten: ['funk', 'transponder'], werkstatt: { vorhanden: 'ja', anschrift: 'Teststraße 2', mobil: true }, geraete: [{ art: 'diagnose', hersteller: 'Testhersteller' }], erfahrung: { jahre: 3 } },
      overrideAccess: false,
      user: team,
    });
    expect(neu.auftragsarten).toEqual(['funk', 'transponder']);
    expect(neu.geraete?.[0]?.art).toBe('diagnose');
    expect(neu.werkstatt?.vorhanden).toBe('ja');

    // Altbestand mit früherem Wert: direkt in der Datenbank wie vor FA-PLATTFORM-01 (ohne Hook).
    const alt = await payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Alt', ort: 'Fulda', status: 'eingegangen', abrechnungsmodell: 'A' }, overrideAccess: false, user: team });
    await payload.db.drizzle.execute(sql`INSERT INTO "partnerbetriebe_auftragsarten" ("order", "parent_id", "value") VALUES (1, ${alt.id}, 'montage-zylinder')`);
    const gelesen = await payload.findByID({ collection: 'partnerbetriebe', id: alt.id, overrideAccess: false, user: team });
    expect(gelesen.auftragsarten).toEqual(['montage-zylinder']);
    const weiter = await payload.update({ collection: 'partnerbetriebe', id: alt.id, data: { auftragsarten: ['montage-zylinder', 'funk'] }, overrideAccess: false, user: team });
    expect(weiter.auftragsarten).toEqual(['montage-zylinder', 'funk']);
    await expect(
      payload.update({ collection: 'partnerbetriebe', id: alt.id, data: { auftragsarten: ['funk', 'beratung-vor-ort'] }, overrideAccess: false, user: team }),
    ).rejects.toThrow(/Beratung vor Ort/);
  });

  it('füllt beim Verknüpfen der Bewerbung die leeren Felder aus dem Formular', async () => {
    const bewerbung = await createRecord({
      kind: 'partner',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact: { firstName: 'Erika', lastName: 'Test', email: 'erika@example.org', phone: '0641123456', company: 'Testbetrieb Mitte GmbH', postalCode: '35390', city: 'Gießen', country: 'Deutschland' },
      payload: {
        firma: 'Testbetrieb Mitte GmbH',
        plz: '35390',
        ort: 'Gießen',
        einsatzPostleitzahlen: '353*',
        einsatzradiusKm: 30,
        mobileEinsaetze: true,
        werkstatt: { vorhanden: false, anschrift: null },
        leistungen: ['keyless-smart-key', 'funk'],
        geraete: [{ art: 'programmiergeraet', hersteller: 'Testhersteller', typ: 'P2' }],
        erfahrung: { jahre: 12, schwerpunkte: null, fahrzeugabdeckung: 'Pkw' },
        datenschutz: true,
      },
      summary: [],
      uploads: [],
    });
    expect(bewerbung.ok).toBe(true);
    const betrieb = await payload.create({
      collection: 'partnerbetriebe',
      data: { firma: 'Testbetrieb Mitte', ort: 'Gießen', status: 'eingegangen', abrechnungsmodell: 'A', bewerbung: Number(bewerbung.recordId) },
      overrideAccess: false,
      user: team,
    });
    expect(betrieb.firma).toBe('Testbetrieb Mitte');
    expect(betrieb).toMatchObject({
      plz: '35390',
      ansprechpartner: 'Erika Test',
      email: 'erika@example.org',
      auftragsarten: ['keyless-smart-key', 'funk'],
      einsatzgebiet: { postleitzahlen: '353*', radiusKm: 30 },
      werkstatt: { vorhanden: 'nein', mobil: true },
      erfahrung: { jahre: 12, fahrzeugabdeckung: 'Pkw' },
    });
    expect(betrieb.geraete?.[0]).toMatchObject({ art: 'programmiergeraet', hersteller: 'Testhersteller', typ: 'P2' });

    // Wie aus dem Admin-Formular: Die Gruppe kommt mit dem Grundwert false der Checkbox.
    const ausAdmin = await payload.create({
      collection: 'partnerbetriebe',
      data: {
        firma: 'Testbetrieb Admin',
        ort: 'Gießen',
        status: 'eingegangen',
        abrechnungsmodell: 'A',
        werkstatt: { mobil: false, vorhanden: null, anschrift: '' },
        bewerbung: Number(bewerbung.recordId),
      },
      overrideAccess: false,
      user: team,
    });
    expect(ausAdmin.werkstatt).toMatchObject({ vorhanden: 'nein', mobil: true });
  });

  it('lässt frühere Auftragsarten an den Provisionen nicht neu setzen, der Sammelwert bleibt', async () => {
    await expect(
      payload.create({
        collection: 'partnerbetriebe',
        data: { firma: 'Testbetrieb Provision', ort: 'Marburg', status: 'eingegangen', abrechnungsmodell: 'A', provisionen: [{ auftragsart: 'montage-schliessanlage', prozent: 10 }] },
        overrideAccess: false,
        user: inhaber,
      }),
    ).rejects.toThrow(/Montage Schließanlage/);
    const neu = await payload.create({
      collection: 'partnerbetriebe',
      data: {
        firma: 'Testbetrieb Provision',
        ort: 'Marburg',
        status: 'eingegangen',
        abrechnungsmodell: 'A',
        provisionen: [{ auftragsart: 'autoschluessel-vor-ort', prozent: 10 }, { auftragsart: 'funk', prozent: 8 }],
      },
      overrideAccess: false,
      user: inhaber,
    });
    expect(neu.provisionen?.map((p) => p.auftragsart)).toEqual(['autoschluessel-vor-ort', 'funk']);
  });
});

