'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: unknown,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDaysStr = formData.get('scopeDays');
  const scopeDays = scopeDaysStr ? Number(scopeDaysStr) : 15;
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [`${scopeDays} Tage Arbeitsaufwand`],
    tier: totalEstimate > 5000 ? 'PREMIUM' : 'STANDARD'
  };
}
