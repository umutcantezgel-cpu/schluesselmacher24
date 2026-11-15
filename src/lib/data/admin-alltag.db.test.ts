import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { getPageContent, getRecord, OHNE_ZEITFENSTER_STUNDEN, updateRecord, vorgangAnlegen, ZuVieleOffeneTermineFehler, type NeuerVorgang } from '@/lib/data';
import { ADRESSE_MELDUNG } from '@/payload/hooks/seiten-adresse';
import { STORNO_MELDUNG } from '@/lib/zahlung/erstattung';

/* FA-KERN-05 gegen die Testdatenbank: Mailverlauf mit Text, Korrekturen und Storno am Vorgang, Duplizieren,
 * neue Inhaltsseiten und die Begrenzung offener Partnertermine ohne Zeitfenster. Erfundene Testdaten (G4). */

let payload: Payload;
const context = { disableRevalidate: true };
const INHABER = { id: 1, collection: 'benutzer', rollen: ['inhaber'], email: 'inhaber@example.org', name: 'Test Inhaber' };
const produkte: number[] = [];

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  for (const id of produkte) {
    await payload.update({ collection: 'produkte', id, data: { deletedAt: new Date().toISOString() }, trash: true, context }).catch(() => undefined);
  }
});

function vorgang(overrides: Partial<NeuerVorgang> = {}): () => NeuerVorgang {
  return () => {
    const jetzt = new Date().toISOString();
    return {
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
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
}

describe('Partnertermin ohne Zeitfenster', () => {
  it('begrenzt offene, unbezahlte Termine je E-Mail-Adresse auch ohne Zeitfenster', async () => {
    const email = `Partner-${process.pid}-${Date.now()}@Example.org`;
    const kunde = { email: email.toLowerCase(), hoechstensOffen: 2, abDatum: '2000-01-01' };
    const aufbauen = (status: 'offen' | 'bezahlt' = 'offen') =>
      vorgang({ contact: { firstName: 'Erika', lastName: 'Muster', email, phone: '0301234567', country: 'Deutschland' }, payment: { scope: 'gesamt', amountCents: 9_900, status } });

    await vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen: aufbauen('bezahlt'), kunde });
    const erster = await vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen: aufbauen(), kunde });
    await vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen: aufbauen(), kunde });
    await expect(vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen: aufbauen(), kunde })).rejects.toBeInstanceOf(ZuVieleOffeneTermineFehler);

    // Ein Termin mit Zeitfenster zählt die offenen Partnertermine derselben Adresse mit.
    await expect(
      vorgangAnlegen({
        art: 'termin',
        jahr: 2096,
        aufbauen: vorgang({ contact: { firstName: 'E', lastName: 'M', email, phone: '1', country: 'Deutschland' } }),
        termin: { datum: '2096-04-04', istFrei: () => true, kunde },
      }),
    ).rejects.toBeInstanceOf(ZuVieleOffeneTermineFehler);

    await updateRecord(erster.id, { status: 'storniert' });
    await expect(vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen: aufbauen(), kunde })).resolves.toBeTruthy();
    expect(OHNE_ZEITFENSTER_STUNDEN).toBe(24);
  });
});

describe('Vorgang im Alltag', () => {
  async function bestellung(): Promise<number> {
    const v = await vorgangAnlegen({
      art: 'bestellung',
      jahr: 2096,
      aufbauen: vorgang({
        area: 'schluessel-nach-code',
        process: 'direktkauf',
        status: 'in-fertigung',
        payment: { scope: 'gesamt', amountCents: 4_000, status: 'bezahlt', providerRef: 'pi_test123' },
        totals: { itemsCents: 3_500, shippingCents: 500, totalCents: 4_000, vatCents: 639, shippingLabel: 'Brief' },
      }),
    });
    return Number(v.id);
  }

  it('speichert Betreff und vollständigen Text jeder Mail im Verlauf', async () => {
    const id = await bestellung();
    const text = 'Guten Tag,\n\nIhr Auftrag ist fertig.\n\nViele Grüße';
    await updateRecord(String(id), {
      mailLog: [{ kind: 'nachricht', to: 'erika@example.org', at: new Date().toISOString(), result: 'gesendet', subject: 'Abholung', body: text }],
    });
    const gelesen = await getRecord(String(id));
    expect(gelesen?.mailLog?.at(-1)).toMatchObject({ kind: 'nachricht', subject: 'Abholung', body: text });
  });

  it('Storno ohne Entscheidung zur Erstattung abgelehnt; Korrekturposition gespeichert', async () => {
    const id = await bestellung();
    await expect(
      payload.update({ collection: 'vorgaenge', id, data: { status: 'storniert' }, overrideAccess: false, user: INHABER as never, context }),
    ).rejects.toThrow(STORNO_MELDUNG.entscheidung);

    const korrigiert = await payload.update({
      collection: 'vorgaenge',
      id,
      data: { korrekturen: [{ betragCent: -500, grund: 'Nachlass' }] },
      overrideAccess: false,
      user: INHABER as never,
      context,
    });
    expect(korrigiert.korrekturen?.[0]).toMatchObject({ betragCent: -500, grund: 'Nachlass', von: 'Test Inhaber' });
    expect(korrigiert.summen?.gesamtCent).toBe(4_000);

    const storniert = await payload.update({
      collection: 'vorgaenge',
      id,
      data: {
        status: 'storniert',
        storno: { entscheidung: 'teilweise' },
        erstattung: { art: 'teilweise', betragCent: 1_500, grund: 'Versand behalten', weg: 'ueberweisung', beleg: 'Buchung 4711' },
      },
      overrideAccess: false,
      user: INHABER as never,
      context,
    });
    expect(storniert.status).toBe('storniert');
    expect(storniert.zahlung).toMatchObject({ status: 'teilweise-erstattet', erstattetCent: 1_500 });
    expect(storniert.erstattung).toMatchObject({ weg: 'ueberweisung', beleg: 'Buchung 4711' });
    expect(storniert.storno).toMatchObject({ entscheidung: 'teilweise', entschiedenVon: 'Test Inhaber' });
  });
});

