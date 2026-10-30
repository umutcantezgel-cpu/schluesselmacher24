import { describe, expect, it } from 'vitest';

import { alterRole, passwortPruefen, scramVerifier } from './scram-verifier.mjs';

/*
 * Dass Postgres den Verifier annimmt, belegen die Datenbanktests: Die
 * Testrollen bekommen ihr Passwort über scramVerifier (src/test/db-global-setup.ts)
 * und melden sich damit an.
 */

const PASSWORT = 'Ab3$dE6&gH9*jK2!mN5?pQ8x';

describe('passwortPruefen', () => {
  it('verlangt mindestens 24 druckbare ASCII-Zeichen ohne Leerzeichen', () => {
    expect(passwortPruefen(PASSWORT)).toBeNull();
    expect(passwortPruefen('kurz')).toMatch(/Mindestens 24/);
    expect(passwortPruefen('mit leerzeichen 0123456789abcdef')).toMatch(/ASCII/);
    expect(passwortPruefen('umlaut-ä-0123456789abcdefghij')).toMatch(/ASCII/);
  });
});

describe('scramVerifier', () => {
  const salz = Buffer.alloc(16, 7);

  it('hat das Format von Postgres und ist bei gleichem Salz gleich', () => {
    const verifier = scramVerifier(PASSWORT, { salz });
    expect(verifier).toMatch(/^SCRAM-SHA-256\$4096:[A-Za-z0-9+/]{22}==\$[A-Za-z0-9+/]{43}=:[A-Za-z0-9+/]{43}=$/);
    expect(scramVerifier(PASSWORT, { salz })).toBe(verifier);
    expect(scramVerifier(`${PASSWORT}x`, { salz })).not.toBe(verifier);
  });

  it('nimmt ohne Angabe ein zufälliges Salz', () => {
    expect(scramVerifier(PASSWORT)).not.toBe(scramVerifier(PASSWORT));
  });
});

describe('alterRole', () => {
  it('baut die Anweisung und lässt nur gültige Rollennamen zu', () => {
    expect(alterRole('sm24_app', 'SCRAM-SHA-256$4096:x$y:z')).toBe("alter role sm24_app password 'SCRAM-SHA-256$4096:x$y:z';");
    expect(() => alterRole('sm24_app; drop table x', 'v')).toThrow(/Ungültiger Rollenname/);
    expect(() => alterRole('Postgres', 'v')).toThrow(/Ungültiger Rollenname/);
  });
});
