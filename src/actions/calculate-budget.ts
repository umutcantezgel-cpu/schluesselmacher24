'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const baseRate = 150;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const totalEstimate = scopeDays * baseRate;

  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'STANDARD';
  if (totalEstimate < 2000) tier = 'BASIC';
  if (totalEstimate > 5000) tier = 'PREMIUM';

  return {
    totalEstimate,
    tier,
    breakdown: [
      { item: 'Basis-Analyse & Projektierung', cost: totalEstimate * 0.2 },
      { item: 'Material & Fertigung (Schätzung)', cost: totalEstimate * 0.5 },
      { item: 'Installation & Inbetriebnahme', cost: totalEstimate * 0.3 },
    ],
  };
}
