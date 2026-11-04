import { describe, expect, it } from 'vitest';

import { erzeugePdf } from './erzeuge-pdf';
import {
  PARTNERVERTRAG_ENTWURF_HINWEIS,
  PARTNERVERTRAG_PLATZHALTER,
  PARTNERVERTRAG_VORLAGE_PLATZHALTER,
  partnervertragBlatt,
  partnervertragDateiname,
  platzhalterEinsetzen,
  type PartnervertragAnbieter,
  type PartnervertragPartner,
  type PartnervertragVorlage,
} from './partnervertrag';

const JETZT = new Date('2026-11-04T18:00:00.000Z');

/* Erfundene Testdaten (G4). */
const ANBIETER: PartnervertragAnbieter = {
  legalName: 'Testwerkstatt GmbH',
  street: 'Musterweg 1',
  postalCode: '12345',
  city: 'Musterstadt',
};
const PARTNER: PartnervertragPartner = {
  id: 7,
  kennung: 'P-0007',
  firma: 'Testschlüssel Nord',
  ansprechpartner: 'Erika Testpartnerin',
  ort: 'Musterhausen',
  email: 'test@example.invalid',
  telefon: '0000 000000',
  abrechnungsmodell: 'A',
  einsatzgebiet: { postleitzahlen: '20095, 221*', radiusKm: 25 },
  auftragsarten: ['schluesseldienst-vor-ort', 'montage-zylinder'],
  provisionen: [{ auftragsart: 'montage-zylinder', prozent: 12.5 }],
};

const GEPRUEFT: PartnervertragVorlage = {
  titel: 'Partnervertrag',
  fassung: 'Testfassung 1',
  geprueft: true,
  abschnitte: [
    {
      titel: 'Parteien',
      text: '{{anbieter}} und {{firma}} ({{kennung}}), {{datum}}',
    },
  ],
};

describe('Platzhalter einsetzen (E7-OPUS-01, G-39)', () => {
  it('setzt bekannte Platzhalter ein, auch mit Leerzeichen in den Klammern', () => {
    const r = platzhalterEinsetzen('{{firma}} in {{ ort }}', {
      firma: 'A',
      ort: 'B',
    });
    expect(r).toEqual({ text: 'A in B', fehlend: [], unbekannt: [] });
  });

  it('meldet leere Werte als fehlend und lässt unbekannte Platzhalter sichtbar stehen', () => {
    const r = platzhalterEinsetzen('{{firma}} {{telefon}} {{iban}}', {
      firma: 'A',
      telefon: '  ',
    });
    expect(r.text).toBe('A [fehlt] {{iban}}');
    expect(r.fehlend).toEqual(['telefon']);
    expect(r.unbekannt).toEqual(['iban']);
  });

  it('die eingebaute Gliederung nutzt nur erlaubte Platzhalter', () => {
    const alle = PARTNERVERTRAG_VORLAGE_PLATZHALTER.abschnitte.flatMap((a) => [...a.text.matchAll(/\{\{\s*([a-z_]+)\s*\}\}/g)].map((m) => m[1]));
    expect(alle.length).toBeGreaterThan(0);
    for (const name of alle) expect(Object.keys(PARTNERVERTRAG_PLATZHALTER)).toContain(name);
  });
});

