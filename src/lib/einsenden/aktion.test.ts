import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VorgangsAenderung } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { createAccessToken } from '@/lib/server/access-token';
import type { BusinessRecord } from '@/lib/types';

import { SENDUNGSNUMMER_MELDUNG } from './sendung';
import { EINSENDE_QUELLE, einsendeVorgang } from './vorgang';

/* Sendungsnummer über den signierten Zugang (FA-SHOP-03B); Datenschicht ersetzt, erfundene Testdaten (G4). */

const eigener = createAccessToken();
const fremder = createAccessToken();
const vorgaenge = new Map<string, BusinessRecord>();
let erlaubt = true;

vi.mock('@/lib/server/rate-limit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/rate-limit')>()),
  allowRequest: vi.fn(async () => erlaubt),
}));
vi.mock('@/lib/data', () => ({
  getRecord: async (id: string) => vorgaenge.get(id) ?? null,
  getSettings: async () => defaults.settings(),
  vorgangAendern: async (id: string, aendern: (v: BusinessRecord) => VorgangsAenderung | null) => {
    const v = vorgaenge.get(id);
    if (!v) return null;
    const aenderung = aendern(v);
    if (aenderung) vorgaenge.set(id, { ...v, ...aenderung });
    return vorgaenge.get(id)!;
  },
}));

const { sendungsnummerEintragen } = await import('./aktion');

const KONTAKT = { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', street: 'Prüfweg 1', postalCode: '35576', city: 'Wetzlar', country: 'Deutschland' };

function einsendung(id: string, hash: string, teil: Partial<BusinessRecord> = {}): BusinessRecord {
  const geprueft = einsendeVorgang(
    { quelle: EINSENDE_QUELLE, originale: 1, stueckzahl: 1, schluesselart: 'haus', sicherungskarte: 'nein', versand: 'einschreiben-einwurf' },
    KONTAKT,
  );
  if (!geprueft.ok) throw new Error('Testdaten ungültig');
  return {
    id,
    reference: `SM24-A-2026-000${id}`,
    kind: 'anfrage',
    area: 'schluessel-nach-vorlage',
    process: 'gefuehrte-anfrage',
    status: 'neu',
    createdAt: '2026-11-16T08:00:00.000Z',
    updatedAt: '2026-11-16T08:00:00.000Z',
    contact: KONTAKT,
    payload: { ...geprueft.payload },
    summary: geprueft.summary,
    uploads: [],
    internalNotes: [],
    timeline: [],
    accessTokenHash: hash,
    ...teil,
  };
}

beforeEach(() => {
  erlaubt = true;
  vorgaenge.clear();
  vorgaenge.set('1', einsendung('1', eigener.hash));
  vorgaenge.set('2', einsendung('2', fremder.hash));
});

describe('sendungsnummerEintragen', () => {
  it('speichert mit dem eigenen Link-Schlüssel die bereinigte Nummer', async () => {
    const antwort = await sendungsnummerEintragen({ recordId: '1', token: eigener.token, nummer: 'rr 123 456 789 de' });
    expect(antwort).toEqual({ ok: true, meldung: SENDUNGSNUMMER_MELDUNG.gespeichert, nummer: 'RR123456789DE' });
    expect(vorgaenge.get('1')?.einsendeSendung).toMatchObject({ trackingNumber: 'RR123456789DE', carrier: 'deutsche-post', variant: 'einschreiben-einwurf', enteredBy: 'kunde' });
  });

  it('ein fremder Zugang (Schlüssel eines anderen Vorgangs) setzt keine Nummer', async () => {
    const antwort = await sendungsnummerEintragen({ recordId: '1', token: fremder.token, nummer: 'RR123456789DE' });
    expect(antwort).toEqual({ ok: false, meldung: SENDUNGSNUMMER_MELDUNG.zugang });
    expect(vorgaenge.get('1')?.einsendeSendung).toBeUndefined();
    expect(vorgaenge.get('2')?.einsendeSendung).toBeUndefined();
  });

  it('unbekannter Vorgang, falscher oder fehlender Schlüssel sehen gleich aus', async () => {
    expect(await sendungsnummerEintragen({ recordId: '99', token: eigener.token, nummer: 'RR123456789DE' })).toEqual({ ok: false, meldung: SENDUNGSNUMMER_MELDUNG.zugang });
    expect(await sendungsnummerEintragen({ recordId: '1', token: 'x'.repeat(43), nummer: 'RR123456789DE' })).toEqual({ ok: false, meldung: SENDUNGSNUMMER_MELDUNG.zugang });
    expect(await sendungsnummerEintragen({ recordId: '1', token: undefined as never, nummer: 'RR123456789DE' })).toEqual({ ok: false, meldung: SENDUNGSNUMMER_MELDUNG.zugang });
  });

  it('ein abgelaufener Zugang (Schlüssel schon eingegangen, Vorgang storniert) setzt keine Nummer', async () => {
    for (const status of ['in-pruefung', 'storniert'] as const) {
      vorgaenge.set('1', einsendung('1', eigener.hash, { status }));
      const antwort = await sendungsnummerEintragen({ recordId: '1', token: eigener.token, nummer: 'RR123456789DE' });
      expect(antwort).toEqual({ ok: false, meldung: SENDUNGSNUMMER_MELDUNG['nicht-erwartet'] });
      expect(vorgaenge.get('1')?.einsendeSendung).toBeUndefined();
    }
  });

  it('prüft die Nummer und begrenzt die Versuche', async () => {
    expect(await sendungsnummerEintragen({ recordId: '1', token: eigener.token, nummer: '12' })).toEqual({ ok: false, meldung: SENDUNGSNUMMER_MELDUNG.nummer });
    erlaubt = false;
    const gebremst = await sendungsnummerEintragen({ recordId: '1', token: eigener.token, nummer: 'RR123456789DE' });
    expect(gebremst.ok).toBe(false);
    expect(gebremst.meldung).toMatch(/Zu viele Anfragen/);
    expect(vorgaenge.get('1')?.einsendeSendung).toBeUndefined();
  });

  it('speichert bei der Freigabe mit Einsendung die gewählte Variante mit', async () => {
    vorgaenge.set('3', einsendung('3', eigener.hash, { payload: { quelle: 'fotos' }, status: 'freigegeben', approval: { sendInRequired: true, priceCents: 2490 } }));
    expect((await sendungsnummerEintragen({ recordId: '3', token: eigener.token, nummer: '003404341234567890', variante: 'einschreiben-wert' })).ok).toBe(false);
    const antwort = await sendungsnummerEintragen({ recordId: '3', token: eigener.token, nummer: '003404341234567890', variante: 'dhl-paket' });
    expect(antwort.ok).toBe(true);
    expect(vorgaenge.get('3')?.einsendeSendung).toMatchObject({ trackingNumber: '003404341234567890', variant: 'dhl-paket', carrier: 'dhl' });
  });
});
