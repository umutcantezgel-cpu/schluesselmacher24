import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import type { PartnerFuerRegion } from '../partner/region';
import { EINLEITUNG_MINDESTLAENGE, stadtIndexierbar } from '../rechtliches/indexierung';
import type { CityPage, CompanyProfile } from '../types';

import { ortsstammLesen } from './dateien';
import { ortsstammIndex } from './index-stamm';
import {
  anhangARang,
  gemeindeNamePasst,
  gemeindenMitPartner,
  kontaktweg,
  kreisAnzeige,
  ortsseitenMitLage,
  ortsseitenOrdnen,
  partnerbezug,
  PARTNERBEZUG_SATZ,
  prioritaetsorteZeilen,
  vorgaengeJeGemeinde,
  werkstattAnschrift,
} from './ortsseiten';
import type { OrtsstammDaten } from './typen';

/*
 * Ortsseiten am Stamm (FA-PLATTFORM-03B). Erfundener Kleinstamm (G4): Musterstadt mit der Werkstatt, Nachbarort im
 * selben Kreis, Fernort in einem anderen Land, Leerort ohne Postleitzahl. Wetzlar zusätzlich mit dem echten Stamm.
 */

const HERKUNFT = { datei: 'test', sha256: '0' };
const gemeinde = (schluessel: string, name: string, kreis: string, plz: string) => ({
  schluessel,
  regionalschluessel: `${schluessel}0000`,
  name,
  bezeichnung: null,
  art: 'gemeinde' as const,
  slug: name.toLowerCase(),
  kreis,
  land: schluessel.slice(0, 2),
  plz,
  breite: 50,
  laenge: 8,
  einwohner: 1000,
});

const DATEN: OrtsstammDaten = {
  gemeinden: {
    quelle: 'test',
    herkunft: { ...HERKUNFT, gebietsstand: '31.12.2025' },
    hinweis: '',
    anzahl: 4,
    gemeinden: [
      gemeinde('06999001', 'Musterstadt', '06999', '35001'),
      gemeinde('06999002', 'Nachbarort', '06999', '35002'),
      gemeinde('09888001', 'Fernort', '09888', '90001'),
      gemeinde('09888002', 'Leerort', '09888', '90009'),
    ],
  },
  kreise: {
    quelle: 'test',
    herkunft: HERKUNFT,
    anzahl: 2,
    kreise: [
      { schluessel: '06999', name: 'Musterkreis', art: 'landkreis', land: '06' },
      { schluessel: '09888', name: 'Fernstadt, Stadt', art: 'kreisfreie-stadt', land: '09' },
    ],
  },
  postleitzahlen: {
    quelle: 'test',
    herkunft: HERKUNFT,
    hinweis: '',
    anzahl: 4,
    postleitzahlen: [
      { plz: '35001', orte: ['Musterstadt'], kreise: ['06999'], gemeinden: ['06999001'], breite: 50, laenge: 8 },
      { plz: '35002', orte: ['Nachbarort'], kreise: ['06999'], gemeinden: ['06999002'], breite: 50, laenge: 8 },
      { plz: '90001', orte: ['Fernort'], kreise: ['09888'], gemeinden: ['09888001'], breite: 49, laenge: 11 },
      { plz: '90002', orte: ['Fernort'], kreise: ['09888'], gemeinden: ['09888001'], breite: 49, laenge: 11 },
    ],
  },
  prioritaet: {
    quelle: 'test',
    hinweis: '',
    gebietsstand: '31.12.2025',
    anzahl: 3,
    offen: 1,
    eintraege: [
      { land: '09', rang: 1, name: 'Fernort', schluessel: '09888001', amtlicherName: 'Fernort', zuordnung: 'name' },
      { land: '09', rang: 2, name: 'Doppelort', schluessel: null, amtlicherName: null, zuordnung: 'offen', kandidaten: ['Doppelort (09888003)', 'Doppelort (06999003)'], vorschlag: '09888003' },
      { land: '06', rang: 4, name: 'Nachbarort', schluessel: '06999002', amtlicherName: 'Nachbarort', zuordnung: 'name' },
    ],
  },
};
const STAMM = ortsstammIndex(DATEN);

const EIGENER_TEXT =
  'In Musterstadt fertigen wir Schlüssel in der Werkstatt am Markt, programmieren Autoschlüssel nach Termin und geben Bestellungen zur Abholung aus. Anreise aus dem ganzen Kreis.';

