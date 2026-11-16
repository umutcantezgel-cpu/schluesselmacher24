import { readFileSync } from 'node:fs';
import path from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

import { passendePartner, terminstandorte, type PartnerFuerWeg } from '../auftragsweg';
import { AUFTRAGSART_SAMMELWERT } from '../partner/leistungen';
import { deckendePartnerMitGrund, type PartnerFuerRegion } from '../partner/region';
import type { CityPage } from '../types';

import { abdeckungsAuskunft } from './abdeckung';
import { postleitzahlAuskunft } from './abfrage';
import { ortsstammIndexLesen } from './dateien';
import type { OrtsstammIndex } from './index-stamm';
import { gemeindenMitPartner, ortsseitenMitLage } from './ortsseiten';

/*
 * Umkreis und Regionen am echten Ortsstamm (FA-PLATTFORM-01C), Stichprobe Lahn-Dill-Kreis (06532). Erfundene
 * Betriebe (G13). Abstände laut Stamm: 35576 Wetzlar → 35606 Solms 9 km, → 35390 Gießen 10,8 km, → 35683
 * Dillenburg 25,3 km. 45117 ist eine Großempfänger-Postleitzahl und steht nicht im Stamm (A-068).
 */

let stamm: OrtsstammIndex;
beforeAll(async () => {
  stamm = await ortsstammIndexLesen();
});

const betrieb = (teil: Partial<PartnerFuerRegion> & { id: string }): PartnerFuerRegion => ({
  status: 'freigeschaltet',
  postleitzahlen: '',
  auftragsarten: ['funk'],
  ...teil,
});

describe('Auskunft aus dem Ortsstamm', () => {
  it('liefert Entfernung und Gemeinde und Kreis einer Postleitzahl', () => {
    const auskunft = abdeckungsAuskunft(stamm);
    expect(auskunft.entfernungKm('35576', '35606')).toBe(9);
    expect(auskunft.gebiet('35683')).toEqual({ gemeinden: ['06532006'], kreise: ['06532'] });
  });

  it('kennt eine Großempfänger-Postleitzahl nicht und bricht nicht', () => {
    const auskunft = abdeckungsAuskunft(stamm);
    expect(stamm.postleitzahl('45117')).toBeUndefined();
    expect(auskunft.entfernungKm('35576', '45117')).toBeNull();
    expect(auskunft.gebiet('45117')).toBeNull();
  });
});

