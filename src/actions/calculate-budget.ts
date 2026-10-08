'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 5;
  const baseRate = 150;
  const total = scopeDays * baseRate;

  return {
    totalEstimate: total,
    breakdown: [
      { name: 'Hardware & Komponenten', amount: total * 0.6 },
      { name: 'Montage & Einrichtung', amount: total * 0.3 },
      { name: 'Dokumentation & Einweisung', amount: total * 0.1 }
    ],
    tier: total > 2000 ? 'PREMIUM' : 'STANDARD'
  };
}