function ort(id: string, stadt: string, schluessel: string | null, intro: string = EIGENER_TEXT.replaceAll('Musterstadt', stadt), extra: Partial<CityPage> = {}): CityPage {
  return {
    id,
    slug: id,
    city: stadt,
    state: 'Hessen',
    localIntro: intro,
    localFacts: [],
    servicesOffered: ['autoschluessel'],
    onSiteRadiusKm: 0,
    seo: { title: `Schlüssel in ${stadt}`, description: 'Werkstatt und Leistungen.', internalLinks: [] },
    updatedAt: '2026-11-01T00:00:00.000Z',
    gemeindeschluessel: schluessel,
    ...extra,
  };
}

const partner = (status: PartnerFuerRegion['status'], postleitzahlen: string): PartnerFuerRegion => ({
  id: `p-${status}`,
  status,
  postleitzahlen,
  auftragsarten: ['autoschluessel-vor-ort'],
});

const KONTEXT = { stamm: STAMM, werkstattPlz: '35001', partner: [] as PartnerFuerRegion[] };

describe('Lage einer Ortsseite am Stamm', () => {
  it('verknüpft Gemeinde, Kreis, Land und Postleitzahlen über den Gemeindeschlüssel', () => {
    const [fern] = ortsseitenMitLage([ort('fern', 'Fernort', '09888001')], KONTEXT);
    expect(fern.lage).toMatchObject({
      gemeinde: { schluessel: '09888001', name: 'Fernort' },
      kreis: { schluessel: '09888', name: 'Fernstadt, Stadt', art: 'kreisfreie-stadt' },
      land: 'Bayern',
      postleitzahlen: ['90001', '90002'],
      prioritaet: 1,
    });
    expect(kreisAnzeige(fern.lage!.kreis)).toEqual({ bezeichnung: 'Kreisfreie Stadt', name: 'Fernstadt' });
  });

  it('Gemeinde ohne Postleitzahl im Stamm: leere Liste, kein Fehler', () => {
    const [leer] = ortsseitenMitLage([ort('leer', 'Leerort', '09888002')], KONTEXT);
    expect(leer.lage?.postleitzahlen).toEqual([]);
    expect(leer.lage?.gemeinde?.name).toBe('Leerort');
  });

  it('Werkstatt im Ort, im Kreis oder nicht', () => {
    const orte = ortsseitenMitLage(
      [ort('muster', 'Musterstadt', '06999001'), ort('nachbar', 'Nachbarort', '06999002'), ort('fern', 'Fernort', '09888001')],
      KONTEXT,
    );
    const werkstatt = Object.fromEntries(orte.map((o) => [o.id, o.lage?.werkstatt]));
    expect(werkstatt).toEqual({ muster: 'ort', nachbar: 'kreis', fern: null });
  });
});

