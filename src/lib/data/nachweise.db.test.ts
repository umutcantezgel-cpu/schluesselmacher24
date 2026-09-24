import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { getNachweise } from './nachweise';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Seed ist
 * eingespielt, darunter ein Nachweis mit Status „bereithalten“. */

let payload: Payload;
const context = { disableRevalidate: true };

/** Mittag des Kalendertags in deutscher Zeit, um `tage` verschoben. */
function datumInTagen(tage: number): string {
  const [jahr, monat, tag] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .split('-')
    .map(Number);
  return new Date(Date.UTC(jahr, monat - 1, tag + tage, 10)).toISOString();
}

async function anlegen(data: Record<string, unknown>) {
  return payload.create({
    collection: 'nachweise',
    data: { art: 'zertifikat', status: 'liegt-vor', oeffentlich: true, ...data } as never,
    context,
  });
}

async function titelOeffentlich(): Promise<string[]> {
  return (await getNachweise()).map((n) => n.titel);
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

describe('Öffentliche Nachweise', () => {
  it('zeigt den mitgelieferten Nachweis nicht — er wird erst bereitgehalten', async () => {
    const seed = await payload.find({ collection: 'nachweise', where: { status: { equals: 'bereithalten' } } });
    expect(seed.totalDocs).toBeGreaterThan(0);
    const titel = await titelOeffentlich();
    for (const doc of seed.docs) expect(titel).not.toContain(doc.titel);
  });

  it('zeigt einen vorliegenden, freigegebenen Nachweis mit Art, Aussteller und Gültigkeit', async () => {
    await anlegen({
      titel: 'Test Öffentlich',
      art: 'versicherung',
      aussteller: '  Versicherer Nord  ',
      gueltigBis: datumInTagen(400),
    });
    const nachweis = (await getNachweise()).find((n) => n.titel === 'Test Öffentlich');
    expect(nachweis).toMatchObject({
      art: 'versicherung',
      artLabel: 'Versicherung',
      aussteller: 'Versicherer Nord',
    });
    expect(nachweis?.gueltigBis).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Interne Angaben gehen nicht an die Seite.
    expect(Object.keys(nachweis ?? {}).sort()).toEqual(['art', 'artLabel', 'aussteller', 'gueltigBis', 'id', 'titel']);
  });

  it('zeigt vorliegende Nachweise ohne Haken „Auf der Seite zeigen“ nicht', async () => {
    await anlegen({ titel: 'Test Intern', oeffentlich: false });
    expect(await titelOeffentlich()).not.toContain('Test Intern');
  });

  it('zeigt Nachweise im Status „bereithalten“ nicht — auch wenn der Haken gesetzt ist', async () => {
    // Das Backend verhindert diese Kombination beim Speichern; hier wird sie
    // direkt in der Datenbank erzeugt, um die Abfrage selbst zu prüfen.
    const doc = await anlegen({ titel: 'Test Bereithalten' });
    expect(await titelOeffentlich()).toContain('Test Bereithalten');
    await payload.db.updateOne({ collection: 'nachweise', id: doc.id, data: { status: 'bereithalten' } });
    expect(await titelOeffentlich()).not.toContain('Test Bereithalten');
  });

  it('zeigt abgelaufene Nachweise nicht', async () => {
    const doc = await anlegen({ titel: 'Test Status Abgelaufen' });
    await payload.db.updateOne({ collection: 'nachweise', id: doc.id, data: { status: 'abgelaufen' } });
    await anlegen({ titel: 'Test Datum Abgelaufen', gueltigBis: datumInTagen(-2) });
    await anlegen({ titel: 'Test Heute Gültig', gueltigBis: datumInTagen(0) });

    const titel = await titelOeffentlich();
    expect(titel).not.toContain('Test Status Abgelaufen');
    expect(titel).not.toContain('Test Datum Abgelaufen');
    expect(titel).toContain('Test Heute Gültig');
  });

  it('nimmt Nachweise im Papierkorb heraus und zeigt sie nach dem Wiederherstellen wieder', async () => {
    const doc = await anlegen({ titel: 'Test Papierkorb' });
    // „In den Papierkorb“ = deletedAt setzen; `delete({ trash: true })` löscht endgültig.
    await payload.update({
      collection: 'nachweise',
      id: doc.id,
      data: { deletedAt: new Date().toISOString() },
      context,
    });
    expect(await titelOeffentlich()).not.toContain('Test Papierkorb');

    await payload.update({ collection: 'nachweise', id: doc.id, data: { deletedAt: null }, trash: true, context });
    expect(await titelOeffentlich()).toContain('Test Papierkorb');
  });
});
