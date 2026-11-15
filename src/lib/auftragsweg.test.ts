import { describe, expect, it } from 'vitest';

import {
  EIGENBEREICH_STANDARD,
  auftragswegVon,
  auftragswegZeilen,
  faelligZeilen,
  imEigenbereich,
  istPartnerAnfrage,
  partnerFreigabeZahlbar,
  partnerwegAktiv,
  plzMusterAusText,
  plzPasst,
  restbetragCents,
  restOffen,
  standortText,
  terminortZeile,
  terminstandorte,
  wegFuerStandort,
  zahlungsPlan,
  zustimmungNeuNoetig,
  zustimmungsSchluessel,
  type PartnerFuerWeg,
} from './auftragsweg';
import { ausserhalbDerRegion, beimKundenHinweis, buchungsOrt } from './terminort';
import type { BusinessRecord, PriceQuote } from './types';

/* FA-KERN-03, A-049: Auftragsweg aus Postleitzahl, Standort, Eigenbereich und Partnern; Zahlung je Weg. */

const fest: PriceQuote = { mode: 'fest', priceCents: 24_900, depositCents: 6_990, remainderCents: 17_910, slotMinutes: 60, leadTimeDays: 7, requiresVehicleOnSite: true };
const rahmen: PriceQuote = { mode: 'rahmen', priceFromCents: 19_900, priceToCents: 29_900, depositCents: 6_990, slotMinutes: 60, leadTimeDays: 7, requiresVehicleOnSite: true };
const pruefung: PriceQuote = { mode: 'pruefung', depositCents: 6_990, slotMinutes: 60, leadTimeDays: 7, requiresVehicleOnSite: true };

const partner = (teil: Partial<PartnerFuerWeg> = {}): PartnerFuerWeg => ({
  id: '7',
  status: 'freigeschaltet',
  postleitzahlen: ['60*'],
  auftragsarten: ['autoschluessel-vor-ort'],
  abrechnungsmodell: 'B',
  ...teil,
});

const basis = { eigenbereich: EIGENBEREICH_STANDARD, partnerwegAktiv: true };

describe('Postleitzahlen-Muster', () => {
  it('liest Muster aus dem Text der Einstellungen und vergleicht nur vollständige Postleitzahlen', () => {
    expect(plzMusterAusText(' 35*, 36043 ;355*  x12 ')).toEqual(['35*', '36043', '355*']);
    expect(plzPasst('35576', ['35*'])).toBe(true);
    expect(plzPasst('36043', ['36043'])).toBe(true);
    expect(plzPasst('36044', ['36043'])).toBe(false);
    expect(plzPasst('3557', ['35*'])).toBe(false);
  });

  it('liest den Eigenbereich aus den Einstellungen, Rückfall 35*', () => {
    expect(imEigenbereich('35576', 'Deutschland', undefined)).toBe(true);
    expect(imEigenbereich('36043', 'Deutschland', undefined)).toBe(false);
    expect(imEigenbereich('36043', 'Deutschland', { label: 'Fulda', postalPatterns: ['360*'] })).toBe(true);
    expect(imEigenbereich('35576', 'Deutschland', { label: 'Fulda', postalPatterns: ['360*'] })).toBe(false);
    expect(imEigenbereich('35576', 'Österreich', undefined)).toBe(false);
    // Der Hinweis „außerhalb der Region“ folgt denselben Mustern.
    expect(ausserhalbDerRegion('36043', 'Deutschland', { label: 'Fulda', postalPatterns: ['360*'] })).toBe(false);
    expect(ausserhalbDerRegion('35576', 'Deutschland', { label: 'Fulda', postalPatterns: ['360*'] })).toBe(true);
    expect(ausserhalbDerRegion('35576')).toBe(false);
  });
});

