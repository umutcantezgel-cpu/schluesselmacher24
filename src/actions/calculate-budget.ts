'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateSecurityBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for realistic pending state
  await new Promise(resolve => setTimeout(resolve, 800));

  const accessPoints = Number(formData.get('accessPoints') || 5);
  const level = formData.get('level') as string;

  const baseCost = accessPoints * 250;
  const multiplier = level === 'premium' ? 2.5 : 1;

  const total = baseCost * multiplier;

  return {
    totalEstimate: total,
    breakdown: [
      { item: 'Materialkosten', cost: total * 0.7 },
      { item: 'Montage & Einrichtung', cost: total * 0.3 }
    ],
    tier: level === 'premium' ? 'PREMIUM' : 'STANDARD'
  };
}
