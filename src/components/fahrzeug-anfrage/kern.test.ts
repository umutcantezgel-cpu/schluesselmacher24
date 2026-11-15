import { describe, expect, it } from 'vitest';

import { ANFRAGE_FORMULAR, ANFRAGE_KLASSEN_DATEN, FORMULAR_KLASSEN, fahrzeugklasseText } from '@/lib/fahrzeuge/anfrage-klassen';
import { LIEFERLAND } from '@/lib/kasse';
import { fehlendeFahrzeugUnterlagen } from '@/lib/server/unterlagen-pflicht';

import {
  INITIAL,
  ersterOffenerSchritt,
  fehltImUnterlagenschritt,
  fehltSatz,
  finGueltig,
  kontaktAus,
  leereUnterlagen,
  payloadAus,
  pflichtFuer,
  schrittGueltig,
  uploadsAus,
  vorbelegungAus,
  zusammenfassung,
  type FahrzeugAnfrageDaten,
} from './kern';
import { pflichtListe, pflichtPunkte, pflichtTabelle } from './pflicht';

/* Jahr fest vorgegeben, damit die Grenze 2027 unabhängig vom Testdatum gilt. */
const JAHR = 2026;

const KONTAKT: Partial<FahrzeugAnfrageDaten> = {
  vorname: 'Anna',
  nachname: 'Beispiel',
  email: 'anna@example.com',
  telefon: '06441 123456',
  plz: '35576',
  ort: 'Wetzlar',
  beschreibung: 'Zweitschlüssel gewünscht, Testangabe.',
};

const MOTORRAD: FahrzeugAnfrageDaten = { ...INITIAL, ...KONTAKT, hersteller: 'Testwerk', modell: 'TX 700', baujahr: '2019', schluessel: 'vorhanden', transponder: 'ja' };

const datei = (name: string) => ({ id: name, name });
const volleDateien = () => ({
  ...leereUnterlagen(),
  fahrzeugschein: [datei('schein.jpg')],
  ersatznachweis: [datei('nachweis.pdf')],
  typenschild: [datei('typenschild.jpg')],
  fotos: { 'schluessel-vorderseite': [datei('v.jpg')], 'schluessel-rueckseite': [datei('r.jpg')], 'schluessel-spitze': [datei('s.jpg')] },
});

describe('Klassendaten der gemeinsamen Anfrage (FA-KERN-02B)', () => {
  it('kennt jede Klasse außer dem Auto mit Adresse, Frage und Schalter', () => {
    expect(FORMULAR_KLASSEN).toEqual(['motorrad', 'roller', 'e-scooter', 'seniorenmobil', 'fahrrad', 'nicht-gefunden']);
    expect(ANFRAGE_FORMULAR.motorrad.anfrage).toBe('/motorradschluessel/anfrage');
    expect(ANFRAGE_FORMULAR.roller.anfrage).toBe('/roller-und-kleinstfahrzeuge/anfrage');
    expect(ANFRAGE_FORMULAR['e-scooter'].anfrage).toBe('/e-scooter/anfrage');
    expect(ANFRAGE_FORMULAR.seniorenmobil.anfrage).toBe('/seniorenmobile/anfrage');
    expect(ANFRAGE_FORMULAR.fahrrad.anfrage).toBe('/fahrradschluessel/anfrage');
    expect(ANFRAGE_FORMULAR['nicht-gefunden'].anfrage).toBe('/autoschluessel/fahrzeug-nicht-gefunden');
    // Neue Seiten bleiben auf noindex, bis der Orchestrator sie freigibt; das Motorrad ist schon öffentlich.
    expect(FORMULAR_KLASSEN.filter((k) => ANFRAGE_FORMULAR[k].indexierbar)).toEqual(['motorrad']);
    // Katalogsuche nur für Krafträder, Chip-Frage für Motorrad, Roller und „nicht gefunden“.
    expect(FORMULAR_KLASSEN.filter((k) => ANFRAGE_FORMULAR[k].katalog === 'kraftrad')).toEqual(['motorrad', 'roller']);
    expect(FORMULAR_KLASSEN.filter((k) => ANFRAGE_FORMULAR[k].chip)).toEqual(['motorrad', 'roller', 'nicht-gefunden']);
  });

  it('nennt die Klasse für Admin und Vorgangsblatt nur bei der gemeinsamen Anfrage', () => {
    expect(fahrzeugklasseText({ quelle: 'fahrzeug-anfrage', klasse: 'e-scooter' })).toBe('E-Scooter und ähnliche Elektrofahrzeuge');
    expect(fahrzeugklasseText({ quelle: 'fahrzeug-anfrage', klasse: 'roller', roller: 'versicherungskennzeichen' })).toBe(
      'Roller, Mofa oder Moped, mit Versicherungskennzeichen',
    );
    expect(fahrzeugklasseText({ quelle: 'fahrzeug-anfrage', klasse: 'roller' })).toBe('Roller, Mofa oder Moped, mit Fahrzeugschein');
    expect(fahrzeugklasseText({ quelle: 'motorrad', klasse: 'motorrad' })).toBeNull();
    expect(fahrzeugklasseText({ quelle: 'fahrzeug-anfrage', klasse: 'lkw' })).toBeNull();
    expect(fahrzeugklasseText(null)).toBeNull();
  });
});

