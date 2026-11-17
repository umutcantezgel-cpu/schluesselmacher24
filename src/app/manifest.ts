import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { MetadataRoute } from 'next';

import { oklchZuHex } from '@/lib/visual/area-theme';

/** Farbwert eines Tokens aus globals.css (eine Quelle für Seite und Manifest): der erste Treffer ab `ab`. */
function token(css: string, name: string, ab = ':root'): string {
  const start = css.indexOf(ab);
  if (start < 0) throw new Error(`Block ${ab} fehlt in globals.css`);
  const treffer = new RegExp(`--${name}:\\s*([^;]+);`).exec(css.slice(start));
  if (!treffer) throw new Error(`Token --${name} fehlt in globals.css`);
  return oklchZuHex(treffer[1].trim());
}

/** Web-App-Manifest: Name, Farben aus den Design-Tokens (Hintergrund hell, Browserleiste wie die Kopfzeile), Symbole aus `src/app/` (feste Adressen, ohne Kennung der Routengruppe). */
export default function manifest(): MetadataRoute.Manifest {
  const css = readFileSync(join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
  const hintergrund = token(css, 'background');
  /* Farbe der Browserleiste: die Kopfzeile steht auf der Bühne (A-074), wie `viewport.themeColor` im Layout. */
  const kopfzeile = token(css, 'background', '.buehne {');
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
    theme_color: kopfzeile,
    icons: [
      { src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