describe('Weg je Postleitzahl', () => {
  it('im Eigenbereich: Werkstatt als regionaler Direkttermin, kein Partner', () => {
    const e = terminstandorte({ ...basis, postleitzahl: '35576', partner: [partner({ postleitzahlen: ['35*'] })] });
    expect(e.standorte).toEqual([{ standort: 'werkstatt', weg: 'eigenbereich' }]);
    expect(e.ohnePartner).toBe(false);
  });

  it('außerhalb ohne Partner: nur die Hauptzentrale und der ehrliche Satz', () => {
    const e = terminstandorte({ ...basis, postleitzahl: '60311', partner: [] });
    expect(e.standorte).toEqual([{ standort: 'werkstatt', weg: 'hauptzentrale' }]);
    expect(e.ohnePartner).toBe(true);
  });

  it('außerhalb mit freigeschaltetem Partner: zusätzlich der vermittelte Partnertermin', () => {
    const e = terminstandorte({ ...basis, postleitzahl: '60311', partner: [partner()] });
    expect(e.standorte).toEqual([
      { standort: 'werkstatt', weg: 'hauptzentrale' },
      { standort: 'partner', weg: 'partner' },
    ]);
    expect(e.passendePartnerIds).toEqual(['7']);
    expect(wegFuerStandort(e, 'partner')).toBe('partner');
    expect(wegFuerStandort(e, 'werkstatt')).toBe('hauptzentrale');
  });

  it('mit pausiertem, nicht freigeschaltetem oder unpassendem Partner: kein Partnertermin', () => {
    for (const p of [
      partner({ status: 'pausiert' }),
      partner({ status: 'vertrag-unterschrieben' }),
      partner({ auftragsarten: ['montage-zylinder'] }),
      partner({ postleitzahlen: ['61*'] }),
      // Modell A (Kunde zahlt an den Partner) passt nicht zum Partnerweg, in dem an Schlüsselmacher24 gezahlt wird.
      partner({ abrechnungsmodell: 'A' }),
    ]) {
      const e = terminstandorte({ ...basis, postleitzahl: '60311', partner: [p] });
      expect(e.standorte.map((s) => s.standort)).toEqual(['werkstatt']);
      expect(e.ohnePartner).toBe(true);
      // Auch wenn der Browser den Partner wählt, gilt die Werkstatt.
      expect(wegFuerStandort(e, 'partner')).toBe('hauptzentrale');
    }
  });

  it('ohne Schalter kein Partner-Terminstandort und kein Hinweis auf fehlende Partner', () => {
    expect(partnerwegAktiv({})).toBe(false);
    expect(partnerwegAktiv({ PARTNERMODELL_B: 'aktiv' })).toBe(true);
    const e = terminstandorte({ ...basis, partnerwegAktiv: false, postleitzahl: '60311', partner: [partner()] });
    expect(e.standorte).toEqual([{ standort: 'werkstatt', weg: 'hauptzentrale' }]);
    expect(e.ohnePartner).toBe(false);
    expect(wegFuerStandort(e, 'partner')).toBe('hauptzentrale');
  });

  it('mehrere passende Partner: keine erfundene Rangfolge, das Team entscheidet', () => {
    const e = terminstandorte({ ...basis, postleitzahl: '60311', partner: [partner({ id: '3' }), partner({ id: '9', postleitzahlen: ['603*'] })] });
    expect(e.passendePartnerIds).toEqual(['3', '9']);
    expect(e.standorte.filter((s) => s.standort === 'partner')).toHaveLength(1);
  });
});

