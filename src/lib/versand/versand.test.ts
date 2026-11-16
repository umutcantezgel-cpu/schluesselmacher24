import { afterEach, describe, expect, it, vi } from 'vitest';

import { defaults } from '../data/defaults';
import { formatCents } from '../format';
import type { EinsendeEinstellungen } from '../types';

import { einsendeAngebot, varianteWaehlbar } from './angebot';
import { begleitscheinInhalt } from './begleitschein';
import { DHL_SANDBOX, dhlAuftrag, dhlZugang, strasseUndNummer } from './dhl-retoure';
import { erstelleVersandschein, labelEingerichtet, versandAnbieter } from './index';
import type { Sendung } from './typen';
import { PORTO_UNBELEGT, VERPACKUNG_HINWEIS, empfehlungFuer, variantenAus, versandBezeichnung } from './varianten';

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
  it('behalten die alten Felder lesbar und kein Retourenlabel (G6)', () => {
    expect(E).toMatchObject({ labelAktiv: false, portoVersichertCents: 445, portoUnversichertCents: 180, haftungVersichertEuro: 25 });
  });

  it('haben die drei Varianten des Inhabers mit Haftung aus seiner Tabelle und belegtem Porto (A-050)', () => {
    expect(variantenAus(E).map((v) => [v.kennung, v.haftungEuro, v.portoCents, v.nurSonderfall])).toEqual([
      ['dhl-paket', 500, 769, false],
      ['einschreiben-einwurf', 20, 415, false],
      ['einschreiben-wert', 500, 625, true],
    ]);
    expect(variantenAus(E).every((v) => v.portoStand.includes('Stand 1.1.2026'))).toBe(true);
    // Ältere Stände ohne Varianten bekommen die Startwerte.
    expect(variantenAus({}).map((v) => v.kennung)).toEqual(['dhl-paket', 'einschreiben-einwurf', 'einschreiben-wert']);
  });
});

