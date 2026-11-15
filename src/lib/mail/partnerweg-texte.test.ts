import { describe, expect, it } from 'vitest';

import { echteEinstellungen } from '@/lib/rechtliches/test-hilfen';
import type { BusinessRecord } from '@/lib/types';

import { vertragsbestaetigungOffen } from './vertrag';
import { vertragsbestaetigung } from './vorlagen';
import { ausfuehrungBestaetigenMail } from './vorlagen/ausfuehrung';
import { betriebAnzahlungOffen, betriebRueckrufEmpfohlen } from './vorlagen/team-hinweis';
import { kundeBezahlt, kundeNichtAbgeschlossen } from './vorlagen/zahlung';

/* FA-KERN-04 (Nachtrag zu FA-KERN-03): Texte bei Gesamtzahlung im Partnerweg nennen weder Anzahlung noch
 * Restbetrag noch reserviertes Zeitfenster. Erfundene Testdaten (G4). */

const SITE = 'https://schluesselmacher24.de';
const settings = echteEinstellungen();
const kontext = { site: SITE, firma: settings.company };
const ohneLeerraum = (text: string) => text.replace(/\s+/g, ' ');

function partnertermin(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-T-2026-0042',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-11-15T10:00:00.000Z',
    updatedAt: '2026-11-15T10:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', postalCode: '60311', country: 'Deutschland' },
    payload: {},
    summary: [{ title: 'Schlüssel und Leistung', rows: [{ label: 'Gewünschte Leistung', value: 'Zweitschlüssel anfertigen' }] }],
    uploads: [],
    internalNotes: [],
    timeline: [],
    auftragsweg: 'partner',
    quote: { mode: 'fest', priceCents: 31_900, depositCents: 6_990, remainderCents: 24_910, slotMinutes: 90, leadTimeDays: 7, requiresVehicleOnSite: false },
    payment: { scope: 'gesamt', amountCents: 31_900, status: 'bezahlt', paidAt: '2026-11-15T10:05:00.000Z' },
    consents: { terms: true, withdrawalNotice: true, authorization: true, earlyStart: true, at: '2026-11-15T10:00:00.000Z', version: '2026-10-24' },
    ...teil,
  } as BusinessRecord;
}

describe('Vertragsbestätigung im Partnerweg', () => {
  it('nennt den Gesamtbetrag und den vermittelten Termin, keine Anzahlung und keinen Restbetrag', () => {
    const text = ohneLeerraum(vertragsbestaetigung({ vorgang: partnertermin(), kontext, settings, zahlarten: null }).text);
    expect(text).toContain('Partnerbetrieb in Ihrer Region');
    expect(text).toContain('mit Ihrer Zahlung vollständig beglichen');
    expect(text).toContain('Den Gesamtpreis haben Sie vorab bezahlt; einen Restbetrag gibt es nicht.');
    // Der AGB-Wortlaut selbst (§ 8) bleibt unverändert (Rechtstext, R10); geprüft wird alles davor.
    const vorDemWortlaut = text.split('Unsere AGB im Wortlaut')[0];
    expect(vorDemWortlaut).not.toMatch(/Anzahlung \d|Restbetrag beim Termin|Die Anzahlung wird vollständig|Anzahlung:/);
  });

  it('gilt auch für die bezahlte Partner-Anfrage', () => {
    const anfrage = partnertermin({ kind: 'anfrage', status: 'in-pruefung', quote: undefined });
    expect(vertragsbestaetigungOffen(anfrage)).toBe(true);
    expect(vertragsbestaetigungOffen({ ...anfrage, payment: { scope: 'gesamt', amountCents: 31_900, status: 'offen' } })).toBe(false);
    const text = ohneLeerraum(vertragsbestaetigung({ vorgang: anfrage, kontext, settings, zahlarten: null }).text);
    expect(text).toContain('Mit Ihrer Zahlung ist er verbindlich');
  });
});

describe('Zahlungsmails im Partnerweg', () => {
  it('sagt bei nicht eingegangener Zahlung, dass der Auftrag nicht zustande kam, ohne Zeitfenster', () => {
    const vorgang = partnertermin({ payment: { scope: 'gesamt', amountCents: 31_900, status: 'fehlgeschlagen' } });
    const text = ohneLeerraum(kundeNichtAbgeschlossen({ vorgang, kontext, terminFreigegeben: true }).text);
    expect(text).toContain('Der Auftrag ist nicht zustande gekommen.');
    expect(text).not.toMatch(/Anzahlung|Zeitfenster/);
  });

  it('bestätigt den Eingang des Gesamtbetrags ohne Anzahlung', () => {
    const text = ohneLeerraum(kundeBezahlt({ vorgang: partnertermin(), kontext }).text);
    expect(text).toContain('Ihre Zahlung über den Gesamtbetrag ist bei uns eingegangen');
    expect(text).not.toContain('Ihre Anzahlung');
  });

  it('nennt dem Team die Zahlung des Gesamtbetrags statt der Anzahlung', () => {
    const vorgang = partnertermin({ payment: { scope: 'gesamt', amountCents: 31_900, status: 'fehlgeschlagen' } });
    const offen = betriebAnzahlungOffen({ vorgang, kontext, adminUrl: `${SITE}/admin` });
    expect(offen.betreff).toBe('Zahlung nicht eingegangen, Auftrag bleibt: SM24-T-2026-0042');
    expect(ohneLeerraum(offen.text)).not.toContain('Anzahlung');
    const rueckruf = betriebRueckrufEmpfohlen({ vorgang, kontext, adminUrl: `${SITE}/admin` });
    expect(ohneLeerraum(rueckruf.text)).not.toMatch(/Anzahlung|Zeitfenster/);
  });
});

describe('Bitte um Bestätigung der Ausführung', () => {
  it('erklärt die Bestätigung in einem Satz, nennt das Telefon und den persönlichen Link', () => {
    const mail = ausfuehrungBestaetigenMail({ vorgang: partnertermin(), kontext, link: `${SITE}/auftrag-bestaetigen/42?k=abc`, telefon: '06441 0000' });
    const text = ohneLeerraum(mail.text);
    expect(text).toContain('Mit Ihrer Bestätigung sagen Sie uns, dass der Partnerbetrieb Ihren Auftrag ausgeführt hat');
    expect(text).toContain('06441 0000');
    expect(text).toContain('/auftrag-bestaetigen/42?k=abc');
    expect(text).not.toMatch(/ – .* – /);
  });
});
