import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

/* Der Fuß steht im Root-Layout: Ein Datenbankfehler darf die Seite nicht brechen. */

const zustand = { fehler: true };

vi.mock('@/lib/data', async () => {
  const { echteEinstellungen } = await import('@/lib/rechtliches/test-hilfen');
  return {
    getSettings: async () => {
      if (zustand.fehler) throw new Error('Datenbank nicht erreichbar');
      return echteEinstellungen();
    },
  };
});

const { SiteFooter } = await import('./site-footer');

describe('SiteFooter', () => {
  it('fällt bei einem Datenbankfehler auf die Standardwerte zurück', async () => {
    const fehler = vi.spyOn(console, 'error').mockImplementation(() => {});
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('SCHLÜSSELMACHER');
    expect(html).toContain('Impressum');
    // Standardwerte sind Platzhalter: keine Anschrift.
    expect(html).not.toContain('Gloelstraße');
    expect(fehler).toHaveBeenCalledWith(expect.stringContaining('[fuss]'), expect.any(Error));
    fehler.mockRestore();
  });

  it('zeigt mit Datenbank die gepflegten Firmendaten', async () => {
    zustand.fehler = false;
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('Gloelstraße 11');
  });
});
