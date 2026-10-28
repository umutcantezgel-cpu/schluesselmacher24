'use server';

import type { SecurityBudgetResult } from '@/types/security-budget';

export async function calculateSecurityBudget(
  prevState: SecurityBudgetResult,
  formData: FormData
): Promise<SecurityBudgetResult> {
  const areaSquareMeters = Number(formData.get('areaSquareMeters')) || 150;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const totalEstimate = areaSquareMeters * 250;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (areaSquareMeters > 500) {
      tier = 'ENTERPRISE';
  } else if (areaSquareMeters > 200) {
      tier = 'PREMIUM';
  }

  return {
    totalEstimate,
    tier,
    breakdown: [
      { label: 'Hardware', cost: totalEstimate * 0.6 },
      { label: 'Installation', cost: totalEstimate * 0.3 },
      { label: 'Konfiguration', cost: totalEstimate * 0.1 },
    ],
  };
}
