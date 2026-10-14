'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for the form action
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDaysStr = formData.get('scopeDays');
  const scopeDays = scopeDaysStr ? Number(scopeDaysStr) : 15;
  const rate = 150;

  const totalEstimate = scopeDays * rate;

  let tier: BudgetCalculationResult['tier'] = 'STANDARD';
  if (totalEstimate > 5000) {
    tier = 'ENTERPRISE';
  } else if (totalEstimate < 1500) {
    tier = 'BASIC';
  }

  return {
    totalEstimate,
    breakdown: [
      { name: 'Arbeitszeit', amount: totalEstimate * 0.7 },
      { name: 'Materialkosten', amount: totalEstimate * 0.3 }
    ],
    tier,
  };
}
