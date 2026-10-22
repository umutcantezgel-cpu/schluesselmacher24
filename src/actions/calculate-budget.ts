'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const ratePerDay = 150; // Base rate

  // Calculate tier based on days
  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (scopeDays > 45) {
    tier = 'ENTERPRISE';
  } else if (scopeDays > 20) {
    tier = 'PREMIUM';
  }

  return {
    totalEstimate: scopeDays * ratePerDay,
    breakdown: [
      { label: 'Hardware', cost: scopeDays * 50 },
      { label: 'Installation', cost: scopeDays * 100 }
    ],
    tier
  };
}
