'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(prevState: unknown, formData: FormData): Promise<BudgetCalculationResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  return {
    totalEstimate: scopeDays * 150,
    breakdown: [],
    tier: 'STANDARD'
  };
}
