'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const ratePerDay = 150;
  const total = scopeDays * ratePerDay;

  // Simulate network delay for real-world feel
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Hardware', amount: total * 0.4 },
      { label: 'Installation', amount: total * 0.4 },
      { label: 'Configuration & Testing', amount: total * 0.2 },
    ],
    tier: total > 5000 ? 'ENTERPRISE' : total > 2000 ? 'PREMIUM' : 'STANDARD'
  };
}
