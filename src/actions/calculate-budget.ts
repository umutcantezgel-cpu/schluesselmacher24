'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (scopeDays > 45) {
    tier = 'ENTERPRISE';
  } else if (scopeDays > 20) {
    tier = 'PREMIUM';
  }

  return {
    totalEstimate: scopeDays * 150,
    breakdown: [
      `${scopeDays} Tage Dienstleistung`,
      'Basis-Materialien',
      'Anfahrt und Logistik'
    ],
    tier
  };
}
