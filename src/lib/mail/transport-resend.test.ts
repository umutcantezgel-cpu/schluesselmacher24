import { afterEach, describe, expect, it, vi } from 'vitest';

import type { MailKonfiguration } from '../umgebung';
import { saubererBetreff, sendeUeberResend } from './transport-resend';

/* Resend wird nie wirklich aufgerufen: fetch ist ersetzt (siehe auch
 * src/test/setup-umgebung.ts, das echte Aufrufe sperrt). */

const KONFIGURATION: MailKonfiguration = {
  provider: 'resend',
  apiKey: 're_test_123',
  fromAddress: 'info@schluesselmacher24.de',
  fromName: 'SCHLÜSSELMACHER24',
  replyTo: 'info@schluesselmacher24.de',
  teamAdressen: ['team@schluesselmacher24.de'],
};

function antwort(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

const MAIL = {
  an: 'erika@example.org',
  betreff: 'Ihre Bestellung\r\nBcc: boese@example.org',
  text: 'Hallo',
  html: '<p>Hallo</p>',
  tags: { art: 'eingang-kunde', umgebung: 'lokal' },
  idempotenzSchluessel: 'lokal-SM24-B-2026-0001-eingang-kunde',
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('sendeUeberResend', () => {
  it('sendet mit Schlüssel, Absender, Antwortadresse und ohne Zeilenumbrüche im Betreff', async () => {
    const fetchImpl = vi.fn(async () => antwort(200, { id: 're_mail_1' }));
    const ergebnis = await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl });

    expect(ergebnis).toEqual({ status: 'gesendet', id: 're_mail_1' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer re_test_123');
    expect(headers['Idempotency-Key']).toBe('lokal-SM24-B-2026-0001-eingang-kunde');
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      from: 'SCHLÜSSELMACHER24 <info@schluesselmacher24.de>',
      to: ['erika@example.org'],
      reply_to: ['info@schluesselmacher24.de'],
      subject: 'Ihre Bestellung Bcc: boese@example.org',
      text: 'Hallo',
      html: '<p>Hallo</p>',
    });
    expect(body.tags).toEqual([
      { name: 'art', value: 'eingang-kunde' },
      { name: 'umgebung', value: 'lokal' },
    ]);
  });

  it('meldet „nicht eingerichtet“ ohne Konfiguration und ruft nichts auf', async () => {
    const fetchImpl = vi.fn();
    expect(await sendeUeberResend(MAIL, { konfiguration: null, fetchImpl })).toEqual({ status: 'nicht-eingerichtet' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('wiederholt 4xx nicht', async () => {
    const fetchImpl = vi.fn(async () => antwort(422, { name: 'validation_error', message: 'Ungültig' }));
    const ergebnis = await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl, wartenMs: 1 });
    expect(ergebnis).toEqual({ status: 'fehlgeschlagen', fehler: 'HTTP 422 (validation_error)' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('wiederholt 429 und 5xx genau einmal', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(antwort(429, { name: 'rate_limit_exceeded' }))
      .mockResolvedValueOnce(antwort(200, { id: 're_mail_2' }));
    expect(await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl, wartenMs: 1 })).toEqual({
      status: 'gesendet',
      id: 're_mail_2',
    });

    const immerFehler = vi.fn(async () => antwort(503, {}));
    const ergebnis = await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl: immerFehler, wartenMs: 1 });
    expect(ergebnis.status).toBe('fehlgeschlagen');
    expect(immerFehler).toHaveBeenCalledTimes(2);
  });

  it('wiederholt ein erschöpftes Tageskontingent nicht', async () => {
    const fetchImpl = vi.fn(async () => antwort(429, { name: 'daily_quota_exceeded' }));
    const ergebnis = await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl, wartenMs: 1 });
    expect(ergebnis.status).toBe('fehlgeschlagen');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('wertet 409 als „möglicherweise gesendet“', async () => {
    const fetchImpl = vi.fn(async () => antwort(409, { name: 'invalid_idempotent_request' }));
    const ergebnis = await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl });
    expect(ergebnis.status).toBe('moeglicherweise-gesendet');
  });

  it('bricht nach dem Gesamtbudget ab und wirft nie', async () => {
    const fetchImpl = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('abgebrochen'), { name: 'TimeoutError' })));
        }),
    );
    const ergebnis = await sendeUeberResend(MAIL, {
      konfiguration: KONFIGURATION,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      budgetMs: 50,
    });
    expect(ergebnis).toEqual({ status: 'fehlgeschlagen', fehler: 'Zeitlimit erreicht' });

    const kaputt = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    expect(await sendeUeberResend(MAIL, { konfiguration: KONFIGURATION, fetchImpl: kaputt })).toEqual({
      status: 'fehlgeschlagen',
      fehler: 'Netzwerkfehler',
    });
  });

  it('leitet außerhalb der Produktion an MAIL_REDIRECT_TO um, in Produktion nie', async () => {
    const fetchImpl = vi.fn(async () => antwort(200, { id: 're_x' }));
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    await sendeUeberResend(MAIL, { konfiguration: { ...KONFIGURATION, redirectTo: 'test@schluesselmacher24.de' }, fetchImpl });
    const vorschau = JSON.parse((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(vorschau.to).toEqual(['test@schluesselmacher24.de']);
    expect(vorschau.subject).toContain('[Umgeleitet, an: erika@example.org]');

    vi.stubEnv('VERCEL_ENV', 'production');
    await sendeUeberResend(MAIL, { konfiguration: { ...KONFIGURATION, redirectTo: 'test@schluesselmacher24.de' }, fetchImpl });
    const produktion = JSON.parse((fetchImpl.mock.calls[1] as unknown as [string, RequestInit])[1].body as string);
    expect(produktion.to).toEqual(['erika@example.org']);
  });
});

describe('saubererBetreff', () => {
  it('entfernt Zeilenumbrüche und kürzt', () => {
    expect(saubererBetreff('a\r\nb\nc')).toBe('a b c');
    expect(saubererBetreff('x'.repeat(500))).toHaveLength(200);
  });
});