describe('Veröffentlichung nur mit Substanz (FA-09-05, R2, R3)', () => {
  it('Wetzlar bleibt mit dem echten Stamm indexierbar (Werkstatt im Ort)', async () => {
    const stamm = ortsstammIndex(await ortsstammLesen());
    const cities = JSON.parse(readFileSync(path.resolve(__dirname, '../../../content/cities.json'), 'utf8')) as CityPage[];
    const [wetzlar] = ortsseitenMitLage(cities, { stamm, werkstattPlz: '35576', partner: [] });
    expect(wetzlar.gemeindeschluessel).toBe('06532023');
    expect(wetzlar.lage).toMatchObject({ werkstatt: 'ort', kreis: { name: 'Lahn-Dill-Kreis' }, gruende: [] });
    expect(wetzlar.lage?.postleitzahlen).toContain('35576');
    expect(stadtIndexierbar(wetzlar)).toBe(true);
  });

  it('Ortsseite mit Platzhaltertext bleibt noindex', () => {
    const [platz] = ortsseitenMitLage([ort('muster', 'Musterstadt', '06999001', `[Platzhalter: örtliche Einleitung] ${EIGENER_TEXT}`)], KONTEXT);
    expect(stadtIndexierbar(platz)).toBe(false);
    expect(platz.lage?.gruende.join(' ')).toContain('Platzhalter');
  });

  it('zu kurze Einleitung bleibt noindex', () => {
    const [kurz] = ortsseitenMitLage([ort('muster', 'Musterstadt', '06999001', 'Werkstatt am Markt.')], KONTEXT);
    expect(stadtIndexierbar(kurz)).toBe(false);
    expect(kurz.lage?.gruende.join(' ')).toContain(`mindestens ${EINLEITUNG_MINDESTLAENGE} Zeichen`);
  });

  it('zwei wortgleiche Ortsseiten bleiben beide noindex, auch wenn nur der Ortsname getauscht ist', () => {
    const muster = ort('muster', 'Musterstadt', '06999001');
    const nachbar = ort('nachbar', 'Nachbarort', '06999002'); // derselbe Text, nur mit „Nachbarort“
    expect(nachbar.localIntro).not.toBe(muster.localIntro);
    const orte = ortsseitenMitLage([muster, nachbar], KONTEXT);
    expect(orte.map(stadtIndexierbar)).toEqual([false, false]);
    expect(orte.find((o) => o.id === 'muster')?.lage?.gruende.join(' ')).toContain('„Nachbarort“');
    expect(orte.find((o) => o.id === 'nachbar')?.lage?.gruende.join(' ')).toContain('„Musterstadt“');

    // Wortgleich auch ohne Tausch des Namens (gleicher Text bei zwei Orten).
    const gleich = ortsseitenMitLage([ort('a', 'Musterstadt', '06999001', EIGENER_TEXT), ort('b', 'Nachbarort', '06999002', EIGENER_TEXT)], KONTEXT);
    expect(gleich.map(stadtIndexierbar)).toEqual([false, false]);
  });

  it('Ortsseite ohne Leistungsweg bleibt noindex und nennt den Grund', () => {
    const [fern] = ortsseitenMitLage([ort('fern', 'Fernort', '09888001')], KONTEXT);
    expect(stadtIndexierbar(fern)).toBe(false);
    expect(fern.lage?.gruende).toEqual([expect.stringContaining('Kein Leistungsweg')]);
  });

  it('ohne Gemeindeschlüssel gibt es keinen Leistungsweg über Werkstatt oder Partner', () => {
    const [ohne] = ortsseitenMitLage([ort('muster', 'Musterstadt', null)], { ...KONTEXT, partner: [partner('freigeschaltet', '35*')] });
    expect(ohne.lage).toMatchObject({ gemeinde: null, werkstatt: null, partnerDeckt: false });
    expect(stadtIndexierbar(ohne)).toBe(false);
  });

  it('ein freigeschalteter Partner ist ein Leistungsweg, ein pausierter oder gesperrter nicht', () => {
    const fern = ort('fern', 'Fernort', '09888001');
    for (const status of ['pausiert', 'gesperrt'] as const) {
      const [mit] = ortsseitenMitLage([fern], { ...KONTEXT, partner: [partner(status, '900*')] });
      expect(mit.lage?.partnerDeckt).toBe(false);
      expect(stadtIndexierbar(mit)).toBe(false);
    }
    const [frei] = ortsseitenMitLage([fern], { ...KONTEXT, partner: [partner('freigeschaltet', '90002')] });
    expect(frei.lage?.partnerDeckt).toBe(true);
    expect(stadtIndexierbar(frei)).toBe(true);
  });

  it('eine eingetragene Verfügbarkeit ist ein Leistungsweg, ein Platzhalter oder ein Wort nicht', () => {
    const mit = (verfuegbarkeit: string) => ortsseitenMitLage([ort('fern', 'Fernort', '09888001', undefined, { verfuegbarkeit })], KONTEXT)[0];
    expect(stadtIndexierbar(mit('Jeden ersten Dienstag im Monat vor Ort nach Termin.'))).toBe(true);
    expect(stadtIndexierbar(mit('[Platzhalter: Verfügbarkeit eintragen]'))).toBe(false);
    expect(stadtIndexierbar(mit('bald'))).toBe(false);
  });

  it('ohne berechnete Lage ist keine Ortsseite indexierbar', () => {
    expect(stadtIndexierbar(ort('muster', 'Musterstadt', '06999001'))).toBe(false);
  });

  it('noindex aus dem Admin bleibt noindex, auch mit Leistungsweg', () => {
    const [aus] = ortsseitenMitLage([ort('muster', 'Musterstadt', '06999001', undefined, { seo: { title: 'T', description: 'D', internalLinks: [], noindex: true } })], KONTEXT);
    expect(stadtIndexierbar(aus)).toBe(false);
  });
});

