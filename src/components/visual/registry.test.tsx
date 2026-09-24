import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualRef } from '@/lib/types';

import { CodeFundstelleGrafik } from './generators/code-fundstelle';
import { SchliessplanGrafik } from './generators/schliessplan';
import { SchluesselGrafik } from './generators/schluessel';
import { ZutrittSignalGrafik } from './generators/zutritt-signal';
import { ZylinderMassGrafik } from './generators/zylinder-mass';
import { getVisual, renderVisual, visualNames } from './registry';

const NAMEN = ['schluessel', 'zylinder-mass', 'schliessplan', 'code-fundstelle', 'zutritt-signal'];

const GENERATOR_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'generators');

/** Generator-Dateien ohne gemeinsame Helfer und Tests, als Namen ohne Endung. */
function generatorDateien(): string[] {
  return fs
    .readdirSync(GENERATOR_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.includes('.test.') && f !== 'grafik-basis.tsx')
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort();
}

/** Parameter, wie sie aus fehlerhaften Inhalten kommen können. */
const UNSINN: unknown[] = [
  {},
  null,
  undefined,
  'text',
  42,
  [],
  [1, 2, 3],
  {
    typ: 42,
    medium: {},
    ort: ['x'],
    system: null,
    bauform: 'rakete',
    aussen: Number.NaN,
    innen: Number.POSITIVE_INFINITY,
    tueren: -3,
    gruppen: 'viele',
    einschnitte: 'abc',
    code: 'x'.repeat(5000),
    anzahl: 1e9,
    knaufseite: true,
  },
  { constructor: 'x', __proto__: { typ: 'klapp' } },
];

function zeichne(generator: string, params: unknown, title = 'Probe', className?: string) {
  const element = renderVisual(
    { generator, params: params as VisualRef['params'] },
    title,
    className,
  );
  return element ? renderToStaticMarkup(element) : null;
}

describe('Registry', () => {
  it('kennt genau die fünf Generatoren, sortiert', () => {
    const namen = visualNames();
    expect(namen).toEqual([...NAMEN].sort());
    expect(namen).toEqual([...namen].sort());
  });

  it('führt jede Generator-Datei unter ihrem Dateinamen', () => {
    expect(visualNames()).toEqual(generatorDateien());
  });

  it('ordnet jedem Namen die Komponente der gleichnamigen Datei zu', () => {
    expect(getVisual('schluessel')).toBe(SchluesselGrafik);
    expect(getVisual('zylinder-mass')).toBe(ZylinderMassGrafik);
    expect(getVisual('schliessplan')).toBe(SchliessplanGrafik);
    expect(getVisual('code-fundstelle')).toBe(CodeFundstelleGrafik);
    expect(getVisual('zutritt-signal')).toBe(ZutrittSignalGrafik);
  });

  it('liefert für unbekannte Namen nichts — auch nicht aus dem Prototyp', () => {
    for (const name of ['unbekannt', '', 'Schluessel', 'constructor', '__proto__', 'toString']) {
      expect(getVisual(name)).toBeUndefined();
      expect(renderVisual({ generator: name }, 'Probe')).toBeNull();
    }
  });

  it('liefert für unvollständige Verweise nichts', () => {
    for (const ref of [null, undefined, {}, { generator: 42 }, { generator: null }]) {
      expect(renderVisual(ref as unknown as VisualRef, 'Probe')).toBeNull();
    }
  });

  describe.each(NAMEN)('%s', (name) => {
    it('rendert ohne Parameter mit Rolle und Titel', () => {
      const element = renderVisual({ generator: name }, 'Probe', 'absolute inset-0');
      expect(element).not.toBeNull();
      const html = renderToStaticMarkup(element!);
      expect(html).toMatch(/^<svg[^>]*\brole="img"/);
      expect(html).toMatch(/^<svg[^>]*><title>Probe<\/title>/);
      expect(html).toContain('absolute inset-0');
      expect(html).not.toMatch(/\bid=/);
      expect(html).not.toMatch(/NaN|Infinity|undefined/);
    });

    it('rendert mit Unsinns-Parametern ohne Fehler', () => {
      for (const params of UNSINN) {
        let html: string | null = null;
        expect(() => {
          html = zeichne(name, params);
        }).not.toThrow();
        expect(html).toMatch(/^<svg[^>]*\brole="img"/);
        expect(html).toMatch(/^<svg[^>]*><title>Probe<\/title>/);
        expect(html).not.toMatch(/NaN|Infinity|undefined/);
      }
    });

    it('setzt bei leerem Titel einen Ersatztitel', () => {
      const html = zeichne(name, {}, '');
      expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
    });

    it('zeichnet gleiche Eingaben gleich', () => {
      expect(zeichne(name, { typ: 'funk', medium: 'karte' })).toBe(
        zeichne(name, { typ: 'funk', medium: 'karte' }),
      );
    });
  });
});