describe('Eine Definition mit dem Stamm (FA-PLATTFORM-01C)', () => {
  const umkreis = betrieb({ id: 'umkreis-wetzlar', plz: '35576', radiusKm: 20 });
  const landkreis = betrieb({ id: 'lahn-dill', regionen: [{ art: 'landkreis', name: 'Lahn-Dill-Kreis', schluessel: '06532' }] });
  const ort = betrieb({ id: 'dillenburg', regionen: [{ art: 'ort', name: 'Dillenburg', schluessel: '06532006' }] });

  it('Umkreis: Gießen ja, Dillenburg nein; Region: Dillenburg ja, Gießen nein', () => {
    const auskunft = abdeckungsAuskunft(stamm);
    const giessen = deckendePartnerMitGrund('35390', 'funk', [umkreis, landkreis, ort], auskunft);
    expect(giessen.map((t) => t.partner.id)).toEqual(['umkreis-wetzlar']);
    expect(giessen[0].gruende).toEqual([{ art: 'umkreis', km: 10.8, radiusKm: 20, von: '35576' }]);
    const dillenburg = deckendePartnerMitGrund('35683', 'funk', [umkreis, landkreis, ort], auskunft);
    expect(dillenburg.map((t) => t.partner.id)).toEqual(['lahn-dill', 'dillenburg']);
  });

  it('unbekannte Postleitzahl: Umkreis und Region treffen nicht, ein Muster trifft weiter', () => {
    const auskunft = abdeckungsAuskunft(stamm);
    const muster = betrieb({ id: 'muster', postleitzahlen: '45117' });
    expect(deckendePartnerMitGrund('45117', 'funk', [umkreis, landkreis, ort, muster], auskunft).map((t) => t.partner.id)).toEqual(['muster']);
    // Unbekannte Postleitzahl des Betriebs: Der Umkreis wirkt nicht.
    expect(deckendePartnerMitGrund('35576', 'funk', [{ ...umkreis, plz: '45117' }], auskunft)).toEqual([]);
  });

  it('Postleitzahl-Abfrage rechnet mit Umkreis und Region', () => {
    expect(postleitzahlAuskunft('35390', stamm, { partner: [umkreis] })?.partnerVorhanden).toBe(true);
    expect(postleitzahlAuskunft('35683', stamm, { partner: [umkreis] })?.partnerVorhanden).toBe(false);
    expect(postleitzahlAuskunft('35683', stamm, { partner: [landkreis] })?.partnerVorhanden).toBe(true);
    expect(postleitzahlAuskunft('35683', stamm, { partner: [{ ...landkreis, status: 'pausiert' }] })?.partnerVorhanden).toBe(false);
  });

  it('Ortsseiten und Prioritätsorte: „Partner deckt ab“ auch über Umkreis und Landkreis', () => {
    const cities = JSON.parse(readFileSync(path.resolve(__dirname, '../../../content/cities.json'), 'utf8')) as CityPage[];
    const [ohne] = ortsseitenMitLage(cities, { stamm, werkstattPlz: '35576', partner: [] });
    const [mitUmkreis] = ortsseitenMitLage(cities, { stamm, werkstattPlz: '35576', partner: [umkreis] });
    const [gesperrt] = ortsseitenMitLage(cities, { stamm, werkstattPlz: '35576', partner: [{ ...umkreis, status: 'gesperrt' }] });
    expect(ohne.lage?.partnerDeckt).toBe(false);
    expect(mitUmkreis.lage?.partnerDeckt).toBe(true);
    expect(gesperrt.lage?.partnerDeckt).toBe(false);
    const auskunft = abdeckungsAuskunft(stamm);
    // Dillenburg (06532006) liegt im Kreis, aber außerhalb von 20 km um Wetzlar.
    expect([...gemeindenMitPartner(stamm, ['06532023', '06532006'], [umkreis], auskunft)]).toEqual(['06532023']);
    expect([...gemeindenMitPartner(stamm, ['06532023', '06532006'], [landkreis], auskunft)].sort()).toEqual(['06532006', '06532023']);
    // Ohne Auskunft wie bisher: nur Muster.
    expect(gemeindenMitPartner(stamm, ['06532023'], [landkreis]).size).toBe(0);
  });

  it('Partnerweg (Schalter): dieselbe Abdeckung, nur Modell B, Zahlweg unverändert', () => {
    const auskunft = abdeckungsAuskunft(stamm);
    const weg: PartnerFuerWeg = { id: 'b', status: 'freigeschaltet', postleitzahlen: [], auftragsarten: ['funk'], abrechnungsmodell: 'B', plz: '35576', radiusKm: 20 };
    expect(passendePartner('35390', [weg], 'funk', auskunft).map((p) => p.id)).toEqual(['b']);
    expect(passendePartner('35390', [weg], 'funk')).toEqual([]);
    expect(passendePartner('35390', [{ ...weg, abrechnungsmodell: 'A' }], 'funk', auskunft)).toEqual([]);
    expect(passendePartner('35390', [{ ...weg, status: 'pausiert' }], 'funk', auskunft)).toEqual([]);
    expect(passendePartner('35683', [weg], 'funk', auskunft)).toEqual([]);
    expect(passendePartner('35390', [weg], AUFTRAGSART_SAMMELWERT, auskunft).map((p) => p.id)).toEqual(['b']);

    const eingabe = { postleitzahl: '35390', partner: [weg], partnerwegAktiv: true, eigenbereich: { label: 'Test', postalPatterns: ['355*'] } };
    expect(terminstandorte({ ...eingabe, abdeckung: auskunft }).passendePartnerIds).toEqual(['b']);
    expect(terminstandorte(eingabe)).toMatchObject({ passendePartnerIds: [], ohnePartner: true });
    expect(terminstandorte({ ...eingabe, partnerwegAktiv: false, abdeckung: auskunft }).passendePartnerIds).toEqual([]);
  });
});
