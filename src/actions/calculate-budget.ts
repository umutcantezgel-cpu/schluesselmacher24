'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  // Simulate network delay for real-world feel
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    totalEstimate,
    breakdown: [
      { item: 'Basisprüfung', cost: 150 },
      { item: 'Arbeitsaufwand', cost: totalEstimate - 150 }
    ],
    tier: totalEstimate > 5000 ? 'PREMIUM' : totalEstimate > 2000 ? 'STANDARD' : 'BASIC'
  };
}
