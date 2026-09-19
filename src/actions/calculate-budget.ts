'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  let tier: BudgetCalculationResult['tier'] = 'STANDARD';
  if (totalEstimate > 5000) {
    tier = 'PREMIUM';
  }
  if (totalEstimate > 8000) {
    tier = 'ENTERPRISE';
  }

  return {
    totalEstimate,
    breakdown: [
      { item: 'Basispauschale', cost: 150 },
      { item: `Tagesaufwand (${scopeDays} Tage)`, cost: scopeDays * 150 }
    ],
    tier,
  };
}
