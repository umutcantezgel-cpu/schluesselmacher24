import { describe, expect, it } from 'vitest';

import { echteEinstellungen, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';
import type { BusinessRecord } from '@/lib/types';

import { einsendeAnschrift } from './einsendung';
import { vertragsbestaetigungOffen } from './vertrag';
import {
  betriebBezahlt,
  betriebNeuerVorgang,
  kundeBezahlt,
  kundeNichtAbgeschlossen,
  statusMail,
  vertragsbestaetigung,
} from './vorlagen';
import { mailArtZumStatus } from './vorlagen/status';

/* Foto-Freigabe bei „Schlüssel nach Vorlage“ (Erg. Leitfaden §1/§2) und die
 * Mails rund um „Partner werden“. */

const SITE = 'https://schluesselmacher24.de';
const settings = echteEinstellungen();
const kontext = { site: SITE, firma: settings.company };
const LINK = `${SITE}/bestellung/51?t=neuer-link-schluessel`;
const ANSCHRIFT = einsendeAnschrift(settings.company);

function fotoanfrage(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '51',
    reference: 'SM24-A-2026-0011',
    kind: 'anfrage',
    area: 'schluessel-nach-vorlage',
    process: 'gefuehrte-anfrage',
    status: 'freigegeben',
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-25T09:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: { stueckzahl: 2, beschriftungen: 'BKS 4711-GEHEIM' },
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    approval: { priceCents: 2490, sendInRequired: true, note: 'Rohling BKS, Profil 32.', approvedAt: '2026-10-25T09:00:00.000Z' },
    payment: { scope: 'gesamt', amountCents: 2490, status: 'offen' },
    ...teil,
  };
}

describe('Einsendeanschrift', () => {
  it('nimmt die Werkstatt mit Firmenname — nie Platzhalter', () => {
    expect(ANSCHRIFT).toEqual(['SCHLÜSSELMACHER24 – Inhaber Mina Saad', 'Langgasse 70', '35576 Wetzlar', 'Deutschland']);
    expect(einsendeAnschrift(platzhalterEinstellungen().company)).toEqual([]);
    expect(einsendeAnschrift({ ...settings.company, location: undefined })).toEqual([
      'SCHLÜSSELMACHER24 – Inhaber Mina Saad',
      'Gloelstraße 11',
      '35576 Wetzlar',
      'Deutschland',
    ]);
  });
});

