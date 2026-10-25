import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Der tägliche Cron, wie Vercel ihn aufruft. Löschen, Zählerpflege und
 * Erinnerungen sind ersetzt; die echte Bereinigung prüft
 * kundendateien.db.test.ts, die Erinnerungen termin-erinnerungen.db.test.ts. */

const bereinige = vi.fn();
const zaehler = vi.fn();
const erinnere = vi.fn();

const ERINNERUNGEN = { tageVorher: 1, termintag: '2026-10-26', termine: 2, gesendet: 1, bereitsErinnert: 1, fehlgeschlagen: 0 };

vi.mock('@/lib/server/kundendateien', () => ({
  bereinigeKundendateien: (...args: unknown[]) => bereinige(...args),
}));
vi.mock('@/lib/server/rate-limit', () => ({
  alteZaehlerLoeschen: (...args: unknown[]) => zaehler(...args),
}));
vi.mock('@/lib/server/termin-erinnerungen', () => ({
  terminErinnerungenSenden: (...args: unknown[]) => erinnere(...args),
}));

const { GET } = await import('./route');
const { cronErlaubt } = await import('@/lib/server/cron-zugriff');

const GEHEIM = 'cron-geheimnis-fuer-tests-0123456789';

function aufruf(authorization?: string): Request {
  return new Request('https://schluesselmacher24.de/api/cron/taeglich', {
    headers: authorization ? { authorization } : {},
  });
}

beforeEach(() => {
  vi.stubEnv('CRON_SECRET', GEHEIM);
  vi.stubEnv('DATABASE_URL', 'postgres://test');
  vi.stubEnv('SM24_DATA', undefined);
  bereinige.mockReset();
  zaehler.mockReset();
  bereinige.mockResolvedValue({
    geloescht: [{ id: 1, dateiname: 'erika-muster.jpg', grund: 'nie-zugeordnet' }],
    fehlgeschlagen: [],
    uebersprungen: [],
  });
  zaehler.mockResolvedValue(7);
  erinnere.mockReset();
  erinnere.mockResolvedValue(ERINNERUNGEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('cronErlaubt', () => {
  it('verlangt genau „Bearer <CRON_SECRET>“', () => {
    expect(cronErlaubt(aufruf(`Bearer ${GEHEIM}`))).toBe('ok');
    expect(cronErlaubt(aufruf(GEHEIM))).toBe('verboten');
    expect(cronErlaubt(aufruf(`Bearer ${GEHEIM}x`))).toBe('verboten');
    expect(cronErlaubt(aufruf('Bearer '))).toBe('verboten');
    expect(cronErlaubt(aufruf())).toBe('verboten');
  });

  it('ist ohne CRON_SECRET nicht eingerichtet — auch ein leerer Bearer passt dann nicht', () => {
    vi.stubEnv('CRON_SECRET', '  ');
    expect(cronErlaubt(aufruf('Bearer '))).toBe('nicht-eingerichtet');
    expect(cronErlaubt(aufruf('Bearer undefined'))).toBe('nicht-eingerichtet');
  });
});

describe('GET /api/cron/taeglich', () => {
  it('antwortet ohne CRON_SECRET mit 503 und tut nichts', async () => {
    vi.stubEnv('CRON_SECRET', undefined);
    const response = await GET(aufruf('Bearer '));
    expect(response.status).toBe(503);
    expect(bereinige).not.toHaveBeenCalled();
  });

  it('weist falsche Schlüssel mit 401 ab', async () => {
    const response = await GET(aufruf('Bearer falsch'));
    expect(response.status).toBe(401);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(bereinige).not.toHaveBeenCalled();
  });

  it('antwortet ohne Datenbank mit 503', async () => {
    vi.stubEnv('SM24_DATA', 'json');
    const response = await GET(aufruf(`Bearer ${GEHEIM}`));
    expect(response.status).toBe(503);
    expect(bereinige).not.toHaveBeenCalled();
  });

  it('bereinigt, erinnert und meldet nur Zahlen, keine Dateinamen', async () => {
    const response = await GET(aufruf(`Bearer ${GEHEIM}`));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const text = await response.text();
    expect(JSON.parse(text)).toEqual({
      kundendateien: { geloescht: 1, fehlgeschlagen: 0, uebersprungen: 0 },
      ratenzaehler: { geloescht: 7 },
      erinnerungen: ERINNERUNGEN,
    });
    expect(text).not.toContain('erika');
    expect(bereinige).toHaveBeenCalledTimes(1);
    expect(zaehler).toHaveBeenCalledTimes(1);
    expect(erinnere).toHaveBeenCalledTimes(1);
  });

  it('meldet gescheiterte Erinnerungen mit 500 — die Bereinigung läuft trotzdem', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    erinnere.mockResolvedValueOnce({ ...ERINNERUNGEN, gesendet: 0, fehlgeschlagen: 1 });
    const teilweise = await GET(aufruf(`Bearer ${GEHEIM}`));
    expect(teilweise.status).toBe(500);
    expect((await teilweise.json()).erinnerungen.fehlgeschlagen).toBe(1);

    erinnere.mockRejectedValueOnce(new Error('Datenbank weg'));
    const kaputt = await GET(aufruf(`Bearer ${GEHEIM}`));
    expect(kaputt.status).toBe(500);
    const body = await kaputt.json();
    expect(body.kundendateien.geloescht).toBe(1);
    expect(body.erinnerungen).toEqual({ fehler: 'Lauf fehlgeschlagen.' });
    expect(bereinige).toHaveBeenCalledTimes(2);
    log.mockRestore();
  });

  it('meldet Fehlschläge mit 500, damit Vercel den Lauf als fehlgeschlagen zeigt', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    bereinige.mockResolvedValueOnce({
      geloescht: [],
      fehlgeschlagen: [{ id: 2, dateiname: 'a.jpg', grund: 'frist-abgelaufen', fehler: 'Ablage nicht erreichbar' }],
      uebersprungen: [],
    });
    expect((await GET(aufruf(`Bearer ${GEHEIM}`))).status).toBe(500);

    bereinige.mockRejectedValueOnce(new Error('Datenbank weg'));
    const kaputt = await GET(aufruf(`Bearer ${GEHEIM}`));
    expect(kaputt.status).toBe(500);
    expect(await kaputt.text()).not.toContain('Datenbank weg');
    log.mockRestore();
  });

  it('setzt eine Laufzeitgrenze von 60 Sekunden', async () => {
    expect((await import('./route')).maxDuration).toBe(60);
  });
});
