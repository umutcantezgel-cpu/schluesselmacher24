import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('Web-App-Manifest', () => {
  it('nennt Name, Sprache, Symbole und die Hintergrundfarbe aus den Design-Tokens', () => {
    const m = manifest();
    expect(m.short_name).toBe('SCHLÜSSELMACHER24');
    expect(m.lang).toBe('de');
    // --background: 214 45% 98.6% (globals.css)
    expect(m.background_color).toBeTruthy();
    expect(m.theme_color).toBeTruthy();
    expect(m.icons?.map((icon) => icon.src)).toEqual(['/favicon.ico', '/icon.svg', '/apple-icon']);
  });
});