describe('Zahlung je Weg', () => {
  it('Direktweg: Anzahlung wie im Bestand, Rest beim Termin', () => {
    expect(zahlungsPlan('hauptzentrale', fest)).toEqual({ art: 'anzahlung', jetztCents: 6_990, gesamtCents: 24_900, restCents: 17_910 });
    expect(zahlungsPlan('eigenbereich', rahmen)).toEqual({ art: 'anzahlung', jetztCents: 6_990 });
    expect(zahlungsPlan('eigenbereich', pruefung)).toEqual({ art: 'anzahlung', jetztCents: 6_990 });
  });

  it('Partnerweg: nie nur die Anzahlung; mit Festpreis der Gesamtbetrag, sonst eine Anfrage ohne Zahlung', () => {
    expect(zahlungsPlan('partner', fest)).toEqual({ art: 'gesamt', jetztCents: 24_900, gesamtCents: 24_900 });
    expect(zahlungsPlan('partner', rahmen)).toEqual({ art: 'anfrage', jetztCents: 0 });
    expect(zahlungsPlan('partner', pruefung)).toEqual({ art: 'anfrage', jetztCents: 0 });
  });

  it('nennt vor der Zahlung „Jetzt fällig“, Gesamtpreis oder Preisrahmen und im Direktweg den Rest', () => {
    expect(faelligZeilen('hauptzentrale', fest).map((z) => z.label)).toEqual(['Jetzt fällig (Anzahlung)', 'Gesamtpreis', 'Rest beim Termin']);
    expect(faelligZeilen('partner', fest).map((z) => z.label)).toEqual(['Jetzt fällig', 'Gesamtpreis']);
    expect(faelligZeilen('partner', rahmen)).toEqual([
      { label: 'Jetzt fällig', value: 'Jetzt nichts. Sie zahlen erst, wenn wir Ihnen den Preis genannt haben.' },
      { label: 'Preisrahmen', value: expect.stringContaining('bis') },
    ]);
    expect(terminortZeile('eigenbereich', 'Wetzlar')).toBe('Ihr Termin: in unserer Werkstatt in Wetzlar');
    expect(terminortZeile('partner')).toBe('Ihr Termin: bei einem Partnerbetrieb in Ihrer Region, vermittelt durch Schlüsselmacher24');
  });

  it('Fahrzeugöffnung: der Termin ist beim Fahrzeug des Kunden, nicht in der Werkstatt', () => {
    const ort = buchungsOrt('fahrzeugoeffnung');
    expect(ort).toBe('vor-ort');
    expect(terminortZeile('eigenbereich', 'Wetzlar', ort)).toBe('Ihr Termin: bei Ihrem Fahrzeug, Ort nach telefonischer Absprache');
    expect(terminortZeile('hauptzentrale', 'Wetzlar', ort)).not.toContain('Werkstatt');
    expect(standortText('werkstatt', 'Wetzlar', ort)).toBe('Bei Ihrem Fahrzeug (Ort nach telefonischer Absprache)');
    // Andere Leistungen bleiben in der Werkstatt; der Partnerweg bleibt vermittelt.
    expect(terminortZeile('hauptzentrale', 'Wetzlar', buchungsOrt('nachmachen'))).toBe('Ihr Termin: in unserer Werkstatt in Wetzlar');
    expect(terminortZeile('partner', 'Wetzlar', ort)).toContain('Partnerbetrieb');
  });

  it('nennt im Hinweis beim Fahrzeug die gepflegte Bezeichnung des Eigenbereichs', () => {
    expect(beimKundenHinweis('Mittelhessen')).toContain('außerhalb von Mittelhessen');
    expect(beimKundenHinweis()).toContain('außerhalb von Wetzlar und Umgebung');
  });

  it('Wechsel Werkstatt zu Partner: die Zustimmung zur Zahlung muss neu gegeben werden', () => {
    const werkstatt = zustimmungsSchluessel(zahlungsPlan('hauptzentrale', fest));
    const partnerPlan = zustimmungsSchluessel(zahlungsPlan('partner', fest));
    expect(zustimmungNeuNoetig(werkstatt, partnerPlan)).toBe(true);
    expect(zustimmungNeuNoetig(partnerPlan, werkstatt)).toBe(true);
    // Hauptzentrale und Eigenbereich: derselbe Betrag, die Zustimmung bleibt.
    expect(zustimmungNeuNoetig(werkstatt, zustimmungsSchluessel(zahlungsPlan('eigenbereich', fest)))).toBe(false);
    // Plan noch nicht geladen: nichts zurücksetzen.
    expect(zustimmungNeuNoetig('', partnerPlan)).toBe(false);
    expect(zustimmungNeuNoetig(werkstatt, zustimmungsSchluessel(null))).toBe(false);
  });
});

