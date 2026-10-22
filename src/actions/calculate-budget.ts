'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for real-world feeling
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays') || 15);
  const totalEstimate = scopeDays * 150;

  let tier: BudgetCalculationResult['tier'] = 'STANDARD';
  if (scopeDays > 40) tier = 'ENTERPRISE';
  else if (scopeDays > 20) tier = 'PREMIUM';

  return {
    totalEstimate,
    breakdown: [
      { item: 'Basis-Beratung', cost: totalEstimate * 0.1 },
      { item: 'Projekt-Implementierung', cost: totalEstimate * 0.7 },
      { item: 'Qualitätssicherung', cost: totalEstimate * 0.2 },
    ],
    tier,
  };
}
