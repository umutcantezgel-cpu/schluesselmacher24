'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateVehicleKeyBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const keyType = formData.get('keyType') as string;
  const programmingNeeded = formData.get('programmingNeeded') === 'on';

  let baseCost = 0;
  if (keyType === 'smart') baseCost = 250;
  else if (keyType === 'transponder') baseCost = 150;
  else baseCost = 50;

  const programmingCost = programmingNeeded ? 80 : 0;
  const totalEstimate = baseCost + programmingCost;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Schlüsselrohling & Fräsen', amount: baseCost },
      { label: 'Programmierung (Wegfahrsperre/Funk)', amount: programmingCost }
    ].filter(item => item.amount > 0),
    tier: totalEstimate > 200 ? 'PREMIUM' : 'STANDARD'
  };
}
