'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const complexity = String(formData.get('complexity')) || 'STANDARD';

  let baseRate = 150;
  if (complexity === 'BASIC') baseRate = 120;
  if (complexity === 'PREMIUM') baseRate = 200;

  const totalEstimate = scopeDays * baseRate;

  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate,
    breakdown: [
      { label: 'Anfahrt & Logistik', amount: 150 },
      { label: 'Materialpauschale', amount: totalEstimate * 0.2 },
      { label: 'Arbeitsleistung', amount: totalEstimate * 0.8 },
    ],
    tier: complexity as 'BASIC' | 'STANDARD' | 'PREMIUM',
  };
}
