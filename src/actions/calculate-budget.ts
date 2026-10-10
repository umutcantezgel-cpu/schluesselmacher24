'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const tier = (formData.get('tier') as 'STANDARD' | 'PREMIUM') || 'STANDARD';

  const dailyRate = tier === 'STANDARD' ? 150 : 250;
  const totalEstimate = scopeDays * dailyRate;

  // Simulate network delay for realistic pending state
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundleistung', amount: totalEstimate * 0.7 },
      { label: 'Material (geschätzt)', amount: totalEstimate * 0.3 }
    ],
    tier,
  };
}
