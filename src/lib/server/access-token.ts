import 'server-only';

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Geheimer Link-Schlüssel für Bestellbestätigungen.
 *
 * Die Vorgangsnummer ist fortlaufend und damit erratbar. Die Bestätigungsseite
 * zeigt aber Anschrift und Bestellung — deshalb braucht sie zusätzlich einen
 * zufälligen Schlüssel. Gespeichert wird nur dessen Hash.
 */
export function createAccessToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

/** Vergleicht zeitkonstant, damit sich der Hash nicht Zeichen für Zeichen erraten lässt. */
export function verifyAccessToken(token: string | undefined | null, expectedHash: string | undefined): boolean {
  if (!token || !expectedHash || token.length > 128) return false;
  const actual = Buffer.from(hashToken(token), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
