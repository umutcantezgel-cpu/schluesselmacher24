'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const baseRate = 150;
  const total = scopeDays * baseRate;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (total > 5000) tier = 'PREMIUM';
  if (total > 15000) tier = 'ENTERPRISE';

  return {
    totalEstimate: total,
    breakdown: [
      `Basispaket: ${scopeDays} Tage zu je ${baseRate}€`,
      `Hardware-Pauschale: ${(total * 0.2).toFixed(2)}€ (geschätzt)`
    ],
    tier,
  };
}
