import { describe, expect, it } from 'vitest';

import { ANFRAGE_KLASSEN, ANFRAGE_KLASSEN_DATEN, ERSATZNACHWEISE, verlangtZulassung, type AnfrageKlasse } from '@/lib/fahrzeuge/anfrage-klassen';
import type { UploadRef, UploadSteckplatz } from '@/lib/types';

import {
  allgemeineVorlageAnfrage,
  anfrageQuelleUnbekannt,
  BESCHREIBUNG_MIN,
  beschreibungGueltig,
  FAHRZEUGSCHEIN_FEHLT,
  FAHRZEUGSCHEIN_NICHT_HOCHGELADEN,
  fahrzeugFall,
  fahrzeugscheinPruefen,
  fahrzeugUnterlagenPruefen,
  fehlendeFahrzeugUnterlagen,
  fehlendePflichtunterlagen,
  fehlendeSchluesselfotos,
  SICHERUNGSKARTE_FEHLT,
  nachweisPruefen,
  pflichtUploadsPruefen,
  rubrikUnterlagenPruefen,
  UNTERLAGEN_SCHUTZ,
  unterlagenHinweis,
  unterlagenMeldung,
  unterlagenWeg,
  type FahrzeugFall,
} from './unterlagen-pflicht';

const foto = { category: 'schluesselfoto' as const };
const schein = { category: 'fahrzeugschein' as const };
const hochgeladen = { ...schein, storageKey: '17', uploadToken: 'a'.repeat(43) };

describe('Fahrzeugschein ist beim Autoschlüssel-Termin Pflicht', () => {
  it('lehnt ohne Fahrzeugschein ab — Schlüsselfotos ersetzen ihn nicht', () => {
    expect(fahrzeugscheinPruefen([], false)).toBe(FAHRZEUGSCHEIN_FEHLT);
    expect(fahrzeugscheinPruefen([foto, foto], true)).toBe(FAHRZEUGSCHEIN_FEHLT);
  });

  it('Totalverlust: ohne Schlüsselfotos genügt der Fahrzeugschein', () => {
    expect(fahrzeugscheinPruefen([hochgeladen], true)).toBeNull();
  });

  it('mit Dateiablage zählt nur die hochgeladene Datei', () => {
    expect(fahrzeugscheinPruefen([schein], true)).toBe(FAHRZEUGSCHEIN_NICHT_HOCHGELADEN);
    expect(fahrzeugscheinPruefen([{ ...schein, storageKey: '17' }], true)).toBe(FAHRZEUGSCHEIN_NICHT_HOCHGELADEN);
    expect(fahrzeugscheinPruefen([schein, hochgeladen], true)).toBeNull();
  });

  it('ohne Dateiablage genügt die Angabe der ausgewählten Datei', () => {
    expect(fahrzeugscheinPruefen([schein], false)).toBeNull();
  });
});

describe('Nachweise und Pflichtunterlagen je Rubrik (R13, E3-OPUS-09)', () => {
  const karte = { category: 'sicherungskarte' as const, storageKey: '12', uploadToken: 'x'.repeat(43) };
  const schein = { category: 'fahrzeugschein' as const, storageKey: '13', uploadToken: 'y'.repeat(43) };
  const foto = { category: 'schluesselfoto' as const, storageKey: '14', uploadToken: 'z'.repeat(43) };

  it('verlangt beim Nachweis Fahrzeugschein dasselbe wie der Autoschlüssel-Weg', () => {
    expect(nachweisPruefen('fahrzeugschein', [], true)).toBe(fahrzeugscheinPruefen([], true));
    expect(nachweisPruefen('fahrzeugschein', [schein], true)).toBeNull();
  });

  it('verlangt die Sicherungskarte als hochgeladene Datei, ohne Ablage genügt die Angabe', () => {
    expect(nachweisPruefen('sicherungskarte', [], true)).toBe(SICHERUNGSKARTE_FEHLT);
    expect(nachweisPruefen('sicherungskarte', [{ category: 'sicherungskarte' }], true)).toBe(SICHERUNGSKARTE_FEHLT);
    expect(nachweisPruefen('sicherungskarte', [{ category: 'sicherungskarte' }], false)).toBeNull();
    expect(nachweisPruefen('sicherungskarte', [karte], true)).toBeNull();
    expect(nachweisPruefen('keiner', [], true)).toBeNull();
  });

  it('meldet die erste fehlende Pflichtunterlage in Kundensprache', () => {
    expect(pflichtUploadsPruefen(['schluesselfoto'], [], true)).toBe('Bitte laden Sie ein Foto Ihres Schlüssels hoch.');
    expect(pflichtUploadsPruefen(['schluesselfoto'], [foto], true)).toBeNull();
  });

  it('prüft erst den Nachweis, dann die Pflicht-Uploads; kein Weg ohne Nachweis', () => {
    const motorrad = { nachweis: 'fahrzeugschein' as const, pflichtUploads: ['schluesselfoto'] };
    expect(rubrikUnterlagenPruefen(motorrad, [foto], true)).toBe(fahrzeugscheinPruefen([], true));
    expect(rubrikUnterlagenPruefen(motorrad, [schein], true)).toBe('Bitte laden Sie ein Foto Ihres Schlüssels hoch.');
    expect(rubrikUnterlagenPruefen(motorrad, [schein, foto], true)).toBeNull();
  });
});

