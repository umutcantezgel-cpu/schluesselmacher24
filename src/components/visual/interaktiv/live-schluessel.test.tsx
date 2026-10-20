import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { LiveSchluessel } from './live-schluessel';

describe('LiveSchluessel', () => {
  it('zeigt ohne Code den Rohling, passend zur Beschriftung', () => {
    const html = renderToStaticMarkup(<LiveSchluessel code="" />);
    expect(html).toContain('Profil erscheint nach Eingabe des Codes');
    expect(html).toContain('stroke-dasharray="4 3"');
    expect(html).not.toContain('class="sm24-draw stroke-area"');
  });

  it('zeigt mit Code das abgeleitete Profil und den Hinweis auf die Darstellung', () => {
    const html = renderToStaticMarkup(<LiveSchluessel code="0812" />);
    expect(html).toContain('class="sm24-draw stroke-area"');
    expect(html).toContain('Darstellung zum Code – keine echte Schließung');
    expect(html).not.toContain('sm24-ruhig');
  });
});
