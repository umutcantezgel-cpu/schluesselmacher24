'use server';

export type Tier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: Tier;
}

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for realistic interaction
  await new Promise((resolve) => setTimeout(resolve, 600));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const tier = (formData.get('tier') as Tier) || 'STANDARD';

  let dailyRate = 150;
  if (tier === 'BASIC') dailyRate = 100;
  if (tier === 'PREMIUM') dailyRate = 250;

  const totalEstimate = scopeDays * dailyRate;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Beratung & Planung', cost: totalEstimate * 0.2 },
      { label: 'Hardware & Lizenzen', cost: totalEstimate * 0.5 },
      { label: 'Installation & Inbetriebnahme', cost: totalEstimate * 0.3 },
    ],
    tier,
  };
}