/* ==========================================================================
   Eine Pflichtregel für alle Fahrzeugschlüssel-Wege (FA-KERN-02, A-048)
   ========================================================================== */

describe('Pflichtregel je Fahrzeugklasse (FA-KERN-02)', () => {
  const ablage = (steckplatz: UploadSteckplatz, category: UploadRef['category']) => ({ category, steckplatz, storageKey: '7', uploadToken: 't'.repeat(43) });
  const scheinMit = ablage('fahrzeugschein', 'fahrzeugschein');
  const fotos = [ablage('schluessel-vorderseite', 'schluesselfoto'), ablage('schluessel-rueckseite', 'schluesselfoto'), ablage('schluessel-spitze', 'schluesselfoto')];
  const ersatz = ablage('ersatznachweis', 'dokument');
  const schild = ablage('typenschild', 'dokument');
  const text = 'Zweitschlüssel gewünscht, bitte Rückmeldung.';
  const fall = (klasse: AnfrageKlasse, mehr: Partial<FahrzeugFall> = {}): FahrzeugFall => ({ klasse, keinSchluesselMehr: false, beschreibung: text, ...mehr });

  it('kennt genau die sieben Klassen mit Bezeichnung und Nachweis', () => {
    expect([...ANFRAGE_KLASSEN]).toEqual(['auto', 'motorrad', 'roller', 'e-scooter', 'seniorenmobil', 'fahrrad', 'nicht-gefunden']);
    for (const klasse of ANFRAGE_KLASSEN) {
      const daten = ANFRAGE_KLASSEN_DATEN[klasse];
      expect(daten.kennung).toBe(klasse);
      expect(daten.bezeichnung.length).toBeGreaterThan(2);
      // Ersatznachweise nur, wo der Ersatzweg offen ist; jede Art ist in der einen Liste beschrieben.
      expect(daten.ersatznachweise.length > 0).toBe(daten.nachweis !== 'zulassung');
      for (const art of daten.ersatznachweise) expect(ERSATZNACHWEISE[art].titel).toBeTruthy();
    }
    expect(ANFRAGE_KLASSEN_DATEN.fahrrad.ersatznachweise).toEqual(['kaufbeleg', 'codekarte']);
  });

  it.each(['auto', 'motorrad', 'nicht-gefunden'] as const)('%s: Fahrzeugschein Pflicht, nie Ersatznachweis', (klasse) => {
    expect(verlangtZulassung(klasse, 'versicherungskennzeichen')).toBe(true);
    expect(fehlendeFahrzeugUnterlagen(fall(klasse), [scheinMit, ...fotos], true)).toEqual([]);
    const mitErsatz = fall(klasse, { ersatznachweis: 'kaufbeleg', fin: 'WVWZZZ1JZXW000001', roller: 'versicherungskennzeichen' });
    expect(fehlendeFahrzeugUnterlagen(mitErsatz, [ersatz, schild, ...fotos], true)).toEqual(['fahrzeugschein']);
  });

  it('roller: Die Regel folgt der Wahl des Kunden, ohne Wahl gilt zugelassen', () => {
    expect(fehlendeFahrzeugUnterlagen(fall('roller', { roller: 'zulassung' }), [scheinMit, ...fotos], true)).toEqual([]);
    expect(fehlendeFahrzeugUnterlagen(fall('roller'), [ersatz, schild, ...fotos], true)).toEqual(['fahrzeugschein']);
    const vk = fall('roller', { roller: 'versicherungskennzeichen', ersatznachweis: 'versicherungsbescheinigung' });
    expect(fehlendeFahrzeugUnterlagen(vk, [ersatz, schild, ...fotos], true)).toEqual([]);
    // Codekarte gilt nicht für Roller.
    expect(fehlendeFahrzeugUnterlagen({ ...vk, ersatznachweis: 'codekarte' }, [ersatz, schild, ...fotos], true)).toEqual(['ersatznachweis-art']);
  });

  it.each(['e-scooter', 'seniorenmobil'] as const)('%s: Ersatznachweis, dazu Typenschild, FIN oder „kein Typenschild“', (klasse) => {
    const basis = fall(klasse, { ersatznachweis: 'betriebserlaubnis' });
    expect(fehlendeFahrzeugUnterlagen(basis, [ersatz, schild, ...fotos], true)).toEqual([]);
    expect(fehlendeFahrzeugUnterlagen({ ...basis, fin: 'wdb12345678901234' }, [ersatz, ...fotos], true)).toEqual([]);
    expect(fehlendeFahrzeugUnterlagen({ ...basis, keinTypenschild: true }, [ersatz, ...fotos], true)).toEqual([]);
    expect(fehlendeFahrzeugUnterlagen(basis, [ersatz, ...fotos], true)).toEqual(['typenschild']);
    expect(fehlendeFahrzeugUnterlagen({ ...basis, fin: 'x!' }, [ersatz, ...fotos], true)).toEqual(['typenschild']);
    // Die FIN folgt ISO 3779: 17 Zeichen ohne I, O und Q. Ein kurzes Kürzel ersetzt das Typenschild nicht.
    for (const fin of ['ABCDE', 'ABC12345', 'WVWZZZ1JZXW00000', 'WVWZZZ1JZXW0000O1', 'WVWZZZ1JZXW0000011']) {
      expect(fehlendeFahrzeugUnterlagen({ ...basis, fin }, [ersatz, ...fotos], true), fin).toEqual(['typenschild']);
    }
    // Ein Fahrzeugschein ersetzt den Ersatznachweis hier nicht stillschweigend: Der Steckplatz zählt.
    expect(fehlendeFahrzeugUnterlagen(basis, [scheinMit, schild, ...fotos], true)).toEqual(['ersatznachweis']);
  });

  it('fahrrad: Kaufbeleg oder Codekarte, dazu Hersteller und Schlüsselnummer des Schlosses', () => {
    const basis = fall('fahrrad', { ersatznachweis: 'codekarte', schlossHersteller: 'Testschloss', schluesselnummer: '123' });
    expect(fehlendeFahrzeugUnterlagen(basis, [ersatz, ...fotos], true)).toEqual([]);
    expect(fehlendeFahrzeugUnterlagen({ ...basis, schluesselnummer: ' ' }, [ersatz, ...fotos], true)).toEqual(['schloss-angaben']);
    expect(fehlendeFahrzeugUnterlagen({ ...basis, ersatznachweis: 'betriebserlaubnis' }, [ersatz, ...fotos], true)).toEqual(['ersatznachweis-art']);
  });

  it('verlangt die drei Schlüsselfotos, außer bei bestätigtem Totalverlust', () => {
    expect(fehlendeFahrzeugUnterlagen(fall('auto'), [scheinMit, fotos[0], fotos[1]], true)).toEqual(['schluessel-spitze']);
    expect(fehlendeFahrzeugUnterlagen(fall('auto'), [scheinMit], true)).toEqual(['schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze']);
    expect(fehlendeFahrzeugUnterlagen(fall('auto', { keinSchluesselMehr: true }), [scheinMit], true)).toEqual([]);
    // Schlüsselfotos ohne Steckplatz (ältere Formulare) zählen keiner Ansicht.
    expect(fehlendeSchluesselfotos([{ category: 'schluesselfoto' }, { category: 'schluesselfoto' }, { category: 'schluesselfoto' }], false)).toHaveLength(3);
  });

  it('zählt mit Ablage nur hochgeladene Dateien, ohne Ablage die Angabe', () => {
    const ohneKennung = fotos.map(({ category, steckplatz }) => ({ category, steckplatz }));
    expect(fehlendeSchluesselfotos(ohneKennung, true)).toHaveLength(3);
    expect(fehlendeSchluesselfotos(ohneKennung, false)).toEqual([]);
  });

  it('verlangt eine kurze Beschreibung mit mindestens 20 Zeichen', () => {
    expect(BESCHREIBUNG_MIN).toBe(20);
    expect(beschreibungGueltig('x'.repeat(19))).toBe(false);
    expect(beschreibungGueltig(`  ${'x'.repeat(20)}  `)).toBe(true);
    expect(beschreibungGueltig(undefined)).toBe(false);
    expect(beschreibungGueltig('x'.repeat(2001))).toBe(false);
    expect(fehlendeFahrzeugUnterlagen(fall('auto', { beschreibung: '' }), [scheinMit, ...fotos], true)).toEqual(['beschreibung']);
  });

  it('nennt in einer Meldung alles, was fehlt, mit dem Satz zum Schutz', () => {
    expect(unterlagenMeldung([])).toBeNull();
    expect(unterlagenMeldung(['fahrzeugschein'])).toBe(`Bitte ergänzen Sie noch den Fahrzeugschein (Zulassungsbescheinigung Teil I). ${UNTERLAGEN_SCHUTZ}`);
    expect(fahrzeugUnterlagenPruefen(fall('auto'), [scheinMit, ...fotos], true)).toBeNull();
    expect(fahrzeugUnterlagenPruefen(fall('auto'), [], true)).toContain(' und das Foto der Spitze');
  });

  it('ordnet Vorgänge ihrem Weg zu und lässt Einsendung und allgemeine Anfrage außen vor', () => {
    expect(unterlagenWeg({ kind: 'termin', area: 'autoschluessel', payload: {} })).toBe('termin');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'autoschluessel', payload: { quelle: 'motorrad' } })).toBe('motorrad');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'autoschluessel', payload: { quelle: 'gehaeuse' } })).toBe('gehaeuse');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'schluessel-nach-vorlage', payload: { quelle: 'foto-anfrage' } })).toBe('vorlage');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'schluessel-nach-vorlage', payload: {} })).toBe('vorlage');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'schluessel-nach-vorlage', payload: { quelle: 'einsenden' } })).toBeNull();
    // Jede Anfrage nach Vorlage außer der Einsendung ist eine Foto-Anfrage, gleich welche Quelle oder welches Thema.
    expect(unterlagenWeg({ kind: 'anfrage', area: 'schluessel-nach-vorlage', payload: { thema: 'schluessel-nach-vorlage' } })).toBe('vorlage');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'schluessel-nach-vorlage', payload: { quelle: 'x' } })).toBe('vorlage');
    // Jeder Termin ist ein Autoschlüssel-Termin, auch mit anderem Bereich (records.ts lehnt den ab).
    expect(unterlagenWeg({ kind: 'termin', area: 'service-und-termin', payload: {} })).toBe('termin');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'autoschluessel', payload: { quelle: 'fahrzeug-anfrage', klasse: 'fahrrad' } })).toBe('fahrzeug-anfrage');
    expect(unterlagenWeg({ kind: 'anfrage', area: 'service-und-termin', payload: { quelle: 'kontakt' } })).toBeNull();
    expect(unterlagenWeg({ kind: 'bestellung', area: 'schluessel-nach-code', payload: {} })).toBeNull();
  });

  it('kennt je Bereich die Quellen der Anfrage-Wege und lenkt die allgemeine Anfrage nach Vorlage um', () => {
    const anfrage = (area: string, payload: Record<string, unknown>) => ({ kind: 'anfrage', area, payload });
    for (const quelle of ['motorrad', 'gehaeuse', 'fahrzeug-anfrage', undefined]) {
      expect(anfrageQuelleUnbekannt(anfrage('autoschluessel', { quelle })), String(quelle)).toBe(false);
    }
    for (const quelle of ['foto-anfrage', 'einsenden', undefined]) {
      expect(anfrageQuelleUnbekannt(anfrage('schluessel-nach-vorlage', { quelle })), String(quelle)).toBe(false);
    }
    expect(anfrageQuelleUnbekannt(anfrage('autoschluessel', { quelle: 'x' }))).toBe(true);
    expect(anfrageQuelleUnbekannt(anfrage('schluessel-nach-vorlage', { quelle: 'x' }))).toBe(true);
    expect(anfrageQuelleUnbekannt(anfrage('schluessel-nach-vorlage', { quelle: 'motorrad' }))).toBe(true);
    expect(anfrageQuelleUnbekannt(anfrage('schluessel-nach-vorlage', { quelle: 7 }))).toBe(true);
    // Andere Bereiche kennen diese Liste nicht.
    expect(anfrageQuelleUnbekannt(anfrage('service-und-termin', { quelle: 'kontakt' }))).toBe(false);
    expect(allgemeineVorlageAnfrage(anfrage('schluessel-nach-vorlage', { thema: 'schluessel-nach-vorlage' }))).toBe(true);
    expect(allgemeineVorlageAnfrage(anfrage('schluessel-nach-vorlage', { quelle: 'foto-anfrage', thema: 'x' }))).toBe(false);
    expect(allgemeineVorlageAnfrage(anfrage('schluessel-nach-vorlage', {}))).toBe(false);
  });

  it('Termin: Totalverlust nur mit 0 funktionierenden Schlüsseln und Bestätigung; Gehäuse nie', () => {
    expect(fahrzeugFall('termin', { keinSchluesselMehr: true }, 0)?.keinSchluesselMehr).toBe(true);
    expect(fahrzeugFall('termin', { keinSchluesselMehr: true }, 1)?.keinSchluesselMehr).toBe(false);
    expect(fahrzeugFall('termin', {}, 0)?.keinSchluesselMehr).toBe(false);
    expect(fahrzeugFall('gehaeuse', { keinSchluesselMehr: true })?.keinSchluesselMehr).toBe(false);
    expect(fahrzeugFall('fahrzeug-anfrage', { klasse: 'lkw' })).toBeNull();
    expect(fehlendePflichtunterlagen({ kind: 'anfrage', area: 'autoschluessel', payload: { quelle: 'fahrzeug-anfrage' } }, [], true)).toBe('ungueltig');
  });

  it('nennt im Backend fehlende Pflicht-Steckplätze, auch bei älteren Vorgängen', () => {
    const alt = {
      kind: 'anfrage',
      area: 'autoschluessel',
      payload: { quelle: 'motorrad' },
      uploads: [{ category: 'fahrzeugschein' as const, storageKey: '1' }, { category: 'schluesselfoto' as const, storageKey: '2' }],
    };
    const hinweis = unterlagenHinweis(alt);
    expect(hinweis).toContain('Pflicht-Steckplatz fehlt: Schlüssel Vorderseite, Schlüssel Rückseite, Schlüssel Spitze und Profil von vorne, Beschreibung des Anliegens.');
    expect(hinweis).toContain('vor den Steckplätzen');
    const neu = {
      kind: 'anfrage',
      area: 'autoschluessel',
      payload: { quelle: 'motorrad', beschreibung: text },
      uploads: [scheinMit, ...fotos],
    };
    expect(unterlagenHinweis(neu)).toBeNull();
    // Nicht gespeicherte Dateien zählen im Backend nicht.
    expect(unterlagenHinweis({ ...neu, uploads: [{ ...scheinMit, storageKey: undefined }, ...fotos] })).toContain('Fahrzeugschein');
    expect(unterlagenHinweis({ kind: 'anfrage', area: 'service-und-termin', payload: {}, uploads: [] })).toBeNull();
  });
});
