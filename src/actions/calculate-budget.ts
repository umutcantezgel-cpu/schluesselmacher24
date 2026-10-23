'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simuliere Ladezeit
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150; // 150 EUR/Tag

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (totalEstimate > 5000) {
    tier = 'PREMIUM';
  }
  if (totalEstimate > 10000) {
    tier = 'ENTERPRISE';
  }

  return {
    totalEstimate,
    breakdown: [
      {
        description: `Kalkulation für ${scopeDays} Tage Sicherheitsberatung & -montage`,
        amount: totalEstimate,
      },
    ],
    tier,
  };
}
