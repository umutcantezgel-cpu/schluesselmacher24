'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  _prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = parseInt((formData.get('scopeDays') as string) || '15', 10);
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Beratung', cost: totalEstimate * 0.2 },
      { label: 'Installation', cost: totalEstimate * 0.5 },
      { label: 'Hardware', cost: totalEstimate * 0.3 }
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
