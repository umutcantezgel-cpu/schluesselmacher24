'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Consulting & Analysis', amount: totalEstimate * 0.3 },
      { label: 'Implementation', amount: totalEstimate * 0.5 },
      { label: 'Quality Assurance', amount: totalEstimate * 0.2 },
    ],
    tier: totalEstimate > 5000 ? 'PREMIUM' : totalEstimate > 2500 ? 'STANDARD' : 'BASIC',
  };
}
