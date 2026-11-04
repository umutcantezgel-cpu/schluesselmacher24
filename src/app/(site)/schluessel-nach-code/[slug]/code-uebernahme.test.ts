import { describe, expect, it } from 'vitest';
import { codeAusAdresse, codeFuerAdresse, nachCodeHref } from './code-uebernahme';

const MUSTER = '^[A-Z][0-9]{3}$';

describe('codeAusAdresse', () => {
  it('übernimmt einen Code, der zum Format passt', () => {
    expect(codeAusAdresse('C214', MUSTER)).toBe('C214');
  });

  it('verwirft einen Code, der nicht zum Format passt', () => {
    expect(codeAusAdresse('12345', MUSTER)).toBeNull();
    expect(codeAusAdresse('C21', MUSTER)).toBeNull();
  });

  it('verwirft einen zu langen Code', () => {
    const lang = `C${'2'.repeat(40)}`;
    expect(lang.length).toBe(41);
    expect(codeAusAdresse(lang, '^[A-Z][0-9]+$')).toBeNull();
  });

  it('entfernt Leerraum am Rand vor der Prüfung', () => {
    expect(codeAusAdresse('  C214  ', MUSTER)).toBe('C214');
  });

  it('nimmt fehlende oder leere Werte nicht an', () => {
    expect(codeAusAdresse(null, MUSTER)).toBeNull();
    expect(codeAusAdresse(undefined, MUSTER)).toBeNull();
    expect(codeAusAdresse('   ', MUSTER)).toBeNull();
  });

  it('übernimmt Kleinbuchstaben in Großschreibung, wenn das Muster sie verlangt', () => {
    expect(codeAusAdresse('c214', MUSTER)).toBe('C214');
  });
});

describe('codeFuerAdresse', () => {
  it('trimmt und begrenzt auf 40 Zeichen', () => {
    expect(codeFuerAdresse(' ab ')).toBe('ab');
    expect(codeFuerAdresse('a'.repeat(40))).toBe('a'.repeat(40));
    expect(codeFuerAdresse('a'.repeat(41))).toBeNull();
    expect(codeFuerAdresse('  ')).toBeNull();
  });
});

describe('nachCodeHref', () => {
  it('baut die Adresse mit kodiertem Code', () => {
    expect(nachCodeHref('linie-a', ' C2 14 ')).toBe('/schluessel-nach-code/linie-a?code=C2%2014');
  });

  it('liefert keine Adresse ohne gültigen Code', () => {
    expect(nachCodeHref('linie-a', '   ')).toBeNull();
  });
});
