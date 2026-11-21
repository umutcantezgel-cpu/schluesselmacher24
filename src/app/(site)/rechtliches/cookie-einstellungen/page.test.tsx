import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Der vorab erfasste Stand der Seite (Schlüssel `cookieEinstellungen`) liegt zusammen mit dem der Hinweise in dieser Datei.
import VORHER from '@/lib/tutorials/hinweis-vorher.json';

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

/*
 * Fassung hinter dem Schalter SM24_VIDEOS (FA-INHALT-01C, Entwurf zur anwaltlichen Prüfung, R10). Ohne Schalter
 * bleibt die Seite Zeichen für Zeichen wie vor dem Paket (`hinweis-vorher.json`, erfasst vor der ersten Änderung).
 */
describe('Cookie-Einstellungen und Videos', () => {
  const ohne = (messId: string) => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', messId);
    return renderToStaticMarkup(<CookieEinstellungenPage />);
  };

  it('ohne Schalter: beide Fassungen Zeichen für Zeichen wie vorher', () => {
    for (const schalter of ['', 'aus']) {
      vi.stubEnv('SM24_VIDEOS', schalter);
      expect(ohne(''), `ohne Statistik ${schalter}`).toBe(VORHER.cookieEinstellungen.ohneStatistik);
      expect(ohne('G-TEST1234'), `mit Statistik ${schalter}`).toBe(VORHER.cookieEinstellungen.mitStatistik);
    }
  });

  it('mit Schalter: keine Aussage mehr, es würden keine Inhalte fremder Anbieter eingebunden; YouTube nach dem Klick', () => {
    vi.stubEnv('SM24_VIDEOS', 'an');
    for (const messId of ['', 'G-TEST1234']) {
      const html = ohne(messId);
      expect(html).not.toMatch(/bindet keine\s+Inhalte fremder Anbieter/);
      expect(html).not.toMatch(/keine Inhalte fremder Anbieter/);
      expect(html).toContain('Videos von YouTube');
      expect(html).toContain('Video laden');
      expect(html).toContain('dabei kann YouTube Cookies setzen');
      expect(html).toContain('href="/rechtliches/datenschutz"');
      // Nur die Einleitung wechselt, und unter der Liste kommt ein Satz zu den Cookies von YouTube hinzu:
      // Kategorien, Speicherung und Schaltflächen bleiben wie ohne Schalter.
      const youtubeCookies = '<p>Cookies, die YouTube nach Ihrem Klick auf „Video laden“ setzt, speichern nicht wir. Sie löschen sie über die Einstellungen Ihres Browsers.</p>';
      expect(html.split(youtubeCookies)).toHaveLength(2);
      const vorher = messId ? VORHER.cookieEinstellungen.mitStatistik : VORHER.cookieEinstellungen.ohneStatistik;
      const ohneEinleitung = (text: string) => text.replace(/<p class="mt-3">[\s\S]*?<\/p>/, '');
      expect(ohneEinleitung(html.replace(youtubeCookies, ''))).toBe(ohneEinleitung(vorher));
      expect(vorher).not.toContain('Cookies, die YouTube');
    }
  });
});
