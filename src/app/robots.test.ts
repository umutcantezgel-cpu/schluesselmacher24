import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import robots from './robots';

/* Erg. Leitfaden §4: Vorschau- und Testumgebungen vor Suchmaschinen schützen. */

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('robots.txt', () => {
  /* FA-SEO-01C: Keine Umgebung sperrt alles — sonst sähe die Suchmaschine das noindex nicht
   * (FA-RECHERCHE-05, Abschnitt 4). Die Sitemap nennt robots.txt nur, wo indexiert werden darf. */
  const NIE = ['/admin', '/api/', '/kasse', '/warenkorb', '/bestellung'];

  it('lässt in der Vorschau crawlen, sperrt nur Vorgänge und nennt keine Sitemap', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    const regeln = robots();
    expect(regeln.rules).toEqual([{ userAgent: '*', allow: '/', disallow: NIE }]);
    expect(regeln.sitemap).toBeUndefined();
  });

  it('erlaubt in der Produktion das Crawlen und nennt die Sitemap', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    // Die eigene Shell darf den JSON-Modus oder die Notbremse nicht erzwingen.
    vi.stubEnv('SM24_DATA', '');
    vi.stubEnv('SM24_INDEXIERUNG', '');
    const regeln = robots();
    expect(regeln.rules).toEqual([{ userAgent: '*', allow: '/', disallow: NIE }]);
    expect(regeln.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it('nennt im Schaufenster (Produktion ohne Datenbank) keine Sitemap und sperrt nicht alles', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('DATABASE_URL', '');
    vi.stubEnv('POSTGRES_URL', '');
    const regeln = robots();
    expect(regeln.rules).toEqual([{ userAgent: '*', allow: '/', disallow: NIE }]);
    expect(regeln.sitemap).toBeUndefined();
  });

  it('nennt auf einem eigenen Server ohne SM24_INDEXIERUNG=an keine Sitemap', () => {
    vi.stubEnv('VERCEL', '');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SM24_INDEXIERUNG', '');
    expect(robots().sitemap).toBeUndefined();
    vi.stubEnv('SM24_INDEXIERUNG', 'an');
    expect(robots().sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it('sperrt in keiner Umgebung die ganze Seite', () => {
    for (const env of [{ VERCEL: '1', VERCEL_ENV: 'preview' }, { VERCEL: '', NODE_ENV: 'development' }, { VERCEL: '1', VERCEL_ENV: 'production', DATABASE_URL: '', POSTGRES_URL: '' }]) {
      for (const [name, wert] of Object.entries(env)) vi.stubEnv(name, wert);
      const regeln = [robots().rules].flat();
      expect(regeln.every((regel) => ![regel.disallow].flat().includes('/'))).toBe(true);
    }
  });
});

describe('Root-Layout', () => {
  /* Das Layout lässt sich wegen next/font nicht im Test laden — geprüft wird der Quelltext. */
  const layout = readFileSync(path.join(__dirname, '(site)/layout.tsx'), 'utf8');

  it('steht außerhalb der Produktion auf noindex', () => {
    expect(layout).toMatch(/robots:\s*indexierungErlaubt\(\)\s*\?\s*\{\s*index:\s*true[^}]*\}\s*:\s*\{\s*index:\s*false/);
  });

  it('gibt die Google-Bestätigung nur aus, wenn sie gesetzt ist', () => {
    expect(layout).toContain("...(googleBestaetigung ? { verification: { google: googleBestaetigung } } : {})");
  });
});
