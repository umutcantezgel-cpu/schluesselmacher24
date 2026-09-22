'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;

  // Simulate network delay for real-world feel
  await new Promise(resolve => setTimeout(resolve, 500));

  const totalEstimate = scopeDays * 150;
  let tier: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM' = 'STANDARD';

  if (totalEstimate > 5000) {
    tier = 'ENTERPRISE';
  }

  return {
    totalEstimate,
    breakdown: [
      { label: 'Hardwarekosten (Zylinder & Schlüssel)', value: totalEstimate * 0.7 },
      { label: 'Planung & Dienstleistung', value: totalEstimate * 0.3 }
    ],
    tier
  };
}
