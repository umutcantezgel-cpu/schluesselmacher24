import { beforeAll, describe, expect, it } from 'vitest';

import { postleitzahlAuskunft } from './abfrage';
import { ortsstammLesen } from './dateien';
import { entfernungZwischenPostleitzahlen, grosskreisKm } from './entfernung';
import { normalisierePostleitzahl, ortsstammIndex, type OrtsstammIndex } from './index-stamm';
import { gemeindenImUmfang, umfangAusUmgebung, zeileFuerGemeinde } from './uebernahme';
import type { OrtsstammDaten } from './typen';

let daten: OrtsstammDaten;
let stamm: OrtsstammIndex;

beforeAll(async () => {
  daten = await ortsstammLesen();
  stamm = ortsstammIndex(daten);
});

describe('Index des Ortsstamms', () => {
  it('findet Gemeinde nach Schlüssel und Adresse, Kreis und Postleitzahlen', () => {
    expect(stamm.gebietsstand).toBe('31.12.2025');
    expect(stamm.gemeinde('06532023')?.name).toBe('Wetzlar');
    expect(stamm.gemeindeNachSlug('wetzlar')?.schluessel).toBe('06532023');
    expect(stamm.kreis('06532')?.name).toBe('Lahn-Dill-Kreis');
    expect(stamm.postleitzahlenDerGemeinde('06532023')).toEqual(['35576', '35578', '35579', '35580', '35581', '35582', '35583', '35584', '35585', '35586']);
    expect(stamm.gemeindenDesKreises('06532').map((g) => g.name)).toContain('Herborn');
    expect(stamm.postleitzahl(' 35576 ')?.orte).toEqual(['Wetzlar']);
    expect(stamm.postleitzahl('3557')).toBeUndefined();
  });

  it('normalisiert Postleitzahlen', () => {
    expect(normalisierePostleitzahl('35 576')).toBe('35576');
    expect(normalisierePostleitzahl('A-1010')).toBeNull();
    expect(normalisierePostleitzahl(undefined)).toBeNull();
  });
});

describe('Entfernung zwischen Postleitzahlen (Großkreis)', () => {
  it('Stichprobe 1: Wetzlar 35576 und Gießen 35390, 10,8 km Luftlinie', () => {
    // Von Hand: 0,0184° Breite = 2,05 km, 0,1495° Länge × cos 50,58° = 10,57 km, Wurzel der Quadratsumme 10,77 km.
    expect(entfernungZwischenPostleitzahlen('35576', '35390', stamm)).toBe(10.8);
  });

  it('Stichprobe 2: Berlin 10115 und Hamburg 20095, rund 255 km Luftlinie', () => {
    const km = entfernungZwischenPostleitzahlen('10115', '20095', stamm)!;
    expect(km).toBeGreaterThan(250);
    expect(km).toBeLessThan(262);
  });

  it('Stichprobe 3: Frankfurt am Main 60311 und München 80331, rund 300 km Luftlinie', () => {
    const km = entfernungZwischenPostleitzahlen('60311', '80331', stamm)!;
    expect(km).toBeGreaterThan(295);
    expect(km).toBeLessThan(310);
  });

  it('ist symmetrisch, null bei gleicher Postleitzahl und ohne Eintrag', () => {
    expect(entfernungZwischenPostleitzahlen('35576', '35576', stamm)).toBe(0);
    expect(entfernungZwischenPostleitzahlen('80331', '60311', stamm)).toBe(entfernungZwischenPostleitzahlen('60311', '80331', stamm));
    expect(entfernungZwischenPostleitzahlen('35576', '00000', stamm)).toBeNull();
  });

  it('rechnet einen Breitengrad als rund 111,2 km', () => {
    expect(grosskreisKm({ breite: 50, laenge: 8 }, { breite: 51, laenge: 8 })).toBeCloseTo(111.2, 1);
  });
});

