'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const rate = 150;
  const total = scopeDays * rate;

  // Simulate network delay for realistic pending state
  await new Promise((resolve) => setTimeout(resolve, 800));

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (total > 5000) tier = 'PREMIUM';
  if (total > 10000) tier = 'ENTERPRISE';

  return {
    totalEstimate: total,
    breakdown: [
      { item: 'Basis-Sicherheitspaket', cost: total * 0.4 },
      { item: 'Montage & Integration', cost: total * 0.4 },
      { item: 'Dokumentation & Einweisung', cost: total * 0.2 },
    ],
    tier,
  };
}
