import { describe, expect, it } from 'vitest';

import { echteEinstellungen, platzhalterEinstellungen } from '../rechtliches/test-hilfen';
import type { BusinessRecord } from '../types';
import { kundeErinnerung, terminKalender } from './vorlagen/erinnerung';
import { terminZeilen } from './vorlagen/gemeinsam';
import { betriebRueckrufEmpfohlen } from './vorlagen/team-hinweis';

/* Termin-Erinnerung mit Kalendereintrag, Terminort in den Mails und der
 * Hinweis „Rückruf empfohlen“ an das Team. */

const kontext = { site: 'https://schluesselmacher24.de', firma: echteEinstellungen().company };

function termin(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-T-2026-0007',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'terminiert',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: { makeName: 'Volkswagen', modelName: 'Golf', year: '2017', serviceLabel: 'Zweitschlüssel' },
    summary: [
      {
        title: 'Leistung und Fahrzeug',
        rows: [
          { label: 'Gewünschte Leistung', value: 'Zweitschlüssel anlernen' },
          { label: 'Marke', value: 'Volkswagen' },
          { label: 'Modell', value: 'Golf VII' },
        ],
      },
      { title: 'Fahrzeug', rows: [{ label: 'Baujahr / Erstzulassung', value: 'März 2017' }, { label: 'Fahrgestellnummer', value: 'WVWZZZ1KZ7W000001' }] },
    ],
    uploads: [],
    internalNotes: [],
    timeline: [],
    quote: { mode: 'fest', priceCents: 24900, depositCents: 6990, remainderCents: 17910, slotMinutes: 90, leadTimeDays: 7, requiresVehicleOnSite: true },
    appointment: { date: '2026-10-27', time: '10:00', durationMinutes: 90, location: 'werkstatt' },
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'bezahlt' },
    ...teil,
  };
}

describe('Termin-Erinnerung', () => {
  const mail = kundeErinnerung({ vorgang: termin(), kontext });

  it('nennt Datum, Uhrzeit, Dauer, Werkstatt mit Fahrzeug und Telefon', () => {
    expect(mail.betreff).toBe('Erinnerung an Ihren Termin am 27.10.2026 um 10:00 Uhr – SM24-T-2026-0007');
    expect(mail.text).toContain('Guten Tag Erika Muster,');
    expect(mail.text).toContain('Termin: Dienstag, 27. Oktober 2026, 10:00 Uhr');
    expect(mail.text).toContain('Dauer: 1 Std. 30 Min.');
    expect(mail.text).toContain('Ort: In unserer Werkstatt, mit Fahrzeug (Langgasse 70, 35576 Wetzlar)');
    expect(mail.text).toContain('Telefon: 06441 8056279');
  });

  it('listet, was mitzubringen ist, und verweist auf den öffentlichen Terminstatus', () => {
    expect(mail.text).toContain('• Ihr Fahrzeug');
    expect(mail.text).toContain('• Zulassungsbescheinigung Teil I (Fahrzeugschein) im Original');
    expect(mail.text).toContain('• Nachweis, dass Sie über das Fahrzeug verfügen dürfen');
    expect(mail.text).toContain('• Alle vorhandenen Schlüssel zum Fahrzeug');
    expect(mail.text).toContain('https://schluesselmacher24.de/service-und-termin/terminstatus');
    expect(mail.text).not.toContain('/bestellung/');
    expect(mail.html).toContain('Bitte mitbringen');
    // Keine Fahrgestellnummer in der Mail.
    expect(mail.text).not.toContain('WVWZZZ');
  });

  it('ohne Fahrzeugleistung kein Fahrzeug in der Liste, außerhalb der Autoschlüssel keine Liste', () => {
    const ohneFahrzeug = kundeErinnerung({ vorgang: termin({ quote: { ...termin().quote!, requiresVehicleOnSite: false } }), kontext });
    expect(ohneFahrzeug.text).toContain('Ort: In unserer Werkstatt (Langgasse 70, 35576 Wetzlar)');
    expect(ohneFahrzeug.text).not.toContain('• Ihr Fahrzeug');
    const tuer = kundeErinnerung({ vorgang: termin({ area: 'tuer-und-schliesstechnik', quote: undefined }), kontext });
    expect(tuer.text).not.toContain('Bitte mitbringen');
  });

  it('nennt die Werkstatt im Fuß, mit Platzhalter-Firma gar keine Anschrift', () => {
    expect(mail.text).toContain('Werkstatt und Abholung: Langgasse 70, 35576 Wetzlar');
    expect(mail.text).toContain('Gloelstraße 11');
    const platzhalter = kundeErinnerung({ vorgang: termin(), kontext: { ...kontext, firma: platzhalterEinstellungen().company } });
    expect(platzhalter.text).toContain('Ort: In unserer Werkstatt, mit Fahrzeug\n');
    expect(platzhalter.text).not.toContain('[');
  });
});

