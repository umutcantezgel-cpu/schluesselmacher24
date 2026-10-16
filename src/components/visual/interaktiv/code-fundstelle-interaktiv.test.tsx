import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CodeFundstelleInteraktiv } from './code-fundstelle-interaktiv';

const KARTE = 'rounded-lg border border-border bg-surface p-4 sm:p-6';

describe('CodeFundstelleInteraktiv', () => {
  it('zeigt drei Registerkarten, die erste ist gewählt', () => {
    const html = renderToStaticMarkup(<CodeFundstelleInteraktiv />);
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html).toContain('>Am Schlüsselkopf</button>');
    expect(html).toContain('role="tabpanel"');
  });

  it('setzt die Zeichenfläche als Karte auf Papier', () => {
    const html = renderToStaticMarkup(<CodeFundstelleInteraktiv />);
    expect(html).toContain(`class="${KARTE}"`);
  });
});
