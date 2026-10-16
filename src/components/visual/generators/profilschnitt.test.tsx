import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { FRAESER_ABHEBEN, PROFILSCHNITT_AUSSCHNITT, PROFILSCHNITT_GROESSE, ProfilschnittGrafik } from './profilschnitt';

function zeichne(params: unknown, title: unknown = ''): string {
  return renderToStaticMarkup(
    <ProfilschnittGrafik params={params as VisualProps['params']} title={title as VisualProps['title']} />,
  );
}

function pruefeVertrag(html: string) {
  expect(html).toMatch(/^<svg[^>]*\brole="img"/);
  expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
  expect(html).toContain('viewBox="0 0 480 360"');
  expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
  expect(html).not.toMatch(/\bid=/);
  expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
  expect(html).not.toContain('rgb(');
  expect(html).not.toContain('oklch(');
  expect(html).not.toContain('<marker');
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

const nummern = (html: string) => [...html.matchAll(/<text[^>]*text-anchor="middle"[^>]*>(\d)<\/text>/g)].map((t) => Number(t[1]));

describe('ProfilschnittGrafik', () => {
  it('zeichnet mit Standardwerten ein Profil mit sechs Einschnitten', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Schlüsselprofil mit 6 Einschnitten wird gefräst</title>');
    expect(nummern(html)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(html).toContain('Halm · 6 Einschnitte');
  });

  it('hat genau eine sich zeichnende Profilkante und einen Fräser mit Bahn', () => {
    const html = zeichne({});
    expect(html.match(/class="sm24-draw stroke-area-strong"/g)).toHaveLength(1);
    expect(html.match(/data-fraesprofil=""/g)).toHaveLength(1);
    const bahn = html.match(/data-fraesbahn="([^"]+)"/)?.[1] ?? '';
    const punkte = bahn.split(' ').map((p) => p.split(',').map(Number));
    expect(punkte.length).toBeGreaterThan(10);
    expect(punkte.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
  });

  it('übernimmt Einschnitte als Liste oder Text, begrenzt auf 4–8', () => {
    expect(nummern(zeichne({ einschnitte: [1, 2, 3, 4] }))).toEqual([1, 2, 3, 4]);
    expect(nummern(zeichne({ einschnitte: '35274163' }))).toHaveLength(8);
    expect(nummern(zeichne({ einschnitte: '123456789' }))).toHaveLength(8);
    expect(zeichne({ einschnitte: '12' })).toBe(zeichne({}));
  });

  it('leitet aus einem Code ein eigenes Profil ab', () => {
    const a = zeichne({ code: 'MS-01 4711' });
    const b = zeichne({ code: 'MS-01 4712' });
    pruefeVertrag(a);
    expect(a).not.toBe(b);
    expect(a).toBe(zeichne({ code: 'ms-01 4711' }));
  });

  it('lässt Beschriftung auf Wunsch weg', () => {
    const html = zeichne({ beschriftung: false });
    pruefeVertrag(html);
    expect(nummern(html)).toEqual([]);
    expect(html).not.toContain('Halm ·');
    expect(zeichne({ beschriftung: 'nein' })).toBe(html);
  });

  it('wirft bei Unsinn nicht und bleibt deterministisch', () => {
    for (const params of [null, 42, 'text', [], { einschnitte: {} }, { code: 7 }, { beschriftung: 'vielleicht' }]) {
      const html = zeichne(params, undefined);
      pruefeVertrag(html);
      expect(zeichne(params, undefined)).toBe(html);
    }
  });

  it('übernimmt einen eigenen Titel', () => {
    expect(zeichne({}, 'Fräsen in der Werkstatt')).toContain('<title>Fräsen in der Werkstatt</title>');
  });

  describe('Fräser in Ruhelage und Ausschnitt für kleine Breiten', () => {
    const html = zeichne({});
    const rad = html.match(/data-fraesrad="" transform="translate\(([\d.]+) ([\d.]+)\)"/);
    const ruhe = { x: Number(rad?.[1]) + FRAESER_ABHEBEN.x, y: Number(rad?.[2]) + FRAESER_ABHEBEN.y };
    /** Radius des Fräsers mit Zähnen (14 + 3,5). */
    const aussen = 17.5;

    it('hebt den Fräser in der Ruhelage ab und blendet ihn zum Start ein', () => {
      expect(html).toContain(`data-fraesabheben="${FRAESER_ABHEBEN.x},${FRAESER_ABHEBEN.y}"`);
      expect(html).toContain(`transform="translate(${FRAESER_ABHEBEN.x} ${FRAESER_ABHEBEN.y})"`);
      expect(html).toMatch(/class="sm24-fade" data-fraesbahn="/);
      expect(html.match(/data-fraesbahn=/g)).toHaveLength(1);
    });

    it('lässt den ruhenden Fräser frei von Spitze und Rohlingkante', () => {
      // Spitze: Strecke (426,168) → (456,198); Rohlingkante bei y = 168.
      const abstandSpitze = Math.abs(ruhe.x - ruhe.y - (426 - 168)) / Math.SQRT2;
      expect(abstandSpitze).toBeGreaterThan(aussen + 3.5);
      expect(168 - ruhe.y).toBeGreaterThan(aussen + 3.5);
    });

    it('fasst im Ausschnitt Nummern, Einschnitte, Spitze und Fräser', () => {
      const a = PROFILSCHNITT_AUSSCHNITT;
      const innen = (x: number, y: number) => x >= a.x && x <= a.x + a.breite && y >= a.y && y <= a.y + a.hoehe;
      const nummernX = [...html.matchAll(/<text[^>]*text-anchor="middle" x="([\d.]+)" y="122"/g)].map((t) => Number(t[1]));
      expect(nummernX).toHaveLength(6);
      expect(nummernX.every((x) => innen(x, 122))).toBe(true);
      expect(innen(456, 198)).toBe(true);
      expect(innen(ruhe.x - aussen, ruhe.y - aussen) && innen(ruhe.x + aussen, ruhe.y + aussen)).toBe(true);
      expect(a.breite).toBeLessThanOrEqual(320);
      expect(PROFILSCHNITT_GROESSE).toEqual({ breite: 480, hoehe: 360 });
    });

    it('markiert die Bemaßung, damit der Ausschnitt sie ausblenden kann', () => {
      expect(html.match(/data-bemassung=""/g)).toHaveLength(1);
      expect(html).toMatch(/data-bemassung="">[\s\S]*Halm · 6 Einschnitte/);
    });
  });
});
