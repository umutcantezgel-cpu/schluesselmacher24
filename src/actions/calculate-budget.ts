'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateSecurityBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const areaSize = Number(formData.get('areaSize') as string) || 0;
  const cameras = Number(formData.get('cameras') as string) || 0;

  const baseCost = 1500;
  const areaCost = areaSize * 25;
  const cameraCost = cameras * 450;

  const total = baseCost + areaCost + cameraCost;

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Grundsystem & Zentrale', amount: baseCost },
      { label: 'Flächenabsicherung', amount: areaCost },
      { label: 'Videoüberwachung', amount: cameraCost }
    ],
    tier: total > 10000 ? 'ENTERPRISE' : total > 5000 ? 'PREMIUM' : 'STANDARD'
  };
}
