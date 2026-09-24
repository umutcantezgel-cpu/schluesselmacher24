import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  commitTransaction,
  createLocalReq,
  getPayload,
  initTransaction,
  killTransaction,
  type Payload,
} from 'payload';
import sharp from 'sharp';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { vorgangZuPayload } from '@/lib/data/payload-mapping';

import { createAccessToken, hashToken } from './access-token';
import { erkenneDateityp, type UploadKategorie } from './datei-pruefung';
import {
  bereinigeKundendateien,
  speichereKundendatei,
  verknuepfeKundendateien,
  waehleZuLoeschendeKundendateien,
} from './kundendateien';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts). Die Dateien
 * landen wie im Betrieb in private-uploads/ und werden am Ende gelöscht. */

const TAG = 24 * 60 * 60 * 1000;

let payload: Payload;
let png: Uint8Array;
let laufendeNummer = 0;

beforeAll(async () => {
  payload = await getPayload({ config });
  png = new Uint8Array(
    await sharp({ create: { width: 12, height: 8, channels: 3, background: { r: 90, g: 90, b: 90 } } })
      .png()
      .toBuffer(),
  );
});

async function hochladen(kategorie: UploadKategorie = 'schluesselfoto', frist = new Date(Date.now() + 30 * TAG)) {
  const { token, hash } = createAccessToken();
  const datei = await speichereKundendatei({
    payload,
    daten: png,
    typ: erkenneDateityp(png)!,
    dateiname: 'image.png',
    kategorie,
    aufbewahrenBis: frist,
    uploadSchluesselHash: hash,
  });
  return { ...datei, token };
}

async function neuerVorgang(): Promise<number> {
  laufendeNummer += 1;
  const jetzt = new Date().toISOString();
  const doc = await payload.create({
    collection: 'vorgaenge',
    data: vorgangZuPayload({
      id: 'neu',
      reference: `SM24-TEST-${process.pid}-${laufendeNummer}`,
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      status: 'neu',
      createdAt: jetzt,
      updatedAt: jetzt,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      internalNotes: [],
      timeline: [],
    }),
    overrideAccess: true,
  });
  return doc.id;
}

function lies(id: string | number) {
  return payload.findByID({ collection: 'kundendateien', id: Number(id), depth: 0, overrideAccess: true });
}

function vorgangVon(doc: { vorgang?: unknown }): number | null {
  const wert = doc.vorgang as number | { id: number } | null | undefined;
  return typeof wert === 'object' && wert !== null ? wert.id : (wert ?? null);
}

