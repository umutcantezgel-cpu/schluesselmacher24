import { describe, expect, it } from 'vitest';

import type { BusinessRecord, PaymentInfo } from '@/lib/types';

import { kundeEingang } from '@/lib/mail/vorlagen';

import { zahlungsAnsicht } from './ansicht';
import { VERLAUF, zahlungsUebergang, type Sitzung } from './uebergaenge';

/* FA-KERN-03: Partnerweg auf der Vorgangsseite und beim Zahlungseingang. Der Direktweg bleibt wie bisher
 * (uebergaenge.test.ts, ansicht.test.ts). */

const JETZT = '2026-11-15T12:00:00.000Z';
const KONTEXT = { jetzt: JETZT, umgebung: 'production' };
const UMFELD = { online: true, abbruch: false, rueckkehr: false, jetzt: new Date('2026-11-15T11:10:00.000Z') };

function vorgang(teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}): BusinessRecord {
  return {
    id: '8',
    reference: 'SM24-T-2026-0008',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-11-15T11:00:00.000Z',
    updatedAt: '2026-11-15T11:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: { auftragsweg: 'partner' },
    auftragsweg: 'partner',
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    payment: { scope: 'gesamt', amountCents: 24_900, status: 'offen', checkoutSessionId: 'cs_1', expiresAt: '2026-11-15T11:31:00.000Z', ...zahlung },
    ...teil,
  };
}

const sitzung = (teil: Partial<Sitzung> = {}): Sitzung => ({
  id: 'cs_1',
  zahlstatus: 'paid',
  paymentIntent: 'pi_8',
  betragCent: 24_900,
  waehrung: 'eur',
  metadata: { vorgangId: '8', nummer: 'SM24-T-2026-0008', art: 'termin', umgebung: 'production' },
  ...teil,
});

