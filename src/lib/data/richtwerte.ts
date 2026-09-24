import 'server-only';

import { cache } from 'react';

import type { Richtwerte } from '@/payload-types';
import type { RechnerRichtwerte } from '@/lib/richtwerte/typen';
import { PLATZHALTER_RICHTWERTE, richtwerteAusPayload } from '@/lib/richtwerte/uebersetzung';
import { payloadInstanz } from './payload-adapter';

/**
 * Richtwerte der Orientierungsrechner, je Anfrage einmal gelesen.
 *
 * Das Global ist nur für das Team lesbar; die Seite liest es deshalb mit
 * `overrideAccess` und gibt nur die aufbereiteten Spannen weiter. Ohne
 * Datenbank (`SM24_DATA=json`) oder bei leerem Global gilt die
 * Platzhalter-Struktur — die Rechner nennen dann keine Beträge.
 */
export const getRichtwerte = cache(async (): Promise<RechnerRichtwerte> => {
  if (process.env.SM24_DATA === 'json') return PLATZHALTER_RICHTWERTE;
  const payload = await payloadInstanz();
  const doc = (await payload.findGlobal({ slug: 'richtwerte', depth: 0, overrideAccess: true })) as Richtwerte;
  return richtwerteAusPayload(doc);
});
