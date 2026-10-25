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
  class ZuVieleOffeneTermineFehler extends Error {}
  // Wie die Abfrage in vorgangAnlegen: offene, unbezahlte Termine je E-Mail-Adresse.
  const offene = (email: string, ab: string) =>
    stored.filter(
      (r) =>
        r.kind === 'termin'
        && r.contact.email.toLowerCase() === email.toLowerCase()
        && !['storniert', 'abgeschlossen'].includes(r.status)
        && (r.payment?.status === 'offen' || r.payment?.status === 'fehlgeschlagen')
        && (r.appointment?.date ?? '') >= ab,
    ).length;
  const termine = (von: string, bis: string) =>
    stored.filter(
      (r) => r.appointment && r.appointment.date >= von && r.appointment.date <= bis && r.status !== 'storniert',
    );
  return {
    TerminVergebenFehler,
    ZuVieleOffeneTermineFehler,
    getSettings: async () => defaults.settings(),
    getCollection: async (name: keyof typeof defaults) => defaults[name](),
    getAppointments: async (von: string, bis: string) => (vorab.veraltet ? [] : termine(von, bis)),
    // Wie die Datenschicht: Termin unter Sperre frisch prüfen, dann Nummer vergeben.
    vorgangAnlegen: async ({ art, jahr, aufbauen, termin }: VorgangsAnlage) => {
      if (termin?.kunde && offene(termin.kunde.email, termin.kunde.abDatum) >= termin.kunde.hoechstensOffen) {
        throw new ZuVieleOffeneTermineFehler();
      }
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
    vorgangAendern: async (id: string, aendern: (r: BusinessRecord) => Partial<BusinessRecord> | null) => {
      const index = stored.findIndex((r) => r.id === id);
      if (index < 0) return null;
      const aenderung = aendern(stored[index]);
      if (aenderung) stored[index] = { ...stored[index], ...aenderung };
      return stored[index];
    },
  };
});

const aktionen = { ...(await import('./records')), ...(await import('./orders')) };
const { resetRateLimits } = await import('@/lib/server/rate-limit');
const { createAccessToken, verifyAccessToken } = await import('@/lib/server/access-token');
const { startSignieren } = await import('@/lib/server/formular-schutz');
const { SCHUTZ_ERNEUERT } = await import('@/lib/formular-schutz');

/** Wie aus dem Browser: Formular vor 10 Sekunden geöffnet, Honigtopf leer. */
const schutz = () => ({ start: startSignieren(Date.now() - 10_000), website: '' });

type RecordEingabe = Parameters<typeof aktionen.submitRecord>[0];
type OrderEingabe = Parameters<typeof aktionen.submitOrder>[0];
const submitRecord = (input: RecordEingabe) => aktionen.submitRecord({ schutz: schutz(), ...input });
const submitOrder = (input: OrderEingabe) => aktionen.submitOrder({ schutz: schutz(), ...input });

const contact = {
  firstName: 'Erika',
  lastName: 'Muster',
  email: 'erika@example.org',
  phone: '0301234567',
  street: 'Musterweg 1',
  postalCode: '35576',
  city: 'Wetzlar',
  country: 'Deutschland',
};

/** Pflicht-Zustimmungen des Termin-Assistenten. */
const zustimmungen = { terms: true, deposit: true, authorization: true, earlyStart: true };

