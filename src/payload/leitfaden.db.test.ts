import { createLocalReq, getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { getRecord, vorgangAendern, vorgangAnlegen, type NeuerVorgang } from '@/lib/data';
import { up as datenMigrieren } from '@/migrations/20261025_132935_leitfaden_daten';
import type { Vorgaenge } from '@/payload-types';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Datenmigration
 * „leitfaden_daten“ und die neuen Felder der Vorgänge. */

let payload: Payload;
const context = { disableRevalidate: true };

beforeAll(async () => {
  payload = await getPayload({ config });
});

async function migrieren() {
  const req = await createLocalReq({}, payload);
  await datenMigrieren({ db: payload.db.drizzle as never, payload, req });
}

function stadt(slug: string, lokalIntro: string) {
  return {
    slug,
    stadt: slug,
    bundesland: 'Hessen',
    lokalIntro,
    lokaleFakten: [{ label: 'Einsatzradius', wert: '20 km' }],
    leistungen: ['autoschluessel' as const],
    radiusKm: 20,
    seo: { titel: `Schlüsseldienst ${slug}`, beschreibung: 'Werkstatt und Vor-Ort-Termine.' },
    _status: 'published' as const,
  };
}

describe('Datenmigration leitfaden_daten', () => {
  it('legt Einsatzgebiete mit Platzhaltern in den Papierkorb und lässt echte stehen', async () => {
    const platzhalter = await payload.create({
      collection: 'einsatzgebiete',
      data: stadt('test-platzhalter', '[Platzhalter — örtlicher Text eintragen] Dieser Abschnitt …'),
      context,
    });
    const echt = await payload.create({
      collection: 'einsatzgebiete',
      data: stadt('test-echt', 'Unsere Werkstatt liegt in der Altstadt; Vor-Ort-Termine im Umkreis von 20 km.'),
      context,
    });

    await migrieren();
    await migrieren(); // wiederholbar

    const sichtbar = await payload.find({ collection: 'einsatzgebiete', pagination: false, depth: 0 });
    expect(sichtbar.docs.map((d) => d.slug)).toContain('test-echt');
    expect(sichtbar.docs.map((d) => d.slug)).not.toContain('test-platzhalter');
    const papierkorb = await payload.findByID({ collection: 'einsatzgebiete', id: platzhalter.id, trash: true, depth: 0 });
    expect(papierkorb.deletedAt).toBeTruthy();
    await payload.delete({ collection: 'einsatzgebiete', where: { id: { in: [platzhalter.id, echt.id] } }, trash: true, context });
  });

  it('korrigiert die Adressen „koda“ und „m-gane“, nur wo noch der alte Wert steht', async () => {
    // Stand vor der Migration nachstellen.
    const [skoda] = (await payload.find({ collection: 'fahrzeugmarken', where: { slug: { equals: 'skoda' } }, depth: 0 })).docs;
    await payload.update({ collection: 'fahrzeugmarken', id: skoda.id, data: { slug: 'koda' }, context });
    const [renault] = (await payload.find({ collection: 'fahrzeugmarken', where: { slug: { equals: 'renault' } }, depth: 0 })).docs;
    const modelle = (renault.modelle ?? []).map((m) => (m.slug === 'megane' ? { ...m, slug: 'm-gane' } : m));
    await payload.update({ collection: 'fahrzeugmarken', id: renault.id, data: { modelle }, context });

    await migrieren();

    const nachher = await payload.findByID({ collection: 'fahrzeugmarken', id: skoda.id, depth: 0 });
    expect(nachher.slug).toBe('skoda');
    expect(nachher.kennung).toBe(skoda.kennung);
    const renaultNachher = await payload.findByID({ collection: 'fahrzeugmarken', id: renault.id, depth: 0 });
    expect(renaultNachher.modelle?.map((m) => m.slug)).toContain('megane');
    expect(renaultNachher.modelle?.map((m) => m.slug)).not.toContain('m-gane');
    expect(renaultNachher.modelle?.length).toBe(renault.modelle?.length);
  });

  it('macht das Foto bei ZY-02 zur Pflicht — außer der Betrieb hat es anders eingestellt', async () => {
    const [zy02] = (await payload.find({ collection: 'produkte', where: { kennung: { equals: 'zy-02' } }, depth: 0 })).docs;
    const alterHinweis = 'Ein Foto ist freiwillig. Es hilft uns, Profil und Beschriftung vor der Fertigung abzugleichen.';
    await payload.update({ collection: 'produkte', id: zy02.id, data: { fotoUpload: 'optional', fotoHinweis: alterHinweis }, context });

    await migrieren();
    const nachher = await payload.findByID({ collection: 'produkte', id: zy02.id, depth: 0 });
    expect(nachher.fotoUpload).toBe('pflicht');
    expect(nachher.fotoHinweis).toContain('Sicherungskarte');

    await payload.update({ collection: 'produkte', id: zy02.id, data: { fotoUpload: 'nein', fotoHinweis: alterHinweis }, context });
    await migrieren();
    const betrieb = await payload.findByID({ collection: 'produkte', id: zy02.id, depth: 0 });
    expect(betrieb.fotoUpload).toBe('nein');
    expect(betrieb.fotoHinweis).toBe(alterHinweis);
    await payload.update({ collection: 'produkte', id: zy02.id, data: { fotoUpload: 'pflicht', fotoHinweis: nachher.fotoHinweis }, context });
  });
});

describe('Vorgänge: Partner, Freigabe und Vermittlung', () => {
  const vorgang = (overrides: Partial<NeuerVorgang> = {}) => (): NeuerVorgang => {
    const jetzt = new Date().toISOString();
    return {
      area: 'schluessel-nach-vorlage',
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
      ...overrides,
    };
  };

  it('vergibt Partner-Bewerbungen den Nummernkreis „N“', async () => {
    const partner = await vorgangAnlegen({ art: 'partner', jahr: 2094, aufbauen: vorgang({ area: 'autoschluessel' }) });
    expect(partner.reference).toBe('SM24-N-2094-0001');
    expect(partner.kind).toBe('partner');
  });

  it('speichert Freigabe und Vermittlung und liest sie zurück', async () => {
    const partner = await vorgangAnlegen({ art: 'partner', jahr: 2095, aufbauen: vorgang({ area: 'autoschluessel' }) });
    const anfrage = await vorgangAnlegen({ art: 'anfrage', jahr: 2095, aufbauen: vorgang() });

    await vorgangAendern(anfrage.id, () => ({
      status: 'freigegeben',
      approval: { priceCents: 2490, sendInRequired: true, note: 'Bitte Originalschlüssel beilegen.' },
      referral: { status: 'partner-angefragt', partnerId: partner.id, commissionCents: 1500, note: 'Betrieb in Hamburg' },
    }));
    const gelesen = await getRecord(anfrage.id);
    expect(gelesen?.status).toBe('freigegeben');
    expect(gelesen?.approval).toEqual({ priceCents: 2490, sendInRequired: true, note: 'Bitte Originalschlüssel beilegen.' });
    expect(gelesen?.referral).toEqual({ status: 'partner-angefragt', partnerId: partner.id, commissionCents: 1500, note: 'Betrieb in Hamburg' });

    // Ganze Gruppe: Was fehlt, wird geleert — Vermittlung ohne Stand = keine.
    await vorgangAendern(anfrage.id, (v) => ({ referral: { ...v.referral, status: undefined, note: undefined } }));
    expect((await getRecord(anfrage.id))?.referral).toEqual({ partnerId: partner.id, commissionCents: 1500 });

    // Filterbar nach Stand der Vermittlung.
    await vorgangAendern(anfrage.id, (v) => ({ referral: { ...v.referral, status: 'angenommen' } }));
    const { docs } = await payload.find({ collection: 'vorgaenge', where: { 'vermittlung.status': { equals: 'angenommen' } }, depth: 0 });
    expect(docs.map((d) => String(d.id))).toContain(anfrage.id);
  });

  it('hält den Zeitpunkt der Freigabe fest, wenn das Team „Freigegeben“ setzt', async () => {
    const team = await payload.create({
      collection: 'benutzer',
      data: { email: `team-freigabe-${Date.now()}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'] },
      overrideAccess: true,
    });
    const user = { ...team, collection: 'benutzer' as const };
    const anfrage = await vorgangAnlegen({ art: 'anfrage', jahr: 2096, aufbauen: vorgang() });

    const formular = (await payload.findByID({ collection: 'vorgaenge', id: Number(anfrage.id), depth: 0, overrideAccess: false, user })) as Vorgaenge;
    const daten: Record<string, unknown> = { ...formular, status: 'freigegeben', kundeInformieren: false, freigabe: { preisCent: 1990 } };
    for (const feld of ['id', 'createdAt', 'updatedAt']) delete daten[feld];
    await payload.update({ collection: 'vorgaenge', id: Number(anfrage.id), data: daten as never, depth: 0, overrideAccess: false, user });

    const gelesen = await getRecord(anfrage.id);
    expect(gelesen?.approval?.priceCents).toBe(1990);
    expect(gelesen?.approval?.approvedAt).toBeTruthy();
  });
});
