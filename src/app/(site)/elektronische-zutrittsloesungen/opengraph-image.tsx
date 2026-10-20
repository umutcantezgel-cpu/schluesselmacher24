import { bereichsInhalt, vorschaubild } from '@/lib/og/bereichsbild';

export const alt = 'SCHLÜSSELMACHER24 · Elektronische Zutrittslösungen';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return vorschaubild(bereichsInhalt('elektronische-zutrittsloesungen'));
}
