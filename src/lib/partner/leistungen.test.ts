import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { AUFTRAGSARTEN } from '@/payload/collections/Partnerbetriebe';
import {
  auftragsartAmVorgangPruefen,
  auftragsartenPruefen,
  bewerbungEinsetzen,
  HINWEIS_FRUEHERE_LEISTUNGEN,
  provisionenPruefen,
} from '@/payload/hooks/partner-bewerbung';

import {
  bewerbungPruefen,
  bewerbungZusammenfassung,
  MAX_RADIUS_KM,
  MELDUNG_NUR_FAHRZEUG,
  partnerbetriebAusBewerbung,
} from './bewerbungsformular';
import { PARTNER_LEISTUNGEN } from './gewinnung';
import {
  AUFTRAGSART_OPTIONEN,
  AUFTRAGSART_SAMMELWERT,
  AUFTRAGSART_SAMMELWERT_NAME,
  auftragsartName,
  decktAuftragsart,
  FRUEHERE_AUFTRAGSARTEN,
  istPartnerLeistung,
  nichtMehrWaehlbar,
  nichtMehrWaehlbarFuerAuftrag,
  PARTNER_LEISTUNGEN_LISTE,
  provisionsEintragWaehlen,
} from './leistungen';
import { darfVermitteln } from './vermittlung';

/* FA-PLATTFORM-01 Teil A: neun Leistungen als eine Liste, alte Werte lesbar, Bewerbung mit Serverprüfung.
 * Erfundene Betriebe (G13). */

const KONTAKT = { firstName: 'Erika', lastName: 'Test', email: 'erika@example.org', phone: '0641 123456' };

const GUELTIG = {
  firma: 'Testbetrieb Fahrzeugschlüssel GmbH',
  plz: '35576',
  ort: 'Wetzlar',
  einsatzPostleitzahlen: '355*, 35390',
  einsatzradiusKm: 40,
  mobileEinsaetze: true,
  werkstatt: { vorhanden: true, anschrift: 'Teststraße 1' },
  leistungen: ['transponder', 'schluessel-nachmachen'],
  geraete: [{ art: 'programmiergeraet', hersteller: 'Testhersteller', typ: 'T1' }],
  erfahrung: { jahre: 7, schwerpunkte: 'Zweitschlüssel', fahrzeugabdeckung: 'Kleinwagen bis Transporter' },
  qualifikationen: 'Meister',
  nachweisAnzahl: 1,
  datenschutz: true,
  datenschutzAm: '2026-11-16T10:00:00.000Z',
};

