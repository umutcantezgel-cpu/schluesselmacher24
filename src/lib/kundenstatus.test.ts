import { describe, expect, it } from 'vitest';

import { ART_FUER_KUNDEN, kundenSendung, kundenStatus, kundenVerlauf } from './kundenstatus';
import type { BusinessRecord, RecordStatus } from './types';
import { STATUS_REIHENFOLGE as RECORD_STATUSES } from './vorgang-status';

type Vorgang = Pick<BusinessRecord, 'kind' | 'area' | 'status'> & { payload?: Record<string, unknown> };

const ARTEN: Record<string, Vorgang> = {
  kontakt: { kind: 'anfrage', area: 'service-und-termin', status: 'neu', payload: { quelle: 'kontakt' } },
  termin: { kind: 'termin', area: 'autoschluessel', status: 'neu' },
  bestellung: { kind: 'bestellung', area: 'schluessel-nach-code', status: 'neu' },
  projekt: { kind: 'projekt', area: 'schliessanlagen', status: 'neu' },
  partner: { kind: 'partner', area: 'service-und-termin', status: 'neu' },
  foto: { kind: 'anfrage', area: 'schluessel-nach-vorlage', status: 'neu', payload: {} },
  einsendung: { kind: 'anfrage', area: 'schluessel-nach-vorlage', status: 'neu', payload: { quelle: 'einsenden' } },
};

