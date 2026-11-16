import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

/* Der Fuß steht im Root-Layout: Ein Datenbankfehler darf die Seite nicht brechen. */

const zustand = { fehler: true };

vi.mock('@/lib/data', async () => {
  const { echteEinstellungen } = await import('@/lib/rechtliches/test-hilfen');
  const { defaults } = await import('@/lib/data/defaults');
  return {
    getSettings: async () => {
      if (zustand.fehler) throw new Error('Datenbank nicht erreichbar');
      return echteEinstellungen();
    },
    getRubriken: async () => {
      if (zustand.fehler) throw new Error('Datenbank nicht erreichbar');
      return defaults.rubriken();
    },
  };
});

const { SiteFooter } = await import('./site-footer');
const { defaults } = await import('@/lib/data/defaults');
const { NAV_AREAS } = await import('@/lib/navigation');

describe('SiteFooter', () => {
  it('fällt bei einem Datenbankfehler auf die Standardwerte zurück', async () => {
    const fehler = vi.spyOn(console, 'error').mockImplementation(() => {});
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('SCHLÜSSELMACHER');
    expect(html).toContain('Impressum');
    // Standardwerte sind Platzhalter: keine Anschrift.
    expect(html).not.toContain('Langgasse');
    expect(fehler).toHaveBeenCalledWith(expect.stringContaining('[fuss]'), expect.any(Error));
    fehler.mockRestore();
  });

  it('zeigt mit Datenbank die gepflegten Firmendaten', async () => {
    zustand.fehler = false;
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('Langgasse 61');
  });

  it('nennt die Erreichbarkeit im Wortlaut des Inhabers und keine Öffnungszeiten (FA-23)', async () => {
    zustand.fehler = false;
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('>Erreichbarkeit<');
    expect(html).toContain('24 Stunden erreichbar');
    expect(html).toContain('Notdienst rund um die Uhr');
    expect(html).toContain('Werkstatt und persönliche Beratung nach Terminvereinbarung');
    expect(html).not.toMatch(/Öffnungszeiten|geschlossen|09:00|13:00|17:00/);
  });

  it('nennt die neuen Fahrzeugklassen und die Namen des Inhabers, nicht mehr die alten (FA-03)', async () => {
    zustand.fehler = false;
    const html = renderToStaticMarkup(await SiteFooter());
    for (const name of [
      'Roller und Kleinstfahrzeuge',
      'E-Scooter und ähnliche Elektrofahrzeuge',
      'Seniorenmobile und vergleichbare Fahrzeuge',
      'Fahrradschlüssel',
      'Elektronische Zutrittslösungen',
      'Service vor Ort nach Termin',
    ]) {
      expect(html).toContain(`>${name}<`);
    }
    expect(html).not.toContain('Elektronische Schließsysteme');
    expect(html).not.toContain('Schlüsseldienst vor Ort');
  });

  it('listet die Leistungen aus den Rubriken und behält jede Bereichsseite (G-11, nichts geht verloren)', async () => {
    zustand.fehler = false;
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('>Leistungen<');
    for (const r of defaults.rubriken().filter((x) => x.status === 'live')) expect(html).toContain(`href="${r.ziel}"`);
    for (const area of NAV_AREAS) expect(html).toContain(`href="${area.href}"`);
    for (const r of defaults.rubriken().filter((x) => x.status !== 'live')) expect(html).not.toContain(`href="${r.ziel}"`);
  });

  it('trägt Service und Termin, seit der Verweis unter „Mehr“ fehlt (FA-QA-04A)', async () => {
    zustand.fehler = false;
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html).toContain('href="/service-und-termin"');
    expect(html).toContain('href="/service-und-termin/terminstatus"');
  });
});
