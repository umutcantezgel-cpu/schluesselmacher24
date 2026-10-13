'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const complexity = formData.get('complexity') || 'STANDARD';

  let multiplier = 150; // default cost per day in EUR equivalent abstract value
  if (complexity === 'BASIC') multiplier = 100;
  if (complexity === 'PREMIUM') multiplier = 250;

  const total = scopeDays * multiplier;

  return {
    totalEstimate: total,
    breakdown: [
      { name: 'Hardware & Komponenten', estimate: total * 0.4 },
      { name: 'Montage & Installation', estimate: total * 0.4 },
      { name: 'Planung & Dokumentation', estimate: total * 0.2 },
    ],
    tier: complexity as 'BASIC' | 'STANDARD' | 'PREMIUM',
  };
}
