import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  aussenTangenten,
  auswahl,
  hash,
  kurztext,
  parameter,
  pfeilspitze,
  titel,
  wert,
  zahl,
  zahlenfolge,
  ziffern,
} from './grafik-basis';

describe('Parameterleser', () => {
  it('macht aus jeder Eingabe ein Objekt', () => {
    expect(parameter(null)).toEqual({});
    expect(parameter([1, 2])).toEqual({});
    expect(parameter('x')).toEqual({});
    expect(parameter({ a: 1 })).toEqual({ a: 1 });
  });

  it('liest nur eigene Schlüssel', () => {
    expect(wert({}, 'constructor')).toBeUndefined();
    expect(wert({ typ: 'klapp' }, 'typ')).toBe('klapp');
  });

  it('wählt nur erlaubte Werte', () => {
    const erlaubt = ['a', 'b'] as const;
    expect(auswahl(' B ', erlaubt, 'a')).toBe('b');
    expect(auswahl('c', erlaubt, 'a')).toBe('a');
    expect(auswahl(42, erlaubt, 'a')).toBe('a');
  });

  it('begrenzt Zahlen und nimmt Text mit Komma', () => {
    expect(zahl(-5, 25, 100, 30)).toBe(25);
    expect(zahl(500, 25, 100, 30)).toBe(100);
    expect(zahl('32,5', 25, 100, 30)).toBe(32.5);
    expect(zahl('abc', 25, 100, 30)).toBe(30);
    expect(zahl(Number.NaN, 25, 100, 30)).toBe(30);
    expect(zahl({}, 25, 100, 30)).toBe(30);
    expect(zahl(2.6, 1, 3, 1, true)).toBe(3);
  });

  it('liest Ziffernfolgen aus Arrays und Texten', () => {
    expect(ziffern([1, '2', 12, -3, 'x', 4.4], 4, 8)).toEqual([1, 2, 9, 0, 4]);
    expect(ziffern('3-5-2-7', 4, 8)).toEqual([3, 5, 2, 7]);
    expect(ziffern([1, 2, 3], 4, 8)).toBeUndefined();
    expect(ziffern([1, 2, 3, 4, 5, 6, 7, 8, 9], 4, 8)).toHaveLength(8);
    expect(ziffern({}, 4, 8)).toBeUndefined();
  });

  it('liest kurze Texte und Titel', () => {
    expect(kurztext('  AB 12 ')).toBe('AB 12');
    expect(kurztext(4711)).toBe('4711');
    expect(kurztext('')).toBeUndefined();
    expect(kurztext({})).toBeUndefined();
    expect(titel('', 'Ersatz')).toBe('Ersatz');
    expect(titel(undefined, 'Ersatz')).toBe('Ersatz');
    expect(titel(' Schlüssel ', 'Ersatz')).toBe('Schlüssel');
  });
});

describe('Rechenhilfen', () => {
  it('hasht deterministisch', () => {
    expect(hash('AB123')).toBe(hash('AB123'));
    expect(hash('AB123')).not.toBe(hash('AB124'));
  });

  it('liefert eine wiederholbare Zahlenfolge in [0, 1)', () => {
    const a = zahlenfolge(42);
    const b = zahlenfolge(42);
    for (let i = 0; i < 20; i += 1) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('zeichnet Pfeilspitzen als geschlossenen Pfad', () => {
    expect(pfeilspitze(10, 10, 0)).toBe('M10 10L2 13L2 7Z');
  });

  it('findet äußere Tangenten oder keine', () => {
    expect(aussenTangenten({ x: 0, y: 0, r: 10 }, { x: 100, y: 0, r: 30 })).toHaveLength(2);
    expect(aussenTangenten({ x: 0, y: 0, r: 50 }, { x: 5, y: 0, r: 10 })).toEqual([]);
  });

  it('erzeugt typsichere Bewegungsvariablen', () => {
    expect(motionStyle(0.25, 1)).toEqual({ '--sm24-delay': '0.25s', '--sm24-duration': '1s' });
    expect(motionStyle(Number.NaN)).toEqual({});
    expect(motionStyle(-1)).toEqual({ '--sm24-delay': '0s' });
  });
});

describe('GrafikRahmen', () => {
  it('setzt Rolle, Titel als erstes Kind und feste viewBox', () => {
    const html = renderToStaticMarkup(
      <GrafikRahmen breite={480} hoehe={270} title="Probe">
        <path d="M0 0h10" />
      </GrafikRahmen>,
    );
    expect(html).toMatch(/^<svg[^>]*role="img"[^>]*><title>Probe<\/title><path/);
    expect(html).toContain('viewBox="0 0 480 270"');
    expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
  });
});
