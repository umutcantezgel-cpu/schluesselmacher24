import {
  APIError,
  Forbidden,
  createLocalReq,
  getPayload,
  initTransaction,
  registerFirstUserOperation,
  type Payload,
  type PayloadRequest,
} from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';

import { ANMELDE_LIMITS, MELDUNG_ZU_VIELE_VERSUCHE } from './benutzer-schutz';

/* Gegen die Testdatenbank (src/test/db-global-setup.ts). Anfragen aus dem
 * Netz werden mit `payloadAPI: 'REST'` nachgebildet — so, wie Payloads
 * REST-Endpunkte sie an die Operationen weiterreichen. */

let payload: Payload;
let laufend = 0;

beforeAll(async () => {
  payload = await getPayload({ config });
});

/** Eine Anfrage wie über /api/benutzer/… — ohne Anmeldung, von `ip`. */
function ausDemNetz(ip: string): Promise<PayloadRequest> {
  return createLocalReq(
    { req: { payloadAPI: 'REST', headers: new Headers({ 'x-forwarded-for': `${ip}, 10.0.0.1` }) } as Partial<PayloadRequest> },
    payload,
  );
}

function neueAdresse(): string {
  laufend += 1;
  return `test-${process.pid}-${laufend}@example.org`;
}

describe('Erstregistrierung', () => {
  it('ist über /api/benutzer/first-register gesperrt — auch auf einer leeren Datenbank', async () => {
    const req = await ausDemNetz('203.0.113.10');
    // In einer Transaktion alle Konten entfernen; registerFirstUser bricht sie am Ende ab.
    await initTransaction(req);
    await payload.delete({ collection: 'benutzer', where: { id: { exists: true } }, overrideAccess: true, req });
    expect((await payload.count({ collection: 'benutzer', overrideAccess: true, req })).totalDocs).toBe(0);

    const email = neueAdresse();
    await expect(
      registerFirstUserOperation({
        collection: payload.collections.benutzer,
        data: { email, password: 'angreifer-passwort-123' } as never,
        req,
      }),
    ).rejects.toBeInstanceOf(Forbidden);
    expect((await payload.count({ collection: 'benutzer', where: { email: { equals: email } }, overrideAccess: true })).totalDocs).toBe(0);
  });

  it('sperrt jedes Anlegen ohne Anmeldung aus dem Netz, nicht aber admin-anlegen und eigenen Servercode', async () => {
    const daten = () => ({ email: neueAdresse(), password: 'nur-fuer-tests-123456', rollen: ['inhaber' as const] });

    await expect(
      payload.create({ collection: 'benutzer', data: daten(), overrideAccess: true, req: await ausDemNetz('203.0.113.11') }),
    ).rejects.toBeInstanceOf(Forbidden);

    const perSkript = await payload.create({
      collection: 'benutzer',
      data: daten(),
      overrideAccess: true,
      context: { adminAnlage: true },
      req: await ausDemNetz('203.0.113.11'),
    });
    const lokal = await payload.create({ collection: 'benutzer', data: daten(), overrideAccess: true });
    expect(perSkript.id).toBeDefined();
    expect(lokal.id).toBeDefined();
  });
});

describe('Ratenbegrenzung der Anmeldung', () => {
  it('bremst „Passwort vergessen“ je Absender', async () => {
    const versuch = async (ip: string) =>
      payload.forgotPassword({
        collection: 'benutzer',
        data: { email: 'niemand@example.org' },
        disableEmail: true,
        req: await ausDemNetz(ip),
      });

    for (let i = 0; i < ANMELDE_LIMITS.forgotPassword.limit; i += 1) await versuch('203.0.113.20');
    const gebremst = await versuch('203.0.113.20').catch((error: unknown) => error);
    expect(gebremst).toBeInstanceOf(APIError);
    expect(gebremst).toMatchObject({ status: 429, message: MELDUNG_ZU_VIELE_VERSUCHE });

    // Ein anderer Absender ist nicht betroffen.
    await versuch('203.0.113.21');
  });

  it('bremst Anmeldeversuche je Absender, nicht aber eigenen Servercode', async () => {
    const versuch = async (ip?: string): Promise<{ status?: number }> =>
      payload
        .login({
          collection: 'benutzer',
          data: { email: 'niemand@example.org', password: 'falsch-falsch-falsch' },
          ...(ip ? { req: await ausDemNetz(ip) } : {}),
        })
        .then(() => ({ status: 200 }))
        .catch((error: unknown) => error as { status?: number });

    for (let i = 0; i < ANMELDE_LIMITS.login.limit; i += 1) {
      expect((await versuch('2001:db8:aa:bb::1')).status).toBe(401);
    }
    // Gleiches /64-Netz, andere Adresse: weiterhin gebremst.
    expect(await versuch('2001:db8:aa:bb::2')).toMatchObject({ status: 429 });
    expect((await versuch()).status).toBe(401);
  });
});
