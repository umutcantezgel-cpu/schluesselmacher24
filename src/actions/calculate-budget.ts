'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: unknown,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const rate = 150;
  const total = scopeDays * rate;

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Consulting', amount: total * 0.2 },
      { label: 'Implementation', amount: total * 0.8 }
    ],
    tier: total > 5000 ? 'ENTERPRISE' : total > 2500 ? 'PREMIUM' : 'STANDARD'
  };
}