describe('Freigabe-Mail', () => {
  it('nennt Ergebnis, Preis, Zahlungslink, Einsendung und dass erst die Zahlung den Auftrag auslöst', () => {
    const mail = statusMail({
      vorgang: fotoanfrage(),
      status: 'freigegeben',
      nachricht: 'Bitte den Schlüssel gut verpacken.',
      kontext,
      zahlungsLink: LINK,
      einsendeAnschrift: ANSCHRIFT,
    });
    expect(mail.betreff).toBe('Ihre Anfrage ist freigegeben – SM24-A-2026-0011');
    expect(mailArtZumStatus('freigegeben')).toBe('freigabe');
    for (const inhalt of [mail.text, mail.html]) {
      expect(inhalt).toContain('Anfertigung möglich');
      expect(inhalt).toContain('24,90');
      expect(inhalt).toContain(LINK);
      expect(inhalt).toContain('Jetzt bezahlen');
      expect(inhalt).toContain('noch keine Fertigungszusage');
      expect(inhalt).toContain('Erst mit Ihrer Zahlung kommt der Vertrag zustande');
      expect(inhalt).toContain('kein Widerrufsrecht');
      expect(inhalt).toContain(`${SITE}/rechtliches/agb`);
      expect(inhalt).toContain('Rohling BKS, Profil 32.');
      expect(inhalt).toContain('Bitte den Schlüssel gut verpacken.');
      expect(inhalt).toContain('Langgasse 70');
      expect(inhalt).toContain('Vorgangsnummer SM24-A-2026-0011');
      expect(inhalt).toContain('erst, nachdem Sie den Auftrag mit der Zahlung erteilt haben');
      // Angaben des Kunden zum Schlüssel gehen nicht in die Mail.
      expect(inhalt).not.toContain('4711');
    }
    expect(mail.text).toContain('Stückzahl laut Ihrer Anfrage');
    // Mit Zahlknopf kein zweiter Knopf „Stand abrufen“.
    expect(mail.text).not.toContain('/service-und-termin/terminstatus');
  });

  it('bleibt ohne Preis bei „Preis folgt“ und ohne Zahlknopf', () => {
    const mail = statusMail({
      vorgang: fotoanfrage({ approval: { sendInRequired: false }, payment: undefined }),
      status: 'freigegeben',
      kontext,
    });
    expect(mail.text).toContain('Den Preis nennen wir Ihnen in einer gesonderten Nachricht');
    expect(mail.text).toContain('nicht nötig');
    expect(mail.text).not.toContain('Jetzt bezahlen');
    expect(mail.text).not.toContain('Originalschlüssel einsenden');
    expect(mail.text).toContain(`${SITE}/service-und-termin/terminstatus`);
  });

  it('verweist ohne Online-Zahlung auf die Zahlungsinformationen und ohne Anschrift auf eine gesonderte Nachricht', () => {
    const mail = statusMail({ vorgang: fotoanfrage(), status: 'freigegeben', kontext, einsendeAnschrift: [] });
    expect(mail.text).toContain('Die Zahlungsinformationen erhalten Sie gesondert von uns.');
    expect(mail.text).toContain('Die Anschrift für die Einsendung nennen wir Ihnen gesondert.');
    expect(mail.text).not.toContain('Jetzt bezahlen');
  });

  it('sagt freundlich ab — mit Begründung, ohne Zahlung', () => {
    const mail = statusMail({
      vorgang: fotoanfrage({ status: 'nicht-moeglich', approval: { note: 'Das Profil ist geschützt.' } }),
      status: 'nicht-moeglich',
      kontext,
    });
    expect(mail.betreff).toBe('Ergebnis Ihrer Anfrage – SM24-A-2026-0011');
    expect(mail.text).toContain('Leider können wir ihn nicht nach Ihrer Vorlage anfertigen.');
    expect(mail.text).toContain('Begründung');
    expect(mail.text).toContain('Das Profil ist geschützt.');
    expect(mail.text).toContain('Eine Zahlung ist nicht nötig.');
    expect(mail.text).not.toContain('Jetzt bezahlen');
    expect(mailArtZumStatus('nicht-moeglich')).toBe('freigabe');
  });

  it('stellt die Rückfrage mit der Nachricht des Teams', () => {
    const mail = statusMail({
      vorgang: fotoanfrage({ status: 'wartet-auf-kunde' }),
      status: 'wartet-auf-kunde',
      nachricht: 'Bitte senden Sie ein schärferes Foto der Spitze.',
      kontext,
    });
    expect(mail.betreff).toBe('Rückfrage zu Ihrer Anfrage – SM24-A-2026-0011');
    expect(mail.text).toContain('Unsere Rückfrage');
    expect(mail.text).toContain('Bitte senden Sie ein schärferes Foto der Spitze.');
    expect(mail.text).toContain('erst ein, wenn wir Sie ausdrücklich darum bitten');
  });

  it('lässt andere Vorgänge bei der bisherigen Statusmail', () => {
    const anfrage = fotoanfrage({ area: 'schliessanlagen', approval: undefined, payment: undefined });
    expect(statusMail({ vorgang: anfrage, status: 'wartet-auf-kunde', kontext }).betreff).toBe(
      'Wir brauchen noch etwas von Ihnen – SM24-A-2026-0011',
    );
  });
});

