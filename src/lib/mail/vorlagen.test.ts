import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import type { BusinessRecord, CompanyProfile } from '@/lib/types';

import { anrede, escapeHtml, sichererName } from './html';
import { mailHinweis, MAIL_NICHT_EINGERICHTET, MAIL_NICHT_VERSENDET } from './hinweise';
import {
  betriebBezahlt,
  betriebNeuerVorgang,
  kundeBezahlt,
  kundeEingang,
  kundeErstattet,
  kundeNichtAbgeschlossen,
  statusMail,
  testmail,
  widerrufEingang,
} from './vorlagen';
import { verfolgungsLink } from './vorlagen/status';

const SITE = 'https://schluesselmacher24.de';
const TOKEN = 'geheimer-link-schluessel-1234567890';

const FIRMA: CompanyProfile = {
  ...defaults.settings().company,
  legalName: 'SCHLÜSSELMACHER24 – Inhaber Mina Saad',
  street: 'Gloelstraße 11',
  postalCode: '35576',
  city: 'Wetzlar',
  phone: '06441 8056279',
  email: 'info@schluesselmacher24.de',
  vatId: 'DE 282140471',
  taxNumber: '03986300160',
  isPlaceholder: false,
};

function vorgang(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-B-2026-0007',
    kind: 'bestellung',
    area: 'schluessel-nach-code',
    process: 'direktkauf',
    status: 'neu',
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-24T10:00:00.000Z',
    contact: { firstName: 'Jürgen', lastName: "O'Brien-Müller", email: 'juergen@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: { deliveryNote: 'Bitte klingeln bei Nachbar – Gratis-Gewinn unter http://boese.example' },
    summary: [{ title: 'Fahrzeug', rows: [{ label: 'FIN', value: 'WVWZZZ1JZXW000001' }] }],
    uploads: [],
    internalNotes: [],
    timeline: [],
    lines: [
      {
        kind: 'code-schluessel',
        productId: 'ms-01',
        label: 'Schlüssel nach Code (Profil MS)',
        details: 'Code 4711-GEHEIM',
        qty: 2,
        unitPriceCents: 1290,
        totalCents: 2580,
        vatPercent: 19,
      },
    ],
    totals: { itemsCents: 2580, shippingCents: 490, totalCents: 3070, vatCents: 490, shippingLabel: 'Brief' },
    payment: { scope: 'gesamt', amountCents: 3070, status: 'offen', checkoutSessionId: 'cs_test_1' },
    ...teil,
  };
}

const termin = () =>
  vorgang({
    kind: 'termin',
    reference: 'SM24-T-2026-0003',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    lines: undefined,
    totals: undefined,
    appointment: { date: '2026-11-02', time: '09:30', durationMinutes: 90, location: 'werkstatt' },
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen', checkoutSessionId: 'cs_test_2', expiresAt: '2026-10-24T14:31:00.000Z' },
  });

describe('Anrede und Maskierung', () => {
  it('übernimmt nur Namen aus Buchstaben, Leerzeichen, Bindestrich und Apostroph', () => {
    expect(anrede({ firstName: 'Jürgen', lastName: "O'Brien-Müller" })).toBe("Guten Tag Jürgen O'Brien-Müller,");
    expect(anrede({ firstName: 'Zoë', lastName: 'Çelik' })).toBe('Guten Tag Zoë Çelik,');
    for (const [vor, nach] of [
      ['Gewinn', 'unter http://boese.example'],
      ['Klick', 'www.boese.de'],
      ['<script>', 'x'],
      ['Max', 'Muster 2'],
      ['A'.repeat(40), 'B'.repeat(30)],
      ['', ''],
    ]) {
      expect(anrede({ firstName: vor, lastName: nach })).toBe('Guten Tag,');
    }
    expect(sichererName(' Erika ', '  Muster ')).toBe('Erika Muster');
  });

  it('maskiert HTML-Zeichen', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });
});

