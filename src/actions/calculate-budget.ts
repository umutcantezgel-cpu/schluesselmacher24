'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));

  if (isNaN(scopeDays) || scopeDays < 5) {
    return {
      totalEstimate: 0,
      breakdown: [],
      tier: 'STANDARD'
    };
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    totalEstimate: scopeDays * 150,
    breakdown: [
      { label: 'Basisinstallation', amount: scopeDays * 100 },
      { label: 'Konfiguration & Test', amount: scopeDays * 50 }
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
