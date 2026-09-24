import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CheckDraw } from './check-draw';

/** Verzögerungen (Sekunden) in Reihenfolge: Fläche, Kreis, Haken. */
function verzoegerungen(html: string): number[] {
  return [...html.matchAll(/--sm24-delay:([\d.]+)s/g)].map((t) => Number(t[1]));
}

describe('CheckDraw', () => {
  it('ist ein Bild mit Titel als erstem Kind', () => {
    const html = renderToStaticMarkup(<CheckDraw title="Anfrage gesendet" />);
    expect(html).toMatch(/^<svg[^>]*\brole="img"/);
    expect(html).toMatch(/^<svg[^>]*><title>Anfrage gesendet<\/title>/);
    expect(html).toContain('aria-label="Anfrage gesendet"');
    expect(html).toContain('viewBox="0 0 48 48"');
    expect(html).toContain('width="48"');
    expect(html).toContain('height="48"');
  });

  it('setzt einen Standardtitel, wenn keiner oder ein leerer kommt', () => {
    expect(renderToStaticMarkup(<CheckDraw />)).toContain('<title>Bestätigt</title>');
    expect(renderToStaticMarkup(<CheckDraw title="   " />)).toContain('<title>Bestätigt</title>');
    expect(renderToStaticMarkup(<CheckDraw title=" Gespeichert " />)).toContain(
      '<title>Gespeichert</title>',
    );
  });

  it('übernimmt die Größe und fällt bei Unsinn auf 48 zurück', () => {
    expect(renderToStaticMarkup(<CheckDraw size={96} />)).toContain('width="96"');
    for (const size of [0, -10, Number.NaN, Number.POSITIVE_INFINITY]) {
      const html = renderToStaticMarkup(<CheckDraw size={size} />);
      expect(html).toContain('width="48"');
      expect(html).toContain('height="48"');
    }
  });

  it('zeichnet erst den Kreis, dann den Haken', () => {
    const html = renderToStaticMarkup(<CheckDraw />);
    const striche = html.match(/<path class="sm24-draw[^"]*" pathLength="1"/g) ?? [];
    expect(striche).toHaveLength(2);
    expect(html.match(/stroke-dasharray:1 2/g)).toHaveLength(2);
    const [flaeche, kreis, haken] = verzoegerungen(html);
    expect(flaeche).toBeLessThanOrEqual(kreis);
    expect(kreis).toBeLessThan(haken);
  });

  it('verschiebt den ganzen Ablauf um die Verzögerung', () => {
    const ohne = verzoegerungen(renderToStaticMarkup(<CheckDraw />));
    const mit = verzoegerungen(renderToStaticMarkup(<CheckDraw delay={0.5} />));
    expect(mit.map((v, i) => Math.round((v - ohne[i]) * 1000) / 1000)).toEqual([0.5, 0.5, 0.5]);
    expect(renderToStaticMarkup(<CheckDraw delay={Number.NaN} />)).toBe(
      renderToStaticMarkup(<CheckDraw />),
    );
  });

  it('nutzt nur Tokens und keine ids', () => {
    const html = renderToStaticMarkup(<CheckDraw className="mx-auto" />);
    expect(html).toContain('class="shrink-0 mx-auto"');
    expect(html).not.toMatch(/\bid=/);
    expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
    expect(html).not.toMatch(/rgb\(|hsl\(|oklch\(/);
  });
});
