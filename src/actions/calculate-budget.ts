'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeSize')) / 10;

  if (isNaN(scopeDays)) {
    return prevState;
  }

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    totalEstimate: scopeDays * 150,
    breakdown: [
      { label: 'Material', value: scopeDays * 50 },
      { label: 'Arbeitszeit', value: scopeDays * 100 }
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
