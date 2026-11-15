import { afterEach, describe, expect, it, vi } from 'vitest';

/*
 * Kopfzeilen der Seite (FA-25-20, FA-SEO-01C): `next.config.ts` bindet die Regel aus
 * `suchmaschinenKopfzeilen()` ein. Jede Umgebung außer der Produktionsdomain liefert
 * `X-Robots-Tag: noindex`; die Sicherheitskopfzeilen bleiben daneben stehen.
 */

type Regel = { source: string; missing?: Array<{ type: string; value: string }>; headers: Array<{ key: string; value: string }> };

async function regeln(): Promise<Regel[]> {
  vi.resetModules();
  const { default: config } = await import('../../next.config');
  return (await config.headers!()) as Regel[];
}

const noindex = (liste: Regel[]) => liste.filter((r) => r.headers.some((h) => h.key === 'X-Robots-Tag' && /noindex/.test(h.value)));

describe('Kopfzeilen aus next.config.ts', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('Vorschau auf Vercel: noindex für jede Adresse, ohne Ausnahme', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    const treffer = noindex(await regeln());
    expect(treffer).toHaveLength(1);
    expect(treffer[0].source).toBe('/:path*');
    expect(treffer[0].missing).toBeUndefined();
  });

  it('eigener Server ohne Schalter: noindex für jede Adresse', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VERCEL', '');
    vi.stubEnv('SM24_INDEXIERUNG', '');
    expect(noindex(await regeln())[0]?.missing).toBeUndefined();
  });

  it('erlaubte Indexierung: noindex nur noch außerhalb der Produktionsdomain', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VERCEL', '');
    vi.stubEnv('SM24_INDEXIERUNG', 'an');
    const [regel] = noindex(await regeln());
    expect(regel.missing).toHaveLength(1);
    const muster = new RegExp(`^${regel.missing![0].value}$`);
    expect(muster.test('schluesselmacher24.de')).toBe(true);
    expect(muster.test('www.schluesselmacher24.de')).toBe(true);
    // Fremde und ähnliche Hosts bekommen die Kopfzeile weiter.
    expect(muster.test('schluesselmacher24.vercel.app')).toBe(false);
    expect(muster.test('schluesselmacher24.de.example.org')).toBe(false);
    expect(muster.test('vorschau.schluesselmacher24.de')).toBe(false);
  });

  it('lässt die Sicherheitskopfzeilen stehen', async () => {
    const liste = await regeln();
    expect(liste.some((r) => r.headers.some((h) => h.key === 'Content-Security-Policy'))).toBe(true);
    expect(liste.some((r) => r.headers.some((h) => h.key === 'Strict-Transport-Security'))).toBe(true);
  });
});