describe('Kundenstatus in einfacher Sprache (E6-OPUS-04)', () => {
  it('hat für jede Art und jeden Status Name, Erklärung und Titel ohne Gedankenstriche und Ausrufezeichen', () => {
    for (const [art, vorgang] of Object.entries(ARTEN)) {
      for (const status of RECORD_STATUSES) {
        const stand = kundenStatus(vorgang, status);
        for (const text of [stand.label, stand.text, stand.titel]) {
          expect(text.trim().length, `${art} ${status}`).toBeGreaterThan(2);
          expect(text, `${art} ${status}`).not.toMatch(/[–—!]/);
        }
      }
    }
  });

  it('spricht auf Vorgangsseite und im Terminstatus dieselben Namen', () => {
    expect(kundenStatus(ARTEN.kontakt, 'wartet-auf-kunde').label).toBe('Rückfrage an Sie');
    expect(kundenStatus(ARTEN.termin, 'terminiert').label).toBe('Termin vereinbart');
    expect(kundenStatus(ARTEN.kontakt, 'neu').titel).toBe(`${ART_FUER_KUNDEN.anfrage} eingegangen`);
  });

  it('nennt Foto-Anfrage und Einsendung bei ihrem eigenen Namen', () => {
    expect(kundenStatus(ARTEN.foto, 'in-pruefung').text).toBe('Wir prüfen Ihre Fotos.');
    expect(kundenStatus(ARTEN.einsendung, 'neu').label).toBe('Angemeldet');
    expect(kundenStatus(ARTEN.einsendung, 'neu').titel).toBe('Einsendung angemeldet');
    expect(kundenStatus(ARTEN.einsendung, 'in-pruefung').label).toBe('Schlüssel eingegangen');
    expect(kundenStatus(ARTEN.einsendung, 'versendet').text).toContain('Original und die Kopien');
    expect(kundenStatus(ARTEN.foto, 'freigegeben').titel).toBe('Anfrage freigegeben');
    // Bei der Bestellung steht der Preis fest; die Prüfung nennt ihn nicht.
    expect(kundenStatus(ARTEN.bestellung, 'in-pruefung').text).not.toContain('Preis');
  });

  it('verspricht bei der Freigabe Preis und Zahlung nur, wenn ein Preis gesetzt ist (R4)', () => {
    expect(kundenStatus({ ...ARTEN.foto, approval: { priceCents: 2490 } }, 'freigegeben').text).toContain('Preis und Zahlung finden Sie');
    expect(kundenStatus(ARTEN.foto, 'freigegeben').text).toBe('Wir können Ihren Schlüssel nach Ihrer Vorlage anfertigen. Den Preis nennen wir Ihnen gesondert.');
    expect(kundenStatus({ ...ARTEN.einsendung, approval: {} }, 'freigegeben').text).toContain('Den Preis nennen wir Ihnen gesondert');
    // Andere Vorgänge sagen bei „Freigegeben“ nichts über die Ausführung zu.
    expect(kundenStatus(ARTEN.kontakt, 'freigegeben').text).not.toMatch(/können Ihren Auftrag/);
  });

  it('fragt bei der Einsendung nicht nach Fotos', () => {
    expect(kundenStatus(ARTEN.einsendung, 'wartet-auf-kunde').text).not.toContain('Foto');
    expect(kundenStatus(ARTEN.foto, 'wartet-auf-kunde').text).toContain('Foto');
  });

  it('macht keine Zeitzusagen (R9)', () => {
    for (const vorgang of Object.values(ARTEN)) {
      for (const status of RECORD_STATUSES) expect(kundenStatus(vorgang, status).text, status).not.toMatch(/in Kürze|sofort|heute|morgen/);
    }
  });

  it('markiert nur abgeschlossene, stornierte und unmögliche Vorgänge als erledigt', () => {
    const erledigt = RECORD_STATUSES.filter((status) => kundenStatus(ARTEN.kontakt, status).erledigt);
    expect([...erledigt].sort()).toEqual(['abgeschlossen', 'nicht-moeglich', 'storniert']);
  });

  it('schreibt zu jedem Statuswechsel einen Kundeneintrag, außer beim Zurücksetzen auf neu', () => {
    expect(kundenVerlauf(ARTEN.termin, 'neu', false)).toBeNull();
    expect(kundenVerlauf(ARTEN.termin, 'terminiert', false)).toBe('Termin vereinbart: Ihr Termin ist verbindlich eingeplant.');
    // Foto-Anfragen behalten die Sätze der Foto-Prüfung.
    expect(kundenVerlauf(ARTEN.foto, 'in-pruefung', false)).toBe('Wir prüfen Ihre Fotos.');
    expect(kundenVerlauf(ARTEN.einsendung, 'in-pruefung', false)).toBe('Ihr Schlüssel ist bei uns eingegangen und wird geprüft.');
    // Die Schritte nach der Freigabe kannte der Verlauf bisher nicht.
    expect(kundenVerlauf(ARTEN.foto, 'in-fertigung', true)).toBe('In Anfertigung: Wir fertigen Ihren Schlüssel an.');
    expect(kundenVerlauf(ARTEN.einsendung, 'versendet', true)).toBe('Versendet: Ihr Original und die Kopien sind auf dem Weg zu Ihnen.');
    for (const status of RECORD_STATUSES.filter((wert: RecordStatus) => wert !== 'neu')) {
      expect(kundenVerlauf(ARTEN.bestellung, status, false), status).toMatch(/^[^:]+: /);
    }
  });
});

describe('Sendung für Kunden (G-25)', () => {
  it('zeigt Dienstleister, Nummer und Verfolgungslink erst nach dem Versand', () => {
    const shipment = { carrier: 'dhl' as const, trackingNumber: ' 00340434161094042557 ' };
    expect(kundenSendung({ status: 'in-fertigung', shipment })).toBeUndefined();
    const sendung = kundenSendung({ status: 'versendet', shipment });
    expect(sendung?.dienstleister).toBe('DHL');
    expect(sendung?.nummer).toBe('00340434161094042557');
    expect(sendung?.link).toMatch(/^https:\/\//);
    expect(kundenSendung({ status: 'abgeschlossen', shipment })?.nummer).toBe('00340434161094042557');
  });

  it('kommt ohne Nummer und ohne festen Verfolgungslink aus', () => {
    expect(kundenSendung({ status: 'versendet', shipment: { carrier: 'sonstige' } })).toEqual({
      dienstleister: 'Versanddienstleister',
      nummer: undefined,
      link: undefined,
    });
    expect(kundenSendung({ status: 'versendet', shipment: {} })).toBeUndefined();
    expect(kundenSendung({ status: 'versendet' })).toBeUndefined();
  });
});
