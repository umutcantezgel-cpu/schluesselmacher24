'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeMinutes = Number(formData.get('scopeDays')) || 60;
  const newTotal = scopeDays * 2.5;

  return {
    totalEstimate: newTotal,
    breakdown: [],
    tier: 'STANDARD',
  };
}
