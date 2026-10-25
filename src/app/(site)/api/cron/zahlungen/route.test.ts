import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const abgleichen = vi.fn(async () => ({ geprueft: 2, verbucht: 1, freigegeben: 1, fehler: 0 }));
vi.mock('@/lib/zahlung/abgleich', () => ({ zahlungenAbgleichen: () => abgleichen() }));
const zustand = { online: true };
vi.mock('@/lib/integrations', () => ({ paymentStatus: () => ({ configured: zustand.online }) }));

const { GET } = await import('./route');

const aufruf = (authorization?: string) =>
  GET(new Request('https://schluesselmacher24.de/api/cron/zahlungen', { headers: authorization ? { authorization } : {} }));

beforeEach(() => {
  zustand.online = true;
  abgleichen.mockClear();
  vi.stubEnv('CRON_SECRET', 'geheim-123');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('GET /api/cron/zahlungen', () => {
  it('ist ohne CRON_SECRET gesperrt (503)', async () => {
    vi.stubEnv('CRON_SECRET', '');
    expect((await aufruf('Bearer ')).status).toBe(503);
    expect(abgleichen).not.toHaveBeenCalled();
  });

  it('lehnt fehlende und falsche Schlüssel ab', async () => {
    expect((await aufruf()).status).toBe(401);
    expect((await aufruf('Bearer falsch')).status).toBe(401);
    expect((await aufruf('geheim-123')).status).toBe(401);
    expect(abgleichen).not.toHaveBeenCalled();
  });

  it('gleicht mit dem richtigen Schlüssel ab und antwortet nur mit Zählern', async () => {
    const response = await aufruf('Bearer geheim-123');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ geprueft: 2, verbucht: 1, freigegeben: 1, fehler: 0 });
  });

  it('überspringt den Abgleich ohne Online-Zahlung', async () => {
    zustand.online = false;
    const response = await aufruf('Bearer geheim-123');
    expect(await response.json()).toEqual({ uebersprungen: true });
    expect(abgleichen).not.toHaveBeenCalled();
  });
});
