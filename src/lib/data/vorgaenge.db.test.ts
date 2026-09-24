import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';
import { submitOrder } from '@/lib/actions/orders';
import { fetchQuote, fetchSlots } from '@/lib/actions/booking';
import { submitRecord } from '@/lib/actions/records';
import { buildReference } from '@/lib/reference';
import { createRecord, type TrustedRecordInput } from '@/lib/server/create-record';
import { resetRateLimits } from '@/lib/server/rate-limit';
import type { PriceQuote } from '@/lib/types';
import {
  TerminVergebenFehler,
  getAppointments,
  getRecord,
  getRecordByReference,
  getSettings,
  updateRecord,
  vorgangAnlegen,
  type NeuerVorgang,
} from './index';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Vorgänge
 * werden atomar angelegt — lückenlose Nummern, kein Termin doppelt, Positionen
 * festgeschrieben, Artikel mit Bestellbezug nicht endgültig löschbar. */

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '198.51.100.24' }),
}));

let payload: Payload;
const context = { disableRevalidate: true };

const contact = {
  firstName: 'Erika',
  lastName: 'Muster',
  email: 'erika@example.org',
  phone: '0301234567',
  country: 'Deutschland',
};

function anfrage(overrides: Partial<NeuerVorgang> = {}): () => NeuerVorgang {
  return () => {
    const jetzt = new Date().toISOString();
    return {
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      status: 'neu',
      createdAt: jetzt,
      updatedAt: jetzt,
      contact,
      payload: {},
      summary: [],
      uploads: [],
      internalNotes: [],
      timeline: [],
      ...overrides,
    };
  };
}

async function zaehlerstand(schluessel: string): Promise<number> {
  const db = (payload.db as unknown as { drizzle: { execute: (q: ReturnType<typeof sql>) => Promise<{ rows: { wert: number }[] }> } }).drizzle;
  const { rows } = await db.execute(sql`SELECT wert FROM sm24_zaehler WHERE schluessel = ${schluessel}`);
  return rows[0]?.wert ?? 0;
}

