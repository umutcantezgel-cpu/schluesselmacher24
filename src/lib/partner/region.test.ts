import { describe, expect, it } from 'vitest';

import { terminstandorte } from '../auftragsweg';

import { AUFTRAGSART_SAMMELWERT, auftragsartFuerLeistung, auftragsartFuerVorgang } from './leistungen';
import {
  abdeckungsGrundText,
  abdeckungsGruende,
  brauchtOrtsstamm,
  deckendePartner,
  deckendePartnerMitGrund,
  regionGeprueftAus,
  type AbdeckungsAuskunft,
  type PartnerFuerRegion,
} from './region';

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

  it('ohne Auskunft wie bisher: ohne Postleitzahlen keine Abdeckung, auch nicht über Umkreis oder Region', () => {
    const nurUmkreis = P({ id: 'nur-umkreis', postleitzahlen: null, plz: '10001', radiusKm: 50, regionen: [{ art: 'landkreis', name: 'Kreis A', schluessel: '01001' }] });
    expect(ids(deckendePartner('10002', 'funk', [nurUmkreis]))).toEqual([]);
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

/* FA-PLATTFORM-01C: Umkreis und Regionen. Erfundene Auskunft mit erfundenen Postleitzahlen und Schlüsseln (R4):
 * 10001 und 10002 liegen 8 km auseinander, 10003 liegt 40 km von 10001, 10009 kennt der Stamm nicht. */
const ENTFERNUNG: Record<string, number> = { '10001|10002': 8, '10001|10003': 40, '10001|10001': 0 };
const GEBIET: Record<string, { gemeinden: string[]; kreise: string[] }> = {
  '10001': { gemeinden: ['01001001'], kreise: ['01001'] },
  '10002': { gemeinden: ['01001002'], kreise: ['01001'] },
  '10003': { gemeinden: ['01002003'], kreise: ['01002'] },
};
const AUSKUNFT: AbdeckungsAuskunft = {
  entfernungKm: (a, b) => ENTFERNUNG[`${a}|${b}`] ?? ENTFERNUNG[`${b}|${a}`] ?? null,
  gebiet: (plz) => GEBIET[plz] ?? null,
};

describe('Abdeckung über Umkreis und Region (FA-PLATTFORM-01C)', () => {
  // Punkt „Region und Radius“ erledigt (A-070); ohne ihn zählen nur die Muster (eigener Block unten).
  const umkreis = P({ id: 'umkreis-10', postleitzahlen: '', plz: '10001', radiusKm: 10, regionGeprueft: true });
  const ort = P({ id: 'ort', postleitzahlen: '', regionen: [{ art: 'ort', name: 'Gemeinde B', schluessel: '01001002' }], regionGeprueft: true });
  const kreis = P({ id: 'kreis', postleitzahlen: '', regionen: [{ art: 'landkreis', name: 'Kreis C', schluessel: '01002' }], regionGeprueft: true });

  it('Umkreis: trifft bis zum Umkreis, nicht darüber, und nennt die Kilometer', () => {
    expect(deckendePartnerMitGrund('10002', 'funk', [umkreis], AUSKUNFT)).toEqual([
      { partner: umkreis, gruende: [{ art: 'umkreis', km: 8, radiusKm: 10, von: '10001' }] },
    ]);
    expect(ids(deckendePartner('10003', 'funk', [umkreis], AUSKUNFT))).toEqual([]);
    expect(ids(deckendePartner('10003', 'funk', [{ ...umkreis, radiusKm: 40 }], AUSKUNFT))).toEqual(['umkreis-10']);
    expect(abdeckungsGrundText({ art: 'umkreis', km: 12.4, radiusKm: 20, von: '35576' })).toBe('Umkreis: 12,4 km von 35576 (bis 20 km)');
  });

  it('Umkreis wirkt nicht ohne Postleitzahl des Betriebs, mit unbekannter Postleitzahl des Betriebs oder mit 0 km', () => {
    expect(ids(deckendePartner('10002', 'funk', [{ ...umkreis, plz: null }], AUSKUNFT))).toEqual([]);
    expect(ids(deckendePartner('10002', 'funk', [{ ...umkreis, plz: '10009' }], AUSKUNFT))).toEqual([]);
    expect(ids(deckendePartner('10001', 'funk', [{ ...umkreis, radiusKm: 0 }], AUSKUNFT))).toEqual([]);
  });

  it('Region: Ort über den Gemeindeschlüssel, Landkreis über den Kreisschlüssel', () => {
    expect(deckendePartnerMitGrund('10002', 'funk', [ort], AUSKUNFT)[0]?.gruende).toEqual([
      { art: 'region', ebene: 'ort', name: 'Gemeinde B', schluessel: '01001002' },
    ]);
    expect(ids(deckendePartner('10001', 'funk', [ort], AUSKUNFT))).toEqual([]);
    expect(deckendePartnerMitGrund('10003', 'funk', [kreis], AUSKUNFT)[0]?.gruende).toEqual([
      { art: 'region', ebene: 'landkreis', name: 'Kreis C', schluessel: '01002' },
    ]);
    expect(ids(deckendePartner('10002', 'funk', [kreis], AUSKUNFT))).toEqual([]);
    expect(abdeckungsGrundText({ art: 'region', ebene: 'landkreis', name: 'Lahn-Dill-Kreis', schluessel: '06532' })).toBe('Landkreis Lahn-Dill-Kreis (06532)');
  });

  it('Region ohne Schlüssel oder mit Schlüssel der anderen Länge trifft nicht; Namen werden nicht verglichen', () => {
    const nurName = P({ id: 'nur-name', postleitzahlen: '', regionen: [{ art: 'landkreis', name: 'Kreis C', schluessel: null }], regionGeprueft: true });
    const falscheLaenge = P({ id: 'ort-mit-kreis', postleitzahlen: '', regionen: [{ art: 'ort', name: 'Kreis C', schluessel: '01002' }], regionGeprueft: true });
    expect(deckendePartner('10003', 'funk', [nurName, falscheLaenge], AUSKUNFT)).toEqual([]);
  });

  it('Postleitzahl: Grund nennt das passende Muster', () => {
    expect(abdeckungsGruende('35576', 'funk', PARTNER[0], AUSKUNFT)).toEqual([{ art: 'postleitzahl', muster: '35*' }]);
    expect(abdeckungsGruende('35577', 'schluessel-nachmachen', PARTNER[1], AUSKUNFT)).toEqual([{ art: 'postleitzahl', muster: '355*' }]);
    expect(abdeckungsGruende('36044', 'funk', PARTNER[0], AUSKUNFT)).toEqual([]);
    expect(abdeckungsGrundText({ art: 'postleitzahl', muster: '355*' })).toBe('Postleitzahl 355*');
  });

  it('nennt alle zutreffenden Gründe eines Betriebs', () => {
    const alles = P({ id: 'alles', postleitzahlen: '100*', plz: '10001', radiusKm: 10, regionen: [{ art: 'landkreis', name: 'Kreis A', schluessel: '01001' }], regionGeprueft: true });
    expect(abdeckungsGruende('10002', 'funk', alles, AUSKUNFT).map((g) => g.art)).toEqual(['postleitzahl', 'umkreis', 'region']);
  });

  it('pausierte und gesperrte Betriebe nie, auch nicht über Umkreis oder Region', () => {
    for (const status of ['pausiert', 'gesperrt', 'in-pruefung', 'beendet'] as const) {
      const betriebe = [umkreis, ort].map((p) => ({ ...p, status }));
      expect(deckendePartner('10002', 'funk', betriebe, AUSKUNFT)).toEqual([]);
    }
  });

  it('Leistung zählt auch bei Umkreis und Region', () => {
    expect(ids(deckendePartner('10002', 'schluessel-nachmachen', [umkreis, ort], AUSKUNFT))).toEqual([]);
  });

  it('unbekannte Postleitzahl bricht nicht: Umkreis und Region treffen nicht, ein Muster trifft weiter', () => {
    const mitMuster = { ...umkreis, id: 'muster', postleitzahlen: '10009', regionen: [{ art: 'landkreis', name: 'Kreis A', schluessel: '01001' }] };
    expect(() => deckendePartner('10009', 'funk', [umkreis, ort, kreis, mitMuster], AUSKUNFT)).not.toThrow();
    expect(deckendePartnerMitGrund('10009', 'funk', [umkreis, ort, kreis, mitMuster], AUSKUNFT)).toEqual([
      { partner: mitMuster, gruende: [{ art: 'postleitzahl', muster: '10009' }] },
    ]);
    // Auch eine Auskunft, die nichts weiß, bricht nicht.
    const leer: AbdeckungsAuskunft = { entfernungKm: () => null, gebiet: () => null };
    expect(deckendePartner('10002', 'funk', [umkreis, ort, kreis], leer)).toEqual([]);
    expect(deckendePartner('kein', 'funk', [umkreis, ort, kreis], AUSKUNFT)).toEqual([]);
  });

  it('braucht den Ortsstamm nur bei Umkreis mit Postleitzahl oder Region mit Schlüssel', () => {
    expect(brauchtOrtsstamm(PARTNER)).toBe(false);
    expect(brauchtOrtsstamm([umkreis])).toBe(true);
    expect(brauchtOrtsstamm([{ ...umkreis, plz: null }])).toBe(false);
    expect(brauchtOrtsstamm([kreis])).toBe(true);
    expect(brauchtOrtsstamm([P({ id: 'x', regionen: [{ art: 'ort', name: 'Nur Name', schluessel: '' }], regionGeprueft: true })])).toBe(false);
    // Ohne erledigten Punkt „Region und Radius“ zählen nur die Muster; der Stamm wird nicht gebraucht.
    expect(brauchtOrtsstamm([{ ...umkreis, regionGeprueft: false }, { ...kreis, regionGeprueft: null }])).toBe(false);
  });
});

describe('Regel „Region geprüft“ (A-070): Umkreis und Region erst mit erledigtem Punkt „Region und Radius“', () => {
  const ERLEDIGT = { erledigt: true, am: '2026-11-16', pruefer: 'Testprüferin' };
  const umkreis = P({ id: 'umkreis', postleitzahlen: '', plz: '10001', radiusKm: 10 });
  const ort = P({ id: 'ort', postleitzahlen: '', regionen: [{ art: 'ort', name: 'Gemeinde B', schluessel: '01001002' }] });
  const kreis = P({ id: 'kreis', postleitzahlen: '', regionen: [{ art: 'landkreis', name: 'Kreis A', schluessel: '01001' }] });
  const muster = P({ id: 'muster', postleitzahlen: '10002', plz: '10001', radiusKm: 10, regionen: [{ art: 'landkreis', name: 'Kreis A', schluessel: '01001' }] });

  it('Punkt erledigt heißt Haken, Datum und Prüfer', () => {
    expect(regionGeprueftAus({ region: ERLEDIGT })).toBe(true);
    expect(regionGeprueftAus({ region: { ...ERLEDIGT, am: null } })).toBe(false);
    expect(regionGeprueftAus({ region: { ...ERLEDIGT, pruefer: '  ' } })).toBe(false);
    expect(regionGeprueftAus({ region: { ...ERLEDIGT, erledigt: false } })).toBe(false);
    expect(regionGeprueftAus({ region: null })).toBe(false);
    expect(regionGeprueftAus(null)).toBe(false);
    expect(regionGeprueftAus(undefined)).toBe(false);
  });

  it('Umkreis trifft nur mit erledigtem Punkt', () => {
    expect(ids(deckendePartner('10002', 'funk', [{ ...umkreis, regionGeprueft: true }], AUSKUNFT))).toEqual(['umkreis']);
    expect(ids(deckendePartner('10002', 'funk', [umkreis], AUSKUNFT))).toEqual([]);
    expect(ids(deckendePartner('10002', 'funk', [{ ...umkreis, regionGeprueft: false }], AUSKUNFT))).toEqual([]);
    expect(ids(deckendePartner('10002', 'funk', [{ ...umkreis, regionGeprueft: regionGeprueftAus({ region: { ...ERLEDIGT, am: '' } }) }], AUSKUNFT))).toEqual([]);
    expect(ids(deckendePartner('10002', 'funk', [{ ...umkreis, regionGeprueft: regionGeprueftAus({ region: { ...ERLEDIGT, pruefer: null } }) }], AUSKUNFT))).toEqual([]);
  });

  it('Ort und Landkreis treffen nur mit erledigtem Punkt', () => {
    expect(ids(deckendePartner('10002', 'funk', [{ ...ort, regionGeprueft: true }, { ...kreis, regionGeprueft: true }], AUSKUNFT))).toEqual(['ort', 'kreis']);
    expect(ids(deckendePartner('10002', 'funk', [ort, kreis], AUSKUNFT))).toEqual([]);
    for (const region of [{ ...ERLEDIGT, am: null }, { ...ERLEDIGT, pruefer: '' }, { ...ERLEDIGT, erledigt: false }]) {
      const geprueft = regionGeprueftAus({ region });
      expect(ids(deckendePartner('10002', 'funk', [{ ...ort, regionGeprueft: geprueft }, { ...kreis, regionGeprueft: geprueft }], AUSKUNFT))).toEqual([]);
    }
  });

  it('ohne erledigten Punkt zählt nur das Muster', () => {
    expect(abdeckungsGruende('10002', 'funk', muster, AUSKUNFT)).toEqual([{ art: 'postleitzahl', muster: '10002' }]);
    expect(abdeckungsGruende('10002', 'funk', { ...muster, regionGeprueft: true }, AUSKUNFT).map((g) => g.art)).toEqual(['postleitzahl', 'umkreis', 'region']);
  });

  it('Betrieb „vor Einführung der Prüfliste“ mit Umkreis deckt nur über sein Muster ab', () => {
    const altbestand = { pruefliste: { vorEinfuehrung: true, region: null } };
    const betrieb = { ...muster, id: 'altbestand', postleitzahlen: '355*', regionGeprueft: regionGeprueftAus(altbestand.pruefliste) };
    expect(betrieb.regionGeprueft).toBe(false);
    expect(ids(deckendePartner('10002', 'funk', [betrieb], AUSKUNFT))).toEqual([]);
    expect(deckendePartnerMitGrund('35576', 'funk', [betrieb], AUSKUNFT)).toEqual([{ partner: betrieb, gruende: [{ art: 'postleitzahl', muster: '355*' }] }]);
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
