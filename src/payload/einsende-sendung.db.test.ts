import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { getRecord, vorgangAendern } from '@/lib/data';
import { sendungsnummerAnwenden } from '@/lib/einsenden/sendung';
import { createRecord } from '@/lib/server/create-record';
import type { Vorgaenge } from '@/payload-types';

/* FA-SHOP-03B gegen die Testdatenbank (Migration „einsende_sendung“): Sendung des Kunden zur
 * Werkstatt am Vorgang, getrennt von der Rücksendung; die Labeldatei des Teams bleibt bei einer
 * Änderung durch den Kunden erhalten. Erfundene Testdaten (G4), keine Datei auf der Platte. */

let payload: Payload;
let user: Record<string, unknown> & { collection: 'benutzer' };

beforeAll(async () => {
  payload = await getPayload({ config });
  const team = await payload.create({
    collection: 'benutzer',
    data: { email: `team-einsendung-${Date.now()}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'] },
    overrideAccess: true,
  });
  user = { ...team, collection: 'benutzer' as const };
});

const kontakt = { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', street: 'Prüfweg 1', postalCode: '35576', city: 'Wetzlar', country: 'Deutschland' };

async function neueEinsendung(): Promise<string> {
  const angelegt = await createRecord({
    kind: 'anfrage',
    area: 'schluessel-nach-vorlage',
    process: 'gefuehrte-anfrage',
    contact: kontakt,
    payload: { quelle: 'einsenden', originale: 1, stueckzahl: 1, beschriftung: null, hinweis: null, sicherungskarte: 'nein', schluesselart: 'haus', wertvoll: false, versand: 'dhl-paket', originalEingesendet: true },
    summary: [],
    uploads: [],
  });
  expect(angelegt.ok).toBe(true);
  return angelegt.recordId!;
}

/** Speichern wie im Backend: ganzes Formular mit den Rechten des Teams. */
async function imBackendSpeichern(id: string, aenderung: (formular: Vorgaenge) => Record<string, unknown>) {
  const formular = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: false, user })) as Vorgaenge;
  const daten: Record<string, unknown> = { ...formular, ...aenderung(formular) };
  for (const feld of ['id', 'createdAt', 'updatedAt']) delete daten[feld];
  await payload.update({ collection: 'vorgaenge', id: Number(id), data: daten as never, depth: 0, overrideAccess: false, user });
}

describe('Sendung des Kunden zur Werkstatt', () => {
  it('der Kunde trägt die Nummer ein; Admin und Vorgangsseite lesen sie, die Labeldatei des Teams bleibt', async () => {
    const id = await neueEinsendung();
    const datei = await payload.db.create({ collection: 'interne-dateien', data: { filename: `label-${Date.now()}.pdf`, mimeType: 'application/pdf', beschreibung: 'Testlabel' } });
    await imBackendSpeichern(id, (f) => ({ einsendeSendung: { ...f.einsendeSendung, labelDatei: datei.id } }));

    await vorgangAendern(id, (v) => {
      const ergebnis = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: '0034 0434 1234 5678 90', jetzt: '2026-11-16T09:00:00.000Z' });
      return ergebnis.ok ? ergebnis.aenderung : null;
    });

    const doc = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(doc.einsendeSendung).toMatchObject({ sendungsnummer: '003404341234567890', dienstleister: 'dhl', variante: 'dhl-paket', eingetragenVon: 'kunde', labelDatei: datei.id });
    expect(doc.versand?.sendungsnummer ?? null).toBeNull();
    const record = await getRecord(id);
    expect(record?.einsendeSendung).toMatchObject({ trackingNumber: '003404341234567890', carrier: 'dhl', variant: 'dhl-paket', enteredBy: 'kunde' });
    expect(record?.timeline.at(-1)?.message).toBe('Sendungsnummer Ihrer Sendung an uns eingetragen: 003404341234567890.');
  });

  it('das Team trägt im Admin nach; die Nummer wird bereinigt, Ungültiges abgelehnt', async () => {
    const id = await neueEinsendung();
    await imBackendSpeichern(id, (f) => ({ einsendeSendung: { ...f.einsendeSendung, sendungsnummer: 'rr 123-456 789 de', dienstleister: 'deutsche-post' } }));
    expect((await getRecord(id))?.einsendeSendung).toMatchObject({ trackingNumber: 'RR123456789DE', carrier: 'deutsche-post' });
    await expect(imBackendSpeichern(id, (f) => ({ einsendeSendung: { ...f.einsendeSendung, sendungsnummer: 'abc' } }))).rejects.toThrow();
    // Rücksendung bleibt getrennt.
    await imBackendSpeichern(id, () => ({ versand: { dienstleister: 'dhl', sendungsnummer: '00340434999888' } }));
    const record = await getRecord(id);
    expect(record?.shipment).toEqual({ carrier: 'dhl', trackingNumber: '00340434999888' });
    expect(record?.einsendeSendung?.trackingNumber).toBe('RR123456789DE');
  });

  it('berichtigt das Team die Nummer des Kunden, stehen „Team“, der neue Zeitpunkt und ein Verlaufseintrag am Vorgang', async () => {
    const id = await neueEinsendung();
    await vorgangAendern(id, (v) => {
      const ergebnis = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: '003404341234567890', jetzt: '2026-11-16T09:00:00.000Z' });
      return ergebnis.ok ? ergebnis.aenderung : null;
    });
    const vorher = Date.now();
    await imBackendSpeichern(id, (f) => ({ einsendeSendung: { ...f.einsendeSendung, sendungsnummer: '0034 0434 9999 8888 77', dienstleister: null } }));
    const doc = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(doc.einsendeSendung).toMatchObject({ sendungsnummer: '003404349999888877', eingetragenVon: 'team', dienstleister: 'dhl' });
    expect(Date.parse(doc.einsendeSendung?.eingetragenAm ?? '')).toBeGreaterThanOrEqual(vorher - 1000);
    expect(doc.verlauf?.at(-1)).toMatchObject({ von: 'team', text: 'Sendungsnummer Ihrer Sendung an uns geändert: 003404349999888877.' });
    // Speichern ohne Änderung der Nummer lässt Herkunft und Zeitpunkt stehen.
    const eingetragenAm = doc.einsendeSendung?.eingetragenAm;
    await imBackendSpeichern(id, () => ({ versand: { dienstleister: 'dhl', sendungsnummer: '00340434555666' } }));
    const danach = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(danach.einsendeSendung).toMatchObject({ eingetragenVon: 'team', eingetragenAm });
  });
  it('ein Backend-Formular, das vor dem Eintrag des Kunden geöffnet wurde, löscht seine Nummer beim Speichern nicht', async () => {
    const id = await neueEinsendung();
    // Das Team öffnet den Vorgang: Dieser Stand kennt noch keine Sendungsnummer.
    const offenesFormular = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: false, user })) as Vorgaenge;
    // Danach trägt der Kunde seine Nummer ein.
    await vorgangAendern(id, (v) => {
      const ergebnis = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: '003404341234567890', jetzt: '2026-11-16T09:00:00.000Z' });
      return ergebnis.ok ? ergebnis.aenderung : null;
    });
    // Das Team speichert sein altes Formular, etwa mit einer internen Notiz zum Status.
    const daten: Record<string, unknown> = { ...offenesFormular, status: 'neu' };
    for (const feld of ['id', 'createdAt', 'updatedAt']) delete daten[feld];
    await payload.update({ collection: 'vorgaenge', id: Number(id), data: daten as never, depth: 0, overrideAccess: false, user });
    const doc = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(doc.einsendeSendung).toMatchObject({ sendungsnummer: '003404341234567890', eingetragenVon: 'kunde', dienstleister: 'dhl' });

    // Mit einem frischen Formular ist das Löschen eine bewusste Handlung: Nummer weg, Eintrag im Verlauf.
    await imBackendSpeichern(id, (f) => ({ einsendeSendung: { ...f.einsendeSendung, sendungsnummer: '' } }));
    const danach = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(danach.einsendeSendung?.sendungsnummer || null).toBeNull();
    expect(danach.einsendeSendung).toMatchObject({ eingetragenAm: null, eingetragenVon: null });
    expect(danach.verlauf?.at(-1)).toMatchObject({ von: 'team', text: 'Sendungsnummer Ihrer Sendung an uns entfernt.' });
  });

  it('setzt das Team einen anderen Dienstleister und der Kunde berichtigt danach seine Nummer, bleibt der Dienstleister', async () => {
    const id = await neueEinsendung();
    await vorgangAendern(id, (v) => {
      const ergebnis = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: '01234567890123', jetzt: '2026-11-16T09:00:00.000Z' });
      return ergebnis.ok ? ergebnis.aenderung : null;
    });
    await imBackendSpeichern(id, (f) => ({ einsendeSendung: { ...f.einsendeSendung, dienstleister: 'dpd' } }));
    await vorgangAendern(id, (v) => {
      const ergebnis = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: '01234567890124', jetzt: '2026-11-16T10:00:00.000Z' });
      return ergebnis.ok ? ergebnis.aenderung : null;
    });
    const doc = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(doc.einsendeSendung).toMatchObject({ sendungsnummer: '01234567890124', dienstleister: 'dpd', eingetragenVon: 'kunde' });
    const seite = await getRecord(id);
    expect(seite?.einsendeSendung).toMatchObject({ trackingNumber: '01234567890124', carrier: 'dpd' });
  });
  it('an einem Vorgang ohne Einsendung speichert auch ein Aufruf mit Team-Rechten keine Sendungsnummer und keinen Verlauf dazu', async () => {
    const angelegt = await createRecord({
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact: kontakt,
      payload: { quelle: 'kontakt' },
      summary: [],
      uploads: [],
    });
    expect(angelegt.ok).toBe(true);
    const id = Number(angelegt.recordId);
    const vorher = (await payload.findByID({ collection: 'vorgaenge', id, depth: 0, overrideAccess: true })) as Vorgaenge;
    await payload.update({
      collection: 'vorgaenge',
      id,
      data: { einsendeSendung: { sendungsnummer: 'Zeile 1;<b>fremd</b>' + 'x'.repeat(200) } } as never,
      depth: 0,
      overrideAccess: false,
      user,
    });
    const doc = (await payload.findByID({ collection: 'vorgaenge', id, depth: 0, overrideAccess: true })) as Vorgaenge;
    expect(doc.einsendeSendung?.sendungsnummer || null).toBeNull();
    expect(doc.verlauf?.length ?? 0).toBe(vorher.verlauf?.length ?? 0);
  });
});
