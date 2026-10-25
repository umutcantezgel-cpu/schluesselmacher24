import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { MetadataRoute } from 'next';

/** HSL-Tripel aus den Design-Tokens („214 45% 98.6%“) als Hex-Farbe für das Manifest. */
function hslZuHex(tripel: string): string {
  const [h, s, l] = tripel.replace(/%/g, '').split(/\s+/).map(Number);
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const kanal = (n: number) => {
    const k = (n + h / 30) % 12;
    const wert = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(wert * 255).toString(16).padStart(2, '0');
  };
  return `#${kanal(0)}${kanal(8)}${kanal(4)}`;
}

/** Farbwert eines Tokens aus `:root` in globals.css (eine Quelle für Seite und Manifest). */
function token(css: string, name: string): string {
  const treffer = new RegExp(`--${name}:\\s*([^;]+);`).exec(css);
  if (!treffer) throw new Error(`Token --${name} fehlt in globals.css`);
  return hslZuHex(treffer[1].trim());
}

/** Web-App-Manifest: Name, Farben aus den Design-Tokens, Symbole aus `src/app/` (feste Adressen, ohne Kennung der Routengruppe). */
export default function manifest(): MetadataRoute.Manifest {
  const css = readFileSync(join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
  const hintergrund = token(css, 'background');
  return {
    name: 'SCHLÜSSELMACHER24 – Autoschlüssel, Schließtechnik und Sicherheitstechnik',
    short_name: 'SCHLÜSSELMACHER24',
    description:
      'Autoschlüssel nachmachen und programmieren, Schlüssel nach Code und Vorlage, gleichschließende Zylinder, '
      + 'Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik.',
    lang: 'de',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: hintergrund,
    theme_color: hintergrund,
    icons: [
      { src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
