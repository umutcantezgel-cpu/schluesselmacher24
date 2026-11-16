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

describe('Shop-Grundlage (FA-SHOP-01)', () => {
  it('Shop-Kategorien samt Unterkategorie, Bild, Suchmaschinen und früheren Adressen', () => {
    const start = defaults.kategorien();
    const ids = new Map(start.map((k, i) => [k.id, i + 1]));
    start.forEach((k, index) => {
      expect(m.kategorieZuSeite(gespeichert(m.kategorieZuPayload(k, ids), index + 1) as never), k.id).toEqual(k);
    });
    const unter = {
      ...start[0],
      id: 'test-unter',
      slug: 'test-unter',
      eltern: start[0].id,
      bild: { motif: 'Schlüssel auf Holz', ratio: '4/3' as const },
      seo: { title: 'Eigener Titel', description: 'Eigene Beschreibung', internalLinks: [] },
      fruehereAdressen: ['alt-1', 'alt-2'],
    };
    const daten = m.kategorieZuPayload(unter, ids);
    expect(daten.eltern).toBe(1);
    // Payload liefert die übergeordnete Kategorie mit depth 1 als Dokument.
    const doc = gespeichert({ ...daten, eltern: gespeichert(m.kategorieZuPayload(start[0]), 1) }, 99);
    expect(m.kategorieZuSeite(doc as never)).toEqual(unter);
  });

  it('Hersteller: Logo nur mit Freigabe (R12)', () => {
    const hersteller = { id: 'test-hersteller', slug: 'test-hersteller', name: 'Testhersteller', einsatz: 'Möbelschlösser', angeboten: true, reihenfolge: 10 };
    const daten = m.herstellerZuPayload(hersteller);
    expect(m.herstellerZuSeite(gespeichert(daten, 1) as never)).toEqual(hersteller);
    const logo = { id: 7, url: '/api/medien/file/logo.png', alt: '', width: 200, height: 200 };
    const ohne = m.herstellerZuSeite(gespeichert({ ...daten, logo: { bild: logo, freigabe: false } }, 1) as never);
    expect(ohne.logo).toBeUndefined();
    const mit = m.herstellerZuSeite(gespeichert({ ...daten, logo: { bild: logo, freigabe: true } }, 1) as never);
    expect(mit.logo?.bild?.url).toBe('/api/medien/file/logo.png');
    expect(mit.logo?.motif).toBe('Logo Testhersteller');
  });

  it('Codeprodukt mit System, Codebereich, Lieferzeit, Verfügbarkeit, Kategorie und Hersteller', async () => {
    const [line] = await read('codeLines');
    const voll = {
      ...line,
      manufacturer: 'Testhersteller',
      system: 'System T',
      codeRange: '1 bis 999',
      deliveryTime: '2 bis 4 Werktage',
      availability: 'auf-anfrage' as const,
      categoryId: 'schluessel-nach-code',
      manufacturerId: 'test-hersteller',
    };
    if (!voll.bulkPrices?.length) delete voll.bulkPrices;
    const verweise = { kategorien: new Map([['schluessel-nach-code', 3]]), hersteller: new Map([['test-hersteller', 4]]) };
    const daten = m.codeLineZuPayload(voll, verweise);
    expect(daten).toMatchObject({ system: 'System T', codebereich: '1 bis 999', lieferzeit: '2 bis 4 Werktage', verfuegbarkeit: 'auf-anfrage', kategorie: 3, herstellerAuswahl: 4 });
    const doc = gespeichert({
      ...daten,
      kategorie: { id: 3, kennung: 'schluessel-nach-code', slug: 'schluessel-nach-code' },
      herstellerAuswahl: { id: 4, kennung: 'test-hersteller', slug: 'test-hersteller', name: 'Testhersteller' },
    }, 1);
    expect(m.codeLineZuSeite(doc as never)).toEqual({ ...voll, updatedAt: STAND });

    // Ohne Verweise bleiben die Felder leer; lieferbar ist der Normalfall und wird nicht eigens geführt.
    const schlicht = m.codeLineZuPayload(line);
    expect(schlicht).toMatchObject({ verfuegbarkeit: 'lieferbar', kategorie: null, herstellerAuswahl: null, system: null });
    expect(m.codeLineZuSeite(gespeichert(schlicht, 1) as never).availability).toBeUndefined();
  });

  it('weitere Fotos eines Codeprodukts kommen auf die Seite, ohne Fotos fehlt das Feld', async () => {
    const [line] = await read('codeLines');
    const daten = m.codeLineZuPayload(line);
    expect(m.codeLineZuSeite(gespeichert(daten, 1) as never).gallery).toBeUndefined();
    const doc = gespeichert({
      ...daten,
      // Ein hochgeladenes Bild und eine bloße Kennung (nicht aufgelöst): nur das Bild erscheint.
      weitereBilder: [{ id: 7, url: '/api/medien/file/seite.webp', alt: 'Schlüssel von der Seite', width: 800, height: 800 }, 8],
    }, 1);
    const gallery = m.codeLineZuSeite(doc as never).gallery;
    expect(gallery).toHaveLength(1);
    expect(gallery?.[0]).toMatchObject({ alt: 'Schlüssel von der Seite', width: 800, height: 800 });
    expect(gallery?.[0].url).toContain('seite.webp');
  });

  it('Hersteller aus der Stammliste geht vor dem alten Freitext', async () => {
    const [article] = await read('standardArticles');
    const daten = { ...m.standardartikelZuPayload(article), hersteller: 'Alter Freitext' };
    expect(m.standardartikelZuSeite(gespeichert(daten, 1) as never).manufacturer).toBe('Alter Freitext');
    const gewaehlt = { ...daten, herstellerAuswahl: { id: 4, kennung: 'neu', name: 'Neuer Name' }, verfuegbarkeit: 'nicht-lieferbar' };
    const seite = m.standardartikelZuSeite(gespeichert(gewaehlt, 1) as never);
    expect(seite).toMatchObject({ manufacturer: 'Neuer Name', manufacturerId: 'neu', availability: 'nicht-lieferbar' });
  });
});

