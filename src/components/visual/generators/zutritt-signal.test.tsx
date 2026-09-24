import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { ZutrittSignalGrafik } from './zutritt-signal';

function zeichne(params: unknown, title: unknown = 'Zutritt mit Transponder'): string {
  return renderToStaticMarkup(
    <ZutrittSignalGrafik
      params={params as VisualProps['params']}
      title={title as VisualProps['title']}
    />,
  );
}

function pruefeVertrag(html: string) {
  expect(html).toMatch(/^<svg[^>]*\brole="img"/);
  expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
  expect(html).toContain('viewBox="0 0 480 270"');
  expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
  expect(html).not.toMatch(/\bid=/);
  expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
  expect(html).not.toContain('rgb(');
  expect(html).not.toContain('oklch(');
  expect(html).not.toContain('<marker');
  expect(html).not.toContain('<text');
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

const MEDIEN = ['transponder', 'karte', 'smartphone'];

describe('ZutrittSignalGrafik', () => {
  it('zeichnet mit Standardwerten einen Transponder vor der Tür', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Zutritt mit Transponder</title>');
    expect(zeichne({ medium: 'transponder' })).toBe(html);
  });

  it('zeichnet jedes Medium eigenständig', () => {
    const ausgaben = MEDIEN.map((medium) => zeichne({ medium }));
    ausgaben.forEach(pruefeVertrag);
    expect(new Set(ausgaben).size).toBe(MEDIEN.length);
  });

  it('hat Funkbögen, Leser und Freigabe in fester Reihenfolge', () => {
    for (const medium of MEDIEN) {
      const html = zeichne({ medium });
      /* drei Funkbögen und die Richtungslinie laufen als Strichlinie */
      expect(html.match(/class="sm24-dash stroke-area"/g)).toHaveLength(3);
      expect(html).toContain('class="sm24-dash stroke-area-muted"');
      /* Leser und Statuspunkt erscheinen, der Haken zeichnet sich */
      expect(html.match(/class="sm24-pop/g)).toHaveLength(2);
      expect(html).toMatch(/class="sm24-draw stroke-surface" pathLength="1"/);

      const verzoegerung = (klasse: string) => {
        const treffer = html.match(new RegExp(`class="${klasse}[^"]*"[^>]*--sm24-delay:([\\d.]+)s`));
        return Number(treffer?.[1]);
      };
      expect(verzoegerung('sm24-pop')).toBeLessThan(verzoegerung('sm24-pop fill-area stroke-surface'));
      expect(verzoegerung('sm24-pop fill-area stroke-surface')).toBeLessThan(verzoegerung('sm24-draw'));
    }
  });

  it('nimmt Werte ohne Rücksicht auf Groß-/Kleinschreibung und Leerzeichen', () => {
    expect(zeichne({ medium: ' Karte ' })).toBe(zeichne({ medium: 'karte' }));
    expect(zeichne({ medium: 'SMARTPHONE' })).toBe(zeichne({ medium: 'smartphone' }));
  });

  it('wirft bei Unsinnswerten nicht und fällt auf den Transponder zurück', () => {
    const standard = zeichne({});
    const faelle: unknown[] = [
      { medium: 42 },
      { medium: {} },
      { medium: ['karte'] },
      { medium: 'schlüssel' },
      { medium: null },
      { constructor: 'karte' },
      null,
      undefined,
      'karte',
      [],
    ];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      const html = zeichne(params);
      pruefeVertrag(html);
      expect(html).toBe(standard);
    }
  });

  it('setzt einen Ersatztitel je Medium', () => {
    expect(zeichne({ medium: 'karte' }, '')).toContain(
      '<title>Karte öffnet eine Tür mit elektronischem Beschlag</title>',
    );
    expect(zeichne({}, null)).toContain(
      '<title>Transponder öffnet eine Tür mit elektronischem Beschlag</title>',
    );
    expect(zeichne({ medium: 'smartphone' }, '   ')).toContain(
      '<title>Smartphone öffnet eine Tür mit elektronischem Beschlag</title>',
    );
  });

  it('liefert für gleiche Eingaben dieselbe Grafik', () => {
    expect(zeichne({ medium: 'smartphone' })).toBe(zeichne({ medium: 'smartphone' }));
  });
});