describe('Pflichtliste aus der Regel', () => {
  it('ist für jede Klasse genau das, was die Regel bei leerem Fall verlangt', () => {
    for (const klasse of FORMULAR_KLASSEN) {
      const tabelle = pflichtTabelle(klasse);
      expect(tabelle.zulassung.vorhanden, klasse).toEqual(
        fehlendeFahrzeugUnterlagen({ klasse, roller: klasse === 'roller' ? 'zulassung' : null, keinSchluesselMehr: false, beschreibung: '' }, [], false),
      );
      // Ohne Schlüssel entfallen nur die drei Fotos.
      expect(tabelle.zulassung.keiner.some((e) => e.startsWith('schluessel-')), klasse).toBe(false);
    }
  });

  it('Auto-Klassen verlangen den Fahrzeugschein, Kleinstfahrzeuge einen Nachweis (Roller nach Wahl)', () => {
    expect(pflichtListe('motorrad', null, 'vorhanden')).toContain('fahrzeugschein');
    expect(pflichtListe('nicht-gefunden', null, 'vorhanden')).toContain('fahrzeugschein');
    expect(pflichtListe('roller', 'zulassung', 'vorhanden')).toContain('fahrzeugschein');
    expect(pflichtListe('roller', 'versicherungskennzeichen', 'vorhanden')).toEqual(expect.arrayContaining(['ersatznachweis', 'ersatznachweis-art', 'typenschild']));
    expect(pflichtListe('e-scooter', null, 'vorhanden')).toContain('typenschild');
    expect(pflichtListe('fahrrad', null, 'vorhanden')).toEqual(expect.arrayContaining(['ersatznachweis', 'schloss-angaben']));
    expect(pflichtListe('fahrrad', null, 'vorhanden')).not.toContain('typenschild');
  });

  it('nennt die Liste in Sätzen, ohne sie von Hand abzuschreiben', () => {
    expect(pflichtPunkte('motorrad', pflichtListe('motorrad', null, 'vorhanden'))).toEqual([
      'Fahrzeugschein (Zulassungsbescheinigung Teil I)',
      'Drei Fotos Ihres Schlüssels: Vorderseite, Rückseite und Spitze beziehungsweise Profil von vorne',
      'Eine kurze Beschreibung Ihres Anliegens',
    ]);
    expect(pflichtPunkte('fahrrad', pflichtListe('fahrrad', null, 'vorhanden'))[0]).toBe('Ein Nachweis statt Fahrzeugschein: Kaufbeleg oder Codekarte des Schlosses');
    // Typenschild wie die Regel: Foto, FIN oder die Bestätigung „kein Typenschild“.
    expect(pflichtPunkte('e-scooter', pflichtListe('e-scooter', null, 'vorhanden'))).toContain(
      'Ein Foto des Typenschilds oder die Fahrzeug-Identifizierungsnummer. Hat Ihr Fahrzeug keines, sagen Sie es uns in der Anfrage.',
    );
  });
});

