import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Die Gesundheitsroute für den Uptime-Monitor. Payload und die Datenbank
 * sind ersetzt; dass `SELECT 1` über die Laufzeitrolle geht, zeigen die
 * DB-Tests der übrigen Server-Module (gleicher Weg über payloadInstanz). */

const ausfuehren = vi.fn();
const instanz = vi.fn();

vi.mock('@/lib/data/payload-adapter', () => ({
  payloadInstanz: (...args: unknown[]) => instanz(...args),
}));
vi.mock('@payloadcms/db-postgres', () => ({
  sql: (teile: TemplateStringsArray) => teile.join('?'),
}));

const { GET, maxDuration } = await import('./route');

const SCHLUESSEL = 'gesundheit-nur-fuer-tests-0123456789';

function aufruf(schluessel?: string): Request {
  const url = new URL('https://schluesselmacher24.de/api/gesundheit');
  if (schluessel !== undefined) url.searchParams.set('schluessel', schluessel);
  return new Request(url);
}

beforeEach(() => {
  vi.stubEnv('GESUNDHEIT_SCHLUESSEL', SCHLUESSEL);
  vi.stubEnv('DATABASE_URL', 'postgres://test');
  vi.stubEnv('SM24_DATA', undefined);
  ausfuehren.mockReset();
  ausfuehren.mockResolvedValue({ rows: [{ '?column?': 1 }] });
  instanz.mockReset();
  instanz.mockResolvedValue({ db: { drizzle: { execute: ausfuehren } } });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('GET /api/gesundheit', () => {
  it('antwortet mit gültigem Schlüssel 200 nach genau einem SELECT 1', async () => {
    const response = await GET(aufruf(SCHLUESSEL));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ ok: true });
    expect(ausfuehren).toHaveBeenCalledTimes(1);
    expect(ausfuehren).toHaveBeenCalledWith('SELECT 1');
  });

  it('gibt sich ohne gültigen Schlüssel nicht zu erkennen und berührt die Datenbank nicht', async () => {
    for (const schluessel of [undefined, '', 'falsch', `${SCHLUESSEL}x`, SCHLUESSEL.slice(0, -1)]) {
      const response = await GET(aufruf(schluessel));
      expect(response.status).toBe(404);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(instanz).not.toHaveBeenCalled();
  });

  it('bleibt ohne oder mit zu kurzem GESUNDHEIT_SCHLUESSEL aus', async () => {
    vi.stubEnv('GESUNDHEIT_SCHLUESSEL', '  ');
    expect((await GET(aufruf(''))).status).toBe(404);

    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('GESUNDHEIT_SCHLUESSEL', 'zu-kurz');
    expect((await GET(aufruf('zu-kurz'))).status).toBe(404);
    expect(warnung).toHaveBeenCalledTimes(1);
    expect(instanz).not.toHaveBeenCalled();
    warnung.mockRestore();
  });

  it('meldet 503 ohne angebundene Datenbank', async () => {
    vi.stubEnv('SM24_DATA', 'json');
    const response = await GET(aufruf(SCHLUESSEL));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false });
    expect(instanz).not.toHaveBeenCalled();
  });

  it('meldet 503 ohne Details, wenn die Datenbank einen Fehler liefert', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    ausfuehren.mockRejectedValueOnce(new Error('password authentication failed for user "sm24_app"'));
    const response = await GET(aufruf(SCHLUESSEL));
    expect(response.status).toBe(503);
    expect(await response.text()).toBe(JSON.stringify({ ok: false }));
    expect(log).toHaveBeenCalledTimes(1);
    log.mockRestore();
  });

  it('meldet 503, wenn die Datenbank nicht binnen 5 Sekunden antwortet', async () => {
    vi.useFakeTimers();
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    let spaeterScheitern: (grund: Error) => void = () => {};
    ausfuehren.mockReturnValueOnce(new Promise((_, reject) => (spaeterScheitern = reject)));
    const antwort = GET(aufruf(SCHLUESSEL));
    await vi.advanceTimersByTimeAsync(4_999);
    let fertig = false;
    void antwort.then(() => (fertig = true));
    await Promise.resolve();
    expect(fertig).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect((await antwort).status).toBe(503);
    // Ein spätes Scheitern der Abfrage bleibt ohne Folgen (keine unbehandelte Ablehnung).
    spaeterScheitern(new Error('Verbindung beendet'));
    await Promise.resolve();
    log.mockRestore();
  });

  it('setzt eine Laufzeitgrenze von 15 Sekunden', () => {
    expect(maxDuration).toBe(15);
  });
});
