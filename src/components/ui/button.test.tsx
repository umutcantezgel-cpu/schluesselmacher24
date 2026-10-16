import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Button } from './button';

const klassen = (html: string) => /class="([^"]*)"/.exec(html)?.[1].split(' ') ?? [];

describe('Button', () => {
  it('zeigt gesperrt eine ruhige Fläche statt eines blassen Hauptknopfs', () => {
    const k = klassen(renderToStaticMarkup(<Button disabled>Weiter</Button>));
    expect(k).toContain('bg-surface-muted');
    expect(k).toContain('text-foreground-muted');
    expect(k).not.toContain('bg-primary');
    expect(k).toContain('disabled:opacity-100');
  });

  it('behält beim Laden die Farbe, zeigt den Spinner und ist gesperrt', () => {
    const html = renderToStaticMarkup(<Button loading>Bestellen</Button>);
    const k = klassen(html);
    expect(k).toContain('bg-primary');
    expect(k).toContain('disabled:cursor-wait');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('animate-spin');
  });

  it('bleibt ohne Sperre unverändert', () => {
    const k = klassen(renderToStaticMarkup(<Button variant="outline">Zurück</Button>));
    expect(k).toContain('border-border-strong');
    expect(k).not.toContain('bg-surface-muted');
  });
});