describe('Produkt duplizieren', () => {
  it('bekommt eine neue Kennung und Adresse, startet als Entwurf und verweist nur auf dieselben Bilder', async () => {
    const original = await payload.create({
      collection: 'produkte',
      data: {
        typ: 'code_key',
        name: 'Duplizieren',
        slug: `test-duplizieren-${process.pid}`,
        beschreibung: 'Testartikel',
        preis: 12.5,
        maxMenge: 10,
        versandklasse: 'code-schluessel',
        codeFormat: '4 Ziffern',
        codeMuster: '^[0-9]{4}$',
        codeBeispiel: '1234',
        system: 'Testsystem',
        _status: 'published',
      },
      context,
    });
    produkte.push(original.id);
    const medienVorher = (await payload.count({ collection: 'medien' })).totalDocs;

    const kopie = await payload.duplicate({ collection: 'produkte', id: original.id, user: INHABER as never, overrideAccess: false, context });
    produkte.push(kopie.id);
    expect(kopie.id).not.toBe(original.id);
    expect(kopie.slug).not.toBe(original.slug);
    expect(kopie.slug).toMatch(new RegExp(`^${original.slug}-kopie-[a-z0-9]+$`));
    expect(kopie.kennung).toBe(kopie.slug);
    expect(kopie.kennung).not.toBe(original.kennung);
    expect(kopie._status).toBe('draft');
    expect((await payload.count({ collection: 'medien' })).totalDocs).toBe(medienVorher);

    // Das Original bleibt unverändert und veröffentlicht.
    const danach = await payload.findByID({ collection: 'produkte', id: original.id });
    expect(danach).toMatchObject({ slug: original.slug, kennung: original.kennung, _status: 'published' });
  });
});

describe('Neue Inhaltsseite', () => {
  it('legt eine freie Adresse auf noindex an, lehnt reservierte ab und hält die Adresse fest', async () => {
    const route = `testseite-${process.pid}`;
    await expect(
      payload.create({ collection: 'seiten', data: { route: 'impressum', headline: 'x' }, overrideAccess: false, user: INHABER as never, context }),
    ).rejects.toThrow(ADRESSE_MELDUNG.reserviert);
    await expect(
      payload.create({ collection: 'seiten', data: { route: 'kasse', headline: 'x' }, overrideAccess: false, user: INHABER as never, context }),
    ).rejects.toThrow(ADRESSE_MELDUNG.vergeben);

    const seite = await payload.create({
      collection: 'seiten',
      data: { route, headline: 'Schlüssel für Vereine', intro: 'Testtext.', _status: 'published' },
      overrideAccess: false,
      user: INHABER as never,
      context,
    });
    expect(seite.seo?.noindex).toBe(true);
    expect((await getPageContent(route))?.seo.noindex).toBe(true);

    const geaendert = await payload.update({
      collection: 'seiten',
      id: seite.id,
      data: { route: 'andere-adresse', headline: 'Neu' },
      overrideAccess: false,
      user: INHABER as never,
      context,
    });
    expect(geaendert.route).toBe(route);
    expect(geaendert.headline).toBe('Neu');
    await payload.delete({ collection: 'seiten', id: seite.id, context });
  });
});
