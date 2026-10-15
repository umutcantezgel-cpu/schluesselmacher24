'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (scopeDays > 10) tier = 'PREMIUM';
  if (scopeDays > 30) tier = 'ENTERPRISE';

  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      `Projektumfang: ${scopeDays} Tage`,
      `Geschätzte Kosten: ${totalEstimate.toLocaleString('de-DE')} €`,
      `Service Level: ${tier}`
    ],
    tier,
  };
}
