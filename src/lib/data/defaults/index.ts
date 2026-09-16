import type { BusinessRecord } from '@/lib/types';
import type { CollectionName, Collections } from '../adapter';

import { settings } from './settings';
import { carKeyServices, pricingGroups, pricingRules } from './pricing';
import { vehicleMakes } from './vehicles';
import { codeLines } from './code-lines';
import { cylinderCatalog } from './cylinders';
import { servicePages } from './service-pages';
import { cities, guides, pages } from './content';
import { blockedDays } from './schedule';

function records(): BusinessRecord[] {
  return [];
}

/**
 * Standardinhalt je Sammlung. Greift, solange unter `content/` noch keine
 * gepflegte Datei liegt — so ist eine frische Umgebung sofort vollständig.
 */
export const defaults: { [K in CollectionName]: () => Collections[K] } = {
  settings,
  pricingGroups,
  pricingRules,
  carKeyServices,
  vehicleMakes,
  codeLines,
  cylinderCatalog,
  servicePages,
  pages,
  guides,
  cities,
  blockedDays,
  records,
};

export { codeLineFamilies } from './code-lines';
