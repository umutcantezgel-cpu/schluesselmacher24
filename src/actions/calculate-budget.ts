'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData,
): Promise<BudgetCalculationResult> {
  const scopeDays = formData.get('scopeDays');
  const total = scopeDays ? Number(scopeDays) * 150 : prevState.totalEstimate;
  return {
    totalEstimate: total,
    breakdown: ['Grundpauschale', 'Tagesaufwand'],
    tier: total > 5000 ? 'PREMIUM' : 'STANDARD',
  };
}
