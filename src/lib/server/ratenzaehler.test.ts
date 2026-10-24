import { describe, expect, it } from 'vitest';

import { absenderAus, absenderSchluessel, adresseKuerzen, zaehleImSpeicher } from './ratenzaehler';

describe('adresseKuerzen', () => {
  it('zählt IPv6 je /64-Präfix — der ganze Anschluss ist ein Absender', () => {
    expect(adresseKuerzen('2001:db8:85a3:1234:aaaa:bbbb:cccc:dddd')).toBe('2001:db8:85a3:1234::/64');
    expect(adresseKuerzen('2001:0DB8:85A3:1234:0000:0000:0000:0001')).toBe('2001:db8:85a3:1234::/64');
    expect(adresseKuerzen('2001:db8:85a3:1234::1')).toBe(adresseKuerzen('2001:db8:85a3:1234:ffff::42'));
    expect(adresseKuerzen('2001:db8::1')).toBe('2001:db8:0:0::/64');
    expect(adresseKuerzen('[2001:db8:85a3:1234::1]:443')).toBe('2001:db8:85a3:1234::/64');
    expect(adresseKuerzen('fe80::1%eth0')).toBe('fe80:0:0:0::/64');
    expect(adresseKuerzen('::1')).toBe('0:0:0:0::/64');
  });

  it('trennt verschiedene /64-Netze', () => {
    expect(adresseKuerzen('2001:db8:85a3:1234::1')).not.toBe(adresseKuerzen('2001:db8:85a3:1235::1'));
  });

  it('lässt IPv4 als einzelne Adresse — auch in IPv6-Schreibweise und mit Port', () => {
    expect(adresseKuerzen('198.51.100.23')).toBe('198.51.100.23');
    expect(adresseKuerzen('198.51.100.23:51234')).toBe('198.51.100.23');
    expect(adresseKuerzen('::ffff:198.51.100.23')).toBe('198.51.100.23');
    expect(adresseKuerzen('::FFFF:c633:6417')).toBe('198.51.100.23');
  });

  it('übernimmt Unlesbares unverändert', () => {
    expect(adresseKuerzen('unbekannt')).toBe('unbekannt');
    expect(adresseKuerzen('1:2:3')).toBe('1:2:3');
    expect(adresseKuerzen('1::2::3')).toBe('1::2::3');
  });
});

describe('absenderAus', () => {
  it('nimmt den ersten Eintrag von x-forwarded-for, sonst x-real-ip', () => {
    expect(absenderAus(new Headers({ 'x-forwarded-for': '2001:db8:1:2::9, 10.0.0.1' }))).toBe('2001:db8:1:2::/64');
    expect(absenderAus(new Headers({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7');
    expect(absenderAus(new Headers())).toBe('unbekannt');
  });
});

describe('absenderSchluessel', () => {
  it('speichert nur einen HMAC, nie die Adresse', () => {
    const regel = { name: 'test', limit: 1, windowMs: 1000 };
    const schluessel = absenderSchluessel(regel, '2001:db8:1:2::/64');
    expect(schluessel).toMatch(/^test:[0-9a-f]{64}$/);
    expect(schluessel).not.toContain('2001');
  });
});

describe('zaehleImSpeicher', () => {
  it('lässt bis zur Grenze durch und beginnt nach dem Fenster neu', () => {
    const speicher = new Map<string, number[]>();
    const regel = { name: 'test', limit: 2, windowMs: 1000 };
    expect([0, 1, 2].map((t) => zaehleImSpeicher(speicher, 'a', regel, t))).toEqual([true, true, false]);
    expect(zaehleImSpeicher(speicher, 'b', regel, 3)).toBe(true);
    expect(zaehleImSpeicher(speicher, 'a', regel, 1001)).toBe(true);
  });
});
