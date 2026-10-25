import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CookieEinstellungenPage from './page';

afterEach(() => vi.unstubAllEnvs());

describe('Cookie-Einstellungen', () => {
  it('bleibt ohne Mess-ID wie bisher: kein Analysedienst eingebunden', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const html = renderToStaticMarkup(<CookieEinstellungenPage />);
    expect(html).toContain('Derzeit ist kein Analysedienst eingebunden.');
    expect(html).not.toContain('Google Analytics');
  });

  it('bietet mit Mess-ID die Kategorie Statistik für Google Analytics an', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST1234');
    const html = renderToStaticMarkup(<CookieEinstellungenPage />);
    expect(html).not.toContain('Derzeit ist kein Analysedienst eingebunden.');
    expect(html).toContain('Reichweitenmessung mit Google Analytics');
    expect(html).toContain('Statistik mit Google Analytics');
  });
});
