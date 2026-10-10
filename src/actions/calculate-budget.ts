'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: unknown,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const ratePerDay = 150;
  const total = scopeDays * ratePerDay;

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Beratung & Planung', amount: total * 0.2 },
      { label: 'Material & Komponenten', amount: total * 0.4 },
      { label: 'Installation & Inbetriebnahme', amount: total * 0.4 },
    ],
    tier: total > 5000 ? 'ENTERPRISE' : total > 2000 ? 'PREMIUM' : 'STANDARD',
  };
}
