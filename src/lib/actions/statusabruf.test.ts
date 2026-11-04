import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import type { BusinessRecord } from '@/lib/types';

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.9' }),
}));

let gespeichert: BusinessRecord[] = [];
vi.mock('@/lib/data', () => ({
  getSettings: async () => defaults.settings(),
  getCollection: async (name: keyof typeof defaults) => defaults[name](),
  getAppointments: async () => [],
  getRecordByReference: async (nummer: string) => gespeichert.find((r) => r.reference === nummer) ?? null,
}));

const { fetchRecordStatus } = await import('./booking');
const { resetRateLimits } = await import('@/lib/server/rate-limit');

function vorgang(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '1',
    reference: 'SM24-A-2026-0001',
    kind: 'anfrage',
    area: 'schluessel-nach-vorlage',
    process: 'gefuehrte-anfrage',
    status: 'neu',
    createdAt: '2026-11-04T08:00:00.000Z',
    updatedAt: '2026-11-04T08:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Test', email: 'pruefung@example.invalid', phone: '0170 1234567', country: 'Deutschland' },
    payload: { quelle: 'einsenden' },
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    ...teil,
  } as BusinessRecord;
}

beforeEach(() => {
  resetRateLimits();
  gespeichert = [];
});

describe('Statusabruf in einfacher Sprache (E6-OPUS-04)', () => {
  it('nennt den Status wie die Vorgangsseite und verweist bei der Anmeldung auf den Begleitschein', async () => {
    gespeichert = [vorgang()];
    const antwort = await fetchRecordStatus('SM24-A-2026-0001', ' Pruefung@Example.invalid ');
    expect(antwort.ok).toBe(true);
    if (!antwort.ok) return;
    expect(antwort.record).toMatchObject({ statusLabel: 'Angemeldet', statusText: expect.stringContaining('Begleitschein') });
    expect(antwort.record.statusHinweis).toContain('Vorgang und Begleitschein ansehen');
    expect(antwort.record.sendung).toBeUndefined();
  });

  it('zeigt die Sendung erst nach dem Versand und ohne weitere Angaben', async () => {
    gespeichert = [vorgang({ status: 'versendet', shipment: { carrier: 'dhl', trackingNumber: '00340434161094042557' } })];
    const antwort = await fetchRecordStatus('SM24-A-2026-0001', 'pruefung@example.invalid');
    if (!antwort.ok) throw new Error('nicht gefunden');
    expect(antwort.record.statusLabel).toBe('Versendet');
    expect(antwort.record.statusText).toContain('Original und die Kopien');
    expect(antwort.record.statusHinweis).toBeUndefined();
    expect(Object.keys(antwort.record.sendung ?? {}).sort()).toEqual(['dienstleister', 'link', 'nummer']);
    expect(antwort.record.sendung).toMatchObject({ dienstleister: 'DHL', nummer: '00340434161094042557' });
  });

  it('gibt bei falscher E-Mail-Adresse nichts heraus', async () => {
    gespeichert = [vorgang({ status: 'versendet', shipment: { carrier: 'dhl', trackingNumber: '1' } })];
    const antwort = await fetchRecordStatus('SM24-A-2026-0001', 'andere@example.invalid');
    expect(antwort.ok).toBe(false);
    expect(antwort).not.toHaveProperty('record');
  });
});
