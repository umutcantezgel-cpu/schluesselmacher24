import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';

import { klassenFilter } from '../fahrzeuge/anfrage-klassen';

import { createRecord } from './create-record';

/* Gemeinsame Fahrzeugschlüssel-Anfrage im Admin (FA-KERN-02B, FA-27 „Admin“): Die Klasse steht als
 * auswertbares Feld im Vorgang (daten.klasse). Das Team findet die Anfragen einer Klasse über den Filter
 * ?where[daten.klasse][equals]=…; das Backend zeigt sie im virtuellen Feld „Fahrzeugklasse“. Erfundene
 * Testdaten, keine Dateien (G4, G5). */

let payload: Payload;

beforeAll(async () => {
  payload = await getPayload({ config });
});

const kontakt = { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' };

function anfrage(klasse: string, mehr: Record<string, unknown> = {}) {
  return createRecord({
    kind: 'anfrage',
    area: 'autoschluessel',
    process: 'gefuehrte-anfrage',
    contact: kontakt,
    payload: { quelle: 'fahrzeug-anfrage', klasse, beschreibung: 'Zweitschlüssel gewünscht, Testangabe.', ...mehr },
    summary: [{ title: 'Fahrzeug', rows: [{ label: 'Fahrzeugklasse', value: klasse }] }],
    uploads: [],
  });
}

describe('Fahrzeugklasse im Vorgang', () => {
  it('findet die Anfragen einer Klasse über daten.klasse und zeigt die Klasse im Backend', async () => {
    const roller = await anfrage('roller', { roller: 'versicherungskennzeichen' });
    const scooter = await anfrage('e-scooter');
    expect(roller.ok && scooter.ok).toBe(true);

    const treffer = await payload.find({
      collection: 'vorgaenge',
      // Derselbe Filter wie die fertigen Verweise über der Vorgangsliste (VorgaengeWerkzeuge).
      where: klassenFilter('roller').where,
      depth: 0,
      limit: 100,
      overrideAccess: true,
    });
    const nummern = treffer.docs.map((d) => String(d.id));
    expect(nummern).toContain(roller.recordId);
    expect(nummern).not.toContain(scooter.recordId);
    expect(klassenFilter('roller').suche).toBe('?where[daten.klasse][equals]=roller');

    const vorgang = await payload.findByID({ collection: 'vorgaenge', id: Number(roller.recordId), depth: 0, overrideAccess: true });
    expect(vorgang.bereich).toBe('autoschluessel');
    expect(vorgang.fahrzeugklasse).toBe('Roller, Mofa oder Moped, mit Versicherungskennzeichen');
  });

  it('zeigt bei anderen Vorgängen keine Fahrzeugklasse', async () => {
    const motorradAlt = await createRecord({
      kind: 'anfrage',
      area: 'autoschluessel',
      process: 'gefuehrte-anfrage',
      contact: kontakt,
      payload: { quelle: 'motorrad', beschreibung: 'Ältere Motorradanfrage, Testangabe.' },
      summary: [],
      uploads: [],
    });
    const vorgang = await payload.findByID({ collection: 'vorgaenge', id: Number(motorradAlt.recordId), depth: 0, overrideAccess: true });
    expect(vorgang.fahrzeugklasse ?? null).toBeNull();
  });
});
