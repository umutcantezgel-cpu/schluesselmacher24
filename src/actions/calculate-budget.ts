'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const projectType = formData.get('projectType')?.toString() || 'residential';

  // Base daily rate
  let dailyRate = 150;

  if (projectType === 'commercial') {
    dailyRate = 220;
  } else if (projectType === 'enterprise') {
    dailyRate = 350;
  }

  const totalEstimate = scopeDays * dailyRate;

  // Fake delay for realistic feeling
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    totalEstimate,
    breakdown: [
      { label: 'Arbeitszeit', amount: totalEstimate * 0.7 },
      { label: 'Material & Technik', amount: totalEstimate * 0.3 }
    ],
    tier: projectType.toUpperCase()
  };
}