describe('Schritte', () => {
  it('prüft den Fahrzeugschritt je Klasse', () => {
    expect(schrittGueltig('motorrad', MOTORRAD, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, hersteller: ' ' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, modell: 'M'.repeat(81) }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, baujahr: '' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, baujahr: '2027' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, baujahr: '2028' }, 'fahrzeug', JAHR)).toBe(false);
    // Roller: die Wahl Fahrzeugschein oder Versicherungskennzeichen ist Pflicht, das Baujahr freiwillig.
    expect(schrittGueltig('roller', { ...MOTORRAD, baujahr: '' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig('roller', { ...MOTORRAD, baujahr: '', roller: 'versicherungskennzeichen' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig('roller', { ...MOTORRAD, baujahr: '19', roller: 'zulassung' }, 'fahrzeug', JAHR)).toBe(false);
    // Fahrrad: Hersteller und Schlüsselnummer des Schlosses.
    expect(schrittGueltig('fahrrad', INITIAL, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig('fahrrad', { ...INITIAL, schlossHersteller: 'Testschloss', schluesselnummer: 'K 1' }, 'fahrzeug', JAHR)).toBe(true);
    // Nicht gefunden: Marke, Modell, Baujahr.
    expect(schrittGueltig('nicht-gefunden', { ...INITIAL, hersteller: 'Testmarke', modell: 'X' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig('nicht-gefunden', { ...INITIAL, hersteller: 'Testmarke', modell: 'X', baujahr: '2001' }, 'fahrzeug', JAHR)).toBe(true);
  });

  it('verlangt die Angabe zum Schlüssel und, wo gefragt, zum Chip', () => {
    expect(schrittGueltig('motorrad', { ...MOTORRAD, schluessel: '' }, 'schluessel')).toBe(false);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, transponder: '' }, 'schluessel')).toBe(false);
    expect(schrittGueltig('e-scooter', { ...MOTORRAD, transponder: '' }, 'schluessel')).toBe(true);
  });

  it('verlangt Beschreibung und Kontakt', () => {
    expect(schrittGueltig('motorrad', { ...MOTORRAD, beschreibung: 'zu kurz' }, 'beschreibung')).toBe(false);
    expect(schrittGueltig('motorrad', MOTORRAD, 'kontakt')).toBe(true);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, email: 'anna' }, 'kontakt')).toBe(false);
    expect(schrittGueltig('motorrad', { ...MOTORRAD, plz: '123' }, 'kontakt')).toBe(false);
  });

  it('sperrt den Unterlagenschritt, bis jede Pflichtunterlage da ist, und sagt verständlich, was fehlt', () => {
    const pflicht = pflichtFuer(pflichtTabelle('motorrad'), MOTORRAD);
    const leer = leereUnterlagen();
    const fehlt = fehltImUnterlagenschritt('motorrad', pflicht, MOTORRAD, leer);
    expect(fehlt).toEqual(['fahrzeugschein', 'schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze']);
    expect(fehltSatz(['fahrzeugschein'])).toBe('Es fehlt noch der Fahrzeugschein.');
    expect(fehltImUnterlagenschritt('motorrad', pflicht, MOTORRAD, volleDateien())).toEqual([]);
    // Ohne Schlüssel: nur noch der Fahrzeugschein.
    const ohne = { ...MOTORRAD, schluessel: 'keiner' as const };
    expect(fehltImUnterlagenschritt('motorrad', pflichtFuer(pflichtTabelle('motorrad'), ohne), ohne, leer)).toEqual(['fahrzeugschein']);
    expect(ersterOffenerSchritt('motorrad', pflicht, MOTORRAD, leer, JAHR)).toBe('unterlagen');
    expect(ersterOffenerSchritt('motorrad', pflicht, MOTORRAD, volleDateien(), JAHR)).toBeNull();
  });

  it('erkennt beim Typenschild Foto, FIN oder die Bestätigung „kein Typenschild“', () => {
    const daten = { ...MOTORRAD, ersatznachweis: 'kaufbeleg' as const };
    const pflicht = pflichtFuer(pflichtTabelle('e-scooter'), daten);
    const ohneSchild = { ...volleDateien(), typenschild: [] };
    expect(fehltImUnterlagenschritt('e-scooter', pflicht, daten, ohneSchild)).toEqual(['typenschild']);
    expect(fehltImUnterlagenschritt('e-scooter', pflicht, { ...daten, fin: 'WVWZZZ1JZXW000001' }, ohneSchild)).toEqual([]);
    expect(fehltImUnterlagenschritt('e-scooter', pflicht, { ...daten, keinTypenschild: true }, ohneSchild)).toEqual([]);
    // Eine Codekarte gilt nur beim Fahrrad.
    expect(fehltImUnterlagenschritt('e-scooter', pflicht, { ...daten, ersatznachweis: 'codekarte' }, volleDateien())).toEqual(['ersatznachweis-art']);
  });

  it('prüft die FIN wie der Server (17 Zeichen ohne I, O und Q)', () => {
    for (const [fin, gueltig] of [
      ['WVWZZZ1JZXW000001', true],
      ['wvwzzz1jzxw000001', true],
      ['ABCDE', false],
      ['WVWZZZ1JZXW00000', false],
      ['WVWZZZ1JZXW0000011', false],
      ['WVWZZZ1JZXO000001', false],
    ] as const) {
      expect(finGueltig(fin), fin).toBe(gueltig);
      const serverFehlt = fehlendeFahrzeugUnterlagen({ klasse: 'e-scooter', keinSchluesselMehr: true, beschreibung: 'x'.repeat(30), ersatznachweis: 'kaufbeleg', fin }, [], false);
      expect(serverFehlt.includes('typenschild'), fin).toBe(!gueltig);
    }
  });
});

