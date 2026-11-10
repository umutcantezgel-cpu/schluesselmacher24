import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import robots from './robots';

/* Erg. Leitfaden §4: Vorschau- und Testumgebungen vor Suchmaschinen schützen. */

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('robots.txt', () => {
  it('sperrt außerhalb der Produktion alles und nennt keine Sitemap', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    const regeln = robots();
    expect(regeln.rules).toEqual([{ userAgent: '*', disallow: '/' }]);
    expect(regeln.sitemap).toBeUndefined();
  });

  it('erlaubt in der Produktion das Crawlen und nennt die Sitemap', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    // Die eigene Shell darf den JSON-Modus nicht erzwingen (dann wäre es das Schaufenster).
    vi.stubEnv('SM24_DATA', '');
    const regeln = robots();
    expect(regeln.rules).toEqual([expect.objectContaining({ userAgent: '*', allow: '/' })]);
    expect(regeln.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it('sperrt im Schaufenster (Produktion ohne Datenbank) alles wie in einer Vorschau', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('DATABASE_URL', '');
    vi.stubEnv('POSTGRES_URL', '');
    const regeln = robots();
    expect(regeln.rules).toEqual([{ userAgent: '*', disallow: '/' }]);
    expect(regeln.sitemap).toBeUndefined();
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
