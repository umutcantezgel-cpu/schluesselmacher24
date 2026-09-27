'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 0;
  return {
    totalEstimate: scopeDays * 150,
    breakdown: [],
    tier: 'STANDARD',
  };
}