describe('Partnerweg mit Festpreis', () => {
  it('spricht vor der Zahlung vom Gesamtbetrag, nicht von einer Anzahlung', () => {
    const ansicht = zahlungsAnsicht(vorgang(), UMFELD);
    expect(ansicht).toMatchObject({ titel: 'Gesamtbetrag noch offen', knopf: 'jetzt' });
    expect(ansicht?.text).not.toContain('Anzahlung');
  });

  it('macht den Auftrag mit dem Zahlungseingang verbindlich und vermerkt die Freigabe an den Partner', () => {
    const u = zahlungsUebergang(vorgang(), { typ: 'checkout.session.completed', sitzung: sitzung() }, KONTEXT);
    expect(u?.ergebnis).toBe('bezahlt');
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.partner);
    expect(u?.aenderung?.internalNotes?.at(-1)?.message).toContain('an den Partnerbetrieb freigegeben werden');
  });

  it('Eingangsmail: Gesamtbetrag offen, ohne Anzahlung und ohne reserviertes Zeitfenster', () => {
    const mail = kundeEingang({ vorgang: vorgang(), token: 'geheimer-link-schluessel-1234567890', onlineZahlung: true, kontext: { site: 'https://schluesselmacher24.de' } });
    expect(mail.text).toContain('Gesamtbetrag');
    expect(mail.text).not.toMatch(/Anzahlung|Zeitfenster|reserviert/);
  });

  it('rechnet den Gesamtbetrag erst mit dem Zahlungseingang an: Rest vorher Gesamtpreis, danach null', () => {
    const offen = vorgang({ remainder: { totalCents: 24_900, remainderCents: 24_900 } });
    const u = zahlungsUebergang(offen, { typ: 'checkout.session.completed', sitzung: sitzung() }, KONTEXT);
    expect(u?.aenderung?.remainder).toEqual({ totalCents: 24_900, remainderCents: 0 });
  });

  const ohneAnzahlung = (texte: Array<string | undefined>) => {
    for (const text of texte) {
      expect(text).toBeDefined();
      expect(text).not.toMatch(/Anzahlung|Zeitfenster|reserviert/);
    }
  };

  it('Zahlungslink abgelaufen: ohne Anzahlung und Zeitfenster, der Auftrag ist nicht zustande gekommen', () => {
    const u = zahlungsUebergang(vorgang(), { typ: 'checkout.session.expired', sitzung: sitzung({ zahlstatus: 'unpaid' }) }, KONTEXT);
    expect(u?.ergebnis).toBe('termin-freigegeben');
    expect(u?.aenderung?.status).toBe('storniert');
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.partnerNichtZustande);
    ohneAnzahlung([u?.aenderung?.timeline?.at(-1)?.message, u?.aenderung?.internalNotes?.at(-1)?.message]);
    // Vorgangsseite: abgelaufene Reservierung ohne Sitzung und nach Ablauf.
    const spaet = { ...UMFELD, jetzt: new Date('2026-11-15T12:00:00.000Z') };
    const ansicht = zahlungsAnsicht(vorgang(), spaet);
    expect(ansicht).toMatchObject({ titel: 'Zahlung nicht eingegangen', neuBuchen: true });
    ohneAnzahlung([ansicht?.titel, ansicht?.text]);
  });

  it('Zahlung fehlgeschlagen: ohne Anzahlung und Zeitfenster, auch wenn der Auftrag schon bearbeitet wird', () => {
    const u = zahlungsUebergang(vorgang(), { typ: 'checkout.session.async_payment_failed', sitzung: sitzung({ zahlstatus: 'unpaid' }) }, KONTEXT);
    expect(u?.ergebnis).toBe('termin-freigegeben');
    expect(u?.aenderung?.payment?.status).toBe('fehlgeschlagen');
    ohneAnzahlung([u?.aenderung?.timeline?.at(-1)?.message, u?.aenderung?.internalNotes?.at(-1)?.message]);

    const bearbeitet = zahlungsUebergang(
      vorgang({ status: 'terminiert' }),
      { typ: 'checkout.session.async_payment_failed', sitzung: sitzung({ zahlstatus: 'unpaid' }) },
      KONTEXT,
    );
    expect(bearbeitet?.ergebnis).toBe('fehlgeschlagen');
    ohneAnzahlung([bearbeitet?.aenderung?.internalNotes?.at(-1)?.message]);

    for (const status of ['neu', 'terminiert'] as const) {
      const ansicht = zahlungsAnsicht(vorgang({ status }, { status: 'fehlgeschlagen' }), UMFELD);
      expect(ansicht?.titel).toBe('Zahlung nicht eingegangen');
      ohneAnzahlung([ansicht?.titel, ansicht?.text]);
    }
  });
});

describe('Partner-Anfrage ohne Festpreis', () => {
  const anfrage = (teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}) =>
    vorgang({ kind: 'anfrage', process: 'gefuehrte-anfrage', reference: 'SM24-A-2026-0008', ...teil }, { checkoutSessionId: undefined, expiresAt: undefined, ...zahlung });

  it('ist erst nach der Freigabe zahlbar', () => {
    expect(zahlungsAnsicht(anfrage({ status: 'in-pruefung' }), UMFELD)).toMatchObject({ titel: 'Zahlung derzeit nicht möglich' });
    expect(zahlungsAnsicht(anfrage({ status: 'freigegeben' }), UMFELD)).toMatchObject({ titel: 'Freigegeben, Zahlung offen', knopf: 'jetzt' });
  });

  it('bucht die Zahlung zur Freigabe als verbindlichen Partnerauftrag', () => {
    const u = zahlungsUebergang(
      anfrage({ status: 'freigegeben' }, { checkoutSessionId: 'cs_1' }),
      { typ: 'checkout.session.completed', sitzung: sitzung({ metadata: { vorgangId: '8', nummer: 'SM24-A-2026-0008', art: 'anfrage', umgebung: 'production' } }) },
      KONTEXT,
    );
    expect(u?.ergebnis).toBe('bezahlt');
    expect(u?.aenderung?.timeline?.at(-1)?.message).toBe(VERLAUF.partner);
  });
});
