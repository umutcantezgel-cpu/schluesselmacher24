'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Tage', value: scopeDays },
      { label: 'Tagessatz', value: 150 },
    ],
    tier: totalEstimate > 5000 ? 'PREMIUM' : totalEstimate > 2000 ? 'STANDARD' : 'BASIC',
  };
}
