import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Seitenwechsel, bereichsName } from './seitenwechsel';

describe('Seitenwechsel', () => {
  it('bildet je Bereich einen eigenen, stabilen Namen', () => {
    expect(bereichsName('autoschluessel')).toBe('bereich-autoschluessel');
    expect(bereichsName('schliessanlagen')).not.toBe(bereichsName('autoschluessel'));
  });

  it('rendert das Kind unverändert, auch ohne ViewTransition', () => {
    const html = renderToStaticMarkup(
      <Seitenwechsel name="bereich-autoschluessel">
        <svg data-test="icon" />
      </Seitenwechsel>,
    );
    expect(html).toBe('<svg data-test="icon"></svg>');
  });
});
