'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { item: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDaysStr = formData.get('scopeDays') as string;
  const scopeDays = scopeDaysStr ? parseInt(scopeDaysStr, 10) : 15;

  const dailyRate = 150;
  const total = scopeDays * dailyRate;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (total > 5000) tier = 'ENTERPRISE';
  else if (total > 2500) tier = 'PREMIUM';

  return {
    totalEstimate: total,
    breakdown: [
      { item: 'Basisinstallation', cost: total * 0.4 },
      { item: 'Hardware', cost: total * 0.4 },
      { item: 'Wartung', cost: total * 0.2 },
    ],
    tier,
  };
}
