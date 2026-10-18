import Link from 'next/link';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('zeigt ohne Grafik das Fach-Icon des Bereichs groß rechts', () => {
    const html = renderToStaticMarkup(<PageHeader title="Autoschlüssel" eyebrow="Bereich" bereich="autoschluessel" />);
    expect(html).toContain('width="112"');
    expect(html).toContain('<h1');
  });

  it('setzt mit Grafik Kopf, Grafik und Aktionen in dieser Reihenfolge; das Icon bleibt klein', () => {
    const html = renderToStaticMarkup(
      <PageHeader
        title="Schlüssel nach Vorlage"
        eyebrow="Geführte Anfrage"
        bereich="schluessel-nach-vorlage"
        visual={<figure data-test="grafik" />}
        actions={<Link href="/x">Starten</Link>}
      >
        <dl data-test="schriftfeld" />
      </PageHeader>,
    );
    expect(html).toContain('width="40"');
    expect(html).not.toContain('width="112"');
    const h1 = html.indexOf('<h1');
    const grafik = html.indexOf('data-test="grafik"');
    const aktion = html.indexOf('href="/x"');
    const feld = html.indexOf('data-test="schriftfeld"');
    expect(h1).toBeGreaterThan(-1);
    expect(grafik).toBeGreaterThan(h1);
    expect(aktion).toBeGreaterThan(grafik);
    expect(feld).toBeGreaterThan(aktion);
    expect(html).toContain('lg:row-span-2');
    // Die Grafik wartet auf das Sichtbarwerden nach dem Hydrieren (E7-L-38).
    expect(html).toMatch(/<div[^>]*data-motion="wait"[^>]*>(?:(?!<\/div>).)*data-test="grafik"/);
  });

  it('zeigt in der Arbeitsansicht kein Fach-Icon und keine Profillinie', () => {
    const html = renderToStaticMarkup(<PageHeader title="Kasse" art="arbeit" bereich="autoschluessel" />);
    expect(html).not.toContain('width="112"');
    expect(html).not.toContain('width="40"');
    expect(html).toContain('text-headline');
  });

  it('gibt Zusatzklassen nur an die Einleitung weiter', () => {
    const html = renderToStaticMarkup(<PageHeader title="Kasse" lead="Einleitung" art="arbeit" leadClassName="korb-leer:hidden" />);
    expect(html).toMatch(/<p class="[^"]*korb-leer:hidden[^"]*">Einleitung<\/p>/);
    expect(renderToStaticMarkup(<PageHeader title="Kasse" lead="Einleitung" art="arbeit" />)).not.toContain('korb-leer');
  });
});
