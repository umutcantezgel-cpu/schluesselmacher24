import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Alert } from './alert';

describe('Alert', () => {
  it('ist ohne Angabe ein ruhiger Hinweis', () => {
    const html = renderToStaticMarkup(<Alert title="Hinweis">Text</Alert>);
    expect(html).toMatch(/^<div[^>]*role="note"/);
    expect(html).toContain('<p class="mb-1 font-bold">Hinweis</p>');
  });

  it('übernimmt die Rolle für Fehler und Rückmeldungen', () => {
    expect(renderToStaticMarkup(<Alert role="alert" tone="warning">Fehler</Alert>)).toMatch(/^<div[^>]*role="alert"/);
    expect(renderToStaticMarkup(<Alert role="status" tone="success">Gespeichert</Alert>)).toMatch(/^<div[^>]*role="status"/);
  });

  it('zeigt je Ton ein dekoratives Glyph', () => {
    for (const tone of ['info', 'success', 'warning', 'danger', 'legal'] as const) {
      expect(renderToStaticMarkup(<Alert tone={tone}>x</Alert>)).toContain('aria-hidden="true"');
    }
  });
});
