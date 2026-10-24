import { describe, expect, it } from 'vitest';

import type { BusinessRecord, PaymentInfo } from '@/lib/types';

import { VERLAUF, zahlungsUebergang, type Sitzung, type ZahlungsEreignis } from './uebergaenge';

const JETZT = '2026-10-24T12:00:00.000Z';
const KONTEXT = { jetzt: JETZT, umgebung: 'production' };

function vorgang(teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}): BusinessRecord {
  return {
    id: '7',
    reference: 'SM24-T-2026-0007',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-10-24T11:00:00.000Z',
    updatedAt: '2026-10-24T11:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [{ at: '2026-10-24T11:00:00.000Z', actor: 'kunde', message: 'Vorgang über die Website angelegt.' }],
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen', checkoutSessionId: 'cs_aktuell', ...zahlung },
    ...teil,
  };
}

function sitzung(teil: Partial<Sitzung> = {}): Sitzung {
  return {
    id: 'cs_aktuell',
    zahlstatus: 'paid',
    paymentIntent: 'pi_1',
    betragCent: 6990,
    waehrung: 'eur',
    metadata: { vorgangId: '7', nummer: 'SM24-T-2026-0007', art: 'termin', umgebung: 'production' },
    ...teil,
  };
}

const completed = (s: Partial<Sitzung> = {}): ZahlungsEreignis => ({ typ: 'checkout.session.completed', sitzung: sitzung(s) });
const expired = (s: Partial<Sitzung> = {}): ZahlungsEreignis => ({ typ: 'checkout.session.expired', sitzung: sitzung({ zahlstatus: 'unpaid', ...s }) });
const asyncFailed = (s: Partial<Sitzung> = {}): ZahlungsEreignis => ({
  typ: 'checkout.session.async_payment_failed',
  sitzung: sitzung({ zahlstatus: 'unpaid', ...s }),
});

describe('zahlungsUebergang: Zahlung eingegangen', () => {
  it('bucht die aktuelle Sitzung als bezahlt — mit Zeitpunkt, Kennung und neutralem Verlauf', () => {
    const u = zahlungsUebergang(vorgang(), completed(), KONTEXT);
    expect(u?.ergebnis).toBe('bezahlt');
    expect(u?.mail).toEqual({ art: 'bezahlt' });
    expect(u?.aenderung?.payment).toMatchObject({ status: 'bezahlt', paidAt: JETZT, providerRef: 'pi_1', checkoutSessionId: 'cs_aktuell' });
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.anzahlung);
    expect(u?.aenderung?.internalNotes).toBeUndefined();
  });

  it.each([
    ['async_payment_succeeded', { typ: 'checkout.session.async_payment_succeeded', sitzung: sitzung() } as ZahlungsEreignis],
    ['completed', completed()],
  ])('ist wiederholbar (%s): ein zweites Mal ändert nichts', (_name, ereignis) => {
    const bezahlt = vorgang({}, { status: 'bezahlt', providerRef: 'pi_1', paidAt: JETZT });
    expect(zahlungsUebergang(bezahlt, ereignis, KONTEXT)).toBeNull();
  });

  it('nimmt ohne gespeicherte Sitzung nur Metadaten mit passender Umgebung und Nummer an', () => {
    const ohneSitzung = vorgang({}, { checkoutSessionId: undefined });
    expect(zahlungsUebergang(ohneSitzung, completed({ id: 'cs_neu' }), KONTEXT)?.ergebnis).toBe('bezahlt');
    for (const metadata of [
      { vorgangId: '7', nummer: 'SM24-T-2026-0007', umgebung: 'preview' },
      { vorgangId: '7', nummer: 'SM24-T-2026-0008', umgebung: 'production' },
      { vorgangId: '8', nummer: 'SM24-T-2026-0007', umgebung: 'production' },
    ]) {
      expect(zahlungsUebergang(ohneSitzung, completed({ id: 'cs_neu', metadata }), KONTEXT)).toEqual({
        aenderung: null,
        ergebnis: 'fremde-sitzung',
      });
    }
  });

  it('bucht trotz Betragsabweichung — mit interner Notiz, nicht im Verlauf', () => {
    const u = zahlungsUebergang(vorgang(), completed({ betragCent: 5000 }), KONTEXT);
    expect(u?.ergebnis).toBe('bezahlt');
    expect(u?.aenderung?.internalNotes?.[0].message).toContain('Betrag weicht ab');
    expect(u?.aenderung?.timeline?.map((e) => e.message).join(' ')).not.toContain('weicht');
  });

  it('meldet eine zweite Zahlung als Doppelzahlung nur intern', () => {
    const bezahlt = vorgang({}, { status: 'bezahlt', providerRef: 'pi_1' });
    const u = zahlungsUebergang(bezahlt, completed({ id: 'cs_frueher', paymentIntent: 'pi_2' }), KONTEXT);
    expect(u?.ergebnis).toBe('doppelzahlung');
    expect(u?.aenderung?.payment).toBeUndefined();
    expect(u?.aenderung?.timeline).toBeUndefined();
    expect(u?.aenderung?.internalNotes?.[0].message).toContain('Doppelzahlung');
    expect(u?.mail).toBeUndefined();
  });

  it('bucht eine Zahlung über eine frühere Sitzung und nach Stornierung mit Hinweis fürs Team', () => {
    const u = zahlungsUebergang(vorgang({ status: 'storniert' }), completed({ id: 'cs_frueher', paymentIntent: 'pi_9' }), KONTEXT);
    expect(u?.ergebnis).toBe('bezahlt');
    expect(u?.aenderung?.payment).toMatchObject({ status: 'bezahlt', checkoutSessionId: 'cs_frueher', providerRef: 'pi_9' });
    const notizen = u?.aenderung?.internalNotes?.map((n) => n.message).join(' ');
    expect(notizen).toContain('frühere Checkout-Sitzung');
    expect(notizen).toContain('Erstattung prüfen');
  });

  it('wartet bei Lastschrift (unpaid) auf die Bank — Zahlung bleibt offen', () => {
    const u = zahlungsUebergang(vorgang(), completed({ zahlstatus: 'unpaid' }), KONTEXT);
    expect(u?.ergebnis).toBe('zahlung-ausstehend');
    expect(u?.aenderung?.payment).toMatchObject({ status: 'offen', providerRef: 'pi_1' });
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.ausstehend);
    expect(u?.mail).toBeUndefined();
    // Wiederholung: nichts mehr zu tun
    expect(zahlungsUebergang(vorgang({}, { providerRef: 'pi_1' }), completed({ zahlstatus: 'unpaid' }), KONTEXT)).toBeNull();
  });
});