describe('Zylinderkatalog: Preis nicht bestätigt und Hersteller aus dem Stamm (FA-SHOP-04)', () => {
  it('der Bestand trägt keinen Haken; ohne Haken bleibt der Katalog unverändert', async () => {
    const catalog = await read('cylinderCatalog');
    const payload = m.zylinderkatalogZuPayload(catalog);
    expect(payload.schluesselPreisNichtBestaetigt).toBe(false);
    expect(payload.bauformen?.every((b) => b.preisNichtBestaetigt === false)).toBe(true);
    expect(payload.funktionen?.every((f) => f.preisNichtBestaetigt === false)).toBe(true);
    expect(payload.extras?.every((e) => e.preisNichtBestaetigt === false)).toBe(true);
    const zurueck = m.zylinderkatalogZuSeite(gespeichert(payload, 1) as never);
    expect(zurueck).toEqual(catalog);
    expect(JSON.stringify(zurueck)).not.toContain('Unconfirmed');
  });

  it('Haken an Bauform, Funktion, Option, Hersteller und Schlüsselpreis gehen verlustfrei hin und zurück, Preise bleiben', async () => {
    const catalog = await read('cylinderCatalog');
    const mitHaken = {
      ...catalog,
      keyPriceUnconfirmed: true,
      forms: catalog.forms.map((f, i) => (i === 0 ? { ...f, priceUnconfirmed: true } : f)),
      functions: catalog.functions.map((f, i) => (i === 1 ? { ...f, priceUnconfirmed: true } : f)),
      extras: catalog.extras.map((e, i) => (i === 0 ? { ...e, priceUnconfirmed: true } : e)),
      manufacturers: [
        { id: 'test-hersteller', name: 'Testhersteller', active: true, description: '', surchargeCentsPerCylinder: 100, forms: [], components: [], priceUnconfirmed: true },
      ],
    };
    const zurueck = m.zylinderkatalogZuSeite(gespeichert(m.zylinderkatalogZuPayload(mitHaken), 1) as never);
    expect(zurueck).toEqual(mitHaken);
    expect(zurueck.forms.map((f) => f.basePriceCents)).toEqual(catalog.forms.map((f) => f.basePriceCents));
  });

  it('ein Eintrag mit Auswahl aus der Hersteller-Liste nimmt Name und Kennung aus dem Stamm', () => {
    const katalog = m.zylinderkatalogZuPayload(defaults.cylinderCatalog());
    const stamm = { ...m.herstellerZuPayload(defaults.hersteller()[0]), id: 4, createdAt: STAND, updatedAt: STAND };
    const doc = gespeichert({
      ...katalog,
      hersteller: [
        // Verweis geladen (depth 1): Name und Kennung aus dem Stamm, auch wenn der Eintrag alte Werte trägt.
        { stamm, name: 'alter Name', kennung: 'alt', aktiv: true, aufpreisJeZylinder: 0, bauformen: [], zusatzkomponenten: [] },
        // Älterer Eintrag ohne Auswahl: bleibt lesbar mit eigenem Namen.
        { stamm: null, name: 'Älterer Hersteller', kennung: 'aelter', aktiv: false, aufpreisJeZylinder: 2, bauformen: [], zusatzkomponenten: [] },
      ],
    }, 1);
    const c = m.zylinderkatalogZuSeite(doc as never);
    expect(c.manufacturers.map((h) => [h.id, h.name, h.stammId])).toEqual([
      ['bks', 'BKS', 'bks'],
      ['aelter', 'Älterer Hersteller', undefined],
    ]);
    expect(c.manufacturers[1].surchargeCentsPerCylinder).toBe(200);
    // Rückweg: mit Kennung → ID der Liste wieder verknüpft, ohne Karte ein älterer Eintrag.
    expect(m.zylinderkatalogZuPayload(c, { hersteller: new Map([['bks', 4]]) }).hersteller?.map((h) => h.stamm)).toEqual([4, null]);
    expect(m.zylinderkatalogZuPayload(c).hersteller?.map((h) => h.stamm)).toEqual([null, null]);
  });
});

