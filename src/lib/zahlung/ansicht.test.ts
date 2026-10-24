import { describe, expect, it } from 'vitest';

import type { BusinessRecord, PaymentInfo } from '@/lib/types';

import { terminNochBezahlbar, zahlungsAnsicht } from './ansicht';

const JETZT = new Date('2026-10-24T12:00:00.000Z');
const UMFELD = { online: true, abbruch: false, rueckkehr: false, jetzt: JETZT };

function vorgang(teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}): BusinessRecord {
  return {
    id: '7',
    reference: 'SM24-B-2026-0007',
    kind: 'bestellung',
    area: 'schluessel-nach-code',
    process: 'direktkauf',
    status: 'neu',
    createdAt: '2026-10-24T11:50:00.000Z',
    updatedAt: '2026-10-24T11:50:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    payment: { scope: 'gesamt', amountCents: 3070, status: 'offen', checkoutSessionId: 'cs_1', expiresAt: '2026-10-25T10:50:00.000Z', ...zahlung },
    ...teil,
  };
}

const termin = (teil: Partial<BusinessRecord> = {}, zahlung: Partial<PaymentInfo> = {}) =>
  vorgang({ kind: 'termin', ...teil }, { scope: 'anzahlung', expiresAt: '2026-10-24T12:21:00.000Z', ...zahlung });

describe('zahlungsAnsicht', () => {
  it('bietet bei offener Bestellung „Jetzt bezahlen“ und nach Ablauf „Erneut bezahlen“', () => {
    expect(zahlungsAnsicht(vorgang(), UMFELD)).toMatchObject({ titel: 'Zahlung noch offen', knopf: 'jetzt' });
    expect(zahlungsAnsicht(vorgang({}, { expiresAt: '2026-10-24T11:00:00.000Z' }), UMFELD)).toMatchObject({
      titel: 'Zahlungslink abgelaufen',
      knopf: 'erneut',
    });
    expect(zahlungsAnsicht(vorgang({}, { checkoutSessionId: undefined, expiresAt: undefined }), UMFELD)?.knopf).toBe('jetzt');
  });

  it('zeigt Abbruch und Rückkehr', () => {
    expect(zahlungsAnsicht(vorgang(), { ...UMFELD, abbruch: true })).toMatchObject({ titel: 'Zahlung abgebrochen', knopf: 'jetzt' });
    const rueckkehr = zahlungsAnsicht(vorgang(), { ...UMFELD, rueckkehr: true });
    expect(rueckkehr?.titel).toBe('Zahlung wird bestätigt');
    expect(rueckkehr?.knopf).toBeUndefined();
    expect(zahlungsAnsicht(vorgang({}, { status: 'bezahlt' }), { ...UMFELD, rueckkehr: true })?.ton).toBe('success');
    expect(zahlungsAnsicht(vorgang({}, { status: 'bezahlt' }), UMFELD)).toBeNull();
  });

  it('zeigt beim Termin die Reservierung und danach „neu buchen“', () => {
    const offen = zahlungsAnsicht(termin(), UMFELD);
    expect(offen).toMatchObject({ titel: 'Anzahlung noch offen', knopf: 'jetzt' });
    expect(offen?.text).toContain('bis 14:21 Uhr');
    expect(zahlungsAnsicht(termin({}, { expiresAt: '2026-10-24T11:59:00.000Z' }), UMFELD)).toMatchObject({
      titel: 'Reservierung abgelaufen',
      neuBuchen: true,
    });
    expect(zahlungsAnsicht(termin({}, { status: 'fehlgeschlagen' }), UMFELD)).toMatchObject({ neuBuchen: true });
    expect(zahlungsAnsicht(termin({ status: 'storniert' }, { status: 'fehlgeschlagen' }), UMFELD)?.knopf).toBeUndefined();
  });

  it('bleibt ohne Online-Zahlung beim bisherigen Hinweis', () => {
    expect(zahlungsAnsicht(vorgang({}, { checkoutSessionId: undefined }), { ...UMFELD, online: false })).toMatchObject({
      titel: 'Zahlung noch offen',
      ton: 'info',
    });
    expect(zahlungsAnsicht(vorgang({}, { checkoutSessionId: undefined }), { ...UMFELD, online: false })?.knopf).toBeUndefined();
  });
});

describe('terminNochBezahlbar', () => {
  it('erlaubt ohne Sitzung nur kurz nach der Buchung und nur im Status „neu“', () => {
    const ohneSitzung = termin({}, { checkoutSessionId: undefined, expiresAt: undefined });
    expect(terminNochBezahlbar(ohneSitzung, JETZT)).toBe(true);
    expect(terminNochBezahlbar({ ...ohneSitzung, createdAt: '2026-10-24T11:00:00.000Z' }, JETZT)).toBe(false);
    expect(terminNochBezahlbar({ ...ohneSitzung, status: 'terminiert' }, JETZT)).toBe(false);
    expect(terminNochBezahlbar(termin(), JETZT)).toBe(true);
  });
});
