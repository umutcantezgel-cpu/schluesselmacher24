import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { getRecord, vorgangAnlegen, type NeuerVorgang } from '@/lib/data';
import type { BusinessRecord } from '@/lib/types';

import { echteEinstellungen } from './test-hilfen';
import { widerrufAufnehmen, type WiderrufUmgebung } from './widerruf-aufnahme';
import {
  widerrufAmVorgangVermerken,
  widerrufBestaetigungVermerken,
  widerrufSpeichern,
  widerrufVorgangFinden,
} from './widerruf-speicher';

/* Gegen die Testdatenbank: Der Widerrufsbutton speichert jede Erklärung in
 * `widerrufe` (trotz schreibgeschützter Felder), ordnet nur bei passender
 * E-Mail zu und vermerkt die Eingangsbestätigung. */

let payload: Payload;
const STAND = '2026-10-24T10:00:00.000Z';

beforeAll(async () => {
  payload = await getPayload({ config });
});

async function neueBestellung(email: string): Promise<BusinessRecord> {
  return vorgangAnlegen({
    art: 'bestellung',
    jahr: 2082,
    aufbauen: (): NeuerVorgang => ({
      area: 'schluessel-nach-code',
      process: 'direktkauf',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email, phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      internalNotes: [],
      timeline: [{ at: STAND, actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
    }),
  });
}

function umgebung(): WiderrufUmgebung {
  return {
    mitDatenbank: true,
    firma: echteEinstellungen().company,
    jetzt: () => new Date(),
    vorgangFinden: widerrufVorgangFinden,
    speichern: widerrufSpeichern,
    bestaetigungVermerken: widerrufBestaetigungVermerken,
    vorgangVermerken: widerrufAmVorgangVermerken,
    bestaetigungSenden: async () => ({ ergebnis: 'gesendet', anbieterId: 're_test' }),
  };
}

async function letzterWiderruf(email: string) {
  const { docs } = await payload.find({
    collection: 'widerrufe',
    where: { email: { equals: email } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return docs[0];
}

describe('Widerruf in der Datenbank', () => {
  it('speichert, ordnet zu und vermerkt Bestätigung und Notiz am Vorgang', async () => {
    const email = `erika-${process.pid}-${Date.now()}@example.org`;
    const vorgang = await neueBestellung(email);

    const ergebnis = await widerrufAufnehmen(
      { name: 'Erika Muster', email: email.toUpperCase(), vorgangsnummer: vorgang.reference.toLowerCase(), erklaerung: 'Bitte stornieren.' },
      umgebung(),
    );
    expect(ergebnis.status).toBe('eingegangen');

    const doc = await letzterWiderruf(email.toUpperCase());
    expect(doc).toMatchObject({
      name: 'Erika Muster',
      vorgangsnummer: vorgang.reference,
      vorgang: Number(vorgang.id),
      zuordnung: 'zugeordnet',
      bearbeitet: false,
      bestaetigung: { ergebnis: 'gesendet', anbieterId: 're_test' },
    });
    expect(doc.erklaerung).toContain('Bitte stornieren.');
    expect(doc.eingegangenAm).toBeTruthy();

    // Nie automatisch storniert — nur eine interne Notiz.
    const danach = await getRecord(vorgang.id);
    expect(danach?.status).toBe('neu');
    expect(danach?.internalNotes.some((n) => n.message.includes('Widerrufserklärung'))).toBe(true);
    expect(danach?.timeline).toHaveLength(1);
  });

  it('ordnet bei fremder E-Mail nicht zu, speichert aber zur Prüfung', async () => {
    const vorgang = await neueBestellung(`kundin-${process.pid}-${Date.now()}@example.org`);
    const fremd = `fremd-${process.pid}-${Date.now()}@example.org`;

    const ergebnis = await widerrufAufnehmen(
      { name: 'Max Fremd', email: fremd, vorgangsnummer: vorgang.reference },
      umgebung(),
    );
    expect(ergebnis.status).toBe('eingegangen');

    const doc = await letzterWiderruf(fremd);
    expect(doc).toMatchObject({ zuordnung: 'zu-pruefen', vorgangsnummer: vorgang.reference });
    expect(doc.vorgang ?? null).toBeNull();
    const danach = await getRecord(vorgang.id);
    expect(danach?.internalNotes).toHaveLength(0);
  });
});
