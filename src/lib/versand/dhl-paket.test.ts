import { afterEach, describe, expect, it, vi } from 'vitest';

import { defaults } from '../data/defaults';
import { begleitscheinZumVorgang } from '../einsenden/schein';
import { EINSENDE_QUELLE, einsendeVorgang } from '../einsenden/vorgang';
import type { BusinessRecord, CompanyProfile, EinsendeEinstellungen } from '../types';

import { DHL_PAKET_SANDBOX, dhlPaketAuftrag, dhlPaketFehlt, dhlPaketZugang } from './dhl-paket';
import { erstelleVersandschein, labelEingerichtet, labelWegStand, versandAnbieter } from './index';
import type { Sendung } from './typen';

/* FA-SHOP-03B: zweiter Label-Anschluss (DHL Paket für Geschäftskunden), vorbereitet und abgeschaltet.
 * Nie ein echter Aufruf: fetch ist immer eine Attrappe (G3, G5). Erfundene Testdaten (G4). */

const E: EinsendeEinstellungen = defaults.settings().sendIn!;
const AN: EinsendeEinstellungen = { ...E, labelAktiv: true };

const SENDUNG: Sendung = {
  vorgangsnummer: 'SM24-E-2026-0001',
  art: 'dhl-paket',
  absender: { name: 'Erika Muster', strasse: 'Musterweg 12a', plz: '35576', ort: 'Wetzlar', land: 'Deutschland' },
  empfaenger: { name: 'Testwerkstatt Lahn', strasse: 'Werkstattgasse 7', plz: '35578', ort: 'Wetzlar' },
  inhalt: '1 Schlüssel zum Nachmachen',
};

const PAKET_ENV = {
  VERSAND_PROVIDER: 'dhl-paket',
  DHL_API_KEY: 'test-schluessel',
  DHL_USER: 'test-benutzer',
  DHL_PASSWORD: 'test-passwort',
  DHL_PAKET_ABRECHNUNGSNUMMER: '12345678901234',
};

function attrappe() {
  const label = Buffer.from('%PDF-1.4 Testpaketlabel').toString('base64');
  return vi.fn(async () => new Response(JSON.stringify({ items: [{ shipmentNo: '00340434000000000001', label: { b64: label } }] }), { status: 200 }));
}

afterEach(() => vi.restoreAllMocks());