async function nummernMitPraefix(praefix: string): Promise<string[]> {
  const { docs } = await payload.find({
    collection: 'vorgaenge',
    where: { nummer: { like: praefix } },
    pagination: false,
    depth: 0,
  });
  return docs.map((d) => d.nummer).filter((n) => n.startsWith(praefix)).sort();
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

beforeEach(() => {
  resetRateLimits();
});

describe('Vorgangsnummern', () => {
  it('vergibt lückenlos und je Art und Jahr getrennt', async () => {
    const nummern: string[] = [];
    for (const [art, jahr] of [
      ['anfrage', 2091],
      ['anfrage', 2091],
      ['projekt', 2091],
      ['anfrage', 2092],
      ['anfrage', 2091],
    ] as const) {
      nummern.push((await vorgangAnlegen({ art, jahr, aufbauen: anfrage() })).reference);
    }
    expect(nummern).toEqual([
      'SM24-A-2091-0001',
      'SM24-A-2091-0002',
      'SM24-P-2091-0001',
      'SM24-A-2092-0001',
      'SM24-A-2091-0003',
    ]);
    expect(await zaehlerstand('A-2091')).toBe(3);
  });

  it('vergibt die Kennung in der Datenbank und findet Vorgänge gezielt wieder', async () => {
    const angelegt = await vorgangAnlegen({ art: 'anfrage', jahr: 2090, aufbauen: anfrage() });
    expect(angelegt.id).toMatch(/^\d+$/);
    expect((await getRecord(angelegt.id))?.reference).toBe(angelegt.reference);
    expect((await getRecordByReference(` ${angelegt.reference.toLowerCase()} `))?.id).toBe(angelegt.id);
    expect(await getRecord('sm24-a-2090-0001')).toBeNull();
    expect(await getRecord('999999999')).toBeNull();
    expect(await getRecordByReference('SM24-A-2090-9999')).toBeNull();
  });

  it('vergibt bei 5 gleichzeitigen Anlagen 5 verschiedene, fortlaufende Nummern', async () => {
    const angelegt = await Promise.all(
      Array.from({ length: 5 }, () => vorgangAnlegen({ art: 'anfrage', jahr: 2093, aufbauen: anfrage() })),
    );
    expect(angelegt.map((r) => r.reference).sort()).toEqual([1, 2, 3, 4, 5].map((n) => buildReference('anfrage', 2093, n)));
    expect(new Set(angelegt.map((r) => r.id)).size).toBe(5);
    expect(await zaehlerstand('A-2093')).toBe(5);
  });

  it('verbraucht bei einem Abbruch keine Nummer', async () => {
    await vorgangAnlegen({ art: 'anfrage', jahr: 2094, aufbauen: anfrage() });

    // Abbruch nach dem Hochzählen im eigenen Code …
    await expect(
      vorgangAnlegen({
        art: 'anfrage',
        jahr: 2094,
        aufbauen: () => {
          throw new Error('Abbruch beim Aufbauen');
        },
      }),
    ).rejects.toThrow('Abbruch beim Aufbauen');
    // … und in Payload (Prüfung beim Speichern schlägt fehl).
    await expect(
      vorgangAnlegen({
        art: 'anfrage',
        jahr: 2094,
        aufbauen: anfrage({ contact: { ...contact, email: 'keine-adresse' } }),
      }),
    ).rejects.toThrow();
    expect(await zaehlerstand('A-2094')).toBe(1);

    const weiter = await vorgangAnlegen({ art: 'anfrage', jahr: 2094, aufbauen: anfrage() });
    expect(weiter.reference).toBe('SM24-A-2094-0002');
    expect(await nummernMitPraefix('SM24-A-2094-')).toEqual(['SM24-A-2094-0001', 'SM24-A-2094-0002']);
  });

  it('bleibt lückenlos, wenn gleichzeitige Anlagen teils scheitern', async () => {
    const kaputt = anfrage({ contact: { ...contact, email: 'keine-adresse' } });
    const ergebnisse = await Promise.allSettled(
      [anfrage(), kaputt, anfrage(), kaputt, anfrage()].map((aufbauen) =>
        vorgangAnlegen({ art: 'projekt', jahr: 2095, aufbauen }),
      ),
    );
    expect(ergebnisse.filter((e) => e.status === 'rejected')).toHaveLength(2);
    expect(await nummernMitPraefix('SM24-P-2095-')).toEqual([
      'SM24-P-2095-0001',
      'SM24-P-2095-0002',
      'SM24-P-2095-0003',
    ]);
    expect(await zaehlerstand('P-2095')).toBe(3);
  });
});

describe('Termine', () => {
  const verify = {
    kind: 'autoschluessel' as const,
    makeSlug: 'volkswagen',
    modelSlug: 'golf',
    serviceId: 'zweitschluessel',
    keyKind: 'klappschluessel' as const,
    workingKeys: 1,
  };

  async function angebot(): Promise<PriceQuote> {
    const antwort = await fetchQuote(verify);
    expect(antwort.ok).toBe(true);
    return antwort.quote!;
  }

  async function freiesFenster(quote: PriceQuote) {
    const { days } = await fetchSlots(quote.slotMinutes, quote.leadTimeDays);
    const slot = days.flatMap((d) => d.slots).find((s) => s.available);
    expect(slot).toBeDefined();
    return { date: slot!.date, time: slot!.time };
  }

  function buchen(wunsch: { date: string; time: string }) {
    return submitRecord({
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      appointment: { ...wunsch, durationMinutes: 45, location: 'werkstatt' },
      verify,
    });
  }

  it('bucht bei zwei gleichzeitigen Anfragen dasselbe Zeitfenster genau einmal', async () => {
    const wunsch = await freiesFenster(await angebot());
    const [a, b] = await Promise.all([buchen(wunsch), buchen(wunsch)]);

    expect([a.ok, b.ok].filter(Boolean)).toHaveLength(1);
    const abgelehnt = a.ok ? b : a;
    expect(abgelehnt.error).toContain('nicht mehr frei');

    const belegt = (await getAppointments(wunsch.date, wunsch.date)).filter(
      (r) => r.appointment?.time === wunsch.time,
    );
    expect(belegt).toHaveLength(1);
    // Das belegte Fenster wird nicht mehr angeboten.
    const { days } = await fetchSlots(belegt[0].appointment!.durationMinutes, belegt[0].quote?.leadTimeDays);
    const fenster = days.flatMap((d) => d.slots).find((s) => s.date === wunsch.date && s.time === wunsch.time);
    expect(fenster?.available ?? false).toBe(false);
  });

  it('prüft unter Sperre, auch ohne Vorabprüfung — und verbraucht dabei keine Nummer', async () => {
    const quote = await angebot();
    const wunsch = await freiesFenster(quote);
    const jahr = new Date().getFullYear();
    const vorher = await zaehlerstand(`T-${jahr}`);

    const input: TrustedRecordInput = {
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      quote,
      appointment: { ...wunsch, durationMinutes: quote.slotMinutes, location: 'werkstatt' },
      payment: { scope: 'anzahlung', amountCents: quote.depositCents, description: 'Anzahlung' },
    };
    const ergebnisse = await Promise.all([createRecord(input), createRecord(input), createRecord(input)]);

    const erfolgreich = ergebnisse.filter((e) => e.ok);
    expect(erfolgreich).toHaveLength(1);
    expect(ergebnisse.filter((e) => !e.ok).every((e) => e.error?.includes('nicht mehr frei'))).toBe(true);
    expect(erfolgreich[0].reference).toBe(buildReference('termin', jahr, vorher + 1));
    expect(await zaehlerstand(`T-${jahr}`)).toBe(vorher + 1);

    // Zahlung wird mit der endgültigen Kennung gestartet und festgehalten.
    const gespeichert = await getRecord(erfolgreich[0].recordId!);
    expect(gespeichert?.payment).toMatchObject({ scope: 'anzahlung', amountCents: quote.depositCents, status: 'offen' });
    expect(gespeichert?.timeline.map((t) => t.message)).toContain('Zahlung offen: kein Zahlungsdienstleister angebunden.');
  });

  it('meldet einen belegten Termin als eigenen Fehler und gibt stornierte Fenster wieder frei', async () => {
    const quote = await angebot();
    const wunsch = await freiesFenster(quote);
    const termin = {
      datum: wunsch.date,
      istFrei: (tag: { appointment?: { time: string } }[]) => !tag.some((r) => r.appointment?.time === wunsch.time),
    };
    const aufbauen = anfrage({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      appointment: { ...wunsch, durationMinutes: quote.slotMinutes, location: 'werkstatt' },
    });

    const erster = await vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen, termin });
    await expect(vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen, termin })).rejects.toBeInstanceOf(
      TerminVergebenFehler,
    );

    await updateRecord(erster.id, { status: 'storniert' });
    const zweiter = await vorgangAnlegen({ art: 'termin', jahr: 2096, aufbauen, termin });
    expect(zweiter.reference).toBe('SM24-T-2096-0002');
  });
});

