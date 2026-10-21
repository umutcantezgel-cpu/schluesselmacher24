'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) / 10 || 15;
  const totalEstimate = scopeDays * 150;

  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate calculation

  return {
    totalEstimate,
    breakdown: [{ label: 'Technik', cost: totalEstimate * 0.6 }, { label: 'Installation', cost: totalEstimate * 0.4 }],
    tier: totalEstimate > 5000 ? 'PREMIUM' : 'STANDARD'
  };
}
