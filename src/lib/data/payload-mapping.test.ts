import { describe, expect, it } from 'vitest';

import { defaults } from './defaults';
import { slugify } from '@/lib/slug';
import * as m from './payload-mapping';
import { JsonFileAdapter } from './json-adapter';
import type { Collections } from './adapter';

/* Jede Sammlung wird so übersetzt, wie der Seed sie anlegt, als gespeichertes
 * Dokument nachgebildet und zurückgelesen. Ergebnis muss dem Ausgangsinhalt
 * entsprechen — sonst ginge beim Umzug nach Payload etwas verloren. */

const adapter = new JsonFileAdapter();
const read = <K extends keyof Collections>(name: K) => adapter.read(name);

const STAND = '2026-09-01T10:00:00.000Z';

function gespeichert<T extends object>(data: T, id: number, extra: Record<string, unknown> = {}) {
  return {
    ...data,
    id,
    createdAt: STAND,
    updatedAt: STAND,
    ...extra,
  } as unknown;
}

describe('Übersetzung Payload ↔ Seite', () => {
  it('Codelinien samt Staffeln und Beispielkennzeichen', async () => {
    const lines = await read('codeLines');
    expect(lines.length).toBeGreaterThan(40);
    lines.forEach((line, index) => {
      const doc = gespeichert(m.codeLineZuPayload(line), index + 1);
      const back = m.codeLineZuSeite(doc as never);
      const expected = { ...line, updatedAt: STAND };
      if (!expected.bulkPrices?.length) delete expected.bulkPrices;
      expect(back, line.id).toEqual(expected);
    });
  });

  it('Standardartikel samt Beispielkennzeichen', async () => {
    const articles = await read('standardArticles');
    expect(articles.length).toBe(8);
    articles.forEach((article, index) => {
      expect(article.example).toBe(true);
      const doc = gespeichert(m.standardartikelZuPayload(article), index + 1);
      expect(m.standardartikelZuSeite(doc as never), article.id).toEqual(article);
    });
  });

  it('Preisgruppen, Leistungen und Preisregeln mit Verweisen', async () => {
    const [groups, services, rules] = await Promise.all([
      read('pricingGroups'),
      read('carKeyServices'),
      read('pricingRules'),
    ]);
    const gruppenIds = new Map(groups.map((g, i) => [g.id, i + 1]));
    const leistungIds = new Map(services.map((s, i) => [s.id, i + 1]));
    const gruppenKennung = new Map(groups.map((g, i) => [i + 1, g.id]));
    const leistungKennung = new Map(services.map((s, i) => [i + 1, s.id]));

    groups.forEach((g, i) => {
      expect(m.preisgruppeZuSeite(gespeichert(m.preisgruppeZuPayload(g), i + 1) as never)).toEqual(g);
    });
    services.forEach((s, i) => {
      expect(m.leistungZuSeite(gespeichert(m.leistungZuPayload(s), i + 1) as never)).toEqual(s);
    });
    rules.forEach((r, i) => {
      const doc = gespeichert(m.preisregelZuPayload(r, gruppenIds, leistungIds), i + 1);
      expect(m.preisregelZuSeite(doc as never, gruppenKennung, leistungKennung), r.id).toEqual(r);
    });
  });

  it('Fahrzeugmarken mit Modellen', async () => {
    const [groups, makes] = await Promise.all([read('pricingGroups'), read('vehicleMakes')]);
    const gruppenIds = new Map(groups.map((g, i) => [g.id, i + 1]));
    const gruppenKennung = new Map(groups.map((g, i) => [i + 1, g.id]));
    makes.forEach((make, i) => {
      const doc = gespeichert(m.fahrzeugmarkeZuPayload(make, gruppenIds), i + 1);
      expect(m.fahrzeugmarkeZuSeite(doc as never, gruppenKennung), make.id).toEqual({ ...make, updatedAt: STAND });
    });
  });

  it('Leistungsseiten, Seitentexte, Ratgeber und Einsatzgebiete', async () => {
    const [servicePages, pages, guides, cities] = await Promise.all([
      read('servicePages'),
      read('pages'),
      read('guides'),
      read('cities'),
    ]);
    servicePages.forEach((p, i) => {
      const doc = gespeichert(m.leistungsseiteZuPayload(p), i + 1);
      expect(m.leistungsseiteZuSeite(doc as never), p.id).toEqual(p);
    });
    pages.forEach((p, i) => {
      const doc = gespeichert(m.seiteZuPayload(p), i + 1, { updatedAt: p.updatedAt });
      expect(m.seiteZuSeite(doc as never), p.route).toEqual(p);
    });
    guides.forEach((g, i) => {
      const doc = gespeichert(m.ratgeberZuPayload(g), i + 1, { updatedAt: g.updatedAt });
      expect(m.ratgeberZuSeite(doc as never), g.id).toEqual(g);
    });
    cities.forEach((c, i) => {
      const doc = gespeichert(m.einsatzgebietZuPayload(c), i + 1, { updatedAt: c.updatedAt });
      expect(m.einsatzgebietZuSeite(doc as never), c.id).toEqual(c);
    });
  });

  it('Zylinder-Hersteller, Modell-SEO und Profil der Codelinie', async () => {
    const catalog = await read('cylinderCatalog');
    const mitHersteller = {
      ...catalog,
      manufacturers: [
        {
          id: 'test-hersteller',
          name: 'Testhersteller',
          active: true,
          description: 'Beschreibung',
          surchargeCentsPerCylinder: 1250,
          forms: ['doppelzylinder' as const],
          components: [{ name: 'Karte', priceCents: 990, description: '' }],
        },
      ],
    };
    const c = m.zylinderkatalogZuSeite(gespeichert(m.zylinderkatalogZuPayload(mitHersteller), 1) as never);
    expect(c.manufacturers).toEqual(mitHersteller.manufacturers);

    const [groups, makes] = await Promise.all([read('pricingGroups'), read('vehicleMakes')]);
    const gruppenIds = new Map(groups.map((g, i) => [g.id, i + 1]));
    const make = {
      ...makes[0],
      seo: { title: '', description: 'Eigene Beschreibung', internalLinks: [] },
      models: [{ ...makes[0].models[0], intro: 'Eigene Einleitung', seo: { title: 'Eigener Titel', description: '' } }],
    };
    const doc = gespeichert(m.fahrzeugmarkeZuPayload(make, gruppenIds), 1);
    expect(m.fahrzeugmarkeZuSeite(doc as never, new Map(groups.map((g, i) => [i + 1, g.id])))).toEqual({ ...make, updatedAt: STAND });

    expect([slugify('Škoda'), slugify('Mégane'), slugify('Größe Ü')]).toEqual(['skoda', 'megane', 'groesse-ue']);

    const [line] = await read('codeLines');
    const mitProfil = { ...line, profile: 'Profil A', codeSeries: 'Serie 100-200' };
    expect(m.codeLineZuSeite(gespeichert(m.codeLineZuPayload(mitProfil), 1) as never)).toEqual({ ...mitProfil, updatedAt: STAND });
  });

  it('Sperrtage behalten ihr Datum', async () => {
    const days = await read('blockedDays');
    days.forEach((d, i) => {
      const back = m.sperrtagZuSeite(gespeichert(m.sperrtagZuPayload(d), i + 1) as never);
      expect({ ...back, id: d.id }).toEqual(d);
    });
  });

  it('Einstellungen und Zylinderkatalog', async () => {
    const [settings, catalog] = await Promise.all([read('settings'), read('cylinderCatalog')]);
    const s = m.einstellungenZuSeite(gespeichert(m.einstellungenZuPayload(settings), 1, { updatedAt: settings.updatedAt }) as never);
    expect(s).toEqual(settings);
    const c = m.zylinderkatalogZuSeite(gespeichert(m.zylinderkatalogZuPayload(catalog), 1) as never);
    expect(c).toEqual(catalog);
  });

  it('Vorgänge samt Zahlung, Termin und Zugriffsschlüssel', () => {
    const record = {
      id: '7',
      reference: 'SM24-2026-0007',
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: {
        salutation: 'Frau',
        firstName: 'Erika',
        lastName: 'Muster',
        email: 'erika@example.org',
        phone: '0301234567',
        street: 'Musterweg 1',
        postalCode: '10115',
        city: 'Berlin',
        country: 'Deutschland',
      },
      payload: { makeSlug: 'volkswagen' },
      summary: [{ title: 'Fahrzeug', rows: [{ label: 'Marke', value: 'Volkswagen' }] }],
      uploads: [],
      quote: {
        mode: 'fest',
        priceCents: 14900,
        depositCents: 6990,
        remainderCents: 7910,
        slotMinutes: 45,
        leadTimeDays: 7,
        requiresVehicleOnSite: true,
      },
      appointment: { date: '2026-10-02', time: '09:00', durationMinutes: 45, location: 'werkstatt' },
      payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen' },
      internalNotes: [],
      timeline: [{ at: STAND, actor: 'system', message: 'Vorgang angelegt.' }],
      accessTokenHash: 'a'.repeat(64),
    } satisfies Collections['records'][number];
    const back = m.vorgangZuSeite(gespeichert(m.vorgangZuPayload(record), 7) as never);
    expect(back).toEqual(record);
  });

  it('Vorgänge mit Mailprotokoll, Versand, Zustimmungen und vollständiger Zahlung', () => {
    const record = {
      id: '8',
      reference: 'SM24-B-2026-0008',
      kind: 'bestellung',
      area: 'schluessel-nach-code',
      process: 'direktkauf',
      status: 'versendet',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      payment: {
        scope: 'gesamt',
        amountCents: 2490,
        status: 'erstattet',
        providerRef: 'pi_123',
        checkoutSessionId: 'cs_test_123',
        refundedCents: 2490,
        paidAt: STAND,
        expiresAt: '2026-09-02T09:00:00.000Z',
      },
      internalNotes: [{ at: STAND, actor: 'team', message: 'Rückruf vereinbart.' }],
      timeline: [],
      mailLog: [
        { kind: 'eingang-kunde', to: 'erika@example.org', at: STAND, result: 'gesendet', providerId: 're_1' },
        { kind: 'eingang-team', to: 'werkstatt@example.org', at: STAND, result: 'fehlgeschlagen', error: '429' },
      ],
      shipment: { carrier: 'dhl', trackingNumber: '00340434161234567890' },
      consents: { terms: true, withdrawalNotice: true, customMade: false, at: STAND, version: '2026-10' },
    } satisfies Collections['records'][number];
    const back = m.vorgangZuSeite(gespeichert(m.vorgangZuPayload(record), 8) as never);
    expect(back).toEqual(record);
  });

  it('Vorgänge ohne Mailprotokoll leeren beim Zurückschreiben nichts', () => {
    const data = m.vorgangZuPayload({
      id: '9',
      reference: 'SM24-A-2026-0009',
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
      payload: {},
      summary: [],
      uploads: [],
      internalNotes: [],
      timeline: [],
    });
    // undefined heißt für Payload: gespeicherten Wert behalten.
    expect(data.mails).toBeUndefined();
    expect(data.positionen).toBeUndefined();
    expect(data.versand).toBeUndefined();
    expect(data.zustimmungen).toBeUndefined();
    expect(data.zahlung).toBeUndefined();
    expect('dateien' in data).toBe(false);
  });

  it('Teiländerung schreibt nur die genannten Gruppen, die Zahlung immer ganz', () => {
    expect(m.vorgangAenderungZuPayload({})).toEqual({});
    const daten = m.vorgangAenderungZuPayload({
      status: 'storniert',
      payment: { scope: 'anzahlung', amountCents: 6990, status: 'bezahlt', paidAt: STAND },
      timeline: [{ at: STAND, actor: 'system', message: 'Zahlung eingegangen.' }],
    });
    expect(Object.keys(daten).sort()).toEqual(['status', 'verlauf', 'zahlung']);
    expect(Object.keys(daten.zahlung ?? {}).sort()).toEqual([
      'ablaufAm', 'anbieterRef', 'betragCent', 'bezahltAm', 'checkoutSitzung', 'erstattetCent', 'status', 'umfang',
    ]);
    expect(daten.verlauf).toEqual([{ am: STAND, von: 'system', text: 'Zahlung eingegangen.' }]);
    const mails = m.vorgangAenderungZuPayload({
      mailLog: [{ kind: 'status', to: 'erika@example.org', at: STAND, result: 'nicht-eingerichtet' }],
      shipment: { carrier: 'dpd' },
      consents: { earlyStart: true },
      accessTokenHash: 'b'.repeat(64),
    });
    expect(Object.keys(mails).sort()).toEqual(['mails', 'versand', 'zugriffsHash', 'zustimmungen']);
  });

  it('GPSR-Angaben an Artikeln und am Zylinderkatalog', async () => {
    const [lines, articles, catalog] = await Promise.all([
      read('codeLines'),
      read('standardArticles'),
      read('cylinderCatalog'),
    ]);
    const gpsr = { manufacturerName: 'Beispiel GmbH', manufacturerAddress: 'Musterweg 1\n12345 Musterstadt', productId: 'ZY-01' };
    const line = { ...lines[0], gpsr };
    if (!line.bulkPrices?.length) delete line.bulkPrices;
    expect(m.codeLineZuSeite(gespeichert(m.codeLineZuPayload(line), 1) as never)).toEqual({ ...line, updatedAt: STAND });
    const article = { ...articles[0], gpsr: { manufacturerEmail: 'info@example.org', safetyNotes: 'Nicht für Kinder.' } };
    expect(m.standardartikelZuSeite(gespeichert(m.standardartikelZuPayload(article), 1) as never)).toEqual(article);
    const katalog = { ...catalog, gpsr: { manufacturerWebsite: 'https://example.org' } };
    expect(m.zylinderkatalogZuSeite(gespeichert(m.zylinderkatalogZuPayload(katalog), 1) as never)).toEqual(katalog);
    // Leere Gruppe aus der Datenbank: kein GPSR-Eintrag.
    expect(m.gpsrZuSeite({ herstellerName: '', produktkennung: null })).toBeUndefined();
  });

  it('Eigentexte der Rechtsseiten nur, wenn sie Text enthalten', async () => {
    const settings = await read('settings');
    const absatz = (text: string) => ({
      root: { type: 'root', children: [{ type: 'paragraph', children: text ? [{ type: 'text', text }] : [] }] },
    });
    const mitTexten = { ...settings, legalTexts: { terms: absatz('§ 1 Geltungsbereich'), privacy: absatz('Verantwortlich ist …') } };
    const doc = gespeichert(m.einstellungenZuPayload(mitTexten), 1, { updatedAt: settings.updatedAt }) as Record<string, unknown>;
    expect(m.einstellungenZuSeite(doc as never)).toEqual(mitTexten);
    const leer = { ...doc, rechtstexte: { agb: absatz(''), widerruf: absatz('   '), datenschutz: null } };
    expect(m.einstellungenZuSeite(leer as never).legalTexts).toBeUndefined();
  });

  it('Firmendaten: Rechtsform, Standort und Lieferzeit', async () => {
    const settings = await read('settings');
    expect(settings.company).toMatchObject({ legalForm: 'einzelunternehmen', isPlaceholder: false });
    const anders = {
      ...settings,
      company: { ...settings.company, legalForm: 'gmbh' as const, registerCourt: 'Amtsgericht Wetzlar', registerNumber: 'HRB 1' },
      shipping: settings.shipping.map((v) => ({ ...v, deliveryTime: '2–4 Werktage' })),
      booking: { ...settings.booking, federalState: 'NW' as const },
    };
    const doc = gespeichert(m.einstellungenZuPayload(anders), 1, { updatedAt: settings.updatedAt });
    expect(m.einstellungenZuSeite(doc as never)).toEqual(anders);
    const ohneStandort = { ...settings, company: { ...settings.company } };
    delete ohneStandort.company.location;
    delete ohneStandort.company.taxNumber;
    delete ohneStandort.company.contentResponsible;
    const doc2 = gespeichert(m.einstellungenZuPayload(ohneStandort), 1, { updatedAt: settings.updatedAt });
    expect(m.einstellungenZuSeite(doc2 as never)).toEqual(ohneStandort);
  });

  it('Bild aus der Medienbibliothek ersetzt den Platzhalter', () => {
    const slot = m.bildZuSeite(
      {
        motiv: 'Werkstatt',
        format: '16/9',
        bild: { id: 3, alt: 'Fräse in der Werkstatt', url: '/api/medien/file/fraese.jpg?2026', width: 1600, height: 900, updatedAt: STAND, createdAt: STAND },
      },
      'Fallback',
    );
    expect(slot.bild).toEqual({ url: '/api/medien/file/fraese.jpg', alt: 'Fräse in der Werkstatt', width: 1600, height: 900 });
  });

  it('Medien-URL wird immer zum Pfad unter /api/medien/file/ (serverURL und Ablage-Präfix)', () => {
    expect(m.medienPfad('https://schluesselmacher24.de/api/medien/file/a-960x540.jpg?123')).toBe('/api/medien/file/a-960x540.jpg');
    expect(m.medienPfad('/api/medien/file/a.jpg?prefix=medien')).toBe('/api/medien/file/a.jpg');
    expect(m.medienPfad('/api/medien/file/fr%C3%A4se%20vorn.jpg')).toBe('/api/medien/file/fr%C3%A4se%20vorn.jpg');
    // Alles andere nicht: fremde Pfade und Hosts erreichen next/image nie.
    expect(m.medienPfad('https://fremd.example/bild.jpg')).toBeUndefined();
    expect(m.medienPfad('/api/kundendateien/file/schein.jpg')).toBeUndefined();
    expect(m.medienPfad('/api/medien/file/../../kundendateien/file/x.jpg')).toBeUndefined();
    expect(m.medienPfad('')).toBeUndefined();
    expect(m.medienPfad(null)).toBeUndefined();

    const slot = m.bildZuSeite(
      {
        motiv: 'Werkstatt',
        bild: {
          id: 4,
          alt: '',
          url: 'https://schluesselmacher24.de/api/medien/file/werkstatt.jpg?prefix=medien',
          sizes: { mittel: { url: 'https://schluesselmacher24.de/api/medien/file/werkstatt-960x540.jpg?prefix=medien', width: 960, height: 540 } },
          updatedAt: STAND,
          createdAt: STAND,
        },
      },
      'Fallback',
    );
    expect(slot.bild).toEqual({ url: '/api/medien/file/werkstatt-960x540.jpg', alt: 'Werkstatt', width: 960, height: 540 });
  });

  it('Standardinhalt ist vollständig übersetzbar', () => {
    expect(() => m.einstellungenZuPayload(defaults.settings())).not.toThrow();
    expect(() => m.zylinderkatalogZuPayload(defaults.cylinderCatalog())).not.toThrow();
  });
});
