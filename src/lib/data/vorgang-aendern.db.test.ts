import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import sharp from 'sharp';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { createAccessToken } from '@/lib/server/access-token';
import { erkenneDateityp } from '@/lib/server/datei-pruefung';
import { speichereKundendatei } from '@/lib/server/kundendateien';
import type { BusinessRecord, MailLogEntry } from '@/lib/types';
import type { Vorgaenge } from '@/payload-types';
import {
  findeVorgangFuerZahlung,
  getRecord,
  updateRecord,
  vorgangAendern,
  vorgangAnlegen,
  vorgangDateienSetzen,
  zahlungsereignisVerbuchen,
  type NeuerVorgang,
} from './index';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Gezielte
 * Änderungen und Zahlungsereignisse verlieren nichts — weder Dateien und
 * Mailprotokoll noch parallele Änderungen —, und jedes Ereignis zählt einmal. */

let payload: Payload;
let laufend = 0;
const STAND = '2026-10-24T10:00:00.000Z';

const mail: MailLogEntry = { kind: 'eingang-kunde', to: 'erika@example.org', at: STAND, result: 'gesendet', providerId: 're_1' };

beforeAll(async () => {
  payload = await getPayload({ config });
});

function eindeutig(praefix: string): string {
  laufend += 1;
  return `${praefix}-${process.pid}-${Date.now()}-${laufend}`;
}

async function neuerTermin(): Promise<BusinessRecord> {
  return vorgangAnlegen({
    art: 'termin',
    jahr: 2081,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen' },
      internalNotes: [],
      timeline: [{ at: STAND, actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
      accessTokenHash: 'a'.repeat(64),
    }),
  });
}

async function mitSitzung(): Promise<{ vorgang: BusinessRecord; sitzung: string }> {
  const angelegt = await neuerTermin();
  const sitzung = eindeutig('cs_test');
  const vorgang = await vorgangAendern(angelegt.id, (v) => ({
    payment: { ...v.payment!, checkoutSessionId: sitzung, providerRef: `pi_${sitzung}` },
  }));
  return { vorgang: vorgang!, sitzung };
}

async function roh(id: string): Promise<Vorgaenge> {
  return payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true });
}

async function ereigniszeile(ereignisId: string) {
  const db = (payload.db as unknown as {
    drizzle: { execute: (q: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }> };
  }).drizzle;
  const { rows } = await db.execute(
    sql`SELECT ergebnis, vorgang_id FROM webhook_ereignisse WHERE ereignis_id = ${ereignisId}`,
  );
  return rows;
}

async function kundendatei(): Promise<number> {
  const png = new Uint8Array(
    await sharp({ create: { width: 8, height: 8, channels: 3, background: { r: 40, g: 40, b: 40 } } }).png().toBuffer(),
  );
  const datei = await speichereKundendatei({
    payload,
    daten: png,
    typ: erkenneDateityp(png)!,
    dateiname: 'image.png',
    kategorie: 'schluesselfoto',
    aufbewahrenBis: new Date(Date.now() + 86_400_000),
    uploadSchluesselHash: createAccessToken().hash,
  });
  return Number(datei.id);
}

