import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('Web-App-Manifest', () => {
  it('nennt Name, Sprache, Symbole und die Farben aus den Design-Tokens', () => {
    const m = manifest();
    expect(m.short_name).toBe('SCHLÜSSELMACHER24');
    expect(m.lang).toBe('de');
    // --background: 0.9882 0.0028 255 (globals.css, OKLCH; vorher HSL 214 45% 98.6%)
    expect(m.background_color).toBe('#fafbfd');
    // Browserleiste wie die Kopfzeile: --background der Bühne (0.2 0.055 264, A-074), dieselbe Farbe wie
    // `viewport.themeColor` im Layout. Der Hintergrund der Seite bleibt hell.
    expect(m.theme_color).toBe('#09142f');
    expect(readFileSync('src/app/(site)/layout.tsx', 'utf8')).toContain(`themeColor: '${m.theme_color}'`);
    expect(m.icons?.map((icon) => icon.src)).toEqual(['/favicon.ico', '/icon.svg', '/apple-icon']);
  });
});
