import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VorgangsAnlage } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { zylinderDetails } from '@/lib/cylinder-summary';
import { priceCylinderOrder } from '@/lib/pricing';
import { buildReference } from '@/lib/reference';
import type { BusinessRecord, CylinderOrderDraft } from '@/lib/types';

/* Eingaben aus dem Browser dürfen keine Beträge, Termine oder Bestellungen
 * setzen. Diese Tests rufen die öffentlichen Aktionen so auf, wie es ein
 * manipulierter Browser per direktem POST täte. */

const stored: BusinessRecord[] = [];
/** Simuliert eine veraltete Vorabprüfung: Termine sind zwischenzeitlich vergeben worden. */
const vorab = { veraltet: false };

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.7' }),
}));

vi.mock('@/lib/data', () => {
  class TerminVergebenFehler extends Error {}
  const termine = (von: string, bis: string) =>
    stored.filter(
      (r) => r.appointment && r.appointment.date >= von && r.appointment.date <= bis && r.status !== 'storniert',
    );
  return {
    TerminVergebenFehler,
    getSettings: async () => defaults.settings(),
    getCollection: async (name: keyof typeof defaults) => defaults[name](),
    getAppointments: async (von: string, bis: string) => (vorab.veraltet ? [] : termine(von, bis)),
    // Wie die Datenschicht: Termin unter Sperre frisch prüfen, dann Nummer vergeben.
    vorgangAnlegen: async ({ art, jahr, aufbauen, termin }: VorgangsAnlage) => {
      if (termin && !termin.istFrei(termine(termin.datum, termin.datum))) {
        throw new TerminVergebenFehler(termin.datum);
      }
      const nummer = buildReference(art, jahr, stored.length + 1);
      const record: BusinessRecord = { ...aufbauen(nummer), id: String(stored.length + 1), reference: nummer, kind: art };
      stored.unshift(record);
      return record;
    },
    updateRecord: async (id: string, patch: Partial<BusinessRecord>) => {
      const index = stored.findIndex((r) => r.id === id);
      if (index < 0) return null;
      stored[index] = { ...stored[index], ...patch };
      return stored[index];
    },
  };
});

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
  vorab.veraltet = false;
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

  describe('Terminvergabe', () => {
    const verify = {
      kind: 'autoschluessel' as const,
      makeSlug: 'volkswagen',
      modelSlug: 'golf',
      serviceId: 'zweitschluessel',
      keyKind: 'klappschluessel' as const,
      workingKeys: 1,
    };

    async function freiesFenster() {
      const { fetchQuote, fetchSlots } = await import('./booking');
      const quote = await fetchQuote(verify);
      const slots = await fetchSlots(quote.quote!.slotMinutes, quote.quote!.leadTimeDays);
      const slot = slots.days[0].slots.find((s) => s.available)!;
      return { date: slot.date, time: slot.time };
    }

    function buchen(appointment: { date: string; time: string }) {
      return submitRecord({
        kind: 'termin',
        area: 'autoschluessel',
        process: 'termin-mit-anzahlung',
        contact,
        payload: {},
        summary: [],
        uploads: [],
        appointment: { ...appointment, durationMinutes: 1, location: 'werkstatt' },
        verify,
      });
    }

    it('übernimmt den geprüften Termin, nicht die Angaben des Browsers', async () => {
      const wunsch = await freiesFenster();
      const result = await buchen(wunsch);
      expect(result.ok).toBe(true);
      expect(stored[0].appointment?.date).toBe(wunsch.date);
      expect(stored[0].appointment?.durationMinutes).not.toBe(1);
    });

    it('vergibt ein Zeitfenster nicht zweimal', async () => {
      const wunsch = await freiesFenster();
      expect((await buchen(wunsch)).ok).toBe(true);
      const zweite = await buchen(wunsch);
      expect(zweite.ok).toBe(false);
      expect(zweite.error).toContain('nicht mehr frei');
      expect(stored).toHaveLength(1);
    });

    it('prüft beim Anlegen erneut, auch wenn die Vorabprüfung veraltet ist', async () => {
      const wunsch = await freiesFenster();
      expect((await buchen(wunsch)).ok).toBe(true);
      vorab.veraltet = true;
      const zweite = await buchen(wunsch);
      expect(zweite.ok).toBe(false);
      expect(zweite.error).toContain('nicht mehr frei');
      expect(stored).toHaveLength(1);
    });
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

  it('lehnt Beispielartikel ab, auch wenn der Browser sie in den Warenkorb legt', async () => {
    const beispiel = defaults.standardArticles()[0];
    const result = await submitOrder({
      items: [
        {
          kind: 'standard',
          uid: 's',
          productId: beispiel.id,
          label: 'gefälscht',
          shippingClass: 'zubehoer',
          qty: 1,
          unitPriceCents: 1,
        },
      ],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: 1,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Beispielartikel');
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

  it('schreibt Positionen und Summen mit den Serverpreisen fest', async () => {
    const total = line.priceCents + shipping.priceCents;
    const result = await order(total);
    expect(result.ok).toBe(true);
    expect(stored[0].lines).toEqual([
      {
        kind: 'code-schluessel',
        productId: line.id,
        label: line.name,
        details: `Code ${line.codeExample}`,
        qty: 1,
        unitPriceCents: line.priceCents,
        totalCents: line.priceCents,
        vatPercent: 19,
      },
    ]);
    expect(stored[0].totals).toEqual({
      itemsCents: line.priceCents,
      shippingCents: shipping.priceCents,
      totalCents: total,
      vatCents: Math.round(total - total / 1.19),
      shippingLabel: shipping.label,
    });
  });

  it('schreibt Zylinder-Zusammenstellungen mit Maßen, Funktion und Schlüsseln fest', async () => {
    const catalog = defaults.cylinderCatalog();
    const draft: CylinderOrderDraft = {
      items: [
        { uid: 'a', form: 'doppelzylinder', measureAMm: 30, measureBMm: 35, functionId: 'not-gefahr', qty: 2 },
        { uid: 'b', form: 'halbzylinder', measureAMm: 30, qty: 1 },
      ],
      keyCount: 5,
      extraIds: [],
      expandable: true,
    };
    const versand = defaults.settings().shipping.find((s) => s.id === 'paket-versichert')!;
    const preis = priceCylinderOrder(draft, catalog).totalCents;
    const result = await submitOrder({
      items: [{ kind: 'zylinder-schliessung', uid: 'z', qty: 1, unitPriceCents: 1, draft }],
      shippingOptionId: versand.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: preis + versand.priceCents,
    });
    expect(result.ok).toBe(true);
    const [position] = stored[0].lines ?? [];
    expect(position).toMatchObject({
      kind: 'zylinder-schliessung',
      productId: 'zylinder-schliessung',
      qty: 1,
      unitPriceCents: preis,
      totalCents: preis,
    });
    expect(position.details).toBe(zylinderDetails(draft, catalog));
    expect(position.details).toContain('Gemeinsame Schlüssel: 5 Stück');
    expect(stored[0].totals?.shippingLabel).toBe(versand.label);
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
