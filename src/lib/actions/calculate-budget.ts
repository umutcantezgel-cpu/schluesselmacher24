'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));

  if (isNaN(scopeDays)) {
    return prevState;
  }

  // Simulate complex logic & DB hit with delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    totalEstimate: scopeDays * 150,
    breakdown: [
      { name: 'Material', cost: scopeDays * 50 },
      { name: 'Arbeitszeit', cost: scopeDays * 100 }
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
