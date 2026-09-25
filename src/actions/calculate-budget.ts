'use server';

import type { BudgetCalculationResult } from '@/lib/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const doors = Number(formData.get('doors')) || 10;

  // Calculate based on standard metrics
  const totalEstimate = (scopeDays * 150) + (doors * 85);
  const tier = totalEstimate > 5000 ? 'ENTERPRISE' : 'STANDARD';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundsystem', value: scopeDays * 150 },
      { label: 'Schließstellen', value: doors * 85 }
    ],
    tier
  };
}