describe('Partnerbezug und Kontaktweg (FA-09-06)', () => {
  it('Partnerbezug erscheint nur mit abdeckendem Partner, ohne Namen', () => {
    const fern = ort('fern', 'Fernort', '09888001');
    const [ohne] = ortsseitenMitLage([fern], KONTEXT);
    const [mitFremdem] = ortsseitenMitLage([fern], { ...KONTEXT, partner: [partner('freigeschaltet', '35*')] });
    const [mit] = ortsseitenMitLage([fern], { ...KONTEXT, partner: [partner('freigeschaltet', '900*')] });
    expect(partnerbezug(ohne)).toBeNull();
    expect(partnerbezug(mitFremdem)).toBeNull();
    expect(partnerbezug(mit)).toBe(PARTNERBEZUG_SATZ);
    expect(PARTNERBEZUG_SATZ).not.toMatch(/p-freigeschaltet/);
  });

  it('Kontaktweg je Lage: Werkstatt, Partnerweg nur mit Schalter, sonst Anfrage', () => {
    const [muster, fern] = [
      ortsseitenMitLage([ort('muster', 'Musterstadt', '06999001')], KONTEXT)[0],
      ortsseitenMitLage([ort('fern', 'Fernort', '09888001')], { ...KONTEXT, partner: [partner('freigeschaltet', '900*')] })[0],
    ];
    expect(kontaktweg(muster, false).art).toBe('werkstatt');
    expect(kontaktweg(muster, false, 'Musterstadt').label).toBe('Termin in unserer Werkstatt in Musterstadt');
    expect(kontaktweg(fern, false)).toEqual({ art: 'anfrage', href: '/service-und-termin/anfrage', label: 'Anfrage stellen' });
    expect(kontaktweg(fern, true).art).toBe('partner');
    expect(kontaktweg({ ...muster, servicesOffered: ['schliessanlagen'] }, true).art).toBe('anfrage');
  });
});

describe('Werkstatt mit Anschrift (Knopf „Termin in unserer Werkstatt“)', () => {
  const firma = (extra: Partial<CompanyProfile> = {}) =>
    ({ street: 'Teststraße 1', postalCode: '35001', city: 'Musterstadt', isPlaceholder: false, ...extra }) as CompanyProfile;

  it('ohne eigene Werkstattadresse gilt der Firmensitz', () => {
    expect(werkstattAnschrift(firma())).toEqual({ label: 'Werkstatt', street: 'Teststraße 1', postalCode: '35001', city: 'Musterstadt' });
  });

  it('eine gepflegte Werkstattadresse geht vor, Platzhalter-Firmendaten zeigen nichts', () => {
    const mitWerkstatt = firma({ location: { label: 'Werkstatt und Abholung', street: 'Hofweg 2', postalCode: '35002', city: 'Nachbarort' } });
    expect(werkstattAnschrift(mitWerkstatt)?.city).toBe('Nachbarort');
    expect(werkstattAnschrift(firma({ isPlaceholder: true }))).toBeUndefined();
  });

  it('Werkstatt im Landkreis: der Knopf nennt den Ort der Werkstatt', () => {
    const [nachbar] = ortsseitenMitLage([ort('nachbar', 'Nachbarort', '06999002')], KONTEXT);
    expect(nachbar.lage?.werkstatt).toBe('kreis');
    expect(kontaktweg(nachbar, false, werkstattAnschrift(firma())?.city)).toEqual({
      art: 'werkstatt',
      href: '/autoschluessel/anfrage',
      label: 'Termin in unserer Werkstatt in Musterstadt',
    });
  });
});

describe('Verknüpfung am Stamm (FA-09: Stadt, Landkreis, Postleitzahl)', () => {
  it('ohne Gemeindeschlüssel bleibt die Seite noindex, auch mit eingetragener Verfügbarkeit, und nennt den Grund', () => {
    const verfuegbarkeit = 'Jeden ersten Dienstag im Monat vor Ort nach Termin.';
    const [ohne] = ortsseitenMitLage([ort('muster', 'Musterstadt', null, undefined, { verfuegbarkeit })], KONTEXT);
    expect(ohne.lage?.verfuegbarkeit).toBe(true);
    expect(stadtIndexierbar(ohne)).toBe(false);
    expect(ohne.lage?.gruende).toEqual([expect.stringContaining('Gemeindeschlüssel fehlt oder steht nicht im Ortsstamm')]);
  });

  it('ein Schlüssel, den der Stamm nicht kennt, bleibt noindex', () => {
    const [unbekannt] = ortsseitenMitLage([ort('muster', 'Musterstadt', '06999099')], KONTEXT);
    expect(unbekannt.lage?.gemeinde).toBeNull();
    expect(stadtIndexierbar(unbekannt)).toBe(false);
    expect(unbekannt.lage?.gruende.join(' ')).toContain('Gemeindeschlüssel fehlt oder steht nicht im Ortsstamm');
  });

  it('Name der Gemeinde passt zum Ort: Zusätze zählen nicht, ein fremder Ort fällt auf', () => {
    expect(gemeindeNamePasst('Wetzlar', 'Wetzlar')).toBe(true);
    expect(gemeindeNamePasst('Frankfurt', 'Frankfurt am Main')).toBe(true);
    expect(gemeindeNamePasst('Halle', 'Halle (Saale)')).toBe(true);
    expect(gemeindeNamePasst('Gießen', 'gießen')).toBe(true);
    expect(gemeindeNamePasst('Wetzlar', 'Aßlar')).toBe(false);
    expect(gemeindeNamePasst('Musterstadt', 'Nachbarort')).toBe(false);
  });
});

