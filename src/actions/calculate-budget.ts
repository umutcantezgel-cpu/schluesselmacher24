'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const tierStr = formData.get('tier') as string || 'STANDARD';

  const tier = (['STANDARD', 'PREMIUM', 'ENTERPRISE'].includes(tierStr))
    ? tierStr as 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'
    : 'STANDARD';

  const multiplier = tier === 'PREMIUM' ? 250 : tier === 'ENTERPRISE' ? 400 : 150;

  return {
    totalEstimate: scopeDays * multiplier,
    breakdown: [`${scopeDays} Tage Scope`, `${multiplier}€ Tagessatz`],
    tier
  };
}
