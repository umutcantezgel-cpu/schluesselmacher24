'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 0;
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));

  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Tage', value: scopeDays },
      { label: 'Tagessatz', value: 150 }
    ],
    tier: scopeDays > 30 ? 'ENTERPRISE' : scopeDays > 15 ? 'PREMIUM' : 'STANDARD'
  };
}
