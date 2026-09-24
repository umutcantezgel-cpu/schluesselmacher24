import { describe, expect, it } from 'vitest';

import codeLines from '../../content/code-lines.json';
import { codePasst, pruefeCodeMuster } from './code-pattern';

describe('pruefeCodeMuster', () => {
  it('akzeptiert alle vorhandenen Codelinien samt Beispielcode', () => {
    for (const line of codeLines) {
      expect(pruefeCodeMuster(line.codePattern), line.id).toBe(true);
      expect(codePasst(line.codePattern, line.codeExample), line.id).toBe(true);
    }
  });

  it.each([
    ['', 'eintragen'],
    ['[0-9]{3}', 'mit ^ beginnen'],
    ['^(a+)+$', 'Verschachtelte'],
    ['^(\\d*){2,}$', 'Verschachtelte'],
    ['^([A-Z]{2,})*$', 'Verschachtelte'],
    ['^(a)\\1$', 'Rückverweise'],
    ['^[0-9$', 'fehlerhaft'],
    [`^${'a'.repeat(130)}$`, 'zu lang'],
  ])('lehnt %s ab', (muster, meldung) => {
    const ergebnis = pruefeCodeMuster(muster);
    expect(ergebnis).not.toBe(true);
    expect(String(ergebnis)).toContain(meldung);
  });

  it('prüft Codes nur mit gültigem Muster', () => {
    expect(codePasst('^[0-9]{3,4}$', '0812')).toBe(true);
    expect(codePasst('^[0-9]{3,4}$', '08a2')).toBe(false);
    expect(codePasst('^(a+)+$', 'aaa')).toBe(false);
  });
});
