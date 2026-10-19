'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundleistung', amount: totalEstimate * 0.7 },
      { label: 'Material & Programmierung', amount: totalEstimate * 0.3 }
    ],
    tier: totalEstimate > 5000 ? 'COMPLEX' : totalEstimate > 2500 ? 'PREMIUM' : 'STANDARD'
  };
}
