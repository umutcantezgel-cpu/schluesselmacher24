'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const rate = 150;
  const totalEstimate = scopeDays * rate;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalEstimate,
    breakdown: [
      { item: 'Planung & Analyse', cost: totalEstimate * 0.2 },
      { item: 'Umsetzung', cost: totalEstimate * 0.8 },
    ],
    tier: totalEstimate > 5000 ? 'ENTERPRISE' : totalEstimate > 2000 ? 'PREMIUM' : 'STANDARD'
  };
}