describe('Postleitzahl-Abfrage', () => {
  const partner = (postleitzahlen: string, status = 'freigeschaltet') => ({
    id: '1',
    status: status as never,
    postleitzahlen,
    auftragsarten: ['schluessel-nachmachen'],
  });

  it('nennt Ort, Kreis, Land und Eigenbereich', () => {
    expect(postleitzahlAuskunft('35576', stamm)).toEqual({
      plz: '35576',
      bekannt: true,
      orte: ['Wetzlar'],
      gemeinden: [{ schluessel: '06532023', name: 'Wetzlar', slug: 'wetzlar' }],
      kreise: [{ schluessel: '06532', name: 'Lahn-Dill-Kreis' }],
      land: 'Hessen',
      eigenbereich: true,
      partnerVorhanden: false,
    });
    const muenchen = postleitzahlAuskunft('80331', stamm, { eigenbereich: { label: 'Wetzlar', postalPatterns: ['355*'] } })!;
    expect(muenchen).toMatchObject({ land: 'Bayern', eigenbereich: false, partnerVorhanden: false });
  });

  it('meldet einen Partner nur, wenn ein freigeschalteter abdeckt, ohne Namen', () => {
    expect(postleitzahlAuskunft('80331', stamm, { partner: [partner('80*')] })?.partnerVorhanden).toBe(true);
    expect(postleitzahlAuskunft('80331', stamm, { partner: [partner('80*', 'pausiert')] })?.partnerVorhanden).toBe(false);
    expect(postleitzahlAuskunft('80331', stamm, { partner: [partner('81*')] })?.partnerVorhanden).toBe(false);
    expect(postleitzahlAuskunft('80331', stamm, { partner: [partner('80*')], leistung: 'transponder' })?.partnerVorhanden).toBe(false);
    expect(JSON.stringify(postleitzahlAuskunft('80331', stamm, { partner: [partner('80*')] }))).not.toContain('"id"');
  });

  it('kennt Postleitzahlen ohne Eintrag und lehnt ungültige Eingaben ab', () => {
    expect(postleitzahlAuskunft('00000', stamm)).toMatchObject({ bekannt: false, orte: [], land: null });
    expect(postleitzahlAuskunft('123', stamm)).toBeNull();
  });
});

describe('Umfang der Datenbankübernahme', () => {
  it('Stichprobe: Lahn-Dill-Kreis und Prioritätsliste, deutlich kleiner als der Stamm', () => {
    const probe = gemeindenImUmfang(daten, 'stichprobe');
    expect(probe.some((g) => g.schluessel === '06532023')).toBe(true);
    expect(probe.some((g) => g.schluessel === '11000000')).toBe(true);
    expect(probe.length).toBeGreaterThan(348);
    expect(probe.length).toBeLessThan(500);
    expect(gemeindenImUmfang(daten, 'voll')).toHaveLength(10751);
    expect(gemeindenImUmfang(daten, 'aus')).toHaveLength(0);
  });

  it('Umfang aus der Umgebung, sonst voll', () => {
    expect(umfangAusUmgebung('stichprobe')).toBe('stichprobe');
    expect(umfangAusUmgebung('aus')).toBe('aus');
    expect(umfangAusUmgebung(undefined)).toBe('voll');
    expect(umfangAusUmgebung('alles')).toBe('voll');
  });

  it('Zeile mit Kreis, Land und Postleitzahlen', () => {
    const wetzlar = stamm.gemeinde('06532023')!;
    expect(zeileFuerGemeinde(wetzlar, 'Lahn-Dill-Kreis', '31.12.2025', ['35576', '35578'])).toMatchObject({
      gemeindeschluessel: '06532023',
      kreis_name: 'Lahn-Dill-Kreis',
      land: 'Hessen',
      plz_verwaltungssitz: '35578',
      postleitzahlen: '35576, 35578',
      stand: '31.12.2025',
    });
  });
});