describe('zahlungsUebergang: nicht abgeschlossen', () => {
  it('gibt einen neuen Termin frei, wenn die Sitzung abläuft', () => {
    const u = zahlungsUebergang(vorgang(), expired(), KONTEXT);
    expect(u?.ergebnis).toBe('termin-freigegeben');
    expect(u?.aenderung?.status).toBe('storniert');
    expect(u?.aenderung?.payment?.status).toBe('fehlgeschlagen');
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.terminFrei);
    expect(u?.mail).toEqual({ art: 'nicht-abgeschlossen', terminFreigegeben: true });
  });

  it('storniert einen schon bearbeiteten Termin nicht — das Team bekommt eine Notiz', () => {
    const u = zahlungsUebergang(vorgang({ status: 'terminiert' }), expired(), KONTEXT);
    expect(u?.aenderung?.status).toBeUndefined();
    expect(u?.aenderung?.payment?.status).toBe('fehlgeschlagen');
    expect(u?.aenderung?.internalNotes?.[0].message).toContain('nicht automatisch storniert');
    expect(u?.mail).toBeUndefined();
  });

  it('ignoriert den Ablauf einer früheren Sitzung und einer schon bezahlten Zahlung', () => {
    expect(zahlungsUebergang(vorgang(), expired({ id: 'cs_frueher' }), KONTEXT)).toBeNull();
    expect(zahlungsUebergang(vorgang({}, { status: 'bezahlt' }), expired(), KONTEXT)).toBeNull();
    expect(zahlungsUebergang(vorgang({}, { status: 'fehlgeschlagen' }), expired(), KONTEXT)).toBeNull();
  });

  it('lässt bei Bestellungen die Zahlung offen und vermerkt den Ablauf einmal', () => {
    const bestellung = vorgang({ kind: 'bestellung', reference: 'SM24-B-2026-0001' }, { scope: 'gesamt' });
    const metadata = { vorgangId: '7', nummer: 'SM24-B-2026-0001', umgebung: 'production' };
    const u = zahlungsUebergang(bestellung, expired({ metadata }), KONTEXT);
    expect(u?.ergebnis).toBe('abgelaufen');
    expect(u?.aenderung?.payment).toBeUndefined();
    expect(u?.aenderung?.status).toBeUndefined();
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.abgelaufen);
    expect(u?.mail).toEqual({ art: 'nicht-abgeschlossen', terminFreigegeben: false });
    const nochmal = { ...bestellung, timeline: u!.aenderung!.timeline! };
    expect(zahlungsUebergang(nochmal, expired({ metadata }), KONTEXT)).toBeNull();
  });

  it('setzt bei gescheiterter Lastschrift die Zahlung auf fehlgeschlagen und gibt den neuen Termin frei', () => {
    const u = zahlungsUebergang(vorgang({}, { providerRef: 'pi_1' }), asyncFailed(), KONTEXT);
    expect(u?.ergebnis).toBe('termin-freigegeben');
    expect(u?.aenderung?.payment?.status).toBe('fehlgeschlagen');

    const bestellung = vorgang({ kind: 'bestellung', reference: 'SM24-B-2026-0001' }, { scope: 'gesamt' });
    const b = zahlungsUebergang(bestellung, asyncFailed({ metadata: {} }), KONTEXT);
    expect(b?.ergebnis).toBe('fehlgeschlagen');
    expect(b?.aenderung?.payment?.status).toBe('fehlgeschlagen');
    expect(b?.mail).toEqual({ art: 'nicht-abgeschlossen', terminFreigegeben: false });
  });

  it('schickt bei einem schon stornierten Vorgang keine Mail', () => {
    const u = zahlungsUebergang(vorgang({ status: 'storniert' }), expired(), KONTEXT);
    expect(u?.aenderung?.payment?.status).toBe('fehlgeschlagen');
    expect(u?.aenderung?.internalNotes).toBeUndefined();
    expect(u?.mail).toBeUndefined();
  });
});

