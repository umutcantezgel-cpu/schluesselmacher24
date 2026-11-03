import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';

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
      data: { firma: 'Testbetrieb West', ort: 'Köln', status: 'eingegangen', abrechnungsmodell: 'A', provisionen: [{ auftragsart: 'montage-zylinder', prozent: 10 }] },
      overrideAccess: false,
      user: inhaber,
    });
    const alsTeam = await payload.findByID({ collection: 'partnerbetriebe', id: doc.id, overrideAccess: false, user: team });
    /* Payload liefert Felder ohne Leserecht als leere Liste. */
    expect(alsTeam.provisionen ?? []).toEqual([]);
    const alsInhaber = await payload.findByID({ collection: 'partnerbetriebe', id: doc.id, overrideAccess: false, user: inhaber });
    expect(alsInhaber.provisionen?.[0]?.prozent).toBe(10);
  });
});
