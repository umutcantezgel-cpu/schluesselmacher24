import { vorschaubild } from '@/lib/og/bereichsbild';

export const alt = 'SCHLÜSSELMACHER24 · Autoschlüssel, Schließtechnik und Sicherheitstechnik';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Vorschaubild der Startseite und aller Seiten ohne eigenes Bild; Titel wie der Standardtitel in `layout.tsx`. */
export default function Image() {
  return vorschaubild({ augenbraue: 'SCHLÜSSELMACHER24', titel: 'Autoschlüssel, Schließtechnik und Sicherheitstechnik' });
}