describe('Kundendateien speichern', () => {
  it('legt die Datei privat an — mit Hash statt Schlüssel und mit Frist', async () => {
    const frist = new Date(Date.now() + 90 * TAG);
    const datei = await hochladen('fahrzeugschein', frist);
    const doc = await lies(datei.id);

    expect(doc.uploadSchluesselHash).toBe(hashToken(datei.token));
    expect(JSON.stringify(doc)).not.toContain(datei.token);
    expect(vorgangVon(doc)).toBeNull();
    expect(doc.kategorie).toBe('fahrzeugschein');
    expect(new Date(doc.aufbewahrenBis!).getTime()).toBe(frist.getTime());
    expect(doc.mimeType).toBe('image/png');
    expect(doc.filename).toMatch(/^image-[0-9a-f]{8}\.png$/);
    expect(datei).toMatchObject({ fileName: doc.filename, mimeType: 'image/png', sizeBytes: png.byteLength });
    expect(existsSync(path.resolve(process.cwd(), 'private-uploads', doc.filename!))).toBe(true);
  });

  it('vergibt eindeutige Namen, auch wenn jedes Foto „image.png“ heißt', async () => {
    const [a, b] = await Promise.all([hochladen(), hochladen()]);
    expect(a.fileName).not.toBe(b.fileName);
  });

  it('ist ohne Anmeldung weder lesbar noch anlegbar; den Hash sieht auch das Team nicht', async () => {
    await expect(payload.find({ collection: 'kundendateien', overrideAccess: false })).rejects.toThrow();
    await expect(
      payload.create({
        collection: 'kundendateien',
        data: { kategorie: 'dokument' },
        file: { data: Buffer.from(png), mimetype: 'image/png', name: 'x.png', size: png.byteLength },
        overrideAccess: false,
      }),
    ).rejects.toThrow();

    const team = await payload.create({
      collection: 'benutzer',
      data: { email: `team-${process.pid}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'] },
      overrideAccess: true,
    });
    const datei = await hochladen();
    const alsTeam = await payload.findByID({
      collection: 'kundendateien',
      id: Number(datei.id),
      overrideAccess: false,
      user: { ...team, collection: 'benutzer' },
    });
    expect(alsTeam.id).toBe(Number(datei.id));
    expect(alsTeam.uploadSchluesselHash).toBeUndefined();
  });
});

describe('verknuepfeKundendateien', () => {
  it('ordnet nur mit dem richtigen Schlüssel zu und löscht danach den Hash', async () => {
    const datei = await hochladen();
    const vorgang = await neuerVorgang();

    const falsch = await verknuepfeKundendateien({
      payload,
      vorgangId: vorgang,
      uploads: [{ id: datei.id, uploadToken: createAccessToken().token }],
    });
    expect(falsch).toEqual([]);
    expect(vorgangVon(await lies(datei.id))).toBeNull();

    const richtig = await verknuepfeKundendateien({
      payload,
      vorgangId: String(vorgang),
      uploads: [{ id: datei.id, uploadToken: datei.token }],
    });
    expect(richtig).toEqual([Number(datei.id)]);
    const doc = await lies(datei.id);
    expect(vorgangVon(doc)).toBe(vorgang);
    expect(doc.uploadSchluesselHash ?? null).toBeNull();
  });

  it('ordnet eine bereits zugeordnete Datei nicht erneut zu', async () => {
    const datei = await hochladen();
    const erster = await neuerVorgang();
    const zweiter = await neuerVorgang();

    await verknuepfeKundendateien({ payload, vorgangId: erster, uploads: [{ id: datei.id, uploadToken: datei.token }] });
    const nochmal = await verknuepfeKundendateien({
      payload,
      vorgangId: zweiter,
      uploads: [{ id: datei.id, uploadToken: datei.token }],
    });
    expect(nochmal).toEqual([]);
    expect(vorgangVon(await lies(datei.id))).toBe(erster);
  });

  it('übergeht unbekannte, ungültige und doppelte Angaben', async () => {
    const a = await hochladen();
    const b = await hochladen();
    const vorgang = await neuerVorgang();

    const ergebnis = await verknuepfeKundendateien({
      payload,
      vorgangId: vorgang,
      uploads: [
        { id: a.id, uploadToken: a.token },
        { id: b.id, uploadToken: a.token },
        { id: a.id, uploadToken: a.token },
        { id: '999999999', uploadToken: a.token },
        { id: '1 OR 1=1', uploadToken: a.token },
        { id: b.id, uploadToken: '' },
      ],
    });
    expect(ergebnis).toEqual([Number(a.id)]);
    expect(vorgangVon(await lies(b.id))).toBeNull();

    expect(await verknuepfeKundendateien({ payload, vorgangId: 'kein-vorgang', uploads: [{ id: b.id, uploadToken: b.token }] })).toEqual([]);
  });

  it('lässt bei gleichzeitigen Versuchen genau einen gewinnen', async () => {
    const datei = await hochladen();
    const [v1, v2] = await Promise.all([neuerVorgang(), neuerVorgang()]);
    const ergebnisse = await Promise.all(
      [v1, v2].map((vorgangId) =>
        verknuepfeKundendateien({ payload, vorgangId, uploads: [{ id: datei.id, uploadToken: datei.token }] }),
      ),
    );
    expect(ergebnisse.flat()).toEqual([Number(datei.id)]);
  });

  it('läuft in der Transaktion des Aufrufers mit', async () => {
    const datei = await hochladen();
    const vorgang = await neuerVorgang();

    const abgebrochen = await createLocalReq({}, payload);
    await initTransaction(abgebrochen);
    const imAbbruch = await verknuepfeKundendateien({
      req: abgebrochen,
      vorgangId: vorgang,
      uploads: [{ id: datei.id, uploadToken: datei.token }],
    });
    expect(imAbbruch).toEqual([Number(datei.id)]);
    await killTransaction(abgebrochen);
    expect(vorgangVon(await lies(datei.id))).toBeNull();
    expect((await lies(datei.id)).uploadSchluesselHash).toBe(hashToken(datei.token));

    const bestaetigt = await createLocalReq({}, payload);
    await initTransaction(bestaetigt);
    await verknuepfeKundendateien({ req: bestaetigt, vorgangId: vorgang, uploads: [{ id: datei.id, uploadToken: datei.token }] });
    await commitTransaction(bestaetigt);
    expect(vorgangVon(await lies(datei.id))).toBe(vorgang);
  });
});

describe('Aufbewahrung', () => {
  it('wählt abgelaufene Fristen und nie zugeordnete Uploads nach 24 Stunden', async () => {
    const jetzt = Date.now();
    const offen = await hochladen('dokument', new Date(jetzt + 30 * TAG));
    const zugeordnet = await hochladen('grundriss', new Date(jetzt + 30 * TAG));
    const abgelaufen = await hochladen('grundriss', new Date(jetzt - 60 * 1000));
    const vorgang = await neuerVorgang();
    await verknuepfeKundendateien({
      payload,
      vorgangId: vorgang,
      uploads: [zugeordnet, abgelaufen].map((d) => ({ id: d.id, uploadToken: d.token })),
    });

    const auswahl = async (versatzMs: number) =>
      new Map(
        (await waehleZuLoeschendeKundendateien({ payload, jetzt: new Date(jetzt + versatzMs) })).map((d) => [
          String(d.id),
          d.grund,
        ]),
      );

    const sofort = await auswahl(0);
    expect(sofort.get(abgelaufen.id)).toBe('frist-abgelaufen');
    expect(sofort.has(offen.id)).toBe(false);
    expect(sofort.has(zugeordnet.id)).toBe(false);

    const nachEinemTag = await auswahl(TAG + 60 * 1000);
    expect(nachEinemTag.get(offen.id)).toBe('nie-zugeordnet');
    expect(nachEinemTag.has(zugeordnet.id)).toBe(false);

    const nachDerFrist = await auswahl(31 * TAG);
    expect(nachDerFrist.get(zugeordnet.id)).toBe('frist-abgelaufen');
  });

  it('löscht Eintrag und Datei — im Probelauf nichts', async () => {
    const jetzt = Date.now();
    const abgelaufen = await hochladen('objektfoto', new Date(jetzt - 1000));
    const bleibt = await hochladen('objektfoto', new Date(jetzt + 30 * TAG));
    const vorgang = await neuerVorgang();
    await verknuepfeKundendateien({ payload, vorgangId: vorgang, uploads: [{ id: bleibt.id, uploadToken: bleibt.token }] });
    const pfad = path.resolve(process.cwd(), 'private-uploads', abgelaufen.fileName);

    const probe = await bereinigeKundendateien({ payload, probelauf: true });
    expect(probe.geloescht.map((d) => String(d.id))).toContain(abgelaufen.id);
    expect(existsSync(pfad)).toBe(true);

    const ergebnis = await bereinigeKundendateien({ payload });
    expect(ergebnis.fehlgeschlagen).toEqual([]);
    expect(ergebnis.geloescht.map((d) => String(d.id))).toContain(abgelaufen.id);
    expect(existsSync(pfad)).toBe(false);
    await expect(lies(abgelaufen.id)).rejects.toThrow();
    expect((await lies(bleibt.id)).id).toBe(Number(bleibt.id));

    // Aufräumen: alle Testdateien aus private-uploads/ entfernen
    await bereinigeKundendateien({ payload, jetzt: new Date(jetzt + 3650 * TAG) });
  });
});
