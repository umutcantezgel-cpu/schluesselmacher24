import { afterEach, describe, expect, it, vi } from 'vitest';

import { defaults } from '../data/defaults';
import type { EinsendeEinstellungen } from '../types';

import { einsendeAngebot } from './angebot';
import { begleitscheinInhalt } from './begleitschein';
import { DHL_SANDBOX, dhlAuftrag, dhlZugang, strasseUndNummer } from './dhl-retoure';
import { erstelleVersandschein, labelEingerichtet, versandAnbieter } from './index';
import type { Sendung } from './typen';

const E: EinsendeEinstellungen = defaults.settings().sendIn!;

/* Erfundene Testdaten (G4). */
const SENDUNG: Sendung = {
  vorgangsnummer: 'SM24-E-2026-0001',
  art: 'versichert',
  absender: { name: 'Erika Muster', strasse: 'Musterweg 12a', plz: '35576', ort: 'Wetzlar', land: 'Deutschland' },
  empfaenger: { name: 'SCHLÜSSELMACHER24', strasse: 'Teststraße 1', plz: '35576', ort: 'Wetzlar' },
  inhalt: '1 Schlüssel zum Nachmachen',
};

const DHL_ENV = {
  VERSAND_PROVIDER: 'dhl-retoure',
  DHL_API_KEY: 'test-schluessel',
  DHL_USER: 'test-benutzer',
  DHL_PASSWORD: 'test-passwort',
  DHL_RETOURE_EMPFAENGER: 'deu',
};

afterEach(() => vi.restoreAllMocks());

describe('Standardwerte Einsenden', () => {
  it('haben die Portopreise der Post 2026 und kein Retourenlabel', () => {
    expect(E).toMatchObject({ labelAktiv: false, portoVersichertCents: 445, portoUnversichertCents: 180, haftungVersichertEuro: 25 });
  });
});

describe('einsendeAngebot', () => {
  it('verspricht ohne Retourenlabel nichts kostenlos und nennt das Porto als Empfehlung (R9)', () => {
    const a = einsendeAngebot(E, false);
    expect(a.kostenlos).toBe(false);
    expect(a.satz).toContain('das Porto zahlen Sie bei der Post');
    const sichtbar = [a.satz, a.stand, ...a.optionen.flatMap((o) => [o.titel, o.hinweis])].join(' ');
    expect(sichtbar).not.toMatch(/kostenlos|gratis|umsonst/i);
    expect(a.optionen.map((o) => [o.art, o.empfohlen, o.portoCents])).toEqual([
      ['versichert', true, 445],
      ['unversichert', false, 180],
    ]);
    expect(a.optionen[0].hinweis).toBe('Empfohlen: als Einschreiben, 4,45 € bei der Post, Haftung bis 25 €.');
    expect(a.stand).toContain('1.1.2026');
  });

  it('sagt nur mit Schalter und eingerichtetem Zugang, dass der Betrieb das Porto zahlt', () => {
    expect(einsendeAngebot({ ...E, labelAktiv: true }, false).kostenlos).toBe(false);
    expect(einsendeAngebot(E, true).kostenlos).toBe(false);
    const mit = einsendeAngebot({ ...E, labelAktiv: true }, true);
    expect(mit.kostenlos).toBe(true);
    expect(mit.satz).toBe('Sie drucken das Versandlabel aus, das Porto zahlt SCHLÜSSELMACHER24.');
    expect(mit.optionen.every((o) => o.portoCents === undefined)).toBe(true);
  });
});

describe('versandAnbieter', () => {
  it('nimmt ohne Angabe den Begleitschein', () => {
    expect(versandAnbieter({ einstellungen: E, env: {} }).name).toBe('begleitschein');
    expect(labelEingerichtet({ einstellungen: E, env: {} })).toBe(false);
  });

  it('nimmt die Attrappe für Tests und Probeläufe', () => {
    expect(versandAnbieter({ einstellungen: E, env: { VERSAND_PROVIDER: 'attrappe' } }).name).toBe('attrappe');
  });

  it('nimmt DHL nur mit Schalter und vollständigem Zugang', () => {
    expect(versandAnbieter({ einstellungen: E, env: DHL_ENV }).name).toBe('begleitschein');
    expect(versandAnbieter({ einstellungen: { ...E, labelAktiv: true }, env: { ...DHL_ENV, DHL_PASSWORD: '' } }).name).toBe('begleitschein');
    expect(versandAnbieter({ einstellungen: { ...E, labelAktiv: true }, env: DHL_ENV }).name).toBe('dhl-retoure');
    expect(labelEingerichtet({ einstellungen: { ...E, labelAktiv: true }, env: DHL_ENV })).toBe(true);
    expect(dhlZugang(DHL_ENV)?.basis).toBe(DHL_SANDBOX);
  });
});