describe('Eingangsbestätigung an den Kunden', () => {
  it('enthält Positionen und Summen, den privaten Link und den Zahlungshinweis — aber keine Codes und keinen Freitext', () => {
    const mail = kundeEingang({ vorgang: vorgang(), token: TOKEN, onlineZahlung: true, kontext: { site: SITE, firma: FIRMA } });
    expect(mail.betreff).toBe('Ihre Bestellung SM24-B-2026-0007 ist eingegangen');
    for (const inhalt of [mail.html, mail.text]) {
      expect(inhalt).toContain('SM24-B-2026-0007');
      expect(inhalt).toContain('2 × Schlüssel nach Code (Profil MS)');
      expect(inhalt).toContain('30,70');
      expect(inhalt).toContain(`${SITE}/bestellung/42?t=${TOKEN}`);
      expect(inhalt).toContain('Zahlung noch offen');
      expect(inhalt).not.toContain('4711');
      expect(inhalt).not.toContain('boese.example');
      expect(inhalt).not.toContain('WVWZZZ');
      // Steuernummer erscheint nie, die USt-IdNr. im Fuß schon.
      expect(inhalt).not.toContain('03986300160');
      expect(inhalt).toContain('DE 282140471');
      expect(inhalt).toContain(`${SITE}/rechtliches/impressum`);
    }
    expect(mail.html).toContain('O&#39;Brien-Müller');
    expect(mail.html).not.toMatch(/<img|<script/i);
  });

  it('zeigt beim Termin, bis wann er reserviert ist (deutsche Zeit)', () => {
    const mail = kundeEingang({ vorgang: termin(), token: TOKEN, onlineZahlung: true, kontext: { site: SITE } });
    expect(mail.betreff).toBe('Ihre Terminbuchung SM24-T-2026-0003 ist eingegangen');
    expect(mail.text).toContain('Montag, 2. November 2026, 09:30 Uhr');
    // 14:31 UTC = 16:31 in Wetzlar (Sommerzeit)
    expect(mail.text).toContain('bis 24.10.2026, 16:31 Uhr');
    expect(mail.text).toContain(`${SITE}/bestellung/42?t=${TOKEN}`);
  });

  it('nennt ohne Online-Zahlung den Weg über die Zahlungsinformationen', () => {
    const mail = kundeEingang({
      vorgang: vorgang({ payment: { scope: 'gesamt', amountCents: 3070, status: 'offen' } }),
      token: TOKEN,
      onlineZahlung: false,
      kontext: { site: SITE },
    });
    expect(mail.text).toContain('Die Zahlungsinformationen erhalten Sie von uns');
  });

  it('lässt Firmendaten mit Platzhaltern im Fuß weg', () => {
    const mail = kundeEingang({
      vorgang: vorgang({ kind: 'anfrage', lines: undefined, totals: undefined, payment: undefined }),
      token: TOKEN,
      onlineZahlung: false,
      kontext: { site: SITE, firma: defaults.settings().company },
    });
    expect(mail.betreff).toBe('Ihre Anfrage SM24-B-2026-0007 ist eingegangen');
    expect(mail.html).not.toContain('[Platzhalter');
    expect(mail.text).not.toContain('[Platzhalter');
  });
});

describe('Mail an den Betrieb', () => {
  it('enthält nur Eckdaten und den Backend-Link — nie Link-Schlüssel, Zusammenfassung oder Lieferhinweis', () => {
    const mail = betriebNeuerVorgang({
      vorgang: vorgang(),
      adminUrl: 'https://schluesselmacher24.de/admin/collections/vorgaenge/42',
      kontext: { site: SITE },
    });
    expect(mail.betreff).toBe('Neu: Bestellung SM24-B-2026-0007 – Schlüssel nach Code');
    expect(mail.text).toContain('https://schluesselmacher24.de/admin/collections/vorgaenge/42');
    for (const verboten of [TOKEN, 'WVWZZZ', 'boese.example', '4711', 'juergen@example.org', '0301234567']) {
      expect(mail.html).not.toContain(verboten);
      expect(mail.text).not.toContain(verboten);
    }
  });
});

