import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';
import { getRecord, vorgangAendern, vorgangAnlegen, type NeuerVorgang } from '@/lib/data';
import { createAccessToken, verifyAccessToken } from '@/lib/server/access-token';
import type { BusinessRecord } from '@/lib/types';

import { kundenbestaetigungAnwenden } from './kundenbestaetigung';
import { MELDUNG } from './vermittlung';

/* Gegen die Testdatenbank (FA-KERN-04): Migration `vermittlung_auszahlung`, Stände bis „ausgezahlt“, Pausieren
 * wirkt, Kundenbestätigung mit Einmal-Link, Erstattung sperrt die Auszahlung, Liste offener Auszahlungen am
 * Partnerbetrieb. Erfundene Testdaten (G4), kein Zahlungsdienst, keine Mail (G3, G5). */

let payload: Payload;
let team: Record<string, unknown> & { collection: 'benutzer' };
let partnerId: number;
const STAND = '2026-11-15T10:00:00.000Z';

beforeAll(async () => {
  vi.stubEnv('PARTNERMODELL_B', 'aktiv');
  payload = await getPayload({ config });
  team = {
    ...(await payload.create({
      collection: 'benutzer',
      data: { email: `vermittlung-${Date.now()}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'] },
      overrideAccess: true,
    })),
    collection: 'benutzer' as const,
  };
  const neu = await payload.create({
    collection: 'partnerbetriebe',
    data: {
      firma: 'Testbetrieb Vermittlung',
      ort: 'Frankfurt',
      status: 'eingegangen',
      abrechnungsmodell: 'B',
      // Eine der neun Leistungen (FA-PLATTFORM-01) deckt den Sammelwert der Autoschlüssel-Aufträge ab.
      auftragsarten: ['schluessel-nachmachen'],
      einsatzgebiet: { postleitzahlen: '603*' },
      provisionen: [{ auftragsart: 'autoschluessel-vor-ort', prozent: 10 }],
      kontoKennung: 'acct_TEST1234',
    },
    overrideAccess: true,
  });
  for (const status of ['in-pruefung', 'vertrag-versendet', 'vertrag-unterschrieben'] as const) {
    await payload.update({ collection: 'partnerbetriebe', id: neu.id, data: { status }, overrideAccess: true });
  }
  await payload.update({
    collection: 'partnerbetriebe',
    id: neu.id,
    data: { pruefung: { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true }, vertrag: { unterschriebenAm: '2026-11-03T00:00:00.000Z' }, status: 'freigeschaltet' },
    overrideAccess: true,
  });
  partnerId = neu.id;
});

afterAll(() => {
  vi.unstubAllEnvs();
});

async function partnerauftrag(): Promise<BusinessRecord> {
  return vorgangAnlegen({
    art: 'termin',
    jahr: 2083,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', postalCode: '60311', country: 'Deutschland' },
      payload: { auftragsweg: 'partner' },
      summary: [],
      uploads: [],
      auftragsweg: 'partner',
      payment: { scope: 'gesamt', amountCents: 30_000, status: 'bezahlt', paidAt: STAND },
      internalNotes: [],
      timeline: [],
    }),
  });
}

const alsTeam = (id: string, data: Record<string, unknown>) =>
  payload.update({ collection: 'vorgaenge', id: Number(id), data, overrideAccess: false, user: team });

const roh = (id: string) => payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true });

describe('Vermittlung und Auszahlung in der Datenbank', () => {
  it('führt vom Zahlungseingang bis „ausgezahlt“ und schreibt jeden Schritt in die Notizen', async () => {
    const auftrag = await partnerauftrag();
    await alsTeam(auftrag.id, { vermittlung: { status: 'neu', partnerbetrieb: partnerId } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: partnerId } });
    const vermittelt = await alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: partnerId } });
    expect(vermittelt.vermittlung).toMatchObject({ gesamtCent: 30_000, plattformanteilCent: 3_000, partnerbetragCent: 27_000, auftragsart: 'autoschluessel-vor-ort' });
    expect(vermittelt.auszahlung?.stand).toBe('offen');

    for (const status of ['angenommen', 'termin-bestaetigt', 'erledigt'] as const) {
      await alsTeam(auftrag.id, { vermittlung: { status, partnerbetrieb: partnerId } });
    }
    const ausgefuehrt = await roh(auftrag.id);
    expect(ausgefuehrt.vermittlung?.festgeschriebenAm).toBeTruthy();

    // Der Kunde bestätigt über seinen Einmal-Link.
    const { token, hash } = createAccessToken();
    await vorgangAendern(auftrag.id, (v) => ({ referral: { ...v.referral, confirmTokenHash: hash } }));
    // Eine Änderung des Teams dazwischen lässt den gespeicherten Schlüssel stehen.
    await alsTeam(auftrag.id, { vermittlung: { status: 'erledigt', partnerbetrieb: partnerId, notiz: 'Partner hat Fotos geschickt' } });
    expect((await getRecord(auftrag.id))?.referral?.confirmTokenHash).toBe(hash);
    const jetzt = new Date().toISOString();
    await vorgangAendern(auftrag.id, (v) => kundenbestaetigungAnwenden(v, verifyAccessToken(token, v.referral?.confirmTokenHash), jetzt));
    const bestaetigt = await getRecord(auftrag.id);
    expect(bestaetigt?.referral).toMatchObject({ status: 'kunde-bestaetigt', customerConfirmedAt: jetzt });
    expect(bestaetigt?.referral?.confirmTokenHash).toBeUndefined();
    // Derselbe Link ein zweites Mal: nichts passiert.
    expect(kundenbestaetigungAnwenden(bestaetigt!, verifyAccessToken(token, bestaetigt?.referral?.confirmTokenHash), jetzt)).toBeNull();

    // Am Partnerbetrieb steht der Vorgang in der Liste offener Auszahlungen.
    const betrieb = await payload.findByID({ collection: 'partnerbetriebe', id: partnerId, depth: 0, overrideAccess: true });
    expect((betrieb.offeneAuszahlungen?.docs ?? []).map((d) => (typeof d === 'object' ? d.id : d))).toContain(Number(auftrag.id));

    await alsTeam(auftrag.id, { vermittlung: { status: 'auszahlung-freigegeben', partnerbetrieb: partnerId } });
    const ausgezahlt = await alsTeam(auftrag.id, {
      vermittlung: { status: 'ausgezahlt', partnerbetrieb: partnerId },
      auszahlung: { weg: 'ueberweisung', referenz: 'Testbeleg 1' },
    });
    expect(ausgezahlt.auszahlung).toMatchObject({ stand: 'ausgezahlt', weg: 'ueberweisung', referenz: 'Testbeleg 1' });
    const notizen = (await roh(auftrag.id)).notizen?.map((n) => n.text) ?? [];
    // Acht Wechsel durch das Team und einer durch den Kunden.
    expect(notizen.filter((t) => t.startsWith('Vermittlung von'))).toHaveLength(9);
    expect(notizen.some((t) => t.includes('Kunde bestätigt'))).toBe(true);
  });

  it('vermittelt nicht an einen Partner, der nach der Auswahl pausiert wurde', async () => {
    const zweiter = await payload.create({
      collection: 'partnerbetriebe',
      data: { firma: 'Testbetrieb Pause', ort: 'Kassel', status: 'eingegangen', abrechnungsmodell: 'B', auftragsarten: ['schluessel-nachmachen'] },
      overrideAccess: true,
    });
    // Direkt in der Datenbank: Die Wege zu „freigeschaltet“ und „pausiert“ sind im Partnertest belegt.
    await payload.db.updateOne({ collection: 'partnerbetriebe', id: zweiter.id, data: { status: 'freigeschaltet' } });
    const auftrag = await partnerauftrag();
    await alsTeam(auftrag.id, { vermittlung: { status: 'neu', partnerbetrieb: zweiter.id } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: zweiter.id } });
    await payload.db.updateOne({ collection: 'partnerbetriebe', id: zweiter.id, data: { status: 'pausiert' } });
    // Die Auswahl im Backend lässt pausierte Betriebe schon nicht zu; der Hook prüft zusätzlich.
    await expect(alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: zweiter.id } })).rejects.toThrow(MELDUNG.partnerGesperrt);
    const stand = await roh(auftrag.id);
    expect(stand.vermittlung?.status).toBe('geprueft');
  });

  it('schlägt den Plattformanteil aus der Provision einer der neun Leistungen vor, wenn der Vorgang den Sammelwert trägt', async () => {
    const dritter = await payload.create({
      collection: 'partnerbetriebe',
      data: {
        firma: 'Testbetrieb Nachmachen',
        ort: 'Offenbach',
        status: 'eingegangen',
        abrechnungsmodell: 'B',
        auftragsarten: ['schluessel-nachmachen'],
        provisionen: [{ auftragsart: 'schluessel-nachmachen', prozent: 12 }],
      },
      overrideAccess: true,
    });
    await payload.db.updateOne({ collection: 'partnerbetriebe', id: dritter.id, data: { status: 'freigeschaltet' } });
    const auftrag = await partnerauftrag();
    await alsTeam(auftrag.id, { vermittlung: { status: 'neu', partnerbetrieb: dritter.id } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: dritter.id } });
    const vermittelt = await alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: dritter.id } });
    expect(vermittelt.vermittlung).toMatchObject({ auftragsart: 'autoschluessel-vor-ort', gesamtCent: 30_000, plattformanteilCent: 3_600 });
    expect(vermittelt.vermittlung?.anteilHinweis ?? null).toBeNull();
  });

  it('lässt eine frühere Auftragsart am Vorgang nicht neu setzen', async () => {
    const auftrag = await partnerauftrag();
    await expect(
      alsTeam(auftrag.id, { vermittlung: { status: 'neu', partnerbetrieb: partnerId, auftragsart: 'schluesseldienst-vor-ort' } }),
    ).rejects.toThrow(/nur Autoschlüssel und Fahrzeugschlüssel/);
    expect((await roh(auftrag.id)).vermittlung?.auftragsart ?? null).toBeNull();
  });

  it('sperrt die Auszahlung nach einer Erstattung und speichert „teilweise erstattet“', async () => {
    const auftrag = await partnerauftrag();
    for (const status of ['neu', 'geprueft', 'partner-angefragt'] as const) {
      await alsTeam(auftrag.id, { vermittlung: { status, partnerbetrieb: partnerId } });
    }
    const erstattet = await alsTeam(auftrag.id, { erstattung: { weg: 'zahlungsdienst', art: 'teilweise', betragCent: 5_000, grund: 'Kulanz' } });
    expect(erstattet.zahlung).toMatchObject({ status: 'teilweise-erstattet', erstattetCent: 5_000 });
    expect(erstattet.auszahlung?.stand).toBe('gesperrt');
    const gelesen = await getRecord(auftrag.id);
    expect(gelesen?.refund).toMatchObject({ kind: 'teilweise', amountCents: 5_000, reason: 'Kulanz' });
    expect(gelesen?.payout?.status).toBe('gesperrt');
  });
});
