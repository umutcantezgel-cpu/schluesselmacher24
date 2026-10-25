import { describe, expect, it } from 'vitest';

import { abschnitteAlsText, musterWiderrufsformular, widerrufsbelehrung } from '@/lib/rechtliches/texte';
import { eigentextAlsText } from '@/lib/rechtliches/eigentext-text';
import { echteEinstellungen } from '@/lib/rechtliches/test-hilfen';
import type { BusinessRecord, RichTextDocument } from '@/lib/types';

import { BESTAETIGENDE_STATUS, vertragsbestaetigungOffen } from './vertrag';
import { vertragsbestaetigung } from './vorlagen';

const SITE = 'https://schluesselmacher24.de';
const settings = echteEinstellungen();
const kontext = { site: SITE, firma: settings.company };

function bestellung(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-B-2026-0007',
    kind: 'bestellung',
    area: 'schluessel-nach-code',
    process: 'direktkauf',
    status: 'neu',
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-24T10:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    lines: [
      { kind: 'code-schluessel', productId: 'ms-01', label: 'Schlüssel MS 01', details: 'Code 4711', qty: 2, unitPriceCents: 1290, totalCents: 2580, vatPercent: 19 },
      { kind: 'standard', productId: 'spray', label: 'Schließzylinder-Spray', details: '', qty: 1, unitPriceCents: 790, totalCents: 790, vatPercent: 19 },
    ],
    totals: { itemsCents: 3370, shippingCents: 495, totalCents: 3865, vatCents: 617, shippingLabel: 'Brief' },
    payment: { scope: 'gesamt', amountCents: 3865, status: 'bezahlt', paidAt: '2026-10-24T10:05:00.000Z' },
    consents: { terms: true, withdrawalNotice: true, customMade: true, at: '2026-10-24T10:00:00.000Z', version: '2026-10-24' },
    ...teil,
  };
}

function termin(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return bestellung({
    reference: 'SM24-T-2026-0003',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    lines: undefined,
    totals: undefined,
    summary: [
      { title: 'Fahrzeug', rows: [{ label: 'Marke', value: 'Volkswagen' }, { label: 'Modell', value: 'Golf' }] },
      { title: 'Schlüssel und Leistung', rows: [{ label: 'Gewünschte Leistung', value: 'Zweitschlüssel anfertigen' }] },
    ],
    appointment: { date: '2026-11-04', time: '10:00', durationMinutes: 90, location: 'werkstatt' },
    quote: { mode: 'fest', priceCents: 24900, depositCents: 6990, remainderCents: 17910, slotMinutes: 90, leadTimeDays: 7, requiresVehicleOnSite: false },
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'bezahlt' },
    consents: { terms: true, withdrawalNotice: true, deposit: true, authorization: true, earlyStart: true, at: '2026-10-24T10:00:00.000Z', version: '2026-10-24' },
    ...teil,
  });
}

const ohneLeerraum = (text: string) => text.replace(/\s+/g, ' ');

