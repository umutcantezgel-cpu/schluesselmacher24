'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const rate = 150; // Daily rate estimate

  return {
    totalEstimate: scopeDays * rate,
    breakdown: [
      { label: 'Planung', value: scopeDays * rate * 0.2 },
      { label: 'Umsetzung', value: scopeDays * rate * 0.8 }
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
