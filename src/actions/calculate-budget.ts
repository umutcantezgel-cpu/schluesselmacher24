'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));
  const totalEstimate = scopeDays * 150;

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalEstimate,
    breakdown: [],
    tier: 'STANDARD'
  };
}