describe('Bestellungen', () => {
  /** Angelegte Testartikel — danach in den Papierkorb, damit andere Tests den Shop unverändert sehen. */
  const angelegt: number[] = [];

  afterAll(async () => {
    for (const id of angelegt) {
      await payload
        .update({ collection: 'produkte', id, data: { deletedAt: new Date().toISOString() }, trash: true, context })
        .catch(() => undefined);
    }
  });

  const artikel = {
    typ: 'code_key' as const,
    beschreibung: 'Testartikel für Bestellungen',
    maxMenge: 10,
    versandklasse: 'code-schluessel' as const,
    codeFormat: '4 Ziffern',
    codeMuster: '^[0-9]{4}$',
    codeBeispiel: '1234',
    _status: 'published' as const,
  };

  async function bestellen(kennung: string, qty: number, einzelCent: number) {
    const settings = await getSettings();
    const versand = settings.shipping.find((s) => s.productClasses.includes('code-schluessel'))!;
    const ergebnis = await submitOrder({
      items: [{ kind: 'code-schluessel', uid: 'a', codeLineId: kennung, code: '0812', qty, unitPriceCents: 1, photoRefs: [] }],
      shippingOptionId: versand.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: qty * einzelCent + versand.priceCents,
    });
    return { ergebnis, versand };
  }

  it('schreibt Positionen fest — spätere Preis- und Namensänderungen ändern die Bestellung nicht', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...artikel, name: 'Schnappschuss', slug: 'test-schnappschuss', preis: 12.5 },
      context,
    });
    angelegt.push(doc.id);
    const { ergebnis, versand } = await bestellen('test-schnappschuss', 2, 1250);
    expect(ergebnis.ok).toBe(true);
    expect(ergebnis.reference).toMatch(/^SM24-B-\d{4}-\d{4}$/);

    await payload.update({
      collection: 'produkte',
      id: doc.id,
      data: { preis: 99, name: 'Umbenannt' },
      context,
    });

    const gespeichert = await getRecord(ergebnis.recordId!);
    expect(gespeichert?.lines).toEqual([
      {
        kind: 'code-schluessel',
        productId: 'test-schnappschuss',
        label: 'Schnappschuss',
        details: 'Code 0812',
        qty: 2,
        unitPriceCents: 1250,
        totalCents: 2500,
        vatPercent: 19,
      },
    ]);
    expect(gespeichert?.totals).toMatchObject({
      itemsCents: 2500,
      shippingCents: versand.priceCents,
      totalCents: 2500 + versand.priceCents,
      shippingLabel: versand.label,
    });
    expect(gespeichert?.payment?.amountCents).toBe(2500 + versand.priceCents);
  });

  it('sperrt das endgültige Löschen von Artikeln mit Bestellbezug, der Papierkorb bleibt möglich', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...artikel, name: 'Gesperrt', slug: 'test-loeschsperre', preis: 8 },
      context,
    });
    angelegt.push(doc.id);
    expect((await bestellen('test-loeschsperre', 1, 800)).ergebnis.ok).toBe(true);

    await expect(
      payload.delete({ collection: 'produkte', id: doc.id, trash: true, context }),
    ).rejects.toMatchObject({ status: 409, message: expect.stringContaining('in Bestellungen') });

    // Papierkorb = deletedAt setzen.
    await payload.update({ collection: 'produkte', id: doc.id, data: { deletedAt: new Date().toISOString() }, context });
    const imPapierkorb = await payload.findByID({ collection: 'produkte', id: doc.id, trash: true, depth: 0 });
    expect(imPapierkorb.deletedAt).toBeTruthy();

    // Auch aus dem Papierkorb nicht endgültig, auch nicht über eine Mehrfachlöschung.
    await expect(
      payload.delete({ collection: 'produkte', id: doc.id, trash: true, context }),
    ).rejects.toThrow(/in Bestellungen/);
    const mehrfach = await payload.delete({
      collection: 'produkte',
      where: { id: { equals: doc.id } },
      trash: true,
      context,
    });
    expect(mehrfach.docs).toHaveLength(0);
    expect(mehrfach.errors).toHaveLength(1);
    expect(await payload.findByID({ collection: 'produkte', id: doc.id, trash: true, depth: 0 })).toBeTruthy();
  });

  it('löscht Artikel ohne Bestellbezug weiterhin endgültig', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...artikel, name: 'Ohne Bestellung', slug: 'test-ohne-bestellung', preis: 5 },
      context,
    });
    await payload.delete({ collection: 'produkte', id: doc.id, trash: true, context });
    const weg = await payload.findByID({
      collection: 'produkte',
      id: doc.id,
      trash: true,
      depth: 0,
      disableErrors: true,
    });
    expect(weg).toBeNull();
  });
});