describe('Gehäuse, Ersatzteile und Umbau-Beispiele (FA-SHOP-02)', () => {
  const teil = {
    teileart: 'gehaeuse' as const,
    bauformen: ['klappschluessel', 'smart-key'],
    marke: 'Testmarke',
    reihen: ['testmarke-alpha'],
    baujahrVon: 2008,
    baujahrBis: 2016,
    tastenzahl: 3,
    schluesselarten: ['klappschluessel' as const],
    kompatibilitaet: 'Elektronik und Bart werden übernommen. Der Transponder nur nach Prüfung.',
    elektronik: 'pruefung' as const,
  };
  const verweise = {
    bauformen: new Map([['klappschluessel', 11], ['smart-key', 12]]),
    fahrzeugreihen: new Map([['testmarke-alpha', 21]]),
  };

  it('Standardartikel mit Fahrzeugteil: verlustfrei hin und zurück', async () => {
    const [article] = await read('standardArticles');
    const voll = { ...article, fahrzeugteil: teil };
    const daten = m.standardartikelZuPayload(voll, verweise);
    expect(daten.fahrzeugteil).toMatchObject({ aktiv: true, bauformen: [11, 12], reihen: [21], marke: 'Testmarke', tastenzahl: 3 });
    // Payload liefert Verweise mit depth 1 als Dokumente.
    const doc = gespeichert({
      ...daten,
      fahrzeugteil: {
        ...daten.fahrzeugteil,
        bauformen: [{ id: 11, kennung: 'klappschluessel' }, { id: 12, kennung: 'smart-key' }],
        reihen: [{ id: 21, kennung: 'testmarke-alpha' }],
      },
    }, 1);
    expect(m.standardartikelZuSeite(doc as never)).toEqual(voll);
  });

  it('ohne Haken oder ohne Pflichtangaben kein Fahrzeugteil (keine falschen Versprechen)', async () => {
    const [article] = await read('standardArticles');
    const ohne = m.standardartikelZuPayload(article);
    expect(ohne.fahrzeugteil).toEqual({ aktiv: false });
    expect(m.standardartikelZuSeite(gespeichert(ohne, 1) as never).fahrzeugteil).toBeUndefined();
    const daten = m.fahrzeugteilZuPayload(teil, verweise);
    expect(m.fahrzeugteilZuSeite({ ...daten, aktiv: false })).toBeUndefined();
    expect(m.fahrzeugteilZuSeite({ ...daten, kompatibilitaet: '  ' })).toBeUndefined();
    expect(m.fahrzeugteilZuSeite({ ...daten, elektronik: null })).toBeUndefined();
    // Gehäuse ohne Marke (vor der Pflichtregel gespeichert): kein Fahrzeugteil.
    expect(m.fahrzeugteilZuSeite({ ...daten, marke: null })).toBeUndefined();
    expect(m.fahrzeugteilZuSeite({ ...daten, teileart: 'batterie', marke: null })).toBeDefined();
    // Nicht aufgelöste Verweise (bloße IDs) entfallen, statt Zahlen als Kennung auszugeben.
    expect(m.fahrzeugteilZuSeite(daten)).toMatchObject({ bauformen: [], reihen: [] });
    // Ohne bekannte ID entfällt der Verweis auch beim Import.
    expect(m.fahrzeugteilZuPayload(teil).bauformen).toEqual([]);
  });

  it('Bauformen: Startbestand verlustfrei', () => {
    const start = defaults.bauformen();
    start.forEach((b, index) => {
      expect(m.bauformZuSeite(gespeichert(m.bauformZuPayload(b), index + 1) as never), b.id).toEqual(b);
    });
    const mitText = { ...start[0], beschreibung: 'Bart klappt aus dem Gehäuse.' };
    expect(m.bauformZuSeite(gespeichert(m.bauformZuPayload(mitText), 1) as never)).toEqual(mitText);
  });

  it('Umbau-Beispiel nur mit Freigabe und beiden Fotos samt Beschriftung', () => {
    const foto = (id: number, name: string) => ({ id, url: `/api/medien/file/${name}.jpg`, alt: '', width: 800, height: 600 });
    const doc = {
      id: 5,
      titel: 'Funkschlüssel in Klappschlüssel',
      vorher: { bild: foto(1, 'vorher'), beschriftung: 'Vorher: altes Gehäuse' },
      nachher: { bild: foto(2, 'nachher'), beschriftung: 'Nachher: Klappschlüssel' },
      marke: 'Testmarke',
      reihe: { id: 21, kennung: 'testmarke-alpha' },
      schluesselart: 'funk',
      uebernommen: ['elektronik', 'transponder'],
      hinweis: 'Nur, wenn die Platine in das neue Gehäuse passt.',
      einsatz: ['customizing', 'gehaeuse'],
      freigabe: true,
      reihenfolge: 10,
      _status: 'published',
      createdAt: STAND,
      updatedAt: STAND,
    };
    expect(m.umbauBeispielZuSeite(doc as never)).toEqual({
      id: '5',
      titel: 'Funkschlüssel in Klappschlüssel',
      vorher: { url: '/api/medien/file/vorher.jpg', alt: 'Vorher: altes Gehäuse', width: 800, height: 600, beschriftung: 'Vorher: altes Gehäuse' },
      nachher: { url: '/api/medien/file/nachher.jpg', alt: 'Nachher: Klappschlüssel', width: 800, height: 600, beschriftung: 'Nachher: Klappschlüssel' },
      marke: 'Testmarke',
      reihe: 'testmarke-alpha',
      schluesselart: 'funk',
      uebernommen: ['elektronik', 'transponder'],
      hinweis: 'Nur, wenn die Platine in das neue Gehäuse passt.',
      einsatz: ['customizing', 'gehaeuse'],
      reihenfolge: 10,
    });
    expect(m.umbauBeispielZuSeite({ ...doc, freigabe: false } as never)).toBeNull();
    expect(m.umbauBeispielZuSeite({ ...doc, nachher: { bild: 2, beschriftung: 'x' } } as never)).toBeNull();
    expect(m.umbauBeispielZuSeite({ ...doc, vorher: { ...doc.vorher, beschriftung: '' } } as never)).toBeNull();
    // Eine Reihe ohne Marke wird nicht ausgegeben.
    expect(m.umbauBeispielZuSeite({ ...doc, marke: '' } as never)?.reihe).toBeUndefined();
  });
});
