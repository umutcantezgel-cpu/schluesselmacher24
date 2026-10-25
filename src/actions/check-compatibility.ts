'use server';

import { getVehicleMakes } from '@/lib/data';
import type { KeyKind } from '@/lib/types';

export interface CompatibilityCheckResult {
  makeSlug: string;
  modelSlug: string;
  year: number;
  compatibleKeyKinds: KeyKind[];
  requiresVehicleOnSite: boolean | null;
  found: boolean;
}

export async function checkCompatibility(
  prevState: unknown,
  formData: FormData
): Promise<CompatibilityCheckResult> {
  const makeSlug = formData.get('makeSlug') as string;
  const modelSlug = formData.get('modelSlug') as string;
  const yearStr = formData.get('year') as string;

  if (!makeSlug || !modelSlug || !yearStr) {
    return { makeSlug: '', modelSlug: '', year: 0, compatibleKeyKinds: [], requiresVehicleOnSite: null, found: false };
  }

  const year = parseInt(yearStr, 10);
  const makes = await getVehicleMakes();
  const make = makes.find(m => m.slug === makeSlug);

  if (!make) {
    return { makeSlug, modelSlug, year, compatibleKeyKinds: [], requiresVehicleOnSite: null, found: false };
  }

  const model = make.models.find(m => m.slug === modelSlug);

  if (!model) {
    return { makeSlug, modelSlug, year, compatibleKeyKinds: [], requiresVehicleOnSite: null, found: false };
  }

  // Basic year check (open ended if yearTo is missing)
  const isYearCompatible = year >= model.yearFrom && (!model.yearTo || year <= model.yearTo);

  if (!isYearCompatible) {
     return { makeSlug, modelSlug, year, compatibleKeyKinds: [], requiresVehicleOnSite: null, found: true };
  }

  return {
    makeSlug,
    modelSlug,
    year,
    compatibleKeyKinds: model.keyKinds,
    requiresVehicleOnSite: model.requiresVehicleOnSite,
    found: true
  };
}