describe('Reihenfolge nach der Priorität des Inhabers (FA-09-04)', () => {
  it('aufsteigend nach Priorität, ohne Priorität hinten, dann nach Name', () => {
    const orte = ortsseitenMitLage(
      [
        ort('z', 'Zeta', null, undefined, { prioritaet: 2 }),
        ort('ohne-b', 'Beta', null),
        ort('fern', 'Fernort', '09888001'), // Rang 1 aus Anhang A
        ort('ohne-a', 'Alpha', null),
        ort('a', 'Aachen', null, undefined, { prioritaet: 2 }),
      ],
      KONTEXT,
    );
    expect(orte.map((o) => o.city)).toEqual(['Fernort', 'Aachen', 'Zeta', 'Alpha', 'Beta']);
    expect(ortsseitenOrdnen([{ city: 'Ü' }, { city: 'U', lage: { prioritaet: 3 } }]).map((o) => o.city)).toEqual(['U', 'Ü']);
    expect(anhangARang(STAMM, '06999002')).toBe(4);
    expect(anhangARang(STAMM, null)).toBeNull();
  });
});

describe('Ansicht „Prioritätsorte“ (FA-AA-01, FA-AA-05)', () => {
  it('zählt Vorgänge der letzten zwölf Monate je Gemeinde über die Postleitzahl', () => {
    const jetzt = new Date('2026-11-16T12:00:00Z');
    const zahl = vorgaengeJeGemeinde(
      [
        { plz: '90001', createdAt: '2026-10-01T00:00:00Z' },
        { plz: '90002', createdAt: '2026-01-01T00:00:00Z' },
        { plz: '90001', createdAt: '2025-11-15T00:00:00Z' }, // älter als zwölf Monate
        { plz: '45117', createdAt: '2026-10-01T00:00:00Z' }, // nicht im Stamm (Großempfänger)
        { plz: null, createdAt: '2026-10-01T00:00:00Z' },
        { plz: '35002', createdAt: 'kaputt' },
      ],
      STAMM,
      jetzt,
    );
    expect(Object.fromEntries(zahl)).toEqual({ '09888001': 2 });
  });

  it('zeigt Seite, Veröffentlichung, Partner und offene Zuordnungen, ohne zu raten', () => {
    const mitPartner = gemeindenMitPartner(STAMM, ['09888001', '06999002'], [partner('freigeschaltet', '90001')]);
    expect([...mitPartner]).toEqual(['09888001']);
    const zeilen = prioritaetsorteZeilen(
      STAMM,
      [{ gemeindeschluessel: '09888001', veroeffentlicht: false }, { gemeindeschluessel: '06999002', veroeffentlicht: true }],
      mitPartner,
      new Map([['09888001', 3]]),
    );
    expect(zeilen).toEqual([
      { land: 'Bayern', rang: 1, name: 'Fernort', schluessel: '09888001', offen: null, seiteVorhanden: true, veroeffentlicht: false, partnerVorhanden: true, vorgaenge12Monate: 3 },
      {
        land: 'Bayern',
        rang: 2,
        name: 'Doppelort',
        schluessel: null,
        offen: { kandidaten: ['Doppelort (09888003)', 'Doppelort (06999003)'], vorschlag: '09888003' },
        seiteVorhanden: false,
        veroeffentlicht: false,
        partnerVorhanden: false,
        vorgaenge12Monate: 0,
      },
      { land: 'Hessen', rang: 4, name: 'Nachbarort', schluessel: '06999002', offen: null, seiteVorhanden: true, veroeffentlicht: true, partnerVorhanden: false, vorgaenge12Monate: 0 },
    ]);
  });
});
