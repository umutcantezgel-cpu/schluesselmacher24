'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays') as string) || 15;
  const baseRate = 150;
  const total = scopeDays * baseRate;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Beratung', amount: total * 0.1 },
      { label: 'Material', amount: total * 0.5 },
      { label: 'Installation', amount: total * 0.4 }
    ],
    tier: total < 3000 ? 'STANDARD' : total < 6000 ? 'PREMIUM' : 'ENTERPRISE'
  };
}
