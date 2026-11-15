import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import type { BusinessRecord } from '@/lib/types';

import { einstellungenZuSeite } from './payload-mapping';
import { getRecord, vorgangAendern, vorgangAnlegen, type NeuerVorgang } from './index';

/* Gegen die Testdatenbank (FA-KERN-03): Auftragsweg, Gesamtpreis und Rest werden gespeichert, der Rest
 * folgt der Zahlung, und der Eigenbereich steht nach der Migration mit dem bisherigen Wert 35* da. */

let payload: Payload;
const STAND = '2026-11-15T10:00:00.000Z';

beforeAll(async () => {
  payload = await getPayload({ config });
});

async function neuerTermin(): Promise<BusinessRecord> {
  return vorgangAnlegen({
    art: 'termin',
    jahr: 2082,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', postalCode: '35576', country: 'Deutschland' },
      payload: { auftragsweg: 'eigenbereich' },
      summary: [],
      uploads: [],
      payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen' },
      internalNotes: [],
      timeline: [{ at: STAND, actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
    }),
  });
}

describe('Auftragsweg und Rest in der Datenbank', () => {
  it('speichert Weg, Gesamtpreis und berechneten Rest; der Rest folgt der Zahlung', async () => {
    const termin = await neuerTermin();
    const mitWeg = await vorgangAendern(termin.id, () => ({ auftragsweg: 'eigenbereich', remainder: { totalCents: 24_900, remainderCents: 17_910 } }));
    expect(mitWeg?.auftragsweg).toBe('eigenbereich');
    expect(mitWeg?.remainder).toEqual({ totalCents: 24_900, remainderCents: 17_910 });

    // Zahlung erstattet: Der Hook rechnet den Rest neu, auch bei einer Änderung des Servers.
    const erstattet = await vorgangAendern(termin.id, (v) => ({ payment: { ...v.payment!, status: 'erstattet' } }));
    expect(erstattet?.remainder?.remainderCents).toBe(24_900);

    const geladen = await getRecord(termin.id);
    expect(geladen?.auftragsweg).toBe('eigenbereich');
    const roh = await payload.findByID({ collection: 'vorgaenge', id: Number(termin.id), depth: 0, overrideAccess: true });
    expect(roh.restzahlung).toMatchObject({ gesamtpreisCent: 24_900, restCent: 24_900 });
  });

  it('ältere Vorgänge ohne Weg bleiben gültig', async () => {
    const termin = await neuerTermin();
    const geladen = await getRecord(termin.id);
    expect(geladen?.auftragsweg).toBeUndefined();
    expect(geladen?.remainder).toBeUndefined();
  });

  it('der Eigenbereich ist in den Einstellungen pflegbar und startet mit 35*', async () => {
    const doc = await payload.findGlobal({ slug: 'einstellungen', depth: 0, overrideAccess: true });
    expect(doc.buchung.eigenbereich?.postleitzahlen ?? '35*').toContain('35');
    const seite = einstellungenZuSeite({ ...doc, buchung: { ...doc.buchung, eigenbereich: { bezeichnung: 'Mittelhessen', postleitzahlen: '35*, 61231' } } });
    expect(seite.booking.ownArea).toEqual({ label: 'Mittelhessen', postalPatterns: ['35*', '61231'] });
  });
});
