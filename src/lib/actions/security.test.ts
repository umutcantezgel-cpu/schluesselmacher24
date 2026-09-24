import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import type { BusinessRecord } from '@/lib/types';

/* Eingaben aus dem Browser dürfen keine Beträge, Termine oder Bestellungen
 * setzen. Diese Tests rufen die öffentlichen Aktionen so auf, wie es ein
 * manipulierter Browser per direktem POST täte. */

const stored: BusinessRecord[] = [];

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.7' }),
}));

vi.mock('@/lib/data', () => ({
  getSettings: async () => defaults.settings(),
  getCollection: async (name: keyof typeof defaults) => defaults[name](),
  getRecords: async () => stored,
  appendRecord: async (record: BusinessRecord) => {
    stored.unshift(record);
    return record;
  },
}));

const { submitRecord } = await import('./records');
const { submitOrder } = await import('./orders');
const { resetRateLimits } = await import('@/lib/server/rate-limit');
const { createAccessToken, verifyAccessToken } = await import('@/lib/server/access-token');

const contact = {
  firstName: 'Erika',
  lastName: 'Muster',
  email: 'erika@example.org',
  phone: '0301234567',
  country: 'Deutschland',
};

beforeEach(() => {
  stored.length = 0;
  resetRateLimits();
});

describe('submitRecord', () => {
  it('übernimmt bei Anfragen keinen Betrag aus dem Browser', async () => {
    const result = await submitRecord({
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'gesamt', amountCents: 1, description: 'gefälscht' },
    });
    expect(result.ok).toBe(true);
    expect(stored[0].payment).toBeUndefined();
    expect(stored[0].quote).toBeUndefined();
  });

  it('lehnt Bestellungen außerhalb der Kasse ab', async () => {
    const result = await submitRecord({
      kind: 'bestellung',
      area: 'schluessel-nach-code',
      process: 'direktkauf',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'gesamt', amountCents: 1, description: 'gefälscht' },
    });
    expect(result.ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('verlangt für Termine die Prüfangaben', async () => {
    const result = await submitRecord({
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'anzahlung', amountCents: 1, description: 'gefälscht' },
    });
    expect(result.ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('setzt die Anzahlung für Termine selbst, egal was der Browser schickt', async () => {
    const settings = defaults.settings();
    const result = await submitRecord({
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'anzahlung', amountCents: 1, description: 'Anzahlung' },
      verify: {
        kind: 'autoschluessel',
        makeSlug: 'volkswagen',
        modelSlug: 'golf',
        serviceId: 'zweitschluessel',
        keyKind: 'klappschluessel',
        workingKeys: 1,
      },
    });
    expect(result.ok).toBe(true);
    const amount = stored[0].payment?.amountCents ?? 0;
    expect(amount).toBeGreaterThanOrEqual(settings.booking.depositMinCents);
    expect(amount).not.toBe(1);
  });

  it('lehnt ungültige Kontaktdaten ab', async () => {
    const result = await submitRecord({
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact: { ...contact, email: 'keine-adresse' },
      payload: {},
      summary: [],
      uploads: [],
    });
    expect(result.ok).toBe(false);
  });

  it('begrenzt die Anzahl der Anfragen je Adresse', async () => {
    const input = {
      kind: 'anfrage' as const,
      area: 'service-und-termin' as const,
      process: 'gefuehrte-anfrage' as const,
      contact,
      payload: {},
      summary: [],
      uploads: [],
    };
    for (let i = 0; i < 10; i += 1) {
      expect((await submitRecord(input)).ok).toBe(true);
    }
    expect((await submitRecord(input)).ok).toBe(false);
  });
});

describe('submitOrder', () => {
  const line = defaults.codeLines()[0];
  const shipping = defaults.settings().shipping.find((s) => s.productClasses.includes('code-schluessel'))!;

  function order(expectedTotalCents: number, shippingOptionId = shipping.id) {
    return submitOrder({
      items: [
        {
          kind: 'code-schluessel',
          uid: 'a',
          codeLineId: line.id,
          code: line.codeExample,
          qty: 1,
          unitPriceCents: 1,
          photoRefs: [],
        },
      ],
      shippingOptionId,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents,
    });
  }

  it('bestellt nur zum angezeigten Betrag und meldet eine Abweichung', async () => {
    const result = await order(1);
    expect(result.ok).toBe(false);
    expect(result.priceChanged?.expectedCents).toBe(1);
    expect(stored).toHaveLength(0);
  });

  it('rechnet mit dem Serverpreis und gibt einen Link-Schlüssel zurück', async () => {
    const total = line.priceCents + shipping.priceCents;
    const result = await order(total);
    expect(result.ok).toBe(true);
    expect(stored[0].payment?.amountCents).toBe(total);
    expect(result.accessToken).toBeTruthy();
    expect(verifyAccessToken(result.accessToken, stored[0].accessTokenHash)).toBe(true);
  });

  it('lehnt unbekannte Versandarten ab statt kostenlos zu versenden', async () => {
    const result = await order(line.priceCents, 'gibt-es-nicht');
    expect(result.ok).toBe(false);
  });

  it('lehnt nicht wählbare Zylindermaße ab', async () => {
    const result = await submitOrder({
      items: [
        {
          kind: 'zylinder-schliessung',
          uid: 'z',
          qty: 1,
          unitPriceCents: 1,
          draft: {
            items: [{ uid: 'p', form: 'doppelzylinder', measureAMm: 31, measureBMm: 35, qty: 1 }],
            keyCount: 3,
            extraIds: [],
            expandable: false,
          },
        },
      ],
      shippingOptionId: 'paket-versichert',
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: 0,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Maß A');
  });
});

describe('Link-Schlüssel', () => {
  it('passt nur zum eigenen Hash', () => {
    const a = createAccessToken();
    const b = createAccessToken();
    expect(verifyAccessToken(a.token, a.hash)).toBe(true);
    expect(verifyAccessToken(b.token, a.hash)).toBe(false);
    expect(verifyAccessToken(undefined, a.hash)).toBe(false);
    expect(verifyAccessToken('', a.hash)).toBe(false);
  });
});
