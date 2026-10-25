import { describe, expect, it } from 'vitest';

import type { BusinessRecord } from './types';
import { betrag, tagInBerlin, vorgaengeAlsCsv, zelle } from './vorgaenge-csv';

function vorgang(teil: Partial<BusinessRecord>): BusinessRecord {
  return {
    id: '1',
    reference: 'SM24-B-2026-0001',
    kind: 'bestellung',
    area: 'schluessel-nach-code',
    process: 'direktkauf',
    status: 'neu',
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-24T10:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '1', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    ...teil,
  };
}

describe('CSV-Export der Vorgänge', () => {
  it('Semikolon, BOM, CRLF und Kopfzeile', () => {
    const csv = vorgaengeAlsCsv([]);
    expect(csv.startsWith('﻿Nummer;Datum;Art;Bereich;Name;E-Mail;Positionen;Netto;USt.;Brutto;Versand;Zahlungsstand;Zahlungsreferenz\r\n')).toBe(true);
  });

  it('Bestellung mit Positionen und Summen, Anzahlung mit herausgerechneter USt., älteste zuerst', () => {
    const csv = vorgaengeAlsCsv([
      vorgang({
        reference: 'SM24-T-2026-0002',
        kind: 'termin',
        area: 'autoschluessel',
        createdAt: '2026-10-25T08:00:00.000Z',
        payment: { scope: 'anzahlung', amountCents: 6990, status: 'bezahlt', providerRef: 'pi_123' },
        appointment: { date: '2026-11-04', time: '10:00', durationMinutes: 90, location: 'werkstatt' },
      }),
      vorgang({
        contact: { firstName: 'Erika', lastName: 'Muster', company: 'Muster GmbH', email: 'erika@example.org', phone: '1', country: 'Deutschland' },
        lines: [
          { kind: 'code-schluessel', productId: 'ms-01', label: 'Schlüssel MS 01', details: 'Code 4711', qty: 2, unitPriceCents: 1290, totalCents: 2580, vatPercent: 19 },
        ],
        totals: { itemsCents: 2580, shippingCents: 495, totalCents: 3075, vatCents: 491, shippingLabel: 'Brief' },
        payment: { scope: 'gesamt', amountCents: 3075, status: 'offen' },
      }),
    ]);
    const [, erste, zweite] = csv.split('\r\n');
    expect(erste).toBe('SM24-B-2026-0001;24.10.2026;Bestellung;Schlüssel nach Code;Muster GmbH (Erika Muster);erika@example.org;2× Schlüssel MS 01;25,84;4,91;30,75;4,95;offen;');
    expect(zweite).toBe('SM24-T-2026-0002;25.10.2026;Termin;Autoschlüssel;Erika Muster;erika@example.org;Termin 2026-11-04 10:00;58,74;11,16;69,90;;bezahlt;pi_123');
    // Der Code (Sicherheitsmerkmal) steht nicht im Export.
    expect(csv).not.toContain('4711');
  });

  it('entschärft Formeln und setzt Anführungszeichen bei Trennzeichen', () => {
    expect(zelle('=HYPERLINK("http://boese")')).toBe('"\'=HYPERLINK(""http://boese"")"');
    expect(zelle('+49 123')).toBe("'+49 123");
    expect(zelle('-1')).toBe("'-1");
    expect(zelle('@SUMME(A1)')).toBe("'@SUMME(A1)");
    expect(zelle('Müller; Söhne')).toBe('"Müller; Söhne"');
    expect(zelle('Zeile 1\nZeile 2')).toBe('"Zeile 1\nZeile 2"');
    expect(zelle('normal')).toBe('normal');
    const csv = vorgaengeAlsCsv([vorgang({ contact: { firstName: '=1+1', lastName: 'X', email: '@a.de', phone: '1', country: 'Deutschland' } })]);
    expect(csv).toContain(";'=1+1 X;'@a.de;");
  });

  it('Beträge mit Komma, Tag in deutscher Zeit', () => {
    expect(betrag(123456)).toBe('1234,56');
    expect(betrag(5)).toBe('0,05');
    expect(betrag(undefined)).toBe('');
    expect(tagInBerlin('2026-12-31T23:30:00.000Z')).toBe('2027-01-01');
  });
});
