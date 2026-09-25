'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const doors = Number(formData.get('doors')) || 10;

  const basePrice = scopeDays * 150;
  const doorPrice = doors * 80;

  const total = basePrice + doorPrice;

  let tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE' = 'BASIC';
  if (total > 5000) tier = 'STANDARD';
  if (total > 15000) tier = 'ENTERPRISE';

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Projektplanung & Setup', cost: basePrice },
      { label: 'Hardware & Installation', cost: doorPrice }
    ],
    tier
  };
}
