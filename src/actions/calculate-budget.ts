'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const baseRate = 150;
  const total = scopeDays * baseRate;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (total > 5000) tier = 'ENTERPRISE';
  else if (total > 2500) tier = 'PREMIUM';

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Grundinstallation', amount: total * 0.4 },
      { label: 'Komponenten', amount: total * 0.5 },
      { label: 'Inbetriebnahme', amount: total * 0.1 },
    ],
    tier,
  };
}