describe('DHL Retoure', () => {
  it('trennt Straße und Hausnummer', () => {
    expect(strasseUndNummer('Musterweg 12a')).toEqual({ strasse: 'Musterweg', nummer: '12a' });
    expect(strasseUndNummer('Am Hang 3 - 5')).toEqual({ strasse: 'Am Hang', nummer: '3-5' });
    expect(strasseUndNummer('Hauptstraße')).toEqual({ strasse: 'Hauptstraße', nummer: '' });
  });

  it('baut den Auftrag mit Vorgangsnummer als Referenz', () => {
    expect(dhlAuftrag(SENDUNG, { empfaengerId: 'deu' })).toEqual({
      receiverId: 'deu',
      customerReference: 'SM24-E-2026-0001',
      shipmentReference: 'SM24-E-2026-0001',
      shipper: { name1: 'Erika Muster', addressStreet: 'Musterweg', addressHouse: '12a', postalCode: '35576', city: 'Wetzlar' },
    });
  });

  it('ruft die Schnittstelle mit Schlüssel und Anmeldung auf und liefert das Label (Attrappe statt Netz, G5)', async () => {
    const label = Buffer.from('%PDF-1.4 Testlabel').toString('base64');
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ shipmentNo: '999990000001', label: { b64: label } }), { status: 201 }));
    const schein = await erstelleVersandschein(SENDUNG, { einstellungen: { ...E, labelAktiv: true }, env: DHL_ENV, fetchImpl: fetchImpl as never });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${DHL_SANDBOX}orders?labelType=SHIPMENT_LABEL`);
    const kopf = init.headers as Record<string, string>;
    expect(kopf['dhl-api-key']).toBe('test-schluessel');
    expect(kopf.Authorization).toBe(`Basic ${Buffer.from('test-benutzer:test-passwort').toString('base64')}`);
    expect(JSON.parse(init.body as string).receiverId).toBe('deu');
    expect(schein).toMatchObject({ anbieter: 'dhl-retoure', sendungsnummer: '999990000001', kostenlos: true });
    expect(schein.pdf.toString('latin1')).toContain('Testlabel');
  });

  it('fällt bei einem Fehler auf den Begleitschein zurück', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 503 }));
    const schein = await erstelleVersandschein(SENDUNG, { einstellungen: { ...E, labelAktiv: true }, env: DHL_ENV, fetchImpl: fetchImpl as never });
    expect(schein.anbieter).toBe('begleitschein');
    expect(schein.kostenlos).toBe(false);
    expect(schein.pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });
});

describe('Begleitschein', () => {
  it('enthält Anschrift zum Ausschneiden, Absender, Schritte und das Porto, nie „kostenlos“', () => {
    const blatt = begleitscheinInhalt(SENDUNG, E, { jetzt: new Date('2026-11-03T09:00:00Z') });
    expect(blatt.titel).toBe('Begleitschein SM24-E-2026-0001');
    expect(blatt.abschnitte[0]).toEqual({ titel: 'Anschrift für den Umschlag', adressfeld: ['SCHLÜSSELMACHER24', 'Teststraße 1', '35576 Wetzlar'] });
    const text = JSON.stringify(blatt);
    expect(text).toContain('als Einschreiben (Empfehlung, 4,45');
    expect(text).toContain('Keinen Anhänger mit Ihrer Anschrift am Schlüssel');
    expect(text).not.toMatch(/kostenlos|gratis|umsonst/i);
  });

  it('ist ein PDF; die Attrappe ist als solche erkennbar', async () => {
    const echt = await versandAnbieter({ einstellungen: E, env: {} }).erstelle(SENDUNG);
    expect(echt.pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    expect(echt).toMatchObject({ anbieter: 'begleitschein', dateiname: 'Begleitschein-SM24-E-2026-0001.pdf', kostenlos: false });
    const probe = await versandAnbieter({ einstellungen: E, env: { VERSAND_PROVIDER: 'attrappe' } }).erstelle(SENDUNG);
    expect(probe).toMatchObject({ anbieter: 'attrappe', sendungsnummer: 'ATTRAPPE-SM24-E-2026-0001' });
  });
});
