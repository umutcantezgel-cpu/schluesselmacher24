'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  _prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const baseRate = 150;
  const total = scopeDays * baseRate;

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Tage', value: scopeDays },
      { label: 'Tagessatz', value: baseRate }
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
