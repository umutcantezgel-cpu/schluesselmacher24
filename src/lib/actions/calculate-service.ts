'use server';

export type CalculationTier = 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: CalculationTier;
}

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for realistic interaction
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const tier = (formData.get('tier') as CalculationTier) || 'STANDARD';

  let dailyRate = 150;
  if (tier === 'PREMIUM') dailyRate = 250;
  if (tier === 'ENTERPRISE') dailyRate = 400;

  const totalEstimate = scopeDays * dailyRate;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Beratung & Konzeption', amount: totalEstimate * 0.2 },
      { label: 'Umsetzung & Montage', amount: totalEstimate * 0.6 },
      { label: 'Qualitätssicherung & Abnahme', amount: totalEstimate * 0.2 },
    ],
    tier,
  };
}