describe('Leistungen des Partnernetzes (FA-07-02 bis FA-07-12)', () => {
  it('sind genau die neun des Inhabers, eine Liste für Formular, Sammlung und Seiten', () => {
    expect(PARTNER_LEISTUNGEN_LISTE.map((l) => l.label)).toEqual([
      'Autoschlüssel nachmachen',
      'Programmierung und Anlernen',
      'Schlüsselverlust',
      'Keyless und Smart Key',
      'Transponder',
      'Funk',
      'Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln',
      'Reparaturen und Gehäuse',
      'Motorrad und weitere Fahrzeugschlüssel',
    ]);
    expect(PARTNER_LEISTUNGEN.map((p) => p.titel)).toEqual(PARTNER_LEISTUNGEN_LISTE.map((l) => l.label));
    expect(AUFTRAGSARTEN).toBe(AUFTRAGSART_OPTIONEN);
  });

  it('nennt keine Türöffnung an Wohnung oder Haus, keine Schließtechnik, keinen Zutritt', () => {
    const text = PARTNER_LEISTUNGEN_LISTE.map((l) => `${l.label} ${l.beschreibung}`).join(' ');
    expect(text).not.toMatch(/Wohnung|Haustür|Schließtechnik|Zutritt|Sicherheitstechnik|Zylinder/);
  });

  it('hält alte Werte lesbar und kennzeichnet sie als früher', () => {
    const werte = AUFTRAGSART_OPTIONEN.map((o) => o.value);
    for (const alt of ['autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik']) {
      expect(werte).toContain(alt);
    }
    for (const f of FRUEHERE_AUFTRAGSARTEN) {
      expect(AUFTRAGSART_OPTIONEN.find((o) => o.value === f.value)?.label).toMatch(/^früher: /);
    }
    expect(auftragsartName('montage-zylinder')).toBe('Montage Zylinder');
    expect(auftragsartName('tueroeffnung')).toBe('Türöffnung');
  });

  it('lässt frühere Werte am Partnerbetrieb nicht neu setzen, Bestand bleibt', () => {
    expect(nichtMehrWaehlbar(['transponder', 'schluesseldienst-vor-ort'], [])).toEqual(['schluesseldienst-vor-ort']);
    expect(nichtMehrWaehlbar(['transponder', 'schluesseldienst-vor-ort'], ['schluesseldienst-vor-ort'])).toEqual([]);
    expect(nichtMehrWaehlbar([AUFTRAGSART_SAMMELWERT], [])).toEqual([AUFTRAGSART_SAMMELWERT]);
    expect(auftragsartenPruefen(['montage-zylinder'], null)).toMatch(/nur Autoschlüssel und Fahrzeugschlüssel.*Montage Zylinder/);
    expect(auftragsartenPruefen(['funk'], null)).toBeNull();
    expect(auftragsartenPruefen(undefined, ['montage-zylinder'])).toBeNull();
  });

  it('der Sammelwert für Autoschlüssel-Aufträge passt zu jedem Partner mit einer der neun Leistungen', () => {
    expect(decktAuftragsart(['transponder'], AUFTRAGSART_SAMMELWERT)).toBe(true);
    expect(decktAuftragsart(['montage-zylinder'], AUFTRAGSART_SAMMELWERT)).toBe(false);
    expect(decktAuftragsart(['transponder'], 'funk')).toBe(false);
    expect(darfVermitteln({ status: 'freigeschaltet', auftragsarten: ['funk'] }, AUFTRAGSART_SAMMELWERT)).toBe(true);
    expect(darfVermitteln({ status: 'pausiert', auftragsarten: ['funk'] }, AUFTRAGSART_SAMMELWERT)).toBe(false);
    expect(istPartnerLeistung('tueroeffnung')).toBe(false);
  });

  it('hat für den Sammelwert einen Namen in Auswahl und PDF', () => {
    expect(AUFTRAGSART_OPTIONEN.find((o) => o.value === AUFTRAGSART_SAMMELWERT)?.label).toBe(AUFTRAGSART_SAMMELWERT_NAME);
    expect(auftragsartName(AUFTRAGSART_SAMMELWERT)).toBe(AUFTRAGSART_SAMMELWERT_NAME);
  });

  it('lässt frühere Werte an Provisionen und am Vorgang nicht neu setzen, der Sammelwert bleibt', () => {
    expect(nichtMehrWaehlbarFuerAuftrag([AUFTRAGSART_SAMMELWERT, 'montage-zylinder'], [])).toEqual(['montage-zylinder']);
    expect(provisionenPruefen([{ auftragsart: 'schluesseldienst-vor-ort', prozent: 10 }], [])).toMatch(/Schlüsseldienst vor Ort/);
    expect(provisionenPruefen([{ auftragsart: AUFTRAGSART_SAMMELWERT }, { auftragsart: 'funk' }], null)).toBeNull();
    // Bestehende Zeile mit früherem Wert bleibt speicherbar.
    expect(provisionenPruefen([{ auftragsart: 'beratung-vor-ort' }], [{ auftragsart: 'beratung-vor-ort' }])).toBeNull();
    expect(provisionenPruefen(undefined, [])).toBeNull();
    expect(auftragsartAmVorgangPruefen('schluesseldienst-vor-ort', null)).toMatch(/nur Autoschlüssel und Fahrzeugschlüssel.*Schlüsseldienst vor Ort/);
    expect(auftragsartAmVorgangPruefen('schluesseldienst-vor-ort', 'schluesseldienst-vor-ort')).toBeNull();
    expect(auftragsartAmVorgangPruefen(AUFTRAGSART_SAMMELWERT, null)).toBeNull();
    expect(auftragsartAmVorgangPruefen('transponder', 'montage-zylinder')).toBeNull();
    expect(auftragsartAmVorgangPruefen(undefined, null)).toBeNull();
  });

  it('wählt die Provision für den Sammelwert nach fester Regel', () => {
    // Eigener Eintrag zuerst.
    expect(provisionsEintragWaehlen([{ auftragsart: 'funk', prozent: 5 }, { auftragsart: AUFTRAGSART_SAMMELWERT, prozent: 10 }], AUFTRAGSART_SAMMELWERT).eintrag?.prozent).toBe(10);
    // Sonst die neun, wenn sie gleich sind.
    expect(provisionsEintragWaehlen([{ auftragsart: 'schluessel-nachmachen', prozent: 12 }], AUFTRAGSART_SAMMELWERT).eintrag?.prozent).toBe(12);
    expect(
      provisionsEintragWaehlen([{ auftragsart: 'funk', prozent: 12 }, { auftragsart: 'transponder', prozent: 12 }], AUFTRAGSART_SAMMELWERT).eintrag?.prozent,
    ).toBe(12);
    // Abweichende Einträge: keine Wahl, das Team trägt von Hand ein.
    expect(provisionsEintragWaehlen([{ auftragsart: 'funk', prozent: 12 }, { auftragsart: 'transponder', prozent: 8 }], AUFTRAGSART_SAMMELWERT)).toEqual({ mehrdeutig: true });
    // Frühere Werte zählen für den Sammelwert nicht; eine einzelne Leistung nur für sich.
    expect(provisionsEintragWaehlen([{ auftragsart: 'montage-zylinder', prozent: 20 }], AUFTRAGSART_SAMMELWERT)).toEqual({});
    expect(provisionsEintragWaehlen([{ auftragsart: 'funk', prozent: 12 }], 'transponder')).toEqual({});
    expect(provisionsEintragWaehlen([{ auftragsart: 'funk', prozent: 12 }], null)).toEqual({});
  });
});

