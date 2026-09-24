import { getPayload, type Payload } from 'payload';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';

import { createAccessToken } from './access-token';
import { createRecord } from './create-record';
import { erkenneDateityp } from './datei-pruefung';
import { speichereKundendatei } from './kundendateien';

/* Von der Kundendatei bis zum Vorgang: Zuordnung über den Einmal-Schlüssel,
 * der selbst nirgends gespeichert wird. */

let payload: Payload;
let png: Uint8Array;
const angelegt: number[] = [];

beforeAll(async () => {
  payload = await getPayload({ config });
  png = new Uint8Array(
    await sharp({ create: { width: 10, height: 10, channels: 3, background: { r: 120, g: 120, b: 120 } } })
      .png()
      .toBuffer(),
  );
});

async function hochladen() {
  const { token, hash } = createAccessToken();
  const datei = await speichereKundendatei({
    payload,
    daten: png,
    typ: erkenneDateityp(png)!,
    dateiname: 'schluessel.png',
    kategorie: 'schluesselfoto',
    aufbewahrenBis: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    uploadSchluesselHash: hash,
  });
  angelegt.push(Number(datei.id));
  return { id: String(datei.id), token };
}

// Die Dateien liegen wie im Betrieb in private-uploads/ — danach wegräumen.
afterAll(async () => {
  for (const id of angelegt) {
    await payload.delete({ collection: 'kundendateien', id, overrideAccess: true }).catch(() => undefined);
  }
});

const kontakt = {
  firstName: 'Erika',
  lastName: 'Muster',
  email: 'erika@example.org',
  phone: '0301234567',
  country: 'Deutschland',
};

function anfrage(uploads: Array<{ storageKey?: string; uploadToken?: string }>) {
  return createRecord({
    kind: 'anfrage',
    area: 'schluessel-nach-vorlage',
    process: 'gefuehrte-anfrage',
    contact: kontakt,
    payload: {},
    summary: [],
    uploads: uploads.map((u) => ({
      fileName: 'schluessel.png',
      sizeBytes: 100,
      mimeType: 'image/png',
      category: 'schluesselfoto' as const,
      ...u,
    })),
  });
}

describe('Hochgeladene Dateien am Vorgang', () => {
  it('ordnet die Datei mit gültigem Schlüssel zu und speichert den Schlüssel nie', async () => {
    const datei = await hochladen();
    const result = await anfrage([{ storageKey: datei.id, uploadToken: datei.token }]);
    expect(result.ok).toBe(true);

    const kundendatei = await payload.findByID({ collection: 'kundendateien', id: Number(datei.id), depth: 0, overrideAccess: true });
    expect(String(kundendatei.vorgang)).toBe(result.recordId);

    const vorgang = await payload.findByID({ collection: 'vorgaenge', id: Number(result.recordId), depth: 0, overrideAccess: true });
    expect(vorgang.dateien).toEqual([Number(datei.id)]);
    expect(JSON.stringify(vorgang)).not.toContain(datei.token);
    expect(result.notices.join(' ')).not.toContain('nicht übernommen');
  });

  it('übernimmt keine fremde Datei mit falschem Schlüssel', async () => {
    const datei = await hochladen();
    const falsch = createAccessToken().token;
    const result = await anfrage([{ storageKey: datei.id, uploadToken: falsch }]);
    expect(result.ok).toBe(true);
    expect(result.notices.join(' ')).toContain('nicht übernommen');

    const kundendatei = await payload.findByID({ collection: 'kundendateien', id: Number(datei.id), depth: 0, overrideAccess: true });
    expect(kundendatei.vorgang ?? null).toBeNull();
  });

  it('eine bereits zugeordnete Datei wandert nicht in einen zweiten Vorgang', async () => {
    const datei = await hochladen();
    const erster = await anfrage([{ storageKey: datei.id, uploadToken: datei.token }]);
    const zweiter = await anfrage([{ storageKey: datei.id, uploadToken: datei.token }]);
    const kundendatei = await payload.findByID({ collection: 'kundendateien', id: Number(datei.id), depth: 0, overrideAccess: true });
    expect(String(kundendatei.vorgang)).toBe(erster.recordId);
    expect(zweiter.notices.join(' ')).toContain('nicht übernommen');
  });
});
