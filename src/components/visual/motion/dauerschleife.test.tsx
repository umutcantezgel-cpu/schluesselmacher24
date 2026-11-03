import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PauseKnopf, schleifeLaeuft } from './dauerschleife';

describe('schleifeLaeuft', () => {
  const basis = { bewegung: 'an' as const, pausiert: false, sichtbar: true, tabSichtbar: true };

  it('läuft nur mit Bewegung, ohne Pause, im Bild und im sichtbaren Tab', () => {
    expect(schleifeLaeuft(basis)).toBe(true);
    expect(schleifeLaeuft({ ...basis, bewegung: 'ruhig' })).toBe(false);
    expect(schleifeLaeuft({ ...basis, pausiert: true })).toBe(false);
    expect(schleifeLaeuft({ ...basis, sichtbar: false })).toBe(false);
    expect(schleifeLaeuft({ ...basis, tabSichtbar: false })).toBe(false);
  });
});

describe('PauseKnopf', () => {
  it('ist ein beschrifteter Knopf mit Tippziel 44 px', () => {
    const html = renderToStaticMarkup(<PauseKnopf pausiert={false} onUmschalten={() => {}} bewegung="an" was="Schließplan" />);
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Schließplan anhalten"');
    expect(html).toContain('min-h-touch');
    expect(html).toContain('min-w-touch');
  });

  it('wechselt die Beschriftung, wenn die Schleife angehalten ist', () => {
    const html = renderToStaticMarkup(<PauseKnopf pausiert onUmschalten={() => {}} bewegung="an" />);
    expect(html).toContain('aria-label="Bewegung fortsetzen"');
  });

  it('entfällt bei ruhiger Darstellung, weil dann nichts läuft', () => {
    expect(renderToStaticMarkup(<PauseKnopf pausiert={false} onUmschalten={() => {}} bewegung="ruhig" />)).toBe('');
  });
});