describe('Bewerbung: Serverprüfung aller Pflichtfelder (FA-08-09 bis FA-08-15)', () => {
  it('nimmt eine vollständige Bewerbung an und baut die Daten neu', () => {
    const ergebnis = bewerbungPruefen({ ...GUELTIG, fremd: 'x' }, KONTAKT);
    expect(ergebnis.ok).toBe(true);
    if (!ergebnis.ok) return;
    expect(ergebnis.bewerbung).not.toHaveProperty('fremd');
    // Reihenfolge des Inhabers
    expect(ergebnis.bewerbung.leistungen).toEqual(['schluessel-nachmachen', 'transponder']);
    expect(ergebnis.bewerbung.einsatzPostleitzahlen).toBe('355*, 35390');
    const text = JSON.stringify(bewerbungZusammenfassung(ergebnis.bewerbung, KONTAKT));
    expect(text).toContain('Programmiergerät: Testhersteller T1');
    expect(text).toContain('Teststraße 1');
  });

  it('lehnt eine Bewerbung mit Türöffnung als Leistung ab', () => {
    const ergebnis = bewerbungPruefen({ ...GUELTIG, leistungen: ['tueroeffnung'] }, KONTAKT);
    expect(ergebnis).toEqual({ ok: false, fehler: [MELDUNG_NUR_FAHRZEUG] });
    const gemischt = bewerbungPruefen({ ...GUELTIG, leistungen: ['funk', 'schliesstechnik'] }, KONTAKT);
    expect(gemischt.ok).toBe(false);
  });

  it.each([
    ['Postleitzahl', { plz: '3557' }, /Postleitzahl des Betriebs/],
    ['Ort', { ort: '' }, /Ort des Betriebs/],
    ['Radius zu groß', { einsatzradiusKm: MAX_RADIUS_KM + 1 }, /Einsatzradius/],
    ['mobil ohne Radius', { einsatzradiusKm: null }, /mobile Einsätze fehlt der Radius/],
    ['kein Einsatzgebiet', { einsatzradiusKm: null, mobileEinsaetze: false, einsatzPostleitzahlen: '' }, /Einsatzgebiet fehlt/],
    ['falsche Postleitzahlen', { einsatzPostleitzahlen: '35a, 1234' }, /Postleitzahlen des Einsatzgebiets/],
    ['Werkstatt ohne Anschrift', { werkstatt: { vorhanden: true, anschrift: '' } }, /Anschrift der Werkstatt/],
    ['weder Werkstatt noch mobil', { werkstatt: { vorhanden: false }, mobileEinsaetze: false }, /Ohne Werkstatt/],
    ['Werkstatt unbeantwortet', { werkstatt: {} }, /festen Werkstatt/],
    ['keine Leistung', { leistungen: [] }, /mindestens eine Leistung/],
    ['Gerät ohne Art', { geraete: [{ hersteller: 'X' }] }, /Art wählen/],
    ['Erfahrung fehlt', { erfahrung: {} }, /Erfahrung/],
    ['Einwilligung fehlt', { datenschutz: false }, /Einwilligung/],
  ])('lehnt ab: %s', (_name, aenderung, meldung) => {
    const ergebnis = bewerbungPruefen({ ...GUELTIG, ...aenderung }, KONTAKT);
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.join(' ')).toMatch(meldung);
  });

  it('prüft die Kontaktdaten', () => {
    const ergebnis = bewerbungPruefen(GUELTIG, { ...KONTAKT, email: 'kein-at', phone: '12' });
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.join(' ')).toMatch(/E-Mail.*Telefon/);
  });
});

