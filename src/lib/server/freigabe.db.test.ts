import { getPayload, type Payload } from 'payload';
import type Stripe from 'stripe';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { getRecord, vorgangAendern } from '@/lib/data';
import { vertragsbestaetigungOffen } from '@/lib/mail/vertrag';
import type { BusinessRecord } from '@/lib/types';
import { VERLAUF } from '@/lib/zahlung/uebergaenge';
import { sitzungVerbuchen } from '@/lib/zahlung/verbuchen';
import type { Vorgaenge } from '@/payload-types';

import { createRecord } from './create-record';

/* Gegen die Testdatenbank: Foto-Freigabe im Backend → Zahlung angelegt →
 * nach der Zahlung „In Fertigung“, und die Partner-Bewerbung samt Verweis
 * aus einer Vermittlung. Ohne Mail- und Zahlungsanbindung (Testumgebung). */

let payload: Payload;
let user: Record<string, unknown> & { collection: 'benutzer' };

beforeAll(async () => {
  payload = await getPayload({ config });
  const team = await payload.create({
    collection: 'benutzer',
    data: { email: `team-s1-${Date.now()}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'] },
    overrideAccess: true,
  });
  user = { ...team, collection: 'benutzer' as const };
});

const kontakt = { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' };

/** Speichern wie im Backend: ganzes Formular mit den Rechten des Teams. */
async function imBackendSpeichern(id: string, aenderung: Record<string, unknown>) {
  const formular = (await payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: false, user })) as Vorgaenge;
  const daten: Record<string, unknown> = { ...formular, ...aenderung };
  for (const feld of ['id', 'createdAt', 'updatedAt']) delete daten[feld];
  await payload.update({ collection: 'vorgaenge', id: Number(id), data: daten as never, depth: 0, overrideAccess: false, user });
}

function session(vorgang: BusinessRecord, id: string): Stripe.Checkout.Session {
  return {
    id,
    object: 'checkout.session',
    mode: 'payment',
    status: 'complete',
    payment_status: 'paid',
    payment_intent: `pi_${id}`,
    amount_total: 2490,
    currency: 'eur',
    client_reference_id: vorgang.id,
    metadata: { vorgangId: vorgang.id, nummer: vorgang.reference, art: 'anfrage', umgebung: 'lokal' },
  } as unknown as Stripe.Checkout.Session;
}

describe('Foto-Freigabe', () => {
  it('legt mit „Freigegeben“ die Zahlung an und setzt nach der Zahlung „In Fertigung“', async () => {
    const angelegt = await createRecord({
      kind: 'anfrage',
      area: 'schluessel-nach-vorlage',
      process: 'gefuehrte-anfrage',
      contact: kontakt,
      payload: { stueckzahl: 2 },
      summary: [],
      uploads: [],
    });
    expect(angelegt.ok).toBe(true);
    const id = angelegt.recordId!;

    await imBackendSpeichern(id, { status: 'in-pruefung' });
    await imBackendSpeichern(id, {
      status: 'freigegeben',
      freigabe: { preisCent: 2490, einsendenNoetig: true, hinweis: 'Rohling BKS.' },
    });

    const freigegeben = (await getRecord(id))!;
    expect(freigegeben.status).toBe('freigegeben');
    expect(freigegeben.payment).toMatchObject({ scope: 'gesamt', amountCents: 2490, status: 'offen' });
    expect(freigegeben.payment?.checkoutSessionId).toBeUndefined();
    expect(freigegeben.approval).toMatchObject({ priceCents: 2490, sendInRequired: true, approvedAt: expect.any(String) });
    const notizen = freigegeben.internalNotes.map((n) => n.message);
    expect(notizen).toContain('Status von „Neu“ auf „In Prüfung“ geändert (' + String(user.email) + ').');
    expect(notizen).toContain('Status von „In Prüfung“ auf „Freigegeben“ geändert (' + String(user.email) + ').');
    expect(notizen.some((n) => n.startsWith('Zahlung über') && n.includes('zur Freigabe angelegt'))).toBe(true);
    expect(freigegeben.timeline.map((e) => e.message)).toEqual(
      expect.arrayContaining(['Wir prüfen Ihre Fotos.', expect.stringContaining('Freigegeben: Die Anfertigung ist möglich.')]),
    );
    expect(vertragsbestaetigungOffen(freigegeben)).toBe(false);

    // Der Kunde startet die Zahlung („Jetzt bezahlen“) und zahlt.
    const sitzung = `cs_test_freigabe_${process.pid}_${Date.now()}`;
    const mitSitzung = (await vorgangAendern(id, (v) => ({ payment: { ...v.payment!, checkoutSessionId: sitzung } })))!;
    const verbucht = await sitzungVerbuchen(`evt_${sitzung}`, 'checkout.session.completed', session(mitSitzung, sitzung));
    expect(verbucht.ergebnis).toBe('bezahlt');
    expect(verbucht.mail).toEqual({ art: 'bezahlt' });

    const bezahlt = (await getRecord(id))!;
    expect(bezahlt.status).toBe('in-fertigung');
    expect(bezahlt.payment).toMatchObject({ status: 'bezahlt', providerRef: `pi_${sitzung}` });
    expect(bezahlt.timeline.map((e) => e.message)).toEqual(
      expect.arrayContaining([VERLAUF.bezahlt, expect.stringContaining('Auftrag erteilt')]),
    );
    expect(bezahlt.internalNotes.at(-1)?.message).toContain('„In Fertigung“');
    // Kauf einer Anfertigung nach Vorlage: Vertragsbestätigung fällig.
    expect(vertragsbestaetigungOffen(bezahlt)).toBe(true);
  });
});

describe('Partner werden', () => {
  it('legt die Bewerbung als Vorgang „partner“ an und lässt sich aus einer Vermittlung verweisen', async () => {
    const bewerbung = await createRecord({
      kind: 'partner',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact: { ...kontakt, firstName: 'Max', lastName: 'Meister', company: 'Schlüsseldienst Nord GmbH', postalCode: '20095', city: 'Hamburg' },
      payload: { firma: 'Schlüsseldienst Nord GmbH', einsatzradiusKm: 50, leistungen: ['autoschluessel'], mobileEinsaetze: true, datenschutz: true },
      summary: [{ title: 'Betrieb', rows: [{ label: 'Firma', value: 'Schlüsseldienst Nord GmbH' }] }],
      uploads: [],
    });
    expect(bewerbung.ok).toBe(true);
    expect(bewerbung.reference).toMatch(/^SM24-N-\d{4}-\d{4}$/);
    const partner = (await getRecord(bewerbung.recordId!))!;
    expect(partner).toMatchObject({ kind: 'partner', area: 'service-und-termin', status: 'neu' });
    expect(partner.contact.company).toBe('Schlüsseldienst Nord GmbH');

    const auftrag = await createRecord({
      kind: 'anfrage',
      area: 'autoschluessel',
      process: 'gefuehrte-anfrage',
      contact: kontakt,
      payload: {},
      summary: [],
      uploads: [],
    });
    await imBackendSpeichern(auftrag.recordId!, {
      vermittlung: { status: 'partner-angefragt', partner: Number(partner.id), provisionCent: null, notiz: 'Hamburg' },
    });

    const { docs } = await payload.find({
      collection: 'vorgaenge',
      where: { and: [{ 'vermittlung.partner': { equals: Number(partner.id) } }, { 'vermittlung.status': { equals: 'partner-angefragt' } }] },
      depth: 0,
      overrideAccess: false,
      user,
    });
    expect(docs.map((d) => String(d.id))).toEqual([auftrag.recordId]);
    expect((await getRecord(auftrag.recordId!))?.referral).toMatchObject({ status: 'partner-angefragt', partnerId: partner.id });

    const partnerListe = await payload.find({ collection: 'vorgaenge', where: { art: { equals: 'partner' } }, depth: 0 });
    expect(partnerListe.docs.every((d) => d.nummer.startsWith('SM24-N-'))).toBe(true);
  });
});
