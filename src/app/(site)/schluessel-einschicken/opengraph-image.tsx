import { vorschaubild } from '@/lib/og/bereichsbild';

export const alt = 'SCHLÜSSELMACHER24 · Schlüssel einschicken';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return vorschaubild({
    augenbraue: 'SCHLÜSSELMACHER24',
    titel: 'Schlüssel einschicken',
    text: 'Nur nach Freigabe oder auf unsere Bitte.',
    bereich: 'schluessel-nach-vorlage',
  });
}
