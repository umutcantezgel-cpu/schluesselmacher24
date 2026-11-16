import { describe, expect, it } from 'vitest';

import { terminstandorte } from '../auftragsweg';

import { AUFTRAGSART_SAMMELWERT, auftragsartFuerLeistung, auftragsartFuerVorgang } from './leistungen';
import { deckendePartner, type PartnerFuerRegion } from './region';

/* FA-PLATTFORM-01B: Welche freigeschalteten Partner decken eine Postleitzahl für eine Leistung ab? Und welche
 * der neun Leistungen gehört zur gebuchten Leistung des Assistenten (Zusatz 7)? Erfundene Betriebe (G4). */

const P = (teil: Partial<PartnerFuerRegion> & { id: string }): PartnerFuerRegion => ({
  status: 'freigeschaltet',
  postleitzahlen: '35*',
  auftragsarten: ['funk'],
  ...teil,
});

const PARTNER: PartnerFuerRegion[] = [
  P({ id: 'funk-35', postleitzahlen: '35*, 36043', auftragsarten: ['funk', 'transponder'] }),
  P({ id: 'nachmachen-355', postleitzahlen: '355*', auftragsarten: ['schluessel-nachmachen'] }),
  P({ id: 'pausiert', status: 'pausiert', auftragsarten: ['funk', 'schluessel-nachmachen'] }),
  P({ id: 'gesperrt', status: 'gesperrt', auftragsarten: ['funk', 'schluessel-nachmachen'] }),
  P({ id: 'in-pruefung', status: 'in-pruefung', auftragsarten: ['funk'] }),
  P({ id: 'ohne-plz', postleitzahlen: '', auftragsarten: ['funk', 'schluessel-nachmachen'] }),
];

const ids = (liste: PartnerFuerRegion[]) => liste.map((p) => p.id);

describe('Abdeckung nach Postleitzahl und Leistung', () => {
  it('nennt nur freigeschaltete Partner mit der Leistung und passender Postleitzahl', () => {
    expect(ids(deckendePartner('35576', 'funk', PARTNER))).toEqual(['funk-35']);
    expect(ids(deckendePartner('35576', 'schluessel-nachmachen', PARTNER))).toEqual(['nachmachen-355']);
    expect(ids(deckendePartner('35390', 'schluessel-nachmachen', PARTNER))).toEqual([]);
    expect(ids(deckendePartner('36043', 'transponder', PARTNER))).toEqual(['funk-35']);
    expect(ids(deckendePartner('36044', 'transponder', PARTNER))).toEqual([]);
  });

  it('schließt pausierte, gesperrte und noch nicht freigeschaltete Partner aus', () => {
    const treffer = ids(deckendePartner('35576', 'funk', PARTNER));
    expect(treffer).not.toContain('pausiert');
    expect(treffer).not.toContain('gesperrt');
    expect(treffer).not.toContain('in-pruefung');
  });

  it('ohne Postleitzahlen keine Abdeckung, auch nicht über den Umkreis', () => {
    expect(ids(deckendePartner('35576', 'funk', [P({ id: 'nur-umkreis', postleitzahlen: null })]))).toEqual([]);
    expect(ids(deckendePartner('35576', 'funk', PARTNER))).not.toContain('ohne-plz');
  });

  it('nimmt Leistungen des Assistenten und den Sammelwert an', () => {
    expect(ids(deckendePartner('35576', 'zweitschluessel', PARTNER))).toEqual(['nachmachen-355']);
    // Sammelwert: jeder Partner mit einer der neun Leistungen (Regel aus Teil A).
    expect(ids(deckendePartner('35576', AUFTRAGSART_SAMMELWERT, PARTNER))).toEqual(['funk-35', 'nachmachen-355']);
    // „Schlüsselbart fräsen“ ist keiner Leistung eindeutig zugeordnet und bleibt beim Sammelwert.
    expect(ids(deckendePartner('35576', 'bart-fraesen', PARTNER))).toEqual(['funk-35', 'nachmachen-355']);
    expect(ids(deckendePartner('kein', 'funk', PARTNER))).toEqual([]);
  });
});

describe('Leistung des Auftrags (Zusatz 7)', () => {
  it('ordnet eindeutige Leistungen einer der neun zu, sonst bleibt der Sammelwert', () => {
    expect(auftragsartFuerLeistung('zweitschluessel')).toBe('schluessel-nachmachen');
    expect(auftragsartFuerLeistung('ersatz-bei-verlust')).toBe('schluesselverlust');
    expect(auftragsartFuerLeistung('programmierung')).toBe('programmierung-anlernen');
    expect(auftragsartFuerLeistung('gehaeuse-reparatur')).toBe('reparatur-gehaeuse');
    expect(auftragsartFuerLeistung('fahrzeugoeffnung')).toBe('fahrzeugoeffnung');
    expect(auftragsartFuerLeistung('bart-fraesen')).toBe(AUFTRAGSART_SAMMELWERT);
    expect(auftragsartFuerLeistung(undefined)).toBe(AUFTRAGSART_SAMMELWERT);
    expect(auftragsartFuerLeistung('toString')).toBe(AUFTRAGSART_SAMMELWERT);
    expect(auftragsartFuerVorgang({ serviceId: 'programmierung' })).toBe('programmierung-anlernen');
    expect(auftragsartFuerVorgang(null)).toBe(AUFTRAGSART_SAMMELWERT);
  });

  it('bietet den Partnertermin nur an, wenn ein Partner die gebuchte Leistung führt', () => {
    const partner = [{ id: '1', status: 'freigeschaltet' as const, postleitzahlen: ['60*'], auftragsarten: ['funk'], abrechnungsmodell: 'B' as const }];
    const eingabe = { postleitzahl: '60311', partner, partnerwegAktiv: true };
    expect(terminstandorte({ ...eingabe, leistung: 'zweitschluessel' }).passendePartnerIds).toEqual([]);
    expect(terminstandorte({ ...eingabe, leistung: 'bart-fraesen' }).passendePartnerIds).toEqual(['1']);
    const nachmachen = [{ ...partner[0], auftragsarten: ['schluessel-nachmachen'] }];
    expect(terminstandorte({ ...eingabe, partner: nachmachen, leistung: 'zweitschluessel' }).passendePartnerIds).toEqual(['1']);
  });
});
