import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BewegungSchalter } from './bewegung-schalter';

describe('BewegungSchalter', () => {
  const html = renderToStaticMarkup(<BewegungSchalter />);

  it('ist ein Umschaltknopf mit beiden Angaben, die CSS nach html[data-bewegung] wählt', () => {
    expect(html).toMatch(/^<button type="button" aria-pressed="false"/);
    expect(html).toContain('sm24-bewegung-schalter');
    expect(html).toContain('<span class="sm24-wenn-an">an</span>');
    expect(html).toContain('<span class="sm24-wenn-ruhig">ruhig</span>');
    expect(html).toContain('min-h-touch');
  });

  it('globals.css blendet die passende Angabe ein und den Schalter ohne JavaScript aus', () => {
    const css = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
    expect(css).toMatch(/:root:not\(\[data-bewegung\]\) \.sm24-bewegung-schalter \{\s*display: none;/);
    expect(css).toMatch(/:root:not\(\[data-bewegung='an'\]\) \.sm24-wenn-an,\s*:root\[data-bewegung='an'\] \.sm24-wenn-ruhig \{\s*display: none;/);
  });
});

describe('Bewegung in globals.css', () => {
  const css = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');

  it('hängt alle Bewegung an html[data-bewegung] statt nur an die Systemeinstellung', () => {
    expect(css).not.toMatch(/prefers-reduced-motion/);
    expect(css).toContain(":where(:root[data-bewegung='an']) .sm24-draw");
    expect(css).toContain(":where(:root:not([data-bewegung='an'])) *");
  });

  it('pausiert Einstiege an data-zustand, data-motion bleibt die Registerkennung', () => {
    expect(css).toContain("[data-zustand='wait'] :is(");
    expect(css).not.toMatch(/\[data-motion='wait'\]/);
  });
});

describe('Tailwind-Varianten der Bewegung', () => {
  it('nutzt ruhig: und bewegt: statt motion-reduce: und motion-safe: (die folgen nur der Systemeinstellung)', async () => {
    const { readdirSync, statSync } = await import('node:fs');
    const funde: string[] = [];
    const durchsuchen = (ordner: string) => {
      for (const name of readdirSync(ordner)) {
        const pfad = path.join(ordner, name);
        if (statSync(pfad).isDirectory()) durchsuchen(pfad);
        else if (/\.(tsx?|css)$/.test(name) && !name.includes('.test.')) {
          if (/\bmotion-(reduce|safe):/.test(readFileSync(pfad, 'utf8'))) funde.push(pfad);
        }
      }
    };
    durchsuchen(path.join(process.cwd(), 'src'));
    expect(funde).toEqual([]);
  });
});
