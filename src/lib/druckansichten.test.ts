import { describe, expect, it } from 'vitest';

import { inProduktion, produktionslisteHtml, produktionsPositionen, vorgangsblattHtml } from './druckansichten';
import { echteEinstellungen } from './rechtliches/test-hilfen';
import type { BusinessRecord } from './types';

const JETZT = new Date('2026-10-25T09:00:00.000Z');

function vorgang(teil: Partial<BusinessRecord>): BusinessRecord {
  return {
    id: '7',
    reference: 'SM24-P-2026-0003',
    kind: 'projekt',
    area: 'elektronische-zutrittsloesungen',
    process: 'projektkonfigurator',
    status: 'in-pruefung',
    createdAt: '2026-10-20T08:15:00.000Z',
    updatedAt: '2026-10-20T08:15:00.000Z',
    contact: {
      firstName: 'Erika',
      lastName: 'Muster',
      company: 'Muster <GmbH>',
      email: 'erika@example.org',
      phone: '0301234567',
      street: 'Musterweg 1',
      postalCode: '35576',
      city: 'Wetzlar',
      country: 'Deutschland',
    },
    payload: {},
    summary: [
      { title: 'Objekt', rows: [{ label: 'Türen', value: '12' }, { label: 'Hinweis', value: '<script>alert(1)</script>' }] },
    ],
    uploads: [{ id: 'u1', fileName: 'grundriss.pdf', sizeBytes: 1, mimeType: 'application/pdf', category: 'grundriss', storageKey: '9', uploadedAt: '2026-10-20T08:15:00.000Z' }],
    internalNotes: [{ at: '2026-10-21T10:00:00.000Z', actor: 'team', message: 'Rückruf vereinbart.' }],
    timeline: [],
    ...teil,
  };
}

