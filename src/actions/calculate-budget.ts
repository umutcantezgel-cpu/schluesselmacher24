'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const tier = (formData.get('tier') as 'STANDARD' | 'PREMIUM' | 'ENTERPRISE') || 'STANDARD';

  const dailyRate = tier === 'STANDARD' ? 150 : tier === 'PREMIUM' ? 250 : 400;

  const totalEstimate = scopeDays * dailyRate;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Tage', value: scopeDays },
      { label: 'Tagessatz', value: dailyRate },
    ],
    tier,
  };
}
