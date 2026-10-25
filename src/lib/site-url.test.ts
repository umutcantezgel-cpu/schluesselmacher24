import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSiteUrl } from './site-url';

const VARIABLEN = ['NEXT_PUBLIC_SITE_URL', 'VERCEL', 'VERCEL_ENV', 'VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL'];

beforeEach(() => {
  for (const name of VARIABLEN) vi.stubEnv(name, undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getSiteUrl', () => {
  it('fällt ohne Angaben auf die Domain zurück', () => {
    expect(getSiteUrl()).toBe('https://schluesselmacher24.de');
  });

  it('nimmt lokal NEXT_PUBLIC_SITE_URL, ergänzt das Protokoll und entfernt den Schrägstrich', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000/');
    expect(getSiteUrl()).toBe('http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', ' schluesselmacher24.de ');
    expect(getSiteUrl()).toBe('https://schluesselmacher24.de');
  });

  it('nimmt in Produktion NEXT_PUBLIC_SITE_URL, sonst die Produktionsdomain von Vercel', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('VERCEL_URL', 'sm24-abc123.vercel.app');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'schluesselmacher24.de');
    expect(getSiteUrl()).toBe('https://schluesselmacher24.de');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.schluesselmacher24.de');
    expect(getSiteUrl()).toBe('https://www.schluesselmacher24.de');
  });

  it('bevorzugt in Vorschauen die Branch-Adresse — auch wenn NEXT_PUBLIC_SITE_URL gesetzt ist', () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://schluesselmacher24.de');
    vi.stubEnv('VERCEL_URL', 'sm24-abc123.vercel.app');
    expect(getSiteUrl()).toBe('https://sm24-abc123.vercel.app');
    vi.stubEnv('VERCEL_BRANCH_URL', 'sm24-git-feature-team.vercel.app');
    expect(getSiteUrl()).toBe('https://sm24-git-feature-team.vercel.app');
  });
});
