import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DrawOn } from './draw-on';

function zeichne(knoten: ReactNode): string {
  return renderToStaticMarkup(<svg>{knoten}</svg>);
}

/** Verzögerungen (Sekunden) aller Elemente in Reihenfolge. */
function verzoegerungen(html: string): number[] {
  return [...html.matchAll(/--sm24-delay:([\d.]+)s/g)].map((t) => Number(t[1]));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DrawOn', () => {
  it('lässt Linien nacheinander zeichnen', () => {
    const html = zeichne(
      <DrawOn delay={0.2} stagger={0.15} duration={0.9} className="stroke-area" strokeWidth={2}>
        <path d="M0 0H10" />
        <line x1={0} y1={0} x2={10} y2={10} />
        <circle cx={5} cy={5} r={4} />
      </DrawOn>,
    );
    expect(html).toMatch(/^<svg><g class="stroke-area" stroke-width="2">/);
    expect(html.match(/class="sm24-draw"/g)).toHaveLength(3);
    expect(html.match(/pathLength="1"/g)).toHaveLength(3);
    expect(html.match(/--sm24-duration:0.9s/g)).toHaveLength(3);
    expect(verzoegerungen(html)).toEqual([0.2, 0.35, 0.5]);
  });

  it('verhindert den Punkt am Pfadende im Wartezustand', () => {
    const html = zeichne(
      <DrawOn>
        <path d="M0 0H10" />
      </DrawOn>,
    );
    expect(html).toContain('stroke-dasharray:1 2');
  });

  it('behält Klassen und Stil der Kinder und setzt pathLength immer auf 1', () => {
    const html = zeichne(
      <DrawOn>
        <path className="stroke-area-strong" style={{ opacity: 0.5 }} pathLength={100} d="M0 0H10" />
      </DrawOn>,
    );
    expect(html).toContain('class="sm24-draw stroke-area-strong"');
    expect(html).toContain('opacity:0.5');
    expect(html).toContain('pathLength="1"');
    expect(html).not.toContain('pathLength="100"');
  });

  it('löst Fragmente auf und vergibt eindeutige Schlüssel', () => {
    const fehler = vi.spyOn(console, 'error').mockImplementation(() => {});
    const html = zeichne(
      <DrawOn stagger={0.1}>
        <path d="M0 0H10" />
        <>
          <path d="M0 2H10" />
          <path d="M0 4H10" />
        </>
        {[<path key="a" d="M0 6H10" />]}
      </DrawOn>,
    );
    expect(html.match(/class="sm24-draw"/g)).toHaveLength(4);
    expect(verzoegerungen(html)).toEqual([0, 0.1, 0.2, 0.3]);
    expect(fehler).not.toHaveBeenCalled();
  });

  it('blendet Gruppen und Texte ein, statt sie zu zeichnen, und verwirft losen Text', () => {
    const html = zeichne(
      <DrawOn stagger={0.2}>
        <path d="M0 0H10" />
        {'loser Text'}
        <g>
          <path d="M0 2H10" />
        </g>
        <text x={0} y={10}>
          A
        </text>
        {null}
        {false}
      </DrawOn>,
    );
    expect(html).not.toContain('loser Text');
    expect(html).toContain('<g class="sm24-reveal" style="--sm24-delay:0.2s"><path d="M0 2H10"></path></g>');
    expect(html).toContain('<text x="0" y="10" class="sm24-reveal" style="--sm24-delay:0.4s">A</text>');
    expect(verzoegerungen(html)).toEqual([0, 0.2, 0.4]);
  });

  it('bleibt bei ungültigen Zeiten ruhig', () => {
    const html = zeichne(
      <DrawOn delay={Number.NaN} stagger={-1}>
        <path d="M0 0H10" />
        <path d="M0 2H10" />
      </DrawOn>,
    );
    expect(html).not.toMatch(/NaN|Infinity/);
    expect(html).not.toContain('--sm24-delay');
    const negativ = zeichne(
      <DrawOn delay={0.3} stagger={-1}>
        <path d="M0 0H10" />
        <path d="M0 2H10" />
      </DrawOn>,
    );
    expect(verzoegerungen(negativ)).toEqual([0.3, 0.3]);
  });
});