describe('Absenden', () => {
  it('trägt Quelle und Klasse und nur, was im Fall gefragt wurde', () => {
    expect(payloadAus('motorrad', MOTORRAD)).toEqual({
      quelle: 'fahrzeug-anfrage',
      klasse: 'motorrad',
      hersteller: 'Testwerk',
      modell: 'TX 700',
      baujahr: 2019,
      transponder: 'ja',
      beschreibung: 'Zweitschlüssel gewünscht, Testangabe.',
      keinSchluesselMehr: false,
    });
    const roller = payloadAus('roller', { ...MOTORRAD, roller: 'versicherungskennzeichen', ersatznachweis: 'kaufbeleg', fin: ' wvwzzz1jzxw000001 ' });
    expect(roller).toMatchObject({ klasse: 'roller', roller: 'versicherungskennzeichen', ersatznachweis: 'kaufbeleg', fin: 'WVWZZZ1JZXW000001' });
    // Zugelassener Roller: kein Ersatznachweis in der Nutzlast.
    expect(payloadAus('roller', { ...MOTORRAD, roller: 'zulassung', ersatznachweis: 'kaufbeleg' })).not.toHaveProperty('ersatznachweis');
    expect(payloadAus('fahrrad', { ...INITIAL, schlossHersteller: ' Testschloss ', schluesselnummer: 'K 1', schluessel: 'keiner' })).toMatchObject({
      klasse: 'fahrrad',
      schlossHersteller: 'Testschloss',
      schluesselnummer: 'K 1',
      keinSchluesselMehr: true,
    });
  });

  it('schickt nur die Dateien der Pflichtliste, je mit Kategorie und Steckplatz', () => {
    const alsUpload = (d: { name: string }, category: string, steckplatz?: string) => ({ fileName: d.name, sizeBytes: 1, mimeType: 'image/jpeg', category, steckplatz }) as never;
    const motorrad = uploadsAus(pflichtFuer(pflichtTabelle('motorrad'), MOTORRAD), volleDateien(), alsUpload) as Array<{ category: string; steckplatz: string }>;
    expect(motorrad.map((u) => `${u.category}:${u.steckplatz}`)).toEqual([
      'fahrzeugschein:fahrzeugschein',
      'schluesselfoto:schluessel-vorderseite',
      'schluesselfoto:schluessel-rueckseite',
      'schluesselfoto:schluessel-spitze',
    ]);
    const scooter = uploadsAus(pflichtFuer(pflichtTabelle('e-scooter'), { roller: '', schluessel: 'keiner' }), volleDateien(), alsUpload) as Array<{ category: string; steckplatz: string }>;
    expect(scooter.map((u) => `${u.category}:${u.steckplatz}`)).toEqual(['dokument:ersatznachweis', 'dokument:typenschild']);
  });

  it('fasst Klasse, Fahrzeug und Kontakt zusammen', () => {
    const [fahrzeug, kontakt] = zusammenfassung('motorrad', MOTORRAD);
    expect(fahrzeug.title).toBe('Motorrad');
    expect(fahrzeug.rows[0]).toEqual({ label: 'Fahrzeugklasse', value: 'Motorrad' });
    expect(fahrzeug.rows).toContainEqual({ label: 'Chip im Schlüssel', value: 'mit Chip' });
    expect(kontakt.rows).toContainEqual({ label: 'Versandland', value: LIEFERLAND });
    expect(kontaktAus(MOTORRAD)).toMatchObject({ firstName: 'Anna', country: LIEFERLAND });
    const [schloss] = zusammenfassung('fahrrad', { ...INITIAL, schlossHersteller: 'Testschloss', schluesselnummer: 'K 1', ersatznachweis: 'codekarte' });
    expect(schloss.rows).toContainEqual({ label: 'Schlüsselnummer', value: 'K 1' });
    expect(schloss.rows).toContainEqual({ label: 'Art des Nachweises', value: 'Codekarte des Schlosses' });
    expect(ANFRAGE_KLASSEN_DATEN.fahrrad.typenschild).toBe(false);
    expect(schloss.rows.some((r) => r.label === 'Typenschild')).toBe(false);
  });

  it('belegt „nicht gefunden“ aus der Suche vor, bereinigt und gekürzt', () => {
    expect(vorbelegungAus({ marke: 'Alfa Romeo', modell: 'Giulia' })).toEqual({ hersteller: 'Alfa Romeo', modell: 'Giulia' });
    expect(vorbelegungAus({ fahrzeug: 'Dacia Sandero Stepway' })).toEqual({ hersteller: 'Dacia', modell: 'Sandero Stepway' });
    expect(vorbelegungAus({ fahrzeug: '<script>x</script>' })).toEqual({ hersteller: 'scriptx/script', modell: '' });
    expect(vorbelegungAus({ marke: 'x'.repeat(100) }).hersteller).toHaveLength(60);
    expect(vorbelegungAus({})).toEqual({ hersteller: '', modell: '' });
  });
});
