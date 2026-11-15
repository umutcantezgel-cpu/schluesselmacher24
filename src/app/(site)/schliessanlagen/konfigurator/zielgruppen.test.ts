import { describe, expect, it } from 'vitest';

import {
  CUSTOMER_TYPES,
  INITIAL,
  buildPayloadBase,
  buildSummary,
  recommend,
  validateStep,
  type ProjectData,
} from './projekt-konfigurator';

/** FA-16-06 und FA-16-09: Zielgruppen des Schließanlagen-Konfigurators. */
describe('Zielgruppen im Schließanlagen-Konfigurator', () => {
  it('nennt die Zielgruppe Gewerbe, der gespeicherte Wert bleibt unternehmen', () => {
    const gewerbe = CUSTOMER_TYPES.find((t) => t.value === 'unternehmen');
    expect(gewerbe?.title).toBe('Gewerbe');
    expect(CUSTOMER_TYPES.some((t) => t.title === 'Unternehmen')).toBe(false);
  });

  it('führt alle Zielgruppen der Vorgabe', () => {
    expect(CUSTOMER_TYPES.map((t) => t.title)).toEqual(
      expect.arrayContaining(['Privat', 'Gewerbe', 'Hausverwaltung', 'Öffentliche Einrichtung', 'Mehrere Liegenschaften']),
    );
  });

  it('verlangt bei mehreren Liegenschaften mindestens zwei und die Angabe zu übergreifenden Schlüsseln', () => {
    const basis: ProjectData = { ...INITIAL, customerType: 'mehrere-liegenschaften' };
    expect(validateStep({ ...basis, properties: 1, crossPropertyKeys: 'ja' }, 'objekt')).toBe(false);
    expect(validateStep({ ...basis, properties: 3, crossPropertyKeys: '' }, 'objekt')).toBe(false);
    expect(validateStep({ ...basis, properties: 3, crossPropertyKeys: 'ja' }, 'objekt')).toBe(true);
    // Andere Zielgruppen brauchen die Zusatzfrage nicht.
    expect(validateStep({ ...INITIAL, customerType: 'unternehmen' }, 'objekt')).toBe(true);
  });

  it('nennt die Zielgruppe und ihre Angaben in der Zusammenfassung', () => {
    const d: ProjectData = { ...INITIAL, customerType: 'mehrere-liegenschaften', properties: 4, crossPropertyKeys: 'ja' };
    const zusammenfassung = buildSummary(d, [], [], [], recommend(d));
    const kunde = zusammenfassung.find((s) => s.title === '1. Kundentyp');
    const zeilen = Object.fromEntries((kunde?.rows ?? []).map((r) => [r.label, r.value]));
    expect(zeilen['Art des Auftraggebers']).toBe('Mehrere Liegenschaften');
    expect(zeilen['Übergreifende Schlüssel']).toMatch(/mehrere Liegenschaften öffnen/);
    // Die Anzahl steht nur einmal, im Block Objekt.
    const alle = zusammenfassung.flatMap((s) => s.rows.map((r) => r.label));
    expect(alle.filter((l) => /Liegenschaften$/.test(l))).toEqual(['Liegenschaften']);
    const objekt = zusammenfassung.find((s) => s.title === '2. Objekt');
    expect(objekt?.rows).toContainEqual({ label: 'Liegenschaften', value: '4' });
  });

  it('sendet übergreifende Schlüssel nur bei mehreren Liegenschaften mit', () => {
    const alt: ProjectData = { ...INITIAL, customerType: 'unternehmen', crossPropertyKeys: 'ja' };
    expect(buildPayloadBase(alt).crossPropertyKeys).toBe('');
    const mehrere: ProjectData = { ...INITIAL, customerType: 'mehrere-liegenschaften', properties: 3, crossPropertyKeys: 'ja' };
    expect(buildPayloadBase(mehrere).crossPropertyKeys).toBe('ja');
  });

  it('zeigt ältere Vorgänge mit unternehmen als Gewerbe', () => {
    const d: ProjectData = { ...INITIAL, customerType: 'unternehmen' };
    const kunde = buildSummary(d, [], [], [], recommend(d)).find((s) => s.title === '1. Kundentyp');
    expect(kunde?.rows[0]).toEqual({ label: 'Art des Auftraggebers', value: 'Gewerbe' });
    expect(kunde?.rows.some((r) => r.label === 'Übergreifende Schlüssel')).toBe(false);
  });
});
