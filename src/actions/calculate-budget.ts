'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const complexity = String(formData.get('complexity')) || 'STANDARD';

  let multiplier = 150;
  if (complexity === 'BASIC') multiplier = 100;
  if (complexity === 'PREMIUM') multiplier = 250;

  const baseCost = scopeDays * multiplier;
  const setupCost = 500;

  return {
    totalEstimate: baseCost + setupCost,
    breakdown: [
      { label: 'Projektumfang', cost: baseCost },
      { label: 'Einrichtung', cost: setupCost }
    ],
    tier: complexity as 'BASIC' | 'STANDARD' | 'PREMIUM',
  };
}
