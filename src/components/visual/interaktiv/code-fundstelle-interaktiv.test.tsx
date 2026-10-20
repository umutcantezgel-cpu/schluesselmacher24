import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CodeFundstelleInteraktiv } from './code-fundstelle-interaktiv';

const FLAECHE = 'rounded-lg bg-area-soft/40 p-4 sm:p-6 lg:max-w-lg';

describe('CodeFundstelleInteraktiv', () => {
  it('zeigt drei Registerkarten als Segmentleiste, die erste ist gewählt', () => {
    const html = renderToStaticMarkup(<CodeFundstelleInteraktiv />);
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html).toContain('>Am Schlüsselkopf</button>');
    expect(html).toContain('role="tabpanel"');
    expect(html).not.toContain('rounded-full');
  });

  it('setzt die Zeichenfläche ohne Kartenrahmen auf den Bereichston', () => {
    const html = renderToStaticMarkup(<CodeFundstelleInteraktiv />);
    expect(html).toContain(`class="${FLAECHE}"`);
    expect(html).not.toContain('border border-border bg-surface p-4');
  });
});
