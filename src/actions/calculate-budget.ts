'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));

  if (isNaN(scopeDays) || scopeDays < 5) {
    return { ...prevState, tier: 'STANDARD' };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (scopeDays > 15) tier = 'PREMIUM';
  if (scopeDays > 30) tier = 'ENTERPRISE';

  const dailyRate = 150;
  const totalEstimate = scopeDays * dailyRate;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundkonzeption', amount: 300 },
      { label: 'Installation', amount: totalEstimate - 300 },
    ],
    tier,
  };
}
