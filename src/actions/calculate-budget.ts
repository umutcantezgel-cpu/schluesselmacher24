'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(prevState: unknown, formData: FormData): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const rate = 150; // Mock rate per day
  const total = scopeDays * rate;

  return {
    totalEstimate: total,
    breakdown: [`${scopeDays} Tage zu je ${rate} €`],
    tier: total > 5000 ? 'ENTERPRISE' : total > 2500 ? 'PREMIUM' : 'STANDARD',
  };
}