describe('Partnervertrag als Blatt (E7-OPUS-01, G-39, R10)', () => {
  it('ohne geprüfte Vorlage ist jedes Blatt ein Entwurf, mit Hinweis im Kopf und auf jeder Seite', () => {
    const r = partnervertragBlatt({
      partner: PARTNER,
      anbieter: ANBIETER,
      jetzt: JETZT,
    });
    expect(r.entwurf).toBe(true);
    expect(r.blatt.kopf[0]).toEqual({
      name: 'Stand',
      wert: PARTNERVERTRAG_ENTWURF_HINWEIS,
      betont: true,
    });
    expect(r.blatt.fuss).toContain(PARTNERVERTRAG_ENTWURF_HINWEIS);
    expect(r.blatt.titel).toBe('Partnervertrag (Entwurf)');
  });

  it('setzt die Daten des Partners ein: Parteien, Einsatzgebiet, Auftragsarten, Modell', () => {
    const { blatt } = partnervertragBlatt({
      partner: PARTNER,
      anbieter: ANBIETER,
      jetzt: JETZT,
    });
    const text = blatt.abschnitte.map((a) => a.text ?? '').join('\n');
    expect(text).toContain('Testwerkstatt GmbH, Musterweg 1, 12345 Musterstadt');
    expect(text).toContain('Testschlüssel Nord, Musterhausen (Kennung P-0007), vertreten durch Erika Testpartnerin');
    expect(text).toContain('Postleitzahlen 20095, 221*, Umkreis 25 km');
    expect(text).toContain('Schlüsseldienst vor Ort (Tür, Schloss, Zylinder), Montage Zylinder');
    expect(text).toContain('A: Der Partner rechnet mit dem Kunden ab');
    expect(text).toContain('Es gelten die Partner-AGB von Testwerkstatt GmbH.');
    expect(text).not.toMatch(/\{\{/);
  });

  it('führt die Provision als Anlage mit Komma und ohne Sätze einen Hinweis', () => {
    const mit = partnervertragBlatt({
      partner: PARTNER,
      anbieter: ANBIETER,
      jetzt: JETZT,
    }).blatt;
    const anlage = mit.abschnitte.find((a) => a.titel.startsWith('Anlage'));
    expect(anlage?.tabelle?.zeilen).toEqual([['Montage Zylinder', '12,5 %']]);
    const ohne = partnervertragBlatt({
      partner: { ...PARTNER, provisionen: [] },
      anbieter: ANBIETER,
      jetzt: JETZT,
    }).blatt;
    expect(ohne.abschnitte.find((a) => a.titel.startsWith('Anlage'))?.text).toMatch(/Noch keine Sätze/);
  });

  it('mit geprüfter Vorlage und vollständigen Angaben kein Entwurf', () => {
    const r = partnervertragBlatt({
      partner: PARTNER,
      anbieter: ANBIETER,
      vorlage: GEPRUEFT,
      jetzt: JETZT,
    });
    expect(r.entwurf).toBe(false);
    expect(r.blatt.abschnitte[0].text).toBe('Testwerkstatt GmbH und Testschlüssel Nord (P-0007), 04.11.2026');
    expect(r.blatt.fuss).toBe('Partnervertrag · Testfassung 1');
    expect(r.blatt.kopf.some((z) => z.wert === PARTNERVERTRAG_ENTWURF_HINWEIS)).toBe(false);
  });

  it('fehlende Angaben machen auch eine geprüfte Vorlage zum Entwurf und werden im Kopf genannt', () => {
    const vorlage = {
      ...GEPRUEFT,
      abschnitte: [{ titel: 'X', text: '{{firma}}, {{telefon}}' }],
    };
    const r = partnervertragBlatt({
      partner: { ...PARTNER, telefon: null },
      anbieter: ANBIETER,
      vorlage,
      jetzt: JETZT,
    });
    expect(r.entwurf).toBe(true);
    expect(r.fehlend).toEqual(['telefon']);
    expect(r.blatt.kopf.find((z) => z.name === 'Fehlende Angaben')?.wert).toBe('Telefon des Partnerbetriebs');
  });

  it('Dateiname aus der Kennung, als Entwurf gekennzeichnet', () => {
    expect(partnervertragDateiname(PARTNER, true)).toBe('Partnervertrag-P-0007-Entwurf.pdf');
    expect(partnervertragDateiname({ id: 9, kennung: null }, false)).toBe('Partnervertrag-P-9.pdf');
  });

  it('lässt sich als PDF setzen', async () => {
    const { blatt } = partnervertragBlatt({
      partner: PARTNER,
      anbieter: ANBIETER,
      jetzt: JETZT,
    });
    const pdf = await erzeugePdf(blatt);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  });
});
