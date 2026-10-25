import { ValidationError } from 'payload';
import { describe, expect, it } from 'vitest';

import { firmendatenPruefen } from './Einstellungen';

/* Der Haken „Noch Platzhalter hinterlegt“ lässt sich nur entfernen, wenn
 * keine Firmenangabe mehr einen Redaktions-Platzhalter enthält. */

const echteFirma = {
  platzhalter: false,
  rechtlicherName: 'SCHLÜSSELMACHER24 – Inhaber Mina Saad',
  marke: 'SCHLÜSSELMACHER24',
  rechtsform: 'einzelunternehmen',
  inhaber: 'Mina Saad',
  strasse: 'Gloelstraße 11',
  plz: '35576',
  ort: 'Wetzlar',
  land: 'Deutschland',
  telefon: '06441 8056279',
  email: 'info@schluesselmacher24.de',
  ustId: 'DE 282140471',
  registergericht: '',
  registernummer: null,
  standort: { bezeichnung: 'Werkstatt und Abholung', strasse: 'Langgasse 70', plz: '35576', ort: 'Wetzlar' },
};

function pruefen(firma: Record<string, unknown>) {
  return firmendatenPruefen({ data: { firma }, req: {} } as never);
}

function fehlermeldung(firma: Record<string, unknown>): string {
  try {
    pruefen(firma);
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    return (error as ValidationError).data.errors.map((e) => `${e.path}: ${e.message}`).join('\n');
  }
  throw new Error('Keine Ablehnung');
}

describe('Firmendaten prüfen', () => {
  it('lässt echte Angaben ohne Register beim Einzelunternehmen zu', () => {
    expect(pruefen(echteFirma)).toEqual({ firma: echteFirma });
  });

  it('lehnt Platzhalter ab, solange der Haken entfernt werden soll', () => {
    const meldung = fehlermeldung({ ...echteFirma, plz: '[PLZ]', telefon: '[Platzhalter: Telefonnummer]' });
    expect(meldung).toContain('firma.platzhalter');
    expect(meldung).toContain('PLZ');
    expect(meldung).toContain('Telefon');
    expect(fehlermeldung({ ...echteFirma, standort: { strasse: '[Straße eintragen]' } })).toContain('Standort: Straße');
  });

  it('mit Platzhalter-Haken bleibt alles erlaubt', () => {
    const firma = { ...echteFirma, platzhalter: true, strasse: '[Platzhalter: Straße und Hausnummer]' };
    expect(pruefen(firma)).toEqual({ firma });
  });

  it('verlangt das Register bei Rechtsformen mit Handelsregister', () => {
    const meldung = fehlermeldung({ ...echteFirma, rechtsform: 'gmbh' });
    expect(meldung).toContain('Registergericht');
    expect(meldung).toContain('Registernummer');
    const mitRegister = { ...echteFirma, rechtsform: 'gmbh', registergericht: 'Amtsgericht Wetzlar', registernummer: 'HRB 1234' };
    expect(pruefen(mitRegister)).toEqual({ firma: mitRegister });
  });

  it('übersieht ausgeblendete Registerfelder beim Einzelunternehmen', () => {
    const firma = { ...echteFirma, registergericht: '[Platzhalter: Registergericht]' };
    expect(pruefen(firma)).toEqual({ firma });
  });
});
