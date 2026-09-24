'use server';

import type { RoiCalculationResult } from '@/types/roi';

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors')) || 10;
  const totalSavings = doors * 250;

  let tier: RoiCalculationResult['tier'] = 'STANDARD';
  if (totalSavings > 10000) {
    tier = 'PREMIUM';
  }
  if (totalSavings > 25000) {
    tier = 'ENTERPRISE';
  }

  return {
    totalSavings,
    breakdown: [
      { item: 'Verwaltungseinsparung pro Jahr', cost: doors * 100 },
      { item: `Wartungseinsparung (${doors} Türen)`, cost: doors * 150 }
    ],
    tier,
  };
}