describe('Vorgangsblatt', () => {
  const html = vorgangsblattHtml({ vorgang: vorgang({}), firma: echteEinstellungen().company, nonce: 'abc123', jetzt: JETZT });

  it('Kopf mit Nummer, Art, Bereich, Status und Kunde', () => {
    expect(html.startsWith('<!doctype html><html lang="de">')).toBe(true);
    expect(html).toContain('<title>Vorgangsblatt SM24-P-2026-0003</title>');
    expect(html).toContain('Projektanfrage');
    expect(html).toContain('Elektronische Zutrittslösungen');
    expect(html).toContain('In Prüfung');
    expect(html).toContain('Erika Muster · Muster &lt;GmbH&gt;');
    expect(html).toContain('0301234567');
  });

  it('Zusammenfassung, Unterlagen und interne Notizen — alles maskiert', () => {
    expect(html).toContain('<h3>Objekt</h3>');
    expect(html).toContain('<th>Türen</th><td>12</td>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>alert(1)');
    expect(html).toContain('grundriss.pdf');
    expect(html).toContain('Rückruf vereinbart.');
  });

  it('Druckknopf nur über das Skript mit Nonce, ohne externe Dateien', () => {
    expect(html).toContain('<button type="button" id="drucken">Drucken / als PDF speichern</button>');
    expect(html).toContain('<script nonce="abc123">');
    expect(html).toContain('window.print()');
    expect(html).not.toMatch(/onclick=/i);
    expect(html).not.toMatch(/(src|href)="https?:/);
    expect(html).toContain('@media print');
  });

  it('Termin mit Werkstatt-Anschrift, Positionen bei Bestellungen statt Zusammenfassung', () => {
    const termin = vorgangsblattHtml({
      vorgang: vorgang({
        kind: 'termin',
        area: 'autoschluessel',
        appointment: { date: '2026-11-02', time: '09:00', durationMinutes: 90, location: 'werkstatt' },
        quote: { mode: 'fest', depositCents: 6990, slotMinutes: 90, leadTimeDays: 7, requiresVehicleOnSite: true },
        payment: { scope: 'anzahlung', amountCents: 6990, status: 'bezahlt', paidAt: '2026-10-20T08:20:00.000Z' },
      }),
      firma: echteEinstellungen().company,
      nonce: 'n',
      jetzt: JETZT,
    });
    expect(termin).toContain('Montag, 2. November 2026, 09:00 Uhr');
    expect(termin).toContain('In unserer Werkstatt, mit Fahrzeug (Langgasse 70, 35576 Wetzlar)');
    expect(termin).toContain('<th>Anzahlung</th><td>69,90');

    const bestellung = vorgangsblattHtml({
      vorgang: vorgang({
        kind: 'bestellung',
        area: 'schluessel-nach-code',
        lines: [{ kind: 'code-schluessel', productId: 'ms-01', label: 'Schlüssel MS 01', details: 'Code 4711', qty: 2, unitPriceCents: 1290, totalCents: 2580, vatPercent: 19 }],
        totals: { itemsCents: 2580, shippingCents: 495, totalCents: 3075, vatCents: 491, shippingLabel: 'Versand verfolgbar' },
      }),
      nonce: 'n',
      jetzt: JETZT,
    });
    expect(bestellung).toContain('<h2>Positionen</h2>');
    expect(bestellung).toContain('Code 4711');
    expect(bestellung).toContain('30,75');
    expect(bestellung).not.toContain('<h3>Objekt</h3>');
  });
});

describe('Produktionsliste', () => {
  const bestellung = (teil: Partial<BusinessRecord>) =>
    vorgang({
      kind: 'bestellung',
      area: 'schluessel-nach-code',
      status: 'in-fertigung',
      payment: { scope: 'gesamt', amountCents: 3075, status: 'bezahlt', paidAt: '2026-10-22T08:00:00.000Z' },
      lines: [
        { kind: 'code-schluessel', productId: 'ms-01', label: 'Schlüssel MS 01', details: 'Code 4711', qty: 2, unitPriceCents: 1290, totalCents: 2580, vatPercent: 19 },
        { kind: 'standard', productId: 'anh-1', label: 'Schlüsselanhänger', details: '', qty: 1, unitPriceCents: 300, totalCents: 300, vatPercent: 19 },
        { kind: 'zylinder-schliessung', productId: 'zylinder-schliessung', label: 'Gleichschließende Zylinder', details: 'Doppelzylinder 30/35: 2 Stück', qty: 1, unitPriceCents: 9900, totalCents: 9900, vatPercent: 19 },
      ],
      totals: { itemsCents: 12780, shippingCents: 795, totalCents: 13575, vatCents: 2167, shippingLabel: 'Paket versichert' },
      payload: { items: [{ note: 'Bitte zwei Anhänger' }, {}, { note: 'Not- und Gefahrenfunktion' }], deliveryNote: 'Beim Nachbarn abgeben' },
      ...teil,
    });

  const vorgaenge = [
    bestellung({ id: '2', reference: 'SM24-B-2026-0002', payment: { scope: 'gesamt', amountCents: 1, status: 'bezahlt', paidAt: '2026-10-23T08:00:00.000Z' } }),
    bestellung({ id: '1', reference: 'SM24-B-2026-0001' }),
    bestellung({ id: '3', reference: 'SM24-B-2026-0003', status: 'versendet' }),
    bestellung({ id: '4', reference: 'SM24-B-2026-0004', payment: { scope: 'gesamt', amountCents: 1, status: 'offen' } }),
    vorgang({ id: '5' }),
  ];

  it('nur bezahlt und nicht versendet, nur Code- und Zylinderpositionen, älteste Zahlung zuerst', () => {
    expect(vorgaenge.filter(inProduktion).map((v) => v.id)).toEqual(['2', '1']);
    const positionen = produktionsPositionen(vorgaenge);
    expect(positionen.map((p) => [p.nummer, p.art, p.stueck])).toEqual([
      ['SM24-B-2026-0001', 'code-schluessel', 2],
      ['SM24-B-2026-0001', 'zylinder-schliessung', 1],
      ['SM24-B-2026-0002', 'code-schluessel', 2],
      ['SM24-B-2026-0002', 'zylinder-schliessung', 1],
    ]);
    expect(positionen[0]).toMatchObject({
      angaben: 'Code 4711',
      kunde: 'Erika Muster · Muster <GmbH>',
      hinweise: ['Anmerkung: Bitte zwei Anhänger', 'Lieferhinweis: Beim Nachbarn abgeben', 'Versand: Paket versichert'],
    });
    expect(positionen[1].hinweise[0]).toBe('Anmerkung: Not- und Gefahrenfunktion');
  });

  it('als Druckseite mit Code, Stückzahl, Kunde und Link in den Vorgang', () => {
    const html = produktionslisteHtml({ vorgaenge, nonce: 'n', jetzt: JETZT, vorgangLink: (id) => `/admin/collections/vorgaenge/${id}` });
    expect(html).toContain('<title>Produktionsliste</title>');
    expect(html).toContain('<td class="code">Code 4711</td>');
    expect(html).toContain('<a href="/admin/collections/vorgaenge/1">SM24-B-2026-0001</a>');
    expect(html).toContain('Muster &lt;GmbH&gt;');
    expect(html).not.toContain('Schlüsselanhänger');
    expect(html).not.toContain('SM24-B-2026-0003');
    expect(html).toContain('4 Positionen.');
    expect(produktionslisteHtml({ vorgaenge: [], nonce: 'n', jetzt: JETZT })).toContain('Keine offenen Code- oder Zylinderpositionen.');
  });
});
