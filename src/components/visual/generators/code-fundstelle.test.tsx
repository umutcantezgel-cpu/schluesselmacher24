import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { CodeFundstelleGrafik } from './code-fundstelle';

function zeichne(params: unknown, title: unknown = 'Fundstelle der Schlüsselnummer'): string {
  return renderToStaticMarkup(
    <CodeFundstelleGrafik
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
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

const ORTE = ['schluesselkopf', 'sicherungskarte', 'zylinderstirn'];

describe('CodeFundstelleGrafik', () => {
  it('zeichnet mit Standardwerten die Fundstelle am Schlüsselkopf', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Fundstelle der Schlüsselnummer</title>');
    expect(zeichne({ ort: 'schluesselkopf' })).toBe(html);
  });

  it('zeichnet jeden Ort eigenständig mit Markierung und Lupe', () => {
    const ausgaben = ORTE.map((ort) => zeichne({ ort }));
    for (const html of ausgaben) {
      pruefeVertrag(html);
      expect(html).toContain('sm24-pop');
      expect(html).toContain('stroke-dasharray="5 5"');
      expect((html.match(/class="sm24-draw stroke-area"/g) ?? []).length).toBe(2);
    }
    expect(new Set(ausgaben).size).toBe(ORTE.length);
  });

  it('zeigt keine Ziffern, sondern nur Platzhalter-Striche', () => {
    for (const ort of ORTE) {
      const html = zeichne({ ort });
      expect(html).not.toContain('<text');
      expect(html).toMatch(/class="sm24-draw stroke-foreground-muted" pathLength="1"/);
    }
  });

  it('wirft bei Unsinnswerten nicht', () => {
    const faelle: unknown[] = [{ ort: 42 }, { ort: {} }, { ort: 'dach' }, { ort: ['karte'] }, null, undefined, 7];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      pruefeVertrag(zeichne(params));
    }
  });

  it('setzt einen Ersatztitel je Ort und bleibt deterministisch', () => {
    expect(zeichne({ ort: 'zylinderstirn' }, '')).toContain(
      '<title>Schlüsselnummer auf der Stirnseite des Zylinders</title>',
    );
    expect(zeichne({ ort: 'sicherungskarte' })).toBe(zeichne({ ort: ' Sicherungskarte ' }));
  });
});