describe('Kalendereintrag zur Erinnerung', () => {
  const anhang = terminKalender({ vorgang: termin(), kontext }, new Date('2026-10-26T02:17:00.000Z'));
  const entfaltet = anhang.inhalt.replace(/\r\n /g, '');

  it('Datei, Typ und Kennung je Vorgang', () => {
    expect(anhang.dateiname).toBe('termin-SM24-T-2026-0007.ics');
    expect(anhang.typ).toBe('text/calendar; charset=utf-8; method=PUBLISH');
    expect(entfaltet).toContain('UID:sm24-t-2026-0007@schluesselmacher24.de');
  });

  it('Termin in UTC aus deutscher Zeit (27.10.: Winterzeit), Dauer und Ort', () => {
    expect(entfaltet).toContain('DTSTART:20261027T090000Z');
    expect(entfaltet).toContain('DTEND:20261027T103000Z');
    expect(entfaltet).toContain('LOCATION:SCHLÜSSELMACHER24\\, Langgasse 70\\, 35576 Wetzlar');
    expect(entfaltet).toContain('SUMMARY:Termin bei SCHLÜSSELMACHER24 (SM24-T-2026-0007)');
    expect(entfaltet).toContain('Bitte mitbringen:\\n- Ihr Fahrzeug');
    expect(entfaltet).toContain('URL:https://schluesselmacher24.de/service-und-termin/terminstatus');
  });

  it('Sommertermin mit zwei Stunden Versatz', () => {
    const sommer = terminKalender({ vorgang: termin({ appointment: { date: '2027-06-15', time: '14:00', durationMinutes: 60, location: 'werkstatt' } }), kontext });
    expect(sommer.inhalt).toContain('DTSTART:20270615T120000Z');
  });
});

describe('Terminort in allen Terminmails', () => {
  it('Werkstatt mit Anschrift statt „Ort stimmen wir mit Ihnen ab“', () => {
    expect(terminZeilen(termin(), kontext.firma)).toContainEqual(['Ort', 'In unserer Werkstatt, mit Fahrzeug (Langgasse 70, 35576 Wetzlar)']);
    expect(terminZeilen(termin({ appointment: { ...termin().appointment!, location: 'vor-ort' } }), kontext.firma)).toContainEqual([
      'Ort',
      'Bei Ihnen vor Ort (nach Absprache)',
    ]);
    expect(terminZeilen(termin()).flat().join(' ')).not.toContain('stimmen wir');
  });
});

describe('Rückruf empfohlen (Team)', () => {
  const mail = betriebRueckrufEmpfohlen({ vorgang: termin({ status: 'storniert' }), adminUrl: 'https://schluesselmacher24.de/admin/collections/vorgaenge/42', kontext });

  it('nennt Vorgangsnummer, Name, Telefon, Fahrzeug und Leistung', () => {
    expect(mail.betreff).toBe('Rückruf empfohlen: Anzahlung nicht eingegangen – SM24-T-2026-0007');
    expect(mail.text).toContain('Vorgangsnummer: SM24-T-2026-0007');
    expect(mail.text).toContain('Name: Erika Muster');
    expect(mail.text).toContain('Telefon: 0301234567');
    expect(mail.text).toContain('Fahrzeug: Volkswagen Golf VII (März 2017)');
    expect(mail.text).toContain('Leistung: Zweitschlüssel anlernen');
    expect(mail.text).toContain('Freigegebener Termin: Dienstag, 27. Oktober 2026, 10:00 Uhr');
    expect(mail.text).toContain('https://schluesselmacher24.de/admin/collections/vorgaenge/42');
    expect(mail.text).not.toContain('WVWZZZ');
    expect(mail.text).not.toContain('erika@example.org');
  });

  it('greift ohne Zusammenfassung auf die Formulardaten zurück', () => {
    const ohne = betriebRueckrufEmpfohlen({ vorgang: termin({ summary: [] }), adminUrl: 'https://x.de/admin', kontext });
    expect(ohne.text).toContain('Fahrzeug: Volkswagen Golf (2017)');
    expect(ohne.text).toContain('Leistung: Zweitschlüssel');
  });
});
