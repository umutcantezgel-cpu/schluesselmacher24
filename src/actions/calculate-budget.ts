'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const dailyRate = 150; // Just a sample rate

  // Simulate network delay for real-world feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    totalEstimate: scopeDays * dailyRate,
    breakdown: [
      { label: 'Projektumfang', value: `${scopeDays} Tage` },
      { label: 'Tagessatz', value: `${dailyRate} €` },
    ],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