describe('Übernahme der Bewerbung in den Partnerbetrieb', () => {
  it('liest die neue Bewerbung vollständig', () => {
    const aus = partnerbetriebAusBewerbung(GUELTIG);
    expect(aus).toMatchObject({
      firma: GUELTIG.firma,
      plz: '35576',
      ort: 'Wetzlar',
      einsatzgebiet: { postleitzahlen: '355*, 35390', radiusKm: 40 },
      auftragsarten: ['schluessel-nachmachen', 'transponder'],
      geraete: [{ art: 'programmiergeraet', hersteller: 'Testhersteller', typ: 'T1' }],
      werkstatt: { vorhanden: 'ja', anschrift: 'Teststraße 1', mobil: true },
      erfahrung: { jahre: 7, schwerpunkte: 'Zweitschlüssel', fahrzeugabdeckung: 'Kleinwagen bis Transporter' },
    });
    expect(aus.fruehereLeistungen).toBeUndefined();
  });

  it('liest eine Bewerbung aus dem früheren Formular, frühere Leistungen nur als Hinweis', () => {
    const aus = partnerbetriebAusBewerbung({ firma: 'Altbetrieb', plz: '20095', ort: 'Hamburg', einsatzradiusKm: 50, mobileEinsaetze: true, leistungen: ['autoschluessel', 'tueroeffnung'], systeme: 'Marken A und B' });
    expect(aus.auftragsarten).toBeUndefined();
    expect(aus.fruehereLeistungen).toEqual(['Autoschlüssel', 'Türöffnung']);
    expect(aus.erfahrung?.fahrzeugabdeckung).toBe('Marken A und B');
    const daten = bewerbungEinsetzen({ bewerbung: 1 }, undefined, aus);
    expect(daten.notiz).toBe(`${HINWEIS_FRUEHERE_LEISTUNGEN} Autoschlüssel, Türöffnung.`);
  });

  it('füllt nur leere Felder und behält Eingaben des Teams', () => {
    const aus = partnerbetriebAusBewerbung(GUELTIG);
    const daten = bewerbungEinsetzen(
      { bewerbung: 4, ort: 'Gießen', einsatzgebiet: { radiusKm: 10 } },
      { firma: 'Vom Team', einsatzgebiet: { postleitzahlen: '' }, auftragsarten: ['funk'] },
      aus,
      { ansprechpartner: 'Erika Test', email: 'erika@example.org' },
    );
    expect(daten.firma).toBeUndefined();
    expect(daten.ort).toBe('Gießen');
    expect(daten.plz).toBe('35576');
    expect(daten.ansprechpartner).toBe('Erika Test');
    expect(daten.einsatzgebiet).toEqual({ postleitzahlen: '355*, 35390', radiusKm: 10 });
    expect(daten.auftragsarten).toBeUndefined();
    expect(daten.werkstatt).toEqual({ vorhanden: 'ja', anschrift: 'Teststraße 1', mobil: true });
  });

  it('überschreibt den Grundwert false der Checkbox aus dem Admin-Formular, ein gespeichertes true bleibt', () => {
    const aus = partnerbetriebAusBewerbung(GUELTIG);
    const ausAdmin = bewerbungEinsetzen({ bewerbung: 4, werkstatt: { mobil: false, vorhanden: null, anschrift: '' } }, undefined, aus);
    expect(ausAdmin.werkstatt).toEqual({ vorhanden: 'ja', anschrift: 'Teststraße 1', mobil: true });
    const ohneMobil = partnerbetriebAusBewerbung({ ...GUELTIG, mobileEinsaetze: false });
    const gespeichert = bewerbungEinsetzen({ bewerbung: 4, werkstatt: { mobil: true } }, { werkstatt: { mobil: true } }, ohneMobil);
    expect((gespeichert.werkstatt as { mobil?: boolean }).mobil).toBe(true);
  });
});

describe('Partnerformular (Quelltext)', () => {
  const quelle = readFileSync(path.resolve(__dirname, '../../app/(site)/partner-werden/partner-formular.tsx'), 'utf8');

  it('zeigt den Satz „nur Autoschlüssel und Fahrzeugschlüssel“ und nutzt die eine Liste', () => {
    expect(quelle).toContain('{NUR_FAHRZEUGSCHLUESSEL.text}');
    expect(quelle).toContain('PARTNER_LEISTUNGEN_LISTE.map(');
    expect(quelle).not.toMatch(/'schliesstechnik'|'tueroeffnung'|'zutritt'|'sicherheitstechnik'/);
  });

  it('fragt Region, Leistungen, Geräte, Werkstatt, Radius, Erfahrung und Kontakt in Schritten ab', () => {
    for (const schritt of ['betrieb', 'einsatz', 'leistungen', 'ausstattung', 'erfahrung', 'nachweise', 'pruefen']) {
      expect(quelle).toContain(`id: '${schritt}'`);
    }
    for (const feld of ['einsatzPostleitzahlen', 'einsatzradiusKm', 'werkstatt:', 'geraete:', 'erfahrung:']) {
      expect(quelle).toContain(feld);
    }
  });
});
