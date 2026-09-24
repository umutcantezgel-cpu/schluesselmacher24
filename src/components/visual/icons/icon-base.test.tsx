import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { IconBase } from './icon-base';

describe('IconBase', () => {
  it('ist ohne Titel dekorativ', () => {
    const html = renderToStaticMarkup(<IconBase><path d="M4 4h40" /></IconBase>);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('viewBox="0 0 48 48"');
    expect(html).not.toContain('<title>');
  });

  it('wird mit Titel als Bild angesagt', () => {
    const html = renderToStaticMarkup(<IconBase title="Schlüssel"><path d="M4 4h40" /></IconBase>);
    expect(html).toContain('role="img"');
    expect(html).toContain('<title>Schlüssel</title>');
  });
});
