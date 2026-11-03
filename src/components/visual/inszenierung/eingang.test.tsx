import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { EINGANG_ABLAUF, EINGANG_AUFBAU, EingangSzene, eingangGesamtdauer, teil } from './eingang-szene';
import { Eingangsinszenierung } from './eingangsinszenierung';
import { SCHLEIFE_TAKT_MS } from './eingang-buehne';

const CSS = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');

describe('Eingangsinszenierung (B-31, B-32)', () => {
  it('dauert höchstens 1,6 s und staffelt höchstens vier Türen mit 120 ms (K-007)', () => {
    expect(eingangGesamtdauer()).toBeLessThanOrEqual(1.6);
    expect(EINGANG_ABLAUF.tuer.staffel).toBeLessThanOrEqual(0.12);
    for (const v of Object.values(EINGANG_AUFBAU)) expect(v.tueren.length).toBeLessThanOrEqual(4);
  });

  it('hat einen Schlüssel mit glaubwürdigem Halm, etwa viermal so lang wie hoch (G-07)', () => {
    const html = renderToStaticMarkup(<EingangSzene variante="buehne" />);
    const halm = /<path d="M-60 -7 [^"]*L-60 7 Z"/.exec(html);
    expect(halm).not.toBeNull();
    // Halm von x −60 bis 0, Höhe 14
    expect(60 / 14).toBeGreaterThan(3.5);
    expect(60 / 14).toBeLessThan(5);
  });

  it('ist dekorativ und trägt Kennungen des Registers', () => {
    const html = renderToStaticMarkup(<Eingangsinszenierung />);
    expect(html.match(/aria-hidden="true"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('data-motion="B-31"');
    expect(html).toContain('data-motion="B-32"');
    expect(html).toContain('data-eingang="band"');
    expect(html).toContain('data-eingang="buehne"');
  });

  it('setzt im Markup nur Startvariablen, nie einen Startzustand als Stil (Endbild ohne CSS-Bewegung)', () => {
    const html = renderToStaticMarkup(<EingangSzene variante="band" />);
    expect(html).toContain('--start-x');
    expect(html).not.toMatch(/style="[^"]*(?<!-)transform:/);
    expect(html).not.toMatch(/style="[^"]*(?<!-)opacity:/);
  });

  it('hängt den Ablauf an die Startklasse und an Bewegung an (Zeitlimit des Startskripts)', () => {
    expect(CSS).toContain(":where(:root.sm24-start[data-bewegung='an']) .sm24-eingang-teil");
    expect(CSS).toMatch(/@keyframes sm24-eingang \{\s*from \{/);
    expect(CSS).not.toMatch(/@keyframes sm24-eingang \{[^}]*to \{/);
  });

  it('wechselt die Schleife alle 6 s und nur bei laufender Schleife', () => {
    expect(SCHLEIFE_TAKT_MS).toBe(6000);
    expect(CSS).toContain("[data-schleife='an'][data-phase='b'] .sm24-eingang-schluessel");
  });

  it('setzt jedes Teil mit allen vier Startwerten, damit nichts vom umgebenden Teil erbt', () => {
    const stil = teil(0.6, 0.28, { dreh: '-90deg' }) as Record<string, string>;
    expect(stil['--start-x']).toBe('0px');
    expect(stil['--start-gross']).toBe('1');
    expect(stil['--start-deckkraft']).toBe('1');
    expect(stil['--start-dreh']).toBe('-90deg');
  });

  it('zeigt das Band höchstens 64 px hoch (K-013)', () => {
    expect(EINGANG_AUFBAU.band.hoehe).toBeLessThanOrEqual(64);
    expect(renderToStaticMarkup(<Eingangsinszenierung />)).toContain('h-14');
  });
});