describe('Zahlungs-, Status- und weitere Mails', () => {
  it('liefern Betreff, HTML und Text', () => {
    const kontext = { site: SITE, firma: FIRMA };
    const mails = [
      kundeBezahlt({ vorgang: termin(), kontext }),
      betriebBezahlt({ vorgang: termin(), kontext, adminUrl: `${SITE}/admin/collections/vorgaenge/42` }),
      kundeNichtAbgeschlossen({ vorgang: termin(), kontext, terminFreigegeben: true }),
      kundeNichtAbgeschlossen({ vorgang: vorgang(), kontext, terminFreigegeben: false }),
      kundeErstattet({ vorgang: vorgang(), kontext, betragCent: 1000 }),
      statusMail({ vorgang: vorgang(), status: 'wartet-auf-kunde', kontext }),
      statusMail({ vorgang: termin(), status: 'terminiert', kontext }),
      statusMail({ vorgang: vorgang(), status: 'storniert', kontext }),
      testmail({ kontext, jetzt: '2026-10-24T10:00:00.000Z' }),
    ];
    for (const mail of mails) {
      expect(mail.betreff.length).toBeGreaterThan(5);
      expect(mail.html).toContain('<!doctype html>');
      expect(mail.text).toContain('SCHLÜSSELMACHER24');
    }
    expect(mails[2].text).toContain(`${SITE}/autoschluessel/anfrage`);
    expect(mails[4].text).toContain('10,00');
  });

  it('nennt beim Versand Dienstleister, Sendungsnummer und Verfolgungslink — und die Nachricht des Teams maskiert', () => {
    const mail = statusMail({
      vorgang: vorgang({ shipment: { carrier: 'dhl', trackingNumber: '00340434161234567890' } }),
      status: 'versendet',
      nachricht: 'Viel Freude <b>damit</b>!',
      kontext: { site: SITE },
    });
    expect(mail.text).toContain('DHL');
    expect(mail.text).toContain('00340434161234567890');
    expect(mail.text).toContain('https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=00340434161234567890');
    expect(mail.html).toContain('Viel Freude &lt;b&gt;damit&lt;/b&gt;!');
    expect(verfolgungsLink('sonstige', '123')).toBeNull();
    expect(verfolgungsLink('ups', '1Z 99')).toBe('https://www.ups.com/track?loc=de_DE&tracknum=1Z%2099');
  });

  it('bestätigt den Eingang eines Widerrufs mit Uhrzeit, aber ohne fremden Text', () => {
    const mail = widerrufEingang({
      vorname: 'Erika',
      nachname: 'Muster',
      vorgangsnummer: 'sm24-b-2026-0007',
      eingegangenAm: '2026-10-24T21:15:00.000Z',
      kontext: { site: SITE },
    });
    expect(mail.text).toContain('24.10.2026, 23:15 Uhr');
    expect(mail.text).toContain('SM24-B-2026-0007');
    const ohneNummer = widerrufEingang({ vorgangsnummer: 'Klick hier: http://x', eingegangenAm: '2026-10-24T21:15:00.000Z', kontext: { site: SITE } });
    expect(ohneNummer.text).not.toContain('http://x');
    expect(ohneNummer.text).toContain('Guten Tag,');
  });
});

describe('mailHinweis', () => {
  it('meldet nur, wenn die Eingangsbestätigung nicht nachweislich rausging', () => {
    expect(mailHinweis({}, false)).toBe(MAIL_NICHT_EINGERICHTET);
    expect(mailHinweis({}, true)).toBe(MAIL_NICHT_VERSENDET);
    expect(
      mailHinweis({ mailLog: [{ kind: 'eingang-kunde', to: 'a@b.de', at: '2026-10-24T10:00:00Z', result: 'fehlgeschlagen' }] }, true),
    ).toBe(MAIL_NICHT_VERSENDET);
    expect(
      mailHinweis({ mailLog: [{ kind: 'eingang-kunde', to: 'a@b.de', at: '2026-10-24T10:00:00Z', result: 'gesendet' }] }, true),
    ).toBeNull();
  });
});