describe('Zahlung einer freigegebenen Fotoanfrage', () => {
  const bezahlt = fotoanfrage({ status: 'in-fertigung', payment: { scope: 'gesamt', amountCents: 2490, status: 'bezahlt', paidAt: '2026-10-25T10:00:00.000Z' } });

  it('bestätigt den Auftrag und erinnert an die Einsendung', () => {
    const mail = kundeBezahlt({ vorgang: bezahlt, kontext });
    expect(mail.text).toContain('Damit ist Ihr Auftrag erteilt');
    expect(mail.text).toContain('Bitte jetzt den Originalschlüssel einsenden');
    const team = betriebBezahlt({ vorgang: bezahlt, kontext, adminUrl: `${SITE}/admin/collections/vorgaenge/51` });
    expect(team.betreff).toBe('Bezahlt: Fotoanfrage SM24-A-2026-0011');
    expect(team.text).toContain('„In Fertigung“');
    expect(team.text).toContain('Originalschlüssel muss noch eingesendet werden');
  });

  it('verweist bei abgebrochener Zahlung auf den Link aus der Freigabe', () => {
    const mail = kundeNichtAbgeschlossen({ vorgang: fotoanfrage(), kontext, terminFreigegeben: false });
    expect(mail.text).toContain('aus unserer E-Mail zur Freigabe');
    expect(mail.text).not.toContain('Eingangsbestätigung');
  });

  it('schickt die Vertragsbestätigung erst nach der Zahlung — als Anfertigung nach Vorlage ohne Widerrufsrecht', () => {
    expect(vertragsbestaetigungOffen(fotoanfrage())).toBe(false);
    expect(vertragsbestaetigungOffen(fotoanfrage({ status: 'geprueft', payment: undefined }))).toBe(false);
    expect(vertragsbestaetigungOffen(bezahlt)).toBe(true);
    expect(
      vertragsbestaetigungOffen({ ...bezahlt, mailLog: [{ kind: 'vertrag', to: 'erika@example.org', at: '2026-10-25T10:01:00.000Z', result: 'gesendet' }] }),
    ).toBe(false);

    const mail = vertragsbestaetigung({ vorgang: bezahlt, kontext, settings, zahlarten: ['Kreditkarte'] });
    expect(mail.betreff).toBe('Vertragsbestätigung – SM24-A-2026-0011');
    expect(mail.text).toContain('unser Angebot aus der Freigabe angenommen');
    expect(mail.text).toContain('Schlüssel nach Vorlage — Anfertigung nach Ihrer Vorlage');
    expect(mail.text).toContain('Preis laut Freigabe');
    expect(mail.text).toContain('24,90');
    expect(mail.text).toContain('Einsendung erforderlich');
    expect(mail.text).toContain('Ausschluss des Widerrufsrechts bei Anfertigungen nach Ihren Angaben');
    expect(mail.text).toContain('Schlüssel nach Vorlage fertigen wir eigens nach Ihrer Vorlage');
    expect(mail.text).not.toContain('Vorzeitiges Erlöschen bei Dienstleistungen');
    expect(mail.text).not.toContain('4711');
  });
});

describe('Partner werden', () => {
  it('meldet dem Team die Firma statt eines Leistungsbereichs', () => {
    const bewerbung = fotoanfrage({
      kind: 'partner',
      reference: 'SM24-N-2026-0001',
      area: 'service-und-termin',
      contact: { firstName: 'Max', lastName: 'Meister', company: 'Schlüsseldienst Nord GmbH', email: 'max@example.org', phone: '040123456', country: 'Deutschland' },
      approval: undefined,
      payment: undefined,
    });
    const mail = betriebNeuerVorgang({ vorgang: bewerbung, adminUrl: `${SITE}/admin/collections/vorgaenge/51`, kontext: { site: SITE } });
    expect(mail.betreff).toBe('Neu: Partner-Bewerbung SM24-N-2026-0001 – Schlüsseldienst Nord GmbH');
    expect(mail.text).toContain('Ansprechpartner');
    expect(mail.text).toContain('Gewerbe, fachliche Eignung');
    expect(mail.text).not.toContain('Service und Termin');
    expect(mail.text).not.toContain('max@example.org');
  });
});
