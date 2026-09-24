import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Reveal } from './reveal';

describe('Reveal', () => {
  it('umhüllt den Inhalt mit sm24-reveal ohne Verzögerung', () => {
    expect(renderToStaticMarkup(<Reveal>Inhalt</Reveal>)).toBe(
      '<div class="sm24-reveal" style="--sm24-delay:0s">Inhalt</div>',
    );
  });

  it('übernimmt Verzögerung, Dauer, Klassen und eigenen Stil', () => {
    const html = renderToStaticMarkup(
      <Reveal delay={0.25} duration={0.8} className="mt-4" style={{ opacity: 0.9 }}>
        Inhalt
      </Reveal>,
    );
    expect(html).toContain('class="sm24-reveal mt-4"');
    expect(html).toContain('opacity:0.9');
    expect(html).toContain('--sm24-delay:0.25s');
    expect(html).toContain('--sm24-duration:0.8s');
  });

  it('rendert auf Wunsch ein anderes Element, auch in SVG', () => {
    expect(renderToStaticMarkup(<Reveal as="section">x</Reveal>)).toMatch(
      /^<section class="sm24-reveal"/,
    );
    const svg = renderToStaticMarkup(
      <svg>
        <Reveal as="g" delay={1}>
          <path d="M0 0h10" />
        </Reveal>
      </svg>,
    );
    expect(svg).toContain('<g class="sm24-reveal" style="--sm24-delay:1s"><path');
  });

  it('lässt ungültige Zeiten weg statt kaputte Werte zu schreiben', () => {
    const html = renderToStaticMarkup(
      <Reveal delay={Number.NaN} duration={Number.POSITIVE_INFINITY}>
        x
      </Reveal>,
    );
    expect(html).toBe('<div class="sm24-reveal">x</div>');
    expect(renderToStaticMarkup(<Reveal delay={-2}>x</Reveal>)).toContain('--sm24-delay:0s');
  });
});
