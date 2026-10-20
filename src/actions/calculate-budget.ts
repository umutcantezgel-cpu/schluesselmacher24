'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 0;
  // Let's assume a day rate of 150 (example from prompt)
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundleistung', value: totalEstimate }
    ],
    tier: 'STANDARD'
  };
}
