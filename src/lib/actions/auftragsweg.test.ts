import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VorgangsAnlage } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { buildReference } from '@/lib/reference';
import type { BusinessRecord } from '@/lib/types';

/* FA-KERN-03, A-049: Der Server setzt Auftragsweg und Zahlungsumfang selbst. Diese Tests rufen
 * `submitRecord` so auf, wie es ein Browser (auch ein manipulierter) täte. Partner und Schalter
 * kommen aus `partner`, der Rest der Datenschicht wie in security.test.ts aus den Standardwerten. */

const stored: BusinessRecord[] = [];
const partner = {
  aktiv: false,
  liste: [] as Array<{ id: string; status: 'freigeschaltet' | 'pausiert'; postleitzahlen: string[]; auftragsarten: string[] }>,
};

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.9' }),
}));

vi.mock('@/lib/data', () => {
  class TerminVergebenFehler extends Error {}
  class ZuVieleOffeneTermineFehler extends Error {}
  const termine = (von: string, bis: string) =>
    stored.filter((r) => r.appointment && r.appointment.date >= von && r.appointment.date <= bis && r.status !== 'storniert');
  return {
    TerminVergebenFehler,
    ZuVieleOffeneTermineFehler,
    getSettings: async () => defaults.settings(),
    getCollection: async (name: keyof typeof defaults) => defaults[name](),
    getRubrik: async (id: string) => defaults.rubriken().find((x) => x.id === id) ?? null,
    getAppointments: async (von: string, bis: string) => termine(von, bis),
    getRecordByReference: async (nummer: string) => stored.find((r) => r.reference === nummer) ?? null,
    vorgangAnlegen: async ({ art, jahr, aufbauen, termin }: VorgangsAnlage) => {
      if (termin && !termin.istFrei(termine(termin.datum, termin.datum))) throw new TerminVergebenFehler(termin.datum);
      const nummer = buildReference(art, jahr, stored.length + 1);
      const record: BusinessRecord = { ...aufbauen(nummer), id: String(stored.length + 1), reference: nummer, kind: art };
      stored.unshift(record);
      return record;
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

// Partnerbetriebe und Schalter aus dem Test; die Ermittlung selbst ist die echte (src/lib/auftragsweg.ts).
vi.mock('@/lib/partner/partnerweg-daten', async () => {
  const { terminstandorte } = await import('@/lib/auftragsweg');
  return {
    partnerFuerAuftragsweg: async () => (partner.aktiv ? partner.liste : []),
    standorteErmitteln: async (eingabe: { postleitzahl: string; land?: string; leistung?: string }) =>
      terminstandorte({
        ...eingabe,
        eigenbereich: defaults.settings().booking.ownArea,
        partner: partner.aktiv ? partner.liste : [],
        partnerwegAktiv: partner.aktiv,
      }),
  };
});

const { submitRecord: submit } = await import('./records');
const { fetchQuote, fetchSlots, fetchTerminstandorte } = await import('./booking');
const { resetRateLimits } = await import('@/lib/server/rate-limit');
const { startSignieren } = await import('@/lib/server/formular-schutz');

type Eingabe = Parameters<typeof submit>[0];
const submitRecord = (input: Eingabe) => submit({ schutz: { start: startSignieren(Date.now() - 10_000), website: '' }, ...input });

const kontakt = (postalCode: string) => ({
  firstName: 'Erika',
  lastName: 'Muster',
  email: `erika-${postalCode}@example.org`,
  phone: '0301234567',
  street: 'Musterweg 1',
  postalCode,
  city: 'Musterstadt',
  country: 'Deutschland',
});
const zustimmungen = { terms: true, deposit: true, authorization: true, earlyStart: true };
const fahrzeugschein = { fileName: 'fs.jpg', sizeBytes: 120_000, mimeType: 'image/jpeg', category: 'fahrzeugschein' as const, steckplatz: 'fahrzeugschein' as const };
const foto = (steckplatz: 'schluessel-vorderseite' | 'schluessel-rueckseite' | 'schluessel-spitze') => ({
  fileName: `${steckplatz}.jpg`, sizeBytes: 120_000, mimeType: 'image/jpeg', category: 'schluesselfoto' as const, steckplatz,
});
const unterlagen = [fahrzeugschein, foto('schluessel-vorderseite'), foto('schluessel-rueckseite'), foto('schluessel-spitze')];

/** VW Golf, Zweitschlüssel: Festpreis; ohne funktionierenden Schlüssel nur Preisrahmen. */
const verify = { kind: 'autoschluessel' as const, makeSlug: 'volkswagen', modelSlug: 'golf', serviceId: 'zweitschluessel', keyKind: 'klappschluessel' as const, workingKeys: 1 };

async function freiesFenster() {
  const quote = await fetchQuote(verify);
  const slots = await fetchSlots(quote.quote!.slotMinutes, quote.quote!.leadTimeDays);
  const slot = slots.days[0].slots.find((s) => s.available)!;
  return { date: slot.date, time: slot.time };
}

async function buchen(plz: string, anpassen: Partial<Eingabe> = {}) {
  const fenster = await freiesFenster();
  return submitRecord({
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    contact: kontakt(plz),
    payload: { note: 'Zweitschlüssel gewünscht, bitte Rückmeldung.' },
    summary: [],
    uploads: unterlagen,
    appointment: { ...fenster, durationMinutes: 60, location: 'werkstatt' },
    verify,
    consents: zustimmungen,
    // Der Browser schickt die Anzahlung, wie früher.
    payment: { scope: 'anzahlung', amountCents: 6_990, description: 'Anzahlung' },
    ...anpassen,
  });
}

beforeEach(() => {
  stored.length = 0;
  partner.aktiv = false;
  partner.liste = [{ id: '7', status: 'freigeschaltet', postleitzahlen: ['60*'], auftragsarten: ['autoschluessel-vor-ort'] }];
  resetRateLimits();
});

describe('Auftragsweg bei der Buchung (FA-KERN-03)', () => {
  it('Eigenbereich: Werkstatttermin mit Anzahlung wie bisher, Weg und Rest am Vorgang', async () => {
    const result = await buchen('35576');
    expect(result.ok).toBe(true);
    const v = stored[0];
    expect(v.kind).toBe('termin');
    expect(v.auftragsweg).toBe('eigenbereich');
    expect(v.payload.auftragsweg).toBe('eigenbereich');
    expect(v.appointment?.location).toBe('werkstatt');
    expect(v.payment).toMatchObject({ scope: 'anzahlung', amountCents: v.quote!.depositCents, status: 'offen' });
    expect(v.quote?.mode).toBe('fest');
    // Restbetrag richtig berechnet: Gesamtpreis minus Anzahlung.
    expect(v.remainder).toEqual({ totalCents: v.quote!.priceCents, remainderCents: v.quote!.priceCents! - v.quote!.depositCents });
    expect(v.summary.map((s) => s.title).slice(0, 2)).toEqual(['Leistung und Fahrzeug', 'Terminstandort']);
  });

  it('außerhalb ohne Partner: Hauptzentrale mit Anzahlung, auch wenn der Browser den Partner wählt', async () => {
    partner.aktiv = true;
    partner.liste = [];
    const result = await buchen('60311', { terminstandort: 'partner' });
    expect(result.ok).toBe(true);
    expect(stored[0]).toMatchObject({ kind: 'termin', auftragsweg: 'hauptzentrale', payment: { scope: 'anzahlung' } });
    expect((await fetchTerminstandorte({ postleitzahl: '60311' })).ohnePartner).toBe(true);
  });

  it('ohne Schalter kein Partner-Terminstandort, auch mit freigeschaltetem Partner', async () => {
    expect((await fetchTerminstandorte({ postleitzahl: '60311' })).standorte.map((s) => s.standort)).toEqual(['werkstatt']);
    const result = await buchen('60311', { terminstandort: 'partner' });
    expect(result.ok).toBe(true);
    expect(stored[0]).toMatchObject({ kind: 'termin', auftragsweg: 'hauptzentrale', payment: { scope: 'anzahlung' } });
  });

  it('mit pausiertem Partner kein Partnerweg', async () => {
    partner.aktiv = true;
    partner.liste = [{ ...partner.liste[0], status: 'pausiert' }];
    expect((await fetchTerminstandorte({ postleitzahl: '60311' })).standorte.map((s) => s.standort)).toEqual(['werkstatt']);
    await buchen('60311', { terminstandort: 'partner' });
    expect(stored[0].auftragsweg).toBe('hauptzentrale');
  });

  it('Partnerweg mit Festpreis: Gesamtbetrag sofort, nie nur die Anzahlung, kein Zeitfenster der Werkstatt', async () => {
    partner.aktiv = true;
    expect((await fetchTerminstandorte({ postleitzahl: '60311' })).standorte.map((s) => s.standort)).toEqual(['werkstatt', 'partner']);
    // Der Browser schickt Anzahlung und Zeitfenster; der Server nimmt beides nicht.
    const result = await buchen('60311', { terminstandort: 'partner' });
    expect(result.ok).toBe(true);
    const v = stored[0];
    expect(v.kind).toBe('termin');
    expect(v.auftragsweg).toBe('partner');
    expect(v.payment).toMatchObject({ scope: 'gesamt', amountCents: v.quote!.priceCents, status: 'offen' });
    expect(v.payment!.amountCents).toBeGreaterThan(v.quote!.depositCents);
    expect(v.appointment).toBeUndefined();
    expect(v.remainder).toEqual({ totalCents: v.quote!.priceCents, remainderCents: 0 });
  });

  it('Partnerweg ohne Festpreis: Anfrage ohne Zahlung, Unterlagen bleiben Pflicht', async () => {
    partner.aktiv = true;
    const ohneSchluessel = { ...verify, workingKeys: 0 };
    const ohneFahrzeugschein = await buchen('60311', { terminstandort: 'partner', verify: ohneSchluessel, uploads: unterlagen.slice(1) });
    expect(ohneFahrzeugschein.ok).toBe(false);
    expect(stored).toHaveLength(0);

    const result = await buchen('60311', { terminstandort: 'partner', verify: ohneSchluessel });
    expect(result.ok).toBe(true);
    expect(result.redirectUrl).toBeUndefined();
    const v = stored[0];
    expect(v.kind).toBe('anfrage');
    expect(v.area).toBe('autoschluessel');
    expect(v.process).toBe('gefuehrte-anfrage');
    expect(v.auftragsweg).toBe('partner');
    expect(v.payment).toBeUndefined();
    expect(v.appointment).toBeUndefined();
    expect(v.quote?.mode).toBe('rahmen');
  });

  it('übernimmt keinen Auftragsweg aus den Daten des Browsers', async () => {
    const anfrage = await submitRecord({
      kind: 'anfrage',
      area: 'autoschluessel',
      process: 'gefuehrte-anfrage',
      contact: kontakt('60311'),
      payload: { auftragsweg: 'partner' },
      summary: [],
      uploads: [],
    });
    expect(anfrage.ok).toBe(true);
    expect(stored[0].payload).not.toHaveProperty('auftragsweg');
    expect(stored[0].auftragsweg).toBeUndefined();

    await buchen('35576', { payload: { note: 'Zweitschlüssel gewünscht, bitte Rückmeldung.', auftragsweg: 'partner' } });
    expect(stored[0].payload.auftragsweg).toBe('eigenbereich');
  });
});