describe('vorgangAendern', () => {
  it('ändert nur die genannten Gruppen — Dateien und Mailprotokoll bleiben', async () => {
    const angelegt = await neuerTermin();
    const dateiId = await kundendatei();
    await vorgangDateienSetzen(angelegt.id, [dateiId], angelegt.uploads);
    await vorgangAendern(angelegt.id, () => ({ mailLog: [mail] }));

    const geaendert = await vorgangAendern(angelegt.id, (v) => ({
      status: 'in-pruefung',
      timeline: [...v.timeline, { at: STAND, actor: 'team', message: 'Wird geprüft.' }],
    }));
    expect(geaendert?.status).toBe('in-pruefung');
    expect(geaendert?.mailLog).toEqual([mail]);

    let doc = await roh(angelegt.id);
    expect(doc.dateien).toEqual([dateiId]);
    expect(doc.mails).toHaveLength(1);
    expect(doc.verlauf?.map((e) => e.text)).toEqual(['Vorgang über die Website angelegt.', 'Wird geprüft.']);
    expect(doc.zahlung?.betragCent).toBe(6990);

    // Auch das ganze Zurückschreiben der bisherigen Aufrufer lässt beides stehen.
    await updateRecord(angelegt.id, { status: 'geprueft' });
    doc = await roh(angelegt.id);
    expect(doc.status).toBe('geprueft');
    expect(doc.dateien).toEqual([dateiId]);
    expect(doc.mails).toHaveLength(1);
  });

  it('liefert null für unbekannte Vorgänge und lässt bei „nichts zu tun“ alles, wie es ist', async () => {
    expect(await vorgangAendern('999999999', () => ({ status: 'storniert' }))).toBeNull();
    expect(await vorgangAendern('kein-vorgang', () => ({ status: 'storniert' }))).toBeNull();
    const angelegt = await neuerTermin();
    const vorher = await roh(angelegt.id);
    const ergebnis = await vorgangAendern(angelegt.id, () => null);
    expect(ergebnis?.id).toBe(angelegt.id);
    expect((await roh(angelegt.id)).updatedAt).toBe(vorher.updatedAt);
  });

  it('verliert bei gleichzeitigen Änderungen keinen Eintrag', async () => {
    const angelegt = await neuerTermin();
    await Promise.all(
      ['eins', 'zwei', 'drei', 'vier'].map((text) =>
        vorgangAendern(angelegt.id, (v) => ({ timeline: [...v.timeline, { at: STAND, actor: 'system', message: text }] })),
      ),
    );
    const texte = (await roh(angelegt.id)).verlauf?.map((e) => e.text) ?? [];
    expect(texte).toHaveLength(5);
    expect(texte).toEqual(expect.arrayContaining(['eins', 'zwei', 'drei', 'vier']));
  });

  describe('veraltetes Backend-Formular', () => {
    async function teamZugang() {
      const team = await payload.create({
        collection: 'benutzer',
        data: { email: `${eindeutig('team')}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'] },
        overrideAccess: true,
      });
      return { ...team, collection: 'benutzer' as const };
    }

    /** Speichert den beim Öffnen gelesenen Formularstand — wie der Speichern-Knopf im Backend. */
    async function speichern(id: string, formular: Vorgaenge, user: Awaited<ReturnType<typeof teamZugang>>, aenderung: Partial<Vorgaenge>) {
      const daten: Record<string, unknown> = { ...formular, ...aenderung };
      for (const feld of ['id', 'createdAt', 'updatedAt']) delete daten[feld];
      return payload.update({ collection: 'vorgaenge', id: Number(id), data: daten as never, depth: 0, overrideAccess: false, user });
    }

    it('überschreibt keine Systemfelder, keinen verschobenen Termin und keine neuen Notizen', async () => {
      const user = await teamZugang();
      const { vorgang } = await mitSitzung();
      await vorgangAendern(vorgang.id, () => ({ appointment: { date: '2081-05-04', time: '09:00', durationMinutes: 60, location: 'werkstatt' } }));

      // Das Team öffnet den Vorgang …
      const formular = await payload.findByID({ collection: 'vorgaenge', id: Number(vorgang.id), depth: 0, overrideAccess: false, user });

      // … währenddessen wird der Termin verschoben, eine Mail protokolliert und eine Notiz ergänzt.
      await vorgangAendern(vorgang.id, (v) => ({
        appointment: { ...v.appointment!, date: '2081-05-05', time: '11:00' },
        payment: { ...v.payment!, checkoutSessionId: 'cs_neu', refundedCents: 0 },
        mailLog: [mail],
        timeline: [...v.timeline, { at: STAND, actor: 'system', message: 'Termin verlegt.' }],
        internalNotes: [...v.internalNotes, { at: STAND, actor: 'system', message: 'Streitfall eröffnet.' }],
      }));

      // … und speichert den alten Formularstand mit neuem Status.
      await speichern(vorgang.id, formular, user, { status: 'terminiert' });

      const doc = await roh(vorgang.id);
      expect(doc.status).toBe('terminiert');
      expect(doc.termin).toMatchObject({ datum: '2081-05-05', uhrzeit: '11:00' });
      expect(doc.zahlung).toMatchObject({ status: 'offen', checkoutSitzung: 'cs_neu', erstattetCent: 0 });
      expect(doc.mails).toHaveLength(1);
      expect(doc.verlauf?.at(-1)?.text).toBe('Termin verlegt.');
      expect(doc.notizen?.map((n) => n.text)).toEqual(['Streitfall eröffnet.']);
      expect(doc.zugriffsHash).toBe('a'.repeat(64));
    });

    it('lehnt das Zurückdrehen einer inzwischen eingegangenen Zahlung mit 409 ab', async () => {
      const user = await teamZugang();
      const { vorgang } = await mitSitzung();
      const formular = await payload.findByID({ collection: 'vorgaenge', id: Number(vorgang.id), depth: 0, overrideAccess: false, user });

      await vorgangAendern(vorgang.id, (v) => ({
        payment: { ...v.payment!, status: 'bezahlt', paidAt: STAND },
        timeline: [...v.timeline, { at: STAND, actor: 'system', message: 'Zahlung eingegangen.' }],
      }));

      await expect(speichern(vorgang.id, formular, user, { status: 'terminiert' })).rejects.toMatchObject({ status: 409 });
      const doc = await roh(vorgang.id);
      expect(doc.status).toBe('neu');
      expect(doc.zahlung).toMatchObject({ status: 'bezahlt', bezahltAm: STAND });
      expect(doc.notizen ?? []).toEqual([]);
    });
  });
});

describe('zahlungsereignisVerbuchen', () => {
  const bezahlt = (text: string) => (v: BusinessRecord) => ({
    aenderung: {
      payment: { ...v.payment!, status: 'bezahlt' as const, paidAt: STAND },
      timeline: [...v.timeline, { at: STAND, actor: 'system' as const, message: text }],
    },
    ergebnis: 'bezahlt',
  });

  it('verbucht dieselbe Ereigniskennung genau einmal — auch gleichzeitig', async () => {
    const { vorgang, sitzung } = await mitSitzung();
    const ereignisId = eindeutig('evt');
    const ereignis = { ereignisId, typ: 'checkout.session.completed', finde: { checkoutSitzung: sitzung }, anwenden: bezahlt('Zahlung eingegangen.') };

    const [a, b] = await Promise.all([zahlungsereignisVerbuchen(ereignis), zahlungsereignisVerbuchen(ereignis)]);
    expect([a.ergebnis, b.ergebnis].sort()).toEqual(['bezahlt', 'doppelt']);
    expect((await zahlungsereignisVerbuchen(ereignis)).ergebnis).toBe('doppelt');

    const doc = await roh(vorgang.id);
    expect(doc.zahlung?.status).toBe('bezahlt');
    expect(doc.verlauf?.filter((e) => e.text === 'Zahlung eingegangen.')).toHaveLength(1);
    expect(await ereigniszeile(ereignisId)).toEqual([{ ergebnis: 'bezahlt', vorgang_id: Number(vorgang.id) }]);
  });

  it('verliert bei zwei verschiedenen Ereignissen auf denselben Vorgang keine Änderung', async () => {
    const { vorgang, sitzung } = await mitSitzung();
    const [a, b] = await Promise.all([
      zahlungsereignisVerbuchen({
        ereignisId: eindeutig('evt'),
        typ: 'checkout.session.completed',
        finde: { vorgangId: vorgang.id },
        anwenden: bezahlt('Zahlung eingegangen.'),
      }),
      zahlungsereignisVerbuchen({
        ereignisId: eindeutig('evt'),
        typ: 'charge.refunded',
        finde: { anbieterRef: `pi_${sitzung}` },
        anwenden: (v) => ({
          aenderung: {
            payment: { ...v.payment!, refundedCents: 1000 },
            internalNotes: [...v.internalNotes, { at: STAND, actor: 'system', message: 'Teilerstattung prüfen.' }],
          },
          ergebnis: 'erstattet',
        }),
      }),
    ]);
    expect([a.ergebnis, b.ergebnis].sort()).toEqual(['bezahlt', 'erstattet']);

    const doc = await roh(vorgang.id);
    expect(doc.zahlung).toMatchObject({ status: 'bezahlt', erstattetCent: 1000, bezahltAm: STAND });
    expect(doc.verlauf?.map((e) => e.text)).toContain('Zahlung eingegangen.');
    expect(doc.notizen?.map((e) => e.text)).toEqual(['Teilerstattung prüfen.']);
  });

  it('vermerkt Ereignisse ohne Vorgang und solche ohne Wirkung', async () => {
    const ohne = eindeutig('evt');
    expect(
      await zahlungsereignisVerbuchen({ ereignisId: ohne, typ: 'checkout.session.completed', finde: { checkoutSitzung: 'cs_unbekannt' }, anwenden: bezahlt('x') }),
    ).toEqual({ ergebnis: 'kein-vorgang' });
    expect(await ereigniszeile(ohne)).toEqual([{ ergebnis: 'kein-vorgang', vorgang_id: null }]);

    const { vorgang } = await mitSitzung();
    const ignoriert = eindeutig('evt');
    const ergebnis = await zahlungsereignisVerbuchen({ ereignisId: ignoriert, typ: 'charge.dispute.created', finde: { vorgangId: vorgang.id }, anwenden: () => null });
    expect(ergebnis.ergebnis).toBe('ignoriert');
    expect(await ereigniszeile(ignoriert)).toEqual([{ ergebnis: 'ignoriert', vorgang_id: Number(vorgang.id) }]);
  });

  it('rollt bei einem Fehler alles zurück — die erneute Zustellung wird verbucht', async () => {
    const { vorgang, sitzung } = await mitSitzung();
    const ereignisId = eindeutig('evt');
    const basis = { ereignisId, typ: 'checkout.session.completed', finde: { checkoutSitzung: sitzung } };
    await expect(
      zahlungsereignisVerbuchen({
        ...basis,
        anwenden: () => {
          throw new Error('Stripe nicht erreichbar');
        },
      }),
    ).rejects.toThrow('Stripe nicht erreichbar');
    expect(await ereigniszeile(ereignisId)).toEqual([]);
    expect((await getRecord(vorgang.id))?.payment?.status).toBe('offen');

    expect((await zahlungsereignisVerbuchen({ ...basis, anwenden: bezahlt('Zahlung eingegangen.') })).ergebnis).toBe('bezahlt');
  });

  it('findet Vorgänge über Checkout-Sitzung und Zahlungskennung', async () => {
    const { vorgang, sitzung } = await mitSitzung();
    expect((await findeVorgangFuerZahlung({ checkoutSitzung: sitzung }))?.id).toBe(vorgang.id);
    expect((await findeVorgangFuerZahlung({ anbieterRef: `pi_${sitzung}` }))?.id).toBe(vorgang.id);
    expect(await findeVorgangFuerZahlung({ checkoutSitzung: 'cs_unbekannt' })).toBeNull();
    expect(await findeVorgangFuerZahlung({})).toBeNull();
  });
});