describe('einsendeAngebot (A-050)', () => {
  const sichtbar = (a: ReturnType<typeof einsendeAngebot>) =>
    [a.satz, ...[...a.optionen, ...a.sonderfaelle].flatMap((o) => [o.titel, o.einsatz, o.haftung, o.warnung ?? '', o.portoText, o.hinweis])].join(' ');

  it('nennt keine Variante „versichert“ und verspricht ohne Label nichts kostenlos (R9)', () => {
    const a = einsendeAngebot(E, false);
    expect(a.kostenlos).toBe(false);
    expect(a.satz).toContain('das Porto zahlen Sie bei der Post');
    expect(sichtbar(a)).not.toMatch(/versichert|kostenlos|gratis|umsonst/i);
    expect([...a.optionen, ...a.sonderfaelle].map((o) => o.titel)).toEqual(['DHL Paket', 'Einschreiben Einwurf', 'Einschreiben Wert']);
  });

  it('zeigt beim Einwurf die Haftung von 20 € und warnt vor dem Wert eines Autoschlüssels', () => {
    const einwurf = einsendeAngebot(E, false).optionen.find((o) => o.art === 'einschreiben-einwurf')!;
    expect(einwurf.haftung).toBe('Haftung bis 20 € je Sendung');
    expect(einwurf.warnung).toBe('Ein Schaden über 20 € ist nicht gedeckt. Der Wert eines Autoschlüssels liegt meist darüber.');
    expect(einwurf.hinweis).toContain('20 €');
    const paket = einsendeAngebot(E, false).optionen.find((o) => o.art === 'dhl-paket')!;
    expect(paket.haftung).toBe('Haftung bis 500 € je Sendung');
    expect(paket.warnung).toBeUndefined();
  });

  it('wählt bei Autoschlüsseln, Elektronik und wertvollen Schlüsseln DHL Paket vor, sonst nichts', () => {
    expect(empfehlungFuer({ schluesselart: 'auto-mechanisch' })).toBe('autoschluessel');
    expect(empfehlungFuer({ schluesselart: 'elektronik' })).toBe('originalschluessel');
    expect(empfehlungFuer({ schluesselart: 'haus', wertvoll: true })).toBe('originalschluessel');
    expect(empfehlungFuer({ schluesselart: 'haus', wertvoll: false })).toBeNull();

    const auto = einsendeAngebot(E, false, { empfehlung: empfehlungFuer({ schluesselart: 'auto-mechanisch' }) });
    expect(auto.vorauswahl).toBe('dhl-paket');
    expect(auto.optionen.filter((o) => o.empfohlen).map((o) => o.art)).toEqual(['dhl-paket']);
    // Der Einwurf bleibt wählbar, mit Warnhinweis.
    expect(varianteWaehlbar(auto, 'einschreiben-einwurf', false)).toBe(true);
    expect(auto.optionen.find((o) => o.art === 'einschreiben-einwurf')?.warnung).toBeTruthy();

    const haus = einsendeAngebot(E, false, { empfehlung: null });
    expect(haus.vorauswahl).toBe('');
    expect(haus.optionen.some((o) => o.empfohlen)).toBe(false);
  });

  it('rechnet die Summe aus Porto und Aufpreis des Betriebs', () => {
    const varianten = variantenAus(E).map((v) => (v.kennung === 'dhl-paket' ? { ...v, aufpreisCents: 150 } : v));
    const a = einsendeAngebot({ ...E, varianten }, false);
    const paket = a.optionen.find((o) => o.art === 'dhl-paket')!;
    expect([paket.portoCents, paket.aufpreisCents, paket.summeCents]).toEqual([769, 150, 919]);
    expect(paket.hinweis).toContain(`Aufpreis ${formatCents(150)}`);
    const einwurf = a.optionen.find((o) => o.art === 'einschreiben-einwurf')!;
    expect([einwurf.portoCents, einwurf.aufpreisCents, einwurf.summeCents]).toEqual([415, 0, 415]);
  });

  it('sagt ohne belegtes Porto „Porto laut Post, bitte dort prüfen“ und nennt keine Summe (R4)', () => {
    const varianten = variantenAus(E).map((v) => (v.kennung === 'einschreiben-einwurf' ? { ...v, portoCents: null } : v));
    const einwurf = einsendeAngebot({ ...E, varianten }, false).optionen.find((o) => o.art === 'einschreiben-einwurf')!;
    expect(einwurf.portoText).toBe(PORTO_UNBELEGT);
    expect(einwurf.portoCents).toBeUndefined();
    expect(einwurf.summeCents).toBeUndefined();
  });

  it('zeigt den Sonderfall nur mit Freigabe des Teams oder bestätigtem Hinweis', () => {
    const ohne = einsendeAngebot(E, false);
    expect(ohne.optionen.map((o) => o.art)).not.toContain('einschreiben-wert');
    expect(ohne.sonderfaelle.map((o) => o.art)).toEqual(['einschreiben-wert']);
    expect(varianteWaehlbar(ohne, 'einschreiben-wert', false)).toBe(false);
    expect(varianteWaehlbar(ohne, 'einschreiben-wert', true)).toBe(true);
    const frei = einsendeAngebot(E, false, { sonderfallFrei: true });
    expect(frei.optionen.map((o) => o.art)).toContain('einschreiben-wert');
    expect(varianteWaehlbar(frei, 'einschreiben-wert', false)).toBe(true);
    // Abgeschaltete Varianten und Altwerte sind nie wählbar.
    const aus = einsendeAngebot({ ...E, varianten: variantenAus(E).map((v) => ({ ...v, aktiv: v.kennung !== 'einschreiben-einwurf' })) }, false);
    expect(varianteWaehlbar(aus, 'einschreiben-einwurf', true)).toBe(false);
    expect(varianteWaehlbar(ohne, 'versichert', true)).toBe(false);
    expect(varianteWaehlbar(ohne, 'unversichert', true)).toBe(false);
  });

  it('nennt den Verpackungshinweis im Wortlaut des Inhabers', () => {
    expect(einsendeAngebot(E, false).verpackung).toBe(VERPACKUNG_HINWEIS);
    expect(VERPACKUNG_HINWEIS).toContain('nicht lose in einen einfachen Papierumschlag');
    expect(VERPACKUNG_HINWEIS).toContain('gepolstert beziehungsweise stabil verpacken');
  });

  it('bietet das Label nur mit Schalter und eingerichtetem Zugang, und nur für DHL Paket', () => {
    expect(einsendeAngebot({ ...E, labelAktiv: true }, false).kostenlos).toBe(false);
    expect(einsendeAngebot(E, true).kostenlos).toBe(false);
    const mit = einsendeAngebot({ ...E, labelAktiv: true }, true);
    expect(mit.kostenlos).toBe(true);
    const paket = mit.optionen.find((o) => o.art === 'dhl-paket')!;
    expect(paket).toMatchObject({ label: true, summeCents: 0, portoText: 'Versandlabel von uns, das Porto zahlt SCHLÜSSELMACHER24' });
    expect(paket.portoCents).toBeUndefined();
    expect(mit.optionen.find((o) => o.art === 'einschreiben-einwurf')).toMatchObject({ label: false, portoCents: 415 });
    // Mit Aufpreis wird er im Auftrag berechnet, nie „kostenlos“ genannt.
    const varianten = variantenAus(E).map((v) => (v.kennung === 'dhl-paket' ? { ...v, aufpreisCents: 500 } : v));
    const berechnet = einsendeAngebot({ ...E, labelAktiv: true, varianten }, true).optionen.find((o) => o.art === 'dhl-paket')!;
    expect(berechnet.portoText).toBe(`Versandlabel von uns, ${formatCents(500)} werden mit dem Auftrag berechnet`);
    expect(berechnet.summeCents).toBe(500);
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
    // Ältere Vorgänge (vor den Varianten) behalten ihre Angabe (G6).
    expect(text).toContain('als Einschreiben aufgeben (4,45');
    expect(text).toContain('Keinen Anhänger mit Ihrer Anschrift am Schlüssel');
    expect(text).toContain(VERPACKUNG_HINWEIS);
    expect(text).not.toMatch(/kostenlos|gratis|umsonst/i);
  });

  it('nennt die gewählte Variante mit Abgabe, Porto, Haftung und Stand (A-050)', () => {
    const paket = JSON.stringify(begleitscheinInhalt({ ...SENDUNG, art: 'dhl-paket' }, E));
    expect(paket).toContain('"wert":"DHL Paket"');
    expect(paket).toContain(`Als DHL Paket aufgeben (Abgabe: Filiale oder Paketshop): ${formatCents(769)} Porto laut Post, Haftung bis 500 € je Sendung.`);
    expect(paket).toContain('Stand 1.1.2026');
    expect(paket).not.toMatch(/versichert/i);
    const einwurf = JSON.stringify(begleitscheinInhalt({ ...SENDUNG, art: 'einschreiben-einwurf' }, E));
    expect(einwurf).toContain('Haftung bis 20 € je Sendung');
    expect(einwurf).toContain('Der Wert eines Autoschlüssels liegt meist darüber.');
    expect(versandBezeichnung('versichert')).toBe('Einschreiben (ältere Angabe)');
    expect(versandBezeichnung('einschreiben-wert')).toBe('Einschreiben Wert');
  });

  it('ist ein PDF; die Attrappe ist als solche erkennbar', async () => {
    const echt = await versandAnbieter({ einstellungen: E, env: {} }).erstelle(SENDUNG);
    expect(echt.pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    expect(echt).toMatchObject({ anbieter: 'begleitschein', dateiname: 'Begleitschein-SM24-E-2026-0001.pdf', kostenlos: false });
    const probe = await versandAnbieter({ einstellungen: E, env: { VERSAND_PROVIDER: 'attrappe' } }).erstelle(SENDUNG);
    expect(probe).toMatchObject({ anbieter: 'attrappe', sendungsnummer: 'ATTRAPPE-SM24-E-2026-0001' });
  });
});
