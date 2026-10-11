'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const ratePerDay = 150;

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const totalEstimate = scopeDays * ratePerDay;
  const tier = totalEstimate > 5000 ? 'ENTERPRISE' : totalEstimate > 2000 ? 'PRO' : 'STANDARD';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Basisaufwand', amount: totalEstimate * 0.7 },
      { label: 'Material & Fahrt', amount: totalEstimate * 0.3 }
    ],
    tier
  };
}
