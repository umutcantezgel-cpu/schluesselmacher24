import { describe, expect, it } from 'vitest';

import {
  CODE_ANFRAGE_HOECHSTENS,
  CODE_ANFRAGE_PFAD,
  CODE_ANFRAGE_THEMENTEXT,
  codeAnfrageAbschnitt,
  codeAnfragePfad,
  codeAnfragePruefen,
  codeAnfrageUploadKategorie,
  mitGeprueftemCode,
  ohneCodeFelder,
  vorbelegungAusAdresse,
} from './code-anfrage';

const gueltig = { schloss: 'Briefkastenanlage, Hersteller unbekannt', code: 'B 1042', stueckzahl: 2, berechtigt: true };

describe('Code anfragen (FA-11-17)', () => {
  it('führt in die allgemeine Anfrage mit dem Thema Schlüssel nach Code', () => {
    expect(CODE_ANFRAGE_PFAD).toBe('/service-und-termin/anfrage?thema=schluessel-nach-code');
    expect(codeAnfragePfad()).toBe(CODE_ANFRAGE_PFAD);
    expect(codeAnfragePfad({ code: ' A 12/3 ', schloss: 'Möbelschloss' })).toBe(
      '/service-und-termin/anfrage?thema=schluessel-nach-code&code=A%2012%2F3&schloss=M%C3%B6belschloss',
    );
  });

  it('nimmt aus der Adresse nur einfache Zeichen und kürzt', () => {
    expect(vorbelegungAusAdresse('PZ-104<script>', 40)).toBe('PZ-104script');
    expect(vorbelegungAusAdresse('  A   1  ', 40)).toBe('A 1');
    expect(vorbelegungAusAdresse('1234567890', 4)).toBe('1234');
    expect(vorbelegungAusAdresse(['x'], 4)).toBe('');
  });

  it('verlangt Schloss, Code, Stückzahl und die Berechtigung (R13)', () => {
    expect(codeAnfragePruefen(gueltig)).toEqual({ schloss: 'Briefkastenanlage, Hersteller unbekannt', code: 'B 1042', stueckzahl: 2 });
    expect(codeAnfragePruefen({ ...gueltig, stueckzahl: '3' })?.stueckzahl).toBe(3);
    for (const falsch of [
      { schloss: '' },
      { schloss: 'x' },
      { schloss: 'x'.repeat(121) },
      { code: '' },
      { code: '   ' },
      { code: 'A'.repeat(41) },
      { code: 'A\nB' },
      { stueckzahl: 0 },
      { stueckzahl: 1.5 },
      { stueckzahl: CODE_ANFRAGE_HOECHSTENS + 1 },
      { stueckzahl: 'viele' },
      { berechtigt: false },
      { berechtigt: 'ja' },
    ]) {
      expect(codeAnfragePruefen({ ...gueltig, ...falsch }), JSON.stringify(falsch)).toBeNull();
    }
  });

  it('lädt Fotos der Code-Anfrage als Schlüsselfoto hoch, alles andere als Dokument (Frist der Datei)', () => {
    expect(codeAnfrageUploadKategorie('schluessel-nach-code')).toBe('schluesselfoto');
    expect(codeAnfrageUploadKategorie('autoschluessel')).toBe('dokument');
    expect(codeAnfrageUploadKategorie('')).toBe('dokument');
  });

  it('baut den Abschnitt „Code“ aus den geprüften Angaben und verwirft den aus dem Browser', () => {
    expect(codeAnfrageAbschnitt({ schloss: ' ', code: '', stueckzahl: 1, berechtigt: false }).rows.map((z) => z.value)).toEqual([
      '—',
      '—',
      '1',
      'nicht bestätigt',
    ]);
    const browser = [
      { title: 'Code', rows: [{ label: 'Code wie aufgedruckt', value: 'FALSCH' }] },
      { title: 'Kontakt', rows: [{ label: 'Name', value: 'Erika Muster' }] },
    ];
    const ergebnis = mitGeprueftemCode(browser, { schloss: 'Möbelschloss', code: 'A12', stueckzahl: 3 });
    expect(ergebnis.filter((a) => a.title === 'Code')).toHaveLength(1);
    expect(ergebnis[0].rows).toEqual([
      { label: 'Hersteller oder Schloss', value: 'Möbelschloss' },
      { label: 'Code wie aufgedruckt', value: 'A12' },
      { label: 'Stückzahl', value: '3' },
      { label: 'Berechtigung', value: 'bestätigt' },
    ]);
    expect(ergebnis[1]).toEqual(browser[1]);
  });

  it('lässt die Felder der Code-Anfrage bei anderen Themen weg', () => {
    const rest = ohneCodeFelder({ thema: 'autoschluessel', beschreibung: 'x', schloss: '', code: '', stueckzahl: 1, berechtigt: false });
    expect(rest).toEqual({ thema: 'autoschluessel', beschreibung: 'x' });
  });

  it('beschreibt das Thema in der Themenwahl ohne Bestellversprechen', () => {
    expect(CODE_ANFRAGE_THEMENTEXT).not.toMatch(/bestell/i);
  });
});