describe('Restbetrag', () => {
  it('ist Gesamtpreis minus eingegangener Online-Zahlung, nie negativ, ohne Gesamtpreis unbekannt', () => {
    // Offen oder fehlgeschlagen: noch nichts angerechnet (Direktweg und Partnerweg).
    expect(restbetragCents(24_900, { amountCents: 6_990, status: 'offen' })).toBe(24_900);
    expect(restbetragCents(24_900, { amountCents: 6_990, status: 'fehlgeschlagen' })).toBe(24_900);
    expect(restbetragCents(24_900, { amountCents: 24_900, status: 'offen' })).toBe(24_900);
    expect(restbetragCents(24_900, { amountCents: 24_900, status: 'fehlgeschlagen' })).toBe(24_900);
    expect(restbetragCents(24_900, { amountCents: 6_990, status: 'bezahlt' })).toBe(17_910);
    expect(restbetragCents(24_900, { amountCents: 24_900, status: 'bezahlt' })).toBe(0);
    expect(restbetragCents(5_000, { amountCents: 6_990, status: 'bezahlt' })).toBe(0);
    expect(restbetragCents(24_900, { amountCents: 6_990, status: 'erstattet' })).toBe(24_900);
    expect(restbetragCents(24_900, undefined)).toBe(24_900);
    expect(restbetragCents(undefined, { amountCents: 6_990, status: 'offen' })).toBeUndefined();
  });

  it('gilt als offen, bis „Rest bezahlt am“ gesetzt ist', () => {
    expect(restOffen({ remainder: { totalCents: 24_900, remainderCents: 17_910 } })).toBe(true);
    expect(restOffen({ remainder: { totalCents: 24_900, remainderCents: 17_910, paidAt: '2026-11-20T10:00:00.000Z', method: 'bar' } })).toBe(false);
    expect(restOffen({ remainder: { totalCents: 24_900, remainderCents: 0 } })).toBe(false);
  });
});

describe('Weg eines gespeicherten Vorgangs', () => {
  const termin = { kind: 'termin' as const, area: 'autoschluessel' as const };

  it('liest das Feld, sonst die Daten des Servers, sonst den Zahlungsumfang', () => {
    expect(auftragswegVon({ ...termin, auftragsweg: 'eigenbereich' })).toBe('eigenbereich');
    expect(auftragswegVon({ ...termin, payload: { auftragsweg: 'partner' } })).toBe('partner');
    expect(auftragswegVon({ ...termin, payment: { scope: 'gesamt', amountCents: 1, status: 'offen' } })).toBe('partner');
    expect(auftragswegVon({ ...termin, payment: { scope: 'anzahlung', amountCents: 1, status: 'offen' } })).toBe('hauptzentrale');
    expect(auftragswegVon({ kind: 'anfrage' })).toBeUndefined();
  });

  it('erkennt die Partner-Anfrage und gibt sie erst mit Freigabe und Gesamtbetrag zur Zahlung frei', () => {
    const anfrage = {
      id: '1', reference: 'SM24-A-2026-0001', kind: 'anfrage', area: 'autoschluessel', process: 'gefuehrte-anfrage', status: 'neu',
      createdAt: '', updatedAt: '', contact: { firstName: 'E', lastName: 'M', email: 'e@example.org', phone: '0', country: 'Deutschland' },
      payload: { auftragsweg: 'partner' }, summary: [], uploads: [], internalNotes: [], timeline: [],
    } as BusinessRecord;
    expect(istPartnerAnfrage(anfrage)).toBe(true);
    expect(istPartnerAnfrage({ ...anfrage, auftragsweg: 'hauptzentrale' })).toBe(false);
    expect(istPartnerAnfrage({ ...anfrage, area: 'schluessel-nach-vorlage' })).toBe(false);
    expect(partnerFreigabeZahlbar(anfrage)).toBe(false);
    const freigegeben = { ...anfrage, status: 'freigegeben' as const, payment: { scope: 'gesamt' as const, amountCents: 31_900, status: 'offen' as const } };
    expect(partnerFreigabeZahlbar(freigegeben)).toBe(true);
    expect(partnerFreigabeZahlbar({ ...freigegeben, payment: { ...freigegeben.payment, scope: 'anzahlung' } })).toBe(false);
    expect(partnerFreigabeZahlbar({ ...freigegeben, payment: { ...freigegeben.payment, status: 'bezahlt' } })).toBe(false);
  });

  it('zeigt im Vorgangsblatt nur gespeicherte Angaben', () => {
    expect(auftragswegZeilen({ kind: 'termin', payment: { scope: 'anzahlung', amountCents: 6_990, status: 'offen' } })).toEqual([]);
    expect(
      auftragswegZeilen({ kind: 'termin', auftragsweg: 'eigenbereich', remainder: { totalCents: 24_900, remainderCents: 17_910, method: 'karte' } }).map(([name]) => name),
    ).toEqual(['Auftragsweg', 'Gesamtpreis', 'Rest beim Termin', 'Zahlart beim Termin']);
  });
});
