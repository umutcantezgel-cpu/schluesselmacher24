'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150; // Simple base logic

  let tier: 'STANDARD' | 'PREMIUM' | 'HIGH_END' = 'STANDARD';
  if (scopeDays > 40) tier = 'HIGH_END';
  else if (scopeDays > 20) tier = 'PREMIUM';

  return {
    totalEstimate,
    breakdown: [
      { category: 'Base Install', cost: totalEstimate * 0.5 },
      { category: 'Hardware', cost: totalEstimate * 0.3 },
      { category: 'Commissioning', cost: totalEstimate * 0.2 },
    ],
    tier,
  };
}
