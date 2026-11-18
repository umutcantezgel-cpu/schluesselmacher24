import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('Web-App-Manifest', () => {
  it('nennt Name, Sprache, Symbole und die Hintergrundfarbe aus den Design-Tokens', () => {
    const m = manifest();
    expect(m.short_name).toBe('SCHLÜSSELMACHER24');
    expect(m.lang).toBe('de');
    // --background: 0.9882 0.0028 255 (globals.css, OKLCH; vorher HSL 214 45% 98.6%)
    expect(m.background_color).toBe('#fafbfd');
    expect(m.theme_color).toBe(m.background_color);
    expect(m.icons?.map((icon) => icon.src)).toEqual(['/favicon.ico', '/icon.svg', '/apple-icon']);
  });
});
