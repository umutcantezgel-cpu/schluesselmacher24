'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150; // simple calculation

  return {
    totalEstimate,
    breakdown: [
      { label: 'Beratung', amount: totalEstimate * 0.2 },
      { label: 'Installation', amount: totalEstimate * 0.6 },
      { label: 'Wartung', amount: totalEstimate * 0.2 },
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD',
  };
}
