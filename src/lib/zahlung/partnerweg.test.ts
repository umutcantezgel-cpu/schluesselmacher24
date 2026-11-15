import { describe, expect, it } from 'vitest';

import type { BusinessRecord, PaymentInfo } from '@/lib/types';

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
});

describe('Partner-Anfrage ohne Festpreis', () => {
  const anfrage = (teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}) =>
    vorgang({ kind: 'anfrage', process: 'gefuehrte-anfrage', reference: 'SM24-A-2026-0008', ...teil }, { checkoutSessionId: undefined, expiresAt: undefined, ...zahlung });

  it('ist erst nach der Freigabe zahlbar', () => {
    expect(zahlungsAnsicht(anfrage({ status: 'in-pruefung' }), UMFELD)).toMatchObject({ titel: 'Zahlung derzeit nicht möglich' });
    expect(zahlungsAnsicht(anfrage({ status: 'freigegeben' }), UMFELD)).toMatchObject({ titel: 'Freigegeben – Zahlung offen', knopf: 'jetzt' });
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