describe('Vertragsbestätigung', () => {
  it('Bestellung: Anbieter, Positionen ohne Code, Zustimmungen, Ausschluss und Belehrung für Waren', () => {
    const mail = vertragsbestaetigung({ vorgang: bestellung(), kontext, settings, zahlarten: null });
    expect(mail.betreff).toBe('Vertragsbestätigung – SM24-B-2026-0007');
    const text = mail.text;

    // Anbieterkennung, aber nie die Steuernummer.
    expect(text).toContain('Gloelstraße 11');
    expect(text).toContain('USt-IdNr.');
    expect(text).not.toContain(settings.company.taxNumber!);
    // Positionen ohne Code (Sicherheit), mit Versand und Summe.
    expect(text).toContain('2 × Schlüssel MS 01: 25,80');
    expect(text).not.toContain('4711');
    expect(text).toContain('Gesamtbetrag: 38,65');
    // Zustimmungen mit Zeitpunkt in deutscher Zeit.
    expect(text).toContain('AGB gelesen: ja, am 24.10.2026, 12:00 Uhr');
    expect(text).toContain('Stand der Rechtstexte: 2026-10-24');
    // Hinweis auf den Ausschluss für die Anfertigung — nicht für den Standardartikel.
    expect(text).toContain('Diese Positionen fertigen wir eigens nach Ihren Angaben: Schlüssel MS 01.');
    // Vollständige Belehrung (Waren) und Musterformular — derselbe Wortlaut wie auf der Seite.
    expect(ohneLeerraum(text)).toContain(ohneLeerraum(abschnitteAlsText(widerrufsbelehrung('waren', settings.company, SITE)).split('\n\n')[2]));
    expect(text).toContain('in Besitz genommen haben bzw. hat');
    expect(text).toContain(musterWiderrufsformular(settings.company).ueberschrift);
    expect(text).toContain('Ausschluss des Widerrufsrechts bei Anfertigungen nach Ihren Angaben');
    // AGB: Kurzfassung, Link und Wortlaut.
    expect(text).toContain('Das Wichtigste in Kürze');
    expect(text).toContain(`${SITE}/rechtliches/agb`);
    expect(text).toContain('§ 18 Schlussbestimmungen');
    expect(text).toContain(`${SITE}/rechtliches/widerruf/erklaeren`);
  });

  it('Termin: Leistung, Termin, Preis und Anzahlung, Belehrung für Dienstleistungen mit Wertersatz', () => {
    const mail = vertragsbestaetigung({ vorgang: termin(), kontext, settings, zahlarten: ['PayPal'] });
    const text = mail.text;
    expect(text).toContain('Leistung: Zweitschlüssel anfertigen');
    expect(text).toContain('Fahrzeug: Volkswagen Golf');
    expect(text).toContain('Termin: Mittwoch, 4. November 2026, 10:00 Uhr');
    expect(text).toContain('Gesamtpreis: 249,00');
    expect(text).toContain('Restbetrag beim Termin: 179,10');
    expect(text).toContain('Ausdrücklich verlangt, dass wir vor Ablauf der Widerrufsfrist mit der Leistung beginnen');
    expect(text).toContain('Anzahlung akzeptiert: ja, am 24.10.2026, 12:00 Uhr');
    expect(text).toContain('ab dem Tag des Vertragsabschlusses');
    expect(text).toContain('Vorzeitiges Erlöschen bei Dienstleistungen');
    expect(text).not.toContain('Kein Widerrufsrecht bei Anfertigungen');
    // Zahlarten wie auf der AGB-Seite.
    expect(text).toContain('– PayPal');
  });

  it('übernimmt Eigentexte aus dem Backend statt des eingebauten Entwurfs', () => {
    const dokument = (text: string): RichTextDocument => ({
      root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text }] }] },
    });
    const mail = vertragsbestaetigung({
      vorgang: bestellung(),
      kontext,
      settings: { ...settings, legalTexts: { terms: dokument('Eigene AGB vom Anwalt.'), withdrawal: dokument('Eigene Belehrung vom Anwalt.') } },
      zahlarten: null,
    });
    expect(mail.text).toContain('Eigene AGB vom Anwalt.');
    expect(mail.text).toContain('Eigene Belehrung vom Anwalt.');
    expect(mail.text).not.toContain('Das Wichtigste in Kürze');
    expect(mail.text).not.toContain('§ 18 Schlussbestimmungen');
  });

  it('macht Kundenangaben im HTML unschädlich', () => {
    const mail = vertragsbestaetigung({
      vorgang: bestellung({ lines: [{ ...bestellung().lines![0], label: '<script>alert(1)</script>' }] }),
      kontext,
      settings,
      zahlarten: null,
    });
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;');
  });
});

describe('Wann die Vertragsbestätigung fällig ist', () => {
  it('nur für Bestellungen und Termine, nie storniert, nie zweimal', () => {
    expect(vertragsbestaetigungOffen(bestellung())).toBe(true);
    expect(vertragsbestaetigungOffen(termin())).toBe(true);
    expect(vertragsbestaetigungOffen(bestellung({ kind: 'anfrage' }))).toBe(false);
    expect(vertragsbestaetigungOffen(bestellung({ status: 'storniert' }))).toBe(false);
    const fehlgeschlagen = { kind: 'vertrag' as const, to: 'e@example.org', at: '2026-10-24T10:00:00.000Z', result: 'fehlgeschlagen' as const };
    expect(vertragsbestaetigungOffen(bestellung({ mailLog: [fehlgeschlagen] }))).toBe(true);
    expect(vertragsbestaetigungOffen(bestellung({ mailLog: [{ ...fehlgeschlagen, result: 'gesendet' }] }))).toBe(false);
    expect(BESTAETIGENDE_STATUS).toEqual(expect.arrayContaining(['geprueft', 'terminiert', 'in-fertigung']));
    expect(BESTAETIGENDE_STATUS).not.toContain('neu');
  });
});

describe('eigentextAlsText', () => {
  it('macht aus Lexical-JSON Text mit Überschriften, Listen und Links', () => {
    const dokument = {
      root: {
        type: 'root',
        children: [
          { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Widerrufsrecht' }] },
          { type: 'paragraph', children: [{ type: 'text', text: 'Erste Zeile' }, { type: 'linebreak' }, { type: 'text', text: 'zweite Zeile' }] },
          {
            type: 'list',
            listType: 'bullet',
            children: [
              { type: 'listitem', children: [{ type: 'text', text: 'Punkt A' }] },
              { type: 'listitem', children: [{ type: 'link', fields: { url: 'https://example.org' }, children: [{ type: 'text', text: 'Link' }] }] },
            ],
          },
          { type: 'paragraph', children: [] },
        ],
      },
    } as unknown as RichTextDocument;
    expect(eigentextAlsText(dokument)).toBe('WIDERRUFSRECHT\n\nErste Zeile\nzweite Zeile\n\n– Punkt A\n– Link (https://example.org)');
  });
});