/** Ohne Dateiablage (Tests) genügt die Angabe der ausgewählten Datei. */
const fahrzeugschein = { fileName: 'fahrzeugschein.jpg', sizeBytes: 120_000, mimeType: 'image/jpeg', category: 'fahrzeugschein' as const };

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
      uploads: [fahrzeugschein],
      payment: { scope: 'anzahlung', amountCents: 1, description: 'Anzahlung' },
      verify: {
        kind: 'autoschluessel',
        makeSlug: 'volkswagen',
        modelSlug: 'golf',
        serviceId: 'zweitschluessel',
        keyKind: 'klappschluessel',
        workingKeys: 1,
      },
      consents: zustimmungen,
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

    function buchen(appointment: { date: string; time: string }, anpassen: Partial<RecordEingabe> = {}) {
      return submitRecord({
        kind: 'termin',
        area: 'autoschluessel',
        process: 'termin-mit-anzahlung',
        contact,
        payload: {},
        summary: [],
        uploads: [fahrzeugschein],
        appointment: { ...appointment, durationMinutes: 1, location: 'werkstatt' },
        verify,
        consents: zustimmungen,
        ...anpassen,
      });
    }

    async function freieFenster(anzahl: number) {
      const { fetchQuote, fetchSlots } = await import('./booking');
      const quote = await fetchQuote(verify);
      const slots = await fetchSlots(quote.quote!.slotMinutes, quote.quote!.leadTimeDays);
      // Je Tag ein Fenster — so überschneiden sich die Termine nicht.
      return slots.days.slice(0, anzahl).map((tag) => {
        const slot = tag.slots.find((s) => s.available)!;
        return { date: slot.date, time: slot.time };
      });
    }

    it('speichert die Zustimmungen mit Zeitpunkt und Fassung der Rechtstexte', async () => {
      const result = await buchen(await freiesFenster());
      expect(result.ok).toBe(true);
      expect(stored[0].consents).toMatchObject({ terms: true, withdrawalNotice: true, deposit: true, authorization: true, earlyStart: true });
      expect(stored[0].consents?.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Date.parse(stored[0].consents?.at ?? '')).not.toBeNaN();
    });

    it.each([
      ['ohne Zustimmungen', undefined],
      ['ohne vorzeitigen Beginn', { ...zustimmungen, earlyStart: false }],
      ['ohne AGB', { ...zustimmungen, terms: false }],
      ['ohne Berechtigung', { ...zustimmungen, authorization: false }],
    ])('lehnt Termine %s ab', async (_name, consents) => {
      const result = await buchen(await freiesFenster(), { consents });
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Anzahlung');
      expect(stored).toHaveLength(0);
    });

    it('lässt höchstens zwei offene, unbezahlte Termine je E-Mail-Adresse zu', async () => {
      const [a, b, c] = await freieFenster(3);
      expect((await buchen(a)).ok).toBe(true);
      expect((await buchen(b, { contact: { ...contact, email: 'ERIKA@example.org' } })).ok).toBe(true);
      const dritte = await buchen(c);
      expect(dritte.ok).toBe(false);
      expect(dritte.error).toContain('Anzahlung noch aussteht');
      // Eine andere Adresse darf weiter buchen.
      expect((await buchen(c, { contact: { ...contact, email: 'max@example.org' } })).ok).toBe(true);
    });

    it('setzt Leistung, Marke und Modell aus den Stammdaten, nicht aus der Zusammenfassung des Browsers', async () => {
      const make = defaults.vehicleMakes().find((m) => m.slug === 'volkswagen')!;
      const model = make.models.find((m) => m.slug === 'golf')!;
      const result = await buchen(await freiesFenster(), {
        summary: [
          {
            title: 'Fahrzeug',
            rows: [
              { label: 'Marke', value: 'Ferrari' },
              { label: 'Modell', value: 'Enzo' },
              { label: 'Baujahr / Erstzulassung', value: '2015' },
            ],
          },
          {
            title: 'Schlüssel und Leistung',
            rows: [
              { label: 'Schlüsselart', value: 'Klappschlüssel' },
              { label: 'Gewünschte Leistung', value: '2 Funkschlüssel inkl. Anlernen' },
            ],
          },
        ],
      });
      expect(result.ok).toBe(true);
      const summary = stored[0].summary;
      expect(summary[0].rows).toEqual([
        { label: 'Gewünschte Leistung', value: 'Zweitschlüssel anfertigen' },
        { label: 'Marke', value: make.name },
        { label: 'Modell', value: model.name },
      ]);
      const zeilen = summary.flatMap((abschnitt) => abschnitt.rows);
      expect(zeilen.map((z) => z.value)).not.toContain('2 Funkschlüssel inkl. Anlernen');
      expect(zeilen.map((z) => z.value)).not.toContain('Ferrari');
      expect(zeilen).toContainEqual({ label: 'Baujahr / Erstzulassung', value: '2015' });

      // Die Vertragsbestätigung liest dieselben Zeilen.
      const { vertragsbestaetigung } = await import('@/lib/mail/vorlagen/vertragsbestaetigung');
      const mail = vertragsbestaetigung({
        vorgang: stored[0],
        kontext: { site: 'https://schluesselmacher24.de' },
        settings: defaults.settings(),
        zahlarten: null,
      });
      expect(mail.text).toContain('Leistung: Zweitschlüssel anfertigen');
      expect(mail.text).toContain(`Fahrzeug: ${make.name} ${model.name}`);
      expect(mail.text).not.toContain('Funkschlüssel inkl. Anlernen');
    });

    it('behält ein Modell außerhalb der Liste nur als Angabe des Kunden', async () => {
      const result = await buchen(await freiesFenster(), {
        verify: { ...verify, modelSlug: null },
        summary: [{ title: 'Fahrzeug', rows: [{ label: 'Modell', value: 'Golf Country (nicht in der Liste aufgeführt)' }] }],
      });
      expect(result.ok).toBe(true);
      const zeilen = stored[0].summary.flatMap((abschnitt) => abschnitt.rows);
      expect(zeilen.filter((z) => z.label === 'Modell')).toEqual([]);
      expect(zeilen).toContainEqual({ label: 'Modell (Angabe des Kunden)', value: 'Golf Country (nicht in der Liste aufgeführt)' });
    });

    it('lehnt Termine ohne Fahrzeugschein ab — auch mit Schlüsselfotos', async () => {
      const schluesselfoto = { ...fahrzeugschein, fileName: 'schluessel.jpg', category: 'schluesselfoto' as const };
      const ohne = await buchen(await freiesFenster(), { uploads: [schluesselfoto] });
      expect(ohne.ok).toBe(false);
      expect(ohne.error).toContain('Zulassungsbescheinigung Teil I');
      expect(stored).toHaveLength(0);
    });

    it('bucht bei Totalverlust ohne Schlüsselfotos, nur mit Fahrzeugschein', async () => {
      const result = await buchen(await freiesFenster(), { verify: { ...verify, workingKeys: 0 }, uploads: [fahrzeugschein] });
      expect(result.ok).toBe(true);
      expect(stored[0].uploads.map((u) => u.category)).toEqual(['fahrzeugschein']);
    });

    it('legt online gebuchte Termine in der Werkstatt an — auch mit Fahrzeug', async () => {
      const result = await buchen(await freiesFenster(), { appointment: { ...(await freiesFenster()), durationMinutes: 1, location: 'vor-ort' } });
      expect(result.ok).toBe(true);
      expect(stored[0].quote?.requiresVehicleOnSite).toBe(true);
      expect(stored[0].appointment?.location).toBe('werkstatt');
    });

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

  it('begrenzt Preis- und Terminabfragen je Adresse', async () => {
    const { fetchQuote, fetchSlots } = await import('./booking');
    const anfrage = { makeSlug: 'volkswagen', modelSlug: 'golf', serviceId: 'zweitschluessel', keyKind: 'klappschluessel' as const, workingKeys: 1 };
    for (let i = 0; i < 60; i += 1) expect((await fetchQuote(anfrage)).ok).toBe(true);
    expect(await fetchQuote(anfrage)).toMatchObject({ ok: false, error: expect.stringContaining('Zu viele Anfragen') });
    for (let i = 0; i < 60; i += 1) expect((await fetchSlots(60, 7, 1)).error).toBeUndefined();
    expect((await fetchSlots(60, 7, 1)).error).toContain('Zu viele Anfragen');
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

  it('speichert die Zustimmungen und verlangt die Anfertigungs-Bestätigung nur bei Sonderanfertigungen', async () => {
    const total = line.priceCents + shipping.priceCents;
    const ohne = await submitOrder({
      items: [{ kind: 'code-schluessel', uid: 'a', codeLineId: line.id, code: line.codeExample, qty: 1, unitPriceCents: 1, photoRefs: [] }],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: false,
      expectedTotalCents: total,
    });
    expect(ohne.ok).toBe(false);
    expect(ohne.error).toContain('Anfertigung');
    expect(stored).toHaveLength(0);

    expect((await order(total)).ok).toBe(true);
    expect(stored[0].consents).toMatchObject({ terms: true, withdrawalNotice: true, customMade: true });
  });

  it('liefert nur nach Deutschland und prüft die Postleitzahl', async () => {
    const total = line.priceCents + shipping.priceCents;
    const mit = (kontakt: typeof contact) =>
      submitOrder({
        items: [{ kind: 'code-schluessel', uid: 'a', codeLineId: line.id, code: line.codeExample, qty: 1, unitPriceCents: 1, photoRefs: [] }],
        shippingOptionId: shipping.id,
        contact: kontakt,
        acceptedTerms: true,
        acceptedCustomMade: true,
        expectedTotalCents: total,
      });
    const ausland = await mit({ ...contact, country: 'Österreich', postalCode: '1010' });
    expect(ausland.ok).toBe(false);
    expect(ausland.error).toContain('nur nach Deutschland');
    expect((await mit({ ...contact, postalCode: '3557' })).ok).toBe(false);
    expect((await mit({ ...contact, street: '' })).ok).toBe(false);
    expect(stored).toHaveLength(0);
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

describe('Bot-Schutz', () => {
  const anfrage = {
    kind: 'anfrage' as const,
    area: 'service-und-termin' as const,
    process: 'gefuehrte-anfrage' as const,
    contact,
    payload: {},
    summary: [],
    uploads: [],
  };

  const bestellung = (schutz: Record<string, string>) =>
    aktionen.submitOrder({
      items: [],
      shippingOptionId: 'x',
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: 0,
      schutz,
    });

  it('antwortet beim ausgefüllten Honigtopf still wie bei Erfolg, speichert aber nichts', async () => {
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const honig = { start: startSignieren(Date.now() - 10_000), website: 'https://spam.example' };
    const result = await aktionen.submitRecord({ ...anfrage, schutz: honig });
    expect(result.ok).toBe(true);
    expect(result.reference).toMatch(/^SM24-A-\d{4}-\d{4}$/);
    expect(result.schutzNeu).toBeUndefined();
    expect((await bestellung(honig)).ok).toBe(true);
    expect(stored).toHaveLength(0);
    expect(warnung).toHaveBeenCalledWith(expect.stringContaining('honigtopf'));
    warnung.mockRestore();
  });

  it.each([
    ['zu schnell (1 s)', () => ({ start: startSignieren(Date.now() - 1_000), website: '' })],
    ['älter als 24 Stunden', () => ({ start: startSignieren(Date.now() - 25 * 60 * 60 * 1000), website: '' })],
    ['ohne Startzeitpunkt', () => ({})],
    ['mit gefälschter Signatur', () => ({ start: `${Date.now() - 10_000}.${'A'.repeat(43)}` })],
  ])('meldet bei „%s“ einen wiederholbaren Fehler statt einer Schein-Nummer', async (_name, falsch) => {
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await aktionen.submitRecord({ ...anfrage, schutz: falsch() });
    expect(result).toMatchObject({ ok: false, schutzNeu: true, error: SCHUTZ_ERNEUERT });
    expect(result.reference).toBeUndefined();

    const order = await bestellung(falsch());
    expect(order).toMatchObject({ ok: false, schutzNeu: true, error: SCHUTZ_ERNEUERT });
    expect(order.reference).toBeUndefined();
    expect(stored).toHaveLength(0);
    expect(warnung).toHaveBeenCalledWith(expect.stringContaining('[bot-schutz]'));
    warnung.mockRestore();

    // Zweiter Versuch mit frischem Startzeitpunkt geht durch.
    expect((await aktionen.submitRecord({ ...anfrage, schutz: schutz() })).ok).toBe(true);
    expect(stored).toHaveLength(1);
  });

  it('nimmt gültige Formulare an', async () => {
    expect((await aktionen.submitRecord({ ...anfrage, schutz: schutz() })).ok).toBe(true);
    expect(stored).toHaveLength(1);
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