describe('DHL Paket: ohne Vertrag kein Label-Aufruf', () => {
  it('ohne Zugang, ohne Schalter oder ohne Wahl des Anbieters gibt es keinen Aufruf, nur den Begleitschein', async () => {
    const faelle: Array<{ einstellungen: EinsendeEinstellungen; env: Record<string, string> }> = [
      { einstellungen: AN, env: {} },
      { einstellungen: AN, env: { VERSAND_PROVIDER: 'dhl-paket' } },
      { einstellungen: AN, env: { ...PAKET_ENV, DHL_PAKET_ABRECHNUNGSNUMMER: '' } },
      { einstellungen: AN, env: { ...PAKET_ENV, DHL_PAKET_ABRECHNUNGSNUMMER: '1234' } },
      { einstellungen: AN, env: { ...PAKET_ENV, DHL_PASSWORD: ' ' } },
      { einstellungen: E, env: PAKET_ENV },
      { einstellungen: AN, env: { ...PAKET_ENV, VERSAND_PROVIDER: 'begleitschein' } },
    ];
    for (const fall of faelle) {
      const fetchImpl = attrappe();
      expect(versandAnbieter({ ...fall, fetchImpl: fetchImpl as never }).name).toBe('begleitschein');
      expect(labelEingerichtet(fall)).toBe(false);
      const schein = await erstelleVersandschein(SENDUNG, { ...fall, fetchImpl: fetchImpl as never });
      expect(schein.anbieter).toBe('begleitschein');
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it('die Seiten zum Einschicken rufen kein Label ab, auch mit vollständigem Zugang (A-035, bis zur Ablage am Vorgang)', async () => {
    const geprueft = einsendeVorgang(
      { quelle: EINSENDE_QUELLE, originale: 1, stueckzahl: 1, schluesselart: 'haus', sicherungskarte: 'nein', versand: 'dhl-paket' },
      { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', street: 'Musterweg 12a', postalCode: '35576', city: 'Wetzlar', country: 'Deutschland' },
    );
    if (!geprueft.ok) throw new Error('Testdaten ungültig');
    const vorgang = {
      reference: 'SM24-A-2026-0007', kind: 'anfrage', area: 'schluessel-nach-vorlage', contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', street: 'Musterweg 12a', postalCode: '35576', city: 'Wetzlar', country: 'Deutschland' },
      payload: { ...geprueft.payload },
    } as unknown as BusinessRecord;
    const firma: CompanyProfile = { ...defaults.settings().company, isPlaceholder: false, legalName: 'Testwerkstatt Lahn', street: 'Werkstattgasse 7', postalCode: '35578', city: 'Wetzlar', country: 'Deutschland', location: undefined };
    const fetchSpion = vi.spyOn(globalThis, 'fetch');
    const schein = await begleitscheinZumVorgang(vorgang, { company: firma, einstellungen: AN, env: PAKET_ENV });
    expect(schein?.anbieter).toBe('begleitschein');
    expect(fetchSpion).not.toHaveBeenCalled();
  });

  it('nennt fehlende Variablen nur mit Namen, nie mit Werten', () => {
    expect(dhlPaketFehlt({})).toEqual([
      'DHL_API_KEY (API-Schlüssel aus dem DHL-Entwicklerportal)',
      'DHL_USER (Benutzer des Geschäftskundenportals)',
      'DHL_PASSWORD (Passwort dieses Benutzers)',
      'DHL_PAKET_ABRECHNUNGSNUMMER (14-stellige Abrechnungsnummer aus dem Vertrag)',
    ]);
    expect(dhlPaketFehlt(PAKET_ENV)).toEqual([]);
    expect(JSON.stringify(labelWegStand({ einstellungen: AN, env: PAKET_ENV }))).not.toContain('test-passwort');
  });
});

describe('DHL Paket: Aufbau mit Attrappe (Sandbox-Adresse, kein Netz)', () => {
  it('baut den Auftrag: Absender der Kunde, Empfänger die Werkstatt, Abrechnungsnummer, Vorgangsnummer', () => {
    expect(dhlPaketAuftrag(SENDUNG, { abrechnungsnummer: '12345678901234', produkt: 'V01PAK' })).toEqual({
      profile: 'STANDARD_GRUPPENPROFIL',
      shipments: [
        {
          product: 'V01PAK',
          billingNumber: '12345678901234',
          refNo: 'SM24-E-2026-0001',
          shipper: { name1: 'Erika Muster', addressStreet: 'Musterweg', addressHouse: '12a', postalCode: '35576', city: 'Wetzlar', country: 'DEU' },
          consignee: { name1: 'Testwerkstatt Lahn', addressStreet: 'Werkstattgasse', addressHouse: '7', postalCode: '35578', city: 'Wetzlar', country: 'DEU' },
          details: { weight: { uom: 'g', value: 500 } },
        },
      ],
    });
  });

  it('ruft mit Schalter und Zugang die Sandbox auf und liefert ein Label, das nie „kostenlos“ ist (R9)', async () => {
    expect(dhlPaketZugang(PAKET_ENV)?.basis).toBe(DHL_PAKET_SANDBOX);
    const fetchImpl = attrappe();
    const schein = await erstelleVersandschein(SENDUNG, { einstellungen: AN, env: PAKET_ENV, fetchImpl: fetchImpl as never });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${DHL_PAKET_SANDBOX}orders?docFormat=PDF&includeDocs=include`);
    expect((init.headers as Record<string, string>)['dhl-api-key']).toBe('test-schluessel');
    expect(JSON.parse(init.body as string).shipments[0].billingNumber).toBe('12345678901234');
    expect(schein).toMatchObject({ anbieter: 'dhl-paket', sendungsnummer: '00340434000000000001', kostenlos: false });
    expect(schein.pdf.toString('latin1')).toContain('Testpaketlabel');
  });

  it('erzeugt für Briefe und Auslandsanschriften kein Label; der Begleitschein folgt', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const sendung of [{ ...SENDUNG, art: 'einschreiben-einwurf' as const }, { ...SENDUNG, absender: { ...SENDUNG.absender, land: 'Österreich' } }]) {
      const fetchImpl = attrappe();
      const schein = await erstelleVersandschein(sendung, { einstellungen: AN, env: PAKET_ENV, fetchImpl: fetchImpl as never });
      expect(schein.anbieter).toBe('begleitschein');
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it('fällt bei einem Fehler der Schnittstelle auf den Begleitschein zurück', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 400 }));
    const schein = await erstelleVersandschein(SENDUNG, { einstellungen: AN, env: PAKET_ENV, fetchImpl: fetchImpl as never });
    expect(schein.anbieter).toBe('begleitschein');
  });
});

describe('Anzeige im Admin: welcher Weg aktiv ist und was fehlt', () => {
  it('heute: Begleitschein, DHL Paket abgeschaltet mit Vertrag, Variablen und Schalter als fehlend', () => {
    const stand = labelWegStand({ einstellungen: E, env: {} });
    expect(stand.aktiv).toBe('begleitschein');
    expect(stand.fehltPaket[0]).toMatch(/Geschäftskundenvertrag/);
    expect(stand.fehltPaket).toEqual(expect.arrayContaining(['Variable VERSAND_PROVIDER=dhl-paket', 'Schalter „Versandlabel aktiv“ in diesen Einstellungen']));
    expect(stand.zeilen[0]).toBe('Aktiver Weg: Begleitschein. Der Kunde druckt ihn aus und frankiert selbst.');
    expect(stand.zeilen.join(' ')).not.toMatch(/kostenlos|trägt der Betrieb/);
  });

  it('mit Zugang und Schalter fehlt nichts mehr; die Seiten bleiben beim Begleitschein, bis das Label gespeichert wird', () => {
    const stand = labelWegStand({ einstellungen: AN, env: PAKET_ENV });
    expect(stand.fehltPaket).toEqual([]);
    expect(stand.aktiv).toBe('begleitschein');
    expect(stand.zeilen.join(' ')).toContain('bis das Label einmal erzeugt und am Vorgang gespeichert wird');
    expect(labelWegStand({ einstellungen: E, env: { VERSAND_PROVIDER: 'attrappe' } }).aktiv).toBe('attrappe');
  });
});
