import { describe, expect, it } from 'vitest';

import type { BusinessRecord } from '../types';

import {
  BEWERBUNG_STATUS,
  abrechnen,
  darfVermitteln,
  fehltFuerFreischaltung,
  partnerAuszug,
  partnerSiehtVorgang,
  provisionCents,
  statuswechselPruefen,
  uebergangErlaubt,
  vermittlungWechselErlaubt,
} from './index';

const GEPRUEFT = { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true, vertragUnterschrieben: true };

describe('Bewerbung (G-39, MA-16)', () => {
  it('erlaubt nur vorgesehene Übergänge und endet bei abgelehnt und beendet', () => {
    expect(uebergangErlaubt('eingegangen', 'in-pruefung')).toBe(true);
    expect(uebergangErlaubt('eingegangen', 'freigeschaltet')).toBe(false);
    expect(uebergangErlaubt('abgelehnt', 'in-pruefung')).toBe(false);
    expect(uebergangErlaubt('freigeschaltet', 'pausiert')).toBe(true);
    expect(BEWERBUNG_STATUS).toHaveLength(9);
  });

  it('schaltet nur mit allen Prüfungen und unterschriebenem Vertrag frei', () => {
    expect(fehltFuerFreischaltung({})).toEqual(['Gewerbenachweis prüfen', 'Identität prüfen', 'fachliche Eignung prüfen', 'unterschriebenen Vertrag hinterlegen']);
    expect(statuswechselPruefen('vertrag-unterschrieben', 'freigeschaltet', { ...GEPRUEFT, identitaetGeprueft: false })).toContain('Identität prüfen');
    expect(statuswechselPruefen('vertrag-unterschrieben', 'freigeschaltet', GEPRUEFT)).toBeNull();
    expect(statuswechselPruefen('in-pruefung', 'freigeschaltet', GEPRUEFT)).toMatch(/geht es nicht direkt/);
  });
});

describe('Vermittlung (G-40)', () => {
  it('folgt den Zuständen des Bestands', () => {
    expect(vermittlungWechselErlaubt(undefined, 'neu')).toBe(true);
    expect(vermittlungWechselErlaubt(undefined, 'angenommen')).toBe(false);
    expect(vermittlungWechselErlaubt('erledigt', 'provision-abgerechnet')).toBe(true);
    expect(vermittlungWechselErlaubt('provision-abgerechnet', 'neu')).toBe(false);
  });

  it('vermittelt nur an freigeschaltete Partner mit passender Auftragsart', () => {
    expect(darfVermitteln({ status: 'freigeschaltet', auftragsarten: ['autoschluessel-vor-ort'] }, 'autoschluessel-vor-ort')).toBe(true);
    expect(darfVermitteln({ status: 'pausiert', auftragsarten: ['autoschluessel-vor-ort'] }, 'autoschluessel-vor-ort')).toBe(false);
    expect(darfVermitteln({ status: 'freigeschaltet', auftragsarten: ['montage-zylinder'] }, 'autoschluessel-vor-ort')).toBe(false);
  });
});

describe('Abrechnung A und B (G-40)', () => {
  it('rundet kaufmännisch und begrenzt die Provision auf den Auftragswert', () => {
    expect(provisionCents(10_000, { prozent: 12.5 })).toBe(1250);
    expect(provisionCents(9_999, { prozent: 10 })).toBe(1000);
    expect(provisionCents(500, { festCents: 1_000 })).toBe(500);
    expect(provisionCents(10_000, { prozent: 10, festCents: 200 })).toBe(1200);
  });

  it('stellt nach Modell A die Provision in Rechnung', () => {
    expect(abrechnen({ modell: 'A', auftragswertCents: 20_000, provision: { prozent: 10 } })).toEqual({ modell: 'A', provisionCents: 2_000, rechnungAnPartnerCents: 2_000 });
  });

  it('rechnet Modell B nur nach Freigabe ab', () => {
    expect(abrechnen({ modell: 'B', auftragswertCents: 20_000, provision: { prozent: 10 } })).toEqual({ fehlt: 'Modell B ist ausgeschaltet (PARTNERMODELL: B fehlt).' });
    expect(abrechnen({ modell: 'B', auftragswertCents: 20_000, provision: { prozent: 10 }, modellBFreigegeben: true })).toEqual({
      modell: 'B',
      provisionCents: 2_000,
      einbehaltCents: 2_000,
      auszahlungAnPartnerCents: 18_000,
    });
  });

  it('rechnet ohne hinterlegte Provision nichts (G13: keine Werte im Repository)', () => {
    expect(abrechnen({ modell: 'A', auftragswertCents: 20_000, provision: undefined })).toEqual({ fehlt: 'Für diese Auftragsart ist keine Provision hinterlegt.' });
    expect(abrechnen({ modell: 'A', auftragswertCents: -1, provision: { prozent: 10 } })).toEqual({ fehlt: 'Auftragswert in Cent fehlt.' });
  });
});

describe('Sichtbarkeit für Partner (Zugriffsrechte)', () => {
  /* Erfundene Testdaten (G4). */
  const vorgang = (status: NonNullable<BusinessRecord['referral']>['status'], partnerId = 'p1') =>
    ({
      reference: 'SM24-A-2026-0009',
      area: 'autoschluessel',
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', street: 'Musterweg 1', postalCode: '20095', city: 'Hamburg' },
      summary: [{ title: 'Fahrzeug', rows: [{ label: 'Modell', value: 'Testwagen' }] }],
      referral: { status, partnerId, commissionCents: 1500, note: 'intern' },
      payment: { scope: 'gesamt', amountCents: 9900, status: 'bezahlt' },
      internalNotes: [{ at: '2026-11-03T08:00:00Z', actor: 'team', message: 'intern' }],
    }) as unknown as BusinessRecord;

  it('zeigt nur eigene Vermittlungen ab „Partner angefragt“', () => {
    expect(partnerSiehtVorgang('p1', vorgang('neu'))).toBe(false);
    expect(partnerSiehtVorgang('p1', vorgang('partner-angefragt'))).toBe(true);
    expect(partnerSiehtVorgang('p2', vorgang('angenommen'))).toBe(false);
    expect(partnerSiehtVorgang('p1', vorgang('provision-abgerechnet'))).toBe(false);
  });

  it('gibt Kontaktdaten erst nach Annahme heraus und nie Zahlung, Provision oder Notizen', () => {
    const angefragt = partnerAuszug(vorgang('partner-angefragt'));
    expect(angefragt.kontakt).toEqual({ name: '', anschrift: '20095 Hamburg' });
    const angenommen = partnerAuszug(vorgang('angenommen'));
    expect(angenommen.kontakt).toEqual({ name: 'Erika Muster', telefon: '0301234567', anschrift: 'Musterweg 1, 20095 Hamburg' });
    const text = JSON.stringify(angenommen);
    expect(text).not.toMatch(/1500|9900|intern|erika@example\.org/);
  });
});
