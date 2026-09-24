import { describe, expect, it } from 'vitest';

import { defaults } from './defaults';
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
      const expected = { ...line };
      if (!expected.bulkPrices?.length) delete expected.bulkPrices;
      expect(back, line.id).toEqual(expected);
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
      expect(m.fahrzeugmarkeZuSeite(doc as never, gruppenKennung), make.id).toEqual(make);
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

  it('Standardinhalt ist vollständig übersetzbar', () => {
    expect(() => m.einstellungenZuPayload(defaults.settings())).not.toThrow();
    expect(() => m.zylinderkatalogZuPayload(defaults.cylinderCatalog())).not.toThrow();
  });
});
