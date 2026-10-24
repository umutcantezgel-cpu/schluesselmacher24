'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  _prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Analyse & Planung', cost: scopeDays * 30 },
      { label: 'Implementierung', cost: scopeDays * 90 },
      { label: 'Wartung & Support', cost: scopeDays * 30 },
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD',
  };
}