describe('zahlungsUebergang: Erstattung und Streitfall', () => {
  const bezahlt = () => vorgang({}, { status: 'bezahlt', providerRef: 'pi_1' });
  const erstattung = (erstattetCent: number, vollstaendig: boolean): ZahlungsEreignis => ({
    typ: 'charge.refunded',
    erstattung: { betragCent: 6990, erstattetCent, vollstaendig, waehrung: 'eur' },
  });

  it('vermerkt Teilerstattungen und setzt bei voller Erstattung „erstattet“', () => {
    const teil = zahlungsUebergang(bezahlt(), erstattung(2000, false), KONTEXT);
    expect(teil?.ergebnis).toBe('teilerstattet');
    expect(teil?.aenderung?.payment).toMatchObject({ status: 'bezahlt', refundedCents: 2000 });
    expect(teil?.mail).toEqual({ art: 'erstattet', betragCent: 2000 });

    const nachTeil = vorgang({}, { status: 'bezahlt', providerRef: 'pi_1', refundedCents: 2000 });
    expect(zahlungsUebergang(nachTeil, erstattung(2000, false), KONTEXT)).toBeNull();

    const voll = zahlungsUebergang(nachTeil, erstattung(6990, true), KONTEXT);
    expect(voll?.ergebnis).toBe('erstattet');
    expect(voll?.aenderung?.payment).toMatchObject({ status: 'erstattet', refundedCents: 6990 });
    expect(voll?.mail).toEqual({ art: 'erstattet', betragCent: 4990 });
  });

  it('vermerkt eine Rückbuchung nur intern', () => {
    const u = zahlungsUebergang(
      bezahlt(),
      { typ: 'charge.dispute.created', streitfall: { betragCent: 6990, grund: 'fraudulent', waehrung: 'eur' } },
      KONTEXT,
    );
    expect(u?.ergebnis).toBe('streitfall');
    expect(u?.aenderung?.timeline).toBeUndefined();
    expect(u?.aenderung?.payment).toBeUndefined();
    expect(u?.aenderung?.internalNotes?.[0].message).toContain('fraudulent');
  });

  it('tut ohne Zahlungsangaben nichts', () => {
    expect(zahlungsUebergang(vorgang({ payment: undefined }), completed(), KONTEXT)).toBeNull();
  });
});
